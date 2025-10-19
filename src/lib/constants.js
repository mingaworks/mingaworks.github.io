// Project-level constants; keep values minimal and environment-driven.
export const SITE_TITLE = 'Mingaworks \u2014 Digital Production Studio';
export const SITE_URL = import.meta.env.SITE ?? 'https://mingaworks.github.io';
// Layout sizing tokens used to compute responsive breakpoints and CSS vars.
export const LEFT_MENU_MIN = 160; // px - enforce minimum readable left menu
export const PEEK_DEFAULT_WIDTH = 480; // px - conservative peek width fallback

// Use CSS variables for design tokens so themes remain authoritative in CSS.
export const COLORS = {
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)'
};

// Build-time references; kept explicit to avoid implicit imports elsewhere.
export const BUILD = {
  site: SITE_URL,
};
