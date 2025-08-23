# app.py

import os
import time
import json
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import google.generativeai as genai  # Fixed import
from flask_cors import CORS

# Create Flask app only once
app = Flask(__name__)

# Configure CORS properly - allow all origins for development
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# --- config ---
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = "gemini-1.5-flash"  # Updated model name
ALLOWED_EXTS = {"mp4", "mov", "m4v", "webm"}

# Configure the API key
genai.configure(api_key=API_KEY)

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTS

def wait_until_active(file_obj, timeout_sec=120):
    """Poll Files API until video is ACTIVE (ready for inference)."""
    start = time.time()
    while True:
        f = genai.get_file(file_obj.name)
        if f.state.name == "ACTIVE":
            return f
        if time.time() - start > timeout_sec:
            raise TimeoutError("Video stayed in PROCESSING too long. Try a smaller file.")
        time.sleep(2)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

# Add OPTIONS method to handle preflight requests
@app.route("/score", methods=["POST", "OPTIONS"])
def score():
    # Handle preflight request
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response
    
    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()
    duration_minutes = request.form.get("duration_minutes", "").strip()
    file = request.files.get("video")

    if not (title and description and file):
        return jsonify({"error": "Missing title, description, or video file."}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type. Please upload mp4/mov/webm."}), 400

    filename = secure_filename(file.filename)
    path = Path(app.config["UPLOAD_FOLDER"]) / filename
    file.save(path)

    try:
        # 1. Upload video to Files API
        uploaded = genai.upload_file(path=str(path))

        # 2. Wait for the video to be ACTIVE (not PROCESSING)
        uploaded = wait_until_active(uploaded)

        # 3. Building the prompt
        text_prompt = f"""
You are an evaluator that assigns default points (5–100) to an online course video.

Scoring rubric (combine these signals):
1) Video length (rough guide; use your judgement):
   - <5 min → low
   - 5–20 min → medium
   - 20–60 min → higher
   - >60 min → highest
2) Metadata completeness & clarity:
   - Title quality (clear, descriptive, professional)
   - Description detail (learning outcomes, topics)
3) Content quality from the video:
   - Relevance, clarity, structure, and depth

4) Additional metrics to evaluate:
    - includes table of contents in description (+3)
    - penalize clickbait titles (−3)
    - duration sweet spot 12–25 minutes (+4)   

Rules:
- Output MUST be JSON with keys "score" (integer), "explanation" (string), and "duration" (integer).
- The score MUST be within 5–100.
- Consider the provided duration if available; otherwise infer from video content.
- Be brief but clear in the explanation.

Course metadata:
- Title: {title}
- Description: {description}
- Duration (minutes, if provided by client or inferred from video content): {duration_minutes or "unknown"}

Please respond only with valid JSON format.
"""

        # 4. Call Gemini with the video file + prompt
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content([uploaded, text_prompt])

        # 5. Parse response - try to extract JSON from the response
        try:
            # Sometimes the response might have markdown formatting, so clean it
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()
            
            data = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            data = {
                "score": 50,
                "explanation": "Could not parse AI response properly. Default score assigned.",
                "duration": duration_minutes if duration_minutes.isdigit() else "unknown"
            }

        # 6. Clamp score to [5, 100]
        raw_score = int(data.get("score", 50))
        score = max(5, min(100, raw_score))
        explanation = data.get("explanation", "No explanation.")
        duration_result = duration_minutes if duration_minutes.isdigit() else data.get("duration", "unknown")
        
        print(f"AI Response: {data}")
        
        response = jsonify({"score": score, "explanation": explanation, "duration": duration_result})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response

    except TimeoutError as te:
        response = jsonify({"error": str(te)})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 504
    except Exception as e:
        # show a little debug info
        response = jsonify({"error": f"Backend error: {e}"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 500
    finally:
        # Optional: keep or delete the local file
        try:
            os.remove(path)
        except Exception:
            pass

if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)