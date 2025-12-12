'use client';

// Boutons de réponse - Design maquette Figma avec feedback visuel

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
    return (
        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
            {options.map((option, index) => {
                // Déterminer le style du bouton selon l'état
                let buttonStyle = "bg-[#282828] hover:bg-[#333] border-[#404040]";
                
                if (isAnswered) {
                    if (index === correctIndex) {
                        // Bonne réponse : vert
                        buttonStyle = "bg-green-600/20 border-green-600 text-green-500";
                    } else if (index === selectedIndex) {
                        // Mauvaise réponse sélectionnée : rouge
                        buttonStyle = "bg-red-600/20 border-red-600 text-red-500";
                    } else {
                        // Autres réponses : grisées
                        buttonStyle = "bg-[#282828] border-[#404040] opacity-50";
                    }
                }

                return (
                    <button
                        key={index}
                        onClick={() => !isAnswered && onAnswer(index)}
                        disabled={isAnswered}
                        className={`relative p-4 rounded-xl border text-center font-medium text-base transition-all disabled:cursor-not-allowed ${buttonStyle}`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
