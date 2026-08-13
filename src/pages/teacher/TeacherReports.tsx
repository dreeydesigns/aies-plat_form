import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileBarChart, ImageDown, Sparkles, Send, Award, BookOpen, Brain, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { SatDomain } from '../../types';

const satDomainsList: { key: SatDomain; label: string; section: string }[] = [
  { key: 'algebra', label: 'Algebra', section: 'Math' },
  { key: 'advanced-math', label: 'Adv Math', section: 'Math' },
  { key: 'problem-solving-data-analysis', label: 'Data & Problem Solving', section: 'Math' },
  { key: 'geometry-trigonometry', label: 'Geometry & Trig', section: 'Math' },
  { key: 'information-ideas', label: 'Info & Ideas', section: 'Reading' },
  { key: 'craft-structure', label: 'Craft & Structure', section: 'Reading' },
  { key: 'expression-of-ideas', label: 'Expression of Ideas', section: 'Writing' },
  { key: 'standard-english-conventions', label: 'Standard Conventions', section: 'Writing' },
];

export default function TeacherReports() {
  const { users, courses, assignedTests } = useAppContext();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'sat' | 'curriculum'>('sat');
  const [focusAreas, setFocusAreas] = useState('');
  const [exporting, setExporting] = useState(false);

  const students = users.filter(user => user.role === 'student');

  // SAT Mastery calculation across roster
  const satDomainStats = useMemo(() => {
    return satDomainsList.map(domain => {
      let beginnerCount = 0;
      let intermediateCount = 0;
      let expertCount = 0;

      students.forEach(s => {
        const placement = s.satProfile?.placementByDomain?.[domain.key] || 'intermediate';
        if (placement === 'expert') expertCount++;
        else if (placement === 'beginner') beginnerCount++;
        else intermediateCount++;
      });

      const total = students.length || 1;
      const masteryScore = Math.round(((expertCount * 100 + intermediateCount * 65 + beginnerCount * 30) / (total * 100)) * 100);

      return {
        domain: domain.label,
        section: domain.section,
        mastery: masteryScore,
        expertCount,
        intermediateCount,
        beginnerCount
      };
    });
  }, [students]);

  const rows = useMemo(() => students.map(student => {
    const completed = student.completedLessons || [];
    const total = courses.flatMap(course => course.lessons).length;
    return { name: student.name, completed: completed.length, total, progress: total ? Math.round((completed.length / total) * 100) : 0, points: student.points || 0 };
  }), [students, courses]);

  const courseProgress = useMemo(() => courses.map(course => {
    const lessonCount = course.lessons.length;
    const completed = students.reduce((total, student) => total + course.lessons.filter(lesson => student.completedLessons?.includes(lesson.id)).length, 0);
    const possible = lessonCount * students.length;
    return { course: course.title, completion: possible ? Math.round((completed / possible) * 100) : 0 };
  }), [courses, students]);

  const exportReport = async (kind: 'pdf' | 'jpg') => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const image = canvas.toDataURL('image/jpeg', 0.92);
      if (kind === 'jpg') {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'AIES_Class_Report.jpg';
        link.click();
        return;
      }
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const renderedHeight = canvas.height * width / canvas.width;
      for (let offset = 0; offset < renderedHeight; offset += height) {
        if (offset) pdf.addPage();
        pdf.addImage(image, 'JPEG', 0, -offset, width, renderedHeight);
      }
      pdf.save('AIES_Class_Report.pdf');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Class Intelligence & SAT Analytics
          </h1>
          <p className="text-neutral-500 text-sm">
            Real-time multi-domain placement metrics, diagnostic summaries, and assignment telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/teacher/sat/assign')}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Assign SAT Test
          </button>
          <button
            disabled={exporting}
            onClick={() => exportReport('pdf')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-neutral-100 p-1 rounded-2xl flex items-center gap-1 w-fit border border-neutral-200">
        <button
          onClick={() => setActiveTab('sat')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sat'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Award className="w-4 h-4 text-blue-600" />
          SAT Domain Mastery
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'curriculum'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Curriculum & Courses
        </button>
      </div>

      {activeTab === 'sat' ? (
        <div className="space-y-6">
          {/* Class SAT Domain Mastery Chart */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Class SAT Domain Proficiency</h3>
                <p className="text-xs text-neutral-500">Aggregate weighted placement index across active students</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                8 Official Domains
              </span>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={satDomainStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="domain" tick={{ fill: '#737373', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#737373', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="mastery" name="Class Mastery %" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student SAT Placement Table */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Student Placement Roster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Algebra</th>
                    <th className="pb-3">Adv Math</th>
                    <th className="pb-3">Problem Solving</th>
                    <th className="pb-3">Info & Ideas</th>
                    <th className="pb-3">Conventions</th>
                    <th className="pb-3">Diagnostic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {students.map(student => {
                    const placements = student.satProfile?.placementByDomain || {};
                    const hasDiag = student.satProfile?.diagnosticCompleted;

                    return (
                      <tr key={student.id} className="hover:bg-neutral-50/50">
                        <td className="py-3.5 font-bold text-neutral-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-xs font-bold">
                            {student.name.charAt(0)}
                          </div>
                          {student.name}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            placements['algebra'] === 'expert' ? 'bg-emerald-100 text-emerald-800' : placements['algebra'] === 'beginner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {placements['algebra'] || 'Int'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            placements['advanced-math'] === 'expert' ? 'bg-emerald-100 text-emerald-800' : placements['advanced-math'] === 'beginner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {placements['advanced-math'] || 'Int'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            placements['problem-solving-data-analysis'] === 'expert' ? 'bg-emerald-100 text-emerald-800' : placements['problem-solving-data-analysis'] === 'beginner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {placements['problem-solving-data-analysis'] || 'Int'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            placements['information-ideas'] === 'expert' ? 'bg-emerald-100 text-emerald-800' : placements['information-ideas'] === 'beginner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {placements['information-ideas'] || 'Int'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            placements['standard-english-conventions'] === 'expert' ? 'bg-emerald-100 text-emerald-800' : placements['standard-english-conventions'] === 'beginner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {placements['standard-english-conventions'] || 'Int'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          {hasDiag ? (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-neutral-400">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Curriculum Tab */
        <div ref={reportRef} className="bg-white p-8 rounded-3xl border border-neutral-200 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-2xl font-bold text-blue-950">{students.length}</p>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mt-1">Students</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-950">{courses.length}</p>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-1">Courses</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-2xl font-bold text-amber-950">{courses.flatMap(c => c.lessons).length}</p>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">Lessons</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Course Completion Rates</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="course" hide />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip />
                  <Bar dataKey="completion" name="Recorded completion" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
                <th className="pb-2">Learner</th>
                <th className="pb-2">Completed</th>
                <th className="pb-2">Progress</th>
                <th className="pb-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.name} className="border-b border-neutral-100">
                  <td className="py-2.5 font-bold text-neutral-800">{row.name}</td>
                  <td className="py-2.5 text-neutral-600">{row.completed} / {row.total}</td>
                  <td className="py-2.5 text-neutral-600">{row.progress}%</td>
                  <td className="py-2.5 font-bold text-neutral-900">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
