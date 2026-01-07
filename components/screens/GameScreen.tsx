import React, { useState } from 'react';
import { QuizQuestion, DifficultyLevel, DIFFICULTY_LABELS } from '../../types';
import { SauceTrap } from '../SauceTrap';

interface GameScreenProps {
    question: QuizQuestion;
    questionIndex: number;
    totalQuestions: number;
    score: number;
    difficulty: DifficultyLevel;
    mistakes: number;
    maxMistakes: number;
    lastAnswerCorrect: boolean | null;
    onAnswer: (option: string) => boolean;
    onNextTurn: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
    question,
    questionIndex,
    totalQuestions,
    score,
    difficulty,
    mistakes,
    maxMistakes,
    lastAnswerCorrect,
    onAnswer,
    onNextTurn
}) => {
    const [isShaking, setIsShaking] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");

    const handleOptionClick = (option: string) => {
        const isCorrect = onAnswer(option);
        
        if (isCorrect) {
            setFeedbackMessage("C'est validé ! 👨‍🍳✨");
            setTimeout(onNextTurn, 1500);
        } else {
            setIsShaking(true);
            setFeedbackMessage(`Aïe ! C'est chaud ! 🔥`);
            setTimeout(() => setIsShaking(false), 500);
            setTimeout(onNextTurn, 1500);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center p-3 sm:p-4 pb-20 transition-colors duration-500 ${lastAnswerCorrect === false ? 'bg-red-50' : 'bg-orange-50'}`}>
            {/* Header Sticky - Smaller on mobile */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-4 bg-white/95 backdrop-blur p-3 rounded-2xl shadow-md border border-orange-100 sticky top-2 z-40">
                <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">🌍</span>
                    <span className="font-bold text-gray-700 text-xs sm:text-base">Question {questionIndex + 1}/{totalQuestions}</span>
                </div>
                <div className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-xs sm:text-sm">
                    {score} pts
                </div>
            </div>

            {/* Game Content */}
            <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-orange-200 ${isShaking ? 'shake' : ''} mb-12`}>
                
                {/* Visual Trap - Smaller padding on mobile */}
                <div className="p-2 sm:p-6 pb-0">
                     <SauceTrap mistakes={mistakes} maxMistakes={maxMistakes} />
                </div>

                <div className="p-4 sm:p-8 pt-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
                            📍 {question.country}
                        </span>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
                             {DIFFICULTY_LABELS[difficulty].split(' ')[0]}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                        {question.description}
                    </h2>

                    {/* Options */}
                    <div className="flex flex-col gap-3">
                        {question.options.map((option, idx) => {
                            let btnClass = "w-full text-left p-3 sm:p-4 rounded-xl border-2 font-bold text-base sm:text-lg transition-all duration-200 transform active:scale-[0.98] ";
                            
                            if (lastAnswerCorrect !== null) {
                                if (option === question.correctAnswer) {
                                    btnClass += "bg-green-500 border-green-600 text-white shadow-lg";
                                } else if (option !== question.correctAnswer && lastAnswerCorrect === false) {
                                    btnClass += "opacity-50 bg-gray-100 border-gray-200 text-gray-400";
                                } else {
                                    btnClass += "bg-white border-gray-200 text-gray-800";
                                }
                            } else {
                                btnClass += "bg-white border-orange-100 text-gray-700 hover:border-orange-400 hover:bg-orange-50 shadow-sm";
                            }

                            return (
                                <button 
                                    key={idx}
                                    onClick={() => lastAnswerCorrect === null && handleOptionClick(option)}
                                    disabled={lastAnswerCorrect !== null}
                                    className={btnClass}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {lastAnswerCorrect !== null && option === question.correctAnswer && (
                                            <span>✅</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <div className={`mt-6 overflow-hidden transition-all duration-300 ${lastAnswerCorrect !== null ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className={`${lastAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} p-4 rounded-xl text-center border-2 ${lastAnswerCorrect ? 'border-green-200' : 'border-red-200'}`}>
                            <p className="text-xl font-bold mb-2">{feedbackMessage}</p>
                            <p className="text-sm italic opacity-90">
                                💡 Saviez-vous ? {question.funFact}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="h-10"></div>
        </div>
    );
};