from flask import Flask, request, send_file
from flask_cors import CORS
from pydub import AudioSegment
import io

app = Flask(__name__)
# This line enables Cross-Origin Resource Sharing (CORS) for your app
CORS(app)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    # Check if a file is present in the request
    if 'audio' not in request.files:
        return "No audio file found", 400

    file = request.files['audio']
    
    # Check if the file has a name
    if file.filename == '':
        return "No selected file", 400

    try:
        # Load the audio file from the uploaded data
        sound = AudioSegment.from_file(file)
        
        # --- Audio Processing Logic ---
        # 1. Normalize the audio to a consistent volume (-3dBFS is a good starting point)
        processed_sound = sound.normalize(headroom=3.0)
        
        # 2. Apply a high-pass filter to remove low-frequency rumble (e.g., remove frequencies below 80Hz)
        processed_sound = processed_sound.high_pass_filter(80)

        # You can chain more effects here in the future
        
        # --- Exporting the processed file ---
        # Create an in-memory binary stream to hold the processed audio
        buffer = io.BytesIO()
        processed_sound.export(buffer, format="mp3")
        buffer.seek(0) # Rewind the buffer to the beginning
        
        # Send the in-memory file back to the user
        return send_file(
            buffer, 
            as_attachment=True, 
            download_name='processed_audio.mp3', 
            mimetype='audio/mpeg'
        )

    except Exception as e:
        # Catch any errors during processing
        print(f"Error processing file: {e}")
        return "Error processing audio file", 500

if __name__ == '__main__':
    # Run the app on port 5000 and make it accessible on your network
    app.run(host='0.0.0.0', port=5000, debug=True)
