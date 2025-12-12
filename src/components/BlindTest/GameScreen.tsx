'use client';

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
    const [timeLeft, setTimeLeft] = useState(15);
    const [timerProgress, setTimerProgress] = useState(100);

    const handleAnswer = (index: number) => {
        setSelectedIndex(index);
        onAnswer(index);
    };

    const handleQuit = () => {
        if (onQuit) {
            onQuit();
        }
    };

    if (!isAnswered && selectedIndex !== undefined) {
        setSelectedIndex(undefined);
    }

    useEffect(() => {
        setTimeLeft(15);
        setTimerProgress(100);
    }, [questionNumber]);

    useEffect(() => {
        if (isAnswered) return;

        const startTime = Date.now();
        const duration = 15000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const seconds = Math.ceil(remaining / 1000);
            const progress = (remaining / duration) * 100;

            setTimeLeft(seconds);
            setTimerProgress(progress);

            if (remaining <= 0) {
                clearInterval(interval);
                setTimeout(() => {
                    onNext();
                }, 500);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [questionNumber, isAnswered, onNext]);

    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

    return (
        <div className="relative w-full">
            <div className="w-full flex items-center justify-between mb-8">
                <button 
                    onClick={handleQuit}
                    className="flex items-center justify-center transition-colors z-10"
                >
                    <X className="w-6 h-6 text-white hover:text-gray-400" />
                </button>
                
                <h1 className="text-2xl font-bold text-white absolute left-1/2 -translate-x-1/2">
                    Mellow Morning
                </h1>
                
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                    <span className="text-white text-sm font-medium">
                        {questionNumber}/{totalQuestions}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="60"
                        stroke="#282828"
                        strokeWidth="8"
                        fill="none"
                    />
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
                <div className="text-6xl font-bold text-white">
                    {!isAnswered ? timeLeft : score}
                </div>
            </div>

            {!isAnswered && (
                <div className="flex items-center gap-2 text-green-500 animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-sm font-medium">En écoute...</span>
                </div>
            )}

            <div className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-lg">
                {score} pts
            </div>

            <AnswerButtons
                options={question.options}
                correctIndex={question.correctIndex}
                onAnswer={handleAnswer}
                isAnswered={isAnswered}
                selectedIndex={selectedIndex}
            />

            {isAnswered && (
                <button
                    onClick={onNext}
                    className="mt-4 px-8 py-3 bg-white text-black rounded-full font-semibold text-base hover:scale-105 transition-transform"
                >
                    Question suivante
                </button>
            )}
            </div>
        </div>
    );
}
