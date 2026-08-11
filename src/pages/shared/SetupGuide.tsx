import React from 'react';
import { useAppContext, Role } from '../../context/AppContext';

const guides: Record<Exclude<Role, null>, { title: string; intro: string; steps: Array<{ title: string; text: string }> }> = {
  student: { title: 'Student setup guide', intro: 'Use AIES on a computer, tablet, or phone. Your learning and progress sync automatically.', steps: [
    { title: 'PC and Mac', text: 'Open AIES in the latest Chrome or Edge browser. Use My Courses to continue your lessons.' },
    { title: 'Phone and tablet', text: 'Open the same secure AIES address in Chrome, Safari, or Edge and sign in with your student account.' },
    { title: 'Wearables and VR', text: 'On a Chrome or Edge device over HTTPS, open Settings and connect a Bluetooth heart-rate device. Use VR Lab with a WebXR-compatible headset and browser.' },
    { title: 'Parent connection', text: 'Only students receive a Parent Link Code. Share it with your parent or guardian from Settings.' },
  ] },
  teacher: { title: 'Teacher teaching guide', intro: 'A practical guide for creating clear lessons, assessments, and parent-ready progress updates.', steps: [
    { title: '1. Set up the course first', text: 'In Courses, choose New course. Give it a clear title and one-sentence description, then save it before adding lessons. Keep one topic or unit per course.' },
    { title: '2. Add an article lesson', text: 'Choose Article, use a specific title, then write: what learners will learn, the key idea, a worked example, a short practice activity, and a recap. Use headings and short bullet lists.' },
    { title: '3. Add a video lesson', text: 'Choose Video, paste a trusted video URL or provide viewing instructions. Tell learners what to watch for and add one reflection question.' },
    { title: '4. Create a quiz or exam', text: 'Choose Quiz, add one clear question at a time, provide four plausible answers, and mark the correct answer with the radio button. Use one quiz after a small group of lessons; use an exam at the end of a unit.' },
    { title: '5. Use AI course creation well', text: 'Upload a source document, then answer the seven questions. Use the green suggestion chips to set age, level, outcomes, pace, teaching style, and support needs. Review the generated lessons before students start them.' },
    { title: '6. Share and improve', text: 'Publish lessons in the intended order by dragging them. Use Messages for questions from learners and guardians. Use Reports only when there is real completion, quiz, and approved engagement data.' },
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
