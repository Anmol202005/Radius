import { useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import '../styles/GameInterface.css';
import { useEffect } from 'react';

function GameInterface() {
  const location = useLocation();
  const { nickname, avatar } = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const fileInputRef = useRef(null);
  const [networkNodes, setNetworkNodes] = useState([]);
  
  useEffect(() => {
    const avatarOptions = [
      'fa-user',
      'fa-dragon',
      'fa-ghost',
      'fa-robot',
      'fa-skull',
      'fa-user-ninja',
      'fa-user-astronaut',
      'fa-kiwi-bird',
      'fa-spider'
    ];
  
    const generateNode = () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      avatar: avatarOptions[Math.floor(Math.random() * avatarOptions.length)],
      isActive: true
    });

    // Calculate angles for connection lines
    const updateLineAngles = () => {
      const visualization = document.querySelector('.network-visualization');
      if (!visualization) return;

      const visualRect = visualization.getBoundingClientRect();
      const centerX = visualRect.width / 2;
      const centerY = visualRect.height / 2;

      const nodes = document.querySelectorAll('.user-node');
      nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const nodeX = rect.left - visualRect.left + rect.width / 2;
        const nodeY = rect.top - visualRect.top + rect.height / 2;
        const angle = Math.atan2(nodeY - centerY, nodeX - centerX) * 180 / Math.PI;
        node.style.setProperty('--angle', angle);
      });
    };

    // Create initial nodes
    const initialNodes = Array(Math.floor(Math.random() * 5 + 3))
      .fill(null)
      .map(generateNode);
    
    setNetworkNodes(initialNodes);

    // Update line angles whenever nodes change
    setTimeout(updateLineAngles, 100); // Small delay to ensure DOM is updated

    // Interval for simulating user movement
    const moveInterval = setInterval(() => {
      setNetworkNodes(prevNodes => {
        const nodes = [...prevNodes];
        
        if (Math.random() > 0.5 && nodes.length < 8) {
          const newUser = generateNode();
          console.log('New user joined:', newUser.id);
          nodes.push(newUser);
        } else if (nodes.length > 3) {
          const removedIndex = Math.floor(Math.random() * nodes.length);
          console.log('User left:', nodes[removedIndex].id);
          nodes.splice(removedIndex, 1);
        }

        // Update line angles after nodes change
        setTimeout(updateLineAngles, 100);
        return nodes;
      });
    }, Math.random() * 5000 + 5000);

    // Add window resize handler
    window.addEventListener('resize', updateLineAngles);

    // Cleanup
    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('resize', updateLineAngles);
    };
  }, []);

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

<div className={`network-visualization ${isOpen ? '' : 'expanded'}`}>
      {/* Add orbital rings before other elements */}
      <div className="orbital-rings">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
      </div>

      <div className="radar-sweep"></div>
      <div className="center-point"></div>
      <div className="connected-users">
        {networkNodes.map((node) => (
          <div 
            key={node.id}
            className="user-node"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`
            }}
          >
            <i className={`fas ${node.avatar}`}></i>
            <svg className="connection-line">
              <line 
                x1="50%" 
                y1="50%" 
                x2="100%" 
                y2="50%"
                stroke="#A78BFA"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </svg>
            <div className="node-distance">
              {Math.floor(Math.sqrt(Math.pow(50 - node.x, 2) + Math.pow(50 - node.y, 2)))}m
            </div>
          </div>
        ))}
      </div>
    </div>    

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