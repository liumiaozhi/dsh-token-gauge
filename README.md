# dsh-token-gauge · Token 机车仪表盘

DeepSeek Harness（DSH）Web 侧边栏插件：以「机车风格仪表盘」实时展示 Token 用量与费用。
指针随用量增长平滑转动，下方显示用量与费用数字；点击 ⚙ 打开设置弹窗，可切换风格、配色、显示内容、用量口径、限额（全局/日/周/月）、语言并导出用量报表。

> 默认风格：**现代电车科技**；默认配色：**霓虹蓝**；默认用量口径：**全局累计**。

## 特性

- **实时仪表盘**：SVG 弧形表盘，指针随 `用量 / 限额` 比值转动；超限进入红色危险区并提示。
- **多风格（6 种）**：现代电车科技（默认）、原始机车、豪华跑车、可爱小车、赛博朋克、复古机械表盘。
- **多配色（8 种）**：琥珀金、霓虹蓝、赛道红、极光绿、樱粉、暗夜紫、钛银、火山橙。风格与配色可自由组合。
- **用量与费用**：显示总 Token、费用（¥），并可开启输入/输出、缓存命中、会话数、今日用量、限额进度等副卡片。
- **限额**：支持全局 / 日 / 周 / 月 四类限额（默认全局为空=自动量程）。指针按所选口径对限额扫动。
- **中英文界面**：设置内一键切换 zh / en。
- **导出报表**：一键导出 CSV / JSON 用量明细（全局、分模型、按日/周/月/会话）。
- **零外部依赖**：Client 半边纯原生 DOM/SVG，不依赖 React 等运行时；Host 半边监听 DSH 会话用量事件自行累计，可独立发布。

## 安装

### 方式一：从市场安装（推荐）
```bash
dsh plugin --profile web add dsh-token-gauge
dsh web
```

### 方式二：本地源码安装
```bash
git clone <本仓库> dsh-token-gauge
cd dsh-token-gauge
npm install
node build.mjs                 # 生成 lib/index.js 与 lib/client.js
dsh plugin --profile web add . # 读取 package.json 的 dsh 字段
dsh web
```
或在已运行 DSH 的情况下以本地 overlay 调试：
```bash
node build.mjs
dsh web --patch ./cordis.patch.yml
```

安装后重启/硬刷新 DSH Web，侧边栏出现「Token 仪表盘」Tab。开始对话产生 Token 后，仪表盘即实时更新。

## 数据来源与费用口径

- **数据源**：Host 半边订阅 DSH 会话事件流中的 `assistant/message.usage`（含输入/输出/缓存命中/缓存写入 token），自行累计，不依赖其他插件。
- **累计视图**：全局 / 当日 / 当周 / 当月 / 会话 / 模型 六套。
- **费用**：`费用 = (未命中输入×输入未命中单价 + 缓存命中×输入命中单价 + 缓存写入×写入单价 + 输出×输出单价) / 1,000,000`。
  内置 DeepSeek 官方 ¥ 预设（如 deepseek-chat：输入缓存命中 0.5 / 未命中 2、输出 8；deepseek-reasoner：1 / 4 / 16），可在设置「高级·定价」中按模型自定义（¥/百万 token）。

## 设置项（⚙ 弹窗）

| 分组 | 说明 |
|---|---|
| 语言 | 中文 / English |
| 风格 | 6 种机车风格 |
| 配色 | 8 种调色板 |
| 用量口径 | 全局累计 / 当前会话 / 今日 / 每日 / 每周 / 每月 |
| 显示内容 | 用量、费用、输入/输出、缓存节省、会话数、今日用量、限额进度（可独立开关） |
| 限额 | 全局 / 日 / 周 / 月（留空为不限，仪表盘自动量程） |
| 高级·定价 | 按模型编辑输入命中/未命中、输出、缓存写入 单价（¥/百万 token） |
| 导出报表 | CSV / JSON |
| 其他 | 清空用量、恢复默认 |

## 目录结构

```
dsh-token-gauge/
├── package.json          # dsh 字段声明 host/client 半边（市场兼容）
├── tsconfig.json
├── build.mjs             # esbuild 构建脚本
├── cordis.patch.yml      # 本地 overlay
├── src/
│   ├── host.ts           # Host 半边：用量监听/累计/计费/持久化
│   ├── client.ts         # Client 半边：注册侧边栏 Tab + 装配
│   ├── gauge.ts          # SVG 仪表盘（指针/读数）
│   ├── styles.ts         # 风格+配色定义与全局 CSS
│   ├── settings.ts       # 设置弹窗
│   ├── i18n.ts           # 中英文案
│   ├── export.ts         # 报表导出
│   └── util.ts           # 格式化/量程工具
├── lib/                  # 构建产物（host/client），随包发布
├── README.md / README.en.md / LICENSE
```

## 上架市场

本包已按 DSH 插件规范命名（`dsh` 字段 + `lib/index.js` / `lib/client.js`），并声明 `files` 白名单。
发布到 npm 后，其他用户即可 `dsh plugin --profile web add dsh-token-gauge` 安装发现：

```bash
npm version patch        # 或 minor/major
npm publish              # 须使用官方源 registry.npmjs.org
```

## 许可

MIT
