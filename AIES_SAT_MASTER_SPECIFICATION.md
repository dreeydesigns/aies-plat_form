# AIES SAT — Master Implementation Blueprint v4 (Unified)

**For the AI App Builder — Copy-Paste This Entire Document**  
**Repository:** https://github.com/dreeydesigns/aies-plat_form

**Status:** This document supersedes all previous AIES SAT specifications (Blueprint, v2, v3, Textbook Content Plan, Institution Structure, Dynamic Navigator, and Student Understanding Engine). It is the single source of truth.

**Read this entire document once before writing any code.** Do not skip sections.

---

## 0. Standing Directive: Comprehension, Not Storage

*This directive applies to every single data feed into AIES — question banks, teacher exams, student performance logs, textbook source material. It does not get restated per document; this is where it lives permanently.*

Every time AIES is fed new information, the system must treat it as **training signal to synthesize and generalize from**, not as a static record to store and retrieve verbatim.

**Concretely, this means:**

| Data Type | What NOT to do | What TO do |
|-----------|---------------|------------|
| Question-bank data | File it away as a static record | Sharpen the AI's ability to *generate new, original questions and explanations* on that skill unprompted, at any difficulty |
| Teacher's uploaded exam | Store it as "a test" | Use its topics, phrasing patterns, and difficulty choices to inform how the AI teaches and generates content going forward |
| Student performance data | Log an outcome | Continuously refine how the system explains, paces, and sequences content for that individual student |

**The end goal:** A student should be able to learn a skill to mastery inside AIES with zero teacher involvement — searching, reading, practicing, and being corrected entirely through the AI's own accumulated understanding.

**This directive governs every ingestion pipeline, every AI call, and every adaptation decision in this system.**

---

## 1. Institution Hierarchy & Content Authority

### 1.1 The Problem

Student/Parent/Teacher/Admin are flat roles. Nothing records which school, class, or department someone belongs to. Adding Principal/Deputy/HOD titles on top of a flat structure would just be more flat roles with fancier names. The mixing would continue.

### 1.2 Hierarchy Structure

```
AIES Central (platform owner — maintains the Global Core Library)
  └─ Institution (a school; fully isolated from other institutions)
       ├─ Principal (full institution admin)
       ├─ Deputy Principal (delegated institution admin)
       ├─ Head of Department, per subject (e.g. HOD Math, HOD English)
       │    └─ approves institution-level textbook additions in their subject
       ├─ Class Teacher (assigned to specific Class(es), specific subject)
       │    └─ creates/assigns tests, uploads source material for their classes
       └─ Class (e.g. "Grade 11 — Section A")
            ├─ enrolled Students
            └─ linked Parents (per student)
```

**Isolation rule:** Nothing an Institution's teachers, HODs, or students do is visible to another Institution — separate classes, separate uploaded content, separate progress data.

### 1.3 Roles & Permissions

| Role | Scope | Can | Cannot |
|------|-------|-----|--------|
| **AIES Central** | Global | Maintain/edit Global Core Library, promote institution content into it, oversee cross-institution quality | — |
| **Principal** | Institution-wide | Manage all departments, classes, staff accounts within their institution; view institution-wide progress | Edit another institution's data; edit Global Core Library directly |
| **Deputy Principal** | Institution-wide | Same as Principal, typically delegated day-to-day | Same limits as Principal |
| **Head of Department** | Their subject, institution-wide | Approve/reject textbook additions in their subject for their institution; view all classes teaching that subject | Approve content outside their subject; publish directly to Global Core |
| **Class Teacher** | Their assigned Class(es) | Create/assign tests, upload source PDFs, view their own students' progress | Approve their own uploads for institution-wide publishing (goes to HOD) |
| **Student** | Themselves | Practice, take tests, view own reports, use Textbook Library | See other students' data |
| **Parent** | Linked child only | View linked child's progress (read-only) | Edit anything |

### 1.4 Content Authority Ladder (Three Tiers)

| Tier | Scope | Workflow | Approval |
|------|-------|----------|----------|
| **Tier 1** | Class-scoped | Teacher uploads PDF or generates questions for *their own class only* | No approval needed — doesn't touch shared Textbook Library |
| **Tier 2** | Institution Library | Teacher wants content to become part of institution's shared Textbook Library | Routes to subject's HOD for approval before publishing |
| **Tier 3** | Global Core Library | Exceptional, high-quality institution content promoted platform-wide | AIES Central review required |

**Why three tiers:** A single flat "teacher uploads → HOD approves → published to everyone" rule would let content drift differently at every institution with no shared floor of quality. Tier 3 keeps the *core* SAT curriculum consistent platform-wide, while Tiers 1–2 still give every institution real flexibility to extend locally.

---

## 2. Unified Data Model (Firestore)

All timestamps are ISO 8601 strings. Use subcollections for unbounded arrays to avoid document size limits.

### 2.1 Users, Institutions, Departments, Classes

