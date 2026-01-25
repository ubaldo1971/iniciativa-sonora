import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const Donations = () => {
    const [amount, setAmount] = useState('500');
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Receipt Data Form
    const [donorInfo, setDonorInfo] = useState({
        name: '',
        rfc: 'XAXX010101000', // Default generic RFC
        email: '',
        phone: ''
    });

    const [donationStatus, setDonationStatus] = useState('idle'); // idle, processing, success
    const [successData, setSuccessData] = useState(null);

    const inspiringMessages = [
        "Tu generosidad es la semilla de un futuro mejor.",
        "Gracias por ser la luz en el camino de alguien más.",
        "El mundo cambia con tu ejemplo. ¡Gracias por dar!",
        "Hoy has hecho sonreír a una familia entera.",
        "Tu bondad trasciende fronteras y crea esperanza."
    ];

    const handleInputChange = (e) => {
        setDonorInfo({ ...donorInfo, [e.target.name]: e.target.value });
    };

    const generateReceipt = async (finalAmount, selectedMessage) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(30, 64, 175); // Primary Blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("INICIATIVA SONORA AC", 105, 25, null, null, "center");

        // Factura details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`RECIBO DE DONATIVO (SIMULACIÓN)`, 105, 50, null, null, "center");

        doc.setFontSize(10);
        const date = new Date().toLocaleString();
        doc.text(`Fecha de Emisión: ${date}`, 20, 70);
        doc.text(`Folio Fiscal: A1B2C3D4-E5F6-7890-ABCD-1234567890AB`, 20, 76);
        doc.text(`RFC Emisor: IS080808AAA`, 20, 82);

        // Donor Details
        doc.setFontSize(12);
        doc.text("Datos del Donante:", 20, 100);
        doc.setFontSize(10);
        doc.text(`Nombre: ${donorInfo.name || 'Anónimo'}`, 20, 108);
        doc.text(`RFC: ${donorInfo.rfc}`, 20, 114);
        doc.text(`Email: ${donorInfo.email}`, 20, 120);

        // Donation Details
        doc.setLineWidth(0.5);
        doc.line(20, 130, 190, 130);
        doc.setFontSize(12);
        doc.text("Concepto", 20, 140);
        doc.text("Monto", 160, 140);
        doc.line(20, 145, 190, 145);

        doc.setFontSize(10);
        doc.text("Donativo para programas sociales", 20, 155);
        doc.text(`$${finalAmount} MXN`, 160, 155);

        // Total
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL: $${finalAmount} MXN`, 160, 170, null, null, "right"); // Alignment fix logic manual for simplicity

        // Inspiring Message in PDF
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`"${selectedMessage}"`, 105, 200, null, null, "center");

        // Footer / SAT Seal Simulation
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Este documento es una representación impresa de un CFDI (Simulado para Demo).", 105, 280, null, null, "center");
        doc.text("Sello Digital del SAT: ||1.1|A1B2C3D4...||", 20, 260);

        // Save/Open
        // doc.save("Recibo_Donativo_IniciativaSonora.pdf"); // Auto download
        return doc.output('bloburl'); // To preview
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        setDonationStatus('processing');

        // Simulation delay
        await new Promise(r => setTimeout(r, 2000));

        const finalAmount = customAmount || amount;

        // Pick random message ensuring variety (simple random for now)
        const randomMsg = inspiringMessages[Math.floor(Math.random() * inspiringMessages.length)];

        // Generate PDF
        const pdfUrl = await generateReceipt(finalAmount, randomMsg);

        setSuccessData({
            amount: finalAmount,
            message: randomMsg,
            pdfUrl: pdfUrl
        });
        setDonationStatus('success');
    };

    if (donationStatus === 'success') {
        return (
            <section id="donaciones" className="py-24 bg-blue-50 dark:bg-gray-800 relative min-h-[600px] flex items-center justify-center transition-colors duration-300">
                <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>

                    <h2 className="text-4xl font-bold text-dark dark:text-white mb-4 font-heading">¡Gracias de todo corazón!</h2>

                    <div className="my-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-2xl text-primary font-serif italic leading-relaxed">
                            "{successData.message}"
                        </p>
                    </div>

                    <p className="text-gray-600 mb-8">
                        Hemos enviado tu recibo deducible por <strong>${successData.amount} MXN</strong> a:<br />
                        <span className="font-bold text-dark">{donorInfo.email || 'tu correo'}</span> y <span className="font-bold text-dark">WhatsApp {donorInfo.phone}</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a
                            href={successData.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-black transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Descargar Recibo PDF
                        </a>
                        <button
                            onClick={() => setDonationStatus('idle')}
                            className="text-primary font-bold hover:underline px-6 py-3"
                        >
                            Hacer otra donación
                        </button>
                    </div>

                    <p className="text-lg font-bold text-gray-400">
                        ¡Te vemos pronto para seguir construyendo juntos!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="donaciones" className="py-24 bg-blue-50 dark:bg-gray-800 relative overflow-hidden transition-colors duration-300">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg className="absolute top-0 right-0 text-primary w-96 h-96 transform translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 200 200"><path d="M43.2,-74.6C56.9,-68.5,69.5,-59.6,78.2,-48.3C86.9,-37,91.8,-23.3,90.3,-10.1C88.8,3.1,80.9,15.8,71.7,26.7C62.5,37.6,52.1,46.7,40.9,53.2C29.7,59.7,17.7,63.6,5.3,64.9C-7.2,66.3,-20.9,65.1,-32.5,58.9C-44.1,52.7,-53.6,41.5,-61.7,28.8C-69.8,16.1,-76.5,1.9,-75.6,-11.9C-74.8,-25.7,-66.4,-39.1,-55.5,-47.9C-44.6,-56.7,-31.2,-60.9,-17.8,-63.9C-4.4,-66.9,8.9,-68.7,21.7,-72.1"></path></svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto bg-white dark:bg-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                    {/* Left: Impact/Text */}
                    <div className="md:w-5/12 bg-primary text-white p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold font-heading mb-4">Tu ayuda transforma vidas</h2>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Cada peso donado se convierte en asesoría legal, atención médica y esperanza para miles de migrantes.
                            </p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                                    <span>Transparencia total</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                                    <span>Recibo deducible de impuestos (CFDI)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                                    <span>Seguridad bancaria garantizada</span>
                                </li>
                            </ul>
                        </div>
                        {/* Abstract shapes */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
                    </div>

                    {/* Right: Donation Form */}
                    <div className="md:w-7/12 p-8 md:p-10">
                        <form onSubmit={handleDonate}>
                            <div className="mb-8">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3">Monto a donar</label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {['100', '500', '1000'].map((val) => (
                                        <button
                                            type="button"
                                            key={val}
                                            onClick={() => { setAmount(val); setCustomAmount(''); }}
                                            className={`py-3 rounded-xl border-2 font-bold transition-all ${amount === val && !customAmount
                                                ? 'border-primary bg-blue-50 text-primary'
                                                : 'border-gray-100 text-gray-500 hover:border-blue-200'
                                                }`}
                                        >
                                            ${val}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        placeholder="Otro monto"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 font-bold focus:outline-none transition-all ${customAmount ? 'border-primary' : 'border-gray-100 focus:border-blue-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Datos Fiscales */}
                            <div className="mb-6 bg-gray-50 dark:bg-gray-600 p-4 rounded-xl border border-gray-100 dark:border-gray-500">
                                <h3 className="text-sm font-bold text-dark dark:text-white mb-3 uppercase tracking-wide">Datos para Recibo Deducible</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="rfc"
                                            value={donorInfo.rfc}
                                            onChange={handleInputChange}
                                            placeholder="RFC"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            value={donorInfo.name}
                                            onChange={handleInputChange}
                                            placeholder="Nombre o Razón Social"
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="email"
                                            name="email"
                                            value={donorInfo.email}
                                            onChange={handleInputChange}
                                            placeholder="Email"
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={donorInfo.phone}
                                            onChange={handleInputChange}
                                            placeholder="WhatsApp"
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400 hover:border-blue-200'
                                            }`}
                                    >
                                        {/* Icon SVG */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                        <span className="text-xs font-bold">Tarjeta</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('mercado')}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'mercado' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400 hover:border-blue-200'
                                            }`}
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 10.5c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5zm7.5 0c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5zm7.5 0c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5zM2 17h20v-2H2v2zm0 3h20v-1H2v1z" /></svg>
                                        <span className="text-xs font-bold">MercadoPago</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('remesa')}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'remesa' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400 hover:border-blue-200'
                                            }`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-xs font-bold">RemesaLibre</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={donationStatus === 'processing'}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait"
                            >
                                {donationStatus === 'processing' ? 'Procesando donativo...' : `Donar $${customAmount || amount} MXN`}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Al donar aceptas nuestros términos y condiciones. Tu información está protegida.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Donations;
