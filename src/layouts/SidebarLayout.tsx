import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { logout } from '../lib/firebase';
import { BookOpen, LogOut } from 'lucide-react';
import clsx from 'clsx';

import NotificationsSidebar from '../components/shared/NotificationsSidebar';

type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

const roleThemeMap: Record<UserRole, { badge: string; active: string; border: string }> = {
  student: {
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300',
    active: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold',
    border: 'border-indigo-600 dark:border-indigo-400',
  },
  teacher: {
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300',
    active: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 font-semibold',
    border: 'border-emerald-600 dark:border-emerald-400',
  },
  parent: {
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300',
    active: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 font-semibold',
    border: 'border-amber-600 dark:border-amber-400',
  },
  admin: {
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
    active: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-semibold',
    border: 'border-purple-600 dark:border-purple-400',
  },
};

export default function SidebarLayout({ role, navLinks }: { role: string, navLinks: any[] }) {
  const { currentUser, setCurrentUser } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate('/');
  };

  const styles = roleThemeMap[role as UserRole] || roleThemeMap.student;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col md:flex-row font-sans text-neutral-900 dark:text-neutral-100 transition-colors">
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0 flex flex-col print:hidden transition-colors">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="font-bold tracking-tight text-neutral-800 dark:text-white">AIES</h1>
          <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-auto", styles.badge)}>
            {role}
          </span>
          <div className="ml-2">
            <NotificationsSidebar />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== `/${role}` && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? styles.active
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-white">{currentUser?.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
