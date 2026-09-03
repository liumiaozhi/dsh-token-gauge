// ============================================================================
// DSH Client 半边：注册侧边栏 Tab，渲染机车风格仪表盘 + 设置弹窗
// 运行环境：浏览器。纯原生 DOM/SVG，无外部运行时依赖（React 等由 DSH 平台提供，本插件不依赖）。
// ============================================================================
import type { Context } from '@deepseek-ai/cordis/client'
import { getStyle, applyPalette, buildCss } from './styles'
import { createGauge } from './gauge'
import { t } from './i18n'
import { downloadReport } from './export'
import { createSettingsModal } from './settings'

const PLUGIN_ID = 'dsh-token-gauge'

function totalOf(b: any): number {
  return (b?.input || 0) + (b?.cacheRead || 0) + (b?.cacheWrite || 0) + (b?.output || 0)
}
function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function weekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7,
    )
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

function fallbackState(): any {
  return {
    global: {},
    daily: {},
    weekly: {},
    monthly: {},
    sessions: {},
    models: {},
    activeSession: '',
    settings: {
      style: 'ev',
      palette: 'neon',
      lang: 'zh',
      metric: 'global',
      display: { usage: true, cost: true, io: true, cacheMiss: true },
      limits: { global: null, daily: null, weekly: null, monthly: null },
      pricing: {},
    },
  }
}

export const name = PLUGIN_ID
export const inject = ['webview', 'events']
export function apply(ctx: Context): void {
  // 注入一次全局样式
  if (!document.getElementById('tg-gauge-style')) {
    const st = document.createElement('style')
    st.id = 'tg-gauge-style'
    st.textContent = buildCss()
    document.head.appendChild(st)
  }

  let state: any = null
  const tr = (k: string) => t((state?.settings?.lang as 'zh' | 'en') || 'zh', k)

  const root = document.createElement('div')
  root.className = 'tg-root tg-style-ev'

  // 头部
  const head = document.createElement('div')
  head.className = 'tg-head'
  const titleEl = document.createElement('div')
  titleEl.className = 'tg-title'
  titleEl.textContent = 'Token 仪表盘'
  const gear = document.createElement('div')
  gear.className = 'tg-gear'
  gear.textContent = '⚙'
  gear.title = '设置'
  head.append(titleEl, gear)
  root.appendChild(head)

  // 空数据提示
  const empty = document.createElement('div')
  empty.className = 'tg-empty'
  empty.style.display = 'none'
  root.appendChild(empty)

  // 仪表盘
  const gauge = createGauge()
  root.appendChild(gauge.el)

  // 设置弹窗
  const modal = createSettingsModal({
    getLang: () => (state?.settings?.lang as 'zh' | 'en') || 'zh',
    onSettings: (patch) => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: 'setSettings', payload: patch }),
    onExport: (format) => {
      if (state) downloadReport(state, (state.settings.lang as 'zh' | 'en') || 'zh', format)
    },
    onClear: () => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: 'clearUsage' }),
    onReset: () => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: 'resetSettings' }),
  })
  root.appendChild(modal.el)

  gear.addEventListener('click', () => modal.open(state || fallbackState()))

  // 计算当前指标的量程/费用
  const computeMetric = (s: any): { value: number; limit: number | null; cost: number } => {
    const metric = s.settings.metric
    let entry: any = s.global
    let limit: number | null = s.settings.limits.global
    if (metric === 'session') {
      entry = s.sessions[s.activeSession] || {}
      limit = s.settings.limits.daily
    } else if (metric === 'today' || metric === 'daily') {
      entry = s.daily[todayKey()] || {}
      limit = s.settings.limits.daily
    } else if (metric === 'weekly') {
      entry = s.weekly[weekKey()] || {}
      limit = s.settings.limits.weekly
    } else if (metric === 'monthly') {
      entry = s.monthly[monthKey()] || {}
      limit = s.settings.limits.monthly
    }
    return { value: totalOf(entry), limit, cost: entry.cost || 0 }
  }

  const applyState = (s: any): void => {
    state = s
    root.className = 'tg-root ' + getStyle(s.settings.style).className
    applyPalette(root, s.settings.palette)
    titleEl.textContent = tr('title')
    const m = computeMetric(s)
    gauge.update({ value: m.value, limit: m.limit, cost: m.cost, state: s, display: s.settings.display, t: tr, lang: s.settings.lang })
    const hasData = totalOf(s.global) > 0
    empty.style.display = hasData ? 'none' : ''
    empty.textContent = tr('noData')
    modal.sync(s)
  }

  ctx.effect(() => {
    ctx.events.on(`${PLUGIN_ID}:state`, applyState)
    // 请求初始状态
    ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: 'getState' })
    return () => ctx.events.off(`${PLUGIN_ID}:state`, applyState)
  })

  // 注册侧边栏 Tab
  ctx.webview.registerSidebarTab({
    id: PLUGIN_ID,
    label: 'Token 仪表盘',
    render(container: HTMLElement) {
      container.appendChild(root)
    },
  })
}
