// Polyfill import.meta.env for Node execution
(globalThis as any).importMetaEnv = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef'
};

import { initialSatQuestions } from '../src/data/sat-questions';
import { 
  buildPracticeQuestionPool, 
  SAT_SUBJECT_DOMAINS, 
  DOMAIN_METADATA,
  SatSubjectSection 
} from '../src/pages/student/sat/SatPractice';
import { SatDomain } from '../src/types';

console.log('====================================================');
console.log('🧪 RUNNING AUTOMATED PRACTICE FILTERING AUDIT & TESTS');
console.log('====================================================\n');

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

// 1. Test every single domain in topic mode
const allDomains = [
  ...SAT_SUBJECT_DOMAINS['math'],
  ...SAT_SUBJECT_DOMAINS['reading-writing']
];

console.log('--- 1. Testing Domain-Specific Filtering Integrity ---');
allDomains.forEach(domain => {
  const meta = DOMAIN_METADATA[domain];
  const pool = buildPracticeQuestionPool('topic', meta.section, domain);
  const actualInBank = initialSatQuestions.filter(q => q.domain === domain).length;

  // Assert pool size matches bank or tier subset
  assert(
    pool.length <= actualInBank,
    `Domain [${domain}] pool length (${pool.length}) is <= total bank items (${actualInBank})`
  );

  // Assert 100% of questions returned strictly match this domain
  const foreignQuestions = pool.filter(q => q.domain !== domain);
  assert(
    foreignQuestions.length === 0,
    `Domain [${domain}] has 0 foreign questions (100% match)`
  );

  // Assert section matches
  const foreignSections = pool.filter(q => q.section !== meta.section);
  assert(
    foreignSections.length === 0,
    `Domain [${domain}] has 0 cross-subject questions`
  );
});

console.log('\n--- 2. Testing Pool Counts Differ Across Topics ---');
const infoIdeasPool = buildPracticeQuestionPool('topic', 'reading-writing', 'information-ideas');
const craftStructurePool = buildPracticeQuestionPool('topic', 'reading-writing', 'craft-structure');
const algebraPool = buildPracticeQuestionPool('topic', 'math', 'algebra');

assert(
  infoIdeasPool.length !== craftStructurePool.length,
  `Information & Ideas count (${infoIdeasPool.length}) differs from Craft & Structure count (${craftStructurePool.length})`
);

assert(
  algebraPool.length !== infoIdeasPool.length,
  `Algebra count (${algebraPool.length}) differs from Information & Ideas count (${infoIdeasPool.length})`
);

console.log('\n--- 3. Testing Subject-Level Mixed Practice Scoping ---');
const mathMixedPool = buildPracticeQuestionPool('mixed', 'math', 'algebra');
const rwMixedPool = buildPracticeQuestionPool('mixed', 'reading-writing', 'information-ideas');

const nonMathInMathMixed = mathMixedPool.filter(q => q.section !== 'math');
assert(
  nonMathInMathMixed.length === 0,
  `Math Mixed pool has 0 Reading & Writing questions (${mathMixedPool.length} Math items total)`
);

const nonRwInRwMixed = rwMixedPool.filter(q => q.section !== 'reading-writing');
assert(
  nonRwInRwMixed.length === 0,
  `R&W Mixed pool has 0 Math questions (${rwMixedPool.length} R&W items total)`
);

console.log('\n--- 4. Testing Empty State Handlers (Unseeded Domains) ---');
// If a hypothetical or empty domain has 0 questions
const emptyTest = buildPracticeQuestionPool('topic', 'math', 'non-existent-domain' as SatDomain);
assert(
  emptyTest.length === 0,
  `Empty domain query returns empty array [] without falling back to R&W`
);

console.log('\n====================================================');
console.log(`Audit Results: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
