import React, { useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Download, ArrowLeft, Award, BookOpen, Activity, ImageDown, Lock, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ParentReport() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { linkedStudents, courses } = useAppContext();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [isFrozen, setIsFrozen] = useState(false);
  const student = linkedStudents.find(user => user.id === studentId);

  const reportCourses = useMemo(() => selectedCourseId === 'all' ? courses : courses.filter(course => course.id === selectedCourseId), [courses, selectedCourseId]);
  const recordByLesson = useMemo(() => new Map((student?.learningRecords || []).map(record => [record.lessonId, record])), [student]);
  const courseRows = useMemo(() => reportCourses.map(course => {
    const completed = course.lessons.filter(lesson => recordByLesson.has(lesson.id)).length;
    return { name: course.title, completion: course.lessons.length ? Math.round((completed / course.lessons.length) * 100) : 0, completed, total: course.lessons.length };
  }), [reportCourses, recordByLesson]);
  const lessonRows = useMemo(() => reportCourses.flatMap(course => course.lessons.map(lesson => ({ course: course.title, lesson, record: recordByLesson.get(lesson.id) }))), [reportCourses, recordByLesson]);
  const overallLessons = courseRows.reduce((sum, row) => sum + row.total, 0);
  const overallCompleted = courseRows.reduce((sum, row) => sum + row.completed, 0);
  const progress = overallLessons ? Math.round((overallCompleted / overallLessons) * 100) : 0;
  const scoredRecords = [...recordByLesson.values()].filter(record => typeof record.quizScore === 'number');
  const averageQuizScore = scoredRecords.length ? Math.round(scoredRecords.reduce((sum, record) => sum + (record.quizScore || 0), 0) / scoredRecords.length) : null;

  if (!student) return <div className="p-8 text-center text-neutral-500">Student not found or not linked to this guardian account.</div>;

  const exportReport = async (kind: 'pdf' | 'jpg') => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const image = canvas.toDataURL('image/jpeg', 0.94);
      const safeName = student.name.replace(/\s+/g, '_');
      if (kind === 'jpg') {
        const link = document.createElement('a'); link.href = image; link.download = `${safeName}_Guardian_Report.jpg`; link.click();
      } else {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth(); const pageHeight = pdf.internal.pageSize.getHeight();
        const imageHeight = canvas.height * width / canvas.width;
        for (let offset = 0; offset < imageHeight; offset += pageHeight) { if (offset) pdf.addPage(); pdf.addImage(image, 'JPEG', 0, -offset, width, imageHeight); }
        pdf.save(`${safeName}_Guardian_Report.pdf`);
      }
      setIsFrozen(true);
    } finally { setIsExporting(false); }
  };

  return <div className="space-y-6">
    <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4"><button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900"><ArrowLeft className="w-4 h-4" />Back to children</button><div className="flex flex-wrap gap-2"><button disabled={isFrozen || isExporting} onClick={() => exportReport('pdf')} className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg disabled:opacity-50"><Download className="inline w-4 h-4 mr-1" />Generate PDF</button><button disabled={isFrozen || isExporting} onClick={() => exportReport('jpg')} className="px-4 py-2 border font-bold rounded-lg disabled:opacity-50"><ImageDown className="inline w-4 h-4 mr-1" />Generate JPG</button>{isFrozen && <button onClick={() => setIsFrozen(false)} className="px-4 py-2 border font-bold rounded-lg"><RotateCcw className="inline w-4 h-4 mr-1" />Return to interactive report</button>}</div></div>
    <div className="print:hidden bg-white p-5 rounded-2xl border"><label className="text-sm font-bold text-neutral-700">View by course<select disabled={isFrozen} value={selectedCourseId} onChange={event => setSelectedCourseId(event.target.value)} className="block mt-2 w-full max-w-md p-3 border rounded-xl disabled:bg-neutral-100"><option value="all">All courses and subjects</option>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>{isFrozen && <p className="mt-3 text-sm text-neutral-600 flex items-center gap-2"><Lock className="w-4 h-4" />The generated file is a static snapshot. Return to interactive report to change filters.</p>}</div>
    <div ref={reportRef} className="bg-white p-8 md:p-12 rounded-2xl border border-neutral-200 shadow-sm print:border-none print:shadow-none">
      <section className="min-h-[720px] border-b border-neutral-200 pb-10"><p className="text-sm font-bold text-amber-700 uppercase tracking-widest">AIES guardian progress report</p><h1 className="text-4xl font-bold text-neutral-900 mt-3">{student.name}</h1><p className="text-neutral-500 mt-2">Generated {new Date().toLocaleDateString()} · {selectedCourseId === 'all' ? 'All courses' : reportCourses[0]?.title}</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10"><Stat icon={<BookOpen className="w-5 h-5" />} label="Recorded completion" value={`${progress}%`} detail={`${overallCompleted} of ${overallLessons} available lessons`} /><Stat icon={<Award className="w-5 h-5" />} label="Recorded quiz average" value={averageQuizScore === null ? 'Not recorded' : `${averageQuizScore}%`} detail={averageQuizScore === null ? 'No scored quiz attempt stored yet' : `${scoredRecords.length} recorded quiz attempt${scoredRecords.length === 1 ? '' : 's'}`} /><Stat icon={<Activity className="w-5 h-5" />} label="Learning points" value={student.points || 0} detail={`Level ${student.level || 1} · ${student.streak || 0}-day streak`} /></div><div className="mt-10 p-5 rounded-xl bg-amber-50 border border-amber-100"><h2 className="font-bold text-amber-950">How to read this report</h2><p className="mt-2 text-sm leading-6 text-amber-900">Every completion, date, and quiz score shown here comes from a saved AIES learning record. A missing value means it was not recorded; it is never estimated. Wearable heart-rate data is not used to label a learner attentive, inattentive, fatigued, or medically at risk.</p></div><h2 className="text-2xl font-bold mt-10">Learning snapshot</h2><p className="mt-3 text-neutral-700 leading-7">{progress >= 80 ? 'The learner has completed most of the available work in this view. Use the course detail and teacher notes to identify the next challenge.' : progress >= 40 ? 'The learner has begun progressing through this work. A regular short study routine and review of incomplete lessons will help maintain momentum.' : 'There are few recorded completions in this view. Review the lesson list with your child and agree on one manageable next lesson.'}</p></section>
      <section className="min-h-[720px] py-10 border-b border-neutral-200"><h2 className="text-3xl font-bold text-neutral-900">Course and lesson progress</h2><p className="mt-2 text-neutral-500">Course completion is calculated from lesson records saved in AIES.</p><div className="h-64 mt-6"><ResponsiveContainer width="100%" height="100%"><BarChart data={courseRows}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" hide /><YAxis domain={[0, 100]} unit="%" /><Tooltip /><Bar dataKey="completion" name="Recorded completion" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b"><tr><th className="p-3">Course / subject</th><th>Lesson</th><th>Status</th><th>Recorded completion date</th><th>Quiz score</th></tr></thead><tbody>{lessonRows.map(({ course, lesson, record }) => <tr key={lesson.id} className="border-b"><td className="p-3">{course}</td><td>{lesson.title}</td><td className={record ? 'text-emerald-700 font-bold' : 'text-neutral-500'}>{record ? 'Completed' : 'Not yet completed'}</td><td>{record?.completedAt ? new Date(record.completedAt).toLocaleDateString() : 'Not recorded'}</td><td>{typeof record?.quizScore === 'number' ? `${record.quizScore}%` : 'Not recorded'}</td></tr>)}</tbody></table></div></section>
      <section className="min-h-[720px] py-10"><h2 className="text-3xl font-bold text-neutral-900">Strengths, support and teacher partnership</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7"><Note title="Strengths noticed by the teacher" value={student.teacherReport?.strengths} empty="The teacher has not added strengths yet." /><Note title="Areas to strengthen" value={student.teacherReport?.supportNeeds} empty="The teacher has not added support priorities yet." /></div><div className="mt-6 p-6 border rounded-xl"><h3 className="font-bold text-neutral-900">Teacher remarks from class</h3><p className="mt-3 text-neutral-700 whitespace-pre-wrap leading-7">{student.teacherReport?.remarks || 'No classroom remarks have been recorded yet.'}</p><p className="mt-4 text-xs text-neutral-500">{student.teacherReport?.updatedAt ? `Last updated ${new Date(student.teacherReport.updatedAt).toLocaleDateString()}` : 'Teacher remarks will appear here after the teacher saves them.'}</p></div><div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6"><h3 className="font-bold text-blue-950">Practical next steps at home</h3><ul className="mt-3 space-y-2 list-disc pl-5 text-sm leading-6 text-blue-900"><li>Choose one incomplete lesson together and set a short, regular time to complete it.</li><li>Ask your child to explain a completed idea in their own words, then praise the effort and specific strategy used.</li><li>Use the teacher's stated support priority to decide what to practise; contact the teacher when a different pace or example would help.</li><li>Discuss any concerns using the teacher remarks and recorded work, rather than assuming a cause from a wearable reading.</li></ul></div></section>
    </div>
  </div>;
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: React.ReactNode; detail: string }) { return <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200"><div className="flex items-center gap-2 text-amber-700">{icon}<p className="font-bold text-sm">{label}</p></div><p className="text-3xl font-bold text-neutral-900 mt-4">{value}</p><p className="text-xs text-neutral-500 mt-2">{detail}</p></div>; }
function Note({ title, value, empty }: { title: string; value?: string; empty: string }) { return <div className="p-6 rounded-xl border"><h3 className="font-bold text-neutral-900">{title}</h3><p className="mt-3 text-neutral-700 whitespace-pre-wrap leading-7">{value || empty}</p></div>; }
