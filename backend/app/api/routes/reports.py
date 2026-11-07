from typing import Optional
from fastapi import APIRouter, Response
from pydantic import BaseModel
from backend.app.schemas.analysis import AIResumeAnalysis
from backend.app.schemas.ats import ATSReadinessResult
from backend.app.schemas.matching import JobMatchResult
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.report_service import report_service

router = APIRouter()


class GenerateReportRequest(BaseModel):
    resume_data: ExtractedResumeData
    analysis: AIResumeAnalysis
    ats_result: ATSReadinessResult
    match_result: Optional[JobMatchResult] = None
    job_title: Optional[str] = "Target Opportunity"


@router.post("/generate", tags=["Report Generation"])
async def generate_pdf_report_endpoint(request: GenerateReportRequest):
    """
    Generates and downloads a branded, publication-ready PDF evaluation report.
    """
    pdf_bytes = report_service.generate_report(
        resume_data=request.resume_data,
        analysis=request.analysis,
        ats_result=request.ats_result,
        match_result=request.match_result,
        job_title=request.job_title,
    )

    filename = f"ResumeAI_Report_{request.resume_data.contact.name or 'Candidate'}.pdf".replace(" ", "_")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )

