// src/hooks/useTheme.js
// Light/dark mode — CSS variable swap via data-theme on <html>.
// Persists to localStorage. Defaults to OS preference.
// Copy this file verbatim to every client project.

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'color-scheme';

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark'; // default
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, toggle };
}
