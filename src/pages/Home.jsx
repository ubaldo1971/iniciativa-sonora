import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Donations from '../components/Donations';
import JoinForm from '../components/JoinForm';
import Footer from '../components/Footer';

function Home({ user, onLogin, onLogout }) {
    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans antialiased text-dark dark:text-white bg-white dark:bg-gray-900 transition-colors duration-300">
            <Header user={user} onLogout={onLogout} />
            <Hero />
            <About />
            <Services />
            <Projects />
            <Donations />
            {!user && <JoinForm onLogin={onLogin} />}
            <Footer />
        </div>
    );
}

export default Home;
