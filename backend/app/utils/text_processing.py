import re
from typing import Dict, List, Optional, Set, Tuple


# Regex patterns for contact information extraction
EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_PATTERN = re.compile(
    r"(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?"
)
LINKEDIN_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+/?", re.IGNORECASE)
GITHUB_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_-]+/?", re.IGNORECASE)
PORTFOLIO_PATTERN = re.compile(r"(?:https?://)?(?:www\.)?[A-Za-z0-9_-]+\.(?:dev|io|me|tech|site|org|com)/?", re.IGNORECASE)

# Standard resume section header patterns
SECTION_PATTERNS: Dict[str, re.Pattern] = {
    "summary": re.compile(r"^(?:professional\s+)?summary|profile|about\s+me|objective", re.IGNORECASE | re.MULTILINE),
    "skills": re.compile(r"^(?:technical\s+|core\s+)?skills|technologies|competencies|tools\s+&\s+technologies", re.IGNORECASE | re.MULTILINE),
    "experience": re.compile(r"^(?:work\s+|professional\s+|relevant\s+)?experience|employment\s+history|work\s+history", re.IGNORECASE | re.MULTILINE),
    "projects": re.compile(r"^(?:personal\s+|academic\s+|key\s+)?projects|technical\s+projects", re.IGNORECASE | re.MULTILINE),
    "education": re.compile(r"^education|academic\s+background|qualifications", re.IGNORECASE | re.MULTILINE),
    "certifications": re.compile(r"^certifications|licenses|courses|credentials", re.IGNORECASE | re.MULTILINE),
    "achievements": re.compile(r"^achievements|awards|honors|publications", re.IGNORECASE | re.MULTILINE),
}

# Strong action verbs for experience assessment
STRONG_ACTION_VERBS = {
    "accelerated", "achieved", "architected", "automated", "built", "spearheaded", "engineered",
    "designed", "developed", "delivered", "deployed", "executed", "established", "facilitated",
    "generated", "implemented", "increased", "maximized", "mentored", "orchestrated", "optimized",
    "reduced", "refactored", "resolved", "scaled", "streamlined", "transformed", "unified"
}

# Weak or passive phrases to flag
WEAK_PHRASES = [
    "responsible for", "helped with", "assisted in", "worked on", "handled", "duties included",
    "participated in", "tasked with"
]

# Common skill synonyms / variations
SKILL_SYNONYMS: Dict[str, Set[str]] = {
    "python": {"python", "py", "python3"},
    "javascript": {"javascript", "js", "ecmascript"},
    "typescript": {"typescript", "ts"},
    "react": {"react", "react.js", "reactjs"},
    "node": {"node", "node.js", "nodejs"},
    "vue": {"vue", "vue.js", "vuejs"},
    "angular": {"angular", "angularjs"},
    "aws": {"aws", "amazon web services", "amazon cloud"},
    "gcp": {"gcp", "google cloud", "google cloud platform"},
    "azure": {"azure", "microsoft azure"},
    "docker": {"docker", "container", "containers", "containerization"},
    "kubernetes": {"kubernetes", "k8s"},
    "postgresql": {"postgresql", "postgres", "psql"},
    "mongodb": {"mongodb", "mongo"},
    "rest api": {"rest", "restful", "rest api", "rest apis", "restful api"},
    "graphql": {"graphql", "gql"},
    "ci/cd": {"ci/cd", "continuous integration", "cicd", "continuous delivery", "jenkins", "github actions"},
    "git": {"git", "github", "gitlab", "version control"},
    "tailwind": {"tailwind", "tailwindcss", "tailwind css"},
    "machine learning": {"machine learning", "ml", "deep learning", "ai", "artificial intelligence"},
    "fastapi": {"fastapi", "fast-api"},
    "sql": {"sql", "rdbms", "relational database"},
}

KNOWN_SKILLS = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "sql", "html", "css",
    # Frameworks & Libraries
    "react", "next.js", "vue", "angular", "node", "express", "fastapi", "django", "flask", "spring boot", "asp.net", "tailwind", "bootstrap", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras",
    # Databases & Storage
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb", "cassandra", "supabase", "firebase",
    # Cloud & DevOps
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ci/cd", "git", "linux", "nginx", "helm", "grafana", "prometheus",
    # Concepts & Methodologies
    "rest api", "graphql", "microservices", "agile", "scrum", "tdd", "system design", "data structures", "algorithms", "machine learning", "nlp", "computer vision", "llms", "etl"
}


