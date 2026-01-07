import React, { useState, useRef, useEffect } from 'react';
import { fetchQuizQuestions } from './services/geminiService';
import { QuizQuestion, GameState, DifficultyLevel, DIFFICULTY_LABELS } from './types';
import { SauceTrap } from './components/SauceTrap';
import { WorldMap } from './components/WorldMap';
import { LegalModal } from './components/LegalModal';

const MAX_MISTAKES = 4;
const QUESTIONS_COUNT = 5;

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        status: 'intro',
        score: 0,
        mistakes: 0,
        currentQuestionIndex: 0,
        questions: [],
        lastAnswerCorrect: null,
        difficulty: 'medium',
        selectedRegion: null,
        earnedBadges: []
    });
    
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [isShaking, setIsShaking] = useState(false);
    const [showLegal, setShowLegal] = useState(false);
    
    // Ref for scrolling to top on new question
    const topRef = useRef<HTMLDivElement>(null);

    const startMapSelection = (difficulty: DifficultyLevel) => {
        setGameState(prev => ({ ...prev, status: 'map', difficulty }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startGame = async (region: string) => {
        setGameState(prev => ({ ...prev, status: 'loading', selectedRegion: region }));
        const questions = await fetchQuizQuestions(QUESTIONS_COUNT, gameState.difficulty, region === 'Monde' ? null : region);
        setGameState(prev => ({
            ...prev,
            status: 'playing',
            score: 0,
            mistakes: 0,
            currentQuestionIndex: 0,
            questions,
            lastAnswerCorrect: null
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAnswer = (option: string) => {
        const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
        const isCorrect = option === currentQuestion.correctAnswer;

        setGameState(prev => ({ ...prev, lastAnswerCorrect: isCorrect }));

        if (isCorrect) {
            setFeedbackMessage("C'est validé ! 👨‍🍳✨");
            setTimeout(() => nextTurn(true), 1500);
        } else {
            setIsShaking(true);
            setFeedbackMessage(`Aïe ! C'est chaud ! 🔥`);
            setTimeout(() => setIsShaking(false), 500);
            setTimeout(() => nextTurn(false), 1500);
        }
    };

    const nextTurn = (wasCorrect: boolean) => {
        setGameState(prev => {
            const difficultyMultiplier = prev.difficulty === 'hard' ? 3 : prev.difficulty === 'medium' ? 2 : 1;
            const newScore = wasCorrect ? prev.score + (100 * difficultyMultiplier) : prev.score;
            const newMistakes = wasCorrect ? prev.mistakes : prev.mistakes + 1;
            const isGameOverLost = newMistakes >= MAX_MISTAKES;
            const isFinished = prev.currentQuestionIndex >= prev.questions.length - 1;

            if (isGameOverLost) {
                return { ...prev, status: 'lost', score: newScore, mistakes: newMistakes, lastAnswerCorrect: null };
            }
            
            if (isFinished) {
                let newBadges = [...prev.earnedBadges];
                if (newScore >= 500 && !newBadges.includes("Chef")) newBadges.push("Chef");
                if (prev.selectedRegion && !newBadges.includes(`Explorateur ${prev.selectedRegion}`)) {
                    newBadges.push(`Explorateur ${prev.selectedRegion}`);
                }
                return { ...prev, status: 'won', score: newScore, mistakes: newMistakes, lastAnswerCorrect: null, earnedBadges: newBadges };
            }

            return {
                ...prev,
                score: newScore,
                mistakes: newMistakes,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                lastAnswerCorrect: null
            };
        });
        setFeedbackMessage("");
        // Scroll to top for next question for better visibility on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetGame = () => {
        setGameState(prev => ({ ...prev, status: 'intro', score: 0, mistakes: 0 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- RENDERERS ---

    // NOTE: Removed strict "h-screen" and "justify-center" to allow scrolling on small screens
    
    if (gameState.status === 'intro') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 bg-gradient-to-br from-orange-400 to-red-500 relative">
                <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
                
                {/* Legal Button Top Right */}
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
                                onClick={() => startMapSelection(level)}
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
    }

    if (gameState.status === 'map') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 bg-blue-50">
                <div className="w-full max-w-lg mb-6">
                    <button onClick={() => setGameState(prev => ({...prev, status: 'intro'}))} className="text-blue-600 font-bold flex items-center gap-2 hover:underline bg-white/50 px-4 py-2 rounded-full">
                        ⬅ Retour au menu
                    </button>
                </div>
                <WorldMap onSelectRegion={startGame} />
                <div className="h-10"></div> {/* Bottom spacer */}
            </div>
        );
    }

    if (gameState.status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
                <p className="text-xl sm:text-2xl font-bold text-orange-800 animate-pulse text-center px-4">
                    Le chef prépare le menu... <br/>
                    <span className="text-sm font-normal text-orange-600 mt-2 block">Recherche de plats pour {gameState.selectedRegion}</span>
                </p>
            </div>
        );
    }

    if (gameState.status === 'won' || gameState.status === 'lost') {
        const isWin = gameState.status === 'won';
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
                            <span className="text-2xl font-bold text-orange-600">{gameState.score} pts</span>
                        </div>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {gameState.earnedBadges.length > 0 ? gameState.earnedBadges.map((badge, i) => (
                                <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold border border-purple-200">
                                    🏅 {badge}
                                </span>
                            )) : <span className="text-gray-400 text-sm italic">Aucun badge gagné...</span>}
                        </div>
                    </div>

                    <button 
                        onClick={resetGame}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-transform active:scale-95 shadow-lg"
                    >
                        Nouvelle Partie 🔄
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = gameState.questions[gameState.currentQuestionIndex];

    return (
        <div ref={topRef} className={`min-h-screen flex flex-col items-center p-3 sm:p-4 pb-20 transition-colors duration-500 ${gameState.lastAnswerCorrect === false ? 'bg-red-50' : 'bg-orange-50'}`}>
            
            {/* Header Sticky - Smaller on mobile */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-4 bg-white/95 backdrop-blur p-3 rounded-2xl shadow-md border border-orange-100 sticky top-2 z-40">
                <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">🌍</span>
                    <span className="font-bold text-gray-700 text-xs sm:text-base">Question {gameState.currentQuestionIndex + 1}/{gameState.questions.length}</span>
                </div>
                <div className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-xs sm:text-sm">
                    {gameState.score} pts
                </div>
            </div>

            {/* Game Content */}
            <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-orange-200 ${isShaking ? 'shake' : ''} mb-12`}>
                
                {/* Visual Trap - Smaller padding on mobile */}
                <div className="p-2 sm:p-6 pb-0">
                     <SauceTrap mistakes={gameState.mistakes} maxMistakes={MAX_MISTAKES} />
                </div>

                <div className="p-4 sm:p-8 pt-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
                            📍 {currentQ.country}
                        </span>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
                             {DIFFICULTY_LABELS[gameState.difficulty].split(' ')[0]}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                        {currentQ.description}
                    </h2>

                    {/* Options */}
                    <div className="flex flex-col gap-3">
                        {currentQ.options.map((option, idx) => {
                            let btnClass = "w-full text-left p-3 sm:p-4 rounded-xl border-2 font-bold text-base sm:text-lg transition-all duration-200 transform active:scale-[0.98] ";
                            
                            if (gameState.lastAnswerCorrect !== null) {
                                if (option === currentQ.correctAnswer) {
                                    btnClass += "bg-green-500 border-green-600 text-white shadow-lg";
                                } else if (option !== currentQ.correctAnswer && gameState.lastAnswerCorrect === false) {
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
                                    onClick={() => gameState.lastAnswerCorrect === null && handleAnswer(option)}
                                    disabled={gameState.lastAnswerCorrect !== null}
                                    className={btnClass}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {gameState.lastAnswerCorrect !== null && option === currentQ.correctAnswer && (
                                            <span>✅</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <div className={`mt-6 overflow-hidden transition-all duration-300 ${gameState.lastAnswerCorrect !== null ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className={`${gameState.lastAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} p-4 rounded-xl text-center border-2 ${gameState.lastAnswerCorrect ? 'border-green-200' : 'border-red-200'}`}>
                            <p className="text-xl font-bold mb-2">{feedbackMessage}</p>
                            <p className="text-sm italic opacity-90">
                                💡 Saviez-vous ? {currentQ.funFact}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Safety spacer for bottom scroll */}
            <div className="h-10"></div>
        </div>
    );
};

export default App;