'use client';

// Écran de jeu principal (C2-C4)

import { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AnswerButtons } from './AnswerButtons';
import { BlindTestQuestion, GameMode } from '@/hooks/useBlindTest';

interface GameScreenProps {
    question: BlindTestQuestion;
    questionNumber: number;
    totalQuestions: number;
    score: number;
    mode: GameMode;
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
    mode,
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
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
            {/* Header avec score et progression */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm">Question</span>
                    <span className="text-white font-bold text-lg">
                        {questionNumber}/{totalQuestions}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm">Score</span>
                    <span className="text-green-400 font-bold text-lg">{score}</span>
                </div>
            </div>

            {/* Badge du mode de jeu */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${mode === 'audio'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                {mode === 'audio' ? '🎧 Mode Audio' : '🎤 Quiz Artiste'}
            </div>

            {/* Barre de progression */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                    style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                />
            </div>

            {/* Album cover */}
            <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl">
                {isAnswered && question.track.albumImageUrl ? (
                    <img
                        src={question.track.albumImageUrl}
                        alt="Album cover"
                        className="w-full h-full object-cover animate-fade-in"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                        <span className="text-6xl">{mode === 'audio' ? '🎵' : '🎤'}</span>
                    </div>
                )}
            </div>

            {/* Mode Audio: Audio player */}
            {mode === 'audio' && question.track.previewUrl && (
                <AudioPlayer
                    previewUrl={question.track.previewUrl}
                    isPlaying={!isAnswered}
                />
            )}

            {/* Mode Artist: Affiche le nom de la chanson */}
            {mode === 'artist' && (
                <div className="text-center py-4">
                    <p className="text-zinc-400 text-sm mb-2">Qui chante cette chanson ?</p>
                    <p className="text-2xl font-bold text-white">"{question.track.name}"</p>
                </div>
            )}

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
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className={`text-lg font-semibold ${lastAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {lastAnswerCorrect ? '✓ Correct !' : '✗ Mauvaise réponse'}
                    </div>

                    <div className="text-center">
                        <p className="text-white font-medium">{question.track.name}</p>
                        <p className="text-zinc-400 text-sm">
                            {question.track.artists.join(', ')}
                        </p>
                    </div>

                    <button
                        onClick={onNext}
                        className="mt-2 px-8 py-3 rounded-full bg-green-500 hover:bg-green-400 text-white font-semibold transition-all hover:scale-105"
                    >
                        {questionNumber === totalQuestions ? 'Voir le résultat' : 'Question suivante →'}
                    </button>
                </div>
            )}
        </div>
    );
}

