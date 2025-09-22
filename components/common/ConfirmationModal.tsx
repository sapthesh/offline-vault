import React from 'react';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

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
        zIndex: 100, // Higher z-index for modals
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirmation-title"
    >
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-surface)',
          borderRadius: 'var(--md-border-radius-lg)',
          boxShadow: 'var(--md-elevation-3)',
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
        }}
      >
        <h2 id="confirmation-title" className="title-large" style={{ marginTop: 0, marginBottom: '16px' }}>{title}</h2>
        <div className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button type="button" variant="tonal" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
