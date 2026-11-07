import io
import pytest
from backend.app.core.exceptions import FileTooLargeError, InvalidPDFError, PDFExtractionError
from backend.app.services.extraction_service import extraction_service
from backend.app.services.pdf_service import pdf_service
from backend.app.utils.validators import sanitize_filename


def test_sanitize_filename():
    assert sanitize_filename("../../etc/passwd.pdf") == "passwd.pdf"
    assert sanitize_filename("my resume.pdf") == "my resume.pdf"
    assert sanitize_filename("malicious\x00file.exe") == "malicious_file.exe.pdf"


def test_valid_pdf_extraction(sample_pdf_bytes: bytes):
    full_text, page_texts, page_count = pdf_service.extract_text_from_bytes(sample_pdf_bytes)
    assert page_count >= 1
    assert "Jane Doe" in full_text
    assert "FastAPI" in full_text
    assert "Senior Software Engineer" in full_text


def test_empty_pdf_rejection(empty_pdf_bytes: bytes):
    with pytest.raises(InvalidPDFError):
        pdf_service.extract_text_from_bytes(empty_pdf_bytes)


def test_corrupted_pdf_rejection(corrupted_pdf_bytes: bytes):
    with pytest.raises(InvalidPDFError):
        pdf_service.extract_text_from_bytes(corrupted_pdf_bytes)


def test_blank_page_pdf_rejection(blank_page_pdf_bytes: bytes):
    with pytest.raises(PDFExtractionError):
        pdf_service.extract_text_from_bytes(blank_page_pdf_bytes)


def test_structured_extraction(sample_pdf_bytes: bytes):
    full_text, _, page_count = pdf_service.extract_text_from_bytes(sample_pdf_bytes)
    structured = extraction_service.extract_structure(
        raw_text=full_text,
        filename="resume.pdf",
        file_size_bytes=len(sample_pdf_bytes),
        page_count=page_count,
    )
    assert structured.contact.name == "Jane Doe"
    assert structured.contact.email == "jane.doe@example.com"
    assert "FastAPI" in [s.title() for s in structured.technical_skills] or any(
        "fastapi" in s.lower() for s in structured.technical_skills
    )
    assert len(structured.work_experience) >= 1
    assert len(structured.education) >= 1

