'use client';

// Boutons de réponse avec feedback visuel (C3, C4)

interface AnswerButtonsProps {
    options: string[];
    correctIndex: number;
    onAnswer: (index: number) => void;
    isAnswered: boolean;
    selectedIndex?: number;
}

export function AnswerButtons({
    options,
    correctIndex,
    onAnswer,
    isAnswered,
    selectedIndex,
}: AnswerButtonsProps) {
    const getButtonStyle = (index: number) => {
        if (!isAnswered) {
            return 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600 text-white';
        }

        if (index === correctIndex) {
            return 'bg-green-500/20 border-green-500 text-green-400';
        }

        if (index === selectedIndex && index !== correctIndex) {
            return 'bg-red-500/20 border-red-500 text-red-400';
        }

        return 'bg-zinc-800/50 border-zinc-700 text-zinc-500';
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => !isAnswered && onAnswer(index)}
                    disabled={isAnswered}
                    className={`
            relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all
            ${getButtonStyle(index)}
            ${!isAnswered && 'cursor-pointer active:scale-98'}
            ${isAnswered && 'cursor-default'}
          `}
                >
                    {/* Numéro de l'option */}
                    <span className="absolute top-2 left-2 sm:left-3 text-xs opacity-50">
                        {String.fromCharCode(65 + index)}
                    </span>

                    {/* Texte de la réponse */}
                    <span className="block mt-2 sm:mt-3 font-medium text-sm sm:text-base truncate pr-6">
                        {option}
                    </span>

                    {/* Icône de résultat */}
                    {isAnswered && index === correctIndex && (
                        <span className="absolute top-2 right-2 sm:right-3 text-green-400">✓</span>
                    )}
                    {isAnswered && index === selectedIndex && index !== correctIndex && (
                        <span className="absolute top-2 right-2 sm:right-3 text-red-400">✗</span>
                    )}
                </button>
            ))}
        </div>
    );
}
