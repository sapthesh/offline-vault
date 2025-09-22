import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { themes, Theme } from '../themes';

type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: string;
  setTheme: (name: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'Indigo';
  });
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('app-theme-mode') as Mode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const selectedTheme = themes.find(t => t.name === theme) || themes[0];
    const palette = selectedTheme[mode];
    
    for (const key in palette) {
      document.documentElement.style.setProperty(key, palette[key as keyof typeof palette]);
    }
  }, [theme, mode]);

  useEffect(() => {
    localStorage.setItem('app-theme-mode', mode);
  }, [mode]);

  const value = useMemo(() => ({ theme, setTheme, mode, setMode }), [theme, mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
