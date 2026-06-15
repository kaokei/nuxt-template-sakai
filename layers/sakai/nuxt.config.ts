import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['./app/assets/styles.scss'],
  alias: {
    '@sakai': fileURLToPath(new URL('./app', import.meta.url)),
  },
});
