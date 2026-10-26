# 发版流程 / Releasing

本仓库通过 **git tag** 触发发布。`package.json` 的 `version` 是唯一版本来源，
标签与版本号必须一致：`package.json` 为 `1.2.0` → 标签 `v1.2.0`。

```text
改代码 → 更新文档 → 自检 → 提交 → 打 tag → 推送 → Actions 自动发 npm + 建 Release
```

## 一次性准备

### 1. npm token

在 https://www.npmjs.com/settings/~/tokens 生成一个 **Granular Access Token**：

- 包范围：`dsh-token-gauge`
- 权限：`Read and write`
- 建议设置过期时间，到期前轮换

然后把它保存为仓库机密：**Settings → Secrets and variables → Actions → New repository secret**，
名称必须是 **`NPM_TOKEN`**。工作流在缺少该机密时会直接失败并给出提示，不会静默跳过。

> 注意：npm 的发包认证与 git 的 GitHub 认证是两套凭据，不能混用。
> 本机 `~/.npmrc` 若指向 `https://registry.npmmirror.com`（只读镜像），
> **发布必须显式指定** `--registry=https://registry.npmjs.org`，否则会报
> `ENEEDAUTH` 或 `EPUBLISHCONFLICT`。

### 2. 本地工具链

需要 `git` 与 Node.js `>= 22.19.0`（`engines.node` 已声明）。本插件是手写 Client
bundle，**没有构建步骤**，因此发版不依赖安装依赖或编译。

## 发布前自检

每次发版前逐项确认，这四项都来自实际踩过的坑：

### 1. 客户端 bundle 的注册 id 必须等于包名

DSH 0.2.x 的加载器按**包名**索引模块工厂。注册成别的 id（例如历史上的
`dsh-cost-dashboard`）会让该行被判定为"未注册"，加载器重新拉取同一个 bundle，
第二次注册抛出 `duplicate factory registration`，表现为启动失败：

```text
web boot: 1 entry did not activate
dsh-token-gauge: import failed
```

自检命令（结果必须是 `dsh-token-gauge`）：

```powershell
node -e "const s=require('fs').readFileSync('client.js','utf8');console.log(s.match(/id:\s*'([^']+)'/)[1])"
```

### 2. 兼容范围只写验证过的版本

`engines.dsh` 是 DSH 安装/启动门禁真正读取的字段（顶层 `engines`，不是 `dsh.engines`），
且存在时**独占判定**、忽略 `peerDependencies`。它用 `includePrerelease: true` 比较，
所以 `>=0.2.0-rc.1 <0.3.0-0` 能覆盖 `0.2.1-rc.3` —— 而 `^0.2.0-rc.1` 这种写法不行
（预发布版本要求 major.minor.patch 完全一致）。

`dsh.compatibility.dshReleases` 仅供插件市场展示。**没实测过的运行时一律写 `unknown`**，
不要为了"看起来支持得更多"而标 `compatible`。

上线前在**真实 DSH 里装一次**，确认两件事：

1. 侧边栏出现「费用仪表盘」
2. 没有新增的启动崩溃日志：`%APPDATA%\@deepseek-ai\dsh-desktop\logs\crash-*-web-boot.log`

第二条最关键——DSH 的启动是全有或全无的，一个条目没激活就会弹窗失败并写下该日志。

### 3. 文档

- `README.md` 与 `README.en.md` 的「更新日志 / Changelog」都补上本版条目
- 若改了安装方式、配置项或兼容范围，同步更新对应章节

### 4. 版本号

```powershell
npm version patch --no-git-tag-version   # 修 bug
npm version minor --no-git-tag-version   # 新增功能
npm version major --no-git-tag-version   # 破坏性变更
```

`--no-git-tag-version` 只改 `package.json`，标签由下面流程手动创建，避免标签先于提交。

## 正式发布

