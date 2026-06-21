import os
import pdfplumber

def extract_text_from_pdf(file_path):
    """
    Extracts text from a PDF file using pdfplumber.
    Handles corrupted files, empty files, and general extraction errors.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError("The uploaded file could not be found on the server.")

    if not file_path.lower().endswith('.pdf'):
        raise ValueError("Invalid file format. Only PDF files are allowed.")

    extracted_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            if not pdf.pages:
                raise ValueError("The PDF file contains no pages.")
            
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        cleaned_text = extracted_text.strip()
        if not cleaned_text:
            raise ValueError("No text content could be extracted. The PDF may be scanned (image-only) or empty.")

        return cleaned_text

    except Exception as e:
        # Catch standard pdfplumber or zipfile errors (which indicate corruption)
        if "empty" in str(e).lower() or "no pages" in str(e).lower() or "scanned" in str(e).lower():
            raise ValueError(str(e))
        raise RuntimeError(f"Error parsing PDF file (it may be corrupted): {str(e)}")
