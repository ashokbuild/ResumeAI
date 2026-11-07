import io
import pytest
from fastapi.testclient import TestClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from backend.app.main import app
from backend.app.schemas.resume import (
    ContactInfo,
    Education,
    ExtractedResumeData,
    Project,
    WorkExperience,
)


@pytest.fixture
def client():
    """FastAPI TestClient fixture."""
    return TestClient(app)


@pytest.fixture
def sample_pdf_bytes():
    """Generates a real, valid in-memory text-based PDF resume using ReportLab."""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    # Name and Contact
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 750, "Jane Doe")
    c.setFont("Helvetica", 10)
    c.drawString(72, 735, "jane.doe@example.com | (555) 123-4567 | San Francisco, CA")
    c.drawString(72, 720, "https://linkedin.com/in/janedoe | https://github.com/janedoe")

    # Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, 695, "Professional Summary")
    c.setFont("Helvetica", 10)
    c.drawString(
        72,
        680,
        "Experienced Full Stack Engineer with 4 years designing high-scale cloud applications in Python, React, and AWS.",
    )

    # Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, 650, "Technical Skills")
    c.setFont("Helvetica", 10)
    c.drawString(
        72,
        635,
        "Python, FastAPI, TypeScript, React, Docker, Kubernetes, AWS, PostgreSQL, Redis, CI/CD, Git",
    )

    # Experience
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, 605, "Work Experience")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(72, 590, "Senior Software Engineer - TechCorp Inc (2021 - Present)")
    c.setFont("Helvetica", 10)
    c.drawString(
        72,
        575,
        "- Architected microservices with FastAPI and Redis, reducing latency by 42%.",
    )
    c.drawString(
        72,
        560,
        "- Spearheaded CI/CD migration to GitHub Actions, accelerating release cycles by 60%.",
    )

    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, 530, "Education")
    c.setFont("Helvetica", 10)
    c.drawString(72, 515, "B.S. Computer Science, University of California (2020)")

    # Projects
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, 485, "Technical Projects")
    c.setFont("Helvetica", 10)
    c.drawString(
        72,
        470,
        "CloudAnalytics Dashboard: Real-time telemetry monitoring tool built with React and FastAPI.",
    )

    c.save()
    return buffer.getvalue()


@pytest.fixture
def empty_pdf_bytes():
    """Generates an empty 0-byte sequence."""
    return b""


@pytest.fixture
def corrupted_pdf_bytes():
    """Generates an invalid non-PDF byte stream."""
    return b"This is not a PDF file header at all."


@pytest.fixture
def blank_page_pdf_bytes():
    """Generates a valid PDF with no extractable text (simulates scanned/empty document)."""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    # Just draw a rectangle with no text
    c.rect(50, 50, 200, 200)
    c.save()
    return buffer.getvalue()


@pytest.fixture
def sample_resume_data():
    """Structured ExtractedResumeData model for unit testing."""
    return ExtractedResumeData(
        filename="test_resume.pdf",
        file_size_kb=35.0,
        page_count=1,
        contact=ContactInfo(
            name="Jane Doe",
            email="jane.doe@example.com",
            phone="+1 555-123-4567",
            location="San Francisco, CA",
            linkedin="https://linkedin.com/in/janedoe",
            github="https://github.com/janedoe",
        ),
        summary="Experienced Full Stack Engineer with 4 years designing high-scale cloud applications in Python, React, and AWS.",
        technical_skills=["Python", "FastAPI", "React", "TypeScript", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis"],
        soft_skills=["Leadership", "Communication", "Problem Solving"],
        work_experience=[
            WorkExperience(
                company="TechCorp Inc",
                role="Senior Software Engineer",
                start_date="2021",
                end_date="Present",
                is_current=True,
                highlights=[
                    "Architected microservices with FastAPI and Redis, reducing latency by 42%.",
                    "Spearheaded CI/CD migration to GitHub Actions, accelerating release cycles by 60%.",
                ],
            )
        ],
        education=[
            Education(
                institution="University of California",
                degree="B.S. Computer Science",
                end_date="2020",
            )
        ],
        projects=[
            Project(
                title="CloudAnalytics Dashboard",
                description="Real-time telemetry monitoring tool.",
                technologies=["FastAPI", "React", "PostgreSQL"],
                highlights=["Processed 10,000 requests per minute with sub-second latency."],
            )
        ],
        certifications=["AWS Certified Solutions Architect"],
        achievements=["Dean's Honor List"],
        raw_text="Jane Doe\njane.doe@example.com\nPython, React, FastAPI, AWS...",
    )

