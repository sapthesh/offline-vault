import React, { useState, useEffect, useCallback } from 'react';
import type { PasswordEntry } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Textarea from './common/Textarea';
import PasswordGenerator from './PasswordGenerator';
import PasswordStrengthMeter from './common/PasswordStrengthMeter';

interface AddEditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<PasswordEntry, 'id' | 'lastModified'>) => void;
  entry: PasswordEntry | null;
  existingCategories?: string[];
}

const AddEditEntryModal: React.FC<AddEditEntryModalProps> = ({ isOpen, onClose, onSave, entry, existingCategories = [] }) => {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [favicon, setFavicon] = useState('');
  const [isFetchingIcon, setIsFetchingIcon] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (entry) {
          setService(entry.service);
          setUsername(entry.username);
          setPassword(entry.password);
          setCategory(entry.category || '');
          setNotes(entry.notes || '');
          setFavicon(entry.favicon || '');
        } else {
          // Reset form for new entry
          setService('');
          setUsername('');
          setPassword('');
          setCategory('');
          setNotes('');
          setFavicon('');
        }
    }
  }, [entry, isOpen]);

  const handleFetchFavicon = useCallback(async (serviceName: string) => {
    if (!serviceName) return;
    setIsFetchingIcon(true);
    setFavicon('');
    try {
        let domain = serviceName.trim();

        // More robustly parse the domain from the input
        try {
            // Prepend a protocol if missing, otherwise URL constructor fails.
            const url = domain.startsWith('http') ? domain : `https://${domain}`;
            const hostname = new URL(url).hostname;
            // Remove 'www.' if it exists
            domain = hostname.replace(/^www\./, '');
        } catch (e) {
            // Fallback for simple names (e.g., 'github') which are not valid URLs.
            domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        }

        // Autofill the cleaned domain back into the input
        setService(domain);

        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
        const response = await fetch(faviconUrl);
        if (!response.ok) throw new Error('Favicon not found');
        
        const blob = await response.blob();

        // Convert blob to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // Google returns a default globe icon for not found, which is a small png.
            // A real icon is usually larger. This is a heuristic to avoid saving the default icon.
            if (blob.size > 500) {
                 setFavicon(base64data);
            }
        };
        reader.readAsDataURL(blob);

    } catch (error) {
        console.warn('Could not fetch favicon:', error);
        setFavicon('');
    } finally {
        setIsFetchingIcon(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !username || !password) return;
    onSave({ service, username, password, category: category.trim() || 'Uncategorized', favicon, notes: notes.trim() });
    onClose();
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  if (!isOpen) return null;

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
            zIndex: 50
        }}
    >
      <div 
        style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderRadius: 'var(--md-border-radius-lg)',
            boxShadow: 'var(--md-elevation-3)',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 className="headline-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>{entry ? 'Edit Entry' : 'Add New Entry'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {favicon && <img src={favicon} alt="Service favicon" width="32" height="32" style={{borderRadius: '4px'}} />}
                    {isFetchingIcon && <div style={{width: '32px', height: '32px', flexShrink: 0, borderRadius: '4px', backgroundColor: 'var(--md-sys-color-surface-variant)'}} />}
                    <div style={{ flexGrow: 1 }}>
                        <Input 
                            label="Service Name (e.g., google.com)"
                            id="service"
                            type="text"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            onBlur={(e) => handleFetchFavicon(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                </div>

                <Input 
                    label="Username / Email"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="off"
                />
                <Input 
                    label="Category (e.g., Work, Personal)"
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    list="category-suggestions"
                    autoComplete="off"
                />
                <datalist id="category-suggestions">
                    {existingCategories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
                <div>
                  <Input 
                      label="Password"
                      id="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                  />
                  <div style={{marginTop: '4px'}}>
                    <PasswordStrengthMeter password={password} />
                  </div>
                </div>
                <Textarea 
                    label="Notes"
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    autoComplete="off"
                />
            </div>
          
          <div style={{ marginTop: '24px' }}>
            <PasswordGenerator onPasswordGenerated={setPassword} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '24px' }}>
            <Button type="button" variant="tonal" onClick={onClose}>Cancel</Button>
            <Button type="submit">{entry ? 'Save Changes' : 'Add Entry'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditEntryModal;