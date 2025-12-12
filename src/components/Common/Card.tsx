/**
 * SpotyFusion - Card Component
 *
 * A reusable card component for displaying content in a contained box.
 *
 * @module components/Common/Card
 */

import { ReactNode, HTMLAttributes } from 'react';

// ================================
// Types
// ================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Optional card title */
  title?: string;
  /** Optional card subtitle */
  subtitle?: string;
  /** Whether the card is interactive (hover effects) */
  interactive?: boolean;
  /** Optional padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const baseStyles =
  'bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden';

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const interactiveStyles =
  'transition-all duration-200 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer';

// ================================
// Component
// ================================

export function Card({
  children,
  title,
  subtitle,
  interactive = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const styles = [
    baseStyles,
    paddingStyles[padding],
    interactive ? interactiveStyles : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles} {...props}>
      {(title || subtitle) && (
        <div className={padding === 'none' ? 'p-4 pb-2' : 'mb-4'}>
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ================================
// Card Header Sub-component
// ================================

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-zinc-800 p-4 ${className}`}>
      {children}
    </div>
  );
}

// ================================
// Card Content Sub-component
// ================================

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// ================================
// Card Footer Sub-component
// ================================

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-zinc-800 p-4 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
