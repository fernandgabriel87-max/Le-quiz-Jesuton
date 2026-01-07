import React from 'react';

interface WorldMapProps {
    onSelectRegion: (region: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onSelectRegion }) => {
    const regions = [
        { id: 'Afrique', color: 'fill-yellow-500 hover:fill-yellow-400', path: "M53 45 L65 45 L70 55 L75 75 L60 90 L45 80 L40 60 Z", label: "Afrique 🌍" },
        { id: 'Europe', color: 'fill-blue-500 hover:fill-blue-400', path: "M45 25 L55 20 L65 25 L60 40 L50 42 L40 35 Z", label: "Europe 🏰" },
        { id: 'Asie', color: 'fill-red-500 hover:fill-red-400', path: "M65 20 L90 20 L100 40 L90 60 L70 50 L65 40 Z", label: "Asie 🥢" },
        { id: 'Amériques', color: 'fill-green-500 hover:fill-green-400', path: "M15 20 L35 20 L40 40 L35 80 L25 95 L10 60 L5 30 Z", label: "Amériques 🌽" },
        { id: 'Océanie', color: 'fill-purple-500 hover:fill-purple-400', path: "M80 70 L95 70 L100 85 L90 90 L80 85 Z", label: "Océanie 🦘" },
    ];

    return (
        <div className="w-full max-w-lg mx-auto bg-blue-50 rounded-3xl p-4 shadow-xl border-4 border-blue-200">
            <h3 className="text-center text-xl font-bold text-blue-800 mb-4">Où partons-nous ? ✈️</h3>
            
            {/* Simplified Artistic Map Representation */}
            <div className="relative w-full aspect-video bg-blue-100 rounded-xl overflow-hidden shadow-inner cursor-pointer group">
                <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-md transform transition-transform duration-500 hover:scale-105">
                    {/* Ocean Pattern */}
                    <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                        <circle id="pattern-circle" cx="5" cy="5" r="1" className="fill-blue-200" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />

                    {/* Continents */}
                    {regions.map((region) => (
                        <g key={region.id} onClick={() => onSelectRegion(region.id)} className="cursor-pointer transition-all duration-300">
                            <path 
                                d={region.path} 
                                className={`${region.color} stroke-white stroke-1 transition-colors duration-300`} 
                            />
                            {/* Simplified label positioning (approximate center of paths) */}
                        </g>
                    ))}
                </svg>
                
                {/* Labels Overlay for better readability on mobile */}
                <div className="absolute inset-0 pointer-events-none flex flex-wrap justify-center items-center content-center gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                    <span className="bg-white/90 px-2 py-1 rounded text-xs">Clique sur une zone !</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {regions.map((region) => (
                    <button
                        key={region.id}
                        onClick={() => onSelectRegion(region.id)}
                        className="bg-white border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 text-gray-700 font-bold py-2 px-3 rounded-lg text-sm transition-all shadow-sm"
                    >
                        {region.label}
                    </button>
                ))}
                 <button
                    onClick={() => onSelectRegion('Monde')}
                    className="col-span-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg transform active:scale-95"
                >
                    Surprise (Monde Entier) 🌎
                </button>
            </div>
        </div>
    );
};