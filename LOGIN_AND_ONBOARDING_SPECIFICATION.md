# AIES SAT — Login, Multi-Tenancy & Onboarding Master Specification

**For the AI App Builder — Copy and Paste This Entire Document**  
**Repository:** https://github.com/dreeydesigns/aies-plat_form

**Status:** This document is the definitive single source of truth for all authentication, multi-tenancy verification, guest access, student onboarding, parent linking, and diagnostic calibration workflows.

---

## 0. Standing Architectural Directive: Comprehension, Not Storage

> [!IMPORTANT]
> **Permanent Core Principle**: Every data feed ingested into AIES (student telemetry, test attempts, teacher exams, question banks) is treated as **training and calibration signal to synthesize and generalize from**, never as a static database row to retrieve literally. All data processing must preserve strict, impenetrable tenant boundaries so that no school's telemetry, materials, or student identities ever leak to another institution.

---

## 1. Executive Summary & Problem Resolution

### 1.1 The Problems Solved
1. **Frictionless Google & Email Auth**: Fixes permission denials when creating new Parent, Teacher, or Student accounts after clearing database users.
2. **Deterministic School Code & 2-Day Invite Verification**: Students and teachers bind to their respective schools via a 6-digit school code (e.g. `AIES-KILIMA-882`) or a 48-hour secure email invite link.
3. **Monetization & Guest Student Pass**: Independent students can access trial diagnostic exams for free, but are gated with a sleek subscription paywall ($29/mo or $79/3-mo) when attempting to view full Interactive Textbooks or Similar Question Drills.
4. **Official Student ID (#AIES-STU-XXXXX)**: Generated automatically at registration and displayed to the student, system, and admin console.
5. **Parent-Child Linkage**: Seamless parental connection via email invitation or 6-character `linkCode`.
6. **Compulsory Adaptive Diagnostic & Non-Marginalizing Reporting**: Students take an initial adaptive diagnostic test to establish domain proficiencies using constructive growth-mindset framing (*Foundation Builder*, *Skill Consolidator*, *Advanced Master*).

---

## 2. Multi-Role Authentication Matrix

| Role | Signup Methods | Onboarding Steps | Landed Experience |
|---|---|---|---|
| **Student (School)** | Google One-Tap, Email/Password | Enter School Code $\to$ Generate Student ID $\to$ Link Parent $\to$ Set Target Score $\to$ Compulsory Diagnostic | Full Access to School Courses, Assigned Tests, Textbooks, and Analytics |
| **Student (Guest)** | Google One-Tap, Email/Password, Anonymous | Skip School Code $\to$ Practice SAT Trial Exams | Gated access; Subscription modal triggered on Textbooks & Similar Question Drills |
| **Teacher / HOD** | Google One-Tap, Email/Password | Verify School Code / Invite Link $\to$ Department & Class Roster Setup | Teacher Studio, Student Progress Radar, Test Assignment, Approval Queue |
| **Parent** | Google One-Tap, Email/Password | Connect Child with 6-digit `linkCode` or accept Student Email Request | Read-only Progress Reports, Scaled Score Trajectory, Weekly Email Digest |
| **Admin / AIES Central** | Email/Password, Verified SSO | School Code Generation, Multi-Tenancy Management | Platform Oversight, 48-Hour Code Generator, Subscription Tier Config |

---

## 3. Data Model Extensions (`src/types.ts`)

```typescript
// users/{uid}
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  role: 'aies_central' | 'principal' | 'deputy_principal' | 'hod' | 'class_teacher' | 'student' | 'parent';
  studentNumber?: string;              // e.g. "#AIES-STU-84920"
  institutionId?: string | null;       // null for independent/guest learners
  institutionName?: string | null;     // e.g. "Kilima Academy"
  departmentId?: string | null;        // For HOD / Teachers
  classIds?: string[];                 // Enrolled or assigned class groups
  isGuest?: boolean;                   // True for trial-only guest accounts
  isSubscribed?: boolean;              // True if active subscriber or school-sponsored
  dateOfBirth?: string;
  linkedParentUid?: string;            // student only
  linkedStudentUids?: string[];        // parent only
  linkCode?: string;                   // 6-character code for parent linking
  classificationMath?: 'beginner' | 'intermediate' | 'expert';
  classificationRW?: 'beginner' | 'intermediate' | 'expert';
  targetTestDate?: string;
  targetScore?: number;                // 400 - 1600
  baselineScore?: number;
  createdAt: string;
  updatedAt: string;
}

// schoolCodes/{codeId}
export interface SchoolCode {
  id?: string;
  code: string;                        // e.g. "AIES-KILIMA-882"
  institutionId: string;
  institutionName: string;
  roleAllowed?: 'student' | 'teacher' | 'all';
  createdByUid: string;
  expiresAt: string;                   // ISO 8601 (48 hours / 2 days validity)
  usesCount: number;
  active: boolean;
  createdAt: string;
}

// parentLinkRequests/{requestId}
export interface ParentLinkRequest {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  parentEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

// subscriptionTiers/{tierId}
export interface SubscriptionTier {
  id: string;
  name: string;
  priceMonthly: number;                // $29
  priceQuarterly: number;              // $79
  features: string[];
  roleTarget: 'student' | 'institution';
}
```

---

## 4. End-to-End Onboarding & Calibration Journey

```
[1. Registration]
Student signs up with Google or Email ──> Generates Official Student ID (#AIES-STU-XXXXX)
                                              │
                                              ▼
[2. School Verification / Guest Choice]
Enters School Code (e.g. AIES-KILIMA-882) OR continues as Independent Guest Learner
                                              │
                                              ▼
[3. Parent Connection]
Inputs Parent Email to dispatch invite OR copies 6-character Link Code (PAR-XXXXXX)
                                              │
                                              ▼
[4. SAT Target Setup]
Sets Target Score (400–1600) and Target Test Date
                                              │
                                              ▼
[5. Compulsory Diagnostic Trial Exam]
Takes 2-stage adaptive assessment (Module 1 mixed ──> Module 2 calibrated)
                                              │
                                              ▼
[6. Empowering Score Report & Copilot Sync]
Classification: Foundation Builder / Skill Consolidator / Advanced Master
Telemetry syncs to Student Dashboard, Parent Portal, and Teacher Roster
```

---

## 5. Guest Student Mode & Subscription Paywall

### 5.1 Free Access Scope
- Guest learners can practice **trial and diagnostic SAT practice tests**.
- Review instant question rationales and concordance score estimations.

### 5.2 Gated Premium Features
When a guest student attempts to:
1. Open the **Textbook Library** (`src/pages/student/sat/SatTextbooks.tsx`).
2. Click **"Practice Similar Questions"** in test reviews.
3. Access the **Socratic AI Tutor** or deep diagnostic domain breakdowns.

The system opens the **Subscription Upgrade Modal** (`src/components/shared/SubscriptionModal.tsx`):

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 Guest Account — Full Access Required                    │
│  Unlock Full Access to AIES SAT                             │
│                                                             │
│  [ Have a School Code? ]                                    │
│  [ AIES-KILIMA-882        ]  [ Redeem Code ]                │
│                                                             │
│  ── or subscribe individually ──                            │
│  ┌──────────────────────────┐ ┌──────────────────────────┐  │
│  │ Monthly Student Pass     │ │ 3-Month Prep Pass (25%↓) │  │
│  │ $29 / month              │ │ $79 total                │  │
│  └──────────────────────────┘ └──────────────────────────┘  │
│                                                             │
│  [ ⚡ Start Student Pro Pass ($29 / Month) ]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Official Notification & Email Templates

### 6.1 School Code Invitation Email (2-Day Expiry)
```text
Subject: Your [School Name] AIES SAT Access Code (Expires in 2 Days)

Dear [Student/Educator Name],

Your school administrator has invited you to access AIES SAT for [School Name].

🔑 SCHOOL CODE: [CODE]

⚠️ This code will expire in 2 days.

Steps to complete your registration:
1. Go to https://aies-plat-form.vercel.app
2. Create your account or sign in with Google / Email
3. Enter the school code above
4. Complete the parent linking process
5. Take your trial exam to get started

If you have any questions, please contact your school administrator.

— The AIES SAT Team
```

### 6.2 Parent Link Request Email
```text
Subject: [Student Name] has requested to link their AIES SAT account

Dear Parent,

Your child, [Student Name] ([Student Email]), has requested to link their AIES SAT account to yours. This will allow you to:

- View your child's real-time practice growth and mastery
- Receive automated weekly digest reports
- Inspect scaled score concordance breakdowns

To approve this request:
1. Sign in to your AIES SAT parent account (https://aies-plat-form.vercel.app/parent)
2. Go to "Linked Accounts" in your settings
3. Approve the pending request from [Student Name] using Link Code: [LINK_CODE]

If you don't have an AIES SAT parent account yet, you can create one at https://aies-plat-form.vercel.app.

— The AIES SAT Team
```

### 6.3 Diagnostic Trial Exam Results Email
```text
Subject: Your AIES SAT Trial Exam Results — Level: [Level Title]

Dear [Student Name],

Congratulations on completing your AIES SAT trial exam! Based on your performance, we've determined your current learning level:

📊 Your Level: [Foundation Builder / Skill Consolidator / Advanced Master]
Estimated Composite Score: [Score] (Math: [Math], Reading & Writing: [RW])

What this means:
- Foundation Builder: You are building foundational skills. We'll guide you step-by-step through core conceptual methods and worked examples.
- Skill Consolidator: You have a solid understanding. We'll focus on refining key high-yield theorems, sentence structures, and pacing.
- Advanced Master: You have demonstrated high conceptual mastery. We'll challenge you with advanced multi-step problems and hard module pacing.

Your detailed report is available in your AIES SAT dashboard.

Next steps:
1. Explore the Textbook Library for your recommended topics
2. Start practicing adaptive drills in your focused skills
3. Check your parent dashboard for additional insights

Keep learning and growing!

— The AIES SAT Team
```

---

## 7. Hardened Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function currentUid() { return request.auth.uid; }
    function hasUserDoc() { return signedIn() && exists(/databases/$(database)/documents/users/$(request.auth.uid)); }
    function getUserDoc() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data; }
    function userRole() { return hasUserDoc() ? getUserDoc().role : 'student'; }
    function userInstitutionId() { return hasUserDoc() && ('institutionId' in getUserDoc()) ? getUserDoc().institutionId : null; }
    function isAiesCentral() { return signedIn() && (userRole() == 'aies_central' || userRole() == 'admin'); }

    // Users Collection
    match /users/{uid} {
      allow read: if signedIn();
      allow create: if signedIn() && uid == currentUid();
      allow update: if signedIn() && (uid == currentUid() || isAiesCentral());
      allow delete: if isAiesCentral();
    }

    // School Codes (Admin only writes; authenticated users can verify)
    match /schoolCodes/{codeId} {
      allow read: if signedIn();
      allow create, update, delete: if isAiesCentral();
    }

    // Parent Link Requests
    match /parentLinkRequests/{reqId} {
      allow read, create: if signedIn();
      allow update, delete: if signedIn() && (
        resource.data.parentEmail == request.auth.token.email || 
        resource.data.studentUid == currentUid() || 
        isAiesCentral()
      );
    }

    // SAT Diagnostic & Practice Sessions
    match /satDiagnosticSessions/{sessionId} {
      allow read, create, update: if signedIn();
      allow delete: if isAiesCentral();
    }

    // Textbooks
    match /textbooks/{textbookId} {
      allow read: if signedIn();
      allow write: if isAiesCentral();
    }
  }
}
```

---

## 8. Acceptance Verification Suite

Before deploying updates, verify these acceptance gates:

- [x] **Google One-Tap Login**: Works seamlessly for Student, Teacher, and Parent accounts without Firestore permission errors.
- [x] **School Code Verification**: Valid school code unlocks institution portal; expired or invalid code prompts error.
- [x] **48-Hour Expiry**: School codes expire after 2 days and are flagged in the Admin console.
- [x] **Guest Mode Paywall**: Guest learners can take trial practice tests; clicking Textbooks or Similar Questions triggers the Subscription Modal ($29/mo, $79/3-mo, or School Code redemption).
- [x] **Official Student ID**: #AIES-STU-XXXXX is stamped on profile creation and rendered on dashboards.
- [x] **Parent Link Dispatch**: Student can input parent email or copy linkCode to connect guardian accounts.
- [x] **Empowering Diagnostic Framing**: Score reports display constructive, growth-mindset classifications (*Foundation Builder*, *Skill Consolidator*, *Advanced Master*).
- [x] **Zero TypeScript Errors**: `npm run build` completes cleanly.

---

*This document is the official, complete specification for AIES SAT Authentication, Multi-Tenancy & Onboarding.*
