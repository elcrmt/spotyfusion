// Client functions pour les playlists et le Blind Test (C1)

import type { PlaylistItem, PlaylistsResponse } from '@/app/api/spotify/me/playlists/route';
import type { PlaylistTrackItem, PlaylistTracksResponse } from '@/app/api/spotify/playlists/[id]/tracks/route';

export type { PlaylistItem, PlaylistTrackItem, PlaylistTracksResponse };

// Récupère les playlists de l'utilisateur (C1)
export async function fetchUserPlaylists(): Promise<PlaylistsResponse> {
    const response = await fetch('/api/spotify/me/playlists');

    if (response.status === 401) {
        throw new Error('UNAUTHENTICATED');
    }

    if (!response.ok) {
        throw new Error('FETCH_PLAYLISTS_ERROR');
    }

    return response.json();
}

// Récupère les tracks d'une playlist (C1)
export async function fetchPlaylistTracks(playlistId: string): Promise<PlaylistTracksResponse> {
    const response = await fetch(`/api/spotify/playlists/${playlistId}/tracks`);

    if (response.status === 401) {
        throw new Error('UNAUTHENTICATED');
    }

    if (!response.ok) {
        throw new Error('FETCH_TRACKS_ERROR');
    }

    return response.json();
}
