// DSH 插件构建脚本：用 esbuild 产出 Host(Node) 与 Client(浏览器) 两个半边。
// Host: 监听会话用量事件、累计与计费（Node 环境）
// Client: 侧边栏仪表盘 UI（浏览器环境，纯原生 DOM/SVG，无外部运行时依赖）
import { build } from 'esbuild'
import { copyFileSync } from 'node:fs'

const common = {
  bundle: true,
  sourcemap: false,
  logLevel: 'info',
}

await build({
  ...common,
  entryPoints: ['src/host.ts'],
  outfile: 'lib/index.js',
  platform: 'node',
  format: 'esm',
  target: 'node20',
})

await build({
  ...common,
  entryPoints: ['src/client.ts'],
  outfile: 'lib/client.js',
  platform: 'browser',
  format: 'esm',
  target: 'es2020',
})

// 同步市场元数据文件（若后续放置图标可在此 copy）
try {
  copyFileSync('LICENSE', 'lib/LICENSE')
} catch {
  /* 非必需 */
}

console.log('[dsh-token-gauge] build done -> lib/index.js (host), lib/client.js (client)')
