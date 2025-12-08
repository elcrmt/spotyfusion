// GET /api/auth/login - Lance la connexion Spotify avec PKCE

import { NextResponse } from 'next/server';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  buildAuthorizeUrl,
} from '@/lib/auth/pkce';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 10, // 10 minutes
};

export async function GET() {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();

    const authorizeUrl = buildAuthorizeUrl(codeChallenge, state);
    const response = NextResponse.redirect(authorizeUrl);

    // Stocke les valeurs PKCE dans des cookies sécurisés
    response.cookies.set('sf_pkce_verifier', codeVerifier, COOKIE_OPTIONS);
    response.cookies.set('sf_oauth_state', state, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error('[Auth] Erreur login:', error);
    const errorUrl = new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000');
    errorUrl.searchParams.set('error', 'login_failed');
    return NextResponse.redirect(errorUrl);
  }
}
