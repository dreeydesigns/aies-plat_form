# AIES SAT — Permanent System Audit & Access Control Specification

**Document Version:** 4.0.0 (Consolidated & Enforced)  
**Target Environment:** Production (`https://aies-plat-form.vercel.app`)  
**Scope:** Elimination of Mock Data, Mandatory Parent Gate, Universal Trial Rigor & Conversational Socratic Intelligence

---

## 1. Resolution of the Three Reported Issues

### Issue 1: Mock Schools in Admin Pipeline (Kilima, Green Springs, St. Andrew)
- **Root Cause:** Dummy school documents were stored in Firestore `institutions` and `schoolCodes` collections during early prototyping, and hardcoded fallback arrays existed in `AdminDashboard.tsx` and `AdminSettings.tsx`.
- **Permanent Fix Applied:**
  1. Executed direct database purge: Deleted `inst_kilima`, `inst_greensprings`, `inst_st_andrews`, `AIES-GREEN-101`, and `AIES-KILIMA-882` from Firestore.
  2. Preserved strictly real, authorized institutions (e.g. `ElimuX` / `inst_elimux`).
  3. Replaced all static initial state arrays in `AdminDashboard.tsx` and `AdminSettings.tsx` with live Firestore listeners that default to `[]` and render clean empty states when no institutions exist.

### Issue 2: New Student Defaulting to "Intermediate" Placement Before Trial Exam
- **Root Cause:** In `src/pages/teacher/StudentDetail.tsx`, the JSX template used hardcoded fallback strings (`{student.classificationMath || 'Intermediate'}` and `{...['algebra'] || 'Proficient'}`). Whenever an unassessed student profile was rendered, the UI substituted fake "Intermediate" / "Proficient" / "Mastered" badges.
- **Permanent Fix Applied:**
  1. Refactored `StudentDetail.tsx` to check `student.classificationMath` / `student.classificationRW` and `student.satProfile?.diagnosticCompleted`.
  2. If unassessed, the UI displays `Not Yet Assessed` for overall placement and `Pending Diagnostic` for every domain skill.
  3. Database script purged legacy unearned placement fields from unassessed student user records in Firestore.

### Issue 3: Non-SAT Courses ("Grade 12 Mathematics Calculation Toolkit", "Untitled Course")
- **Root Cause:** Legacy course documents remained in the Firestore `courses` collection, and the student navigation layout retained a `Course` sidebar link pointing to `/student/courses`.
- **Permanent Fix Applied:**
  1. Deleted all non-SAT course documents (`Grade 12 Mathematics Calculation Toolkit`, `Untitled Course`) directly from Firestore `courses` collection.
  2. Removed the `Course` navigation item from `src/layouts/StudentLayout.tsx` and `Course Oversight` from `src/layouts/AdminLayout.tsx`.
  3. The entire platform navigation is now 100% SAT-scoped:
     - **Home** (`/student`)
     - **Practice & Prepare** (`/student/sat/practice`)
     - **Textbook Library & Ask AIES** (`/student/sat/textbooks`)
     - **Score Reports & Analytics** (`/student/sat/scores`)
     - **Resources & Guide** (`/student/guide`)
     - **Account & Settings** (`/student/settings`)

---

## 2. Mandatory Parent Linking & Trial Exam Protocol

### 2.1 The Hard Gate Sequence
A student cannot access the diagnostic exam, practice studio, or student dashboard without passing the parent linking gate:

```
[Student Registration] 
       ↓
[Mandatory School Code Verification]
       ↓
[MANDATORY PARENT GATE (Hard Block)]
       ├── Minors (<18): Must dispatch parent verification link or enter parent link code.
       └── Adults (18+): Must explicitly self-attest adulthood.
       ↓
[Compulsory Diagnostic Trial Exam (Timed, 2-Stage Multi-Module)]
       ↓
[Dual Report Generation & Dispatch]
       ├── Linked Parent Digest: Plain-language mastery summary & confidence trends.
       └── Teacher Academic Report: Domain-by-domain diagnostic breakdown & latency flags.
       ↓
[Student Remediation Review]
       ├── Correct vs Chosen Answer breakdown.
       ├── Step-by-Step Socratic Rationale.
       ├── Direct Textbook Chapter & Section Page Links.
       └── 2-3 Similar Calibrated Practice Questions Queued into Study Plan.
       ↓
[Full Platform & Practice Studio Unlocked]
```

---

## 3. "Ask AIES" — Continuous Socratic Understanding Engine

Located at the top of the **Textbook Library** (`/student/sat/textbooks`):

1. **Conversational Dialogue Box (`AskAiesTutor.tsx`)**:
   - Students can ask open-ended questions (*"Why is B wrong on Question 4?"*, *"Explain comma splices like I'm new to this"*, *"How do I recognize systems of equations with no solution?"*).
   - Conversational, empathetic Socratic tutor that uses real-world analogies and rephrases when a student says *"I still don't get it"*.
2. **Curriculum Linking**:
   - Automatically provides direct deep links to matching chapters in the 4 SAT Volumes (*Volume 1: Foundations of Math, Volume 2: Reading & Writing Mastery, Volume 3: Advanced Math & Geometry, Volume 4: Grammar & Conventions*).
3. **Telemetry & Cognitive Profiling**:
   - Every student question is logged to `studentUnderstandingLogs` in Firestore.
   - Recurring inquiries (e.g. asking about Boundaries 3 times in a week) are surfaced on the Teacher Dashboard as actionable instructional observations.

---

## 4. Verification & Deployment Status

- **Build Status**: TypeScript compilation & Vite bundle passed with 0 errors.
- **Git Branch**: `origin/main` (`https://github.com/dreeydesigns/aies-plat_form`).
- **Database Status**: `courses` collection wiped, mock institutions deleted, unassessed student profiles reset.
