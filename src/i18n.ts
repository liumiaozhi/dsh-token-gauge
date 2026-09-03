// 中英文文案
type Dict = Record<string, { zh: string; en: string }>

const I18N: Dict = {
  title: { zh: 'Token 仪表盘', en: 'Token Gauge' },
  settings: { zh: '设置', en: 'Settings' },
  style: { zh: '风格', en: 'Style' },
  palette: { zh: '配色', en: 'Palette' },
  display: { zh: '显示内容', en: 'Display' },
  metric: { zh: '用量口径', en: 'Metric' },
  limit: { zh: '限额', en: 'Limit' },
  limitGlobal: { zh: '全局限额', en: 'Global limit' },
  limitDaily: { zh: '日限额', en: 'Daily limit' },
  limitWeekly: { zh: '周限额', en: 'Weekly limit' },
  limitMonthly: { zh: '月限额', en: 'Monthly limit' },
  usage: { zh: '用量', en: 'Usage' },
  cost: { zh: '费用', en: 'Cost' },
  input: { zh: '输入', en: 'Input' },
  output: { zh: '输出', en: 'Output' },
  cacheMiss: { zh: '缓存未命中', en: 'Cache miss' },
  lang: { zh: '语言', en: 'Language' },
  export: { zh: '导出报表', en: 'Export report' },
  exportCsv: { zh: 'CSV', en: 'CSV' },
  exportJson: { zh: 'JSON', en: 'JSON' },
  close: { zh: '关闭', en: 'Close' },
  save: { zh: '保存', en: 'Save' },
  reset: { zh: '恢复默认', en: 'Reset' },
  clear: { zh: '清空用量', en: 'Clear usage' },
  advanced: { zh: '高级·定价(¥/百万token)', en: 'Advanced · Pricing (¥/M tokens)' },
  overLimit: { zh: '已超出限额！', en: 'Over limit!' },
  noData: { zh: '暂无用量数据，开始对话后此处会实时更新。', en: 'No usage yet. Start a chat to see live updates.' },
  autoScale: { zh: '自动量程', en: 'auto' },
  metricGlobal: { zh: '全局累计', en: 'Global' },
  metricSession: { zh: '当前会话', en: 'Session' },
  metricToday: { zh: '今日', en: 'Today' },
  metricDaily: { zh: '每日', en: 'Daily' },
  metricWeekly: { zh: '每周', en: 'Weekly' },
  metricMonthly: { zh: '每月', en: 'Monthly' },
  inputTokens: { zh: '输入 Token', en: 'Input tokens' },
  outputTokens: { zh: '输出 Token', en: 'Output tokens' },
  cacheHit: { zh: '缓存命中', en: 'Cache hit' },
  cacheWrite: { zh: '缓存写入', en: 'Cache write' },
  model: { zh: '模型', en: 'Model' },
  period: { zh: '周期', en: 'Period' },
  totalCost: { zh: '总费用', en: 'Total cost' },
  totalTokens: { zh: '总 Token', en: 'Total tokens' },
  calls: { zh: '调用次数', en: 'Calls' },
  hintLimit: { zh: '留空表示不限（仪表盘自动量程）。', en: 'Leave empty for no limit (auto scale).' },
}

export function t(lang: 'zh' | 'en', key: string): string {
  const e = I18N[key]
  if (!e) return key
  return e[lang] ?? e.zh
}

export function metricLabel(lang: 'zh' | 'en', metric: string): string {
  return t(lang, 'metric' + metric.charAt(0).toUpperCase() + metric.slice(1))
}
