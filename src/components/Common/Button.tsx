/**
 * SpotyFusion - Button Component
 *
 * A reusable button component with multiple variants.
 *
 * @module components/Common/Button
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

// ================================
// Types
// ================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'spotify';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Optional icon to display before text */
  leftIcon?: ReactNode;
  /** Optional icon to display after text */
  rightIcon?: ReactNode;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-black hover:bg-gray-200 focus:ring-white',
  secondary:
    'bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-600',
  outline:
    'border border-zinc-600 text-white hover:bg-zinc-800 focus:ring-zinc-600',
  ghost:
    'text-gray-300 hover:text-white hover:bg-zinc-800 focus:ring-zinc-600',
  spotify:
    'bg-[#1DB954] text-black hover:bg-[#1ed760] focus:ring-[#1DB954]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
};

// ================================
// Component
// ================================

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const styles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={styles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin">⏳</span>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

export default Button;
