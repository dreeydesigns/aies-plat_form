# AIES SAT — MVP Cleanup & Launch Preparation

**For the AI App Builder — Copy and Paste This Entire Document.**  
**Repository:** https://github.com/dreeydesigns/aies-plat_form

**Status:** Supersedes all previous cleanup instructions. This is the single source of truth for preparing the platform for the first official MVP trial launch.

**Non-negotiable rule:** After cleanup, the platform must contain exclusively SAT content, authenticated real accounts, a fully responsive UI across all viewports (Mobile, Tablet, Desktop), and zero placeholder text.

---

## 0. Standing Directive: Comprehension, Not Storage

*This directive applies to every data feed and cleanup action in this document. It does not get restated per section.*

Every time AIES handles information, it must treat it as **training and calibration signal to synthesize and generalize from**, not as a static record to store and retrieve.

**Concretely:**
- **Data Cleanup Integrity**: Cleaning data does not mean losing lessons learned — the system preserves its ability to generate high-yield SAT questions and explanations after removing non-SAT legacy artifacts.
- **Model Evolution**: Removing user data does not purge the AI's accumulated understanding of SAT question patterns, distractors, and difficulty curves.
- **Deterministic Calibration**: Every removal action must be clean, audited, and strictly scoped to SAT domains.

---

## 1. Objective

Prepare AIES SAT for a public MVP trial by:
1. Removing all non-SAT content, legacy multi-subject remnants (Kids Mode, High School, College Prep), and placeholder text.
2. Purging test/dummy user accounts and non-SAT Firestore collections.
3. Making the UI fully responsive across mobile (≤640px), tablet (641–1024px), and large desktop (≥1200px).
4. Ensuring every visible page, sidebar, and breadcrumb is SAT-only.
5. Updating Firestore security rules, indexes, and data models.
6. Verifying the platform with strict acceptance criteria before launch.

---

## 2. Backup & Rollback Plan

Before touching any production data or migrating schemas, execute a complete backup.

### 2.1 Firestore Backup
Export all Firestore collections using Google Cloud CLI:
```bash
gcloud firestore export gs://[BUCKET_NAME]/backups/pre-mvp-cleanup-$(date +%Y%m%d-%H%M%S)
```
*Or use Firebase Console → Firestore Database → Data → Export Data.*

### 2.2 Codebase Backup
Create an explicit release tag prior to cleanup:
```bash
git checkout -b cleanup/mvp-launch
git tag pre-cleanup-$(date +%Y%m%d)
git push origin pre-cleanup-$(date +%Y%m%d)
```

### 2.3 Rollback Plan
If any breaking anomaly occurs:
1. Restore Firestore database from the Cloud Storage backup bucket.
2. Check out the pre-cleanup Git tag: `git checkout tags/pre-cleanup-...`
3. Document the root cause in `BUILD_LOG.md`.

---

## 3. Firestore Data Cleanup

### 3.1 Purge Non-SAT Collections
Delete these legacy collections entirely from live databases:

| Collection | Cleanup Action |
|---|---|
| `courses` | Delete any non-SAT courses. Keep only SAT-specific courses with verified Math or RW domains. |
| `lessons` | Delete lessons belonging to non-SAT courses. |
| `quizzes` | Delete legacy non-SAT quizzes. |
| `quizQuestions` | Delete questions not tagged to official SAT domains/skills. |
| `subjectGateways` | Delete entire collection. |
| `gradeLevels` | Delete entire collection. |
| `kidsMode` | Delete entire collection. |
| `highSchool` | Delete entire collection. |
| `collegePrep` | Delete entire collection. |
| `sampleContent` | Delete entire collection. |
| `demoUsers` | Delete entire collection. |
| `testData` | Delete entire collection. |

### 3.2 Clean `users` Collection
**Goal**: Remove all dummy/test accounts and non-SAT fields from real accounts.

**Step 1: Identify Real Accounts**
Real accounts are:
- Users authenticated during verified school onboarding.
- Users whose email domain matches an approved institution.
- Accounts explicitly provisioned by `aies_central`.
- *If no real accounts exist yet, wipe the `users` collection entirely for a clean MVP genesis.*

**Step 2: Remove Legacy Fields**
For every remaining user document, delete the following legacy fields:
- `subject`
- `grade` / `gradeLevel`
- `gateway`
- `kidsMode`
- `highSchool`
- `collegePrep`
- `enrolledSubjects`

**Step 3: Canonical User Document Structure**
```json
{
  "uid": "usr_...",
  "email": "student@institution.edu",
  "displayName": "Jane Doe",
  "role": "student",
  "institutionId": "inst_...",
  "departmentId": null,
  "classIds": ["class_..."],
  "dateOfBirth": "2008-05-14",
  "linkedParentUid": null,
  "linkedStudentUids": [],
  "classificationMath": "intermediate",
  "classificationRW": "expert",
  "targetTestDate": "2026-11-07",
  "targetScore": 1450,
  "consent": {
    "deviceSync": false,
    "cameraWellness": false,
    "whatsappNotifications": false,
    "updatedAt": "2026-08-15T00:00:00.000Z"
  },
  "preferences": {
    "theme": "light",
    "fontSize": "medium",
    "dyslexiaFont": false,
    "highContrast": false,
    "dataLightMode": false
  },
  "accessibility": {
    "screenReader": false,
    "textToSpeech": false,
    "speechToText": false,
    "zoomLevel": 1.0,
    "extendedTimeMultiplier": 1.0
  }
}
```

