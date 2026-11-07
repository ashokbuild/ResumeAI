import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AnalysisPage: React.FC = () => {
  const { resumeData, analysis } = useResume();
  const [activeTab, setActiveTab] = useState<'overview' | 'bullets' | 'experience' | 'projects'>('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!resumeData || !analysis) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Resume Analyzed Yet</h2>
          <p className="text-sm text-slate-400 mb-6">
            Upload your resume or activate the demo preview from the dashboard to explore full AI evaluations.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const { overall_score, rating_label, breakdown } = analysis.quality_score;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Deep-Dive AI Evaluation</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded structural assessment, action-verb audits, and Google X-Y-Z formula rewrites.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bullets')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bullets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bullet Rewrites ({analysis.bullet_rewrites.length})
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'experience'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Executive Summary Card with Suggested Rewrite */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Executive Summary &amp; Positioning</span>
              </h2>
              <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Score: {overall_score.toFixed(1)}/100 ({rating_label})
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl p-4 text-xs text-slate-300 leading-relaxed mb-4">
              <p className="font-semibold text-slate-400 uppercase text-[10px] mb-1">Current Resume Profile:</p>
              {resumeData.summary || 'No dedicated professional summary detected in current resume.'}
            </div>

            {analysis.suggested_summary_rewrite && (
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggested High-Impact Rewrite</span>
                  </span>
                  <button
                    onClick={() => handleCopySummary(analysis.suggested_summary_rewrite!)}
                    className="flex items-center space-x-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {analysis.suggested_summary_rewrite}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  Note: Review and verify accuracy to ensure this precisely reflects your background.
                </p>
              </div>
            )}
          </div>

          {/* 6 Category Drill-Down Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              breakdown.skills_relevance,
              breakdown.experience_quality,
              breakdown.project_quality,
              breakdown.education_certifications,
              breakdown.resume_structure,
              breakdown.keyword_coverage,
            ].map((cat, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-extrabold text-indigo-400">{cat.score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mb-3 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${cat.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-300 mb-3">{cat.feedback}</p>

                  {cat.strengths.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                        Strengths:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {cat.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cat.weaknesses.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-1">
                        Areas to Improve:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {cat.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Bullet Rewrites */}
      {activeTab === 'bullets' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              Suggested Bullet Point Rewrites
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Weak bullet points have been rewritten following the Google X-Y-Z formula (&quot;Accomplished [X], as measured by [Y], by doing [Z]&quot;).
              Each suggested rewrite requires your personal verification of numerical figures.
            </p>

            <div className="space-y-6">
              {analysis.bullet_rewrites.map((bullet, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {bullet.section} Bullet #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleCopyBullet(bullet.suggested, idx)}
                      className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-white bg-indigo-600/20 hover:bg-indigo-600 px-3 py-1 rounded-lg border border-indigo-500/30 transition-all"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Rewrite</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Original */}
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Original Bullet:
                    </p>
                    <p className="text-xs text-slate-400 line-through decoration-rose-500/50">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Suggested Rewrite */}
                  <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 mb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                      High-Impact Alternative:
                    </p>
                    <p className="text-xs text-slate-100 font-medium leading-relaxed">
                      {bullet.suggested}
                    </p>
                  </div>

                  {/* Rationale */}
                  <p className="text-[11px] text-slate-400 italic">
                    Why this works: {bullet.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Experience Evaluation */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Work Experience Evaluation</h2>
            <p className="text-xs text-slate-400 mb-6">
              Evaluates decisive action verb frequency, quantifiable metric depth, and relevance to modern hiring criteria.
            </p>

            <div className="space-y-5">
              {analysis.experience_evaluations.map((exp, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 mb-4 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                      <p className="text-xs text-slate-400">{exp.company}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-400">
                        Action Verbs:{' '}
                        <strong className="text-indigo-400">{exp.action_verbs_score.toFixed(0)}%</strong>
                      </span>
                      <span className="text-slate-400">
                        Quantification:{' '}
                        <strong className="text-emerald-400">{exp.quantification_score.toFixed(0)}%</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{exp.feedback}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase mb-1">Highlights:</p>
                      <ul className="space-y-1 text-slate-400">
                        {exp.strengths.map((s, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-rose-400 uppercase mb-1">Optimization Opportunities:</p>
                      <ul className="space-y-1 text-slate-400">
                        {exp.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Projects Evaluation */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Technical Project Evaluation</h2>
            <p className="text-xs text-slate-400 mb-6">
              Assesses tech stack clarity, architectural complexity, and demonstrable engineering problem solving.
            </p>

            <div className="space-y-5">
              {analysis.project_evaluations.map((proj, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 mb-3 gap-2">
                    <h3 className="text-sm font-bold text-white">{proj.project_title}</h3>
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      Relevance: {proj.relevance_score.toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{proj.feedback}</p>

                  {proj.technologies_detected.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1">Stack:</span>
                      {proj.technologies_detected.map((t, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-400 uppercase mb-1">Key Strengths:</p>
                      <ul className="space-y-1 text-slate-400">
                        {proj.strengths.map((s, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-rose-400 uppercase mb-1">Recommended Enhancements:</p>
                      <ul className="space-y-1 text-slate-400">
                        {proj.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
