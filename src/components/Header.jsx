import React, { useState, useEffect } from 'react';
import ContactModal from './ContactModal';
import SocialLinks from './SocialLinks';

const Header = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('inicio');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return saved === 'true';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    // Scroll detection for header blur + shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active section detection
    useEffect(() => {
        const sections = ['inicio', 'nosotros', 'servicios', 'colaboradores', 'donaciones'];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
        );

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const navItems = [
        { name: 'Inicio', href: '#inicio', id: 'inicio' },
        { name: 'Nosotros', href: '#nosotros', id: 'nosotros' },
        { name: 'Programas', href: '#servicios', id: 'servicios' },
        { name: 'Colaboradores', href: '#colaboradores', id: 'colaboradores' },
        { name: 'Donaciones', href: '#donaciones', id: 'donaciones' },
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
        <>
            <header
                className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 py-2'
                    : 'bg-white dark:bg-gray-900 py-4'
                    }`}
            >
                <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    {/* Logo with hover effect */}
                    <a href="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Iniciativa Sonora"
                            className={`w-auto transition-all duration-500 group-hover:scale-105 ${scrolled ? 'h-12' : 'h-16'}`}
                        />
                    </a>

                    {/* ═══ Desktop Nav ═══ */}
                    <nav className="hidden lg:flex items-center gap-3">
                        {/* Nav container with border */}
                        <div className="flex items-center bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl px-2 py-1.5 backdrop-blur-sm">
                            <ul className="flex items-center gap-1 font-nav">
                                {navItems.map((item, index) => {
                                    const isActive = !item.isModal && activeSection === item.id;
                                    return (
                                        <li key={item.name} className="flex items-center">
                                            <a
                                                href={item.href}
                                                onClick={(e) => handleNavClick(e, item)}
                                                className={`relative px-5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 group cursor-pointer whitespace-nowrap
                                                    ${isActive
                                                        ? 'text-primary dark:text-blue-400'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400'
                                                    }
                                                `}
                                            >
                                                {/* Hover/Active background pill */}
                                                <span className={`absolute inset-0 rounded-xl transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-white dark:bg-gray-700 shadow-sm scale-100'
                                                        : 'bg-white/0 dark:bg-gray-700/0 scale-95 group-hover:scale-100 group-hover:bg-white group-hover:dark:bg-gray-700 group-hover:shadow-sm'
                                                    }
                                                `} />

                                                {/* Text */}
                                                <span className="relative z-10">{item.name}</span>

                                                {/* Active indicator dot */}
                                                {isActive && (
                                                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400" />
                                                )}

                                                {/* Underline sweep on hover */}
                                                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-300 ease-out
                                                    ${isActive ? 'w-5' : 'w-0 group-hover:w-5'}
                                                `} />
                                            </a>

                                            {/* Dot separator between items */}
                                            {index < navItems.length - 1 && (
                                                <span className="w-[3px] h-[3px] rounded-full bg-gray-300 dark:bg-gray-600 mx-0.5 flex-shrink-0" />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Social Media Links */}
                        <SocialLinks iconClass="w-4 h-4" />

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 overflow-hidden group ml-1"
                            title={isDarkMode ? 'Modo día' : 'Modo noche'}
                        >
                            <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0 absolute inset-0 flex items-center justify-center'}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                            </div>
                            <div className={`transition-all duration-500 ${!isDarkMode ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute inset-0 flex items-center justify-center'}`}>
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                            </div>
                        </button>

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-3 ml-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                                        {user.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-nav font-medium text-gray-700 dark:text-gray-300">
                                        {user.nombre.split(' ')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 rounded-xl text-sm font-nav font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <a
                                href="#registro"
                                className="relative ml-2 px-6 py-2.5 rounded-xl font-nav font-bold text-sm text-white overflow-hidden group"
                            >
                                {/* Animated gradient background */}
                                <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_100%] group-hover:animate-shimmer rounded-xl transition-all" />
                                {/* Glow effect */}
                                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-primary/40" />
                                <span className="relative z-10">Regístrate</span>
                            </a>
                        )}
                    </nav>

                    {/* ═══ Mobile: Toggle + Dark Mode ═══ */}
                    <div className="lg:hidden flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700"
                            title={isDarkMode ? 'Modo día' : 'Modo noche'}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                            )}
                        </button>

                        <button
                            className="p-2 rounded-xl text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${isOpen ? 'rotate-45 translate-x-px' : ''}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : ''}`} />
                                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${isOpen ? '-rotate-45 translate-x-px' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* ═══ Mobile Nav Dropdown ═══ */}
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4">
                        <ul className="flex flex-col gap-1 font-nav">
                            {navItems.map((item, i) => {
                                const isActive = !item.isModal && activeSection === item.id;
                                return (
                                    <li key={item.name} style={{ animationDelay: `${i * 50}ms` }} className={isOpen ? 'animate-slideIn' : ''}>
                                        <a
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                                                ${isActive
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                                                }
                                            `}
                                            onClick={(e) => handleNavClick(e, item)}
                                        >
                                            {/* Active indicator bar */}
                                            <span className={`w-1 h-6 rounded-full transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
                                            {item.name}
                                        </a>
                                    </li>
                                );
                            })}
                            <li className="mt-2">
                                <a
                                    href="#registro"
                                    className="block text-center bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-primary/25"
                                    onClick={() => setIsOpen(false)}
                                >
                                    ✨ Regístrate
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* ═══ CSS Animations ═══ */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .group:hover .group-hover\\:animate-shimmer {
                    animation: shimmer 3s linear infinite;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Header;
