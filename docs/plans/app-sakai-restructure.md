# app/ → layers/sakai/ 文件重组计划

## 核心约定

- `~` → 始终解析到项目根 `app/`，sakai 层内引用自身文件必须使用 `@sakai/`
- `@sakai/` → 始终解析到 `layers/sakai/app/`
- 组件自动导入配置保持在根 `nuxt.config.ts` 不变，sakai 层不加额外配置

## 一、文件移动清单（共 40 个文件）

### types/ → `layers/sakai/app/types/`（12 个）

```
app/types/area-code.ts
app/types/announcement.ts
app/types/auth.ts
app/types/backup.ts
app/types/common.ts
app/types/feature-flag.ts
app/types/job.ts
app/types/menu.ts
app/types/notification.ts
app/types/post.ts
app/types/sys-param.ts
app/types/user.ts
```

### services/ → `layers/sakai/app/services/`（9 个）

```
app/services/auth.service.ts
app/services/countdown.service.ts
app/services/feature-flag.service.ts
app/services/menu.service.ts
app/services/router.service.ts
app/services/search.service.ts
app/services/storage.service.ts
app/services/user.service.ts
app/services/UserNotificationService.ts
```

### plugins/ → `layers/sakai/app/plugins/`（7 个）

```
app/plugins/01.msw.client.ts
app/plugins/auth.provider.ts
app/plugins/feature-flag.provider.ts
app/plugins/global-services.provider.ts
app/plugins/menu.provider.ts
app/plugins/my-directive.ts
app/plugins/user-notification.provider.ts
```

### middleware/ → `layers/sakai/app/middleware/`（1 个）

```
app/middleware/auth.ts
```

### config/ → `layers/sakai/app/config/`（3 个）

```
app/config/menu/showcase-menu.ts
app/config/menu/system-menu.ts
app/config/menu/workbench-menu.ts
```

### directives/ → `layers/sakai/app/directives/`（2 个）

```
app/directives/focus.ts
app/directives/v-permission.ts
```

### components/common/ → `layers/sakai/app/components/common/`（5 个）

```
app/components/common/DeptMultiPicker.vue
app/components/common/DeptPicker.vue
app/components/common/TagInput.vue
app/components/common/UserMultiPicker.vue
app/components/common/UserPicker.vue
```

### utils/ → `layers/sakai/app/utils/`（1 个）

```
app/utils/canvas-renderer.ts
```

## 二、保留在 app/ 的模板示例（不移动）

| 类别       | 文件                                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 根         | `app.vue`, `global.d.ts`, `global.module.d.ts`                                                                                                                              |
| 页面       | `pages/index.vue`, `pages/test.vue`                                                                                                                                         |
| 布局       | `layouts/default.vue`                                                                                                                                                       |
| 样式       | `assets/css/main.css`, `assets/css/font.css`                                                                                                                                |
| 图标       | `assets/icons/icon-blank.svg`                                                                                                                                               |
| 组件示例   | `components/base/CopyButton.vue`, `components/base/TempVariable.tsx`, `components/common/QuickUrl.vue`, `components/common/SiteLogo.vue`                                    |
| 组件占位   | `components/features/.gitkeep`                                                                                                                                              |
| Comp 示例  | `composables/use-feature-flag.ts`, `composables/use-layout-config.ts`, `composables/use-page-loading.ts`, `composables/use-permission.ts`, `composables/use-tool-config.ts` |
| Utils 示例 | `utils/constant.ts`, `utils/cross-page-data.ts`, `utils/encode.ts`, `utils/event-bus.ts`, `utils/fuzzy-filter.ts`, `utils/utility.ts`, `utils/uuid.ts`                      |

## 三、清空并加 .gitkeep 的目录（6 个）

```
app/services/.gitkeep
app/plugins/.gitkeep
app/middleware/.gitkeep
app/config/.gitkeep
app/types/.gitkeep
app/directives/.gitkeep
```

