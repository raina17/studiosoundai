FROM mcr.microsoft.com/azure-functions/python:4-python3.11

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
WORKDIR /home/site/wwwroot

# Install FFmpeg from the Linux package manager
RUN apt-get update && apt-get install -y ffmpeg

# Install Python packages
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of your function code
COPY . .