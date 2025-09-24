// Copyright github.com/sapthesh
import React from 'react';
import { calculatePasswordStrength } from '../../services/passwordStrengthService';

interface PasswordStrengthMeterProps {
  password?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const strength = calculatePasswordStrength(password);
  const showMeter = strength.score >= 0;

  const barStyles: React.CSSProperties = {
    height: '6px',
    borderRadius: '3px',
    transition: 'background-color 0.3s ease-in-out',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      // Use minHeight to guarantee space is reserved, preventing parent collapse.
      // 6px for bars + 8px gap + 16px for text = 30px.
      minHeight: '30px',
      justifyContent: 'center'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              ...barStyles,
              backgroundColor: showMeter && index <= strength.score
                ? strength.color
                : 'var(--md-sys-color-surface-variant)',
            }}
          />
        ))}
      </div>
      <p className="body-small" style={{
        margin: 0,
        color: strength.color, // Always set color for smooth transition
        textAlign: 'right',
        height: '16px', // Keep fixed height
        lineHeight: '16px',
        userSelect: 'none',
        // Use opacity to fade in/out, which is better for layout stability
        opacity: showMeter ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out, color 0.3s ease-in-out',
      }}>
        {strength.label || '\u00A0'}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;