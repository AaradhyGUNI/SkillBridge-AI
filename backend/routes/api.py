import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.pdf_extractor import extract_text_from_pdf
from services.gemini_service import GeminiService

api_bp = Blueprint('api', __name__)
gemini_service = GeminiService()

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/health', methods=['GET'])
def health_check():
    """
    GET /health
    Simple health check route to verify the API is up and running.
    Request Example:
        curl -X GET http://localhost:5000/health
    Response Example:
        {
            "status": "healthy",
            "service": "SkillBridge AI API"
        }
    """
    return jsonify({
        "status": "healthy",
        "service": "SkillBridge AI API"
    }), 200

@api_bp.route('/upload-resume', methods=['POST'])
def upload_resume():
    """
    POST /upload-resume
    Uploads a resume file (PDF only), extracts its text content, and returns it.
    Request Example:
        form-data: { "file": [PDF File] }
    Response Example:
        {
            "success": true,
            "filename": "john_doe_resume.pdf",
            "text": "John Doe\nSoftware Engineer..."
        }
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only PDF files are allowed."}), 400

    try:
        # Create uploads folder if it doesn't exist
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)

        # Save the file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(uploads_dir, filename)
        file.save(file_path)

        # Extract text from the PDF
        try:
            extracted_text = extract_text_from_pdf(file_path)
        finally:
            # Clean up the file after extraction to remain stateless
            if os.path.exists(file_path):
                os.remove(file_path)

        return jsonify({
            "success": True,
            "filename": filename,
            "text": extracted_text
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred while processing the file: {str(e)}"}), 500

@api_bp.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    """
    POST /analyze-resume
    Analyzes the resume text against the target job role.
    Request Example:
        JSON: {
            "text": "John Doe\nSoftware Engineer...",
            "role": "Full Stack Developer"
        }
    Response Example:
        {
            "ats_score": 75,
            "summary": { ... },
            ...
        }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    resume_text = data.get('text')
    target_role = data.get('role')

    if not resume_text or not resume_text.strip():
        return jsonify({"error": "Resume text is required and cannot be empty."}), 400

    if not target_role or not target_role.strip():
        return jsonify({"error": "Target job role is required."}), 400

    try:
        analysis_result = gemini_service.analyze_resume(resume_text, target_role)
        return jsonify(analysis_result), 200
    except Exception as e:
        return jsonify({"error": f"Failed to analyze resume: {str(e)}"}), 500

@api_bp.route('/generate-interview-questions', methods=['POST'])
def generate_interview_questions():
    """
    POST /generate-interview-questions
    Generates technical and HR interview questions based on the target role and optional resume.
    Request Example:
        JSON: {
            "text": "John Doe\nSoftware Engineer...",
            "role": "Full Stack Developer"
        }
    Response Example:
        {
            "technical_questions": [ ... ],
            "hr_questions": [ ... ]
        }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    target_role = data.get('role')
    resume_text = data.get('text', '')  # Optional resume context

    if not target_role or not target_role.strip():
        return jsonify({"error": "Target job role is required."}), 400

    try:
        questions_result = gemini_service.generate_interview_questions(resume_text, target_role)
        return jsonify(questions_result), 200
    except Exception as e:
        return jsonify({"error": f"Failed to generate interview questions: {str(e)}"}), 500
