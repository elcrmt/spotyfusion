'use client';

// Écran de jeu principal - Design maquette Figma

import { useState, useEffect } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { AnswerButtons } from './AnswerButtons';
import { BlindTestQuestion } from '@/hooks/useBlindTest';
import { X } from 'lucide-react';

interface GameScreenProps {
    question: BlindTestQuestion;
    questionNumber: number;
    totalQuestions: number;
    score: number;
    onAnswer: (index: number) => void;
    onNext: () => void;
    onQuit?: () => void;
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
    onQuit,
    isAnswered,
    lastAnswerCorrect,
}: GameScreenProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
    const [timeLeft, setTimeLeft] = useState(15); // Timer de 15 secondes
    const [timerProgress, setTimerProgress] = useState(100); // Pourcentage du timer

    const handleAnswer = (index: number) => {
        setSelectedIndex(index);
        onAnswer(index);
    };

    const handleQuit = () => {
        if (onQuit) {
            onQuit();
        }
    };

    // Reset selectedIndex when question changes
    if (!isAnswered && selectedIndex !== undefined) {
        setSelectedIndex(undefined);
    }

    // Timer de 15 secondes - Reset au changement de question
    useEffect(() => {
        setTimeLeft(15);
        setTimerProgress(100);
    }, [questionNumber]);

    // Gestion du timer (décompte uniquement si non répondu)
    useEffect(() => {
        if (isAnswered) return;

        const startTime = Date.now();
        const duration = 15000; // 15 secondes en ms

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const seconds = Math.ceil(remaining / 1000);
            const progress = (remaining / duration) * 100;

            setTimeLeft(seconds);
            setTimerProgress(progress);

            if (remaining <= 0) {
                clearInterval(interval);
                // Timeout : on passe automatiquement à la question suivante sans points
                setTimeout(() => {
                    onNext();
                }, 500);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [questionNumber, isAnswered, onNext]);

    // Calcul pour le cercle du timer
    const circumference = 2 * Math.PI * 60; // rayon = 60
    const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            {/* Header avec bouton fermer à gauche, titre au centre et compteur à droite */}
            <div className="w-full flex items-center justify-between mb-4 relative">
                {/* Bouton fermer à gauche */}
                <button 
                    onClick={handleQuit}
                    className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#282828] flex items-center justify-center transition-colors z-10"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
                
                {/* Titre au centre (absolu pour être vraiment centré) */}
                <h1 className="text-xl font-bold text-white absolute left-1/2 -translate-x-1/2">
                    Mellow Morning
                </h1>
                
                {/* Compteur à droite */}
                <div className="text-white text-sm font-medium">
                    {questionNumber}/{totalQuestions}
                </div>
            </div>

            {/* Cercle de timer avec temps restant */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Cercle SVG */}
                <svg className="absolute w-full h-full -rotate-90">
                    {/* Cercle de fond */}
                    <circle
                        cx="96"
                        cy="96"
                        r="60"
                        stroke="#282828"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Cercle de timer vert */}
                    <circle
                        cx="96"
                        cy="96"
                        r="60"
                        stroke="#1db954"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-100"
                    />
                </svg>
                {/* Temps restant ou score au centre */}
                <div className="text-6xl font-bold text-white">
                    {!isAnswered ? timeLeft : score}
                </div>
            </div>

            {/* Indicateur de lecture audio */}
            {!isAnswered && (
                <div className="flex items-center gap-2 text-green-500 animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-sm font-medium">En écoute...</span>
                </div>
            )}

            {/* Badge avec points gagnés ou nom de la chanson */}
            <div className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-lg">
                {!isAnswered ? '10 pts' : question.track.name}
            </div>

            {/* Boutons de réponse */}
            <AnswerButtons
                options={question.options}
                correctIndex={question.correctIndex}
                onAnswer={handleAnswer}
                isAnswered={isAnswered}
                selectedIndex={selectedIndex}
            />

            {/* Bouton suivant (visible uniquement après avoir répondu) */}
            {isAnswered && (
                <button
                    onClick={onNext}
                    className="mt-4 px-8 py-3 bg-white text-black rounded-full font-semibold text-base hover:scale-105 transition-transform"
                >
                    Question suivante
                </button>
            )}
        </div>
    );
}
