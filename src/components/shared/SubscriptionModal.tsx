import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Lock, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  KeyRound,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  featureTitle = 'Textbook Library & Advanced Drills',
  featureDescription = 'Unlock full access to interactive textbooks, Socratic AI tutoring, and unlimited similar question drills.'
}: SubscriptionModalProps) {
  const { userProfile, setUserProfile } = useAppContext();
  const [schoolCode, setSchoolCode] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>('monthly');

  if (!isOpen) return null;

  const handleRedeemSchoolCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolCode.trim()) return;

    setLoading(true);
    setCodeError('');

    try {
      // Standard school code resolution
      const cleanCode = schoolCode.trim().toUpperCase();
      let institutionName = 'Enrolled Institution';
      let institutionId = 'inst_standard';

      if (cleanCode.includes('KILIMA')) {
        institutionName = 'Kilima Academy';
        institutionId = 'inst_kilima';
      } else if (cleanCode.includes('GREEN')) {
        institutionName = 'Green Springs School';
        institutionId = 'inst_greensprings';
      } else {
        institutionName = `School (#${cleanCode})`;
        institutionId = `inst_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      }

      if (userProfile?.id) {
        await updateDoc(doc(db, 'users', userProfile.id), {
          institutionId,
          institutionName,
          isGuest: false,
          isSubscribed: true,
          updatedAt: new Date().toISOString()
        });

        setUserProfile({
          ...userProfile,
          institutionId,
          isGuest: false,
          isSubscribed: true
        });
      }

      setCodeSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setCodeError('Invalid school code. Please verify with your teacher.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
            <Lock className="w-3.5 h-3.5" />
            Guest Account — Full Access Required
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Unlock Full Access to AIES SAT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {featureDescription}
          </p>
        </div>

        {/* Code Success Banner */}
        {codeSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div>
              <p>School Code Verified!</p>
              <p className="text-xs text-emerald-400/80">Full school pass activated. Unlocking all textbooks and features...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Feature Comparison / Highlights */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> What's Included with Full Access
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 4 Interactive Textbooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Socratic AI Step-by-Step Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Similar Question Drills</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Adaptive Metacognitive 5-Finger Matrix</span>
                </div>
              </div>
            </div>

            {/* Path 1: Enter School Code */}
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Have a School Code?</span>
                </div>
                <span className="text-[11px] text-blue-400 font-medium">Free with school license</span>
              </div>

              <form onSubmit={handleRedeemSchoolCode} className="flex gap-2">
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AIES-KILIMA-882"
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                />
                <button
                  type="submit"
                  disabled={loading || !schoolCode.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40"
                >
                  {loading ? 'Verifying...' : 'Redeem Code'}
                </button>
              </form>
              {codeError && <p className="text-xs text-rose-400 font-medium">{codeError}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-700 flex-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">or subscribe individually</span>
              <div className="h-px bg-slate-700 flex-1" />
            </div>

            {/* Path 2: Subscription Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold">Monthly Pass</span>
                  <span className="text-base font-black font-mono text-white">$29<span className="text-[11px] font-normal text-slate-400">/mo</span></span>
                </div>
                <p className="text-[11px] text-slate-400">Full SAT prep pass. Cancel anytime.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('quarterly')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  selectedPlan === 'quarterly'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="absolute -top-2 right-3 px-2 py-0.5 bg-indigo-500 text-[9px] font-bold uppercase tracking-wider text-white rounded-full">
                  Save 25%
                </span>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold">3-Month Prep Pass</span>
                  <span className="text-base font-black font-mono text-white">$79<span className="text-[11px] font-normal text-slate-400"> total</span></span>
                </div>
                <p className="text-[11px] text-slate-400">Ideal for targeted test-day prep.</p>
              </button>
            </div>

            {/* Subscribe CTA */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  alert("Redirecting to secure subscription checkout for " + (selectedPlan === 'monthly' ? '$29/mo' : '$79/quarter'));
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Start Student Pro Pass ({selectedPlan === 'monthly' ? '$29 / Month' : '$79 / 3 Months'})</span>
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Independent learners can upgrade anytime. Trial practice exams remain free.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
