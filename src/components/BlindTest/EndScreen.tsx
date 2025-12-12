'use client';

import { RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface Track {
    name: string;
    artist: string;
    imageUrl?: string | null;
}

interface EndScreenProps {
    score: number;
    totalQuestions: number;
    playlistName: string;
    tracks: Track[];
    onRestart: () => void;
}

export function EndScreen({ score, totalQuestions, playlistName, tracks, onRestart }: EndScreenProps) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-green-500 rounded-xl p-6 mb-8 flex items-center justify-between">
                <div className="bg-white text-black px-6 py-3 rounded-lg font-bold text-2xl">
                    {score}pts
                </div>
                <h1 className="text-2xl font-bold text-black">
                    {playlistName}
                </h1>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Morceaux joués</h2>
                <div className="space-y-2">
                    {tracks.map((track, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-[#181818] p-3 rounded-lg hover:bg-[#282828] transition-colors"
                        >
                            {track.imageUrl ? (
                                <Image
                                    src={track.imageUrl}
                                    alt={track.name}
                                    width={48}
                                    height={48}
                                    className="rounded"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center text-xl">
                                    🎵
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{track.name}</p>
                                <p className="text-[#b3b3b3] text-sm truncate">{track.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onRestart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                    Rejouer
                </button>
            </div>
        </div>
    );
}
