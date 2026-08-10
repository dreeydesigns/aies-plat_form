import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { KeyboardShortcutsProvider } from './context/KeyboardShortcutsProvider';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import NetworkBanner from './components/shared/NetworkBanner';
import { BookOpen, LogIn } from 'lucide-react';

















import EmptyState from './components/shared/EmptyState';
import AuthScreen from './components/auth/AuthScreen';
import AdminConsole from './components/auth/AdminConsole';
import Onboarding from './components/auth/Onboarding';

import { FolderX, Users, Settings } from 'lucide-react';







import { googleSignIn, emailSignIn, emailSignUp, initAuth } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

// Route-level code splitting: each role's dashboard/pages only download
// when that role actually navigates there.
const StudentDashboard = React.lazy(() => import('./pages/student/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./pages/teacher/TeacherDashboard'));
const ParentDashboard = React.lazy(() => import('./pages/parent/ParentDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const StudentLayout = React.lazy(() => import('./layouts/StudentLayout'));
const TeacherLayout = React.lazy(() => import('./layouts/TeacherLayout'));
const ParentLayout = React.lazy(() => import('./layouts/ParentLayout'));
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const CourseView = React.lazy(() => import('./pages/student/CourseView'));
const LessonView = React.lazy(() => import('./pages/student/LessonView'));
const StudentCourses = React.lazy(() => import('./pages/student/StudentCourses'));
const StudentSettings = React.lazy(() => import('./pages/student/StudentSettings'));
const VRLabs = React.lazy(() => import('./pages/student/VRLabs'));
const TeacherSettings = React.lazy(() => import('./pages/teacher/TeacherSettings'));
const ParentSettings = React.lazy(() => import('./pages/parent/ParentSettings'));
const MessagesPage = React.lazy(() => import('./pages/shared/MessagesPage'));
const ParentReport = React.lazy(() => import('./pages/parent/ParentReport'));
const Leaderboard = React.lazy(() => import('./pages/student/Leaderboard'));
const StudentDetail = React.lazy(() => import('./pages/teacher/StudentDetail'));
const CourseBuilder = React.lazy(() => import('./pages/teacher/CourseBuilder'));
const TeacherRoster = React.lazy(() => import('./pages/teacher/TeacherRoster'));
const ParentChildren = React.lazy(() => import('./pages/parent/ParentChildren'));
const TeacherReports = React.lazy(() => import('./pages/teacher/TeacherReports'));
const AdminReports = React.lazy(() => import('./pages/admin/AdminReports'));
const SetupGuide = React.lazy(() => import('./pages/shared/SetupGuide'));

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const { currentUser, userProfile } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If we have a user but no profile yet, maybe return null or loading, but let's assume if currentUser is there, userProfile is mostly there, unless not loaded. 
  // Wait, if not loaded, AppContent shouldn't render yet because of isAuthReady, but let's be safe.
  if (!userProfile) {
     return <div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">Loading profile...</div>;
  }

  if (userProfile.role !== allowedRole) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" replace />;
    }
    return <Navigate to={`/${userProfile.role}`} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isAuthReady } = useAppContext();

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">Loading...</div>;
  }

  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">Loading...</div>}>
    <Routes>
      <Route path="/" element={<AuthScreen />} />
      <Route path="/admin-console" element={<AdminConsole />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses/:courseId" element={<CourseView />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="labs" element={<VRLabs />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="guide" element={<SetupGuide />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="courses" element={<CourseBuilder />} />
        <Route path="students" element={<TeacherRoster />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="reports" element={<TeacherReports />} />
        <Route path="settings" element={<TeacherSettings />} />
        <Route path="guide" element={<SetupGuide />} />
      </Route>

      {/* Parent Routes */}
      <Route path="/parent" element={<ProtectedRoute allowedRole="parent"><ParentLayout /></ProtectedRoute>}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="children/:studentId/report" element={<ParentReport />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="resources" element={<div className="pt-6"><EmptyState icon={FolderX} title="Parent Resources" description="No content available." /></div>} />
        <Route path="settings" element={<ParentSettings />} />
        <Route path="guide" element={<SetupGuide />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<div className="pt-6"><EmptyState icon={Users} title="User Management" description="No students assigned yet." /></div>} />
        <Route path="courses" element={<div className="pt-6"><EmptyState icon={BookOpen} title="Course Oversight" description="You do not have any courses available right now." /></div>} />
        <Route path="gamification" element={<div className="pt-6"><EmptyState icon={Settings} title="Gamification Config" description="Settings panel is under construction." /></div>} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<div className="pt-6"><EmptyState icon={Settings} title="System Settings" description="Settings panel is under construction." /></div>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </React.Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AccessibilityProvider>
          <KeyboardShortcutsProvider>
            <ToastProvider>
              <AppProvider>
                <NetworkBanner />
                <Router>
                  <AppContent />
                </Router>
              </AppProvider>
            </ToastProvider>
          </KeyboardShortcutsProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