**Step 4: Verify Roles**
Only these roles are permitted:
`aies_central` | `principal` | `deputy_principal` | `hod` | `class_teacher` | `student` | `parent`

### 3.3 Clean Textbook Content
Retain exclusively the four core SAT textbooks:
1. **Foundations of Digital SAT Math** (`sat-math-foundations`)
2. **SAT Advanced Math & Functions Mastery** (`sat-advanced-math-mastery`)
3. **Mastering Digital SAT Reading & Writing** (`sat-reading-writing-mastery`)
4. **Standard English Conventions & Grammar Rules** (`sat-sec-grammar`)

### 3.4 Clean Question Bank
Ensure every item in `satQuestions` / `questions`:
- Has `subject: "math"` or `subject: "rw"`.
- Is tagged with an official SAT domain (e.g., `algebra`, `advanced-math`, `information-ideas`, `standard-english-conventions`).
- Contains no references to non-SAT topics.

---

## 4. Codebase Cleanup & Placeholder Removal

### 4.1 Purge Old UI Components & Strings
Search and delete all occurrences of:

| Target String / Component | Required Action |
|---|---|
| `Kids Mode` | Delete component, routes, and all imports |
| `High School` | Delete component, routes, and all imports |
| `College Prep` | Delete component, routes, and all imports |
| Generic Subject Selector | Remove from all onboarding and test views |
| Grade Level Form Fields | Delete from all signup/profile modals |
| `Untitled Course` | Replace with SAT course or remove |
| `Add a description and lessons...` | Delete |
| `Sample lesson` / `Lorem ipsum` | Delete |
| `Grade 12 Mathematics...` | Replace with *Foundations of Digital SAT Math* |
| Multi-Subject Copy | Replace with *"Welcome to AIES SAT"* |

### 4.2 TypeScript Type Standardization
Ensure `src/types.ts` contains only the unified SAT models:
- `UserRole`: `'aies_central' | 'principal' | 'deputy_principal' | 'hod' | 'class_teacher' | 'student' | 'parent'`
- Tenant Schemas: `Institution`, `Department`, `ClassGroup`, `LibraryContent`
- SAT Schemas: `SatQuestion`, `SatDomain`, `Textbook`, `TextbookChapter`, `TextbookSection`, `FiveFingerLog`

---

## 5. Responsive UI Implementation (Mobile, Tablet, Desktop)

### 5.1 The Responsive Breakpoint Matrix

```
Mobile (< 640px)          Tablet (641px – 1024px)        Desktop (> 1024px)
┌───────────────────────┐ ┌───────────────────────────┐ ┌─────────────────────────────┐
│ [≡] AIES SAT          │ │ [☰] AIES SAT    Profile   │ │ [ AIES SAT ]  Search    User│
│ ┌───────────────────┐ │ │ ┌───────┐ ┌─────────────┐ │ │ ┌──────┬──────────────────┐ │
│ │ Card (1 Col)      │ │ │ │Card 1 │ │Card 2       │ │ │ │Side  │ Card 1 │ Card 2  │ │
│ └───────────────────┘ │ │ └───────┘ └─────────────┘ │ │ │bar   │────────┼─────────│ │
│ ┌───────────────────┐ │ │ ┌───────────────────────┐ │ │ │      │ Card 3 │ Card 4  │ │
│ │ Two-Pane (Stacked)│ │ │ │ Two-Pane (Adjustable) │ │ │ │      │ (3-Col Grid)     │ │
│ │ Top: Passage      │ │ │ │ Left   │ Right        │ │ │ │      │                  │ │
│ │ Bottom: Question  │ │ │ └────────┴──────────────┘ │ │ │      │ Two-Pane (Fixed) │ │
│ └───────────────────┘ │ └───────────────────────────┘ │ └──────┴──────────────────┘ │
└───────────────────────┘                               └─────────────────────────────┘
```

### 5.2 Component-by-Component Responsive Specifications

