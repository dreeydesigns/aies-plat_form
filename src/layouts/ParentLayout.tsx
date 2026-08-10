import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, MessageSquare, BookOpen, Settings, CircleHelp } from 'lucide-react';

export default function ParentLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/parent', icon: LayoutDashboard },
    { name: 'My Children', path: '/parent/children', icon: Users },
    { name: 'Messages', path: '/parent/messages', icon: MessageSquare },
    { name: 'Resources', path: '/parent/resources', icon: BookOpen },
    { name: 'Settings', path: '/parent/settings', icon: Settings },
    { name: 'Setup Guide', path: '/parent/guide', icon: CircleHelp },
  ];
  return <SidebarLayout role="parent" navLinks={navLinks} />;
}
