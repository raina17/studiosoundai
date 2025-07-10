import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './AudioUploader.css';

// The component now accepts an 'onFileUpload' prop from App.js
function AudioUploader({ onFileUpload }) { 
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      // Pass the first accepted file to the parent component (App.js)
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/flac': ['.flac'],
      'audio/x-m4a': ['.m4a'],
    },
    multiple: false // Ensure only one file can be uploaded
  });

  const uploaderBoxClass = `uploader-box ${isDragAccept ? 'drag-accept' : ''} ${isDragReject ? 'drag-reject' : ''}`;

  return (
    <div className="uploader-container">
      <div {...getRootProps()} className={uploaderBoxClass}>
        <input {...getInputProps()} />
        <div className="uploader-icon">
           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        {
          isDragActive ?
            (isDragAccept ? <h2 className="uploader-title">Drop it here!</h2> : <h2 className="uploader-title">Unsupported file type...</h2>) :
            <h2 className="uploader-title">Drag & Drop Your Audio File</h2>
        }
        <p className="uploader-subtitle">or click to browse</p>
        <p className="uploader-formats">Supported formats: MP3, WAV, FLAC, M4A</p>
      </div>
    </div>
  );
}

export default AudioUploader;