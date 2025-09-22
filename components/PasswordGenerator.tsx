import React, { useState, useCallback } from 'react';
import { generatePassword } from '../services/cryptoService';
import Button from './common/Button';
import Checkbox from './common/Checkbox';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onPasswordGenerated }) => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const handleGenerate = useCallback(() => {
    const newPassword = generatePassword(length, useUpper, useNumbers, useSymbols);
    onPasswordGenerated(newPassword);
  }, [length, useUpper, useNumbers, useSymbols, onPasswordGenerated]);

  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'var(--md-sys-color-surface-container-low, var(--md-sys-color-surface-variant))', // Fallback
      borderRadius: 'var(--md-border-radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
        <h4 className="title-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Password Generator</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label htmlFor="length" className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}>Length: {length}</label>
            <input 
                id="length"
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                style={{ width: '100%'}}
            />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
            <Checkbox label="Uppercase (A-Z)" checked={useUpper} onChange={setUseUpper} />
            <Checkbox label="Numbers (0-9)" checked={useNumbers} onChange={setUseNumbers} />
            <Checkbox label="Symbols (!@#)" checked={useSymbols} onChange={setUseSymbols} />
        </div>
        <Button type="button" variant="tonal" onClick={handleGenerate} style={{ width: '100%'}}>
            Generate & Fill Password
        </Button>
    </div>
  );
};

export default PasswordGenerator;