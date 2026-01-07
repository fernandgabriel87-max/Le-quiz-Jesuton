export interface QuizQuestion {
    country: string;
    description: string;
    correctAnswer: string;
    options: string[];
    funFact: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GameState {
    status: 'intro' | 'map' | 'loading' | 'playing' | 'won' | 'lost';
    score: number;
    mistakes: number;
    currentQuestionIndex: number;
    questions: QuizQuestion[];
    lastAnswerCorrect: boolean | null;
    difficulty: DifficultyLevel;
    selectedRegion: string | null;
    earnedBadges: string[];
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    easy: 'Apprenti (Facile)',
    medium: 'Sous-Chef (Moyen)',
    hard: 'Chef Étoilé (Difficile)'
};