import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: { analyze: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      link: [
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: `/favicon.ico`,
        },
      ],
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },
  components: [
    {
      path: '~/components/base',
      pathPrefix: false,
      extensions: ['.vue', '.tsx'],
    },
    {
      path: '~/components/common',
      pathPrefix: false,
      extensions: ['.vue', '.tsx'],
    },
    {
      path: '~/components/features',
      pathPrefix: false,
      extensions: ['.vue', '.tsx'],
    },
  ],
  modules: ['@primevue/nuxt-module', '@nuxt/icon', '@nuxt/eslint'],
  primevue: {
    components: {
      prefix: 'Prime',
    },
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },
  icon: {
    provider: 'none',
    clientBundle: {
      // list of icons to include in the client bundle
      icons: ['uil:github'],

      // scan all components in the project and include icons
      scan: true,

      // include all custom collections in the client bundle
      includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
    componentName: 'NuxtIcon',
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
        // if you want to include all the icons in nested directories:
        // recursive: true,
      },
    ],
  },
});
