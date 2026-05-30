# 小程序码/链接生成工具 — 实现计划

> 日期：2026-05-30
> 基于设计文档：docs/superpowers/specs/2026-05-30-miniapp-tool-design.md
> 项目模式参考：ShortLinkService / ShortLinkMgrService

## 文件清单

| 操作 | 文件                                                   | 说明                  |
| ---- | ------------------------------------------------------ | --------------------- |
| 新增 | `layers/sakai/app/types/miniapp.ts`                    | 类型定义              |
| 新增 | `mocks/data/miniapp.ts`                                | Mock 数据             |
| 新增 | `mocks/handlers/miniapp.ts`                            | Mock 处理器           |
| 修改 | `mocks/handlers/index.ts`                              | 注册 miniapp handlers |
| 新增 | `layers/sakai/app/services/MiniAppService.ts`          | 数据服务              |
| 新增 | `layers/sakai/app/services/MiniAppMgrService.ts`       | 页面状态服务          |
| 新增 | `layers/sakai/app/pages/demo/system/miniapp/index.vue` | 页面入口              |
| 修改 | `app/config/menu/system-menu.ts`                       | 添加菜单项            |

## 任务分解

### 任务 1：创建类型定义

**文件**：`layers/sakai/app/types/miniapp.ts`

创建所有需要的 TypeScript 类型：

```typescript
// 生成类型
export type GenerateType =
  | 'wxacode'
  | 'wxacodeunlimit'
  | 'qrcode'
  | 'scheme'
  | 'urllink';

// 小程序信息
export interface MiniApp {
  id: string;
  name: string;
  appid: string;
}
export type MiniAppId = MiniApp['id'];

// 生成请求参数
export interface GenerateParams {
  appId: MiniAppId;
  type: GenerateType;
  path: string;
  query?: string;
  envVersion?: 'release' | 'trial' | 'develop';
  width?: number;
  isHyaline?: boolean;
  scene?: string;
  expireType?: string;
}

// 生成结果
export interface GenerateResult {
  type: GenerateType;
  contentType: 'image/png' | 'text/plain';
  imageUrl?: string;
  link?: string;
}

// API 响应
export interface ApiResponse<T> {
  code: number;
  data?: T;
  message?: string;
}

// 列表响应
export interface MiniAppListResponse {
  code: number;
  data: MiniApp[];
}

// 会话生成记录
export interface GenerateRecord {
  id: string;
  type: GenerateType;
  typeLabel: string;
  miniAppName: string;
  params: Record<string, unknown>;
  result: GenerateResult;
  createdAt: number;
}

// api 路径常量
export const API_MINIA = {
  list: '/api/miniapps',
  generate: '/api/miniapp/generate',
} as const;

// 生成类型标签映射
export const GENERATE_TYPE_LABELS: Record<GenerateType, string> = {
  wxacode: '小程序码（有限）',
  wxacodeunlimit: '小程序码（无限）',
  qrcode: '普通二维码',
  scheme: 'URL Scheme',
  urllink: 'URL Link',
};

// 生成类型功能描述
export const GENERATE_TYPE_DESCRIPTIONS: Record<GenerateType, string> = {
  wxacode: '适用于正式业务场景，样式可定制，有数量限制（10万个）',
  wxacodeunlimit: '不限数量生成，需要填写 scene 场景值，适用于营销推广',
  qrcode: '普通二维码样式，有数量限制（10万个），最简单快捷',
  scheme: '生成 weixin:// 协议的跳转链接，支持设置有效期',
  urllink: '生成 https:// 协议的短链接，可在短信、邮件中使用',
} as const;
```

**验证**：`pnpm typecheck` 通过

---

### 任务 2：创建 Mock 数据

**文件**：`mocks/data/miniapp.ts`

