'use client';

// Page Blind Test - Quiz musical basé sur vos playlists (C1-C5)

import { useEffect } from 'react';
import { useBlindTest } from '@/hooks/useBlindTest';
import { PlaylistSelector, GameScreen, EndScreen } from '@/components/BlindTest';

export default function BlindTestPage() {
  const {
    phase,
    playlists,
    selectedPlaylist,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    lastAnswerCorrect,
    error,
    loadPlaylists,
    selectPlaylist,
    submitAnswer,
    nextQuestion,
    restart,
  } = useBlindTest();

  // Charge les playlists au montage
  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🎵 Blind Test</h1>
      <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8">
        {phase === 'select' && 'Sélectionnez une playlist pour commencer'}
        {phase === 'playing' && selectedPlaylist?.name}
        {phase === 'answered' && selectedPlaylist?.name}
        {phase === 'finished' && 'Partie terminée !'}
        {phase === 'loading' && 'Chargement...'}
      </p>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Phase: Loading */}
      {phase === 'loading' && (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-green-500" />
        </div>
      )}

      {/* Phase: Sélection de playlist */}
      {phase === 'select' && (
        <PlaylistSelector
          playlists={playlists}
          onSelect={selectPlaylist}
          isLoading={false}
        />
      )}

      {/* Phase: Jeu en cours */}
      {(phase === 'playing' || phase === 'answered') && currentQuestion && (
        <GameScreen
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          score={score}

          onAnswer={submitAnswer}
          onNext={nextQuestion}
          isAnswered={phase === 'answered'}
          lastAnswerCorrect={lastAnswerCorrect}
        />
      )}

      {/* Phase: Fin du jeu */}
      {phase === 'finished' && (
        <EndScreen
          score={score}
          totalQuestions={totalQuestions}
          onRestart={restart}
        />
      )}
    </div>
  );
}
