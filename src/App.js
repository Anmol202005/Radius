import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import GameInterface from './pages/GameInterface';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [showAvatars, setShowAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('fa-user');

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
  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatars(false);
  };

  useEffect(() => {
    // Create random stars
    const container = document.querySelector('.app-container');
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 1}s`;
      container.appendChild(star);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.length >= 2) {
      navigate('/game', { 
        state: { 
          nickname: nickname,
          avatar: selectedAvatar 
        }
      });
    }
  };
  return (
    <div className="app-container">
      
      <div className="avatar-selector">
        <div 
          className="avatar-main"
          onClick={() => setShowAvatars(!showAvatars)}
        >
          <i className={`fas ${selectedAvatar} avatar-icon`}></i>
        </div>
        <div className={`avatar-dropdown ${showAvatars ? 'show' : ''}`}>
          {avatarOptions.map((avatar, index) => (
            <div 
              key={index}
              className="avatar-option"
              onClick={() => handleAvatarSelect(avatar)}
            >
              <i className={`fas ${avatar}`}></i>
            </div>
          ))}
        </div>
      </div>

      
      <div className="solar-system">
        <div className="orbit orbit-1">
          <div className="planet planet-1">
            <i className="fa fa-link"></i>
          </div>
        </div>
        <div className="orbit orbit-2">
          <div className="planet planet-2">
            <i className="fa fa-paste"></i>
          </div>
        </div>
        <div className="orbit orbit-3">
          <div className="planet planet-3">
            <i className="fa fa-download"></i>
          </div>
        </div>
      </div>
      <div className="logo">
        <span className="logo-slither">RADIUS</span>
        {/* <span className="logo-io">.io</span> */}
      </div>

      

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-field"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <div>
          <button type="submit" className="play-button">
            Play
          </button>
        </div>
      </form>
    </div>
  );
}
function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/game" element={<GameInterface />} />
      </Routes>
    </Router>
  );
}
export default AppWrapper;