```typescript
// institutions/{institutionId}
interface Institution {
  id: string;
  name: string;
  principalUid: string;
  deputyPrincipalUid?: string;
  createdAt: string;
  updatedAt: string;
}

// departments/{departmentId}
interface Department {
  id: string;
  institutionId: string;
  subject: 'math' | 'rw';
  hodUid: string;
  createdAt: string;
}

// classes/{classId}
interface Class {
  id: string;
  institutionId: string;
  departmentId: string;
  name: string;
  classTeacherUid: string;
  studentUids: string[];
  createdAt: string;
}

// users/{uid}
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'aies_central' | 'principal' | 'deputy_principal' | 'hod' | 'class_teacher' | 'student' | 'parent';
  institutionId?: string;           // null for AIES Central / unaffiliated
  departmentId?: string;            // hod, class_teacher only
  classIds?: string[];              // class_teacher (assigned), student (enrolled)
  dateOfBirth?: string;             // ISO, required for students
  age?: number;
  linkedParentUid?: string | null;  // student only
  linkedStudentUids?: string[];     // parent only
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  targetTestDate?: string;
  targetScore?: number;             // 400-1600
  consent: {
    deviceSync: boolean;
    cameraWellness: boolean;
    whatsappNotifications: boolean;
    updatedAt: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    dyslexiaFont: boolean;
    highContrast: boolean;
    dataLightMode: boolean;
  };
  accessibility: {
    screenReader: boolean;
    textToSpeech: boolean;
    speechToText: boolean;
    zoomLevel: number;
    extendedTimeMultiplier: number;   // 1.0, 1.5, 2.0, etc.
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

### 2.2 Textbook Library — Normalized Collections

```typescript
// textbooks/{textbookId}
interface Textbook {
  id: string;
  title: string;
  subject: 'math' | 'rw';
  description: string;
  domainGroup: 'math-foundations' | 'math-advanced' | 'reading-writing' | 'grammar';
  status: 'draft' | 'published' | 'archived';
  version: number;
  chapterCount: number;
  sectionCount: number;
  pageCount: number;                // Total pages of actual content
  lastUpdated: string;
  changelog: Array<{
    date: string;
    event: 'section_added' | 'section_updated' | 'textbook_created';
    description: string;
    triggeredBy: string;            // uid
    approvedBy?: string;            // uid
  }>;
  createdAt: string;
  updatedAt: string;
}

// textbookChapters/{chapterId}
interface TextbookChapter {
  id: string;
  textbookId: string;
  chapterNumber: number;
  title: string;
  domain: string;                   // e.g. 'Algebra', 'Craft and Structure'
  order: number;
  sectionCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// textbookSections/{sectionId}
interface TextbookSection {
  id: string;
  chapterId: string;
  textbookId: string;
  sectionNumber: number;
  title: string;
  skill: string;                    // e.g. 'Words in Context', 'Linear equations in one variable'
  type: 'concept-intro' | 'core-method' | 'worked-example' | 'common-mistakes' | 'practice-checkpoint';
  order: number;
  pageNumber: number;
  lineRef: string;                  // stable anchor like 'sec-{sectionId}'
  contentBlocks: ContentBlock[];
  questionIds: string[];            // Q&A entries
  relatedSectionIds: string[];      // Cross-references
  createdAt: string;
  updatedAt: string;
}

interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'math' | 'diagram' | 'callout' | 'table' | 'question';
  text?: string;
  items?: string[];
  mathLatex?: string;
  imageUrl?: string;
  caption?: string;
}

