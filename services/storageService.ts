
import type { EncryptedVault } from '../types';

const VAULT_KEY = 'offline-vault';

export const saveVault = (vault: EncryptedVault): void => {
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  } catch (error) {
    console.error('Failed to save vault to localStorage', error);
  }
};

export const loadVault = (): EncryptedVault | null => {
  try {
    const vaultString = localStorage.getItem(VAULT_KEY);
    if (!vaultString) {
      return null;
    }
    return JSON.parse(vaultString) as EncryptedVault;
  } catch (error) {
    console.error('Failed to load vault from localStorage', error);
    return null;
  }
};

export const vaultExists = (): boolean => {
  return localStorage.getItem(VAULT_KEY) !== null;
};

export const deleteVault = (): void => {
    localStorage.removeItem(VAULT_KEY);
}