```typescript
// 模拟小程序列表
export const MINI_APP_LIST = [
  { id: 'wx001', name: '演示商城', appid: 'wxabc123def456789' },
  { id: 'wx002', name: '内部管理系统', appid: 'wxghi789jkl012345' },
  { id: 'wx003', name: '客户服务助手', appid: 'wxmno345pqr678901' },
];

// 占位二维码（简约 SVG，带小程序图标风格）
export const MOCK_QR_SVG = (label: string) => {
  const encoded = encodeURIComponent(label);
  return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="430" height="430" viewBox="0 0 430 430"><rect width="430" height="430" fill="%23f8fafc" rx="12"/><rect x="20" y="20" width="390" height="390" fill="white" stroke="%23e2e8f0" stroke-width="2" rx="8"/><text x="215" y="200" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%2364748b">${encoded}</text><text x="215" y="230" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">小程序码占位图</text></svg>`;
};
```

---

### 任务 3：创建 Mock 处理器

**文件**：`mocks/handlers/miniapp.ts`

```typescript
import { HttpResponse, delay, http } from 'msw';
import { nanoid } from 'nanoid';
import { MINI_APP_LIST, MOCK_QR_SVG } from '../data/miniapp';

export const miniappHandlers = [
  // 获取小程序列表
  http.get('/api/miniapps', async () => {
    await delay(300);
    return HttpResponse.json({
      code: 0,
      data: MINI_APP_LIST,
    });
  }),

  // 生成小程序码/链接
  http.post('/api/miniapp/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const { type, path, appId } = body;

    // 模拟参数校验
    if (!appId) {
      return HttpResponse.json(
        { code: 40001, message: '请先选择小程序' },
        { status: 400 },
      );
    }
    if (!path && type !== 'wxacodeunlimit') {
      return HttpResponse.json(
        { code: 40001, message: '页面路径不能为空' },
        { status: 400 },
      );
    }
    if (type === 'wxacodeunlimit' && !body.scene) {
      return HttpResponse.json(
        { code: 40001, message: '无限码需要填写 scene 场景值' },
        { status: 400 },
      );
    }

    await delay(1000); // 模拟真实网络延迟

    const isImage =
      type === 'wxacode' || type === 'wxacodeunlimit' || type === 'qrcode';
    const miniApp = MINI_APP_LIST.find((app) => app.id === appId);

    if (isImage) {
      return HttpResponse.json({
        code: 0,
        data: {
          type,
          imageUrl: MOCK_QR_SVG(miniApp?.name || '小程序码'),
          contentType: 'image/png',
        },
      });
    }

    return HttpResponse.json({
      code: 0,
      data: {
        type,
        link: `weixin://dl/business/?t=mock_${nanoid(8)}`,
        contentType: 'text/plain',
      },
    });
  }),
];
```

---

### 任务 4：注册 Mock 处理器

**文件**：`mocks/handlers/index.ts`

在文件顶部添加 import：

```typescript
import { miniappHandlers } from './miniapp';
```

在 handlers 数组末尾添加（保持字母顺序）：

```typescript
...miniappHandlers,
```

---

### 任务 5：创建 MiniAppService

**文件**：`layers/sakai/app/services/MiniAppService.ts`

遵循项目模式（参考 ShortLinkService），使用 `$fetch` 调用 API：

```typescript
import type {
  GenerateParams,
  GenerateResult,
  MiniApp,
} from '@sakai/types/miniapp';

@Injectable()
export class MiniAppService {
  // 获取小程序列表
  async getMiniApps(): Promise<MiniApp[]> {
    const res = await $fetch<{ code: number; data: MiniApp[] }>(
      '/api/miniapps',
    );
    return res.data;
  }

  // 生成码/链接
  async generate(params: GenerateParams): Promise<GenerateResult> {
    const res = await $fetch<{
      code: number;
      data: GenerateResult;
      message?: string;
    }>('/api/miniapp/generate', { method: 'POST', body: params });
    if (res.code !== 0) {
      throw new Error(res.message || '生成失败');
    }
    return res.data!;
  }
}
```

---

### 任务 6：创建 MiniAppMgrService

**文件**：`layers/sakai/app/services/MiniAppMgrService.ts`

核心状态管理服务，负责：

- 小程序列表加载和选择
- 表单参数状态
- 参数校验（按类型）
- 生成流程（调用 MiniAppService，结果加入 records）
- 高级选项切换
- 下载和复制操作

关键实现要点：

- `records` 是纯内存数组，不做持久化
- `generate(type)` 方法先调用 `validateFields(type)` 再调 `MiniAppService.generate()`
- `validateFields` 根据 type 动态判断哪些字段必填
- 生成成功后 push 到 records 最前面

```typescript
import { MiniAppService } from '@sakai/services/MiniAppService';
import type {
  GenerateRecord,
  GenerateType,
  MiniApp,
} from '@sakai/types/miniapp';
import { GENERATE_TYPE_LABELS } from '@sakai/types/miniapp';
import { nanoid } from 'nanoid';

