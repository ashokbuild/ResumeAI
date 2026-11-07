import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ScoreBadge } from '../components/common/ScoreBadge';

export const MatchingPage: React.FC = () => {
  const {
    runJobMatch,
    matchResult,
    isMatching,
    targetRole,
    setTargetRole,
    jobDescription,
  } = useResume();

  const [inputTitle, setInputTitle] = useState(targetRole || 'Senior Full Stack Engineer');
  const [inputJD, setInputJD] = useState(jobDescription || '');

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputJD.trim()) return;
    setTargetRole(inputTitle);
    await runJobMatch(inputJD, inputTitle);
  };

  const handleLoadSampleJD = () => {
    const sampleJD = `We are seeking a Senior Full Stack Software Engineer to build and scale our high-throughput distributed cloud services.
Key Responsibilities:
- Design, implement, and maintain scalable microservices using Python, FastAPI, and Docker.
- Build responsive, accessible frontend user interfaces with React, TypeScript, and modern CSS.
- Optimize database queries, indexing, and storage performance across PostgreSQL and Redis.
- Collaborate with DevOps engineers on Kubernetes deployments, CI/CD pipelines in GitHub Actions, and AWS cloud infrastructure.
- Mentor junior engineers and participate in architecture design reviews.

Requirements:
- 4+ years of professional software engineering experience.
- Strong proficiency in Python, TypeScript, and React.
- Solid background in REST APIs, relational databases (PostgreSQL), and cloud environments (AWS).
- Experience with containerization (Docker, Kubernetes) and CI/CD pipelines.
- Knowledge of system architecture, unit testing, and distributed caching.`;

    setInputJD(sampleJD);
    setInputTitle('Senior Full Stack Engineer');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white">Target Job Compatibility</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Scikit-learn TF-IDF vectorization and cosine similarity measuring textual alignment and keyword coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Job Description Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Job Description Input</span>
              </h2>
              <button
                type="button"
                onClick={handleLoadSampleJD}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Insert Sample JD
              </button>
            </div>

            <form onSubmit={handleMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Paste Full Job Description
                </label>
                <textarea
                  value={inputJD}
                  onChange={(e) => setInputJD(e.target.value)}
                  rows={12}
                  placeholder="Paste the full job posting requirements, responsibilities, and preferred qualifications..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isMatching || !inputJD.trim()}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isMatching || !inputJD.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25'
                }`}
              >
                {isMatching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Calculating NLP Overlap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Job Compatibility</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed italic">
              Disclaimer: Job Match Score reflects lexical TF-IDF cosine similarity and explicit keyword matches.
              It is an optimization tool, not a certified hiring predictor.
            </p>
          </div>
        </div>

        {/* Right Panel: Matching Results */}
        <div className="lg:col-span-7 space-y-6">
          {!matchResult ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <Search className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-base font-bold text-white mb-2">No Job Description Analyzed Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6">
                Paste a target job posting on the left or click &quot;Insert Sample JD&quot; to test your resume&apos;s alignment and identify missing skills.
              </p>
              <button
                onClick={handleLoadSampleJD}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                Try With Sample Full-Stack Job
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Summary Card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Target Opportunity
                    </span>
                    <h2 className="text-lg font-bold text-white">{inputTitle}</h2>
                  </div>
                  <ScoreBadge score={matchResult.match_score} size="lg" label="Overall Match" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Text Cosine Similarity</span>
                    <p className="text-lg font-bold text-indigo-400">
                      {matchResult.text_similarity_score.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Skills Match Ratio</span>
                    <p className="text-lg font-bold text-emerald-400">
                      {matchResult.skills_match_score.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase">Shared Keywords</span>
                    <p className="text-lg font-bold text-blue-400">
                      {matchResult.keyword_overlap.length} terms
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matching Skills */}
                <div className="bg-slate-900/60 border border-emerald-900/30 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3 text-emerald-400">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Matching Skills ({matchResult.matching_skills.length})</span>
                    </span>
                  </div>
                  {matchResult.matching_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matching_skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No direct skill matches detected in text.</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="bg-slate-900/60 border border-rose-900/30 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3 text-rose-400">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Missing Target Skills ({matchResult.missing_skills.length})</span>
                    </span>
                  </div>
                  {matchResult.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missing_skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400">
                      Great job! All primary requested skills are present in your resume.
                    </p>
                  )}
                </div>
              </div>

              {/* Shared Vocabulary Overlap */}
              {matchResult.keyword_overlap.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    High-Weight Overlapping Keywords (TF-IDF)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.keyword_overlap.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant Experience & Projects Evidence */}
              {(matchResult.relevant_experience_matches.length > 0 ||
                matchResult.relevant_project_matches.length > 0) && (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Supporting Resume Evidence
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {matchResult.relevant_experience_matches.map((exp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                    {matchResult.relevant_project_matches.map((proj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
