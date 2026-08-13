import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { linkChildByCode } from '../../lib/linkUtils';
import { 
  GraduationCap, 
  Copy, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  ShieldCheck 
} from 'lucide-react';

export default function Onboarding() {
  const { userProfile, setUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [linkCodeInput, setLinkCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Student SAT Target setup state
  const [targetScore, setTargetScore] = useState<number>(1450);
  const [targetTestDate, setTargetTestDate] = useState<string>('2026-10-03');
  const [studentStep, setStudentStep] = useState<1 | 2>(1);

  if (!userProfile) return null;

  const handleCopyCode = () => {
    if (userProfile.linkCode) {
      navigator.clipboard.writeText(userProfile.linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveStudentGoals = async (launchDiagnostic: boolean = false) => {
    setLoading(true);
    try {
      if (userProfile.id) {
        await updateDoc(doc(db, 'users', userProfile.id), {
          'satProfile.targetScore': targetScore,
          'satProfile.targetTestDate': targetTestDate
        });
        setUserProfile({
          ...userProfile,
          satProfile: {
            ...(userProfile.satProfile || {}),
            targetScore,
            targetTestDate
          }
        });
      }

      if (launchDiagnostic) {
        navigate('/student/sat/diagnostic');
      } else {
        navigate('/student');
      }
    } catch (e) {
      console.error('Error saving SAT goals:', e);
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(`/${userProfile.role}`);
  };

  const handleParentLink = async () => {
    if (!linkCodeInput) return;
    setLoading(true);
    setError('');

    try {
      const studentId = await linkChildByCode(userProfile.id, linkCodeInput);
      const newChildIds = [...(userProfile.childIds || []), studentId];
      setUserProfile({ ...userProfile, childIds: newChildIds });
      setLinkCodeInput('');
      navigate(`/${userProfile.role}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while linking. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile.role === 'student') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-neutral-200 shadow-sm w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              Personalize Your SAT Target
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm">
              Set your target score and test date to initialize your adaptive learning pacing.
            </p>
          </div>

          {studentStep === 1 ? (
            <div className="space-y-6">
              {/* Target Score Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Target SAT Score (400 - 1600)
                </label>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-3xl font-black text-blue-600">{targetScore}</span>
                  <div className="flex gap-1.5">
                    {[1250, 1400, 1500, 1550].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setTargetScore(score)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          targetScore === score
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min="900"
                  max="1600"
                  step="10"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>

              {/* Target Test Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Target Test Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={targetTestDate}
                    onChange={(e) => setTargetTestDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Parent link code reminder for minors */}
              {userProfile.isParentManaged && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <p className="text-xs font-bold text-neutral-700">Guardian Link Code</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-bold tracking-widest text-neutral-900">{userProfile.linkCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleSaveStudentGoals(true)}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Save & Start Free Diagnostic Test
                </button>
                <button
                  onClick={() => handleSaveStudentGoals(false)}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm rounded-xl transition-colors"
                >
                  Go to Dashboard First
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (userProfile.role === 'teacher') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Welcome, SAT Educator</h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Your instructor co-pilot is ready. You can assign adaptive practice tests, monitor class domain mastery radars, and view real-time student insights.
          </p>

          <button 
            onClick={handleSkip}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Launch Teacher Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (userProfile.role === 'parent') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Link Your Student</h2>
          <p className="text-neutral-500 text-sm">
            Enter the Link Code provided by your student to track their SAT progress, domain mastery, and weekly summaries.
          </p>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg text-center font-semibold">{error}</div>}
          
          <div className="text-left space-y-1 pt-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase">Student Link Code</label>
            <input 
              type="text" 
              value={linkCodeInput}
              onChange={(e) => setLinkCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. AIES-7K3XQ"
              className="w-full px-4 py-3 font-mono text-center text-lg tracking-widest border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all uppercase"
            />
          </div>
          
          <button 
            onClick={handleParentLink}
            disabled={!linkCodeInput || loading}
            className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Linking...' : 'Link Account'}
          </button>

          <button 
            onClick={handleSkip}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-700"
          >
            I'll do this later
          </button>
        </div>
      </div>
    );
  }

  return null;
}
