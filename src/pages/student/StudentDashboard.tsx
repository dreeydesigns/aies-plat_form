import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  Play, 
  Layers, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  AlertCircle,
  Zap,
  BookOpen
} from 'lucide-react';

export default function StudentDashboard() {
  const { userProfile, assignedTests = [], satTests = [] } = useAppContext();
  const navigate = useNavigate();

  // Toggles
  const [yourTestsTab, setYourTestsTab] = useState<'active' | 'past'>('active');
  const [practiceTab, setPracticeTab] = useState<'active' | 'past'>('active');

  const studentName = userProfile?.name?.split(' ')[0] || 'Student';

  // Active assigned tests vs past completed tests
  const activeAssignedTests = assignedTests.filter(
    (t) => !t.completedBy || !userProfile?.id || !t.completedBy.includes(userProfile.id)
  );

  const pastSatTests = satTests || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 font-sans">
      {/* Page Header: Greeting + one line of context */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Welcome back, {studentName}
        </h1>
        <p className="text-neutral-500 text-sm md:text-base">
          Choose a practice session or jump into your scheduled test.
        </p>
      </div>

      {/* Non-modal Parent Linking Banner for Minors if not linked */}
      {userProfile?.dateOfBirth && !userProfile?.linkedParentUid && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              !
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">Link a Parent or Guardian</p>
              <p className="text-[11px] text-neutral-600">Connect a parent to share your SAT practice reports and progress milestones.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
          >
            Connect Parent
          </button>
        </div>
      )}

      {/* SECTION 1: Your Tests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Your Tests
          </h2>

          {/* Active / Past Toggle */}
          <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1 border border-neutral-200">
            <button
              type="button"
              onClick={() => setYourTestsTab('active')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                yourTestsTab === 'active'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setYourTestsTab('past')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                yourTestsTab === 'past'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {yourTestsTab === 'active' ? (
          activeAssignedTests.length === 0 ? (
            /* Empty State when nothing is scheduled */
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xs text-center space-y-2">
              <p className="text-sm font-bold text-neutral-800">
                No upcoming tests. Official tests appear here once your teacher schedules one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAssignedTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-3xl p-6 border-2 border-blue-600 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                        {test.testConfig.section === 'math' ? 'Math Test' : 'Reading & Writing'}
                      </span>
                      {test.dueDate && (
                        <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          Due {test.dueDate}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base">
                      {test.testConfig.domain ? `Domain Focus: ${test.testConfig.domain}` : 'Assigned SAT Practice Test'}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Assigned by {test.assignedByTeacherName || 'Teacher'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/student/sat/practice?domain=${test.testConfig.domain || 'algebra'}`)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Start Assigned Test
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Past Tests View */
          pastSatTests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xs text-center space-y-2">
              <p className="text-sm font-bold text-neutral-800">
                Nothing here yet — your completed tests will show up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastSatTests.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      Full-Length Test · {t.mode.toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Completed {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600">
                      {t.totalEstimatedScore || '—'}
                    </span>
                    <span className="text-xs text-neutral-400"> / 1600</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* SECTION 2: Practice & Prepare (Active / Past toggle, exactly two entry cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Practice & Prepare
          </h2>

          <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1 border border-neutral-200">
            <button
              type="button"
              onClick={() => setPracticeTab('active')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                practiceTab === 'active'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setPracticeTab('past')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                practiceTab === 'past'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {practiceTab === 'active' ? (
          /* Exactly TWO entry cards: Test Preview and Full-Length Practice */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Test Preview */}
            <div
              onClick={() => navigate('/student/sat/preview-intro')}
              className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors">
                  Test Preview
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Walk through the interface and try out sample questions with assistive tools. Untimed and unscored.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-sm font-bold text-blue-600">
                <span>Start Test Preview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Full-Length Practice */}
            <div
              onClick={() => navigate('/student/sat/tests')}
              className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  Full-Length Practice
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Experience full timed SAT simulation tests under authentic exam pacing with scaled score estimates.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-sm font-bold text-indigo-600">
                <span>Explore Practice Tests</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ) : (
          /* Past Practice Sessions */
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xs text-center space-y-3">
            <p className="text-sm font-bold text-neutral-800">Your practice history</p>
            <p className="text-xs text-neutral-500">
              View your score improvements, question logs, and domain mastery in Score Reports.
            </p>
            <button
              onClick={() => navigate('/student/sat/scores')}
              className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors inline-flex items-center gap-1.5 mt-2"
            >
              View Score Reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
