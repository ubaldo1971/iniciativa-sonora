import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { members } from '../data/members';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile({ user, onLogout }) {
    const { id } = useParams();
    const member = members.find(m => m.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!member) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
                <Header user={user} onLogout={onLogout} />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Miembro no encontrado</h2>
                        <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <Header user={user} onLogout={onLogout} />

            <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-700"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                            {/* Profile Image/Badge Area - Increased size for better visibility */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white dark:border-gray-700 shadow-xl overflow-hidden bg-white">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                />
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-grow">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{member.name}</h1>
                                <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">{member.position}</p>
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">ID: {member.id}</div>
                            </div>

                            {/* QR Code display */}
                            {member.qr && (
                                <div className="hidden md:block ml-auto bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                    <img src={member.qr} alt="QR Code" className="w-24 h-24" />
                                    <p className="text-xs text-center text-gray-400 mt-1">Escanear</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {/* Sidebar / Contact Info */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-600">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-4 uppercase tracking-wider text-sm">Contacto</h3>

                                    <div className="space-y-4">
                                        {member.email && (
                                            <div>
                                                <p className="text-xs text-blue-500 mb-1 uppercase font-semibold">Correo Electrónico</p>
                                                <a href={`mailto:${member.email}`} className="text-gray-700 dark:text-gray-300 hover:text-blue-700 break-words font-medium block">
                                                    {member.email}
                                                </a>
                                            </div>
                                        )}

                                        {member.phone && (
                                            <div>
                                                <p className="text-xs text-blue-500 mb-1 uppercase font-semibold">Teléfono</p>
                                                <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-gray-700 dark:text-gray-300 hover:text-blue-700 font-medium block">
                                                    {member.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile visible QR */}
                                {member.qr && (
                                    <div className="md:hidden bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
                                        <img src={member.qr} alt="QR Code" className="w-32 h-32" />
                                        <p className="text-sm text-gray-500 mt-2">Comparte este perfil</p>
                                    </div>
                                )}
                            </div>

                            {/* Main Content / Bio */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">Sobre mí</h3>
                                    <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
                                        {member.bio ? (
                                            member.bio.split('\n').map((line, index) => (
                                                line.trim() !== '' ? <p key={index} className="mb-4 text-justify leading-relaxed">{line}</p> : null
                                            ))
                                        ) : (
                                            <p>Miembro activo de Iniciativa Sonora.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-600">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Iniciativa Sonora</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Como parte del comité directivo, trabajo diariamente para impulsar la transformación de nuestro estado a través de la participación ciudadana y el desarrollo sostenible.
                                    </p>
                                    <Link to="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
                                        Conoce más sobre nuestra causa
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Profile;
