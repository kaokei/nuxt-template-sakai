# 奖状/海报模板合成工具 设计文档

> 日期：2026-05-30 | 状态：待评审 | 方案：表单参数 + Canvas 实时预览

---

## 一、需求概述

在系统管理中新增"模板合成"工具，用于创建奖状/海报模板（定义底图 + 可变文字/图片元素的位置与样式），并支持基于模板填入实际数据后通过 Canvas 实时合成并下载最终图片。

**核心场景**：

1. 模板管理员创建模板，定义哪些位置需要填入文字和图片，以及各自样式（位置、字号、颜色等）
2. 使用者选择模板，填入具体文字内容、上传图片，预览合成效果后下载

**不在本次范围**：后端批量合成、PDF 输出、多语言变体。

---

## 二、两页分离设计

### 页面职责对比

|              | 模板配置页                                       | 合成下载页                         |
| ------------ | ------------------------------------------------ | ---------------------------------- |
| **受众**     | 模板设计者（开发/运营）                          | 终端使用者（业务人员）             |
| **能力**     | 管理模板（CRUD）、调整元素位置/样式、临时预览    | 选择模板、填入数据、预览合成、下载 |
| **保存内容** | 元素参数 + bindingKey（不保存实际文字/图片内容） | 不保存任何内容，一次性使用         |
| **复杂度**   | 高                                               | 低                                 |

### 配置页的"临时预览"

配置页允许临时输入文字和上传图片，**仅用于验证模板效果**，不保存为模板数据。配置者可以直观确认"姓名两个字在这个字号和位置下确实合适"，无需跳转到合成页验证。

---

## 三、路由与文件结构

```
layers/sakai/app/
├── pages/demo/system/certificate/
│   ├── index.vue                              # 模板列表页（主页）
│   ├── [id]/
│   │   └── edit.vue                           # 模板编辑页（配置页）
│   └── compose.vue                            # 合成下载页
├── components/views/pages/certificate/
│   ├── CertificateSearchBar.vue               # 搜索栏（名称搜索、分类筛选）
│   ├── CertificateTable.vue                   # 模板表格
│   ├── CertificateDeleteDialog.vue            # 删除确认弹窗
│   ├── CertificateEditForm.vue                # 编辑页左侧配置面板（整体）
│   │   ├── BasicInfoSection.vue               #   基本信息区（名称、描述、底图URL、尺寸）
│   │   ├── TextElementItem.vue                #   单个文字元素配置行
│   │   ├── ImageElementItem.vue               #   单个图片元素配置行
│   │   └── AddElementToolbar.vue              #   添加元素按钮组
│   ├── CertificateCanvasPreview.vue           # 编辑页右侧 Canvas 预览（复用）
│   ├── ComposeInputForm.vue                   # 合成页输入表单
│   └── ComposeDownloadPanel.vue              # 合成页下载操作区
├── services/
│   ├── CertificateService.ts                  # 数据服务（模板 CRUD）
│   ├── CertificateMgrService.ts               # 列表页 UI 状态服务
│   └── CertificateEditorService.ts            # 编辑页 UI 状态服务
└── types/
    └── certificate.ts                         # 类型定义
```

Canvas 渲染逻辑（纯工具函数，Nuxt 自动导入）：

```
app/utils/
└── canvas-renderer.ts                         # Canvas 合成渲染 + 导出 Blob
```

Mock 数据：

```
mocks/
├── handlers/
│   └── certificate-templates.ts              # API 拦截处理
└── data/
    └── certificate-templates.ts              # 示例模板数据
```

---

## 四、数据模型

