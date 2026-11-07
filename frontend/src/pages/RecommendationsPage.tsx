import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const RecommendationsPage: React.FC = () => {
  const { resumeData, analysis } = useResume();
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'optional'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!resumeData || !analysis) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
          <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Recommendations Yet</h2>
          <p className="text-sm text-slate-400 mb-6">
            Upload your resume or activate the demo preview from the dashboard to view prioritized career actions.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allRecs = analysis.recommendations;
  const filteredRecs = allRecs.filter((r) => {
    if (priorityFilter === 'all') return true;
    return r.priority.toLowerCase() === priorityFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Prioritized Improvement Recommendations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted enhancements to convert resume screening passes into top-tier interview callbacks.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              priorityFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({allRecs.length})
          </button>
          <button
            onClick={() => setPriorityFilter('high')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              priorityFilter === 'high'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Priority ({allRecs.filter((r) => r.priority === 'high').length})
          </button>
          <button
            onClick={() => setPriorityFilter('medium')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              priorityFilter === 'medium'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Medium ({allRecs.filter((r) => r.priority === 'medium').length})
          </button>
          <button
            onClick={() => setPriorityFilter('optional')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              priorityFilter === 'optional'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Optional ({allRecs.filter((r) => r.priority === 'optional').length})
          </button>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {filteredRecs.map((rec) => {
          const isHigh = rec.priority === 'high';
          const isMed = rec.priority === 'medium';

          return (
            <div
              key={rec.id}
              className={`bg-slate-900/60 border rounded-2xl p-6 transition-all ${
                isHigh
                  ? 'border-rose-900/30'
                  : isMed
                  ? 'border-amber-900/30'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : isMed
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Section: {rec.relevant_section}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Category: {rec.category}</span>
              </div>

              <h2 className="text-base font-bold text-white mb-2">{rec.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{rec.explanation}</p>

              {/* Why It Matters */}
              <div className="mb-4 bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Why this matters:
                </span>
                <p className="text-xs text-slate-300">{rec.why_it_matters}</p>
              </div>

              {/* Suggested Action */}
              <div className="mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
                  Actionable Next Step:
                </span>
                <p className="text-xs text-slate-200">{rec.suggested_action}</p>
              </div>

              {/* Example Rewrite with Copy Action */}
              {rec.example_rewrite && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                      Suggested Template / Rewrite:
                    </span>
                    <button
                      onClick={() => handleCopy(rec.example_rewrite!, rec.id)}
                      className="flex items-center space-x-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all"
                    >
                      {copiedId === rec.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-100 font-medium font-mono leading-relaxed">
                    {rec.example_rewrite}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
