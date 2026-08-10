import React from 'react';
import { LayoutDashboard, Library, Award, MessageSquare, Box, Settings, CircleHelp } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function StudentLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/courses', icon: Library },
    { name: 'Leaderboard & Badges', path: '/student/leaderboard', icon: Award },
    { name: 'Messages', path: '/student/messages', icon: MessageSquare },
    { name: 'VR Lab (Coming Soon)', path: '/student/labs', icon: Box },
    { name: 'Settings', path: '/student/settings', icon: Settings },
    { name: 'Setup Guide', path: '/student/guide', icon: CircleHelp },
  ];

  return <SidebarLayout role="student" navLinks={navLinks} />;
}
