# app/ 保留文件理由评估

> 评估日期：2026-06-06
> 背景：将 40 个文件从 app/ 移到 layers/sakai/ 后，对仍保留在 app/ 中的文件逐一检查理由是否合理。

## 判定标准

| 分级      | 含义                                      |
| --------- | ----------------------------------------- |
| ✅ 合理   | 必须留在 app/，或作为模板示例有价值       |
| ⚠️ 可移动 | 可保留但理由有瑕疵，或应移入 sakai        |
| ❌ 不合理 | 死代码、冗余或产生不必要的 app→sakai 耦合 |

---

## 一、根文件（3 个）

### 1. `app/app.vue`

- **作用**：Nuxt 根组件，渲染 `<NuxtLayout>` + `<NuxtPage />`
- **被谁引用**：Nuxt 框架自动加载
- **引用 sakai 内容**：否
- **评估**：✅ 合理。Nuxt 强制要求根组件在 app/ 顶层，无法放入 layer

### 2. `app/global.d.ts`

- **作用**：声明全局类型（`Window.Sentry`、`TencentCaptcha` 等）
- **被谁引用**：TypeScript 编译器全局生效
- **引用 sakai 内容**：否
- **评估**：✅ 合理。必须位于项目根模块级别才能被 tsconfig 覆盖

### 3. `app/global.module.d.ts`

- **作用**：声明未提供类型的 npm 包模块（`fast-glob`、`dirty-json` 等）
- **被谁引用**：TypeScript 编译器全局生效
- **引用 sakai 内容**：否
- **评估**：✅ 合理。与 global.d.ts 同属项目级类型增强

### 4. `app/components.d.ts`（自动生成）

- **作用**：PrimeVue 组件类型声明（`unplugin-vue-components` 自动生成）
- **被谁引用**：IDE LSP / TypeScript
- **引用 sakai 内容**：否
- **评估**：✅ 合理。由根 nuxt.config.ts 中 @primevue/nuxt-module 自动生成

---

## 二、页面（2 个）

### 5. `app/pages/index.vue`

- **作用**：首页（`/` 路由），展示项目信息 + 演示调用 sakai 层的 UserService
- **被谁引用**：Nuxt 路由
- **引用 sakai 内容**：**是** — `import { UserService } from '@sakai/services/user.service'`
- **评估**：⚠️ 可优化。它是演示性质的 landing 页面，且产生了 app→sakai 的依赖。但作为模板首页，演示如何消费 layer 层服务也有其价值。建议：保留但接受其示意义

### 6. `app/pages/test.vue`

- **作用**：测试页（`/test` 路由），演示本地 SVG 导入和 `NuxtIcon` 自定义图标
- **被谁引用**：Nuxt 路由
- **引用 sakai 内容**：否
- **评估**：✅ 合理。不依赖 sakai，验证图标管线和 SVG 资产导入，是有效的模板示例

---

## 三、布局（1 个）

### 7. `app/layouts/default.vue`

- **作用**：默认布局，仅 `<div class="min-h-screen"><slot /></div>`
- **被谁引用**：Nuxt 布局系统，供 app/pages/index.vue 和 test.vue 使用
- **引用 sakai 内容**：否
- **评估**：✅ 合理。必须作为缺省布局存在，简单且无依赖

---

## 四、资产文件（4 个）

### 8. `app/assets/css/main.css`

- **作用**：全局 CSS 入口，引入 Tailwind、PrimeIcons、字体、sakai 层样式
- **被谁引用**：`nuxt.config.ts` 中 `css: ['~/assets/css/main.css']`
- **引用 sakai 内容**：**是** — `@import '@sakai/assets/main.css'`
- **评估**：✅ 合理。作为唯一 CSS 入口点，它需要编排全局样式和 layer 层样式。耦合是设计意图：模板依附于 sakai 层提供样式

### 9. `app/assets/css/font.css`

