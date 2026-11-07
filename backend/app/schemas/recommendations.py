from typing import Optional
from pydantic import BaseModel


class RecommendationItem(BaseModel):
    id: str
    priority: str  # "high" | "medium" | "optional"
    category: str  # e.g., "Impact Quantification", "Skills Optimization", "Summary", "Formatting"
    title: str
    explanation: str
    why_it_matters: str
    relevant_section: str
    suggested_action: str
    example_rewrite: Optional[str] = None

