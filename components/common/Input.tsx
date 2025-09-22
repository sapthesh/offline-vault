import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, style, ...props }, ref) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--md-sys-color-surface-variant)',
    borderTopLeftRadius: 'var(--md-border-radius-xs)',
    borderTopRightRadius: 'var(--md-border-radius-xs)',
    borderBottom: '1px solid var(--md-sys-color-on-surface-variant)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '24px 16px 8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    color: 'var(--md-sys-color-on-surface-variant)',
    fontFamily: 'inherit',
    fontSize: '16px',
    ...style,
  };
  
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '16px',
    color: 'var(--md-sys-color-on-surface-variant)',
    pointerEvents: 'none',
    transition: 'top 0.2s, font-size 0.2s, color 0.2s',
  };

  // This would be more robust with a state check on value, but for simplicity:
  const focusStyles = `
    #${id}:focus + label, #${id}:not(:placeholder-shown) + label {
      top: 6px;
      font-size: 12px;
      color: var(--md-sys-color-primary);
    }
    #${id}:focus {
       border-bottom: 2px solid var(--md-sys-color-primary);
       padding-bottom: 7px;
    }
  `;

  return (
    <div style={containerStyle}>
        <style>{focusStyles}</style>
        <input
            id={id}
            ref={ref}
            style={inputStyle}
            placeholder=" "
            {...props}
        />
        <label htmlFor={id} style={labelStyle}>
            {label}
        </label>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;