from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from backend.app.schemas.analysis import AIResumeAnalysis
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.extraction_service import extraction_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.pdf_service import pdf_service
from backend.app.utils.validators import sanitize_filename, validate_pdf_upload

router = APIRouter()


class AnalyzeResumeResponse(AIResumeAnalysis):
    extracted_data: ExtractedResumeData


@router.post("/analyze", response_model=AnalyzeResumeResponse, tags=["Resume Analysis"])
async def analyze_resume_endpoint(
    file: UploadFile = File(..., description="PDF resume file to analyze"),
    target_role: Optional[str] = Form(None, description="Optional target job title to tailor analysis"),
):
    """
    Uploads a PDF resume, extracts structured information, evaluates ATS and quality metrics,
    and returns comprehensive AI-powered career feedback.
    """
    safe_filename = sanitize_filename(file.filename or "resume.pdf")
    pdf_bytes = await validate_pdf_upload(file)

    # Extract text using PyMuPDF
    raw_text, page_texts, page_count = pdf_service.extract_text_from_bytes(
        pdf_bytes=pdf_bytes,
        filename=safe_filename,
    )

    # Structure extracted information
    extracted_data = extraction_service.extract_structure(
        raw_text=raw_text,
        filename=safe_filename,
        file_size_bytes=len(pdf_bytes),
        page_count=page_count,
    )

    # AI Analysis
    analysis = await gemini_service.analyze_resume(
        resume=extracted_data,
        target_role=target_role,
    )

    return AnalyzeResumeResponse(
        **analysis.model_dump(),
        extracted_data=extracted_data,
    )

