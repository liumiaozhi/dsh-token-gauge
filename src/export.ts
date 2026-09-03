// 用量报表导出（浏览器端）：CSV / JSON 生成与下载
import { t } from './i18n'

interface BucketLike {
  input?: number
  cacheRead?: number
  cacheWrite?: number
  output?: number
  cost?: number
  calls?: number
}

function total(b: BucketLike): number {
  return (b.input || 0) + (b.cacheRead || 0) + (b.cacheWrite || 0) + (b.output || 0)
}

function num(v: number): string {
  return String(Math.round(v || 0))
}

function rowOf(key: string, b: BucketLike): string[] {
  return [key, num(b.input), num(b.cacheRead), num(b.cacheWrite), num(b.output), num(total(b)), (b.cost || 0).toFixed(4), num(b.calls)]
}

export function buildCsv(state: any, lang: 'zh' | 'en'): string {
  const L = (k: string) => t(lang, k)
  const lines: string[] = []
  lines.push(`# ${L('title')} - ${new Date().toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}`)
  lines.push('')

  lines.push(`# ${L('global')}`)
  lines.push(['', L('inputTokens'), L('cacheHit'), L('cacheWrite'), L('outputTokens'), L('totalTokens'), L('totalCost') + '(¥)', L('calls')].join(','))
  lines.push(rowOf(L('global'), state.global || {}).join(','))
  lines.push('')

  lines.push(`# ${L('model')}`)
  lines.push(['', L('inputTokens'), L('cacheHit'), L('cacheWrite'), L('outputTokens'), L('totalTokens'), L('totalCost') + '(¥)', L('calls')].join(','))
  for (const [k, v] of Object.entries<any>(state.models || {})) lines.push(rowOf(k, v).join(','))

  for (const period of ['daily', 'weekly', 'monthly', 'sessions'] as const) {
    const map = (state as any)[period] || {}
    const title = period === 'daily' ? L('metricDaily') : period === 'weekly' ? L('metricWeekly') : period === 'monthly' ? L('metricMonthly') : L('sessions')
    lines.push('')
    lines.push(`# ${title}`)
    lines.push(['', L('inputTokens'), L('cacheHit'), L('cacheWrite'), L('outputTokens'), L('totalTokens'), L('totalCost') + '(¥)', L('calls')].join(','))
    for (const [k, v] of Object.entries<any>(map)) lines.push(rowOf(k, v).join(','))
  }
  return lines.join('\n')
}

export function buildJson(state: any): string {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      global: state.global || {},
      models: state.models || {},
      daily: state.daily || {},
      weekly: state.weekly || {},
      monthly: state.monthly || {},
      sessions: state.sessions || {},
      settings: state.settings || {},
    },
    null,
    2,
  )
}

export function downloadReport(state: any, lang: 'zh' | 'en', format: 'csv' | 'json'): void {
  const content = format === 'csv' ? buildCsv(state, lang) : buildJson(state)
  const mime = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json'
  const filename = `token-gauge-${new Date().toISOString().slice(0, 10)}.${format}`
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
