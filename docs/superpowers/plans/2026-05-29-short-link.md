# 短链工具实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在系统管理模块中新增短链工具页面，支持短链 CRUD、UTM 参数、活动标签、二维码生成、批量导入/编辑。

**Architecture:** 遵循项目现有三层模式（Service → MgrService → Page + Dialogs）。所有代码在 `layers/sakai/app/` 下，组件和服务均显式 import。

**Tech Stack:** Nuxt 4 (SPA), Vue 3 Composition API, PrimeVue 4, Tailwind CSS 4, `qrcode`, `xlsx`, `nanoid`(已有)

---

### Task 1: 安装依赖 + 创建类型

**Files:**

- Modify: `package.json`
- Create: `layers/sakai/app/types/short-link.ts`

- [ ] **Step 1: 安装 qrcode 和 xlsx**

Run:

```bash
pnpm add qrcode xlsx && pnpm add -D @types/qrcode
```

- [ ] **Step 2: 创建类型文件**

```typescript
// layers/sakai/app/types/short-link.ts

/** 短链实体 */
export interface ShortLink {
  id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  campaign: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  expireAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 列表查询参数 */
export interface ShortLinkQuery {
  keyword?: string;
  campaign?: string;
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml layers/sakai/app/types/short-link.ts
git commit -m "feat: add short-link types and dependencies (qrcode, xlsx)"
```

---

### Task 2: 创建 ShortLinkService（mock 数据层）

**Files:**

- Create: `layers/sakai/app/services/ShortLinkService.ts`

- [ ] **Step 1: 写入文件**

参考模式：`layers/sakai/app/services/DictService.ts`（数据服务 @Injectable 模式）

```typescript
// layers/sakai/app/services/ShortLinkService.ts
import type { ShortLink, ShortLinkQuery } from '@sakai/types/short-link';
import { nanoid } from 'nanoid';

export function generateShortCode(): string {
  return nanoid(6);
}

export function isExpired(link: ShortLink): boolean {
  if (!link.expireAt) return false;
  return new Date(link.expireAt).getTime() < Date.now();
}

@Injectable()
export class ShortLinkService {
  private store: Map<string, ShortLink> = new Map();

  constructor() {
    const mocks: Omit<ShortLink, 'id'>[] = [
      {
        title: '618 大促主会场',
        originalUrl: 'https://shop.example.com/618',
        shortCode: '618main',
        campaign: '618大促',
        utmSource: 'wechat',
        utmMedium: 'social',
        utmCampaign: '618_2026',
        utmTerm: 'sale',
        utmContent: 'banner',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:00:00.000Z',
      },
      {
        title: '新品发布直播',
        originalUrl: 'https://live.example.com/new-product',
        shortCode: 'newlive',
        campaign: '新品发布',
        createdAt: '2026-05-22T14:30:00.000Z',
        updatedAt: '2026-05-22T14:30:00.000Z',
      },
      {
        title: '双十一预售（已过期）',
        originalUrl: 'https://shop.example.com/1111',
        shortCode: '1111pre',
        campaign: '双十一',
        expireAt: '2026-01-01T00:00:00.000Z',
        createdAt: '2025-10-20T08:00:00.000Z',
        updatedAt: '2025-10-20T08:00:00.000Z',
      },
      {
        title: '企业采购专区',
        originalUrl: 'https://biz.example.com/procurement',
        shortCode: 'bizproc',
        campaign: '企业采购',
        utmSource: 'email',
        utmMedium: 'newsletter',
        createdAt: '2026-05-25T09:00:00.000Z',
        updatedAt: '2026-05-25T09:00:00.000Z',
      },
      {
        title: '618 秒杀专场',
        originalUrl: 'https://shop.example.com/seckill',
        shortCode: 'sk618',
        campaign: '618大促',
        utmSource: 'douyin',
        utmMedium: 'video',
        utmCampaign: '618_2026',
        expireAt: '2026-06-20T23:59:59.000Z',
        createdAt: '2026-05-28T12:00:00.000Z',
        updatedAt: '2026-05-28T12:00:00.000Z',
      },
    ];
    for (const item of mocks) {
      const id = nanoid(12);
      this.store.set(id, { id, ...item });
    }
  }

  async list(query: ShortLinkQuery = {}): Promise<ShortLink[]> {
    let result = Array.from(this.store.values());
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(kw) ||
          l.shortCode.toLowerCase().includes(kw) ||
          l.originalUrl.toLowerCase().includes(kw),
      );
    }
    if (query.campaign)
      result = result.filter((l) => l.campaign === query.campaign);
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return result;
  }

  async getById(id: string): Promise<ShortLink | undefined> {
    return this.store.get(id);
  }

  async create(
    data: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ShortLink> {
    const id = nanoid(12);
    const now = new Date().toISOString();
    const link: ShortLink = { id, ...data, createdAt: now, updatedAt: now };
    this.store.set(id, link);
    return link;
  }

  async update(
    id: string,
    data: Partial<Omit<ShortLink, 'id' | 'createdAt'>>,
  ): Promise<ShortLink> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`短链不存在: ${id}`);
    const updated: ShortLink = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async batchDelete(ids: string[]): Promise<void> {
    for (const id of ids) this.store.delete(id);
  }

  async batchUpdate(
    ids: string[],
    data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    const now = new Date().toISOString();
    for (const id of ids) {
      const existing = this.store.get(id);
      if (existing)
        this.store.set(id, { ...existing, ...data, updatedAt: now });
    }
  }

  async batchCreate(
    list: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<ShortLink[]> {
    const results: ShortLink[] = [];
    for (const item of list) results.push(await this.create(item));
    return results;
  }

  async getAllCampaigns(): Promise<string[]> {
    const campaigns = new Set<string>();
    for (const link of this.store.values()) {
      if (link.campaign) campaigns.add(link.campaign);
    }
    return Array.from(campaigns).sort();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add layers/sakai/app/services/ShortLinkService.ts
git commit -m "feat: add ShortLinkService with mock data"
```

