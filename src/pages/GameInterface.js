import { useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import '../styles/GameInterface.css';

function GameInterface() {
  const location = useLocation();
  const { nickname, avatar } = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const fileInputRef = useRef(null);
  

  // Redirect if no nickname
  if (!nickname) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      // Here you can handle the selected files
      console.log('Selected files:', files);
      // You can process files here or send them to a server
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks(current => [...current, event.data]);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          // Here you can handle the recorded audio
          console.log('Recording finished:', audioUrl);
          setAudioChunks([]);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="game-container">

    <div className="fixed-hamburger">
      <button className="sidebar-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
    </div>

      <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
        <div className="sidebar-top">
          <button className="sidebar-btn" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="sidebar-actions">
            <button className="sidebar-btn">
              <i className="fas fa-search"></i>
            </button>
            <button className="sidebar-btn">
              <i className="fas fa-pen-to-square"></i>
            </button>
          </div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item">
            <i className="fas fa-wifi"></i>
            <span>Explore Network</span>
          </div>
          <div className="menu-item">
            <i className="fas fa-users"></i>
            <span>Connected Users</span>
          </div>
        </div>
        
        {/* File Section */}
        <div className="file-section">
          <div className="file-header">
            <i className="fas fa-inbox receiving-animation"></i>
            <span>Receiving Files</span>
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="file-placeholder">
            Scanning for nearby users...
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className={`top-nav`}>
        <div className={`nav-title ${isOpen ? '' : 'expanded'}`}>
          <span className="radius-text">RADIU</span>
          <span className="radius-text glowing">S</span>
        </div>
        <div className="avatar-circle">
          <i className={`fas ${avatar || 'fa-user'}`}></i>
        </div>
      </div>

      <div className={`message-container ${isOpen ? '' : 'expanded'}`}>
        <div className="message-input-wrapper">

        <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden-file-input"
            multiple  // Allow multiple file selection
          />
          <input 
            type="text" 
            className="message-input" 
            placeholder="Message RADIUS"
          />
          <div className="message-actions">
          <button 
              className="action-button"
              onClick={handleAttachmentClick}
            >
              <i className="fas fa-paperclip"></i>
            </button>
            <button className="action-button">
              <i className="fas fa-image"></i>
            </button>
            <button className="action-button">
              <i className="fas fa-globe"></i>
            </button>
            <button 
        className={`action-button voice-button ${isRecording ? 'recording' : ''}`}
        onClick={handleVoiceRecording}
      >
        <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
      </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInterface;