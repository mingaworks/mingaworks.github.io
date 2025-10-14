import { writable } from 'svelte/store';

const KEY = 'minga:theme';

function getInitial() {
  if (typeof window === 'undefined') return 'light';
  // 1) try saved preference
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    // ignore
  }

  // 2) fallback to prefers-color-scheme
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {}

  return 'light';
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const initial = getInitial();
export const theme = writable(initial);

theme.subscribe((t) => {
  try {
    window.localStorage.setItem(KEY, t);
  } catch (e) {}
  applyTheme(t);
});

export function toggleTheme() {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}

export function setTheme(t) {
  if (t !== 'light' && t !== 'dark') return;
  theme.set(t);
}

export default theme;
