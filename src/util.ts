// 通用格式化工具（浏览器端）
export function formatInt(n: number): string {
  return Math.round(n || 0).toLocaleString('en-US')
}

export function formatMoney(n: number): string {
  return '¥' + (n || 0).toFixed(2)
}

export function formatCompact(n: number): string {
  const v = Math.round(n || 0)
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1) + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(v >= 10_000 ? 0 : 1) + 'K'
  return String(v)
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

// 自动量程：取 >= value 的最小「整刻度」(1/2/5 ×10^n)，下限 1000
export function autoMax(value: number): number {
  const v = Math.max(0, value)
  for (let exp = 3; exp <= 12; exp++) {
    for (const m of [1, 2, 5]) {
      const cand = m * Math.pow(10, exp)
      if (cand >= v) return cand
    }
  }
  return Math.pow(10, 12)
}
