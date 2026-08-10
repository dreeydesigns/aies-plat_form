import React from 'react';
import { Globe, Type, Contrast, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility, TextSize } from '../context/AccessibilityContext';
import { LANGUAGES } from '../i18n/translations';

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: 'sm', label: 'A' },
  { value: 'md', label: 'A' },
  { value: 'lg', label: 'A' },
  { value: 'xl', label: 'A' },
];

export default function PreferencesPanel() {
  const { language, setLanguage, t } = useLanguage();
  const { textSize, setTextSize, highContrast, setHighContrast, darkMode, setDarkMode } = useAccessibility();

  return (
    <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm max-w-2xl">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-700">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{t('language')} & {t('accessibility')}</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Built for every age and reading level — adjust anytime.</p>
        </div>
      </div>

      {/* Language */}
      <div className="mb-8">
        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4" /> {t('language')}
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                language === lang.code
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              {lang.nativeLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Text size */}
      <div className="mb-8">
        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
          <Type className="w-4 h-4" /> {t('textSize')}
        </label>
        <div className="flex items-center gap-2">
          {TEXT_SIZE_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => setTextSize(opt.value)}
              style={{ fontSize: `${14 + i * 3}px` }}
              className={`w-12 h-12 rounded-xl font-bold border transition-colors flex items-center justify-center ${
                textSize === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              aria-label={`Text size ${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* High contrast */}
        <div>
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
            <Contrast className="w-4 h-4" /> {t('highContrast')}
          </label>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`relative w-14 h-8 rounded-full transition-colors ${highContrast ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
            role="switch"
            aria-checked={highContrast}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                highContrast ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Dark mode */}
        <div>
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
            <Moon className="w-4 h-4" /> Dark Mode
          </label>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
            role="switch"
            aria-checked={darkMode}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                darkMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
