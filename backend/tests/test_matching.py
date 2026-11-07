from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.matching_service import matching_service


def test_job_matching_with_relevant_jd(sample_resume_data: ExtractedResumeData):
    jd = """
    Looking for a Senior Software Engineer with strong Python and FastAPI experience.
    Responsibilities:
    - Build scalable backend APIs using React, Docker, and Kubernetes.
    - Experience with PostgreSQL and AWS cloud deployments is required.
    - Nice to have: Go, GraphQL.
    """
    result = matching_service.match_resume_to_job(
        resume=sample_resume_data,
        job_description=jd,
        job_title="Senior Backend Engineer",
    )

    assert result.match_score > 50.0
    assert result.text_similarity_score > 0.0
    assert "Python" in result.matching_skills or "FastAPI" in result.matching_skills
    assert "Docker" in result.matching_skills
    assert "Go" in result.missing_skills or any("go" in s.lower() for s in result.missing_skills)
    assert len(result.detailed_skill_gap) > 0


def test_job_matching_empty_jd(sample_resume_data: ExtractedResumeData):
    result = matching_service.match_resume_to_job(
        resume=sample_resume_data,
        job_description="",
        job_title="Software Engineer",
    )
    assert result.match_score == 0.0
    assert len(result.recommendations) > 0


def test_synonym_detection():
    from backend.app.utils.text_processing import find_skill_matches

    resume_text = "Experienced in reactjs, postgres, k8s, and python3."
    job_skills = ["React", "PostgreSQL", "Kubernetes", "Python", "Rust"]

    matched, missing, related = find_skill_matches(resume_text, job_skills)
    assert "React" in matched
    assert "PostgreSQL" in matched
    assert "Kubernetes" in matched
    assert "Python" in matched
    assert "Rust" in missing

