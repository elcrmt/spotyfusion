'use client';

// Page Blind Test - Sélection de playlist et jeu (C1)

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  fetchUserPlaylists,
  SpotifyUserPlaylist,
} from '@/lib/spotify/spotifyClient';
import { useBlindTest } from '@/context/BlindTestContext';

export default function BlindTestPage() {
  const [playlists, setPlaylists] = useState<SpotifyUserPlaylist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);

  const { selectedPlaylist, setSelectedPlaylist, gameStatus, startGame } =
    useBlindTest();

  // C1 - Charge les playlists au montage
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setIsLoadingPlaylists(true);
        const data = await fetchUserPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error('[C1] Erreur chargement playlists:', error);
        setErrorPlaylists(
          error instanceof Error && error.message === 'UNAUTHENTICATED'
            ? 'Session expirée, veuillez vous reconnecter'
            : 'Erreur lors du chargement des playlists'
        );
      } finally {
        setIsLoadingPlaylists(false);
      }
    };

    loadPlaylists();
  }, []);

  // C1 - Gère le clic sur une playlist
  const handleSelectPlaylist = (playlist: SpotifyUserPlaylist) => {
    setSelectedPlaylist(playlist);
  };

  // C1 - Démarre le jeu avec la playlist sélectionnée
  const handleStartGame = () => {
    if (!selectedPlaylist) return;
    startGame();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🎵 Blind Test</h1>
      <p className="text-zinc-400 mb-8">
        {gameStatus === 'SETUP'
          ? 'Choisis ta playlist pour commencer'
          : 'Devine les titres à partir d\'extraits audio'}
      </p>

      {/* C1 - Phase de sélection de playlist */}
      {gameStatus === 'SETUP' && (
        <div>
          {/* Loading state */}
          {isLoadingPlaylists && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 animate-pulse"
                >
                  <div className="aspect-square bg-zinc-800 rounded-lg mb-3" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {errorPlaylists && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 text-center">
              <p className="text-red-400">{errorPlaylists}</p>
            </div>
          )}

          {/* Liste des playlists (C1) */}
          {!isLoadingPlaylists && !errorPlaylists && playlists.length > 0 && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {playlists.map((playlist) => {
                  const isSelected = selectedPlaylist?.id === playlist.id;
                  return (
                    <button
                      key={playlist.id}
                      onClick={() => handleSelectPlaylist(playlist)}
                      className={`rounded-xl border p-4 text-left transition-all hover:scale-105 ${
                        isSelected
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Image de la playlist */}
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 mb-3">
                        {playlist.images && playlist.images[0] ? (
                          <Image
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl">
                            🎵
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                            <span className="text-4xl">✓</span>
                          </div>
                        )}
                      </div>

                      {/* Infos de la playlist */}
                      <h3 className="font-semibold text-white mb-1 truncate">
                        {playlist.name}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {playlist.tracksCount} titre
                        {playlist.tracksCount > 1 ? 's' : ''} • {playlist.ownerName}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Padding en bas pour éviter que le contenu soit caché par le bouton fixe */}
              <div className="h-32" />
            </>
          )}

          {/* Bouton Démarrer fixe en bas (C1) */}
          {!isLoadingPlaylists && !errorPlaylists && playlists.length > 0 && (
            <div className="fixed bottom-0 left-64 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent p-6 pointer-events-none">
              <div className="pointer-events-auto flex justify-center">
                <button
                  onClick={handleStartGame}
                  disabled={!selectedPlaylist}
                  className={`rounded-full px-8 py-4 font-semibold text-white transition-all shadow-2xl ${
                    selectedPlaylist
                      ? 'bg-green-500 hover:bg-green-400 hover:scale-105'
                      : 'bg-zinc-800 cursor-not-allowed opacity-50'
                  }`}
                >
                  {selectedPlaylist
                    ? `Démarrer avec "${selectedPlaylist.name}"`
                    : 'Sélectionne une playlist'}
                </button>
              </div>
            </div>
          )}

          {/* Aucune playlist */}
          {!isLoadingPlaylists && !errorPlaylists && playlists.length === 0 && (
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Aucune playlist trouvée
              </h2>
              <p className="text-zinc-400">
                Crée des playlists sur Spotify pour jouer au Blind Test !
              </p>
            </div>
          )}
        </div>
      )}

      {/* C1 - Phase READY (en attente de C2-C5) */}
      {gameStatus === 'READY' && (
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Jeu prêt !
            </h2>
            <p className="text-zinc-400 mb-6">
              Playlist sélectionnée : <strong>{selectedPlaylist?.name}</strong>
            </p>
            <p className="text-zinc-500 text-sm">
              TODO: C2 - Charger les questions
              <br />
              TODO: C3 - Lecteur audio
              <br />
              TODO: C4 - Système de réponses
              <br />
              TODO: C5 - Score et résultats
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
