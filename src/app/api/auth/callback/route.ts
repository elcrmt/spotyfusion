// GET /api/auth/callback - Gère le retour de Spotify après autorisation

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/auth/pkce';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 jours
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';

  // Spotify a retourné une erreur
  if (error) {
    console.error('[Auth] Erreur Spotify:', error);
    return NextResponse.redirect(new URL(`/?error=${error}`, baseUrl));
  }

  // Pas de code = problème
  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', baseUrl));
  }

  // Récupère les valeurs stockées dans les cookies
  const storedState = request.cookies.get('sf_oauth_state')?.value;
  const codeVerifier = request.cookies.get('sf_pkce_verifier')?.value;

  // Vérifie le state (protection CSRF)
  if (!state || !storedState || state !== storedState) {
    console.error('[Auth] State invalide');
    return NextResponse.redirect(new URL('/?error=state_mismatch', baseUrl));
  }

  // Vérifie qu'on a bien le code_verifier
  if (!codeVerifier) {
    return NextResponse.redirect(new URL('/?error=missing_verifier', baseUrl));
  }

  try {
    // Échange le code contre des tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier);

    // Crée la session
    const sessionData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      tokenType: tokens.token_type,
      scope: tokens.scope,
    };

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));

    // Stocke la session dans un cookie sécurisé
    response.cookies.set('sf_session', JSON.stringify(sessionData), SESSION_COOKIE_OPTIONS);

    // Nettoie les cookies PKCE
    response.cookies.delete('sf_pkce_verifier');
    response.cookies.delete('sf_oauth_state');

    return response;
  } catch (error) {
    console.error('[Auth] Échange de token échoué:', error);

    const response = NextResponse.redirect(new URL('/?error=token_exchange_failed', baseUrl));
    response.cookies.delete('sf_pkce_verifier');
    response.cookies.delete('sf_oauth_state');

    return response;
  }
}
