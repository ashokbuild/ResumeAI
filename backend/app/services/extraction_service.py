import re
from typing import Dict, List, Optional
from backend.app.schemas.resume import (
    ContactInfo,
    Education,
    ExtractedResumeData,
    Project,
    WorkExperience,
)
from backend.app.utils.text_processing import (
    SECTION_PATTERNS,
    clean_text,
    extract_contact_info,
    extract_skills_from_text,
)


class ExtractionService:
    """Structures extracted PDF text into defined sections and candidate entities."""

    def extract_structure(
        self,
        raw_text: str,
        filename: str,
        file_size_bytes: int,
        page_count: int,
    ) -> ExtractedResumeData:
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

        # 1. Contact Extraction
        email, phone, linkedin, github, portfolio = extract_contact_info(raw_text)

        # Detect candidate name from top lines (first 5 lines, ignoring headers/contact lines)
        name = self._extract_candidate_name(lines, email, phone)

        # Detect candidate location from top lines
        location = self._extract_location(lines[:8])

        contact = ContactInfo(
            name=name,
            email=email,
            phone=phone,
            location=location,
            linkedin=linkedin,
            github=github,
            portfolio=portfolio,
        )

        # 2. Section Partitioning
        sections = self._partition_sections(raw_text)

        # 3. Summary
        summary = self._extract_summary(sections.get("summary", ""))

        # 4. Skills
        technical_skills = extract_skills_from_text(raw_text)
        # Check explicit skills section for additional custom items
        skills_section_text = sections.get("skills", "")
        if skills_section_text:
            additional_skills = self._extract_explicit_skills(skills_section_text)
            for s in additional_skills:
                if s.lower() not in [ts.lower() for ts in technical_skills]:
                    technical_skills.append(s)

        soft_skills = self._extract_soft_skills(raw_text)

        # 5. Work Experience
        work_experience = self._extract_experience(sections.get("experience", ""))

        # 6. Education
        education = self._extract_education(sections.get("education", ""))

        # 7. Projects
        projects = self._extract_projects(sections.get("projects", ""))

        # 8. Certifications & Achievements
        certifications = self._extract_list_items(sections.get("certifications", ""))
        achievements = self._extract_list_items(sections.get("achievements", ""))

        return ExtractedResumeData(
            filename=filename,
            file_size_kb=round(file_size_bytes / 1024, 2),
            page_count=page_count,
            contact=contact,
            summary=summary,
            technical_skills=technical_skills,
            soft_skills=soft_skills,
            work_experience=work_experience,
            education=education,
            projects=projects,
            certifications=certifications,
            achievements=achievements,
            raw_text=raw_text,
        )

    def _extract_candidate_name(self, lines: List[str], email: Optional[str], phone: Optional[str]) -> Optional[str]:
        """Detect candidate name from top lines by heuristics."""
        for line in lines[:5]:
            # Skip if contains email or phone or url
            if email and email.lower() in line.lower():
                continue
            if phone and phone in line:
                continue
            if any(k in line.lower() for k in ["linkedin", "github", "http", "@", "curriculum", "resume"]):
                continue
            # If line is 2-4 words, alphabetic, capitalized
            words = line.split()
            if 2 <= len(words) <= 4 and all(re.match(r"^[A-Za-z\.'-]+$", w) for w in words):
                return line.strip()
        return None

    def _extract_location(self, top_lines: List[str]) -> Optional[str]:
        """Detect City, State/Country in the header."""
        location_pattern = re.compile(r"\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))\b")
        for line in top_lines:
            match = location_pattern.search(line)
            if match and not any(k in match.group(0).lower() for k in ["university", "college", "company", "school"]):
                return match.group(0).strip()
        return None

    def _partition_sections(self, raw_text: str) -> Dict[str, str]:
        """Segments raw resume text into named sections based on header patterns."""
        lines = raw_text.split("\n")
        sections: Dict[str, List[str]] = {}
        current_section = "header"

        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue

            # Check if this line matches any section header
            matched_section = None
            # Check only short lines (headers are usually <= 5 words)
            if len(line_stripped.split()) <= 5:
                clean_header = re.sub(r"[:\-_|]", "", line_stripped).strip()
                for section_key, pattern in SECTION_PATTERNS.items():
                    if pattern.match(clean_header):
                        matched_section = section_key
                        break

            if matched_section:
                current_section = matched_section
                if current_section not in sections:
                    sections[current_section] = []
            else:
                if current_section not in sections:
                    sections[current_section] = []
                sections[current_section].append(line_stripped)

        return {k: "\n".join(v) for k, v in sections.items()}

    def _extract_summary(self, summary_text: str) -> Optional[str]:
        cleaned = summary_text.strip()
        return cleaned if len(cleaned) > 20 else None

    def _extract_explicit_skills(self, text: str) -> List[str]:
        items: List[str] = []
        for line in text.split("\n"):
            # If line has comma or bullet or pipe
            parts = re.split(r"[,•|;\t]", line)
            for p in parts:
                cleaned = re.sub(r"^[•\-\*]\s*", "", p).strip()
                if 2 <= len(cleaned) <= 30 and not cleaned.lower().startswith("languages") and not cleaned.lower().startswith("tools"):
                    items.append(cleaned)
        return items[:30]

    def _extract_soft_skills(self, text: str) -> List[str]:
        soft_skills_bank = [
            "Leadership", "Communication", "Team Collaboration", "Problem Solving",
            "Critical Thinking", "Adaptability", "Time Management", "Mentorship",
            "Agile Mindset", "Conflict Resolution", "Cross-Functional Collaboration",
            "Ownership", "Analytical Thinking"
        ]
        lower = text.lower()
        found: List[str] = []
        for s in soft_skills_bank:
            if re.search(r"\b" + re.escape(s.lower()) + r"\b", lower):
                found.append(s)
        return found

    def _extract_experience(self, exp_text: str) -> List[WorkExperience]:
        if not exp_text:
            return []

        experiences: List[WorkExperience] = []
        chunks = re.split(r"\n(?=[A-Z0-9][A-Za-z0-9\s,\-\|]{3,50}\s*(?:20\d\d|19\d\d|Present|Current))", exp_text)

        for chunk in chunks:
            lines = [l.strip() for l in chunk.split("\n") if l.strip()]
            if not lines:
                continue

            first_line = lines[0]
            role = first_line
            company = "Organization"
            dates_match = re.search(r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d\d|19\d\d)[a-zA-Z0-9\s,\-–—]+(?:Present|Current|\d{4}))", first_line, re.IGNORECASE)
            
            dates_str = dates_match.group(0) if dates_match else None
            if dates_match:
                role = first_line.replace(dates_match.group(0), "").strip(" ,-|–—")

            # Check second line for company / location
            highlights: List[str] = []
            for line in lines[1:]:
                cleaned_line = re.sub(r"^[•\-\*]\s*", "", line).strip()
                if cleaned_line:
                    highlights.append(cleaned_line)

            if len(role) > 2:
                experiences.append(
                    WorkExperience(
                        company=company,
                        role=role[:80],
                        start_date=dates_str,
                        is_current=bool(dates_str and "present" in dates_str.lower()),
                        highlights=highlights,
                    )
                )

        return experiences[:10]

    def _extract_education(self, edu_text: str) -> List[Education]:
        if not edu_text:
            return []

        educations: List[Education] = []
        lines = [l.strip() for l in edu_text.split("\n") if l.strip()]

        for line in lines:
            if any(deg in line.lower() for deg in ["bachelor", "master", "phd", "b.s", "m.s", "b.e", "b.tech", "degree", "university", "college", "institute"]):
                # Extract year
                year_match = re.search(r"\b(19\d\d|20\d\d)\b", line)
                gpa_match = re.search(r"\bGPA:?\s*([0-4]\.\d{1,2}|[0-9]{1,2}(?:\.[0-9])?%?)\b", line, re.IGNORECASE)
                
                educations.append(
                    Education(
                        institution=line[:100],
                        degree=line[:60] if any(d in line.lower() for d in ["bachelor", "master", "b.s", "b.tech", "phd"]) else None,
                        end_date=year_match.group(0) if year_match else None,
                        gpa=gpa_match.group(0) if gpa_match else None,
                    )
                )

        return educations[:5]

    def _extract_projects(self, proj_text: str) -> List[Project]:
        if not proj_text:
            return []

        projects: List[Project] = []
        chunks = re.split(r"\n(?=[A-Z0-9][A-Za-z0-9\s,\-\|]{2,40}\s*(?:\||-|–|—))", proj_text)

        for chunk in chunks:
            lines = [l.strip() for l in chunk.split("\n") if l.strip()]
            if not lines:
                continue

            title = lines[0]
            highlights: List[str] = []
            technologies: List[str] = []

            for line in lines[1:]:
                cleaned = re.sub(r"^[•\-\*]\s*", "", line).strip()
                if "technologies" in cleaned.lower() or "tools:" in cleaned.lower():
                    techs = [t.strip() for t in re.split(r"[,|:]", cleaned) if t.strip()]
                    technologies.extend(techs)
                elif cleaned:
                    highlights.append(cleaned)

            if len(title) > 2:
                projects.append(
                    Project(
                        title=title[:80],
                        description=highlights[0] if highlights else None,
                        technologies=technologies,
                        highlights=highlights,
                    )
                )

        return projects[:8]

    def _extract_list_items(self, text: str) -> List[str]:
        if not text:
            return []
        items: List[str] = []
        for line in text.split("\n"):
            cleaned = re.sub(r"^[•\-\*]\s*", "", line).strip()
            if len(cleaned) > 3:
                items.append(cleaned)
        return items[:15]


extraction_service = ExtractionService()

