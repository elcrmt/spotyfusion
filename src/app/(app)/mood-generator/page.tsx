// Page Mood Generator - Générateur de playlist selon l'humeur

export default function MoodGeneratorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🎨 Mood Playlist</h1>
      <p className="text-zinc-400 mb-8">Générez une playlist selon votre humeur</p>

      <div className="max-w-2xl">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Comment vous sentez-vous ?
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { emoji: '😊', label: 'Joyeux', color: 'bg-yellow-500/20 hover:bg-yellow-500/30' },
              { emoji: '😢', label: 'Mélancolique', color: 'bg-blue-500/20 hover:bg-blue-500/30' },
              { emoji: '🔥', label: 'Énergique', color: 'bg-red-500/20 hover:bg-red-500/30' },
              { emoji: '😌', label: 'Relaxé', color: 'bg-green-500/20 hover:bg-green-500/30' },
            ].map((mood) => (
              <button
                key={mood.label}
                disabled
                className={`flex flex-col items-center gap-2 rounded-xl p-6 transition-colors cursor-not-allowed opacity-50 ${mood.color}`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-white font-medium">{mood.label}</span>
              </button>
            ))}
          </div>

          <p className="text-zinc-500 text-xs text-center">À implémenter (User Story C)</p>
        </div>
      </div>
    </div>
  );
}