```typescript
// layers/sakai/app/types/certificate.ts

/** 模板实体 */
export interface CertificateTemplate {
  id: string;
  name: string; // 模板名称，如 "2024年度优秀员工奖状"
  description?: string; // 模板描述
  category?: string; // 分类：certificate（证书）/ poster（海报）
  backgroundUrl: string; // 底图 URL
  width: number; // 底图宽度（px）
  height: number; // 底图高度（px）
  elements: TemplateElement[]; // 合成元素列表
  status: 'draft' | 'published'; // 状态
  createdAt: string;
  updatedAt: string;
}

/** 合成元素（联合类型） */
export type TemplateElement = TextElement | ImageElement;

/** 文字元素 */
export interface TextElement {
  type: 'text';
  id: string; // 元素唯一 ID
  name: string; // 显示名，如 "姓名"
  x: number; // 左上角 X（相对底图，px）
  y: number; // 左上角 Y
  width: number; // 文本框宽度（px）
  fontSize: number; // 字号（px）
  fontFamily: string; // 字体，如 "PingFang SC"
  color: string; // 文字颜色，如 "#333333"
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight: number; // 行高倍数
  maxLines?: number; // 最大行数（超出截断）
  rotation?: number; // 旋转角度（度，0-360），默认 0
  backgroundColor?: string; // 背景色（标签样式），如 "#FFEAA7"，不填则透明
  borderRadius?: number; // 背景圆角（px），默认 0
  padding?:
    | number
    | { top: number; right: number; bottom: number; left: number }; // 背景内边距（px），默认 0
  bindingKey?: string; // 数据绑定字段名，如 "userName"
}

/** 图片元素 */
export interface ImageElement {
  type: 'image';
  id: string;
  name: string; // 显示名，如 "用户二维码"
  x: number;
  y: number;
  width: number;
  height: number;
  fit: 'cover' | 'contain' | 'fill'; // 图片填充模式
  borderRadius?: number; // 图片圆角（px），默认 0
  opacity?: number; // 透明度（0-1），默认 1
  bindingKey?: string; // 数据绑定字段名，如 "qrcode"
}

/** 列表查询参数 */
export interface CertificateQuery {
  keyword?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/** 模板选项（选择器用） */
export interface CertificateOption {
  label: string;
  value: string;
  category?: string;
}
```

---

## 五、页面布局

### 5.1 模板列表页 `/demo/system/certificate`

```
┌───────────────────────────────────────────────────────┐
│  搜索栏                                                │
│  [关键词] [分类 ▼] [状态 ▼]                        [搜索][重置] │
├───────────────────────────────────────────────────────┤
│  工具栏                                                │
│  [+新建模板]                                      [导出CSV]  │
├───────────────────────────────────────────────────────┤
│  PrimeDataTable                                       │
│  ┌────┬────────┬──────┬──────┬───────┬──────┐       │
│  │ ID │ 名称    │ 分类  │ 尺寸  │ 状态   │ 操作  │       │
│  ├────┼────────┼──────┼──────┼───────┼──────┤       │
│  │    │ 操作列：[编辑] [合成] [删除]                 │       │
│  └────┴────────┴──────┴──────┴───────┴──────┘       │
│  分页器                                                │
└───────────────────────────────────────────────────────┘
```

说明：

- "编辑" → 跳转配置页
- "合成" → 跳转合成页（携带模板 ID）
- 不支持批量操作（模板数量通常不多，逐个管理即可）

### 5.2 模板编辑页 `/demo/system/certificate/[id]/edit`

```
┌──────────────────────────┬─────────────────────────────┐
│  元素配置面板              │  Canvas 实时预览              │
│                           │                             │
│  ┌─ 基本信息 ──────────┐  │  ┌───────────────────────┐  │
│  │ 模板名称 [_________] │  │  │                       │  │
│  │ 描述     [_________] │  │  │   底图 + 合成元素       │  │
│  │ 分类     [___▼]     │  │  │   实时渲染效果           │  │
│  │ 底图URL  [_________] │  │  │                       │  │
│  │ 宽 x 高  [___] [___] │  │  │   选中元素高亮边框       │  │
│  │ [保存模板]           │  │  │                       │  │
│  └────────────────────┘  │  └───────────────────────┘  │
│                           │                             │
│  ┌─ 元素列表 ──────────┐  │                             │
│  │ ● 文字: 姓名    ✏️ 🗑  │  │                             │
│  │   X:[100] Y:[200]   │  │                             │
│  │   W:[300] 字号:[24] │  │                             │
│  │   颜色:[#333▼] 对齐 │  │                             │
│  │   字体:[PingFang▼]  │  │                             │
│  │   预览文字:[_______] │  │   ← 临时输入，不保存         │
│  │   bindingKey:[_____]│  │                             │
│  │                      │  │                             │
│  │ ■ 图片: 二维码  ✏️ 🗑  │  │                             │
│  │   X:[800] Y:[100]   │  │                             │
│  │   W:[120] H:[120]   │  │                             │
│  │   填充:[cover▼]     │  │                             │
│  │   预览图:[选择文件]  │  │   ← 临时上传，不保存         │
│  │   bindingKey:[_____]│  │                             │
│  └────────────────────┘  │                             │
│  [+添加文字] [+添加图片]   │                             │
└──────────────────────────┴─────────────────────────────┘
```

