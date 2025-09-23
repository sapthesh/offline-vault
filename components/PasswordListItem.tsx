import React, { useState } from 'react';
import type { PasswordEntry, Category } from '../types';
import IconButton from './common/IconButton';
import { getContrastYIQ } from '../utils/colorUtils';

interface PasswordListItemProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (entry: PasswordEntry) => void;
  categories: Category[];
}

// Icons
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>;
const VisibilityOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>;
const VisibilityOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const NotesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/></svg>;
const FallbackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z"/></svg>;


const PasswordListItem: React.FC<PasswordListItemProps> = ({ entry, onEdit, onDelete, categories }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const handleCopy = (text: string, type: 'Username' | 'Password') => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(type);
    setTimeout(() => setCopyFeedback(''), 1500);
  };
  
  const handleDelete = () => {
    onDelete(entry);
  };

  const formattedDate = new Date(entry.lastModified).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const categoryName = entry.category || 'Uncategorized';
  let categoryColor = 'var(--md-sys-color-tertiary-container)';
  let onCategoryColor = 'var(--md-sys-color-on-tertiary-container)';

  if (categoryName !== 'Uncategorized') {
    const categoryData = categories.find(c => c.name === categoryName);
    if (categoryData) {
        categoryColor = categoryData.color;
        onCategoryColor = getContrastYIQ(categoryData.color);
    }
  }

  const listItemStyle: React.CSSProperties = {
      color: 'var(--md-sys-color-on-surface)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
  };

  return (
    <li 
      className="illumina-panel"
      style={listItemStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {entry.favicon ? (
          <img src={entry.favicon} alt={`${entry.service} favicon`} width="32" height="32" style={{ borderRadius: 'var(--md-border-radius-sm)', flexShrink: 0, objectFit: 'contain' }} />
        ) : (
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--md-border-radius-sm)', backgroundColor: 'var(--md-sys-color-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-primary)', flexShrink: 0 }}>
            <FallbackIcon />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="title-medium" style={{ margin: 0, color: 'var(--md-sys-color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entry.service}
          </h3>
          <p className="body-medium" style={{ margin: '2px 0 0', color: 'var(--md-sys-color-on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entry.username}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {entry.notes && (
            <IconButton onClick={() => setIsNotesVisible(v => !v)} aria-label="Toggle notes visibility">
              <NotesIcon />
            </IconButton>
          )}
          <IconButton onClick={() => onEdit(entry)} aria-label={`Edit entry for ${entry.service}`}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} aria-label={`Delete entry for ${entry.service}`} color="var(--md-sys-color-error)">
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
      
      <div style={{
          backgroundColor: 'var(--md-sys-color-surface-variant)',
          borderRadius: 'var(--md-border-radius-md)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
      }}>
          <p className="body-large" style={{ margin: 0, flexGrow: 1, fontFamily: 'monospace', letterSpacing: '1.5px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isPasswordVisible ? entry.password : '••••••••••••'}
          </p>
          <div style={{ display: 'flex', gap: '4px' }}>
            <IconButton onClick={() => setIsPasswordVisible(v => !v)} aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}>
              {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
            </IconButton>
            <IconButton onClick={() => handleCopy(entry.password, 'Password')} aria-label="Copy password">
              <CopyIcon />
            </IconButton>
          </div>
      </div>

      {isNotesVisible && entry.notes && (
        <div style={{
            backgroundColor: 'var(--md-sys-color-surface-variant)',
            borderRadius: 'var(--md-border-radius-md)',
            padding: '12px 16px',
        }}>
            <h4 className="body-small" style={{ margin: '0 0 4px 0', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Notes</h4>
            <pre className="body-medium" style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word', 
                fontFamily: 'inherit', 
                color: 'var(--md-sys-color-on-surface)',
                maxHeight: '150px',
                overflowY: 'auto'
            }}>
                {entry.notes}
            </pre>
        </div>
      )}
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {entry.category && entry.category !== 'Uncategorized' && (
             <span className="category-chip" style={{ backgroundColor: categoryColor, color: onCategoryColor }}>
                {entry.category}
            </span>
          )}
          <button
              onClick={() => handleCopy(entry.username, 'Username')}
              aria-label="Copy username"
              style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--md-border-radius-sm)',
                  color: 'var(--md-sys-color-primary)',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
              }}
              className="label-large"
          >
              Copy User
          </button>
        </div>
        <div style={{textAlign: 'right', flexShrink: 0}}>
          <p className="body-small" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', transition: 'color 0.3s' }}>
            {copyFeedback ? `Copied ${copyFeedback}!` : `Updated: ${formattedDate}`}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PasswordListItem;