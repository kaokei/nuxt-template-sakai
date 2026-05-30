# 素材管理工具实现计划

> 日期：2026-05-30 | 基于设计文档：`docs/superpowers/specs/2026-05-30-asset-management-design.md`

---

## 文件结构映射

### 新建文件

```
layers/sakai/app/
├── types/asset.ts                                   # 类型定义（1 个文件）
├── services/
│   ├── SceneService.ts                              # 场景数据服务
│   ├── SceneMgrService.ts                           # 场景 UI 状态服务
│   ├── AssetService.ts                              # 素材数据服务
│   └── AssetMgrService.ts                           # 素材 UI 状态服务
├── components/views/pages/asset/
│   ├── SceneFormDialog.vue                          # 场景表单弹窗
│   ├── SceneDeleteDialog.vue                        # 场景删除弹窗
│   ├── AssetFormDialog.vue                          # 素材表单弹窗
│   ├── AssetBatchUploadDialog.vue                   # 批量上传弹窗
│   ├── AssetPreviewDialog.vue                       # 素材预览弹窗
│   └── AssetDeleteDialog.vue                        # 素材删除弹窗
└── pages/demo/system/asset/
    ├── index.vue                                    # 场景列表页
    └── [sceneId].vue                                # 素材管理页

app/components/common/
└── TagInput.vue                                     # 标签输入组件

mocks/
├── data/
│   ├── buckets.ts                                   # 桶模拟数据
│   ├── scenes.ts                                    # 场景模拟数据
│   └── assets.ts                                    # 素材模拟数据
└── handlers/
    ├── buckets.ts                                   # 桶 API mock
    ├── scenes.ts                                    # 场景 API mock
    └── assets.ts                                    # 素材 API mock
```

### 修改文件

```
app/config/menu/system-menu.ts                       # 新增素材管理菜单项
mocks/handlers/index.ts                              # 注册新 handler
```

---

## 任务分解

### 阶段一：基础层（类型 + Mock 数据 + Mock 处理器）

#### 任务 1：创建类型定义文件

**文件**：`layers/sakai/app/types/asset.ts`（新建）

**内容**：

- `Bucket` 接口（id, name, region?）
- `Scene` 接口（id, name, bucketId, description?, assetCount, createdAt, updatedAt）
- `Asset` 接口（id, fileName, title?, description?, tags[], fileSize, mimeType, md5, behavior, sceneId, url, createdAt, updatedAt）
- `AssetQuery` 接口（keyword?, tags?, mimeCategory?）
- `MediaBehavior` 类型（'inline' | 'attachment'）
- `MimeCategory` 类型（'image' | 'document' | 'archive' | 'video' | 'audio' | 'other'）

**验证**：文件无 TypeScript 语法错误

---

#### 任务 2：创建 Mock 模拟数据

**文件**：`mocks/data/buckets.ts`、`mocks/data/scenes.ts`、`mocks/data/assets.ts`（新建）

**buckets.ts**：

- 2 个预置桶：`my-cdn-prod`（华东1）、`my-cdn-test`（华北2）

**scenes.ts**：

- 3 个预置场景：App发布（bucket-001）、活动素材（bucket-001）、官网资源（bucket-002）
- 每个场景带 assetCount 字段和合理时间戳

**assets.ts**：

- 每个场景 3-4 条素材，覆盖 apk、png、pdf、mp4、zip、html 等类型
- 混合 inline 和 attachment 行为
- 带多标签和合理元信息

**验证**：导入类型定义无报错，数据结构符合接口定义

---

#### 任务 3：创建 Mock API 处理器

**文件**：`mocks/handlers/buckets.ts`、`mocks/handlers/scenes.ts`、`mocks/handlers/assets.ts`（新建）

**buckets.ts**：

- `GET /api/oss/buckets` → 返回桶列表

**scenes.ts**：

- `GET /api/scenes` → 返回场景列表
- `POST /api/scenes` → 创建场景（接收 name, bucketId, description，自动生成 id 和时间戳）
- `PUT /api/scenes/:id` → 更新场景（bucketId 只读不更新）
- `DELETE /api/scenes/:id` → 删除场景

**assets.ts**：

