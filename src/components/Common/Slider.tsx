/**
 * SpotyFusion - Slider Component
 *
 * A reusable range slider component for the mood generator.
 *
 * @module components/Common/Slider
 */

import { InputHTMLAttributes } from 'react';

// ================================
// Types
// ================================

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Label for the slider */
  label: string;
  /** Current value (0-100) */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Show value display */
  showValue?: boolean;
  /** Min value label */
  minLabel?: string;
  /** Max value label */
  maxLabel?: string;
}

// ================================
// Component
// ================================

export function Slider({
  label,
  value,
  onChange,
  showValue = true,
  minLabel,
  maxLabel,
  min = 0,
  max = 100,
  className = '',
  ...props
}: SliderProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Label and Value */}
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {showValue && (
          <span className="text-sm text-gray-400">{value}%</span>
        )}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-[#1DB954]"
        {...props}
      />

      {/* Min/Max Labels */}
      {(minLabel || maxLabel) && (
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default Slider;
