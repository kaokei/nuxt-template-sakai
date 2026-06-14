# app/utils & app/composables 死代码分析

> 分析日期：2026-06-14
> 搜索范围：全项目（app/、layers/sakai/、mocks/），以确认所有可能的隐式依赖。
>
> **Nuxt 自动导入说明**：
>
> - Nuxt 默认自动导入 `app/utils/` 和 `app/composables/` 中的所有具名导出，项目任何位置的 `.ts` / `.vue` 文件均可直接使用这些导出，**无需显式 import**。
> - 这意味着即使没有 `import` 语句，一个符号仍可能是被引用的——只要在其他文件中以其函数调用/变量引用形式出现。
> - 本分析对所有导出符号进行了全项目正则搜索，以确认是否存在这种隐式引用。不存在任何引用才判定为死代码。

---

## app/utils/ 分析结果

### 1. constant.ts

| 导出符号                       | 被 app 使用 | 被 layers/sakai 使用                                | 结论                                       |
| ------------------------------ | ----------- | --------------------------------------------------- | ------------------------------------------ |
| `CDN`                          | ❌          | ❌                                                  | 死代码                                     |
| `CDN_NPM`                      | ❌          | ❌                                                  | 死代码                                     |
| `PASSWORD_PATTERN`             | ❌          | ❌                                                  | 死代码                                     |
| `SEX_OPTIONS`                  | ❌          | ❌                                                  | 死代码                                     |
| `CONTENT_ALIGN`                | ❌          | ❌                                                  | 死代码                                     |
| `COMMON_ENCODING_OPTIONS`      | ❌          | ❌                                                  | 死代码                                     |
| `BASE64_RFC_OPTIONS`           | ❌          | ❌                                                  | 死代码                                     |
| `COMMON_CHAR_ENCODING_OPTIONS` | ❌          | ❌                                                  | 死代码                                     |
| `INPUT_ENCODING_OPTIONS`       | ❌          | ❌                                                  | 死代码                                     |
| `OUTPUT_ENCODING_OPTIONS`      | ❌          | ❌                                                  | 死代码                                     |
| `HTML_ENTITY_MODE_OPTIONS`     | ❌          | ❌                                                  | 死代码                                     |
| **`QUERY_KEY_FOR_MODEL`**      | ❌          | ✅ `layers/sakai/app/services/search.service.ts:22` | ⚠️ 非死代码；被 sakai 层引用，违反隔离规则 |

**结论**：整体上该文件绝大部分导出是死代码，可保留在 app 中。
**但 `QUERY_KEY_FOR_MODEL`** 是一个例外——它被 `layers/sakai/app/services/search.service.ts` 通过 Nuxt 自动导入引用（无显式 import），形成了 sakai 层对 app 层的隐式依赖，违反了层隔离规则。建议将 `QUERY_KEY_FOR_MODEL` 迁移到 sakai 层或直接在 `search.service.ts` 中内联定义。

---

### 2. cross-page-data.ts

| 导出符号                  | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ------------------------- | ----------- | -------------------- | ------ |
| `crossPageSetJsonInput()` | ❌          | ❌                   | 死代码 |
| `crossPageGetJsonInput()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

---

### 3. encode.ts

| 导出符号   | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ---------- | ----------- | -------------------- | ------ |
| `encode()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。该文件包含来自 `jsjiami.com.v7` 的混淆代码，建议考虑移除。

---

### 4. event-bus.ts

| 导出符号   | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ---------- | ----------- | -------------------- | ------ |
| `EventBus` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

---

### 5. fuzzy-filter.ts

| 导出符号        | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| --------------- | ----------- | -------------------- | ------ |
| `fuzzyFilter()` | ❌          | ❌                   | 死代码 |
| `SearchScope`   | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

---

### 6. utility.ts

