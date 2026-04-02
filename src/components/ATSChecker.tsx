import { useState } from 'react';
import { Search, Sparkles, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, Target, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { aiService } from '../lib/gemini';
import { ATSAnalysis } from '../types';
import { cn } from '../lib/utils';

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeATS(resumeText, jobDescription);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">ATS Optimizer</h1>
        <p className="text-slate-400 mt-1">Optimize your resume for Applicant Tracking Systems.</p>
      </header>

      {!analysis ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Paste Resume Text
            </label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[400px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Paste the content of your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Job Description
            </label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[400px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Paste the job description you're targeting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-center pt-4">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText || !jobDescription}
              className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Match Score
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                  <circle 
                    cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * analysis.score) / 100}
                    className={cn(
                      "transition-all duration-1000",
                      analysis.score >= 80 ? "text-green-400" : analysis.score >= 60 ? "text-amber-400" : "text-red-400"
                    )}
                  />
                </svg>
                <span className="absolute text-3xl font-bold">{analysis.score}%</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">ATS Match Score</h3>
                <p className="text-slate-400 text-sm mt-1">Based on keywords and relevance</p>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-green-400 mb-4" />
                <p className="text-sm text-slate-400 font-medium">Strengths</p>
                <p className="text-xl font-bold mt-1">{analysis.feedback.length} Points</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <AlertCircle className="w-6 h-6 text-amber-400 mb-4" />
                <p className="text-sm text-slate-400 font-medium">Missing Keywords</p>
                <p className="text-xl font-bold mt-1">{analysis.missingKeywords.length} Found</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <BrainCircuit className="w-6 h-6 text-indigo-400 mb-4" />
                <p className="text-sm text-slate-400 font-medium">Impact Score</p>
                <p className="text-xl font-bold mt-1">High</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Search className="w-6 h-6 text-cyan-400 mb-4" />
                <p className="text-sm text-slate-400 font-medium">Grammar Check</p>
                <p className="text-xl font-bold mt-1">{analysis.grammarIssues.length === 0 ? 'Perfect' : `${analysis.grammarIssues.length} Issues`}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Improvement Suggestions
              </h2>
              <ul className="space-y-4">
                {analysis.feedback.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-300">
                    <ArrowRight className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Critical Keywords to Add
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setAnalysis(null)}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all"
            >
              Analyze Another Job
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
