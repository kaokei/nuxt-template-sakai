<script lang="ts" setup>
import { useSeoMeta } from '#imports';
import iconBlankSvg from '@/assets/icons/icon-blank.svg';

useSeoMeta({
  title: '字体测试页 - @nuxt/fonts Demo',
});
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <!-- ========== 标题区 ========== -->
    <h1 class="mb-2 text-3xl">@nuxt/fonts 字体测试页面</h1>
    <p class="mb-8 text-gray-500">
      本页面演示通过 @nuxt/fonts 统一管理项目字体（npm provider）
    </p>

    <!-- ========== 图标测试（保留原有） ========== -->
    <div
      class="mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
    >
      <NuxtIcon name="uil:clipboard" class="text-xl" />
      <NuxtIcon name="local:icon-blank" class="me-2 text-xl" />
      <img :src="iconBlankSvg" alt="测试图片" class="w-7" />
      <span class="text-sm text-gray-400">图标测试（原有功能）</span>
    </div>

    <!-- ========== Demo 1: 多单词字体名 ========== -->
    <section class="mb-10">
      <h2 class="mb-2 text-lg font-bold">1. 多单词字体名：Noto Sans SC</h2>
      <p class="mb-4 text-sm text-gray-500">
        provider:
        <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">npm</code> |
        包名
        <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
          >@fontsource/noto-sans-sc</code
        >
        | CSS 中用引号包裹：<code
          class="rounded bg-gray-100 px-1 dark:bg-gray-700"
          >font-family: 'Noto Sans SC'</code
        >
      </p>

      <div class="space-y-3 rounded-lg border p-5">
        <p style="font-family: 'Noto Sans SC', sans-serif; font-weight: 400">
          <strong>Regular 400：</strong>思源黑体 —
          简体中文首选系统字体。天地玄黄，宇宙洪荒。The quick brown fox.
        </p>
        <p style="font-family: 'Noto Sans SC', sans-serif; font-weight: 500">
          <strong>Medium 500：</strong
          >思源黑体中等字重。日月盈昃，辰宿列张。Pack my box with liquor jugs.
        </p>
        <p style="font-family: 'Noto Sans SC', sans-serif; font-weight: 700">
          <strong>Bold 700：</strong>思源黑体粗体。寒来暑往，秋收冬藏。How
          vexingly quick daft zebras jump!
        </p>
      </div>

      <div class="mt-3 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
        💡 <strong>字体名含空格时</strong>，CSS 中必须用引号：<code
          >'Noto Sans SC'</code
        >、<code>"Rubik Doodle Shadow"</code>
      </div>
    </section>

    <!-- ========== Demo 2: 单词字体名 ========== -->
    <section class="mb-10">
      <h2 class="mb-2 text-lg font-bold">2. 单词字体名：Inter</h2>
      <p class="mb-4 text-sm text-gray-500">
        provider:
        <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">npm</code> |
        包名
        <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
          >@fontsource/inter</code
        >
        | 单词字体名不需要引号也可以
      </p>

      <div class="space-y-3 rounded-lg border p-5">
        <p style="font-family: Inter, sans-serif; font-weight: 400">
          <strong>Regular 400：</strong>Inter is a typeface carefully crafted
          &amp; designed for computer screens.
        </p>
        <p style="font-family: Inter, sans-serif; font-weight: 700">
          <strong>Bold 700：</strong>Inter features a tall x-height to aid
          readability of mixed-case and lower-case text.
        </p>
      </div>
    </section>

    <!-- ========== Demo 3: Google Fonts 迁移字体 ========== -->
    <section class="mb-10">
      <h2 class="mb-2 text-lg font-bold">
        3. 从手动 CDN 迁移到 npm provider（国内网络友好）
      </h2>
      <p class="mb-4 text-sm text-gray-500">
        这两个字体原在 font.css 中手动声明 CDN @font-face， 现改由 @nuxt/fonts
        npm provider 接管（@fontsource 包通过 npmmirror
        镜像下载，构建时自托管，无运行时 CDN 依赖）
      </p>

      <div class="space-y-4 rounded-lg border p-5">
        <!-- Rubik Doodle Shadow -->
        <div>
          <p class="mb-1 text-sm text-gray-500">
            provider:
            <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">npm</code> |
            包名
            <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
              >@fontsource/rubik-doodle-shadow</code
            >
          </p>
          <p
            class="text-lg"
            style="font-family: 'Rubik Doodle Shadow', cursive; font-size: 2rem"
          >
            Rubik Doodle Shadow — Hand drawn fun!
          </p>
        </div>

        <!-- Tourney -->
        <div>
          <p class="mb-1 text-sm text-gray-500">
            provider:
            <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">npm</code> |
            包名
            <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
              >@fontsource/tourney</code
            >
          </p>
          <p
            style="
              font-family: Tourney, sans-serif;
              font-weight: 100;
              font-style: normal;
              font-size: 2rem;
            "
          >
            Tourney Thin 100 — SPORTY DISPLAY
          </p>
          <p
            style="
              font-family: Tourney, sans-serif;
              font-weight: 100;
              font-style: italic;
              font-size: 2rem;
            "
          >
            Tourney Thin 100 Italic — sporty display
          </p>
        </div>
      </div>
    </section>

    <!-- ========== 总结 ========== -->
    <section>
      <h2 class="mb-2 text-lg font-bold">4. 使用流程总结</h2>
      <div class="rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20">
        <ol class="list-inside list-decimal space-y-1">
          <li>
            去
            <a href="https://fontsource.org" target="_blank" class="underline"
              >fontsource.org</a
            >
            搜索字体
          </li>
          <li><code>pnpm add @fontsource/字体名</code></li>
          <li>
            在 <code>nuxt.config.ts</code> 的 <code>fonts.families</code> 加一条
            <code>{ name: '字体名', provider: 'npm' }</code>
          </li>
          <li>CSS / style 中直接 <code>font-family: '字体名'</code></li>
          <li>字体名含空格时用引号，不含时可省略</li>
        </ol>
      </div>
    </section>
  </div>
</template>
