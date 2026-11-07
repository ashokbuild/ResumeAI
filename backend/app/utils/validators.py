import os
import re
from fastapi import UploadFile
from backend.app.core.config import settings
from backend.app.core.exceptions import FileTooLargeError, InvalidPDFError


def sanitize_filename(filename: str) -> str:
    """Sanitize the uploaded filename to prevent directory traversal and invalid chars."""
    if not filename:
        return "resume.pdf"
    # Strip paths
    basename = os.path.basename(filename)
    # Remove null bytes and non-printable characters
    cleaned = re.sub(r"[^\w\s\.-]", "_", basename)
    # Ensure it ends with .pdf
    if not cleaned.lower().endswith(".pdf"):
        cleaned = f"{cleaned}.pdf"
    return cleaned[:100]


async def validate_pdf_upload(file: UploadFile) -> bytes:
    """Validate PDF file size, extension, and magic bytes. Returns file contents."""
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise InvalidPDFError(f"Unsupported file format '{filename}'. Only PDF files are accepted.")

    contents = await file.read()
    file_size = len(contents)

    if file_size == 0:
        raise InvalidPDFError("The uploaded PDF file is empty (0 bytes).")

    if file_size > settings.max_upload_size_bytes:
        raise FileTooLargeError(max_mb=settings.MAX_UPLOAD_SIZE_MB)

    # Check PDF magic bytes (%PDF-)
    if not contents.startswith(b"%PDF-"):
        raise InvalidPDFError(
            "The uploaded file is not a valid PDF document. Header signature verification failed."
        )

    return contents

