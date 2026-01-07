import React from 'react';
import { useGame } from './hooks/useGame';
import { IntroScreen } from './components/screens/IntroScreen';
import { MapSelectionScreen } from './components/screens/MapSelectionScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { GameScreen } from './components/screens/GameScreen';
import { ResultScreen } from './components/screens/ResultScreen';

const App: React.FC = () => {
    const { 
        gameState, 
        startMapSelection, 
        startGame, 
        handleAnswer, 
        nextTurn, 
        resetGame,
        returnToIntro,
        MAX_MISTAKES
    } = useGame();

    switch (gameState.status) {
        case 'intro':
            return <IntroScreen onStart={startMapSelection} />;
            
        case 'map':
            return <MapSelectionScreen onSelectRegion={startGame} onBack={returnToIntro} />;
            
        case 'loading':
            return <LoadingScreen region={gameState.selectedRegion} />;
            
        case 'playing':
            return (
                <GameScreen 
                    question={gameState.questions[gameState.currentQuestionIndex]}
                    questionIndex={gameState.currentQuestionIndex}
                    totalQuestions={gameState.questions.length}
                    score={gameState.score}
                    difficulty={gameState.difficulty}
                    mistakes={gameState.mistakes}
                    maxMistakes={MAX_MISTAKES}
                    lastAnswerCorrect={gameState.lastAnswerCorrect}
                    onAnswer={handleAnswer}
                    onNextTurn={nextTurn}
                />
            );
            
        case 'won':
        case 'lost':
            return (
                <ResultScreen 
                    status={gameState.status}
                    score={gameState.score}
                    earnedBadges={gameState.earnedBadges}
                    onReset={resetGame}
                />
            );
            
        default:
            return null;
    }
};

export default App;