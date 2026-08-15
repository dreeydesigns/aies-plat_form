# AIES SAT — Institution Isolation & Multi-Tenant Security Specification

**For the AI App Builder — Copy-Paste This Entire Document**  
**Repository:** https://github.com/dreeydesigns/aies-plat_form

**Status:** This document is a focused extension of the Master Implementation Blueprint v4. It is the single source of truth for all institution isolation, login binding, and data privacy logic.

**Non-negotiable rule:** No user may ever see data belonging to another institution. This is not a UI concern — it must be enforced at the database layer, the server layer, and the client layer.

---

## 0. Standing Design Principle

Before implementing any feature, reason from this invariant:

> Every document that is institution-scoped must carry an `institutionId`  
> and every read/write path must filter by the signed-in user's `institutionId`,  
> validated server-side, never trusted from the client alone.

If a query does not filter by institution, it is a security bug, not a missing feature.

---

## 1. Threat Model

**What we are defending against:**

| Risk | Example |
|------|---------|
| Accidental cross-tenant read | School A teacher queries all attempts and accidentally renders School B students |
| Malicious client-side query | Student modifies app code to fetch `/attempts?institutionId=other` |
| IDOR (Insecure Direct Object Reference) | User changes a document ID in a URL and reads another tenant's data |
| Privilege confusion | A teacher from School A sends a Cloud Function call with `institutionId: "school-b"` |
| Data leakage through reports | Weekly digest or PDF export mixes users from multiple institutions |
| Firestore rules too permissive | Missing `match` rule exposes a new collection to all authenticated users |

**Security boundary:** `institutionId` is the tenant identifier. It must be immutable for the life of an account unless an AIES Central admin performs an official transfer.

---

## 2. Core Isolation Principle

### 2.1 Every tenant-scoped document carries `institutionId`

| Collection | institutionId required |
|------------|------------------------|
| `users` | Yes, for staff and students. Parent exception below |
| `classes` | Yes |
| `departments` | Yes |
| `attempts` | Yes |
| `assignedTests` | Yes |
| `notifications` | Yes |
| `libraryContent` (institution scope) | Yes |
| `textbooks`, `textbookChapters`, `textbookSections`, `textbookPages` | Only for institution-specific books. Global Core Library books have `scope: "global"` and no institutionId |
| `questions` | Global questions (from Core Library) have `scope: "global"`. Institution-generated questions have `institutionId` |

### 2.2 Global vs Institution content

- **Global Core Library:** maintained by AIES Central. Readable by all authenticated users. Not writable by any institution user.
- **Institution Library:** `institutionId` set. Readable only by members of that institution. Writable only by that institution's authorized roles with appropriate approvals.

---

## 3. User Onboarding & Institution Binding

### 3.1 How a user gets an `institutionId`

**All staff and students must be bound to exactly one institution at account creation.** There is no "unaffiliated student" in this SAT platform.

**Binding mechanisms:**

| Mechanism | Use case |
|-----------|----------|
| **Institution invite link/token** | AIES Central or Principal sends an invite link containing institutionId and role. User signs up via link; `institutionId` is stamped at creation |
| **Institution code** | School provides a short code. User enters during signup; code resolves to institutionId |
| **Email domain allowlist** | Institution whitelists `@school.edu`. Users signing up with that domain auto-bind to that institution |
| **AIES Central manual provisioning** | Admin creates the account and assigns institutionId |

**Once set, `institutionId` cannot be changed by the user.** Only AIES Central admin or a Principal with explicit transfer permissions can change it, and only through a logged, auditable operation.

### 3.2 Student onboarding flow

1. Student clicks institution invite link or enters institution code.
2. System validates link/code and shows institution name for confirmation:  
   *"You are joining [Institution Name]. Continue?"*
3. Student signs up with email/password or Google.
4. On account creation, Cloud Function sets `institutionId` from the invite token/code and writes it to `users/{uid}`.
5. Student is then placed into the correct `classes/{classId}` by the teacher/admin, or auto-enrolled via class code.

### 3.3 Teacher / HOD / Principal onboarding flow

1. Institution Principal or AIES Central sends a role-specific invite link:  
   `https://aies.app/invite?token=...&role=class_teacher&institutionId=...`
