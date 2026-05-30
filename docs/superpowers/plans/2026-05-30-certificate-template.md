# 奖状/海报模板合成工具 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在系统管理模块中新增模板合成工具，包含三个页面：模板列表、模板配置（定义底图 + 元素位置/样式）、合成下载（填入实际数据 → Canvas 渲染 → 下载图片）。

**Architecture:** 遵循项目现有三层模式（Service → MgrService/EditorService → Page + Components）。配置页与合成页完全独立，Canvas 渲染逻辑提取为纯工具函数自动导入。

**Tech Stack:** Nuxt 4 (SPA), Vue 3 Composition API, PrimeVue 4, Tailwind CSS 4, 原生 Canvas 2D（无新增依赖）

---

### Task 1: 创建类型定义

**Files:**

- Create: `layers/sakai/app/types/certificate.ts`

- [ ] **Step 1: 写入类型文件**

```typescript
// layers/sakai/app/types/certificate.ts

/** 模板实体 */
export interface CertificateTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  backgroundUrl: string;
  width: number;
  height: number;
  elements: TemplateElement[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

/** 合成元素（联合类型） */
export type TemplateElement = TextElement | ImageElement;

/** 文字元素 */
export interface TextElement {
  type: 'text';
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight: number;
  maxLines?: number;
  rotation?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?:
    | number
    | { top: number; right: number; bottom: number; left: number };
  bindingKey?: string;
}

/** 图片元素 */
export interface ImageElement {
  type: 'image';
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fit: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
  opacity?: number;
  bindingKey?: string;
}

/** 列表查询参数 */
export interface CertificateQuery {
  keyword?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/** 分页结果（复用项目已有类型） */
export interface PageResult<T> {
  data: T[];
  total: number;
}

/** 模板选项（下拉选择器用） */
export interface CertificateOption {
  label: string;
  value: string;
  category?: string;
}
```

- [ ] **Step 2: 类型检查**

```bash
pnpm typecheck
```

---

### Task 2: 创建 Mock 数据

**Files:**

- Create: `mocks/data/certificate-templates.ts`

- [ ] **Step 1: 写入 Mock 数据**

提供 3 个示例模板：

```typescript
// mocks/data/certificate-templates.ts
import type { CertificateTemplate } from '~~/layers/sakai/app/types/certificate';

export const mockCertificateTemplates: CertificateTemplate[] = [
  {
    id: 'tpl-001',
    name: '2024年度优秀员工奖状',
    description: '年度优秀员工表彰证书模板',
    category: 'certificate',
    backgroundUrl: '/demo/images/certificate-bg.png',
    width: 1200,
    height: 800,
    status: 'published',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    elements: [
      {
        type: 'text',
        id: 'el-name',
        name: '姓名',
        x: 480,
        y: 300,
        width: 240,
        fontSize: 32,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        color: '#C0392B',
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.2,
        bindingKey: 'userName',
      },
      {
        type: 'text',
        id: 'el-title',
        name: '奖项名称',
        x: 300,
        y: 360,
        width: 600,
        fontSize: 28,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        color: '#333333',
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.5,
        bindingKey: 'awardTitle',
      },
      {
        type: 'text',
        id: 'el-date',
        name: '日期',
        x: 800,
        y: 650,
        width: 200,
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        color: '#666666',
        fontWeight: 'normal',
        textAlign: 'right',
        verticalAlign: 'middle',
        lineHeight: 1.2,
        bindingKey: 'awardDate',
      },
      {
        type: 'image',
        id: 'el-qrcode',
        name: '员工二维码',
        x: 1000,
        y: 600,
        width: 120,
        height: 120,
        fit: 'contain',
        borderRadius: 8,
        opacity: 1,
        bindingKey: 'qrcode',
      },
    ],
  },
  {
    id: 'tpl-002',
    name: '活动邀请海报',
    description: '线下活动邀请函海报模板',
    category: 'poster',
    backgroundUrl: '/demo/images/poster-bg.png',
    width: 750,
    height: 1334,
    status: 'published',
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: '2026-05-15T00:00:00.000Z',
    elements: [
      {
        type: 'text',
        id: 'el-guest',
        name: '受邀人',
        x: 100,
        y: 200,
        width: 550,
        fontSize: 36,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        color: '#1A1A1A',
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.2,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 8,
        padding: { top: 12, right: 20, bottom: 12, left: 20 },
        bindingKey: 'guestName',
      },
      {
        type: 'text',
        id: 'el-address',
        name: '活动地址',
        x: 100,
        y: 800,
        width: 550,
        fontSize: 22,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        color: '#555555',
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.6,
        bindingKey: 'address',
      },
    ],
  },
  {
    id: 'tpl-003',
    name: '培训结业证书',
    description: '内部培训结业证书模板',
    category: 'certificate',
    backgroundUrl: '/demo/images/training-cert-bg.png',
    width: 1200,
    height: 800,
    status: 'draft',
    createdAt: '2026-05-25T00:00:00.000Z',
    updatedAt: '2026-05-28T00:00:00.000Z',
    elements: [
      {
        type: 'text',
        id: 'el-student',
        name: '学员姓名',
        x: 400,
        y: 350,
        width: 400,
        fontSize: 36,
        fontFamily: '"KaiTi", "STKaiti", serif',
        color: '#8B0000',
        fontWeight: 'bold',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.2,
        bindingKey: 'studentName',
      },
      {
        type: 'text',
        id: 'el-course',
        name: '课程名称',
        x: 300,
        y: 430,
        width: 600,
        fontSize: 26,
        fontFamily: '"KaiTi", "STKaiti", serif',
        color: '#333333',
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.5,
        bindingKey: 'courseName',
      },
      {
        type: 'text',
        id: 'el-grad-date',
        name: '结业日期',
        x: 450,
        y: 600,
        width: 300,
        fontSize: 22,
        fontFamily: '"KaiTi", "STKaiti", serif',
        color: '#666666',
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.2,
        rotation: -5,
        bindingKey: 'gradDate',
      },
    ],
  },
];
```

