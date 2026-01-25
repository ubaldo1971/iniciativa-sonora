import React from 'react';

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 transition-all border border-gray-100" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-dark font-heading">Contáctanos</h3>
                    <p className="text-gray-500 mt-2">¿Cómo prefieres comunicarte?</p>
                </div>

                <div className="space-y-4">
                    <a
                        href="https://wa.me/526621234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full p-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-green-200 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <svg className="w-8 h-8 mr-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-medium opacity-90">Chatea con nosotros</span>
                            <span className="font-bold text-lg">WhatsApp</span>
                        </div>
                    </a>

                    <a
                        href="mailto:contacto@iniciativasonora.org"
                        className="flex items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-2xl transition-all transform hover:scale-[1.02] border border-gray-200"
                    >
                        <svg className="w-8 h-8 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-medium text-gray-500">Envíanos un correo</span>
                            <span className="font-bold text-lg">Email</span>
                        </div>
                    </a>
                </div>

                <button onClick={onClose} className="mt-8 text-gray-400 hover:text-dark text-sm w-full text-center py-2">
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default ContactModal;
