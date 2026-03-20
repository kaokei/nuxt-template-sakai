# 实施计划

- [x] 1. 编写 Bug 条件探索性测试
  - **Property 1: Bug Condition** - PrimeVue 组件缺少 Prime 前缀
  - **重要**：此测试必须在实施修复之前编写
  - **重要**：此测试在未修复代码上运行时必须失败——失败即确认 bug 存在
  - **不要**在测试失败时尝试修复测试或代码
  - **说明**：此测试编码了期望行为——修复实施后测试通过即验证修复正确
  - **目标**：发现能证明 bug 存在的反例
  - **Scoped PBT 方法**：扫描 `layers/sakai/` 下所有 Vue 文件的 `<template>` 部分，对于 PRIMEVUE_COMPONENT_LIST 中的每个组件名，检测是否存在无 `Prime` 前缀的标签
  - 编写基于属性的测试脚本，遍历所有 Vue 文件，提取模板中的组件标签名
  - 对于每个标签名，如果它属于 PrimeVue 组件列表（`Button`、`DataTable`、`Column`、`Dialog`、`InputText` 等），断言该标签名以 `Prime` 开头
  - 同时检查开标签和闭标签（`<ComponentName>` 和 `</ComponentName>`）
  - 在未修复代码上运行测试
  - **预期结果**：测试失败（这是正确的——证明 bug 存在）
  - 记录发现的反例（如 `Crud.vue` 中的 `<Button>`、`<DataTable>`、`<Dialog>` 等无前缀标签）
  - 任务完成标准：测试已编写、已运行、失败已记录
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 2. 编写保持不变的属性测试（在实施修复之前）
  - **Property 2: Preservation** - 非 PrimeVue 组件标签名保持不变
  - **重要**：遵循观察优先方法论
  - 在未修复代码上观察非 PrimeVue 组件的行为：
    - 观察：自定义组件（`AppConfigurator`、`FloatingConfigurator`、`BlockViewer` 等）标签名保持原样
    - 观察：Nuxt/Vue 内置组件（`NuxtLink`、`NuxtPage`、`router-link` 等）标签名保持原样
    - 观察：HTML 原生元素（`div`、`span`、`button`、`input` 等）标签名保持原样
    - 观察：所有组件的 props、事件绑定、插槽内容保持不变
    - 观察：`<script>` 和 `<style>` 部分内容保持不变
  - 编写基于属性的测试：对于所有非 PrimeVue 组件标签，修复前后的标签名应完全一致
  - 编写基于属性的测试：对于所有文件的 `<script>` 和 `<style>` 部分，修复前后应完全一致
  - 在未修复代码上运行测试
  - **预期结果**：测试通过（确认基线行为可保持）
  - 任务完成标准：测试已编写、已运行、在未修复代码上通过
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. 修复 PrimeVue 组件前缀

  - [x] 3.1 修复 `layers/sakai/app/layouts/sakai.vue`
    - 将 `Toast` → `PrimeToast`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Toast'] AND NOT tag.name STARTS WITH 'Prime'_
    - _Expected_Behavior: 所有 PrimeVue 组件标签名以 Prime 开头_
    - _Preservation: 自定义组件、Nuxt 内置组件、HTML 元素保持不变_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.2 修复 `layers/sakai/app/components/layout/AppConfigurator.vue`
    - 将 `SelectButton` → `PrimeSelectButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['SelectButton']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.3 修复 `layers/sakai/app/components/layout/AppLayout.vue`
    - 将 `Toast` → `PrimeToast`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Toast']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.4 修复 `layers/sakai/app/components/FloatingConfigurator.vue`
    - 将 `Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.5 修复 `layers/sakai/app/components/dashboard/BestSellingWidget.vue`
    - 将 `Button` → `PrimeButton`，`Menu` → `PrimeMenu`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button', 'Menu']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.6 修复 `layers/sakai/app/components/dashboard/NotificationsWidget.vue`
    - 将 `Button` → `PrimeButton`，`Menu` → `PrimeMenu`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button', 'Menu']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.7 修复 `layers/sakai/app/components/dashboard/RecentSalesWidget.vue`
    - 将 `DataTable` → `PrimeDataTable`，`Column` → `PrimeColumn`，`Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['DataTable', 'Column', 'Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.8 修复 `layers/sakai/app/components/dashboard/RevenueStreamWidget.vue`
    - 将 `Chart` → `PrimeChart`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Chart']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.9 修复 `layers/sakai/app/components/dashboard/StatsWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.10 修复 `layers/sakai/app/components/views/pages/Crud.vue`
    - 将 `Toolbar` → `PrimeToolbar`，`Button` → `PrimeButton`，`DataTable` → `PrimeDataTable`，`Column` → `PrimeColumn`，`IconField` → `PrimeIconField`，`InputIcon` → `PrimeInputIcon`，`InputText` → `PrimeInputText`，`Rating` → `PrimeRating`，`Tag` → `PrimeTag`，`Dialog` → `PrimeDialog`，`Textarea` → `PrimeTextarea`，`Select` → `PrimeSelect`，`RadioButton` → `PrimeRadioButton`，`InputNumber` → `PrimeInputNumber`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Toolbar', 'Button', 'DataTable', 'Column', 'IconField', 'InputIcon', 'InputText', 'Rating', 'Tag', 'Dialog', 'Textarea', 'Select', 'RadioButton', 'InputNumber']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.11 修复 `layers/sakai/app/components/views/pages/auth/Login.vue`
    - 将 `InputText` → `PrimeInputText`，`Checkbox` → `PrimeCheckbox`，`Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['InputText', 'Checkbox', 'Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.12 修复 `layers/sakai/app/components/views/pages/auth/Error.vue`
    - 将 `Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.13 修复 `layers/sakai/app/components/views/pages/auth/Access.vue`
    - 将 `Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.14 修复 `layers/sakai/app/components/views/pages/NotFound.vue`
    - 将 `Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.15 修复 `layers/sakai/app/components/views/pages/Landing.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.16 修复 `layers/sakai/app/components/views/uikit/InputDoc.vue`
    - 将 `InputText` → `PrimeInputText`，`IconField` → `PrimeIconField`，`InputIcon` → `PrimeInputIcon`，`FloatLabel` → `PrimeFloatLabel`，`Textarea` → `PrimeTextarea`，`AutoComplete` → `PrimeAutoComplete`，`DatePicker` → `PrimeDatePicker`，`InputNumber` → `PrimeInputNumber`，`Slider` → `PrimeSlider`，`Rating` → `PrimeRating`，`ColorPicker` → `PrimeColorPicker`，`Knob` → `PrimeKnob`，`RadioButton` → `PrimeRadioButton`，`Checkbox` → `PrimeCheckbox`，`ToggleSwitch` → `PrimeToggleSwitch`，`Listbox` → `PrimeListbox`，`Select` → `PrimeSelect`，`MultiSelect` → `PrimeMultiSelect`，`TreeSelect` → `PrimeTreeSelect`，`ToggleButton` → `PrimeToggleButton`，`SelectButton` → `PrimeSelectButton`，`InputGroup` → `PrimeInputGroup`，`InputGroupAddon` → `PrimeInputGroupAddon`，`Button` → `PrimeButton`，`Fluid` → `PrimeFluid`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['InputText', 'IconField', 'InputIcon', 'FloatLabel', 'Textarea', 'AutoComplete', 'DatePicker', 'InputNumber', 'Slider', 'Rating', 'ColorPicker', 'Knob', 'RadioButton', 'Checkbox', 'ToggleSwitch', 'Listbox', 'Select', 'MultiSelect', 'TreeSelect', 'ToggleButton', 'SelectButton', 'InputGroup', 'InputGroupAddon', 'Button', 'Fluid']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.17 修复 `layers/sakai/app/components/views/uikit/ButtonDoc.vue`
    - 将所有 `Button` → `PrimeButton`，`SpeedDial` → `PrimeSpeedDial`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button', 'SpeedDial']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.18 修复 `layers/sakai/app/components/views/uikit/TableDoc.vue`
    - 将 `DataTable` → `PrimeDataTable`，`Column` → `PrimeColumn`，`Button` → `PrimeButton`，`InputText` → `PrimeInputText`，`Tag` → `PrimeTag`，`IconField` → `PrimeIconField`，`InputIcon` → `PrimeInputIcon`，`Select` → `PrimeSelect`，`MultiSelect` → `PrimeMultiSelect`，`ProgressBar` → `PrimeProgressBar`，`Slider` → `PrimeSlider`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['DataTable', 'Column', 'Button', 'InputText', 'Tag', 'IconField', 'InputIcon', 'Select', 'MultiSelect', 'ProgressBar', 'Slider']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.19 修复 `layers/sakai/app/components/views/uikit/ListDoc.vue`
    - 将 `DataView` → `PrimeDataView`，`Button` → `PrimeButton`，`Select` → `PrimeSelect`，`PickList` → `PrimePickList`，`OrderList` → `PrimeOrderList`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['DataView', 'Button', 'Select', 'PickList', 'OrderList']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.20 修复 `layers/sakai/app/components/views/uikit/TreeDoc.vue`
    - 将 `Tree` → `PrimeTree`，`TreeTable` → `PrimeTreeTable`，`Column` → `PrimeColumn`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Tree', 'TreeTable', 'Column']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.21 修复 `layers/sakai/app/components/views/uikit/PanelsDoc.vue`
    - 将 `Accordion` → `PrimeAccordion`，`AccordionPanel` → `PrimeAccordionPanel`，`AccordionHeader` → `PrimeAccordionHeader`，`AccordionContent` → `PrimeAccordionContent`，`Panel` → `PrimePanel`，`Fieldset` → `PrimeFieldset`，`Divider` → `PrimeDivider`，`Splitter` → `PrimeSplitter`，`SplitterPanel` → `PrimeSplitterPanel`，`ScrollPanel` → `PrimeScrollPanel`，`Tabs` → `PrimeTabs`，`TabList` → `PrimeTabList`，`Tab` → `PrimeTab`，`TabPanels` → `PrimeTabPanels`，`TabPanel` → `PrimeTabPanel`，`Card` → `PrimeCard`，`Toolbar` → `PrimeToolbar`，`Button` → `PrimeButton`，`Menu` → `PrimeMenu`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Accordion', 'AccordionPanel', 'AccordionHeader', 'AccordionContent', 'Panel', 'Fieldset', 'Divider', 'Splitter', 'SplitterPanel', 'ScrollPanel', 'Tabs', 'TabList', 'Tab', 'TabPanels', 'TabPanel', 'Card', 'Toolbar', 'Button', 'Menu']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.22 修复 `layers/sakai/app/components/views/uikit/OverlayDoc.vue`
    - 将 `Dialog` → `PrimeDialog`，`Button` → `PrimeButton`，`Popover` → `PrimePopover`，`DataTable` → `PrimeDataTable`，`Column` → `PrimeColumn`，`Drawer` → `PrimeDrawer`，`ConfirmDialog` → `PrimeConfirmDialog`，`ConfirmPopup` → `PrimeConfirmPopup`，`InputText` → `PrimeInputText`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Dialog', 'Button', 'Popover', 'DataTable', 'Column', 'Drawer', 'ConfirmDialog', 'ConfirmPopup', 'InputText']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.23 修复 `layers/sakai/app/components/views/uikit/MediaDoc.vue`
    - 将 `Carousel` → `PrimeCarousel`，`Image` → `PrimeImage`，`Galleria` → `PrimeGalleria`，`Button` → `PrimeButton`，`Tag` → `PrimeTag`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Carousel', 'Image', 'Galleria', 'Button', 'Tag']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.24 修复 `layers/sakai/app/components/views/uikit/MenuDoc.vue`
    - 将 `Menu` → `PrimeMenu`，`Breadcrumb` → `PrimeBreadcrumb`，`ContextMenu` → `PrimeContextMenu`，`MegaMenu` → `PrimeMegaMenu`，`Menubar` → `PrimeMenubar`，`PanelMenu` → `PrimePanelMenu`，`Steps` → `PrimeSteps`，`TabMenu` → `PrimeTabMenu`，`TieredMenu` → `PrimeTieredMenu`，`Button` → `PrimeButton`，`InputText` → `PrimeInputText`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Menu', 'Breadcrumb', 'ContextMenu', 'MegaMenu', 'Menubar', 'PanelMenu', 'Steps', 'TabMenu', 'TieredMenu', 'Button', 'InputText']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.25 修复 `layers/sakai/app/components/views/uikit/MessagesDoc.vue`
    - 将 `Message` → `PrimeMessage`，`InlineMessage` → `PrimeInlineMessage`，`Toast` → `PrimeToast`，`Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Message', 'InlineMessage', 'Toast', 'Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.26 修复 `layers/sakai/app/components/views/uikit/FileDoc.vue`
    - 将 `FileUpload` → `PrimeFileUpload`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['FileUpload']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.27 修复 `layers/sakai/app/components/views/uikit/ChartDoc.vue`
    - 将 `Chart` → `PrimeChart`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Chart']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.28 修复 `layers/sakai/app/components/views/uikit/TimelineDoc.vue`
    - 将 `Timeline` → `PrimeTimeline`，`Card` → `PrimeCard`，`Button` → `PrimeButton`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Timeline', 'Card', 'Button']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.29 修复 `layers/sakai/app/components/views/uikit/MiscDoc.vue`
    - 将 `ProgressBar` → `PrimeProgressBar`，`Badge` → `PrimeBadge`，`Avatar` → `PrimeAvatar`，`Chip` → `PrimeChip`，`ScrollTop` → `PrimeScrollTop`，`Skeleton` → `PrimeSkeleton`，`Tag` → `PrimeTag`，`ProgressSpinner` → `PrimeProgressSpinner`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['ProgressBar', 'Badge', 'Avatar', 'Chip', 'ScrollTop', 'Skeleton', 'Tag', 'ProgressSpinner']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.30 修复 `layers/sakai/app/components/views/uikit/FormLayout.vue`
    - 将 `InputText` → `PrimeInputText`，`Textarea` → `PrimeTextarea`，`Select` → `PrimeSelect`，`Button` → `PrimeButton`，`RadioButton` → `PrimeRadioButton`，`Checkbox` → `PrimeCheckbox`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['InputText', 'Textarea', 'Select', 'Button', 'RadioButton', 'Checkbox']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.31 修复 `layers/sakai/app/components/views/utilities/Blocks.vue`
    - 将 `Button` → `PrimeButton`，`IconField` → `PrimeIconField`，`InputIcon` → `PrimeInputIcon`，`InputText` → `PrimeInputText`
    - _Bug_Condition: isBugCondition(tag) where tag.name IN ['Button', 'IconField', 'InputIcon', 'InputText']_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.32 修复 `layers/sakai/app/components/views/Dashboard.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.33 修复 `layers/sakai/app/components/landing/TopbarWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签（如 `Button` 等）
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.34 修复 `layers/sakai/app/components/landing/HeroWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.35 修复 `layers/sakai/app/components/landing/FeaturesWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.36 修复 `layers/sakai/app/components/landing/HighlightsWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.37 修复 `layers/sakai/app/components/landing/PricingWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.38 修复 `layers/sakai/app/components/landing/FooterWidget.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.39 修复 `layers/sakai/app/components/dashboard/TestDashboard.vue`
    - 检查并修复所有 PrimeVue 组件标签
    - _Bug_Condition: isBugCondition(tag) where tag.name IN PRIMEVUE_COMPONENT_LIST_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.40 验证 Bug 条件探索性测试现在通过
    - **Property 1: Expected Behavior** - PrimeVue 组件已添加 Prime 前缀
    - **重要**：重新运行任务 1 中的同一测试——不要编写新测试
    - 任务 1 中的测试编码了期望行为
    - 当此测试通过时，确认期望行为已满足
    - 运行任务 1 中的 Bug 条件探索性测试
    - **预期结果**：测试通过（确认 bug 已修复）
    - _Requirements: 2.1, 2.2_

  - [x] 3.41 验证保持不变的属性测试仍然通过
    - **Property 2: Preservation** - 非 PrimeVue 组件标签名保持不变
    - **重要**：重新运行任务 2 中的同一测试——不要编写新测试
    - 运行任务 2 中的保持不变属性测试
    - **预期结果**：测试通过（确认无回归）
    - 确认修复后所有测试仍然通过（无回归）

- [x] 4. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户
  - 运行 Bug 条件测试和保持不变测试，确认全部通过
  - 验证修复范围仅限于 `layers/sakai/` 目录
  - 验证仅修改了 PrimeVue 组件标签名，其他内容未受影响