---

### Task 3: 创建 Mock Handler

**Files:**

- Create: `mocks/handlers/certificate-templates.ts`
- Modify: `mocks/handlers/index.ts`

- [ ] **Step 1: 写入 handler 文件**

```typescript
// mocks/handlers/certificate-templates.ts
import { HttpResponse, http } from 'msw';
import type {
  CertificateQuery,
  CertificateTemplate,
} from '~/layers/sakai/app/types/certificate';
import { mockCertificateTemplates } from '../data/certificate-templates';

// 用深拷贝模拟内存存储，避免修改原始 mock 数据
let templates: CertificateTemplate[] = JSON.parse(
  JSON.stringify(mockCertificateTemplates),
);
let nextId = templates.length + 1;

export const certificateHandlers = [
  // 列表（分页 + 搜索）
  http.get('/api/certificate-templates', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const category = url.searchParams.get('category') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = templates;
    if (keyword) {
      filtered = filtered.filter(
        (t) =>
          t.name.includes(keyword) ||
          (t.description && t.description.includes(keyword)),
      );
    }
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data, total });
  }),

  // 选项（下拉选择器用）
  http.get('/api/certificate-templates/options', () => {
    const options = templates
      .filter((t) => t.status === 'published')
      .map((t) => ({ label: t.name, value: t.id, category: t.category }));
    return HttpResponse.json(options);
  }),

  // 详情
  http.get('/api/certificate-templates/:id', ({ params }) => {
    const tpl = templates.find((t) => t.id === params.id);
    if (!tpl) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(tpl);
  }),

  // 创建
  http.post('/api/certificate-templates', async ({ request }) => {
    const body = (await request.json()) as Omit<
      CertificateTemplate,
      'id' | 'createdAt' | 'updatedAt'
    >;
    const now = new Date().toISOString();
    const newTpl: CertificateTemplate = {
      ...body,
      id: `tpl-${String(nextId++).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    templates.unshift(newTpl);
    return HttpResponse.json(newTpl, { status: 201 });
  }),

  // 更新
  http.put('/api/certificate-templates/:id', async ({ request, params }) => {
    const index = templates.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Partial<CertificateTemplate>;
    templates[index] = {
      ...templates[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(templates[index]);
  }),

  // 删除
  http.delete('/api/certificate-templates/:id', ({ params }) => {
    const index = templates.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    templates.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
```

- [ ] **Step 2: 注册 handler**

在 `mocks/handlers/index.ts` 中添加 import 和注册：

```typescript
// 在 import 区域添加
import { certificateHandlers } from './certificate-templates';

// 在 handlers 数组中添加
export const handlers = [
  ...certificateHandlers, // ← 新加
  ...announcementHandlers,
  // ... 其余已有的 handler
];
```

---

### Task 4: 创建 CertificateService（数据层）

**Files:**

- Create: `layers/sakai/app/services/CertificateService.ts`

参考模式：`layers/sakai/app/services/ShortLinkService.ts`

- [ ] **Step 1: 写入服务文件**

```typescript
// layers/sakai/app/services/CertificateService.ts
import type {
  CertificateOption,
  CertificateQuery,
  CertificateTemplate,
  PageResult,
} from '@sakai/types/certificate';

@Injectable()
export class CertificateService {
  async queryList(
    params: CertificateQuery = {},
  ): Promise<PageResult<CertificateTemplate>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch<PageResult<CertificateTemplate>>(
      '/api/certificate-templates',
      { query },
    );
  }

  async getById(id: string): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>(`/api/certificate-templates/${id}`);
  }

  async create(
    data: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>('/api/certificate-templates', {
      method: 'POST',
      body: data,
    });
  }

  async update(
    id: string,
    data: Partial<CertificateTemplate>,
  ): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>(`/api/certificate-templates/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    await $fetch(`/api/certificate-templates/${id}`, { method: 'DELETE' });
  }

  async getOptions(): Promise<CertificateOption[]> {
    return $fetch<CertificateOption[]>('/api/certificate-templates/options');
  }
}
```

- [ ] **Step 2: 类型检查**

```bash
pnpm typecheck
```

---

### Task 5: 创建 Canvas 渲染器（纯工具函数）

**Files:**

- Create: `app/utils/canvas-renderer.ts`

注意：放在 `app/utils/` 下以便 Nuxt 自动导入。

- [ ] **Step 1: 写入工具文件**

```typescript
// app/utils/canvas-renderer.ts
import type {
  CertificateTemplate,
  ImageElement,
  TextElement,
} from '@sakai/types/certificate';

/**
 * 将模板 + 实际值渲染到指定 Canvas
 * @param canvas - 目标 Canvas 元素
 * @param template - 模板配置
 * @param values - 实际值映射 { elementId: 文字/图片URL }
 *                  不传则所有元素均不渲染（仅清空画布）
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  template: CertificateTemplate,
  values?: Record<string, string>,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置 Canvas 尺寸
  canvas.width = template.width;
  canvas.height = template.height;

  // 绘制底图
  const bgImg = new Image();
  bgImg.crossOrigin = 'anonymous';
  bgImg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, template.width, template.height);

    // 按顺序绘制每个元素
    for (const element of template.elements) {
      const val = values?.[element.id];
      if (val === undefined || val === null) continue;

      if (element.type === 'text') {
        renderTextElement(ctx, element, val);
      } else if (element.type === 'image') {
        renderImageElement(ctx, element, val);
      }
    }
  };

  // 给出 onerror 处理，避免卡死
  bgImg.onerror = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#999';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('背景图加载失败', canvas.width / 2, canvas.height / 2);
  };

  bgImg.src = template.backgroundUrl;
}

/** 绘制文字元素 */
function renderTextElement(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
  text: string,
): void {
  const padding = normalizePadding(el.padding || 0);

  ctx.save();

  // 旋转（围绕元素中心点）
  if (el.rotation) {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.width / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  // 背景色
  if (el.backgroundColor) {
    ctx.fillStyle = el.backgroundColor;
    if (el.borderRadius) {
      drawRoundedRect(
        ctx,
        el.x,
        el.y,
        el.width,
        getTextHeight(ctx, el, text, padding),
        el.borderRadius,
      );
      ctx.fill();
    } else {
      ctx.fillRect(el.x, el.y, el.width, getTextHeight(ctx, el, text, padding));
    }
  }

  // 文字样式
  ctx.fillStyle = el.color;
  ctx.font = `${el.fontWeight === 'bold' ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
  ctx.textBaseline = 'top';

  // 文字换行
  const lines = wrapText(
    ctx,
    text,
    el.width - padding.left - padding.right,
    el.maxLines,
  );

  // 垂直对齐
  const lineHeightPx = el.fontSize * el.lineHeight;
  const totalTextHeight = lines.length * lineHeightPx;
  const contentHeight = totalTextHeight + padding.top + padding.bottom;
  let startY: number;

  switch (el.verticalAlign) {
    case 'middle':
      startY = el.y + (el.width - contentHeight) / 2 + padding.top;
      break;
    case 'bottom':
      startY = el.y + el.width - contentHeight + padding.top;
      break;
    case 'top':
    default:
      startY = el.y + padding.top;
      break;
  }

  // 逐行绘制
  ctx.textAlign = el.textAlign;
  for (let i = 0; i < lines.length; i++) {
    let x: number;
    switch (ctx.textAlign) {
      case 'center':
        x = el.x + el.width / 2;
        break;
      case 'right':
        x = el.x + el.width - padding.right;
        break;
      default:
        x = el.x + padding.left;
        break;
    }
    ctx.fillText(lines[i], x, startY + i * lineHeightPx);
  }

  ctx.restore();
}

/** 绘制图片元素 */
function renderImageElement(
  ctx: CanvasRenderingContext2D,
  el: ImageElement,
  url: string,
): void {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.save();

    // 透明度
    if (el.opacity !== undefined && el.opacity < 1) {
      ctx.globalAlpha = el.opacity;
    }

    if (el.borderRadius) {
      // 圆角裁剪
      ctx.beginPath();
      drawRoundedRectPath(
        ctx,
        el.x,
        el.y,
        el.width,
        el.height,
        el.borderRadius,
      );
      ctx.clip();
    }

    // 图片填充模式
    const { sx, sy, sw, sh } = getImageSourceRect(
      img.naturalWidth,
      img.naturalHeight,
      el.width,
      el.height,
      el.fit,
    );

    ctx.drawImage(img, sx, sy, sw, sh, el.x, el.y, el.width, el.height);
    ctx.restore();
  };

  img.src = url;
}

/** 文字换行 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number,
): string[] {
  const lines: string[] = [];
  const chars = [...text];
  let currentLine = '';

  for (const char of chars) {
    const testLine = currentLine + char;
    if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
      if (maxLines && lines.length >= maxLines) {
        // 最后一行加省略号
        if (lines.length === maxLines) {
          lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…';
        }
        return lines;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, maxLines);
}

/** 计算文字区域高度 */
function getTextHeight(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
  text: string,
  padding: { top: number; right: number; bottom: number; left: number },
): number {
  ctx.save();
  ctx.font = `${el.fontWeight === 'bold' ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
  const lines = wrapText(
    ctx,
    text,
    el.width - padding.left - padding.right,
    el.maxLines,
  );
  ctx.restore();
  return (
    lines.length * el.fontSize * el.lineHeight + padding.top + padding.bottom
  );
}

/** 归一化 padding（统一为对象形式） */
function normalizePadding(
  padding:
    | number
    | { top: number; right: number; bottom: number; left: number },
): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  return padding;
}

/** 计算图片裁剪区域（cover/contain/fill） */
function getImageSourceRect(
  imgW: number,
  imgH: number,
  targetW: number,
  targetH: number,
  fit: 'cover' | 'contain' | 'fill',
): { sx: number; sy: number; sw: number; sh: number } {
  if (fit === 'fill') {
    return { sx: 0, sy: 0, sw: imgW, sh: imgH };
  }

  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;

  if (fit === 'cover') {
    if (imgRatio > targetRatio) {
      const sw = imgH * targetRatio;
      return { sx: (imgW - sw) / 2, sy: 0, sw, sh: imgH };
    } else {
      const sh = imgW / targetRatio;
      return { sx: 0, sy: (imgH - sh) / 2, sw: imgW, sh };
    }
  }

  // contain
  if (imgRatio > targetRatio) {
    const sh = imgW / imgRatio;
    return { sx: 0, sy: 0, sw: imgW, sh };
  } else {
    const sw = imgH * imgRatio;
    return { sx: 0, sy: 0, sw, sh: imgH };
  }
}

/** 绘制圆角矩形（填充） */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  drawRoundedRectPath(ctx, x, y, w, h, r);
}

/** 圆角矩形路径 */
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * 将 Canvas 导出为 Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg',
  quality = 0.95,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob 失败'));
        }
      },
      format,
      quality,
    );
  });
}

/**
 * 触发浏览器下载
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: 类型检查**

```bash
pnpm typecheck
```

---

### Task 6: 创建 CertificateMgrService + 模板列表页

**Files:**

- Create: `layers/sakai/app/services/CertificateMgrService.ts`
- Create: `layers/sakai/app/pages/demo/system/certificate/index.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/CertificateSearchBar.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/CertificateTable.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/CertificateDeleteDialog.vue`

- [ ] **Step 1: 创建 CertificateMgrService**

```typescript
// layers/sakai/app/services/CertificateMgrService.ts
import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateQuery,
  CertificateTemplate,
} from '@sakai/types/certificate';
import type { DataTablePageEvent } from 'primevue/datatable';

@Injectable()
export class CertificateMgrService {
  @Inject(CertificateService)
  private certService!: CertificateService;

  // 表格数据
  templates: CertificateTemplate[] = [];
  totalRecords = 0;
  loading = false;

  // 分页
  page = 1;
  pageSize = 10;
  searchParams: CertificateQuery = {};

  // 删除
  deleteDialogVisible = false;
  deleteTarget: CertificateTemplate | null = null;

  // 数据加载
  async loadTemplates(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.certService.queryList({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
      });
      this.templates = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // 搜索与重置
  @autobind
  onSearch(params: CertificateQuery): void {
    this.searchParams = params;
    this.page = 1;
    this.loadTemplates();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadTemplates();
  }

  // 分页
  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadTemplates();
  }

  // 删除
  confirmDelete(template: CertificateTemplate): void {
    this.deleteTarget = template;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<{ success: true; message: string }> {
    if (!this.deleteTarget) throw new Error('未选择要删除的模板');
    await this.certService.delete(this.deleteTarget.id);
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
    await this.loadTemplates();
    return { success: true, message: `模板"${this.deleteTarget.name}"已删除` };
  }

  // 分类/状态选项
  readonly categoryOptions = [
    { label: '证书', value: 'certificate' },
    { label: '海报', value: 'poster' },
  ];
  readonly statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
  ];
  readonly statusLabels: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
  };
  getStatusSeverity(status: string): 'warn' | 'success' {
    return status === 'published' ? 'success' : 'warn';
  }
}
```

- [ ] **Step 2: 创建列表页入口**

```vue
<!-- layers/sakai/app/pages/demo/system/certificate/index.vue -->
<script lang="ts" setup>
import CertificateDeleteDialog from '@sakai/components/views/pages/certificate/CertificateDeleteDialog.vue';
import CertificateSearchBar from '@sakai/components/views/pages/certificate/CertificateSearchBar.vue';
import CertificateTable from '@sakai/components/views/pages/certificate/CertificateTable.vue';
import { CertificateMgrService } from '@sakai/services/CertificateMgrService';
import { CertificateService } from '@sakai/services/CertificateService';

declareProviders([CertificateService, CertificateMgrService]);

const mgr = useService(CertificateMgrService);
const router = useRouter();
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '模板合成' });