2. User signs up. Cloud Function stamps `institutionId` and `role`.
3. If Principal, institution doc is updated with `principalUid`.
4. If HOD, `departmentId` is assigned; if department doesn't exist, it is created.
5. If Class Teacher, they are assigned to specific classes by the Principal or HOD.

### 3.4 Parent account — special case

Parents do not have a single `institutionId`. They are linked to children via `linkedStudentUids`. Their read access is scoped by those linked student documents:

- Parent can read `users/{childUid}` for each linked child.
- Parent can read `attempts` where `studentUid` is in their `linkedStudentUids`.
- Parent cannot query by institution; their access is always child-scoped.

This prevents a parent at School A from seeing School B data even if they have children in both schools — they only see their own children.

### 3.5 Login session and claims

On every login/session refresh:

1. Firebase Auth issues a token.
2. A Cloud Function (`onUserCreated` and `onTokenRefresh`) loads the user's `institutionId`, `role`, `departmentId`, and `classIds`.
3. It sets Firebase Custom Claims on the Auth token:
   ```json
   {
     "role": "class_teacher",
     "institutionId": "inst-123",
     "departmentId": "dept-math",
     "classIds": ["class-456"]
   }
   ```
4. Client uses claims for route guards, but Firestore rules still independently verify against the user doc — **claims are a convenience, not a security boundary**.

---

## 4. Data Model Changes

### 4.1 User doc

```typescript
interface User {
  uid: string;
  email: string;
  role: 'aies_central' | 'principal' | 'deputy_principal' | 'hod' | 'class_teacher' | 'student' | 'parent';
  institutionId?: string;          // null only for aies_central and parent
  departmentId?: string;
  classIds?: string[];
  linkedStudentUids?: string[];    // parent only
  // ...
}
```

### 4.2 Other collections

```typescript
interface Class {
  id: string;
  institutionId: string;
  departmentId: string;
  name: string;
  classTeacherUid: string;
  studentUids: string[];
}

interface Attempt {
  id: string;
  institutionId: string;
  studentUid: string;
  // ...
}

interface Question {
  id: string;
  scope: 'global' | 'institution';
  institutionId?: string;
  // ...
}
```

---

## 5. Firestore Security Rules

