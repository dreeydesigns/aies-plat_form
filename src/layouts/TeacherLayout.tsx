import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, BookOpen, MessageSquare, BarChart, Settings, CircleHelp } from 'lucide-react';

export default function TeacherLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { name: 'Courses', path: '/teacher/courses', icon: BookOpen },
    { name: 'Students & Grading', path: '/teacher/students', icon: Users },
    { name: 'Messages', path: '/teacher/messages', icon: MessageSquare },
    { name: 'Reports', path: '/teacher/reports', icon: BarChart },
    { name: 'Settings', path: '/teacher/settings', icon: Settings },
    { name: 'Setup Guide', path: '/teacher/guide', icon: CircleHelp },
  ];
  return <SidebarLayout role="teacher" navLinks={navLinks} />;
}