@Injectable()
export class MiniAppMgrService {
  @Inject(MiniAppService)
  private service!: MiniAppService;

  // 小程序列表
  miniApps: MiniApp[] = [];
  selectedAppId = '';
  miniAppsLoading = false;

  // 表单参数
  formPath = '';
  formQuery = '';
  formEnvVersion: 'release' | 'trial' | 'develop' = 'release';
  formWidth = 430;
  formIsHyaline = false;
  formScene = '';
  formExpireType = 'permanent';
  advancedExpanded = false;

  // 生成状态
  generating = false;
  records: GenerateRecord[] = [];

  // 加载小程序列表
  async loadMiniApps(): Promise<void> {
    this.miniAppsLoading = true;
    try {
      this.miniApps = await this.service.getMiniApps();
      if (this.miniApps.length > 0 && !this.selectedAppId) {
        this.selectedAppId = this.miniApps[0].id;
      }
    } finally {
      this.miniAppsLoading = false;
    }
  }

  // 切换高级选项展开
  toggleAdvanced(): void {
    this.advancedExpanded = !this.advancedExpanded;
  }

  // 获取当前选中的小程序名称
  get selectedMiniAppName(): string {
    return this.miniApps.find((a) => a.id === this.selectedAppId)?.name || '';
  }

  // 参数校验（按类型）
  validateFields(type: GenerateType): string | null {
    if (!this.selectedAppId) return '请先选择小程序';

    if (type === 'wxacodeunlimit') {
      if (!this.formPath) return '页面路径(page)不能为空';
      if (!this.formScene) return '场景值(scene)不能为空';
    } else {
      if (!this.formPath) return '页面路径(path)不能为空';
    }

    if (
      (type === 'wxacode' || type === 'wxacodeunlimit' || type === 'qrcode') &&
      (this.formWidth < 280 || this.formWidth > 1280)
    ) {
      return '二维码宽度必须在 280~1280 之间';
    }

    return null; // 校验通过
  }

  // 生成
  async generate(type: GenerateType): Promise<void> {
    const error = this.validateFields(type);
    if (error) {
      throw new Error(error);
    }

    this.generating = true;
    try {
      const params = {
        appId: this.selectedAppId,
        type,
        path: this.formPath,
        query: this.formQuery || undefined,
        envVersion: this.formEnvVersion,
        width: this.formWidth,
        isHyaline: this.formIsHyaline,
        scene: this.formScene || undefined,
        expireType: this.formExpireType,
      };

      const result = await this.service.generate(params);

      const record: GenerateRecord = {
        id: nanoid(),
        type,
        typeLabel: GENERATE_TYPE_LABELS[type],
        miniAppName: this.selectedMiniAppName,
        params: { ...params },
        result,
        createdAt: Date.now(),
      };

      this.records.unshift(record);
    } finally {
      this.generating = false;
    }
  }

  // 下载图片
  downloadImage(record: GenerateRecord): void {
    if (!record.result.imageUrl) return;
    const link = document.createElement('a');
    link.href = record.result.imageUrl;
    link.download = `qrcode_${record.type}_${Date.now()}.png`;
    link.click();
  }
}
```

---

### 任务 7：创建页面组件

**文件**：`layers/sakai/app/pages/demo/system/miniapp/index.vue`

页面结构（从上到下）：

1. **头部**：小程序选择器 + 环境版本选择器
2. **表单区**：路径输入 + URL 参数输入 + 高级选项（可折叠）
3. **按钮区**：5 个生成按钮，颜色区分类型
4. **结果区**：会话生成记录卡片列表，每条显示类型标签/参数摘要/结果预览/操作按钮

遵循项目组件规范：

- `definePageMeta({ layout: 'sakai-sidebar' })`
- `useSeoMeta({ title: '小程序工具' })`
- `declareProviders([MiniAppService, MiniAppMgrService])`
- 使用 PrimeVue 组件（PrimeSelect, PrimeInputText, PrimeButton, PrimeInputNumber 等）
- 组件只做 UI 消费，状态和方法全在 MgrService

**组件伪代码**：

```vue
<script lang="ts" setup>
import { MiniAppService } from '@sakai/services/MiniAppService';
import { MiniAppMgrService } from '@sakai/services/MiniAppMgrService';
import type { GenerateType } from '@sakai/types/miniapp';
import { GENERATE_TYPE_LABELS } from '@sakai/types/miniapp';

