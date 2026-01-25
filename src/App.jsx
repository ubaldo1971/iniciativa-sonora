import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import JoinForm from './components/JoinForm';
import Footer from './components/Footer';

import Donations from './components/Donations';

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
    <div className="font-sans antialiased text-dark dark:text-white bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header user={user} onLogout={handleLogout} />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Donations />
      {!user && <JoinForm onLogin={handleLogin} />}
      <Footer />
    </div>
  );
}

export default App;
