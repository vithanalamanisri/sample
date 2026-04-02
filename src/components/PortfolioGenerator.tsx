import { useState } from 'react';
import { Globe, Sparkles, Layout, Palette, Share2, ExternalLink, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function PortfolioGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'modern' | 'minimal' | 'creative'>('modern');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Generator</h1>
          <p className="text-slate-400 mt-1">Convert your resume into a stunning personal website.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
            <Share2 className="w-4 h-4" />
            Publish
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <ExternalLink className="w-4 h-4" />
            Live Preview
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <section className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Theme Selection</h3>
            <div className="space-y-2">
              {[
                { id: 'modern', label: 'Modern Dark', icon: Layout },
                { id: 'minimal', label: 'Clean Minimal', icon: Palette },
                { id: 'creative', label: 'Creative Bold', icon: Sparkles },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    theme === t.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/5"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Device Preview</h3>
            <div className="flex gap-2">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setPreviewDevice(d.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center p-3 rounded-xl transition-all",
                    previewDevice === d.id ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5"
                  )}
                >
                  <d.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Regenerate Site
          </button>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className={cn(
            "mx-auto bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500",
            previewDevice === 'desktop' ? 'w-full' : previewDevice === 'tablet' ? 'w-[600px]' : 'w-[320px]'
          )}>
            {/* Browser Header */}
            <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-4 h-6 bg-white/5 rounded-md flex items-center px-3">
                <span className="text-[10px] text-slate-500">portfolio.careerai.com/johndoe</span>
              </div>
            </div>

            {/* Site Content Preview */}
            <div className="h-[600px] overflow-y-auto bg-slate-950 text-white p-12 space-y-12">
              <nav className="flex justify-between items-center">
                <span className="font-bold">JD.</span>
                <div className="flex gap-6 text-sm text-slate-400">
                  <span>About</span>
                  <span>Projects</span>
                  <span>Contact</span>
                </div>
              </nav>

              <div className="space-y-6 pt-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold leading-tight"
                >
                  Building digital <br />
                  <span className="text-indigo-400 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">experiences</span> that matter.
                </motion.h1>
                <p className="text-slate-400 max-w-md">
                  Full-stack developer specializing in building exceptional digital experiences. 
                  Currently focused on building accessible, human-centered products.
                </p>
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-indigo-600 rounded-full text-sm font-bold">View Projects</div>
                  <div className="px-6 py-3 border border-white/10 rounded-full text-sm font-bold">Contact Me</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="aspect-video bg-white/5 rounded-2xl border border-white/10" />
                <div className="aspect-video bg-white/5 rounded-2xl border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
