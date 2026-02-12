import React, { useState } from 'react';

const JoinForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        pais_codigo: '+52',
        celular: '',
        edad: '',
        sexo: '',
        comentarios: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const countries = [
        { code: '+52', name: 'México (+52)' },
        { code: '+1', name: 'USA/Canadá (+1)' },
        // Add more common codes if needed
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'celular') {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: digits }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('http://localhost:3000/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');

                const newUser = { ...formData }; // Capture data

                setFormData({
                    nombre: '',
                    email: '',
                    pais_codigo: '+52',
                    celular: '',
                    edad: '',
                    sexo: '',
                    comentarios: ''
                });

                // Wait 1.5s then login
                setTimeout(() => {
                    if (onLogin) onLogin(newUser);
                }, 1500);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <section id="registro" className="py-20 bg-gray-50 dark:bg-gray-800 text-dark dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-700 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-primary py-8 px-8 text-center">
                        <h2 className="text-3xl font-bold font-heading text-white mb-2">
                            Únete a la Iniciativa
                        </h2>
                        <p className="text-blue-100">
                            Regístrate para mantenernos en contacto y coordinar apoyos.
                        </p>
                    </div>

                    <div className="p-8 md:p-12">
                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-dark mb-4">¡Registro Exitoso!</h3>
                                <p className="text-gray-600 mb-8">Gracias por unirte. Tus datos han sido guardados correctamente.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Registrar otra persona
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>

                                    {/* Celular */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Celular / WhatsApp</label>
                                        <div className="flex">
                                            <select
                                                name="pais_codigo"
                                                value={formData.pais_codigo}
                                                onChange={handleChange}
                                                className="rounded-l-lg bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-200 dark:border-gray-500 px-3 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            >
                                                {countries.map(c => (
                                                    <option key={c.code} value={c.code}>{c.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="celular"
                                                required
                                                maxLength="10"
                                                value={formData.celular}
                                                onChange={handleChange}
                                                className={`flex-1 px-4 py-3 rounded-r-lg bg-gray-50 dark:bg-gray-600 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${formData.celular.length > 0 && formData.celular.length < 10
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-200 dark:border-gray-500 focus:border-primary'
                                                    }`}
                                                placeholder="6621234567"
                                            />
                                        </div>
                                        {formData.celular.length > 0 && formData.celular.length < 10 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                El número debe tener 10 dígitos ({formData.celular.length}/10)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Edad */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Edad</label>
                                        <input
                                            type="number"
                                            name="edad"
                                            required
                                            min="18"
                                            max="120"
                                            value={formData.edad}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Ej. 35"
                                        />
                                    </div>

                                    {/* Sexo */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Sexo</label>
                                        <select
                                            name="sexo"
                                            required
                                            value={formData.sexo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="Hambre">Hombre</option>
                                            <option value="Mujer">Mujer</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Comentarios */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Comentarios (Opcional)</label>
                                    <textarea
                                        name="comentarios"
                                        value={formData.comentarios}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                        placeholder="¿Algún detalle sobre tu afiliación o duda?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={`w-full py-4 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-[1.02] ${status === 'sending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'}`}
                                >
                                    {status === 'sending' ? 'Enviando...' : 'Enviar Registro'}
                                </button>

                                {status === 'error' && (
                                    <p className="text-red-500 text-center font-medium mt-2">
                                        Hubo un error al enviar el formulario. Por favor intenta de nuevo.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinForm;