关键交互：

- 点击元素行 → 选中该元素（面板展开详情，Preview 中高亮）
- 修改任意参数 → Preview 即时重绘（防抖 200ms）
- 临时预览文字和图片 → 仅在当前会话有效，不保存到模板
- 保存模板 → 只保存元素参数和 bindingKey，丢弃临时内容

### 5.3 合成下载页 `/demo/system/certificate/compose`

```
┌──────────────────────────┬─────────────────────────────┐
│  数据输入表单              │  Canvas 合成预览              │
│                           │                             │
│  ┌────────────────────┐  │  ┌───────────────────────┐  │
│  │ 选择模板 [___▼]    │  │  │                       │  │
│  ├────────────────────┤  │  │   最终合成效果           │  │
│  │ 文字: 姓名         │  │  │   实际文字 + 图片        │  │
│  │ [张三___________]  │  │  │                       │  │
│  │                    │  │  │                       │  │
│  │ 文字: 奖项         │  │  │                       │  │
│  │ [优秀员工_________] │  │  │                       │  │
│  │                    │  │  └───────────────────────┘  │
│  │ 图片: 二维码       │  │                             │
│  │ [选择文件] ✓已选择  │  │  [下载 PNG] [下载 JPEG]       │
│  └────────────────────┘  │                             │
└──────────────────────────┴─────────────────────────────┘
```

关键交互：

- 选择模板后，左侧自动生成对应输入项（根据模板 elements）
- 输入文字/上传图片后，右侧实时合成预览
- 下载：Canvas → toBlob → download link
- **无保存按钮**，纯一次性操作

---

## 六、服务架构

### 6.1 依赖关系

```
CertificateService              数据层：模板 CRUD、$fetch 调用
    ↑
    ├── CertificateMgrService    列表页状态：分页、搜索、表格数据
    └── CertificateEditorService 编辑页状态：当前模板、元素列表、选中元素、预览重绘触发
```

### 6.2 服务注册

```typescript
// 列表页 - layers/sakai/app/pages/demo/system/certificate/index.vue
declareProviders([CertificateService, CertificateMgrService]);

// 编辑页 - layers/sakai/app/pages/demo/system/certificate/[id]/edit.vue
declareProviders([CertificateService, CertificateEditorService]);

// 合成页 - layers/sakai/app/pages/demo/system/certificate/compose.vue
declareProviders([CertificateService]);
// 合成页状态简单，不需要 MgrService，直接用 ref + computed
```

### 6.3 CertificateService（数据服务）

```typescript
@Injectable()
export class CertificateService {
  async queryList(
    params: CertificateQuery,
  ): Promise<PageResult<CertificateTemplate>>;
  async getById(id: string): Promise<CertificateTemplate>;
  async create(
    data: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CertificateTemplate>;
  async update(
    id: string,
    data: Partial<CertificateTemplate>,
  ): Promise<CertificateTemplate>;
  async delete(id: string): Promise<void>;
  async getOptions(): Promise<CertificateOption[]>; // 合成页下拉选择器用
}
```

### 6.4 CertificateEditorService（编辑页状态）

```typescript
@Injectable()
export class CertificateEditorService {
  @Inject(CertificateService) private certService!: CertificateService;

  // 模板数据
  template: CertificateTemplate | null = null;
  loading = false;
  isDirty = false;

  // 元素管理
  selectedElementId: string | null = null;
  get selectedElement(): TemplateElement | undefined;
  get elements(): TemplateElement[];

  // 临时预览数据（仅当前会话，不保存）
  previewValues: Record<string, string> = {}; // key=元素id, value=临时文字/图片URL

  // 操作
  async loadTemplate(id: string): Promise<void>;
  addTextElement(): void;
  addImageElement(): void;
  updateElement(id: string, patch: Partial<TemplateElement>): void;
  removeElement(id: string): void;
  selectElement(id: string | null): void;

  // 临时预览
  setPreviewValue(elementId: string, value: string): void;

  // Canvas 重绘标记（canvas 组件 watch 此值触发重绘）
  renderTick = 0;
  triggerRerender(): void;

  // 保存
  async save(): Promise<void>;
}
```

### 6.5 CertificateMgrService（列表页状态）

