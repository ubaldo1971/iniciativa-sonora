import React from 'react';

const JoinForm = () => {
    return (
        <section id="registro" className="py-20 bg-primary text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                    Únete a nosotros
                </h2>
                <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                    Mantente informado sobre nuestras actividades, logros y nuevas formas de apoyar.
                    Juntos somos más fuertes.
                </p>

                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        className="flex-1 px-6 py-4 rounded-full text-dark focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-dark text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Enviar
                    </button>
                    {/* Note: Email field seems missing in description but standard in newsletters. Adding 'Nombre completo' as requested but logic usually implies email. Keeping consistent with requested "Nombre completo" from analysis but field usually needs email. I'll stick to 'Nombre completo' per analysis but logically it's weird for a newsletter. I'll add email too just in case or just stick to 'Nombre'. Analysis said "Campos: Nombre completo". I'll trust analysis. */}
                </form>
            </div>
        </section>
    );
};

export default JoinForm;
