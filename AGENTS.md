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

### Sakai Layer 组件的导入限制 ⚠️

- `nuxt.config.ts` 中仅对 `app/components/` 下的 `base`、`common`、`features` 三个目录配置了自动导入
- **sakai 层（`layers/sakai/`）中的组件不会被 Nuxt 自动导入**
- 在 sakai 层的页面或组件中使用 sakai 层自己的子组件时，**必须显式 import**：
  ```vue
  <script lang="ts" setup>
  import MyComponent from '@sakai/components/views/pages/some-dir/MyComponent.vue';
  </script>
  ```
- 例外：PrimeVue 组件（`<PrimeButton>` 等）、Nuxt 内置组件、Vue API（`ref` 等）依然自动可用
- 主 app 层（`app/`）的组件互相引用时同理，不在 `base/common/features` 目录下的组件也需要显式 import

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

### 服务 Provider 绑定规则

**所有服务都必须显式绑定，不存在自动发现机制**。`@Injectable()` 只是标记类可被 DI 系统识别，不会自动注册到容器。

通过 `declareXXX()` 方法绑定服务，按作用域分为三层：

| 绑定方法                          | 作用域          | 绑定位置                                      | 示例                                                    |
| --------------------------------- | --------------- | --------------------------------------------- | ------------------------------------------------------- |
| `declareProviders([...])`         | 页面级 / 组件级 | **页面入口文件**（首选）或组件自身            | `declareProviders([ProblemService, ProblemMgrService])` |
| `declareAppProviders([...], app)` | App 级          | Nuxt 插件（通过 `declareAppProvidersPlugin`） | 主题服务、应用级状态                                    |
| `declareRootProviders([...])`     | 全局级          | Nuxt 插件                                     | 日志、全局配置等单例服务                                |

#### 服务作用域判定原则

> 每次创建新服务时，**必须**按以下流程判定其作用域并绑定，避免遗漏注册导致 "No matching binding found" 错误。

```
新建服务后，按以下优先级判定作用域：

1. 是否被多个页面使用？
   └─ 是 → 是否被跨层级使用（composable、中间件、其他插件）？
          └─ 是 → declareRootProviders（全局级，放入 app/plugins/*.provider.ts）
          └─ 否 → 考虑 declareAppProviders 或页面级
   └─ 否 → 进入步骤 2

2. 是否为单一页面或页面树内部使用的服务？
   └─ 是 → declareProviders（页面级，在页面入口 .vue 文件最顶部调用）
   └─ 否 → 进入步骤 3

3. 是否为某个组件独立使用的服务（如弹窗独有状态）？
   └─ 是 → 在该组件自身的 <script setup> 中 declareProviders
   └─ 否 → 重新审视步骤 1-3
```

**全局服务判定特征**（满足任意一条即为全局）：

| 特征                                        | 示例                            |
| ------------------------------------------- | ------------------------------- |
| 持有应用级状态（用户身份、主题、配置）      | `UserService`、`StorageService` |
| 被 composable 引用，composable 可跨页面调用 | `FeatureFlagService`            |
| 封装第三方基础设施（路由、存储、日志）      | `RouterService`                 |
| 被多个页面入口或插件依赖                    | `MenuService`                   |

**当前已注册的全局服务清单**（`app/plugins/` 下）：

| 插件文件                      | 注册的服务                                       |
| ----------------------------- | ------------------------------------------------ |
| `menu.provider.ts`            | `MenuService`                                    |
| `feature-flag.provider.ts`    | `FeatureFlagService`                             |
| `global-services.provider.ts` | `RouterService`、`StorageService`、`UserService` |

**页面级服务判定特征**：

| 特征                                   | 示例                                     |
| -------------------------------------- | ---------------------------------------- |
| 仅该页面使用，包含页面专属的 CRUD 操作 | `UserService`（sakai 层）、`DeptService` |
| 包含页面 UI 状态（分页、弹窗、选中行） | `UserMgrService`、`DeptMgrService`       |
| 页面级数据缓存，不同页面不共享         | `DictService`、`RoleService`             |

**常见反模式**（禁止）：

```
❌ 创建了 @Injectable() 服务但忘记在任何地方调用 declareXXX()
   → 运行时错误：No matching binding found for token: XxxService

❌ 被 composable 引用的服务只注册在某个页面中
   → 其他页面调用该 composable 时报错

❌ 在多个页面重复 declareProviders 同一个全局服务
   → 每次创建新实例，状态不共享，且浪费内存
```

**新服务创建检查清单**：

- [ ] 确认服务作用域（全局 / 页面 / 组件）
- [ ] 在正确位置调用 `declareXXX()`
- [ ] 若为全局服务，确认已在 `app/plugins/*.provider.ts` 中注册
- [ ] `@Injectable()` 装饰器已添加
- [ ] `@Inject()` 依赖的其他服务已在该作用域或更高级别注册

#### 页面入口绑定（推荐模式）

```
layers/sakai/app/pages/demo/pages/crud/problem-mgr.vue  ← 页面入口
  └─ declareProviders([ProblemService, ProblemMgrService])
       └─ ProblemMgr.vue  ← 组件（只消费，不绑定）
            └─ const mgr = useService(ProblemMgrService)
```

