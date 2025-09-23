import React from 'react';
import type { PasswordEntry, Category } from '../types';
import PasswordListItem from './PasswordListItem';

interface PasswordListProps {
  entries: PasswordEntry[];
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (entry: PasswordEntry) => void;
  categories: Category[];
}

const PasswordList: React.FC<PasswordListProps> = ({ entries, onEdit, onDelete, categories }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map(entry => (
        <PasswordListItem key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} categories={categories} />
      ))}
    </ul>
  );
};

export default PasswordList;