declareProviders([MiniAppService, MiniAppMgrService]);
const mgr = useService(MiniAppMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '小程序工具' });

const GENERATE_TYPES: GenerateType[] = ['wxacode', 'wxacodeunlimit', 'qrcode', 'scheme', 'urllink'];

// 按钮样式映射（每个类型不同颜色）
const typeButtonClasses: Record<GenerateType, string> = { ... };

async function onGenerate(type: GenerateType): Promise<void> {
  try {
    await mgr.generate(type);
    toast.add({ severity: 'success', summary: '成功', detail: `${GENERATE_TYPE_LABELS[type]}已生成`, life: 3000 });
  } catch (e: any) {
    toast.add({ severity: 'error', summary: '失败', detail: e.message || '生成失败', life: 5000 });
  }
}

function onDownload(record: GenerateRecord): void { mgr.downloadImage(record); }
async function onCopyLink(link: string): Promise<void> {
  await navigator.clipboard.writeText(link);
  toast.add({ severity: 'info', summary: '已复制', detail: '链接已复制到剪贴板', life: 2000 });
}

onMounted(() => mgr.loadMiniApps());
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 页面标题 -->
    <h1 class="text-xl font-semibold">小程序码/链接生成工具</h1>

    <!-- 基础参数区 -->
    <PrimeCard>
      <template #content>
        <!-- 选择小程序 + 环境版本 -->
        <div class="flex items-end gap-4">...</div>
        <!-- 页面路径 + URL 参数 -->
        <div class="mt-4 flex gap-4">...</div>
        <!-- 高级选项（可折叠） -->
        <div class="mt-4">...</div>
      </template>
    </PrimeCard>

    <!-- 生成按钮 -->
    <PrimeCard>
      <template #content>
        <div class="flex flex-wrap gap-3">
          <PrimeButton
            v-for="t in GENERATE_TYPES"
            :key="t"
            ...
            @click="onGenerate(t)"
          />
        </div>
      </template>
    </PrimeCard>

    <!-- 生成结果（本次会话） -->
    <PrimeCard v-if="mgr.records.length > 0">
      <template #content>
        <h2>
          生成结果（本次会话）<span>共 {{ mgr.records.length }} 条</span>
        </h2>
        <div v-for="record in mgr.records" :key="record.id">
          <!-- 类型标签 / 参数摘要 / 预览 / 下载/复制按钮 -->
        </div>
      </template>
    </PrimeCard>
  </div>
</template>
```

---

### 任务 8：注册菜单

**文件**：`app/config/menu/system-menu.ts`

在「系统管理」菜单组中，`模板合成` 之后添加：

```typescript
{
  label: '小程序工具',
  icon: 'pi pi-fw pi-qrcode',
  to: '/demo/system/miniapp',
},
```

---

### 任务 9：类型检查

```bash
pnpm typecheck
```

确保 exit code 为 0，无新增类型错误。

---

### 任务 10：手动验证

在开发服务器中验证：

- [ ] 打开 `/demo/system/miniapp`，页面正常渲染
- [ ] 小程序下拉框加载 3 个模拟小程序
- [ ] 填写 path，点击 5 个生成按钮分别都能生成
- [ ] 图片类型显示占位图，链接类型显示链接文本
- [ ] 下载按钮触发浏览器下载
- [ ] 复制按钮复制成功
- [ ] 会话记录区域正常显示历史
- [ ] 高级选项折叠/展开正常
- [ ] 不填 path 点生成 → toast 提示参数校验失败
- [ ] 无限码不填 scene → toast 提示
- [ ] 刷新页面 → 会话记录清空
- [ ] 左侧菜单出现「小程序工具」并可以点击跳转

## 执行顺序

```
任务 1（类型） ──→ 任务 2（Mock数据）──→ 任务 3（Mock处理器）──→ 任务 4（注册Mock）
                                         ↓
任务 5（MiniAppService）──→ 任务 6（MiniAppMgrService）──→ 任务 7（页面组件）
                                                                   ↓
                                              任务 8（菜单）──→ 任务 9（typecheck）──→ 任务 10（验证）
```

任务 1-4 可并行，任务 5-6 依赖任务 1，任务 7 依赖任务 5-6，任务 8 独立。
