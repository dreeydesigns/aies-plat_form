import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { SatDomain } from '../../../types';
import { 
  Send, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';

const domainOptions: { id: SatDomain; name: string; section: 'math' | 'reading-writing' }[] = [
  { id: 'algebra', name: 'Algebra', section: 'math' },
  { id: 'advanced-math', name: 'Advanced Math', section: 'math' },
  { id: 'problem-solving-data-analysis', name: 'Problem-Solving & Data', section: 'math' },
  { id: 'geometry-trigonometry', name: 'Geometry & Trig', section: 'math' },
  { id: 'information-ideas', name: 'Information & Ideas', section: 'reading-writing' },
  { id: 'craft-structure', name: 'Craft & Structure', section: 'reading-writing' },
  { id: 'expression-of-ideas', name: 'Expression of Ideas', section: 'reading-writing' },
  { id: 'standard-english-conventions', name: 'Standard English', section: 'reading-writing' }
];

export default function SatAssignTest() {
  const { allUsers, userProfile, assignSatTest } = useAppContext();
  const navigate = useNavigate();

  const students = allUsers.filter(u => u.role === 'student');

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [section, setSection] = useState<'math' | 'reading-writing'>('math');
  const [domain, setDomain] = useState<SatDomain | 'all'>('all');
  const [difficultyTarget, setDifficultyTarget] = useState<'beginner' | 'intermediate' | 'expert' | 'adaptive'>('adaptive');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student.');
      return;
    }

    setIsSubmitting(true);
    try {
      await assignSatTest({
        assignedByTeacherId: userProfile?.id || 'teacher-default',
        assignedByTeacherName: userProfile?.name || 'Your Teacher',
        assignedToUserIds: selectedStudentIds,
        testConfig: {
          section,
          domain: domain === 'all' ? undefined : domain,
          difficultyTarget: difficultyTarget === 'adaptive' ? undefined : difficultyTarget
        },
        notificationSent: true,
        dueDate: dueDate || undefined,
        createdAt: new Date().toISOString()
      });

      setSuccessMessage('SAT assignment successfully dispatched to selected students!');
      setTimeout(() => {
        navigate('/teacher/reports');
      }, 1500);
    } catch (err) {
      console.error('Error assigning test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDomains = domainOptions.filter(d => d.section === section);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Teacher Co-Pilot Active
        </span>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Assign SAT Practice & Diagnostic
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Configure targeted domain workouts, difficulty constraints, and push instant notifications to your roster.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-2xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-6">
          {/* Section Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-800">1. Select SAT Section</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setSection('math');
                  setDomain('all');
                }}
                className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                  section === 'math'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Math (With Desmos API)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSection('reading-writing');
                  setDomain('all');
                }}
                className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                  section === 'reading-writing'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Reading & Writing
              </button>
            </div>
          </div>

          {/* Domain Scope */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-800">2. Domain Scope</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as any)}
              className="w-full p-3.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Domains (Standard Adaptive Mix)</option>
              {availableDomains.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Target Difficulty */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-800">3. Target Difficulty</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'adaptive', label: 'Student Adaptive (Auto)' },
                { id: 'beginner', label: 'Beginner Tier' },
                { id: 'intermediate', label: 'Intermediate Tier' },
                { id: 'expert', label: 'Expert Tier' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDifficultyTarget(opt.id as any)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    difficultyTarget === opt.id
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-neutral-800">4. Due Date (Optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Student Roster Selection */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-neutral-800">
                5. Select Students ({selectedStudentIds.length} selected)
              </label>
              <button
                type="button"
                onClick={selectAllStudents}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {students.map(student => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{student.name}</p>
                        <p className="text-[10px] text-neutral-400">Level {student.level || 1}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-neutral-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || selectedStudentIds.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white text-base transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Dispatching Test...' : 'Dispatch SAT Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}
