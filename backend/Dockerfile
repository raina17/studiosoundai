FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port Gunicorn will run on
EXPOSE 8000

# Run the Flask app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]