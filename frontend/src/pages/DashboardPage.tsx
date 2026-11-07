import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Briefcase,
  Layers,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ScoreRadarChart } from '../components/charts/ScoreRadarChart';
import { ResumeUploadModal } from '../components/upload/ResumeUploadModal';

export const DashboardPage: React.FC = () => {
  const { resumeData, analysis, atsResult, matchResult, loadSamplePreview } = useResume();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // If no resume uploaded yet, show clear, honest empty state
  if (!resumeData || !analysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Upload className="w-10 h-10 animate-bounce" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Start Your Career Analysis
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8">
            Upload your PDF resume to receive transparent quality scoring, ATS diagnostics, and AI-grounded improvement recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your Resume</span>
            </button>

            <button
              onClick={loadSamplePreview}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 font-medium px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Explore With Sample Data</span>
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-200">100% Stateless &amp; Private</p>
                <p className="text-[11px] text-slate-400">Processed in memory without permanent database retention.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Gemini 2.5 + TF-IDF</p>
                <p className="text-[11px] text-slate-400">Combines generative LLM critique with mathematical vector overlap.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Executive PDF Export</p>
                <p className="text-[11px] text-slate-400">Generate publication-quality report ready for mentor review.</p>
              </div>
            </div>
          </div>
        </div>

        <ResumeUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      </div>
    );
  }

  const { overall_score, rating_label, breakdown } = analysis.quality_score;
  const highPriorityRecs = analysis.recommendations.filter((r) => r.priority === 'high');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Candidate Overview */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {resumeData.contact.name || 'Candidate Resume'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {rating_label}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>{resumeData.filename}</span>
            <span>•</span>
            <span>{resumeData.file_size_kb} KB</span>
            <span>•</span>
            <span>{resumeData.page_count} Page(s)</span>
            {resumeData.contact.email && (
              <>
                <span>•</span>
                <span>{resumeData.contact.email}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Version</span>
          </button>
          <Link
            to="/reports"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Quality Score */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Resume Quality</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{overall_score.toFixed(1)}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-indigo-400 font-semibold mt-1">{rating_label}</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overall_score)}%` }}
            />
          </div>
        </div>

        {/* ATS Readiness */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">ATS Readiness</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {atsResult ? `${atsResult.ats_score.toFixed(0)}%` : 'Checking...'}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-semibold mt-1">
            {atsResult?.status || 'Parser Verified'}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${atsResult?.ats_score || 0}%` }}
            />
          </div>
        </div>

        {/* Job Match */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Target Role Match</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          {matchResult ? (
            <>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">
                  {matchResult.match_score.toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400">Similarity</span>
              </div>
              <p className="text-xs text-blue-400 font-semibold mt-1">
                {matchResult.matching_skills.length} matching skills
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-slate-400">Not Evaluated</p>
              <Link
                to="/matching"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-2 inline-flex items-center space-x-1"
              >
                <span>Compare target job</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${matchResult?.match_score || 0}%` }}
            />
          </div>
        </div>

        {/* Skills Identified */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Technical Skills</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {resumeData.technical_skills.length}
            </span>
            <span className="text-xs text-slate-400">Detected Tools</span>
          </div>
          <p className="text-xs text-purple-400 font-semibold mt-1">
            {highPriorityRecs.length} High-Priority Actions
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${Math.min(100, resumeData.technical_skills.length * 8)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Radar Chart + 6-Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar & Summary */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Score Topology</h2>
              <span className="text-xs text-slate-400">6 Dimension Model</span>
            </div>
            <ScoreRadarChart breakdown={breakdown} />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Executive Assessment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis.executive_summary}
            </p>
          </div>
        </div>

        {/* 6 Category Breakdown Bars */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white">Transparent Heuristic Breakdown</h2>
            <Link
              to="/analysis"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Explore Full Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              breakdown.skills_relevance,
              breakdown.experience_quality,
              breakdown.project_quality,
              breakdown.education_certifications,
              breakdown.resume_structure,
              breakdown.keyword_coverage,
            ].map((cat, i) => (
              <div key={i} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">
                    {cat.name}{' '}
                    <span className="text-slate-400 font-normal">({(cat.weight * 100).toFixed(0)}%)</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{cat.score.toFixed(1)}/100</span>
                    <span className="text-slate-400 text-[11px] font-mono">
                      [+{cat.weighted_score.toFixed(1)} pts]
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      cat.score >= 80 ? 'bg-indigo-500' : cat.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.score)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{cat.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Demonstrated Strengths</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {analysis.key_strengths.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-rose-900/30 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Areas to Address</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {analysis.critical_weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400">
            Recommended Next Step
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Compare Against a Target Job Description
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Calculate your TF-IDF job compatibility score and discover specific missing technical keywords.
          </p>
        </div>

        <Link
          to="/matching"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <span>Run Job Match</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ResumeUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
