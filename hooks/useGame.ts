import { useState } from 'react';
import { fetchQuizQuestions } from '../services/geminiService';
import { GameState, DifficultyLevel } from '../types';

const MAX_MISTAKES = 4;
const QUESTIONS_COUNT = 5;

export const useGame = () => {
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
        return isCorrect;
    };

    const nextTurn = () => {
        setGameState(prev => {
            const wasCorrect = prev.lastAnswerCorrect === true;
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetGame = () => {
        setGameState(prev => ({ ...prev, status: 'intro', score: 0, mistakes: 0, lastAnswerCorrect: null }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const returnToIntro = () => {
         setGameState(prev => ({ ...prev, status: 'intro' }));
    };

    return {
        gameState,
        startMapSelection,
        startGame,
        handleAnswer,
        nextTurn,
        resetGame,
        returnToIntro,
        MAX_MISTAKES
    };
};