- **页面维度服务**：在页面入口 `.vue` 文件中调用 `declareProviders()`，整个页面树共享
- **组件自身服务**：仅该组件使用的弹窗等服务，在组件自身调用 `declareProviders()`
- `declareProviders` 在同一 `setup` 中只能调用一次，且**必须放在最顶部**

### 组件与服务分工模式

> 适用于**复杂组件**（含大量状态和业务逻辑的页面级组件）。简单组件无需创建专属服务。

核心原则：**组件的所有状态和处理状态的逻辑，全部转移到服务中维护。组件只做 UI 消费。**

#### 服务负责（全部移入）

- 组件所有响应式状态（`ref`、`reactive`、`computed`）
- 所有业务逻辑方法（数据加载、搜索、分页、排序、CRUD 操作等）
- 工具函数（格式化、映射、校验等纯函数）
- 子组件的显隐/编辑状态（`dialogVisible`、`editData` 等）

服务通过 `@Injectable()` 装饰，类属性天然被 `use-vue-service` 转为响应式，组件模板直接消费。

#### 组件保留（仅 UI 粘合层）

| 保留项          | 说明                             | 示例                                      |
| --------------- | -------------------------------- | ----------------------------------------- |
| 模板引用 `ref`  | PrimeVue 组件实例引用            | `const dt = ref()` 调用 `dt.exportCSV()`  |
| Composition API | toast、确认框等 UI 反馈          | `const toast = useToast()`                |
| 生命周期钩子    | 初始化触发服务                   | `onMounted(() => mgr.loadProblems())`     |
| 复杂事件包装    | 需要协调服务调用 + UI 反馈的场景 | 保存后既调 `mgr.onSaved()` 又显示 toast   |
| Props 处理      | `watch(props, ...)` 同步服务状态 | 弹窗组件通过 prop 初始化服务中的编辑数据  |
| Emit 处理       | 自定义事件转发                   | 子组件 `@confirm` → 包装函数调服务 + emit |

#### 两种事件绑定模式

```
直接绑定（大多数场景）：
  模板: @click="mgr.openNew"
  服务: openNew() { this.formDialogVisible = true; }

包装绑定（需要 UI 反馈时）：
  模板: @saved="onSaved"
  组件: function onSaved() {
          const r = mgr.onSaved();
          toast.add({ detail: r.isEdit ? '已更新' : '已创建' });
        }
```

#### 服务分层约定

复杂功能的服务应**按职责拆分**，而非堆在一个文件：

| 服务类型     | 命名约定        | 示例                                    | 复用范围      |
| ------------ | --------------- | --------------------------------------- | ------------- |
| 数据服务     | `XxxService`    | `ProblemService`（CRUD + 查询）         | 跨页面/跨组件 |
| 页面状态服务 | `XxxMgrService` | `ProblemMgrService`（分页、弹窗、选中） | 单页面        |

- 数据服务不含 UI 状态（分页、弹窗等），保持纯数据层
- 页面状态服务通过 `@Inject()` 注入数据服务，编排数据流

---

## 五、代码质量工具

- **ESLint** — 通过 `@nuxt/eslint` 模块集成
- **Prettier** — 已配置，含 Tailwind CSS 排序插件和 import 排序插件
- **TypeScript 类型检查** — 通过 `vue-tsc` 严格检查，**每次生成/修改代码后必须执行**
- **Git Hooks** — Husky + lint-staged，提交前自动检查
- **Commitizen** — 规范化提交信息（`pnpm commit`）
- **Changeset** — 版本管理和发布

### TypeScript 类型检查（强制）

> ⚠️ **重要**：Nuxt 自动导入 + `skipLibCheck` 导致 IDE 的 LSP 无法可靠检测所有类型错误。必须通过 `vue-tsc` 命令行执行完整类型检查。

- **每次生成或修改 `.vue` / `.ts` 文件后**，必须运行：
  ```bash
  pnpm typecheck
  ```
- 该命令等价于 `vue-tsc --noEmit -p .nuxt/tsconfig.app.json`，不可省略 `-p` 参数
- 类型检查通过后（exit code 0）才能视为任务完成
- 常见漏检场景：
  - 服务类（`app/services/`）未 import 就在组件中使用
  - `reactive()` 对象缺失运行时动态添加的属性声明
  - `vue-router` 版本差异导致的类型不匹配
  - 函数参数缺少类型标注导致隐式 `any`

---

## 六、常用命令

| 命令             | 用途                |
| ---------------- | ------------------- |
| `pnpm dev`       | 启动开发服务器      |
| `pnpm build`     | 构建生产版本        |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint:fix`  | 修复 lint 问题      |
| `pnpm commit`    | 规范化提交          |
| `pnpm analyze`   | 构建分析            |

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

### PrimeDataTable 注意事项

- `scrollable` 启用后，PrimeVue 内部 DOM 结构无法实现页面级 sticky 表头，不要用 CSS `position: sticky` 强行覆盖

---

## 八、调试与截图规范

### Playwright 临时文件

使用 Playwright 进行页面验证时，产生的临时文件（截图、控制台日志、页面快照等）**必须**存放于 `.playwright-mcp/` 目录中，**禁止**直接放在项目根目录。

- 截图文件：`.playwright-mcp/*.png`
- 控制台日志：`.playwright-mcp/console-*.log`
- 页面快照：`.playwright-mcp/page-*.yml`

> `.playwright-mcp/` 已加入 `.gitignore`，不会被提交到版本库。
