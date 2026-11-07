from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from backend.app.core.exceptions import ResumeAIException
from backend.app.schemas.matching import JobMatchRequest, JobMatchResult
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.extraction_service import extraction_service
from backend.app.services.matching_service import matching_service
from backend.app.services.pdf_service import pdf_service
from backend.app.utils.validators import sanitize_filename, validate_pdf_upload

router = APIRouter()


@router.post("/match", response_model=JobMatchResult, tags=["Job Matching"])
async def match_resume_to_job_endpoint(payload: JobMatchRequest):
    """
    Evaluates compatibility between a pre-extracted resume data object and a job description.
    """
    if not payload.job_description.strip():
        raise ResumeAIException(
            message="Please provide a valid job description to perform matching.",
            status_code=400,
            code="MISSING_INPUTS",
        )

    resume_data = payload.resume_data or ExtractedResumeData(
        filename="unspecified.pdf",
        file_size_kb=0,
        page_count=0,
        raw_text="",
    )

    return matching_service.match_resume_to_job(
        resume=resume_data,
        job_description=payload.job_description,
        job_title=payload.job_title or "Target Role",
    )


@router.post("/match-file", response_model=JobMatchResult, tags=["Job Matching"])
async def match_resume_file_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    job_title: Optional[str] = Form("Target Role"),
):
    """
    Evaluates compatibility by uploading a PDF resume directly with a job description.
    """
    safe_filename = sanitize_filename(file.filename or "resume.pdf")
    pdf_bytes = await validate_pdf_upload(file)
    raw_text, _, page_count = pdf_service.extract_text_from_bytes(pdf_bytes, safe_filename)
    resume_data = extraction_service.extract_structure(raw_text, safe_filename, len(pdf_bytes), page_count)

    return matching_service.match_resume_to_job(
        resume=resume_data,
        job_description=job_description,
        job_title=job_title or "Target Role",
    )
