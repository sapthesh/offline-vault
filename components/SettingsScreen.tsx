import React, { useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes';
import Button from './common/Button';
import IconButton from './common/IconButton';
import Input from './common/Input';
import type { PasswordEntry } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  entries: PasswordEntry[];
  persistEntries: (updatedEntries: PasswordEntry[]) => Promise<void>;
  categories: string[];
  onAddCategory: (name: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

// Icons
const ArrowBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, entries, persistEntries, categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const { theme, setTheme, mode, setMode } = useTheme();
  const importFileRef = useRef<HTMLInputElement>(null);
  
  // Category management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleExport = () => {
    if (entries.length === 0) {
        alert("Your vault is empty. Nothing to export.");
        return;
    }
    const dataToExport = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `offline-vault-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Vault exported successfully. Keep the downloaded file safe, it is NOT encrypted.');
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };
  
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File could not be read.");
            
            const importedEntries = JSON.parse(text);

            if (!Array.isArray(importedEntries) || (importedEntries.length > 0 && (!importedEntries[0].service || !importedEntries[0].username || !importedEntries[0].password))) {
                throw new Error("Invalid file format. Expected an array of password entries.");
            }
            
            if (!window.confirm("Do you want to MERGE the imported entries with your current vault?\n\n(Click 'Cancel' to REPLACE your current vault instead)")) {
                if (window.confirm("ARE YOU SURE? This will delete all your current entries and replace them with the imported data. This cannot be undone.")) {
                    const processed = importedEntries.map((entry: any) => ({ ...entry, id: crypto.randomUUID(), lastModified: entry.lastModified || new Date().toISOString(), category: entry.category || 'Uncategorized' }));
                    await persistEntries(processed);
                    alert(`Vault replaced successfully with ${processed.length} entries.`);
                }
            } else {
                const processed = importedEntries.map((entry: any) => ({ ...entry, id: crypto.randomUUID(), lastModified: entry.lastModified || new Date().toISOString(), category: entry.category || 'Uncategorized' }));
                const mergedEntries = [...entries, ...processed];
                await persistEntries(mergedEntries);
                alert(`Successfully merged ${processed.length} new entries into your vault.`);
            }
        } catch (error) {
            console.error("Import failed:", error);
            alert(`Import failed. Please ensure you are importing a valid vault JSON file. Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            if (event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
  };
  
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
        onAddCategory(trimmedName);
        setNewCategoryName('');
    }
  };

  const handleEditStart = (name: string) => {
    setEditingCategory(name);
    setEditingValue(name);
  };
  
  const handleEditCancel = () => {
    setEditingCategory(null);
    setEditingValue('');
  };
  
  const handleEditSave = () => {
    const trimmedValue = editingValue.trim();
    if (editingCategory && trimmedValue) {
        onUpdateCategory(editingCategory, trimmedValue);
        handleEditCancel();
    }
  };

  const handleDelete = (name: string) => {
    onDeleteCategory(name);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton onClick={onBack} aria-label="Back to vault">
                <ArrowBackIcon />
            </IconButton>
            <h2 className="headline-medium">Settings</h2>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="title-large">Appearance</h3>
            <div>
                <h4 className="title-medium" style={{marginBottom: '12px'}}>Mode</h4>
                <div style={{ display: 'flex', gap: '8px', border: '1px solid var(--md-sys-color-outline)', borderRadius: 'var(--md-border-radius-full)', padding: '4px', maxWidth: '300px' }}>
                    <Button 
                        variant={mode === 'light' ? 'filled' : 'tonal'} 
                        onClick={() => setMode('light')} 
                        style={{ flex: 1, boxShadow: 'none', backgroundColor: mode === 'light' ? 'var(--md-sys-color-primary)' : 'transparent', color: mode === 'light' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)' }}
                    >
                        Light
                    </Button>
                    <Button 
                        variant={mode === 'dark' ? 'filled' : 'tonal'}
                        onClick={() => setMode('dark')} 
                        style={{ flex: 1, boxShadow: 'none', backgroundColor: mode === 'dark' ? 'var(--md-sys-color-primary)' : 'transparent', color: mode === 'dark' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)'}}
                    >
                        Dark
                    </Button>
                </div>
            </div>

            <div>
                <h4 className="title-medium" style={{marginBottom: '16px'}}>Theme</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '16px' }}>
                    {themes.map(t => (
                        <div key={t.name} onClick={() => setTheme(t.name)} style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: t[mode]['--md-sys-color-primary'],
                                border: theme === t.name ? `4px solid var(--md-sys-color-primary)` : `4px solid var(--md-sys-color-outline)`,
                                transition: 'border-color 0.2s'
                            }}></div>
                            <p className="body-small">{t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="title-large">Category Management</h3>
             <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flexGrow: 1}}>
                    <Input 
                        id="new-category"
                        label="New Category Name"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                    />
                </div>
                <Button type="submit">Add</Button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map(cat => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: 'var(--md-border-radius-sm)'}}>
                        {editingCategory === cat ? (
                            <>
                                <div style={{flexGrow: 1}}>
                                     <input 
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', borderBottom: '2px solid var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'inherit', fontSize: '16px', padding: '4px' }}
                                    />
                                </div>
                                <IconButton onClick={handleEditSave} aria-label="Save category name"><SaveIcon /></IconButton>
                                <IconButton onClick={handleEditCancel} aria-label="Cancel editing"><CancelIcon /></IconButton>
                            </>
                        ) : (
                            <>
                                <span className="body-large" style={{ flexGrow: 1, color: 'var(--md-sys-color-on-surface-variant)' }}>{cat}</span>
                                <IconButton onClick={() => handleEditStart(cat)} aria-label={`Edit category ${cat}`}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDelete(cat)} aria-label={`Delete category ${cat}`} color="var(--md-sys-color-error)"><DeleteIcon /></IconButton>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 className="title-large">Data Management</h3>
            <p className="body-medium" style={{color: 'var(--md-sys-color-on-surface-variant)', marginTop: '-8px'}}>
                Import or export your vault. Exports are unencrypted, so keep them safe.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <input type="file" accept=".json" ref={importFileRef} onChange={handleFileSelected} style={{ display: 'none' }} aria-hidden="true" />
                 <Button onClick={handleImportClick} variant="tonal">Import from file</Button>
                 <Button onClick={handleExport} variant="tonal">Export to file</Button>
            </div>
        </section>
    </div>
  );
};

export default SettingsScreen;