- `GET /api/scenes/:sceneId/assets` → 返回场景下素材列表（支持 keyword/tags/mimeCategory 查询）
- `POST /api/scenes/:sceneId/assets` → 单文件上传（从 FormData 提取字段，模拟生成链接/MD5/大小）
- `POST /api/scenes/:sceneId/assets/batch` → 批量上传
- `PUT /api/scenes/:sceneId/assets/:id` → 更新素材
- `DELETE /api/scenes/:sceneId/assets/:id` → 删除素材
- `POST /api/scenes/:sceneId/assets/batch-delete` → 批量删除
- `GET /api/scenes/:sceneId/assets/tags` → 返回该场景下所有已用标签

**验证**：Mock handler 语法正确，能编译通过

---

### 阶段二：服务层

#### 任务 4：创建 SceneService

**文件**：`layers/sakai/app/services/SceneService.ts`（新建）

**内容**：遵循 `ShortLinkService` 模式，`@Injectable()` 装饰

- `list()` → `GET /api/scenes`
- `create(data)` → `POST /api/scenes`
- `update(id, data)` → `PUT /api/scenes/:id`
- `delete(id)` → `DELETE /api/scenes/:id`

**验证**：类型正确，方法签名匹配接口设计

---

#### 任务 5：创建 SceneMgrService

**文件**：`layers/sakai/app/services/SceneMgrService.ts`（新建）

**内容**：遵循 `ShortLinkMgrService` 模式，`@Injectable()` 装饰，`@Inject(SceneService)`

- 状态：`scenes: Scene[]`、`loading`、`formDialogVisible`、`editData`、`isEdit`、`deleteDialogVisible`、`deleteTarget`
- 方法：`loadScenes()`、`openNew()`、`openEdit(scene)`、`onFormSaved()`、`confirmDelete(scene)`、`onDeleteConfirm()`

**验证**：所有属性响应式，方法逻辑正确

---

#### 任务 6：创建 AssetService

**文件**：`layers/sakai/app/services/AssetService.ts`（新建）

**内容**：遵循项目模式

- `list(sceneId, query?)` → `GET /api/scenes/:sceneId/assets`
- `create(sceneId, file, data)` → `POST /api/scenes/:sceneId/assets`（FormData）
- `batchCreate(sceneId, files, data)` → `POST /api/scenes/:sceneId/assets/batch`
- `update(sceneId, id, data)` → `PUT /api/scenes/:sceneId/assets/:id`
- `delete(sceneId, id)` → `DELETE /api/scenes/:sceneId/assets/:id`
- `batchDelete(sceneId, ids)` → `POST /api/scenes/:sceneId/assets/batch-delete`
- `getTags(sceneId)` → `GET /api/scenes/:sceneId/assets/tags`

**验证**：类型正确，FormData 组装逻辑正确

---

#### 任务 7：创建 AssetMgrService

**文件**：`layers/sakai/app/services/AssetMgrService.ts`（新建）

**内容**：遵循项目模式，`@Inject(AssetService)`

- 状态：`assets[]`、`loading`、`searchQuery`、`selectedAssets[]`、`allTags[]`、`activeMimeCategory`、`currentSceneId`
- 弹窗状态：`formDialogVisible`、`editData`、`isEdit`、`deleteDialogVisible`、`deleteTarget`、`batchUploadDialogVisible`、`previewDialogVisible`、`previewData`
- 方法：
  - `loadAssets(sceneId)` — 加载素材列表 + 标签
  - `onSearch(query)` — 搜索
  - `onReset()` — 重置搜索
  - `onMimeTabChange(category)` — 类型 Tab 切换
  - `openUpload()` / `openEdit(asset)` — 表单弹窗
  - `onFormSaved()` — 表单保存后刷新
  - `confirmDelete(asset)` / `onDeleteConfirm()` — 删除
  - `openBatchUpload()` — 批量上传弹窗
  - `onBatchUploaded(count)` — 批量上传完成
  - `openPreview(asset)` — 预览弹窗
  - `getMimeCategory(mimeType)` — MIME → 分类映射
  - `getBehaviorLabel(behavior)` — 行为 → 中文标签

**验证**：所有属性响应式，方法逻辑完整

---

### 阶段三：共享组件

#### 任务 8：创建 TagInput 组件

**文件**：`app/components/common/TagInput.vue`（新建）

**内容**：

- 输入框 + 下拉自动补全（已有标签建议）
- 已选标签展示为 Chip（可点击 × 移除）
- Props：`modelValue: string[]`、`suggestions: string[]`（可选）
- Emit：`update:modelValue`
- 样式：PrimeVue Chip + InputText，Tailwind 间距
- 输入逗号或回车时创建新标签

