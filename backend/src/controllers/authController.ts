import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';
import { PasswordValidator } from '../utils/passwordPolicy';
import logger from '../utils/logger';

const generateToken = (userId: number, email: string, role: UserRole): string => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
};

const generateMfaTempToken = (userId: number, email: string): string => {
  return jwt.sign(
    { id: userId, email, mfaPending: true },
    process.env.JWT_SECRET!,
    { expiresIn: '10m' } // Short-lived temp token for MFA verification
  );
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    gender,
    address,
    city
  } = req.body;

  // Validate password policy
  const passwordValidation = PasswordValidator.validate(password);
  if (!passwordValidation.isValid) {
    throw new AppError(
      `Password does not meet policy requirements: ${passwordValidation.errors.join(', ')}`,
      400
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    role: UserRole.PATIENT,
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    gender,
    address,
    city,
    country: 'Indonesia',
    passwordChangedAt: new Date()
  });

  // Generate token
  const token = generateToken(user.id, user.email, user.role);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user
  const user = await User.findOne({ where: { email } });
  
  // User not found or password incorrect
  if (!user) {
    logger.warn(`Failed login attempt for non-existent user: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is locked
  if (user.isLocked) {
    const lockTimeRemaining = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 60000);
    logger.warn(`Login attempt on locked account: ${email}`);
    throw new AppError(
      `Account is locked due to too many failed login attempts. Please try again in ${lockTimeRemaining} minutes.`,
      403
    );
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 401);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await user.incrementLoginAttempts();
    logger.warn(`Failed login attempt for user: ${email}. Attempts: ${user.loginAttempts}`);
    
    if (user.isLocked) {
      throw new AppError(
        'Too many failed login attempts. Account has been locked for 30 minutes.',
        403
      );
    }
    
    throw new AppError('Invalid email or password', 401);
  }

  // Reset login attempts on successful password verification
  await user.resetLoginAttempts();

  // Check if MFA is enabled for this user
  if (user.isMfaEnabled) {
    // Generate temporary token for MFA verification
    const tempToken = generateMfaTempToken(user.id, user.email);
    
    logger.info(`MFA required for user: ${email}`);
    
    return res.json({
      success: true,
      mfaRequired: true,
      message: 'Please provide your MFA token to complete login',
      tempToken // Use this token to call /auth/verify-mfa
    });
  }
  
  // No MFA required - proceed with normal login
  logger.info(`Successful login for user: ${email}`);

  // Generate full access token
  const token = generateToken(user.id, user.email, user.role);

  res.json({
    success: true,
    mfaRequired: false,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        isMfaEnabled: user.isMfaEnabled
      },
      token
    }
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: { user }
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const allowedFields = [
    'firstName',
    'lastName',
    'phoneNumber',
    'dateOfBirth',
    'gender',
    'address',
    'city',
    'country'
  ];

  const updates: any = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.update(updates);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    }
  });
});

/**
 * @desc    Verify MFA token and complete login
 * @route   POST /api/v1/auth/verify-mfa
 * @access  Public (requires tempToken)
 */
export const verifyMfaLogin = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, mfaToken } = req.body;

  if (!tempToken || !mfaToken) {
    throw new AppError('Temporary token and MFA token are required', 400);
  }

  // Verify temp token
  let decoded: any;
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET!);
  } catch (error) {
    throw new AppError('Invalid or expired temporary token', 401);
  }

  if (!decoded.mfaPending) {
    throw new AppError('Invalid token type', 401);
  }

  // Find user
  const user = await User.findByPk(decoded.id);
  if (!user || !user.isMfaEnabled || !user.mfaSecret) {
    throw new AppError('MFA not enabled for this account', 400);
  }

  // Verify MFA token
  const speakeasy = require('speakeasy');
  const { decrypt } = require('../utils/encryption');
  
  const decryptedSecret = decrypt(user.mfaSecret);
  
  const isValid = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token: mfaToken,
    window: 1
  });

  if (!isValid) {
    logger.warn(`Failed MFA verification for user: ${user.email}`);
    throw new AppError('Invalid MFA token', 401);
  }

  // MFA verified - generate full access token
  const token = generateToken(user.id, user.email, user.role);
  
  logger.info(`Successful MFA login for user: ${user.email}`);

  res.json({
    success: true,
    message: 'MFA verification successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        isMfaEnabled: user.isMfaEnabled
      },
      token
    }
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Validate new password policy
  const passwordValidation = PasswordValidator.validate(newPassword);
  if (!passwordValidation.isValid) {
    throw new AppError(
      `Password does not meet policy requirements: ${passwordValidation.errors.join(', ')}`,
      400
    );
  }

  // Check password history
  if (user.passwordHistory && user.passwordHistory.length > 0) {
    const isReused = await PasswordValidator.checkPasswordHistory(
      user.id,
      newPassword,
      user.passwordHistory
    );
    
    if (!isReused) {
      throw new AppError(
        'You cannot reuse any of your last 5 passwords. Please choose a different password.',
        400
      );
    }
  }

  // Store current password in history before updating
  await user.addPasswordToHistory(user.password);

  // Update password
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  logger.info(`Password changed successfully for user: ${user.email}`);

  res.json({
    success: true,
    message: 'Password updated successfully. Please login with your new password.'
  });
});
