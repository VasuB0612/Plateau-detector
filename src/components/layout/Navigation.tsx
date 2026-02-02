'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Dumbbell, Plus, LogOut, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/history', label: 'History', icon: History },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
];

export function Navigation() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-[var(--card-bg)] border-r border-[var(--border)]">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[var(--border)]">
          <Terminal className="w-5 h-5 text-[var(--primary)]" />
          <span className="ml-3 text-sm font-medium text-[var(--foreground)]">
            PlateauDetector
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--background)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
                )}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            );
          })}

          {/* Log Workout button */}
          <Link
            href="/log"
            className={cn(
              'flex items-center px-3 py-2.5 text-sm mt-4',
              'text-[var(--secondary)] border border-[var(--secondary)]',
              'hover:bg-[var(--secondary)] hover:text-[var(--background)]',
              'transition-colors'
            )}
          >
            <Plus className="w-4 h-4 mr-3" />
            Log Workout
          </Link>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--muted)] truncate mb-3">
            {user?.email}
          </div>
          <button
            onClick={signOut}
            className={cn(
              'flex items-center w-full px-3 py-2 text-sm',
              'text-[var(--danger)] border border-[var(--border)]',
              'hover:border-[var(--danger)] transition-colors'
            )}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--card-bg)] border-b border-[var(--border)] z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <Terminal className="w-5 h-5 text-[var(--primary)]" />
            <span className="ml-2 text-sm font-medium text-[var(--foreground)]">
              PlateauDetector
            </span>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-[var(--danger)]"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] border-t border-[var(--border)] z-40">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full',
                  isActive ? 'text-[var(--primary)]' : 'text-[var(--muted)]'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] mt-1">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/log"
            className="flex flex-col items-center justify-center flex-1 h-full text-[var(--secondary)]"
          >
            <div className="w-10 h-10 flex items-center justify-center -mt-4 bg-[var(--card-bg)] border border-[var(--secondary)]">
              <Plus className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
}
