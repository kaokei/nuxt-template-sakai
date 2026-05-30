# 小程序码/链接生成工具 — 设计文档

> 日期：2026-05-30
> 状态：设计已确认，待实现

## 一、需求概述

在现有 Nuxt SPA 项目中新增一个小程序码和小程序链接生成工具页面，供业务人员使用。

### 核心问题

微信小程序码/链接的生成需要 `appid` + `secret`（AK/SK），这些凭证不应暴露给业务人员。因此需要一个工具页面，业务人员在前端填写参数，后端代理调用微信 API。

### 使用场景

- 运营人员需要为某个活动页面生成小程序码，贴在宣传物料上
- 市场人员需要生成 URL Link 放在短信/邮件中引导用户打开小程序
- 开发人员需要在不同环境（正式版/体验版）生成测试用码

## 二、功能范围

### 支持的生成类型（5 种）

| 类型             | type 值          | API               | 限额  | 适用场景             |
| ---------------- | ---------------- | ----------------- | ----- | -------------------- |
| 小程序码（有限） | `wxacode`        | getwxacode        | 10 万 | 正式业务，样式可定制 |
| 小程序码（无限） | `wxacodeunlimit` | getwxacodeunlimit | 不限  | 营销推广，需传 scene |
| 普通二维码       | `qrcode`         | createwxaqrcode   | 10 万 | 简单二维码样式       |
| URL Scheme       | `scheme`         | generatescheme    | -     | 短信/App 内跳转      |
| URL Link         | `urllink`        | generate_urllink  | -     | 短信/邮件/网页跳转   |

### 核心特性

- **统一表单** — 一份参数（路径 + query），通过多个按钮一键生成任意类型
- **小程序选择器** — 支持多个小程序的 appid 选择（后端维护配置）
- **会话生成记录** — 页面内存中积累生成结果，刷新即清空，不持久化
- **高级选项折叠** — 高级参数（宽度、颜色、有效期等）默认折叠
- **智能校验** — 根据生成类型校验对应必需参数

### 不做的

- 不持久化生成记录到后端
- 前端不管理 appid/secret
- 不提供 CRUD 管理（不是管理工具，是生成工具）

## 三、架构设计

### 文件结构

```
layers/sakai/app/pages/demo/system/miniapp/index.vue  ← 页面入口
layers/sakai/app/services/MiniAppService.ts            ← 数据服务（API 调用）
layers/sakai/app/services/MiniAppMgrService.ts         ← 页面状态（表单/结果/小程序列表）
app/config/menu/system-menu.ts                         ← 菜单注册（新增 1 条）
mocks/handlers/miniapp.ts                              ← MSW Mock 处理器
mocks/data/miniapp.ts                                  ← Mock 数据
```

### 数据流

```
1. 打开页面
   用户 → MiniAppMgrService.loadMiniApps()
        → MiniAppService.getMiniApps()
        → GET /api/miniapps
        ← [{ id, name, appid }]

2. 填写表单 + 点击生成按钮
   用户 → MiniAppMgrService.generate('wxacode')
        → 前端参数校验
        → MiniAppService.generate({ appId, type, path, ... })
        → POST /api/miniapp/generate
        ← { imageUrl } 或 { link }
        → mgr.records.push(record)

3. 下载/复制
   用户 → mgr.download(url) 或 navigator.clipboard.writeText(link)
```

### 菜单注册

在 `system-menu.ts` 的「系统管理」菜单组中新增：

```ts
{ label: '小程序工具', icon: 'pi pi-fw pi-qrcode', to: '/demo/system/miniapp' }
```

位置：`短链工具` 和 `模板合成` 之后。

## 四、UI 布局

### 页面结构（从上到下）