```powershell
# 1. 提交代码与文档
git add -A
git commit -m "fix: ..."            # 或 chore(release): 1.2.0

# 2. 打标签（与 package.json 一致）
git tag v1.2.0

# 3. 推送提交与标签
git push origin main
git push origin v1.2.0
```

推送标签后 `.github/workflows/release.yml` 会：

1. 校验 `v<tag>` 与 `package.json` 的 `version` 一致，不一致直接失败
2. 校验 `NPM_TOKEN` 已配置
3. 发布到 npm（预发布标签如 `v1.2.0-rc.1` 会发到 `next` dist-tag）
4. 用 `gh release create` 创建 GitHub Release（预发布标签标为 prerelease）

## 手动发布（Actions 不可用时）

```powershell
cd <repo>

# 认证：优先临时 npmrc，避免把长期 token 写进 ~/.npmrc
$tmp = Join-Path $env:TEMP 'npmrc-release'
Set-Content $tmp "//registry.npmjs.org/:_authToken=$env:NPM_TOKEN" -NoNewline -Encoding ascii
npm whoami --registry=https://registry.npmjs.org --userconfig=$tmp

# 发布（必须显式指定官方源）
npm publish --registry=https://registry.npmjs.org --userconfig=$tmp

# 用完立即删除临时凭据
Remove-Item $tmp -Force
```

GitHub Release 可直接在网页创建：
`https://github.com/liumiaozhi/dsh-token-gauge/releases/new?tag=v1.2.0`

创建后核对三处一致：

```powershell
git ls-remote origin                       # tag 指向的提交
npm view dsh-token-gauge version --registry=https://registry.npmjs.org
node -p "require('./package.json').version"
```

npm 上的 `gitHead` 字段会记录发布所用的提交，可与 tag 对照，确认 tarball 来自该提交。

## 回滚

- **72 小时内**：`npm unpublish dsh-token-gauge@1.2.0 --registry=https://registry.npmjs.org`
  只影响未升级的用户，且在一定条件下受限
- **超过 72 小时**：不能撤回，改用弃用标记并立即发修复版

```powershell
npm deprecate dsh-token-gauge@1.2.0 "启动失败，请升级到 1.2.1"
```

**永远优先"发补丁版"而不是"撤回"**：已安装的用户不会因为撤回自动降级。

## 常见故障

| 现象 | 原因 | 处理 |
|---|---|---|
| `ENEEDAUTH` | 未登录，或登录写到了 `registry.npmmirror.com` | `npm login --registry=https://registry.npmjs.org`，并用 `npm whoami` 同源验证 |
| `EPUBLISHCONFLICT` / 403 | 该版本已存在，或 token 无该包写权限 | 提升版本号；检查 token 的包范围与权限 |
| `Connection was reset` / 超时（git push） | 到 GitHub 的连接不稳定 | 用更宽容的传输参数重试：`git -c http.version=HTTP/1.1 -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=60 push origin main` |
| Actions 报 tag 与版本不一致 | 忘记 bump `package.json` 或标签打错 | 改版本重新提交，删标签重打：`git tag -d v1.2.0 && git push origin :refs/tags/v1.2.0` |
| 插件装上后 DSH 起不来 | 客户端注册 id 不等于包名，或声明的兼容范围与实际运行时冲突 | 按上文自检 1、2 修复后发补丁版 |
| `npm view` 查不到刚发布的版本 | 注册表读取路径传播延迟（通常几十秒） | 直接查 `https://registry.npmjs.org/dsh-token-gauge` 原始 JSON 确认 |

## 版本策略

- 走语义化版本；插件市场的收录与用户升级都依赖它
- 破坏性变更（改了 bundle patch 的 entry id、移除了配置项、提高了 `engines.dsh` 下限）
  必须发 major 或至少 minor，并在更新日志中显式说明
- 预发布用 `-rc.N` 后缀，发到 `next` dist-tag；稳定后再发正式版
