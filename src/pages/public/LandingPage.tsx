import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Building2, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Download, 
  Play, 
  ChevronRight,
  Layers,
  Award,
  Clock,
  Compass
} from 'lucide-react';
import DesktopDownloadCard from '../../components/shared/DesktopDownloadCard';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                AIES <span className="text-blue-400">SAT</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adaptive Intelligence</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-blue-400 transition-colors">Textbook Library</a>
            <a href="#schools" className="hover:text-blue-400 transition-colors">For Schools</a>
            <a href="#download" className="hover:text-blue-400 transition-colors">Download App</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Digital SAT Preparation & Adaptive Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Master the Digital SAT with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Adaptive Socratic AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            A complete instructional ecosystem for students, teachers, and schools. 4 full interactive textbooks, real-time diagnostic calibration, and official concordance analytics.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm uppercase tracking-wider shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started in Browser</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/student/sat/practice')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-bold rounded-2xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Try Free Diagnostic Trial</span>
            </button>
          </div>

          {/* Role Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-12 text-left max-w-4xl mx-auto">
            {/* Student Card */}
            <div 
              onClick={() => navigate('/auth?role=student')}
              className="p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors">For Students</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adaptive workouts across all 8 SAT domains, interactive lesson walkthroughs, and personalized score projections.
              </p>
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                Student Portal <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Educator Card */}
            <div 
              onClick={() => navigate('/auth?role=teacher')}
              className="p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors">For Educators</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Content Studio for AI-generated exams, classroom assignment tools, and real-time student mastery telemetry.
              </p>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-1">
                Educator Portal <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Parent Card */}
            <div 
              onClick={() => navigate('/auth?role=parent')}
              className="p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-3xl cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">For Parents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evidence-based weekly growth reports, scaled score trajectories, and teacher communication channels.
              </p>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-1">
                Parent Portal <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">Instructional Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Why Schools Choose AIES SAT</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Bluebook administers the exam. AIES teaches for it — empowering schools with full curricular alignment and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">2-Stage Adaptive Modules</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates official test routing logic. Module 1 routes students into easy or hard calibrated Module 2 sections automatically.
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Official Concordance Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates scaled score predictions from 400 to 1600 based on standard Digital SAT equating models.
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-white">Multi-Tenant School Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict database isolation keeps teacher content, student rosters, and school analytics private and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Download Section */}
      <section id="download" className="py-20 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">Native Applications</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Study Offline on Desktop</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Install AIES SAT on your Windows, Mac, or Linux computer to practice without needing a constant internet connection.
          </p>

          <DesktopDownloadCard />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500 space-y-3">
        <p>© 2026 AIES SAT Platform · All rights reserved.</p>
        <p className="max-w-md mx-auto text-[11px] text-slate-600">
          SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this product.
        </p>
      </footer>

    </div>
  );
}
