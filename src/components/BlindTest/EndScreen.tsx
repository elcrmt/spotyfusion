'use client';

// Écran de fin de jeu (C5)

interface EndScreenProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
}

export function EndScreen({ score, totalQuestions, onRestart }: EndScreenProps) {
    const percentage = Math.round((score / totalQuestions) * 100);

    const getMessage = () => {
        if (percentage === 100) return { emoji: '🏆', text: 'Parfait ! Tu es un vrai mélomane !' };
        if (percentage >= 80) return { emoji: '🌟', text: 'Excellent ! Tu connais bien ta musique !' };
        if (percentage >= 60) return { emoji: '👍', text: 'Pas mal ! Continue à écouter !' };
        if (percentage >= 40) return { emoji: '🎧', text: 'Tu peux faire mieux, réécoute tes playlists !' };
        return { emoji: '💪', text: 'Ne lâche rien, la musique s\'apprend !' };
    };

    const { emoji, text } = getMessage();

    return (
        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12 px-4">
            {/* Emoji animé */}
            <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">{emoji}</div>

            {/* Score */}
            <div className="mb-3 sm:mb-4">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{score}</span>
                <span className="text-xl sm:text-2xl text-zinc-400">/{totalQuestions}</span>
            </div>

            {/* Pourcentage */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 w-full max-w-xs">
                <div className="flex-1 h-2 sm:h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-green-400 font-semibold text-sm sm:text-base">{percentage}%</span>
            </div>

            {/* Message */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-6 sm:mb-8 max-w-md px-4">{text}</p>

            {/* Boutons */}
            <div className="flex gap-3 sm:gap-4">
                <button
                    onClick={onRestart}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-green-500 hover:bg-green-400 text-white font-semibold text-sm sm:text-base transition-all hover:scale-105 flex items-center gap-2"
                >
                    <span>🔄</span>
                    Rejouer
                </button>
            </div>

            {/* Stats supplémentaires */}
            <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-6 sm:gap-8 text-center w-full max-w-xs">
                <div>
                    <p className="text-2xl sm:text-3xl font-bold text-green-400">{score}</p>
                    <p className="text-zinc-500 text-xs sm:text-sm">Bonnes réponses</p>
                </div>
                <div>
                    <p className="text-2xl sm:text-3xl font-bold text-red-400">{totalQuestions - score}</p>
                    <p className="text-zinc-500 text-xs sm:text-sm">Mauvaises réponses</p>
                </div>
            </div>
        </div>
    );
}
