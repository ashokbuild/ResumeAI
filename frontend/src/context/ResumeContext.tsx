import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AIResumeAnalysis,
  ATSReadinessResult,
  ExtractedResumeData,
  JobMatchResult,
} from '../types';
import { resumeService } from '../services/resumeService';

interface ResumeContextType {
  uploadedFile: File | null;
  resumeData: ExtractedResumeData | null;
  analysis: AIResumeAnalysis | null;
  atsResult: ATSReadinessResult | null;
  matchResult: JobMatchResult | null;
  isAnalyzing: boolean;
  isMatching: boolean;
  isDownloadingReport: boolean;
  error: string | null;
  targetRole: string;
  jobDescription: string;
  setTargetRole: (role: string) => void;
  setJobDescription: (jd: string) => void;
  uploadAndAnalyze: (file: File, role?: string) => Promise<void>;
  runJobMatch: (jd: string, role?: string) => Promise<void>;
  runATSCheck: () => Promise<void>;
  downloadPdfReport: () => Promise<void>;
  clearResume: () => void;
  loadSamplePreview: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ExtractedResumeData | null>(null);
  const [analysis, setAnalysis] = useState<AIResumeAnalysis | null>(null);
  const [atsResult, setAtsResult] = useState<ATSReadinessResult | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState<string>('');

