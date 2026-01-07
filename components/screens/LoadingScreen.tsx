import React from 'react';

interface LoadingScreenProps {
    region: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ region }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl sm:text-2xl font-bold text-orange-800 animate-pulse text-center px-4">
                Le chef prépare le menu... <br/>
                <span className="text-sm font-normal text-orange-600 mt-2 block">Recherche de plats pour {region}</span>
            </p>
        </div>
    );
};