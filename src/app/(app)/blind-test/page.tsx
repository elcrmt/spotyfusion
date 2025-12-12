'use client';

// Page Blind Test - Maquette Figma - Quiz musical

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
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Blind Test Musical
        </h1>
        <p className="text-[#b3b3b3] text-sm">
          {phase === 'select' && 'Testez vos connaissances musicales en devinant les morceaux'}
          {phase === 'playing' && selectedPlaylist?.name}
          {phase === 'answered' && selectedPlaylist?.name}
          {phase === 'finished' && 'Partie terminée !'}
          {phase === 'loading' && 'Chargement...'}
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Phase: Loading */}
      {phase === 'loading' && (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#333] border-t-green-500" />
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
          onQuit={restart}
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
