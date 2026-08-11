import React, { useMemo, useRef, useState } from 'react';
import { Download, FileBarChart, ImageDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../../context/AppContext';

export default function TeacherReports() {
  const { users, courses } = useAppContext();
  const reportRef = useRef<HTMLDivElement>(null);
  const [focusAreas, setFocusAreas] = useState('');
  const [exporting, setExporting] = useState(false);
  const students = users.filter(user => user.role === 'student');
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
    if (!reportRef.current) return; setExporting(true);
    try { const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff' }); const image = canvas.toDataURL('image/jpeg', 0.92); if (kind === 'jpg') { const link = document.createElement('a'); link.href = image; link.download = 'AIES_Class_Report.jpg'; link.click(); return; } const pdf = new jsPDF('p', 'mm', 'a4'); const width = pdf.internal.pageSize.getWidth(); const height = pdf.internal.pageSize.getHeight(); const renderedHeight = canvas.height * width / canvas.width; for (let offset = 0; offset < renderedHeight; offset += height) { if (offset) pdf.addPage(); pdf.addImage(image, 'JPEG', 0, -offset, width, renderedHeight); } pdf.save('AIES_Class_Report.pdf'); } finally { setExporting(false); }
  };
  return <div className="space-y-6"><div className="flex flex-col md:flex-row gap-4 justify-between"><div><h1 className="text-2xl font-bold text-neutral-900">Evidence-based class reports</h1><p className="text-neutral-500">Only recorded course completion and points are shown. Quiz scores and wearable engagement appear when those readings are actually collected.</p></div><div className="flex gap-2"><button disabled={exporting} onClick={() => exportReport('pdf')} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"><Download className="inline w-4 h-4 mr-1" />PDF</button><button disabled={exporting} onClick={() => exportReport('jpg')} className="px-4 py-2 border font-bold rounded-lg"><ImageDown className="inline w-4 h-4 mr-1" />JPG</button></div></div><label className="block bg-white p-5 rounded-2xl border"><span className="font-bold">Teacher focus areas and recommended support</span><textarea value={focusAreas} onChange={event => setFocusAreas(event.target.value)} rows={4} placeholder="Example: Practise multi-step algebra; use worked examples twice weekly; contact guardian if progress remains below 50%." className="mt-3 w-full p-3 border rounded-xl" /></label><div ref={reportRef} className="bg-white p-8 space-y-10"><section className="min-h-[700px]"><h1 className="text-3xl font-bold">Class Learning Report</h1><p className="text-neutral-500">Generated {new Date().toLocaleDateString()} - AIES</p><div className="grid grid-cols-3 gap-4 mt-8"><div className="p-4 bg-blue-50 rounded-xl"><b>{students.length}</b><br/>Students</div><div className="p-4 bg-emerald-50 rounded-xl"><b>{courses.length}</b><br/>Courses</div><div className="p-4 bg-amber-50 rounded-xl"><b>{courses.flatMap(course => course.lessons).length}</b><br/>Available lessons</div></div><h2 className="text-xl font-bold mt-10">What this report measures</h2><p className="mt-2 text-neutral-700">Completion and points are taken from AIES records. No estimated attention, quiz score, or medical conclusion is displayed when no verified data exists.</p></section><section className="min-h-[700px]"><h2 className="text-2xl font-bold">Learner progress</h2><div className="h-64 mt-5"><ResponsiveContainer width="100%" height="100%"><BarChart data={courseProgress}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="course" hide /><YAxis domain={[0, 100]} unit="%" /><Tooltip /><Bar dataKey="completion" name="Recorded completion" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><p className="text-sm text-neutral-500">Course completion chart: only lessons marked completed in AIES are included.</p><table className="mt-5 w-full text-left"><thead><tr className="border-b"><th className="p-2">Learner</th><th>Completed</th><th>Progress</th><th>Points</th></tr></thead><tbody>{rows.map(row => <tr key={row.name} className="border-b"><td className="p-2">{row.name}</td><td>{row.completed} / {row.total}</td><td>{row.progress}%</td><td>{row.points}</td></tr>)}</tbody></table></section><section className="min-h-[700px]"><h2 className="text-2xl font-bold">Focus areas and next steps</h2><p className="mt-4 whitespace-pre-wrap text-neutral-700">{focusAreas || 'No focus areas have been recorded by the teacher yet.'}</p><h3 className="font-bold mt-10">Family conversation prompts</h3><ul className="list-disc pl-6 mt-3 space-y-2"><li>Ask the learner to explain one completed lesson in their own words.</li><li>Agree on a regular short study time and review course progress together.</li><li>Contact the teacher if the learner needs a different pace or additional examples.</li></ul></section></div></div>;
}
