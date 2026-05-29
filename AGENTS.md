# Nuxt 模板项目 — 开发规范

> 以下规范适用于本项目所有 AI Agent 和开发人员。
> **每次开发新需求前，先通读本文档即可快速了解项目全貌，无需从头探索代码库。**

---

## 零、项目总览（一页纸）

```
Nuxt 4.x (SPA) + Vue 3 + PrimeVue 4.x + Tailwind CSS 4.x + DI + MSW Mock

启动: pnpm dev         类型检查: pnpm typecheck
测试: pnpm vitest      构建: pnpm build
代码规范(必读): 本文档 → 四、依赖注入 → 三.组件与服务分工模式

路由: 全部页面在 layers/sakai/app/pages/demo/ 下
       app/pages/ 只有 index.vue 和 test.vue（占位页）
组件: PrimeVue 前缀 Prime (如 <PrimeButton>)，sakai 层组件需显式 import
服务: @Injectable() + declareProviders() 显式注册，MgrService 管状态，Service 管数据
Mock: 所有 API 由 MSW 拦截，数据在 mocks/ 目录
```

---

## 一、技术栈概览

| 技术         | 版本/说明                                                       |
| ------------ | --------------------------------------------------------------- |
| **框架**     | Nuxt 4.x，**SPA 模式**（`ssr: false`）                          |
| **Node.js**  | 22.19.0（见 `.nvmrc`）                                          |
| **包管理器** | pnpm 9.9.0+（`engine-strict=true`，禁止 npm/yarn）              |
| **语言**     | TypeScript 6.x，Vue 3 Composition API + `<script setup>`        |
| **样式**     | Tailwind CSS 4.x（通过 `@tailwindcss/vite` 插件，非 Nuxt 模块） |
| **UI 框架**  | PrimeVue 4.x（`@primevue/nuxt-module`，组件前缀 `Prime`）       |
| **图标**     | `@nuxt/icon`（组件名 `<NuxtIcon>`）+ PrimeIcons（`pi pi-xxx`）  |
| **依赖注入** | `@kaokei/di` + `@kaokei/use-vue-service`                        |
| **Mock**     | MSW 2.x（`msw/browser`），开发时自动拦截所有 API                |
| **测试**     | Vitest 4.x                                                      |
| **图表**     | Chart.js 4.x                                                    |
| **工具库**   | @vueuse/core、lodash-es、nanoid、xlsx、qrcode、mitt             |

---

## 二、目录结构约定

### 项目根目录

```
├── app/                    # Nuxt 4 主应用目录
│   ├── pages/              # 路由页面（极少，仅 index.vue 和 test.vue）
│   ├── layouts/            # 默认布局（default.vue，仅 <slot />）
│   ├── components/         # 自动导入的组件目录
│   │   ├── base/           # 业务无关组件（CopyButton、TempVariable）
│   │   ├── common/         # 跨页面共享业务组件（Picker 系列）
│   │   └── features/       # 页面入口组件（⚠️ 当前为空，仅 .gitkeep）
│   ├── composables/        # 组合式函数（Nuxt 自动导入，以 use- 命名）
│   ├── services/           # 全局服务类（DI 注册在 app/plugins/*.provider.ts）
│   ├── config/menu/        # 菜单配置（system-menu、workbench-menu、showcase-menu）
│   ├── plugins/            # Nuxt 插件（provider 注册、指令注册、MSW 启动）
│   ├── middleware/         # 路由中间件（auth.ts）
│   ├── directives/         # 自定义指令（v-permission、focus）
│   ├── types/              # TS 类型定义（auth、user、menu 等 12 个文件）
│   ├── utils/              # 工具函数（Nuxt 自动导入）
│   └── assets/             # 静态资源（css/、icons/）
├── layers/sakai/           # Sakai UI 层（Nuxt Layer）
│   ├── app/
│   │   ├── pages/demo/     # ★ 所有业务页面在这里（system/、workbench/、showcase/、auth/、notices/）
│   │   ├── components/     # ★ 所有 UI 组件在这里（layout/、views/、dashboard/、landing/）
│   │   ├── services/       # ★ 页面级服务（49 个：UserService、UserMgrService 等）
│   │   ├── layouts/        # 4 种布局（sakai-sidebar、sakai-topnav、sakai-mix、sakai-consumer）
│   │   └── types/          # sakai 层类型（short-link.ts）
│   └── nuxt.config.ts      # 定义 @sakai 别名
├── mocks/                  # MSW 模拟数据
│   ├── browser.ts          # MSW worker 入口
│   ├── handlers/           # 请求处理器（24 个模块，对应所有 API）
│   └── data/               # 模拟数据（23 个模块）
├── tests/                  # Vitest 测试（2 个测试文件）
├── docs/                   # 项目文档（changeset、rbac-gap-analysis 等）
├── nuxt.config.ts          # 主 Nuxt 配置
├── .nvmrc                  # Node 版本：22.19.0
├── .npmrc                  # pnpm 配置 + npm 镜像（npmmirror.com）
└── eslint.config.mjs       # ESLint 配置（基于 @nuxt/eslint）
```

