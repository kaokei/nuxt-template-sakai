# CSS 清理计划

> 目标：移除 `layers/sakai/app/assets/` 中未使用的全局 SCSS/CSS 代码，将仅少数页面需要的样式从全局改为按需加载。

---

## 背景

所有 SCSS 通过 `layers/sakai/app/assets/styles.scss` 链式导入，编译为全局 CSS。无 tree-shaking，全量加载。当前存在 ~789 行死代码/可优化代码。

---

## 一、删除死代码（~125 行）

### 1.1 删除 `_preloading.scss` 整个文件

- **文件**: `layers/sakai/app/assets/layout/_preloading.scss`
- **操作**: 删除文件
- **同时移除**:
  - `layout/layout.scss` 第 5 行: `@use './_preloading';`

### 1.2 删除 `_topbar.scss` 中未使用的 config-panel 子类

- **文件**: `layers/sakai/app/assets/layout/_topbar.scss`
- **删除行**: 161-201（`.config-panel` 及其所有子选择器，共 41 行）:
  - `.config-panel`
  - `.config-panel-label`
  - `.config-panel-colors`
  - `.active-color`
  - `.config-panel-settings`
- **保留**: `.layout-config-menu` 类（在 AppTopbar.vue 中使用）

### 1.3 删除 `_menu.scss` 中未使用的 submenu 过渡类

- **文件**: `layers/sakai/app/assets/layout/_menu.scss`
- **删除行**: 140-158（`layout-submenu-*` 过渡动画类，共 19 行）:
  - `.layout-submenu-enter-from`
  - `.layout-submenu-leave-to`
  - `.layout-submenu-enter-to`
  - `.layout-submenu-leave-from`
  - `.layout-submenu-leave-active`
  - `.layout-submenu-enter-active`

### 1.4 删除 `_typography.scss` 中未使用的元素样式

- **文件**: `layers/sakai/app/assets/layout/_typography.scss`
- **删除行**: 42-53（`mark` + `blockquote`，共 12 行）
- **删除行**: 55-59（`hr`，共 5 行）

### 1.5 删除 `_utils.scss` 中未使用的 `.clearfix`

- **文件**: `layers/sakai/app/assets/layout/_utils.scss`
- **删除行**: 13-17（`.clearfix`，共 5 行）

### 1.6 删除 `_responsive.scss` 中未使用的 `.blocked-scroll`

- **文件**: `layers/sakai/app/assets/layout/_responsive.scss`
- **删除行**: 67-69（`.blocked-scroll`，共 3 行）

---

## 二、按需加载优化（~758 行移出全局 bundle）

### 2.1 flags.css 从全局移除，改为组件内按需导入

> 当前 `demo.scss` 全局导入 `flags/flags.css`（741 行），但仅 TableDoc.vue、InputDoc.vue 使用旗帜功能。

- **操作**:
  1. 从 `demo/demo.scss` 移除 `@use './flags/flags.css';`
  2. 在 `TableDoc.vue` 的 `<style>` 中 `@import` flags.css
  3. 在 `InputDoc.vue` 的 `<style>` 中 `@import` flags.css

### 2.2 code.scss 从全局移除，改为组件内按需导入

> 当前 `demo.scss` 全局导入 `code.scss`（17 行），但仅 BlockViewer.vue、Documentation.vue 使用 `.app-code` 类。

- **操作**:
  1. 从 `demo/demo.scss` 移除 `@use './code.scss';`
  2. 在 `BlockViewer.vue` 的 `<style>` 中 `@import` code.scss
  3. 在 `Documentation.vue` 的 `<style>` 中 `@import` code.scss

### 2.3 demo.scss 清理后状态

移除两个导入后，`demo.scss` 将为空文件，保留入口文件本身但内容为空（后续如需 demo 页全局样式可继续使用）。

---

## 三、验证步骤

1. `pnpm typecheck` — 类型检查必须通过
2. `pnpm lint:fix` — 格式化无报错
3. 检查编译产物中 CSS 体积是否减少
4. 确认 showcase 页面中代码块展示和国旗选择器功能正常
