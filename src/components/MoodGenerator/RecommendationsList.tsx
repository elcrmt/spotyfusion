'use client';

// Composant RecommendationsList - Affiche la liste des titres recommandés (D3)

import Image from 'next/image';
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

// Formate le score d'énergie en pourcentage avec couleur
function EnergyScore({ energy }: { energy?: number }) {
    if (energy === undefined) {
        return <span className="text-zinc-500 text-xs">—</span>;
    }

    const percent = Math.round(energy * 100);

    // Couleur basée sur le niveau d'énergie
    let colorClass = 'text-blue-400';
    if (percent >= 70) {
        colorClass = 'text-red-400';
    } else if (percent >= 40) {
        colorClass = 'text-orange-400';
    }

    return (
        <div className="flex items-center gap-1.5">
            <span className="text-xs">⚡</span>
            <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percent >= 70
                                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                : percent >= 40
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <span className={`text-xs font-mono ${colorClass}`}>{percent}%</span>
            </div>
        </div>
    );
}

export function RecommendationsList({
    tracks,
    isLoading = false,
    error = null,
}: RecommendationsListProps) {
    // État de chargement
    if (isLoading) {
        return (
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                    🎵 Recommandations
                </h2>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-green-500 mb-4" />
                    <p className="text-zinc-400">Génération en cours...</p>
                    <p className="text-zinc-500 text-xs mt-1">
                        Recherche des titres correspondant à vos critères
                    </p>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <div className="rounded-xl bg-zinc-900 border border-red-900/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                    🎵 Recommandations
                </h2>
                <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-red-400 mb-2 font-medium">Erreur de génération</p>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">{error}</p>
                    <p className="text-zinc-500 text-xs mt-4">
                        Essayez de modifier vos semences ou vos paramètres audio.
                    </p>
                </div>
            </div>
        );
    }

    // Pas de données
    if (tracks.length === 0) {
        return (
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                    🎵 Recommandations
                </h2>
                <div className="text-center py-12">
                    <div className="text-5xl mb-4">🎧</div>
                    <p className="text-zinc-400 mb-2">Aucune recommandation générée</p>
                    <p className="text-zinc-500 text-sm">
                        Ajoutez des semences et cliquez sur &quot;Générer&quot; pour obtenir des recommandations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                    🎵 Recommandations
                </h2>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                    {tracks.length} titres
                </span>
            </div>

            {/* En-tête du tableau */}
            <div className="flex items-center gap-4 px-2 py-2 mb-2 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wide">
                <span className="w-8 text-center">#</span>
                <span className="w-12"></span>
                <span className="flex-1">Titre</span>
                <span className="w-28 text-center">Energy Score</span>
                <span className="w-14 text-right">Durée</span>
            </div>

            {/* Liste des tracks */}
            <ul className="space-y-1">
                {tracks.map((track, index) => (
                    <li key={track.id}>
                        <a
                            href={track.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 rounded-lg p-2 -mx-2 transition-colors hover:bg-zinc-800 group"
                        >
                            {/* Rang */}
                            <span className="w-8 text-center text-sm font-medium text-zinc-500 group-hover:text-white">
                                {index + 1}
                            </span>

                            {/* Pochette album */}
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-700">
                                {track.albumImageUrl ? (
                                    <Image
                                        src={track.albumImageUrl}
                                        alt={track.albumName}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xl">
                                        💿
                                    </div>
                                )}
                            </div>

                            {/* Infos */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate group-hover:text-green-400 transition-colors">
                                    {track.name}
                                </p>
                                <p className="text-xs text-zinc-400 truncate">
                                    {track.artists.map((a) => a.name).join(', ')}
                                </p>
                            </div>

                            {/* Energy Score */}
                            <div className="w-28 flex justify-center">
                                <EnergyScore energy={track.energy} />
                            </div>

                            {/* Durée */}
                            <span className="w-14 text-right text-xs text-zinc-500">
                                {formatDuration(track.duration_ms)}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                    Cliquez sur un titre pour l&apos;ouvrir dans Spotify
                </p>
            </div>
        </div>
    );
}

export default RecommendationsList;
