import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Play, Square, RefreshCw, MessageSquare, CheckCircle2, ChevronRight, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../lib/gemini';
import { InterviewQuestion, ResumeData } from '../types';
import { cn } from '../lib/utils';

export default function InterviewSimulator() {
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Mock resume data for demo if none exists
  const mockResume: ResumeData = {
    personalInfo: { fullName: 'John Doe', email: '', phone: '', location: '', summary: 'Full stack developer with 5 years experience in React and Node.js.' },
    experience: [], education: [], skills: ['React', 'Node.js', 'TypeScript', 'Firebase'], projects: []
  };

  const startInterview = async () => {
    setIsGenerating(true);
    try {
      const q = await aiService.generateInterviewQuestions(mockResume);
      setQuestions(q);
      setStep('interview');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTranscript('');
    } else {
      setStep('feedback');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Interview Simulator</h1>
        <p className="text-slate-400 mt-1">Practice your technical and HR skills with real-time feedback.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto text-center p-12 rounded-3xl bg-white/5 border border-white/10 space-y-8"
          >
            <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto">
              <BrainCircuit className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ready to practice?</h2>
              <p className="text-slate-400 leading-relaxed">
                Our AI will analyze your resume and generate a tailored set of 5 questions 
                ranging from technical deep-dives to behavioral HR scenarios.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={startInterview}
                disabled={isGenerating}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Start Simulation
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">Includes Technical & Behavioral questions</p>
            </div>
          </motion.div>
        )}

        {step === 'interview' && (
          <motion.div 
            key="interview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
                <h2 className="text-2xl font-bold">{questions[currentIdx].type === 'technical' ? 'Technical Round' : 'Behavioral Round'}</h2>
              </div>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={cn("w-8 h-1.5 rounded-full transition-all", i <= currentIdx ? "bg-indigo-500" : "bg-white/10")} />
                ))}
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-center space-y-6">
              <p className="text-2xl font-medium leading-relaxed">"{questions[currentIdx].question}"</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">Your Answer</label>
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isRecording ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-slate-400 border border-white/10"
                  )}
                >
                  {isRecording ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </button>
              </div>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[200px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg"
                placeholder="Type or speak your answer here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleNext}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                {currentIdx === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">Interview Complete!</h2>
              <p className="text-slate-400">Our AI is generating your personalized feedback report.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                <h3 className="text-xl font-bold">Performance Summary</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Technical Accuracy', score: 85 },
                    { label: 'Communication', score: 92 },
                    { label: 'Confidence', score: 78 },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{stat.label}</span>
                        <span className="font-bold">{stat.score}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.score}%` }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                <h3 className="text-xl font-bold">Key Recommendations</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-400">1</span>
                    </div>
                    Focus more on quantifying your achievements in the behavioral round.
                  </li>
                  <li className="flex gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-400">2</span>
                    </div>
                    Your explanation of React hooks was solid, but try to mention performance optimization.
                  </li>
                </ul>
              </section>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setStep('setup')}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all"
              >
                Try Again
              </button>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold transition-all">
                Download Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
