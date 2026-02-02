'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  className,
  id,
  type,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-medium text-[var(--muted)] mb-2 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={cn(
            'w-full px-3 py-2.5 text-sm',
            'bg-[var(--input-bg)] text-[var(--foreground)]',
            'placeholder:text-[var(--muted)]',
            'border border-[var(--border)]',
            'transition-colors duration-200',
            'focus:outline-none focus:border-[var(--primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--danger)]',
            isPasswordField && showPasswordToggle && 'pr-10',
            className
          )}
          {...props}
        />
        {isPasswordField && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-[11px] text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}
