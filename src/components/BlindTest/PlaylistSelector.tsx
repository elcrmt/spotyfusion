'use client';

// Composant de sélection de playlist (C1)

import { PlaylistItem } from '@/lib/spotify/playlistClient';

interface PlaylistSelectorProps {
    playlists: PlaylistItem[];
    onSelect: (playlist: PlaylistItem) => void;
    isLoading: boolean;
}

export function PlaylistSelector({ playlists, onSelect, isLoading }: PlaylistSelectorProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-xl bg-zinc-800 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (playlists.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-400">Aucune playlist trouvée</p>
                <p className="text-zinc-500 text-sm mt-2">
                    Créez des playlists sur Spotify pour jouer au Blind Test
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
                <button
                    key={playlist.id}
                    onClick={() => onSelect(playlist)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800 hover:bg-zinc-700 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {playlist.imageUrl ? (
                        <img
                            src={playlist.imageUrl}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                            <span className="text-4xl">🎵</span>
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm truncate">
                            {playlist.name}
                        </h3>
                        <p className="text-zinc-400 text-xs">
                            {playlist.tracksCount} titres
                        </p>
                    </div>

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
