# AIES SAT — Master Implementation Blueprint & Technical Specification (v4.0)

> **Single Source of Truth for App Builders & AI Engineers**  
> *This document supersedes all prior blueprints, v2/v3 platform specs, and textbook content plans where conflicting.*

---

## 0. Executive Gap Analysis & Strategic Reasoning

To deliver an adaptive, legally compliant, and pedagogically rigorous Digital SAT platform, the following critical architectural and content gaps have been identified and resolved in this specification:

1. **Normalized Textbook Schema vs. Monolithic Document Model**: Prior drafts stored textbook pages as nested arrays inside a single `Textbook` document. This creates Firestore 1MB document size limits, prevents granular page-level full-text/vector indexing, and breaks deep linking. *Resolved*: Normalized into `textbooks`, `textbookChapters`, `textbookSections`, and `textbookPages`.
2. **Unified Navigation & Student Sidebar**: Prior specifications had discrepancies regarding the `Course` tab. *Resolved*: Standardized 7-item student sidebar: `Home`, `Practice & Prepare`, `Textbook Library`, `Course`, `Score Reports`, `Resources`, `Account`.
3. **End-to-End AI Content Generation & Grounding Pipeline**: Defined exact model routing (Gemini 1.5 Pro / Flash), RAG chunking (500 tokens, 50 overlap), prompt templates, output validation schemas, and human approval queues.
4. **Legality & Zero-Copyright Ingestion Protocol**: Clean room protocol extracting *only* mathematical/domain taxonomy, skill categories, and frequency weightings from 51 PDF exports (2,174 questions). Raw stems, passages, and choices are purged from runtime memory.
5. **Standard English Conventions (SEC) & Math from First Principles**: Complete public taxonomy mappings provided across all 8 SAT domains (4 Math, 4 Reading & Writing) with deterministic page allocation formulas.
6. **Automatic Anchor Assignment**: Every generated question is programmatically linked to a stable textbook chapter, page, and section block ID (`sourceTextbookId`, `sourcePage`, `sourceLineRef`) at generation time.
7. **Adaptive Practice Engine & Calibration Guardrails**: Deterministic rolling window (8 items), escalation (>85%) and de-escalation (<50%) thresholds, cold-start diagnostic placement, and SM-2 spaced repetition for missed items.
8. **Collective Intelligence Layer (Pillar K)**: Explicit schema for multi-agent blackboard (`agentEvents`), vector-embedded misconception memory (`misconceptionCases`), and three-tiered autonomous remediation thresholds.
9. **Accommodations & Extended Time (Bluebook Parity)**: Universal support for 1.5x/2.0x time multipliers, text-to-speech, speech-to-text, dyslexia-friendly typography, and high contrast.
10. **Multi-Channel Notification & Parent Consent Architecture**: Event-driven notifications (In-App, Postmark/SendGrid, Africa's Talking / Twilio WhatsApp) governed by strict COPPA / minor consent logging.

---

## 1. Unified Firestore Data Architecture

All timestamps are stored as ISO 8601 strings. Unbounded relational data is structured in subcollections.

### 1.1 `users/{uid}`
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  dateOfBirth?: string;              // ISO format, required for age verification
  age?: number;                      // Derived age
  linkedParentUid?: string | null;   // For student accounts
  linkedStudentUids?: string[];      // For parent accounts
  institutionId?: string;            // Multi-tenancy grouping
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  targetTestDate?: string;
  targetScore?: number;              // 400 - 1600
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
    extendedTimeMultiplier: number;  // 1.0, 1.5, 2.0
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
```

### 1.2 `textbooks/{textbookId}`
```typescript
interface Textbook {
  id: string;
  title: string;
  publisher: string;
  domainGroup: 'math-foundations' | 'math-advanced' | 'reading-writing' | 'grammar';
  status: 'draft' | 'published' | 'archived';
  version: number;
  totalChapters: number;
  totalEstimatedPages: number;
  createdAt: string;
  updatedAt: string;
}
```

### 1.3 `textbookChapters/{chapterId}`
```typescript
interface TextbookChapter {
  id: string;
  textbookId: string;
  chapterNumber: number;
  title: string;
  domain: string;                    // e.g., 'algebra', 'craft-and-structure'
  skill: string;                     // e.g., 'linear-equations-in-one-variable'
  order: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### 1.4 `textbookSections/{sectionId}`
```typescript
interface TextbookSection {
  id: string;
  chapterId: string;
  textbookId: string;
  sectionNumber: number;
  title: string;
  type: 'concept-intro' | 'core-method' | 'worked-example' | 'common-mistakes' | 'practice-checkpoint';
  order: number;
  pageNumber: number;
  lineRef: string;                   // Anchor ID: 'sec-{sectionId}'
  contentBlocks: ContentBlock[];
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
```

### 1.5 `textbookPages/{pageId}`
```typescript
interface TextbookPage {
  id: string;
  textbookId: string;
  pageNumber: number;
  text: string;                      // Plaintext index for search engines
  sectionIds: string[];
  updatedAt: string;
}
```

### 1.6 `questions/{qid}`
```typescript
interface Question {
  id: string;
  subject: 'math' | 'rw';
  domain: string;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'student_produced_response';
  stem: string;
  choices?: { A: string; B: string; C: string; D: string };
  correctChoice?: 'A' | 'B' | 'C' | 'D';
  correctAnswer?: number | string;
  explanation: string;
  sourceTextbookId: string;
  sourcePage: number;
  sourceLineRef: string;
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
    difficultyScore: number;         // Dynamic IRT parameter
  };
  createdByUid: string;
  reviewedByUid?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 1.7 `attempts/{attemptId}` & Subcollections
```typescript
interface Attempt {
  id: string;
  studentUid: string;
  mode: 'trial' | 'topic_practice' | 'full_practice' | 'official';
  subject: 'math' | 'rw' | 'full';
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  currentModule: 1 | 2;
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
  selectedChoice?: 'A' | 'B' | 'C' | 'D';
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

---

## 2. Full SAT Taxonomy & Curriculum Allocation

### 2.1 Reading & Writing Domains & Skills
1. **Information and Ideas**
   - *Central Ideas and Details*: Textual summarization, theme extraction, supporting detail synthesis.
   - *Command of Evidence*: Textual citations, quantitative data analysis (tables, bar graphs, scatter plots).
   - *Inferences*: Logical deduction, hypothesis testing, unstated assumption mapping.
2. **Craft and Structure**
   - *Words in Context*: Polysemous vocabulary, contextual nuance, tone and register.
   - *Text Structure and Purpose*: Rhetorical purpose, passage structural shift, point of view.
   - *Cross-Text Connections*: Comparative analysis, opposing author perspectives, syntheses.
3. **Expression of Ideas**
   - *Rhetorical Synthesis*: Goal-directed note synthesis, audience-tailored drafting.
   - *Transitions*: Logical connectors (cause/effect, contrast, addition, sequence).
4. **Standard English Conventions**
   - *Boundaries*: Comma splices, run-ons, semicolons, colons, dashes, apostrophes.
   - *Form, Structure, and Sense*: Subject-verb agreement, pronoun-antecedent agreement, verb tense/aspect, modifier placement, parallel structure.

### 2.2 Math Domains & Skills
1. **Algebra**
   - Linear equations in one variable
   - Linear functions and graphs
   - Linear inequalities in one/two variables
   - Systems of two linear equations
   - Linear equations in two variables
2. **Advanced Math**
   - Equivalent expressions (polynomial expansion, factoring)
   - Nonlinear equations in one variable (quadratics, radicals, rational equations)
   - Systems of equations in two variables (linear-quadratic)
   - Nonlinear functions (exponential growth/decay, vertex form, quadratic graphs)
3. **Problem-Solving and Data Analysis**
   - Ratios, rates, proportional relationships, and unit conversion
   - Percentages and percentage change
   - One-variable data distributions (mean, median, standard deviation, box plots)
   - Two-variable data (scatterplots, line of best fit, residuals)
   - Probability and conditional probability
   - Inference from sample statistics and margin of error
   - Evaluating statistical claims and experimental design
4. **Geometry and Trigonometry**
   - Area and volume calculations
   - Lines, angles, and triangle congruence/similarity
   - Right triangles and trigonometry (sin, cos, tan ratios, radian conversions)
   - Circles (arc length, sector area, circle equation \((x-h)^2 + (y-k)^2 = r^2\))

### 2.3 Frequency-Based Textbook Allocation Formula
$$\text{Allocated Pages} = 10 + \text{round}\left(\frac{\text{Question Count}}{\text{Max Domain Count}} \times 30\right)$$
$$\text{Worked Examples} = 1 + \left\lfloor\frac{\text{Question Count}}{150}\right\rfloor, \quad \text{Practice Checkpoints} = 3 + \left\lfloor\frac{\text{Question Count}}{100}\right\rfloor$$

---

## 3. Textbook Content Generation & RAG Engine

### 3.1 5-Stage Content Generation Pipeline
1. **Curriculum Prompt Formulation**: Ingests skill taxonomy, target difficulty distribution, and mathematical constraints.
2. **First-Principles Generation**: Gemini 1.5 Pro produces the 5-part section structure (Concept Intro, Core Method, Worked Examples, Common Mistakes, Practice Checkpoint).
3. **Automated Verification & Integrity Gate**:
   - Schema validation against `TextbookSection`.
   - LaTeX mathematical integrity check (KaTeX parse test).
   - Copyright similarity embedding test against known sample repositories ($<0.85$ cosine similarity threshold).
4. **Chunking & Vector Embedding**: Text split into 500-token chunks (50-token overlap) and embedded via Vertex AI Embeddings (`text-embedding-004`).
5. **Human Pedagogical Sign-off**: Enters `contentApprovalQueue` where teachers/admins review, edit, or approve before setting status to `published`.

### 3.2 Dynamic Question-to-Textbook Anchoring
When a question is generated:
1. The orchestrator identifies the canonical `textbookChapter` and `textbookSection` matching the question's `domain` and `skill`.
2. It assigns `sourceTextbookId = chapter.textbookId`, `sourcePage = section.pageNumber`, and `sourceLineRef = section.lineRef`.
3. In the student remediation view, an incorrect response renders a primary action button:
   > *"Review concept in [Textbook Title], Section [Number] (Page [P])"*
   which routes immediately to `/textbook/:id/page/:p?highlight=sec-{id}`.

---

## 4. AI Intelligence & Collective Intelligence Layer (Pillar K)

### 4.1 Multi-Agent Blackboard Architecture (`agentEvents`)
- **Orchestrator Agent**: Manages event propagation and state transitions.
- **Diagnostician Agent**: Analyzes telemetry (response time, revisit counts, five-finger logs) to extract root cognitive misconceptions.
- **Pedagogy Research Agent**: Queries vector memory (`misconceptionCases`) to identify the highest-yield historical remediation strategy.
- **Tutor Agent**: Drives context-aware Socratic dialogues without directly providing answers.
- **Grading & Validation Agent**: Performs real-time syntax and SPR math evaluation.

### 4.2 Misconception Case Schema & Confidence Thresholds
$$\text{Confidence} = \text{baseConfidence} \times \left(\frac{\text{Successful Remediations}}{\text{Total Attempts}}\right)$$
- **Autonomous Action ($\ge 0.80$)**: Platform automatically injects targeted mini-lessons into the student's practice queue.
- **Assisted Action ($0.50 \le \text{Score} < 0.80$)**: Injects intervention and posts summary to Teacher Progress Feed.
- **Teacher Review Required ($< 0.50$)**: Flags item in Teacher Copilot for custom educator guidance.

---

## 5. Adaptive Testing & Scoring Engine

### 5.1 Diagnostic Classification Formula
$$\text{Accuracy} = \frac{\text{Correct}}{\text{Total}}, \quad \text{Pace} = 1 - \text{clamp}\left(\frac{\text{AvgTime} - \text{TargetTime}}{\text{TargetTime}}, 0, 1\right)$$
$$\text{Composite} = 0.70 \times \text{Accuracy} + 0.20 \times \text{Pace} - \text{clamp}\left(\frac{\text{AvgRevisits}}{2}, 0, 0.20\right)$$
- **Beginner**: $\text{Composite} < 0.45$
- **Intermediate**: $0.45 \le \text{Composite} \le 0.75$
- **Expert**: $\text{Composite} > 0.75$

### 5.2 Dynamic Module Routing
- **Module 1 (Routing Module)**: 22 Math items (35 min) or 27 Reading & Writing items (32 min) across mixed difficulty.
- **Module 2 Branching**:
  - Raw score $< 50\% \implies$ Easy Module 2 (Score scaled ceiling $\approx 600$).
  - Raw score $\ge 80\% \implies$ Hard Module 2 (Full scale access up to 800).
  - $50\% \le \text{Score} < 80\% \implies$ Standard Module 2.

---

## 6. Full Student Experience & Navigation Blueprint

```
Student Navigation (7 Items):
├── 1. Home (/dashboard)
├── 2. Practice & Prepare (/practice)
│    ├── All Topics (Adaptive 60/40 Weakness Mix)
│    └── Choose Topic (Domain-Specific Deep Practice)
├── 3. Textbook Library (/textbooks)
│    ├── Interactive Reader (/textbook/:id/page/:page)
│    └── Full-Text & Concept Search
├── 4. Course (/course)
│    └── Sequenced Structured Skill Lessons
├── 5. Score Reports (/scores)
│    ├── Raw-to-Scaled Concordance Curve
│    ├── Metacognitive Matrix (5-Finger Analysis)
│    └── Expected vs Careless Errors
├── 6. Resources (/resources)
│    └── Reference Sheets, Desmos Sandbox, Formula Guides
└── 7. Account (/settings)
     └── Preferences, Accessibility Accommodations, Parent Link Status
```

---

## 7. Quality Assurance, Compliance & Production Readiness

1. **WCAG 2.2 AA Conformance**: Full keyboard focus trapping, ARIA-described dialogs, high contrast mode, and OpenDyslexic font toggles.
2. **Zero College Board IP Contamination**: All stems, passages, tables, and explanations are original creations verified by semantic distance algorithms.
3. **Data Protection & Minor Privacy**: Strict separation of student PII, parent-consent enforcement for WhatsApp digests, and COPPA-compliant age gating.

---
*Single Source of Truth — Approved for Immediate Deployment.*
