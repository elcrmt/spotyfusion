'use client';

// Page Mood Generator - Générateur de playlist selon l'humeur (D1, D2, D3)

import { useState, useCallback } from 'react';
import {
  AudioFeaturesForm,
  SeedSelector,
  RecommendationsList,
  type AudioFeatures,
} from '@/components/MoodGenerator';
import {
  fetchRecommendations,
  type Seed,
  type RecommendedTrack,
} from '@/lib/spotify/spotifyClient';

export default function MoodGeneratorPage() {
  // États D1/D2
  const [currentFeatures, setCurrentFeatures] = useState<AudioFeatures>({
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
  });
  const [seeds, setSeeds] = useState<Seed[]>([]);

  // États D3
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gère le changement des sliders
  const handleFeaturesChange = (features: AudioFeatures) => {
    setCurrentFeatures(features);
  };

  // Gère le changement des semences
  const handleSeedsChange = (newSeeds: Seed[]) => {
    setSeeds(newSeeds);
  };

  // Gère la soumission du formulaire - Génère les recommandations (D3)
  const handleSubmit = useCallback(
    async (features: AudioFeatures) => {
      // Validation : au moins une seed requise
      if (seeds.length === 0) {
        setError('Veuillez sélectionner au moins une semence (artiste, titre ou genre).');
        return;
      }

      setIsLoading(true);
      setError(null);
      setRecommendations([]);

      try {
        // Sépare les seeds par type
        const seedArtists = seeds
          .filter((s) => s.type === 'artist')
          .map((s) => s.id);
        const seedTracks = seeds
          .filter((s) => s.type === 'track')
          .map((s) => s.id);
        const seedGenres = seeds
          .filter((s) => s.type === 'genre')
          .map((s) => s.id);

        console.log('[D3] Génération avec:', {
          seedArtists,
          seedTracks,
          seedGenres,
          features,
        });

        // Appel API (D3)
        const result = await fetchRecommendations({
          seedArtists: seedArtists.length > 0 ? seedArtists : undefined,
          seedTracks: seedTracks.length > 0 ? seedTracks : undefined,
          seedGenres: seedGenres.length > 0 ? seedGenres : undefined,
          targetDanceability: features.danceability,
          targetEnergy: features.energy,
          targetValence: features.valence,
          limit: 30,
        });

        console.log('[D3] Recommandations reçues:', result.tracks.length, 'titres');
        setRecommendations(result.tracks);
      } catch (err) {
        console.error('[D3] Erreur génération:', err);

        // Gestion des erreurs
        if (err instanceof Error) {
          const errorCode = (err as Error & { code?: string }).code;

          if (errorCode === 'INVALID_PARAMS') {
            setError(err.message);
          } else if (errorCode === 'API_RESTRICTED') {
            setError(err.message);
          } else if (err.message === 'UNAUTHENTICATED') {
            setError('Session expirée. Veuillez vous reconnecter.');
            // Redirection vers login après un délai
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            setError(err.message || 'Impossible de générer les recommandations. Veuillez réessayer.');
          }
        } else {
          setError('Une erreur inattendue est survenue.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [seeds]
  );

  // Vérifie si le bouton peut être activé
  const canGenerate = seeds.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🎨 Mood Playlist</h1>
      <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8">Générez une playlist selon votre humeur</p>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Panneau de configuration (gauche) */}
        <div>
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center">
                Ajustez l&apos;ambiance
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">
                Personnalisez votre playlist avec les caractéristiques audio et des semences
              </p>
            </div>

            {/* Sélecteur de semences (D2) */}
            <div className="pb-6 sm:pb-8 border-b border-zinc-800">
              <SeedSelector seeds={seeds} onSeedsChange={handleSeedsChange} maxSeeds={5} />
            </div>

            {/* Formulaire Audio Features (D1) */}
            <AudioFeaturesForm
              initialValues={currentFeatures}
              onChange={handleFeaturesChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Message si pas de seeds */}
            {!canGenerate && (
              <p className="text-center text-zinc-500 text-sm">
                ☝️ Ajoutez au moins une semence pour générer des recommandations
              </p>
            )}
          </div>

          {/* Récapitulatif */}
          {(seeds.length > 0 || currentFeatures) && (
            <div className="mt-6 rounded-xl bg-zinc-900/50 border border-zinc-800 p-6">
              <h3 className="text-sm font-medium text-white mb-3">📋 Récapitulatif</h3>
              <div className="space-y-2 text-xs text-zinc-400">
                <p>
                  <span className="text-zinc-500">Caractéristiques :</span> Danceability{' '}
                  {currentFeatures.danceability.toFixed(2)} • Energy{' '}
                  {currentFeatures.energy.toFixed(2)} • Valence{' '}
                  {currentFeatures.valence.toFixed(2)}
                </p>
                {seeds.length > 0 && (
                  <p>
                    <span className="text-zinc-500">Semences :</span> {seeds.length} sélectionnée
                    {seeds.length > 1 ? 's' : ''} (
                    {seeds.map((s) => s.name).join(', ')})
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panneau des résultats (droite) - D3 */}
        <div>
          <RecommendationsList
            tracks={recommendations}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
