import io
from typing import Dict, List, Tuple
import fitz  # PyMuPDF
from backend.app.core.exceptions import InvalidPDFError, PDFExtractionError
from backend.app.utils.text_processing import clean_text


class PDFService:
    """Handles PDF validation, structure inspection, and text extraction using PyMuPDF."""

    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes, filename: str = "resume.pdf") -> Tuple[str, List[str], int]:
        """
        Extracts clean text and per-page text from PDF byte stream.
        Returns: (full_cleaned_text, list_of_page_texts, page_count)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            raise InvalidPDFError(
                f"Failed to parse PDF document. The file may be corrupt or encrypted: {str(e)}"
            )

        try:
            page_count = len(doc)
            if page_count == 0:
                raise InvalidPDFError("The uploaded PDF has 0 pages.")

            page_texts: List[str] = []
            full_text_parts: List[str] = []

            for page_num in range(page_count):
                page = doc.load_page(page_num)
                text = page.get_text("text")
                cleaned_page = clean_text(text)
                page_texts.append(cleaned_page)
                if cleaned_page:
                    full_text_parts.append(cleaned_page)

            doc.close()

            full_text = "\n\n".join(full_text_parts).strip()

            # Check if there is extractable text
            if not full_text:
                raise PDFExtractionError(
                    "No extractable text found in this PDF. The document appears to be a scanned image or "
                    "contains non-searchable graphical text. ResumeAI requires text-based PDFs (OCR for scanned images is not supported in this version)."
                )

            # Heuristic check for minimal reasonable content
            if len(full_text.split()) < 15:
                raise PDFExtractionError(
                    "The uploaded PDF contains insufficient text content (fewer than 15 words) to perform a meaningful career analysis."
                )

            return full_text, page_texts, page_count

        except (InvalidPDFError, PDFExtractionError):
            raise
        except Exception as e:
            raise PDFExtractionError(
                f"Unexpected error while extracting text from PDF: {str(e)}"
            )


pdf_service = PDFService()

