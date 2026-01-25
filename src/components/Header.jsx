import React, { useState, useEffect } from 'react';
import ContactModal from './ContactModal';
import SocialLinks from './SocialLinks';

const Header = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage or system preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return saved === 'true';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        // Apply dark mode class to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const navItems = [
        { name: 'Inicio', href: '#inicio', active: true },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Programas y Servicios', href: '#servicios' },
        { name: 'Colaboradores', href: '#colaboradores' },
        { name: 'Donaciones', href: '#donaciones' },
        { name: 'Contacto', href: '#contacto', isModal: true },
    ];

    const handleNavClick = (e, item) => {
        if (item.isModal) {
            e.preventDefault();
            setIsContactModalOpen(true);
            setIsOpen(false);
        } else {
            setIsOpen(false);
        }
    };

    return (
        <header className="fixed w-full bg-white dark:bg-gray-900 text-dark dark:text-white z-50 shadow-md transition-colors duration-300">
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src="/logo.png" alt="Iniciativa Sonora" className="h-16 w-auto" />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6">
                    <ul className="flex gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className={`hover:text-primary transition-colors ${item.active ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} cursor-pointer`}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Social Media Links */}
                    <SocialLinks iconClass="w-4 h-4" />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={isDarkMode ? 'Modo día' : 'Modo noche'}
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hola, {user.nombre.split(' ')[0]}</span>
                            <button
                                onClick={onLogout}
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-dark dark:text-white px-4 py-2 rounded-full font-bold transition-all text-sm"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <a
                            href="#registro"
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105"
                        >
                            Regístrate
                        </a>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-3">
                    {/* Dark Mode Toggle Mobile */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                        title={isDarkMode ? 'Modo día' : 'Modo noche'}
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                        )}
                    </button>

                    <button
                        className="text-dark dark:text-white focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {
                isOpen && (
                    <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <ul className="flex flex-col p-4 gap-4">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-primary"
                                        onClick={(e) => handleNavClick(e, item)}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="#registro"
                                    className="block bg-primary text-center text-white px-6 py-2 rounded-full font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Regístrate
                                </a>
                            </li>
                        </ul>
                    </div>
                )
            }
        </header >
    );
};

export default Header;
