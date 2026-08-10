import React, { useEffect, createContext, useContext } from 'react';

interface KeyboardShortcutsContextType {
  // Can expand this in the future
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({});

export function useKeyboardShortcuts() {
  return useContext(KeyboardShortcutsContext);
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search (just focus first search input if available)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="Ask"], input[placeholder*="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Esc to blur or exit modals
      if (e.key === 'Escape') {
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // If there were modals we could close them here by dispatching an event or updating a global store
        window.dispatchEvent(new Event('close-modals'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <KeyboardShortcutsContext.Provider value={{}}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}
