import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Lock, Send, X } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppContext } from '../../context/AppContext';

interface SafeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafeReportModal({ isOpen, onClose }: SafeReportModalProps) {
  const { userProfile } = useAppContext();
  const [incidentCategory, setIncidentCategory] = useState<'bullying' | 'emotional_stress' | 'safety' | 'other'>('bullying');
  const [details, setDetails] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'safeReports'), {
        reporterId: isAnonymous ? 'anonymous' : (userProfile?.id || 'unknown'),
        reporterName: isAnonymous ? 'Anonymous Student' : (userProfile?.name || 'Student'),
        reporterRole: userProfile?.role || 'student',
        category: incidentCategory,
        details: details.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending_counselor_review'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting safe report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-red-100 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Safe & Confidential Report</h3>
            <p className="text-xs text-neutral-500">Sent directly to school counselors and safeguarding staff.</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h4 className="text-xl font-bold text-neutral-900">Report Received Safely</h4>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              Thank you for speaking up. Your report has been routed privately to designated student welfare officers. You are safe.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setDetails('');
                onClose();
              }}
              className="px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors text-sm"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Category of Concern</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bullying', label: '🤝 Peer Disrespect / Bullying' },
                  { id: 'emotional_stress', label: '💔 Overwhelming Anxiety' },
                  { id: 'safety', label: '🛡️ Physical Safety Concern' },
                  { id: 'other', label: '❓ General Confidential Concern' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setIncidentCategory(cat.id as any)}
                    className={`p-3 text-xs font-bold rounded-xl border text-left transition-colors ${
                      incidentCategory === cat.id ? 'border-red-600 bg-red-50 text-red-900' : 'border-neutral-200 text-neutral-700 hover:border-red-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">What happened?</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={4}
                className="w-full p-3 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Share any details safely. Your well-being and privacy are fully protected..."
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-neutral-500" /> Keep My Identity Anonymous
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  isAnonymous ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                {isAnonymous ? 'Yes (Anonymous)' : 'No (Signed)'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !details.trim()}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Safely...' : 'Submit Confidential Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
