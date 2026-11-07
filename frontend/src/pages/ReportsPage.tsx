import React, { useState } from 'react';
import {
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ReportsPage: React.FC = () => {
  const { resumeData, analysis, atsResult, matchResult, targetRole, downloadPdfReport, isDownloadingReport, error } = useResume();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!resumeData || !analysis || !atsResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
          <Download className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Analysis Ready for Export</h2>
          <p className="text-sm text-slate-400 mb-6">
            Upload your resume or activate the demo preview from the dashboard to generate and export your complete PDF report.
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      setDownloadSuccess(false);
      await downloadPdfReport();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch {
      // Handled by context
    }
  };

  const sectionsIncluded = [
    { title: 'Executive Quality & ATS Summary', desc: 'Overall scores, candidate positioning, and rating badges' },
    { title: '6-Factor Heuristic Scoring Breakdown', desc: 'Skills (30%), Experience (25%), Projects (20%), Education (10%), Structure (10%), Keywords (5%)' },
    { title: 'Demonstrated Strengths & Critical Weaknesses', desc: 'Objective bulleted analysis grounded strictly in extracted evidence' },
    { title: 'Action-Verb Bullet Point Rewrites', desc: 'Google X-Y-Z formula suggested rewrites highlighting business outcomes' },
    { title: 'Heuristic ATS Readiness Audit', desc: 'Section boundary detection, missing sections, and formatting risk warnings' },
    { title: 'Target Job Compatibility & Skill Gaps', desc: matchResult ? 'TF-IDF cosine similarity, matching skills, and missing keywords' : 'Available when target job description is provided' },
    { title: 'Prioritized Action Recommendations', desc: 'High, medium, and optional enhancements with section targets' },
    { title: 'Scoring Methodology Limitations', desc: 'Mandatory algorithmic transparency notice ensuring ethical guidance' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white">Generate Executive PDF Report</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Publication-ready ReportLab PDF document containing full quality scores, ATS diagnostics, and suggested rewrites.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Report Card & Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>

            <h2 className="text-base font-bold text-white mb-1">
              ResumeAI Intelligence Report
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Formatted with two-pass page numbering, custom brand palettes, and structured tables.
            </p>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs mb-6">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Candidate:</span>
                <span className="font-semibold text-white">{resumeData.contact.name || 'Candidate'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-semibold text-indigo-400">{targetRole || 'General Engineering Role'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Quality Score:</span>
                <span className="font-semibold text-emerald-400">
                  {analysis.quality_score.overall_score.toFixed(1)} / 100 ({analysis.quality_score.rating_label})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ATS Readiness:</span>
                <span className="font-semibold text-teal-400">
                  {atsResult.ats_score.toFixed(0)}% ({atsResult.status})
                </span>
              </div>
              {matchResult && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Job Match:</span>
                  <span className="font-semibold text-blue-400">
                    {matchResult.match_score.toFixed(1)}% (TF-IDF)
                  </span>
                </div>
              )}
            </div>

            {/* Error or Success notification */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start space-x-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {downloadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>PDF generated and downloaded successfully!</span>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloadingReport}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                isDownloadingReport
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
              }`}
            >
              {isDownloadingReport ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Building PDF Document via ReportLab...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Table of Contents & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              Included Report Sections
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Every exported document includes comprehensive career analytics formatted according to clean publishing typography.
            </p>

            <div className="space-y-4">
              {sectionsIncluded.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 flex items-start space-x-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{s.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
