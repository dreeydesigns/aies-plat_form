import React from 'react';
import { 
  Home, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Settings, 
  MessageSquare,
  CircleHelp 
} from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function StudentLayout() {
  const navLinks = [
    { name: 'Home', path: '/student', icon: Home },
    { name: 'Textbooks', path: '/student/sat/textbooks', icon: BookOpen },
    { name: 'Practice & Prepare', path: '/student/sat/practice', icon: Zap },
    { name: 'Diagnostic Test', path: '/student/sat/diagnostic', icon: Sparkles },
    { name: 'Test Center', path: '/student/sat/tests', icon: Layers },
    { name: 'Score Reports', path: '/student/sat/scores', icon: BarChart3 },
    { name: 'Messages', path: '/student/messages', icon: MessageSquare },
    { name: 'Account & Settings', path: '/student/settings', icon: Settings },
    { name: 'Setup Guide', path: '/student/guide', icon: CircleHelp },
  ];

  return <SidebarLayout role="student" navLinks={navLinks} />;
}
