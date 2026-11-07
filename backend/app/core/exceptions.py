from typing import Any, Optional
from fastapi import Request
from fastapi.responses import JSONResponse


class ResumeAIException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 400,
        code: str = "BAD_REQUEST",
        details: Optional[Any] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details


class InvalidPDFError(ResumeAIException):
    def __init__(self, message: str = "Invalid or corrupted PDF file", details: Optional[Any] = None):
        super().__init__(message=message, status_code=400, code="INVALID_PDF", details=details)


class FileTooLargeError(ResumeAIException):
    def __init__(self, max_mb: int = 10):
        super().__init__(
            message=f"Uploaded file exceeds the maximum allowed size of {max_mb}MB",
            status_code=413,
            code="FILE_TOO_LARGE",
        )


class PDFExtractionError(ResumeAIException):
    def __init__(self, message: str = "Could not extract text from the PDF", details: Optional[Any] = None):
        super().__init__(message=message, status_code=422, code="EXTRACTION_FAILED", details=details)


class GeminiAPIError(ResumeAIException):
    def __init__(self, message: str = "AI analysis service is temporarily unavailable", details: Optional[Any] = None):
        super().__init__(message=message, status_code=502, code="AI_SERVICE_ERROR", details=details)


async def resume_exception_handler(request: Request, exc: ResumeAIException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )

