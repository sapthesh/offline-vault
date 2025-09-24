// Copyright github.com/sapthesh
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'filled', className = '', style, ...props }) => {
  const styles: React.CSSProperties = {
    padding: '10px 24px',
    borderRadius: 'var(--md-border-radius-full)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    boxShadow: 'var(--md-elevation-1)',
    ...style,
  };

  const variantStyles: Record<typeof variant, React.CSSProperties> = {
    filled: {
      backgroundColor: 'var(--md-sys-color-primary)',
      color: 'var(--md-sys-color-on-primary)',
    },
    tonal: {
      backgroundColor: 'var(--md-sys-color-secondary-container)',
      color: 'var(--md-sys-color-on-secondary-container)',
    },
    danger: {
      backgroundColor: 'var(--md-sys-color-error)',
      color: 'var(--md-sys-color-on-error)',
    },
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = 'var(--md-elevation-2)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = 'var(--md-elevation-1)';
  };


  return (
    <button
      className={`label-large ${className}`}
      style={{ ...styles, ...variantStyles[variant] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;