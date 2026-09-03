// ============================================================================
// DSH Host 半边：Token 用量监听、累计、计费与持久化
// 运行环境：Node（宿主进程）。只做数据，不直接触碰 DOM。
// 与 Client 半边通过 DSH 内部事件总线通信：
//   Host -> Client : ctx.events.emit('token-gauge:state', state)
//   Client -> Host : ctx.events.emit('token-gauge:cmd',  { type, payload })
// ============================================================================
import type { Context } from '@deepseek-ai/cordis'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const PLUGIN_ID = 'dsh-token-gauge'
const DATA_DIR = join(homedir(), '.dsh-token-gauge')
const STATE_FILE = join(DATA_DIR, 'state.json')

// ---- 类型定义 --------------------------------------------------------------
interface Pricing {
  inputHit: number // 缓存命中输入（¥/百万 token）
  inputMiss: number // 缓存未命中输入
  output: number // 输出
  cacheWrite: number // 缓存写入
}

interface Buckets {
  input: number // 未命中缓存的输入 token
  cacheRead: number // 缓存命中输入 token
  cacheWrite: number // 缓存写入 token
  output: number // 输出 token
}

interface Entry extends Buckets {
  cost: number
  calls: number
}

type Metric = 'global' | 'session' | 'today' | 'daily' | 'weekly' | 'monthly'

interface DisplayFlags {
  usage: boolean
  cost: boolean
  io: boolean
  cacheMiss: boolean
}

interface Limits {
  global: number | null
  daily: number | null
  weekly: number | null
  monthly: number | null
}

interface Settings {
  style: string
  palette: string
  lang: 'zh' | 'en'
  metric: Metric
  display: DisplayFlags
  limits: Limits
  pricing: Record<string, Pricing>
}

interface State {
  global: Entry
  daily: Record<string, Entry>
  weekly: Record<string, Entry>
  monthly: Record<string, Entry>
  sessions: Record<string, Entry>
  models: Record<string, Entry>
  activeSession: string
  settings: Settings
}

