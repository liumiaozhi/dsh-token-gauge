// 侧边栏内设置弹窗：风格 / 配色 / 显示内容 / 用量口径 / 限额 / 定价 / 语言 / 导出
import { STYLES, PALETTES } from './styles'
import { t, metricLabel } from './i18n'

type Lang = 'zh' | 'en'
interface DisplayFlags {
  usage: boolean
  cost: boolean
  io: boolean
  cacheMiss: boolean
}
interface Settings {
  style: string
  palette: string
  lang: Lang
  metric: string
  display: DisplayFlags
  limits: { global: number | null; daily: number | null; weekly: number | null; monthly: number | null }
  pricing: Record<string, any>
}
interface State {
  settings: Settings
}

export interface SettingsModalOpts {
  onSettings: (patch: Partial<Settings>) => void
  onExport: (format: 'csv' | 'json') => void
  onClear: () => void
  onReset: () => void
  getLang: () => Lang
}

export interface SettingsModal {
  el: HTMLElement
  open: (state: State) => void
  close: () => void
  sync: (state: State) => void
}

function chip(label: string, on: boolean, onClick: () => void): HTMLElement {
  const c = document.createElement('div')
  c.className = 'tg-chip' + (on ? ' on' : '')
  c.textContent = label
  c.addEventListener('click', onClick)
  return c
}

