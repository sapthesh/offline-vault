import React from 'react';
import type { PasswordEntry } from '../types';
import PasswordListItem from './PasswordListItem';

interface PasswordListProps {
  entries: PasswordEntry[];
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (entry: PasswordEntry) => void;
}

const PasswordList: React.FC<PasswordListProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map(entry => (
        <PasswordListItem key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default PasswordList;
