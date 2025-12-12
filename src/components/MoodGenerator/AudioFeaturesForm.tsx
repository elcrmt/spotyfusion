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
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  {
    key: 'energy' as const,
    label: 'Energy',
    Icon: Zap,
    description: 'Intensité et activité perçues',
    minLabel: 'Doux',
    maxLabel: 'Intense',
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
  {
    key: 'valence' as const,
    label: 'Valence (Humeur)',
    Icon: Smile,
    description: 'Positivité musicale transmise',
    minLabel: 'Triste',
    maxLabel: 'Joyeux',
    color: 'bg-gradient-to-r from-blue-500 to-green-500',
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {sliderConfig.map((config) => {
        const Icon = config.Icon;
        return (
          <div key={config.key} className="space-y-3">
            {/* Label et valeur */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-green-500" />
                <label className="text-base font-medium text-white">
                  {config.label}
                </label>
              </div>
              <span className="text-sm font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                {features[config.key].toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-500">{config.description}</p>

            {/* Slider container */}
            <div className="relative pt-1">
              {/* Track background */}
              <div className="h-2 bg-zinc-700 rounded-lg overflow-hidden">
                {/* Barre de progression colorée */}
                <div
                  className={`h-full ${config.color} transition-all duration-200`}
                  style={{ width: `${toPercent(features[config.key])}%` }}
                />
              </div>
              {/* Slider (invisible mais fonctionnel) */}
              <input
                type="range"
                min={0}
                max={100}
                value={toPercent(features[config.key])}
                onChange={(e) =>
                  handleChange(config.key, fromSlider(Number(e.target.value)))
                }
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                disabled={isLoading}
              />
            </div>

            {/* Labels min/max */}
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{config.minLabel}</span>
              <span>{config.maxLabel}</span>
            </div>
          </div>
        );
      })}

      {/* Bouton de soumission */}
      {onSubmit && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3 px-6 rounded-full bg-green-500 text-black font-semibold text-lg transition-all hover:bg-green-400 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Génération en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Music className="w-5 h-5" />
              Générer ma playlist
            </span>
          )}
        </button>
      )}
    </form>
  );
}

export default AudioFeaturesForm;
