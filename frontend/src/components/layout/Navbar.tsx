import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  BarChart3,
  Briefcase,
  Layers,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { resumeData, loadSamplePreview, clearResume } = useResume();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Analysis', path: '/analysis', icon: FileText },
    { name: 'Job Match', path: '/matching', icon: Briefcase },
    { name: 'Skill Gap', path: '/skills', icon: Layers },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Report', path: '/reports', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Resume</span>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Career Intelligence</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {resumeData ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 truncate max-w-[120px]">
                  {resumeData.contact.name || resumeData.filename}
                </span>
              </div>
              <button
                onClick={clearResume}
                className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
                title="Clear current resume"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={loadSamplePreview}
              className="text-xs font-medium text-slate-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-indigo-500/40 bg-slate-900/60 transition-all"
            >
              Demo Preview
            </button>
          )}

          <Link
            to="/dashboard"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

