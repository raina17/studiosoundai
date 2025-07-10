from flask import Flask, request, send_file
from flask_cors import CORS
from pydub import AudioSegment
import io

app = Flask(__name__)
CORS(app)
@app.route("/")
def hello():
    return "Flask is running"

# The 'methods=['POST']' part fixes the 405 error
@app.route('/normalize', methods=['POST'])
def normalize_audio():
    if 'audio' not in request.files:
        return "No audio file found", 400

    file = request.files['audio']
    
    try:
        sound = AudioSegment.from_file(file)
        normalized_sound = sound.normalize(headroom=3.0)
        
        buffer = io.BytesIO()
        normalized_sound.export(buffer, format="mp3")
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='normalized.mp3'
        )
    except Exception as e:
        return f"Error processing file: {e}", 500

