# 素材管理工具设计文档

> 日期：2026-05-30 | 状态：待评审 | 方案：B（实用增强）

---

## 一、需求概述

在系统管理模块中新增「素材管理」工具。核心功能：上传任意文件到 OSS 云存储，生成唯一访问链接，支持后续重新上传更新文件但链接地址不变。

### 核心场景

对外分发的静态资源（如 App 安装包、产品手册 PDF、官网图片），更新后链接不变，发给外部的用户/客户始终能用最新版本。

### 扩展功能（方案 B）

| 扩展点           | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| 文件预览         | 图片/视频/PDF 在线预览，其他类型显示文件图标+类型标识      |
| 批量上传         | 一次选多个文件，统一打标签和设置浏览器行为                 |
| 一键复制链接     | 列表中直接复制，Toast 提示                                 |
| 浏览器行为选择   | 上传时选择 `inline`（在线预览）或 `attachment`（触发下载） |
| 场景隔离         | 通过「场景」概念区分不同项目/用途的资源分组                |
| 文件类型快速筛选 | 顶部按类型（图片/文档/压缩包/视频/音频/其他）Tab 切换      |
| 多标签           | 每个文件可打多个标签，按标签筛选                           |
| 导出列表 CSV     | 当前筛选结果导出                                           |

### 不做

- 版本历史与回滚
- 访问密码保护 / 登录鉴权
- 下载次数统计
- 自定义域名
- 文件夹层级管理
- CDN 缓存刷新、水印等重型 CDN 平台功能

---

## 二、核心概念

### 概念映射

```
用户视角                    技术实现
─────────                  ─────────
场景（Scene）         →    OSS Bucket 下的一级文件夹前缀
素材（Asset）         →    场景文件夹下的具体文件

示例：
  场景「App发布」     →    /app-release/
  场景「活动素材」    →    /campaign/
  场景「官网资源」    →    /website/
```

- Bucket 本身通过**后端接口**返回可用桶列表，前端只负责展示和选择
- 用户完全不感知 Bucket 存在，只看到场景
- 不同场景的素材天然隔离

---

## 三、文件结构

所有代码存放在 `layers/sakai/app/` 下：

```
layers/sakai/app/
├── pages/demo/system/asset/
│   ├── index.vue                        → 场景列表页
│   └── [sceneId].vue                    → 素材管理页（动态路由）
├── components/views/pages/asset/
│   ├── SceneFormDialog.vue              → 新建/编辑场景弹窗
│   ├── SceneDeleteDialog.vue            → 删除场景确认弹窗
│   ├── AssetFormDialog.vue              → 上传/编辑素材弹窗
│   ├── AssetPreviewDialog.vue           → 文件预览弹窗
│   ├── AssetDeleteDialog.vue            → 删除素材确认弹窗
│   └── AssetBatchUploadDialog.vue       → 批量上传弹窗
├── services/
│   ├── SceneService.ts                  → 场景数据服务
│   ├── SceneMgrService.ts               → 场景 UI 状态服务
│   ├── AssetService.ts                  → 素材数据服务
│   └── AssetMgrService.ts               → 素材 UI 状态服务
└── types/
    └── asset.ts                         → 类型定义
```

---

## 四、类型定义

```typescript
// layers/sakai/app/types/asset.ts

/** 存储桶 */
export interface Bucket {
  id: string;
  name: string;
  region?: string;
}

/** 场景（用户可见的分组概念） */
export interface Scene {
  id: string;
  name: string;
  bucketId: string; // 绑定的存储桶（创建后不可修改）
  description?: string;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 素材 */
export interface Asset {
  id: string;
  fileName: string; // 原始文件名
  title?: string; // 备注标题
  description?: string; // 描述
  tags: string[]; // 标签列表
  fileSize: number; // 字节
  mimeType: string;
  md5: string;
  behavior: MediaBehavior; // 浏览器行为
  sceneId: string; // 所属场景
  url: string; // 唯一访问链接
  createdAt: string;
  updatedAt: string;
}

/** 素材查询参数 */
export interface AssetQuery {
  keyword?: string;
  tags?: string[];
  mimeCategory?: MimeCategory;
}

/** 浏览器行为 */
export type MediaBehavior = 'inline' | 'attachment';

/** MIME 大类（用于快速筛选 Tab） */
export type MimeCategory =
  | 'image'
  | 'document'
  | 'archive'
  | 'video'
  | 'audio'
  | 'other';
```

---

## 五、API 接口

### 桶列表

| 方法 | 路径               | 说明               |
| ---- | ------------------ | ------------------ |
| GET  | `/api/oss/buckets` | 获取可用存储桶列表 |

