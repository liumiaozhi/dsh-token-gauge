window.__ModuleLoader__.load({
  // The loader keys module factories by package name and treats a row whose
  // factory never registered as missing, re-requesting its bundle. A bundle
  // that registers under any other id therefore executes twice and throws
  // "duplicate factory registration". Keep this identical to package.json name.
  id: 'dsh-token-gauge',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'cost-dashboard';
    const MAX_SPEED = 500;
    const POLL_MS = 1500;
    const START_ANGLE = 155;
    const SWEEP_ANGLE = 230;
    const STYLE_KEY = 'dsh-cost-dashboard-style-v2';
    const LAYOUT_KEY = 'dsh-cost-dashboard-layout-v1';
    const STYLES = [
      { id: 'classical', label: 'styleClassical', swatch: ['#d97706', '#92400e'] },
      { id: 'macaron', label: 'styleMacaron', swatch: ['#f472b6', '#a78bfa'] },
      { id: 'minimal', label: 'styleMinimal', swatch: ['#94a3b8', '#475569'] },
      { id: 'starfield', label: 'styleStarfield', swatch: ['#818cf8', '#22d3ee'] },
    ];

    const zh = {
      current: '当前会话',
      today: '今日',
      cache: '缓存命中率',
      tokens: 'tokens',
      speedUnit: 'token/秒',
      cacheUnit: '缓存命中率%',
      gaugeLabel: 'Token 输出速度仪表盘，范围 0 到 500 Token 每秒',
      cacheGaugeLabel: '缓存命中率仪表盘，范围 70 到 100%',
      style: '样式设置',
      layout: '结构',
      layoutSingle: '单表',
      layoutDual: '双表',
      styleClassical: '古典',
      styleMacaron: '马卡龙',
      styleMinimal: '极简',
      styleStarfield: '星空',
    };

    const en = {
      current: 'This session',
      today: 'Today',
      cache: 'Cache hit rate',
      tokens: 'tokens',
      speedUnit: 'token/s',
      cacheUnit: 'Cache hit%',
      gaugeLabel: 'Token output speed gauge, 0 to 500 tokens per second',
      cacheGaugeLabel: 'Cache hit rate gauge, 70 to 100%',
      style: 'Style',
      layout: 'Layout',
      layoutSingle: 'Single',
      layoutDual: 'Dual',
      styleClassical: 'Vintage',
      styleMacaron: 'Macaron',
      styleMinimal: 'Minimal',
      styleStarfield: 'Starfield',
    };

    const CSS = `
.cdx-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background-color: var(--dsw-alias-bg-layer-1);
  background:
    radial-gradient(120% 90% at 18% 0%, color-mix(in srgb, var(--cdx-glow) 9%, transparent), transparent 58%),
    var(--dsw-alias-bg-layer-1);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  color: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  --cdx-accent: #d97706;
  --cdx-accent-2: #92400e;
  --cdx-accent-3: #b45309;
  --cdx-warn: #f59e0b;
  --cdx-danger: #b91c1c;
  --cdx-needle: #ea580c;
  --cdx-glow: #d97706;
}
.cdx-card[data-style="macaron"] {
  --cdx-accent: #f472b6;
  --cdx-accent-2: #a78bfa;
  --cdx-accent-3: #34d399;
  --cdx-warn: #fbbf24;
  --cdx-danger: #fb7185;
  --cdx-needle: #f472b6;
  --cdx-glow: #f9a8d4;
}
.cdx-card[data-style="minimal"] {
  --cdx-accent: #94a3b8;
  --cdx-accent-2: #64748b;
  --cdx-accent-3: #475569;
  --cdx-warn: #cbd5e1;
  --cdx-danger: #94a3b8;
  --cdx-needle: #64748b;
  --cdx-glow: #94a3b8;
}
.cdx-card[data-style="starfield"] {
  --cdx-accent: #818cf8;
  --cdx-accent-2: #22d3ee;
  --cdx-accent-3: #c084fc;
  --cdx-warn: #facc15;
  --cdx-danger: #fb7185;
  --cdx-needle: #22d3ee;
  --cdx-glow: #6366f1;
  background:
    radial-gradient(circle at 16% 18%, rgba(129, 140, 248, 0.55) 0 0.8px, transparent 1.6px),
    radial-gradient(circle at 74% 22%, rgba(34, 211, 238, 0.5) 0 0.8px, transparent 1.6px),
    radial-gradient(circle at 42% 64%, rgba(192, 132, 252, 0.42) 0 0.8px, transparent 1.6px),
    radial-gradient(circle at 86% 72%, rgba(129, 140, 248, 0.38) 0 0.8px, transparent 1.6px),
    radial-gradient(120% 90% at 18% 0%, color-mix(in srgb, var(--cdx-glow) 14%, transparent), transparent 58%),
    var(--dsw-alias-bg-layer-1);
}
.cdx-card, .cdx-card * { box-sizing: border-box; }
.cdx-top-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  display: flex;
}
.cdx-main {
  display: flex;
  align-items: center;
  gap: 2px;
}
.cdx-dual-gauges {
  display: flex;
  align-items: flex-start;
  gap: 2px;
}
.cdx-dual-gauges .cdx-gauge {
  width: calc(50% - 1px);
  margin-bottom: 4px;
}
.cdx-gauge-compact .cdx-readout {
  bottom: -3px;
}
.cdx-gauge-compact .cdx-speed {
  font-size: 15px;
}
.cdx-gauge-compact .cdx-unit {
  font-size: 7px;
}
.cdx-dual-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.cdx-dual-metric {
  min-width: 0;
  padding: 1px 4px 0;
}
.cdx-dual-metric + .cdx-dual-metric {
  border-left: 1px solid var(--dsw-alias-border-l1);
}
.cdx-dual-metric .cdx-stat-label {
  font-size: 8px;
}
.cdx-dual-metric .cdx-stat-row {
  margin-top: 1px;
  gap: 3px;
}
.cdx-dual-metric .cdx-token {
  font-size: 12px;
}
.cdx-dual-metric .cdx-money {
  font-size: 9px;
}
.cdx-gauge {
  position: relative;
  width: 48%;
  min-width: 0;
  aspect-ratio: 220 / 150;
  flex: none;
  margin-bottom: 6px;
}
.cdx-gauge-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.cdx-needle {
  transform-box: view-box;
  transform-origin: 110px 100px;
  transition: transform .72s cubic-bezier(.22, 1, .36, 1);
  will-change: transform;
}
.cdx-readout {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  color: var(--dsw-alias-label-primary);
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
}
.cdx-speed {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.04em;
}
.cdx-unit {
  color: var(--dsw-alias-label-secondary);
  font-size: 7.5px;
  letter-spacing: .01em;
}
.cdx-stats {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding-left: 4px;
}
.cdx-stat {
  min-width: 0;
  padding: 3px 0;
}
.cdx-stat + .cdx-stat {
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.cdx-stat-label {
  display: block;
  color: var(--dsw-alias-label-secondary);
  font-size: 8.5px;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cdx-stat-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 3px;
  margin-top: 1px;
}
.cdx-token {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -.04em;
  line-height: 1.1;
}
.cdx-money {
  flex: none;
  color: color-mix(in srgb, var(--cdx-accent-2) 72%, var(--dsw-alias-label-primary));
  font-size: 9.5px;
  font-weight: 650;
  line-height: 1.1;
  white-space: nowrap;
}
.cdx-cache {
  margin-top: 4px;
}
.cdx-cache-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--dsw-alias-label-secondary);
  font-size: 8.5px;
  line-height: 1.2;
}
.cdx-cache-pct {
  color: var(--dsw-alias-label-primary);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.cdx-style-btn {
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  cursor: pointer;
  flex: none;
}
.cdx-style-btn:hover,
.cdx-style-btn[aria-expanded="true"] {
  color: var(--cdx-accent);
  background: var(--dsw-alias-bg-layer-2);
}
.cdx-style-btn:focus-visible,
.cdx-style-option:focus-visible,
.cdx-layout-btn:focus-visible {
  outline: 2px solid var(--cdx-accent);
  outline-offset: 1px;
}
.cdx-settings {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.cdx-layout-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.cdx-layout-label {
  color: var(--dsw-alias-label-secondary);
  font-size: 8.5px;
}
.cdx-layout-options {
  display: flex;
  gap: 3px;
}
.cdx-layout-btn {
  padding: 2px 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 5px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
  font-family: inherit;
  font-size: 8px;
  line-height: 1.2;
  cursor: pointer;
}
.cdx-layout-btn:hover {
  color: var(--dsw-alias-label-primary);
}
.cdx-layout-btn[aria-pressed="true"] {
  border-color: var(--cdx-accent);
  color: var(--dsw-alias-label-primary);
}
.cdx-style-panel {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  margin-top: 4px;
}
.cdx-style-option {
  min-width: 0;
  padding: 4px 2px 3px;
  border: 1px solid transparent;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
  font-family: inherit;
  font-size: 7.5px;
  line-height: 1.1;
  cursor: pointer;
}
.cdx-style-option:hover {
  color: var(--dsw-alias-label-primary);
}
.cdx-style-option[aria-pressed="true"] {
  border-color: var(--cdx-accent);
  color: var(--dsw-alias-label-primary);
}
.cdx-swatch {
  width: 18px;
  height: 5px;
  border-radius: 999px;
  flex: none;
}
.cdx-cache-track {
  height: 4px;
  margin-top: 3px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  border: 1px solid var(--dsw-alias-border-l1);
  overflow: hidden;
}
.cdx-cache-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--cdx-accent), var(--cdx-accent-2) 72%, var(--cdx-accent-3));
  transition: width .8s cubic-bezier(.22, 1, .36, 1);
}
.cdx-rail {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-brand-primary);
}
@media (prefers-reduced-motion: reduce) {
  .cdx-needle, .cdx-cache-fill { transition: none; }
}
`;

    function number(value) {
      return typeof value === 'number' && Number.isFinite(value) ? value : 0;
    }

    function localDateKey() {
      const now = new Date();
      const part = (value) => String(value).padStart(2, '0');
      return `${now.getFullYear()}-${part(now.getMonth() + 1)}-${part(now.getDate())}`;
    }

    function formatTokens(value) {
      const count = Math.max(0, number(value));
      const [whole, fraction] = (count / 1000).toFixed(2).split('.');
      const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${grouped}.${fraction}k`;
    }

    function formatMoney(value) {
      const amount = Math.max(0, number(value));
      if (amount >= 1000) return `¥${(amount / 1000).toFixed(1)}k`;
      if (amount >= 10) return `¥${amount.toFixed(1)}`;
      return `¥${amount.toFixed(2)}`;
    }

    function readStyle() {
      try {
        if (typeof localStorage === 'undefined') return 'classical';
        const stored = localStorage.getItem(STYLE_KEY);
        return STYLES.some((entry) => entry.id === stored) ? stored : 'classical';
      } catch {
        return 'classical';
      }
    }

    function saveStyle(id) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(STYLE_KEY, id);
      } catch {
        // Persistence is optional; the in-memory selection still applies.
      }
    }

    function readLayout() {
      try {
        if (typeof localStorage === 'undefined') return 'single';
        return localStorage.getItem(LAYOUT_KEY) === 'dual' ? 'dual' : 'single';
      } catch {
        return 'single';
      }
    }

    function saveLayout(id) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(LAYOUT_KEY, id);
      } catch {
        // Persistence is optional; the in-memory selection still applies.
      }
    }

    function selectMainSessionId(snapshot) {
      if (!snapshot || typeof snapshot !== 'object') return undefined;
      const rows = snapshot.byId;
      if (!rows || typeof rows !== 'object') return undefined;
      for (const id of Object.keys(rows)) {
        const row = rows[id];
        if (row && row.retainedBy && number(row.retainedBy.mainView) > 0) return id;
      }
      return undefined;
    }

    function useNoSession() {
      return undefined;
    }

    function latestTurn(stats, sessionId) {
      const rows = stats && Array.isArray(stats.byTurn) ? stats.byTurn : [];
      let best = null;
      for (const row of rows) {
        if (!row) continue;
        if (sessionId && row.sessionId !== sessionId) continue;
        if (best === null || number(row.turn) > number(best.turn)) best = row;
      }
      return best;
    }

    function derive(stats, currentId) {
      const empty = {
        sessionId: currentId,
        tokens: 0,
        cost: 0,
        todayTokens: 0,
        todayCost: 0,
        cachePct: 0,
        ready: false,
      };
      if (!stats || typeof stats !== 'object') return empty;

      const rows = Array.isArray(stats.byTurn) ? stats.byTurn : [];
      let sessionId = currentId;
      if (!sessionId && rows.length > 0) {
        let newest = rows[0];
        for (const row of rows) {
          if (row && number(row.startedAt) > number(newest.startedAt)) newest = row;
        }
        sessionId = newest && newest.sessionId ? newest.sessionId : undefined;
      }

      let sessionInput = 0;
      let sessionOutput = 0;
      let sessionTurnCost = 0;
      for (const row of rows) {
        if (!row) continue;
        if (sessionId && row.sessionId !== sessionId) continue;
        sessionInput += number(row.input);
        sessionOutput += number(row.output);
        sessionTurnCost += number(row.cost);
      }

      let sessionCost = sessionTurnCost;
      const sessions = Array.isArray(stats.bySession) ? stats.bySession : [];
      for (const row of sessions) {
        if (row && row.id === sessionId) {
          sessionCost = number(row.cost) + number(row.subCost);
          break;
        }
      }

      const todayKey = localDateKey();
      const day = stats.byDay && typeof stats.byDay === 'object' ? stats.byDay[todayKey] : undefined;
      let todayTokens = 0;
      let todayCost = 0;
      let cacheHit = 0;
      let cacheMiss = 0;
      if (day && typeof day === 'object') {
        todayTokens = number(day.input) + number(day.output);
        todayCost = number(day.cost);
        cacheHit = number(day.cacheHit);
        cacheMiss = number(day.cacheMiss);
      }
      const cacheBase = cacheHit + cacheMiss;
      const cachePct = cacheBase > 0 ? Math.max(0, Math.min(100, (cacheHit / cacheBase) * 100)) : 0;

      return {
        sessionId,
        tokens: sessionInput + sessionOutput,
        cost: sessionCost,
        todayTokens,
        todayCost,
        cachePct,
        ready: true,
      };
    }

    function speedSample(turn, previous, at) {
      if (!turn || !turn.sessionId || turn.turn === undefined) {
        return { instant: 0, state: null };
      }
      const key = `${turn.sessionId}:${turn.turn}`;
      const output = number(turn.output);
      if (previous && previous.key === key) {
        const seconds = (at - previous.at) / 1000;
        const delta = output - previous.output;
        const instant = delta > 0 && seconds > 0.2 ? delta / seconds : 0;
        return { instant, state: { key, output, at } };
      }
      const startedAt = number(turn.startedAt);
      const endedAt = number(turn.endedAt);
      const instant = endedAt > startedAt && output > 0 ? output / ((endedAt - startedAt) / 1000) : 0;
      return { instant, state: { key, output, at } };
    }

    function estimateTokens(text) {
      if (typeof text !== 'string' || text.length === 0) return 0;
      let cjk = 0;
      let latin = 0;
      let other = 0;
      for (const character of text) {
        const code = character.codePointAt(0) || 0;
        if (
          (code >= 0x3040 && code <= 0x30ff) ||
          (code >= 0x3400 && code <= 0x4dbf) ||
          (code >= 0x4e00 && code <= 0x9fff) ||
          (code >= 0xac00 && code <= 0xd7af) ||
          (code >= 0xf900 && code <= 0xfaff)
        ) {
          cjk += 1;
        } else if (code < 128) {
          latin += 1;
        } else {
          other += 1;
        }
      }
      return cjk / 1.5 + latin / 4 + other / 3;
    }

    function createLiveMeter(ctx) {
      let activeId;
      let maxSeq = -1;
      let primed = false;

      return {
        read(sessionId) {
          if (!sessionId) {
            activeId = undefined;
            maxSeq = -1;
            primed = false;
            return 0;
          }
          if (sessionId !== activeId) {
            activeId = sessionId;
            maxSeq = -1;
            primed = false;
          }
          let binding;
          try {
            binding = ctx.sessions && typeof ctx.sessions.binding === 'function'
              ? ctx.sessions.binding(sessionId)
              : undefined;
          } catch {
            return 0;
          }
          if (!binding || !binding.eventSource || typeof binding.eventSource.getSnapshot !== 'function') return 0;
          let window;
          try {
            window = binding.eventSource.getSnapshot();
          } catch {
            return 0;
          }
          if (!window || !Array.isArray(window.entries)) return 0;

          let nextMax = maxSeq;
          let fresh = 0;
          for (const item of window.entries) {
            if (!item || item.type !== 'transient') continue;
            const event = item.event;
            if (!event || event.type !== 'assistant/live-chunk') continue;
            const seq = number(event.seq);
            if (seq > nextMax) nextMax = seq;
            if (!primed || seq <= maxSeq) continue;
            const chunk = event.data && event.data.chunk;
            if (!chunk) continue;
            if (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta') {
              fresh += estimateTokens(chunk.text);
            } else if (chunk.type === 'tool-call-delta') {
              fresh += estimateTokens(chunk.argumentsDelta);
            }
          }
          maxSeq = nextMax;
          if (!primed) {
            primed = true;
            return 0;
          }
          return fresh;
        },
      };
    }

    function polar(cx, cy, radius, degrees) {
      const radians = (degrees * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians),
      };
    }

    function arcPath(cx, cy, radius, start, end) {
      const from = polar(cx, cy, radius, start);
      const to = polar(cx, cy, radius, end);
      const large = end - start > 180 ? 1 : 0;
      return `M ${from.x.toFixed(2)} ${from.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
    }

    function Gauge({ value, min = 0, max = MAX_SPEED, step = 50, labels = [0, 250, 500], unit, digits = 0, variant = 'speed', compact = false, readoutValue, t, ariaLabel }) {
      const floor = number(min);
      const limit = Math.max(floor + 1, number(max));
      const clamped = Math.max(floor, Math.min(limit, number(value)));
      const angle = START_ANGLE + ((clamped - floor) / (limit - floor)) * SWEEP_ANGLE;
      const displayValue = readoutValue === undefined ? clamped : number(readoutValue);
      const colors = variant === 'cache'
        ? ['var(--cdx-accent)', 'var(--cdx-accent-2)', 'var(--cdx-accent-3)']
        : ['var(--cdx-accent)', 'var(--cdx-warn)', 'var(--cdx-danger)'];
      const ticks = [];
      for (let tick = floor; tick <= limit; tick += step) {
        const major = labels.includes(tick);
        const tickAngle = START_ANGLE + ((tick - floor) / (limit - floor)) * SWEEP_ANGLE;
        const outer = polar(110, 100, 84, tickAngle);
        const inner = polar(110, 100, major ? 70 : 75, tickAngle);
        ticks.push(h('line', {
          key: `tick-${tick}`,
          x1: inner.x.toFixed(2),
          y1: inner.y.toFixed(2),
          x2: outer.x.toFixed(2),
          y2: outer.y.toFixed(2),
          stroke: major ? 'var(--dsw-alias-label-secondary)' : 'var(--dsw-alias-border-l2)',
          strokeWidth: major ? 1.6 : 1,
          strokeLinecap: 'round',
          opacity: major ? 0.9 : 0.7,
        }));
        if (major) {
          const label = polar(110, 100, 94, tickAngle);
          ticks.push(h('text', {
            key: `label-${tick}`,
            x: label.x.toFixed(2),
            y: label.y.toFixed(2),
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            fill: 'var(--dsw-alias-label-secondary)',
            fontSize: compact ? 10 : 8.5,
            fontWeight: 600,
          }, String(tick)));
        }
      }

      return h('div', { className: `cdx-gauge${compact ? ' cdx-gauge-compact' : ''}` },
        h('svg', {
          className: 'cdx-gauge-svg',
          viewBox: '0 0 220 150',
          role: 'img',
          'aria-label': ariaLabel || (typeof t === 'function' ? t('gaugeLabel') : zh.gaugeLabel),
        },
          h('path', {
            d: arcPath(110, 100, 76, START_ANGLE, START_ANGLE + SWEEP_ANGLE),
            fill: 'none',
            stroke: 'var(--dsw-alias-bg-layer-2)',
            strokeWidth: 7,
            strokeLinecap: 'round',
          }),
          h('path', {
            d: arcPath(110, 100, 76, START_ANGLE, START_ANGLE + SWEEP_ANGLE * 0.6),
            fill: 'none',
            stroke: colors[0],
            strokeWidth: 5,
            strokeLinecap: 'butt',
          }),
          h('path', {
            d: arcPath(110, 100, 76, START_ANGLE + SWEEP_ANGLE * 0.6, START_ANGLE + SWEEP_ANGLE * 0.85),
            fill: 'none',
            stroke: colors[1],
            strokeWidth: 5,
            strokeLinecap: 'butt',
          }),
          h('path', {
            d: arcPath(110, 100, 76, START_ANGLE + SWEEP_ANGLE * 0.85, START_ANGLE + SWEEP_ANGLE),
            fill: 'none',
            stroke: colors[2],
            strokeWidth: 5,
            strokeLinecap: 'butt',
          }),
          ticks,
          h('g', {
            className: 'cdx-needle',
            style: {
              transform: `rotate(${angle}deg)`,
              transformOrigin: '110px 100px',
            },
          },
            h('polygon', {
              points: '110,96.5 181,100 110,103.5',
              fill: 'var(--cdx-needle)',
            }),
            h('line', {
              x1: 110,
              y1: 100,
              x2: 78,
              y2: 100,
              stroke: 'var(--cdx-needle)',
              strokeWidth: 2.2,
              strokeLinecap: 'round',
              opacity: 0.42,
            }),
          ),
          h('circle', {
            cx: 110,
            cy: 100,
            r: 9,
            fill: 'var(--dsw-alias-bg-layer-1)',
            stroke: 'var(--dsw-alias-border-l2)',
            strokeWidth: 1.5,
          }),
          h('circle', {
            cx: 110,
            cy: 100,
            r: 3.4,
            fill: 'var(--cdx-needle)',
          }),
        ),
        h('div', { className: 'cdx-readout' },
          h('span', { className: 'cdx-speed' }, digits > 0 ? displayValue.toFixed(digits) : String(Math.round(displayValue))),
          h('span', { className: 'cdx-unit' }, unit),
        ),
      );
    }

    function CostDashboard(props) {
      const wide = props.wide !== false;
      const t = props.t;
      const useSessions = props.useSessions;
      const useSessionList = typeof useSessions === 'function' ? useSessions : useNoSession;

      const currentId = useSessionList(selectMainSessionId);
      const [stats, setStats] = React.useState(null);
      const [speed, setSpeed] = React.useState(0);
      const [styleId, setStyleId] = React.useState(readStyle);
      const [settingsOpen, setSettingsOpen] = React.useState(false);
      const [layout, setLayout] = React.useState(readLayout);

      const speedRef = React.useRef(0);
      const sampleRef = React.useRef(null);
      const lastPollRef = React.useRef(0);
      const view = React.useMemo(() => derive(stats, currentId), [stats, currentId]);
      const sessionRef = React.useRef(view.sessionId);
      sessionRef.current = view.sessionId;

      const tr = (key) => {
        if (typeof t === 'function') {
          try {
            return t(key);
          } catch {
            return zh[key] || key;
          }
        }
        return zh[key] || key;
      };

      const chooseStyle = (id) => {
        setStyleId(id);
        setSettingsOpen(false);
        saveStyle(id);
      };

      const chooseLayout = (id) => {
        setLayout(id);
        setSettingsOpen(false);
        saveLayout(id);
      };

      const settingsButton = () => h('button', {
        type: 'button',
        className: 'cdx-style-btn',
        title: tr('style'),
        'aria-label': tr('style'),
        'aria-expanded': settingsOpen,
        onClick: () => setSettingsOpen((open) => !open),
      },
        h('svg', { viewBox: '0 0 16 16', width: 12, height: 12, 'aria-hidden': true },
          h('path', {
            d: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.2,
            strokeLinecap: 'round',
          }),
          h('circle', { cx: 5, cy: 4.5, r: 1.55, fill: 'currentColor' }),
          h('circle', { cx: 10.5, cy: 8, r: 1.55, fill: 'currentColor' }),
          h('circle', { cx: 6.5, cy: 11.5, r: 1.55, fill: 'currentColor' }),
        ),
      );

      const settingsPanel = () => settingsOpen && h('div', { className: 'cdx-settings' },
        h('div', { className: 'cdx-layout-row' },
          h('span', { className: 'cdx-layout-label' }, tr('layout')),
          h('div', { className: 'cdx-layout-options' },
            h('button', {
              type: 'button',
              className: 'cdx-layout-btn',
              'aria-pressed': layout === 'single',
              onClick: () => chooseLayout('single'),
            }, tr('layoutSingle')),
            h('button', {
              type: 'button',
              className: 'cdx-layout-btn',
              'aria-pressed': layout === 'dual',
              onClick: () => chooseLayout('dual'),
            }, tr('layoutDual')),
          ),
        ),
        h('div', {
          className: 'cdx-style-panel',
          role: 'group',
          'aria-label': tr('style'),
        },
          STYLES.map((entry) => h('button', {
            key: entry.id,
            type: 'button',
            className: 'cdx-style-option',
            'aria-pressed': styleId === entry.id,
            title: tr(entry.label),
            onClick: () => chooseStyle(entry.id),
          },
            h('span', {
              className: 'cdx-swatch',
              style: { background: `linear-gradient(90deg, ${entry.swatch[0]}, ${entry.swatch[1]})` },
            }),
            h('span', null, tr(entry.label)),
          )),
        ),
      );

      React.useEffect(() => {
        sampleRef.current = null;
        speedRef.current = 0;
        setSpeed(0);
      }, [currentId]);

      React.useEffect(() => {
        let disposed = false;
        let timer;
        const controller = new AbortController();

        const tick = async () => {
          if (disposed) return;
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
            timer = setTimeout(tick, POLL_MS);
            return;
          }
          try {
            const response = await fetch('/api/token-gauge/usage-stats', {
              cache: 'no-store',
              headers: { accept: 'application/json' },
              signal: controller.signal,
            });
            if (!response.ok) throw new Error(`usage-stats HTTP ${response.status}`);
            const next = await response.json();
            if (disposed) return;
            setStats(next);
            const now = Date.now();
            const seconds = lastPollRef.current > 0
              ? Math.max(0.5, (now - lastPollRef.current) / 1000)
              : POLL_MS / 1000;
            lastPollRef.current = now;
            const liveTokens = typeof props.readLiveTokens === 'function'
              ? number(props.readLiveTokens(sessionRef.current))
              : 0;
            let value = speedRef.current;
            if (liveTokens > 0) {
              const instant = liveTokens / seconds;
              value = value * 0.35 + instant * 0.65;
              sampleRef.current = null;
            } else {
              const turn = latestTurn(next, sessionRef.current);
              const sample = speedSample(turn, sampleRef.current, now);
              sampleRef.current = sample.state;
              if (sample.instant > 0) value = value * 0.35 + sample.instant * 0.65;
              else value *= 0.55;
            }
            if (!Number.isFinite(value) || value < 0.8) value = 0;
            speedRef.current = value;
            setSpeed(Math.min(MAX_SPEED, value));
          } catch (error) {
            if (disposed || controller.signal.aborted) return;
            speedRef.current *= 0.5;
            if (speedRef.current < 0.8) speedRef.current = 0;
            setSpeed(Math.min(MAX_SPEED, speedRef.current));
          } finally {
            if (!disposed) timer = setTimeout(tick, POLL_MS);
          }
        };

        tick();
        return () => {
          disposed = true;
          clearTimeout(timer);
          controller.abort();
        };
      }, []);

      const tokensText = view.ready ? formatTokens(view.tokens) : '--';
      const todayTokensText = view.ready ? formatTokens(view.todayTokens) : '--';
      const costText = view.ready ? formatMoney(view.cost) : '--';
      const todayCostText = view.ready ? formatMoney(view.todayCost) : '--';
      const cacheText = view.ready ? `${view.cachePct.toFixed(1)}%` : '--';
      const cacheWidth = view.ready ? Math.max(0, Math.min(100, view.cachePct)) : 0;
      const fullTokens = `${Math.round(view.tokens).toLocaleString('en-US')} ${tr('tokens')}`;
      const fullTodayTokens = `${Math.round(view.todayTokens).toLocaleString('en-US')} ${tr('tokens')}`;

      if (!wide) {
        return h('div', {
          className: 'cdx-rail',
          title: `${Math.round(speed)} ${tr('speedUnit')}`,
          'aria-label': `${Math.round(speed)} ${tr('speedUnit')}`,
        },
          h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, 'aria-hidden': true },
            h('path', {
              d: 'M4 16a8 8 0 0 1 16 0',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
              opacity: 0.45,
            }),
            h('path', {
              d: 'M4 16a8 8 0 0 1 6.2-7.8',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
            }),
            h('path', {
              d: 'M12 16 16.2 9.3',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
            }),
            h('circle', { cx: 12, cy: 16, r: 1.8, fill: 'currentColor' }),
          ),
        );
      }

      const cardProps = { className: 'cdx-card', 'data-style': styleId, 'data-layout': layout };

      if (layout === 'dual') {
        return h('div', cardProps,
          h('style', null, CSS),
          h('div', { className: 'cdx-top-actions' }, settingsButton()),
          h('div', { className: 'cdx-dual-gauges' },
            h(Gauge, {
              value: speed,
              max: MAX_SPEED,
              step: 50,
              labels: [0, 250, 500],
              unit: tr('speedUnit'),
              digits: 0,
              compact: true,
              t: t,
              ariaLabel: tr('gaugeLabel'),
            }),
            h(Gauge, {
              value: cacheWidth,
              min: 70,
              max: 100,
              step: 5,
              labels: [70, 85, 100],
              unit: tr('cacheUnit'),
              digits: 1,
              variant: 'cache',
              compact: true,
              readoutValue: view.ready ? view.cachePct : 0,
              t: t,
              ariaLabel: tr('cacheGaugeLabel'),
            }),
          ),
          h('div', { className: 'cdx-dual-metrics' },
            h('div', { className: 'cdx-dual-metric' },
              h('span', { className: 'cdx-stat-label' }, tr('current')),
              h('div', { className: 'cdx-stat-row' },
                h('span', { className: 'cdx-token', title: fullTokens }, tokensText),
                h('span', { className: 'cdx-money', title: `${tr('current')} ${costText}` }, costText),
              ),
            ),
            h('div', { className: 'cdx-dual-metric' },
              h('span', { className: 'cdx-stat-label' }, tr('today')),
              h('div', { className: 'cdx-stat-row' },
                h('span', { className: 'cdx-token', title: fullTodayTokens }, todayTokensText),
                h('span', { className: 'cdx-money', title: `${tr('today')} ${todayCostText}` }, todayCostText),
              ),
            ),
          ),
          settingsPanel(),
        );
      }

      return h('div', cardProps,
        h('style', null, CSS),
        h('div', { className: 'cdx-top-actions' }, settingsButton()),
        h('div', { className: 'cdx-main' },
          h(Gauge, {
            value: speed,
            max: MAX_SPEED,
            step: 50,
            labels: [0, 250, 500],
            unit: tr('speedUnit'),
            digits: 0,
            t: t,
            ariaLabel: tr('gaugeLabel'),
          }),
          h('div', { className: 'cdx-stats' },
            h('div', { className: 'cdx-stat' },
              h('span', { className: 'cdx-stat-label' }, tr('current')),
              h('div', { className: 'cdx-stat-row' },
                h('span', { className: 'cdx-token', title: fullTokens }, tokensText),
                h('span', { className: 'cdx-money', title: `${tr('current')} ${costText}` }, costText),
              ),
            ),
            h('div', { className: 'cdx-stat' },
              h('span', { className: 'cdx-stat-label' }, tr('today')),
              h('div', { className: 'cdx-stat-row' },
                h('span', { className: 'cdx-token', title: fullTodayTokens }, todayTokensText),
                h('span', { className: 'cdx-money', title: `${tr('today')} ${todayCostText}` }, todayCostText),
              ),
            ),
          ),
        ),
        h('div', { className: 'cdx-cache' },
          h('div', { className: 'cdx-cache-head' },
            h('span', null, tr('cache')),
            h('span', { className: 'cdx-cache-pct' }, cacheText),
          ),
          h('div', {
            className: 'cdx-cache-track',
            role: 'progressbar',
            'aria-label': tr('cache'),
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': Number(cacheWidth.toFixed(1)),
          },
            h('div', { className: 'cdx-cache-fill', style: { width: `${cacheWidth}%` } }),
          ),
        ),
        settingsPanel(),
      );
    }

    return {
      inject: ['slots', 'locale', 'sessions'],
      apply(ctx) {
        const liveMeter = createLiveMeter(ctx);
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'cost-dashboard: dictionaries');
        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'usage-billing',
          priority: -1,
          order: -10,
          locale: NS,
          inject: () => ({
            readLiveTokens: (sessionId) => liveMeter.read(sessionId),
          }),
        }, CostDashboard));
      },
    };
  },
});
