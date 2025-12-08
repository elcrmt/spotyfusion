'use client';

/**
 * SpotyFusion - Blind Test Page
 *
 * A music quiz game where users guess songs from their playlists.
 *
 * Features:
 * - Playlist selection
 * - Audio playback (30s previews)
 * - Multiple choice answers
 * - Score tracking
 *
 * TODO: Implement real game logic and API calls
 */

import { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';

// ================================
// Types
// ================================

type GameState = 'idle' | 'selecting' | 'playing' | 'answered' | 'finished';

interface GameStats {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  correctAnswers: number;
}

// ================================
// Mock Data (for development)
// ================================

const MOCK_PLAYLISTS = [
  { id: '1', name: 'Liked Songs', trackCount: 234 },
  { id: '2', name: 'Discover Weekly', trackCount: 30 },
  { id: '3', name: 'Release Radar', trackCount: 30 },
  { id: '4', name: 'Summer Vibes 2024', trackCount: 45 },
  { id: '5', name: 'Workout Mix', trackCount: 78 },
];

const MOCK_QUESTION = {
  previewUrl: null, // Would be a 30s preview URL
  options: [
    'Blinding Lights - The Weeknd',
    'Starboy - The Weeknd',
    'Save Your Tears - The Weeknd',
    'After Hours - The Weeknd',
  ],
  correctIndex: 0,
};

// ================================
// Playlist Selection Component
// ================================

interface PlaylistSelectionProps {
  onSelect: (playlistId: string) => void;
}

function PlaylistSelection({ onSelect }: PlaylistSelectionProps) {
  // TODO: Replace with real API call
  // const { data: playlists, isLoading } = useUserPlaylists();

  return (
    <Card
      title="🎯 Choisir une playlist"
      subtitle="Sélectionnez une playlist pour commencer le quiz"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {MOCK_PLAYLISTS.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelect(playlist.id)}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 p-4 text-left transition-all hover:border-zinc-600 hover:bg-zinc-800"
          >
            {/* Playlist Cover Placeholder */}
            <div className="h-12 w-12 rounded bg-zinc-700" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{playlist.name}</p>
              <p className="text-sm text-gray-400">
                {playlist.trackCount} titres
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* TODO Comment */}
      <p className="mt-4 text-center text-xs text-gray-600">
        💡 TODO: Appeler getUserPlaylists() pour charger les vraies playlists
      </p>
    </Card>
  );
}

// ================================
// Question Component
// ================================

interface QuestionProps {
  questionNumber: number;
  totalQuestions: number;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number | null;
  onAnswer: (index: number) => void;
  gameState: GameState;
}

