// Copyright github.com/sapthesh
import React from 'react';
import IconButton from './common/IconButton';
import SecurityBestPractices from './common/SecurityBestPractices';

interface SecurityScreenProps {
  onBack: () => void;
}

const ArrowBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;


const SecurityScreen: React.FC<SecurityScreenProps> = ({ onBack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton onClick={onBack} aria-label="Back to settings">
                <ArrowBackIcon />
            </IconButton>
            <h2 className="headline-medium">Security Best Practices</h2>
        </div>
        <div className="illumina-panel">
            <SecurityBestPractices />
        </div>
    </div>
  );
};

// FIX: Added default export to resolve import error in App.tsx and completed the component which was truncated.
export default SecurityScreen;
