import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, id, style, ...props }, ref) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--md-sys-color-surface-variant)',
    borderTopLeftRadius: 'var(--md-border-radius-xs)',
    borderTopRightRadius: 'var(--md-border-radius-xs)',
    borderBottom: '1px solid var(--md-sys-color-on-surface-variant)',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '24px 16px 8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    color: 'var(--md-sys-color-on-surface-variant)',
    fontFamily: 'inherit',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '80px',
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
        <textarea
            id={id}
            ref={ref}
            style={textareaStyle}
            placeholder=" "
            {...props}
        />
        <label htmlFor={id} style={labelStyle}>
            {label}
        </label>
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