  const uploadAndAnalyze = async (file: File, role?: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setUploadedFile(file);

      const activeRole = role || targetRole;
      const response = await resumeService.analyzeResume(file, activeRole);

      setResumeData(response.extracted_data);
      setAnalysis(response);

      try {
        const ats = await resumeService.checkATS(response.extracted_data);
        setAtsResult(ats);
      } catch (atsErr) {
        console.warn('ATS check failed:', atsErr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runJobMatch = async (jd: string, role?: string) => {
    if (!jd.trim()) {
      setError('Please provide a job description to calculate match score.');
      return;
    }
    try {
      setIsMatching(true);
      setError(null);
      setJobDescription(jd);

      const roleName = role || targetRole;
      const result = await resumeService.matchJob(jd, resumeData || undefined, roleName);
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to match job description.');
      throw err;
    } finally {
      setIsMatching(false);
    }
  };

  const runATSCheck = async () => {
    if (!resumeData) return;
    try {
      const ats = await resumeService.checkATS(resumeData);
      setAtsResult(ats);
    } catch (err: any) {
      setError(err.message || 'Failed to re-run ATS check.');
    }
  };

  const downloadPdfReport = async () => {
    if (!resumeData || !analysis || !atsResult) {
      setError('Complete resume analysis is required before generating the PDF report.');
      return;
    }
    try {
      setIsDownloadingReport(true);
      setError(null);
      await resumeService.downloadReport(
        resumeData,
        analysis,
        atsResult,
        matchResult || undefined,
        targetRole
      );
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF report.');
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const clearResume = () => {
    setUploadedFile(null);
    setResumeData(null);
    setAnalysis(null);
    setAtsResult(null);
    setMatchResult(null);
    setError(null);
    setJobDescription('');
  };

  const loadSamplePreview = () => {
    const sampleResume: ExtractedResumeData = {
      filename: 'alex_chen_senior_software_engineer.pdf',
      file_size_kb: 48.5,
      page_count: 1,
      contact: {
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexchen-dev',
        github: 'github.com/alexchen',
        portfolio: 'alexchen.dev',
      },
      summary:
        'Product-oriented Senior Full Stack Engineer with 5+ years of experience architecting distributed backend services and high-performance React web applications. Proven track record of scaling microservices to 10M+ daily requests and leading cross-functional teams in agile environments.',
      technical_skills: [
        'Python',
        'TypeScript',
        'React',
        'FastAPI',
        'Node.js',
        'Docker',
        'Kubernetes',
        'PostgreSQL',
        'Redis',
        'AWS',
        'GraphQL',
        'Tailwind',
      ],
      soft_skills: ['Leadership', 'Mentorship', 'Agile Mindset', 'Cross-Functional Collaboration'],
      work_experience: [
        {
          company: 'CloudScale Technologies',
          role: 'Senior Software Engineer',
          start_date: '2022',
          end_date: 'Present',
          is_current: true,
          location: 'San Francisco, CA',
          highlights: [
            'Architected distributed microservices handling 12M+ daily requests using FastAPI, Kafka, and Redis, decreasing p99 latency by 38%.',
            'Spearheaded transition from legacy monolith to cloud-native ECS services, reducing AWS compute expenses by $45,000 annually.',
            'Mentored 4 junior engineers on clean code practices, testing methodologies, and asynchronous system design.',
          ],
        },
        {
          company: 'Apex Digital Labs',
          role: 'Full Stack Engineer',
          start_date: '2020',
          end_date: '2022',
          is_current: false,
          location: 'San Jose, CA',
          highlights: [
            'Engineered customer onboarding portal in React and TypeScript, boosting conversion velocity by 24%.',
            'Implemented automated CI/CD pipeline in GitHub Actions, slashing release deployment cycles from 2 hours to 14 minutes.',
          ],
        },
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. Computer Science',
          field_of_study: 'Computer Science',
          end_date: '2020',
          gpa: '3.82',
        },
      ],
      projects: [
        {
          title: 'PulseTelemetry Analytics Platform',
          description: 'Real-time metrics aggregator and anomaly detection dashboard.',
          technologies: ['FastAPI', 'React', 'TimescaleDB', 'Docker'],
          highlights: [
            'Processed 50k events/sec with sub-second dashboard refreshes using WebSocket streaming.',
            'Implemented custom time-series alerting engine with automated Slack notifications.',
          ],
          link: 'https://github.com/alexchen/pulse-telemetry',
        },
      ],
      certifications: ['AWS Certified Solutions Architect – Associate'],
      achievements: ['1st Place – Silicon Valley Hackathon 2023'],
      raw_text: 'Sample Resume Content for Alex Chen...',
    };

    const sampleAnalysis: AIResumeAnalysis = {
      quality_score: {
        overall_score: 87.5,
        rating_label: 'Strong',
        summary_assessment:
          'Your resume demonstrates strong technical depth, clear quantification of business results, and modern cloud architecture competencies.',
        disclaimer:
          'Resume Quality Score is a transparent heuristic calculation based on content depth, structure, and presentation.',
        breakdown: {
          skills_relevance: {
            name: 'Skills Relevance & Clarity',
            score: 92.0,
            weight: 0.3,
            weighted_score: 27.6,
            strengths: ['Identified 12 high-demand modern technologies', 'Includes cloud & container tooling'],
            weaknesses: ['Could specify deeper cloud security certifications'],
            missing_elements: [],
            feedback: 'Strong alignment with modern full-stack stack expectations.',
          },
          experience_quality: {
            name: 'Experience Quality',
            score: 88.0,
            weight: 0.25,
            weighted_score: 22.0,
            strengths: ['Decisive action verbs (Architected, Spearheaded, Engineered)', 'Strong quantitative metrics (38%, $45k, 24%)'],
            weaknesses: ['Add more context on team size and business stakeholders'],
            missing_elements: [],
            feedback: 'Experience bullets adhere closely to high-impact accomplishment standards.',
          },
          project_quality: {
            name: 'Project Quality',
            score: 85.0,
            weight: 0.2,
            weighted_score: 17.0,
            strengths: ['Includes live telemetry project with clear tech stack'],
            weaknesses: ['Include user volume or open source traction'],
            missing_elements: [],
            feedback: 'Technical project validates distributed systems problem solving.',
          },
          education_certifications: {
            name: 'Education & Certifications',
            score: 90.0,
            weight: 0.1,
            weighted_score: 9.0,
            strengths: ['Top-tier CS degree from UC Berkeley', 'Active AWS Certified Architect credential'],
            weaknesses: [],
            missing_elements: [],
            feedback: 'Formal academic background and industry credentials verified.',
          },
          resume_structure: {
            name: 'Resume Structure',
            score: 90.0,
            weight: 0.1,
            weighted_score: 9.0,
            strengths: ['Perfect 1-page length', 'All contact profiles linked', 'Crisp executive summary'],
            weaknesses: [],
            missing_elements: [],
            feedback: 'Excellent typography and whitespace hierarchy.',
          },
          keyword_coverage: {
            name: 'Keyword Coverage',
            score: 82.0,
            weight: 0.05,
            weighted_score: 4.1,
            strengths: ['Dense keyword coverage in distributed systems and cloud infra'],
            weaknesses: [],
            missing_elements: [],
            feedback: 'Broad vocabulary across backend and frontend domains.',
          },
        },
      },
      executive_summary:
        'Alex Chen is a high-impact Senior Full Stack Engineer with demonstrated success scaling microservice throughput, cutting infrastructure overhead, and mentoring teams.',
      key_strengths: [
        'High impact quantification (e.g. 38% latency drop, $45K savings)',
        'Modern, highly sought-after stack: FastAPI, React, Docker, Kubernetes, AWS',
        'Strong academic foundation and active AWS Solutions Architect certification',
      ],
      critical_weaknesses: [
        'Could include explicit mention of automated testing coverage metrics (e.g. 90% unit test coverage)',
        'Further highlight cross-functional product discovery and stakeholder roadmap influence',
      ],
      suggested_summary_rewrite:
        'Senior Full Stack Engineer with 5+ years of experience building resilient distributed systems and responsive React web applications. Proven track record of cutting API latency by 38% and driving $45K in cloud cost savings across high-scale microservices.',
      bullet_rewrites: [
        {
          original: 'Implemented automated CI/CD pipeline in GitHub Actions, slashing release deployment cycles from 2 hours to 14 minutes.',
          suggested:
            'Architected end-to-end GitHub Actions CI/CD automation with integrated security scanning, accelerating production release velocity by 88% (2 hrs to 14 mins).',
          rationale: 'Clarifies architecture ownership and calculates dramatic percentage velocity gain.',
          section: 'Experience',
          needs_user_verification: true,
        },
      ],
      project_evaluations: [
        {
          project_title: 'PulseTelemetry Analytics Platform',
          relevance_score: 90.0,
          strengths: ['Excellent real-time streaming architecture', 'Explicit stack listed (FastAPI, React, TimescaleDB)'],
          weaknesses: ['Add benchmarks for peak write load under stress'],
          technologies_detected: ['FastAPI', 'React', 'TimescaleDB', 'Docker'],
          feedback: 'Outstanding showcase of real-time systems programming.',
        },
      ],
      experience_evaluations: [
        {
          role: 'Senior Software Engineer',
          company: 'CloudScale Technologies',
          action_verbs_score: 92.0,
          quantification_score: 88.0,
          relevance_score: 95.0,
          strengths: ['Every bullet begins with a powerful action verb', 'Definitive dollar and percentage outcomes'],
          weaknesses: ['None of note; exceptionally well written'],
          feedback: 'High-caliber senior engineering experience presentation.',
        },
      ],
      recommendations: [
        {
          id: 'rec-1',
          priority: 'high',
          category: 'Testing & Quality',
          title: 'Document Unit & Integration Test Coverage KPIs',
          explanation: 'Engineering managers look for disciplined automated testing practices.',
          why_it_matters: 'Demonstrates software reliability and production diligence.',
          relevant_section: 'Experience',
          suggested_action: 'Add mention of pytest, Jest/Cypress, or CI test coverage percentages.',
          example_rewrite: 'Maintained 92% automated test coverage across 40+ microservices utilizing Pytest and Playwright.',
        },
      ],
    };

    const sampleATS: ATSReadinessResult = {
      ats_score: 92.0,
      status: 'Highly Optimized',
      readiness_summary:
        'Your resume demonstrates exceptional parsing compatibility. Standard headings, clean single-column structure, and accessible contact data ensure flawless ingestion across modern ATS systems.',
      sections_checked: [
        {
          section_name: 'Contact Information',
          detected: true,
          status: 'optimized',
          findings: ['Email, Phone, Location, LinkedIn, and GitHub successfully isolated'],
          suggestions: [],
        },
        {
          section_name: 'Professional Summary',
          detected: true,
          status: 'optimized',
          findings: ['Clear executive profile positioned at top'],
          suggestions: [],
        },
        {
          section_name: 'Skills Section',
          detected: true,
          status: 'optimized',
          findings: ['12 industry-standard tech keywords parsed cleanly'],
          suggestions: [],
        },
        {
          section_name: 'Work Experience',
          detected: true,
          status: 'optimized',
          findings: ['Standard chronological order with clear titles and dates'],
          suggestions: [],
        },
        {
          section_name: 'Education',
          detected: true,
          status: 'optimized',
          findings: ['Degree, institution, and graduation year isolated'],
          suggestions: [],
        },
        {
          section_name: 'Projects',
          detected: true,
          status: 'optimized',
          findings: ['Distinct project section with technologies detected'],
          suggestions: [],
        },
      ],
      missing_sections: [],
      formatting_warnings: [],
      parser_friendliness_score: 95.0,
      recommendations: ['Maintain this clean single-column format for all ATS job applications.'],
      disclaimer:
        'This heuristic ATS-readiness evaluation simulates standard parsing rules and keyword detection.',
    };

    setUploadedFile(new File(['sample'], 'alex_chen_senior_software_engineer.pdf', { type: 'application/pdf' }));
    setResumeData(sampleResume);
    setAnalysis(sampleAnalysis);
    setAtsResult(sampleATS);
    setError(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        uploadedFile,
        resumeData,
        analysis,
        atsResult,
        matchResult,
        isAnalyzing,
        isMatching,
        isDownloadingReport,
        error,
        targetRole,
        jobDescription,
        setTargetRole,
        setJobDescription,
        uploadAndAnalyze,
        runJobMatch,
        runATSCheck,
        downloadPdfReport,
        clearResume,
        loadSamplePreview,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
