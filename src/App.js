import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import './App.css';
import AudioUploader from './components/AudioUploader';
import Processing from './components/Processing';
import Results from './components/Results';
import LoginModal from './components/LoginModal';

function App() {
  const [view, setView] = useState('uploader');
  const [audioFile, setAudioFile] = useState(null);
  const [user, setUser] = useState(null);
  const [trialUsed, setTrialUsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // New state to hold the URL of the processed audio from the backend
  const [processedAudioUrl, setProcessedAudioUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // This new useEffect runs when the 'view' changes to 'processing'
  useEffect(() => {
    if (view === 'processing' && audioFile) {
      const processAudio = async () => {
        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
          const response = await fetch('https://app-func-normalizeaudio.azurewebsites.net/api/normalize?', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // Get the processed audio data as a blob
          const blob = await response.blob();
          // Create a URL from the blob
          const url = URL.createObjectURL(blob);
          setProcessedAudioUrl(url);
          setView('results'); // Switch to results page on success

        } catch (error) {
          console.error('Error processing audio:', error);
          alert('Sorry, there was an error processing your audio. Please try again.');
          setView('uploader'); // Go back to uploader on error
        }
      };

      processAudio();
    }
  }, [view, audioFile]);

  const handleFileUpload = (file) => {
    if (trialUsed && !user) {
      setShowLoginModal(true);
      return;
    }
    const audioUrl = URL.createObjectURL(file);
    const audioElement = new Audio(audioUrl);
    audioElement.onloadedmetadata = () => {
      URL.revokeObjectURL(audioUrl);
      if (audioElement.duration > 120 && !user) {
        setShowLoginModal(true);
      } else {
        setAudioFile(file);
        setProcessedAudioUrl(null); // Reset previous results
        setView('processing'); // Switch to processing view to trigger the useEffect
      }
    };
  };
  
  // This function is no longer needed as the useEffect handles the view change
  // const handleProcessingComplete = () => { ... };

  const handleReset = () => {
    if (!user) {
      setTrialUsed(true);
    }
    setAudioFile(null);
    setProcessedAudioUrl(null);
    setView('uploader');
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        setShowLoginModal(false);
      }).catch((error) => {
        console.error("Popup login error:", error);
      });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const renderView = () => {
    switch (view) {
      case 'processing':
        // The processing component is now just a visual spinner
        return <Processing />;
      case 'results':
        // Pass the new processed URL to the Results component
        return <Results audioFile={audioFile} processedAudioUrl={processedAudioUrl} onReset={handleReset} />;
      case 'uploader':
      default:
        return (
          <>
            <header className="App-header">
              <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '10px', textShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}>
                Studio Sound AI
              </h1>
              <p style={{ fontSize: '1.2rem', fontWeight: '300', marginTop: '0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Upload your audio and let our AI transform it to professional quality.
              </p>
            </header>
            <AudioUploader onFileUpload={handleFileUpload} />
          </>
        );
    }
  };

  return (
    <div className="App">
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={closeLoginModal} />}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        {user ? (
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="btn btn-secondary" onClick={() => setShowLoginModal(true)}>Login</button>
        )}
      </div>
      {renderView()}
    </div>
  );
}

export default App;
