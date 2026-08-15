import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithCredential
} from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  setDoc,
  getFirestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : ((typeof process !== 'undefined' && process.env) ? process.env : {} as any);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'mock-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'mock.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789:web:mock',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable robust offline local cache for Practice Questions, Textbooks & History
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // Fallback to standard firestore instance if indexedDB is already initialized
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const storage = getStorage(app);
storage.maxUploadRetryTime = 20_000;

export const analytics = null;

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Google Sign-In with Electron System-Browser Protocol Support.
 * If running inside the packaged Electron app, opens the system browser to bypass
 * Google OAuth embedded webview restrictions (disallowed_useragent policy).
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;

    // Check if running inside Electron wrapper
    const isElectron = typeof window !== 'undefined' && (
      (window as any).electronAPI !== undefined || 
      navigator.userAgent.toLowerCase().includes('electron')
    );

    if (isElectron && (window as any).electronAPI?.openExternalOAuth) {
      // Delegate to Electron system-browser OAuth protocol handoff
      const result = await (window as any).electronAPI.openExternalOAuth('google');
      if (result?.credential) {
        const userCredential = await signInWithCredential(auth, result.credential);
        return { user: userCredential.user, accessToken: result.accessToken || '' };
      }
    }

    // Standard Browser OAuth popup flow
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      alert('Popup was blocked by the browser. Please allow popups to sign in with Google.');
    }
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const emailSignUp = async (email: string, pass: string, name: string, role: string = 'student') => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const emailSignIn = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const sendPasswordReset = resetPassword;

export const signOut = async () => {
  await auth.signOut();
};

export const logout = signOut;
