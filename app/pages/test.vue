<script lang="ts" setup>
import { useSeoMeta } from '#imports';
import iconBlankSvg from '@/assets/icons/icon-blank.svg';

useSeoMeta({
  title: '功能测试页 - Nuxt Icon & Font',
});
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <!-- ========== 标题区 ========== -->
    <h1 class="mb-2 text-3xl">Nuxt 功能测试页</h1>
    <p class="mb-8 text-gray-500">
      本页面演示 @nuxt/icon 图标方案和 @nuxt/fonts
      字体管理方案的使用案例，后续可扩展更多模块展示。
    </p>

    <!-- ============================================= -->
    <!-- 一、图标：@nuxt/icon                            -->
    <!-- ============================================= -->
    <section class="mb-10">
      <h2 class="mb-3 text-lg font-bold">一、图标：@nuxt/icon</h2>
      <p class="mb-4 text-sm text-gray-500">
        演示 Nuxt Icon 模块的三种使用方式：外部图标集、本地 SVG 图标、原生 img
        标签。
      </p>

      <div class="space-y-3 rounded-lg border p-5">
        <div class="flex items-center gap-3">
          <NuxtIcon name="uil:clipboard" class="text-xl" />
          <code class="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700"
            >&lt;NuxtIcon name="uil:clipboard" /&gt;</code
          >
          <span class="text-sm text-gray-400">— 外部图标集（uil）</span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtIcon name="local:icon-blank" class="text-xl" />
          <code class="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700"
            >&lt;NuxtIcon name="local:icon-blank" /&gt;</code
          >
          <span class="text-sm text-gray-400">— 本地 SVG 图标</span>
        </div>
        <div class="flex items-center gap-3">
          <img :src="iconBlankSvg" alt="测试图片" class="w-7" />
          <code class="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700"
            >&lt;img :src="iconBlankSvg" /&gt;</code
          >
          <span class="text-sm text-gray-400">— 原生 img 标签（对比）</span>
        </div>
      </div>
    </section>

    <!-- ============================================= -->
    <!-- 二、字体：@nuxt/fonts                            -->
    <!-- ============================================= -->
    <section>
      <h2 class="mb-3 text-lg font-bold">二、字体：@nuxt/fonts</h2>
      <p class="mb-4 text-sm text-gray-500">
        通过
        <code class="rounded bg-gray-100 px-1 dark:bg-gray-700">npm</code>
        provider 统一管理项目字体（@fontsource 包通过 npmmirror
        镜像下载，构建时自托管，无运行时 CDN 依赖）。
      </p>

      <!-- ========== 2.1 多单词字体名：Noto Sans SC ========== -->
      <div class="mb-8">
        <h3 class="mb-2 font-bold">2.1 多单词字体名：Noto Sans SC</h3>
        <p class="mb-4 text-sm text-gray-500">
          包名
          <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
            >@fontsource/noto-sans-sc</code
          >
          | CSS 中需引号包裹：<code
            class="rounded bg-gray-100 px-1 dark:bg-gray-700"
            >font-family: 'Noto Sans SC'</code
          >
        </p>

        <div class="space-y-3 rounded-lg border p-5">
          <p class="font-noto-sans-sc font-normal">
            <strong>Regular 400：</strong>思源黑体 —
            简体中文首选系统字体。天地玄黄，宇宙洪荒。The quick brown fox.
          </p>
          <p class="font-noto-sans-sc font-medium">
            <strong>Medium 500：</strong
            >思源黑体中等字重。日月盈昃，辰宿列张。Pack my box with liquor jugs.
          </p>
          <p class="font-noto-sans-sc font-bold">
            <strong>Bold 700：</strong>思源黑体粗体。寒来暑往，秋收冬藏。How
            vexingly quick daft zebras jump!
          </p>
        </div>

        <div
          class="mt-3 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20"
        >
          💡 <strong>字体名含空格时</strong>，CSS 中必须用引号：<code
            >'Noto Sans SC'</code
          >、<code>"Rubik Doodle Shadow"</code>
        </div>
      </div>

      <!-- ========== 2.2 单词字体名：Inter ========== -->
      <div class="mb-8">
        <h3 class="mb-2 font-bold">2.2 单词字体名：Inter</h3>
        <p class="mb-4 text-sm text-gray-500">
          包名
          <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
            >@fontsource/inter</code
          >
          | 单词字体名不需要引号也可以
        </p>

        <div class="space-y-3 rounded-lg border p-5">
          <p class="font-inter font-normal">
            <strong>Regular 400：</strong>Inter is a typeface carefully crafted
            &amp; designed for computer screens.
          </p>
          <p class="font-inter font-bold">
            <strong>Bold 700：</strong>Inter features a tall x-height to aid
            readability of mixed-case and lower-case text.
          </p>
        </div>
      </div>

      <!-- ========== 2.3 装饰性字体：Rubik Doodle Shadow & Tourney ========== -->
      <div class="mb-8">
        <h3 class="mb-2 font-bold">
          2.3 装饰性字体：Rubik Doodle Shadow & Tourney
        </h3>
        <p class="mb-4 text-sm text-gray-500">
          原通过 CDN @font-face 手动引入，现改为 @nuxt/fonts npm provider 接管。
        </p>

        <div class="space-y-4 rounded-lg border p-5">
          <!-- Rubik Doodle Shadow -->
          <div>
            <p class="mb-1 text-sm text-gray-500">
              包名
              <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
                >@fontsource/rubik-doodle-shadow</code
              >
            </p>
            <p class="font-rubik text-3xl">
              Rubik Doodle Shadow — Hand drawn fun!
            </p>
          </div>

          <!-- Tourney -->
          <div>
            <p class="mb-1 text-sm text-gray-500">
              包名
              <code class="rounded bg-gray-100 px-1 dark:bg-gray-700"
                >@fontsource/tourney</code
              >
            </p>
            <p class="font-tourney text-3xl font-thin">
              Tourney Thin 100 — SPORTY DISPLAY
            </p>
            <p class="font-tourney text-3xl font-thin italic">
              Tourney Thin 100 Italic — sporty display
            </p>
          </div>
        </div>
      </div>

      <!-- ========== 2.4 使用流程总结 ========== -->
      <div>
        <h3 class="mb-2 font-bold">2.4 使用流程总结</h3>
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
              在 <code>nuxt.config.ts</code> 的
              <code>fonts.families</code> 加一条
              <code>{ name: '字体名', provider: 'npm' }</code>
            </li>
            <li>CSS / style 中直接 <code>font-family: '字体名'</code></li>
            <li>字体名含空格时用引号，不含时可省略</li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>
