import React, { createContext, useContext, useEffect, useState } from 'react';

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const SIZE_STORAGE_KEY = 'aies_text_size';
const CONTRAST_STORAGE_KEY = 'aies_high_contrast';
const DARK_MODE_STORAGE_KEY = 'aies_dark_mode';

// Maps to a root CSS custom property that every rem-based Tailwind size scales from,
// so this one toggle scales the whole app (buttons, body text, nav) — not just one page.
const SIZE_SCALE: Record<TextSize, string> = {
  sm: '15px',
  md: '16px',
  lg: '18px',
  xl: '20px',
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem(SIZE_STORAGE_KEY) as TextSize) || 'md';
  });
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem(CONTRAST_STORAGE_KEY) === 'true';
  });
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    document.documentElement.style.fontSize = SIZE_SCALE[textSize];
    localStorage.setItem(SIZE_STORAGE_KEY, textSize);
  }, [textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem(CONTRAST_STORAGE_KEY, String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize: setTextSizeState,
        highContrast,
        setHighContrast: setHighContrastState,
        darkMode,
        setDarkMode: setDarkModeState,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return ctx;
}
