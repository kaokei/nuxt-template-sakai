<template>
  <div class="card">
    <div class="mb-4 text-2xl font-semibold">Documentation</div>
    <div class="mb-4 text-xl font-semibold">Get Started</div>
    <p class="mb-4 text-lg">
      Sakai is an application template for Vue based on the
      <a
        href="https://nuxt.com/docs/4.x/getting-started/installation"
        class="font-medium text-primary hover:underline"
        >nuxt</a
      >, the recommended way to start a <strong>Nuxt-powered</strong> Vue
      projects. To get started, clone the
      <a
        href="https://github.com/kaokei/nuxt-template-sakai"
        class="font-medium text-primary hover:underline"
        >repository</a
      >
      from GitHub and install the dependencies with npm or yarn.
    </p>
    <pre class="app-code">
<code>git clone https://github.com/kaokei/nuxt-template-sakai
npm install
npm run dev</code></pre>

    <p class="mb-4 text-lg">
      Navigate to
      <i class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >http://localhost:5173/</i
      >
      to view the application in your local environment.
    </p>

    <pre class="app-code"><code>npm run dev</code></pre>

    <div class="mb-4 text-xl font-semibold">Structure</div>
    <p class="mb-4 text-lg">
      Templates consists of a couple folders, demos and layout have been
      separated so that you can easily remove what is not necessary for your
      application.
    </p>
    <ul class="mb-4 list-disc pl-8 text-lg leading-normal">
      <li>
        <span class="font-medium text-primary">src/layout</span>: Main layout
        files, needs to be present.
      </li>
      <li>
        <span class="font-medium text-primary">src/views</span>: Demo pages like
        Dashboard.
      </li>
      <li>
        <span class="font-medium text-primary">public/demo</span>: Assets used
        in demos
      </li>
      <li>
        <span class="font-medium text-primary">src/assets/demo</span>: Styles
        used in demos
      </li>
      <li>
        <span class="font-medium text-primary">src/assets/layout</span>: SCSS
        files of the main layout
      </li>
    </ul>

    <div class="mb-4 text-xl font-semibold">Menu</div>
    <p class="mb-4 text-lg">
      Main menu is defined at
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >src/layout/AppMenu.vue</span
      >
      file. Update the
      <i class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >model</i
      >
      property to define your own menu items.
    </p>

    <div class="mb-4 text-xl font-semibold">Layout Composable</div>
    <p class="mb-4 text-lg">
      The
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >src/layout/composables/layout.js</span
      >
      is a composable that manages the layout state changes including dark mode,
      PrimeVue theme, menu modes and states. If you change the initial values
      like the preset or colors, make sure to apply them at PrimeVue config at
      main.js as well.
    </p>

    <div class="mb-4 text-xl font-semibold">Tailwind CSS</div>
    <p class="mb-4 text-lg">
      The demo pages are developed with Tailwind CSS however the core
      application shell mainly uses custom CSS.
    </p>

    <div class="mb-4 text-xl font-semibold">Variables</div>
    <p class="mb-4 text-lg">
      CSS variables used in the template derive their values from the PrimeVue
      styled mode presets, use the files under
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >assets/layout/_variables.scss</span
      >
      to customize according to your requirements.
    </p>

    <div class="mb-4 text-xl font-semibold">
      Add Sakai-Vue to a Nuxt Project
    </div>
    <p class="mb-4 text-lg">To get started, create a Nuxt project.</p>
    <pre class="app-code">
<code>npx nuxi@latest init sakai-nuxt</code></pre>

    <p class="mb-4 text-lg">Add Prime related libraries to the project.</p>
    <pre class="app-code">
<code>npm install primevue @primevue/themes tailwindcss-primeui primeicons
npm install --save-dev @primevue/nuxt-module</code></pre>

    <p class="mb-4 text-lg">
      Add PrimeVue-Nuxt module to
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >nuxt.config.js</span
      >
    </p>
    <pre class="app-code">
<code>modules: [
    '@primevue/nuxt-module',
]</code></pre>

    <p class="mb-4 text-lg">
      Install
      <a
        href="https://tailwindcss.com/docs/guides/nuxtjs"
        class="font-medium text-primary hover:underline"
        >Tailwind CSS</a
      >
      with Nuxt using official documentation.
    </p>

    <p class="mb-4 text-lg">
      Add
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >tailwindcss-primeui</span
      >
      package as a plugin to
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >tailwind.config.js</span
      >
    </p>
    <pre class="app-code">
<code>plugins: [require('tailwindcss-primeui')]</code></pre>

    <p class="mb-4 text-lg">
      Add PrimeVue to in
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >nuxt.config.js</span
      >
    </p>
    <pre class="app-code">
<code>import Aura from '@primevue/themes/aura';

primevue: {
    options: {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.app-dark'
            }
        }
    }
}</code></pre>

    <p class="mb-4 text-lg">
      Copy
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >src/assets</span
      >
      folder and paste them to
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >assets</span
      >
      folder to your Nuxt project. And add to
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >nuxt.config.js</span
      >
    </p>
    <pre class="app-code">
<code>css: ['~/assets/tailwind.css', '~/assets/styles.scss']</code></pre>

    <p class="mb-4 text-lg">
      Change
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >app.vue</span
      >
    </p>
    <pre class="app-code">
<code>&lt;template&gt;
    &lt;NuxtLayout&gt;
        &lt;NuxtPage /&gt;
    &lt;/NuxtLayout&gt;
&lt;/template&gt;</code></pre>

    <p class="mb-4 text-lg">
      Create
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >layouts/default.vue</span
      >
      and paste this code:
    </p>
    <pre class="app-code">
<code>&lt;script setup&gt;
import AppLayout from './AppLayout.vue';
&lt;/script&gt;

&lt;template&gt;
    &lt;AppLayout /&gt;
&lt;/template&gt;</code></pre>

    <p class="mb-4 text-lg">
      Create
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >layouts</span
      >
      folder and copy
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >src/layout</span
      >
      folder and paste them. And then create
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >composables/use-layout.vue</span
      >
      and replace it with
      <span class="px-2 py-1 text-base not-italic bg-highlight rounded-border"
        >src/layout/composables/layout.js</span
      >. Then remove this line:
    </p>
    <pre class="app-code">
<code>import { useLayout } from '@sakai/components/layout/composables/layout';</code></pre>

    <p class="mb-4 text-lg">As a final step, copy the following folders:</p>
    <ul class="mb-4 list-disc pl-8 text-lg leading-normal">
      <li>
        <span class="font-medium text-primary">public/demo</span>
        <i class="pi pi-arrow-right text-sm! mr-1"></i>
        <span class="font-medium text-primary">public</span>
      </li>
      <li>
        <span class="font-medium text-primary">src/components</span>
        <i class="pi pi-arrow-right text-sm! mr-1"></i>
        <span class="font-medium text-primary">components</span>
      </li>
      <li>
        <span class="font-medium text-primary">src/service</span>
        <i class="pi pi-arrow-right text-sm! mr-1"></i>
        <span class="font-medium text-primary">service</span>
      </li>
      <li>
        <span class="font-medium text-primary">src/views/uikit</span>
        <i class="pi pi-arrow-right text-sm! mr-1"></i>
        <span class="font-medium text-primary">pages/uikit</span>
      </li>
      <li>
        <span class="font-medium text-primary">src/views/pages</span>
        <i class="pi pi-arrow-right text-sm! mr-1"></i>
        <span class="font-medium text-primary">pages</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