- **作用**：`@font-face` 声明三个装饰性字体（JinBuTi、RubikDoodleShadow、Tourney）
- **被谁引用**：main.css 中 `@import './font.css'`
- **引用 sakai 内容**：否
- **评估**：⚠️ 可移动。装饰性字体是 demo 内容，但被 main.css 引用，移走需同时调整 main.css。保留成本低

### 10. `app/assets/css/READMD.md`

- **作用**：关于字体来源的说明文档
- **被谁引用**：仅人类阅读
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。无技术价值的文档注释，建议移到 `docs/` 或删除

### 11. `app/assets/icons/icon-blank.svg`

- **作用**：自定义 SVG 图标，供 NuxtIcon 使用
- **被谁引用**：test.vue + nuxt.config.ts 的 `icon.customCollections` 配置
- **引用 sakai 内容**：否
- **评估**：✅ 合理。因为 `nuxt.config.ts` 将 `./app/assets/icons` 注册为自定义图标目录，移走会破坏图标管线

---

## 五、组件（5 个）

### 12. `app/components/base/TempVariable.tsx`

- **作用**：无渲染的 TSX 容器组件
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码，无任何文件使用它，也没有文档说明其用途

### 13. `app/components/base/button/CopyButton.vue`

- **作用**：复制文本到剪贴板的按钮组件
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。如果作为模板示例，它展示的是组件编写模式，但没有任何地方使用它来验证其可工作

### 14. `app/components/common/QuickUrl.vue`

- **作用**：生成 `https://{prefix}.kaokei.com` 链接的组件
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码，且硬编码了 kaokei.com 域名，不适合作为通用模板示例

### 15. `app/components/common/SiteLogo.vue`

- **作用**：渲染 "KK小工具" Logo 链接到首页
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码，且"KK小工具"是品牌特定内容，不适合通用模板

### 16. `app/components/README.md`

- **作用**：组件目录约定的说明文档
- **被谁引用**：仅人类阅读
- **引用 sakai 内容**：否
- **评估**：⚠️ 可移动。有一定文档价值，但更适合放在 `docs/` 目录而非 `components/` 目录下

---

## 六、Composables（5 个）

### 17. `app/composables/use-feature-flag.ts`

- **作用**：检查功能开关是否对当前用户启用
- **被谁引用**：**无** — 全局零调用
- **引用 sakai 内容**：**是** — 导入 `@sakai/services/feature-flag.service` 和 `user.service`
- **评估**：❌ 不合理。不仅死代码，还因为引用了 sakai 层的服务，在 app/ 中产生了不必要的 app→sakai 依赖。应移入 sakai 层或删除

### 18. `app/composables/use-layout-config.ts`

- **作用**：按路由持久化布局配置（localStorage）
- **被谁引用**：**无** — 全局零调用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。如果作为模板示例，需要至少有一个使用者来验证其可用性

### 19. `app/composables/use-page-loading.ts`

- **作用**：页面加载状态指示器
- **被谁引用**：**无** — 全局零调用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。过于简单的实现（仅返回 `ref(true)`），作为示例价值有限

### 20. `app/composables/use-permission.ts`

- **作用**：RBAC 权限检查（`hasPermission`、`hasAnyPermission`、`hasAllPermissions`）
- **被谁引用**：**无** — 全局零调用
- **引用 sakai 内容**：**是** — 导入 `@sakai/services/auth.service`
- **评估**：❌ 不合理。死代码 + 产生 app→sakai 耦合。项目中实际使用的 `v-permission` 指令直接调用 AuthService，并未使用此 composable。应移入 sakai 层或删除

### 21. `app/composables/use-tool-config.ts`

- **作用**：按路由持久化工具配置（sessionStorage）
- **被谁引用**：**无** — 全局零调用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。与 use-layout-config 几乎相同模式，冗余

---

## 七、工具函数（7 个）

### 22. `app/utils/constant.ts`

- **作用**：导出应用常量（CDN URL、密码模式、编码选项等）
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。12 个导出常量中仅 `QUERY_KEY_FOR_MODEL` 曾被 search.service.ts 使用（search.service.ts 已移入 sakai），其余均无人使用

### 23. `app/utils/cross-page-data.ts`