### Sakai Layer 详细结构

```
layers/sakai/app/
├── pages/demo/
│   ├── index.vue                 # /demo → 重定向到 /demo/workbench/workplace
│   ├── auth/login.vue            # 登录页（/demo/auth/login）
│   ├── notices/                  # 通知中心（[id].vue, index.vue）
│   ├── system/                   # 系统管理（14 个子模块：user、role、menu、dept、post、dict、sys-param、feature-flag、area-code、job、backup、short-link、notify/、monitor/）
│   ├── workbench/                # 工作台（analysis/、workplace/）
│   └── showcase/                 # 展示页（auth/、blocks/、dashboard/、landing/、pages/、start/、uikit/）
├── components/
│   ├── layout/                   # 布局组件（AppLayout、AppSidebar、AppTopbar、AppMenu 等）
│   │   └── composables/layout.js # 布局状态管理（非 DI，用普通 composable）
│   ├── views/                    # 页面视图组件
│   │   ├── Dashboard.vue         # 仪表盘
│   │   └── pages/                # 各页面的具体实现组件（user-mgr/、dept-mgr/ 等 31 个目录/文件）
│   ├── dashboard/                # 仪表盘 Widget 组件（7 个）
│   ├── landing/                  # 着陆页组件
│   ├── BlockViewer.vue           # 代码块查看器
│   └── FloatingConfigurator.vue  # 浮动配置面板
├── services/                     # 页面级服务（49 个，XxxService + XxxMgrService 配对）
└── layouts/                      # 4 种布局（sakai-sidebar 为默认）
```

### 页面 → 服务 → 组件映射示例

```
layers/sakai/app/pages/demo/system/user/index.vue  ← 页面入口
  ├─ declareProviders([UserService, UserMgrService, DeptService, PostService])
  ├─ const mgr = useService(UserMgrService)          ← 消费 MgrService
  │
  ├─ <UserSearchBar @search="mgr.onSearch" />        ← 组件通过事件通信
  ├─ <PrimeDataTable v-model:selection="mgr.selectedUsers" ... />
  ├─ <UserFormDialog ... @saved="onSaved" />         ← 弹窗组件
  └─ <UserDeleteDialog ... @confirm="onDeleteConfirm" />
```

---

## 三、编码规范

### Vue 组件

- 使用 `<script lang="ts" setup>` 语法
- 支持 `.vue` 和 `.tsx` 两种组件格式
- 模板中使用 Nuxt 自动导入，无需手动 import `ref`、`computed`、`useRoute` 等
- SEO 元信息使用 `useSeoMeta()` composable（如 `useSeoMeta({ title: '用户管理' })`）

### TypeScript

- 严格模式，类型定义放在 `app/types/` 或 `layers/sakai/app/types/`
- 变量名、函数名使用英文，注释使用中文
- 允许 `any` 类型（ESLint 已关闭 `@typescript-eslint/no-explicit-any`）
- 未使用变量不报错（ESLint 已关闭 `@typescript-eslint/no-unused-vars`）
- `@typescript-eslint/no-explicit-any` 和 `no-unused-vars` 已关闭

### 样式

