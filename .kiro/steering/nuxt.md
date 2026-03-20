---
inclusion: auto
---

# Nuxt 项目规范

## 项目概览
- Nuxt 版本：4.x（SPA 模式，`ssr: false`）
- Node.js 版本：22.19.0（见 `.nvmrc`）
- 包管理器：pnpm 9.9.0+
- 语言：TypeScript，Vue 3 Composition API + `<script setup>`
- 样式方案：Tailwind CSS 4.x（通过 `@tailwindcss/vite` 插件集成）
- UI 框架：PrimeVue 4.x（详见 `primevue.md`）
- 图标方案：`@nuxt/icon`（组件名 `<NuxtIcon>`）

## 目录结构约定

### app/ 目录（Nuxt 4 应用目录）
- `app/pages/` — 页面路由，文件即路由
- `app/layouts/` — 布局组件
- `app/components/` — 组件，按职责分三层：
  - `base/` — 基础通用组件（无路径前缀，直接使用组件名）
  - `common/` — 公共业务组件（无路径前缀）
  - `features/` — 功能特性组件（无路径前缀）
- `app/composables/` — 组合式函数，以 `use-` 命名，Nuxt 自动导入
- `app/services/` — 服务类（使用 `@kaokei/use-vue-service` 依赖注入）
- `app/utils/` — 工具函数，Nuxt 自动导入
- `app/types/` — TypeScript 类型定义
- `app/assets/` — 静态资源（CSS、图标等）
- `app/plugins/` — Nuxt 插件
- `app/directives/` — 自定义指令

### layers/ 目录（Nuxt Layers 扩展）
- `layers/sakai/` — Sakai UI 层，提供布局和 UI 基础组件
- 层内别名：`@sakai` 指向 `layers/sakai/app/`

## 编码规范

### Vue 组件
- 使用 `<script lang="ts" setup>` 语法
- 支持 `.vue` 和 `.tsx` 两种组件格式
- 模板中使用 Nuxt 自动导入，无需手动 import `ref`、`computed`、`useRoute` 等
- SEO 元信息使用 `useSeoMeta()` composable

### TypeScript
- 严格模式，类型定义放在 `app/types/` 目录
- 变量名、函数名使用英文，注释使用中文
- 允许 `any` 类型（ESLint 已关闭 `@typescript-eslint/no-explicit-any`）
- 未使用变量不报错（ESLint 已关闭 `@typescript-eslint/no-unused-vars`）

### 样式
- 优先使用 Tailwind CSS 工具类
- 全局样式入口：`app/assets/css/main.css`
- 支持 SCSS（已安装 `sass`）
- HTML lang 属性设置为 `zh-CN`

### 自动导入
- Nuxt 自动导入 `composables/`、`utils/` 目录下的导出
- Vue API（`ref`、`computed`、`watch` 等）自动可用
- Nuxt 内置 composables（`useRoute`、`useRouter`、`useSeoMeta` 等）自动可用

## 组件注册
- `components/` 下三个子目录均配置了 `pathPrefix: false`
- 组件直接以文件名注册，无需目录前缀
- 例如：`base/button/CopyButton.vue` → `<CopyButton />`

## 依赖注入
- 项目使用 `@kaokei/di` + `@kaokei/use-vue-service` 进行服务层依赖注入
- 服务类放在 `app/services/` 目录

## 代码质量
- ESLint：通过 `@nuxt/eslint` 模块集成
- Prettier：已配置，含 Tailwind CSS 排序插件和 import 排序插件
- Git Hooks：Husky + lint-staged，提交前自动检查
- Commitizen：规范化提交信息（`pnpm commit`）
- Changeset：版本管理和发布

## 常用命令
- `pnpm dev` — 启动开发服务器
- `pnpm build` — 构建生产版本
- `pnpm lint:fix` — 修复 lint 问题
- `pnpm commit` — 规范化提交
- `pnpm analyze` — 构建分析
