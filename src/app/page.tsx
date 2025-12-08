'use client';

/**
 * SpotyFusion - Landing / Login Page
 *
 * The public landing page with Spotify login button.
 *
 * TODO: Implement real OAuth flow with PKCE
 */

import { Button } from '@/components/Common/Button';

// ================================
// Spotify Logo SVG Component
// ================================

function SpotifyLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// ================================
// Features List
// ================================

const features = [
  {
    icon: '📊',
    title: 'Dashboard Personnel',
    description: 'Visualisez vos artistes et morceaux préférés',
  },
  {
    icon: '🎵',
    title: 'Blind Test',
    description: 'Testez vos connaissances musicales',
  },
  {
    icon: '🎨',
    title: 'Générateur de Playlist',
    description: 'Créez des playlists selon votre humeur',
  },
];

// ================================
// Page Component
// ================================

export default function HomePage() {
  /**
   * TODO: Implement Spotify OAuth login
   *
   * Steps to implement:
   * 1. Generate code_verifier and code_challenge (PKCE)
   * 2. Store code_verifier in sessionStorage
   * 3. Redirect to Spotify authorization URL with params:
   *    - client_id
   *    - response_type=code
   *    - redirect_uri
   *    - code_challenge_method=S256
   *    - code_challenge
   *    - scope
   *    - state (CSRF protection)
   */
  const handleLogin = () => {
    // TODO: Implement OAuth flow
    console.log('TODO: Implement Spotify OAuth login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🎧</span>
            <h1 className="text-5xl font-bold text-white md:text-6xl">
              Spoty<span className="text-[#1DB954]">Fusion</span>
            </h1>
          </div>
          <p className="mx-auto max-w-md text-lg text-gray-400">
            Découvrez vos statistiques Spotify, jouez au blind test et créez des
            playlists personnalisées selon votre humeur.
          </p>
        </div>

        {/* Login Button */}
        <Button
          variant="spotify"
          size="lg"
          onClick={handleLogin}
          leftIcon={<SpotifyLogo className="h-5 w-5" />}
          className="mb-12"
        >
          Se connecter avec Spotify
        </Button>

        {/* Features Grid */}
        <div className="grid max-w-4xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-left transition-colors hover:border-zinc-700"
            >
              <span className="mb-3 block text-3xl">{feature.icon}</span>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-gray-500">
        <p>
          SpotyFusion utilise l&apos;
          <a
            href="https://developer.spotify.com/documentation/web-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DB954] hover:underline"
          >
            API Spotify
          </a>
          . Non affilié à Spotify AB.
        </p>
      </footer>
    </div>
  );
}
