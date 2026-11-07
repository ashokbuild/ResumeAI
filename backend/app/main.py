import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.api.routes import ats, health, matching, reports, resume
from backend.app.core.config import settings
from backend.app.core.exceptions import ResumeAIException, resume_exception_handler

# Logging configuration
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("resumeai.main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ResumeAI: AI-Powered Resume Intelligence & Job Matching Platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handler
app.add_exception_handler(ResumeAIException, resume_exception_handler)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error at {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing your request. Please try again.",
            }
        },
    )


# Mount API routes
app.include_router(health.router, prefix="/api/v1")
app.include_router(resume.router, prefix="/api/v1/resume")
app.include_router(matching.router, prefix="/api/v1/resume")
app.include_router(ats.router, prefix="/api/v1/resume")
app.include_router(reports.router, prefix="/api/v1/report")


@app.get("/", tags=["Root"])
async def root():
    return {
        "product": "ResumeAI",
        "tagline": "Your Resume. Decoded. Optimized. Career-Ready.",
        "status": "online",
        "docs": "/docs",
    }

