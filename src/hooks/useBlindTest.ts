'use client';

// Hook pour gérer la logique du Blind Test (C1-C5)
// Version PREMIUM: Utilise le Web Playback SDK pour jouer tous les titres

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchUserPlaylists, fetchPlaylistTracks, PlaylistItem, PlaylistTrackItem } from '@/lib/spotify/playlistClient';
import { useSpotifyPlayer } from './useSpotifyPlayer';

export type GamePhase = 'loading' | 'select' | 'playing' | 'answered' | 'finished';

export interface BlindTestQuestion {
    track: PlaylistTrackItem;
    options: string[]; // 4 options
    correctIndex: number;
}

export interface BlindTestState {
    phase: GamePhase;
    playlists: PlaylistItem[];
    selectedPlaylist: PlaylistItem | null;
    questions: BlindTestQuestion[];
    currentQuestionIndex: number;
    score: number;
    lastAnswerCorrect: boolean | null;
    error: string | null;
    isPlayerReady: boolean;
}

const TOTAL_QUESTIONS = 10;

// Mélange un tableau (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Génère les questions à partir des tracks
function generateQuestions(
    tracks: PlaylistTrackItem[],
    count: number
): BlindTestQuestion[] {
    if (tracks.length < 4) {
        throw new Error('Pas assez de tracks pour générer des questions');
    }

    const shuffledTracks = shuffleArray(tracks);
    const questionsCount = Math.min(count, shuffledTracks.length);
    const questions: BlindTestQuestion[] = [];

    for (let i = 0; i < questionsCount; i++) {
        const correctTrack = shuffledTracks[i];

        // Sélectionne 3 mauvaises réponses aléatoires
        const wrongTracks = shuffleArray(tracks.filter((t) => t.id !== correctTrack.id)).slice(0, 3);

        if (wrongTracks.length < 3) continue;

        const options = shuffleArray([
            correctTrack.name,
            ...wrongTracks.map((t) => t.name),
        ]);

        const correctIndex = options.indexOf(correctTrack.name);

        questions.push({
            track: correctTrack,
            options,
            correctIndex,
        });
    }

    return questions;
}

export function useBlindTest() {
    const [token, setToken] = useState<string>('');
    const { player, deviceId, isReady, playTrack, pause } = useSpotifyPlayer(token);

    const [state, setState] = useState<BlindTestState>({
        phase: 'loading',
        playlists: [],
        selectedPlaylist: null,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        lastAnswerCorrect: null,
        error: null,
        isPlayerReady: false,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Récupère le token au montage
    useEffect(() => {
        fetch('/api/auth/token')
            .then(res => res.json())
            .then(data => {
                if (data.accessToken) setToken(data.accessToken);
            })
            .catch(console.error);
    }, []);

    // Sync player ready state
    useEffect(() => {
        setState(s => ({ ...s, isPlayerReady: isReady }));
    }, [isReady]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            pause(); // Pause playback on leave
        };
    }, [pause]);

    // Charge les playlists au démarrage
    const loadPlaylists = useCallback(async () => {
        try {
            setState((s) => ({ ...s, phase: 'loading', error: null }));
            const data = await fetchUserPlaylists();
            setState((s) => ({ ...s, phase: 'select', playlists: data.items }));
        } catch (error) {
            setState((s) => ({ ...s, phase: 'select', error: 'Erreur de chargement des playlists' }));
        }
    }, []);

    // Sélectionne une playlist et démarre le jeu
    const selectPlaylist = useCallback(async (playlist: PlaylistItem) => {
        if (!deviceId) {
            setState((s) => ({
                ...s,
                error: 'Le lecteur Spotify n\'est pas prêt. Assurez-vous d\'être Premium et d\'avoir rechargé la page.'
            }));
            return;
        }

        try {
            setState((s) => ({ ...s, phase: 'loading', selectedPlaylist: playlist, error: null }));

            const data = await fetchPlaylistTracks(playlist.id);

            // Minimum 4 tracks
            if (data.items.length < 4) {
                setState((s) => ({
                    ...s,
                    phase: 'select',
                    error: `Cette playlist n'a que ${data.items.length} tracks (minimum 4 requis).`,
                }));
                return;
            }

            // Génère les questions (PLUS BESOIN DE PREVIEW URL !)
            const questionsCount = Math.min(TOTAL_QUESTIONS, data.items.length);
            const questions = generateQuestions(data.items, questionsCount);

            setState((s) => ({
                ...s,
                phase: 'playing',
                questions,
                currentQuestionIndex: 0,
                score: 0,
                lastAnswerCorrect: null,
            }));

            // Lance la première musique
            if (questions.length > 0) {
                const firstTrackUri = `spotify:track:${questions[0].track.id}`;
                await playTrack(firstTrackUri);

                // Arrête après 30s
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    pause();
                }, 30000);
            }

        } catch (error) {
            console.error(error);
            setState((s) => ({ ...s, phase: 'select', error: 'Erreur de chargement des tracks' }));
        }
    }, [deviceId, playTrack, pause]);

    // Soumet une réponse
    const submitAnswer = useCallback((selectedIndex: number) => {
        pause(); // Stop music immediate
        if (timerRef.current) clearTimeout(timerRef.current);

        setState((s) => {
            if (s.phase !== 'playing') return s;

            const currentQuestion = s.questions[s.currentQuestionIndex];
            const isCorrect = selectedIndex === currentQuestion.correctIndex;

            return {
                ...s,
                phase: 'answered',
                score: isCorrect ? s.score + 1 : s.score,
                lastAnswerCorrect: isCorrect,
            };
        });
    }, [pause]);

    // Passe à la question suivante
    const nextQuestion = useCallback(async () => {
        setState((s) => {
            const nextIndex = s.currentQuestionIndex + 1;

            if (nextIndex >= s.questions.length) {
                return { ...s, phase: 'finished' };
            }

            // Lance la musique suivante (side effect, a bit dirty but works within hook logic for now)
            setTimeout(async () => {
                const nextTrack = s.questions[nextIndex].track;
                const nextUri = `spotify:track:${nextTrack.id}`;
                await playTrack(nextUri);

                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    pause();
                }, 30000);
            }, 0);

            return {
                ...s,
                phase: 'playing',
                currentQuestionIndex: nextIndex,
                lastAnswerCorrect: null,
            };
        });
    }, [playTrack, pause]);

    // Rejouer
    const restart = useCallback(() => {
        pause();
        setState((s) => ({
            ...s,
            phase: 'select',
            selectedPlaylist: null,
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            lastAnswerCorrect: null,
            error: null,
        }));
    }, [pause]);

    // Question actuelle
    const currentQuestion = state.questions[state.currentQuestionIndex] || null;

    return {
        ...state,
        currentQuestion,
        totalQuestions: state.questions.length || TOTAL_QUESTIONS,
        loadPlaylists,
        selectPlaylist,
        submitAnswer,
        nextQuestion,
        restart,
        isPlayerReady: isReady
    };
}
