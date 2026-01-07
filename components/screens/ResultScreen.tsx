import React from 'react';

interface ResultScreenProps {
    status: 'won' | 'lost';
    score: number;
    earnedBadges: string[];
    onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ status, score, earnedBadges, onReset }) => {
    const isWin = status === 'won';
    return (
        <div className={`min-h-screen w-full flex flex-col items-center py-12 px-4 ${isWin ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center border-b-4 border-gray-200 my-auto">
                <div className="text-7xl sm:text-8xl mb-4 animate-bounce">
                    {isWin ? '🥂' : '🩹'}
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                    {isWin ? 'Service Impeccable !' : 'C\'est la Cata !'}
                </h2>
                <p className="text-gray-600 mb-6">
                    {isWin 
                        ? "Tu as régalé tout le monde !" 
                        : "Le chef a glissé dans la marmite..."}
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <p className="font-bold text-gray-500 text-xs uppercase mb-2">Récompenses & Score</p>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Score</span>
                        <span className="text-2xl font-bold text-orange-600">{score} pts</span>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {earnedBadges.length > 0 ? earnedBadges.map((badge, i) => (
                            <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold border border-purple-200">
                                🏅 {badge}
                            </span>
                        )) : <span className="text-gray-400 text-sm italic">Aucun badge gagné...</span>}
                    </div>
                </div>

                <button 
                    onClick={onReset}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-transform active:scale-95 shadow-lg"
                >
                    Nouvelle Partie 🔄
                </button>
            </div>
        </div>
    );
};