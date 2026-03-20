## git commit不同钩子

```sql
git commit
  ├─> husky（钩子管理器）
  │     ├─> pre-commit：在提交前执行（这里可以运行 lint-staged）
  │     │       └─> lint-staged：只检查本次改动的文件（比如 ESLint、Prettier）
  │     └─> commit-msg：在写完提交信息后执行（这里运行 commitlint）
  │
  └─> git push
        └─> pre-push（比如运行单元测试、build 检查等）
```

## 不同工具库的依赖关系

| 包名                                | 作用阶段 | 功能                   | 是否交互式 | 依赖关系                             |
| ----------------------------------- | -------- | ---------------------- | ---------- | ------------------------------------ |
| **commitizen**                      | 写提交时 | 引导生成提交信息       | ✅ 是      | 配合 cz-conventional-changelog       |
| **cz-conventional-changelog**       | 写提交时 | 定义提交规范模板       | ❌ 否      | 被 commitizen 调用                   |
| **@commitlint/cli**                 | 提交时   | 检查提交信息规范       | ❌ 否      | 配合 @commitlint/config-conventional |
| **@commitlint/config-conventional** | 提交时   | 提供检查规则           | ❌ 否      | 被 commitlint 使用                   |
| **@changesets/cli**                 | 发版时   | 管理版本号 + changelog | ❌ 否      | 可结合 commit 规范自动推导           |

## commitizen + cz-conventional-changelog

commitizen 本身只是一个框架。
cz-conventional-changelog 是一个适配器，采用的是业界最流行的规范 Conventional Commits。

作用：交互式地引导你编写规范的 commit message。
触发条件：npx cz 或 npm run commit

```
npm run commit的前提是需要配置package.json中的scripts。
也就是增加配置：commit: "cz"
```

注意如果是直接git commit是不会触发交互式引导的。

## lint-staged + eslint

作用：在提交代码之前检查是否符合eslint规范
触发条件：依赖husky配置的pre-commit钩子+lint-staged工具
如果只依赖pre-commit钩子，那么eslint将会检查整个项目的所有文件，将会非常慢。lint-staged工具则可以实现只检查暂存区的文件。

## commitlint + @commitlint/config-conventional

@commitlint/cli 只是执行检查工具。
@commitlint/config-conventional 定义了“检查规则”，即哪些提交格式是允许的。

作用：检查commit msg是否符合项目规范
触发条件：依赖husky配置的commit-msg钩子

## @changesets/cli

作用：版本管理与自动生成 CHANGELOG 工具。

1. 不会自动读取commit message来生成CHANGELOG记录。
2. 每次执行 `pnpm changeset` 都会生成一个临时变更，存储在.changeset文件夹中。
3. 执行 `pnpm changeset version` 会自动更新CHANGELOG.md文件内容，并且删除所有临时变更记录，并且更具临时变更的类型自动更新package.json的版本号。
4. 自动创建发版 PR

```sh
pnpm changeset init # 创建.changeset文件夹
pnpm changeset     # 记录"我改了什么"，生成临时变更说明文件，并且记录变更类型patch|minor|major
pnpm changeset version  # 根据记录自动更新版本号 + 生成 CHANGELOG + 删除所有临时变更记录
pnpm changeset publish  # 发布更新过的包 + 打 git tag
```

#### 首次进入alpha模式

场景：当前版本 1.2.3，需要测试新功能

```sh
# 1. 进入 alpha 模式
pnpm changeset pre enter alpha

# 2. 创建 changeset（正常流程）
pnpm changeset
# → 选择包
# → 选择版本类型（patch/minor/major）
# → 输入变更说明

# 3. 更新版本号
pnpm changeset version
# ✅ 版本号会变成：1.2.4-alpha.0

# 4. 提交
git add .
git commit -m "chore: version prerelease"

# 5. 发布到 npm（带 alpha tag）
pnpm changeset publish --tag alpha

# 6. 推送
git push
```

#### 持续的 Prerelease 迭代

场景：提测后发现 bug，继续修复和发版

```sh
# 1. 修复 bug
git commit -m "fix: 修复某某问题"

# 2. 再次创建 changeset
pnpm changeset
# → 选择包
# → 选择 patch

# 3. 更新版本（仍在 prerelease 模式）
pnpm changeset version
# ✅ 版本号会变成：1.2.4-alpha.1

# 4. 发布
pnpm changeset publish --tag alpha

# -------- 继续修复 --------

# 再次修复
pnpm changeset
pnpm changeset version
# ✅ 版本号会变成：1.2.4-alpha.2

pnpm changeset publish --tag alpha
```

#### 退出 Prerelease 模式，发布正式版

```sh
# 1. 测试完成，准备发布正式版
pnpm changeset pre exit

# 2. 如果还有未发布的 changeset，再更新版本
pnpm changeset version
# ✅ 版本号会变成：1.2.4（正式版）

# 3. 提交
git add .
git commit -m "chore: version packages"

# 4. 发布到 npm（默认 latest tag）
pnpm changeset publish

# 5. 推送
git push --follow-tags
```

#### 版本号演进示例

| 操作                      | 版本号        | 说明                |
| ------------------------- | ------------- | ------------------- |
| 当前版本                  | 1.2.3         | 已发布的稳定版      |
| pre enter alpha + version | 1.2.4-alpha.0 | 第一个 alpha 版本   |
| 修复 bug + version        | 1.2.4-alpha.1 | 修复后的 alpha 版本 |
| 再次修复 + version        | 1.2.4-alpha.2 | 继续修复            |
| pre exit + version        | 1.2.4         | 正式版本            |

#### 完整测试流程示例

```sh
# === 进入预发模式 ===
pnpm pre:alpha

# === 开发并发布 alpha 版本 ===
# 开发...
pnpm changeset  # 创建变更记录
pnpm changeset version  # 版本号: 1.2.4-alpha.0
git add . && git commit -m "chore: version alpha"
pnpm release
git push

# === CI/CD 使用 alpha 版本测试 ===
# package.json: "@kaokei/core": "1.2.4-alpha.0"

# === 发现 bug，修复后再发 ===
# 修复...
pnpm changeset
pnpm changeset version  # 版本号: 1.2.4-alpha.1
git add . && git commit -m "chore: version alpha"
pnpm release
git push

# === 测试通过，发布正式版 ===
pnpm pre:exit
pnpm changeset version  # 版本号: 1.2.4
git add . && git commit -m "chore: version packages"
pnpm release
git push --follow-tags
```

## Changesets 使用的核心原则

1个复杂的commit，可以创建多个changeset，但是更加推荐创建一个支持多包的changeset。
也就是在创建changeset时，选择多个包。

并不需要每个commit都创建一个changeset，可以多个commit再创建一个changeset。

一个功能点对应一个changeset，不管这个功能点需要修改多少次，修改了多个包，都在一个changeset中。

可以在发布之前统一生成changeset。

可以在进入prerelease模式之后，每次修复bug，只升级版本，但是不生成changeset。
最终在退出prerelease模式时，再统一生成changeset。
【实际上并不支持，除非完全不使用prerelease模式，而是手动维护版本的升级】

注意到release之前一定是有新版本的，创建新版本之前一定是有changeset的。
没有changeset就不能升级版本，没有新版本就不能release。

```
开发 → commit → 开发 → commit → 功能完成
  ↓
创建 changeset
  ↓
立即 version
  ↓
立即 commit
  ↓
立即 release
  ↓
清理完成，进入下一个循环
```
