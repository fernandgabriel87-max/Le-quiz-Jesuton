import React, { useState } from 'react';
import { DifficultyLevel, DIFFICULTY_LABELS } from '../../types';
import { LegalModal } from '../LegalModal';

interface IntroScreenProps {
    onStart: (difficulty: DifficultyLevel) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
    const [showLegal, setShowLegal] = useState(false);

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 bg-gradient-to-br from-orange-400 to-red-500 relative">
            <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
            
            <button 
                onClick={() => setShowLegal(true)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg backdrop-blur-sm transition-colors border border-white/30"
            >
                ⚖️ Conformité
            </button>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center border-b-8 border-orange-700 my-auto">
                <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🥘</div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-2">Sauce Chef Quiz</h1>
                <p className="text-gray-600 mb-6">Choisis ton niveau, Chef !</p>
                
                <div className="space-y-3">
                    {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
                        <button 
                            key={level}
                            onClick={() => onStart(level)}
                            className="w-full bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 text-orange-800 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex justify-between items-center"
                        >
                            <span>{DIFFICULTY_LABELS[level]}</span>
                            <span className="text-2xl">{level === 'easy' ? '🥣' : level === 'medium' ? '🍲' : '👑'}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 text-white/60 text-xs text-center">
                En jouant, vous acceptez notre <button onClick={() => setShowLegal(true)} className="underline hover:text-white">Politique de Lanceur d'Alerte</button>.
            </div>
        </div>
    );
};