The rules below are the actual enforcement layer. Implement them exactly.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ---------- Helpers ----------
    function signedIn() {
      return request.auth != null;
    }

    function currentUid() {
      return request.auth.uid;
    }

    function getUserDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function userRole() {
      return getUserDoc().role;
    }

    function userInstitutionId() {
      return getUserDoc().institutionId;
    }

    function isAiesCentral() {
      return signedIn() && userRole() == 'aies_central';
    }

    function isPrincipal() {
      return signedIn() && userRole() == 'principal';
    }

    function isDeputyPrincipal() {
      return signedIn() && userRole() == 'deputy_principal';
    }

    function isHod() {
      return signedIn() && userRole() == 'hod';
    }

    function isClassTeacher() {
      return signedIn() && userRole() == 'class_teacher';
    }

    function isStudent() {
      return signedIn() && userRole() == 'student';
    }

    function isParent() {
      return signedIn() && userRole() == 'parent';
    }

    // Same institution
    function sameInstitution(docInstitutionId) {
      return signedIn()
        && userInstitutionId() != null
        && userInstitutionId() == docInstitutionId;
    }

    // ---------- Users ----------
    match /users/{uid} {
      // Read own profile
      function isOwnUser() { return signedIn() && uid == currentUid(); }

      // Parent can read linked child
      function isLinkedChild() {
        return isParent()
          && getUserDoc().linkedStudentUids.hasAny([uid]);
      }

      // Institution staff can read users in same institution
      function isSameInstStaff() {
        return sameInstitution(
          get(/databases/$(database)/documents/users/$(uid)).data.institutionId
        ) && (
          isPrincipal()
          || isDeputyPrincipal()
          || isHod()
          || isClassTeacher()
        );
      }

      // AIES Central can read all
      allow read: if isOwnUser() || isAiesCentral() || isLinkedChild() || isSameInstStaff();

      // Write own user, but cannot change institutionId
      allow update: if isOwnUser()
        && request.resource.data.institutionId == resource.data.institutionId;

      // Delete not allowed
      allow delete: if false;
    }

    // ---------- Institutions ----------
    match /institutions/{institutionId} {
      allow read: if sameInstitution(institutionId) || isAiesCentral();
      allow write: if isAiesCentral();
    }

    // ---------- Departments ----------
    match /departments/{departmentId} {
      function departmentDoc() {
        return get(/databases/$(database)/documents/departments/$(departmentId)).data;
      }
      function isSameInstDept() {
        return sameInstitution(departmentDoc().institutionId);
      }
      allow read: if isSameInstDept() || isAiesCentral();
      allow create: if isAiesCentral() || isPrincipal() && sameInstitution(request.resource.data.institutionId);
      allow update: if isAiesCentral() || isPrincipal() && isSameInstDept();
      allow delete: if isAiesCentral();
    }

    // ---------- Classes ----------
    match /classes/{classId} {
      function classDoc() { return get(/databases/$(database)/documents/classes/$(classId)).data; }
      function isClassTeacherOf() {
        return isClassTeacher() && classDoc().classTeacherUid == currentUid();
      }
      function isStudentInClass() {
        return isStudent() && classDoc().studentUids.hasAny([currentUid()]);
      }
      function isSameInst() { return sameInstitution(classDoc().institutionId); }
      allow read: if isAiesCentral() || isSameInst() && (isPrincipal() || isDeputyPrincipal() || isHod() || isClassTeacherOf() || isStudentInClass());
      allow create: if isAiesCentral() || isPrincipal() && sameInstitution(request.resource.data.institutionId);
      allow update: if isAiesCentral() || (isPrincipal() || isDeputyPrincipal() || isClassTeacherOf()) && isSameInst();
      allow delete: if isAiesCentral() || isPrincipal() && isSameInst();
    }

    // ---------- Attempts ----------
    match /attempts/{attemptId} {
      function attemptDoc() { return get(/databases/$(database)/documents/attempts/$(attemptId)).data; }
      function isOwner() { return isStudent() && attemptDoc().studentUid == currentUid(); }
      function isParentOfOwner() { return isParent() && getUserDoc().linkedStudentUids.hasAny([attemptDoc().studentUid]); }
      function isSameInstStaff() { return sameInstitution(attemptDoc().institutionId) && (isPrincipal() || isDeputyPrincipal() || isHod() || isClassTeacher()); }
      allow read: if isAiesCentral() || isOwner() || isParentOfOwner() || isSameInstStaff();
      allow create: if isStudent() && request.resource.data.studentUid == currentUid() && request.resource.data.institutionId == userInstitutionId();
      allow update: if isOwner();
      allow delete: if false;
    }

    match /attempts/{attemptId}/responses/{responseId} {
      function attemptDoc() { return get(/databases/$(database)/documents/attempts/$(attemptId)).data; }
      function isOwner() { return isStudent() && attemptDoc().studentUid == currentUid(); }
      allow read: if isAiesCentral() || isOwner()
        || (isParent() && getUserDoc().linkedStudentUids.hasAny([attemptDoc().studentUid]))
        || (sameInstitution(attemptDoc().institutionId) && (isPrincipal() || isDeputyPrincipal() || isHod() || isClassTeacher()));
      allow write: if isOwner();
    }

    // ---------- Questions ----------
    match /questions/{questionId} {
      function questionDoc() { return get(/databases/$(database)/documents/questions/$(questionId)).data; }
      function isGlobal() { return questionDoc().scope == 'global'; }
      function isSameInst() { return questionDoc().scope == 'institution' && sameInstitution(questionDoc().institutionId); }
      allow read: if signedIn() && (isGlobal() || isSameInst());
      allow create: if isAiesCentral() || (isClassTeacher() && request.resource.data.institutionId == userInstitutionId());
      allow update: if isAiesCentral() || (isClassTeacher() && isSameInst());
      allow delete: if isAiesCentral();
    }

    // ---------- Textbooks (Global + Institution) ----------
    match /textbooks/{textbookId} {
      function textbookDoc() { return get(/databases/$(database)/documents/textbooks/$(textbookId)).data; }
      function isGlobalBook() { return textbookDoc().scope == 'global'; }
      function isSameInstBook() { return textbookDoc().scope == 'institution' && sameInstitution(textbookDoc().institutionId); }
      allow read: if signedIn() && (isGlobalBook() || isSameInstBook());
      allow write: if isAiesCentral();
    }

    match /textbookChapters/{chapterId} {
      function chapterDoc() { return get(/databases/$(database)/documents/textbookChapters/$(chapterId)).data; }
      function bookDoc() { return get(/databases/$(database)/documents/textbooks/$(chapterDoc().textbookId)).data; }
      function isGlobalBook() { return bookDoc().scope == 'global'; }
      function isSameInstBook() { return bookDoc().scope == 'institution' && sameInstitution(bookDoc().institutionId); }
      allow read: if signedIn() && (isGlobalBook() || isSameInstBook());
      allow write: if isAiesCentral();
    }

    match /textbookSections/{sectionId} {
      function sectionDoc() { return get(/databases/$(database)/documents/textbookSections/$(sectionId)).data; }
      function bookDoc() { return get(/databases/$(database)/documents/textbooks/$(sectionDoc().textbookId)).data; }
      function isGlobalBook() { return bookDoc().scope == 'global'; }
      function isSameInstBook() { return bookDoc().scope == 'institution' && sameInstitution(bookDoc().institutionId); }
      allow read: if signedIn() && (isGlobalBook() || isSameInstBook());
      allow write: if isAiesCentral() || (isClassTeacher() && isSameInstBook());
    }

    match /textbookPages/{pageId} {
      function pageDoc() { return get(/databases/$(database)/documents/textbookPages/$(pageId)).data; }
      function bookDoc() { return get(/databases/$(database)/documents/textbooks/$(pageDoc().textbookId)).data; }
      function isGlobalBook() { return bookDoc().scope == 'global'; }
      function isSameInstBook() { return bookDoc().scope == 'institution' && sameInstitution(bookDoc().institutionId); }
      allow read: if signedIn() && (isGlobalBook() || isSameInstBook());
      allow write: if isAiesCentral();
    }

    // ---------- Assigned Tests ----------
    match /assignedTests/{assignedTestId} {
      function assignedDoc() { return get(/databases/$(database)/documents/assignedTests/$(assignedTestId)).data; }
      function isSameInstStaff() { return sameInstitution(assignedDoc().institutionId) && (isPrincipal() || isDeputyPrincipal() || isHod() || isClassTeacher()); }
      function isTargetStudent() { return isStudent() && assignedDoc().studentUids.hasAny([currentUid()]); }
      allow read: if isAiesCentral() || isSameInstStaff() || isTargetStudent();
      allow create: if isClassTeacher() && request.resource.data.institutionId == userInstitutionId();
      allow update: if isSameInstStaff() && sameInstitution(request.resource.data.institutionId);
      allow delete: if isSameInstStaff();
    }

    // ---------- Notifications ----------
    match /notifications/{notificationId} {
      function notifDoc() { return get(/databases/$(database)/documents/notifications/$(notificationId)).data; }
      allow read: if signedIn() && notifDoc().toUid == currentUid();
      allow create: if isAiesCentral() || isClassTeacher() || isPrincipal() || isDeputyPrincipal() || isHod();
      allow update: if signedIn() && notifDoc().toUid == currentUid();
      allow delete: if signedIn() && notifDoc().toUid == currentUid();
    }

    // ---------- Library Content (Approval Queue) ----------
    match /libraryContent/{contentId} {
      function contentDoc() { return get(/databases/$(database)/documents/libraryContent/$(contentId)).data; }
      function isSameInst() { return sameInstitution(contentDoc().institutionId); }
      function isGlobalContent() { return contentDoc().scope == 'global'; }
      allow read: if isAiesCentral() || (isGlobalContent() && signedIn()) || (isSameInst() && (isPrincipal() || isDeputyPrincipal() || isHod() || isClassTeacher()));
      allow create: if isClassTeacher() && request.resource.data.institutionId == userInstitutionId();
      allow update: if isAiesCentral() || (isSameInst() && (isHod() || isPrincipal() || isDeputyPrincipal()));
      allow delete: if isAiesCentral();
    }
  }
}
```

**Critical rules:**
- Never allow `allow read: if signedIn()` on an institution-scoped collection without an institution check.
- Never trust `request.resource.data.institutionId` from the client. In rules where creation is allowed, the client-supplied institutionId must equal `userInstitutionId()`, as shown.

---

## 6. Cloud Functions & Server-Side Access

Client-supplied `institutionId` must never be trusted in Cloud Functions. Always derive the caller's institution from their authenticated user doc.

### 6.1 Canonical pattern

```javascript
// assignTest
exports.assignTest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

  const callerRef = await admin.firestore().collection('users').doc(context.auth.uid).get();
  const caller = callerRef.data();

  if (caller.role !== 'class_teacher' && caller.role !== 'hod' && caller.role !== 'principal' && caller.role !== 'deputy_principal') {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }

  const callerInstitutionId = caller.institutionId;
  if (!callerInstitutionId) {
    throw new functions.https.HttpsError('failed-precondition', 'No institution assigned');
  }

  // Validate that target students belong to caller's institution
  const targetUids = data.studentUids || [];
  const targetUsers = await admin.firestore().collection('users')
    .where(admin.firestore.FieldPath.documentId(), 'in', targetUids)
    .get();

  for (const doc of targetUsers.docs) {
    if (doc.data().institutionId !== callerInstitutionId) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot assign test to students outside your institution');
    }
  }

  const assignedTest = {
    ...data,
    teacherUid: context.auth.uid,
    institutionId: callerInstitutionId,   // server-derived, not from client
    notificationSent: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection('assignedTests').add(assignedTest);
});
```

### 6.2 Upload source material

Same pattern: derive institutionId from caller user doc. When creating a `libraryContent` document for Tier 2 review, set `institutionId: caller.institutionId`. Do not read `data.institutionId` from client.

### 6.3 Approve content (HOD)

```javascript
exports.approveLibraryContent = functions.https.onCall(async (data, context) => {
  // Verify caller is HOD for the same subject and institution
  const caller = (await admin.firestore().collection('users').doc(context.auth.uid).get()).data();
  if (caller.role !== 'hod') throw ...;

  const contentId = data.contentId;
  const content = await admin.firestore().collection('libraryContent').doc(contentId).get();
  if (content.data().institutionId !== caller.institutionId) {
    throw new functions.https.HttpsError('permission-denied', 'Cannot approve content outside your institution');
  }
  // Check subject matches HOD department
  const dept = await admin.firestore().collection('departments').doc(caller.departmentId).get();
  if (dept.data().subject !== content.data().domainGroup) { // adjust mapping
    throw ...;
  }
  // Approve
});
```

---

## 7. Client-Side Data Access Rules

Even with Firestore rules, the client must:

1. **Set institution filter on every query** for institution-scoped collections:
   ```javascript
   const q = query(collection(db, 'attempts'), where('institutionId', '==', user.institutionId));
   ```
2. **Never rely on user input** for institutionId. Always use the signed-in user's own `institutionId` from their user doc or custom claims.
3. **Hide institution-scoped UI** if `user.institutionId` is missing or invalid.
4. **Use custom claims** for route guards:
   ```javascript
   if (claims.institutionId !== expectedInstitutionId) redirect('/access-denied');
   ```
   But remember: route guards are UX, not security.

---

## 8. Custom Claims Implementation

Set claims via Cloud Function on user creation and institution changes.

```javascript
exports.setCustomClaimsOnCreate = functions.auth.user().onCreate(async (user) => {
  const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
  const data = userDoc.data();
  await admin.auth().setCustomUserClaims(user.uid, {
    role: data.role,
    institutionId: data.institutionId || null,
    departmentId: data.departmentId || null,
    classIds: data.classIds || null,
  });
});

exports.refreshClaimsOnUserUpdate = functions.firestore
  .document('users/{uid}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.institutionId !== after.institutionId
        || before.role !== after.role
        || before.departmentId !== after.departmentId
        || JSON.stringify(before.classIds) !== JSON.stringify(after.classIds)) {
      await admin.auth().setCustomUserClaims(context.params.uid, {
        role: after.role,
        institutionId: after.institutionId || null,
        departmentId: after.departmentId || null,
        classIds: after.classIds || null,
      });
    }
  });
```

---

## 9. Institution Admin & Provisioning

### 9.1 Institution creation

- Only AIES Central can create `institutions/{institutionId}` documents.
- On creation, AIES Central also creates the default `departments` for Math and Reading & Writing, or leaves them to be created by Principal.
- The first Principal account is provisioned via invite link generated by AIES Central.

### 9.2 School self-serve onboarding (Phase 2)

- AIES Central generates an **institution invite link** with embedded institutionId and role.
- The link may also include a class code or department assignment.
- No self-serve institution creation by public users. This prevents rogue schools from claiming arbitrary institution IDs.

### 9.3 Transferring a user between institutions

- Must be an auditable operation.
- Only AIES Central can change a user's `institutionId`.
- When changing institutionId, you must also:
  - Remove from all old classes.
  - Reassign to new classes if applicable.
  - Refresh custom claims.
  - Log the transfer in `securityEvents`.
- Never allow a Principal to change another user's institutionId, even within their own institution.

---

## 10. Migration Plan for Existing Users

For any existing users in the current flat system:

1. **Audit all collections.** Identify every collection that contains user-generated content.
2. **Assign institutionId** to all users based on their school email domain, class membership, or manual mapping.
3. **Backfill institutionId** on all tenant-scoped documents:
   - `classes` → from their institution
   - `attempts` → from their student's institutionId
   - `assignedTests` → from their teacher's institutionId
   - `notifications` → from `toUid`'s institutionId
   - `libraryContent` → from uploader's institutionId
4. **Set default scope** for existing `questions` and `textbooks`: all existing content is either Global Core or assigned to one institution. Decide explicitly.
5. **Run a script to verify no document has a missing `institutionId`** where required.
6. **Deploy Firestore rules only after backfill is complete**, otherwise users will lose access.

---

## 11. Acceptance Tests

Create automated tests using the Firestore emulator.

| Test | Expected |
|------|----------|
| Student from School A reads own attempt | Allowed |
| Student from School A reads School B attempt | Denied |
| Teacher from School A reads School B student list | Denied |
| Teacher from School A reads own class attempt | Allowed |
| Teacher from School A reads attempt of student not in their class but same school | Allowed? **Decide: same-institution staff can read all attempts. If stricter needed, add class check.** Default: allowed for Principal/HOD; Class Teacher should be restricted to their own classes. Implement class teacher check accordingly. |
| Parent reads child attempt (linked) | Allowed |
| Parent reads non-child attempt | Denied |
| Principal from School A reads all School A attempts | Allowed |
| Principal from School A writes to School B | Denied |
| HOD approves library content in own subject/institution | Allowed |
| HOD approves content outside subject | Denied |
| Global Core textbook read by any authenticated user | Allowed |
| Institution textbook read by other institution user | Denied |
| User updates own `institutionId` | Denied |
| Cloud Function assignTest with mismatched target student institution | Denied |
| Cloud Function upload source sets institutionId from caller | Passes |
| New signup via invite link stamps institutionId | Passes |
| Custom claims reflect institutionId after creation | Passes |

---

## 12. Security Logging & Audit

Implement a `securityEvents` collection for audit trail:

```typescript
interface SecurityEvent {
  id: string;
  type: 'institution_change' | 'role_change' | 'content_approved' | 'test_assigned' | 'access_denied';
  actorUid: string;
  targetUid?: string;
  institutionId: string;
  metadata: Record<string, any>;
  timestamp: string;
}
```

Log:
- Any change to `institutionId`, `role`, `departmentId`, `classIds`.
- All content approvals (Tier 2/3).
- All Cloud Function permission denials.
- All test assignments.

---

## 13. Non-Negotiables Summary

1. **Every tenant-scoped document has `institutionId`.**
2. **Every read/write path filters by the signed-in user's institutionId.**
3. **Firestore rules enforce isolation even if client code is malicious.**
4. **Cloud Functions derive institutionId from the caller's user doc, never from client input.**
5. **Custom claims are for UX, not security.**
6. **No public self-serve institution creation.**
7. **Parents are child-scoped, not institution-scoped.**
8. **Global Core Library is read-only for institutions.**
9. **Institution-scoped content is invisible to other institutions.**
10. **All institution changes are auditable.**

---

**This document is the single source of truth for institution isolation.**  
Build it before any multi-school pilot.
