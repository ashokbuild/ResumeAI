import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { MatchingPage } from './pages/MatchingPage';
import { SkillsPage } from './pages/SkillsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';

export const App: React.FC = () => {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page without dashboard shell */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="matching" element={<MatchingPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  );
};

export default App;
