---
inclusion: fileMatch
fileMatchPattern: "**/*.vue,**/*.tsx"
---

# PrimeVue 组件使用规范

## 项目配置概览
- PrimeVue 版本：4.x（通过 `@primevue/nuxt-module` 集成）
- 主题：Aura（来自 `@primeuix/themes/aura`）
- CSS 层级：`primevue`（顺序：theme, base, primevue）
- 组件前缀：`Prime`（如 `<PrimeButton>`、`<PrimeDataTable>`，便于区分组件库组件与自定义组件）
- 输入框样式：`filled` 模式
- Ripple 效果：已启用
- 暗色模式选择器：`.app-dark`
- CSS 变量前缀：`p`

## 组件使用规则

### 导入方式
- 项目使用 `@primevue/nuxt-module`，组件会自动注册，无需手动 import
- 在模板中使用带前缀的组件名，例如 `<PrimeButton>`、`<PrimeDataTable>`、`<PrimeInputText>`

### 样式定制
- 优先使用 Tailwind CSS 类名进行布局和间距调整
- 组件主题定制通过 PrimeVue 的 Design Token 系统（CSS 变量以 `--p-` 为前缀）
- 如需深度定制组件样式，使用 Pass Through（PT）机制而非直接覆盖 CSS
- CSS 层级已配置，避免使用 `!important`

### 组件选择建议
- 使用 PrimeVue MCP Server 查询组件文档（props、事件、插槽等）
- 表单输入组件统一使用 `filled` 变体（已全局配置）
- 图标主要使用 `@nuxt/icon` 模块（组件名 `<NuxtIcon>`），同时也使用 PrimeIcons 图标集（如 PrimeVue 组件内置的图标属性）

### 代码风格
- 组件使用 Vue 3 Composition API + `<script setup>` 语法
- 组件文件支持 `.vue` 和 `.tsx` 两种格式
- 中文注释，英文变量名