function goCreate() {
  router.push('/demo/system/certificate/new/edit');
}

async function onDeleteConfirm() {
  try {
    const result = await mgr.onDeleteConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: result.message,
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

onMounted(() => {
  mgr.loadTemplates();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <CertificateSearchBar
      :category-options="mgr.categoryOptions"
      :status-options="mgr.statusOptions"
      @search="mgr.onSearch"
      @reset="mgr.onReset"
    />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建模板"
            icon="pi pi-plus"
            severity="primary"
            @click="goCreate"
          />
        </template>
      </PrimeToolbar>

      <CertificateTable
        :templates="mgr.templates"
        :loading="mgr.loading"
        :total-records="mgr.totalRecords"
        :page="mgr.page"
        :page-size="mgr.pageSize"
        :status-labels="mgr.statusLabels"
        :get-status-severity="mgr.getStatusSeverity"
        @page="mgr.onPage"
        @edit="(tpl) => router.push(`/demo/system/certificate/${tpl.id}/edit`)"
        @compose="
          (tpl) =>
            router.push(`/demo/system/certificate/compose?templateId=${tpl.id}`)
        "
        @delete="mgr.confirmDelete"
      />

      <CertificateDeleteDialog
        :visible="mgr.deleteDialogVisible"
        :template-name="mgr.deleteTarget?.name || ''"
        @update:visible="mgr.deleteDialogVisible = $event"
        @confirm="onDeleteConfirm"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 3: 创建子组件**

**CertificateSearchBar.vue**:

```vue
<script lang="ts" setup>
interface Option {
  label: string;
  value: string;
}
defineProps<{
  categoryOptions: Option[];
  statusOptions: Option[];
}>();
const emit = defineEmits<{
  search: [params: Record<string, string>];
  reset: [];
}>();

const keyword = ref('');
const category = ref('');
const status = ref('');

function onSearch() {
  emit('search', {
    keyword: keyword.value,
    category: category.value,
    status: status.value,
  });
}
function onReset() {
  keyword.value = '';
  category.value = '';
  status.value = '';
  emit('reset');
}
</script>

<template>
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col gap-1">
      <label class="text-muted-color text-sm">关键词</label>
      <PrimeInputText
        v-model="keyword"
        placeholder="模板名称"
        class="w-48"
        @keyup.enter="onSearch"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-muted-color text-sm">分类</label>
      <PrimeSelect
        v-model="category"
        :options="categoryOptions"
        placeholder="全部分类"
        class="w-32"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-muted-color text-sm">状态</label>
      <PrimeSelect
        v-model="status"
        :options="statusOptions"
        placeholder="全部状态"
        class="w-32"
      />
    </div>
    <PrimeButton label="搜索" icon="pi pi-search" @click="onSearch" />
    <PrimeButton
      label="重置"
      icon="pi pi-refresh"
      severity="secondary"
      outlined
      @click="onReset"
    />
  </div>
</template>
```

**CertificateTable.vue**:

```vue
<script lang="ts" setup>
import type { CertificateTemplate } from '@sakai/types/certificate';

defineProps<{
  templates: CertificateTemplate[];
  loading: boolean;
  totalRecords: number;
  page: number;
  pageSize: number;
  statusLabels: Record<string, string>;
  getStatusSeverity: (status: string) => 'warn' | 'success';
}>();

const emit = defineEmits<{
  page: [event: { page: number; rows: number }];
  edit: [template: CertificateTemplate];
  compose: [template: CertificateTemplate];
  delete: [template: CertificateTemplate];
}>();
</script>

<template>
  <PrimeDataTable
    :value="templates"
    :loading="loading"
    :paginator="true"
    :rows="pageSize"
    :first="(page - 1) * pageSize"
    :totalRecords="totalRecords"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate="共 {totalRecords} 条"
    :rowsPerPageOptions="[5, 10, 20]"
    @page="emit('page', $event)"
  >
    <PrimeColumn field="id" header="ID" style="width: 100px" />
    <PrimeColumn field="name" header="模板名称" sortable />
    <PrimeColumn field="category" header="分类" style="width: 100px">
      <template #body="{ data }">
        <PrimeTag :value="data.category === 'certificate' ? '证书' : '海报'" />
      </template>
    </PrimeColumn>
    <PrimeColumn header="尺寸" style="width: 130px">
      <template #body="{ data }">
        <span class="text-muted-color text-sm"
          >{{ data.width }} × {{ data.height }}</span
        >
      </template>
    </PrimeColumn>
    <PrimeColumn field="status" header="状态" style="width: 100px">
      <template #body="{ data }">
        <PrimeTag
          :severity="getStatusSeverity(data.status)"
          :value="statusLabels[data.status]"
        />
      </template>
    </PrimeColumn>
    <PrimeColumn field="updatedAt" header="更新时间" style="width: 180px">
      <template #body="{ data }">
        <span class="text-sm">{{
          new Date(data.updatedAt).toLocaleString('zh-CN')
        }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumn header="操作" style="width: 240px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <PrimeButton
            label="编辑"
            icon="pi pi-pencil"
            size="small"
            severity="primary"
            outlined
            @click="emit('edit', data)"
          />
          <PrimeButton
            label="合成"
            icon="pi pi-images"
            size="small"
            severity="success"
            outlined
            @click="emit('compose', data)"
          />
          <PrimeButton
            label="删除"
            icon="pi pi-trash"
            size="small"
            severity="danger"
            outlined
            @click="emit('delete', data)"
          />
        </div>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>
```

**CertificateDeleteDialog.vue**:

```vue
<script lang="ts" setup>
defineProps<{
  visible: boolean;
  templateName: string;
}>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [];
}>();
</script>

<template>
  <PrimeDialog
    :visible="visible"
    header="确认删除"
    :modal="true"
    :closable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <p>
      确定要删除模板"<strong>{{ templateName }}</strong
      >"吗？此操作不可撤销。
    </p>
    <template #footer>
      <PrimeButton
        label="取消"
        severity="secondary"
        outlined
        @click="emit('update:visible', false)"
      />
      <PrimeButton
        label="确认删除"
        severity="danger"
        @click="emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
```

- [ ] **Step 4: 类型检查**

```bash
pnpm typecheck
```

---

### Task 7: 创建 CertificateEditorService + 模板编辑页

**Files:**

- Create: `layers/sakai/app/services/CertificateEditorService.ts`
- Create: `layers/sakai/app/pages/demo/system/certificate/[id]/edit.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/CertificateEditForm.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/BasicInfoSection.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/TextElementItem.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/ImageElementItem.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/AddElementToolbar.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/CertificateCanvasPreview.vue`

- [ ] **Step 1: 创建 CertificateEditorService**

```typescript
// layers/sakai/app/services/CertificateEditorService.ts
import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateTemplate,
  ImageElement,
  TemplateElement,
  TextElement,
} from '@sakai/types/certificate';

let elementCounter = 0;
function genElementId(): string {
  return `el-${Date.now()}-${++elementCounter}`;
}

@Injectable()
export class CertificateEditorService {
  @Inject(CertificateService)
  private certService!: CertificateService;

  // 模板数据
  template: CertificateTemplate | null = null;
  loading = false;
  isDirty = false;
  isNew = false;

  // 元素管理
  selectedElementId: string | null = null;
  get selectedElement(): TemplateElement | undefined {
    if (!this.template || !this.selectedElementId) return undefined;
    return this.template.elements.find((e) => e.id === this.selectedElementId);
  }
  get elements(): TemplateElement[] {
    return this.template?.elements ?? [];
  }

  // 临时预览数据（仅当前会话，不保存）
  previewValues: Record<string, string> = {};
  previewFileMap: Record<string, string> = {}; // elementId → local blob URL

  // Canvas 重绘标记
  renderTick = 0;
  triggerRerender(): void {
    this.renderTick++;
  }

  // ===== 模板加载 =====

  async loadTemplate(id: string): Promise<void> {
    this.loading = true;
    try {
      if (id === 'new') {
        this.isNew = true;
        this.template = {
          id: '',
          name: '',
          description: '',
          category: 'certificate',
          backgroundUrl: '',
          width: 1200,
          height: 800,
          elements: [],
          status: 'draft',
          createdAt: '',
          updatedAt: '',
        };
      } else {
        this.isNew = false;
        this.template = await this.certService.getById(id);
      }
      this.selectedElementId = null;
      this.previewValues = {};
      this.previewFileMap = {};
      this.isDirty = false;
    } finally {
      this.loading = false;
    }
  }

  // ===== 元素操作 =====

  addTextElement(): void {
    if (!this.template) return;
    const el: TextElement = {
      type: 'text',
      id: genElementId(),
      name: '新文字',
      x: 100,
      y: 100 + this.template.elements.length * 50,
      width: 200,
      fontSize: 24,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      color: '#333333',
      fontWeight: 'normal',
      textAlign: 'left',
      verticalAlign: 'top',
      lineHeight: 1.5,
    };
    this.template.elements.push(el);
    this.selectedElementId = el.id;
    this.isDirty = true;
    this.triggerRerender();
  }

  addImageElement(): void {
    if (!this.template) return;
    const el: ImageElement = {
      type: 'image',
      id: genElementId(),
      name: '新图片',
      x: 100,
      y: 100 + this.template.elements.length * 50,
      width: 120,
      height: 120,
      fit: 'contain',
    };
    this.template.elements.push(el);
    this.selectedElementId = el.id;
    this.isDirty = true;
    this.triggerRerender();
  }

  updateElement(id: string, patch: Partial<TemplateElement>): void {
    if (!this.template) return;
    const idx = this.template.elements.findIndex((e) => e.id === id);
    if (idx === -1) return;
    (this.template.elements[idx] as any) = {
      ...this.template.elements[idx],
      ...patch,
    };
    this.isDirty = true;
    this.triggerRerender();
  }

  removeElement(id: string): void {
    if (!this.template) return;
    this.template.elements = this.template.elements.filter((e) => e.id !== id);
    if (this.selectedElementId === id) {
      this.selectedElementId = null;
    }
    this.isDirty = true;
    this.triggerRerender();
  }

  selectElement(id: string | null): void {
    this.selectedElementId = id;
    this.triggerRerender();
  }

  // ===== 临时预览 =====

  setPreviewValue(elementId: string, value: string): void {
    this.previewValues[elementId] = value;
    this.triggerRerender();
  }

  setPreviewFile(elementId: string, file: File | null): void {
    // 释放旧 URL
    if (this.previewFileMap[elementId]) {
      URL.revokeObjectURL(this.previewFileMap[elementId]);
    }
    if (file) {
      this.previewFileMap[elementId] = URL.createObjectURL(file);
      this.triggerRerender();
    } else {
      delete this.previewFileMap[elementId];
      this.triggerRerender();
    }
  }

  // 获取用于渲染的实际值（预览文字优先于 previewFiles）
  getRenderValues(): Record<string, string> {
    const values: Record<string, string> = {};
    for (const el of this.elements) {
      if (this.previewFileMap[el.id]) {
        values[el.id] = this.previewFileMap[el.id];
      } else if (this.previewValues[el.id]) {
        values[el.id] = this.previewValues[el.id];
      }
    }
    return values;
  }

  // ===== 保存 =====

  async save(): Promise<CertificateTemplate> {
    if (!this.template) throw new Error('没有模板数据');
    const data = {
      name: this.template.name,
      description: this.template.description,
      category: this.template.category,
      backgroundUrl: this.template.backgroundUrl,
      width: this.template.width,
      height: this.template.height,
      elements: this.template.elements,
      status: this.template.status,
    };
    let result: CertificateTemplate;
    if (this.isNew) {
      result = await this.certService.create(data);
    } else {
      result = await this.certService.update(this.template.id, data);
    }
    this.template = result;
    this.isDirty = false;
    this.isNew = false;
    // 清理预览数据
    this.previewValues = {};
    for (const url of Object.values(this.previewFileMap)) {
      URL.revokeObjectURL(url);
    }
    this.previewFileMap = {};
    return result;
  }
}
```

- [ ] **Step 2: 创建编辑页入口**

```vue
<!-- layers/sakai/app/pages/demo/system/certificate/[id]/edit.vue -->
<script lang="ts" setup>
import CertificateCanvasPreview from '@sakai/components/views/pages/certificate/CertificateCanvasPreview.vue';
import CertificateEditForm from '@sakai/components/views/pages/certificate/CertificateEditForm.vue';
import { CertificateEditorService } from '@sakai/services/CertificateEditorService';
import { CertificateService } from '@sakai/services/CertificateService';

declareProviders([CertificateService, CertificateEditorService]);

const route = useRoute();
const router = useRouter();
const toast = useToast();
const editor = useService(CertificateEditorService);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '模板配置' });

onMounted(async () => {
  const id = route.params.id as string;
  try {
    await editor.loadTemplate(id);
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '模板加载失败',
      life: 3000,
    });
    router.push('/demo/system/certificate');
  }
});

async function onSave() {
  try {
    const result = await editor.save();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '模板已保存',
      life: 3000,
    });
    if (editor.isNew) {
      router.replace(`/demo/system/certificate/${result.id}/edit`);
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '保存失败',
      life: 3000,
    });
  }
}
</script>

<template>
  <div v-if="editor.loading" class="flex h-64 items-center justify-center">
    <i class="pi pi-spin pi-spinner text-2xl" />
  </div>
  <div v-else-if="editor.template" class="flex h-[calc(100vh-140px)] gap-4">
    <!-- 左侧：配置面板 -->
    <div class="w-2/5 flex-shrink-0 overflow-y-auto">
      <CertificateEditForm :editor="editor" @save="onSave" />
    </div>
    <!-- 右侧：Canvas 预览 -->
    <div
      class="sticky top-0 flex w-3/5 flex-shrink-0 items-start justify-center"
    >
      <CertificateCanvasPreview :editor="editor" />
    </div>
  </div>
</template>
```

- [ ] **Step 3: 创建 CertificateEditForm 及其子组件**

（由于子组件较长，此处只给出关键结构和接口，实际编写时参考项目中已有的表单组件模式。）

**CertificateEditForm.vue** — 包裹所有配置段，接收 `editor` prop，传出 `@save` 事件。

**BasicInfoSection.vue** — 基本信息表单段：

- 模板名称 (InputText)
- 描述 (Textarea)
- 分类 (Select: 证书/海报)
- 底图 URL (InputText)
- 宽 × 高 (InputNumber × 2)
- 状态 (Select: 草稿/已发布)

**TextElementItem.vue** — 单个文字元素行：

- Props: `element: TextElement`, `isSelected: boolean`, `previewValue: string`
- Emits: `select`, `update`, `remove`, `update:previewValue`
- 收起时显示：元素名称 + edit/delete 按钮
- 展开时显示全部属性表单（x, y, width, fontSize, fontFamily, color, fontWeight, textAlign, verticalAlign, lineHeight, maxLines, rotation, backgroundColor, borderRadius, padding, bindingKey）+ 临时预览文字输入框

**ImageElementItem.vue** — 单个图片元素行：

- Props: `element: ImageElement`, `isSelected: boolean`, `previewFile: string | null`
- Emits: `select`, `update`, `remove`, `file-select`
- 收起时显示：元素名称 + edit/delete 按钮
- 展开时显示全部属性表单（x, y, width, height, fit, borderRadius, opacity, bindingKey）+ 临时预览图片上传

**AddElementToolbar.vue** — 底部按钮组：

- Emits: `add-text`, `add-image`
- 两个按钮："+添加文字" 和 "+添加图片"

**CertificateCanvasPreview.vue** — Canvas 预览组件：

- Props: `editor: CertificateEditorService`
- 内部 `ref<HTMLCanvasElement>` 引用 Canvas 元素
- `watch(editor.renderTick)` → 调用 `renderToCanvas(canvas, editor.template, editor.getRenderValues())`
- 选中元素时在 Canvas 上绘制高亮边框

- [ ] **Step 4: 类型检查**

```bash
pnpm typecheck
```

---

### Task 8: 创建合成下载页

**Files:**

- Create: `layers/sakai/app/pages/demo/system/certificate/compose.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/ComposeInputForm.vue`
- Create: `layers/sakai/app/components/views/pages/certificate/ComposeDownloadPanel.vue`

- [ ] **Step 1: 创建合成页入口**

```vue
<!-- layers/sakai/app/pages/demo/system/certificate/compose.vue -->
<script lang="ts" setup>
import ComposeDownloadPanel from '@sakai/components/views/pages/certificate/ComposeDownloadPanel.vue';
import ComposeInputForm from '@sakai/components/views/pages/certificate/ComposeInputForm.vue';
import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateOption,
  CertificateTemplate,
} from '@sakai/types/certificate';

declareProviders([CertificateService]);

const certService = useService(CertificateService);
const route = useRoute();
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '合成下载' });

// 模板列表
const templateOptions = ref<CertificateOption[]>([]);
const selectedTemplateId = ref((route.query.templateId as string) || '');
const currentTemplate = ref<CertificateTemplate | null>(null);

// 用户输入的实际值
const actualValues = ref<Record<string, string>>({});

// Canvas 引用
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const renderTick = ref(0);

onMounted(async () => {
  try {
    templateOptions.value = await certService.getOptions();
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '加载模板列表失败',
      life: 3000,
    });
  }
  if (selectedTemplateId.value) {
    await loadTemplate(selectedTemplateId.value);
  }
});

async function loadTemplate(id: string) {
  try {
    currentTemplate.value = await certService.getById(id);
    actualValues.value = {};
    renderTick.value++;
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '加载模板失败',
      life: 3000,
    });
  }
}

function onTemplateChange(id: string) {
  selectedTemplateId.value = id;
  loadTemplate(id);
}

function onInputChange(elementId: string, value: string) {
  actualValues.value[elementId] = value;
  renderTick.value++;
}

function onFileChange(elementId: string, file: File | null) {
  if (file) {
    const url = URL.createObjectURL(file);
    // 释放旧 URL
    if (
      actualValues.value[elementId] &&
      actualValues.value[elementId].startsWith('blob:')
    ) {
      URL.revokeObjectURL(actualValues.value[elementId]);
    }
    actualValues.value[elementId] = url;
  } else {
    if (
      actualValues.value[elementId] &&
      actualValues.value[elementId].startsWith('blob:')
    ) {
      URL.revokeObjectURL(actualValues.value[elementId]);
    }
    delete actualValues.value[elementId];
  }
  renderTick.value++;
}

// 渲染预览
watch(renderTick, () => {
  nextTick(() => {
    if (!previewCanvas.value || !currentTemplate.value) return;
    renderToCanvas(
      previewCanvas.value,
      currentTemplate.value,
      actualValues.value,
    );
  });
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <!-- 左侧：输入表单 -->
      <div class="w-2/5 flex-shrink-0">
        <div class="card p-4!">
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium">选择模板</label>
            <PrimeSelect
              v-model="selectedTemplateId"
              :options="templateOptions"
              option-label="label"
              option-value="value"
              placeholder="请选择模板"
              class="w-full"
              @change="onTemplateChange"
            />
          </div>
          <ComposeInputForm
            v-if="currentTemplate"
            :elements="currentTemplate.elements"
            :values="actualValues"
            @input-change="onInputChange"
            @file-change="onFileChange"
          />
        </div>
      </div>
      <!-- 右侧：Canvas 预览 + 下载 -->
      <div class="w-3/5 flex-shrink-0">
        <div class="card flex flex-col items-center gap-4 p-4!">
          <canvas
            ref="previewCanvas"
            class="border-surface max-w-full rounded border"
          />
          <ComposeDownloadPanel
            :canvas="previewCanvas"
            :template-name="currentTemplate?.name ?? '合成图'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: 创建子组件**

**ComposeInputForm.vue** — 根据模板 elements 动态生成输入项：

- 遍历 `elements`，对每个文字元素渲染 `<label>` + `<PrimeInputText>`（双向绑定 `values[element.id]`）
- 对每个图片元素渲染 `<label>` + `<input type="file" accept="image/*">`
- Props: `elements: TemplateElement[]`, `values: Record<string, string>`
- Emits: `inputChange(elementId, value)`, `fileChange(elementId, file | null)`

**ComposeDownloadPanel.vue** — 下载操作区：

- Props: `canvas: HTMLCanvasElement | null`, `templateName: string`
- 两个按钮："下载 PNG" 和 "下载 JPEG"
- 点击后调用 `canvasToBlob()` → `downloadBlob()`

- [ ] **Step 3: 类型检查**

```bash
pnpm typecheck
```

---

### Task 9: 注册菜单

**Files:**

- Modify: `app/config/menu/system-menu.ts`

- [ ] **Step 1: 在系统管理菜单中添加"系统工具"分组**

在 `system-menu.ts` 的 `menuItems` 数组末尾添加：

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
  ],
},
```

如果短链工具也要放在这里，一并调整。

---

### Task 10: 验证与收尾

- [ ] **Step 1: 类型检查**

```bash
pnpm typecheck
```

- [ ] **Step 2: 代码格式化**

```bash
pnpm lint:fix
```

- [ ] **Step 3: 运行开发服务器验证**

```bash
pnpm dev
```

打开浏览器验证：

1. 访问 `/demo/system/certificate` → 查看模板列表
2. 点击"新建模板" → 配置元素 → 保存
3. 点击"合成" → 选择模板 → 填入数据 → 预览 → 下载

- [ ] **Step 4: 清理预览文件 URL**

检查 `CertificateEditorService` 在 `beforeUnmount` 时是否调用了 `URL.revokeObjectURL` 清理临时 URL（由组件负责）。

---

## 实施顺序与依赖

```
Task 1 (类型) ──→ Task 2 (Mock数据) ──→ Task 3 (Mock Handler)
                      ↓
Task 4 (CertificateService)
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
Task 5 (Canvas Renderer)   Task 6 (列表页 + MgrService)
          ↓                       ↓
Task 7 (编辑页 + EditorService)   Task 9 (菜单注册)
          ↓
Task 8 (合成页)
          ↓
Task 10 (验证与收尾)
```

说明：

- Task 2-3, Task 2-4 之间可以并行？Task 4 依赖 Task 1（类型），Task 2（mock 数据）可与 Task 1 并行
- Task 5（Canvas）和 Task 6（列表页）可并行
- Task 7 依赖 Task 5（模板编辑页使用 Canvas 预览）
- Task 8 依赖 Task 5 和 Task 7（合成页复用 Canvas 渲染 + 借用模板加载逻辑）
- Task 9 独立，可在 Task 6-8 任何阶段完成
