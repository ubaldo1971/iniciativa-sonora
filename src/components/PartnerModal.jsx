import React, { useState } from 'react';

const PartnerModal = ({ isOpen, onClose, onDonateRedirect }) => {
    const [formData, setFormData] = useState({
        empresa: '',
        contacto: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telefono') {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: digits });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('http://localhost:3000/api/aliados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {status === 'success' ? (
                    <div className="p-10 text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-dark mb-4 font-heading">¡Registro Exitoso!</h2>
                        <p className="text-gray-600 mb-8">Gracias por unirte a nuestra alianza. Nos pondremos en contacto contigo pronto.</p>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    onClose();
                                    onDonateRedirect();
                                }}
                                className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                            >
                                ❤️ Hacer una donación ahora
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-100 text-gray-600 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Únete al ecosistema</span>
                            <h2 className="text-2xl font-bold font-heading text-dark">Registro de Aliados</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nombre de la Empresa / Organización</label>
                                <input
                                    type="text"
                                    name="empresa"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition-all outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nombre de Contacto</label>
                                    <input
                                        type="text"
                                        name="contacto"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition-all outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Teléfono</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="telefono"
                                        maxLength="10"
                                        value={formData.telefono}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring focus:ring-primary/20 transition-all outline-none bg-gray-50 text-gray-900 placeholder-gray-400 ${formData.telefono.length > 0 && formData.telefono.length < 10
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 focus:border-primary'
                                            }`}
                                        onChange={handleChange}
                                        placeholder="6621234567"
                                    />
                                    {formData.telefono.length > 0 && formData.telefono.length < 10 && (
                                        <p className="text-red-500 text-xs mt-1">10 dígitos requeridos ({formData.telefono.length}/10)</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Corporativo</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition-all outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Mensaje (Opcional)</label>
                                <textarea
                                    name="mensaje"
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition-all outline-none bg-gray-50 text-gray-900 placeholder-gray-400 resize-none"
                                    placeholder="¿Cómo te gustaría colaborar?"
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">Error al registrar. Intenta de nuevo.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-dark text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all transform hover:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {status === 'submitting' ? 'Registrando...' : 'Enviar Registro'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerModal;
