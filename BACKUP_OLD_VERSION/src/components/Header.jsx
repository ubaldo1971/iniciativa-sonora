import React, { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Inicio', href: '#inicio', active: true },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Programas y Servicios', href: '#servicios' },
        { name: 'Colaboradores', href: '#colaboradores' },
        { name: 'Donaciones', href: '#donaciones' },
        { name: 'Contacto', href: '#contacto' },
    ];

    return (
        <header className="fixed w-full bg-dark text-white z-50 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-heading font-bold flex items-center gap-2">
                    {/* Placeholder for Logo */}
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        IS
                    </div>
                    <span>Iniciativa Sonora</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6">
                    <ul className="flex gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className={`hover:text-primary transition-colors ${item.active ? 'text-primary' : 'text-gray-300'}`}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a
                        href="#registro"
                        className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105"
                    >
                        Regístrate
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-white focus:outline-none"
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

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden bg-dark border-t border-gray-700">
                    <ul className="flex flex-col p-4 gap-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="block text-gray-300 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
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
            )}
        </header>
    );
};

export default Header;
