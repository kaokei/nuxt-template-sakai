# PrimeVue 组件前缀修复 Bugfix 设计

## 概述

`layers/sakai/` 目录下的 Vue 文件来源于第三方 Sakai 模板，其中 PrimeVue 组件使用了无前缀的组件名（如 `<Button>`、`<DataTable>`），而项目在 `nuxt.config.ts` 中配置了 `prefix: 'Prime'`。本次修复需要逐个文件将所有 PrimeVue 组件标签名添加 `Prime` 前缀，同时保持自定义组件、Nuxt 内置组件和 HTML 原生元素不变。

## 术语表

- **Bug_Condition (C)**：触发 bug 的条件——`layers/sakai/` 下 Vue 文件模板中使用了无前缀的 PrimeVue 组件标签名
- **Property (P)**：期望行为——所有 PrimeVue 组件标签名应使用 `Prime` 前缀（如 `<Button>` → `<PrimeButton>`）
- **Preservation（保持不变）**：自定义组件、Nuxt 内置组件、HTML 原生元素的标签名不受影响
- **PrimeVue 组件**：由 PrimeVue 组件库提供的 UI 组件，通过 `@primevue/nuxt-module` 自动注册
- **自定义组件**：项目中自行编写的组件（如 `AppConfigurator`、`FloatingConfigurator`、`BlockViewer` 等）
- **Nuxt 内置组件**：Nuxt 框架提供的组件（如 `<NuxtLink>`、`<NuxtPage>`）

## Bug 详情

### Bug 条件

当 `layers/sakai/` 下的 Vue 文件模板中使用 PrimeVue 组件时，组件标签名缺少项目规定的 `Prime` 前缀。由于 `nuxt.config.ts` 中配置了 `prefix: 'Prime'`，这些无前缀的组件名在前缀配置生效后将无法被正确解析。

**形式化规格：**
```
FUNCTION isBugCondition(tag)
  INPUT: tag 为 Vue 模板中的组件标签
  OUTPUT: boolean
  
  RETURN tag.filePath STARTS WITH 'layers/sakai/'
         AND tag.name IN PRIMEVUE_COMPONENT_LIST
         AND NOT tag.name STARTS WITH 'Prime'
END FUNCTION
```

其中 `PRIMEVUE_COMPONENT_LIST` 包含项目中实际使用的 PrimeVue 组件：

`Button`、`DataTable`、`Column`、`Dialog`、`InputText`、`InputNumber`、`Textarea`、`Select`、`RadioButton`、`Rating`、`Tag`、`Toolbar`、`IconField`、`InputIcon`、`Toast`、`Menu`、`Chart`、`SelectButton`、`Fluid`、`FloatLabel`、`AutoComplete`、`DatePicker`、`Slider`、`ColorPicker`、`Knob`、`Checkbox`、`ToggleSwitch`、`Listbox`、`MultiSelect`、`TreeSelect`、`ToggleButton`、`InputGroup`、`InputGroupAddon`、`Accordion`、`AccordionPanel`、`AccordionHeader`、`AccordionContent`、`Panel`、`Fieldset`、`Divider`、`Splitter`、`SplitterPanel`、`ScrollPanel`、`Tabs`、`TabList`、`Tab`、`TabPanels`、`TabPanel`、`Card`、`Timeline`、`Carousel`、`Image`、`Galleria`、`OrderList`、`DataView`、`PickList`、`Tree`、`TreeTable`、`OrganizationChart`、`ConfirmDialog`、`ConfirmPopup`、`Popover`、`Drawer`、`FileUpload`、`Breadcrumb`、`ContextMenu`、`MegaMenu`、`Menubar`、`PanelMenu`、`Steps`、`TabMenu`、`TieredMenu`、`Message`、`InlineMessage`、`ProgressBar`、`Badge`、`Avatar`、`Chip`、`ScrollTop`、`Skeleton`、`ProgressSpinner`、`Terminal`、`MeterGroup`、`SpeedDial`、`Stepper`、`StepList`、`StepPanels`、`StepItem`、`Step`、`StepPanel`

### 示例

