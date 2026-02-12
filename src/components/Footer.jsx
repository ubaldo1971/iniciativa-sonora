import React from 'react';

const Footer = () => {
    const navLinks = [
        { name: 'Inicio', href: '#inicio' },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Programas', href: '#servicios' },
        { name: 'Colaboradores', href: '#colaboradores' },
        { name: 'Donaciones', href: '#donaciones' },
    ];

    const socials = [
        {
            name: 'YouTube',
            url: 'https://www.youtube.com/@Iniciativa_SON',
            className: 'bg-red-600 hover:bg-red-500 shadow-red-600/30',
            icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
            svgClass: 'text-white',
        },
        {
            name: 'X',
            url: 'https://x.com/Iniciativa_SON',
            className: 'bg-gray-900 hover:bg-gray-700 shadow-gray-900/30 border border-gray-600',
            icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
            svgClass: 'text-white',
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/iniciativa_son/',
            className: 'shadow-pink-600/30',
            style: { background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
            icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
            svgClass: 'text-white',
        },
        {
            name: 'TikTok',
            url: 'https://www.tiktok.com/@iniciativa_son',
            className: 'bg-black shadow-cyan-500/30 border border-cyan-500/50',
            icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
            svgClass: 'text-cyan-400',
        },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-primary via-primary to-blue-950 text-white overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* ═══ Main Footer Content ═══ */}
                <div className="pt-16 pb-12">
                    <div className="grid md:grid-cols-12 gap-12 lg:gap-16">

                        {/* ─── Brand Column ─── */}
                        <div className="md:col-span-5">
                            <a href="#inicio" className="inline-block group">
                                <img
                                    src="/logo.png"
                                    alt="Iniciativa Sonora"
                                    className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                                />
                            </a>
                            <p className="mt-5 text-blue-100/80 text-sm leading-relaxed max-w-sm font-sans">
                                Organización dedicada al bienestar y desarrollo integral de los migrantes sonorenses y sus familias.
                            </p>

                            {/* Social Icons Row */}
                            <div className="mt-6 flex gap-3">
                                {socials.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-lg ${s.className}`}
                                        style={s.style || {}}
                                        title={s.name}
                                    >
                                        <svg className={`w-[18px] h-[18px] ${s.svgClass}`} fill="currentColor" viewBox="0 0 24 24">
                                            {s.icon}
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ─── Navigation Column ─── */}
                        <div className="md:col-span-3">
                            <h4 className="font-heading font-bold text-base mb-5 text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                Navegación
                            </h4>
                            {/* Nav links in bordered container, matching header style */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm">
                                <ul className="flex flex-col gap-0.5 font-nav">
                                    {navLinks.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-100/70 hover:text-white transition-all duration-300"
                                            >
                                                {/* Hover background */}
                                                <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-300 scale-95 group-hover:scale-100" />
                                                {/* Arrow indicator */}
                                                <span className="relative z-10 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                                <span className="relative z-10">{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ─── Contact Column ─── */}
                        <div className="md:col-span-4" id="contacto">
                            <h4 className="font-heading font-bold text-base mb-5 text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                Contacto
                            </h4>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm space-y-1">
                                {/* Email */}
                                <a
                                    href="mailto:contacto@iniciativasonora.org"
                                    className="group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 hover:bg-white/10"
                                >
                                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                        <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-blue-100/50 text-xs font-nav">Email</p>
                                        <p className="text-blue-50 font-medium font-nav">contacto@iniciativasonora.org</p>
                                    </div>
                                </a>
                                {/* Phone */}
                                <a
                                    href="tel:+526621234567"
                                    className="group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 hover:bg-white/10"
                                >
                                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-blue-100/50 text-xs font-nav">Teléfono</p>
                                        <p className="text-blue-50 font-medium font-nav">+52 (662) 123 4567</p>
                                    </div>
                                </a>
                                {/* Location */}
                                <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-blue-100/50 text-xs font-nav">Ubicación</p>
                                        <p className="text-blue-50 font-medium font-nav">Hermosillo, Sonora, México</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Bottom Bar ═══ */}
                <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-blue-200/60 text-xs font-nav tracking-wide">
                        &copy; {new Date().getFullYear()} Iniciativa Sonora en Movimiento y Transformación A.C.
                    </p>
                    <p className="text-blue-200/40 text-xs font-nav">
                        Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
