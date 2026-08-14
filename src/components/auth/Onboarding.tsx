import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { linkChildByCode } from '../../lib/linkUtils';
import { 
  Target, 
  Calendar, 
  Sparkles, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  BookOpen,
  Sliders
} from 'lucide-react';

export default function Onboarding() {
  const { userProfile, setUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Page 1a: Parent Linking for Minors
  const [parentEmail, setParentEmail] = useState('');
  const [parentCode, setParentCode] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Page 2: Profile Setup (SAT Only)
  const [targetScore, setTargetScore] = useState<number>(userProfile?.satProfile?.targetScore || 1450);
  const [targetTestDate, setTargetTestDate] = useState<string>(userProfile?.satProfile?.targetTestDate || '2026-10-03');
  const [baselineScore, setBaselineScore] = useState<string>(userProfile?.satProfile?.baselineScore ? String(userProfile.satProfile.baselineScore) : '');

  // Step 1: Parent Linking (if under 18), Step 2: Target & Profile Setup
  const isMinor = userProfile?.dateOfBirth ? (new Date().getFullYear() - new Date(userProfile.dateOfBirth).getFullYear()) < 18 : false;
  const [step, setStep] = useState<'parent_link' | 'profile_setup'>(isMinor ? 'parent_link' : 'profile_setup');

  if (!userProfile) return null;

  const handleSendParentInvite = async () => {
    if (!parentEmail && !parentCode) return;
    setLoading(true);
    setError('');
    try {
      if (parentCode && userProfile.id) {
        // Link by code
        await updateDoc(doc(db, 'users', userProfile.id), {
          linkedParentUid: parentCode,
          updatedAt: new Date().toISOString()
        });
      }
      setInviteSent(true);
      setTimeout(() => {
        setStep('profile_setup');
      }, 1200);
    } catch (err: any) {
      setError('Unable to link parent. You can continue and link later in settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfileSetup = async (launchPreview: boolean = false) => {
    setLoading(true);
    try {
      const parsedBaseline = baselineScore ? parseInt(baselineScore, 10) : undefined;
      const validBaseline = (parsedBaseline && parsedBaseline >= 400 && parsedBaseline <= 1600) ? parsedBaseline : undefined;

      if (userProfile.id) {
        await updateDoc(doc(db, 'users', userProfile.id), {
          targetScore,
          targetTestDate,
          baselineScore: validBaseline,
          'satProfile.targetScore': targetScore,
          'satProfile.targetTestDate': targetTestDate,
          'satProfile.baselineScore': validBaseline,
          updatedAt: new Date().toISOString()
        });

        setUserProfile({
          ...userProfile,
          targetScore,
          targetTestDate,
          baselineScore: validBaseline,
          satProfile: {
            ...(userProfile.satProfile || {}),
            targetScore,
            targetTestDate,
            baselineScore: validBaseline
          }
        });
      }

      if (launchPreview) {
        navigate('/student/sat/preview-intro');
      } else {
        navigate('/student');
      }
    } catch (e) {
      console.error('Error saving profile:', e);
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipToDashboard = () => {
    navigate(`/${userProfile.role}`);
  };

  // Student Flow
  if (userProfile.role === 'student') {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans text-neutral-100">
        <div className="bg-neutral-950 p-8 md:p-10 rounded-3xl border border-neutral-800 shadow-2xl w-full max-w-lg space-y-6">
          
          {/* Step 1a: Parent Linking for Minors */}
          {step === 'parent_link' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-500/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Link a Parent or Guardian
                </h2>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                  For students under 18, connect a parent to share your SAT practice reports and progress milestones.
                </p>
              </div>

              {inviteSent ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Parent invite saved! Moving to profile setup...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Path A: Parent Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Option A: Parent's Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-neutral-800" />
                    <span className="text-xs font-bold text-neutral-500 uppercase">Or</span>
                    <div className="flex-1 h-px bg-neutral-800" />
                  </div>

                  {/* Path B: Invite Code */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Option B: Parent Invite Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={parentCode}
                        onChange={(e) => setParentCode(e.target.value.toUpperCase())}
                        placeholder="e.g. PAR-88219"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      onClick={handleSendParentInvite}
                      disabled={loading || (!parentEmail && !parentCode)}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
                    >
                      {loading ? 'Linking...' : 'Send Link / Connect'}
                    </button>

                    {/* Non-blocking skip */}
                    <button
                      onClick={() => setStep('profile_setup')}
                      className="w-full py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                    >
                      Skip for now (I'll link later)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Page 2 Profile Setup (SAT Target & Date) */}
          {step === 'profile_setup' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
                  <Target className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Set Your SAT Target
                </h2>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                  Configure your score objective and test timeline to personalize your pacing.
                </p>
              </div>

              <div className="space-y-5">
                {/* Target Score Slider (400 - 1600) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Target Score (400 – 1600)
                    </label>
                    <span className="text-2xl font-black text-blue-400 font-mono">{targetScore}</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1600"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-neutral-500">
                    <span>400</span>
                    <span>1000</span>
                    <span>1400</span>
                    <span>1600</span>
                  </div>
                </div>

                {/* Target Test Date (Date Picker) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Target Test Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={targetTestDate}
                      onChange={(e) => setTargetTestDate(e.target.value)}
                      className="w-full p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Optional Baseline Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Baseline / PSAT Score <span className="text-neutral-500 lowercase font-normal">(optional)</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    min="400"
                    max="1600"
                    value={baselineScore}
                    onChange={(e) => setBaselineScore(e.target.value)}
                    placeholder="e.g. 1150 (or leave blank)"
                    className="w-full p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 flex flex-col gap-2.5">
                  <button
                    onClick={() => handleSaveProfileSetup(true)}
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Save & Start Test Preview
                  </button>
                  <button
                    onClick={() => handleSaveProfileSetup(false)}
                    disabled={loading}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Teacher Flow
  if (userProfile.role === 'teacher') {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans text-neutral-100">
        <div className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800 shadow-2xl w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome, SAT Educator</h2>
          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
            Your instructor workspace is ready. You can generate custom question sets in Content Studio, assign workouts, and monitor student domain masteries.
          </p>

          <button 
            onClick={handleSkipToDashboard}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
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
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans text-neutral-100">
        <div className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800 shadow-2xl w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Link Your Student</h2>
          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
            Enter the Link Code or student email to monitor your child's SAT progress and score reports.
          </p>

          {error && <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl text-center font-semibold">{error}</div>}
          
          <div className="text-left space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase">Student Link Code / ID</label>
            <input 
              type="text" 
              value={parentCode}
              onChange={(e) => setParentCode(e.target.value.toUpperCase())}
              placeholder="e.g. STU-99214"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 font-mono text-center text-lg tracking-widest text-white rounded-xl focus:outline-none focus:border-amber-500 uppercase"
            />
          </div>
          
          <div className="pt-2 flex flex-col gap-2.5">
            <button 
              onClick={handleSendParentInvite}
              disabled={!parentCode || loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
            >
              {loading ? 'Linking...' : 'Link Account'}
            </button>

            <button 
              onClick={handleSkipToDashboard}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