- `<Button label="New" />` → 应为 `<PrimeButton label="New" />`，`</Button>` → `</PrimeButton>`
- `<DataTable :value="products">` → 应为 `<PrimeDataTable :value="products">`，`</DataTable>` → `</PrimeDataTable>`
- `<Dialog v-model:visible="visible">` → 应为 `<PrimeDialog v-model:visible="visible">`，`</Dialog>` → `</PrimeDialog>`
- `<InputText v-model="value" />` → 应为 `<PrimeInputText v-model="value" />`
- `<AppConfigurator />` → 保持不变（自定义组件，不是 PrimeVue 组件）
- `<router-link to="/">` → 保持不变（Vue Router 内置组件）
- `<div class="card">` → 保持不变（HTML 原生元素）

## 期望行为

### 保持不变的行为

**不变行为：**
- 自定义组件标签名保持不变：`AppConfigurator`、`AppFooter`、`AppLayout`、`AppMenu`、`AppMenuItem`、`AppSidebar`、`AppTopbar`、`FloatingConfigurator`、`BlockViewer`、`StatsWidget`、`RecentSalesWidget`、`BestSellingWidget`、`RevenueStreamWidget`、`NotificationsWidget`、`TestDashboard`、`TopbarWidget`、`HeroWidget`、`FeaturesWidget`、`HighlightsWidget`、`PricingWidget`、`FooterWidget` 等
- Nuxt/Vue 内置组件保持不变：`<NuxtLink>`、`<NuxtPage>`、`<NuxtLayout>`、`<router-link>`、`<router-view>`、`<Transition>` 等
- HTML 原生元素保持不变：`<div>`、`<span>`、`<button>`、`<input>`、`<label>`、`<img>` 等
- 所有组件的 props、事件绑定（`@click`、`v-model` 等）、插槽内容保持不变
- `app/` 目录下的文件不受影响

**范围：**
所有不涉及 PrimeVue 组件标签名的内容应完全不受本次修改影响，包括：
- 组件的属性和事件绑定
- 模板中的文本内容和插值表达式
- `<script>` 和 `<style>` 部分的代码
- 非 PrimeVue 的组件标签名

## 假设的根本原因

基于 bug 分析，根本原因是：

1. **第三方模板代码未适配项目规范**：`layers/sakai/` 来源于 Sakai 模板的 demo 代码，原始代码使用 PrimeVue 默认的无前缀组件名，未遵循本项目在 `nuxt.config.ts` 中配置的 `prefix: 'Prime'` 规范

2. **批量导入未自动适配前缀**：将第三方模板代码引入项目时，没有进行组件名前缀的批量替换

3. **影响范围广泛**：涉及 `layers/sakai/` 下约 40+ 个 Vue 文件，包含 layout 组件、dashboard 组件、uikit 演示组件、页面组件等

## 正确性属性

Property 1: Bug 条件 - PrimeVue 组件前缀修复

_对于任意_ `layers/sakai/` 下 Vue 文件模板中的 PrimeVue 组件标签（isBugCondition 返回 true），修复后的文件 SHALL 使用 `Prime` 前缀的组件名（如 `<Button>` → `<PrimeButton>`，`</Button>` → `</PrimeButton>`），且开标签和闭标签都正确修改。

**验证需求：2.1, 2.2**

Property 2: 保持不变 - 非 PrimeVue 组件标签名

_对于任意_ 非 PrimeVue 组件的标签（isBugCondition 返回 false），修复后的文件 SHALL 保持与原始文件完全一致，包括自定义组件名、Nuxt 内置组件名、HTML 原生元素名、所有 props、事件绑定和插槽内容。

**验证需求：3.1, 3.2, 3.3, 3.4**

## 修复实现

### 需要的变更

假设根本原因分析正确：

**目录**：`layers/sakai/`

**操作**：逐个 Vue 文件修改模板中的 PrimeVue 组件标签名

**具体变更**：

1. **开标签修改**：将 `<ComponentName` 替换为 `<PrimeComponentName`（其中 ComponentName 属于 PrimeVue 组件列表）
   - 包括自闭合标签：`<ComponentName />` → `<PrimeComponentName />`
   - 包括带属性的标签：`<ComponentName :prop="value">` → `<PrimeComponentName :prop="value">`

2. **闭标签修改**：将 `</ComponentName>` 替换为 `</PrimeComponentName>`

