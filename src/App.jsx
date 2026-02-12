import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('iniciativa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('iniciativa_user', JSON.stringify(userData));
    // Scroll to top or specific section if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('iniciativa_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
        <Route path="/profile/:id" element={<Profile user={user} onLogout={handleLogout} />} />
        <Route path="/admin" element={<Admin />} />
        {/* Fallback */}
        <Route path="*" element={<Home user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
