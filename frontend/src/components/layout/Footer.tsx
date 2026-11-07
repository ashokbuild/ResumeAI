import React from 'react';
import { Sparkles, Shield, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 mt-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>ResumeAI</span>
          </div>
          <span>•</span>
          <span>Your Resume. Decoded. Optimized. Career-Ready.</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stateless &amp; Private</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini 2.5 + TF-IDF NLP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Heuristic ATS Readiness</span>
          </div>
        </div>

        <div>
          &copy; {new Date().getFullYear()} ResumeAI. Portfolio-grade Career Intelligence.
        </div>
      </div>
    </footer>
  );
};

