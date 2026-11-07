import datetime
import io
from typing import List, Optional
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from backend.app.schemas.analysis import AIResumeAnalysis
from backend.app.schemas.ats import ATSReadinessResult
from backend.app.schemas.matching import JobMatchResult
from backend.app.schemas.resume import ExtractedResumeData


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and print 'Page X of Y'."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count: int):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#71717A"))
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 36, page_str)
        self.drawString(54, 36, "ResumeAI — Career Intelligence & Job Matching Platform")
        self.setStrokeColor(colors.HexColor("#E4E4E7"))
        self.setLineWidth(0.5)
        self.line(54, 48, letter[0] - 54, 48)
        self.restoreState()


class ReportService:
    """Generates a professional, branded PDF Career Intelligence Report using ReportLab."""

    def generate_report(
        self,
        resume_data: ExtractedResumeData,
        analysis: AIResumeAnalysis,
        ats_result: ATSReadinessResult,
        match_result: Optional[JobMatchResult] = None,
        job_title: Optional[str] = None,
    ) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=54,
            rightMargin=54,
            topMargin=54,
            bottomMargin=60,
        )

        styles = getSampleStyleSheet()

        # Custom Brand Styles
        brand_title_style = ParagraphStyle(
            "BrandTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#4F46E5"),  # Indigo
        )

        subtitle_style = ParagraphStyle(
            "SubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#71717A"),
        )

        h1_style = ParagraphStyle(
            "Heading1",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0F172A"),
            spaceBefore=14,
            spaceAfter=6,
        )

        h2_style = ParagraphStyle(
            "Heading2",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#334155"),
            spaceBefore=8,
            spaceAfter=4,
        )

        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#334155"),
        )

        callout_style = ParagraphStyle(
            "Callout",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#64748B"),
        )

        story = []

        # 1. Header Banner
        analysis_date = datetime.datetime.now().strftime("%B %d, %Y")
        candidate_name = resume_data.contact.name or "Candidate"
        
        header_table = Table(
            [
                [
                    Paragraph("<b>ResumeAI</b> Intelligence Report", brand_title_style),
                    Paragraph(f"<b>Date:</b> {analysis_date}<br/><b>Target:</b> {job_title or 'General Role'}", subtitle_style),
                ]
            ],
            colWidths=[330, 174],
        )
        header_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ])
        )
        story.append(header_table)
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4F46E5"), spaceAfter=14))

        # 2. Executive Overview & Scores Table
        story.append(Paragraph("1. Executive Quality & ATS Summary", h1_style))
        story.append(Paragraph(analysis.executive_summary, body_style))
        story.append(Spacer(1, 10))

        # Score cards in a clean 3-column table
        match_score_str = f"{match_result.match_score:.1f}%" if match_result else "N/A"
        score_data = [
            [
                Paragraph("<b>Resume Quality Score</b>", h2_style),
                Paragraph("<b>ATS Readiness Score</b>", h2_style),
                Paragraph("<b>Target Job Match</b>", h2_style),
            ],
            [
                Paragraph(f"<font size=18 color='#4F46E5'><b>{analysis.quality_score.overall_score:.1f} / 100</b></font><br/><font size=8 color='#64748B'>{analysis.quality_score.rating_label}</font>", body_style),
                Paragraph(f"<font size=18 color='#059669'><b>{ats_result.ats_score:.1f} / 100</b></font><br/><font size=8 color='#64748B'>{ats_result.status}</font>", body_style),
                Paragraph(f"<font size=18 color='#2563EB'><b>{match_score_str}</b></font><br/><font size=8 color='#64748B'>TF-IDF & Overlap</font>", body_style),
            ],
        ]
        score_table = Table(score_data, colWidths=[168, 168, 168])
        score_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 8),
                ("ALIGN", (0, 1), (-1, 1), "CENTER"),
            ])
        )
        story.append(score_table)
        story.append(Spacer(1, 12))

        # 3. Transparent Quality Score Breakdown Table
        story.append(Paragraph("2. Heuristic Scoring Breakdown", h1_style))
        breakdown_rows = [
            [
                Paragraph("<b>Category</b>", h2_style),
                Paragraph("<b>Weight</b>", h2_style),
                Paragraph("<b>Score</b>", h2_style),
                Paragraph("<b>Weighted Score</b>", h2_style),
                Paragraph("<b>Summary Evaluation</b>", h2_style),
            ]
        ]
        cats = [
            analysis.quality_score.breakdown.skills_relevance,
            analysis.quality_score.breakdown.experience_quality,
            analysis.quality_score.breakdown.project_quality,
            analysis.quality_score.breakdown.education_certifications,
            analysis.quality_score.breakdown.resume_structure,
            analysis.quality_score.breakdown.keyword_coverage,
        ]
        for c in cats:
            breakdown_rows.append([
                Paragraph(c.name, body_style),
                Paragraph(f"{int(c.weight * 100)}%", body_style),
                Paragraph(f"{c.score:.1f}/100", body_style),
                Paragraph(f"{c.weighted_score:.1f}", body_style),
                Paragraph(c.feedback, body_style),
            ])

        breakdown_table = Table(breakdown_rows, colWidths=[130, 45, 55, 65, 209])
        breakdown_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2FF")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ])
        )
        story.append(breakdown_table)
        story.append(Spacer(1, 12))

        # 4. Key Strengths & Areas for Improvement
        story.append(Paragraph("3. Core Strengths & Weaknesses", h1_style))
        strengths_p = "<br/>".join([f"• <b>Strength:</b> {s}" for s in analysis.key_strengths[:4]])
        weaknesses_p = "<br/>".join([f"• <b>Area to Address:</b> {w}" for w in analysis.critical_weaknesses[:4]])

        sw_table = Table(
            [
                [Paragraph("<b>Demonstrated Strengths</b>", h2_style), Paragraph("<b>Critical Weaknesses</b>", h2_style)],
                [Paragraph(strengths_p, body_style), Paragraph(weaknesses_p, body_style)],
            ],
            colWidths=[252, 252],
        )
        sw_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F0FDF4")),
                ("BACKGROUND", (1, 0), (1, -1), colors.HexColor("#FEF2F2")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ])
        )
        story.append(sw_table)
        story.append(Spacer(1, 12))

        # 5. Suggested Bullet Point Rewrites
        if analysis.bullet_rewrites:
            story.append(Paragraph("4. Suggested Bullet Point Rewrites (User Verification Required)", h1_style))
            story.append(Paragraph("The following rewrites demonstrate how to apply strong action verbs and outcome metrics. Verify and adapt these to reflect your exact contributions:", callout_style))
            story.append(Spacer(1, 6))

            for b in analysis.bullet_rewrites[:3]:
                bullet_block = [
                    Paragraph(f"<b>Original:</b> {b.original}", body_style),
                    Spacer(1, 3),
                    Paragraph(f"<b>Suggested Rewrite:</b> <font color='#4F46E5'>{b.suggested}</font>", body_style),
                    Spacer(1, 2),
                    Paragraph(f"<i>Rationale: {b.rationale}</i>", callout_style),
                ]
                card_table = Table([[bullet_block]], colWidths=[504])
                card_table.setStyle(
                    TableStyle([
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                        ("PADDING", (0, 0), (-1, -1), 6),
                    ])
                )
                story.append(card_table)
                story.append(Spacer(1, 6))

        # 6. ATS Readiness & Formatting Check
        story.append(Spacer(1, 8))
        story.append(Paragraph("5. Heuristic ATS Readiness Findings", h1_style))
        ats_findings = []
        for s in ats_result.sections_checked:
            status_color = "#059669" if s.status == "optimized" else ("#D97706" if s.status == "warning" else "#DC2626")
            ats_findings.append(f"• <b>{s.section_name}:</b> <font color='{status_color}'>{s.status.upper()}</font> — {', '.join(s.findings or s.suggestions)}")
        
        story.append(Paragraph("<br/>".join(ats_findings), body_style))

        if ats_result.formatting_warnings:
            story.append(Spacer(1, 6))
            warn_p = "<br/>".join([f"• <b>Warning:</b> {w}" for w in ats_result.formatting_warnings])
            story.append(Paragraph(f"<b>Parser Warnings:</b><br/>{warn_p}", callout_style))

        # 7. Job Matching & Skill Gap Analysis (if available)
        if match_result and match_result.matching_skills:
            story.append(Spacer(1, 10))
            story.append(Paragraph("6. Target Job Matching & Skill Gaps", h1_style))
            matched_str = ", ".join(match_result.matching_skills[:12]) or "None"
            missing_str = ", ".join(match_result.missing_skills[:10]) or "None"

            match_box = [
                Paragraph(f"<b>Role:</b> {job_title or 'Target Job Opportunity'}", h2_style),
                Paragraph(f"<b>Matching Skills Found:</b> {matched_str}", body_style),
                Spacer(1, 4),
                Paragraph(f"<b>Missing Target Skills:</b> <font color='#DC2626'>{missing_str}</font>", body_style),
            ]
            match_table = Table([[match_box]], colWidths=[504])
            match_table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("PADDING", (0, 0), (-1, -1), 8),
                ])
            )
            story.append(match_table)

        # 8. Prioritized Recommendations
        story.append(Spacer(1, 10))
        story.append(Paragraph("7. Prioritized Action Recommendations", h1_style))
        rec_items = []
        for r in analysis.recommendations[:4]:
            rec_items.append(f"• [<b>{r.priority.upper()}</b>] <b>{r.title}</b> ({r.relevant_section}): {r.suggested_action}")
        story.append(Paragraph("<br/>".join(rec_items), body_style))

        # 9. Scoring Methodology Disclaimer
        story.append(Spacer(1, 16))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=8))
        disclaimer_text = (
            "<b>Important Limitations & Methodology Notice:</b><br/>"
            "ResumeAI quality scores, ATS readiness evaluations, and Job Match scores are heuristic estimates "
            "based on structural guidelines, terminology taxonomies, and TF-IDF text similarity algorithms. "
            "They do not guarantee employment, interview callbacks, or replication of proprietary vendor ATS algorithms. "
            "Never fabricate or exaggerate accomplishments when updating your resume."
        )
        story.append(Paragraph(disclaimer_text, callout_style))

        # Build document
        doc.build(story, canvasmaker=NumberedCanvas)
        return buffer.getvalue()


report_service = ReportService()