// ---- DeepSeek 官方 CNY 定价预设（¥/百万 token），可被设置覆盖 -----------------
const DEFAULT_PRICING: Record<string, Pricing> = {
  'deepseek-chat': { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  'deepseek-v3': { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  'deepseek-reasoner': { inputHit: 1, inputMiss: 4, output: 16, cacheWrite: 4 },
  'deepseek-r1': { inputHit: 1, inputMiss: 4, output: 16, cacheWrite: 4 },
  'deepseek-v4-flash': { inputHit: 0.5, inputMiss: 2, output: 2, cacheWrite: 2 },
  'deepseek-v4-pro': { inputHit: 1, inputMiss: 4, output: 8, cacheWrite: 4 },
  'deepseek-coder': { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  __default__: { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
}

// ---- 工具函数 --------------------------------------------------------------
function emptyEntry(): Entry {
  return { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, cost: 0, calls: 0 }
}

function addEntry(t: Entry, s: Entry): void {
  t.input += s.input
  t.cacheRead += s.cacheRead
  t.cacheWrite += s.cacheWrite
  t.output += s.output
  t.cost += s.cost
  t.calls += s.calls
}

function totalTokens(e: Buckets): number {
  return e.input + e.cacheRead + e.cacheWrite + e.output
}

function mergedPricing(settings: Settings): Record<string, Pricing> {
  return { ...DEFAULT_PRICING, ...(settings.pricing || {}) }
}

function costFor(modelKey: string, b: Buckets, pricing: Record<string, Pricing>): number {
  const p = pricing[modelKey] || pricing['__default__'] || DEFAULT_PRICING['__default__']
  return (
    (b.input * p.inputMiss +
      b.cacheRead * p.inputHit +
      b.cacheWrite * p.cacheWrite +
      b.output * p.output) /
    1_000_000
  )
}

function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function weekKey(d = new Date()): string {
  // ISO 周序号
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

function defaultSettings(): Settings {
  return {
    style: 'ev', // 默认风格：现代电车科技
    palette: 'neon', // 默认配色：霓虹蓝
    lang: 'zh',
    metric: 'global',
    display: {
      usage: true,
      cost: true,
      io: true,
      cacheMiss: true,
    },
    limits: { global: null, daily: null, weekly: null, monthly: null },
    pricing: {},
  }
}

function defaultState(): State {
  return {
    global: emptyEntry(),
    daily: {},
    weekly: {},
    monthly: {},
    sessions: {},
    models: {},
    activeSession: '',
    settings: defaultSettings(),
  }
}

function loadState(): State {
  try {
    if (existsSync(STATE_FILE)) {
      const raw = JSON.parse(readFileSync(STATE_FILE, 'utf8')) as Partial<State>
      const base = defaultState()
      const merged: State = {
        ...base,
        ...raw,
        settings: { ...base.settings, ...(raw.settings || {}) },
      }
      // 补全嵌套字段，避免旧版本缺字段
      merged.settings.display = { ...base.settings.display, ...(raw.settings?.display || {}) }
      merged.settings.limits = { ...base.settings.limits, ...(raw.settings?.limits || {}) }
      merged.settings.pricing = raw.settings?.pricing || {}
      merged.daily = raw.daily || {}
      merged.weekly = raw.weekly || {}
      merged.monthly = raw.monthly || {}
      merged.sessions = raw.sessions || {}
      merged.models = raw.models || {}
      merged.global = { ...emptyEntry(), ...(raw.global || {}) }
      return merged
    }
  } catch (e) {
    console.warn(`[${PLUGIN_ID}] load state failed, use default:`, e)
  }
  return defaultState()
}

function saveState(state: State): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true })
    writeFileSync(STATE_FILE, JSON.stringify(state))
  } catch (e) {
    console.warn(`[${PLUGIN_ID}] save state failed:`, e)
  }
}

// 从事件载荷中尽量稳妥地抽取用量桶 + 元数据
function extractUsage(data: any): { buckets: Buckets; model: string; session: string; id?: string } | null {
  if (!data) return null
  const u = data.usage ?? data
  const input =
    u.input_tokens ?? u.prompt_tokens ?? u.uncachedInput ?? u.input ?? u.total_input_tokens ?? 0
  const cacheRead =
    u.cache_read_tokens ?? u.cacheRead ?? u.prompt_cache_hit_tokens ?? u.cache_read ?? 0
  const cacheWrite = u.cache_write_tokens ?? u.cacheWrite ?? u.cache_write ?? 0
  const output =
    u.output_tokens ?? u.completion_tokens ?? u.output ?? u.total_output_tokens ?? 0
  if (!input && !cacheRead && !cacheWrite && !output) return null
  const model: string = data.model ?? u.model ?? 'unknown'
  const session: string = data.session ?? u.session ?? data.sessionId ?? u.sessionId ?? ''
  const id: string | undefined = data.id ?? u.id ?? data.seq ?? u.seq
  return {
    buckets: { input: Number(input) || 0, cacheRead: Number(cacheRead) || 0, cacheWrite: Number(cacheWrite) || 0, output: Number(output) || 0 },
    model,
    session,
    id,
  }
}

// ---- 插件入口 --------------------------------------------------------------
export const name = PLUGIN_ID
export const inject = ['events']
export function apply(ctx: Context): void {
  const state = loadState()
  let saveTimer: NodeJS.Timeout | null = null

  const scheduleSave = (): void => {
    if (saveTimer) return
    saveTimer = setTimeout(() => {
      saveTimer = null
      saveState(state)
    }, 400)
  }

  const pushState = (): void => {
    ctx.events.emit(`${PLUGIN_ID}:state`, state)
  }

  // 累计一次用量
  const countedIds = new Set<string>()
  const accumulate = (data: any): void => {
    const ex = extractUsage(data)
    if (!ex) return
    if (ex.id) {
      if (countedIds.has(ex.id)) return
      countedIds.add(ex.id)
    }
    const modelKey = ex.model || 'unknown'
    if (ex.session) state.activeSession = ex.session
    const pricing = mergedPricing(state.settings)
    const cost = costFor(modelKey, ex.buckets, pricing)
    const e: Entry = { ...ex.buckets, cost, calls: 1 }

    addEntry(state.global, e)
    const dk = todayKey()
    state.daily[dk] = state.daily[dk] || emptyEntry()
    addEntry(state.daily[dk], e)
    const wk = weekKey()
    state.weekly[wk] = state.weekly[wk] || emptyEntry()
    addEntry(state.weekly[wk], e)
    const mk = monthKey()
    state.monthly[mk] = state.monthly[mk] || emptyEntry()
    addEntry(state.monthly[mk], e)
    if (ex.session) {
      state.sessions[ex.session] = state.sessions[ex.session] || emptyEntry()
      addEntry(state.sessions[ex.session], e)
    }
    state.models[modelKey] = state.models[modelKey] || emptyEntry()
    addEntry(state.models[modelKey], e)

    scheduleSave()
    pushState()
  }

  // 监听用量事件（兼容多种事件名/字段形态）
  ctx.effect(() => {
    const onUsage = (data: any) => accumulate(data)
    ctx.events.on('assistant/message.usage', onUsage)
    ctx.events.on('usage', onUsage)
    ctx.events.on('assistant/message', (data: any) => {
      if (data && (data.usage || (data.data && data.data.usage))) onUsage(data)
    })
    return () => {
      ctx.events.off('assistant/message.usage', onUsage)
      ctx.events.off('usage', onUsage)
    }
  })

  // 响应 Client 指令
  ctx.effect(() => {
    const onCmd = (msg: { type: string; payload?: any }) => {
      if (!msg || typeof msg.type !== 'string') return
      switch (msg.type) {
        case 'getState':
          pushState()
          break
        case 'setSettings':
          state.settings = { ...state.settings, ...(msg.payload || {}) }
          scheduleSave()
          pushState()
          break
        case 'resetSettings':
          state.settings = defaultSettings()
          scheduleSave()
          pushState()
          break
        case 'clearUsage':
          state.global = emptyEntry()
          state.daily = {}
          state.weekly = {}
          state.monthly = {}
          state.sessions = {}
          state.models = {}
          countedIds.clear()
          scheduleSave()
          pushState()
          break
        default:
          break
      }
    }
    ctx.events.on(`${PLUGIN_ID}:cmd`, onCmd)
    return () => ctx.events.off(`${PLUGIN_ID}:cmd`, onCmd)
  })

  // 初始推送
  pushState()
}