## 四、Import 路径修改

### 4.1 sakai 层：`~/types/xxx` → `@sakai/types/xxx`（36 处）

| 文件                                                      | 旧 import              | 新 import                   |
| --------------------------------------------------------- | ---------------------- | --------------------------- |
| `layers/sakai/app/services/AreaCodeService.ts`            | `~/types/area-code`    | `@sakai/types/area-code`    |
| `layers/sakai/app/services/AreaCodeMgrService.ts`         | `~/types/area-code`    | `@sakai/types/area-code`    |
| `layers/sakai/app/services/AnnouncementService.ts`        | `~/types/announcement` | `@sakai/types/announcement` |
| `layers/sakai/app/services/AnnouncementMgrService.ts`     | `~/types/announcement` | `@sakai/types/announcement` |
| `layers/sakai/app/services/NotificationService.ts`        | `~/types/notification` | `@sakai/types/notification` |
| `layers/sakai/app/services/NotificationMgrService.ts`     | `~/types/notification` | `@sakai/types/notification` |
| `layers/sakai/app/services/BackupService.ts`              | `~/types/backup`       | `@sakai/types/backup`       |
| `layers/sakai/app/services/BackupMgrService.ts`           | `~/types/backup`       | `@sakai/types/backup`       |
| `layers/sakai/app/services/JobService.ts`                 | `~/types/job`          | `@sakai/types/job`          |
| `layers/sakai/app/services/JobMgrService.ts`              | `~/types/job`          | `@sakai/types/job`          |
| `layers/sakai/app/services/PostService.ts`                | `~/types/post`         | `@sakai/types/post`         |
| `layers/sakai/app/services/PostMgrService.ts`             | `~/types/post`         | `@sakai/types/post`         |
| `layers/sakai/app/services/SysParamService.ts`            | `~/types/sys-param`    | `@sakai/types/sys-param`    |
| `layers/sakai/app/services/SysParamMgrService.ts`         | `~/types/sys-param`    | `@sakai/types/sys-param`    |
| `layers/sakai/app/services/FeatureFlagAdminService.ts`    | `~/types/feature-flag` | `@sakai/types/feature-flag` |
| `layers/sakai/app/services/FeatureFlagMgrService.ts`      | `~/types/feature-flag` | `@sakai/types/feature-flag` |
| `.../views/pages/area-code-mgr/AreaCodeRuleDialog.vue`    | `~/types/area-code`    | `@sakai/types/area-code`    |
| `.../views/pages/area-code-mgr/AreaCodeFormDialog.vue`    | `~/types/area-code`    | `@sakai/types/area-code`    |
| `.../views/pages/area-code-mgr/AreaCodeDeleteDialog.vue`  | `~/types/area-code`    | `@sakai/types/area-code`    |
| `.../views/pages/notify-mgr/NotificationFormDialog.vue`   | `~/types/notification` | `@sakai/types/notification` |
| `.../views/pages/announce-mgr/AnnouncementFormDialog.vue` | `~/types/announcement` | `@sakai/types/announcement` |
| `.../views/pages/sys-param-mgr/SysParamFormDialog.vue`    | `~/types/sys-param`    | `@sakai/types/sys-param`    |
| `.../views/pages/sys-param-mgr/SysParamDeleteDialog.vue`  | `~/types/sys-param`    | `@sakai/types/sys-param`    |
| `.../views/pages/post-mgr/PostFormDialog.vue`             | `~/types/post`         | `@sakai/types/post`         |
| `.../views/pages/post-mgr/PostDeleteDialog.vue`           | `~/types/post`         | `@sakai/types/post`         |
| `.../views/pages/job-mgr/JobFormDialog.vue`               | `~/types/job`          | `@sakai/types/job`          |
| `.../dashboard/AnnouncementWidget.vue`                    | `~/types/announcement` | `@sakai/types/announcement` |
| `.../layout/AppSidebar.vue`                               | `~/types/menu`         | `@sakai/types/menu`         |
| `.../layout/AppTopMenu.vue`                               | `~/types/menu`         | `@sakai/types/menu`         |
| `.../layout/AppMenu.vue`                                  | `~/types/menu`         | `@sakai/types/menu`         |
| `.../pages/demo/system/notify/list/index.vue`             | `~/types/notification` | `@sakai/types/notification` |
| `.../pages/demo/system/notify/announce/index.vue`         | `~/types/announcement` | `@sakai/types/announcement` |
| `.../pages/demo/system/backup/index.vue`                  | `~/types/backup`       | `@sakai/types/backup`       |
| `.../pages/demo/notices/[id].vue`                         | `~/types/announcement` | `@sakai/types/announcement` |
| `.../pages/demo/notices/index.vue`                        | `~/types/announcement` | `@sakai/types/announcement` |
| `.../pages/demo/system/feature-flag/index.vue`            | `~/types/feature-flag` | `@sakai/types/feature-flag` |

