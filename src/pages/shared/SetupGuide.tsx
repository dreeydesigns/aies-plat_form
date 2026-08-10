import React from 'react';
import { useAppContext, Role } from '../../context/AppContext';

const guides: Record<Exclude<Role, null>, { title: string; intro: string; steps: Array<{ title: string; text: string }> }> = {
  student: { title: 'Student setup guide', intro: 'Use AIES on a computer, tablet, or phone. Your learning and progress sync automatically.', steps: [
    { title: 'PC and Mac', text: 'Open AIES in the latest Chrome or Edge browser. Use My Courses to continue your lessons.' },
    { title: 'Phone and tablet', text: 'Open the same secure AIES address in Chrome, Safari, or Edge and sign in with your student account.' },
    { title: 'Wearables and VR', text: 'On a Chrome or Edge device over HTTPS, open Settings and connect a Bluetooth heart-rate device. Use VR Lab with a WebXR-compatible headset and browser.' },
    { title: 'Parent connection', text: 'Only students receive a Parent Link Code. Share it with your parent or guardian from Settings.' },
  ] },
  teacher: { title: 'Teacher setup guide', intro: 'Create courses and communicate with your class from a desktop browser, Mac, or mobile device.', steps: [
    { title: 'PC and Mac', text: 'Use current Chrome, Edge, or Safari. Go to Courses to create lessons, quizzes, and AI-generated courses.' },
    { title: 'AI course creation', text: 'Upload a PDF, DOCX, or PPTX up to 10 MB, answer the seven curriculum questions, and review the generated course before assigning it.' },
    { title: 'Phone and tablet', text: 'Use AIES in a modern browser for messages, reports, and quick course edits.' },
    { title: 'Account scope', text: 'Teacher accounts manage courses, students, reports, and messages only. Student wearable and parent-link controls are not part of this account.' },
  ] },
  parent: { title: 'Parent setup guide', intro: 'Follow your child’s progress and communicate with teachers from your computer or phone.', steps: [
    { title: 'Connect a child', text: 'Use the Parent Link Code supplied by your child during onboarding. You can add another child later from My Children.' },
    { title: 'PC, Mac, phone, and tablet', text: 'Open AIES in your preferred modern browser and sign in with your parent account.' },
    { title: 'Progress and messages', text: 'Use My Children for reports and Messages to contact teachers. Notifications appear in the bell icon.' },
    { title: 'Account scope', text: 'Parent accounts do not show student course controls, VR/wearable pairing, or teacher course-creation tools.' },
  ] },
  admin: { title: 'Administrator setup guide', intro: 'Manage platform oversight from a current desktop browser.', steps: [
    { title: 'Administration', text: 'Use the dashboard and reports to oversee users, courses, platform activity, and configuration.' },
    { title: 'Account scope', text: 'Administrator tools are separate from student learning, parent monitoring, and teacher course workspaces.' },
  ] },
};

export default function SetupGuide() {
  const { userProfile } = useAppContext();
  if (!userProfile?.role) return null;
  const guide = guides[userProfile.role];
  return <div className="max-w-3xl space-y-6"><div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm"><h1 className="text-3xl font-bold text-neutral-900">{guide.title}</h1><p className="mt-2 text-neutral-500">{guide.intro}</p></div><div className="space-y-4">{guide.steps.map((step, index) => <article key={step.title} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex gap-4"><span className="flex-none w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">{index + 1}</span><div><h2 className="font-bold text-neutral-900">{step.title}</h2><p className="mt-1 text-sm leading-6 text-neutral-600">{step.text}</p></div></article>)}</div></div>;
}
