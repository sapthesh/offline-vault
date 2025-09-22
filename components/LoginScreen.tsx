import React, { useState, useRef, useEffect } from 'react';
import { deriveMasterKey, encryptData, decryptData } from '../services/cryptoService';
import { saveVault, loadVault } from '../services/storageService';
import Button from './common/Button';
import Input from './common/Input';

interface LoginScreenProps {
  onUnlock: (key: CryptoKey) => void;
  vaultExists: boolean;
  onVaultCreated: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onUnlock, vaultExists, onVaultCreated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your master password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const masterKey = await deriveMasterKey(password);
      const vault = loadVault();
      if (vault) {
        await decryptData(vault, masterKey); // Try to decrypt to validate password
        onUnlock(masterKey);
      } else {
        setError("Vault not found. This shouldn't happen.");
      }
    } catch (err) {
      setError('Invalid master password.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const masterKey = await deriveMasterKey(password);
      const emptyVaultData = '[]'; // An empty array of password entries
      const newVault = await encryptData(emptyVaultData, masterKey);
      saveVault(newVault);
      onVaultCreated();
      onUnlock(masterKey);
    } catch (err) {
      setError('Failed to create vault.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '0 auto',
      backgroundColor: 'var(--md-sys-color-surface)',
      padding: '24px',
      borderRadius: 'var(--md-border-radius-lg)',
      boxShadow: 'var(--md-elevation-2)'
    }}>
      <h2 className="headline-medium" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface)', marginBottom: '24px' }}>
        {vaultExists ? 'Unlock Vault' : 'Create Your Vault'}
      </h2>
      <form onSubmit={vaultExists ? handleUnlock : handleCreateVault}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            ref={passwordInputRef}
            label="Master Password"
            id="master-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!vaultExists && (
            <Input 
              label="Confirm Master Password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
        </div>
        {error && <p className="body-medium" style={{ color: 'var(--md-sys-color-error)', marginTop: '16px', textAlign: 'center' }}>{error}</p>}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" disabled={isLoading} style={{width: '100%'}}>
            {isLoading ? (vaultExists ? 'Unlocking...' : 'Creating...') : (vaultExists ? 'Unlock' : 'Create Vault')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;