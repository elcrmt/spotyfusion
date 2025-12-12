'use client';

// Composant RecommendationsList - Maquette Figma

import Image from 'next/image';
import { Save, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import type { RecommendedTrack } from '@/lib/spotify/spotifyClient';

interface RecommendationsListProps {
    tracks: RecommendedTrack[];
    isLoading?: boolean;
    error?: string | null;
}

// Formate la durée en mm:ss
function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function RecommendationsList({
    tracks,
    isLoading = false,
    error = null,
}: RecommendationsListProps) {
    // État de chargement
    if (isLoading) {
        return (
            <div className="bg-[#181818] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Recommandations</h2>
                <div className="flex items-center justify-center py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#333] border-t-green-500" />
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="bg-[#181818] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Recommandations</h2>
                <div className="text-center py-8">
                    <p className="text-red-400 mb-2">{error}</p>
                    <p className="text-[#6a6a6a] text-sm">Essayez de modifier vos paramètres.</p>
                </div>
            </div>
        );
    }

    // Pas de données
    if (tracks.length === 0) {
        return (
            <div className="bg-[#181818] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Recommandations</h2>
                <div className="text-center py-12">
                    <p className="text-[#b3b3b3]">Aucune recommandation générée</p>
                    <p className="text-[#6a6a6a] text-sm mt-1">
                        Ajoutez des semences et cliquez sur Générer
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#181818] rounded-xl p-6">
            {/* Header avec titre et bouton sauvegarder */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                    Recommandations ({tracks.length})
                </h2>
                <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-[#333] text-white rounded-full text-sm hover:border-white transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Sauvegarder la Playlist
                </button>
            </div>

            {/* Liste des tracks */}
            <div className="space-y-1">
                {tracks.map((track, index) => (
                    <a
                        key={track.id}
                        href={track.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-[#282828] transition-colors group"
                    >
                        {/* Numéro */}
                        <span className="w-6 text-center text-sm text-[#b3b3b3] group-hover:text-white">
                            {index + 1}
                        </span>

                        {/* Pochette */}
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-[#282828] flex-shrink-0">
                            {track.albumImageUrl ? (
                                <Image
                                    src={track.albumImageUrl}
                                    alt={track.albumName}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-lg">
                                    💿
                                </div>
                            )}
                        </div>

                        {/* Titre */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate group-hover:text-green-400 transition-colors">
                                {track.name}
                            </p>
                        </div>

                        {/* Contrôles de lecture (placeholder) */}
                        <div className="flex items-center gap-1">
                            <button className="p-1 text-[#b3b3b3] hover:text-white">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-[#b3b3b3] px-2">
                                {index + 1}–{tracks.length}
                            </span>
                            <button className="p-1 text-[#b3b3b3] hover:text-white">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Artiste */}
                        <div className="w-32 hidden sm:block">
                            <p className="text-[#b3b3b3] text-sm truncate">
                                {track.artists.map(a => a.name).join(', ')}
                            </p>
                        </div>

                        {/* Durée */}
                        <span className="w-12 text-right text-sm text-[#b3b3b3]">
                            {formatDuration(track.duration_ms)}
                        </span>

                        {/* Energy Score */}
                        {track.energy !== undefined && (
                            <div className="w-12 flex items-center justify-end gap-1">
                                <Zap className={`w-3 h-3 ${track.energy >= 0.7 ? 'text-red-400' :
                                        track.energy >= 0.4 ? 'text-orange-400' : 'text-blue-400'
                                    }`} />
                                <span className={`text-xs ${track.energy >= 0.7 ? 'text-red-400' :
                                        track.energy >= 0.4 ? 'text-orange-400' : 'text-blue-400'
                                    }`}>
                                    {Math.round(track.energy * 100)}
                                </span>
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default RecommendationsList;
