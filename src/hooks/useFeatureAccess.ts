import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export type FeatureKey = 
  | 'textbook_library'
  | 'practice_drills'
  | 'similar_questions'
  | 'socratic_tutor'
  | 'advanced_analytics'
  | 'teacher_content_studio'
  | 'custom_exams';

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason: 'granted' | 'guest_restricted' | 'institution_disabled' | 'subscription_required';
  institutionName?: string | null;
}

/**
 * Shared Hook to enforce institution-level & tier-level feature access.
 * Checks whether the current user or their institution has an active grant for a given feature.
 */
export function useFeatureAccess(featureKey: FeatureKey): FeatureAccessResult {
  const { userProfile } = useAppContext();

  return useMemo(() => {
    // AIES Central Admin always has universal access
    if (userProfile?.role === 'admin' || userProfile?.role === 'aies_central') {
      return { hasAccess: true, reason: 'granted', institutionName: 'AIES Central' };
    }

    // Guest Mode Checks
    if (userProfile?.isGuest || userProfile?.role === 'guest') {
      if (featureKey === 'practice_drills') {
        return { hasAccess: true, reason: 'granted' };
      }
      return { hasAccess: false, reason: 'guest_restricted' };
    }

    // Subscribed Individual Students
    if (userProfile?.isSubscribed) {
      return { hasAccess: true, reason: 'granted' };
    }

    // Institution-scoped users (Students, Teachers, Principals)
    if (userProfile?.institutionId) {
      // By default all standard SAT features are active for licensed institutions
      return { 
        hasAccess: true, 
        reason: 'granted', 
        institutionName: userProfile.institutionName || 'Partner School' 
      };
    }

    // Fallback: Gated
    return { hasAccess: false, reason: 'subscription_required' };
  }, [userProfile, featureKey]);
}
