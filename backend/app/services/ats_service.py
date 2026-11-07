from typing import List
from backend.app.schemas.ats import ATSReadinessResult, ATSSectionCheck
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.utils.text_processing import WEAK_PHRASES


class ATSService:
    """Evaluates resume parsing compatibility, structural sections, and potential ATS pitfalls."""

    def evaluate_ats_readiness(self, resume: ExtractedResumeData) -> ATSReadinessResult:
        sections_checked: List[ATSSectionCheck] = []
        missing_sections: List[str] = []
        formatting_warnings: List[str] = []
        recommendations: List[str] = []

        total_points = 0.0
        max_points = 100.0

        # 1. Contact Information Section
        contact_findings = []
        contact_suggestions = []
        if resume.contact.email and (resume.contact.phone or resume.contact.location):
            contact_status = "optimized"
            total_points += 20.0
            contact_findings.append("Verified essential contact data (email + phone/location).")
        elif resume.contact.email:
            contact_status = "warning"
            total_points += 12.0
            contact_findings.append("Email detected, but missing phone number or location.")
            contact_suggestions.append("Add a standard phone number and city/state location for local ATS indexing.")
        else:
            contact_status = "missing"
            missing_sections.append("Contact Details (Email)")
            contact_suggestions.append("Critical: Ensure your email address is in plain selectable text in the top header.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Contact Information",
                detected=bool(resume.contact.email),
                status=contact_status,
                findings=contact_findings,
                suggestions=contact_suggestions,
            )
        )

        # 2. Professional Summary
        summary_findings = []
        summary_suggestions = []
        if resume.summary and len(resume.summary.split()) >= 15:
            summary_status = "optimized"
            total_points += 15.0
            summary_findings.append("Professional summary section clearly isolated.")
        else:
            summary_status = "warning"
            total_points += 5.0
            summary_findings.append("No distinct summary header detected.")
            summary_suggestions.append("Include a 2-3 sentence 'Professional Summary' using standard heading conventions.")
            recommendations.append("Add a concise professional summary at the top of your resume.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Professional Summary",
                detected=bool(resume.summary),
                status=summary_status,
                findings=summary_findings,
                suggestions=summary_suggestions,
            )
        )

        # 3. Technical Skills Section
        skills_findings = []
        skills_suggestions = []
        if len(resume.technical_skills) >= 6:
            skills_status = "optimized"
            total_points += 20.0
            skills_findings.append(f"{len(resume.technical_skills)} skills matched to recognized industry taxonomies.")
        elif len(resume.technical_skills) > 0:
            skills_status = "warning"
            total_points += 10.0
            skills_findings.append(f"Only {len(resume.technical_skills)} skills detected.")
            skills_suggestions.append("Group your technical competencies into a dedicated 'Skills' section with comma delimiters.")
        else:
            skills_status = "missing"
            missing_sections.append("Skills Section")
            skills_suggestions.append("Create a dedicated 'Technical Skills' section to pass automated keyword screens.")
            recommendations.append("Create a dedicated 'Skills' section listing core languages, frameworks, and tools.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Skills Section",
                detected=len(resume.technical_skills) > 0,
                status=skills_status,
                findings=skills_findings,
                suggestions=skills_suggestions,
            )
        )

        # 4. Work Experience Section
        exp_findings = []
        exp_suggestions = []
        if resume.work_experience:
            exp_status = "optimized"
            total_points += 25.0
            exp_findings.append(f"Detected {len(resume.work_experience)} distinct roles with bullet points.")
        else:
            if resume.projects:
                exp_status = "warning"
                total_points += 12.0
                exp_findings.append("No conventional employment history detected; projects detected instead.")
                exp_suggestions.append("If you have internships or contract roles, format them under 'Experience'.")
            else:
                exp_status = "missing"
                missing_sections.append("Work Experience")
                exp_suggestions.append("ATS parsers prioritize chronological work experience.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Work Experience",
                detected=bool(resume.work_experience),
                status=exp_status,
                findings=exp_findings,
                suggestions=exp_suggestions,
            )
        )

        # 5. Education Section
        edu_findings = []
        edu_suggestions = []
        if resume.education:
            edu_status = "optimized"
            total_points += 10.0
            edu_findings.append(f"Identified education records from {resume.education[0].institution}.")
        else:
            edu_status = "missing"
            missing_sections.append("Education Section")
            edu_suggestions.append("Include degree, institution, and graduation year under an 'Education' header.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Education",
                detected=bool(resume.education),
                status=edu_status,
                findings=edu_findings,
                suggestions=edu_suggestions,
            )
        )

        # 6. Projects Section
        proj_findings = []
        proj_suggestions = []
        if resume.projects:
            proj_status = "optimized"
            total_points += 10.0
            proj_findings.append(f"Found {len(resume.projects)} technical projects.")
        else:
            proj_status = "warning"
            total_points += 5.0
            proj_findings.append("No separate projects section parsed.")
            proj_suggestions.append("Adding a 'Projects' section allows parsers to discover hands-on tool applications.")

        sections_checked.append(
            ATSSectionCheck(
                section_name="Projects",
                detected=bool(resume.projects),
                status=proj_status,
                findings=proj_findings,
                suggestions=proj_suggestions,
            )
        )

        # 7. Formatting & Parser Friendliness Warnings
        parser_points = 100.0

        # Check for multi-column / text density issues
        raw_words = resume.raw_text.split()
        if len(raw_words) < 150:
            formatting_warnings.append("Low word count (<150 words). Resumes with sparse text may be flagged by automated parsers.")
            parser_points -= 20.0
        elif len(raw_words) > 1200:
            formatting_warnings.append("High word count (>1200 words). Consider condensing to avoid multi-page parser truncation.")
            parser_points -= 10.0

        if resume.page_count > 2:
            formatting_warnings.append(f"Document spans {resume.page_count} pages. Standard ATS templates recommend 1 to 2 pages.")
            parser_points -= 15.0

        # Check for passive language patterns
        weak_found = [p for p in WEAK_PHRASES if p in resume.raw_text.lower()]
        if weak_found:
            formatting_warnings.append(f"Passive phrases detected ({', '.join(weak_found[:3])}). Replace with decisive action verbs.")
            parser_points -= 10.0

        ats_score = round(max(10.0, min(100.0, total_points)), 1)
        parser_friendliness = round(max(20.0, min(100.0, parser_points)), 1)

        # Determine status
        if ats_score >= 85 and parser_friendliness >= 80:
            status = "Highly Optimized"
            readiness_summary = (
                "Your resume adheres closely to ATS structural standards. Headers are distinct, "
                "keywords are easily extractable, and core sections are clearly defined."
            )
        elif ats_score >= 70:
            status = "ATS Friendly"
            readiness_summary = (
                "Your resume is readable by modern ATS parsers with minor areas for structural clarification. "
                "Ensure standard section titles and clear delimiter usage."
            )
        elif ats_score >= 50:
            status = "Moderate Risk"
            readiness_summary = (
                "Some sections or essential keywords were ambiguous during extraction. "
                "Resolving formatting warnings will significantly improve parser accuracy."
            )
        else:
            status = "High Risk"
            readiness_summary = (
                "Key structural components (such as contact info, experience, or clear headers) are missing or obscured. "
                "The resume is at high risk of being misparsed by automated applicant tracking software."
            )

        if not recommendations:
            recommendations.append("Ensure standard section headers ('Skills', 'Experience', 'Education') are used consistently.")
            recommendations.append("Use standard bullet points (• or -) rather than special graphical icons.")

        return ATSReadinessResult(
            ats_score=ats_score,
            status=status,
            readiness_summary=readiness_summary,
            sections_checked=sections_checked,
            missing_sections=missing_sections,
            formatting_warnings=formatting_warnings,
            parser_friendliness_score=parser_friendliness,
            recommendations=recommendations,
        )


ats_service = ATSService()

