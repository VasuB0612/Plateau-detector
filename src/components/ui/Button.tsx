import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium',
    'transition-colors duration-200 uppercase tracking-wider',
    'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: cn(
      'bg-[var(--primary)] text-[var(--background)]',
      'border border-[var(--primary)]',
      'hover:bg-[var(--primary-hover)]'
    ),
    secondary: cn(
      'bg-[var(--secondary)] text-[var(--background)]',
      'border border-[var(--secondary)]',
      'hover:bg-[var(--secondary-hover)]'
    ),
    outline: cn(
      'bg-transparent text-[var(--foreground)]',
      'border border-[var(--border)]',
      'hover:border-[var(--primary)] hover:text-[var(--primary)]'
    ),
    ghost: cn(
      'text-[var(--muted)]',
      'border border-transparent',
      'hover:text-[var(--foreground)]'
    ),
    danger: cn(
      'bg-transparent text-[var(--danger)]',
      'border border-[var(--danger)]',
      'hover:bg-[var(--danger)] hover:text-white'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
