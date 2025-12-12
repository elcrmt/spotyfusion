'use client';

interface GreenSliderProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    description: string;
}

export function GreenSlider({ value, onChange, label, description }: GreenSliderProps) {
    const percent = value * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{label}</span>
                <span className="text-[#b3b3b3] text-sm bg-[#282828] px-2 py-0.5 rounded">
                    {value.toFixed(2)}
                </span>
            </div>

            {/* Slider container */}
            <div className="relative h-2 w-full">
                {/* Background track (gris) */}
                <div className="absolute inset-0 bg-[#535353] rounded-full" />

                {/* Filled track (vert) */}
                <div
                    className="absolute left-0 top-0 h-full bg-[#1db954] rounded-full pointer-events-none transition-all"
                    style={{ width: `${percent}%` }}
                />

                {/* Input range invisible par-dessus */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={percent}
                    onChange={(e) => onChange(Number(e.target.value) / 100)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Thumb (cercle vert) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1db954] rounded-full shadow-lg pointer-events-none transition-all"
                    style={{ left: `calc(${percent}% - 8px)` }}
                />
            </div>

            <p className="text-[#6a6a6a] text-xs mt-2">
                {description}
            </p>
        </div>
    );
}

export default GreenSlider;
