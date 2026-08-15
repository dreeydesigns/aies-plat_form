import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  Target, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  BookOpen,
  Building2,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';

export default function Onboarding() {
  const { userProfile, setUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Student identification
  const [studentIdNumber] = useState(
    userProfile?.studentNumber || `#AIES-STU-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Age Gate (18+ vs Minor)
  const [isAdult, setIsAdult] = useState(false);

  // Step 1: School Code / Institution
  const [schoolCode, setSchoolCode] = useState(userProfile?.institutionId ? userProfile.institutionId.replace('inst_', '').toUpperCase() : '');
  const [schoolVerified, setSchoolVerified] = useState(!!userProfile?.institutionId);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Step 2: Parent Linking (Minors only)
  const [parentEmail, setParentEmail] = useState('');
  const [parentCode, setParentCode] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Step 3: SAT Target Setup
  const [targetScore, setTargetScore] = useState<number>(userProfile?.satProfile?.targetScore || 1450);
  const [targetTestDate, setTargetTestDate] = useState<string>(userProfile?.satProfile?.targetTestDate || '2026-10-03');
  const [baselineScore, setBaselineScore] = useState<string>(userProfile?.satProfile?.baselineScore ? String(userProfile.satProfile.baselineScore) : '');

  // Step tracking: 'school_code' -> 'parent_link' -> 'sat_target'
  const [currentStep, setCurrentStep] = useState<'school_code' | 'parent_link' | 'sat_target'>('school_code');

  useEffect(() => {
    if (!userProfile) {
      navigate('/');
    }
  }, [userProfile, navigate]);

  if (!userProfile) return null;

  const handleCopyLinkCode = () => {
    if (userProfile?.linkCode) {
      navigator.clipboard.writeText(userProfile.linkCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleVerifySchoolCode = async (isSkipping: boolean = false) => {
    setLoading(true);
    setError('');

    try {
      let institutionId: string | null = null;
      let institutionName: string | null = null;

      if (!isSkipping && schoolCode.trim()) {
        const clean = schoolCode.trim().toUpperCase();
        if (clean.includes('KILIMA')) {
          institutionId = 'inst_kilima';
          institutionName = 'Kilima Academy';
        } else if (clean.includes('GREEN')) {
          institutionId = 'inst_greensprings';
          institutionName = 'Green Springs School';
        } else {
          institutionId = `inst_${clean.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
          institutionName = `School (${clean})`;
        }
      }

      const isGuest = isSkipping || !institutionId;
      setIsGuestMode(isGuest);

      if (userProfile.id) {
        await updateDoc(doc(db, 'users', userProfile.id), {
          studentNumber: studentIdNumber,
          updatedAt: new Date().toISOString()
        });

        setUserProfile({
          ...userProfile,
          studentNumber: studentIdNumber,
          institutionId: institutionId || userProfile.institutionId,
          institutionName: institutionName || userProfile.institutionName,
          isGuest: isGuest
        });
      }

      setSchoolVerified(true);
      // If student is 18+, skip parent link completely
      if (isAdult) {
        setCurrentStep('sat_target');
      } else {
        setCurrentStep('parent_link');
      }
    } catch (e: any) {
      if (isAdult) {
        setCurrentStep('sat_target');
      } else {
        setCurrentStep('parent_link');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendParentInvite = async () => {
    setLoading(true);
    setError('');
    try {
      if (parentCode && userProfile.id) {
        await updateDoc(doc(db, 'users', userProfile.id), {
          linkedParentUid: parentCode,
          updatedAt: new Date().toISOString()
        });
      }
      setInviteSent(true);
      setTimeout(() => {
        setCurrentStep('sat_target');
      }, 1000);
    } catch (err: any) {
      setCurrentStep('sat_target');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAndLaunchDiagnostic = async () => {
    setLoading(true);
    try {
      const parsedBaseline = baselineScore ? parseInt(baselineScore, 10) : undefined;
      const validBaseline = (parsedBaseline && parsedBaseline >= 400 && parsedBaseline <= 1600) ? parsedBaseline : undefined;

      if (userProfile.id) {
        const updatePayload: any = {
          targetScore,
          targetTestDate,
          studentNumber: studentIdNumber,
          updatedAt: new Date().toISOString()
        };
        if (validBaseline) {
          updatePayload.baselineScore = validBaseline;
        }

        await updateDoc(doc(db, 'users', userProfile.id), updatePayload);

        setUserProfile({
          ...userProfile,
          targetScore,
          targetTestDate,
          baselineScore: validBaseline || userProfile.baselineScore,
          studentNumber: studentIdNumber,
          satProfile: {
            ...(userProfile.satProfile || {}),
            targetScore,
            targetTestDate,
            baselineScore: validBaseline || userProfile.satProfile?.baselineScore
          }
        });
      }

      // Launch the mandatory initial adaptive diagnostic exam
      navigate('/student/sat/diagnostic');
    } catch (e) {
      navigate('/student/sat/diagnostic');
    } finally {
      setLoading(false);
    }
  };

  // Student Flow
  if (userProfile.role === 'student') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        
        {/* Top Student Badge */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold rounded-full">
            <GraduationCap className="w-4 h-4" />
            <span>Official Student ID: {studentIdNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Student Onboarding & Calibration
          </h1>
          <p className="text-xs text-slate-400">
            Step {currentStep === 'school_code' ? '1 of 3' : currentStep === 'parent_link' ? '2 of 3' : '3 of 3'}
          </p>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-lg space-y-6">
          
          {/* STEP 1: School Code & Age Confirmation */}
          {currentStep === 'school_code' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-blue-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Enter Your School Code
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  If your school or academy uses AIES SAT, enter your school's unique code to unlock institution features.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    School / Institution Code
                  </label>
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AIES-KILIMA-882"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>

                {/* Age Check (18+ skips parent link) */}
                <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200">I am 18 years or older</p>
                    <p className="text-[10px] text-slate-400">Adult learners do not require parent account linking.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={isAdult}
                    onChange={(e) => setIsAdult(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={() => handleVerifySchoolCode(false)}
                    disabled={loading || !schoolCode.trim()}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-40"
                  >
                    {loading ? 'Verifying...' : 'Link School & Continue'}
                  </button>

                  <button
                    onClick={() => handleVerifySchoolCode(true)}
                    className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    I don't have a school code (Continue as Guest)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Parent Linking (Minors only, Non-blocking) */}
          {currentStep === 'parent_link' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-indigo-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Link Parent or Guardian
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Connect a parent to share your weekly progress, growth reports, and score summaries.
                </p>
              </div>

              {/* Display Student Link Code */}
              {userProfile.linkCode && (
                <div className="p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Your Parent Link Code</span>
                    <p className="text-base font-black font-mono text-indigo-400 tracking-wider">{userProfile.linkCode}</p>
                  </div>
                  <button
                    onClick={handleCopyLinkCode}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {inviteSent ? (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Parent invite sent! Proceeding to target setup...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Parent Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      onClick={handleSendParentInvite}
                      disabled={loading || !parentEmail}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      {loading ? 'Sending...' : 'Send 2-Day Parent Invite Link'}
                    </button>

                    <button
                      onClick={() => setCurrentStep('sat_target')}
                      className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Link later (Non-blocking reminder on dashboard)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SAT Target & Compulsory Diagnostic Launch */}
          {currentStep === 'sat_target' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-blue-500/20">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Set Your SAT Target Score
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Configure your objective before beginning the compulsory trial diagnostic exam.
                </p>
              </div>

              <div className="space-y-4">
                {/* Target Score Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Target Score (400 – 1600)
                    </label>
                    <span className="text-xl font-black text-blue-400 font-mono">{targetScore}</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1600"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>400</span>
                    <span>1000</span>
                    <span>1400</span>
                    <span>1600</span>
                  </div>
                </div>

                {/* Target Test Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Target Test Date
                  </label>
                  <input
                    type="date"
                    value={targetTestDate}
                    onChange={(e) => setTargetTestDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Compulsory Diagnostic Callout */}
                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/40 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Compulsory Diagnostic Trial Exam</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This adaptive assessment calibrates your skill profile across all 8 SAT domains and assigns your initial baseline level.
                  </p>
                </div>

                {/* Launch Button */}
                <button
                  onClick={handleCompleteAndLaunchDiagnostic}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Diagnostic Trial Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Teacher / Staff Flow
  if (userProfile.role === 'teacher' || userProfile.role === 'class_teacher' || userProfile.role === 'principal' || userProfile.role === 'hod') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome, SAT Educator</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Your instructor workspace is ready. You can assign adaptive workouts, manage class rosters, and review student mastery telemetry.
          </p>

          <button 
            onClick={() => navigate('/teacher')}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            Launch Teacher Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Parent Flow
  if (userProfile.role === 'parent') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Link Your Student</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Enter your child's 6-character Link Code or student ID to monitor their SAT practice and score reports.
          </p>

          <div className="text-left space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">Student Link Code</label>
            <input 
              type="text" 
              value={parentCode}
              onChange={(e) => setParentCode(e.target.value.toUpperCase())}
              placeholder="e.g. STU-99214"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 font-mono text-center text-lg tracking-widest text-white rounded-xl focus:outline-none focus:border-amber-500 uppercase"
            />
          </div>
          
          <div className="pt-2 flex flex-col gap-2.5">
            <button 
              onClick={handleSendParentInvite}
              disabled={!parentCode || loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg shadow-amber-900/30"
            >
              {loading ? 'Linking...' : 'Connect Student'}
            </button>

            <button 
              onClick={() => navigate('/parent')}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
