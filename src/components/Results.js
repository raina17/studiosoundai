import React, { useEffect, useState } from 'react';
import './Results.css';

// Component now accepts processedAudioUrl from App.js
function Results({ audioFile, processedAudioUrl, onReset }) {
  const [originalUrl, setOriginalUrl] = useState('');

  useEffect(() => {
    if (audioFile) {
      // Create a URL for the original audio file for the "Before" player
      const url = URL.createObjectURL(audioFile);
      setOriginalUrl(url);

      // Clean up the object URL when the component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedAudioUrl; // Use the URL from the backend
    link.download = `studio_sound_${audioFile.name}`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="results-container">
      <h1 className="results-main-title">Your Audio is Ready!</h1>
      <p className="results-main-subtitle">Compare the original with your new studio-quality track.</p>
      
      <div className="players-wrapper">
        <div className="player-box">
          <h3>Original</h3>
          {originalUrl && <audio controls src={originalUrl}></audio>}
        </div>
        <div className="player-box processed">
          <h3>Studio Level ✨</h3>
          {/* The "After" player now uses the URL from the backend */}
          {processedAudioUrl && <audio controls src={processedAudioUrl}></audio>}
        </div>
      </div>

      <div className="actions-wrapper">
        <button className="btn btn-primary" onClick={handleDownload} disabled={!processedAudioUrl}>Download Processed Audio</button>
        <button className="btn btn-secondary" onClick={onReset}>Process Another File</button>
      </div>
    </div>
  );
}

export default Results;