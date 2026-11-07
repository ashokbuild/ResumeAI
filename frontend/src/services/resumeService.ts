import api from './api';
import type {
  AIResumeAnalysis,
  AnalyzeResumeResponse,
  ATSReadinessResult,
  ExtractedResumeData,
  HealthStatus,
  JobMatchResult,
} from '../types';

export const resumeService = {
  async getHealth(): Promise<HealthStatus> {
    const res = await api.get<HealthStatus>('/health');
    return res.data;
  },

  async analyzeResume(file: File, targetRole?: string): Promise<AnalyzeResumeResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) {
      formData.append('target_role', targetRole);
    }

    const res = await api.post<AnalyzeResumeResponse>('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async checkATS(resumeData: ExtractedResumeData): Promise<ATSReadinessResult> {
    const res = await api.post<ATSReadinessResult>('/resume/ats-check', resumeData);
    return res.data;
  },

  async matchJob(
    jobDescription: string,
    resumeData?: ExtractedResumeData,
    jobTitle?: string
  ): Promise<JobMatchResult> {
    const res = await api.post<JobMatchResult>('/resume/match', {
      job_description: jobDescription,
      resume_data: resumeData,
      job_title: jobTitle || 'Target Role',
    });
    return res.data;
  },

  async downloadReport(
    resumeData: ExtractedResumeData,
    analysis: AIResumeAnalysis,
    atsResult: ATSReadinessResult,
    matchResult?: JobMatchResult,
    jobTitle?: string
  ): Promise<void> {
    const response = await api.post(
      '/report/generate',
      {
        resume_data: resumeData,
        analysis,
        ats_result: atsResult,
        match_result: matchResult,
        job_title: jobTitle || 'Target Opportunity',
      },
      {
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const candidateName = resumeData.contact.name || 'Candidate';
    link.download = `ResumeAI_Report_${candidateName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};