```
┌─ 页面标题：小程序码/链接生成工具 ─────────────────────┐
├─ 选择小程序：[下拉框]    环境版本：[正式版 ▼]          │
├─ 页面路径：[input_______________] (必填)             │
│  URL参数：[input_______________] (可选)              │
│  ▶ 高级选项（可展开）                                │
│    ┌─ 二维码宽度 / 透明底色 / 链接有效期 / scene ────┐│
├─ 生成按钮行：                                       │
│  [生成小程序码(有限)] [生成小程序码(无限)] [生成二维码] │
│  [生成URL Scheme] [生成URL Link]                    │
├─ 生成结果（本次会话）             共 N 条              │
│  ┌─ 类型 │ 参数摘要 │ 结果预览 │ 下载/复制 ──────────┐│
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## 五、API 设计

### GET /api/miniapps

获取当前可用的小程序列表。

**Response 200:**

```json
{
  "code": 0,
  "data": [
    { "id": "wx001", "name": "我的商城", "appid": "wxabc123def456" },
    { "id": "wx002", "name": "内部OA", "appid": "wxghi789jkl012" }
  ]
}
```

### POST /api/miniapp/generate

生成小程序码或链接。

**Request Body:**

```json
{
  "appId": "wx001",
  "type": "wxacode",
  "path": "pages/goods/detail",
  "query": "id=123",
  "envVersion": "release",
  "width": 430,
  "isHyaline": false,
  "scene": "abc123",
  "expireType": "permanent"
}
```

**参数说明：**

| 字段         | 类型    | 必填 | 适用范围                         | 默认值      |
| ------------ | ------- | ---- | -------------------------------- | ----------- |
| `appId`      | string  | ✓    | 全部                             | -           |
| `type`       | string  | ✓    | 全部                             | -           |
| `path`       | string  | ✓    | wxacode, qrcode, scheme, urllink | -           |
| `query`      | string  | ✗    | scheme, urllink                  | ""          |
| `envVersion` | string  | ✗    | wxacodeunlimit, scheme, urllink  | "release"   |
| `width`      | number  | ✗    | wxacode, wxacodeunlimit, qrcode  | 430         |
| `isHyaline`  | boolean | ✗    | wxacode, wxacodeunlimit          | false       |
| `scene`      | string  | ✓    | wxacodeunlimit                   | -           |
| `expireType` | string  | ✗    | scheme, urllink                  | "permanent" |

**Response 200（二维码类型）：**

```json
{
  "code": 0,
  "data": {
    "type": "wxacode",
    "imageUrl": "data:image/png;base64,iVBOR...",
    "contentType": "image/png"
  }
}
```

**Response 200（链接类型）：**

```json
{
  "code": 0,
  "data": {
    "type": "scheme",
    "link": "weixin://dl/business/?t=xxx",
    "contentType": "text/plain"
  }
}
```

**Response 错误：**

```json
{
  "code": 40001,
  "message": "参数校验失败：path 不能为空"
}
```

### 错误码

| code  | 含义              | 前端处理                              |
| ----- | ----------------- | ------------------------------------- |
| 0     | 成功              | -                                     |
| 40001 | 参数校验失败      | 表单字段标红 + Toast                  |
| 40100 | access_token 过期 | Toast: "授权已过期，请刷新页面重试"   |
| 42900 | 配额已用完        | Toast: "生成配额已用完，请联系管理员" |
| 50000 | 微信接口返回错误  | Toast: 显示微信原始错误信息           |

## 六、核心服务设计

### MiniAppService

```typescript
@Injectable()
class MiniAppService {
  // 获取小程序列表
  async getMiniApps(): Promise<MiniApp[]>;

  // 生成码/链接
  async generate(params: GenerateParams): Promise<GenerateResult>;
}
```

### MiniAppMgrService

```typescript
@Injectable()
class MiniAppMgrService {
  // --- 小程序列表 ---
  miniApps: MiniApp[];
  selectedAppId: string;

  // --- 表单参数 ---
  formPath: string; // 页面路径（必填）
  formQuery: string; // URL 参数（可选）
  formEnvVersion: string; // release | trial | develop（默认 release）
  formWidth: number; // 默认 430
  formIsHyaline: boolean; // 默认 false
  formScene: string; // 仅无限码必填
  formExpireType: string; // 仅 Scheme/Link
  advancedExpanded: boolean; // 高级选项是否展开

