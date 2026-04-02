import { useState } from 'react';
import { Plus, Trash2, Sparkles, Download, Eye, Layout, Type as TypeIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData, Experience, Education, Project } from '../types';
import { aiService } from '../lib/gemini';
import { cn } from '../lib/utils';

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResume({ ...resume, experience: [...resume.experience, newExp] });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
    };
    setResume({ ...resume, education: [...resume.education, newEdu] });
  };

  const handleAIImprove = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Improve this resume summary and bullet points: ${JSON.stringify(resume)}`;
      const improved = await aiService.generateResumeContent(prompt);
      setResume({ ...resume, ...improved });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-slate-400 mt-1">Craft your professional identity with AI assistance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            {viewMode === 'edit' ? <Eye className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
            {viewMode === 'edit' ? 'Preview' : 'Edit Mode'}
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className={cn("space-y-8", viewMode === 'preview' && 'hidden lg:block')}>
          <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TypeIcon className="w-5 h-5 text-indigo-400" />
                Personal Info
              </h2>
              <button 
                onClick={handleAIImprove}
                disabled={isGenerating}
                className="text-xs px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                {isGenerating ? 'Improving...' : 'AI Improve'}
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                value={resume.personalInfo.fullName} 
                onChange={(v) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: v } })} 
              />
              <Input 
                label="Email" 
                value={resume.personalInfo.email} 
                onChange={(v) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: v } })} 
              />
              <Input 
                label="Phone" 
                value={resume.personalInfo.phone} 
                onChange={(v) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: v } })} 
              />
              <Input 
                label="Location" 
                value={resume.personalInfo.location} 
                onChange={(v) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: v } })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Professional Summary</label>
              <textarea 
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={resume.personalInfo.summary}
                onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })}
                placeholder="Briefly describe your professional background and goals..."
              />
            </div>
          </section>

          <section className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Experience</h2>
              <button onClick={addExperience} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {resume.experience.map((exp, idx) => (
              <div key={exp.id} className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Company" value={exp.company} onChange={(v) => {
                    const newExp = [...resume.experience];
                    newExp[idx].company = v;
                    setResume({ ...resume, experience: newExp });
                  }} />
                  <Input label="Position" value={exp.position} onChange={(v) => {
                    const newExp = [...resume.experience];
                    newExp[idx].position = v;
                    setResume({ ...resume, experience: newExp });
                  }} />
                </div>
                <textarea 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...resume.experience];
                    newExp[idx].description = e.target.value;
                    setResume({ ...resume, experience: newExp });
                  }}
                  placeholder="Key responsibilities and achievements..."
                />
              </div>
            ))}
          </section>
        </div>

        {/* Preview Section */}
        <div className={cn("bg-white rounded-3xl p-12 text-slate-900 min-h-[800px] shadow-2xl", viewMode === 'edit' && 'hidden lg:block')}>
          <div className="max-w-2xl mx-auto space-y-8">
            <header className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{resume.personalInfo.fullName || 'Your Name'}</h1>
              <div className="text-slate-500 flex justify-center gap-4 text-sm">
                <span>{resume.personalInfo.email}</span>
                <span>{resume.personalInfo.phone}</span>
                <span>{resume.personalInfo.location}</span>
              </div>
            </header>

            {resume.personalInfo.summary && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 uppercase tracking-wider">Summary</h2>
                <p className="text-slate-700 leading-relaxed">{resume.personalInfo.summary}</p>
              </section>
            )}

            {resume.experience.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 uppercase tracking-wider">Experience</h2>
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{exp.position || 'Position'}</span>
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-indigo-600 font-medium">{exp.company || 'Company'}</div>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <input 
        type="text"
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
