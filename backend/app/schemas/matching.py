from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.resume import ExtractedResumeData


class JobMatchRequest(BaseModel):
    job_title: Optional[str] = "Target Role"
    job_description: str = Field(min_length=10, description="The job description text to compare against.")
    resume_data: Optional[ExtractedResumeData] = None


class SkillAnalysisItem(BaseModel):
    name: str
    status: str  # "matched" | "missing" | "related" | "requires_confirmation"
    importance: str  # "critical" | "preferred" | "nice_to_have"
    why_it_matters: str
    job_evidence: str
    resume_evidence: Optional[str] = None
    learning_recommendation: Optional[str] = None


class JobMatchResult(BaseModel):
    match_score: float = Field(ge=0, le=100)
    text_similarity_score: float = Field(ge=0, le=100)
    skills_match_score: float = Field(ge=0, le=100)
    matching_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    related_skills: List[str] = Field(default_factory=list)
    skills_requiring_confirmation: List[str] = Field(default_factory=list)
    detailed_skill_gap: List[SkillAnalysisItem] = Field(default_factory=list)
    relevant_experience_matches: List[str] = Field(default_factory=list)
    relevant_project_matches: List[str] = Field(default_factory=list)
    keyword_overlap: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    disclaimer: str = (
        "Job Match Score is computed using Scikit-learn TF-IDF vectorization and cosine similarity heuristics. "
        "It evaluates textual overlap and keyword alignment, not a scientifically validated hiring probability."
    )

