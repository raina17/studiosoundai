# Start with the official Python Function App image from Microsoft
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# Set the main working directory in the container
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
WORKDIR /home/site/wwwroot

# Use the Linux package manager (apt-get) to install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy your requirements file into the container
COPY requirements.txt .
# Install the Python packages
RUN pip install -r requirements.txt

# Copy the rest of your function code into the container
COPY . .