'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return 'light';
}

function getStoredTheme(): Theme | null {
  try {
    return localStorage.getItem('theme') as Theme | null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = getStoredTheme();
    const resolved = stored ?? getSystemTheme();
    setTheme(resolved);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  }

  // Sync data-theme attribute whenever theme state changes
  useEffect(() => {
    if (theme === null) return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="1" x2="8" y2="2.5"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1"   y1="8" x2="2.5"  y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.5" y1="8" x2="15" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2.93" y1="2.93" x2="3.99" y2="3.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.01" y1="12.01" x2="13.07" y2="13.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.07" y1="2.93" x2="12.01" y2="3.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3.99" y1="12.01" x2="2.93" y2="13.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