**验证**：能添加/删除标签，自动补全弹出

---

### 阶段四：弹窗组件

#### 任务 9：创建 SceneFormDialog

**文件**：`layers/sakai/app/components/views/pages/asset/SceneFormDialog.vue`（新建）

**内容**：参考 `ShortLinkFormDialog` 模式

- Props：`visible: boolean`、`editData: Scene | null`、`isEdit: boolean`
- Emit：`update:visible`、`saved`
- 表单字段：场景名称（InputText）、存储桶（Select，新建时可选编辑时只读）、描述（Textarea）
- 存储桶选项：从 `SceneMgrService` 获取（需要在 MgrService 中加 `loadBuckets()` 和 `buckets` 状态）
- 校验：名称必填

**关联修改**：`SceneMgrService` 增加 `buckets: Bucket[]` 和 `loadBuckets()` 方法，`SceneService` 增加 `getBuckets()` 方法

**验证**：表单校验、新建/编辑模式切换、提交 emit

---

#### 任务 10：创建 SceneDeleteDialog

**文件**：`layers/sakai/app/components/views/pages/asset/SceneDeleteDialog.vue`（新建）

**内容**：参考 `ShortLinkDeleteDialog` 模式

- Props：`visible: boolean`、`scene: Scene | null`
- Emit：`update:visible`、`confirm`
- 展示场景名称和素材数量警告

**验证**：确认/取消按钮行为正确

---

#### 任务 11：创建 AssetFormDialog

**文件**：`layers/sakai/app/components/views/pages/asset/AssetFormDialog.vue`（新建）

**内容**：参考 `ShortLinkFormDialog` 模式，但含文件上传区域

- Props：`visible`、`editData`、`isEdit`、`existingTags: string[]`（用于自动补全）
- Emit：`update:visible`、`saved`
- 表单字段：文件选择（拖拽/点击区域，编辑模式隐藏）、文件名（只读）、标题、描述、标签（TagInput）、浏览器行为（RadioButtonGroup: inline/attachment）
- 自动获取信息区域（只读）：文件大小、MIME 类型、MD5（上传后展示）
- 文件大小限制：50MB 前端校验
- 浏览器行为默认值：可预览 MIME 默认 inline，其余默认 attachment

**验证**：文件选择、表单校验、inline/attachment 切换、上传 emit

---

#### 任务 12：创建 AssetBatchUploadDialog

**文件**：`layers/sakai/app/components/views/pages/asset/AssetBatchUploadDialog.vue`（新建）

**内容**：

- Props：`visible`、`existingTags`
- Emit：`update:visible`、`uploaded(count: number)`
- 文件多选区域（拖拽/点击）
- 已选文件列表表格（文件名、大小、状态图标）
- 统一标签和统一浏览器行为设置
- 上传进度反馈（Toast）

**验证**：多文件选择、统一设置应用、批量上传 emit

---

#### 任务 13：创建 AssetPreviewDialog

**文件**：`layers/sakai/app/components/views/pages/asset/AssetPreviewDialog.vue`（新建）

**内容**：

- Props：`visible`、`asset: Asset | null`
- Emit：`update:visible`
- 可预览类型（image/_, video/_, audio/_, application/pdf, text/_）：`<img>` / `<video>` / `<audio>` / `<iframe>` 直接嵌入
- 不可预览类型：文件图标 + MIME 类型 +「打开原文件」按钮
- 底部：唯一链接文本 + 复制按钮（`copy-to-clipboard`）

**验证**：各类型预览正确切换，复制链接功能正常

---

#### 任务 14：创建 AssetDeleteDialog

**文件**：`layers/sakai/app/components/views/pages/asset/AssetDeleteDialog.vue`（新建）

**内容**：参考 `ShortLinkDeleteDialog` 模式

- Props：`visible`、`asset: Asset | null`、`count: number`（批量时）
- Emit：`update:visible`、`confirm`
- 单个删除展示文件名，批量删除展示数量

**验证**：单个/批量两种模式正常

---

### 阶段五：页面

#### 任务 15：创建场景列表页

**文件**：`layers/sakai/app/pages/demo/system/asset/index.vue`（新建）

**内容**：参考 `short-link/index.vue` 模式

