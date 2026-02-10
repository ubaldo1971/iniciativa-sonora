import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs">IS</div>
                            Iniciativa Sonora
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Organización dedicada al bienestar y desarrollo integral de los migrantes sonorenses y sus familias.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholders */}
                            {[1, 2, 3].map((i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <span className="text-sm">So</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-primary">Enlaces Rápidos</h4>
                        <ul className="space-y-4">
                            {['Inicio', 'Nosotros', 'Servicios', 'Proyectos', 'Contacto'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div id="contacto">
                        <h4 className="font-bold text-lg mb-6 text-primary">Contacto</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li>contacto@iniciativasonora.org</li>
                            <li>+52 (662) 123 4567</li>
                            <li>Hermosillo, Sonora, México</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Iniciativa Sonora en Movimiento y Transformación A.C. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
