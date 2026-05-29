# 短链工具设计文档

> 日期：2026-05-29 | 状态：待评审 | 方案：A（极简单页）

---

## 一、需求概述

在系统管理模块中新增"短链工具"，供营销运营团队使用。功能涵盖短链 CRUD、UTM 参数、活动标签、二维码生成、批量操作。

**不做**：密码保护、OG 标签定制、点击数据分析、深度链接、自定义域名、链接健康检测、操作审计、速率限制。

---

## 二、文件结构

所有代码存放在 `layers/sakai/app/` 下：

```
layers/sakai/app/
├── pages/demo/system/short-link/
│   └── index.vue                        # 主页面（唯一入口）
├── components/views/pages/short-link/
│   ├── ShortLinkFormDialog.vue          # 新建/编辑弹窗
│   ├── ShortLinkDeleteDialog.vue        # 删除确认弹窗
│   ├── ShortLinkBulkImportDialog.vue    # 批量导入弹窗
│   ├── ShortLinkBatchEditDialog.vue     # 批量编辑弹窗
│   └── ShortLinkQRDialog.vue           # 二维码查看/下载弹窗
├── services/
│   ├── ShortLinkService.ts              # 数据服务（mock CRUD）
│   └── ShortLinkMgrService.ts           # UI 状态服务（分页/弹窗/选中行）
└── types/
    └── short-link.ts                    # 类型定义
```

## 三、数据模型

```typescript
// layers/sakai/app/types/short-link.ts

export interface ShortLink {
  id: string;
  title: string; // 备注标题
  originalUrl: string; // 目标 URL（必填）
  shortCode: string; // 自定义短码（留空则自动生成 6 位随机码）
  campaign: string; // 活动标签（普通文本，支持自动补全已有标签）
  utmSource?: string; // UTM 来源
  utmMedium?: string; // UTM 媒介
  utmCampaign?: string; // UTM 活动名
  utmTerm?: string; // UTM 关键词
  utmContent?: string; // UTM 内容
  expireAt?: string; // 过期时间（ISO 字符串，为空表示永不过期）
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 列表查询参数
export interface ShortLinkQuery {
  keyword?: string;
  campaign?: string;
}
```

## 四、页面布局

```
┌─────────────────────────────────────────────────────────┐
│  搜索栏                                                   │
│  [关键词] [Campaign下拉筛选]                    [搜索][重置]│
├─────────────────────────────────────────────────────────┤
│  工具栏                                                   │
│  [+新建短链] [批量导入] [批量编辑] [批量删除]      [导出CSV]│
├─────────────────────────────────────────────────────────┤
│  PrimeDataTable（多选）                                   │
│  ┌────┬────────┬─────────┬──────────┬────────┬──────┐  │
│  │ ☐  │ 标题    │ 短码     │ 目标URL   │ 活动标签│ 状态  │  │
│  ├────┼────────┼─────────┼──────────┼────────┼──────┤  │
│  │    │ 操作列：[编辑] [QR码] [复制链接] [删除]        │  │
│  └────┴────────┴─────────┴──────────┴────────┴──────┘  │
│  分页器                                                   │
└─────────────────────────────────────────────────────────┘
```

## 五、弹窗设计

### 5.1 新建/编辑弹窗 (`ShortLinkFormDialog`)

表单字段：

- 目标 URL（必填，带 URL 格式校验）
- 自定义短码（可选，留空自动生成 6 位随机码）
- 备注标题（可选）
- 活动标签（文本输入 + 已有标签自动补全下拉）
- UTM 参数组（5 个标准字段，全部可选，折叠面板 `PrimeAccordion`）
- 过期时间（`PrimeDatePicker`，不选则为永不过期）

### 5.2 删除确认弹窗 (`ShortLinkDeleteDialog`)

- 删除单条：显示标题确认
- 批量删除：显示"确认删除选中的 N 条短链？"

### 5.3 批量导入弹窗 (`ShortLinkBulkImportDialog`)

- "下载模板"按钮 → 生成标准 Excel 模板文件
- 文件上传区域（拖拽 + 点击，支持 .xlsx / .csv）
- 上传后预览前 5 行数据
- 确认导入 → 批量创建，显示成功/失败数量

### 5.4 批量编辑弹窗 (`ShortLinkBatchEditDialog`)

- 仅展示需要统一修改的字段：活动标签、过期时间、UTM 参数
- 空字段不覆盖原值
- 底部显示"已选 N 条"

### 5.5 二维码弹窗 (`ShortLinkQRDialog`)

- 使用 `qrcode` 库客户端生成二维码图片
- 显示短链标题、短链接
- [下载 PNG] 按钮
- [复制链接] 按钮

