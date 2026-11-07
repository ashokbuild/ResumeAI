from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.recommendations import RecommendationItem


class CategoryScore(BaseModel):
    name: str
    score: float = Field(ge=0, le=100)
    weight: float  # e.g., 0.30
    weighted_score: float
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_elements: List[str] = Field(default_factory=list)
    feedback: str


class QualityScoreBreakdown(BaseModel):
    skills_relevance: CategoryScore
    experience_quality: CategoryScore
    project_quality: CategoryScore
    education_certifications: CategoryScore
    resume_structure: CategoryScore
    keyword_coverage: CategoryScore


class BulletPointRewrite(BaseModel):
    original: str
    suggested: str
    rationale: str
    section: str = "Experience"
    needs_user_verification: bool = True


class ProjectEvaluation(BaseModel):
    project_title: str
    relevance_score: float = Field(ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    technologies_detected: List[str] = Field(default_factory=list)
    feedback: str


class ExperienceEvaluation(BaseModel):
    role: str
    company: str
    action_verbs_score: float = Field(ge=0, le=100)
    quantification_score: float = Field(ge=0, le=100)
    relevance_score: float = Field(ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    feedback: str


class OverallResumeQuality(BaseModel):
    overall_score: float = Field(ge=0, le=100)
    rating_label: str  # "Needs Significant Work" | "Developing" | "Competitive" | "Strong" | "Exceptional"
    summary_assessment: str
    breakdown: QualityScoreBreakdown
    disclaimer: str = (
        "Resume Quality Score is a transparent heuristic calculation based on content depth, structure, "
        "and presentation, not a scientific hiring predictor."
    )


class AIResumeAnalysis(BaseModel):
    quality_score: OverallResumeQuality
    executive_summary: str
    key_strengths: List[str] = Field(default_factory=list)
    critical_weaknesses: List[str] = Field(default_factory=list)
    suggested_summary_rewrite: Optional[str] = None
    bullet_rewrites: List[BulletPointRewrite] = Field(default_factory=list)
    project_evaluations: List[ProjectEvaluation] = Field(default_factory=list)
    experience_evaluations: List[ExperienceEvaluation] = Field(default_factory=list)
    recommendations: List[RecommendationItem] = Field(default_factory=list)

