import { initialTextbooks } from '../src/data/textbooks';

console.log('======================================================');
console.log('📚 RUNNING AUTOMATED TEXTBOOK LIBRARY STRUCTURE AUDIT');
console.log('======================================================\n');

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

// 1. Audit Textbooks and Subject Grouping
console.log('--- 1. Testing Subject-First Categorization ---');
const mathBooks = initialTextbooks.filter(b => b.subject === 'math');
const rwBooks = initialTextbooks.filter(b => b.subject === 'reading-writing');

assert(mathBooks.length >= 2, `Math has >= 2 textbooks (${mathBooks.length} found)`);
assert(rwBooks.length >= 2, `Reading & Writing has >= 2 textbooks (${rwBooks.length} found)`);

// 2. Audit 4-Level Information Architecture
console.log('\n--- 2. Testing 4-Level Information Architecture ---');
initialTextbooks.forEach(book => {
  assert(
    !!book.id && !!book.title && (book.subject === 'math' || book.subject === 'reading-writing'),
    `Textbook [${book.title}] has valid ID, title, and subject (${book.subject})`
  );

  assert(
    !!book.chapters && book.chapters.length > 0,
    `Textbook [${book.title}] contains ${book.chapters?.length || 0} structured chapters`
  );

  book.chapters?.forEach(ch => {
    assert(
      !!ch.id && !!ch.title && !!ch.domain,
      `Chapter [${ch.title}] has ID, title, and mapped domain [${ch.domain}]`
    );

    assert(
      !!ch.sections && ch.sections.length > 0,
      `Chapter [${ch.title}] contains ${ch.sections.length} structured skill sections`
    );

    ch.sections?.forEach(sec => {
      assert(
        sec.conceptSummary.length > 20,
        `Section [${sec.sectionNumber} ${sec.title}] has in-depth concept summary`
      );

      assert(
        sec.workedExamples.length > 0,
        `Section [${sec.sectionNumber} ${sec.title}] has ${sec.workedExamples.length} calibrated worked examples`
      );
    });
  });
});

// 3. Audit Living Textbook Changelog & Growth
console.log('\n--- 3. Testing Living Textbook Changelog & Growth Log ---');
initialTextbooks.forEach(book => {
  assert(
    !!book.changelog && book.changelog.length > 0,
    `Textbook [${book.title}] has living changelog (${book.changelog?.length || 0} entries, version: ${book.version})`
  );

  book.changelog?.forEach(entry => {
    assert(
      !!entry.date && !!entry.summary && entry.sectionsAdded > 0,
      `Changelog entry [${entry.id}] has valid date, summary, and sectionsAdded count (${entry.sectionsAdded})`
    );
  });
});

// 4. Audit Cross-Referencing and Related Topics
console.log('\n--- 4. Testing Topic Cross-Referencing & Bridges ---');
let crossRefFound = 0;
initialTextbooks.forEach(book => {
  book.chapters?.forEach(ch => {
    ch.sections?.forEach(sec => {
      if (sec.relatedTopics && sec.relatedTopics.length > 0) {
        crossRefFound += sec.relatedTopics.length;
        sec.relatedTopics.forEach(rel => {
          assert(
            !!rel.title && !!rel.textbookId,
            `Cross-reference [${sec.title} -> ${rel.title}] points to textbook [${rel.textbookId}]`
          );
        });
      }
    });
  });
});

assert(crossRefFound >= 4, `Total cross-referenced related topics: ${crossRefFound}`);

console.log('\n======================================================');
console.log(`Textbook Audit Results: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================');

if (failCount > 0) {
  process.exit(1);
}