3. **保持不变的内容**：
   - 所有 props、事件绑定、指令不做任何修改
   - 插槽内容不做任何修改
   - `<script>` 中的导入语句和逻辑代码不做修改（PrimeVue 组件通过 nuxt-module 自动注册，无需手动导入）
   - `<style>` 部分不做修改

4. **涉及的文件清单**（包含 PrimeVue 组件的文件）：
   - `layers/sakai/app/layouts/sakai.vue`（Toast）
   - `layers/sakai/app/components/layout/AppConfigurator.vue`（SelectButton）
   - `layers/sakai/app/components/layout/AppLayout.vue`（Toast）
   - `layers/sakai/app/components/FloatingConfigurator.vue`（Button）
   - `layers/sakai/app/components/dashboard/BestSellingWidget.vue`（Button, Menu）
   - `layers/sakai/app/components/dashboard/NotificationsWidget.vue`（Button, Menu）
   - `layers/sakai/app/components/dashboard/RecentSalesWidget.vue`（DataTable, Column, Button）
   - `layers/sakai/app/components/dashboard/RevenueStreamWidget.vue`（Chart）
   - `layers/sakai/app/components/dashboard/StatsWidget.vue`（可能包含 PrimeVue 组件）
   - `layers/sakai/app/components/views/pages/Crud.vue`（Toolbar, Button, DataTable, Column, IconField, InputIcon, InputText, Rating, Tag, Dialog, Textarea, Select, RadioButton, InputNumber）
   - `layers/sakai/app/components/views/pages/auth/Login.vue`（InputText, Checkbox, Button）
   - `layers/sakai/app/components/views/pages/auth/Error.vue`（Button）
   - `layers/sakai/app/components/views/pages/auth/Access.vue`（Button）
   - `layers/sakai/app/components/views/pages/NotFound.vue`（Button）
   - `layers/sakai/app/components/views/pages/Landing.vue`（可能包含 PrimeVue 组件）
   - `layers/sakai/app/components/views/uikit/InputDoc.vue`（InputText, IconField, InputIcon, FloatLabel, Textarea, AutoComplete, DatePicker, InputNumber, Slider, Rating, ColorPicker, Knob, RadioButton, Checkbox, ToggleSwitch, Listbox, Select, MultiSelect, TreeSelect, ToggleButton, SelectButton, InputGroup, InputGroupAddon, Button, Fluid）
   - `layers/sakai/app/components/views/uikit/ButtonDoc.vue`（Button 等）
   - `layers/sakai/app/components/views/uikit/TableDoc.vue`（DataTable, Column 等）
   - `layers/sakai/app/components/views/uikit/ListDoc.vue`（DataView, PickList, OrderList）
   - `layers/sakai/app/components/views/uikit/TreeDoc.vue`（Tree, TreeTable, Column）
   - `layers/sakai/app/components/views/uikit/PanelsDoc.vue`（Accordion, AccordionPanel, AccordionHeader, AccordionContent, Panel, Fieldset, Divider, Splitter, SplitterPanel, ScrollPanel, Tabs, TabList, Tab, TabPanels, TabPanel, Card）
   - `layers/sakai/app/components/views/uikit/OverlayDoc.vue`（Dialog, ConfirmDialog, ConfirmPopup, Popover, Drawer 等）
   - `layers/sakai/app/components/views/uikit/MediaDoc.vue`（Carousel, Image, Galleria）
   - `layers/sakai/app/components/views/uikit/MenuDoc.vue`（Menu, Breadcrumb, ContextMenu, MegaMenu, Menubar, PanelMenu, Steps, TabMenu, TieredMenu 等）
   - `layers/sakai/app/components/views/uikit/MessagesDoc.vue`（Message, InlineMessage, Toast 等）
   - `layers/sakai/app/components/views/uikit/FileDoc.vue`（FileUpload）
   - `layers/sakai/app/components/views/uikit/ChartDoc.vue`（Chart）
   - `layers/sakai/app/components/views/uikit/TimelineDoc.vue`（Timeline, Card, Button）
   - `layers/sakai/app/components/views/uikit/MiscDoc.vue`（ProgressBar, Badge, Avatar, Chip, ScrollTop, Skeleton, Tag 等）
   - `layers/sakai/app/components/views/uikit/FormLayout.vue`（InputText, Textarea, Select, Button 等）
   - `layers/sakai/app/components/views/utilities/Blocks.vue`（可能包含 PrimeVue 组件）

