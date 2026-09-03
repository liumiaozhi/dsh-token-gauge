// SVG 弧形仪表盘：指针随用量/限额平滑转动，下方显示用量与费用数字
import { formatInt, formatMoney, formatCompact, clamp, autoMax } from './util'

const SVGNS = 'http://www.w3.org/2000/svg'
const CX = 100
const CY = 100
const R = 78
const START = 150 // 起始角（屏幕坐标，y 向下）
const END = 390 // 终止角（=30°+360），扫角 240°
const SWEEP = END - START

interface DisplayFlags {
  usage: boolean
  cost: boolean
  io: boolean
  cacheMiss: boolean
}

export interface GaugePayload {
  value: number
  limit: number | null
  cost: number
  state: any
  display: DisplayFlags
  t: (k: string) => string
  lang: 'zh' | 'en'
}

function polar(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

function arcPath(r: number, a0: number, a1: number): string {
  const [sx, sy] = polar(a0, r)
  const [ex, ey] = polar(a1, r)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

function svg(tag: string, attrs: Record<string, string>): SVGElement {
  const el = document.createElementNS(SVGNS, tag) as SVGElement
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  return el
}

function totalOf(b: any): number {
  return (b?.input || 0) + (b?.cacheRead || 0) + (b?.cacheWrite || 0) + (b?.output || 0)
}

export interface GaugeHandle {
  el: HTMLElement
  update: (p: GaugePayload) => void
}

export function createGauge(): GaugeHandle {
  const wrap = document.createElement('div')
  wrap.className = 'tg-gauge-wrap'

  const s = svg('svg', { class: 'tg-gauge', viewBox: '0 0 200 200', role: 'img' }) as SVGSVGElement

  // 背景轨道
  s.appendChild(svg('path', { class: 'tg-track', d: arcPath(R, START, END) }))
  // 危险区（顶部 15%，透明度随接近限额连续渐变）
  const dangerEl = svg('path', { class: 'tg-danger', d: arcPath(R, START + SWEEP * 0.85, END) })
  s.appendChild(dangerEl)

  // 刻度 + 刻度标签
  const labelEls: { el: SVGElement; frac: number }[] = []
  for (let i = 0; i <= 10; i++) {
    const frac = i / 10
    const ang = START + SWEEP * frac
    const major = i % 5 === 0
    const rOut = R + (major ? 9 : 5)
    const rIn = R - 2
    const [x1, y1] = polar(ang, rOut)
    const [x2, y2] = polar(ang, rIn)
    s.appendChild(svg('line', { class: 'tg-tick', x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), 'stroke-width': major ? '2.5' : '1.5' }))
    if (major) {
      const [lx, ly] = polar(ang, R - 18)
      const txt = svg('text', { class: 'tg-ticklabel', x: lx.toFixed(2), y: (ly + 3).toFixed(2), 'text-anchor': 'middle' })
      txt.textContent = String(Math.round(frac * 100))
      s.appendChild(txt)
      labelEls.push({ el: txt, frac })
    }
  }

  // 指针
  const needle = svg('g', { class: 'tg-needle' })
  const tipY = CY - (R - 14)
  const poly = svg('polygon', {
    points: `${CX},${tipY} ${CX - 4},${CY + 6} ${CX},${CY + 14} ${CX + 4},${CY + 6}`,
  })
  needle.appendChild(poly)
  s.appendChild(needle)

  // 中心轴
  s.appendChild(svg('circle', { class: 'tg-hub', cx: String(CX), cy: String(CY), r: '6' }))

  wrap.appendChild(s as unknown as Node)

  // 数字读数（费用在上、用量在下，间距缩小）
  const readout = document.createElement('div')
  readout.className = 'tg-readout'
  const costEl = document.createElement('div')
  costEl.className = 'tg-cost'
  const usageEl = document.createElement('div')
  usageEl.className = 'tg-usage'
  const cards = document.createElement('div')
  cards.className = 'tg-cards'
  readout.append(costEl, usageEl, cards)
  wrap.appendChild(readout)

  const update = (p: GaugePayload) => {
    const max = p.limit && p.limit > 0 ? p.limit : autoMax(p.value)
    const ratio = max > 0 ? p.value / max : 0
    const visual = clamp(ratio, 0, 1)
    const needleAngle = START + visual * SWEEP
    const deg = needleAngle - 270
    ;(needle as SVGElement & { style: CSSStyleDeclaration }).style.transform = `rotate(${deg.toFixed(2)}deg)`

    // 刻度标签按当前量程刷新
    for (const { el, frac } of labelEls) el.textContent = formatCompact(max * frac)

    // 危险/警告态
    const over = ratio >= 1
    const proximity = clamp((ratio - 0.7) / 0.3, 0, 1)
    dangerEl.style.opacity = (proximity * 0.95).toFixed(3)
    needle.setAttribute('class', over ? 'tg-needle tg-over' : 'tg-needle')

    // 读数（费用在上、用量单位 k tokens）
    if (p.display.cost) {
      costEl.style.display = ''
      costEl.textContent = formatMoney(p.cost)
    } else costEl.style.display = 'none'
    if (p.display.usage) {
      usageEl.style.display = ''
      usageEl.innerHTML = `${(p.value / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}<small>k tokens</small>`
    } else usageEl.style.display = 'none'

    // 副卡片（4 格：输入 / 输出 / 缓存命中 / 缓存未命中）
    cards.innerHTML = ''
    const addCard = (k: string, v: string) => {
      const c = document.createElement('div')
      c.className = 'tg-card'
      c.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`
      cards.appendChild(c)
    }
    if (p.display.io) {
      addCard(p.t('input'), formatInt(p.state?.global?.input || 0))
      addCard(p.t('output'), formatInt(p.state?.global?.output || 0))
    }
    if (p.display.cacheMiss) {
      const hit = p.state?.global?.cacheRead || 0
      const input = p.state?.global?.input || 0
      const miss = Math.max(0, input - hit)
      addCard(p.t('cacheHit'), formatInt(hit))
      addCard(p.t('cacheMiss'), formatInt(miss))
    }
  }

  return { el: wrap, update }
}
