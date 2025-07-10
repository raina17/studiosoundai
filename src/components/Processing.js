import React from 'react';
import './Processing.css';

function Processing() {
  // This component is now just a visual spinner.
  // The old useEffect with the timer has been removed.
  return (
    <div className="processing-container">
      <div className="spinner"></div>
      <h2 className="processing-title">Enhancing your audio...</h2>
      <p className="processing-subtitle">Applying AI noise reduction & mastering.</p>
    </div>
  );
}

export default Processing;