  // --- 生成状态 ---
  generating: boolean; // 加载中
  records: GenerateRecord[]; // 本次会话的生成记录

  // --- 方法 ---
  async loadMiniApps(): Promise<void>;
  async generate(type: GenerateType): Promise<void>;
  validateFields(type: GenerateType): boolean;
  downloadImage(record: GenerateRecord): void;
  copyLink(record: GenerateRecord): void;
}
```

### GenerateRecord 类型

```typescript
interface GenerateRecord {
  id: string; // 唯一 ID（nanoid）
  type: GenerateType; // 生成类型
  miniAppName: string; // 小程序名称
  params: Record<string, any>; // 本次生成使用的参数
  result: {
    imageUrl?: string; // 二维码图片
    link?: string; // Scheme/Link 链接
    contentType: 'image/png' | 'text/plain';
  };
  createdAt: number; // 时间戳
}
```

## 七、参数校验规则

| 校验项             | 规则                    | 触发条件                     |
| ------------------ | ----------------------- | ---------------------------- |
| 未选择小程序       | Toast: "请先选择小程序" | `selectedAppId` 为空         |
| path 为空          | 输入框红色边框 + 提示   | 有限码、二维码、Scheme、Link |
| scene 为空         | 输入框红色边框 + 提示   | 仅 `wxacodeunlimit`          |
| width 超出范围     | 自动修正到 280~1280     | 二维码类型                   |
| page（无限码）为空 | 输入框红色边框 + 提示   | 仅 `wxacodeunlimit`          |

## 八、Mock 设计

### Mock 数据（mocks/data/miniapp.ts）

提供 3 个模拟小程序，以及一个 SVG 格式的占位二维码图片。

### Mock Handler（mocks/handlers/miniapp.ts）

- `GET /api/miniapps` → 返回模拟小程序列表
- `POST /api/miniapp/generate` → 根据 type 返回占位图或模拟链接，模拟 1 秒延迟
- 错误场景：path 为空 → 400，scene 为空（无限码）→ 400

### 占位图策略

使用内嵌 SVG 转 base64 作为占位二维码图，无需外部图片资源，开发阶段即可正常展示 UI。

## 九、错误处理与边界状态

### 空状态

- 小程序列表为空 → 显示 "暂无可选小程序，请联系管理员"
- 会话记录为空 → 不显示结果区域

### 加载状态

- 加载小程序列表 → 下拉框 loading
- 生成中 → 按钮 loading + 禁用（防重复点击）
- 下载图片中 → 按钮文字变为 "下载中..."

### 错误反馈

- 前端校验失败 → 表单字段标红 + Toast
- API 返回错误 → Toast 显示错误信息
- 网络超时（30s）→ Toast: "网络请求超时，请重试"

### 权限控制

- 页面访问：通过 `MenuService` 过滤菜单权限
- 不额外使用 `v-permission` 指令（有菜单权限即可使用全部功能）

## 十、与项目规范的对应

| 规范      | 本方案对应                                              |
| --------- | ------------------------------------------------------- |
| DI 模式   | `declareProviders([MiniAppService, MiniAppMgrService])` |
| 服务分层  | MiniAppService（数据）+ MiniAppMgrService（状态）       |
| 页面布局  | `sakai-sidebar`，`definePageMeta`                       |
| 组件规范  | PrimeVue 组件前缀 `Prime`，sakai 层组件显式 import      |
| Mock 方案 | MSW 开发时拦截，后续替换真实接口                        |
| 菜单系统  | `system-menu.ts` 新增条目                               |
| 命名约定  | kebab-case 文件，PascalCase 组件                        |

## 十一、测试策略

- **类型检查**：`pnpm typecheck` 通过
- **单元测试**：`MiniAppMgrService.validateFields()` 各类型参数校验逻辑
- **手动验证**：开发服务器中测试 5 种类型的生成流程、Mock 返回、会话记录