- 优先使用 Tailwind CSS 工具类
- 全局样式入口：`app/assets/css/main.css`
- 支持 SCSS（已安装 `sass`）
- HTML lang 属性设置为 `zh-CN`

### 组件注册

- `app/components/` 下 `base`、`common`、`features` 三个目录配置了 `pathPrefix: false`
- 组件直接以文件名注册：`base/button/CopyButton.vue` → `<CopyButton />`
- `app/components/features/` 当前为空，新页面入口组件应放此处或 sakai 层 `views/pages/`

### Sakai Layer 组件的导入限制 ⚠️

- `nuxt.config.ts` 仅对 `app/components/` 下的 `base`、`common`、`features` 三个目录配置了自动导入
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
- DI 装饰器和 API（`@Injectable`、`useService`、`declareProviders` 等）自动可用

---

## 四、依赖注入

- 项目使用 `@kaokei/di` + `@kaokei/use-vue-service` 进行服务层依赖注入
- **自动导入**：`@kaokei/nuxt-use-vue-service` 模块已配置，以下 API 全局可用，**禁止手动 import**：
  - 核心 API：`useService`、`useRootService`、`useAppService`
  - 装饰器：`Injectable`、`Inject`、`Self`、`SkipSelf`、`Optional`、`PostConstruct`、`PreDestroy`
  - Provider：`declareProviders`、`declareRootProviders`、`declareAppProviders`
  - 其他：`Computed`、`Raw`、`autobind`、`Token`、`LazyInject` 等
- `全局服务类` 或者 `通用服务类` 放在 `app/services/` 目录
- `页面级服务` 放在 `layers/sakai/app/services/` 目录
- 新建服务时遵循该模式，不要引入其他 DI 方案

### 服务 Provider 绑定规则

**所有服务都必须显式绑定，不存在自动发现机制**。`@Injectable()` 只是标记类可被 DI 系统识别，不会自动注册到容器。

通过 `declareXXX()` 方法绑定服务，按作用域分为三层：

| 绑定方法                          | 作用域          | 绑定位置                                      | 示例                                              |
| --------------------------------- | --------------- | --------------------------------------------- | ------------------------------------------------- |
| `declareProviders([...])`         | 页面级 / 组件级 | **页面入口文件**（首选）或组件自身            | `declareProviders([UserService, UserMgrService])` |
| `declareAppProviders([...], app)` | App 级          | Nuxt 插件（通过 `declareAppProvidersPlugin`） | 主题服务、应用级状态                              |
| `declareRootProviders([...])`     | 全局级          | Nuxt 插件                                     | 日志、全局配置等单例服务                          |

#### 作用域判定流程

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

#### 当前已注册的全局服务清单

| 插件文件                                    | 注册的服务                                       |
| ------------------------------------------- | ------------------------------------------------ |
| `app/plugins/global-services.provider.ts`   | `RouterService`、`StorageService`、`UserService` |
| `app/plugins/auth.provider.ts`              | `AuthService`                                    |
| `app/plugins/menu.provider.ts`              | `MenuService`                                    |
| `app/plugins/feature-flag.provider.ts`      | `FeatureFlagService`                             |
| `app/plugins/user-notification.provider.ts` | `UserNotificationService`                        |

**全局服务说明**：

- `UserService`（`app/services/user.service.ts`）：全局用户状态（登录/登出/用户信息），**与 sakai 层的 `UserService` 不同**
- `AuthService`：登录认证（token 管理、权限获取），被 `auth.ts` 中间件和 `use-permission.ts` 引用
- `MenuService`：菜单系统（多系统注册、路由匹配、权限过滤）
- `RouterService`：封装 `useRouter()`，提供命令式路由跳转
- `StorageService`：封装 `localStorage` 操作
- `FeatureFlagService`：功能开关管理
- `UserNotificationService`：用户通知管理

#### 页面级服务判定特征

| 特征                                   | 示例                                     |
| -------------------------------------- | ---------------------------------------- |
| 仅该页面使用，包含页面专属的 CRUD 操作 | `UserService`（sakai 层）、`DeptService` |
| 包含页面 UI 状态（分页、弹窗、选中行） | `UserMgrService`、`DeptMgrService`       |
| 页面级数据缓存，不同页面不共享         | `DictService`、`RoleService`             |