// textbookPages/{pageId}
interface TextbookPage {
  id: string;
  textbookId: string;
  pageNumber: number;
  text: string;                     // plain text for search
  sectionIds: string[];
  updatedAt: string;
}
```

### 2.3 Questions & Q&A Entries

```typescript
// questions/{qid}
interface Question {
  id: string;
  subject: 'math' | 'rw';
  domain: string;                   // official SAT domain
  skill: string;                    // official SAT skill
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'student_produced_response';
  stem: string;
  choices?: { A: string; B: string; C: string; D: string };
  correctChoice?: 'A' | 'B' | 'C' | 'D';
  correctAnswer?: number | string;  // for SPR
  explanation: string;
  sourceTextbookId?: string;
  sourcePage?: number;
  sourceLineRef?: string;
  generatedBy: 'human' | 'ai';
  generatedFromPrompt?: string;
  modelVersion?: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  variantOf?: string;
  stats: {
    attempts: number;
    correct: number;
    avgTimeMs: number;
    difficultyScore: number;        // IRT-like, updated nightly
  };
  createdByUid: string;
  reviewedByUid?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// qaEntries/{qaId} — Q&A entries within textbook sections (can reference same questions)
interface QAEntry {
  id: string;
  sectionId: string;
  textbookId: string;
  questionId: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;              // In-depth, method-focused
  difficulty: 'beginner' | 'intermediate' | 'expert';
  sourceTextbookRef?: {
    textbookId: string;
    page: number;
    highlightedText: string;
  };
  similarQuestionIds: string[];     // Same skill/difficulty
  relatedSectionIds: string[];      // Related topics
  createdAt: string;
}
```

### 2.4 Attempts & Responses

```typescript
// attempts/{attemptId}
interface Attempt {
  id: string;
  studentUid: string;
  mode: 'trial' | 'topic_practice' | 'full_practice' | 'official';
  subject: 'math' | 'rw' | 'full';
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  currentModule: number;             // 1 or 2
  startedAt: string;
  lastSavedAt: string;
  completedAt?: string;
  score?: {
    rawMath?: number;
    rawRW?: number;
    scaledMath?: number;
    scaledRW?: number;
    composite?: number;
  };
  classification?: {
    math?: 'beginner' | 'intermediate' | 'expert';
    rw?: 'beginner' | 'intermediate' | 'expert';
  };
  deviceInfo?: {
    os: string;
    browser: string;
    screenSize: string;
    userAgent: string;
  };
  breakLogs: Array<{ startAt: string; endAt: string; reason: string }>;
  fiveFingerSummary?: {
    used: number;
    wrong: number;
    lucky: number;
    unexpectedWrong: number;
  };
}

// Subcollection: attempts/{attemptId}/responses/{responseId}
interface Response {
  questionId: string;
  questionVersion: number;
  selectedChoice?: string;
  selectedAnswer?: string | number;
  isCorrect: boolean;
  timeToAnswerMs: number;
  revisitCount: number;
  markedForReview: boolean;
  crossedOutChoices: string[];
  fiveFinger?: {
    used: boolean;
    reason?: 'too_slow' | 'between_two' | 'dont_know' | 'trap_answer' | 'other';
  };
  savedAt: string;
}
```

### 2.5 Other Collections

```typescript
// assignedTests/{assignedTestId}
interface AssignedTest {
  id: string;
  teacherUid: string;
  institutionId?: string;
  classIds?: string[];
  studentUids?: string[];
  testConfig: {
    subject: 'math' | 'rw';
    domain?: string;
    skill?: string;
    difficultyTarget?: 'easy' | 'medium' | 'hard' | 'mixed';
    questionIds?: string[];
    dueDate?: string;
  };
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// notifications/{notifId}
interface Notification {
  id: string;
  toUid: string;
  type: 'test_assigned' | 'report_ready' | 'parent_link_invite' | 'level_up' | 'digest';
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// contentApprovalQueue/{itemId}
interface ContentApprovalItem {
  id: string;
  contentType: 'question' | 'lesson' | 'chapter' | 'textbook' | 'qa_entry';
  contentId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedByUid: string;
  reviewedByUid?: string;
  comments?: string;
  createdAt: string;
  reviewedAt?: string;
}

// scoreConversionTables/{version}
interface ScoreConversionTable {
  version: string;
  mathRawToScaled: Record<number, number>;
  rwRawToScaled: Record<number, number>;
  updatedAt: string;
}

// fiveFingerLogs/{logId}
interface FiveFingerLog {
  id: string;
  userId: string;
  attemptId: string;
  responseId: string;
  questionId: string;
  reason: string;
  wasCorrect: boolean;
  timeSeconds: number;
  module: 1 | 2;
}

// agentEvents/{eventId}
interface AgentEvent {
  id: string;
  agent: 'orchestrator' | 'diagnostician' | 'tutor' | 'pedagogy_research' | 'content_curator' | 'grading';
  type: string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
}

// misconceptionCases/{caseId}
interface MisconceptionCase {
  id: string;
  concept: string;
  domain: string;
  skill: string;
  description: string;
  embedding: number[];              // vector
  remediationsAttempted: Array<{
    strategy: string;
    attempts: number;
    successCount: number;
    lastUsedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// libraryContent/{contentId}
interface LibraryContent {
  id: string;
  scope: 'global' | 'institution';
  institutionId?: string;
  status: 'pending_hod_review' | 'pending_central_review' | 'published' | 'rejected';
  uploadedByUid: string;
  reviewedByUid?: string;
  reviewedAt?: string;
  sourceFileRef?: string;
  domain: string;
  skill: string;
  textbookId: string;
  chapterId: string;
  sectionId: string;
  content: string;
  questionRefs: string[];
  createdAt: string;
  updatedAt: string;
}
```

**Save cadence for attempts:** Write `attempts/{attemptId}` on every answer selection and every navigation event (next/back/flag), debounced to 400ms. Never batch across a full section — a mid-section refresh must not lose more than the last ~1 question's state.

---

## 3. Student Onboarding & Role Management

### 3.1 Signup flow

- Public signup defaults to `student`. No role selection on the student signup screen.
- Collect `displayName`, `dateOfBirth` on first signup.
- If age < 13, require parent consent to activate (COPPA). If age 13–17, allow account creation but show persistent parent-linking banner.
- If age ≥ 18, no parent linking required.
- Teacher accounts are created via admin invitation or institution provisioning.
- Parent accounts created when student invites parent or parent creates account and generates invite code.
- Admin accounts manually provisioned by existing admins.

### 3.2 Onboarding screens

#### Page 1: Sign in / Create account
- Email/password or Google.
- Fields: email, password, displayName, dateOfBirth.
- Validation inline, not toast.
- CTA: **Create account**, **Sign in**.

#### Page 1a: Parent linking (students under 18)
- Two paths: invite parent (enter email) or enter parent invite code.
- **Non-blocking:** student can skip and reach dashboard; persistent banner remains until linked.

#### Page 2: Profile setup
- Target test date (date picker)
- Target score (slider 400–1600)
- Optional baseline score
- No grade-level or subject selector.

#### Page 3: Dashboard
- Greeting: `Welcome back, {firstName}`
- **Your Tests** — Active | Past toggle
  - Active empty state: “No upcoming tests. Official tests appear here once your teacher schedules one.”
  - Past empty state: “Nothing here yet — your completed tests will show up.”
- **Practice & Prepare** — Active | Past toggle
  - Two cards only: **Test Preview**, **Full-Length Practice**
- No settings icon or promo banners.

#### Page 4: Test Preview intro
- Three info blocks:
  1. What this is — sample questions, tools, no score/feedback.
  2. Untimed — real sessions are timed; preview is not.
  3. Accessibility — practice with any assistive tools you use.
- CTA: **Start preview**

#### Page 5: Choose subject
- Heading: **Choose subject**
- Dropdown: `Math`, `Reading & Writing`
- CTA disabled until selection.

#### Page 6: Question screen base layout
- Header: section label, timer (only timed modes), Tools menu, Calculator/Reference sheet (Math only).
- Two-pane split: left passage/stimulus; right question stem, choices, mark for review.
- Footer: Back, navigator pill, Cross-out, Next.

#### Page 6.1: Section navigator
- Grid of question numbers with states: Current, Answered, Unanswered, For Review.
- Tap to jump.
- **Go to review page** button.

#### Page 6.2: More/Tools menu
1. Help
2. Keyboard shortcuts
3. Accessibility
4. Line reader
5. Take a break (timed sessions only)
6. Exit

#### Page 6.3: Cross-out tool
- Toggle in footer.
- Tap small circular icon on a choice to strike/dim it.
- **Undo** link next to struck choice.
- Struck choices remain selectable.

#### Page 6.4: Accessibility panel
- Text-to-Speech
- Speech-to-Text
- Screen reader support
- Zoom & magnification
- Math rendering
- Link to referenced source
- Extended time indicator (if applicable)

#### Page 7: Review page
- Full grid of questions with status.
- Copy: “On a timed test, you can’t move to the next section until time is up. In practice mode, tap Next whenever you’re ready.”
- CTA: **Next**, **Back**

#### Page 8: Save & transition
- Copy: “Section complete. Your progress is saved — you can safely close this and pick up later.”
- Auto-advance after 2 seconds or tap.
- Do not use alarming language.

#### Page 9: Exit flow
- Preview/trial: “Exit this preview? Since it’s untimed practice, nothing is scored — but if you’d like to pick this exact spot back up, tap Continue instead.”
- Official/timed: “Exit the test? Your progress up to this point is saved. You can resume from where you left off.”

---

## 4. Textbook Library — Four-Level Architecture & Navigation

### 4.1 Hierarchy (Four Levels, Not One)

```
Subject (Math / Reading & Writing)
  └─ Textbook (a bound collection, e.g. "Foundations of Digital SAT Math")
       └─ Chapter (= Domain, e.g. "Craft and Structure")
            └─ Section (= Skill, e.g. "Words in Context")
                 └─ Q&A entries (individual questions + in-depth answers)
```

A student never browses "the textbook" as a flat thing — they browse a subject, land in a chapter, work through a skill section. The textbook is a spine, not a page.

### 4.2 Library Landing Page — Redesign

- Group into two clearly labeled sections: **Reading & Writing** and **Math**.
- Every textbook card carries a subject badge (icon + label), not just a color gradient.
- Card shows: title, subject badge, chapter count, section count, page count, last updated date.
- Search bar sits at the top of this page, always visible.

### 4.3 Dynamic Navigator (Progressive Filtering)

**Problem this solves:** with 4 hierarchy levels and growing content, a student needs to narrow down to exactly what they want in a few taps.

**Filter bar (sticky, top of Library page):**

Four filter stages, left to right, each populated only with options valid given the prior selection:

| Stage | Field | Options |
|-------|-------|---------|
| 1 | Subject | Math / Reading & Writing |
| 2 | Domain | Dynamically populated based on Subject |
| 3 | Skill | Dynamically populated based on Domain |
| 4 | Difficulty *(optional)* | Easy / Medium / Hard |

Live result count shown at all times: *"Showing 12 sections"* → narrows as filters apply → *"Showing 1 section: Words in Context."*

**Breadcrumb (always visible once inside a section):**

`Library > Math > Algebra > Linear Equations in One Variable`

Each breadcrumb segment is clickable and jumps back up a level.

### 4.4 Search-First Entry Point

The AI search bar sits above the filter bar, not instead of it. A student can either:

- **Search** — type a topic, land directly on ranked sections (up to 5 results)
- **Filter** — progressively narrow via the 4-stage bar

Both paths converge on the same breadcrumb-anchored section page.

**State & deep-linking:** Filter state and search results must be URL-addressable (`?subject=math&domain=algebra&skill=linear-equations`) so remediation deep-links work.

### 4.5 Mobile Behavior

Filter bar collapses into a single "Filters" button opening a full-screen stacked sheet (Subject → Domain → Skill → Difficulty, one screen, scrollable).

### 4.6 Textbook Reader — Depth & Structure

**Target depth:** 40–100 real pages per textbook — actual generated content, not inflated page numbering.

**Depth scales with real source signal:**

| Skill | Source Signal | Depth |
|-------|---------------|-------|
| Words in Context | 518 questions | Deepest — most worked examples across all three difficulty tiers |
| Cross-Text Connections | 59 questions | Full depth per content plan — thin source data doesn't excuse a thin lesson |
| Math chapters | Once content exists | Follows same principle once source signal available |

**Reader navigation within a textbook:**
- Left rail: chapter (domain) list, expandable to sections (skills) — a real table of contents
- Main pane: current section's content — concept intro, method, worked examples per difficulty tier, common mistakes, then Q&A layout below

### 4.7 Section Page Layout (Q&A View)

**Two-pane layout:**

| Left Pane | Right Pane |
|-----------|------------|
| Current question | Full in-depth explanation (method, not just final answer) |
| **"Similar Questions"** list directly beneath (3–5 other questions from same skill/difficulty) | **"Related Topics"** block linking to other skills/sections genuinely connected to this one |

This layout reuses the same two-pane pattern from the test-taking screen.

### 4.8 Living Textbook — Growth From Teacher Exams

Every time a teacher creates or uploads a test:

1. **Scan the exam's questions** — extract domain/skill tags.
2. **Match against existing textbook chapters/sections** — if a matching section exists, append new question/explanation content to it.
3. **If no matching textbook/chapter exists yet** — auto-create the textbook and chapter shell, then populate it.
4. **Never auto-publish silently** — route generated/appended content through the same teacher-approval gate (Tier 2 → HOD approval).
5. **Log every growth event** — which exam triggered it, what was added, when, approved by whom. Show a changelog on each textbook card.

**Changelog display:** *"Last updated: 3 days ago, +6 sections from [Teacher] assessments"*

---

## 5. Content Generation & Copyright Rules

### 5.1 Copyright Compliance

The uploaded PDFs are College Board's proprietary Question Bank exports. **Do not copy, closely paraphrase, or restructure their question text, passages, or rationales into lesson content.**

| Allowed | Not Allowed |
|---------|-------------|
| Extract Domain, Skill, Difficulty, and topic frequency | Copy question stem, passage, or rationale |
| Use these signals to determine *what to teach and how much emphasis* | Use them as a template to rephrase |
| Generate fresh explanations, examples, practice questions | Write content that reads recognizably close to a source rationale |

If a generated lesson reads recognizably close to a source rationale, **rewrite it from a blank page**, not by editing the close version.

### 5.2 What a Complete Lesson Needs

Per skill, build:

1. **Concept introduction** — plain-language explanation, written for a first-time learner
2. **The core method** — a repeatable step-by-step approach the student can apply to any question of this type
3. **Worked examples at each difficulty tier** — Easy, Medium, Hard, each fully worked
4. **Common mistakes** — the specific wrong-answer patterns students fall into for this skill
5. **Practice checkpoint** — 3–5 original practice questions at the end of the lesson, difficulty-tagged
6. **Page-anchored structure** — every lesson section gets a stable page number and identifiable line references

**For Math specifically, add:**
7. **Diagrams and worked visuals** where relevant
8. **Full symbolic step-through**, not just a final numeric answer

### 5.3 AI Content Generation Pipeline

**Model routing:**
- Primary text generation: Gemini 1.5 Pro (or latest stable) via Vertex AI.
- High-volume/low-stakes generation: Gemini 1.5 Flash.
- Embeddings: Gecko or Gemini Embeddings via Vertex AI.
- Vector store: Vertex AI Matching Engine or Pinecone. Do not store vectors in Firestore.
- Model versioning: Every AI call stores `modelVersion` and `promptVersion`.

**Retrieval-augmented generation (RAG):**
1. Chunk all `textbookPages.text` into 500-token segments with 50-token overlap.
2. Embed chunks and store in vector DB.
3. On any content generation or tutor query, retrieve top-K chunks filtered by domain/skill if available.
4. Compose prompt with retrieved context and mandatory citations.
5. Require output to cite `textbookPage` / `sectionId` when using context.
6. If no context retrieved, mark output as low-confidence and route to human review.

**Prompt templates** stored in `promptTemplates/{id}` — see Appendix B.

**Human approval workflows:**
- **Permanent content:** All AI-generated questions, lessons, and chapters must be approved by a human before students see them.
- **Ephemeral content:** AI tutor messages and practice explanations are shown immediately but logged for audit. They are not graded artifacts.
- **Approval queue UI:** Teacher/Admin sees pending items, can approve, reject, or edit inline.
- **Audit trail:** Every AI output stores `promptId`, `modelVersion`, `timestamp`, `createdByUid`, `reviewedByUid`, `status`.

### 5.4 Question Generation Validation Rules

- Unique answer choices.
- Exactly four choices for MCQs.
- Valid SPR answers.
- Explanation length > 50 chars.
- Domain/skill/difficulty tags valid.
- No PII in output.
- Toxicity filter.
- Duplicate detection: compare embeddings against existing questions; if similarity > 0.85, regenerate.
- Difficulty calibration: After 50 attempts, recompute difficulty; if Easy <50% correct, flag; if Hard >80% correct, flag.

### 5.5 Official Domain/Skill Lists

Use these exact names for tagging. They are non-copyrightable test blueprint terms.

#### Reading & Writing

| Domain | Skills |
|---|---|
| Information and Ideas | Central Ideas and Details, Command of Evidence, Inferences |
| Craft and Structure | Words in Context, Text Structure and Purpose, Cross-Text Connections |
| Expression of Ideas | Rhetorical Synthesis, Transitions |
| Standard English Conventions | Boundaries, Form, Structure, and Sense |

#### Math

| Domain | Skills |
|---|---|
| Algebra | Linear equations in one variable, Linear functions, Linear inequalities, Systems of linear equations, Linear equations in two variables |
| Advanced Math | Equivalent expressions, Nonlinear equations in one variable, Systems of equations in two variables, Nonlinear functions |
| Problem-Solving and Data Analysis | Ratios, rates, proportional relationships; Percentages; One-variable data distributions; Two-variable data; Probability and conditional probability; Inference from sample statistics and margin of error; Evaluating statistical claims |
| Geometry and Trigonometry | Area and volume; Lines, angles, and triangles; Right triangles and trigonometry; Circles |

**Important correction:** The 51 PDFs are not 51 separate lessons. They are export batches covering **8 Reading & Writing skills** across 3 domains (plus some Standard English Conventions). Build **8 deep R&W skill chapters**, not 51 shallow pages. Math and SEC are built from scratch using the public skill lists above.

---

## 6. Solving the PDF Upload Problem — In-App Teacher Upload

### 6.1 The Problem

External app-builder PDF uploads are failing. Build this natively instead.

### 6.2 Feature: "Upload Source Material"

A section on the Teacher dashboard — "Upload Source Material" — where a teacher uploads any SAT-related PDF directly into AIES's own backend.

### 6.3 Processing Pipeline

1. **PDF parsed server-side** — extract text via a standard PDF text library.
2. **Extract structured metadata only** — Question ID, Domain, Skill, Difficulty (never reproduce source question text, passages, or rationale).
3. **Match against the institution's existing Textbook Library** — if a matching Domain/Skill section exists, queue an addition to it; if the textbook or chapter doesn't exist yet, queue creation of it.
4. **Route through Tier 2** — queued addition sits pending until the relevant HOD approves it.
5. **Teacher gets a notification** once their upload is approved and live (or if rejected, with the HOD's reason).

**Stopgap (until native uploader exists):** Convert any problem PDF to plain text first (`pdftotext -layout`) and feed the text file to your app builder instead of the raw PDF.

---

## 7. Adaptive Diagnostic & Continuous Student Understanding Engine

### 7.1 Trial Test (Baseline)

- Trigger: first thing per subject.
- Length: ~20 questions per subject.
- Module 1: 12–15 mixed-difficulty questions.
- Score Module 1:
  - <50% correct → easier Module 2
  - ≥80% → harder Module 2
  - else standard Module 2
- Module 2: same length, same tracking.
- **No textbook access during trial.** Timed, mirrors real exam conditions.
- Signals: `isCorrect`, `timeToAnswerMs`, `revisitCount`.

**Classification formula:**

```
accuracyScore = correct / total
paceScore = 1 - clamp((avgTimeToAnswerMs - targetTimeMs) / targetTimeMs, 0, 1)
revisitPenalty = clamp(avgRevisitCount / 2, 0, 0.2)

compositeScore = (0.7 * accuracyScore) + (0.2 * paceScore) - revisitPenalty

Beginner:      compositeScore < 0.45
Intermediate:  0.45 <= compositeScore < 0.75
Expert:        compositeScore >= 0.75
```

`targetTimeMs` per question: RW ≈ 71s/question, Math ≈ 95s/question (derived from official section timing).

### 7.2 Continuous Profile Evolution (From Practice Onward)

From the first practice session forward (not during the trial), track three signals per skill, per student, on a rolling basis:

| Signal | What it tracks | How it's used |
|--------|---------------|---------------|
| **Accuracy** | Correct/total per skill, per difficulty tier | Adjusts difficulty tier |
| **Pace** | Time-to-answer relative to that skill's expected pace | Identifies if student is struggling with time pressure |
| **Textbook-reference frequency** | How often the student opens the linked textbook section after a wrong answer, and whether they return to re-attempt | **Learning-behavior signal** — a student who consistently follows through and improves shows effective self-directed learning |

### 7.3 What the Profile Is Used For

- Continuously refines the difficulty-adaptation window per skill, not just per subject.
- Identifies whether a student's error pattern is *conceptual* (wrong regardless of textbook access) or *retrieval* (right after reviewing, wrong cold).
- Feeds teacher-facing progress view with genuine per-skill insight.

### 7.4 Framing Rule — Non-Negotiable

The purpose of this profile is improvement, not ranking or labeling.

| Rule | Example |
|------|---------|
| **Never use deficit language to the student** | ❌ "You're weak at Algebra" → ✅ "Algebra: strong. Geometry: this week's focus." |
| **Never expose one student's classification to another** | No rankings or comparisons in student-facing views |
| **Classification is a starting point, not a fixed label** | It should be visibly revisable as the profile evolves |
| **Teacher/Parent views may show more diagnostic detail** | But framing stays constructive — a tool for targeting support, not sorting students |

---

## 8. Practice Modes & Adaptive Difficulty

### 8.1 Practice Modes

- **All topics** — questions drawn across full subject, weighted 60% weak domains / 40% general mix.
- **Specific topic** — student picks one domain.

### 8.2 Continuous Adaptation

- Rolling window: last 8 answered questions.
- If rolling accuracy > 85% at current difficulty → escalate one tier (Easy→Medium→Hard).
- If rolling accuracy < 50% → de-escalate one tier (never below Easy).
- Never skip a tier.
- Log every tier change with timestamp and triggering accuracy.
- If no questions available at new tier, stay and log “insufficient questions”.

### 8.3 Spaced Repetition

- On wrong answer, schedule similar questions at intervals: 1 day, 3 days, 7 days.
- Inject scheduled review questions into next practice session queue.
- Track in `spacedRepetition/{userId}_{skillId}`.

### 8.4 Wrong-Answer Remediation

1. Show correct answer + full explanation.
2. If `sourceTextbookId` exists: *"Review this in {textbookTitle}, page {sourcePage}."* — tappable, deep-links into in-app textbook viewer at that exact page with `sourceLineRef` highlighted.
3. If no source exists: show explanation only and flag question in `contentApprovalQueue` for source assignment.

---

## 9. Full-Length Practice Tests & Scoring

### 9.1 Unlock Condition

Student has cleared Hard-tier questions in a subject (3 consecutive Hard questions answered correctly in topic practice).

### 9.2 Test Structure

- Math: 2 modules, each 35 min / 22 questions.
- Reading & Writing: 2 modules, each 32 min / 27 questions.
- In full practice, 10-minute break after R&W modules before Math.
- Single-subject practice tests skip break.

### 9.3 Adaptive Module Routing

- Module 1: fixed mixed difficulty.
- After Module 1:
  - Score < 50% → route to Easy Module 2
  - Score ≥ 80% → route to Hard Module 2
  - else standard Module 2

### 9.4 During Test

- Visible progress bar and countdown timer.
- Cross-out, mark-for-review, section navigator.
- Desmos calculator in Math.
- Five-Finger widget in Module 1.
- Auto-submit when time expires.
- Extended time multiplier applied if user has accessibility accommodation.

### 9.5 After Test

- Score report:
  - Estimated scaled score per section and composite.
  - Disclaimer: *“Estimated score based on public concordance data; not an official SAT score.”*
  - Domain/skill breakdown.
  - For each incorrect question, recommend 2–3 similar questions into next practice queue.
- Five-Finger summary:
  - *“You used 3 fingers. 2 were wrong, 1 was a lucky guess. Review the finger questions below.”*
  - *“You had 1 unexpected wrong answer — that’s a careless mistake. Work on checking your work.”*

### 9.6 Scoring

- Raw score = number correct per section.
- Convert using `scoreConversionTables/{version}`.
- Store conversion table as JSON, never hardcode.

---

## 10. Five-Finger Formula

### 10.1 During Module 1 of Any Test

- Widget shows: **✋ 0 of 5 lives used**.
- When student feels uncertain, they click **5-Finger** button and select a reason: *“Too slow”*, *“Between two choices”*, *“Don’t know”*, *“Trap answer”*, etc.
- Logs question and reason in `fiveFingerLogs`, increments used count.
- If they hit 5, warning: *“You’re at your limit — be careful on the rest of Module 1!”*

### 10.2 After Test

- Score report shows:
  - *“You used 3 fingers. 2 were wrong, 1 was a lucky guess. Review the finger questions below.”*
  - *“You had 1 unexpected wrong answer (not on your fingers) — that’s a careless mistake. Work on checking your work.”*

### 10.3 Analytics

- Teacher view: per-session breakdown of finger usage, unexpected wrongs.
- Identify patterns: students who under-flag, over-flag, or have many unexpected wrongs.

---

## 11. Teacher / Parent / Admin Tools

### 11.1 Teacher Dashboard

- Home: quick stats, recent assignments.
- Student Progress:
  - Class/student selector.
  - Classification history.
  - Domain accuracy heatmap.
  - Recent attempts list.
  - Trend line over time.
  - AI-generated insights.
- Upload Test:
  - Manual question entry or PDF upload.
  - Map questions to domain/skill.
  - Assign to class or individual.
- Content Studio:
  - Quick prompt or guided wizard.
  - Review approval queue.
- Upload Source Material (in-app PDF processing, §6).
- Resources, Account.

### 11.2 Content Studio Wizard

7 steps, one at a time:
1. Subject: Math / Reading & Writing
2. Domain: dropdown scoped to subject
3. Skill: dropdown scoped to domain
4. Difficulty: Easy / Medium / Hard / Mixed
5. Number of questions
6. Source PDF optional upload
7. Output type: Questions only / Questions + short lesson / Questions + video script outline / Questions + animation brief

Output: draft questions with full schema and `generatedBy: "ai"`.

### 11.3 Parent Dashboard

- Overview: linked child summary.
- Progress: read-only reports, domain breakdown.
- Notifications: settings, weekly digest preferences.
- Account: manage consent for child sensitive features.

### 11.4 Admin Dashboard

- User management: roles, institution assignment.
- Content approval queue.
- AI model settings / prompt template versioning.
- Score conversion table management.
- Analytics dashboard.

### 11.5 Notifications

- In-app: `notifications` collection.
- Email: via SendGrid or Postmark.
- WhatsApp: Africa’s Talking or Twilio WhatsApp.
- SMS fallback: Africa’s Talking.
- Weekly digest: Gemini-generated plain-language summary, sent via WhatsApp/SMS if consented.
- Spaced repetition via WhatsApp: daily quiz question, response recorded into practice history.

---

## 12. Accessibility, Security, Compliance

### 12.1 Accessibility

- Target WCAG 2.2 AA.
- Keyboard navigation for all screens.
- ARIA roles and focus management.
- Reduced motion support.
- High contrast mode.
- Dyslexia-friendly font (OpenDyslexic).
- Text-to-Speech and Speech-to-Text.
- Extended time accommodations for timed tests.
- Screen reader testing with VoiceOver/NVDA.

### 12.2 Security

- Firebase Auth with email verification.
- Firestore security rules:
  - Students can read/write only their own `users` doc and attempts.
  - Teachers can read their students’ attempts; cannot edit.
  - Parents can read linked children’s reports; cannot edit.
  - Admins full access.
- Rate limiting on AI calls.
- PII redaction from AI prompts.
- All sensitive operations via Cloud Functions, not client-side.

### 12.3 Compliance

- COPPA: under 13 requires parent consent.
- GDPR: user data export and deletion.
- Consent logs for sensitive features.
- No College Board copyrighted content.
- AI transparency: log all AI interactions.

### 12.4 Offline / PWA / Data-light Mode

- PWA: cache app shell, textbook pages, and previously viewed practice questions.
- Offline: read textbook pages, view saved attempts; cannot submit new timed tests offline.
- Data-light mode: reduce image loading, disable auto-play, compress API responses.
- Sync: queue responses while offline, upload when connection returns.

---

## 13. Content Serving Integrity — Known Bug Fix

**Bug observed:** Every Math tab serving Reading & Writing content, and even several R&W tabs serving the wrong skill. Every tab shows exactly “Question 1 of 374” across completely different domains. The topic selector is not filtering the question query at all — it is decorative.

**Root cause:** The question query is not being scoped by the selected domain/skill. It falls back to one shared, unfiltered pool.

**Fix:**
- Ensure question queries are strictly filtered by `subject`, `domain`, `skill`, and `difficulty` as selected.
- If a filter yields zero questions, show an explicit empty state: “No questions available for this topic yet. Check back soon or try another topic.”
- Math topics will initially show empty because there is no Math question data yet. This is the correct intermediate state, not a bug.
- Add integration tests: selecting each domain/skill must return only questions matching that tag.

---

## 14. Build Sequence (Phase Order)

### Phase 0: Foundation & Institution Structure
- Extend data model with Institution, Department, Class, LibraryContent.
- Update Firestore rules for multi-tenancy and role-based access.
- Remove old subject/grade gateways from UI.
- Add age/parent consent fields to User.
- Fix content serving integrity bug (§13).

### Phase 1: Onboarding & Institution Setup
- Signup flow with role selection (Student/Parent/Teacher/Principal/HOD).
- Institution creation flow (AIES Central provisions first institutions).
- Class creation and student enrollment.
- Subject choice screen (Math / Reading & Writing).

### Phase 2: Diagnostic Engine (Trial Test)
- Module 1 delivery — 12–15 mixed-difficulty questions.
- Score Module 1 → route to easier/harder Module 2.
- Per-question tracking: time, revisit, bookmark, 5-Finger.
- Placement computation per domain.
- Diagnostic report with Gemini narrative.

### Phase 3: Textbook Library
- Create four-level hierarchy (Subject → Textbook → Chapter → Section → Q&A).
- Ingest all PDFs — extract metadata, generate original content.
- Dynamic navigator with progressive filtering.
- Search bar (semantic, not just keyword).
- Q&A two-pane layout.
- Textbook growth pipeline from teacher exams.

### Phase 4: Practice Modes
- All topics practice — weighted to student's placement.
- Specific topic practice — student picks one domain.
- Continuous adaptation — rolling accuracy over last 8 questions.
- Wrong-answer remediation with textbook deep-linking.

### Phase 5: Student Understanding Engine
- Trial test classification.
- Continuous profile evolution (accuracy + pace + textbook follow-through).
- Per-skill difficulty adaptation.
- Conceptual vs. retrieval error detection.

### Phase 6: Full Practice Tests
- Timed test runner (Math: 35 min/22 questions; RW: 32 min/27 questions).
- Desmos calculator integration.
- Score estimation with concordance table.
- Post-test similar-question recommendations.

### Phase 7: Teacher Tools
- Upload Source Material (in-app PDF processing).
- Content Studio — Quick Prompt and Guided Wizard.
- Assign tests to class or individual students.
- Teacher progress view with per-student insights.

### Phase 8: Parent & WhatsApp Integration
- Parent dashboard — read-only progress.
- Weekly WhatsApp/SMS digest.
- Consent management for sensitive features.

### Phase 9: Five-Finger & Bookmarks
- Five-Finger widget in Module 1 of all tests.
- Bookmark persistence and analytics.
- Score report showing finger/bookmark analysis.

### Phase 10: Final Polish
- Accessibility audit.
- Offline PWA support.
- Data-light mode.
- Content QA / copyright spot-checks.
- Analytics and observability.

---

## 15. Acceptance Criteria (Per Phase)

- [ ] `npm run build` passes clean
- [ ] Firestore rules tested (allow/deny) with test accounts
- [ ] No College Board content copied (all content original or licensed)
- [ ] Consent flags checked before sensitive features activate
- [ ] Estimated score disclaimer appears everywhere
- [ ] No subject/grade gateways remain
- [ ] PDF uploads work natively (not via external builder)
- [ ] Search returns up to 5 section-level results with breadcrumb + excerpt + direct link
- [ ] Textbook growth is logged and auditable
- [ ] Student profiles evolve continuously, not one-time
- [ ] Topic selector filters correctly; empty states are clear and intentional

---

## 16. How the App Builder Should Use This Document

1. **Read this entire file once** — understand the vision and the phases.
2. **Create `BUILD_LOG.md`** at repo root, listing every phase and task, marked "Not Started".
3. **Execute phases in order** — do not skip. If something is deferred, mark it with a reason.
4. **Run `npm run build` after each phase** — fix any type/import errors immediately.
5. **Test Firestore rules with the emulator** before deployment.
6. **Document all AI-generated prompts** in a separate `PROMPTS.md`.

---

## Appendix A: Official SAT Domain/Skill Lists (Public Taxonomy)

#### Reading & Writing

| Domain | Skills |
|---|---|
| Information and Ideas | Central Ideas and Details, Command of Evidence, Inferences |
| Craft and Structure | Words in Context, Text Structure and Purpose, Cross-Text Connections |
| Expression of Ideas | Rhetorical Synthesis, Transitions |
| Standard English Conventions | Boundaries, Form, Structure, and Sense |

#### Math

| Domain | Skills |
|---|---|
| Algebra | Linear equations in one variable, Linear functions, Linear inequalities, Systems of linear equations, Linear equations in two variables |
| Advanced Math | Equivalent expressions, Nonlinear equations in one variable, Systems of equations in two variables, Nonlinear functions |
| Problem-Solving and Data Analysis | Ratios, rates, proportional relationships; Percentages; One-variable data distributions; Two-variable data; Probability and conditional probability; Inference from sample statistics and margin of error; Evaluating statistical claims |
| Geometry and Trigonometry | Area and volume; Lines, angles, and triangles; Right triangles and trigonometry; Circles |

---

## Appendix B: Prompt Template Examples

#### `textbook_chapter_generation`
```
You are an SAT curriculum expert. Generate original textbook content for the skill "{skill}" in domain "{domain}".
Use the following structure:
1. Concept introduction (2-4 paragraphs, plain language)
2. Core method (5-8 steps)
3. Worked examples at easy, medium, hard
4. Common mistakes (3-5)
5. Practice checkpoint (3-5 questions with answer and explanation)
Do not copy or closely paraphrase any College Board material. Use only the public SAT skill name and domain.
Difficulty distribution: {difficultyNotes}
Output JSON matching the TextbookSection schema.
```

#### `question_generation`
```
Generate {count} original SAT {subject} questions for domain "{domain}", skill "{skill}", difficulty "{difficulty}".
Each question must include stem, 4 answer choices (A-D), correct choice, and full explanation.
If a source textbook context is provided, cite the page.
Do not copy any source question text.
Output JSON array of Question objects.
```

#### `ai_tutor`
```
You are an SAT tutor. Help the student without giving away the answer.
Use Socratic questioning. Refer to the textbook when relevant.
If the student is stuck, give a hint or a worked example of a similar problem.
Never write the actual correct answer for the student's current question.
Cite textbook pages when you use them.
```

#### `diagnostic_report`
```
Given the student's diagnostic results below, write a 150-word summary of strengths and weaknesses.
Recommend 3-5 starting lessons from the textbook library.
Use plain, encouraging language.
```

#### `teacher_insight`
```
Given this student's recent activity and accuracy data, write 2-3 actionable insights.
Flag any sudden drops or persistent weak domains.
Suggest specific textbook sections or practice sets.
```

---

## Appendix C: UX Copy Examples

- Subject choice: “Choose your subject — Math or Reading & Writing”
- Diagnostic: “Free trial test — tracks time per question, revisits”
- Score report: “You were placed in the [Hard/Easy] Module 2. To reach the Hard module next time, aim for 5 or fewer errors in Module 1.”
- Five-Finger warning: “You’re at your limit — be careful on the rest of Module 1!”
- Estimated score disclaimer: “Estimated score based on public concordance data; not an official SAT score.”
- Empty state: “No questions available for this topic yet. Check back soon or try another topic.”

---

**This document is the single source of truth.**  
Build it with precision, empathy, and unwavering quality.
