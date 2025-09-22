import React, { useState, useMemo, useCallback } from 'react';
import type { PasswordEntry } from '../types';
import PasswordList from './PasswordList';
import AddEditEntryModal from './AddEditEntryModal';
import Button from './common/Button';
import IconButton from './common/IconButton';
import Select from './common/Select';

interface VaultScreenProps {
  onLock: () => void;
  entries: PasswordEntry[];
  onAddEntry: (entryData: Omit<PasswordEntry, 'id' | 'lastModified'>) => void;
  onUpdateEntry: (entryData: Omit<PasswordEntry, 'lastModified'>) => void;
  onDeleteEntry: (entry: PasswordEntry) => void;
  categories: string[];
}

type SortBy = 'service' | 'username' | 'lastModified';
type SortOrder = 'asc' | 'desc';

const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>;
const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>;

const VaultScreen: React.FC<VaultScreenProps> = ({ onLock, entries, onAddEntry, onUpdateEntry, onDeleteEntry, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>(() => (localStorage.getItem('vault-sort-by') as SortBy) || 'lastModified');
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => (localStorage.getItem('vault-sort-order') as SortOrder) || 'desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  React.useEffect(() => {
    localStorage.setItem('vault-sort-by', sortBy);
  }, [sortBy]);

  React.useEffect(() => {
    localStorage.setItem('vault-sort-order', sortOrder);
  }, [sortOrder]);

  const openAddModal = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: PasswordEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };
  
  const categoryFilterOptions = useMemo(() => {
    const allCategories = ['all', 'Uncategorized', ...categories].sort((a,b) => {
        if(a === 'all' || a === 'Uncategorized') return -1;
        if(b === 'all' || b === 'Uncategorized') return 1;
        return a.localeCompare(b);
    });
    const uniqueCategories = [...new Set(allCategories)]; // Ensure uniqueness
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Categories' : cat,
    }));
  }, [categories]);

  const sortedAndFilteredEntries = useMemo(() => {
    const lowercasedQuery = searchQuery.trim().toLowerCase();
    
    const filtered = entries.filter(entry => {
        const matchesCategory = categoryFilter === 'all' || (entry.category || 'Uncategorized') === categoryFilter;
        if (!matchesCategory) return false;

        if (!lowercasedQuery) return true;

        return entry.service.toLowerCase().includes(lowercasedQuery) ||
               entry.username.toLowerCase().includes(lowercasedQuery);
      });

    return [...filtered].sort((a, b) => {
      let valA: string, valB: string;

      switch (sortBy) {
        case 'service':
          valA = a.service.toLowerCase();
          valB = b.service.toLowerCase();
          break;
        case 'username':
          valA = a.username.toLowerCase();
          valB = b.username.toLowerCase();
          break;
        case 'lastModified':
        default:
          valA = a.lastModified;
          valB = b.lastModified;
          break;
      }
      
      if (sortBy === 'lastModified') {
         return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }

      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [entries, searchQuery, sortBy, sortOrder, categoryFilter]);
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSave = useCallback((entryData: Omit<PasswordEntry, 'id' | 'lastModified'>) => {
      if (editingEntry) {
        onUpdateEntry({ ...entryData, id: editingEntry.id });
      } else {
        onAddEntry(entryData);
      }
  }, [editingEntry, onAddEntry, onUpdateEntry]);

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
            <h2 className="headline-medium">Your Passwords</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                 <Button onClick={openAddModal}>Add Entry</Button>
                 <Button onClick={onLock} variant="danger">Lock Vault</Button>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', pointerEvents: 'none', color: 'var(--md-sys-color-on-surface-variant)' }}>
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
                <input
                    type="search"
                    placeholder="Search by service or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search passwords"
                    style={{
                        width: '100%',
                        height: '48px',
                        backgroundColor: 'var(--md-sys-color-surface-variant)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        borderRadius: 'var(--md-border-radius-full)',
                        border: 'none',
                        padding: '12px 16px 12px 48px',
                        fontFamily: 'inherit',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                 <Select
                    label="Filter by Category"
                    value={categoryFilter}
                    onChange={(val) => setCategoryFilter(val)}
                    options={categoryFilterOptions}
                 />
                 <Select
                    label="Sort by"
                    value={sortBy}
                    onChange={(val) => setSortBy(val as SortBy)}
                    options={[
                        { value: 'lastModified', label: 'Date Modified' },
                        { value: 'service', label: 'Service Name' },
                        { value: 'username', label: 'Username' },
                    ]}
                 />
                 <IconButton onClick={toggleSortOrder} aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`} style={{ height: '48px', width: '48px' }}>
                     {sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                 </IconButton>
            </div>
        </div>
      
        {entries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: 'var(--md-border-radius-lg)', border: '1px dashed var(--md-sys-color-outline)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', color: 'var(--md-sys-color-on-surface-variant)' }} height="48px" viewBox="0 0 24 24" width="48px" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h-2v-2zm-4 0h2v2H8v-2zm8 0h2v2h-2v-2z"/>
                </svg>
                <h3 className="title-large" style={{ marginTop: '8px', color: 'var(--md-sys-color-on-surface)' }}>No entries yet</h3>
                <p className="body-medium" style={{ marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>Click "Add Entry" to save your first password.</p>
            </div>
        ) : sortedAndFilteredEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: 'var(--md-border-radius-lg)', border: '1px dashed var(--md-sys-color-outline)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', color: 'var(--md-sys-color-on-surface-variant)' }} height="48px" viewBox="0 0 24 24" width="48px" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                <h3 className="title-large" style={{ marginTop: '8px', color: 'var(--md-sys-color-on-surface)' }}>No Results Found</h3>
                <p className="body-medium" style={{ marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>Your search for "{searchQuery}" did not match any entries.</p>
            </div>
        ) : (
            <PasswordList entries={sortedAndFilteredEntries} onEdit={openEditModal} onDelete={onDeleteEntry} />
        )}
      
        {isModalOpen && (
            <AddEditEntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                entry={editingEntry}
                existingCategories={categories}
            />
        )}
    </div>
  );
};

export default VaultScreen;
