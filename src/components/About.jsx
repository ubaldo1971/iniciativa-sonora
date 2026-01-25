import React, { useState, useEffect } from 'react';

const About = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const stats = [
        { number: '150k+', label: 'Casos Resueltos', icon: '✅' },
        { number: '12k', label: 'Vidas Cambiadas', icon: '🤝' },
        { number: '10+', label: 'Años de Trayectoria', icon: '⭐' },
    ];

    const values = [
        "Transparencia en cada acción",
        "Compromiso total con el migrante",
        "Red de apoyo internacional"
    ];

    const images = [
        "/about-real.png",
        "/about-health.png",
        "/about-legal.png",
        "/about-food.png",
        "/about-real.png",
        "/about-health.png",
        "/about-legal.png",
        "/about-food.png",
        "/about-real.png",
        "/about-health.png"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000); // 4 seconds total interval
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section id="nosotros" className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-300">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-100 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
                            Quiénes Somos
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-dark dark:text-white mb-8 leading-tight">
                            Más que una organización, <br />
                            <span className="text-primary">somos familia.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 font-sans text-lg mb-6 leading-relaxed">
                            Somos una organización sin fines de lucro nacida de la necesidad de apoyar a la comunidad migrante y sus familias. Entendemos los desafíos porque los hemos vivido.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 font-sans text-lg mb-8 leading-relaxed">
                            A través de asesoría legal experta, servicios de salud accesibles y apoyo en trámites burocráticos, construimos puentes donde antes había muros, mejorando la calidad de vida de quienes más lo necesitan.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {values.map((value, i) => (
                                <li key={i} className="flex items-center text-gray-700 dark:text-gray-200 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    {value}
                                </li>
                            ))}
                        </ul>

                        <button className="text-primary font-bold hover:text-blue-700 transition-colors flex items-center gap-2 group">
                            Conoce nuestra historia completa
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                    </div>

                    {/* Image & Stats Visuals */}
                    <div className="order-1 lg:order-2 relative">
                        {/* Main Image Container with offset border effect */}
                        <div className="relative z-10 w-full aspect-[4/3]"> {/* Aspect ratio enforced container */}
                            <div className="absolute inset-0 bg-primary transform translate-x-4 translate-y-4 rounded-3xl opacity-20"></div>

                            {/* Slider Images */}
                            <div className="relative w-full h-full rounded-3xl shadow-2xl border-4 border-white overflow-hidden bg-gray-100">
                                {images.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Slide ${index + 1}`}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out transform ${currentImage === index
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floating Stat Cards - Positioned dynamically */}
                        <div className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 hidden md:flex items-center gap-4 animate-fade-in-up">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl">❤️</div>
                            <div>
                                <div className="text-2xl font-bold text-dark dark:text-white font-heading">12k+</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Vidas Impactadas</div>
                            </div>
                        </div>

                        <div className="absolute -top-6 -right-6 z-20 bg-white dark:bg-gray-700 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 hidden md:block animate-bounce-slow">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-primary font-heading">10+</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Años</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
