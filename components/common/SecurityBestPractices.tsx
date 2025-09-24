// Copyright github.com/sapthesh
import React from 'react';

// Icons
const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
);
const TwoFAIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M18 1.01L8 1c-1.1 0-2 .9-2 2v3h2V5h8v14H8v-1H6v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM10.75 15.25l-2.5-2.5-1.41 1.41L10.75 18.08l6.36-6.36-1.41-1.41-4.95 4.94z"/>
    </svg>
);
const BackupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
    </svg>
);
const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
);


const SecurityBestPractices: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  };
  const headingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: 'var(--md-sys-color-primary)',
  };
  const listStyle: React.CSSProperties = {
    paddingLeft: '24px',
    margin: 0,
    color: 'var(--md-sys-color-on-surface-variant)',
  };

  return (
    <div>
      <div style={sectionStyle}>
        <div style={headingStyle}>
          <KeyIcon />
          <h3 className="title-medium">Create a Strong Master Password</h3>
        </div>
        <ul className="body-medium" style={listStyle}>
          <li><strong>Length is strength:</strong> Aim for at least 16 characters. A longer password is exponentially harder to crack.</li>
          <li><strong>Use a passphrase:</strong> Combine 4-5 unrelated words, like `correct-horse-battery-staple`. It's long, memorable, and secure.</li>
          <li><strong>Mix it up:</strong> Include a mix of uppercase letters, lowercase letters, numbers, and symbols to increase complexity.</li>
          <li><strong>Be unique:</strong> Your master password should be used for this vault ONLY and nowhere else.</li>
          <li><strong>Never store it digitally:</strong> Do not save your master password in a plain text file, email, or other unencrypted format. Write it down and store it in a secure physical location (like a safe).</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <div style={headingStyle}>
          <TwoFAIcon />
          <h3 className="title-medium">Enable Two-Factor Authentication (2FA)</h3>
        </div>
        <p className="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0}}>
          While this offline app doesn't have 2FA itself, it's crucial to enable it on all your online accounts (email, banking, social media). 2FA adds a critical layer of security, requiring a second code (usually from your phone) to log in. This protects you even if your password is stolen.
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={headingStyle}>
          <BackupIcon />
          <h3 className="title-medium">Practice Safe Backup Procedures</h3>
        </div>
         <p className="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0}}>
          Your vault data is only stored in this browser. If your browser data is cleared or your device is lost, your vault will be gone.
        </p>
        <ul className="body-medium" style={listStyle}>
          <li><strong>Export regularly:</strong> Use the "Export to file" feature in Settings to create a backup of your vault.</li>
          <li><strong>Store backups securely:</strong> The exported file is NOT encrypted. Store it on an encrypted USB drive or in a secure, encrypted cloud storage service.</li>
          <li><strong>Multiple locations:</strong> Keep backups in at least two separate, secure physical locations to protect against fire, theft, or hardware failure.</li>
        </ul>
      </div>

      <div style={{...sectionStyle, marginBottom: 0, borderTop: '1px solid var(--md-sys-color-outline)', paddingTop: '24px'}}>
        <div style={{...headingStyle, color: 'var(--md-sys-color-error)'}}>
          <WarningIcon />
          <h3 className="title-medium">What if I forget my Master Password?</h3>
        </div>
         <p className="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0}}>
          Due to the zero-knowledge security model of this app, your master password is <strong>not recoverable</strong>. We never store it and have no way to access or reset it.
        </p>
        <ul className="body-medium" style={listStyle}>
            <li>There is <strong>no "Forgot Password"</strong> or password reset mechanism.</li>
            <li>If you forget your master password, you will <strong>permanently lose access</strong> to your entire vault.</li>
            <li>This is a crucial security feature, but it means you are solely responsible for remembering your password. Please <strong>write it down and store it in a secure, offline location</strong> you can trust.</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityBestPractices;