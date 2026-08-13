# AIES SAT — Master Build Log

### Single Source of Truth for Africa's First AI-Native SAT Preparation Platform

| Phase | Section | Status | Notes | Date |
|---|---|---|---|---|
| **0. Foundation & Compliance Gate** | | | | |
| 0.1 | Extend Types (`types.ts`) | **Done** | Full SAT model: `SatDomain`, `SatQuestion` (with `isSPR`), `SatDiagnosticSession`, `SatPracticeSession`, `SatPracticeTest`, `FiveFingerLog`, `Textbook`, `AssignedTest`, `CognitiveProfile`, `SatProfile`. | 2026-08-14 |
| 0.2 | Firestore Rules (`firestore.rules`) | **Done** | Granular security rules for `satQuestions`, `satDiagnosticSessions`, `satPracticeSessions`, `satPracticeTests`, `fiveFingerLogs`, `textbooks`, `assignedTests`, `emotionalStateLogs`. | 2026-08-14 |
| 0.3 | Content Legality Gate | **Done** | Seeded original, hand-authored question bank across all 8 SAT domains and 3 difficulty tiers with textbook citations. NO scraped content. | 2026-08-14 |
| 0.4 | Signup & Cognitive Profile | **Done** | Age-gate, target score / date onboarding, and optional 3-question psychometric profile. | 2026-08-14 |
| 0.5 | Parent Management Dashboard | **Done** | SAT progress and parent consent controls wired up. | 2026-08-14 |
| **1. Onboarding & Subject Choice** | | | | |
| 1.1 | Subject Choice Gateway (`SubjectChoiceModal.tsx`) | **Done** | Clean entry screen for Math vs Reading & Writing (~20 min diagnostic baseline). | 2026-08-14 |
| 1.2 | SAT-Only Navigation (`StudentLayout.tsx`) | **Done** | Standardized student navigation: Home, Textbooks, Practice & Prepare, Diagnostic Test, Test Center, Score Reports, Settings. | 2026-08-14 |
| 1.3 | SAT Command Center (`StudentDashboard.tsx`) | **Done** | Target score countdown, 8-domain mastery status, teacher assigned workouts, AI grounded research assistant. | 2026-08-14 |
| **2. Diagnostic Engine (Trial Test)** | | | | |
| 2.1 | Adaptive Module Delivery (`SatDiagnostic.tsx`) | **Done** | Module 1 mixed difficulty -> threshold evaluation -> Module 2 adaptive routing with time/latency and revisit telemetry. | 2026-08-14 |
| 2.2 | 5-Finger Formula Metacognitive Widget | **Done** | `FiveFingerWidget.tsx` integrated in Module 1 to capture struggle rationale and lucky guess analysis. | 2026-08-14 |
| 2.3 | Hard Module 2 Score Cap Warning | **Done** | Easy Module 2 cap notice (~600 limit) and Hard Module 2 achievement notifications. | 2026-08-14 |
| 2.4 | Diagnostic Report & Gemini Narrative | **Done** | 8-domain taxonomy placement (`beginner`/`intermediate`/`expert`), 5-Finger breakdown, bookmark analysis. | 2026-08-14 |
| **3. Practice Modes** | | | | |
| 3.1 | Mixed & Topic-Specific Practice (`SatPractice.tsx`) | **Done** | Dual tabs ("All Topics" weighted mix & "Choose Topic" single domain). | 2026-08-14 |
| 3.2 | Continuous Level-Up Calibration | **Done** | Rolling >80% accuracy over 10 items triggers celebration modal (`LevelUpModal.tsx`) and elevates domain tier. | 2026-08-14 |
| 3.3 | Wrong-Answer Deep Remediation Loop | **Done** | Immediate explanation + deep-link jumper to textbook page with highlighted text snippet. | 2026-08-14 |
| 3.4 | Student-Produced Response (`SprInput.tsx`) | **Done** | Grid-in support with 5-char limit, decimal/fraction syntax validation, and mixed-number rejection. | 2026-08-14 |
| **4. Textbook Library** | | | | |
| 4.1 | Curated Catalog & Reader (`SatTextbooks.tsx`) | **Done** | Foundations of SAT Math & Mastering Digital SAT Reading & Writing with instant scroll-to-highlight reader. | 2026-08-14 |
| **5. Teacher Assignment & Progress** | | | | |
| 5.1 | Teacher Assignment UI (`SatAssignTest.tsx`) | **Done** | Section/domain/difficulty configuration, notification dispatch. | 2026-08-14 |
| 5.2 | Teacher SAT Progress Copilot (`TeacherReports.tsx`) | **Done** | Class-wide domain mastery radar & AI narrative student insights. | 2026-08-14 |
| **6. Full Practice Tests** | | | | |
| 6.1 | Full Test Runner (`SatTestRunner.tsx`) | **Done** | Math-only, English-only, or Full SAT with official timing, review flagging, 5-Finger widget, and auto-submit. | 2026-08-14 |
| 6.2 | Concordance Score Estimation (`concordance.ts`) | **Done** | Scaled lookup (200-800 per section, 400-1600 total) with mandatory non-official disclaimer. | 2026-08-14 |
| 6.3 | Post-Test Recommendations | **Done** | Skill-targeted remediation questions for every missed item. | 2026-08-14 |
| **7. Desmos Graphing Calculator** | | | | |
| 7.1 | Embedded Desmos API (`DesmosCalculator.tsx`) | **Done** | Official Desmos API integration for Math test/practice sections; hidden in English. | 2026-08-14 |
| **8. 5-Finger & Bookmark Analytics** | | | | |
| 8.1 | Score Reports & Metacognitive Matrix (`SatScores.tsx`) | **Done** | Historical trajectory curves, 5-Finger lucky guess vs error tracking, and Expected Struggles vs Careless Blindspots matrix. | 2026-08-14 |
| **9. Emotional & Cognitive Awareness** | | | | |
| 9.1 | Real-Time Nudges (`EmpathyResetModal.tsx`) | **Done** | 30s calming micro-break modal on consecutive mistakes or cognitive fatigue. | 2026-08-14 |
| **10. Parent & WhatsApp Integration** | | | | |
| 10.1 | Weekly Plain-Language Digest & Consent | **Done** | WhatsApp/SMS simulation & minor privacy controls. | 2026-08-14 |
| **11. Offline & Data-Light Mode** | | | | |
| 11.1 | PWA Caching & Data-Light Toggle (`DataLightBanner.tsx`) | **Done** | Bandwidth saver banner & local caching. | 2026-08-14 |
