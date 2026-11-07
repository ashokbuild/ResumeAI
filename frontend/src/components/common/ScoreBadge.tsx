import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label,
  size = 'md',
  showPercentage = true,
}) => {
  const getColorClasses = (val: number) => {
    if (val >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (val >= 70) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    if (val >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-lg font-bold px-3.5 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center space-x-1.5 rounded-full border font-semibold ${getColorClasses(
        score
      )} ${sizeClasses[size]}`}
    >
      <span>
        {Math.round(score)}
        {showPercentage ? '%' : ''}
      </span>
      {label && <span className="opacity-80 font-normal text-[0.85em]">({label})</span>}
    </div>
  );
};

