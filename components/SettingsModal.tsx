import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes';
import Button from './common/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, mode, setMode } = useTheme();
  
  const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  if (!isOpen) return null;

  return (
    <div 
        onClick={handleBackdropClick}
        style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '16px', 
            zIndex: 100
        }}
    >
      <div 
        style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderRadius: 'var(--md-border-radius-lg)',
            boxShadow: 'var(--md-elevation-3)',
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}
      >
        <div>
            <h2 className="headline-medium">Settings</h2>
            <p className="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)'}}>Customize your app's appearance</p>
        </div>

        <div>
            <h3 className="title-medium" style={{marginBottom: '12px'}}>Mode</h3>
            <div style={{ display: 'flex', gap: '8px', border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--md-border-radius-full)', padding: '4px' }}>
                <Button 
                    variant={mode === 'light' ? 'filled' : 'tonal'} 
                    onClick={() => setMode('light')} 
                    style={{ flex: 1, boxShadow: 'none', backgroundColor: mode === 'light' ? 'var(--md-sys-color-primary)' : 'transparent', color: mode === 'light' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)' }}
                >
                    Light
                </Button>
                <Button 
                    variant={mode === 'dark' ? 'filled' : 'tonal'}
                    onClick={() => setMode('dark')} 
                    style={{ flex: 1, boxShadow: 'none', backgroundColor: mode === 'dark' ? 'var(--md-sys-color-primary)' : 'transparent', color: mode === 'dark' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)'}}
                >
                    Dark
                </Button>
            </div>
        </div>

        <div>
            <h3 className="title-medium" style={{marginBottom: '16px'}}>Theme</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px' }}>
                {themes.map(t => (
                    <div key={t.name} onClick={() => setTheme(t.name)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{
                            width: '100%',
                            paddingBottom: '100%',
                            borderRadius: '50%',
                            backgroundColor: t[mode]['--md-sys-color-primary'],
                            border: theme === t.name ? `4px solid var(--md-sys-color-primary)` : `4px solid transparent`,
                            transition: 'border-color 0.2s'
                        }}></div>
                        <p className="body-small" style={{marginTop: '8px'}}>{t.name}</p>
                    </div>
                ))}
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
            <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
