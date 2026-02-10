import React from 'react';

const Hero = () => {
    return (
        <section id="inicio" className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark to-blue-900 z-0">
                <div className="absolute inset-0 bg-black/40"></div>
                {/* Abstract shapes or water effect could go here */}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
                    Iniciativa Sonora en <br />
                    <span className="text-primary">Movimiento y Transformación</span> A.C.
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-sans">
                    Unidos para brindar apoyo integral a <strong>pueblos originarios, personas con discapacidad, comunidad LGBTIQ+ y migrantes</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="#contacto"
                        className="px-8 py-3 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Contáctanos
                    </a>
                    <a
                        href="#servicios"
                        className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white rounded-full font-bold text-lg transition-all"
                    >
                        Nuestros Servicios
                    </a>
                </div>
            </div>

            {/* Decorative wavely divider at bottom if needed */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
