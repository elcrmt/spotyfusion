'use client';

// Page Mood Generator - Générateur de playlist selon l'humeur (D1, D2)

import { useState } from 'react';
import {
  AudioFeaturesForm,
  SeedSelector,
  type AudioFeatures,
} from '@/components/MoodGenerator';
import type { Seed } from '@/lib/spotify/spotifyClient';

export default function MoodGeneratorPage() {
  const [currentFeatures, setCurrentFeatures] = useState<AudioFeatures>({
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
  });
  const [seeds, setSeeds] = useState<Seed[]>([]);

  // Gère le changement des sliders
  const handleFeaturesChange = (features: AudioFeatures) => {
    setCurrentFeatures(features);
  };

  // Gère le changement des semences
  const handleSeedsChange = (newSeeds: Seed[]) => {
    setSeeds(newSeeds);
  };

  // Gère la soumission du formulaire (sera implémenté dans D3)
  const handleSubmit = (features: AudioFeatures) => {
    console.log('[D2] Génération avec:', { features, seeds });
    // TODO: Implémenter l'appel API pour générer la playlist (D3)
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🎨 Mood Playlist</h1>
      <p className="text-zinc-400 mb-8">Générez une playlist selon votre humeur</p>

      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2 text-center">
              Ajustez l&apos;ambiance
            </h2>
            <p className="text-zinc-400 text-sm text-center mb-8">
              Personnalisez votre playlist avec les caractéristiques audio et des semences
            </p>
          </div>

          {/* Sélecteur de semences (D2) */}
          <div className="pb-8 border-b border-zinc-800">
            <SeedSelector seeds={seeds} onSeedsChange={handleSeedsChange} maxSeeds={5} />
          </div>

          {/* Formulaire Audio Features (D1) */}
          <AudioFeaturesForm
            initialValues={currentFeatures}
            onChange={handleFeaturesChange}
            onSubmit={handleSubmit}
          />
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
    </div>
  );
}
