import React from 'react';

interface SauceTrapProps {
    mistakes: number;
    maxMistakes: number;
}

export const SauceTrap: React.FC<SauceTrapProps> = ({ mistakes, maxMistakes }) => {
    // Calculate position of the chef. 0 mistakes = top, maxMistakes = in the sauce
    const percentage = Math.min((mistakes / maxMistakes) * 100, 100);
    
    // Chef expressions based on danger
    const getChefEmoji = () => {
        if (mistakes === 0) return "👨‍🍳";
        if (mistakes < maxMistakes / 2) return "😰";
        if (mistakes < maxMistakes) return "😱";
        return "💀";
    };

    return (
        // Changed h-64 to h-40 on mobile, h-64 on sm screens to save space
        <div className="relative w-full h-40 sm:h-64 bg-yellow-100 rounded-xl overflow-hidden border-4 border-orange-200 shadow-inner mt-2 sm:mt-4">
            {/* Background Kitchen Tiles */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* The Rope/Support Structure */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-amber-800 opacity-20"></div>

            {/* The Chef on a shrinking plank */}
            <div 
                className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out z-20 flex flex-col items-center`}
                style={{ 
                    top: mistakes >= maxMistakes ? '80%' : `${10 + (percentage * 0.5)}%` 
                }}
            >
                {/* Smaller emoji on mobile */}
                <div className={`text-5xl sm:text-6xl filter drop-shadow-lg ${mistakes >= maxMistakes ? 'animate-spin' : 'animate-bounce'}`}>
                    {getChefEmoji()}
                </div>
                {mistakes < maxMistakes && (
                    <div className="w-20 sm:w-24 h-2 bg-amber-700 rounded mt-1 shadow-md"></div>
                )}
            </div>

            {/* The Boiling Sauce */}
            <div className="absolute bottom-0 w-full h-20 sm:h-24 overflow-hidden z-30">
                {/* Back Wave */}
                <div className="absolute bottom-2 w-[200%] h-full bg-red-600 rounded-[40%] sauce-wave opacity-70" style={{ left: '-50%', animationDuration: '6s' }}></div>
                {/* Front Wave */}
                <div className="absolute bottom-[-10px] w-[200%] h-full bg-red-500 rounded-[45%] sauce-wave" style={{ left: '0%' }}></div>
                
                {/* Bubbles */}
                <div className="absolute bottom-0 left-[10%] w-4 h-4 bg-red-300 rounded-full animate-bubble opacity-60" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-0 left-[30%] w-6 h-6 bg-red-300 rounded-full animate-bubble opacity-60" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 left-[60%] w-3 h-3 bg-red-300 rounded-full animate-bubble opacity-60" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-0 left-[85%] w-5 h-5 bg-red-300 rounded-full animate-bubble opacity-60" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Steam */}
            <div className="absolute bottom-16 left-8 text-3xl opacity-40 animate-pulse">♨️</div>
            <div className="absolute bottom-12 right-8 text-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>♨️</div>

            {/* Status Text */}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-red-600 shadow-sm border border-red-100">
                Danger: {Math.round(percentage)}%
            </div>
        </div>
    );
};