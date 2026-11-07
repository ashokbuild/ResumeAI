from typing import List, Optional
from backend.app.schemas.analysis import (
    CategoryScore,
    OverallResumeQuality,
    QualityScoreBreakdown,
)
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.utils.text_processing import STRONG_ACTION_VERBS, count_quantified_metrics


class ScoringService:
    """Calculates transparent, heuristic-weighted resume quality scores."""

    def calculate_quality_score(self, resume: ExtractedResumeData, keyword_bonus: float = 0.0) -> OverallResumeQuality:
        # 1. Skills Relevance and Clarity (Weight: 30%)
        skills_score = self._score_skills(resume)

        # 2. Experience Quality (Weight: 25%)
        exp_score = self._score_experience(resume)

        # 3. Project Quality (Weight: 20%)
        proj_score = self._score_projects(resume)

        # 4. Education and Certifications (Weight: 10%)
        edu_score = self._score_education_certs(resume)

        # 5. Resume Structure (Weight: 10%)
        struct_score = self._score_structure(resume)

        # 6. Keyword Coverage (Weight: 5%)
        keyword_score = self._score_keywords(resume, keyword_bonus)

        # Weighted calculation
        total_score = (
            skills_score.weighted_score
            + exp_score.weighted_score
            + proj_score.weighted_score
            + edu_score.weighted_score
            + struct_score.weighted_score
            + keyword_score.weighted_score
        )
        total_score = round(max(0.0, min(100.0, total_score)), 1)

        # Determine label
        if total_score >= 88:
            rating_label = "Exceptional"
            summary_assessment = (
                "Your resume demonstrates exceptional professional polish, strong quantifiable impact, "
                "and clearly organized technical competencies."
            )
        elif total_score >= 75:
            rating_label = "Strong"
            summary_assessment = (
                "Your resume has solid foundational substance with good technical details. "
                "Addressing a few specific bullet point quantifications will elevate it further."
            )
        elif total_score >= 60:
            rating_label = "Competitive"
            summary_assessment = (
                "Your resume meets standard criteria but leaves room for improvement in action-verb impact, "
                "metrics-driven accomplishments, or structural completeness."
            )
        elif total_score >= 45:
            rating_label = "Developing"
            summary_assessment = (
                "Your resume provides relevant background but lacks depth in accomplishments, "
                "demonstrated technical skills, or clear section hierarchy."
            )
        else:
            rating_label = "Needs Significant Work"
            summary_assessment = (
                "Your resume is missing essential sections, quantifiable metrics, or structured descriptions. "
                "Follow the prioritized recommendations below to build a competitive document."
            )

        breakdown = QualityScoreBreakdown(
            skills_relevance=skills_score,
            experience_quality=exp_score,
            project_quality=proj_score,
            education_certifications=edu_score,
            resume_structure=struct_score,
            keyword_coverage=keyword_score,
        )

        return OverallResumeQuality(
            overall_score=total_score,
            rating_label=rating_label,
            summary_assessment=summary_assessment,
            breakdown=breakdown,
        )

    def _score_skills(self, resume: ExtractedResumeData) -> CategoryScore:
        weight = 0.30
        score = 0.0
        strengths = []
        weaknesses = []
        missing = []

        tech_count = len(resume.technical_skills)
        if tech_count == 0:
            missing.append("Technical Skills section or recognizable industry tools")
            weaknesses.append("No identifiable technical tools or programming languages detected.")
            score = 15.0
        elif tech_count < 4:
            score = 45.0
            weaknesses.append(f"Only {tech_count} technical skills detected. Industry resumes typically showcase 8-15 core competencies.")
        elif tech_count < 8:
            score = 75.0
            strengths.append(f"Good technical skills breadth ({tech_count} skills identified).")
        else:
            score = 95.0
            strengths.append(f"Strong, diverse technical skill set ({tech_count} tools, languages, and frameworks identified).")

        if resume.soft_skills:
            score = min(100.0, score + 5.0)
            strengths.append(f"Identified {len(resume.soft_skills)} professional competencies and leadership attributes.")
        else:
            weaknesses.append("Lacks explicit mention of collaboration or soft skills.")

        score = round(min(100.0, score), 1)
        return CategoryScore(
            name="Skills Relevance & Clarity",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing,
            feedback=f"Found {tech_count} technical tools and {len(resume.soft_skills)} soft skills.",
        )

    def _score_experience(self, resume: ExtractedResumeData) -> CategoryScore:
        weight = 0.25
        score = 0.0
        strengths = []
        weaknesses = []
        missing = []

        roles_count = len(resume.work_experience)
        if roles_count == 0:
            # Check if fresh grad or student (might rely heavily on projects)
            if len(resume.projects) > 0:
                score = 50.0
                weaknesses.append("No traditional employment history listed. Emphasize extensive technical projects.")
            else:
                score = 20.0
                missing.append("Work Experience section")
                weaknesses.append("Missing professional experience or internship records.")
        else:
            score = 60.0
            strengths.append(f"Documented {roles_count} professional position(s).")

            # Check action verbs and quantification across highlights
            all_highlights = [h for exp in resume.work_experience for h in exp.highlights]
            full_exp_text = " ".join(all_highlights)

            # Quantified metrics
            metrics_count = count_quantified_metrics(full_exp_text)
            if metrics_count >= 4:
                score += 25.0
                strengths.append(f"High-impact quantification: detected {metrics_count} measurable outcomes (percentages, metrics, multipliers).")
            elif metrics_count >= 1:
                score += 15.0
                strengths.append(f"Includes {metrics_count} quantifiable result(s). Consider adding more metrics.")
            else:
                weaknesses.append("Bullet points lack quantifiable metrics (e.g., %, $, scale, performance gains).")

            # Action verbs
            words_lower = set(full_exp_text.lower().split())
            strong_verb_matches = words_lower.intersection(STRONG_ACTION_VERBS)
            if len(strong_verb_matches) >= 5:
                score += 15.0
                strengths.append(f"Strong action-driven language: utilized verbs like {', '.join(list(strong_verb_matches)[:4])}.")
            elif len(strong_verb_matches) >= 2:
                score += 8.0
            else:
                weaknesses.append("Experience bullets rely on passive phrasing rather than decisive action verbs.")

        score = round(min(100.0, score), 1)
        return CategoryScore(
            name="Experience Quality",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing,
            feedback="Evaluates role progression, dynamic action verbs, and quantifiable achievements.",
        )

    def _score_projects(self, resume: ExtractedResumeData) -> CategoryScore:
        weight = 0.20
        score = 0.0
        strengths = []
        weaknesses = []
        missing = []

        proj_count = len(resume.projects)
        if proj_count == 0:
            if len(resume.work_experience) >= 2:
                # Experienced candidates may fold projects into work experience
                score = 65.0
                strengths.append("Professional experience serves as the primary technical showcase.")
            else:
                score = 30.0
                missing.append("Projects section")
                weaknesses.append("No technical projects found. Projects are vital evidence of hands-on skills.")
        elif proj_count == 1:
            score = 70.0
            strengths.append("Includes 1 documented technical project.")
            weaknesses.append("Adding a second diverse project would better demonstrate range.")
        else:
            score = 90.0
            strengths.append(f"Strong project portfolio: {proj_count} distinct projects outlined.")

        # Check tech stack attribution in projects
        projects_with_tech = [p for p in resume.projects if p.technologies]
        if projects_with_tech:
            score = min(100.0, score + 10.0)
            strengths.append(f"{len(projects_with_tech)} project(s) explicitly specify technologies used.")
        elif proj_count > 0:
            weaknesses.append("Projects do not explicitly list the tech stack (e.g., React, Python, AWS).")

        score = round(min(100.0, score), 1)
        return CategoryScore(
            name="Project Quality",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing,
            feedback=f"Found {proj_count} technical projects with technology attributions.",
        )

    def _score_education_certs(self, resume: ExtractedResumeData) -> CategoryScore:
        weight = 0.10
        score = 0.0
        strengths = []
        weaknesses = []
        missing = []

        if resume.education:
            score += 70.0
            strengths.append(f"Education verified: {resume.education[0].institution}.")
            if resume.education[0].degree:
                score += 15.0
                strengths.append(f"Degree verified: {resume.education[0].degree}.")
        else:
            score += 20.0
            missing.append("Education section")
            weaknesses.append("No formal education or academic credentials detected.")

        if resume.certifications:
            score = min(100.0, score + 15.0)
            strengths.append(f"{len(resume.certifications)} professional certification(s) identified.")

        score = round(min(100.0, score), 1)
        return CategoryScore(
            name="Education & Certifications",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing,
            feedback="Analyzes academic foundations and verified professional certifications.",
        )

    def _score_structure(self, resume: ExtractedResumeData) -> CategoryScore:
        weight = 0.10
        score = 0.0
        strengths = []
        weaknesses = []
        missing = []

        # Check contact info
        if resume.contact.email and (resume.contact.phone or resume.contact.linkedin or resume.contact.github):
            score += 40.0
            strengths.append("Complete, easily parsed contact information.")
        elif resume.contact.email:
            score += 25.0
            weaknesses.append("Contact information lacks phone number or professional profile links (LinkedIn/GitHub).")
        else:
            missing.append("Contact Email")
            weaknesses.append("No valid email address detected in the resume header.")

        # Check summary
        if resume.summary and len(resume.summary.split()) >= 20:
            score += 30.0
            strengths.append("Clear professional summary / profile statement included.")
        else:
            score += 10.0
            weaknesses.append("Missing a targeted professional summary or career objective.")

        # Check page count
        if resume.page_count in [1, 2]:
            score += 30.0
            strengths.append(f"Optimal document length ({resume.page_count} page(s)).")
        else:
            score += 15.0
            weaknesses.append(f"Resume is {resume.page_count} pages long. Aim for 1-2 pages for maximum recruiter readability.")

        score = round(min(100.0, score), 1)
        return CategoryScore(
            name="Resume Structure",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing,
            feedback="Evaluates contact details, professional summary presence, and document length formatting.",
        )

    def _score_keywords(self, resume: ExtractedResumeData, keyword_bonus: float) -> CategoryScore:
        weight = 0.05
        # Baseline keyword coverage based on vocabulary density
        word_count = len(resume.raw_text.split())
        score = min(80.0, max(40.0, word_count / 10.0))
        strengths = []
        weaknesses = []

        if keyword_bonus > 0:
            score = min(100.0, score + keyword_bonus)
            strengths.append(f"Target job description alignment bonus: +{round(keyword_bonus, 1)} pts.")
        else:
            strengths.append("Standard technical keyword density across resume body.")

        score = round(score, 1)
        return CategoryScore(
            name="Keyword Coverage",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 1),
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=[],
            feedback="Assesses industry keyword density and terminology distribution.",
        )


scoring_service = ScoringService()