## 六、服务层设计

### ShortLinkService（数据服务）

- `@Injectable()` 标记
- `list(query: ShortLinkQuery): Promise<ShortLink[]>` — 模拟搜索+筛选
- `getById(id: string): Promise<ShortLink>`
- `create(data: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShortLink>`
- `update(id: string, data: Partial<ShortLink>): Promise<ShortLink>`
- `delete(id: string): Promise<void>`
- `batchDelete(ids: string[]): Promise<void>`
- `batchUpdate(ids: string[], data: Partial<ShortLink>): Promise<void>`
- `batchCreate(list: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ShortLink[]>`
- `getAllCampaigns(): Promise<string[]>` — 已使用标签去重列表
- 内部使用 `Map<string, ShortLink>` 存储 mock 数据
- 导出一个 `generateShortCode()` 工具函数

### ShortLinkMgrService（UI 状态服务）

- `@Injectable()` 标记
- `@Inject() ShortLinkService`
- 响应式状态：
  - `links: ShortLink[]` — 当前页数据
  - `loading: boolean`
  - `searchQuery: ShortLinkQuery`
  - `pagination: { page: number, rows: number, total: number }`
- 弹窗状态：
  - `formDialogVisible: boolean`, `editData: ShortLink | null`, `isEdit: boolean`
  - `deleteDialogVisible: boolean`, `deleteTarget: ShortLink | null`
  - `bulkImportDialogVisible: boolean`
  - `batchEditDialogVisible: boolean`, `selectedIds: string[]`
  - `qrDialogVisible: boolean`, `qrData: ShortLink | null`
- 方法：
  - `loadLinks()` — 从 Service 加载数据
  - `onSearch(query)` / `onReset()` — 搜索和重置
  - `openNew()` / `openEdit(link)` — 打开表单弹窗
  - `onSaved()` — 保存后的刷新逻辑
  - `onDeleted()` — 删除后的刷新逻辑
  - `onBulkImported(rows)` — 批量导入回调
  - `onBatchEdited(data)` — 批量编辑回调
  - `getAllCampaigns()` — 获取标签列表供下拉选择
  - `getFullShortUrl(code: string): string` — 拼接完整短链接

## 七、页面入口组件

`layers/sakai/app/pages/demo/system/short-link/index.vue`：

```vue
<script lang="ts" setup>
import ShortLinkBatchEditDialog from '@sakai/components/views/pages/short-link/ShortLinkBatchEditDialog.vue';
import ShortLinkBulkImportDialog from '@sakai/components/views/pages/short-link/ShortLinkBulkImportDialog.vue';
import ShortLinkDeleteDialog from '@sakai/components/views/pages/short-link/ShortLinkDeleteDialog.vue';
import ShortLinkFormDialog from '@sakai/components/views/pages/short-link/ShortLinkFormDialog.vue';
import ShortLinkQRDialog from '@sakai/components/views/pages/short-link/ShortLinkQRDialog.vue';
import { ShortLinkMgrService } from '@sakai/services/ShortLinkMgrService';
import { ShortLinkService } from '@sakai/services/ShortLinkService';

declareProviders([ShortLinkService, ShortLinkMgrService]);

const mgr = useService(ShortLinkMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '短链工具' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '短链已更新' : '短链已创建',
    life: 3000,
  });
}

async function onDeleteConfirm() {
  try {
    await mgr.onDeleted();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '短链已删除',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '删除失败',
      life: 3000,
    });
  }
}

function exportCSV() {
  dt.value.exportCSV();
}

onMounted(() => {
  mgr.loadLinks();
});
</script>
```

模板结构：搜索栏 → 工具栏（按钮组）→ PrimeDataTable → 分页器 → 各弹窗组件。

## 八、菜单注册

修改 `app/config/menu/system-menu.ts`，在"系统管理"分组末尾新增：

```typescript
{
  label: '短链工具',
  icon: 'pi pi-fw pi-link',
  to: '/demo/system/short-link',
}
```

## 九、新增依赖

| 包       | 用途               | 大小   |
| -------- | ------------------ | ------ |
| `qrcode` | 客户端二维码生成   | ~30KB  |
| `xlsx`   | Excel/CSV 文件解析 | ~500KB |

## 十、不做清单

| 功能                             | 原因                            |
| -------------------------------- | ------------------------------- |
| 密码保护、OG 标签定制            | 需服务端支持（当前纯前端 mock） |
| 点击数据分析仪表盘               | 用户明确排除                    |
| UTM 模板独立管理                 | 方案 A 采用内联填写             |
| 深度链接、自定义域名             | 实现困难                        |
| 链接健康检测、审计日志、速率限制 | 排除管理与安全类                |
