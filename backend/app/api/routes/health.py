from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    """Returns application status, version, and active service configurations."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "model": settings.GEMINI_MODEL,
        "max_upload_size_mb": settings.MAX_UPLOAD_SIZE_MB,
    }

