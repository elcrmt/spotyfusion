// Utilitaires PKCE pour l'authentification Spotify
// Doc: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

// Génère un code_verifier aléatoire (chaîne de 64 caractères)
export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Génère le code_challenge à partir du verifier (hash SHA-256)
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

// Génère un state aléatoire pour la protection CSRF
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Encode en base64 URL-safe (remplace les caractères spéciaux)
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Construit l'URL d'autorisation Spotify
export function buildAuthorizeUrl(codeChallenge: string, state: string): string {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const scopes = process.env.SPOTIFY_SCOPES || '';

  if (!clientId) throw new Error('NEXT_PUBLIC_SPOTIFY_CLIENT_ID manquant');
  if (!redirectUri) throw new Error('SPOTIFY_REDIRECT_URI manquant');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
    scope: scopes.replace(/,/g, ' '),
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Types pour la réponse de Spotify
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

// Échange le code d'autorisation contre des tokens
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<SpotifyTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Variables d\'environnement Spotify manquantes');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Échange de token échoué:', error);
    throw new Error(`Échange de token échoué: ${response.status}`);
  }

  return response.json();
}
