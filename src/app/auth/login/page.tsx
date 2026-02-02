'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[var(--primary)] mb-6">
            <Terminal className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-xl font-medium text-[var(--foreground)]">
            PlateauDetector
          </h1>
          <p className="text-[var(--muted)] mt-2 text-sm">
            Track your fitness progress
          </p>
        </div>

        {/* Login form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-[var(--muted)] mb-6 text-center">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                showPasswordToggle
              />

              {error && (
                <div className="p-3 border border-[var(--danger)] text-[var(--danger)] text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-[var(--border)] pt-6">
              <p className="text-[var(--muted)] text-sm">
                New here?{' '}
                <Link
                  href="/auth/signup"
                  className="text-[var(--primary)] hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
