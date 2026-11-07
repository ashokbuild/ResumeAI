import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { QualityScoreBreakdown } from '../../types';

interface ScoreRadarChartProps {
  breakdown: QualityScoreBreakdown;
}

export const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ breakdown }) => {
  const data = [
    {
      subject: 'Skills (30%)',
      score: breakdown.skills_relevance.score,
      fullMark: 100,
    },
    {
      subject: 'Experience (25%)',
      score: breakdown.experience_quality.score,
      fullMark: 100,
    },
    {
      subject: 'Projects (20%)',
      score: breakdown.project_quality.score,
      fullMark: 100,
    },
    {
      subject: 'Education (10%)',
      score: breakdown.education_certifications.score,
      fullMark: 100,
    },
    {
      subject: 'Structure (10%)',
      score: breakdown.resume_structure.score,
      fullMark: 100,
    },
    {
      subject: 'Keywords (5%)',
      score: breakdown.keyword_coverage.score,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#818cf8"
            fill="#6366f1"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
