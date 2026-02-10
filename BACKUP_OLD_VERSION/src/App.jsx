import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import JoinForm from './components/JoinForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans antialiased text-dark bg-white">
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <JoinForm />
      <Footer />
    </div>
  );
}

export default App;
