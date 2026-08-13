import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Layers, 
  Library, 
  Award, 
  MessageSquare, 
  Box, 
  Settings, 
  CircleHelp 
} from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function StudentLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Textbooks', path: '/student/sat/textbooks', icon: BookOpen },
    { name: 'SAT Practice', path: '/student/sat/practice', icon: Zap },
    { name: 'SAT Diagnostic', path: '/student/sat/diagnostic', icon: Sparkles },
    { name: 'Practice Tests', path: '/student/sat/tests', icon: Layers },
    { name: 'My Courses', path: '/student/courses', icon: Library },
    { name: 'Leaderboard & Badges', path: '/student/leaderboard', icon: Award },
    { name: 'Messages', path: '/student/messages', icon: MessageSquare },
    { name: 'VR Lab', path: '/student/labs', icon: Box },
    { name: 'Settings', path: '/student/settings', icon: Settings },
    { name: 'Setup Guide', path: '/student/guide', icon: CircleHelp },
  ];

  return <SidebarLayout role="student" navLinks={navLinks} />;
}
