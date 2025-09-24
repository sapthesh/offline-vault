// Copyright github.com/sapthesh
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

const hexToRgb = (hex: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
};

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
    
    // FIX: Cast hexValue to string as Object.entries returns [string, unknown][].
    // The value is known to be a string from the ColorPalette type definition.
    for (const [cssVarName, hexValue] of Object.entries(palette)) {
        document.documentElement.style.setProperty(cssVarName, hexValue as string);

        // Set RGB version for transparency effects
        const rgbValue = hexToRgb(hexValue as string);
        if (rgbValue) {
            document.documentElement.style.setProperty(`${cssVarName}-rgb`, rgbValue);
        }
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