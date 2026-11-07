export interface ContactInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
}

export interface WorkExperience {
  company: string;
  role: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  location?: string | null;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
}

export interface Project {
  title: string;
  description?: string | null;
  technologies: string[];
  highlights: string[];
  link?: string | null;
}

export interface ExtractedResumeData {
  filename: string;
  file_size_kb: number;
  page_count: number;
  contact: ContactInfo;
  summary?: string | null;
  technical_skills: string[];
  soft_skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  achievements: string[];
  raw_text: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  weight: number;
  weighted_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_elements: string[];
  feedback: string;
}

export interface QualityScoreBreakdown {
  skills_relevance: CategoryScore;
  experience_quality: CategoryScore;
  project_quality: CategoryScore;
  education_certifications: CategoryScore;
  resume_structure: CategoryScore;
  keyword_coverage: CategoryScore;
}

export interface OverallResumeQuality {
  overall_score: number;
  rating_label: string;
  summary_assessment: string;
  breakdown: QualityScoreBreakdown;
  disclaimer: string;
}

export interface BulletPointRewrite {
  original: string;
  suggested: string;
  rationale: string;
  section: string;
  needs_user_verification: boolean;
}

export interface ProjectEvaluation {
  project_title: string;
  relevance_score: number;
  strengths: string[];
  weaknesses: string[];
  technologies_detected: string[];
  feedback: string;
}

export interface ExperienceEvaluation {
  role: string;
  company: string;
  action_verbs_score: number;
  quantification_score: number;
  relevance_score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface RecommendationItem {
  id: string;
  priority: 'high' | 'medium' | 'optional' | string;
  category: string;
  title: string;
  explanation: string;
  why_it_matters: string;
  relevant_section: string;
  suggested_action: string;
  example_rewrite?: string | null;
}

export interface AIResumeAnalysis {
  quality_score: OverallResumeQuality;
  executive_summary: string;
  key_strengths: string[];
  critical_weaknesses: string[];
  suggested_summary_rewrite?: string | null;
  bullet_rewrites: BulletPointRewrite[];
  project_evaluations: ProjectEvaluation[];
  experience_evaluations: ExperienceEvaluation[];
  recommendations: RecommendationItem[];
}

export interface AnalyzeResumeResponse extends AIResumeAnalysis {
  extracted_data: ExtractedResumeData;
}

export interface ATSSectionCheck {
  section_name: string;
  detected: boolean;
  status: 'optimized' | 'warning' | 'missing';
  findings: string[];
  suggestions: string[];
}

export interface ATSReadinessResult {
  ats_score: number;
  status: string;
  readiness_summary: string;
  sections_checked: ATSSectionCheck[];
  missing_sections: string[];
  formatting_warnings: string[];
  parser_friendliness_score: number;
  recommendations: string[];
  disclaimer: string;
}

export interface SkillAnalysisItem {
  name: string;
  status: 'matched' | 'missing' | 'related' | 'requires_confirmation';
  importance: 'critical' | 'preferred' | 'nice_to_have' | string;
  why_it_matters: string;
  job_evidence: string;
  resume_evidence?: string | null;
  learning_recommendation?: string | null;
}

export interface JobMatchResult {
  match_score: number;
  text_similarity_score: number;
  skills_match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  related_skills: string[];
  skills_requiring_confirmation: string[];
  detailed_skill_gap: SkillAnalysisItem[];
  relevant_experience_matches: string[];
  relevant_project_matches: string[];
  keyword_overlap: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
  gemini_configured: boolean;
  model: string;
  max_upload_size_mb: number;
}

