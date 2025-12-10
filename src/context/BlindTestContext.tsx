'use client';

// Context pour gérer l'état du jeu Blind Test (C1)

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { SpotifyUserPlaylist } from '@/lib/spotify/spotifyClient';

// État du jeu
type GameStatus = 'SETUP' | 'READY' | 'PLAYING' | 'FINISHED';

interface BlindTestContextType {
  // C1 - Setup
  selectedPlaylist: SpotifyUserPlaylist | null;
  setSelectedPlaylist: (playlist: SpotifyUserPlaylist | null) => void;
  gameStatus: GameStatus;
  startGame: () => void;
  resetGame: () => void;

  // TODO: C2 - Questions
  // questions: Question[];
  // currentQuestionIndex: number;

  // TODO: C3 - Audio playback
  // isPlaying: boolean;
  // currentTrackUrl: string | null;

  // TODO: C4 - Answers
  // submitAnswer: (answer: string) => void;

  // TODO: C5 - Score
  // score: number;
  // correctAnswers: number;
}

const BlindTestContext = createContext<BlindTestContextType | undefined>(
  undefined
);

interface BlindTestProviderProps {
  children: ReactNode;
}

export function BlindTestProvider({ children }: BlindTestProviderProps) {
  // C1 - État de sélection de playlist
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<SpotifyUserPlaylist | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('SETUP');

  // C1 - Démarrer le jeu (passe en mode READY)
  const startGame = useCallback(() => {
    if (!selectedPlaylist) {
      console.error('[C1] Aucune playlist sélectionnée');
      return;
    }

    setGameStatus('READY');
    // TODO: C2 - Charger les questions depuis la playlist
    console.log('[C1] Jeu prêt avec playlist:', selectedPlaylist.name);
  }, [selectedPlaylist]);

  // C1 - Réinitialiser le jeu
  const resetGame = useCallback(() => {
    setSelectedPlaylist(null);
    setGameStatus('SETUP');
    // TODO: C2-C5 - Réinitialiser questions, score, etc.
  }, []);

  const value: BlindTestContextType = {
    selectedPlaylist,
    setSelectedPlaylist,
    gameStatus,
    startGame,
    resetGame,
  };

  return (
    <BlindTestContext.Provider value={value}>
      {children}
    </BlindTestContext.Provider>
  );
}

// Hook pour utiliser le contexte Blind Test
export function useBlindTest(): BlindTestContextType {
  const context = useContext(BlindTestContext);
  if (context === undefined) {
    throw new Error(
      'useBlindTest doit être utilisé dans un BlindTestProvider'
    );
  }
  return context;
}

export default BlindTestContext;
