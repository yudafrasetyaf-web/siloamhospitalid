import { Response } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import User from '../models/User';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';
import { encrypt, decrypt } from '../utils/encryption';
import logger from '../utils/logger';

const APP_NAME = 'SiloamHospitalSystem';

/**
 * @desc    Generate MFA setup secret and QR code
 * @route   POST /api/v1/mfa/setup
 * @access  Private
 */
export const setupMfa = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isMfaEnabled) {
    throw new AppError('MFA is already enabled for this account.', 400);
  }

  // Generate a new MFA secret
  const secret = speakeasy.generateSecret({ name: `${APP_NAME} (${user.email})` });

  // Encrypt and store the secret temporarily
  user.mfaSecret = encrypt(secret.base32);
  await user.save();

  // Generate QR code for the authenticator app
  qrcode.toDataURL(secret.otpauth_url!, (err, data_url) => {
    if (err) {
      logger.error('Failed to generate QR code:', err);
      return next(new AppError('Could not generate QR code for MFA setup.', 500));
    }

    res.json({
      success: true,
      message: 'MFA setup initiated. Scan the QR code with your authenticator app and verify.',
      data: {
        qrCodeUrl: data_url,
        manualSetupKey: secret.base32
      }
    });
  });
});

/**
 * @desc    Verify TOTP token and enable MFA
 * @route   POST /api/v1/mfa/verify
 * @access  Private
 */
export const verifyMfa = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  const user = await User.findByPk(req.user!.id);

  if (!user || !user.mfaSecret) {
    throw new AppError('MFA setup not initiated or user not found.', 400);
  }

  const decryptedSecret = decrypt(user.mfaSecret);

  const isVerified = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token,
    window: 1 // Allow 1-time step tolerance
  });

  if (!isVerified) {
    throw new AppError('Invalid MFA token. Please try again.', 400);
  }

  // Generate recovery codes
  const recoveryCodes = Array.from({ length: 10 }, () => 
    speakeasy.generateSecret({ length: 10 }).base32
  );
  
  // Encrypt and save recovery codes
  user.isMfaEnabled = true;
  user.mfaRecoveryCodes = recoveryCodes.map(encrypt);
  await user.save();

  logger.info(`MFA enabled for user: ${user.email}`);

  res.json({
    success: true,
    message: 'MFA has been successfully enabled. Store these recovery codes in a safe place.',
    data: {
      recoveryCodes
    }
  });
});

/**
 * @desc    Disable MFA for the user
 * @route   POST /api/v1/mfa/disable
 * @access  Private
 */
export const disableMfa = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  const user = await User.findByPk(req.user!.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password before disabling MFA
  if (!password || !(await user.comparePassword(password))) {
    throw new AppError('Invalid password.', 401);
  }

  user.isMfaEnabled = false;
  user.mfaSecret = undefined;
  user.mfaRecoveryCodes = [];
  await user.save();

  logger.info(`MFA disabled for user: ${user.email}`);

  res.json({
    success: true,
    message: 'MFA has been successfully disabled.'
  });
});

/**
 * @desc    Validate a TOTP token (used during login)
 * @route   POST /api/v1/auth/mfa-validate
 * @access  Public (requires temporary token)
 */
export const validateMfaToken = asyncHandler(async (req: Request, res: Response) => {
  // This endpoint will be implemented as part of the login flow update
  res.status(501).json({ message: 'Not implemented yet' });
});
