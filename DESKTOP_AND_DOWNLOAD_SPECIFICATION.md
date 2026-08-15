# AIES SAT — Desktop Download & Website Dual-Path Specification

**For the AI App Builder — Copy and Paste This Entire Document**  
**Repository:** https://github.com/dreeydesigns/aies-plat_form

**Status:** This document is the single source of truth for packaging AIES SAT as an installable desktop application, resolving Google OAuth in embedded environments via custom protocols, offline caching, and dual-path marketing integration.

---

## 0. What "Get Started" vs "Download" Means

- **Get Started in Browser (Primary CTA)**: Instant zero-install web application at https://aies-plat-form.vercel.app with complete cloud synchronization.
- **Download Native Desktop App (Secondary CTA)**: Standalone desktop installer (Windows .exe / macOS .dmg / Linux .AppImage) with offline practice caching, persistent local storage, and instant launch into authentication/dashboard.

---

## 1. Packaging Architecture — Electron

### 1.1 Technical Rationale
- Uses Electron over Tauri to ensure 100% compatibility with Firebase JS SDK (v12) Auth, IndexedDB persistence, and KaTeX math rendering.
- Wraps the existing Vite build output (`dist/`) via `electron-builder`, avoiding duplicate UI maintenance.

### 1.2 Electron Configuration (`electron/main.cjs` & `electron/preload.cjs`)
- **Protocol Registration**: Registers custom protocol `aiessat://` on the operating system.
- **Window Specs**: Minimum 1024 x 700, default 1280 x 860, with native sandboxing enabled.
- **Deep Linking**: Listens for `open-url` (macOS) and `second-instance` (Windows) to handle OAuth handshakes.

---

## 2. Google OAuth System-Browser Protocol Handshake

### 2.1 The Embedded Webview Restriction
Google deliberately blocks OAuth inside embedded webviews (`disallowed_useragent`). Naive `signInWithPopup` inside Electron will fail.

### 2.2 Protocol Handoff Solution
1. When a desktop user clicks **"Continue with Google"**, the app detects the Electron runtime via `window.electronAPI`.
2. The app invokes `electronAPI.openExternalOAuth('google')`, opening the user's default system browser.
3. Upon authentication, the redirect endpoint activates the custom protocol:
   ```
   aiessat://auth-callback?token=[FIREBASE_ID_TOKEN]
   ```
4. Electron captures the activation and signs into Firebase via `signInWithCredential`.

---

## 3. Offline Practice & Persistence

- **Local Firestore Cache**: Initialized in `src/lib/firebase.ts` via `persistentLocalCache({ tabManager: persistentMultipleTabManager() })`.
- **Offline Scope**:
  - Previously loaded practice questions, diagnostic tests, and textbook sections are fully accessible offline.
  - Test submissions and diagnostic answers are queued locally and synchronized automatically upon reconnect.
  - Initial authentication requires online connectivity; sessions remain valid offline thereafter.

---

## 4. Build Targets & Platform Signing

| Platform | Target Package | Tooling | Signing & Security Requirements |
|---|---|---|---|
| **Windows** | `.exe` (NSIS Installer) | `electron-builder --win` | EV Code Signing Certificate to prevent SmartScreen warnings |
| **macOS** | `.dmg` (Universal Binary) | `electron-builder --mac` | Apple Developer ID Certificate + `notarytool` notarization |
| **Linux** | `.AppImage` | `electron-builder --linux` | Standard self-contained executable |

---

## 5. Website Dual-Path Component (`src/components/shared/DesktopDownloadCard.tsx`)

- **OS Auto-Detection**: Uses `navigator.userAgent` and `navigator.platform` to highlight the visitor's operating system.
- **Manual OS Override**: Dropdown allows downloading installers for other systems.
- **Metadata**: Version `v1.2.4`, file sizes (~82 MB Windows / ~89 MB macOS / ~78 MB Linux), and offline readiness disclosure.

---

## 6. Acceptance Checklist

- [x] **Electron Wrapper Scaffolded**: `electron/main.cjs` and `electron/preload.cjs` created with custom protocol support (`aiessat://`).
- [x] **System-Browser OAuth Dispatch**: `src/lib/firebase.ts` detects Electron and delegates Google Sign-In to the external browser flow.
- [x] **Offline Cache Initialized**: Firestore `persistentLocalCache` enabled for offline question banks and test attempts.
- [x] **Dual-Path UI Integrated**: `DesktopDownloadCard` embedded on the authentication landing view.
- [x] **Clean Production Build**: `npm run build` verified.

---
*Persisted to `DESKTOP_AND_DOWNLOAD_SPECIFICATION.md`.*
