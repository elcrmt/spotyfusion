'use client';

import { useEffect, useRef, useState } from 'react';
import { Headphones } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
}

const AUDIO_DURATION = 30;

export function AudioPlayer({ isPlaying }: AudioPlayerProps) {
    const [progress, setProgress] = useState(0);
    const [remainingTime, setRemainingTime] = useState(AUDIO_DURATION);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let startTime: number;

        if (isPlaying) {
            startTime = Date.now();
            setProgress(0);
            setRemainingTime(AUDIO_DURATION);

            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;

                if (elapsed >= AUDIO_DURATION) {
                    setProgress(100);
                    setRemainingTime(0);
                    clearInterval(interval);
                } else {
                    setProgress((elapsed / AUDIO_DURATION) * 100);
                    setRemainingTime(Math.ceil(AUDIO_DURATION - elapsed));
                }
            }, 100);
        } else {
            setProgress(0);
            setRemainingTime(AUDIO_DURATION);
        }

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="w-full">
            {/* Visualisation */}
            <div className="flex flex-col items-center gap-4">
                {/* Cercle animé */}
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Cercle de fond */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#27272a"
                            strokeWidth="8"
                        />
                        {/* Cercle de progression */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${progress * 2.83} 283`}
                            className="transition-all duration-200"
                        />
                    </svg>

                    {/* Timer au centre */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-white">{remainingTime}</span>
                            <span className="text-zinc-400 text-sm block">sec</span>
                        </div>
                    </div>
                </div>

                {/* Animation musicale */}
                {isPlaying && (
                    <div className="flex items-end gap-1 h-8">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-green-500 rounded-full animate-pulse"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '0.5s',
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    {isPlaying && <Headphones className="w-4 h-4 text-green-500" />}
                    <p>{isPlaying ? "Écoutez l'extrait !" : "Prêt ?"}</p>
                </div>
            </div>
        </div>
    );
}
