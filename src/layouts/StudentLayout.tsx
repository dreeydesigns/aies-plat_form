import React from 'react';
import { 
  Home, 
  Zap, 
  BookOpen, 
  Layers, 
  BarChart3, 
  CircleHelp, 
  Settings 
} from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function StudentLayout() {
  const navLinks = [
    { name: 'Home', path: '/student', icon: Home },
    { name: 'Practice & Prepare', path: '/student/sat/practice', icon: Zap },
    { name: 'Textbook Library', path: '/student/sat/textbooks', icon: BookOpen },
    { name: 'Course', path: '/student/courses', icon: Layers },
    { name: 'Score Reports', path: '/student/sat/scores', icon: BarChart3 },
    { name: 'Resources', path: '/student/guide', icon: CircleHelp },
    { name: 'Account & Settings', path: '/student/settings', icon: Settings },
  ];

  return <SidebarLayout role="student" navLinks={navLinks} />;
}