## 测试策略

### 验证方法

测试策略采用两阶段方法：首先在未修复代码上发现反例以确认 bug，然后验证修复的正确性和行为保持不变。

### 探索性 Bug 条件检查

**目标**：在实施修复前，发现能证明 bug 存在的反例。确认或否定根本原因分析。如果否定，需要重新假设。

**测试计划**：编写脚本扫描 `layers/sakai/` 下所有 Vue 文件的 `<template>` 部分，检测是否存在无前缀的 PrimeVue 组件标签名。在未修复代码上运行以观察失败情况。

**测试用例**：
1. **组件标签扫描测试**：扫描所有 Vue 文件，检测无前缀的 PrimeVue 组件标签（将在未修复代码上失败）
2. **开闭标签配对测试**：验证每个 PrimeVue 组件的开标签和闭标签是否都缺少前缀（将在未修复代码上失败）
3. **混合组件区分测试**：验证同一文件中 PrimeVue 组件和自定义组件是否能通过前缀区分（将在未修复代码上失败）

**预期反例**：
- 在 `Crud.vue` 中发现 `<Button>`、`<DataTable>`、`<Dialog>` 等无前缀标签
- 在 `InputDoc.vue` 中发现大量无前缀的输入类组件标签
- 可能原因：第三方模板代码未适配项目前缀规范

### 修复检查

**目标**：验证对于所有满足 bug 条件的输入，修复后的函数产生期望行为。

**伪代码：**
```
FOR ALL file IN layers/sakai/**/*.vue DO
  FOR ALL tag IN file.template WHERE isBugCondition(tag) DO
    ASSERT tag.name STARTS WITH 'Prime'
    ASSERT tag.closingTag.name STARTS WITH 'Prime' (如果非自闭合)
  END FOR
END FOR
```

### 保持不变检查

**目标**：验证对于所有不满足 bug 条件的输入，修复后的函数产生与原始函数相同的结果。

**伪代码：**
```
FOR ALL file IN layers/sakai/**/*.vue DO
  FOR ALL tag IN file.template WHERE NOT isBugCondition(tag) DO
    ASSERT tag.name = original_tag.name
  END FOR
  ASSERT file.script = original_file.script
  ASSERT file.style = original_file.style
  ASSERT file.props = original_file.props
  ASSERT file.events = original_file.events
END FOR
```

**测试方法**：建议使用基于属性的测试（Property-Based Testing），因为：
- 可以自动生成大量测试用例覆盖输入域
- 能捕获手动单元测试可能遗漏的边界情况
- 对所有非 bug 输入的行为不变性提供强保证

**测试计划**：先在未修复代码上观察自定义组件和 HTML 元素的行为，然后编写基于属性的测试来验证这些行为在修复后保持不变。

**测试用例**：
1. **自定义组件保持测试**：验证 `AppConfigurator`、`FloatingConfigurator` 等自定义组件名在修复后未被修改
2. **HTML 元素保持测试**：验证 `<div>`、`<span>`、`<button>` 等 HTML 元素在修复后未被修改
3. **Props 和事件保持测试**：验证所有组件的 props、事件绑定在修复后保持不变
4. **Script/Style 保持测试**：验证 `<script>` 和 `<style>` 部分在修复后完全不变

### 单元测试

- 测试每个文件中 PrimeVue 组件标签名是否正确添加了 `Prime` 前缀
- 测试自闭合标签和非自闭合标签的开闭标签是否都正确修改
- 测试自定义组件标签名是否保持不变

### 基于属性的测试

- 生成随机的组件标签名，验证 PrimeVue 组件被正确添加前缀
- 生成随机的非 PrimeVue 标签名，验证它们保持不变
- 测试修复后的文件中所有 PrimeVue 组件标签都以 `Prime` 开头

### 集成测试

- 测试修复后的页面能否正常渲染（PrimeVue 组件能被正确解析）
- 测试修复后的组件交互功能是否正常（按钮点击、表单输入等）
- 测试修复后的页面布局和样式是否保持不变
