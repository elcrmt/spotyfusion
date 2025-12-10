'use client';

// Hook pour gérer la logique du Blind Test (C1-C5)
// Supporte 2 modes: Audio (avec preview) et Quiz Artiste (sans audio)

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchUserPlaylists, fetchPlaylistTracks, PlaylistItem, PlaylistTrackItem } from '@/lib/spotify/playlistClient';

export type GamePhase = 'loading' | 'select' | 'playing' | 'answered' | 'finished';
export type GameMode = 'audio' | 'artist'; // audio = deviner le titre, artist = deviner l'artiste

export interface BlindTestQuestion {
    track: PlaylistTrackItem;
    options: string[]; // 4 options
    correctIndex: number;
}

export interface BlindTestState {
    phase: GamePhase;
    mode: GameMode;
    playlists: PlaylistItem[];
    selectedPlaylist: PlaylistItem | null;
    questions: BlindTestQuestion[];
    currentQuestionIndex: number;
    score: number;
    lastAnswerCorrect: boolean | null;
    error: string | null;
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
    count: number,
    mode: GameMode
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
        const wrongTracks = shuffledTracks
            .filter((t) => t.id !== correctTrack.id)
            .slice(0, 3);

        if (wrongTracks.length < 3) continue;

        // Mode Audio: options = noms des chansons
        // Mode Artist: options = noms des artistes
        const getOptionText = (track: PlaylistTrackItem) =>
            mode === 'audio' ? track.name : track.artists.join(', ');

        const options = shuffleArray([
            getOptionText(correctTrack),
            ...wrongTracks.map((t) => getOptionText(t)),
        ]);

        const correctIndex = options.indexOf(getOptionText(correctTrack));

        questions.push({
            track: correctTrack,
            options,
            correctIndex,
        });
    }

    return questions;
}

export function useBlindTest() {
    const [state, setState] = useState<BlindTestState>({
        phase: 'loading',
        mode: 'audio',
        playlists: [],
        selectedPlaylist: null,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        lastAnswerCorrect: null,
        error: null,
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        try {
            setState((s) => ({ ...s, phase: 'loading', selectedPlaylist: playlist, error: null }));

            const data = await fetchPlaylistTracks(playlist.id);

            // Minimum 4 tracks pour avoir 4 options
            if (data.items.length < 4) {
                setState((s) => ({
                    ...s,
                    phase: 'select',
                    error: `Cette playlist n'a que ${data.items.length} tracks (minimum 4 requis).`,
                }));
                return;
            }

            // Détermine le mode: audio si assez de previews, sinon mode artiste
            const tracksWithPreview = data.items.filter(t => t.previewUrl);
            const useAudioMode = tracksWithPreview.length >= 4;
            const mode: GameMode = useAudioMode ? 'audio' : 'artist';

            // Utilise les tracks avec preview en mode audio, sinon tous les tracks
            const tracksToUse = useAudioMode ? tracksWithPreview : data.items;

            const questionsCount = Math.min(TOTAL_QUESTIONS, tracksToUse.length);
            const questions = generateQuestions(tracksToUse, questionsCount, mode);

            setState((s) => ({
                ...s,
                phase: 'playing',
                mode,
                questions,
                currentQuestionIndex: 0,
                score: 0,
                lastAnswerCorrect: null,
            }));
        } catch (error) {
            setState((s) => ({ ...s, phase: 'select', error: 'Erreur de chargement des tracks' }));
        }
    }, []);

    // Soumet une réponse
    const submitAnswer = useCallback((selectedIndex: number) => {
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
    }, []);

    // Passe à la question suivante
    const nextQuestion = useCallback(() => {
        setState((s) => {
            const nextIndex = s.currentQuestionIndex + 1;

            if (nextIndex >= s.questions.length) {
                return { ...s, phase: 'finished' };
            }

            return {
                ...s,
                phase: 'playing',
                currentQuestionIndex: nextIndex,
                lastAnswerCorrect: null,
            };
        });
    }, []);

    // Rejouer
    const restart = useCallback(() => {
        setState((s) => ({
            ...s,
            phase: 'select',
            mode: 'audio',
            selectedPlaylist: null,
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            lastAnswerCorrect: null,
            error: null,
        }));
    }, []);

    // Question actuelle
    const currentQuestion = state.questions[state.currentQuestionIndex] || null;

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return {
        ...state,
        currentQuestion,
        totalQuestions: state.questions.length || TOTAL_QUESTIONS,
        loadPlaylists,
        selectPlaylist,
        submitAnswer,
        nextQuestion,
        restart,
        audioRef,
    };
}
