// GET /api/auth/logout - Déconnecte l'utilisateur

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';
  const response = NextResponse.redirect(new URL('/', baseUrl));

  // Supprime tous les cookies de session
  response.cookies.delete('sf_session');
  response.cookies.delete('sf_pkce_verifier');
  response.cookies.delete('sf_oauth_state');

  return response;
}
