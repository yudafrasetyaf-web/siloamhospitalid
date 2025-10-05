import crypto from 'crypto';
import logger from './logger';

/**
 * Encryption Utility - Upgraded to AES-256-GCM
 * Simulates secrets management by encrypting sensitive data before database storage.
 * Uses AES-256-GCM for authenticated encryption, which is more secure than CBC.
 * 
 * ISO 27001 Compliance: A.10.1 - Cryptographic controls
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Get encryption key from environment variable. Must be 32 bytes (64 hex characters).
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  logger.error('CRITICAL: ENCRYPTION_KEY is not set. MFA secrets will not be secure. Please set a 32-byte (64 hex chars) key.');
  // In a real production environment, you might want to throw an error and exit.
  // throw new Error('ENCRYPTION_KEY is not set.');
}

const key = Buffer.from(ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex');

/**
 * Encrypts a string using AES-256-GCM.
 * @param text The plaintext string to encrypt.
 * @returns A string containing the IV, auth tag, and encrypted text, separated by colons.
 */
export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    logger.warn('Encryption skipped: ENCRYPTION_KEY not set. Data is stored in plaintext.');
    return text; // Return plaintext if key is not set
  }

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Combine IV, auth tag, and encrypted data into a single string
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data.');
  }
}

/**
 * Decrypts a string encrypted with AES-256-GCM.
 * @param encryptedText The encrypted string (IV:authTag:encryptedData).
 * @returns The original plaintext string.
 */
export function decrypt(encryptedText: string): string {
  if (!ENCRYPTION_KEY) {
    logger.warn('Decryption skipped: ENCRYPTION_KEY not set. Returning data as is.');
    return encryptedText; // Return encrypted text if key is not set
  }

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format. Expected iv:authTag:encryptedData.');
    }

    const [ivHex, authTagHex, encryptedDataHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error) {
    logger.error('Decryption failed:', error);
    // In case of a decryption error (e.g., wrong key, tampered data), return an empty string or throw
    // to prevent leaking potentially corrupted data.
    throw new Error('Failed to decrypt data. Data may be corrupted or tampered with.');
  }
}
