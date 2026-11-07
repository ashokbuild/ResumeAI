import io
from fastapi.testclient import TestClient
from backend.app.schemas.resume import ExtractedResumeData


def test_api_analyze_pdf_upload(client: TestClient, sample_pdf_bytes: bytes):
    response = client.post(
        "/api/v1/resume/analyze",
        files={"file": ("jane_doe_resume.pdf", sample_pdf_bytes, "application/pdf")},
        data={"target_role": "Lead Cloud Architect"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "quality_score" in data
    assert "extracted_data" in data
    assert data["extracted_data"]["contact"]["name"] == "Jane Doe"
    assert data["quality_score"]["overall_score"] > 60.0
    assert len(data["bullet_rewrites"]) > 0


def test_api_analyze_reject_invalid_file(client: TestClient, corrupted_pdf_bytes: bytes):
    response = client.post(
        "/api/v1/resume/analyze",
        files={"file": ("bad_file.pdf", corrupted_pdf_bytes, "application/pdf")},
    )
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "INVALID_PDF"


def test_api_ats_check_endpoint(client: TestClient, sample_pdf_bytes: bytes, sample_resume_data: ExtractedResumeData):
    # Test via PDF file upload
    response = client.post(
        "/api/v1/resume/ats-check-file",
        files={"file": ("jane_doe.pdf", sample_pdf_bytes, "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "ats_score" in data
    assert "sections_checked" in data
    assert data["status"] in ["ATS Friendly", "Highly Optimized"]

    # Test via JSON data
    json_response = client.post(
        "/api/v1/resume/ats-check",
        json=sample_resume_data.model_dump(),
    )
    assert json_response.status_code == 200
    assert json_response.json()["ats_score"] > 60.0


def test_api_job_match_endpoint(client: TestClient, sample_resume_data: ExtractedResumeData):
    jd = """
    We need a Senior Full Stack Engineer experienced with Python, FastAPI, React, Docker, and AWS.
    Must have hands-on experience in building microservices and relational databases.
    """
    payload = {
        "job_title": "Senior Full Stack Engineer",
        "job_description": jd,
        "resume_data": sample_resume_data.model_dump(),
    }
    response = client.post("/api/v1/resume/match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["match_score"] > 50.0
    assert "Python" in data["matching_skills"] or "FastAPI" in data["matching_skills"]
    assert len(data["detailed_skill_gap"]) > 0
