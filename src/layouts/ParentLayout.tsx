import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, Bell, Settings } from 'lucide-react';

export default function ParentLayout() {
  const navLinks = [
    { name: 'Overview', path: '/parent', icon: LayoutDashboard },
    { name: 'Progress', path: '/parent/children', icon: Users },
    { name: 'Notifications', path: '/parent/messages', icon: Bell },
    { name: 'Account', path: '/parent/settings', icon: Settings },
  ];
  return <SidebarLayout role="parent" navLinks={navLinks} />;
}
