import React from 'react';
import { calculatePasswordStrength } from '../../services/passwordStrengthService';

interface PasswordStrengthMeterProps {
  password?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const strength = calculatePasswordStrength(password);

  const placeholderHeight = '30px';

  if (strength.score < 0) {
    return <div style={{ height: placeholderHeight }} />;
  }

  const barStyles: React.CSSProperties = {
    height: '6px',
    borderRadius: '3px',
    transition: 'background-color 0.3s ease-in-out',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: placeholderHeight, justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              ...barStyles,
              backgroundColor: index <= strength.score
                ? strength.color
                : 'var(--md-sys-color-surface-variant)',
            }}
          />
        ))}
      </div>
      <p className="body-small" style={{ margin: 0, color: strength.color, textAlign: 'right', minHeight: '16px' }}>
        {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
