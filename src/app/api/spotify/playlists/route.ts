// GET /api/spotify/playlists - Récupère les playlists de l'utilisateur (C1)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour les playlists utilisateur (C1)
export interface SpotifyUserPlaylist {
  id: string;
  name: string;
  images: Array<{ url: string }> | null;
  tracksCount: number;
  ownerName: string;
}

export async function GET(request: NextRequest) {
  // Récupère la session depuis le cookie
  const sessionCookie = request.cookies.get('sf_session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  let session;
  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.json({ error: 'INVALID_SESSION' }, { status: 401 });
  }

  const { accessToken } = session;

  if (!accessToken) {
    return NextResponse.json({ error: 'NO_TOKEN' }, { status: 401 });
  }

  try {
    // Appel à l'API Spotify pour récupérer les playlists (C1)
    // Limite à 50 playlists pour simplifier (pas de pagination complète)
    const response = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=50',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Token expiré ou invalide
    if (response.status === 401) {
      console.error('[C1] Token Spotify invalide ou expiré');
      return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }

    if (!response.ok) {
      console.error('[C1] Erreur Spotify:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transforme les données en format simplifié (C1)
    const playlists: SpotifyUserPlaylist[] = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      images: item.images && item.images.length > 0 ? item.images : null,
      tracksCount: item.tracks.total,
      ownerName: item.owner.display_name || item.owner.id,
    }));

    return NextResponse.json(playlists);
  } catch (error) {
    console.error('[C1] Erreur fetch playlists:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