---

### Task 3: 创建 ShortLinkMgrService（UI 状态层）

**Files:**

- Create: `layers/sakai/app/services/ShortLinkMgrService.ts`

参考模式：`layers/sakai/app/services/DictMgrService.ts`（状态管理 + @Inject 依赖）

- [ ] **Step 1: 写入文件**

```typescript
// layers/sakai/app/services/ShortLinkMgrService.ts
import {
  ShortLinkService,
  generateShortCode,
  isExpired,
} from '@sakai/services/ShortLinkService';
import type { ShortLink, ShortLinkQuery } from '@sakai/types/short-link';

@Injectable()
export class ShortLinkMgrService {
  @Inject(ShortLinkService)
  private service!: ShortLinkService;

  // ==================== 表格数据 ====================
  links: ShortLink[] = [];
  loading = false;
  selectedLinks: ShortLink[] = [];

  // ==================== 搜索 ====================
  searchQuery: ShortLinkQuery = {};
  allCampaigns: string[] = [];

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: ShortLink | null = null;
  isEdit = false;

  deleteDialogVisible = false;
  deleteTarget: ShortLink | null = null;

  bulkImportDialogVisible = false;
  batchEditDialogVisible = false;

  qrDialogVisible = false;
  qrData: ShortLink | null = null;

  // ==================== 状态映射 ====================

  getStatusLabel(link: ShortLink): string {
    return isExpired(link) ? '已过期' : '有效';
  }

  getStatusSeverity(link: ShortLink): 'success' | 'danger' {
    return isExpired(link) ? 'danger' : 'success';
  }

  getFullShortUrl(code: string): string {
    return `https://t.cn/${code}`;
  }

  // ==================== 数据加载 ====================

  async loadLinks(): Promise<void> {
    this.loading = true;
    try {
      this.links = await this.service.list(this.searchQuery);
      this.allCampaigns = await this.service.getAllCampaigns();
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索 ====================

  onSearch(query: ShortLinkQuery): void {
    this.searchQuery = { ...query };
    this.loadLinks();
  }

  onReset(): void {
    this.searchQuery = {};
    this.loadLinks();
  }

  // ==================== 表单弹窗 ====================

  openNew(): void {
    this.editData = null;
    this.isEdit = false;
    this.formDialogVisible = true;
  }

  openEdit(link: ShortLink): void {
    this.editData = link;
    this.isEdit = true;
    this.formDialogVisible = true;
  }

  onFormSaved(): { isEdit: boolean } {
    const result = { isEdit: this.isEdit };
    this.formDialogVisible = false;
    this.loadLinks();
    return result;
  }

  // ==================== 删除 ====================

  confirmDelete(link: ShortLink): void {
    this.deleteTarget = link;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<void> {
    if (this.deleteTarget) {
      await this.service.delete(this.deleteTarget.id);
    } else if (this.selectedLinks.length > 0) {
      await this.service.batchDelete(this.selectedLinks.map((l) => l.id));
    }
    this.deleteDialogVisible = false;
    this.selectedLinks = [];
    this.loadLinks();
  }

  // ==================== 批量导入 ====================

  openBulkImport(): void {
    this.bulkImportDialogVisible = true;
  }

  async onBulkImported(
    rows: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number> {
    const result = await this.service.batchCreate(rows);
    this.bulkImportDialogVisible = false;
    this.loadLinks();
    return result.length;
  }

  // ==================== 批量编辑 ====================

  openBatchEdit(): void {
    if (this.selectedLinks.length === 0) return;
    this.batchEditDialogVisible = true;
  }

  async onBatchEdited(
    data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    await this.service.batchUpdate(
      this.selectedLinks.map((l) => l.id),
      data,
    );
    this.batchEditDialogVisible = false;
    this.selectedLinks = [];
    this.loadLinks();
  }

  // ==================== 二维码 ====================

  showQR(link: ShortLink): void {
    this.qrData = link;
    this.qrDialogVisible = true;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add layers/sakai/app/services/ShortLinkMgrService.ts
git commit -m "feat: add ShortLinkMgrService for UI state management"
```

---

### Task 4: 创建 ShortLinkFormDialog 组件

**Files:**

- Create: `layers/sakai/app/components/views/pages/short-link/ShortLinkFormDialog.vue`

参考模式：`layers/sakai/app/components/views/pages/dict-mgr/DictTypeFormDialog.vue`

- [ ] **Step 1: 写入组件**

```vue
<script lang="ts" setup>
import { ShortLinkService } from '@sakai/services/ShortLinkService';
import { generateShortCode } from '@sakai/services/ShortLinkService';
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<ShortLink | null>('editData', { default: null });
const emit = defineEmits<{ saved: [] }>();

const service = useService(ShortLinkService);
const submitted = ref(false);
const allCampaigns = ref<string[]>([]);

const form = ref({
  title: '',
  originalUrl: '',
  shortCode: '',
  campaign: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  expireAt: null as Date | null,
});

const isEdit = computed(() => !!editData.value);

async function loadCampaigns(): Promise<void> {
  allCampaigns.value = await service.getAllCampaigns();
}

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    loadCampaigns();
    if (editData.value) {
      form.value = {
        title: editData.value.title,
        originalUrl: editData.value.originalUrl,
        shortCode: editData.value.shortCode,
        campaign: editData.value.campaign,
        utmSource: editData.value.utmSource || '',
        utmMedium: editData.value.utmMedium || '',
        utmCampaign: editData.value.utmCampaign || '',
        utmTerm: editData.value.utmTerm || '',
        utmContent: editData.value.utmContent || '',
        expireAt: editData.value.expireAt
          ? new Date(editData.value.expireAt)
          : null,
      };
    } else {
      form.value = {
        title: '',
        originalUrl: '',
        shortCode: '',
        campaign: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        expireAt: null,
      };
    }
  }
});

const filteredCampaigns = computed(() => {
  if (!form.value.campaign) return allCampaigns.value;
  return allCampaigns.value.filter((c) => c.includes(form.value.campaign));
});

async function handleSave(): Promise<void> {
  submitted.value = true;
  if (!form.value.originalUrl.trim()) return;

  const shortCode = form.value.shortCode.trim() || generateShortCode();
  const expireAt = form.value.expireAt
    ? form.value.expireAt.toISOString()
    : undefined;

  const payload: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'> = {
    title: form.value.title.trim(),
    originalUrl: form.value.originalUrl.trim(),
    shortCode,
    campaign: form.value.campaign.trim(),
    utmSource: form.value.utmSource.trim() || undefined,
    utmMedium: form.value.utmMedium.trim() || undefined,
    utmCampaign: form.value.utmCampaign.trim() || undefined,
    utmTerm: form.value.utmTerm.trim() || undefined,
    utmContent: form.value.utmContent.trim() || undefined,
    expireAt,
  };

  try {
    if (isEdit.value && editData.value) {
      await service.update(editData.value.id, payload);
    } else {
      await service.create(payload);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存短链失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑短链' : '新建短链'"
    :modal="true"
    :style="{ width: '560px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="mb-2 block text-sm font-medium"
          >目标 URL <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model.trim="form.originalUrl"
          placeholder="https://example.com/page"
          :invalid="submitted && !form.originalUrl"
          fluid
          autofocus
        />
        <small v-if="submitted && !form.originalUrl" class="text-red-500"
          >目标 URL 不能为空</small
        >
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注标题</label>
        <PrimeInputText
          v-model.trim="form.title"
          placeholder="用于识别短链用途"
          fluid
        />
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="mb-2 block text-sm font-medium">自定义短码</label>
          <PrimeInputText
            v-model.trim="form.shortCode"
            placeholder="留空自动生成"
            fluid
          />
        </div>
        <div class="flex-1">
          <label class="mb-2 block text-sm font-medium">活动标签</label>
          <PrimeAutoComplete
            v-model="form.campaign"
            :suggestions="filteredCampaigns"
            placeholder="选择或输入标签"
            :dropdown="true"
            fluid
          />
        </div>
      </div>

      <PrimeAccordion value="">
        <PrimeAccordionPanel value="utm">
          <PrimeAccordionHeader>UTM 参数（选填）</PrimeAccordionHeader>
          <PrimeAccordionContent>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_source</label
                >
                <PrimeInputText
                  v-model.trim="form.utmSource"
                  placeholder="如 wechat"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_medium</label
                >
                <PrimeInputText
                  v-model.trim="form.utmMedium"
                  placeholder="如 social"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_campaign</label
                >
                <PrimeInputText
                  v-model.trim="form.utmCampaign"
                  placeholder="如 618_2026"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_term</label
                >
                <PrimeInputText
                  v-model.trim="form.utmTerm"
                  placeholder="如 sale"
                  fluid
                  size="small"
                />
              </div>
              <div class="col-span-2">
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_content</label
                >
                <PrimeInputText
                  v-model.trim="form.utmContent"
                  placeholder="如 banner"
                  fluid
                  size="small"
                />
              </div>
            </div>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>

      <div>
        <label class="mb-2 block text-sm font-medium">过期时间</label>
        <PrimeDatePicker
          v-model="form.expireAt"
          :min-date="new Date()"
          placeholder="永不过期"
          show-icon
          fluid
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton label="保存" @click="handleSave" />
    </template>
  </PrimeDialog>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add layers/sakai/app/components/views/pages/short-link/ShortLinkFormDialog.vue
git commit -m "feat: add ShortLinkFormDialog component"
```

---

### Task 5: 创建 ShortLinkDeleteDialog + ShortLinkQRDialog 组件

**Files:**

- Create: `layers/sakai/app/components/views/pages/short-link/ShortLinkDeleteDialog.vue`
- Create: `layers/sakai/app/components/views/pages/short-link/ShortLinkQRDialog.vue`

- [ ] **Step 1: 写入删除确认弹窗**

```vue
<script lang="ts" setup>
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const target = defineModel<ShortLink | null>('target', { default: null });
const count = defineModel<number>('count', { default: 0 });
const emit = defineEmits<{ confirm: [] }>();

const isBatch = computed(() => !target.value && count.value > 0);
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="删除确认"
    :modal="true"
    :style="{ width: '420px' }"
    :draggable="false"
  >
    <div class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-xl text-yellow-500" />
      <span v-if="isBatch"
        >确认删除选中的 <strong>{{ count }}</strong> 条短链？</span
      >
      <span v-else
        >确认删除短链
        <strong>"{{ target?.title }}"</strong> 吗？此操作不可恢复。</span
      >
    </div>
    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton
        label="确认删除"
        severity="danger"
        @click="emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
```

- [ ] **Step 2: 写入二维码弹窗**

```vue
<script lang="ts" setup>
import type { ShortLink } from '@sakai/types/short-link';
import QRCode from 'qrcode';

const visible = defineModel<boolean>('visible', { required: true });
const data = defineModel<ShortLink | null>('data', { default: null });

const qrDataUrl = ref('');
const fullUrl = computed(() =>
  data.value ? `https://t.cn/${data.value.shortCode}` : '',
);

watch(visible, async (isVisible) => {
  if (isVisible && fullUrl.value) {
    qrDataUrl.value = await QRCode.toDataURL(fullUrl.value, {
      width: 256,
      margin: 2,
    });
  }
});

function downloadPNG(): void {
  const link = document.createElement('a');
  link.download = `${data.value?.shortCode || 'qrcode'}.png`;
  link.href = qrDataUrl.value;
  link.click();
}

async function copyUrl(): Promise<void> {
  const { default: copy } = await import('copy-to-clipboard');
  copy(fullUrl.value);
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="短链二维码"
    :modal="true"
    :style="{ width: '380px' }"
    :draggable="false"
  >
    <div class="flex flex-col items-center gap-4">
      <img
        v-if="qrDataUrl"
        :src="qrDataUrl"
        alt="QR Code"
        class="border-surface-200 dark:border-surface-700 rounded border"
        width="200"
        height="200"
      />
      <div class="text-surface-500 dark:text-surface-400 text-sm">
        {{ data?.title }}
      </div>
      <div class="text-primary font-mono text-sm">{{ fullUrl }}</div>
      <div class="flex gap-2">
        <PrimeButton
          label="下载 PNG"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          @click="downloadPNG"
        />
        <PrimeButton
          label="复制链接"
          icon="pi pi-copy"
          size="small"
          @click="copyUrl"
        />
      </div>
    </div>
  </PrimeDialog>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add layers/sakai/app/components/views/pages/short-link/ShortLinkDeleteDialog.vue \
        layers/sakai/app/components/views/pages/short-link/ShortLinkQRDialog.vue
git commit -m "feat: add ShortLinkDeleteDialog and ShortLinkQRDialog components"
```

---

### Task 6: 创建 ShortLinkBulkImportDialog + ShortLinkBatchEditDialog 组件

**Files:**

- Create: `layers/sakai/app/components/views/pages/short-link/ShortLinkBulkImportDialog.vue`
- Create: `layers/sakai/app/components/views/pages/short-link/ShortLinkBatchEditDialog.vue`

- [ ] **Step 1: 写入批量导入弹窗**

```vue
<script lang="ts" setup>
import { generateShortCode } from '@sakai/services/ShortLinkService';
import type { ShortLink } from '@sakai/types/short-link';
import * as XLSX from 'xlsx';

const visible = defineModel<boolean>('visible', { required: true });
const emit = defineEmits<{
  imported: [rows: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[]];
}>();

type Row = Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>;

const previewRows = ref<Row[]>([]);
const allRows = ref<Row[]>([]);
const fileName = ref('');

interface FileUploadEvent {
  files: File[];
}

function downloadTemplate(): void {
  const header = [
    '标题',
    '目标URL',
    '短码',
    '活动标签',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    '过期时间',
  ];
  const example = [
    '示例',
    'https://example.com',
    '',
    '618大促',
    'wechat',
    'social',
    '618_2026',
    '',
    '',
    '',
  ];
  const ws = XLSX.utils.aoa_to_sheet([header, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '短链导入模板');
  XLSX.writeFile(wb, '短链导入模板.xlsx');
}

async function handleUpload(event: FileUploadEvent): Promise<void> {
  const file = event.files[0];
  fileName.value = file.name;
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  allRows.value = rawRows.map((row) => ({
    title: row['标题'] || '',
    originalUrl: row['目标URL'] || '',
    shortCode: row['短码'] || generateShortCode(),
    campaign: row['活动标签'] || '',
    utmSource: row['utm_source'] || undefined,
    utmMedium: row['utm_medium'] || undefined,
    utmCampaign: row['utm_campaign'] || undefined,
    utmTerm: row['utm_term'] || undefined,
    utmContent: row['utm_content'] || undefined,
    expireAt: row['过期时间'] || undefined,
  }));
  previewRows.value = allRows.value.slice(0, 5);
}

function handleConfirm(): void {
  emit('imported', allRows.value);
}

watch(visible, (v) => {
  if (!v) {
    previewRows.value = [];
    allRows.value = [];
    fileName.value = '';
  }
});
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="批量导入短链"
    :modal="true"
    :style="{ width: '600px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <PrimeButton
          label="下载模板"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          @click="downloadTemplate"
        />
      </div>
      <PrimeFileUpload
        mode="basic"
        accept=".xlsx,.csv"
        :max-file-size="5000000"
        choose-label="选择文件"
        @upload="handleUpload"
      />
      <div
        v-if="fileName"
        class="text-surface-500 dark:text-surface-400 text-sm"
      >
        已选择: {{ fileName }}（{{ allRows.length }} 条数据）
      </div>
      <div v-if="previewRows.length > 0">
        <h4 class="mb-2 text-sm font-medium">数据预览（前 5 行）</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-surface-200 dark:border-surface-700 border-b">
                <th class="px-2 py-1 text-left">标题</th>
                <th class="px-2 py-1 text-left">目标 URL</th>
                <th class="px-2 py-1 text-left">短码</th>
                <th class="px-2 py-1 text-left">标签</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in previewRows"
                :key="i"
                class="border-surface-100 dark:border-surface-800 border-b"
              >
                <td class="max-w-[100px] truncate px-2 py-1">
                  {{ row.title }}
                </td>
                <td class="max-w-[200px] truncate px-2 py-1">
                  {{ row.originalUrl }}
                </td>
                <td class="px-2 py-1 font-mono">{{ row.shortCode }}</td>
                <td class="px-2 py-1">{{ row.campaign }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton
        label="确认导入"
        :disabled="allRows.length === 0"
        @click="handleConfirm"
      />
    </template>
  </PrimeDialog>
</template>
```

- [ ] **Step 2: 写入批量编辑弹窗**

```vue
<script lang="ts" setup>
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const count = defineModel<number>('count', { required: true });
const emit = defineEmits<{
  confirm: [data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>];
}>();

const form = ref({
  campaign: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  expireAt: null as Date | null,
});

watch(visible, (v) => {
  if (v)
    form.value = {
      campaign: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      expireAt: null,
    };
});

function handleConfirm(): void {
  const data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>> = {};
  if (form.value.campaign.trim()) data.campaign = form.value.campaign.trim();
  if (form.value.utmSource.trim()) data.utmSource = form.value.utmSource.trim();
  if (form.value.utmMedium.trim()) data.utmMedium = form.value.utmMedium.trim();
  if (form.value.utmCampaign.trim())
    data.utmCampaign = form.value.utmCampaign.trim();
  if (form.value.utmTerm.trim()) data.utmTerm = form.value.utmTerm.trim();
  if (form.value.utmContent.trim())
    data.utmContent = form.value.utmContent.trim();
  if (form.value.expireAt) data.expireAt = form.value.expireAt.toISOString();
  emit('confirm', data);
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="批量编辑短链"
    :modal="true"
    :style="{ width: '520px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <p class="text-surface-500 dark:text-surface-400 text-sm">
        已选 <strong>{{ count }}</strong> 条短链。留空的字段保持不变。
      </p>
      <div>
        <label class="mb-2 block text-sm font-medium">活动标签</label>
        <PrimeInputText
          v-model.trim="form.campaign"
          placeholder="统一修改标签"
          fluid
        />
      </div>
      <PrimeDivider />
      <div class="text-sm font-medium">UTM 参数</div>
      <div class="grid grid-cols-2 gap-3">
        <PrimeInputText
          v-model.trim="form.utmSource"
          placeholder="utm_source"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmMedium"
          placeholder="utm_medium"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmCampaign"
          placeholder="utm_campaign"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmTerm"
          placeholder="utm_term"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmContent"
          placeholder="utm_content"
          fluid
          size="small"
        />
      </div>
      <PrimeDivider />
      <div>
        <label class="mb-2 block text-sm font-medium">过期时间</label>
        <PrimeDatePicker
          v-model="form.expireAt"
          :min-date="new Date()"
          placeholder="不修改"
          show-icon
          fluid
        />
      </div>
    </div>
    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton label="确认修改" @click="handleConfirm" />
    </template>
  </PrimeDialog>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add layers/sakai/app/components/views/pages/short-link/ShortLinkBulkImportDialog.vue \
        layers/sakai/app/components/views/pages/short-link/ShortLinkBatchEditDialog.vue
git commit -m "feat: add BulkImport and BatchEdit dialogs"
```

---

### Task 7: 创建主页面 index.vue

**Files:**

- Create: `layers/sakai/app/pages/demo/system/short-link/index.vue`

参考模式：`layers/sakai/app/pages/demo/system/dict/index.vue`

- [ ] **Step 1: 写入页面**

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

function onSaved(): void {
  const result = mgr.onFormSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '短链已更新' : '短链已创建',
    life: 3000,
  });
}

async function onDeleteConfirm(): Promise<void> {
  try {
    await mgr.onDeleteConfirm();
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

async function onBulkImported(
  rows: Parameters<typeof mgr.onBulkImported>[0],
): Promise<void> {
  const c = await mgr.onBulkImported(rows);
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `成功导入 ${c} 条短链`,
    life: 3000,
  });
}

async function onBatchEdited(
  data: Parameters<typeof mgr.onBatchEdited>[0],
): Promise<void> {
  await mgr.onBatchEdited(data);
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `成功修改短链`,
    life: 3000,
  });
}

function confirmBatchDelete(): void {
  mgr.deleteDialogVisible = true;
}

function exportCSV(): void {
  dt.value.exportCSV();
}

async function copyLink(code: string): Promise<void> {
  const { default: copy } = await import('copy-to-clipboard');
  copy(mgr.getFullShortUrl(code));
  toast.add({
    severity: 'info',
    summary: '已复制',
    detail: '短链接已复制到剪贴板',
    life: 2000,
  });
}

onMounted(() => {
  mgr.loadLinks();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div class="card p-4!">
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-[200px] flex-1">
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
            >关键词</label
          >
          <PrimeInputText
            v-model="mgr.searchQuery.keyword"
            placeholder="搜索标题、短码、目标URL"
            fluid
            @keyup.enter="mgr.onSearch(mgr.searchQuery)"
          />
        </div>
        <div class="w-[200px]">
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
            >活动标签</label
          >
          <PrimeDropdown
            v-model="mgr.searchQuery.campaign"
            :options="mgr.allCampaigns.map((c) => ({ label: c, value: c }))"
            placeholder="全部标签"
            show-clear
            fluid
          />
        </div>
        <div class="flex gap-2">
          <PrimeButton
            icon="pi pi-search"
            label="搜索"
            severity="primary"
            @click="mgr.onSearch(mgr.searchQuery)"
          />
          <PrimeButton
            icon="pi pi-refresh"
            label="重置"
            severity="secondary"
            @click="mgr.onReset()"
          />
        </div>
      </div>
    </div>

    <!-- 工具栏 + 数据表格 -->
    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="新建短链"
              icon="pi pi-plus"
              severity="primary"
              @click="mgr.openNew()"
            />
            <PrimeButton
              label="批量导入"
              icon="pi pi-upload"
              severity="secondary"
              @click="mgr.openBulkImport()"
            />
            <PrimeButton
              label="批量编辑"
              icon="pi pi-pencil"
              severity="secondary"
              :disabled="mgr.selectedLinks.length === 0"
              @click="mgr.openBatchEdit()"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              :disabled="mgr.selectedLinks.length === 0"
              @click="confirmBatchDelete"
            />
          </div>
        </template>
        <template #end>
          <PrimeButton
            label="导出 CSV"
            icon="pi pi-download"
            severity="secondary"
            @click="exportCSV"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        v-model:selection="mgr.selectedLinks"
        :value="mgr.links"
        :loading="mgr.loading"
        data-key="id"
        :paginator="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="{first} - {last} / 共 {totalRecords} 条"
        striped-rows
        size="small"
        class="text-sm"
      >
        <PrimeColumn selection-mode="multiple" header-style="width:3rem" />
        <PrimeColumn field="title" header="标题" sortable>
          <template #body="{ data }">
            <div class="max-w-[200px] truncate">{{ data.title || '--' }}</div>
          </template>
        </PrimeColumn>
        <PrimeColumn field="shortCode" header="短码" sortable>
          <template #body="{ data }">
            <span class="text-primary font-mono text-xs">{{
              data.shortCode
            }}</span>
          </template>
        </PrimeColumn>
        <PrimeColumn field="originalUrl" header="目标 URL">
          <template #body="{ data }">
            <div class="max-w-[250px] truncate text-xs">
              {{ data.originalUrl }}
            </div>
          </template>
        </PrimeColumn>
        <PrimeColumn field="campaign" header="活动标签" sortable>
          <template #body="{ data }">
            <PrimeTag
              v-if="data.campaign"
              :value="data.campaign"
              severity="info"
            />
            <span v-else class="text-surface-400">--</span>
          </template>
        </PrimeColumn>
        <PrimeColumn header="状态" sortable field="expireAt">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.getStatusLabel(data)"
              :severity="mgr.getStatusSeverity(data)"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn header="操作" header-style="width:180px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                rounded
                @click="mgr.openEdit(data)"
                v-tooltip.top="'编辑'"
              />
              <PrimeButton
                icon="pi pi-qrcode"
                size="small"
                severity="secondary"
                text
                rounded
                @click="mgr.showQR(data)"
                v-tooltip.top="'二维码'"
              />
              <PrimeButton
                icon="pi pi-copy"
                size="small"
                severity="secondary"
                text
                rounded
                @click="copyLink(data.shortCode)"
                v-tooltip.top="'复制链接'"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                text
                rounded
                @click="mgr.confirmDelete(data)"
                v-tooltip.top="'删除'"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- 弹窗 -->
    <ShortLinkFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />
    <ShortLinkDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      v-model:target="mgr.deleteTarget"
      :count="mgr.selectedLinks.length"
      @confirm="onDeleteConfirm"
    />
    <ShortLinkQRDialog
      v-model:visible="mgr.qrDialogVisible"
      v-model:data="mgr.qrData"
    />
    <ShortLinkBulkImportDialog
      v-model:visible="mgr.bulkImportDialogVisible"
      @imported="onBulkImported"
    />
    <ShortLinkBatchEditDialog
      v-model:visible="mgr.batchEditDialogVisible"
      :count="mgr.selectedLinks.length"
      @confirm="onBatchEdited"
    />
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add layers/sakai/app/pages/demo/system/short-link/index.vue
git commit -m "feat: add short-link main page"
```

---

### Task 8: 注册到系统菜单

**Files:**

- Modify: `app/config/menu/system-menu.ts`

- [ ] **Step 1: 添加菜单项**

在 `system-menu.ts` 文件的"系统管理"组 `items` 数组中，"数据备份"条目**之后**添加：

```typescript
{
  label: '短链工具',
  icon: 'pi pi-fw pi-link',
  to: '/demo/system/short-link',
},
```

- [ ] **Step 2: Commit**

```bash
git add app/config/menu/system-menu.ts
git commit -m "feat: register short-link tool in system menu"
```

---

### Task 9: 类型检查与验证

**Files:** 无新建

- [ ] **Step 1: 运行类型检查**

```bash
pnpm typecheck
```

Expected: exit code 0，无类型错误

- [ ] **Step 2: 运行 lint**

```bash
pnpm lint:fix
```

Expected: exit code 0，无 lint 错误

- [ ] **Step 3: 构建验证**

```bash
pnpm build
```

Expected: 构建成功

- [ ] **Step 4: 如有 lint 自动修复则提交**

```bash
git diff --cached --quiet || git commit -m "chore: lint fix for short-link feature"
```

---

### Task 10: 最终验证

- [ ] **Step 1: 确认文件完整性**

```bash
git status
```

应包含以下文件：

- `layers/sakai/app/types/short-link.ts`
- `layers/sakai/app/services/ShortLinkService.ts`
- `layers/sakai/app/services/ShortLinkMgrService.ts`
- `layers/sakai/app/components/views/pages/short-link/ShortLinkFormDialog.vue`
- `layers/sakai/app/components/views/pages/short-link/ShortLinkDeleteDialog.vue`
- `layers/sakai/app/components/views/pages/short-link/ShortLinkQRDialog.vue`
- `layers/sakai/app/components/views/pages/short-link/ShortLinkBulkImportDialog.vue`
- `layers/sakai/app/components/views/pages/short-link/ShortLinkBatchEditDialog.vue`
- `layers/sakai/app/pages/demo/system/short-link/index.vue`
- `app/config/menu/system-menu.ts`
- `package.json` / `pnpm-lock.yaml`

- [ ] **Step 2: 确认 commit log**

```bash
git log --oneline -12
```
