'use client';

// Page Mood Generator - Générateur de playlist selon l'humeur (D1)

import { useState } from 'react';
import { AudioFeaturesForm, type AudioFeatures } from '@/components/MoodGenerator';

export default function MoodGeneratorPage() {
  const [currentFeatures, setCurrentFeatures] = useState<AudioFeatures>({
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
  });

  // Gère le changement des sliders
  const handleFeaturesChange = (features: AudioFeatures) => {
    setCurrentFeatures(features);
  };

  // Gère la soumission du formulaire (sera implémenté dans D2)
  const handleSubmit = (features: AudioFeatures) => {
    console.log('[D1] Audio features submitted:', features);
    // TODO: Implémenter l'appel API pour générer la playlist (D2)
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🎨 Mood Playlist</h1>
      <p className="text-zinc-400 mb-8">Générez une playlist selon votre humeur</p>

      <div className="max-w-2xl">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Ajustez l&apos;ambiance
          </h2>
          <p className="text-zinc-400 text-sm text-center mb-8">
            Déplacez les curseurs pour définir les caractéristiques de votre playlist
          </p>

          {/* Formulaire Audio Features (D1) */}
          <AudioFeaturesForm
            initialValues={currentFeatures}
            onChange={handleFeaturesChange}
            onSubmit={handleSubmit}
          />

          {/* Aperçu des valeurs actuelles */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              Valeurs actuelles : Danceability {currentFeatures.danceability.toFixed(2)} • 
              Energy {currentFeatures.energy.toFixed(2)} • 
              Valence {currentFeatures.valence.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
