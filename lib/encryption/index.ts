/**
 * Credential Encryption Utilities
 * 
 * This module provides AES-256-GCM encryption/decryption
 * for storing sensitive credentials securely.
 * 
 * Security features:
 * - AES-256-GCM authenticated encryption
 * - Random IV for each encryption operation
 * - Per-workspace encryption keys
 * - HMAC key derivation for additional security
 */

import crypto from 'crypto';

// Encryption configuration
export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const IV_LENGTH = 12; // 96 bits is recommended for GCM
export const AUTH_TAG_LENGTH = 16; // 128 bits
export const KEY_LENGTH = 32; // 256 bits for AES-256
export const SALT_LENGTH = 16;

/**
 * Derives an encryption key from a master key and salt using PBKDF2
 * This adds an extra layer of security by deriving unique keys
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param data - The data to encrypt (will be JSON stringified)
 * @param key - The encryption key (hex string, at least 32 chars)
 * @returns Base64 encoded encrypted string (Salt + IV + AuthTag + Ciphertext)
 */
export const encryptCredentials = async (
  data: Record<string, unknown>,
  key: string
): Promise<string> => {
  if (!key || key.length < 32) {
    throw new Error('Encryption key must be at least 32 characters');
  }

  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Derive the actual encryption key
    const derivedKey = deriveKey(key, salt);
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);
    
    const plaintext = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    
    // Combine: salt + iv + authTag + ciphertext
    const combined = Buffer.concat([salt, iv, authTag, encrypted]);
    
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt credentials');
  }
};

/**
 * Decrypts data encrypted with encryptCredentials
 * @param encryptedData - Base64 encoded encrypted string
 * @param key - The encryption key used for encryption
 * @returns Decrypted data object
 */
export const decryptCredentials = async (
  encryptedData: string,
  key: string
): Promise<Record<string, unknown>> => {
  if (!key || key.length < 32) {
    throw new Error('Encryption key must be at least 32 characters');
  }

  if (!encryptedData) {
    throw new Error('No encrypted data provided');
  }

  try {
    // Decode from base64
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.subarray(
      SALT_LENGTH + IV_LENGTH, 
      SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
    );
    const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    
    // Derive the key using the same salt
    const derivedKey = deriveKey(key, salt);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt credentials - invalid key or corrupted data');
  }
};

/**
 * Generates a new encryption key for a workspace
 * @returns A new 32-byte key as hex string (64 characters)
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
};

/**
 * Validates that an encryption key meets requirements
 * @param key - The key to validate
 * @returns true if valid, false otherwise
 */
export const isValidEncryptionKey = (key: string): boolean => {
  return typeof key === 'string' && key.length >= 32;
};

/**
 * Gets the workspace encryption key
 * Uses a master key from environment + workspace-specific key ID
 * @param workspaceKeyId - The workspace's key identifier
 * @returns The derived encryption key for this workspace
 */
export const getWorkspaceEncryptionKey = (workspaceKeyId: string | null): string => {
  const masterKey = process.env.CREDENTIAL_ENCRYPTION_KEY;
  
  if (!masterKey) {
    throw new Error('CREDENTIAL_ENCRYPTION_KEY environment variable is not set');
  }
  
  if (!workspaceKeyId) {
    // Use master key directly if no workspace key ID
    return masterKey;
  }
  
  // Derive a workspace-specific key
  const salt = Buffer.from(workspaceKeyId, 'utf8');
  const derivedKey = crypto.pbkdf2Sync(masterKey, salt, 50000, KEY_LENGTH, 'sha256');
  return derivedKey.toString('hex');
};

/**
 * Encrypts credentials for a specific workspace
 * @param data - The credential data to encrypt
 * @param workspaceKeyId - The workspace's encryption key ID
 * @returns Encrypted string
 */
export const encryptWorkspaceCredentials = async (
  data: Record<string, unknown>,
  workspaceKeyId: string | null
): Promise<string> => {
  const key = getWorkspaceEncryptionKey(workspaceKeyId);
  return encryptCredentials(data, key);
};

/**
 * Decrypts credentials for a specific workspace
 * @param encryptedData - The encrypted credential data
 * @param workspaceKeyId - The workspace's encryption key ID
 * @returns Decrypted credential object
 */
export const decryptWorkspaceCredentials = async (
  encryptedData: string,
  workspaceKeyId: string | null
): Promise<Record<string, unknown>> => {
  const key = getWorkspaceEncryptionKey(workspaceKeyId);
  return decryptCredentials(encryptedData, key);
};