#### 常见反模式（禁止）

```
❌ 创建了 @Injectable() 服务但忘记在任何地方调用 declareXXX()
   → 运行时错误：No matching binding found for token: XxxService

❌ 被 composable 引用的服务只注册在某个页面中
   → 其他页面调用该 composable 时报错

❌ 在多个页面重复 declareProviders 同一个全局服务
   → 每次创建新实例，状态不共享，且浪费内存
```

### 组件与服务分工模式

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
| 生命周期钩子    | 初始化触发服务                   | `onMounted(() => mgr.loadUsers())`        |
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
          const result = mgr.onSaved();
          toast.add({ detail: result.isEdit ? '已更新' : '已创建' });
        }
```

#### 服务分层约定

复杂功能的服务应**按职责拆分**，而非堆在一个文件：

| 服务类型     | 命名约定        | 示例                                 | 复用范围      |
| ------------ | --------------- | ------------------------------------ | ------------- |
| 数据服务     | `XxxService`    | `UserService`（CRUD + 查询）         | 跨页面/跨组件 |
| 页面状态服务 | `XxxMgrService` | `UserMgrService`（分页、弹窗、选中） | 单页面        |

---

## 五、路由与页面架构

### 路由总览

- 路由基础路径：`/demo/`
- 所有业务页面位于 `layers/sakai/app/pages/demo/`
- `app/pages/` 下只有 `index.vue`（首页占位）和 `test.vue`（测试页）

### 页面路由表（关键路由）

| 路由                        | 页面文件                                   | 布局                                |
| --------------------------- | ------------------------------------------ | ----------------------------------- |
| `/demo`                     | `pages/demo/index.vue`                     | sakai-sidebar（重定向到 workplace） |
| `/demo/auth/login`          | `pages/demo/auth/login.vue`                | false（无布局）                     |
| `/demo/workbench/workplace` | `pages/demo/workbench/workplace/index.vue` | sakai-sidebar                       |
| `/demo/workbench/analysis`  | `pages/demo/workbench/analysis/index.vue`  | sakai-sidebar                       |
| `/demo/system/user`         | `pages/demo/system/user/index.vue`         | sakai-sidebar                       |
| `/demo/system/role`         | `pages/demo/system/role/index.vue`         | sakai-sidebar                       |
| `/demo/system/menu`         | `pages/demo/system/menu/index.vue`         | sakai-sidebar                       |
| `/demo/system/dept`         | `pages/demo/system/dept/index.vue`         | sakai-sidebar                       |
| `/demo/system/dict`         | `pages/demo/system/dict/index.vue`         | sakai-sidebar                       |
| `/demo/notices`             | `pages/demo/notices/index.vue`             | sakai-sidebar                       |
| `/demo/notices/:id`         | `pages/demo/notices/[id].vue`              | sakai-sidebar                       |
| `/demo/showcase/...`        | `pages/demo/showcase/...`                  | sakai-sidebar                       |

### 布局系统

4 种布局定义在 `layers/sakai/app/layouts/`：

- **sakai-sidebar**（默认）：左侧菜单 + 顶部导航
- **sakai-topnav**：顶部导航
- **sakai-mix**：混合布局
- **sakai-consumer**：消费者布局

页面通过 `definePageMeta({ layout: 'sakai-sidebar' })` 指定布局。

### 认证中间件

`app/middleware/auth.ts` 保护所有路由（`router.middleware: ['auth']`）：

- 未登录 → 重定向到 `/demo/auth/login`
- 认证方式：检查 `localStorage.auth_token`
- 登录页不触发重定向（避免循环）

### 权限系统

- **v-permission 指令**：`<PrimeButton v-permission="'system:user:add'" />`，无权限时移除元素
- **usePermission composable**：提供 `hasPermission`、`hasAnyPermission`、`hasAllPermissions`
- **菜单权限过滤**：`MenuService.getFilteredMenus()` 根据 `AuthService.getPermissions()` 过滤菜单

---

## 六、菜单系统

菜单配置位于 `app/config/menu/`，通过 `MenuService` 管理：

| 文件                | 系统 ID     | 说明                                   |
| ------------------- | ----------- | -------------------------------------- |
| `system-menu.ts`    | `system`    | 系统管理菜单（用户、角色、菜单...）    |
| `workbench-menu.ts` | `workbench` | 工作台菜单（工作台首页、分析页）       |
| `showcase-menu.ts`  | `showcase`  | 展示页菜单（Crud、Empty、NotFound...） |

**菜单注册流程**（`app/plugins/menu.provider.ts`）：

1. `menuService.registerSystems([systemConfig, workbenchConfig, showcaseConfig])`
2. 根据当前路由 `path` 自动匹配系统
3. `watch(route.path)` 监听路由变化自动切换

**添加新菜单**：在对应 `xxx-menu.ts` 中添加 `MenuItem`，遵循 `SystemConfig` 和 `MenuItem` 类型（`app/types/menu.ts`）。

---

## 七、MSW Mock 系统

开发环境使用 MSW（Mock Service Worker）拦截所有 API 请求：

```
mocks/
├── browser.ts              # MSW worker 入口（setupWorker）
├── handlers/
│   ├── index.ts            # 汇总所有 handler
│   ├── users.ts            # /api/users/* 的 mock handler
│   ├── auth.ts             # /api/auth/* 的 mock handler
│   ├── depts.ts            # /api/depts/* 的 mock handler
│   └── ...                 # 24 个 handler 文件
└── data/
    ├── users.ts            # 用户 mock 数据
    ├── auth.ts             # 认证 mock 数据
    └── ...                 # 23 个数据文件
