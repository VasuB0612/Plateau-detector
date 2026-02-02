'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrengthProps {
  password: string;
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      label: '8+ characters',
      met: password.length >= 8,
    },
    {
      label: 'Uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'Special character',
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];
}

export function isPasswordStrong(password: string): boolean {
  const requirements = getPasswordRequirements(password);
  return requirements.every(req => req.met);
}

export function getPasswordStrengthLevel(password: string): {
  level: number;
  label: string;
  color: string;
} {
  const requirements = getPasswordRequirements(password);
  const metCount = requirements.filter(req => req.met).length;

  if (metCount === 0) {
    return { level: 0, label: 'Too weak', color: 'bg-[var(--muted)]' };
  } else if (metCount <= 2) {
    return { level: 1, label: 'Weak', color: 'bg-[var(--danger)]' };
  } else if (metCount <= 3) {
    return { level: 2, label: 'Fair', color: 'bg-[var(--warning)]' };
  } else if (metCount <= 4) {
    return { level: 3, label: 'Good', color: 'bg-[var(--secondary)]' };
  } else {
    return { level: 4, label: 'Strong', color: 'bg-[var(--ok)]' };
  }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = getPasswordRequirements(password);
  const strength = getPasswordStrengthLevel(password);

  return (
    <div className="mt-3 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">Password strength</span>
          <span className={cn(
            'text-xs',
            strength.level === 4 ? 'text-[var(--ok)]' :
            strength.level === 3 ? 'text-[var(--secondary)]' :
            strength.level === 2 ? 'text-[var(--warning)]' :
            strength.level >= 1 ? 'text-[var(--danger)]' : 'text-[var(--muted)]'
          )}>
            {password.length > 0 ? strength.label : '—'}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1 flex-1 transition-colors',
                level <= strength.level ? strength.color : 'bg-[var(--border)]'
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-1.5 text-xs',
              req.met ? 'text-[var(--ok)]' : 'text-[var(--muted)]'
            )}
          >
            {req.met ? (
              <Check className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
