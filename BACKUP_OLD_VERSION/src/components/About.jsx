import React from 'react';

const About = () => {
    const stats = [
        { number: '150k+', label: 'Casos Resueltos' },
        { number: '12k', label: 'Vidas Cambiadas' },
        { number: '10+', label: 'Años de Experiencia' }, // Added for balance
    ];

    return (
        <section id="nosotros" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Quiénes Somos</span>
                        <h2 className="text-4xl font-bold font-heading text-dark mb-6">
                            Comprometidos con el bienestar de la comunidad
                        </h2>
                        <p className="text-gray-600 font-sans text-lg mb-6 leading-relaxed">
                            Somos una organización sin fines de lucro dedicada a apoyar a <strong>comunidades prioritarias, pueblos originarios, personas con discapacidad, la comunidad LGBTIQ+ y migrantes</strong>.
                            A través de asesoría legal, servicios de salud y apoyo en trámites, buscamos mejorar la calidad de vida
                            de quienes más lo necesitan.
                        </p>
                        <p className="text-gray-600 font-sans text-lg mb-8 leading-relaxed">
                            Nuestra misión es ser un puente de esperanza y solución para los retos que enfrentan nuestros paisanos y grupos vulnerables.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 text-center transform transition-all hover:-translate-y-1 hover:shadow-md ${index === 2 ? 'sm:col-span-2' : ''}`}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
