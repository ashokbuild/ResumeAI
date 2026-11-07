from backend.app.schemas.resume import ContactInfo, ExtractedResumeData
from backend.app.services.ats_service import ats_service


def test_ats_readiness_complete_resume(sample_resume_data: ExtractedResumeData):
    result = ats_service.evaluate_ats_readiness(sample_resume_data)
    assert 0.0 <= result.ats_score <= 100.0
    assert result.ats_score >= 70.0
    assert result.status in ["ATS Friendly", "Highly Optimized"]
    assert len(result.sections_checked) >= 5
    assert "disclaimer" in result.model_dump()


def test_ats_readiness_missing_contact():
    resume = ExtractedResumeData(
        filename="no_contact.pdf",
        file_size_kb=20.0,
        page_count=1,
        contact=ContactInfo(),  # no email or phone
        technical_skills=["Python"],
        work_experience=[],
        education=[],
        projects=[],
        raw_text="No email here.",
    )
    result = ats_service.evaluate_ats_readiness(resume)
    assert any("Contact" in s.section_name and s.status == "missing" for s in result.sections_checked)
    assert any("Contact" in m for m in result.missing_sections)
