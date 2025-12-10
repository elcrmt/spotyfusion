'use client';

// Lecteur audio avec timer 30 secondes (C2)

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
    previewUrl: string;
    onTimeUp?: () => void;
    isPlaying: boolean;
}

const AUDIO_DURATION = 30; // secondes

export function AudioPlayer({ previewUrl, onTimeUp, isPlaying }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Gère la lecture/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying && isLoaded) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [isPlaying, isLoaded]);

    // Reset quand l'URL change
    useEffect(() => {
        setCurrentTime(0);
        setIsLoaded(false);
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
        }
    }, [previewUrl]);

    // Met à jour le timer
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);

            // Limite à 30 secondes
            if (audio.currentTime >= AUDIO_DURATION) {
                audio.pause();
                onTimeUp?.();
            }
        };

        const handleLoadedData = () => {
            setIsLoaded(true);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadeddata', handleLoadedData);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadeddata', handleLoadedData);
        };
    }, [onTimeUp]);

    const progress = Math.min((currentTime / AUDIO_DURATION) * 100, 100);
    const remainingTime = Math.max(AUDIO_DURATION - Math.floor(currentTime), 0);

    return (
        <div className="w-full">
            {/* Audio caché */}
            <audio ref={audioRef} src={previewUrl} preload="auto" />

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

                <p className="text-zinc-400 text-sm">
                    {isLoaded ? "🎧 Écoutez l'extrait et devinez le titre !" : "Chargement..."}
                </p>
            </div>
        </div>
    );
}
