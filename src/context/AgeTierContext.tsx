import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from './AppContext';

export type AgeTier = 'kids' | 'youth' | 'adult';

interface AgeTierContextType {
  ageTier: AgeTier;
  setAgeTier: (tier: AgeTier) => void;
  isKids: boolean;
  isYouth: boolean;
  isAdult: boolean;
}

const AgeTierContext = createContext<AgeTierContextType | undefined>(undefined);

export function AgeTierProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAppContext();
  const [ageTier, setAgeTierState] = useState<AgeTier>(() => {
    const saved = localStorage.getItem('aies_age_tier');
    if (saved === 'kids' || saved === 'youth' || saved === 'adult') return saved;
    return 'youth';
  });

  // Auto-detect based on userProfile grade/role if not manually overridden
  useEffect(() => {
    const saved = localStorage.getItem('aies_age_tier_manual');
    if (saved) return; // User manually chose a tier

    if (userProfile?.role === 'student') {
      const grade = (userProfile.grade || '').toLowerCase();
      if (grade.includes('kindergarten') || grade.includes('primary') || grade.includes('k-') || grade.includes('grade 1') || grade.includes('grade 2') || grade.includes('grade 3') || grade.includes('grade 4') || grade.includes('grade 5')) {
        setAgeTierState('kids');
      } else if (grade.includes('college') || grade.includes('university') || grade.includes('adult') || grade.includes('higher ed') || (userProfile.level && userProfile.level > 10)) {
        setAgeTierState('adult');
      } else {
        setAgeTierState('youth');
      }
    } else if (userProfile?.role === 'teacher' || userProfile?.role === 'parent' || userProfile?.role === 'admin') {
      setAgeTierState('adult');
    }
  }, [userProfile]);

  const setAgeTier = (tier: AgeTier) => {
    setAgeTierState(tier);
    localStorage.setItem('aies_age_tier', tier);
    localStorage.setItem('aies_age_tier_manual', 'true');
  };

  const isKids = ageTier === 'kids';
  const isYouth = ageTier === 'youth';
  const isAdult = ageTier === 'adult';

  return (
    <AgeTierContext.Provider value={{ ageTier, setAgeTier, isKids, isYouth, isAdult }}>
      {children}
    </AgeTierContext.Provider>
  );
}

export function useAgeTier() {
  const context = useContext(AgeTierContext);
  if (!context) {
    throw new Error('useAgeTier must be used within an AgeTierProvider');
  }
  return context;
}
