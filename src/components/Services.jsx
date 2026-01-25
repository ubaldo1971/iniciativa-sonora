import React from 'react';

const Services = () => {
    const services = [
        {
            title: 'Remesas sin costo',
            description: 'Envía dinero a tu familia en segundos y con comisiones cercanas a cero gracias a nuestras alianzas con empresas socialmente responsables.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-100 text-green-600',
            highlight: '¡Instantáneo!'
        },
        {
            title: 'Telemedicina',
            description: 'Acceso inmediato a consultas médicas a distancia para cuidar la salud de los tuyos sin importar las fronteras físicas.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.866v6.268a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Defensoría Legal Binacional',
            description: 'Asesoría y defensa jurídica en México y USA a costos económicos o mediante seguros accesibles que garantizan tu protección.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            title: 'Repatriación Solidaria',
            description: 'Servicio de traslado de cuerpos pagando una cuota anual básica, brindando tranquilidad y apoyo en los momentos más difíciles.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-orange-100 text-orange-600'
        },
        {
            title: 'Más Beneficios',
            description: 'Un ecosistema en expansión constante con más servicios pensados para el bienestar integral de la comunidad migrante.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            color: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <section id="servicios" className="py-24 bg-gray-50 dark:bg-gray-800 relative transition-colors duration-300">
            <div className="container mx-auto px-4">

                {/* Intro Section */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Ecosistema Integral</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-dark dark:text-white mb-6">
                        Conectando <span className="text-primary">Servicios y Oportunidades</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Gracias a nuestra conexión con empresas socialmente responsables, hemos creado un ecosistema único de dinero y servicios diseñado para apoyar a nuestros paisanos y sus familias.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Visual / Network Representation */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                            <img
                                src="/services-network.png"
                                alt="Red de servicios"
                                className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-white text-2xl font-bold mb-2">Alianzas Estratégicas</h3>
                                <p className="text-gray-300">Trabajamos con lo mejor para ofrecerte lo mejor.</p>
                            </div>
                        </div>
                        {/* Decorative floating elements */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>

                    {/* Services List */}
                    <div className="order-1 lg:order-2 space-y-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all transform hover:-translate-x-1 flex gap-5 items-start group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${service.color}`}>
                                    {service.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-dark dark:text-white font-heading">{service.title}</h3>
                                        {service.highlight && (
                                            <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full animate-pulse">
                                                {service.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Services;
