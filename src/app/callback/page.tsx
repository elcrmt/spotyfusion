'use client';

/**
 * SpotyFusion - OAuth Callback Page
 *
 * This page handles the redirect from Spotify after user authentication.
 * It exchanges the authorization code for access tokens.
 *
 * TODO: Implement the full PKCE token exchange flow
 *
 * Flow:
 * 1. Spotify redirects here with ?code=xxx&state=xxx
 * 2. Verify the state matches what we stored
 * 3. Exchange the code for tokens using the code_verifier
 * 4. Store tokens and redirect to dashboard
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/Common/Spinner';
import { Button } from '@/components/Common/Button';

// ================================
// Types
// ================================

type CallbackStatus = 'loading' | 'success' | 'error';

// ================================
// Callback Page Component
// ================================

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens } = useAuth();

  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Handle error from Spotify
        if (error) {
          setStatus('error');
          setErrorMessage(
            error === 'access_denied'
              ? "Vous avez refusé l'accès à votre compte Spotify."
              : `Erreur Spotify: ${error}`
          );
          return;
        }

        // Check for authorization code
        if (!code) {
          setStatus('error');
          setErrorMessage("Code d'autorisation manquant.");
          return;
        }

        console.log('Received auth code:', code);
        console.log('State:', state);

        /**
         * TODO: Implement the full token exchange flow:
         *
         * 1. Retrieve the code_verifier from sessionStorage
         *    const codeVerifier = sessionStorage.getItem('code_verifier');
         *
         * 2. Verify the state matches
         *    const savedState = sessionStorage.getItem('oauth_state');
         *    if (state !== savedState) throw new Error('State mismatch');
         *
         * 3. Exchange the code for tokens
         *    const response = await fetch(spotifyConfig.tokenUrl, {
         *      method: 'POST',
         *      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         *      body: new URLSearchParams({
         *        grant_type: 'authorization_code',
         *        code: code,
         *        redirect_uri: spotifyConfig.redirectUri,
         *        client_id: spotifyConfig.clientId,
         *        code_verifier: codeVerifier,
         *      }),
         *    });
         *
         * 4. Parse the response
         *    const data = await response.json();
         *    if (!response.ok) throw new Error(data.error_description);
         *
         * 5. Store the tokens
         *    setTokens({
         *      accessToken: data.access_token,
         *      refreshToken: data.refresh_token,
         *      expiresAt: Date.now() + data.expires_in * 1000,
         *    });
         *
         * 6. Fetch user profile
         *    const user = await spotifyClient.getCurrentUser(data.access_token);
         *
         * 7. Redirect to dashboard
         *    router.replace('/dashboard');
         */

        // For now, simulate success and redirect
        // This is just a placeholder until real OAuth is implemented
        console.log('TODO: Exchange code for tokens');

        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In development mode with mock data, just redirect
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          setStatus('success');
          router.replace('/dashboard');
          return;
        }

        // Without real implementation, show error
        setStatus('error');
        setErrorMessage(
          "L'échange de tokens n'est pas encore implémenté. " +
            'Voir les TODOs dans le code.'
        );
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de l'authentification."
        );
      }
    };

    handleCallback();
  }, [searchParams, setTokens, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        {/* Loading State */}
        {status === 'loading' && (
          <>
            <Spinner size="lg" className="mx-auto mb-4" />
            <h1 className="mb-2 text-xl font-semibold text-white">
              Connexion en cours...
            </h1>
            <p className="text-gray-400">
              Échange des tokens avec Spotify
            </p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <span className="mb-4 block text-5xl">✅</span>
            <h1 className="mb-2 text-xl font-semibold text-white">
              Connexion réussie !
            </h1>
            <p className="text-gray-400">
              Redirection vers le dashboard...
            </p>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <span className="mb-4 block text-5xl">❌</span>
            <h1 className="mb-2 text-xl font-semibold text-white">
              Erreur de connexion
            </h1>
            <p className="mb-6 text-gray-400">{errorMessage}</p>
            <Button variant="primary" onClick={() => router.push('/')}>
              Retour à l&apos;accueil
            </Button>
          </>
        )}
      </div>

      {/* Development Note */}
      <div className="mt-8 max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-300">
          📝 Page de callback OAuth
        </h3>
        <p className="text-xs text-gray-500">
          Cette page reçoit le code d&apos;autorisation de Spotify après la connexion.
          Le code doit être échangé contre des tokens d&apos;accès. Voir les TODOs
          dans le code source.
        </p>
      </div>
    </div>
  );
}
