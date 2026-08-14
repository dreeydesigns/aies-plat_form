import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Wand2, Users, Send, BookOpen, BarChart, Settings } from 'lucide-react';

export default function TeacherLayout() {
  const navLinks = [
    { name: 'Home', path: '/teacher', icon: LayoutDashboard },
    { name: 'Content Studio', path: '/teacher/content-studio', icon: Wand2 },
    { name: 'Student Progress', path: '/teacher/students', icon: Users },
    { name: 'Upload / Assign Test', path: '/teacher/sat/assign', icon: Send },
    { name: 'Course Builder', path: '/teacher/courses', icon: BookOpen },
    { name: 'Reports', path: '/teacher/reports', icon: BarChart },
    { name: 'Settings', path: '/teacher/settings', icon: Settings },
  ];
  return <SidebarLayout role="teacher" navLinks={navLinks} />;
}
