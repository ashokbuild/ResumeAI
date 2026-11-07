from backend.app.schemas.resume import ContactInfo, ExtractedResumeData
from backend.app.services.scoring_service import scoring_service


def test_complete_resume_scoring(sample_resume_data: ExtractedResumeData):
    result = scoring_service.calculate_quality_score(sample_resume_data)
    assert 0.0 <= result.overall_score <= 100.0
    assert result.overall_score >= 70.0
    assert result.rating_label in ["Strong", "Exceptional", "Competitive"]

    b = result.breakdown
    assert b.skills_relevance.weight == 0.30
    assert b.experience_quality.weight == 0.25
    assert b.project_quality.weight == 0.20
    assert b.education_certifications.weight == 0.10
    assert b.resume_structure.weight == 0.10
    assert b.keyword_coverage.weight == 0.05

    # Check sum of weighted scores matches overall
    calculated_sum = (
        b.skills_relevance.weighted_score
        + b.experience_quality.weighted_score
        + b.project_quality.weighted_score
        + b.education_certifications.weighted_score
        + b.resume_structure.weighted_score
        + b.keyword_coverage.weighted_score
    )
    assert abs(round(calculated_sum, 1) - result.overall_score) <= 0.5


def test_sparse_resume_scoring():
    sparse_resume = ExtractedResumeData(
        filename="empty.pdf",
        file_size_kb=10.0,
        page_count=1,
        contact=ContactInfo(),
        technical_skills=[],
        soft_skills=[],
        work_experience=[],
        education=[],
        projects=[],
        certifications=[],
        achievements=[],
        raw_text="Random incomplete notes without real sections.",
    )
    result = scoring_service.calculate_quality_score(sparse_resume)
    assert result.overall_score < 45.0
    assert result.rating_label == "Needs Significant Work"
    assert len(result.breakdown.skills_relevance.missing_elements) > 0
    assert len(result.breakdown.experience_quality.missing_elements) > 0
