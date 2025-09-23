import React from 'react';
import Button from './Button';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
        zIndex: 100,
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="info-modal-title"
    >
      <div
        className="illumina-panel"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--md-sys-color-on-surface)',
          animation: 'modal-scale-in 0.3s ease-out',
        }}
      >
        <h2 id="info-modal-title" className="headline-medium" style={{ marginTop: 0, marginBottom: '24px' }}>{title}</h2>
        <div style={{ flexGrow: 1, color: 'var(--md-sys-color-on-surface)' }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '24px' }}>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;