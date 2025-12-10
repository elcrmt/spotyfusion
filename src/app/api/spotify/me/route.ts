// GET /api/spotify/me - Récupère le profil Spotify de l'utilisateur connecté (A3)

import { NextRequest, NextResponse } from 'next/server';

// Type simplifié pour le profil utilisateur (A3)
export interface SpotifyUserProfile {
  id: string;
  displayName: string | null;
  imageUrl: string | null;
  product: 'premium' | 'free' | 'open' | null;
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
    // Appel à l'API Spotify
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Token expiré ou invalide
    if (response.status === 401) {
      console.error('[A3] Token Spotify invalide ou expiré');
      return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }

    if (!response.ok) {
      console.error('[A3] Erreur Spotify:', response.status);
      return NextResponse.json(
        { error: 'SPOTIFY_ERROR' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Retourne uniquement les champs utiles (A3)
    const profile: SpotifyUserProfile = {
      id: data.id,
      displayName: data.display_name || null,
      imageUrl: data.images?.[0]?.url || null,
      product: data.product || null,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('[A3] Erreur fetch /me:', error);
    return NextResponse.json({ error: 'FETCH_ERROR' }, { status: 500 });
  }
}