function Question({
  questionNumber,
  totalQuestions,
  options,
  selectedIndex,
  correctIndex,
  onAnswer,
  gameState,
}: QuestionProps) {
  const isAnswered = gameState === 'answered';

  return (
    <Card>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>
            Question {questionNumber}/{totalQuestions}
          </span>
          <span>🎵 Écoutez et devinez !</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-[#1DB954] transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Audio Player Placeholder */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-zinc-800">
          <span className="text-5xl">🎧</span>
        </div>
        <Button variant="spotify" size="lg">
          ▶️ Jouer l&apos;extrait
        </Button>
        <p className="mt-2 text-xs text-gray-500">
          💡 TODO: Utiliser preview_url du track pour l&apos;audio
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          let buttonStyle = 'border-zinc-700 hover:border-zinc-500';

          if (isAnswered) {
            if (index === correctIndex) {
              buttonStyle = 'border-green-500 bg-green-500/20';
            } else if (index === selectedIndex) {
              buttonStyle = 'border-red-500 bg-red-500/20';
            }
          } else if (index === selectedIndex) {
            buttonStyle = 'border-[#1DB954] bg-[#1DB954]/20';
          }

          return (
            <button
              key={index}
              onClick={() => !isAnswered && onAnswer(index)}
              disabled={isAnswered}
              className={`w-full rounded-lg border p-4 text-left transition-all ${buttonStyle} ${
                isAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-white">{option}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ================================
// Score Display Component
// ================================

interface ScoreDisplayProps {
  stats: GameStats;
  onRestart: () => void;
}

function ScoreDisplay({ stats, onRestart }: ScoreDisplayProps) {
  const percentage = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);

  let message = '';
  let emoji = '';

  if (percentage >= 80) {
    message = 'Excellent ! Vous êtes un vrai mélomane ! 🎉';
    emoji = '🏆';
  } else if (percentage >= 60) {
    message = 'Bien joué ! Vous connaissez bien votre musique !';
    emoji = '👏';
  } else if (percentage >= 40) {
    message = 'Pas mal ! Continuez à écouter !';
    emoji = '🎵';
  } else {
    message = 'Il est temps de redécouvrir votre playlist !';
    emoji = '🎧';
  }

  return (
    <Card>
      <div className="py-8 text-center">
        {/* Trophy */}
        <span className="mb-4 block text-6xl">{emoji}</span>

        {/* Score */}
        <h2 className="mb-2 text-4xl font-bold text-white">
          {stats.correctAnswers}/{stats.totalQuestions}
        </h2>
        <p className="mb-4 text-lg text-gray-400">
          {percentage}% de bonnes réponses
        </p>

        {/* Message */}
        <p className="mb-8 text-gray-300">{message}</p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="spotify" onClick={onRestart}>
            Rejouer
          </Button>
          <Button variant="outline" onClick={() => console.log('TODO: Share')}>
            Partager
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ================================
// Blind Test Page Component
// ================================

export default function BlindTestPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats>({
    currentQuestion: 1,
    totalQuestions: 10,
    score: 0,
    correctAnswers: 0,
  });

  // Handle playlist selection
  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    setGameState('playing');
    console.log('TODO: Load questions from playlist:', playlistId);
  };

  // Handle answer selection
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setGameState('answered');

    // Check if correct
    if (index === MOCK_QUESTION.correctIndex) {
      setStats((prev) => ({
        ...prev,
        score: prev.score + 100,
        correctAnswers: prev.correctAnswers + 1,
      }));
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (stats.currentQuestion >= stats.totalQuestions) {
      setGameState('finished');
    } else {
      setStats((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      setSelectedAnswer(null);
      setGameState('playing');
    }
  };

  // Handle restart
  const handleRestart = () => {
    setGameState('idle');
    setSelectedPlaylist(null);
    setSelectedAnswer(null);
    setStats({
      currentQuestion: 1,
      totalQuestions: 10,
      score: 0,
      correctAnswers: 0,
    });
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🎵 Blind Test</h1>
          <p className="mt-2 text-gray-400">
            Testez vos connaissances musicales !
          </p>
        </div>

        {/* Game Score Bar (when playing) */}
        {(gameState === 'playing' || gameState === 'answered') && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-zinc-900 p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Score</span>
              <span className="text-2xl font-bold text-[#1DB954]">
                {stats.score}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                ✅ {stats.correctAnswers} correct
              </span>
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="mx-auto max-w-2xl">
          {/* Idle State - Playlist Selection */}
          {gameState === 'idle' && (
            <PlaylistSelection onSelect={handlePlaylistSelect} />
          )}

          {/* Playing State - Question */}
          {(gameState === 'playing' || gameState === 'answered') && (
            <>
              <Question
                questionNumber={stats.currentQuestion}
                totalQuestions={stats.totalQuestions}
                options={MOCK_QUESTION.options}
                selectedIndex={selectedAnswer}
                correctIndex={gameState === 'answered' ? MOCK_QUESTION.correctIndex : null}
                onAnswer={handleAnswer}
                gameState={gameState}
              />

              {/* Next Button */}
              {gameState === 'answered' && (
                <div className="mt-4 text-center">
                  <Button variant="primary" onClick={handleNextQuestion}>
                    {stats.currentQuestion >= stats.totalQuestions
                      ? 'Voir les résultats'
                      : 'Question suivante →'}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Finished State - Score */}
          {gameState === 'finished' && (
            <ScoreDisplay stats={stats} onRestart={handleRestart} />
          )}
        </div>

        {/* Development Note */}
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-300">
            📝 Notes de développement
          </h3>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>
              • TODO: Charger les playlists depuis l&apos;API avec getUserPlaylists()
            </li>
            <li>
              • TODO: Récupérer les tracks avec preview_url pour l&apos;audio
            </li>
            <li>
              • TODO: Implémenter la logique de génération de questions aléatoires
            </li>
            <li>
              • TODO: Ajouter un composant audio HTML5 pour jouer les extraits
            </li>
            <li>
              • TODO: Persister les scores (localStorage ou API)
            </li>
          </ul>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
