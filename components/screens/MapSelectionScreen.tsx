import React from 'react';
import { WorldMap } from '../WorldMap';

interface MapSelectionScreenProps {
    onSelectRegion: (region: string) => void;
    onBack: () => void;
}

export const MapSelectionScreen: React.FC<MapSelectionScreenProps> = ({ onSelectRegion, onBack }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 bg-blue-50">
            <div className="w-full max-w-lg mb-6">
                <button onClick={onBack} className="text-blue-600 font-bold flex items-center gap-2 hover:underline bg-white/50 px-4 py-2 rounded-full">
                    ⬅ Retour au menu
                </button>
            </div>
            <WorldMap onSelectRegion={onSelectRegion} />
            <div className="h-10"></div>
        </div>
    );
};