### 场景 CRUD

| 方法   | 路径              | 说明                                                |
| ------ | ----------------- | --------------------------------------------------- |
| GET    | `/api/scenes`     | 场景列表                                            |
| POST   | `/api/scenes`     | 创建场景（body: `{ name, bucketId, description }`） |
| PUT    | `/api/scenes/:id` | 编辑场景（bucketId 不可修改）                       |
| DELETE | `/api/scenes/:id` | 删除场景                                            |

### 素材 CRUD

| 方法   | 路径                                       | 说明                                               |
| ------ | ------------------------------------------ | -------------------------------------------------- |
| GET    | `/api/scenes/:sceneId/assets`              | 素材列表（query: `?keyword=&tags=&mimeCategory=`） |
| POST   | `/api/scenes/:sceneId/assets`              | 上传单个素材（multipart）                          |
| POST   | `/api/scenes/:sceneId/assets/batch`        | 批量上传素材（multipart）                          |
| PUT    | `/api/scenes/:sceneId/assets/:id`          | 更新素材（文件或元信息）                           |
| DELETE | `/api/scenes/:sceneId/assets/:id`          | 删除单个素材                                       |
| POST   | `/api/scenes/:sceneId/assets/batch-delete` | 批量删除素材                                       |
| GET    | `/api/scenes/:sceneId/assets/tags`         | 获取该场景下所有已用标签列表                       |

---

## 六、页面设计

### 6.1 路由

```
/demo/system/asset              → 场景列表页
/demo/system/asset/[sceneId]    → 指定场景下的素材管理页
```

### 6.2 场景列表页 (`/demo/system/asset/index.vue`)

服务绑定：`declareProviders([SceneService, SceneMgrService])`

```
┌─────────────────────────────────────────────────┐
│  [+新建场景]                                      │
├─────────────────────────────────────────────────┤
│  PrimeDataTable                                  │
│  ┌────┬────────┬──────────┬────────┬──────────┐ │
│  │ 名称 │ 描述    │ 素材数量   │ 创建时间 │ 操作     │ │
│  │     │        │          │        │ [编辑] [删除] │
│  └────┴────────┴──────────┴────────┴──────────┘ │
│  分页器                                           │
└─────────────────────────────────────────────────┘
```

### 6.3 素材管理页 (`/demo/system/asset/[sceneId].vue`)

服务绑定：`declareProviders([AssetService, AssetMgrService])`

```
┌─────────────────────────────────────────────────┐
│  场景切换器：[当前场景 ▼]                          │
├─────────────────────────────────────────────────┤
│  搜索栏                                          │
│  [关键词] [标签筛选] [类型Tab]  [搜索] [重置]     │
├─────────────────────────────────────────────────┤
│  工具栏                                          │
│  [+上传素材] [批量上传] [批量删除]      [导出CSV] │
├─────────────────────────────────────────────────┤
│  PrimeDataTable（多选）                           │
│  ┌────┬──────┬──────┬────┬────┬──────┬──────┐   │
│  │ ☐  │ 文件名  │ 标题  │ 大小 │ 类型 │ 行为  │ 标签  │...│
│  │   │ 操作：[复制链接] [预览/下载] [编辑] [删除]│   │
│  └────┴──────┴──────┴────┴────┴──────┴──────┘   │
│  分页器                                           │
└─────────────────────────────────────────────────┘
```

- **场景切换器**：下拉选择其他场景，切换后路由变化、列表刷新
- **类型筛选 Tab**：全部 | 图片 | 文档 | 压缩包 | 视频 | 音频 | 其他
- **行为列**：图标区分 inline（👁 预览）和 attachment（⬇ 下载）

#### 类型筛选 Tab MIME 匹配规则

| Tab    | MIME 匹配规则                                                  |
| ------ | -------------------------------------------------------------- |
| 全部   | -                                                              |
| 图片   | image/\*                                                       |
| 文档   | application/pdf, text/_, application/msword, application/vnd._ |
| 压缩包 | application/zip, application/gzip, application/x-_compress_    |
| 视频   | video/\*                                                       |
| 音频   | audio/\*                                                       |
| 其他   | 未匹配以上所有                                                 |

---

## 七、弹窗设计

### 7.1 场景新建/编辑弹窗 (`SceneFormDialog`)

- 场景名称（必填）
- **存储桶**（下拉选择，接口获取。新建时可选择，编辑时只读展示）
- 描述（可选）

编辑模式下存储桶字段变为只读文本，不可修改。

### 7.2 场景删除弹窗 (`SceneDeleteDialog`)

展示场景下素材数量，提示「删除场景将同时删除所有素材文件，不可恢复」。

