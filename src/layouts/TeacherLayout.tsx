import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, Send, Wand2, CircleHelp, Settings } from 'lucide-react';

export default function TeacherLayout() {
  const navLinks = [
    { name: 'Home', path: '/teacher', icon: LayoutDashboard },
    { name: 'Student Progress', path: '/teacher/students', icon: Users },
    { name: 'Upload Test', path: '/teacher/sat/assign', icon: Send },
    { name: 'Content Studio', path: '/teacher/content-studio', icon: Wand2 },
    { name: 'Resources', path: '/teacher/guide', icon: CircleHelp },
    { name: 'Account & Settings', path: '/teacher/settings', icon: Settings },
  ];
  return <SidebarLayout role="teacher" navLinks={navLinks} />;
}