- `declareProviders([SceneService, SceneMgrService])`
- 页面 meta：`layout: 'sakai-sidebar'`、`title: '素材管理'`
- 搜索栏：场景名称关键词搜索
- 工具栏：「+新建场景」
- PrimeDataTable：场景名称（可点击跳转）、描述、素材数量、创建时间、操作列（编辑、删除）
- 弹窗引用：SceneFormDialog、SceneDeleteDialog
- 生命周期：`onMounted` 加载场景列表
- Toast 反馈：创建/编辑/删除成功

**验证**：场景列表渲染、新建/编辑/删除流程完整、路由跳转正确

---

#### 任务 16：创建素材管理页

**文件**：`layers/sakai/app/pages/demo/system/asset/[sceneId].vue`（新建）

**内容**：参考 `short-link/index.vue` 模式

- `declareProviders([AssetService, AssetMgrService])`
- 页面 meta：`layout: 'sakai-sidebar'`
- 场景切换器（Select 下拉）：列出所有场景，切换触发路由变化
- 搜索栏：关键词 + 标签筛选 + 类型 Tab
- 工具栏：「+上传素材」「批量上传」「批量删除」「导出CSV」
- PrimeDataTable（多选）：复选框、文件名、标题、大小、类型、行为图标、标签、操作列（复制链接、预览/下载、编辑、删除）
- 行为列：inline 显示 👁 图标，attachment 显示 ⬇ 图标
- 操作列：复制链接按钮（`copy-to-clipboard` + Toast）
- 弹窗引用：AssetFormDialog、AssetBatchUploadDialog、AssetPreviewDialog、AssetDeleteDialog
- 生命周期：`onMounted` 根据 `route.params.sceneId` 加载素材
- `watch(route.params.sceneId)` → 场景切换时刷新列表
- Toast 反馈：上传/编辑/删除/复制

**验证**：素材列表渲染、场景切换刷新、搜索筛选、全部 CRUD 流程

---

### 阶段六：集成

#### 任务 17：注册菜单项

**文件**：`app/config/menu/system-menu.ts`（修改）

**内容**：在系统管理菜单中新增素材管理条目

```typescript
{
  label: '素材管理',
  icon: 'pi pi-fw pi-folder-open',
  to: '/demo/system/asset',
},
```

**验证**：菜单显示正确，点击跳转到场景列表页

---

#### 任务 18：注册 Mock 处理器

**文件**：`mocks/handlers/index.ts`（修改）

**内容**：导入并注册 buckets、scenes、assets 三个 handler 模块

**验证**：开发服务器启动后 MSW 正常拦截 API

---

#### 任务 19：类型检查与格式化

**命令**：

1. `pnpm typecheck` — 确保无类型错误
2. `pnpm lint:fix` — 代码格式化

**验证**：typecheck exit 0，lint 无报错

---

## 依赖关系

```
任务 1 (类型) ─────────────────────────────────────────────┐
    ↓                                                       │
任务 2 (Mock 数据) ──→ 任务 3 (Mock 处理器)                  │
    ↓                      ↓                                │
任务 4 (SceneService) → 任务 5 (SceneMgrService)            │
任务 6 (AssetService) → 任务 7 (AssetMgrService)            │
    ↓                      ↓                                │
任务 8 (TagInput) ────────────────────────────────────────┐ │
    ↓                                                      │ │
任务 9 (SceneFormDialog) ──→ 同时可做                      │ │
任务 10 (SceneDeleteDialog) ──→ 同时可做                   │ │
任务 11 (AssetFormDialog) ──→ 同时可做                     │ │
任务 12 (AssetBatchUploadDialog) ──→ 同时可做              │ │
任务 13 (AssetPreviewDialog) ──→ 同时可做                  │ │
任务 14 (AssetDeleteDialog) ──→ 同时可做                   │ │
    ↓                                                      │ │
任务 15 (场景列表页) ──→ 依赖 4/5/9/10                    │ │
任务 16 (素材管理页) ──→ 依赖 6/7/8/11/12/13/14          ←┘
    ↓
任务 17 (菜单) + 任务 18 (Mock 注册) ──→ 任务 19 (typecheck + lint)
```

---

## 并行执行建议

以下任务组可完全并行（无相互依赖）：

- **组 A**：任务 9 + 任务 10（场景弹窗，依赖 4/5）
- **组 B**：任务 11 + 任务 12 + 任务 13 + 任务 14（素材弹窗，依赖 6/7/8）
- **组 C**：任务 17 + 任务 18（修改现有文件，独立操作）

任务 15 依赖组 A 完成，任务 16 依赖组 B 完成，两者之间无依赖可并行。
