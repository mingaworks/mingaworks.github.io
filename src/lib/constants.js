// Centralized constants and environment-aligned defaults
export const SITE_TITLE = 'Mingaworks — Digital Production Studio';
export const SITE_URL = import.meta.env.SITE ?? 'https://mingaworks.github.io';

// Layout sizing tokens (used by LayoutSync/LeftMenu/PeekPanel)
export const LEFT_MENU_MIN = 160; // px, minimum left menu width
export const PEEK_DEFAULT_WIDTH = 480; // px, fallback peek width

// Design tokens: reference CSS variables only. Actual hex/RGB values are defined
// in `src/styles/global.css` (the canonical source of truth for colors).
export const COLORS = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)'
};

// Export other build-time flags or paths as needed
export const BUILD = {
  site: SITE_URL,
};
