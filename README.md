# ResumeAI 🚀
### AI-Powered Resume Intelligence & Job Matching Platform
*Your Resume. Decoded. Optimized. Career-Ready.*

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0+-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

**ResumeAI** is an AI-powered resume intelligence and career optimization platform designed to transform traditional PDF resumes into actionable engineering insights.

Unlike basic keyword counters or toy prototype projects, ResumeAI combines **Google Gemini 2.5 generative reasoning**, **Scikit-learn TF-IDF vectorization & cosine similarity**, **PyMuPDF text extraction**, and **ReportLab PDF generation** within a clean, dark-first career intelligence workspace.

Candidates receive:
1. **Explainable 6-Factor Quality Scoring** grounded in extracted evidence.
2. **Heuristic ATS Readiness Checks** that detect parser traps and missing structural sections.
3. **Mathematical Job Compatibility Matching** (TF-IDF Cosine Similarity) against target job descriptions.
4. **Semantic Skill Gap Analysis** classifying matched, missing, and related technical competencies.
5. **Google X-Y-Z Formula Bullet Rewrites** that turn passive tasks into quantifiable business impact.
6. **Publication-Ready PDF Reports** generated dynamically and ready for mentor or recruiter review.

---

## 📸 Screenshots

| Landing Page | Executive Dashboard |
| :---: | :---: |
| ![Landing Page Preview](https://raw.githubusercontent.com/placeholder-user/ResumeAI/main/docs/screenshots/landing.png) | ![Dashboard Preview](https://raw.githubusercontent.com/placeholder-user/ResumeAI/main/docs/screenshots/dashboard.png) |

| Deep-Dive AI Analysis | TF-IDF Job Matching & Gap Explorer |
| :---: | :---: |
| ![Analysis Preview](https://raw.githubusercontent.com/placeholder-user/ResumeAI/main/docs/screenshots/analysis.png) | ![Matching Preview](https://raw.githubusercontent.com/placeholder-user/ResumeAI/main/docs/screenshots/matching.png) |

*(Screenshots can be added as live assets upon initial deployment)*

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI, Pydantic v2, Uvicorn
- **Configuration:** Pydantic Settings & Python-Dotenv
- **AI / LLM:** Google Gemini API via official `google-genai` SDK
- **NLP / ML:** Scikit-learn (TF-IDF Vectorization, Cosine Similarity), NumPy
- **Document Processing:** PyMuPDF (`fitz`) for PDF parsing & sanitization
- **Report Generation:** ReportLab for dynamic, two-pass numbered PDF reports
- **Testing:** Pytest, pytest-asyncio, HTTPX

### Frontend
- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Custom Dark SaaS Design System
- **State Management:** React Context API
- **Routing:** React Router v7
- **Networking:** Axios with error normalization interceptors
- **Visuals & Charts:** Recharts (Radar, Progress topologies), Lucide React
- **Accessibility:** WCAG 2.2 AA compliant contrast and focus states

---

## 🏛️ Architecture Overview

```
ResumeAI/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint, CORS, exception handling
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic Settings (.env configuration)
│   │   │   └── exceptions.py          # Unified domain exceptions & JSON handlers
│   │   ├── api/routes/
│   │   │   ├── health.py              # GET /api/v1/health
│   │   │   ├── resume.py              # POST /api/v1/resume/analyze
│   │   │   ├── matching.py            # POST /api/v1/resume/match & /match-file
│   │   │   ├── ats.py                 # POST /api/v1/resume/ats-check & /ats-check-file
│   │   │   └── reports.py             # POST /api/v1/report/generate
│   │   ├── schemas/                   # Pydantic data schemas
│   │   │   ├── resume.py              # ExtractedResumeData, WorkExperience, etc.
│   │   │   ├── analysis.py            # AIResumeAnalysis, QualityScoreBreakdown
│   │   │   ├── ats.py                 # ATSReadinessResult, ATSSectionCheck
│   │   │   ├── matching.py            # JobMatchResult, SkillAnalysisItem
│   │   │   └── recommendations.py     # RecommendationItem
│   │   ├── services/                  # Business logic isolation
│   │   │   ├── pdf_service.py         # PyMuPDF text & page extraction
│   │   │   ├── extraction_service.py  # Regex & structural entity segmentation
│   │   │   ├── scoring_service.py     # 6-Factor heuristic scoring system
│   │   │   ├── gemini_service.py      # Google GenAI SDK integration & fallback
│   │   │   ├── ats_service.py         # ATS heuristic parser checks
│   │   │   ├── matching_service.py    # TF-IDF cosine similarity & skill gap
│   │   │   └── report_service.py      # ReportLab PDF compilation
│   │   └── utils/
│   │       ├── text_processing.py     # Synonyms, regex, cleaners, action verbs
│   │       └── validators.py          # PDF header verification & size validation
│   ├── tests/                         # 22 Comprehensive automated pytest tests
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                # Navbar, Footer, AppLayout
│   │   │   ├── common/                # ScoreBadge
│   │   │   ├── charts/                # ScoreRadarChart (Recharts)
│   │   │   └── upload/                # Drag-and-drop ResumeUploadModal
│   │   ├── pages/                     # 7 Application Screens
│   │   │   ├── LandingPage.tsx        # Hero, features, how-it-works, preview
│   │   │   ├── DashboardPage.tsx      # Overview KPIs, radar chart, action items
│   │   │   ├── AnalysisPage.tsx       # Detailed breakdown & bullet rewrites
│   │   │   ├── MatchingPage.tsx       # Job description comparison
│   │   │   ├── SkillsPage.tsx         # Skill gap & taxonomy explorer
│   │   │   ├── RecommendationsPage.tsx# Prioritized action plan with 1-click copy
│   │   │   └── ReportsPage.tsx        # PDF report generator & preview
│   │   ├── context/                   # ResumeContext state provider
│   │   ├── services/                  # Axios API client & resumeService
│   │   └── types/                     # TypeScript models
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.12)
- **Node.js 18+** (Tested on Node.js v24 / npm 11)
- *(Optional)* [Google AI Studio Gemini API Key](https://aistudio.google.com/) for live Gemini calls. (A deterministic, rule-based fallback is automatically active when no key is provided).

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `GEMINI_API_KEY`:
   ```ini
   APP_NAME="ResumeAI API"
   APP_VERSION="1.0.0"
   DEBUG=false
   GEMINI_API_KEY="your-gemini-api-key-here"
   GEMINI_MODEL="gemini-2.5-flash"
   MAX_UPLOAD_SIZE_MB=10
   ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
   ```

5. **Start the backend server:**
   ```bash
   uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   - API Status: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
   - Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Testing Suite

### Backend Tests
The automated test suite runs offline without requiring an active Gemini API key:
```bash
python -m pytest backend/tests -v
```
**Test Coverage Includes:**
- `test_health.py`: Health checks & version assertions
- `test_pdf.py`: PDF validation, empty bytes, corrupt headers, non-text scans, and filename sanitization
- `test_scoring.py`: Mathematical weight verification (30%, 25%, 20%, 10%, 10%, 5%) and sparse resume handling
- `test_matching.py`: Scikit-learn TF-IDF cosine similarity, synonym taxonomy mapping, and empty JD states
- `test_ats.py`: Contact, skills, experience, and education section parser diagnostics
- `test_reports.py`: ReportLab two-pass canvas compilation and binary `%PDF-` validation
- `test_gemini.py`: Deterministic fallback, structured Pydantic schemas, and user-verification labeling
- `test_api_endpoints.py`: End-to-end HTTP endpoint validation for file uploads and JSON payloads

### Frontend Production Validation
Ensure zero TypeScript compilation errors and production bundle integrity:
```bash
cd frontend
npm run build
```

---

## 📊 Scoring Methodology & Transparent Limitations

ResumeAI operates with complete algorithmic transparency:

| Category | Weight | Focus Areas |
| :--- | :---: | :--- |
| **Skills Relevance & Clarity** | **30%** | Technical tool volume, modern stack alignment, soft skill balance |
| **Experience Quality** | **25%** | Chronological roles, decisive action verbs, quantifiable metrics |
| **Project Quality** | **20%** | Real-world problem solving, explicit technology stack mentions |
| **Education & Certifications** | **10%** | Degree status, accredited institutions, verified cloud credentials |
| **Resume Structure** | **10%** | Contact links (email, phone, LinkedIn, GitHub), summary, page length |
| **Keyword Coverage** | **5%** | Technical vocabulary density and role alignment bonus |

### Important Notices
- **Not a Hiring Guarantee:** The Resume Quality Score is an explainable heuristic assessment of content depth, formatting, and action-oriented achievements. It is not a statistical prediction of job offer probability.
- **Heuristic ATS Assessment:** Commercial ATS vendors (e.g., Workday, Greenhouse, Taleo) employ proprietary parsers. ResumeAI simulates standard industry parsing conventions (single-column readability, standard header recognition, keyword detection).
- **No Fabrications:** ResumeAI never invents metrics, credentials, or achievements. Suggested rewrites are clearly marked as requiring user verification before inclusion.

---

## 🔒 Security & Privacy

- **Stateless by Design:** Resume files are processed in memory and never permanently stored in a database.
- **Backend-Only AI Integration:** The Gemini API key is strictly stored on the backend and is never exposed through frontend configurations or network responses.
- **Strict PDF Byte Verification:** Uploads are validated against PDF magic bytes (`%PDF-`), rejecting masqueraded files or oversized documents.
- **Sanitized Filenames:** Prevents path traversal vulnerabilities and control character injection.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
