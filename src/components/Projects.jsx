import React, { useState } from 'react';
import PartnerModal from './PartnerModal';

const Collaborators = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDonateRedirect = () => {
        const donationsSection = document.getElementById('donaciones');
        if (donationsSection) {
            donationsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // This component replaces the old 'Projects' component to match the User's "Aliados/Colaboradores" request.
    const partners = [
        { name: 'FintechSol', category: 'Tecnología Financiera', icon: '💸' },
        { name: 'LegalAid', category: 'Defensa Jurídica', icon: '⚖️' },
        { name: 'MediCare+', category: 'Salud Internacional', icon: '⚕️' },
        { name: 'AgroSonora', category: 'Desarrollo Regional', icon: '🌵' },
        { name: 'EducaHoy', category: 'Becas y Educación', icon: '🎓' },
        { name: 'LogisTrans', category: 'Repatriación', icon: '🚚' },
    ];

    return (
        <section id="colaboradores" className="py-24 bg-white dark:bg-gray-900 relative transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Nuestra Fuerza</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-dark dark:text-white mb-6">
                        Aliados que hacen posible lo imposible
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Estas son las empresas socialmente responsables que se han unido a nuestra misión, permitiendo ofrecer servicios vitales a costos accesibles o gratuitos.
                    </p>
                </div>

                {/* Partners Logo Grid Visualization */}
                <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm max-w-5xl mx-auto">
                    {/* Keeping white background for logos visibility in both modes */}
                    <img
                        src="/partner-logos.png"
                        alt="Nuestros Colaboradores"
                        className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"
                    />
                </div>

                {/* Call to Action for Companies */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">¿Tu empresa quiere ser parte del cambio?</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-dark text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        Súmate como Aliado
                    </button>
                </div>
            </div>

            <PartnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDonateRedirect={handleDonateRedirect}
            />
        </section>
    );
};

export default Collaborators;
