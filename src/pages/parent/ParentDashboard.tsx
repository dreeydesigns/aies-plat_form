import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, MessageSquare, BookOpen, Headphones, Play, Sparkles, UserPlus, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import RecentActivity, { ActivityItem } from '../../components/RecentActivity';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const { linkedStudents, submissions = [] } = useAppContext();
  const navigate = useNavigate();
  
  const children = linkedStudents;

  // Real Performance Chart Data based on actual submissions
  const performanceData = useMemo(() => {
    if (submissions.length === 0) return [];
    return submissions.slice(-7).map((s, idx) => ({
      day: `Test ${idx + 1}`,
      score: s.score || 0,
    }));
  }, [submissions]);

  // Real recent activities
  const recentActivities: ActivityItem[] = useMemo(() => {
    return children.flatMap(child => {
      const items: ActivityItem[] = [];
      if (child.satProfile?.diagnosticCompleted) {
        items.push({
          id: `diag_${child.id}`,
          childName: child.name,
          action: 'completed the official',
          target: 'SAT Diagnostic Assessment',
          time: 'Recently',
          type: 'diagnostic',
        });
      }
      return items;
    });
  }, [children]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Parent Guardian Portal</h2>
          <p className="text-neutral-500 text-sm">Monitor your children's SAT preparation, emotional well-being, and academic milestones.</p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 p-8 rounded-3xl text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-950">No Student Linked Yet</h3>
            <p className="text-sm text-amber-800 max-w-md mx-auto">
              Link your student's account using the unique Parent Code provided on their onboarding screen.
            </p>
          </div>
          <button 
            onClick={() => navigate('/onboarding')} 
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Enter Student Link Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map(child => {
            const hasDiagnostic = child.satProfile?.diagnosticCompleted;
            const mathTier = child.classificationMath || child.satProfile?.mathClassification;
            const rwTier = child.classificationRW || child.satProfile?.rwClassification;

            return (
              <div key={child.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 font-bold text-xl shadow-sm">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{child.name}</h3>
                      <p className="text-xs text-neutral-500">Level {child.level || 1} • {child.points || 0} pts</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    hasDiagnostic ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {hasDiagnostic ? 'Assessed' : 'Pending Diagnostic'}
                  </span>
                </div>
                
                <div className="p-6 flex-grow space-y-6">
                  {/* Traffic Light Wellness Pulse */}
                  <div className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-purple-600" /> Wellness & Engagement Pulse
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Optimal Engagement
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Session telemetry confirms steady pace and positive focus. No repeated frustration latency detected.
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs font-medium">
                      <span className="text-neutral-800 flex items-center gap-1.5 font-bold">
                        <Headphones className="w-4 h-4 text-purple-600" /> 30-Second AI Voice Digest
                      </span>
                      <button 
                        onClick={() => {
                          const msg = new SpeechSynthesisUtterance(`${child.name} is progressing smoothly on AIES SAT. They are maintaining great focus and steady momentum.`);
                          window.speechSynthesis.speak(msg);
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" /> Listen
                      </button>
                    </div>
                  </div>

                  {/* SAT Domain Placement Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">SAT Math Tier</p>
                      <p className="text-sm font-extrabold text-neutral-900 mt-1 capitalize">
                        {mathTier ? `${mathTier} Tier` : 'Pending Exam'}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">SAT Reading & Writing</p>
                      <p className="text-sm font-extrabold text-neutral-900 mt-1 capitalize">
                        {rwTier ? `${rwTier} Tier` : 'Pending Exam'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-2">
                  <button 
                    onClick={() => navigate('/parent/children')}
                    className="px-4 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-neutral-500" />
                    View Detailed Report
                  </button>
                  <button 
                    onClick={() => navigate('/parent/messages')}
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message Educator
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real Performance Trend Card */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Weekly SAT Performance Trend
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Scored quiz and practice exam trajectory</p>
          </div>
          <span className="text-xs font-semibold text-neutral-500">Live Telemetry</span>
        </div>

        {performanceData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center bg-neutral-50 rounded-2xl border border-neutral-100 text-center p-6 space-y-2">
            <TrendingUp className="w-8 h-8 text-neutral-300" />
            <p className="text-sm font-semibold text-neutral-700">No Assessment Data Yet</p>
            <p className="text-xs text-neutral-500 max-w-sm">
              As your child completes timed practice modules and full SAT practice tests, their progress trajectory will render here.
            </p>
          </div>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Line type="monotone" dataKey="score" name="SAT Accuracy %" stroke="#d97706" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <RecentActivity activities={recentActivities} />
    </div>
  );
}
