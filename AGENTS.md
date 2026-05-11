# Nuxt 模板项目 — 开发规范

> 以下规范适用于本项目所有 AI Agent 和开发人员。

---

## 一、技术栈概览

- **Nuxt** 4.x（SPA 模式，`ssr: false`）
- **Node.js** 22.19.0（见 `.nvmrc`）
- **包管理器** pnpm 9.9.0+
- **语言** TypeScript，Vue 3 Composition API + `<script setup>`
- **样式方案** Tailwind CSS 4.x（通过 `@tailwindcss/vite` 插件集成）
- **UI 框架** PrimeVue 4.x（通过 `@primevue/nuxt-module` 集成，详见下方 PrimeVue 规范）
- **图标方案** `@nuxt/icon`（组件名 `<NuxtIcon>`）
- **依赖注入** `@kaokei/di` + `@kaokei/use-vue-service`

---

## 二、目录结构约定

### app/ 目录（Nuxt 4 应用目录）

| 目录                       | 用途                | 说明                                    |
| -------------------------- | ------------------- | --------------------------------------- |
| `app/pages/`               | 页面路由            | 文件即路由                              |
| `app/layouts/`             | 布局组件            | —                                       |
| `app/components/base/`     | 基础通用组件        | 无路径前缀，直接用组件名                |
| `app/components/common/`   | 公共业务组件        | 无路径前缀                              |
| `app/components/features/` | 功能特性组件        | 无路径前缀                              |
| `app/composables/`         | 组合式函数          | 以 `use-` 命名，Nuxt 自动导入           |
| `app/services/`            | 服务类              | 使用 `@kaokei/use-vue-service` 依赖注入 |
| `app/utils/`               | 工具函数            | Nuxt 自动导入                           |
| `app/types/`               | TypeScript 类型定义 | —                                       |
| `app/assets/`              | 静态资源            | CSS、图标等                             |
| `app/plugins/`             | Nuxt 插件           | —                                       |
| `app/directives/`          | 自定义指令          | —                                       |

### layers/ 目录（Nuxt Layers 扩展）

- `layers/sakai/` — Sakai UI 层，提供布局和 UI 基础组件
- 层内别名：`@sakai` 指向 `layers/sakai/app/`

---

## 三、编码规范

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

### 组件注册

- `components/` 下三个子目录均配置了 `pathPrefix: false`
- 组件直接以文件名注册，无需目录前缀
- 例：`base/button/CopyButton.vue` → `<CopyButton />`

### 自动导入

- Nuxt 自动导入 `composables/`、`utils/` 目录下的导出
- Vue API（`ref`、`computed`、`watch` 等）自动可用
- Nuxt 内置 composables（`useRoute`、`useRouter`、`useSeoMeta` 等）自动可用

---

## 四、依赖注入

- 项目使用 `@kaokei/di` + `@kaokei/use-vue-service` 进行服务层依赖注入
- **自动导入**：`@kaokei/nuxt-use-vue-service` 模块已配置，以下 API 全局可用，**禁止手动 import**：
  - 核心 API：`useService`、`useRootService`、`useAppService`
  - 装饰器：`Injectable`、`Inject`、`Self`、`SkipSelf`、`Optional`、`PostConstruct`、`PreDestroy`
  - Provider：`declareProviders`、`declareRootProviders`、`declareAppProviders`
  - 其他：`Computed`、`Raw`、`autobind`、`Token`、`LazyInject` 等
- `全局服务类` 或者 `通用服务类` 放在 `app/services/` 目录
- 新建服务时遵循该模式，不要引入其他 DI 方案

---

## 五、代码质量工具

- **ESLint** — 通过 `@nuxt/eslint` 模块集成
- **Prettier** — 已配置，含 Tailwind CSS 排序插件和 import 排序插件
- **Git Hooks** — Husky + lint-staged，提交前自动检查
- **Commitizen** — 规范化提交信息（`pnpm commit`）
- **Changeset** — 版本管理和发布

---

## 六、常用命令

| 命令            | 用途           |
| --------------- | -------------- |
| `pnpm dev`      | 启动开发服务器 |
| `pnpm build`    | 构建生产版本   |
| `pnpm lint:fix` | 修复 lint 问题 |
| `pnpm commit`   | 规范化提交     |
| `pnpm analyze`  | 构建分析       |

---

## 七、PrimeVue 组件规范

### 项目配置

- **版本** 4.x（通过 `@primevue/nuxt-module` 集成）
- **主题** Aura（来自 `@primeuix/themes/aura`）
- **CSS 层级** `primevue`（顺序：theme → base → primevue）
- **组件前缀** `Prime`（如 `<PrimeButton>`、`<PrimeDataTable>`）
- **输入框样式** `filled` 模式（全局配置）
- **Ripple 效果** 已启用
- **暗色模式选择器** `.app-dark`
- **CSS 变量前缀** `--p-`

### 导入方式

- 组件由 `@primevue/nuxt-module` 自动注册，无需手动 import
- 在模板中使用带前缀的组件名，例：`<PrimeButton>`、`<PrimeInputText>`

### 样式定制

- 优先使用 Tailwind CSS 类名进行布局和间距调整
- 主题定制通过 PrimeVue Design Token 系统（CSS 变量以 `--p-` 为前缀）
- 需要深度定制时，使用 Pass Through（PT）机制而非直接覆盖 CSS
- CSS 层级已配置，避免使用 `!important`

### 组件选择

- 使用 PrimeVue MCP Server 查询组件文档（props、事件、插槽等）
- 表单输入组件统一使用 `filled` 变体（已全局配置）
- 图标主要使用 `@nuxt/icon` 模块（组件名 `<NuxtIcon>`）
- PrimeIcons 图标集也可使用（PrimeVue 组件内置的图标属性）

### 代码风格

- 使用 Vue 3 Composition API + `<script setup>` 语法
- 组件文件支持 `.vue` 和 `.tsx` 两种格式
- 中文注释，英文变量名