```typescript
@Injectable()
export class CertificateMgrService {
  @Inject(CertificateService) private certService!: CertificateService;

  templates: CertificateTemplate[] = [];
  totalRecords = 0;
  loading = false;
  page = 1;
  pageSize = 10;
  searchParams: CertificateQuery = {};

  async loadTemplates(): Promise<void>;
  onSearch(params: CertificateQuery): void;
  onReset(): void;
  onPage(event: DataTablePageEvent): void;

  // 删除
  deleteDialogVisible = false;
  deleteTarget: CertificateTemplate | null = null;
  confirmDelete(template: CertificateTemplate): void;
  onDeleteConfirm(): Promise<void>;
}
```

---

## 七、Canvas 渲染器

纯工具函数，放在 `app/utils/canvas-renderer.ts`，Nuxt 自动导入。

```typescript
/**
 * 将模板 + 实际值渲染到指定 Canvas
 * @param canvas - 目标 Canvas 元素
 * @param template - 模板配置
 * @param values - 实际值映射 { elementId: 文字/图片URL }，不传则元素不渲染
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  template: CertificateTemplate,
  values?: Record<string, string>,
): void;

/**
 * 加载图片（带跨域处理）
 */
export function loadImage(url: string): Promise<HTMLImageElement>;

/**
 * 将 Canvas 导出为 Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg',
  quality?: number,
): Promise<Blob>;

/**
 * 触发浏览器下载
 */
export function downloadBlob(blob: Blob, filename: string): void;
```

渲染流程：

1. 清空 Canvas
2. `drawImage(background)` → 绘制底图
3. 遍历 `template.elements`：
   - 文字元素 → `ctx.fillText(value, x, y)` 应用字体/颜色/对齐
   - 图片元素 → `loadImage(value).then(img => ctx.drawImage(img, x, y, w, h))`

---

## 八、API 端点

```
GET    /api/certificate-templates          → 模板列表（分页 + 搜索）
GET    /api/certificate-templates/:id      → 模板详情
POST   /api/certificate-templates          → 创建模板
PUT    /api/certificate-templates/:id      → 更新模板
DELETE /api/certificate-templates/:id      → 删除模板
GET    /api/certificate-templates/options  → 模板选项（供下拉选择器使用）
```

注意：不提供 `/render` 端点，本次合成完全在前端 Canvas 完成。后端渲染是后续需求。

---

## 九、菜单配置

在 `app/config/menu/system-menu.ts` 中，系统管理 → 系统工具分组下新增：

```typescript
{
  label: '系统工具',
  icon: 'pi pi-fw pi-wrench',
  items: [
    {
      label: '模板合成',
      icon: 'pi pi-fw pi-images',
      to: '/demo/system/certificate',
    },
    // 已有的短链工具也放在这里
  ],
}
```

（如果已有系统工具分组，直接添加条目；如果没有，新增一个分组）

---

## 十、MSW Mock

### mocks/data/certificate-templates.ts

提供 3 个示例模板：

1. "2024年度优秀员工奖状" — 证书类，含 3 个文字元素 + 1 个图片元素
2. "活动邀请海报" — 海报类，含 2 个文字元素
3. "培训结业证书" — 证书类，含 3 个文字元素

### mocks/handlers/certificate-templates.ts

```typescript
import { HttpResponse, http } from 'msw';

export const certificateHandlers = [
  http.get('/api/certificate-templates', ({ request }) => {
    /* 分页 + 搜索 */
  }),
  http.get('/api/certificate-templates/options', () => {
    /* 返回简化列表 */
  }),
  http.get('/api/certificate-templates/:id', ({ params }) => {
    /* 详情 */
  }),
  http.post('/api/certificate-templates', async ({ request }) => {
    /* 创建 */
  }),
  http.put('/api/certificate-templates/:id', async ({ request, params }) => {
    /* 更新 */
  }),
  http.delete('/api/certificate-templates/:id', ({ params }) => {
    /* 删除 */
  }),
];
```

在 `mocks/handlers/index.ts` 中注册：

```typescript
import { certificateHandlers } from './certificate-templates';

export const handlers = [...certificateHandlers /* 已有 handlers */];
```

---

## 十一、不做的

- 后端批量合成渲染（后续需求）
- PDF 输出（后续需求）
- 多语言模板变体
- WYSIWYG 拖拽编辑器
- 模板版本管理
- 条件显示规则
- 形状/装饰线元素
