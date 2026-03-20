import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  alias: {
    '@sakai': fileURLToPath(new URL('./app', import.meta.url)),
  },
});
