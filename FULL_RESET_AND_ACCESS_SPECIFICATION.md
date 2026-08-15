# AIES SAT — Full Reset & Consolidated Account Access Flow Specification

**Repository:** https://github.com/dreeydesigns/aies-plat_form  
**Status:** Canonical Reference for Database Reset, Account Provisioning, and Access Control.

---

## 1. Full Reset Architecture

### 1.1 Preserved Collections (AI & Curricular Intelligence Layer)
The following collections represent the platform's core content, adaptive models, and psychometric tables. **They are never deleted during user resets:**
- `questions/{qid}` — Calibrated Digital SAT item pool across all 8 domains.
- `textbooks/{textbookId}` — 4-volume interactive curriculum (Algebra, Advanced Math, Problem Solving/Data Analysis, Geometry & Trig).
- `libraryContent/{contentId}` — Approved instructional media and walkthrough assets.
- `scoreConversionTables/{version}` — Scaled equating and concordance tables (400–1600).
- `subscriptionTiers/{tierId}` — System pricing tiers ($29/mo, $79/3-mo, institutional bulk).

### 1.2 Wiped Collections (User & Institutional State)
The reset completely purges user-generated and institutional records:
- `users/{uid}` (Preserves designated admin UID only)
- `attempts/{attemptId}` & `submissions/{submissionId}`
- `institutions/{institutionId}` & `departments/{departmentId}` & `classes/{classId}`
- `schoolCodes/{code}`
- `parentLinkRequests/*`, `guestSessions/*`, `notifications/*`
- `agentEvents/*`, `misconceptionCases/*`, `retakePrompts/*`
- `assignedTests/*`, `satDiagnostics/*`, `satPractices/*`, `satTests/*`
- `emailVerificationCodes/*`

### 1.3 Firebase Authentication Purge
Deleting Firestore documents does not delete Auth identities. The server script invokes:
```typescript
const list = await admin.auth().listUsers(1000);
const uidsToDelete = list.users.map(u => u.uid).filter(uid => uid !== adminUid);
await admin.auth().deleteUsers(uidsToDelete);
```
Executed via `node scripts/full-reset.cjs <ADMIN_UID> [SERVICE_ACCOUNT_PATH]`.

---

## 2. The Consolidated Account Access Flow

```
1. Landing Page (/) → "Get Started" or "Sign In" (/auth)
      │
2. Choose Account Type — Student / Educator / Parent
   (Displayed for new sign-ups and brand-new Google logins before writing to Firestore.
   Admin, Principal, and HOD roles are strictly invite-only.)
      │
3. Email Verification Gate
      │
      ├─ Google Sign-In → SKIPS this step (email pre-verified via Google OAuth).
      │
      └─ Email/Password Sign-Up → REQUIRED:
            a. 6-digit numeric verification code dispatched to email.
            b. User inputs code within 15-minute TTL.
            c. Account marked verified and confirmation email dispatched.
      │
4. Role-Based Institutional Binding:
      │
      ├─ Student / Educator → VALID SCHOOL CODE REQUIRED
      │     Account must be bound to a school before accessing /student or /teacher.
      │
      ├─ Parent → NO SCHOOL CODE REQUIRED.
      │     Enters /parent directly to link child or inspect growth metrics.
      │
      └─ Guest → ZERO FRICTION.
            Anonymous session straight into Trial SAT Practice.
      │
5. Role-Specific Workspace Dashboard (/student, /teacher, /parent, /admin)
```

---

## 3. Two Codes, Two Different Jobs

| Feature | Email Verification Code | School Code |
|---|---|---|
| **Primary Purpose** | Proves email ownership | Validates institutional membership |
| **Issuer** | Automated system service | School Administrator |
| **Applicability** | Email/Password signups only (Google skips) | Student & Educator accounts only |
| **Lifecycle / TTL** | 10–15 minutes (Single use) | Admin-managed window (e.g., 2–48 hours) |
| **Firestore Path** | `emailVerificationCodes/{uid}` | `schoolCodes/{code}` |

---

## 4. Account Chooser Live Verification Checklist

- [x] **Root Routing**: Visiting `/` routes to the marketing website (src/pages/public/LandingPage.tsx).
- [x] **New Google Flow**: Brand-new Google users see the **"What type of account is this?"** selector card before any Firestore profile is initialized.
- [x] **Existing User Bypass**: Existing users sign in straight to their dashboard based on their stored role.
- [x] **Email Verification Templates**: Added to src/utils/email-templates.ts.
- [x] **Server Reset Utility**: Available at scripts/full-reset.cjs.

---
*Persisted to FULL_RESET_AND_ACCESS_SPECIFICATION.md.*
