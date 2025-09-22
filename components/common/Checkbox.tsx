import React from 'react';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({label, checked, onChange}) => {
    const uniqueId = React.useId();
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
                type="checkbox"
                id={uniqueId}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{
                    appearance: 'none',
                    width: '18px',
                    height: '18px',
                    border: '2px solid var(--md-sys-color-on-surface-variant)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s, border-color 0.2s',
                }}
            />
            <label htmlFor={uniqueId} className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', cursor: 'pointer' }}>
                {label}
            </label>
            <style>
                {`
                    input[type="checkbox"]:checked {
                        background-color: var(--md-sys-color-primary);
                        border-color: var(--md-sys-color-primary);
                    }
                    input[type="checkbox"]:checked::before {
                        content: '';
                        position: absolute;
                        top: 1px;
                        left: 5px;
                        width: 4px;
                        height: 9px;
                        border: solid var(--md-sys-color-on-primary);
                        border-width: 0 2px 2px 0;
                        transform: rotate(45deg);
                    }
                `}
            </style>
        </div>
    );
};

export default Checkbox;
