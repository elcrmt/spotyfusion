'use client';

// Composant PlaylistSelector - Grille de playlists - Maquette Figma

import { useState } from 'react';
import Image from 'next/image';
import { Play, Check } from 'lucide-react';
import type { PlaylistItem } from '@/lib/spotify/playlistClient';

interface PlaylistSelectorProps {
    playlists: PlaylistItem[];
    onSelect: (playlist: PlaylistItem) => void;
    isLoading?: boolean;
}

export function PlaylistSelector({
    playlists,
    onSelect,
    isLoading = false,
}: PlaylistSelectorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (playlist: PlaylistItem) => {
        setSelectedId(playlist.id);
    };

    const handleStart = () => {
        const selected = playlists.find(p => p.id === selectedId);
        if (selected) {
            onSelect(selected);
        }
    };

    // État de chargement
    if (isLoading) {
        return (
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Mes playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-[#282828] rounded-lg mb-2" />
                            <div className="h-4 bg-[#282828] rounded w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Pas de playlists
    if (playlists.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-[#b3b3b3]">Aucune playlist trouvée</p>
                <p className="text-[#6a6a6a] text-sm mt-1">
                    Créez des playlists sur Spotify pour jouer au Blind Test
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-bold text-white mb-4">Mes playlists</h2>

            {/* Grille de playlists */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mb-6">
                {playlists.map((playlist) => {
                    const isSelected = selectedId === playlist.id;

                    return (
                        <button
                            key={playlist.id}
                            onClick={() => handleSelect(playlist)}
                            className="text-left group"
                        >
                            {/* Image */}
                            <div className={`relative aspect-square rounded-lg overflow-hidden bg-[#282828] mb-2 ${isSelected ? 'ring-2 ring-green-500' : ''
                                }`}>
                                {playlist.imageUrl ? (
                                    <Image
                                        src={playlist.imageUrl}
                                        alt={playlist.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl">
                                        🎵
                                    </div>
                                )}

                                {/* Checkmark si sélectionné */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-black" />
                                    </div>
                                )}

                                {/* Overlay au hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Nom */}
                            <p className="text-white text-sm font-medium truncate group-hover:text-green-400 transition-colors">
                                {playlist.name}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Bouton Commencer */}
            <button
                onClick={handleStart}
                disabled={!selectedId}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Play className="w-5 h-5" />
                Commencer le Blind Test
            </button>
        </div>
    );
}

export default PlaylistSelector;
