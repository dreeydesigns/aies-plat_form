import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AgentEvent, MisconceptionCase } from '../context/AppContext';

/**
 * Collective Intelligence Substrate (Pillar K)
 * Multi-agent shared blackboard & persistent case-memory system.
 */

export async function logBlackboardEvent(event: Omit<AgentEvent, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'agentEvents'), event);
    return docRef.id;
  } catch (error) {
    console.error('Failed to log blackboard agent event:', error);
    return '';
  }
}

export async function recordStudentMisconception(params: {
  studentId: string;
  studentName?: string;
  concept: string;
  subject: string;
  gradeLevel?: string;
  misconceptionDescription: string;
  suggestedStrategy?: string;
}): Promise<void> {
  const { studentId, studentName, concept, subject, gradeLevel = 'K-12', misconceptionDescription, suggestedStrategy = 'Socratic Analogy & Visual Breakdown' } = params;

  // 1. Log event to Shared Blackboard
  await logBlackboardEvent({
    type: 'misconception_flagged',
    studentId,
    studentName,
    payload: { concept, subject, misconceptionDescription, suggestedStrategy },
    producedBy: 'diagnostician',
    confidenceScore: 0.85,
    createdAt: new Date().toISOString()
  });

  // 2. Query or create misconceptionCase record in Case-Memory
  try {
    const casesRef = collection(db, 'misconceptionCases');
    const q = query(casesRef, where('concept', '==', concept));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(casesRef, {
        concept,
        subject,
        gradeLevel,
        misconceptionDescription,
        remediationsAttempted: [
          { strategy: suggestedStrategy, attempts: 1, successCount: 1 }
        ],
        updatedAt: new Date().toISOString()
      });
    } else {
      const matchDoc = snapshot.docs[0];
      const data = matchDoc.data() as MisconceptionCase;
      const existingRemediations = data.remediationsAttempted || [];
      const stratIdx = existingRemediations.findIndex(r => r.strategy === suggestedStrategy);

      if (stratIdx >= 0) {
        existingRemediations[stratIdx].attempts += 1;
      } else {
        existingRemediations.push({ strategy: suggestedStrategy, attempts: 1, successCount: 1 });
      }

      await updateDoc(doc(db, 'misconceptionCases', matchDoc.id), {
        remediationsAttempted: existingRemediations,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (e) {
    console.error('Error updating misconception case memory:', e);
  }
}

export async function getBestRemediationStrategy(concept: string): Promise<{ strategy: string; confidence: number; caseCount: number }> {
  try {
    const casesRef = collection(db, 'misconceptionCases');
    const q = query(casesRef, where('concept', '==', concept));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as MisconceptionCase;
      if (data.remediationsAttempted && data.remediationsAttempted.length > 0) {
        // Sort by success rate
        const sorted = [...data.remediationsAttempted].sort((a, b) => (b.successCount / Math.max(1, b.attempts)) - (a.successCount / Math.max(1, a.attempts)));
        const top = sorted[0];
        const confidence = Math.round((top.successCount / Math.max(1, top.attempts)) * 100) / 100;
        return { strategy: top.strategy, confidence, caseCount: top.attempts };
      }
    }
  } catch (e) {
    console.error('Error fetching best remediation strategy:', e);
  }

  return { strategy: 'Socratic Step-by-Step Breakdown', confidence: 0.7, caseCount: 1 };
}

export async function logRemediationOutcome(params: {
  studentId: string;
  concept: string;
  improved: boolean;
  strategyUsed: string;
}): Promise<void> {
  const { studentId, concept, improved, strategyUsed } = params;

  await logBlackboardEvent({
    type: 'outcome_logged',
    studentId,
    payload: { concept, improved, strategyUsed },
    producedBy: 'contentCurator',
    confidenceScore: improved ? 0.95 : 0.4,
    createdAt: new Date().toISOString()
  });

  try {
    const casesRef = collection(db, 'misconceptionCases');
    const q = query(casesRef, where('concept', '==', concept));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const matchDoc = snapshot.docs[0];
      const data = matchDoc.data() as MisconceptionCase;
      const existingRemediations = data.remediationsAttempted || [];
      const stratIdx = existingRemediations.findIndex(r => r.strategy === strategyUsed);

      if (stratIdx >= 0) {
        existingRemediations[stratIdx].attempts += 1;
        if (improved) existingRemediations[stratIdx].successCount += 1;
        await updateDoc(doc(db, 'misconceptionCases', matchDoc.id), {
          remediationsAttempted: existingRemediations,
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (e) {
    console.error('Error updating remediation outcome in case memory:', e);
  }
}
