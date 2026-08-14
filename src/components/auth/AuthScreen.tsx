import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { googleSignIn, emailSignIn, emailSignUp, sendPasswordReset } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateLinkCode } from '../../lib/linkUtils';
import { BookOpen, LogIn, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthScreen() {
  const { userProfile, setUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${userProfile.role}`);
      }
    }
  }, [userProfile, navigate]);

  const handleCreateNewUserDoc = async (uid: string, displayName: string | null, photoURL: string | null = null, selectedRole: 'student'|'teacher'|'parent') => {
    const newUser: any = {
      name: displayName || email.split('@')[0] || 'Student',
      role: selectedRole,
      avatar: photoURL || undefined,
      satProfile: {
        diagnosticCompleted: false,
        placementByDomain: {}
      },
      createdAt: new Date().toISOString()
    };
    if (selectedRole === 'student') {
      newUser.points = 0;
      newUser.level = 1;
      newUser.streak = 1;
      newUser.linkCode = generateLinkCode();
    } else if (selectedRole === 'parent') {
      newUser.childIds = [];
    }
    await setDoc(doc(db, 'users', uid), newUser);
    return newUser;
  };

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Password validation (min 8 chars per Spec v3 Page 1)
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        const signupResult = await emailSignUp(email.trim(), password, role, generateLinkCode());
        setUserProfile({ ...signupResult.userData, id: signupResult.user.uid } as any);
        navigate(role === 'student' ? '/onboarding' : `/${role}`);
      } else {
        const user = await emailSignIn(email.trim(), password);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setUserProfile({ ...userData, id: user.uid });
          navigate(userData.role === 'student' ? '/student' : `/${userData.role}`);
        } else {
          const newUser = await handleCreateNewUserDoc(user.uid, null, null, role);
          setUserProfile({ ...newUser, id: user.uid } as any);
          navigate(role === 'student' ? '/onboarding' : `/${role}`);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setEmailError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Password must be at least 8 characters long.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await googleSignIn();
      if (result) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setUserProfile({ ...userData, id: result.user.uid });
          navigate(userData.role === 'student' ? '/student' : `/${userData.role}`);
        } else {
          const newUser = await handleCreateNewUserDoc(result.user.uid, result.user.displayName, result.user.photoURL, role);
          setUserProfile({ ...newUser, id: result.user.uid } as any);
          navigate(role === 'student' ? '/student' : `/${role}`);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Sign in popup was blocked. Please allow popups and try again.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first, then click "Forgot password?".');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await sendPasswordReset(email);
      setMessage('Password reset link sent! Check your email inbox.');
    } catch (err: any) {
      setError('Failed to send reset email. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2 max-w-md">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 text-white">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mt-4">
          AIES SAT
        </h1>
        <p className="text-slate-400 text-sm">
          Digital SAT Preparation & Adaptive Mastery Platform
        </p>
      </div>

      {/* Main Auth Card (Full-screen focused card, no competing secondary buttons) */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl w-full max-w-md space-y-6">
        <div className="border-b border-slate-700/60 pb-4">
          <h2 className="text-xl font-extrabold text-white">
            {isSignUp ? 'Create your student account' : 'Sign in to continue'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp ? 'Get instant access to adaptive practice and official test simulations.' : 'Welcome back! Enter your credentials to access your dashboard.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl text-center">
            {message}
          </div>
        )}

        {/* Google One-Tap / Social Auth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z" />
            <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-700 flex-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">or with email</span>
          <div className="h-px bg-slate-700 flex-1" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="student@example.com"
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {emailError && (
              <p className="text-xs text-rose-400 font-semibold mt-1.5 pl-1">{emailError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {passwordError && (
              <p className="text-xs text-rose-400 font-semibold mt-1.5 pl-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign in / Sign up (Spec v3 Page 1: Create account (primary), Sign in (secondary link below)) */}
        <div className="pt-2 text-center text-xs text-slate-400">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmailError('');
              setPasswordError('');
              setMessage('');
            }}
            className="text-blue-400 font-bold hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Create account'}
          </button>
        </div>

        {/* Role Switching for Teachers & Parents (Subtle, non-competing) */}
        <div className="pt-4 border-t border-slate-700/60 text-center">
          <button
            type="button"
            onClick={() => setShowRoleSwitch(!showRoleSwitch)}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showRoleSwitch ? 'Hide Educator & Parent login' : 'Teacher or Parent login →'}
          </button>

          {showRoleSwitch && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  role === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Teacher Mode
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  role === 'parent' ? 'bg-amber-600 text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Parent Portal
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Student Mode
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