```

**启动方式**：`app/plugins/msw.client.ts` 在开发环境自动启动 worker。
**添加新 Mock**：

1. 在 `mocks/data/` 添加模拟数据
2. 在 `mocks/handlers/` 添加请求处理器（遵循 MSW `http.get/post/put/delete` 模式）
3. 在 `mocks/handlers/index.ts` 中导出

**注意**：MSW 仅影响开发环境，生产构建不包含 mock 代码。

---

## 八、命令与质量检查

### 常用命令

| 命令             | 用途                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `pnpm dev`       | 启动开发服务器（`http://localhost:3000`）                            |
| `pnpm build`     | 构建生产版本                                                         |
| `pnpm typecheck` | TypeScript 类型检查（`vue-tsc --noEmit -p .nuxt/tsconfig.app.json`） |
| `pnpm lint`      | ESLint 检查                                                          |
| `pnpm lint:fix`  | ESLint 自动修复                                                      |
| `pnpm vitest`    | 运行测试                                                             |
| `pnpm analyze`   | 构建分析                                                             |
| `pnpm commit`    | Commitizen 规范化提交                                                |
| `pnpm changeset` | Changeset 版本管理                                                   |

### 开发前必须执行的检查

```bash
pnpm typecheck    # 类型检查 — 必须通过（exit 0）
pnpm lint:fix     # 代码格式化 — 必须无报错
```

### 代码质量工具

- **ESLint** — `@nuxt/eslint` 模块集成，配置见 `eslint.config.mjs`
- **Prettier** — 含 Tailwind CSS 排序插件和 import 排序插件，配置见 `.prettierrc`
- **TypeScript** — 通过 `vue-tsc` 严格检查，**每次生成/修改代码后必须执行**
- **Git Hooks** — Husky + lint-staged：
  - `pre-commit`：自动运行 lint-staged（仅格式化暂存文件）
  - `prepare-commit-msg`：交互式 Commitizen（仅在终端中触发）
- **Commitizen** — 规范化提交信息（`pnpm commit`）
- **Changeset** — 版本管理和发布

### TypeScript 类型检查（强制）

> ⚠️ **重要**：Nuxt 自动导入 + `skipLibCheck` 导致 IDE 的 LSP 无法可靠检测所有类型错误。必须通过 `vue-tsc` 命令行执行完整类型检查。

