import React, { createContext, useContext, useEffect, useState } from 'react';

export type TextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColorFilter = 'none' | 'amber' | 'blue-reducer' | 'invert';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (v: boolean) => void;
  colorFilter: ColorFilter;
  setColorFilter: (f: ColorFilter) => void;
  lineReader: boolean;
  setLineReader: (v: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const SIZE_STORAGE_KEY = 'aies_text_size';
const CONTRAST_STORAGE_KEY = 'aies_high_contrast';
const DARK_MODE_STORAGE_KEY = 'aies_dark_mode';
const DYSLEXIC_STORAGE_KEY = 'aies_dyslexic_font';
const FILTER_STORAGE_KEY = 'aies_color_filter';
const MOTION_STORAGE_KEY = 'aies_reduced_motion';

const SIZE_SCALE: Record<TextSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '22px',
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
  const [dyslexicFont, setDyslexicFontState] = useState<boolean>(() => {
    return localStorage.getItem(DYSLEXIC_STORAGE_KEY) === 'true';
  });
  const [colorFilter, setColorFilterState] = useState<ColorFilter>(() => {
    return (localStorage.getItem(FILTER_STORAGE_KEY) as ColorFilter) || 'none';
  });
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem(MOTION_STORAGE_KEY) === 'true';
  });
  const [lineReader, setLineReader] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  useEffect(() => {
    document.documentElement.classList.toggle('font-dyslexic', dyslexicFont);
    localStorage.setItem(DYSLEXIC_STORAGE_KEY, String(dyslexicFont));
  }, [dyslexicFont]);

  useEffect(() => {
    document.documentElement.classList.remove('filter-amber', 'filter-blue-reducer', 'filter-invert');
    if (colorFilter !== 'none') {
      document.documentElement.classList.add(`filter-${colorFilter}`);
    }
    localStorage.setItem(FILTER_STORAGE_KEY, colorFilter);
  }, [colorFilter]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    localStorage.setItem(MOTION_STORAGE_KEY, String(reducedMotion));
  }, [reducedMotion]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize: setTextSizeState,
        highContrast,
        setHighContrast: setHighContrastState,
        darkMode,
        setDarkMode: setDarkModeState,
        dyslexicFont,
        setDyslexicFont: setDyslexicFontState,
        colorFilter,
        setColorFilter: setColorFilterState,
        lineReader,
        setLineReader,
        reducedMotion,
        setReducedMotion: setReducedMotionState,
        isModalOpen,
        setIsModalOpen,
        speakText,
      }}
    >
      {children}
      {/* Line Reader Ruler */}
      {lineReader && <LineReaderOverlay />}
    </AccessibilityContext.Provider>
  );
}

function LineReaderOverlay() {
  const [top, setTop] = useState(200);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTop(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-x-0 h-10 pointer-events-none z-50 bg-yellow-300/20 border-y-2 border-yellow-500/50 shadow-md backdrop-blur-[0.5px]"
      style={{ top: `${top - 20}px` }}
    />
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return ctx;
}