- **作用**：内存 JSON 字符串缓冲器用于跨页面传数据
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码

### 24. `app/utils/encode.ts`

- **作用**：混淆的 XOR 编码函数（被 jsjiami.com.v7 混淆）
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码 + 存在混淆代码，不适合放入模板项目

### 25. `app/utils/event-bus.ts`

- **作用**：创建并导出全局 `mitt` 事件总线实例
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码

### 26. `app/utils/fuzzy-filter.ts`

- **作用**：递归 JSON 模糊搜索函数
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。虽然有较完善的类型推导，但零使用

### 27. `app/utils/utility.ts`

- **作用**：小工具函数集（`pad`、`hasOwn`、`delay`、`parseInt10` 等）
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码。函数较为零散，且 Nuxt 自动导入使这些函数全局可见但无人消费

### 28. `app/utils/uuid.ts`

- **作用**：导出 `uuid()`（nanoid）和 `guid()`（自定义 UUID v4）
- **被谁引用**：**无** — 全局零引用
- **引用 sakai 内容**：否
- **评估**：❌ 不合理。死代码

---

## 总结

### ✅ 合理保留（9 个）

| 文件                          | 理由                                     |
| ----------------------------- | ---------------------------------------- |
| `app.vue`                     | Nuxt 强制要求根组件在 app/               |
| `global.d.ts`                 | 项目级 TS 类型增强                       |
| `global.module.d.ts`          | 项目级 npm 包模块声明                    |
| `components.d.ts`             | PrimeVue 组件自动生成的类型声明          |
| `layouts/default.vue`         | 缺省布局，供占位页面使用                 |
| `pages/test.vue`              | 验证图标管线，不依赖 sakai               |
| `pages/index.vue`             | landing 页，虽耦合 sakai 但可接受        |
| `assets/css/main.css`         | 唯一 CSS 入口，需要编排全局 + layer 样式 |
| `assets/icons/icon-blank.svg` | 被 nuxt.config.ts 注册为自定义图标目录   |

### ⚠️ 可保留但可优化（2 个）

| 文件                   | 问题                  | 建议                            |
| ---------------------- | --------------------- | ------------------------------- |
| `assets/css/font.css`  | 装饰性字体，demo 内容 | 保留或移入 sakai，调整 main.css |
| `components/README.md` | 文档在组件目录下      | 移入 `docs/`                    |

### ❌ 不合理保留（17 个）

| 文件                   | 问题                         | 建议               |
| ---------------------- | ---------------------------- | ------------------ |
| `assets/css/READMD.md` | 无价值的文档注释             | 删除或移入 `docs/` |
| `TempVariable.tsx`     | 死代码                       | 删除               |
| `CopyButton.vue`       | 死代码                       | 删除               |
| `QuickUrl.vue`         | 死代码 + 硬编码 kaokei.com   | 删除               |
| `SiteLogo.vue`         | 死代码 + "KK小工具" 品牌内容 | 删除               |
| `use-feature-flag.ts`  | 死代码 + 产生 app→sakai 耦合 | 移入 sakai 或删除  |
| `use-layout-config.ts` | 死代码                       | 删除               |
| `use-page-loading.ts`  | 死代码                       | 删除               |
| `use-permission.ts`    | 死代码 + 产生 app→sakai 耦合 | 移入 sakai 或删除  |
| `use-tool-config.ts`   | 死代码                       | 删除               |
| `constant.ts`          | 死代码                       | 删除               |
| `cross-page-data.ts`   | 死代码                       | 删除               |
| `encode.ts`            | 死代码 + 混淆代码            | 删除               |
| `event-bus.ts`         | 死代码                       | 删除               |
| `fuzzy-filter.ts`      | 死代码                       | 删除               |
| `utility.ts`           | 死代码                       | 删除               |
| `uuid.ts`              | 死代码                       | 删除               |

### 总计

| 评级        | 数量      |
| ----------- | --------- |
| ✅ 合理保留 | 9 个      |
| ⚠️ 可优化   | 2 个      |
| ❌ 不合理   | 17 个     |
| **合计**    | **28 个** |
