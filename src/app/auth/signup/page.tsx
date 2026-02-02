'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordStrength, isPasswordStrong } from '@/components/ui/PasswordStrength';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!isPasswordStrong(password)) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
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

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[var(--ok)] mb-6">
                <CheckCircle className="w-8 h-8 text-[var(--ok)]" />
              </div>
              <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
                Check your email
              </h2>
              <p className="text-[var(--muted)] text-sm mb-6">
                We sent you a confirmation link. Please check your email to verify your account.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Continue</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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

        {/* Sign up form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-[var(--muted)] mb-6 text-center">
              Create Account
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

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPasswordToggle
                />
                {password.length > 0 && (
                  <PasswordStrength password={password} />
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                error={
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
              />

              {error && (
                <div className="p-3 border border-[var(--danger)] text-[var(--danger)] text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                disabled={loading || !isPasswordStrong(password) || password !== confirmPassword}
                className="w-full"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-[var(--border)] pt-6">
              <p className="text-[var(--muted)] text-sm">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-[var(--primary)] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