### 7.3 素材上传/编辑弹窗 (`AssetFormDialog`)

- 文件上传区域（拖拽/点击，编辑模式隐藏）
- 文件名（自动填充，只读）
- 标题（可选）
- 描述（可选）
- 标签（多选输入，支持自动补全已有标签）
- **浏览器行为**（必选，默认值按 MIME 类型推断）
  - 可预览类型（image/_, video/_, audio/_, application/pdf, text/_）默认 `inline`
  - 其他类型默认 `attachment`
- 自动获取信息（只读展示）：文件大小、MIME 类型、MD5

编辑模式：文件上传区域隐藏，其他字段可修改。更新时重新上传文件即覆盖。

### 7.4 批量上传弹窗 (`AssetBatchUploadDialog`)

- 文件选择区域（多选，拖拽/点击）
- 已选文件列表（文件名、大小、状态）
- 统一标签设置
- 统一浏览器行为设置

批量上传时，每个文件单独生成唯一链接。标题默认为各自文件名。

### 7.5 素材预览弹窗 (`AssetPreviewDialog`)

- 可预览类型（image/_, video/_, audio/_, application/pdf, text/_）：直接内嵌显示
- 不可预览类型：显示文件图标 + MIME 类型 +「打开原文件」按钮
- 底部展示唯一链接 + 复制按钮

### 7.6 素材删除弹窗 (`AssetDeleteDialog`)

支持单个删除和批量删除。单个删除展示素材名，批量删除展示数量。

---

## 八、服务设计

### 服务分层

| 服务              | 职责                                         | 复用范围   |
| ----------------- | -------------------------------------------- | ---------- |
| `SceneService`    | 场景 CRUD（HTTP 调用）                       | 场景列表页 |
| `SceneMgrService` | 场景列表页 UI 状态（弹窗显隐、选中项）       | 场景列表页 |
| `AssetService`    | 素材 CRUD + 批量操作（HTTP 调用）            | 素材管理页 |
| `AssetMgrService` | 素材管理页 UI 状态（搜索、分页、标签、弹窗） | 素材管理页 |

### 数据流示例（素材上传）

```
AssetMgrService.openUpload()
  → this.formDialogVisible = true

用户填写表单 + 选择文件 → 点击"上传"

AssetMgrService.onUpload(file, formData)
  → this.loading = true
  → await AssetService.create(sceneId, file, formData)
      → POST /api/scenes/:sceneId/assets (multipart)
  → this.loading = false
  → this.formDialogVisible = false
  → this.loadAssets()  // 刷新列表
  → 组件端显示 toast
```

---

## 九、错误处理

| 场景                     | 前端处理                                             |
| ------------------------ | ---------------------------------------------------- |
| 网络错误 / 超时          | toast 提示「上传失败，请检查网络」，弹窗不关闭       |
| 文件过大                 | 上传前前端校验（单文件最大 50MB），拦截提示          |
| Bucket 列表获取失败      | 场景新建弹窗中 Bucket 下拉显示「加载失败」，禁止提交 |
| 场景下存在素材时删除场景 | 后端返回错误码，前端提示「请先清空场景内素材」       |
| 同名素材重复创建         | 后端返回 409，前端提示「文件名已存在」               |

---

## 十、菜单注册

在 `app/config/menu/system-menu.ts` 中系统管理菜单下新增：

```typescript
{
  label: '素材管理',
  icon: 'pi pi-fw pi-folder-open',
  to: '/demo/system/asset',
}
```

---

## 十一、Mock 设计

### 模拟数据文件

```
mocks/
├── data/
│   ├── buckets.ts        → Bucket[] 桶列表（2-3 个预置桶）
│   ├── scenes.ts         → Scene[] 场景列表（3-4 个预置场景）
│   └── assets.ts         → Asset[] 素材列表（每个场景 3-5 条）
└── handlers/
    ├── buckets.ts        → GET /api/oss/buckets
    ├── scenes.ts         → GET/POST/PUT/DELETE /api/scenes/*
    └── assets.ts         → GET/POST/PUT/DELETE /api/scenes/:sceneId/assets/*
```

### 预置数据

- **桶**：`my-cdn-prod`（华东1）、`my-cdn-test`（华北2）
- **场景**：App发布、活动素材、官网资源，分别绑定不同桶
- **素材**：覆盖各 MIME 类型（apk、png、pdf、mp4、zip、html 等），行为混合（inline/attachment）

### 上传 Mock 处理

1. 接收 FormData
2. 提取字段，生成模拟值（随机大小、模拟 MD5、唯一链接）
3. 返回新 Asset 对象

---

## 十二、待定项

无。
