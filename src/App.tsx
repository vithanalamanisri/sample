import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Globe, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Plus, 
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Target,
  RefreshCw
} from 'lucide-react';
import { auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from './lib/utils';
import React, { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-slate-400">
              {this.state.error?.message?.includes('{"error"') 
                ? "A database error occurred. Please check your connection or permissions."
                : "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Components (to be created)
import ResumeBuilder from './components/ResumeBuilder';
import ATSChecker from './components/ATSChecker';
import InterviewSimulator from './components/InterviewSimulator';
import PortfolioGenerator from './components/PortfolioGenerator';

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'ats' | 'interview' | 'portfolio'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
        {/* Hero Section */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CareerAI</span>
          </div>
          <button 
            onClick={handleLogin}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
          >
            Sign In
          </button>
        </nav>

        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Career Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              Build your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Intelligence</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed"
            >
              From professional resume building to AI-powered interview simulations. 
              Everything you need to land your dream job in one platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2"
              >
                Get Started Free <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all">
                View Templates
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-32">
            {[
              { icon: FileText, title: "AI Resume Builder", desc: "Generate professional resumes with AI-suggested content and templates." },
              { icon: Search, title: "ATS Optimizer", desc: "Analyze and optimize your resume for Applicant Tracking Systems." },
              { icon: BrainCircuit, title: "Interview Simulator", desc: "Practice with AI-generated technical and HR interview questions." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">CareerAI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'builder', icon: FileText, label: 'Resume Builder' },
            { id: 'ats', icon: Search, label: 'ATS Checker' },
            { id: 'interview', icon: BrainCircuit, label: 'Interview Prep' },
            { id: 'portfolio', icon: Globe, label: 'Portfolio Gen' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.displayName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {activeTab === 'dashboard' && <Dashboard user={user} onNavigate={setActiveTab} />}
            {activeTab === 'builder' && <ResumeBuilder />}
            {activeTab === 'ats' && <ATSChecker />}
            {activeTab === 'interview' && <InterviewSimulator />}
            {activeTab === 'portfolio' && <PortfolioGenerator />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Dashboard({ user, onNavigate }: { user: FirebaseUser, onNavigate: (tab: any) => void }) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {user.displayName?.split(' ')[0]}!</h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your career journey.</p>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Resume Score', value: '85/100', icon: Target, color: 'text-green-400' },
          { label: 'Applications', value: '12', icon: FileText, color: 'text-indigo-400' },
          { label: 'Interview Prep', value: '4 Sessions', icon: BrainCircuit, color: 'text-cyan-400' },
          { label: 'Skill Gaps', value: '3 Found', icon: AlertCircle, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate('builder')}
              className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all text-left group"
            >
              <Plus className="w-5 h-5 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-bold">New Resume</p>
              <p className="text-xs text-slate-500 mt-1">Create from template</p>
            </button>
            <button 
              onClick={() => onNavigate('ats')}
              className="p-4 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 hover:bg-cyan-600/20 transition-all text-left group"
            >
              <Search className="w-5 h-5 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-bold">Check ATS</p>
              <p className="text-xs text-slate-500 mt-1">Optimize your score</p>
            </button>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Resume Updated', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-400' },
              { action: 'Interview Practice', time: 'Yesterday', icon: BrainCircuit, color: 'text-indigo-400' },
              { action: 'Profile Analyzed', time: '3 days ago', icon: Sparkles, color: 'text-cyan-400' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all">
                <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", activity.color)}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
