// Polyfill import.meta.env for Node execution
(globalThis as any).importMetaEnv = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef'
};

import { initialTextbooks } from '../src/data/textbooks';
import { initialSatQuestions } from '../src/data/sat-questions';
import { DOMAIN_SUBJECT_MAP, DOMAIN_NAMES } from '../src/pages/student/sat/SatTextbooks';
import { SkillUnderstandingMetrics, SatDomain } from '../src/types';

console.log('===========================================================');
console.log('🧠 RUNNING STUDENT UNDERSTANDING ENGINE & NAVIGATOR AUDIT');
console.log('===========================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Details: ${detail}`);
    failCount++;
  }
}

// 1. Test 4-Stage Navigator Consistency
console.log('--- 1. Testing 4-Stage Progressive Navigator ---');
const mathDomains = Object.keys(DOMAIN_SUBJECT_MAP).filter(
  d => DOMAIN_SUBJECT_MAP[d as SatDomain] === 'math'
);
const rwDomains = Object.keys(DOMAIN_SUBJECT_MAP).filter(
  d => DOMAIN_SUBJECT_MAP[d as SatDomain] === 'reading-writing'
);

assert(mathDomains.length === 4, `Math has exactly 4 domains: ${mathDomains.join(', ')}`);
assert(rwDomains.length === 4, `Reading & Writing has exactly 4 domains: ${rwDomains.join(', ')}`);

// 2. Test Section Indexing and Depth
console.log('\n--- 2. Testing Section Depth and Breadcrumb Mapping ---');
let totalSections = 0;
initialTextbooks.forEach(book => {
  book.chapters?.forEach(ch => {
    ch.sections?.forEach(sec => {
      totalSections++;
      assert(
        sec.workedExamples.length >= 1,
        `Section [${sec.sectionNumber} ${sec.title}] has >= 1 worked examples (${sec.workedExamples.length})`
      );
    });
  });
});
assert(totalSections >= 8, `Total searchable sections in curriculum: ${totalSections}`);

// 3. Test Student Understanding Engine Telemetry & Error Classification
console.log('\n--- 3. Testing Student Understanding Engine Models ---');

// Mock skill tracker simulation
function simulateSkillProgress(
  attempts: boolean[],
  paces: number[],
  textbookReviews: number,
  remediationSuccess: number
): SkillUnderstandingMetrics {
  const total = attempts.length;
  const correct = attempts.filter(Boolean).length;
  const accuracy = Math.round((correct / total) * 100);
  const avgPace = Math.round(paces.reduce((a, b) => a + b, 0) / paces.length);

  let paceStatus: 'fast' | 'optimal' | 'deliberate' | 'slow' = 'optimal';
  if (avgPace < 30) paceStatus = 'fast';
  else if (avgPace <= 75) paceStatus = 'optimal';
  else if (avgPace <= 110) paceStatus = 'deliberate';
  else paceStatus = 'slow';

  let tier: 'beginner' | 'intermediate' | 'expert' = 'intermediate';
  if (accuracy >= 80 && total >= 4) tier = 'expert';
  else if (accuracy < 50 && total >= 4) tier = 'beginner';

  let errorClassification: 'none' | 'retrieval' | 'conceptual' | 'fluency' = 'none';
  if (accuracy < 60) {
    if (remediationSuccess > 0 && remediationSuccess / Math.max(1, textbookReviews) >= 0.6) {
      errorClassification = 'retrieval';
    } else {
      errorClassification = 'conceptual';
    }
  } else if (paceStatus === 'slow') {
    errorClassification = 'fluency';
  }

  let growthFraming = `Linear Equations: steady progression.`;
  if (accuracy >= 80) growthFraming = `Linear Equations: strong mastery. Ready for advanced timed challenges.`;
  else if (accuracy >= 50) growthFraming = `Linear Equations: consistent practice building precision. Focus this week: timed accuracy.`;
  else growthFraming = `Linear Equations: this week's active focus area. Recommended: explore step-by-step textbook models.`;

  return {
    skill: 'Linear Equations',
    domain: 'algebra',
    attempts: total,
    correct,
    accuracy,
    averagePaceSeconds: avgPace,
    expectedPaceSeconds: 75,
    paceStatus,
    textbookReviewCount: textbookReviews,
    remediationAttempts: textbookReviews,
    remediationSuccessCount: remediationSuccess,
    errorClassification,
    currentPacingTier: tier,
    growthFraming,
    lastAttemptAt: new Date().toISOString()
  };
}

// Case A: Student with Retrieval Error (Misses cold, but gets right after textbook review)
const retrievalStudent = simulateSkillProgress([false, false, false, false], [60, 55, 65, 58], 4, 3);
assert(
  retrievalStudent.errorClassification === 'retrieval',
  `Student who succeeds after textbook review is classified as [retrieval] error`
);

// Case B: Student with Conceptual Error (Misses cold and continues to miss after textbook review)
const conceptualStudent = simulateSkillProgress([false, false, false, false], [90, 85, 95, 100], 4, 0);
assert(
  conceptualStudent.errorClassification === 'conceptual',
  `Student who continues to miss after review is classified as [conceptual] error`
);

// Case C: Student with High Accuracy but Slow Pace
const fluencyStudent = simulateSkillProgress([true, true, true, true], [125, 130, 120, 140], 0, 0);
assert(
  fluencyStudent.errorClassification === 'fluency',
  `Student with 100% accuracy but >110s pace is classified as [fluency] focus`
);

// 4. Test Framing Rule: Non-Deficit Language Enforcement
console.log('\n--- 4. Testing Non-Deficit Growth Framing Rule ---');
const prohibitedDeficitWords = ['weak', 'failing', 'poor', 'bad', 'incompetent', 'dumb', 'behind'];
[retrievalStudent, conceptualStudent, fluencyStudent].forEach(sample => {
  const lower = sample.growthFraming.toLowerCase();
  const foundDeficit = prohibitedDeficitWords.some(word => lower.includes(word));
  assert(
    !foundDeficit,
    `Framing string contains zero deficit language: "${sample.growthFraming}"`
  );
});

console.log('\n===========================================================');
console.log(`Understanding Engine Audit Results: ${passCount} PASSED, ${failCount} FAILED`);
console.log('===========================================================');

if (failCount > 0) {
  process.exit(1);
}
