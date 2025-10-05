import Joi from 'joi';

/**
 * Password Policy Configuration
 * Complies with ISO 27001 A.9.4.3 - Password management system
 */

export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  passwordHistory: number; // Number of previous passwords to prevent reuse
  maxAge: number; // Password expiration in days
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  passwordHistory: 5,
  maxAge: 90, // 90 days
};

/**
 * Common passwords list (top 100 most common)
 * In production, use a comprehensive list from SecLists or similar
 */
const COMMON_PASSWORDS = [
  'password', 'Password123', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'passw0rd', 'shadow', '123123', '654321',
  'superman', 'qazwsx', 'michael', 'football', 'password1',
  // Add more from comprehensive list
];

/**
 * Validates password against policy
 */
export const passwordSchema = Joi.string()
  .min(DEFAULT_PASSWORD_POLICY.minLength)
  .max(DEFAULT_PASSWORD_POLICY.maxLength)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .required()
  .messages({
    'string.min': `Password must be at least ${DEFAULT_PASSWORD_POLICY.minLength} characters long`,
    'string.max': `Password must not exceed ${DEFAULT_PASSWORD_POLICY.maxLength} characters`,
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required',
  });

/**
 * Validates password strength
 */
export class PasswordValidator {
  /**
   * Check if password meets policy requirements
   */
  static validate(password: string, policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  } {
    const errors: string[] = [];
    let strengthScore = 0;

    // Length check
    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    } else {
      strengthScore += 1;
    }

    if (password.length > policy.maxLength) {
      errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }

    // Uppercase check
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      strengthScore += 1;
    }

    // Lowercase check
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      strengthScore += 1;
    }

    // Number check
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      strengthScore += 1;
    }

    // Special character check
    if (policy.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    } else if (/[@$!%*?&]/.test(password)) {
      strengthScore += 1;
    }

    // Common password check
    if (policy.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push('This password is too common. Please choose a more secure password');
      strengthScore = 0; // Override score if common password
    }

    // Additional strength checks
    if (password.length >= 16) strengthScore += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strengthScore += 1; // More special chars

    // Calculate strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (strengthScore <= 2) {
      strength = 'weak';
    } else if (strengthScore <= 4) {
      strength = 'medium';
    } else if (strengthScore <= 6) {
      strength = 'strong';
    } else {
      strength = 'very-strong';
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }

  /**
   * Check if password is in common passwords list
   */
  private static isCommonPassword(password: string): boolean {
    return COMMON_PASSWORDS.some(
      (common) => password.toLowerCase() === common.toLowerCase()
    );
  }

  /**
   * Calculate password entropy (bits)
   */
  static calculateEntropy(password: string): number {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/\d/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;

    return Math.log2(Math.pow(charset, password.length));
  }

  /**
   * Check password against previous passwords
   */
  static async checkPasswordHistory(
    userId: number,
    newPassword: string,
    previousPasswords: string[]
  ): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    
    for (const oldPassword of previousPasswords) {
      const isMatch = await bcrypt.compare(newPassword, oldPassword);
      if (isMatch) {
        return false; // Password was used before
      }
    }
    
    return true; // Password is unique
  }
}

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 16): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};