def clean_text(text: str) -> str:
    """Normalize whitespace and strip unprintable characters."""
    if not text:
        return ""
    # Normalize unicode spaces & line breaks
    text = re.sub(r"\r\n|\r", "\n", text)
    # Replace multiple spaces while keeping linebreaks
    text = re.sub(r"[ \t]+", " ", text)
    # Remove null bytes
    text = text.replace("\x00", "")
    return text.strip()


def extract_contact_info(text: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str], Optional[str]]:
    """Extract email, phone, linkedin, github, and portfolio from raw text."""
    email_match = EMAIL_PATTERN.search(text)
    email = email_match.group(0).lower() if email_match else None

    # Search for phone
    phone = None
    lines = text.split("\n")[:10]  # usually in first 10 lines
    for line in lines:
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", line)
        if phone_match:
            phone = phone_match.group(0).strip()
            break

    linkedin_match = LINKEDIN_PATTERN.search(text)
    linkedin = linkedin_match.group(0) if linkedin_match else None

    github_match = GITHUB_PATTERN.search(text)
    github = github_match.group(0) if github_match else None

    portfolio = None
    for match in PORTFOLIO_PATTERN.finditer(text):
        url = match.group(0)
        if "linkedin" not in url.lower() and "github" not in url.lower():
            portfolio = url
            break

    return email, phone, linkedin, github, portfolio


def extract_skills_from_text(text: str) -> List[str]:
    """Extract recognized technical skills from text using boundary matching."""
    lower_text = " " + text.lower() + " "
    detected: List[str] = []

    for skill in KNOWN_SKILLS:
        pattern = r"(?<![a-zA-Z0-9_])" + re.escape(skill) + r"(?![a-zA-Z0-9_])"
        if re.search(pattern, lower_text):
            # Display name formatted
            detected.append(skill.title() if len(skill) > 3 and not skill.endswith(".js") else skill)

    return sorted(list(set(detected)))


def find_skill_matches(resume_text: str, job_skills: List[str]) -> Tuple[List[str], List[str], List[str]]:
    """
    Compare resume text with job skills using exact matches and synonym mappings.
    Returns: (matching_skills, missing_skills, related_skills)
    """
    resume_lower = resume_text.lower()
    matched = set()
    missing = set()
    related = set()

    for skill in job_skills:
        skill_lower = skill.strip().lower()
        if not skill_lower:
            continue

        # Check exact or word boundary match
        pattern = r"(?<![a-zA-Z0-9_])" + re.escape(skill_lower) + r"(?![a-zA-Z0-9_])"
        if re.search(pattern, resume_lower):
            matched.add(skill)
            continue

        # Check synonyms
        found_synonym = False
        for canon, syns in SKILL_SYNONYMS.items():
            if skill_lower in syns:
                for syn in syns:
                    syn_pattern = r"(?<![a-zA-Z0-9_])" + re.escape(syn) + r"(?![a-zA-Z0-9_])"
                    if re.search(syn_pattern, resume_lower):
                        matched.add(skill)
                        found_synonym = True
                        break
            if found_synonym:
                break

        if not found_synonym:
            # Check if partially related
            words = skill_lower.split()
            if len(words) > 1 and any(w in resume_lower for w in words if len(w) > 3):
                related.add(skill)
            else:
                missing.add(skill)

    return sorted(list(matched)), sorted(list(missing)), sorted(list(related))


def count_quantified_metrics(text: str) -> int:
    """Detect presence of quantified metrics like percentages, numbers, $ amounts, multipliers."""
    patterns = [
        r"\b\d+%",                          # 25%
        r"\$\d+(?:,\d+)*(?:\.\d+)?\s*(?:[kKmMbB]|million|thousand)?",  # $50k
        r"\b\d+x\b",                        # 3x
        r"\b\d+\s*(?:users|clients|customers|requests|transactions|ms|seconds|minutes|hours|days|weeks|months|years)\b",
        r"\b(?:reduced|increased|improved|scaled|cut|saved)\s+by\s+\d+",
    ]
    total = 0
    for p in patterns:
        total += len(re.findall(p, text, re.IGNORECASE))
    return total

