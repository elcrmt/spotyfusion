'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

export function useSpotifyPlayer(accessToken: string) {
    const [player, setPlayer] = useState<any>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    // 1. Charger le script SDK
    useEffect(() => {
        if (!document.getElementById('spotify-player-script')) {
            const script = document.createElement('script');
            script.id = 'spotify-player-script';
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);
            console.log('[SDK] Script injecté');
        }
    }, []);

    // 2. Initialiser le Player quand le token est là
    useEffect(() => {
        if (!accessToken) {
            console.log('[SDK] Pas de token, attente...');
            return;
        }

        console.log('[SDK] Initialisation avec token:', accessToken.substring(0, 10) + '...');

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('[SDK] Global callback onSpotifyWebPlaybackSDKReady fired');

            const spotifyPlayer = new window.Spotify.Player({
                name: 'SpotyFusion Blind Test',
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(accessToken);
                },
                volume: 0.5,
            });

            spotifyPlayer.addListener('ready', async ({ device_id }: { device_id: string }) => {
                console.log('[SDK] ✅ Ready with Device ID', device_id);
                setDeviceId(device_id);
                setIsReady(true);
                // Auto-transfert simple
                transferPlayback(accessToken, device_id);
            });

            spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
                console.warn('[SDK] ❌ Device ID has gone offline', device_id);
                setIsReady(false);
            });

            spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
                console.error('[SDK] ❌ Init Error:', message);
            });

            spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
                console.error('[SDK] ❌ Auth Error:', message);
            });

            spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
                console.error('[SDK] ❌ Account Error:', message);
            });

            spotifyPlayer.connect().then((success: boolean) => {
                if (success) {
                    console.log('[SDK] Connection successful');
                } else {
                    console.error('[SDK] Connection failed');
                }
            });

            setPlayer(spotifyPlayer);
        };

        // Si le script était déjà chargé avant
        if (window.Spotify) {
            window.onSpotifyWebPlaybackSDKReady();
        }

    }, [accessToken]);

    const transferPlayback = async (token: string, devId: string) => {
        try {
            await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                body: JSON.stringify({ device_ids: [devId], play: false }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('[SDK] Transféré !');
        } catch (err) {
            console.error('[SDK] Erreur transfert:', err);
        }
    }

    // Fonction pour jouer une track
    const playTrack = useCallback(async (spotifyUri: string) => {
        if (!deviceId || !accessToken) return;

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotifyUri] }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsPaused(false);
        } catch (e) {
            console.error('[SDK] Erreur lecture:', e);
        }
    }, [deviceId, accessToken]);

    const pause = useCallback(async () => {
        if (!player) return;
        await player.pause();
        setIsPaused(true);
    }, [player]);

    const resume = useCallback(async () => {
        if (!player) return;
        await player.resume();
    }, [player]);

    return { player, deviceId, isReady, isPaused, playTrack, pause, resume };
}
