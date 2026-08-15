import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { googleSignIn, emailSignIn, emailSignUp, sendPasswordReset } from '../../lib/firebase';
import DesktopDownloadCard from '../shared/DesktopDownloadCard';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { generateLinkCode } from '../../lib/linkUtils';
import { 
  BookOpen, 
  LogIn, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  School, 
  Zap, 
  ShieldCheck, 
  Building2,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function AuthScreen() {
  const { userProfile, setUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // URL Param pre-population (e.g. ?role=teacher&school=KILIMA-882&invite=...)
  const initialRoleParam = searchParams.get('role');
  const initialSchoolParam = searchParams.get('school') || searchParams.get('code') || '';
  const initialInviteParam = searchParams.get('invite') || searchParams.get('token') || '';

  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>(
    initialRoleParam === 'teacher' ? 'teacher' : initialRoleParam === 'parent' ? 'parent' : 'student'
  );
  const [schoolCode, setSchoolCode] = useState(initialSchoolParam);

  // New Google Sign-in Account Type Chooser State
  const [pendingGoogleUser, setPendingGoogleUser] = useState<any | null>(null);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin' || userProfile.role === 'aies_central') {
        navigate('/admin');
      } else if (userProfile.role === 'teacher' || userProfile.role === 'class_teacher' || userProfile.role === 'principal' || userProfile.role === 'hod') {
        navigate('/teacher');
      } else if (userProfile.role === 'parent') {
        navigate('/parent');
      } else {
        navigate('/student');
      }
    }
  }, [userProfile, navigate]);

  const generateStudentId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `#AIES-STU-${randomNum}`;
  };

  const handleCreateNewUserDoc = async (
    uid: string, 
    displayName: string | null, 
    photoURL: string | null = null, 
    selectedRole: 'student' | 'teacher' | 'parent',
    isGuest: boolean = false
  ) => {
    const studentIdNumber = selectedRole === 'student' ? generateStudentId() : undefined;
    const linkCode = generateLinkCode();

    let institutionId: string | null = null;
    let institutionName: string | null = null;

    if (schoolCode.trim()) {
      const codeClean = schoolCode.trim().toUpperCase();
      if (codeClean.includes('KILIMA')) {
        institutionId = 'inst_kilima';
        institutionName = 'Kilima Academy';
      } else if (codeClean.includes('GREEN')) {
        institutionId = 'inst_greensprings';
        institutionName = 'Green Springs School';
      } else {
        institutionId = `inst_${codeClean.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        institutionName = `School (${codeClean})`;
      }
    }

    const newUser: any = {
      name: displayName || email.split('@')[0] || (selectedRole === 'student' ? 'SAT Student' : selectedRole === 'teacher' ? 'SAT Educator' : 'Parent'),
      role: selectedRole,
      avatar: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      institutionId: institutionId,
      institutionName: institutionName,
      isGuest: isGuest,
      isSubscribed: !isGuest && !!institutionId,
      studentNumber: studentIdNumber,
      satProfile: {
        diagnosticCompleted: false,
        placementByDomain: {}
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (selectedRole === 'student') {
      newUser.points = 0;
      newUser.level = 1;
      newUser.streak = 1;
      newUser.linkCode = linkCode;
      newUser.parentIds = [];
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

    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        const signupResult = await emailSignUp(email.trim(), password, role, generateLinkCode());
        const studentIdNum = role === 'student' ? generateStudentId() : undefined;
        
        let institutionId: string | null = null;
        let institutionName: string | null = null;
        if (schoolCode.trim()) {
          const codeClean = schoolCode.trim().toUpperCase();
          institutionId = `inst_${codeClean.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          institutionName = `School (${codeClean})`;
        }

        const enrichedUser = {
          name: email.split('@')[0],
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupResult.uid}`,
          institutionId: institutionId,
          institutionName: institutionName,
          studentNumber: studentIdNum,
          linkCode: generateLinkCode(),
          points: 0,
          level: 1,
          streak: 1,
          satProfile: {
            diagnosticCompleted: false,
            placementByDomain: {}
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', signupResult.uid), enrichedUser);
        setUserProfile({ ...enrichedUser, id: signupResult.uid } as any);
        navigate(role === 'student' ? '/onboarding' : `/${role}`);
      } else {
        const user = await emailSignIn(email.trim(), password);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setUserProfile({ ...userData, id: user.uid });
          
          if (userData.role === 'admin' || userData.role === 'aies_central') {
            navigate('/admin');
          } else if (userData.role === 'teacher' || userData.role === 'class_teacher' || userData.role === 'principal' || userData.role === 'hod') {
            navigate('/teacher');
          } else if (userData.role === 'parent') {
            navigate('/parent');
          } else {
            navigate('/student');
          }
        } else {
          // Self-heal profile
          const recoveredUser = await handleCreateNewUserDoc(user.uid, user.displayName, user.photoURL, role);
          setUserProfile({ ...recoveredUser, id: user.uid } as any);
          navigate(role === 'student' ? '/onboarding' : `/${role}`);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setEmailError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
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
          // Existing user -> route by their real saved role
          const userData = userDoc.data() as any;
          setUserProfile({ ...userData, id: result.user.uid });
          if (userData.role === 'admin' || userData.role === 'aies_central') {
            navigate('/admin');
          } else if (userData.role === 'teacher' || userData.role === 'class_teacher' || userData.role === 'principal' || userData.role === 'hod') {
            navigate('/teacher');
          } else if (userData.role === 'parent') {
            navigate('/parent');
          } else {
            navigate('/student');
          }
        } else {
          // Brand new Google user -> Prompt explicit role selection
          setPendingGoogleUser(result.user);
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

  const handleFinalizeGoogleAccountChoice = async (chosenRole: 'student' | 'teacher' | 'parent') => {
    if (!pendingGoogleUser) return;

    setLoading(true);
    setError('');
    try {
      const newUser = await handleCreateNewUserDoc(
        pendingGoogleUser.uid,
        pendingGoogleUser.displayName,
        pendingGoogleUser.photoURL,
        chosenRole
      );
      setUserProfile({ ...newUser, id: pendingGoogleUser.uid } as any);

      if (chosenRole === 'student') {
        navigate('/onboarding');
      } else if (chosenRole === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/parent');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to finalize account setup.');
    } finally {
      setLoading(false);
      setPendingGoogleUser(null);
    }
  };

  const handleGuestTrialPractice = async () => {
    try {
      setLoading(true);
      setError('');
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
      const guestProfile: any = {
        id: guestId,
        uid: guestId,
        name: 'Guest Learner',
        role: 'student',
        isGuest: true,
        isSubscribed: false,
        studentNumber: generateStudentId(),
        satProfile: {
          diagnosticCompleted: false,
          placementByDomain: {}
        },
        points: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      setUserProfile(guestProfile);
      navigate('/student/sat/practice');
    } catch (e) {
      setError('Unable to start guest trial.');
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
      await sendPasswordReset(email.trim());
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError('Could not send reset email. Verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  // EXPLICIT ACCOUNT TYPE CHOOSER FOR BRAND NEW GOOGLE ACCOUNTS
  if (pendingGoogleUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Google Account Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            What type of account is this?
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Welcome, <strong>{pendingGoogleUser.displayName || pendingGoogleUser.email}</strong>. Select your primary role to configure your workspace.
          </p>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-lg space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Student Choice */}
          <button
            onClick={() => handleFinalizeGoogleAccountChoice('student')}
            disabled={loading}
            className="w-full p-4 bg-slate-900/90 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/60 rounded-2xl text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  I am a Student
                </h3>
                <p className="text-[11px] text-slate-400">
                  Take adaptive diagnostic tests, practice SAT questions, and study textbooks.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Teacher Choice */}
          <button
            onClick={() => handleFinalizeGoogleAccountChoice('teacher')}
            disabled={loading}
            className="w-full p-4 bg-slate-900/90 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/60 rounded-2xl text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  I am an Educator / Teacher
                </h3>
                <p className="text-[11px] text-slate-400">
                  Assign workouts, manage class rosters, and review student mastery telemetry.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Parent Choice */}
          <button
            onClick={() => handleFinalizeGoogleAccountChoice('parent')}
            disabled={loading}
            className="w-full p-4 bg-slate-900/90 hover:bg-amber-600/20 border border-slate-700 hover:border-amber-500/60 rounded-2xl text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  I am a Parent / Guardian
                </h3>
                <p className="text-[11px] text-slate-400">
                  Connect your student's account to view scaled score trajectories and weekly reports.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {loading && (
            <div className="text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Configuring your workspace...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AIES SAT Learning Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Adaptive SAT Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          AI-powered practice, interactive textbooks, and real-time concordance analytics.
        </p>
      </div>

      {/* Main Auth Container */}
      <div className="bg-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-md space-y-6">
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              role === 'student' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              role === 'teacher' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Educator</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              role === 'parent' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Parent</span>
          </button>
        </div>

        {/* Global Error/Success Messages */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {/* 1-Tap Google Auth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px bg-slate-700 flex-1" />
          <span>or email</span>
          <div className="h-px bg-slate-700 flex-1" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {emailError && <p className="text-red-400 text-[10px] mt-1">{emailError}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {passwordError && <p className="text-red-400 text-[10px] mt-1">{passwordError}</p>}
          </div>

          {/* School Code Input for Student / Teacher Signup */}
          {isSignUp && (role === 'student' || role === 'teacher') && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                School Code (Optional)
              </label>
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                placeholder="e.g. AIES-KILIMA-882"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase transition-colors"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Provided by your school administrator. You can also enter this during onboarding.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
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

        {/* Toggle Sign in / Sign up */}
        <div className="text-center text-xs text-slate-400">
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

        {/* Guest Trial Option for Students */}
        {role === 'student' && (
          <div className="pt-3 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={handleGuestTrialPractice}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-700/70 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Practice as Guest (Instant SAT Trial)</span>
            </button>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Guest pass includes trial exam practice. Full textbook access requires login or subscription.
            </p>
          </div>
        )}

      </div>

      {/* Desktop Download Dual-Path Section */}
      <DesktopDownloadCard />
    </div>
  );
}