export function createSettingsModal(opts: SettingsModalOpts): SettingsModal {
  const mask = document.createElement('div')
  mask.className = 'tg-modal-mask'
  mask.style.display = 'none'
  const box = document.createElement('div')
  box.className = 'tg-modal'
  mask.appendChild(box)

  let openState: State | null = null
  let isOpen = false

  const render = (state: State) => {
    const lang = opts.getLang()
    const s = state.settings
    box.innerHTML = ''
    const title = document.createElement('h3')
    title.textContent = t(lang, 'settings')
    box.appendChild(title)

    // 语言
    const langField = document.createElement('div')
    langField.className = 'tg-field'
    langField.innerHTML = `<label>${t(lang, 'lang')}</label>`
    const langRow = document.createElement('div')
    langRow.className = 'tg-row'
    langRow.append(
      chip('中文', s.lang === 'zh', () => opts.onSettings({ lang: 'zh' })),
      chip('English', s.lang === 'en', () => opts.onSettings({ lang: 'en' })),
    )
    langField.appendChild(langRow)
    box.appendChild(langField)

    // 风格
    const styleField = document.createElement('div')
    styleField.className = 'tg-field'
    styleField.innerHTML = `<label>${t(lang, 'style')}</label>`
    const styleRow = document.createElement('div')
    styleRow.className = 'tg-row'
    for (const st of STYLES) {
      styleRow.appendChild(
        chip(lang === 'zh' ? st.labelZh : st.labelEn, s.style === st.id, () => opts.onSettings({ style: st.id })),
      )
    }
    styleField.appendChild(styleRow)
    box.appendChild(styleField)

    // 配色
    const palField = document.createElement('div')
    palField.className = 'tg-field'
    palField.innerHTML = `<label>${t(lang, 'palette')}</label>`
    const palRow = document.createElement('div')
    palRow.className = 'tg-row'
    for (const p of PALETTES) {
      palRow.appendChild(
        chip(lang === 'zh' ? p.labelZh : p.labelEn, s.palette === p.id, () => opts.onSettings({ palette: p.id })),
      )
    }
    palField.appendChild(palRow)
    box.appendChild(palField)

    // 用量口径
    const metricField = document.createElement('div')
    metricField.className = 'tg-field'
    metricField.innerHTML = `<label>${t(lang, 'metric')}</label>`
    const metricRow = document.createElement('div')
    metricRow.className = 'tg-row'
    for (const m of ['global', 'session', 'today', 'daily', 'weekly', 'monthly']) {
      metricRow.appendChild(chip(metricLabel(lang, m), s.metric === m, () => opts.onSettings({ metric: m })))
    }
    metricField.appendChild(metricRow)
    box.appendChild(metricField)

    // 显示内容
    const dispField = document.createElement('div')
    dispField.className = 'tg-field'
    dispField.innerHTML = `<label>${t(lang, 'display')}</label>`
    const dispKeys: { key: keyof DisplayFlags; label: string }[] = [
      { key: 'usage', label: t(lang, 'usage') },
      { key: 'cost', label: t(lang, 'cost') },
      { key: 'io', label: t(lang, 'input') + '/' + t(lang, 'output') },
      { key: 'cacheMiss', label: t(lang, 'cacheMiss') },
    ]
    for (const d of dispKeys) {
      const row = document.createElement('label')
      row.className = 'tg-toggle'
      const cb = document.createElement('input')
      cb.type = 'checkbox'
      cb.checked = !!s.display[d.key]
      cb.addEventListener('change', () => {
        const next = { ...s.display, [d.key]: cb.checked }
        opts.onSettings({ display: next })
      })
      row.append(cb, document.createTextNode(d.label))
      dispField.appendChild(row)
    }
    box.appendChild(dispField)

    // 限额
    const limitField = document.createElement('div')
    limitField.className = 'tg-field'
    limitField.innerHTML = `<label>${t(lang, 'limit')}</label>`
    const limitDefs: { key: keyof Settings['limits']; label: string }[] = [
      { key: 'global', label: t(lang, 'limitGlobal') },
      { key: 'daily', label: t(lang, 'limitDaily') },
      { key: 'weekly', label: t(lang, 'limitWeekly') },
      { key: 'monthly', label: t(lang, 'limitMonthly') },
    ]
    for (const ld of limitDefs) {
      const wrap = document.createElement('div')
      const lab = document.createElement('label')
      lab.className = 'tg-toggle'
      lab.textContent = ld.label
      const inp = document.createElement('input')
      inp.className = 'tg-input'
      inp.type = 'number'
      inp.min = '0'
      inp.placeholder = '∞'
      inp.value = s.limits[ld.key] == null ? '' : String(s.limits[ld.key])
      inp.addEventListener('change', () => {
        const v = inp.value.trim()
        const val = v === '' ? null : Math.max(0, Number(v))
        if (v !== '' && Number.isNaN(Number(v))) return
        opts.onSettings({ limits: { ...s.limits, [ld.key]: val } })
      })
      wrap.append(lab, inp)
      limitField.appendChild(wrap)
    }
    const hint = document.createElement('div')
    hint.className = 'tg-hint'
    hint.textContent = t(lang, 'hintLimit')
    limitField.appendChild(hint)
    box.appendChild(limitField)

    // 高级定价
    const advField = document.createElement('div')
    advField.className = 'tg-field'
    advField.innerHTML = `<label>${t(lang, 'advanced')}</label>`
    const ta = document.createElement('textarea')
    ta.className = 'tg-input'
    ta.rows = 5
    ta.style.fontFamily = 'monospace'
    ta.value = JSON.stringify(s.pricing || {}, null, 2)
    advField.appendChild(ta)
    const advErr = document.createElement('div')
    advErr.className = 'tg-hint'
    advErr.style.color = 'var(--c-danger)'
    const savePrice = document.createElement('button')
    savePrice.className = 'tg-btn ghost'
    savePrice.style.marginTop = '6px'
    savePrice.textContent = t(lang, 'save')
    savePrice.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(ta.value || '{}')
        opts.onSettings({ pricing: parsed })
        advErr.textContent = ''
      } catch (e) {
        advErr.textContent = String(e)
      }
    })
    advField.append(savePrice, advErr)
    box.appendChild(advField)

    // 导出
    const expField = document.createElement('div')
    expField.className = 'tg-field'
    expField.innerHTML = `<label>${t(lang, 'export')}</label>`
    const expRow = document.createElement('div')
    expRow.className = 'tg-actions'
    const csvBtn = document.createElement('button')
    csvBtn.className = 'tg-btn ghost'
    csvBtn.textContent = 'CSV'
    csvBtn.addEventListener('click', () => opts.onExport('csv'))
    const jsonBtn = document.createElement('button')
    jsonBtn.className = 'tg-btn ghost'
    jsonBtn.textContent = 'JSON'
    jsonBtn.addEventListener('click', () => opts.onExport('json'))
    expRow.append(csvBtn, jsonBtn)
    expField.appendChild(expRow)
    box.appendChild(expField)

    // 操作
    const act = document.createElement('div')
    act.className = 'tg-actions'
    const clearBtn = document.createElement('button')
    clearBtn.className = 'tg-btn ghost'
    clearBtn.textContent = t(lang, 'clear')
    clearBtn.addEventListener('click', () => opts.onClear())
    const resetBtn = document.createElement('button')
    resetBtn.className = 'tg-btn ghost'
    resetBtn.textContent = t(lang, 'reset')
    resetBtn.addEventListener('click', () => opts.onReset())
    const closeBtn = document.createElement('button')
    closeBtn.className = 'tg-btn'
    closeBtn.textContent = t(lang, 'close')
    closeBtn.addEventListener('click', () => exports.close())
    act.append(clearBtn, resetBtn, closeBtn)
    box.appendChild(act)
  }

  const exports: SettingsModal = {
    el: mask,
    open: (state: State) => {
      openState = state
      isOpen = true
      render(state)
      mask.style.display = 'flex'
    },
    close: () => {
      isOpen = false
      mask.style.display = 'none'
    },
    sync: (state: State) => {
      openState = state
      if (isOpen) render(state)
    },
  }

  mask.addEventListener('click', (e) => {
    if (e.target === mask) exports.close()
  })

  return exports
}