| 导出符号           | 被 app 使用 | 被 layers/sakai 使用 | 结论                                                                                                                 |
| ------------------ | ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `pad()`            | ❌          | ❌                   | 死代码                                                                                                               |
| `hasOwn()`         | ❌          | ❌                   | 死代码                                                                                                               |
| `getUTCTimeZone()` | ❌          | ❌                   | 死代码                                                                                                               |
| `delay()`          | ❌          | ❌                   | 死代码（⚠️ 注：`mocks/handlers/` 中使用了 `delay`，但那是来自 MSW 库的 `import { delay } from 'msw'`，与本文件无关） |
| `parseInt10()`     | ❌          | ❌                   | 死代码                                                                                                               |
| `pickComputed()`   | ❌          | ❌                   | 死代码                                                                                                               |

**结论**：全部死代码，可保留在 app 中。

---

### 7. uuid.ts

| 导出符号 | 被 app 使用 | 被 layers/sakai 使用 | 结论                                                                                             |
| -------- | ----------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| `uuid()` | ❌          | ❌                   | 死代码（⚠️ 注：`mocks/data/` 中使用了 `faker.string.uuid()`，那是 faker 库的方法，与本文件无关） |
| `guid()` | ❌          | ❌                   | 死代码                                                                                           |

**结论**：全部死代码，可保留在 app 中。

---

## app/composables/ 分析结果

### 1. use-feature-flag.ts

| 导出符号           | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ------------------ | ----------- | -------------------- | ------ |
| `useFeatureFlag()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

### 2. use-layout-config.ts

| 导出符号            | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ------------------- | ----------- | -------------------- | ------ |
| `useLayoutConfig()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

### 3. use-page-loading.ts

| 导出符号           | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ------------------ | ----------- | -------------------- | ------ |
| `usePageLoading()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

### 4. use-permission.ts

| 导出符号              | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| --------------------- | ----------- | -------------------- | ------ |
| `usePermission()`     | ❌          | ❌                   | 死代码 |
| `hasPermission()`     | ❌          | ❌                   | 死代码 |
| `hasAnyPermission()`  | ❌          | ❌                   | 死代码 |
| `hasAllPermissions()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

### 5. use-tool-config.ts

| 导出符号          | 被 app 使用 | 被 layers/sakai 使用 | 结论   |
| ----------------- | ----------- | -------------------- | ------ |
| `useToolConfig()` | ❌          | ❌                   | 死代码 |

**结论**：全部死代码，可保留在 app 中。

---

## 汇总

### ✅ 可以保留在 app/ 的死代码文件（全部导出未被任何文件使用）

| 文件                                   | 说明             |
| -------------------------------------- | ---------------- |
| `app/composables/use-feature-flag.ts`  | 所有导出未被使用 |
| `app/composables/use-layout-config.ts` | 所有导出未被使用 |
| `app/composables/use-page-loading.ts`  | 所有导出未被使用 |
| `app/composables/use-permission.ts`    | 所有导出未被使用 |
| `app/composables/use-tool-config.ts`   | 所有导出未被使用 |
| `app/utils/cross-page-data.ts`         | 所有导出未被使用 |
| `app/utils/encode.ts`                  | 所有导出未被使用 |
| `app/utils/event-bus.ts`               | 所有导出未被使用 |
| `app/utils/fuzzy-filter.ts`            | 所有导出未被使用 |
| `app/utils/utility.ts`                 | 所有导出未被使用 |
| `app/utils/uuid.ts`                    | 所有导出未被使用 |

### ⚠️ 需要处理——非死代码且违反层隔离

| 文件                    | 导出                  | 被 sakai 层引用位置                              | 建议                                                           |
| ----------------------- | --------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `app/utils/constant.ts` | `QUERY_KEY_FOR_MODEL` | `layers/sakai/app/services/search.service.ts:22` | 将该常量迁移到 sakai 层，或直接在 search.service.ts 中内联定义 |

### 建议说明

1. **死代码文件**：既然代码无害且无依赖，可留在 `app/` 中不动。如需清理可一并删除。
2. **`QUERY_KEY_FOR_MODEL`**：这是唯一需要主动修复的问题——它被 sakai 层使用了，但定义在 app 层。最简单的修复方式是在 `search.service.ts` 中将 `QUERY_KEY_FOR_MODEL` 改为内联常量 `'q'`，或将其定义迁移到 `layers/sakai/` 下的共享常量文件中。
