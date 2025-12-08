// Page Dashboard - Statistiques d'écoute Spotify

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">📊 Dashboard</h1>
      <p className="text-zinc-400 mb-8">Vos statistiques d&apos;écoute Spotify</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🎵 Top Artistes</h2>
          <p className="text-zinc-400 text-sm">Vos artistes les plus écoutés</p>
          <p className="text-zinc-500 text-xs mt-4">À implémenter (A3)</p>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🎶 Top Titres</h2>
          <p className="text-zinc-400 text-sm">Vos titres préférés</p>
          <p className="text-zinc-500 text-xs mt-4">À implémenter (A3)</p>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🕐 Récemment écouté</h2>
          <p className="text-zinc-400 text-sm">Votre historique récent</p>
          <p className="text-zinc-500 text-xs mt-4">À implémenter (A3)</p>
        </div>
      </div>
    </div>
  );
}
