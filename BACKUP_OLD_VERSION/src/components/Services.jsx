import React from 'react';

const Services = () => {
    const services = [
        {
            title: 'Remesas sin costo',
            description: 'Envía apoyo a tus familiares sin comisiones excesivas. Optimizamos cada peso.',
            icon: '💸',
        },
        {
            title: 'Telemedicina',
            description: 'Acceso a profesionales de la salud a distancia para ti y tu familia.',
            icon: '🩺',
        },
        {
            title: 'Asesoría Legal',
            description: 'Orientación jurídica experta para trámites migratorios y defensa de derechos.',
            icon: '⚖️',
        },
    ];

    return (
        <section id="servicios" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Lo que hacemos</span>
                    <h2 className="text-4xl font-bold font-heading text-dark">
                        Nuestros Servicios
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Ofrecemos soluciones integrales diseñadas para beneficiar a nuestras <strong>comunidades prioritarias, migrantes y grupos vulnerables</strong>.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-2 group"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-primary/10 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-dark mb-4 font-heading">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
