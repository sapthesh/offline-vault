// Copyright github.com/sapthesh
import type { EncryptedVault } from '../types';

// --- Helper Functions for Base64/ArrayBuffer ---

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// FIX: Changed return type from ArrayBuffer to Uint8Array and return `bytes` directly.
// This resolves a type mismatch in `decryptData` where `deriveKey` expects a Uint8Array for the salt.
const base64ToArrayBuffer = (base64: string): Uint8Array => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

// --- Core Crypto Functions ---

const getPasswordKey = (password: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
};

const deriveKey = async (passwordKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> => {
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (plaintext: string, masterKey: CryptoKey): Promise<EncryptedVault> => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const encryptionKey = await deriveKey(masterKey, salt);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    encryptionKey,
    enc.encode(plaintext)
  );

  return {
    salt: arrayBufferToBase64(salt),
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(encryptedData),
  };
};


export const decryptData = async (vault: EncryptedVault, masterKey: CryptoKey): Promise<string> => {
  const salt = base64ToArrayBuffer(vault.salt);
  const iv = base64ToArrayBuffer(vault.iv);
  const data = base64ToArrayBuffer(vault.data);
  const dec = new TextDecoder();
  
  const encryptionKey = await deriveKey(masterKey, salt);

  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      encryptionKey,
      data
    );
    return dec.decode(decryptedData);
  } catch (e) {
    throw new Error('Decryption failed. Invalid master password.');
  }
};

export const deriveMasterKey = async (password: string): Promise<CryptoKey> => {
    return getPasswordKey(password);
}

export const generatePassword = (length: number, useUpper: boolean, useNumbers: boolean, useSymbols: boolean): string => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charPool = lowerChars;
    if (useUpper) charPool += upperChars;
    if (useNumbers) charPool += numberChars;
    if (useSymbols) charPool += symbolChars;

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charPool[randomValues[i] % charPool.length];
    }
    return password;
};