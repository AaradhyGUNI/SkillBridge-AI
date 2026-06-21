import os
import json
import google.generativeai as genai

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.5-flash-lite')
                print("Gemini API service initialized successfully.")
            except Exception as e:
                print(f"Error configuring Gemini API. Falling back to MOCK mode. Error: {e}")
                self.model = None
        else:
            self.model = None
            print("WARNING: GEMINI_API_KEY is not configured. Running in MOCK fallback mode.")

    def analyze_resume(self, resume_text, target_role):
        """
        Analyzes the resume text against the target job role using Gemini API.
        Guarantees structured JSON return, falling back to mock on failure.
        """
        if not self.model:
            return self._mock_analysis(resume_text, target_role)

        prompt = f"""
You are an expert technical recruiter, career coach, and ATS (Applicant Tracking System) parser.
Analyze the following candidate's resume text against the target role: "{target_role}".

Resume Text:
---
{resume_text}
---

Your response must be a JSON object with the exact keys:
1. "ats_score": Integer (0-100) indicating overall compliance and match for this target role.
2. "score_breakdown": JSON object with exactly these keys:
   - "contact_information": Integer (0-100)
   - "education": Integer (0-100)
   - "skills": Integer (0-100)
   - "projects": Integer (0-100)
   - "experience": Integer (0-100)
   - "certifications": Integer (0-100)
   - "resume_structure": Integer (0-100)
   - "resume_completeness": Integer (0-100)
3. "strengths": Array of strings (at least 3 detailed strengths related to target role).
4. "weaknesses": Array of strings (at least 3 key gaps or areas of improvement).
5. "summary": JSON object with exactly these keys:
   - "candidate_profile": Concise professional bio summary.
   - "technical_strengths": Major technical expertise.
   - "career_focus": Suggested direction or alignment.
   - "key_highlights": Key highlights or accomplishments.
6. "extracted_skills": JSON object with categories as arrays of strings. Extract these dynamically from the resume. Categories:
   - "programming_languages"
   - "frameworks"
   - "databases"
   - "tools"
   - "cloud_technologies"
7. "matching_skills": Array of skills found in the resume that match the target role requirements.
8. "missing_skills": Array of skills highly critical/recommended for target role that are missing from the resume.
9. "skill_gap_analysis": Detailed narrative explanation of the skill alignment and gaps.
10. "recommendations": Array of actionable and specific suggestions to improve the resume (ATS tuning, phrasing, project improvements, missing sections).
11. "learning_roadmap": JSON object with exactly these keys:
    - "skills_to_learn": Array of objects: {{"skill": string, "priority": "High"|"Medium"|"Low", "timeframe": string}}
    - "free_resources": Array of objects: {{"name": string, "url": string}} (suggest real learning sites or official docs)
    - "recommended_certifications": Array of strings.
    - "recommended_projects": Array of strings.
    - "career_growth_path": String.

Return ONLY a valid JSON string. Do not wrap it in markdown block tags like ```json. Do not include any preamble or postamble text.
"""
        try:
            print("=== USING REAL GEMINI API ===")

            # Generate JSON content
            response = self.model.generate_content(prompt)

            print("=== GEMINI API RESPONSE ===")
            return json.loads(response.text)
        except Exception as e:
            print("===GEMINI FAILED")
            print(e)
            print(f"Gemini API call failed, falling back to mock. Error: {e}")
            return self._mock_analysis(resume_text, target_role)

    def generate_interview_questions(self, resume_text, target_role):
        """
        Generates role-specific technical and HR interview questions based on the resume.
        """
        if not self.model:
            return self._mock_questions(target_role)

        prompt = f"""
You are an expert technical interviewer and HR panelist.
Generate 10 technical questions and 5 HR/behavioral questions based on the candidate's resume context and target job role: "{target_role}".

Resume Text (for context):
---
{resume_text}
---

Your response must be a JSON object with the exact keys:
1. "technical_questions": Array of 10 objects:
   - "id": Integer
   - "question": String
   - "difficulty": "Beginner" | "Intermediate" | "Advanced"
   - "answer_outline": String (brief outline or guidelines for an excellent answer)
2. "hr_questions": Array of 5 objects:
   - "id": Integer
   - "question": String
   - "difficulty": "Beginner" | "Intermediate" | "Advanced"
   - "answer_outline": String (tips on how to answer effectively)

Return ONLY a valid JSON string. Do not wrap it in markdown. Do not include any notes or explanations.
"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API call failed, falling back to mock. Error: {e}")
            return self._mock_questions(target_role)

    def _mock_analysis(self, resume_text, target_role):
        """Fallback analysis mock when API key is missing or calls fail."""
        return {
            "ats_score": 75,
            "score_breakdown": {
                "contact_information": 90,
                "education": 80,
                "skills": 70,
                "projects": 75,
                "experience": 65,
                "certifications": 50,
                "resume_structure": 85,
                "resume_completeness": 80
            },
            "strengths": [
                "Clear structure and formatting",
                "Strong foundation in programming basics",
                "Good project descriptions with tech stacks specified"
            ],
            "weaknesses": [
                "Missing key certifications related to the target role",
                "Work experience descriptions lack metrics and quantifiable impact",
                "Some key cloud and DevOps tools are missing"
            ],
            "summary": {
                "candidate_profile": "Enthusiastic developer with experience building web applications and exploring modern technologies.",
                "technical_strengths": "Strong proficiency in JavaScript, React, and Python with database experience in MySQL.",
                "career_focus": f"Seeking to establish a career as a {target_role} by applying technical expertise.",
                "key_highlights": "Designed a full-stack task manager application; optimized database queries reducing search load by 15%."
            },
            "extracted_skills": {
                "programming_languages": ["Python", "JavaScript", "SQL", "HTML/CSS"],
                "frameworks": ["React", "Flask", "Node.js"],
                "databases": ["MySQL", "MongoDB"],
                "tools": ["Git", "GitHub", "Postman"],
                "cloud_technologies": []
            },
            "matching_skills": ["Python", "JavaScript", "React", "Flask", "SQL", "Git", "GitHub"],
            "missing_skills": ["Docker", "AWS/Google Cloud", "CI/CD (Jenkins/GitHub Actions)", "TypeScript", "Tailwind CSS"],
            "skill_gap_analysis": f"The candidate has strong frontend and core backend skills, but shows a gap in cloud deployment, virtualization (Docker), and modern styling frameworks (Tailwind CSS) which are highly recommended for the target role of {target_role}.",
            "recommendations": [
                "Add a dedicated Cloud/DevOps section mentioning Docker and AWS basics.",
                "Incorporate Tailwind CSS into one of the key frontend projects.",
                "Rewrite experience bullet points using the XYZ formula (e.g., Accomplished [X], as measured by [Y], by doing [Z])."
            ],
            "learning_roadmap": {
                "skills_to_learn": [
                    {"skill": "Tailwind CSS", "priority": "High", "timeframe": "1 week"},
                    {"skill": "Docker & Containerization", "priority": "Medium", "timeframe": "2 weeks"},
                    {"skill": "AWS Cloud Foundations", "priority": "High", "timeframe": "3 weeks"}
                ],
                "free_resources": [
                    {"name": "Tailwind CSS Official Docs & Video Tutorials", "url": "https://tailwindcss.com/docs"},
                    {"name": "Docker for Beginners - FreeCodeCamp", "url": "https://www.youtube.com/watch?v=fqmDMSd187I"},
                    {"name": "AWS Certified Cloud Practitioner Course", "url": "https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-study-course-pass-the-exam/"}
                ],
                "recommended_certifications": [
                    "AWS Certified Cloud Practitioner",
                    "HashiCorp Certified: Terraform Associate"
                ],
                "recommended_projects": [
                    "Deploy your current React app to AWS using S3 and CloudFront, containerizing the backend using Docker.",
                    "Build a fully responsive portfolio site using React and Tailwind CSS."
                ],
                "career_growth_path": f"Junior Developer -> Software Engineer -> Senior {target_role} / Technical Lead"
            }
        }

    def _mock_questions(self, target_role):
        """Fallback interview questions mock."""
        return {
            "technical_questions": [
                {
                    "id": 1,
                    "question": "What is the difference between Virtual DOM and Real DOM in React?",
                    "difficulty": "Beginner",
                    "answer_outline": "Virtual DOM is a lightweight copy of the Real DOM. React uses it to track changes and perform batch updates, which improves rendering speed and performance."
                },
                {
                    "id": 2,
                    "question": f"Explain how you would design routing and middleware handling in a {target_role} environment.",
                    "difficulty": "Intermediate",
                    "answer_outline": "Detail standard routing frameworks, routing hooks/decorators, session management, token-based verification checks, and cross-origin resource sharing controls."
                },
                {
                    "id": 3,
                    "question": "How would you design a database schema to store structured resume data, and how would you optimize queries on it?",
                    "difficulty": "Advanced",
                    "answer_outline": "Define tables for Candidates, Resumes, Skills, and Experience with proper foreign keys. Optimize using indexes on search fields (e.g., candidate_id, role) and using query caching."
                },
                {
                    "id": 4,
                    "question": "What are React Hooks? Explain the dependency array in useEffect.",
                    "difficulty": "Beginner",
                    "answer_outline": "Hooks let functional components use state and lifecycle features. The dependency array tells React when to re-run the effect: empty runs once, specific values trigger on change."
                },
                {
                    "id": 5,
                    "question": "Explain the difference between SQL and NoSQL databases. When would you use MongoDB over MySQL?",
                    "difficulty": "Intermediate",
                    "answer_outline": "SQL (MySQL) is relational, structured, and ACID-compliant. NoSQL (MongoDB) is document-oriented and scales horizontally. Use MongoDB for flexible, unstructured data or high-write loads."
                },
                {
                    "id": 6,
                    "question": "What is CORS (Cross-Origin Resource Sharing), and why is it important in web development?",
                    "difficulty": "Beginner",
                    "answer_outline": "CORS is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page. Configured via headers on backend."
                },
                {
                    "id": 7,
                    "question": "How do you secure a REST API (e.g., handling authentication and rate limiting)?",
                    "difficulty": "Advanced",
                    "answer_outline": "Use JWT tokens or OAuth, HTTPS, input validation/sanitization, rate limiting via middleware, and protection against common OWASP Top 10 vulnerabilities."
                },
                {
                    "id": 8,
                    "question": "What is a GIL (Global Interpreter Lock) in Python, and how does it affect multi-threading?",
                    "difficulty": "Advanced",
                    "answer_outline": "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. Affects CPU-bound tasks; use multiprocessing instead."
                },
                {
                    "id": 9,
                    "question": "How does Git merge conflict resolution work?",
                    "difficulty": "Beginner",
                    "answer_outline": "Occurs when changes are made to the same line of a file in different branches. Git marks the conflict, and developers must manually choose which changes to keep and commit."
                },
                {
                    "id": 10,
                    "question": "Describe the difference between state and props in React.",
                    "difficulty": "Beginner",
                    "answer_outline": "State represents local component data that can change over time. Props are read-only properties passed down from parent components to child components."
                }
            ],
            "hr_questions": [
                {
                    "id": 1,
                    "question": f"Why are you interested in the target role of {target_role}?",
                    "difficulty": "Beginner",
                    "answer_outline": "Discuss alignment between your technical skill set, career aspirations, and the demands/innovative opportunities presented by this specific role."
                },
                {
                    "id": 2,
                    "question": "Describe a difficult technical challenge you faced in one of your projects and how you resolved it.",
                    "difficulty": "Intermediate",
                    "answer_outline": "Use the STAR method (Situation, Task, Action, Result) to explain the problem, your action plan, technologies used, and the positive outcome."
                },
                {
                    "id": 3,
                    "question": "How do you keep your technical skills up to date with rapidly evolving industry trends?",
                    "difficulty": "Beginner",
                    "answer_outline": "Mention specific developer blogs, tech newsletters, online platforms (e.g. Medium, Dev.to), open-source contributions, or online learning sites."
                },
                {
                    "id": 4,
                    "question": "Tell me about a time you had to work with a difficult teammate or handle a conflict.",
                    "difficulty": "Intermediate",
                    "answer_outline": "Focus on active listening, empathy, open and professional communication, and finding a collaborative compromise that prioritized the project's success."
                },
                {
                    "id": 5,
                    "question": "Where do you see yourself in five years, technically and professionally?",
                    "difficulty": "Intermediate",
                    "answer_outline": "Discuss your goal of mastering full-stack/cloud development, taking on technical leadership tasks, mentoring junior developers, and driving architectural decisions."
                }
            ]
        }
