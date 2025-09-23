import React, { useState, useRef, useEffect } from 'react';
import { deriveMasterKey, encryptData, decryptData } from '../services/cryptoService';
import { saveVault, loadVault } from '../services/storageService';
import Button from './common/Button';
import Input from './common/Input';
import InfoModal from './common/InfoModal';
import SecurityBestPractices from './common/SecurityBestPractices';

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
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  
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
      const emptyVaultData = '{"entries":[],"categories":[]}';
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
    <>
      <div 
        className="illumina-panel"
        style={{
          maxWidth: '420px',
          margin: '64px auto 0 auto',
          color: 'var(--md-sys-color-on-surface)',
        }}
      >
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

      {!vaultExists && (
        <div style={{ textAlign: 'center', marginTop: '24px', padding: '0 16px' }}>
            <p className="body-medium" style={{ margin: '0 0 8px 0', color: 'var(--md-sys-color-on-surface-variant)'}}>
                🔒 Your master password is the only key to your vault. Make it strong and memorable.
            </p>
            <button 
                type="button"
                onClick={() => setIsSecurityModalOpen(true)}
                className="label-large"
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--md-sys-color-primary)',
                    cursor: 'pointer',
                    padding: '4px',
                    textDecoration: 'underline'
                }}
            >
                Read our security best practices
            </button>
        </div>
      )}

      <InfoModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="Security Best Practices"
      >
        <SecurityBestPractices />
      </InfoModal>
    </>
  );
};

export default LoginScreen;