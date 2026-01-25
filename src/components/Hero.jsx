import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import ContactModal from './ContactModal';

const Hero = () => {
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start muted (browser policy)
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const playerRef = useRef(null);

    // Playlist from official @sounds3767 channel (46 PUBLIC videos only)
    const playlist = [
        'anWAWaK4ZdU', // Featured first
        'KJgdlGhkf28', 'Gmx_szNCQos', 'Ty4Gi4XGk8w', 'BR5fkQkeQ9U', 'ESXj404aIjk',
        'kPrCFGZiIMQ', 'uOKZkYPFQqI', 'myan6gEY-8c', '7LX_V_o6rUc', 'qQl8B5mAGhY',
        'SJQ-_yQmFnI', 'rjprgylD9kw', 'yV1srH61Sf8', 'ZYpiumUJ3BM', 'bc86lcQDaPY',
        'fLeePiAI88k', '11QL4crYNkw', 'yIpdexrZkKM', '7NDLD6KhMBw', 'Z5r2hJ2PLUs',
        'oi6nq5BlQTA', 'F2QlQB3sddk', 'lLmQuAUSDPY', 'M5psRNVhK-w',
        'BtyB-KjQLWw', 'p4pE50CUNa0', 'qQnY-uilIxw', 'eaWtj1JGvc4', 'wTz8HuQlP3A',
        'b0z6gEK6kFw', 'bpqTBM-qMuc', 'S9tkHvqDGpo', 'TGNlCvdXSfk', 'fJKlWrnmEtM',
        'NY4RkAkokmk', 'w_2AlP-6jtM', '80ZsJm42_lw', 'JPI1Sbavtc4', 'WxEu8sViBEg',
        'PsSLrBH3vWU', 'dW4OSxZatC0', 'UiRhfwYeEFg', '11grPbL5FFc', '7UERcWrduZU',
        '0FRke3tX_uk'
    ];

    const videoId = playlist[currentVideoIndex];

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            mute: 1, // Start muted for autoplay to work (browser policy)
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
        },
    };

    const onPlayerReady = (event) => {
        playerRef.current = event.target;
        setIsPlayerReady(true);
        // Ensure state matches player
        if (isMuted) {
            event.target.mute();
        } else {
            event.target.unMute();
            event.target.setVolume(50);
        }

        // Random start to feel organic
        const randomStart = Math.floor(Math.random() * 60);
        event.target.seekTo(randomStart);
        event.target.playVideo();
    };

    const toggleMute = () => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.unMute();
                playerRef.current.setVolume(40);
            } else {
                playerRef.current.mute();
            }
            setIsMuted(!isMuted);
        }
    };

    const nextVideo = () => {
        const nextIndex = (currentVideoIndex + 1) % playlist.length;
        setCurrentVideoIndex(nextIndex);
        // Note: The YouTube component will re-render with new ID
    };

    // Styling for sprockets - Sepia Black: #1a1814 (Approx)
    // Film color base: bg-[#1a1814]
    const sprocketStyle = {
        backgroundImage: `repeating-linear-gradient(90deg, #F3F4F6 0, #F3F4F6 12px, #1a1814 12px, #1a1814 30px)`,
        height: '40px',
        width: '100%',
    };

    return (
        <section id="inicio" className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-20 px-4 transition-colors duration-[3000ms]">
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

            {/* Film Frame Container - Sepia Black Theme */}
            <div className="relative w-full max-w-6xl mx-auto shadow-2xl bg-[#1a1814]">

                {/* Top Sprockets */}
                <div className="w-full bg-[#1a1814] py-4 border-b-4 border-[#1a1814] box-border relative z-20">
                    <div style={sprocketStyle} className="opacity-90 rounded-[2px]"></div> {/* Removed animate-film-roll */}
                </div>

                {/* Video Area */}
                <div className="relative w-full aspect-video bg-[#1a1814] overflow-hidden group">
                    <div className="absolute inset-0 scale-[1.35] pointer-events-none transition-opacity duration-1000">
                        <YouTube
                            key={videoId} // Key change forces re-render for new video
                            videoId={videoId}
                            opts={opts}
                            onReady={onPlayerReady}
                            onEnd={nextVideo} // Enable auto-advance for playlist behavior
                            className="w-full h-full object-cover"
                            iframeClassName="w-full h-full object-cover"
                        />
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
                        {/* Audio Toggle */}
                        <button
                            onClick={toggleMute}
                            className="bg-black/40 hover:bg-primary/80 text-white p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 border border-white/20"
                            title={isMuted ? "Activar sonido" : "Silenciar"}
                        >
                            {isMuted ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeClip="m17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"></line></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                            )}
                        </button>

                        {/* Next Video */}
                        <button
                            onClick={nextVideo}
                            className="bg-black/40 hover:bg-primary/80 text-white p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 border border-white/20 group/next"
                            title="Siguiente video ambiental"
                        >
                            <svg className="w-6 h-6 group-hover/next:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        </button>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/5">
                        <div className="max-w-4xl mx-auto text-white drop-shadow-md">
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
                                Iniciativa Sonora en <br />
                                <span className="text-primary">Movimiento y Transformación</span> A.C.
                            </h1>
                            <p className="text-base md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-sans shadow-black drop-shadow-lg">
                                Unidos para brindar apoyo, asesoría y esperanza a nuestros hermanos migrantes y sus familias.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="px-8 py-3 bg-primary hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                                    title="Ponte en contacto con nosotros"
                                >
                                    Contáctanos
                                </button>
                                <a
                                    href="#servicios"
                                    className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white rounded-full font-bold text-lg transition-all backdrop-blur-sm"
                                >
                                    Nuestros Servicios
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Sprockets */}
                <div className="w-full bg-[#1a1814] py-4 border-t-4 border-[#1a1814] box-border relative z-20">
                    <div style={sprocketStyle} className="opacity-90 rounded-[2px]"></div> {/* Removed animate-film-roll */}
                </div>

            </div>
        </section>
    );
};

export default Hero;
