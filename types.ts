// Copyright github.com/sapthesh
export interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  lastModified: string; // ISO 8601 date string
  category?: string;
  favicon?: string; // Base64 encoded favicon
  notes?: string;
}

export interface EncryptedVault {
  salt: string; // Base64 encoded salt for PBKDF2
  iv: string;   // Base64 encoded IV for AES-GCM
  data: string; // Base64 encoded encrypted data
}

export interface Category {
  name: string;
  color: string;
}

export interface VaultData {
  entries: PasswordEntry[];
  categories: Category[];
}