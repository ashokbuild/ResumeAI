from fastapi import APIRouter, File, UploadFile
from backend.app.schemas.ats import ATSReadinessResult
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.services.ats_service import ats_service
from backend.app.services.extraction_service import extraction_service
from backend.app.services.pdf_service import pdf_service
from backend.app.utils.validators import sanitize_filename, validate_pdf_upload

router = APIRouter()


@router.post("/ats-check", response_model=ATSReadinessResult, tags=["ATS Readiness"])
async def ats_check_endpoint(resume_data: ExtractedResumeData):
    """
    Evaluates applicant tracking system (ATS) compatibility for pre-extracted resume data.
    """
    return ats_service.evaluate_ats_readiness(resume_data)


@router.post("/ats-check-file", response_model=ATSReadinessResult, tags=["ATS Readiness"])
async def ats_check_file_endpoint(file: UploadFile = File(...)):
    """
    Evaluates applicant tracking system (ATS) compatibility directly from an uploaded PDF.
    """
    safe_filename = sanitize_filename(file.filename or "resume.pdf")
    pdf_bytes = await validate_pdf_upload(file)
    raw_text, _, page_count = pdf_service.extract_text_from_bytes(pdf_bytes, safe_filename)
    data = extraction_service.extract_structure(raw_text, safe_filename, len(pdf_bytes), page_count)

    return ats_service.evaluate_ats_readiness(data)
