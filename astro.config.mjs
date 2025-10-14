import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

const SITE = process.env.SITE ?? 'https://mingaworks.github.io';

export default defineConfig({
  site: SITE,
  integrations: [svelte({ "compilerOptions": { "experimental": { "async": true } } }), tailwind()]
});