### 4.2 sakai 层：`~/services/xxx` → `@sakai/services/xxx`（8 处）

| 文件                               | 旧 import                            | 新 import                                 |
| ---------------------------------- | ------------------------------------ | ----------------------------------------- |
| `.../layout/AppSidebar.vue`        | `~/services/auth.service`            | `@sakai/services/auth.service`            |
| `.../layout/AppSidebar.vue`        | `~/services/menu.service`            | `@sakai/services/menu.service`            |
| `.../layout/AppTopbar.vue`         | `~/services/menu.service`            | `@sakai/services/menu.service`            |
| `.../layout/AppTopbar.vue`         | `~/services/UserNotificationService` | `@sakai/services/UserNotificationService` |
| `.../layout/AppTopbarConsumer.vue` | `~/services/UserNotificationService` | `@sakai/services/UserNotificationService` |
| `.../layouts/sakai-topnav.vue`     | `~/services/menu.service`            | `@sakai/services/menu.service`            |
| `.../layouts/sakai-mix.vue`        | `~/services/menu.service`            | `@sakai/services/menu.service`            |
| `.../pages/demo/auth/login.vue`    | `~/services/auth.service`            | `@sakai/services/auth.service`            |

### 4.3 sakai 层：添加组件显式 import（8 个文件）

| 文件                                                    | 新增 import                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `.../views/pages/user-mgr/UserFormDialog.vue`           | `import DeptPicker from '@sakai/components/common/DeptPicker.vue'`           |
| `.../views/pages/user-mgr/UserSearchBar.vue`            | `import DeptPicker from '@sakai/components/common/DeptPicker.vue'`           |
| `.../views/pages/role-mgr/RoleFormDialog.vue`           | `import DeptMultiPicker from '@sakai/components/common/DeptMultiPicker.vue'` |
| `.../views/pages/dept-mgr/DeptFormDialog.vue`           | `import UserPicker from '@sakai/components/common/UserPicker.vue'`           |
| `.../pages/demo/system/feature-flag/index.vue`          | `import UserPicker from '@sakai/components/common/UserPicker.vue'`           |
| `.../views/pages/notify-mgr/NotificationFormDialog.vue` | `import UserMultiPicker from '@sakai/components/common/UserMultiPicker.vue'` |
| `.../views/pages/asset/AssetBatchUploadDialog.vue`      | `import TagInput from '@sakai/components/common/TagInput.vue'`               |
| `.../views/pages/asset/AssetFormDialog.vue`             | `import TagInput from '@sakai/components/common/TagInput.vue'`               |

### 4.4 已移至 sakai 的插件内部 import（12 处）

