import React from 'react';

const Projects = () => {
    const projects = [
        {
            title: 'Conexión Paisano',
            category: 'Remesas',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            title: 'Salud para Todos',
            category: 'Salud',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            title: 'Defensa Migrante',
            category: 'Legal',
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
    ];

    return (
        <section id="proyectos" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-xl">
                        <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Impacto Real</span>
                        <h2 className="text-4xl font-bold font-heading text-dark">
                            Proyectos Vivos
                        </h2>
                    </div>
                    <button className="hidden md:block text-primary font-bold hover:text-blue-700 transition-colors">
                        Ver todos los proyectos &rarr;
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl shadow-md cursor-pointer h-80"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <span className="text-primary font-bold text-sm mb-2">{project.category}</span>
                                <h3 className="text-white text-xl font-bold font-heading">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button className="text-primary font-bold hover:text-blue-700 transition-colors">
                        Ver todos los proyectos &rarr;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Projects;