- **每次生成或修改 `.vue` / `.ts` 文件后**，必须运行 `pnpm typecheck`
- 该命令等价于 `vue-tsc --noEmit -p .nuxt/tsconfig.app.json`，不可省略 `-p` 参数
- 类型检查通过后（exit code 0）才能视为任务完成
- 常见漏检场景：服务类未 import 就在组件中使用、`reactive()` 对象缺失属性声明、函数参数缺少类型标注

---

## 九、PrimeVue 组件规范

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
- PrimeVue 组件类型（如 `DataTablePageEvent`）需要手动 import：
  ```ts
  import type {
    DataTablePageEvent,
    DataTableSortEvent,
  } from 'primevue/datatable';
  ```

### 样式定制

- 优先使用 Tailwind CSS 类名进行布局和间距调整
- 主题定制通过 PrimeVue Design Token 系统（CSS 变量以 `--p-` 为前缀）
- 需要深度定制时，使用 Pass Through（PT）机制而非直接覆盖 CSS
- CSS 层级已配置，避免使用 `!important`

### 组件选择

- 优先使用 PrimeVue 内置组件，不重复造轮子
- 表单输入组件统一使用 `filled` 变体（已全局配置）
- 图标主要使用 `@nuxt/icon` 模块（组件名 `<NuxtIcon>`）
- PrimeIcons 图标集也可使用（如 `icon="pi pi-user"`）

### PrimeDataTable 注意事项

- `scrollable` 启用后，PrimeVue 内部 DOM 结构无法实现页面级 sticky 表头，不要用 CSS `position: sticky` 强行覆盖

---

## 十、开发工作流

### 添加新页面的标准流程

1. **创建页面文件**：在 `layers/sakai/app/pages/demo/` 下创建路由页面
2. **创建服务**（如需要）：
   - `layers/sakai/app/services/NewService.ts`（数据服务）
   - `layers/sakai/app/services/NewMgrService.ts`（页面状态服务）
3. **创建组件**（如需要）：在 `layers/sakai/app/components/views/pages/new-feature/` 下创建
4. **注册服务**：在页面入口 `.vue` 顶部调用 `declareProviders([NewService, NewMgrService])`
5. **添加菜单**：在 `app/config/menu/` 对应系统菜单中添加条目
6. **添加 Mock**：在 `mocks/handlers/` 和 `mocks/data/` 添加 API mock
7. **类型检查**：运行 `pnpm typecheck`
8. **格式化**：运行 `pnpm lint:fix`

### 不熟悉的功能如何上手

```
1. 找到对应页面入口文件（如 user-mgr → pages/demo/system/user/index.vue）
2. 从入口文件的 declareProviders 了解使用了哪些服务
3. 阅读服务代码了解数据流和业务逻辑
4. 页面模板中的组件路径（如 @sakai/components/views/pages/user-mgr/）即功能实现
5. mocks/handlers/ 下有对应的 API mock，了解 API 接口格式
```

### 调试与截图规范

使用 Playwright 进行页面验证时，产生的临时文件（截图、控制台日志、页面快照等）**必须**存放于 `.playwright-mcp/` 目录中，**禁止**直接放在项目根目录。

- 截图文件：`.playwright-mcp/*.png`
- 控制台日志：`.playwright-mcp/console-*.log`
- 页面快照：`.playwright-mcp/page-*.yml`

> `.playwright-mcp/` 已加入 `.gitignore`，不会被提交到版本库。

---

## 十一、环境与配置要点

- **Node.js 版本**：22.19.0（严格匹配，见 `.nvmrc` 和 `.npmrc` 的 `engine-strict=true`）
- **包管理器**：必须使用 pnpm 9.9.0+，禁止 npm/yarn
- **npm 镜像**：使用 npmmirror.com 镜像（见 `.npmrc`）
- **构建目标**：SPA（`ssr: false`），无服务端渲染
- **TypeScript**：项目引用方式（见 `tsconfig.json`），所有 tsconfig 由 Nuxt 生成在 `.nuxt/` 下
- **实验性功能**：`decorators: true`（支持装饰器语法）、`viteEnvironmentApi: true`
- **图标方案**：
  - `@iconify-json/lucide` + `@iconify-json/uil` 两个图标集
  - 自定义图标在 `app/assets/icons/`，前缀 `local`
  - 组件名 `NuxtIcon`
