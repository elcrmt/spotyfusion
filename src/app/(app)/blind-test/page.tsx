// Page Blind Test - Quiz musical basé sur vos playlists

export default function BlindTestPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🎵 Blind Test</h1>
      <p className="text-zinc-400 mb-8">Testez vos connaissances musicales</p>

      <div className="max-w-2xl">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center">
          <div className="text-6xl mb-4">🎧</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Prêt à jouer ?
          </h2>
          <p className="text-zinc-400 mb-6">
            Sélectionnez une de vos playlists et devinez les titres à partir d&apos;extraits audio.
          </p>
          <button
            disabled
            className="rounded-full bg-green-500/50 px-8 py-3 font-semibold text-white cursor-not-allowed"
          >
            Commencer (bientôt disponible)
          </button>
          <p className="text-zinc-500 text-xs mt-4">À implémenter (User Story B)</p>
        </div>
      </div>
    </div>
  );
}
