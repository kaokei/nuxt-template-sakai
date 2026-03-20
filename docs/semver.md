## 基本格式

`<major>.<minor>.<patch>-<prerelease>`

## 基本使用流程

1. patch版本更新
   理论上只是修复了bug，可以无脑升级。

```sh
npm version prepatch # 1.2.3 --> 1.2.4-0
npm version prerelease # 1.2.4-0 --> 1.2.4-1
npm version patch # 1.2.4-1 --> 1.2.4
```

2. minor版本更新
   可能是增加了新的功能，但是保持向前兼容，理论上也可以升级。

```sh
npm version preminor # 1.2.3 --> 1.3.0-0
npm version prerelease # 1.3.0-0 --> 1.3.0-1
npm version minor # 1.3.0-1 --> 1.3.0
```

3. major版本更新
   存在破坏性更新，一般不建议直接升级，如果要升级，一般需要按照升级文档做一定的代码适配。

```sh
npm version premajor # 1.2.3 --> 2.0.0-0
npm version prerelease # 2.0.0-0 --> 2.0.0-1
npm version major # 2.0.0-1 --> 2.0.0
```

4. 增加pre-alpha/alpha/beta/rc的标记
   使用场景在于需要将代码发布到npm仓库，才能在ci/cd系统进行构建，增加alpha等标记可以大幅度减少版本数量的增加。
   避免改一个文案或者小bug都需要升级一个版本号的问题。

```sh
npm version prepatch --preid=alpha # 1.2.3 --> 1.2.4-alpha.0
npm version preminor --preid=beta # 1.2.3 --> 1.3.0-beta.0
npm version premajor --preid=rc # 1.2.3 --> 2.0.0-rc.0
```
