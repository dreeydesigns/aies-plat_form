import React, { useState } from 'react';
import { Box, CheckCircle2, Compass, FlaskConical, Monitor, Orbit } from 'lucide-react';
import DeviceSync from '../../components/DeviceSync';

export default function VRLabs() {
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const labs = [
    { id: 'science', icon: FlaskConical, title: 'Science observation lab', description: 'Plan an observation, record a prediction, and compare results with your course material.', steps: ['Read the assigned lesson and write one prediction.', 'Run the teacher-provided observation or simulation.', 'Record what changed and explain why.'] },
    { id: 'geometry', icon: Orbit, title: '3D geometry studio', description: 'Use a headset for spatial exploration, or complete the same reasoning activity on screen.', steps: ['Choose a 3D shape from your lesson.', 'Identify faces, edges, and vertices.', 'Sketch the shape and explain one real-world use.'] },
    { id: 'field', icon: Compass, title: 'Virtual field study', description: 'Prepare for an immersive visit by mapping questions and evidence to collect.', steps: ['Choose a place or ecosystem in your course.', 'List three facts you need to verify.', 'Share a short reflection with your teacher.'] },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-8 rounded-2xl">
        <Box className="w-10 h-10 mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">VR Labs</h2>
        <p className="text-indigo-100 max-w-2xl">Use guided lab activities on any device, then enter an immersive WebXR session when a compatible headset is available. The headset connection below uses the real browser WebXR API.</p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">{labs.map(lab => { const Icon = lab.icon; const open = selectedLab === lab.id; return <article key={lab.id} className="bg-white p-6 rounded-2xl border shadow-sm"><div className="w-11 h-11 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center"><Icon className="w-5 h-5" /></div><h3 className="font-bold text-neutral-900 mt-4">{lab.title}</h3><p className="text-sm leading-6 text-neutral-500 mt-2">{lab.description}</p><button onClick={() => setSelectedLab(open ? null : lab.id)} className="mt-5 text-sm font-bold text-indigo-700">{open ? 'Hide activity' : 'Open activity'}</button>{open && <ol className="mt-4 pt-4 border-t space-y-3 text-sm text-neutral-700">{lab.steps.map((step, index) => <li key={step} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-none mt-0.5" />{index + 1}. {step}</li>)}</ol>}</article>; })}</section>
      <section className="bg-white p-6 rounded-2xl border shadow-sm"><div className="flex gap-3"><div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center"><Monitor className="w-5 h-5" /></div><div><h3 className="font-bold text-neutral-900">Choose the right lab mode</h3><p className="text-sm text-neutral-500 mt-1">Screen activities work in any modern browser. For immersive mode, use a WebXR-capable browser and headset; selecting “Enter VR” starts a real headset session.</p></div></div></section>
      <DeviceSync />
    </div>
  );
}
