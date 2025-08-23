import os
import tempfile
import subprocess
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from pathlib import Path
import whisper
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

genai.configure(api_key=GEMINI_API_KEY)

# Load Whisper model (using base model for better accuracy)
try:
    whisper_model = whisper.load_model("base")
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    whisper_model = None

def download_video_from_ipfs(ipfs_hash, output_path):
    """Download video from IPFS using the provided URL structure"""
    try:
        url = f"https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/{ipfs_hash}"
        logger.info(f"Downloading video from: {url}")
        
        response = requests.get(url, stream=True, timeout=60)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        logger.info(f"Video downloaded successfully to: {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error downloading video: {e}")
        return False

def extract_audio_from_video(video_path, audio_path):
    """Extract audio from video using ffmpeg"""
    try:
        command = [
            'ffmpeg', '-i', video_path, 
            '-vn', '-acodec', 'pcm_s16le', 
            '-ar', '16000', '-ac', '1', 
            audio_path, '-y'
        ]
        
        result = subprocess.run(command, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            logger.info(f"Audio extracted successfully to: {audio_path}")
            return True
        else:
            logger.error(f"FFmpeg error: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        logger.error("FFmpeg timeout - video too long")
        return False
    except Exception as e:
        logger.error(f"Error extracting audio: {e}")
        return False

def transcribe_audio(audio_path):
    """Transcribe audio using Whisper"""
    try:
        if not whisper_model:
            raise Exception("Whisper model not loaded")
        
        logger.info(f"Transcribing audio: {audio_path}")
        result = whisper_model.transcribe(audio_path)
        
        transcript = result["text"].strip()
        logger.info(f"Transcription completed. Length: {len(transcript)} characters")
        return transcript
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        return None

def analyze_content_with_gemini(transcript, topics):
    """Analyze transcript against topics using Gemini API"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')  # Using Gemini 1.5 Flash for faster responses
        generation_config = genai.GenerationConfig(temperature=1.0)  # Using standard temperature for consistent responses
        model.generation_config = generation_config
        
        prompt = f"""
Analyze the following video transcript and determine how well it covers each of the requested topics.

TRANSCRIPT:
{transcript}

TOPICS TO ANALYZE:
{json.dumps(topics, indent=2)}

Please provide a detailed analysis in the following JSON format:
{{
    "statistics": {{
        "totalTopics": <number of topics>,
        "topicsFound": <number of topics found>,
        "topicsMissing": <number of topics missing>,
        "coverage": <percentage coverage as integer>
    }},
    "details": [
        {{
            "topic": "<topic name>",
            "status": "found" | "missing",
            "confidence": <confidence percentage as integer 0-100>,
            "explanation": "<brief explanation of why topic was found/missing>"
        }}
    ]
}}

Guidelines:
- Mark a topic as "found" if the transcript discusses it substantially (confidence >= 60%)
- Mark as "missing" if barely mentioned or not covered (confidence < 60%)
- Confidence should reflect how thoroughly the topic is covered
- Be strict in your evaluation - partial mentions don't count as substantial coverage
- Provide clear explanations for each assessment

Respond ONLY with valid JSON, no additional text.
"""

        response = model.generate_content(prompt)
        result_text = response.text.strip()
        
        # Clean up the response to ensure it's valid JSON
        if result_text.startswith('```json'):
            result_text = result_text.replace('```json', '').replace('```', '')
        
        result = json.loads(result_text)
        logger.info("Gemini analysis completed successfully")
        return result
        
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing Gemini response as JSON: {e}")
        return create_fallback_analysis(topics)
    except Exception as e:
        logger.error(f"Error with Gemini analysis: {e}")
        return create_fallback_analysis(topics)

def create_fallback_analysis(topics):
    """Create a fallback analysis if Gemini fails"""
    return {
        "statistics": {
            "totalTopics": len(topics),
            "topicsFound": 0,
            "topicsMissing": len(topics),
            "coverage": 0
        },
        "details": [
            {
                "topic": topic,
                "status": "missing",
                "confidence": 0,
                "explanation": "Analysis failed - please try again"
            }
            for topic in topics
        ]
    }

@app.route('/process_ipfs_video', methods=['POST'])
def process_ipfs_video():
    try:
        data = request.json
        ipfs_hash = data.get('ipfsHash')
        topics = data.get('topics', [])
        
        if not ipfs_hash:
            return jsonify({"success": False, "error": "IPFS hash is required"}), 400
        
        if not topics:
            return jsonify({"success": False, "error": "At least one topic is required"}), 400
        
        # Filter out empty topics
        topics = [topic.strip() for topic in topics if topic.strip()]
        
        if not topics:
            return jsonify({"success": False, "error": "Please provide valid topics"}), 400
        
        logger.info(f"Processing video with hash: {ipfs_hash}")
        logger.info(f"Topics to analyze: {topics}")
        
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            video_path = os.path.join(temp_dir, "video.mp4")
            audio_path = os.path.join(temp_dir, "audio.wav")
            
            # Step 1: Download video from IPFS
            if not download_video_from_ipfs(ipfs_hash, video_path):
                return jsonify({"success": False, "error": "Failed to download video from IPFS"}), 500
            
            # Step 2: Extract audio from video
            if not extract_audio_from_video(video_path, audio_path):
                return jsonify({"success": False, "error": "Failed to extract audio from video"}), 500
            
            # Step 3: Transcribe audio
            transcript = transcribe_audio(audio_path)
            if not transcript:
                return jsonify({"success": False, "error": "Failed to transcribe audio"}), 500
            
            # Step 4: Analyze with Gemini
            analysis_result = analyze_content_with_gemini(transcript, topics)
            
            # Add success flag
            analysis_result["success"] = True
            
            # Print the analysis results in terminal
            print("\n=== Analysis Results ===")
            print(f"Statistics:")
            print(f"Total Topics: {analysis_result['statistics']['totalTopics']}")
            print(f"Topics Found: {analysis_result['statistics']['topicsFound']}")
            print(f"Topics Missing: {analysis_result['statistics']['topicsMissing']}")
            print(f"Coverage: {analysis_result['statistics']['coverage']}%")
            print("\nDetailed Analysis:")
            for detail in analysis_result['details']:
                print(f"\nTopic: {detail['topic']}")
                print(f"Status: {detail['status']}")
                print(f"Confidence: {detail['confidence']}%")
                print(f"Explanation: {detail['explanation']}")
            print("=====================\n")
            
            logger.info("Video processing completed successfully")
            return jsonify(analysis_result)
            
    except Exception as e:
        logger.error(f"Unexpected error processing video: {e}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "whisper_loaded": whisper_model is not None,
        "gemini_configured": bool(GEMINI_API_KEY)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)