| Component | Mobile (< 640px) | Tablet (641–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| **Sidebar Navigation** | Hidden off-canvas; toggled via header hamburger icon | Slim icon rail or collapsible drawer | Persistent full-width sidebar with icon + text labels |
| **Dashboard Grid** | Stacked 1-column layout | 2-column responsive grid | 3-column / flexible layout with max-width container |
| **Question Runner (Two-Pane)** | Stacked vertically: stimulus on top, question stem/choices below | Side-by-side with adjustable split handle | Side-by-side with fixed 50/50 split |
| **Dynamic Navigator (Filter Bar)** | Collapsed into a single floating `Filters` button opening a bottom sheet | Inline row of select dropdowns with horizontal scroll | Inline row of select dropdowns + search bar |
| **Touch Targets & Typography** | Touch targets $ge 44	ext{px}$, body text $ge 16	ext{px}$ | Touch targets $ge 44	ext{px}$, body text $16	ext{px}$ | Standard desktop sizing ($14	ext{px} - 16	ext{px}$) |
| **Modals & Dialogs** | Full-screen bottom sheet with close CTA | Centered overlay dialog with backdrop | Centered overlay dialog with backdrop |
| **Textbook Reader** | Single-column text; TOC accessible via top drawer | Collapsible TOC rail; fluid content pane | Persistent TOC rail; bounded reading pane (`max-w-4xl`) |

### 5.3 Technical Implementation Guidelines
1. **Container Scaling**: Avoid fixed pixel widths (`w-[1200px]`). Use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` to prevent clipping on large monitors.
2. **Layout Direction**: Use `flex flex-col lg:flex-row` on test runners and complex two-pane readers.
3. **Touch Sizing**: Ensure all mobile buttons, choice pills, and navigator badges carry `min-h-[44px]` and `min-w-[44px]`.
4. **Horizontal Overflow Prevention**: Add `overflow-x-hidden` to root layout containers and wrap data tables in `overflow-x-auto`.

---

## 6. Navigation & Routing Architecture

### 6.1 Final Canonical Sidebars

#### Student Sidebar
1. **Home** (`/dashboard`)
2. **Practice & Prepare** (`/practice`)
3. **Textbook Library** (`/textbooks`)
4. **Score Reports** (`/scores`)
5. **Resources** (`/resources`)
6. **Account & Settings** (`/settings`)

#### Teacher Sidebar
1. **Home** (`/teacher/dashboard`)
2. **Student Progress** (`/teacher/reports`)
3. **Upload Test** (`/teacher/upload`)
4. **Content Studio** (`/teacher/studio`)
5. **Resources** (`/teacher/resources`)
6. **Account & Settings** (`/teacher/settings`)

#### Parent Sidebar
1. **Overview** (`/parent/dashboard`)
2. **Progress** (`/parent/reports`)
3. **Notifications** (`/parent/notifications`)
4. **Account & Settings** (`/parent/settings`)

#### Admin Sidebar
1. **Home** (`/admin/dashboard`)
2. **Institution Management** (`/admin/institutions`)
3. **Content Approval Queue** (`/admin/approvals`)
4. **User Management** (`/admin/users`)
5. **Score Concordance Tables** (`/admin/concordance`)
6. **Analytics** (`/admin/analytics`)
7. **Settings** (`/admin/settings`)

### 6.2 Route Redirects
Legacy routes must redirect to canonical SAT destinations:
- `/kids-mode` $longrightarrow$ `/dashboard`
- `/high-school` $longrightarrow$ `/dashboard`
- `/college-prep` $longrightarrow$ `/dashboard`
- `/subjects/*` $longrightarrow$ `/textbooks`
- `/courses/*` $longrightarrow$ `/practice`

---

## 7. Quality Assurance & Acceptance Checklist

Before public MVP deployment, every acceptance gate must pass:

- [ ] **Clean Build**: `npm run build` passes with zero TypeScript or Vite bundle errors.
- [ ] **Zero Console Warnings**: App boots and navigates with 0 runtime exceptions.
- [ ] **Zero Non-SAT Artifacts**: No mentions of grade levels, Kids Mode, or generic multi-subject curricula.
- [ ] **Responsive Viewport Audit**: Verified at 375px (Mobile), 768px (Tablet), 1440px (Desktop), and 1920px (Ultra-wide).
- [ ] **No Horizontal Scrolling**: Clean layout boundaries with 0 unintended x-overflow.
- [ ] **Touch Target Conformance**: All mobile action buttons $ge 44	ext{px}$.
- [ ] **Multi-Tenancy Security**: `firestore.rules` active, tested, and enforcing school data isolation.
- [ ] **Living Textbook Catalog**: Four core SAT textbooks rendered with valid chapters, sections, and Q&A entries.
- [ ] **Adaptive Diagnostic Engine**: 2-stage trial test delivers calibrated placements across the 8 SAT domains.
- [ ] **Metacognitive 5-Finger Formula**: Module 1 uncertainty logging and matrix analysis operational in score reports.

---

## 8. Execution Sequence

1. **Step 1: Backup Data & Create Release Tag** (`pre-cleanup-...`).
2. **Step 2: Execute Firestore Database Cleanup** (Purge non-SAT collections, scrub legacy fields).
3. **Step 3: Refactor Codebase & Remove Placeholders** (Purge legacy components, standardize types).
4. **Step 4: Implement Tailwind Responsive Classes** (Apply breakpoint matrix across all views).
5. **Step 5: Verify Build & Security Rules** (`npm run build` and Firestore emulator assertions).
6. **Step 6: Deploy to Staging Environment for Full Regression Testing**.
7. **Step 7: Launch Public MVP Trial**.

---

*This document is the single source of truth for AIES SAT MVP Launch Preparation.*
