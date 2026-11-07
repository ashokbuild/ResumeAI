import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const SkillsPage: React.FC = () => {
  const { resumeData, matchResult } = useResume();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!resumeData) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
          <Layers className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Skills Data Available</h2>
          <p className="text-sm text-slate-400 mb-6">
            Upload your resume or activate the demo preview from the dashboard to explore the Skill Gap Explorer.
          </p>
        </div>
      </div>
    );
  }

  // Fallback if match hasn't been run yet: display resume skills + common ecosystem competencies
  const skillsToDisplay = matchResult?.detailed_skill_gap || [
    ...resumeData.technical_skills.map((s) => ({
      name: s,
      status: 'matched' as const,
      importance: 'preferred',
      why_it_matters: 'Detected core competency on your resume.',
      job_evidence: 'Documented in candidate skills repository.',
      resume_evidence: `Explicitly listed in your technical competencies: ${s}`,
      learning_recommendation: null,
    })),
  ];

  const filtered = skillsToDisplay.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Skill Gap &amp; Taxonomy Explorer</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify technical proficiencies, semantic synonyms, and verified career learning directions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({skillsToDisplay.length})
          </button>
          <button
            onClick={() => setFilterStatus('matched')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'matched'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matched ({skillsToDisplay.filter((s) => s.status === 'matched').length})
          </button>
          <button
            onClick={() => setFilterStatus('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'missing'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Missing ({skillsToDisplay.filter((s) => s.status === 'missing').length})
          </button>
          <button
            onClick={() => setFilterStatus('related')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'related'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Related ({skillsToDisplay.filter((s) => s.status === 'related').length})
          </button>
        </div>
      </div>

      {/* Guidelines Alert */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white">Professional Integrity Notice</p>
          <p className="text-slate-400 mt-0.5">
            Never list a skill on your resume unless you have genuine hands-on experience with it.
            Use the tailored learning recommendations below to practice core concepts before claiming production proficiency.
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => {
          const isMatched = item.status === 'matched';
          const isMissing = item.status === 'missing';

          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border bg-slate-900/60 transition-all ${
                isMatched
                  ? 'border-emerald-900/30'
                  : isMissing
                  ? 'border-rose-900/30'
                  : 'border-blue-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border ${
                      isMatched
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : isMissing
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {item.importance}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{item.why_it_matters}</p>

              {/* Supporting Evidence */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-[11px]">
                {item.resume_evidence && (
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Resume Evidence:
                    </span>
                    <p className="text-slate-300">{item.resume_evidence}</p>
                  </div>
                )}

                {item.job_evidence && (
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Job Requirement:
                    </span>
                    <p className="text-slate-400 italic">&quot;{item.job_evidence}&quot;</p>
                  </div>
                )}

                {item.learning_recommendation && (
                  <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 mt-2">
                    <span className="font-semibold text-indigo-400 uppercase text-[10px] flex items-center space-x-1 mb-0.5">
                      <BookOpen className="w-3 h-3" />
                      <span>Learning Direction</span>
                    </span>
                    <p className="text-[11px] leading-relaxed">{item.learning_recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
