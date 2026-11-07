import pytest
from fastapi.testclient import TestClient
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.ats_service import ats_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.report_service import report_service


@pytest.mark.asyncio
async def test_report_service_pdf_generation(sample_resume_data: ExtractedResumeData):
    analysis = await gemini_service.analyze_resume(sample_resume_data)
    ats_result = ats_service.evaluate_ats_readiness(sample_resume_data)

    pdf_bytes = report_service.generate_report(
        resume_data=sample_resume_data,
        analysis=analysis,
        ats_result=ats_result,
        job_title="Lead Cloud Engineer",
    )

    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF-")


@pytest.mark.asyncio
async def test_api_report_endpoint(client: TestClient, sample_resume_data: ExtractedResumeData):
    analysis = await gemini_service.analyze_resume(sample_resume_data)
    ats_result = ats_service.evaluate_ats_readiness(sample_resume_data)

    payload = {
        "resume_data": sample_resume_data.model_dump(),
        "analysis": analysis.model_dump(),
        "ats_result": ats_result.model_dump(),
        "job_title": "Full Stack Engineer",
    }

    response = client.post("/api/v1/report/generate", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-")
