import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'ok' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  onClick,
  className,
}: ChipProps) {
  const baseStyles = cn(
    'inline-flex items-center font-medium',
    'uppercase tracking-wider',
    'border'
  );

  const variants = {
    default: selected
      ? 'bg-[var(--primary)] text-[var(--background)] border-[var(--primary)]'
      : cn(
          'bg-transparent text-[var(--muted)] border-[var(--border)]',
          onClick && 'hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-pointer'
        ),
    ok: 'bg-transparent text-[var(--ok)] border-[var(--ok)]',
    warning: 'bg-transparent text-[var(--warning)] border-[var(--warning)]',
    danger: 'bg-transparent text-[var(--danger)] border-[var(--danger)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </span>
  );
}
