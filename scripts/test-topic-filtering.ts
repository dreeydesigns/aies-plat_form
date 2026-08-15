import { initialSatQuestions } from '../src/data/sat-questions';
import { SatDomain } from '../src/types';

console.log('=== SAT QUESTION DOMAIN INTEGRITY AUDIT ===');
console.log('Total questions in memory:', initialSatQuestions.length);

const allDomains: SatDomain[] = [
  'algebra',
  'advanced-math',
  'problem-solving-data-analysis',
  'geometry-trigonometry',
  'information-ideas',
  'craft-structure',
  'expression-of-ideas',
  'standard-english-conventions'
];

const countsByDomain: Record<string, number> = {};
allDomains.forEach(d => {
  const matching = initialSatQuestions.filter(q => q.domain === d);
  countsByDomain[d] = matching.length;
  console.log(`Domain [${d}]: ${matching.length} questions`);

  // Assert all matching questions strictly belong to this domain
  matching.forEach(q => {
    if (q.domain !== d) {
      console.error(`MISMATCH! Question ${q.id} has domain ${q.domain} but was found in ${d}`);
    }
  });
});

console.log('=== DOMAIN AUDIT COMPLETE ===');
