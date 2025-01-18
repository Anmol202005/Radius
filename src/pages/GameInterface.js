import { useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/GameInterface.css';

function GameInterface() {
  const location = useLocation();
  const { nickname, avatar } = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  

  // Redirect if no nickname
  if (!nickname) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
            type="text" 
            className="message-input" 
            placeholder="Message RADIUS"
          />
          <div className="message-actions">
            <button className="action-button">
              <i className="fas fa-paperclip"></i>
            </button>
            <button className="action-button">
              <i className="fas fa-image"></i>
            </button>
            <button className="action-button">
              <i className="fas fa-globe"></i>
            </button>
            <button className="action-button voice-button">
              <i className="fas fa-microphone"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInterface;