from typing import List, Optional
from pydantic import BaseModel, Field


class ATSSectionCheck(BaseModel):
    section_name: str
    detected: bool
    status: str  # "optimized" | "warning" | "missing"
    findings: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class ATSReadinessResult(BaseModel):
    ats_score: float = Field(ge=0, le=100)
    status: str  # "High Risk" | "Moderate Risk" | "ATS Friendly" | "Highly Optimized"
    readiness_summary: str
    sections_checked: List[ATSSectionCheck] = Field(default_factory=list)
    missing_sections: List[str] = Field(default_factory=list)
    formatting_warnings: List[str] = Field(default_factory=list)
    parser_friendliness_score: float = Field(ge=0, le=100)
    recommendations: List[str] = Field(default_factory=list)
    disclaimer: str = (
        "This heuristic ATS-readiness evaluation simulates standard parsing rules and keyword detection. "
        "It does not guarantee pass/fail results on proprietary commercial ATS algorithms."
    )

