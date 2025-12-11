// GET /api/auth/logout - Déconnecte l'utilisateur

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/', baseUrl));

  // Supprime tous les cookies de session avec les bons paramètres
  response.cookies.set('sf_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set('sf_pkce_verifier', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.set('sf_oauth_state', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
