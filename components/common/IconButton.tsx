// Copyright github.com/sapthesh
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, color, style, ...props }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isHovered ? 'var(--md-sys-color-on-surface-variant-alpha-12, rgba(0, 0, 0, 0.08))' : 'transparent',
    color: color || 'var(--md-sys-color-on-surface-variant)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    padding: 0,
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;