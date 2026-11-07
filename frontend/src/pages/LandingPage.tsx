import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  Cpu,
  Layers,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { ResumeUploadModal } from '../components/upload/ResumeUploadModal';
import { useResume } from '../context/ResumeContext';

export const LandingPage: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { loadSamplePreview } = useResume();
  const navigate = useNavigate();

  const handleDemoPreview = () => {
    loadSamplePreview();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Cpu,
      title: 'Gemini AI Intelligence',
      description: 'Senior technical recruiter insights grounded strictly in your real achievements and quantifiable milestones.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: ShieldCheck,
      title: 'Heuristic ATS Readiness',
      description: 'Comprehensive audit of section structures, contact clarity, and parser-hostile layout traps.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Target,
      title: 'TF-IDF Job Matching',
      description: 'Mathematical text similarity and vocabulary overlap comparing your resume against any target role description.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Layers,
      title: 'Semantic Skill Gap Explorer',
      description: 'Identifies matching skills, missing technologies, and actionable learning recommendations.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Zap,
      title: 'Action-Verb Bullet Rewrites',
      description: 'Google X-Y-Z formula rewrites that amplify passive duties into high-impact outcome metrics.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Download,
      title: 'Downloadable PDF Reports',
      description: 'Executive-ready career evaluation PDF report generated via ReportLab with complete scoring transparency.',
      color: 'from-sky-500 to-indigo-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Text PDF',
      desc: 'Drag & drop your current resume. PyMuPDF extracts text, dates, roles, and technical tools.',
    },
    {
      step: '02',
      title: 'AI Decodes Substance',
      desc: 'Gemini evaluates experience impact, project depth, and computes a transparent 6-factor quality score.',
    },
    {
      step: '03',
      title: 'Compare Target Roles',
      desc: 'Paste a job description to trigger Scikit-learn TF-IDF cosine matching and identify missing keywords.',
    },
    {
      step: '04',
      title: 'Export Intelligence',
      desc: 'Download a beautifully styled PDF analysis report to guide your next interview-ready resume revision.',
    },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-10 sm:pt-16">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Career Intelligence &amp; Job Matching</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Your next opportunity starts with a{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            better resume.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          ResumeAI decodes your resume with Gemini AI and Scikit-learn NLP. Discover ATS readiness,
          uncover critical skill gaps, quantify impact, and align your profile with high-paying opportunities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 transition-all text-sm group"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleDemoPreview}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-medium px-6 py-3.5 rounded-xl transition-all text-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Explore Demo Preview</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>No account required</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stateless processing</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free &amp; Private</span>
          </span>
        </div>
      </section>

      {/* Interactive Illustrative Preview Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Live Intelligence Preview</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Illustrative Sample
                </span>
              </div>
              <p className="text-xs text-slate-400">Alex Chen • Senior Software Engineer Candidate</p>
            </div>
            <button
              onClick={handleDemoPreview}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Load Full Interactive Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Resume Quality</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-indigo-400">87.5</span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span className="text-xs font-semibold text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Strong
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-3">
                Decisive action verbs and 4+ quantified business impact outcomes.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ATS Readiness</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-emerald-400">92%</span>
                <span className="text-xs font-semibold text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Optimized
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-3">
                Single-column format, standard section headings, and verified contact links.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">TF-IDF Role Match</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-blue-400">84%</span>
                <span className="text-xs text-slate-400">Cosine Overlap</span>
              </div>
              <p className="text-xs text-slate-300 mt-3">
                12 matching skills found. 2 missing cloud security competencies identified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for ambitious candidates
          </h2>
          <p className="text-sm text-slate-400">
            Every feature is built with real algorithmic substance, from transparent heuristic weights to scikit-learn TF-IDF vectorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/10`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            How ResumeAI decodes your career
          </h2>
          <p className="text-sm text-slate-400">
            A seamless 4-step workflow turning raw PDF resumes into actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold text-indigo-500/30 mb-4 block">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to upgrade your resume?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Upload your PDF resume today and receive immediate AI evaluation, ATS diagnostics, and tailored bullet rewrites.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze My Resume Now</span>
          </button>
        </div>
      </section>

      {/* Upload Modal */}
      <ResumeUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
