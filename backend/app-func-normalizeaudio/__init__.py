import logging
import azure.functions as func
from pydub import AudioSegment
import io

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger for NormalizeAudio processed a request.')

    try:
        file = req.files.get('audio')
        if not file:
            return func.HttpResponse("No audio file found", status_code=400)

        # Load audio file from memory
        sound = AudioSegment.from_file(file)

        # Normalize the sound to a standard -3.0 dBFS
        normalized_sound = sound.normalize(headroom=3.0)

        # Export the processed sound to an in-memory buffer
        buffer = io.BytesIO()
        normalized_sound.export(buffer, format="mp3")
        buffer.seek(0)

        # Return the processed file
        return func.HttpResponse(
            body=buffer.read(),
            mimetype='audio/mpeg',
            headers={
                'Content-Disposition': 'attachment; filename="normalized.mp3"'
            }
        )

    except Exception as e:
        logging.error(f"Error processing file: {e}")
        return func.HttpResponse("Error processing audio file.", status_code=500)