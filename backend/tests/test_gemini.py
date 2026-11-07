import pytest
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.gemini_service import gemini_service


@pytest.mark.asyncio
async def test_gemini_service_fallback_analysis(sample_resume_data: ExtractedResumeData):
    # Tests deterministic analysis when GEMINI_API_KEY is not set
    analysis = await gemini_service.analyze_resume(sample_resume_data)

    assert analysis.quality_score.overall_score > 0
    assert len(analysis.key_strengths) > 0
    assert len(analysis.critical_weaknesses) > 0
    assert len(analysis.bullet_rewrites) > 0
    assert analysis.bullet_rewrites[0].needs_user_verification is True
    assert len(analysis.recommendations) > 0
    assert analysis.suggested_summary_rewrite is not None

