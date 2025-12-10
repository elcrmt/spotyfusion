// GET /api/auth/session - Vérifie si l'utilisateur est connecté

import { NextRequest, NextResponse } from 'next/server';

interface SessionResponse {
  isAuthenticated: boolean;
  expiresAt?: number;
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sf_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json<SessionResponse>({ isAuthenticated: false });
    }

    const session = JSON.parse(sessionCookie);
    const isExpired = session.expiresAt && Date.now() > session.expiresAt;

    if (isExpired && !session.refreshToken) {
      return NextResponse.json<SessionResponse>({ isAuthenticated: false });
    }

    return NextResponse.json<SessionResponse>({
      isAuthenticated: true,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('[Session] Erreur:', error);
    return NextResponse.json<SessionResponse>({ isAuthenticated: false });
  }
}
