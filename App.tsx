import React, { useState, useCallback, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import VaultScreen from './components/VaultScreen';
import SettingsScreen from './components/SettingsScreen';
import IconButton from './components/common/IconButton';
import { vaultExists as checkVaultExists, loadVault, saveVault } from './services/storageService';
import { decryptData, encryptData } from './services/cryptoService';
import type { PasswordEntry, VaultData } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import ConfirmationModal from './components/common/ConfirmationModal';

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);

const AppContent: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [vaultExists, setVaultExists] = useState<boolean>(checkVaultExists());
  const [currentView, setCurrentView] = useState<'vault' | 'settings'>('vault');
  
  // State for vault data
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State for confirmation modals
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<PasswordEntry | null>(null);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleLock = useCallback(() => {
    setEncryptionKey(null);
    setCurrentView('vault'); // Reset view on lock
    setEntries([]); // Clear entries
    setCategories([]); // Clear categories
    setError('');
  }, []);

  const persistVault = useCallback(async (
    updatedEntries: PasswordEntry[], 
    updatedCategories: string[], 
    key: CryptoKey | null = encryptionKey
  ) => {
    if (!key) {
        setError('Encryption key not available. Cannot save.');
        return;
    }
    try {
        const vaultData: VaultData = {
          entries: updatedEntries,
          categories: updatedCategories,
        };
        const jsonToEncrypt = JSON.stringify(vaultData);
        const newEncryptedVault = await encryptData(jsonToEncrypt, key);
        saveVault(newEncryptedVault);
        setEntries(updatedEntries);
        setCategories(updatedCategories);
    } catch (e) {
        setError('Failed to save changes. Your data may not be persisted.');
        console.error(e);
    }
  }, [encryptionKey]);
  
  const loadAndDecryptVault = useCallback(async (key: CryptoKey) => {
    setIsLoading(true);
    setError('');
    const vault = loadVault();
    if (vault) {
      try {
        const decryptedJson = await decryptData(vault, key);
        let parsedData = JSON.parse(decryptedJson);

        let currentEntries: PasswordEntry[];
        let currentCategories: string[];
        let needsResaving = false;
        
        // Check for old format (array of entries) vs new format (object)
        if (Array.isArray(parsedData)) {
            needsResaving = true;
            currentEntries = parsedData;
            const derivedCategories = [...new Set(currentEntries.map(e => e.category).filter(Boolean).filter(c => c !== 'Uncategorized'))].sort();
            currentCategories = derivedCategories as string[];
        } else {
            currentEntries = parsedData.entries || [];
            currentCategories = parsedData.categories || [];
        }
        
        // Migration logic for individual entries
        const entryNeedsMigration = currentEntries.some((e: any) => !e.lastModified || typeof e.category === 'undefined' || typeof e.notes === 'undefined');
        if (entryNeedsMigration) {
          needsResaving = true;
          const now = new Date().toISOString();
          currentEntries = currentEntries.map((e: any) => ({
            ...e,
            lastModified: e.lastModified || now,
            category: e.category || 'Uncategorized',
            notes: e.notes || '',
          }));
        }

        setEntries(currentEntries);
        setCategories(currentCategories);

        if (needsResaving) {
            await persistVault(currentEntries, currentCategories, key);
        }

      } catch (e) {
        setError('Failed to decrypt vault. Locking for safety.');
        console.error(e);
        setTimeout(handleLock, 2000);
      }
    } else {
        setError("Vault is empty. This might be an error.");
    }
    setIsLoading(false);
  }, [handleLock, persistVault]);

  const handleUnlock = useCallback((key: CryptoKey) => {
    setEncryptionKey(key);
    loadAndDecryptVault(key);
  }, [loadAndDecryptVault]);

  const handleVaultCreated = useCallback(() => {
    setVaultExists(true);
  }, []);

  const handleAddEntry = (entry: Omit<PasswordEntry, 'id' | 'lastModified'>) => {
    const newEntry: PasswordEntry = { 
        ...entry, 
        id: crypto.randomUUID(),
        lastModified: new Date().toISOString() 
    };
    const updatedEntries = [...entries, newEntry];
    persistVault(updatedEntries, categories);
  };

  const handleUpdateEntry = (updatedEntry: Omit<PasswordEntry, 'lastModified'>) => {
    const updatedEntries = entries.map(e => 
        e.id === updatedEntry.id 
        ? { ...updatedEntry, lastModified: new Date().toISOString() } 
        : e
    );
    persistVault(updatedEntries, categories);
  };
  
  const handleDeleteEntryRequest = (entry: PasswordEntry) => {
    setEntryToDelete(entry);
    setIsDeleteEntryModalOpen(true);
  };

  const confirmDeleteEntry = useCallback(() => {
    if (!entryToDelete) return;
    const updatedEntries = entries.filter(e => e.id !== entryToDelete.id);
    persistVault(updatedEntries, categories);
    setIsDeleteEntryModalOpen(false);
    setEntryToDelete(null);
  }, [entryToDelete, entries, categories, persistVault]);

  const cancelDeleteEntry = () => {
    setIsDeleteEntryModalOpen(false);
    setEntryToDelete(null);
  };


  // --- Category Handlers ---
  const handleAddCategory = (name: string) => {
    if (name && !categories.includes(name) && name.toLowerCase() !== 'uncategorized') {
      const updatedCategories = [...categories, name].sort();
      persistVault(entries, updatedCategories);
    }
  };

  const handleUpdateCategory = (oldName: string, newName: string) => {
    if (newName && oldName !== newName && !categories.includes(newName)) {
      const updatedCategories = categories.map(c => c === oldName ? newName : c).sort();
      const updatedEntries = entries.map(e => e.category === oldName ? { ...e, category: newName } : e);
      persistVault(updatedEntries, updatedCategories);
    }
  };
  
  const handleDeleteCategoryRequest = (name: string) => {
    setCategoryToDelete(name);
    setIsDeleteCategoryModalOpen(true);
  };

  const confirmDeleteCategory = useCallback(() => {
    if (!categoryToDelete) return;
    const updatedCategories = categories.filter(c => c !== categoryToDelete);
    const updatedEntries = entries.map(e => e.category === categoryToDelete ? { ...e, category: 'Uncategorized' } : e);
    persistVault(updatedEntries, updatedCategories);
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  }, [categoryToDelete, categories, entries, persistVault]);

  const cancelDeleteCategory = () => {
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const renderContent = () => {
    if (!encryptionKey) {
      return <LoginScreen onUnlock={handleUnlock} vaultExists={vaultExists} onVaultCreated={handleVaultCreated} />;
    }
    if (isLoading) {
      return <div style={{textAlign: 'center', padding: '32px'}} className="title-medium">Loading Vault...</div>;
    }
    if (error) {
      return <div style={{textAlign: 'center', padding: '32px', color: 'var(--md-sys-color-error)'}}>{error}</div>;
    }
    if (currentView === 'settings') {
      return (
        <SettingsScreen 
            onBack={() => setCurrentView('vault')} 
            entries={entries} 
            persistEntries={(updatedEntries) => persistVault(updatedEntries, categories)}
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategoryRequest}
        />
      );
    }
    return (
      <VaultScreen 
        onLock={handleLock}
        entries={entries}
        onAddEntry={handleAddEntry}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntryRequest}
        categories={categories}
      />
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--md-sys-color-background)',
      color: 'var(--md-sys-color-on-background)',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="var(--md-sys-color-primary)">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <h1 className="title-large" style={{ color: 'var(--md-sys-color-on-surface)', margin: 0}}>Offline Vault</h1>
            </div>
            {encryptionKey && (
              <IconButton onClick={() => setCurrentView(currentView === 'vault' ? 'settings' : 'vault')} aria-label="Open settings">
                  <SettingsIcon />
              </IconButton>
            )}
        </header>
        <main>
          {renderContent()}
        </main>

        <ConfirmationModal
            isOpen={isDeleteEntryModalOpen}
            onClose={cancelDeleteEntry}
            onConfirm={confirmDeleteEntry}
            title="Confirm Deletion"
        >
            <p>Are you sure you want to delete the entry for <strong style={{color: 'var(--md-sys-color-on-surface)'}}>{entryToDelete?.service}</strong>?</p>
            <p>This action cannot be undone.</p>
        </ConfirmationModal>

        <ConfirmationModal
            isOpen={isDeleteCategoryModalOpen}
            onClose={cancelDeleteCategory}
            onConfirm={confirmDeleteCategory}
            title="Confirm Category Deletion"
        >
            <p>Are you sure you want to delete the category <strong style={{color: 'var(--md-sys-color-on-surface)'}}>{categoryToDelete}</strong>?</p>
            <p>All entries in this category will be moved to "Uncategorized". This action cannot be undone.</p>
        </ConfirmationModal>

        <footer style={{ textAlign: 'center', marginTop: '48px', color: 'var(--md-sys-color-on-surface-variant)'}} className="body-small">
            <p>All data is encrypted and stored locally in your browser.</p>
            <p>&copy; {new Date().getFullYear()} Offline Vault. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};


const App: React.FC = () => (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
);

export default App;
