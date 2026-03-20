# Bugfix 需求文档

## 简介

`layers/sakai/` 目录下的 Vue 文件中，PrimeVue 组件使用了无前缀的组件名（如 `<Button>`、`<DataTable>`、`<Dialog>`），违反了项目规范要求的 `Prime` 前缀命名约定（如 `<PrimeButton>`、`<PrimeDataTable>`、`<PrimeDialog>`）。这是因为 `layers/sakai` 来源于第三方 Sakai 模板的 demo 代码，原始代码未遵循本项目的组件前缀规范。此问题影响代码一致性，且可能在组件前缀配置生效后导致组件无法正确解析。

## Bug 分析

### 当前行为（缺陷）

1.1 WHEN `layers/sakai/` 下的 Vue 文件模板中使用 PrimeVue 组件时 THEN 组件使用无前缀的名称（如 `<Button>`、`<DataTable>`、`<Dialog>`、`<InputText>`、`<Column>` 等），不符合项目 `Prime` 前缀规范

1.2 WHEN `layers/sakai/` 下的 Vue 文件模板中同时存在 PrimeVue 组件和自定义组件时 THEN 无法通过命名前缀快速区分 PrimeVue 组件与项目自定义组件（如 `<Button>` vs `<AppConfigurator>`）

### 期望行为（正确）

2.1 WHEN `layers/sakai/` 下的 Vue 文件模板中使用 PrimeVue 组件时 THEN 系统 SHALL 使用 `Prime` 前缀的组件名（如 `<PrimeButton>`、`<PrimeDataTable>`、`<PrimeDialog>`、`<PrimeInputText>`、`<PrimeColumn>` 等）

2.2 WHEN `layers/sakai/` 下的 Vue 文件模板中同时存在 PrimeVue 组件和自定义组件时 THEN 系统 SHALL 仅对 PrimeVue 组件添加 `Prime` 前缀，自定义组件（如 `AppConfigurator`、`FloatingConfigurator`、`BlockViewer` 等）和 Nuxt 内置组件（如 `<NuxtLink>`、`<NuxtPage>`）保持原名不变

### 不变行为（回归预防）

3.1 WHEN `layers/sakai/` 下的 Vue 文件中使用非 PrimeVue 的自定义组件时 THEN 系统 SHALL CONTINUE TO 保持这些组件名称不变（如 `AppConfigurator`、`FloatingConfigurator`、`AppMenu`、`AppMenuItem` 等）

3.2 WHEN `layers/sakai/` 下的 Vue 文件中使用 Nuxt 内置组件或 HTML 原生元素时 THEN 系统 SHALL CONTINUE TO 保持这些元素名称不变（如 `<router-link>`、`<NuxtLink>`、`<div>`、`<span>` 等）

3.3 WHEN `layers/sakai/` 下的 Vue 文件中 PrimeVue 组件的 props、事件绑定、插槽内容时 THEN 系统 SHALL CONTINUE TO 保持这些属性和内容不变，仅修改组件标签名

3.4 WHEN `app/` 目录（非 `layers/sakai/`）下的 Vue 文件使用 PrimeVue 组件时 THEN 系统 SHALL CONTINUE TO 不受本次修改影响