| 文件 (在 sakai)                         | 旧 import                            | 新 import                                 |
| --------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `plugins/menu.provider.ts`              | `~/config/menu/showcase-menu`        | `@sakai/config/menu/showcase-menu`        |
| `plugins/menu.provider.ts`              | `~/config/menu/system-menu`          | `@sakai/config/menu/system-menu`          |
| `plugins/menu.provider.ts`              | `~/config/menu/workbench-menu`       | `@sakai/config/menu/workbench-menu`       |
| `plugins/menu.provider.ts`              | `~/services/menu.service`            | `@sakai/services/menu.service`            |
| `plugins/auth.provider.ts`              | `~/services/auth.service`            | `@sakai/services/auth.service`            |
| `plugins/global-services.provider.ts`   | `~/services/router.service`          | `@sakai/services/router.service`          |
| `plugins/global-services.provider.ts`   | `~/services/storage.service`         | `@sakai/services/storage.service`         |
| `plugins/global-services.provider.ts`   | `~/services/user.service`            | `@sakai/services/user.service`            |
| `plugins/feature-flag.provider.ts`      | `~/services/feature-flag.service`    | `@sakai/services/feature-flag.service`    |
| `plugins/user-notification.provider.ts` | `~/services/UserNotificationService` | `@sakai/services/UserNotificationService` |
| `plugins/my-directive.ts`               | `~/directives/focus`                 | `@sakai/directives/focus`                 |
| `plugins/01.msw.client.ts`              | `'../../mocks/browser'`              | `'../../../../mocks/browser'`             |

### 4.5 app/ 保留文件中的跨层 import（4 处）

| 文件 (在 app/)                    | 旧 import                         | 新 import                              |
| --------------------------------- | --------------------------------- | -------------------------------------- |
| `pages/index.vue`                 | `../services/user.service`        | `@sakai/services/user.service`         |
| `composables/use-permission.ts`   | `~/services/auth.service`         | `@sakai/services/auth.service`         |
| `composables/use-feature-flag.ts` | `~/services/feature-flag.service` | `@sakai/services/feature-flag.service` |
| `composables/use-feature-flag.ts` | `~/services/user.service`         | `@sakai/services/user.service`         |

## 五、nuxt.config.ts

无需修改。`components` 配置保留不变，`router.middleware` 无需改动。

## 六、layers/sakai/nuxt.config.ts

无需修改。

## 七、新建目录（sakai 层，共 6 个）

```
layers/sakai/app/plugins/
layers/sakai/app/middleware/
layers/sakai/app/config/
layers/sakai/app/directives/
layers/sakai/app/components/common/
layers/sakai/app/utils/
```

## 八、导入路径变更统计

| 类别                                          | 数量       |
| --------------------------------------------- | ---------- |
| sakai 内 `~/types/*` → `@sakai/types/*`       | 36 处      |
| sakai 内 `~/services/*` → `@sakai/services/*` | 8 处       |
| sakai 内新增组件显式 import                   | 8 个文件   |
| 插件内部 import 更新                          | 12 处      |
| app/ 保留文件跨层 import                      | 4 处       |
| **合计**                                      | **~68 处** |

## 九、执行步骤

| 步骤 | 操作                                                      |
| ---- | --------------------------------------------------------- |
| 1    | sakai 层新建 6 个目录                                     |
| 2    | `git mv` 批量移动 40 个文件                               |
| 3    | 批量替换 sakai 层 36 处 `~/types/` → `@sakai/types/`      |
| 4    | 批量替换 sakai 层 8 处 `~/services/` → `@sakai/services/` |
| 5    | 更新 7 个插件内部 12 处 import                            |
| 6    | 在 8 个 sakai 文件中新增组件显式 import                   |
| 7    | 更新 app/ 保留文件中 4 处跨层 import                      |
| 8    | 清空 app/ 下 6 个目录 + 加 .gitkeep                       |
| 9    | `pnpm typecheck` → 必须通过                               |
| 10   | `pnpm dev` → 验证所有页面正常                             |
| 11   | `pnpm build` → 构建通过                                   |
| 12   | `pnpm lint:fix` → 格式化                                  |
| 13   | `git add -A && git commit` → 一次性提交                   |
