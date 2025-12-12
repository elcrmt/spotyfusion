'use client';

// Écran de jeu principal (C2-C4)
// Version SDK Spotify (dumb component)

import { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AnswerButtons } from './AnswerButtons';
import { BlindTestQuestion } from '@/hooks/useBlindTest';
import { Music } from 'lucide-react';

interface GameScreenProps {
    question: BlindTestQuestion;
    questionNumber: number;
    totalQuestions: number;
    score: number;
    onAnswer: (index: number) => void;
    onNext: () => void;
    isAnswered: boolean;
    lastAnswerCorrect: boolean | null;
}

export function GameScreen({
    question,
    questionNumber,
    totalQuestions,
    score,
    onAnswer,
    onNext,
    isAnswered,
    lastAnswerCorrect,
}: GameScreenProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    const handleAnswer = (index: number) => {
        setSelectedIndex(index);
        onAnswer(index);
    };

    // Reset selectedIndex when question changes
    if (!isAnswered && selectedIndex !== undefined) {
        setSelectedIndex(undefined);
    }

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto px-4">
            {/* Header avec score et progression */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-zinc-400 text-xs sm:text-sm">Question</span>
                    <span className="text-white font-bold text-base sm:text-lg">
                        {questionNumber}/{totalQuestions}
                    </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-zinc-400 text-xs sm:text-sm">Score</span>
                    <span className="text-green-400 font-bold text-base sm:text-lg">{score}</span>
                </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                    style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                />
            </div>

            {/* Album cover */}
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl">
                {isAnswered && question.track.albumImageUrl ? (
                    <img
                        src={question.track.albumImageUrl}
                        alt="Album cover"
                        className="w-full h-full object-cover animate-fade-in"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                        <Music className="w-16 h-16 sm:w-20 sm:h-20 text-zinc-600" />
                    </div>
                )}
            </div>

            {/* Audio player (Visual only) */}
            <AudioPlayer isPlaying={!isAnswered} />

            {/* Boutons de réponse */}
            <AnswerButtons
                options={question.options}
                correctIndex={question.correctIndex}
                onAnswer={handleAnswer}
                isAnswered={isAnswered}
                selectedIndex={selectedIndex}
            />

            {/* Feedback et bouton suivant */}
            {isAnswered && (
                <div className="flex flex-col items-center gap-3 sm:gap-4 animate-fade-in w-full">
                    <div className={`text-base sm:text-lg font-semibold ${lastAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {lastAnswerCorrect ? '✓ Correct !' : '✗ Mauvaise réponse'}
                    </div>

                    <div className="text-center">
                        <p className="text-white font-medium text-sm sm:text-base">{question.track.name}</p>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                            {question.track.artists.join(', ')}
                        </p>
                    </div>

                    <button
                        onClick={onNext}
                        className="mt-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-green-500 hover:bg-green-400 text-white text-sm sm:text-base font-semibold transition-all hover:scale-105"
                    >
                        {questionNumber === totalQuestions ? 'Voir le résultat' : 'Question suivante →'}
                    </button>
                </div>
            )}

        </div>
    );
}
