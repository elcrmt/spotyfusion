'use client';

// Composant AudioFeaturesForm - Formulaire pour ajuster les caractéristiques audio (D1)

import { useState, useCallback } from 'react';
import { PartyPopper, Zap, Smile, Sparkles, Music } from 'lucide-react';

// ================================
// Types D1
// ================================

export interface AudioFeatures {
  danceability: number; // 0.0 à 1.0
  energy: number; // 0.0 à 1.0
  valence: number; // 0.0 à 1.0 (positivité/humeur)
}

interface AudioFeaturesFormProps {
  initialValues?: AudioFeatures;
  onChange?: (features: AudioFeatures) => void;
  onSubmit?: (features: AudioFeatures) => void;
  isLoading?: boolean;
}

// ================================
// Configuration des sliders
// ================================

const sliderConfig = [
  {
    key: 'danceability' as const,
    label: 'Danceability',
    Icon: PartyPopper,
    description: 'À quel point le morceau est adapté à la danse',
    minLabel: 'Calme',
    maxLabel: 'Dansant',
  },
  {
    key: 'energy' as const,
    label: 'Energy',
    Icon: Zap,
    description: 'Intensité et activité perçues',
    minLabel: 'Doux',
    maxLabel: 'Intense',
  },
  {
    key: 'valence' as const,
    label: 'Valence (Humeur)',
    Icon: Smile,
    description: 'Positivité musicale transmise',
    minLabel: 'Triste',
    maxLabel: 'Joyeux',
  },
];

// ================================
// Composant
// ================================

export function AudioFeaturesForm({
  initialValues = { danceability: 0.5, energy: 0.5, valence: 0.5 },
  onChange,
  onSubmit,
  isLoading = false,
}: AudioFeaturesFormProps) {
  const [features, setFeatures] = useState<AudioFeatures>(initialValues);

  // Met à jour une caractéristique
  const handleChange = useCallback(
    (key: keyof AudioFeatures, value: number) => {
      const newFeatures = { ...features, [key]: value };
      setFeatures(newFeatures);
      onChange?.(newFeatures);
    },
    [features, onChange]
  );

  // Soumet le formulaire
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(features);
    },
    [features, onSubmit]
  );

  // Convertit la valeur 0-1 en pourcentage pour l'affichage
  const toPercent = (value: number) => Math.round(value * 100);

  // Convertit la valeur du slider (0-100) en 0.0-1.0
  const fromSlider = (value: number) => value / 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sliderConfig.map((config) => {
        const Icon = config.Icon;
        return (
          <div key={config.key} className="mb-6">
            {/* Label et valeur */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{config.label}</span>
              <span className="text-[#b3b3b3] text-sm bg-[#282828] px-2 py-0.5 rounded">
                {features[config.key].toFixed(2)}
              </span>
            </div>

            {/* Slider avec style vert */}
            <input
              type="range"
              min={0}
              max={100}
              value={toPercent(features[config.key])}
              onChange={(e) =>
                handleChange(config.key, fromSlider(Number(e.target.value)))
              }
              className="w-full h-2 bg-[#404040] rounded-full appearance-none cursor-pointer slider-green"
              disabled={isLoading}
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${toPercent(features[config.key])}%, #404040 ${toPercent(features[config.key])}%, #404040 100%)`
              }}
            />

            {/* Description */}
            <p className="text-[#6a6a6a] text-xs mt-1">{config.description}</p>
          </div>
        );
      })}

      {/* Bouton de soumission - Vert selon maquette */}
      {onSubmit && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3 px-6 rounded-full bg-green-500 text-black font-semibold text-base transition-all hover:bg-green-400 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Génération en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Générer les recommandations
            </span>
          )}
        </button>
      )}
    </form>
  );
}

export default AudioFeaturesForm;
