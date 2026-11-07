import re
from typing import List, Optional, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.app.schemas.matching import JobMatchResult, SkillAnalysisItem
from backend.app.schemas.resume import ExtractedResumeData
from backend.app.utils.text_processing import (
    KNOWN_SKILLS,
    SKILL_SYNONYMS,
    clean_text,
    extract_skills_from_text,
    find_skill_matches,
)


class MatchingService:
    """Computes TF-IDF cosine similarity, semantic skill overlap, and gap analysis between resume and job description."""

    def match_resume_to_job(self, resume: ExtractedResumeData, job_description: str, job_title: str = "Target Role") -> JobMatchResult:
        cleaned_job = clean_text(job_description)
        # Build comprehensive textual corpus combining raw text and all structured entities
        full_resume_corpus = (
            resume.raw_text
            + "\n"
            + " ".join(resume.technical_skills)
            + "\n"
            + " ".join([f"{e.role} {e.company} " + " ".join(e.highlights) for e in resume.work_experience])
            + "\n"
            + " ".join([f"{p.title} {p.description or ''} " + " ".join(p.technologies) + " " + " ".join(p.highlights) for p in resume.projects])
            + "\n"
            + " ".join([f"{ed.degree or ''} {ed.field_of_study or ''} {ed.institution}" for ed in resume.education])
        )
        cleaned_resume = clean_text(full_resume_corpus)

        if not cleaned_job or len(cleaned_job.split()) < 5:
            return JobMatchResult(
                match_score=0.0,
                text_similarity_score=0.0,
                skills_match_score=0.0,
                matching_skills=[],
                missing_skills=[],
                related_skills=[],
                skills_requiring_confirmation=[],
                detailed_skill_gap=[],
                relevant_experience_matches=[],
                relevant_project_matches=[],
                keyword_overlap=[],
                recommendations=["Please provide a complete job description with role duties and requirements to run matching."],
            )

        # 1. TF-IDF and Cosine Similarity Calculation
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=1000)
        tfidf_matrix = vectorizer.fit_transform([cleaned_resume, cleaned_job])
        raw_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        # Scale cosine similarity: standard resume-JD raw cosine is typically 0.15 - 0.55
        # Transform into a normalized 0 - 100 range
        text_similarity_score = round(min(100.0, max(0.0, (raw_sim / 0.65) * 100)), 1)

        # 2. Extract keywords and skills from Job Description
        job_skills = self._extract_job_skills(cleaned_job)
        if not job_skills:
            # Fallback to general known skills found in job text
            job_skills = extract_skills_from_text(cleaned_job)

        # 3. Categorize Skill Matches & Gaps
        matched_skills, missing_skills, related_skills = find_skill_matches(cleaned_resume, job_skills)

        # Cross-reference with explicitly extracted technical skills
        existing_skills_lower = {s.lower() for s in resume.technical_skills}
        for skill in list(missing_skills):
            if skill.lower() in existing_skills_lower:
                missing_skills.remove(skill)
                if skill not in matched_skills:
                    matched_skills.append(skill)
        matched_skills = sorted(matched_skills)

        # Also check for skills requiring confirmation (e.g. tools that appear in related context)
        confirmation_skills: List[str] = []
        for s in related_skills:
            if s not in matched_skills and s not in missing_skills:
                confirmation_skills.append(s)

        # 4. Detailed Skill Gap Items
        detailed_skill_gap: List[SkillAnalysisItem] = []
        for skill in matched_skills:
            evidence = self._find_context_snippet(cleaned_resume, skill)
            job_context = self._find_context_snippet(cleaned_job, skill)
            detailed_skill_gap.append(
                SkillAnalysisItem(
                    name=skill,
                    status="matched",
                    importance="critical" if any(w in cleaned_job.lower() for w in ["required", "must have", "essential"]) else "preferred",
                    why_it_matters=f"Core competency explicitly highlighted in the {job_title} specification.",
                    job_evidence=job_context or f"Identified as requirement in job posting: {skill}",
                    resume_evidence=evidence or f"Documented in your resume: {skill}",
                    learning_recommendation=None,
                )
            )

        for skill in missing_skills:
            job_context = self._find_context_snippet(cleaned_job, skill)
            detailed_skill_gap.append(
                SkillAnalysisItem(
                    name=skill,
                    status="missing",
                    importance="critical" if any(w in cleaned_job.lower() for w in ["required", "must have", "minimum", "essential"]) else "preferred",
                    why_it_matters=f"Frequently referenced in the target requirements for {job_title}.",
                    job_evidence=job_context or f"Requested qualification: {skill}",
                    resume_evidence=None,
                    learning_recommendation=f"If you have hands-on experience with {skill}, add specific projects or highlights showcasing it. If learning, practice via hands-on exercises before claiming proficiency.",
                )
            )

        for skill in related_skills:
            job_context = self._find_context_snippet(cleaned_job, skill)
            detailed_skill_gap.append(
                SkillAnalysisItem(
                    name=skill,
                    status="related",
                    importance="preferred",
                    why_it_matters=f"Related technology to the role's core ecosystem.",
                    job_evidence=job_context or f"Associated tech: {skill}",
                    resume_evidence=f"Partial or related concepts detected in resume.",
                    learning_recommendation=f"Verify if your familiarity with related tools translates directly to {skill}.",
                )
            )

        # 5. Skills Match Score (0 - 100)
        total_skills_count = len(job_skills)
        if total_skills_count > 0:
            skills_ratio = (len(matched_skills) + (0.5 * len(related_skills))) / total_skills_count
            skills_match_score = round(min(100.0, skills_ratio * 100), 1)
        else:
            skills_match_score = text_similarity_score

        # 6. Combined Job Match Score: 50% Skills Match + 50% Text Similarity
        overall_match_score = round((0.55 * skills_match_score) + (0.45 * text_similarity_score), 1)

        # 7. Relevant Experience & Projects Matching
        relevant_exp_matches = self._find_relevant_experiences(resume, cleaned_job)
        relevant_proj_matches = self._find_relevant_projects(resume, cleaned_job)

        # 8. Keyword Overlap
        feature_names = vectorizer.get_feature_names_out()
        tfidf_dense = tfidf_matrix.toarray()
        shared_terms = []
        for i, term in enumerate(feature_names):
            if tfidf_dense[0, i] > 0 and tfidf_dense[1, i] > 0 and len(term) > 3:
                shared_terms.append(term)
        shared_terms = sorted(shared_terms, key=lambda t: -(tfidf_dense[0, list(feature_names).index(t)] * tfidf_dense[1, list(feature_names).index(t)]))[:15]

        # 9. Prioritized Recommendations
        recommendations = []
        if missing_skills:
            top_missing = ", ".join(missing_skills[:3])
            recommendations.append(f"Target Role Gap: If you have experience with {top_missing}, ensure they are explicitly listed in your skills or project bullets.")
        if text_similarity_score < 50:
            recommendations.append("Align resume vocabulary: Mirror the industry terminology and role-specific action verbs found in this job posting.")
        if not relevant_exp_matches and resume.work_experience:
            recommendations.append("Highlight transferable duties in your work experience that directly address the primary responsibilities of this position.")

        return JobMatchResult(
            match_score=overall_match_score,
            text_similarity_score=text_similarity_score,
            skills_match_score=skills_match_score,
            matching_skills=matched_skills,
            missing_skills=missing_skills,
            related_skills=related_skills,
            skills_requiring_confirmation=confirmation_skills,
            detailed_skill_gap=detailed_skill_gap,
            relevant_experience_matches=relevant_exp_matches,
            relevant_project_matches=relevant_proj_matches,
            keyword_overlap=shared_terms,
            recommendations=recommendations,
        )

    def _extract_job_skills(self, job_text: str) -> List[str]:
        lower_job = " " + job_text.lower() + " "
        found: List[str] = []
        for skill in KNOWN_SKILLS:
            pattern = r"(?<![a-zA-Z0-9_\-\.])" + re.escape(skill) + r"(?![a-zA-Z0-9_\-\.])"
            if re.search(pattern, lower_job):
                found.append(skill.title() if len(skill) > 3 and not skill.endswith(".js") else skill)
        return sorted(list(set(found)))

    def _find_context_snippet(self, text: str, keyword: str) -> Optional[str]:
        lines = text.split("\n")
        pattern = re.compile(r"\b" + re.escape(keyword) + r"\b", re.IGNORECASE)
        for line in lines:
            if pattern.search(line):
                cleaned = line.strip(" •-*")
                if len(cleaned) > 10:
                    return cleaned[:140]
        return None

    def _find_relevant_experiences(self, resume: ExtractedResumeData, job_text: str) -> List[str]:
        matches: List[str] = []
        job_words = set(re.findall(r"\b[a-zA-Z]{4,}\b", job_text.lower()))

        for exp in resume.work_experience:
            role_words = set(re.findall(r"\b[a-zA-Z]{4,}\b", (exp.role + " " + " ".join(exp.highlights)).lower()))
            overlap = role_words.intersection(job_words)
            if len(overlap) >= 5:
                matches.append(f"{exp.role} at {exp.company} (shares key terminology with target job duties)")

        return matches[:3]

    def _find_relevant_projects(self, resume: ExtractedResumeData, job_text: str) -> List[str]:
        matches: List[str] = []
        job_lower = job_text.lower()

        for proj in resume.projects:
            tech_match = any(t.lower() in job_lower for t in proj.technologies)
            if tech_match or any(w in job_lower for w in proj.title.lower().split() if len(w) > 4):
                matches.append(f"{proj.title} (demonstrates technologies requested in this job posting)")

        return matches[:3]


matching_service = MatchingService()

