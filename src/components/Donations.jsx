import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const Donations = () => {
    const [amount, setAmount] = useState('500');
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [needsReceipt, setNeedsReceipt] = useState(false);

    // Receipt Data Form
    const [donorInfo, setDonorInfo] = useState({
        name: '',
        rfc: 'XAXX010101000',
        email: '',
        phone: '',
        razonSocial: '',
        regimenFiscal: '',
        usoCFDI: 'D04 - Donativos',
        direccionFiscal: ''
    });

    const [donationStatus, setDonationStatus] = useState('idle');
    const [successData, setSuccessData] = useState(null);

    const inspiringMessages = [
        "Tu generosidad es la semilla de un futuro mejor.",
        "Gracias por ser la luz en el camino de alguien más.",
        "El mundo cambia con tu ejemplo. ¡Gracias por dar!",
        "Hoy has hecho sonreír a una familia entera.",
        "Tu bondad trasciende fronteras y crea esperanza."
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const digits = value.replace(/[^0-9]/g, '').slice(0, 10);
            setDonorInfo({ ...donorInfo, [name]: digits });
            return;
        }
        setDonorInfo({ ...donorInfo, [name]: value });
    };

    // Convert number to Spanish words
    const numberToWords = (num) => {
        const units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

        const n = parseInt(num);
        if (n === 0) return 'cero';
        if (n === 100) return 'cien';

        let result = '';

        if (n >= 1000) {
            const thousands = Math.floor(n / 1000);
            if (thousands === 1) {
                result += 'mil ';
            } else {
                result += numberToWords(thousands) + ' mil ';
            }
        }

        const remainder = n % 1000;

        if (remainder >= 100) {
            result += hundreds[Math.floor(remainder / 100)] + ' ';
        }

        const lastTwo = remainder % 100;
        if (lastTwo >= 10 && lastTwo <= 19) {
            result += teens[lastTwo - 10];
        } else if (lastTwo >= 20 && lastTwo <= 29 && lastTwo !== 20) {
            result += 'veinti' + units[lastTwo - 20];
        } else {
            if (lastTwo >= 20) {
                result += tens[Math.floor(lastTwo / 10)];
                if (lastTwo % 10 !== 0) result += ' y ' + units[lastTwo % 10];
            } else if (lastTwo > 0) {
                result += units[lastTwo];
            }
        }

        return result.trim();
    };

    const amountInWords = (num) => {
        const n = parseInt(num);
        const words = numberToWords(n);
        return words.charAt(0).toUpperCase() + words.slice(1) + ' pesos 00/100 M.N.';
    };

    const generateReceipt = async (finalAmount, selectedMessage) => {
        const doc = new jsPDF();
        const pageWidth = 210;

        // Load logo
        let logoData = null;
        let logoWidth = 28;
        let logoHeight = 28;
        try {
            const response = await fetch('/logo.png');
            const blob = await response.blob();
            logoData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            // Get actual dimensions to preserve aspect ratio
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = logoData;
            });
            const maxH = 34;
            const ratio = img.width / img.height;
            logoHeight = maxH;
            logoWidth = maxH * ratio;
        } catch (e) {
            console.warn('Logo not loaded:', e);
        }

        // ═══════════════════════════════════════════
        // HEADER — Gradient effect with logo
        // ═══════════════════════════════════════════
        // Dark blue base
        doc.setFillColor(15, 35, 100);
        doc.rect(0, 0, pageWidth, 50, 'F');
        // Lighter blue accent strip
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 46, pageWidth, 4, 'F');

        // Logo — centered vertically in header, aspect ratio preserved
        const logoX = 12;
        const logoY = (50 - logoHeight) / 2;
        if (logoData) {
            doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
        }
        const textStartX = logoData ? logoX + logoWidth + 6 : 105;
        const textAlign = logoData ? "left" : "center";

        // Organization name — large, elegant
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text("INICIATIVA SONORA", textStartX, 22, null, null, textAlign);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.text("en Movimiento y Transformación A.C.", textStartX, 32, null, null, textAlign);

        // Subtitle under header
        doc.setFontSize(9);
        doc.setTextColor(180, 200, 255);
        doc.text("Organización sin fines de lucro  •  RFC: IS080808AAA", textStartX, 40, null, null, textAlign);

        // ═══════════════════════════════════════════
        // DOCUMENT TITLE
        // ═══════════════════════════════════════════
        let y = 62;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175);
        doc.text("RECIBO DE DONATIVO", pageWidth / 2, y, null, null, "center");

        // Decorative line
        y += 6;
        doc.setDrawColor(30, 64, 175);
        doc.setLineWidth(0.8);
        doc.line(60, y, 150, y);

        // ═══════════════════════════════════════════
        // EMISSION DATA — Right-aligned, elegant
        // ═══════════════════════════════════════════
        y += 12;
        const date = new Date();
        const dateStr = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        const folioId = `IS-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text("Fecha:", 20, y);
        doc.text("Folio:", 20, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(`${dateStr}, ${timeStr}`, 42, y);
        doc.text(folioId, 42, y + 6);

        // ═══════════════════════════════════════════
        // DONOR INFORMATION — Card style
        // ═══════════════════════════════════════════
        y += 18;
        // Light blue background card
        doc.setFillColor(240, 245, 255);
        doc.roundedRect(18, y - 4, pageWidth - 36, 36, 3, 3, 'F');
        // Left accent bar
        doc.setFillColor(30, 64, 175);
        doc.rect(18, y - 4, 3, 36, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 64, 175);
        doc.text("DATOS DEL DONANTE", 28, y + 3);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const donorName = donorInfo.name || 'Anónimo';
        doc.text(`Nombre:   ${donorName}`, 28, y + 12);
        doc.text(`RFC:         ${donorInfo.rfc}`, 28, y + 18);
        doc.text(`Email:       ${donorInfo.email}`, 28, y + 24);
        if (donorInfo.phone) {
            doc.text(`WhatsApp: ${donorInfo.phone}`, 120, y + 24);
        }

        // ═══════════════════════════════════════════
        // CONCEPT TABLE
        // ═══════════════════════════════════════════
        y += 42;
        // Table header
        doc.setFillColor(30, 64, 175);
        doc.roundedRect(18, y, pageWidth - 36, 10, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("Concepto", 25, y + 7);
        doc.text("Monto", 170, y + 7, null, null, "right");

        // Table row
        y += 10;
        doc.setFillColor(250, 250, 250);
        doc.rect(18, y, pageWidth - 36, 12, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.text("Donativo para programas sociales", 25, y + 8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`$${parseInt(finalAmount).toLocaleString('es-MX')} MXN`, 170, y + 8, null, null, "right");

        // Bottom line of table
        y += 12;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(18, y, pageWidth - 18, y);

        // ═══════════════════════════════════════════
        // TOTAL AMOUNT — Highlighted colored box
        // ═══════════════════════════════════════════
        y += 8;
        // Green accent box
        doc.setFillColor(16, 120, 60);
        doc.roundedRect(55, y, 100, 26, 4, 4, 'F');

        // Amount number — large and bold
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text(`$${parseInt(finalAmount).toLocaleString('es-MX')} MXN`, pageWidth / 2, y + 12, null, null, "center");

        // Amount in words
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(220, 255, 220);
        const wordsText = amountInWords(finalAmount);
        doc.text(`(${wordsText})`, pageWidth / 2, y + 20, null, null, "center");

        // ═══════════════════════════════════════════
        // INSPIRING MESSAGE
        // ═══════════════════════════════════════════
        y += 38;
        doc.setDrawColor(30, 64, 175);
        doc.setLineWidth(0.4);
        doc.line(60, y, 65, y);
        doc.line(145, y, 150, y);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 120);
        doc.text(`"${selectedMessage}"`, pageWidth / 2, y + 8, null, null, "center");

        y += 12;
        doc.line(60, y + 2, 65, y + 2);
        doc.line(145, y + 2, 150, y + 2);

        // ═══════════════════════════════════════════
        // FOOTER
        // ═══════════════════════════════════════════
        // Decorative footer bar
        doc.setFillColor(240, 245, 255);
        doc.rect(0, 260, pageWidth, 37, 'F');
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 260, pageWidth, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text("Este documento es una representación impresa de un Comprobante Fiscal Digital por Internet (CFDI).", pageWidth / 2, 270, null, null, "center");
        doc.text(`Sello Digital: ||1.1|${folioId}|${donorInfo.rfc}||`, pageWidth / 2, 276, null, null, "center");
        doc.text("www.iniciativasonora.org  •  contacto@iniciativasonora.org", pageWidth / 2, 285, null, null, "center");

        // Save/Open
        return doc.output('bloburl');
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
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 font-bold">$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Otro monto"
                                        value={customAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setCustomAmount(val);
                                        }}
                                        className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 font-bold focus:outline-none transition-all dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 ${customAmount ? 'border-primary' : 'border-gray-100 dark:border-gray-500 focus:border-blue-200'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Basic Contact Info - Always visible */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3">Tus datos de contacto</label>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={donorInfo.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="email"
                                            name="email"
                                            value={donorInfo.email}
                                            onChange={handleInputChange}
                                            placeholder="Email"
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                                        />
                                        <div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="phone"
                                                maxLength="10"
                                                value={donorInfo.phone}
                                                onChange={handleInputChange}
                                                placeholder="6621234567"
                                                required
                                                className={`w-full px-3 py-2 rounded-lg border dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all ${donorInfo.phone.length > 0 && donorInfo.phone.length < 10
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-200 dark:border-gray-500'
                                                    }`}
                                            />
                                            {donorInfo.phone.length > 0 && donorInfo.phone.length < 10 && (
                                                <p className="text-red-500 text-xs mt-1">10 dígitos requeridos ({donorInfo.phone.length}/10)</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Receipt Toggle */}
                            <div className="mb-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={needsReceipt}
                                            onChange={() => setNeedsReceipt(!needsReceipt)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-500 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                                        ¿Necesitas recibo deducible de impuestos?
                                    </span>
                                </label>
                            </div>

                            {/* Datos Fiscales - Only when receipt is needed */}
                            {needsReceipt && (
                                <div className="mb-6 bg-blue-50 dark:bg-gray-600 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-500 animate-fade-in-up">
                                    <h3 className="text-sm font-bold text-primary dark:text-blue-300 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Datos Fiscales para CFDI
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="rfc"
                                                value={donorInfo.rfc}
                                                onChange={handleInputChange}
                                                placeholder="RFC del donante"
                                                required
                                                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                            <input
                                                type="text"
                                                name="razonSocial"
                                                value={donorInfo.razonSocial}
                                                onChange={handleInputChange}
                                                placeholder="Razón Social (si es empresa)"
                                                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <select
                                                name="regimenFiscal"
                                                value={donorInfo.regimenFiscal}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-primary"
                                            >
                                                <option value="">Régimen Fiscal</option>
                                                <option value="601">601 - General de Ley</option>
                                                <option value="603">603 - Personas Morales sin fines de lucro</option>
                                                <option value="605">605 - Sueldos y Salarios</option>
                                                <option value="606">606 - Arrendamiento</option>
                                                <option value="612">612 - Personas Físicas con Actividad Empresarial</option>
                                                <option value="616">616 - Sin obligaciones fiscales</option>
                                                <option value="621">621 - Incorporación Fiscal</option>
                                                <option value="625">625 - RESICO</option>
                                            </select>
                                            <select
                                                name="usoCFDI"
                                                value={donorInfo.usoCFDI}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-primary"
                                            >
                                                <option value="D04 - Donativos">D04 - Donativos</option>
                                                <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                                                <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            name="direccionFiscal"
                                            value={donorInfo.direccionFiscal}
                                            onChange={handleInputChange}
                                            placeholder="Código Postal del domicilio fiscal"
                                            className="w-full px-3 py-2 rounded-lg border border-blue-200 dark:border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <p className="text-xs text-blue-500 dark:text-blue-300 mt-3 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                        Tu recibo será emitido conforme a las disposiciones del SAT.
                                    </p>
                                </div>
                            )}

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
