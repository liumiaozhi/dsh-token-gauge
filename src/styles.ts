// 风格与配色定义 + 全局 CSS 生成（纯浏览器端，无外部依赖）

export interface StyleDef {
  id: string
  labelZh: string
  labelEn: string
  className: string
}

export interface PaletteDef {
  id: string
  labelZh: string
  labelEn: string
  vars: Record<string, string>
}

// ≥5 种风格
export const STYLES: StyleDef[] = [
  { id: 'ev', labelZh: '现代电车科技', labelEn: 'Modern EV Tech', className: 'tg-style-ev' },
  { id: 'raw', labelZh: '原始机车', labelEn: 'Raw Motorcycle', className: 'tg-style-raw' },
  { id: 'luxury', labelZh: '豪华跑车', labelEn: 'Luxury Sports', className: 'tg-style-luxury' },
  { id: 'cute', labelZh: '可爱小车', labelEn: 'Cute Car', className: 'tg-style-cute' },
  { id: 'cyber', labelZh: '赛博朋克', labelEn: 'Cyberpunk', className: 'tg-style-cyber' },
  { id: 'retro', labelZh: '复古机械表盘', labelEn: 'Retro Dial', className: 'tg-style-retro' },
]

// ≥8 种配色（每个含一组 CSS 变量）
export const PALETTES: PaletteDef[] = [
  {
    id: 'amber',
    labelZh: '琥珀金',
    labelEn: 'Amber Gold',
    vars: {
      '--c-bg': '#1c1407',
      '--c-panel': '#2b2009',
      '--c-main': '#f5a623',
      '--c-track': '#3a2c0e',
      '--c-tick': '#f5c451',
      '--c-needle': '#ffcf5c',
      '--c-num': '#ffe39a',
      '--c-danger': '#ff5a3c',
      '--c-glow': 'rgba(245,166,35,0.55)',
      '--c-sub': '#caa85e',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'neon',
    labelZh: '霓虹蓝',
    labelEn: 'Neon Blue',
    vars: {
      '--c-bg': '#04111f',
      '--c-panel': '#072438',
      '--c-main': '#22d3ee',
      '--c-track': '#0b3550',
      '--c-tick': '#7fe9ff',
      '--c-needle': '#22d3ee',
      '--c-num': '#d6fbff',
      '--c-danger': '#ff4d6d',
      '--c-glow': 'rgba(34,211,238,0.55)',
      '--c-sub': '#7fb6cf',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'track-red',
    labelZh: '赛道红',
    labelEn: 'Track Red',
    vars: {
      '--c-bg': '#1a0608',
      '--c-panel': '#2a0a0e',
      '--c-main': '#ff3b4e',
      '--c-track': '#3a0d12',
      '--c-tick': '#ff8a96',
      '--c-needle': '#ff3b4e',
      '--c-num': '#ffd9dd',
      '--c-danger': '#ff7a00',
      '--c-glow': 'rgba(255,59,78,0.5)',
      '--c-sub': '#cf7a84',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'aurora',
    labelZh: '极光绿',
    labelEn: 'Aurora Green',
    vars: {
      '--c-bg': '#04140d',
      '--c-panel': '#07241a',
      '--c-main': '#34e0a1',
      '--c-track': '#0b3a29',
      '--c-tick': '#8af3cd',
      '--c-needle': '#34e0a1',
      '--c-num': '#d8ffee',
      '--c-danger': '#ffb020',
      '--c-glow': 'rgba(52,224,161,0.5)',
      '--c-sub': '#79c7a6',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'sakura',
    labelZh: '樱粉',
    labelEn: 'Sakura Pink',
    vars: {
      '--c-bg': '#2a111d',
      '--c-panel': '#3d1a2c',
      '--c-main': '#ff9ecb',
      '--c-track': '#4a2238',
      '--c-tick': '#ffc7e2',
      '--c-needle': '#ff9ecb',
      '--c-num': '#ffe6f3',
      '--c-danger': '#ff5d8f',
      '--c-glow': 'rgba(255,158,203,0.5)',
      '--c-sub': '#d29bbb',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'night-purple',
    labelZh: '暗夜紫',
    labelEn: 'Night Purple',
    vars: {
      '--c-bg': '#120a26',
      '--c-panel': '#1d1238',
      '--c-main': '#a78bfa',
      '--c-track': '#2a1c52',
      '--c-tick': '#cdbcff',
      '--c-needle': '#a78bfa',
      '--c-num': '#ece4ff',
      '--c-danger': '#ff5a8a',
      '--c-glow': 'rgba(167,139,250,0.5)',
      '--c-sub': '#9b86d6',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'titanium',
    labelZh: '钛银',
    labelEn: 'Titanium Silver',
    vars: {
      '--c-bg': '#0e1116',
      '--c-panel': '#1a1f27',
      '--c-main': '#c7d0db',
      '--c-track': '#2b323d',
      '--c-tick': '#9aa6b4',
      '--c-needle': '#e6edf5',
      '--c-num': '#f2f6fb',
      '--c-danger': '#ff5a3c',
      '--c-glow': 'rgba(199,208,219,0.35)',
      '--c-sub': '#8b95a3',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
  {
    id: 'volcano',
    labelZh: '火山橙',
    labelEn: 'Volcano Orange',
    vars: {
      '--c-bg': '#1f0d04',
      '--c-panel': '#321507',
      '--c-main': '#ff7a18',
      '--c-track': '#45200c',
      '--c-tick': '#ffb070',
      '--c-needle': '#ff7a18',
      '--c-num': '#ffe2cc',
      '--c-danger': '#ff3b2f',
      '--c-glow': 'rgba(255,122,24,0.5)',
      '--c-sub': '#cf9468',
      '--c-font': '"Segoe UI", system-ui, sans-serif',
    },
  },
]

export function getStyle(id: string): StyleDef {
  return STYLES.find((s) => s.id === id) || STYLES[0]
}

export function getPalette(id: string): PaletteDef {
  return PALETTES.find((p) => p.id === id) || PALETTES[1]
}

export function applyPalette(el: HTMLElement, paletteId: string): void {
  const p = getPalette(paletteId)
  for (const [k, v] of Object.entries(p.vars)) {
    el.style.setProperty(k, v)
  }
}

// 生成全局 CSS（只注入一次）
export function buildCss(): string {
  return `
.tg-root {
  --c-bg:#04111f; --c-panel:#072438; --c-main:#22d3ee; --c-track:#0b3550;
  --c-tick:#7fe9ff; --c-needle:#22d3ee; --c-num:#d6fbff; --c-danger:#ff4d6d;
  --c-glow:rgba(34,211,238,0.55); --c-sub:#7fb6cf; --c-font:"Segoe UI",system-ui,sans-serif;
  box-sizing:border-box; color:var(--c-num); font-family:var(--c-font);
  height:100%; display:flex; flex-direction:column; padding:10px; gap:6px;
  background:linear-gradient(160deg, var(--c-bg), var(--c-panel));
  border-radius:14px; overflow:auto; position:relative;
}
.tg-root * { box-sizing:border-box; }
.tg-head { display:flex; align-items:center; justify-content:space-between; }
.tg-title { font-size:13px; font-weight:700; letter-spacing:.5px; color:var(--c-num); }
.tg-gear {
  cursor:pointer; border:1px solid var(--c-track); background:var(--c-panel); color:var(--c-main);
  border-radius:8px; width:28px; height:28px; font-size:14px; line-height:1; display:flex;
  align-items:center; justify-content:center;
}
.tg-gear:hover { box-shadow:0 0 10px var(--c-glow); }
.tg-gauge-wrap { display:flex; flex-direction:column; align-items:center; gap:0; }
.tg-gauge { width:100%; max-width:200px; height:auto; display:block; filter:drop-shadow(0 0 6px var(--c-glow)); }
.tg-track { fill:none; stroke:var(--c-track); stroke-width:14; stroke-linecap:round; }
.tg-danger { fill:none; stroke:var(--c-danger); stroke-width:14; stroke-linecap:round; opacity:0; }
.tg-tick { stroke:var(--c-tick); stroke-width:2; }
.tg-ticklabel { fill:var(--c-sub); font-size:9px; font-family:var(--c-font); }
.tg-hub { fill:var(--c-main); }
.tg-needle { fill:var(--c-needle); transition:transform .6s cubic-bezier(.34,1.4,.5,1); transform-box:view-box; transform-origin:100px 100px; }
.tg-needle.tg-over { fill:var(--c-danger); }
.tg-extrashadow { fill:rgba(0,0,0,.25); }
.tg-readout { text-align:center; width:100%; margin-top:-16px; }
.tg-usage { font-size:22px; font-weight:800; color:var(--c-num); line-height:1.1; margin-top:1px; }
.tg-usage small { font-size:12px; color:var(--c-sub); font-weight:600; margin-left:4px; }
.tg-cost { font-size:17px; font-weight:700; color:var(--c-main); margin-top:0; }
.tg-cards { display:grid; grid-template-columns:1fr 1fr; gap:6px; width:100%; margin-top:4px; }
.tg-card { background:var(--c-panel); border:1px solid var(--c-track); border-radius:8px; padding:6px 8px; }
.tg-card .k { font-size:10px; color:var(--c-sub); }
.tg-card .v { font-size:13px; font-weight:700; color:var(--c-num); }
.tg-empty { color:var(--c-sub); font-size:12px; text-align:center; padding:20px 0; }

/* 设置弹窗 */
.tg-modal-mask {
  position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center;
  z-index:9999; padding:16px;
}
.tg-modal {
  width:min(420px, 100%); max-height:88%; overflow:auto; background:var(--c-panel); color:var(--c-num);
  border:1px solid var(--c-main); border-radius:14px; padding:16px; font-family:var(--c-font);
  box-shadow:0 0 24px var(--c-glow);
}
.tg-modal h3 { margin:0 0 10px; font-size:15px; color:var(--c-main); }
.tg-field { margin-bottom:12px; }
.tg-field > label { display:block; font-size:12px; color:var(--c-sub); margin-bottom:5px; }
.tg-row { display:flex; flex-wrap:wrap; gap:6px; }
.tg-chip {
  cursor:pointer; border:1px solid var(--c-track); background:var(--c-bg); color:var(--c-num);
  border-radius:999px; padding:5px 10px; font-size:12px; user-select:none;
}
.tg-chip.on { border-color:var(--c-main); color:var(--c-main); box-shadow:0 0 8px var(--c-glow); }
.tg-input {
  width:100%; background:var(--c-bg); border:1px solid var(--c-track); color:var(--c-num);
  border-radius:8px; padding:7px 9px; font-size:13px; font-family:var(--c-font);
}
.tg-input:focus { outline:none; border-color:var(--c-main); }
.tg-toggle { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--c-sub); margin:3px 0; }
.tg-actions { display:flex; gap:8px; margin-top:8px; }
.tg-btn {
  flex:1; cursor:pointer; border:1px solid var(--c-main); background:var(--c-main); color:#06121c;
  border-radius:9px; padding:9px; font-size:13px; font-weight:700; font-family:var(--c-font);
}
.tg-btn.ghost { background:transparent; color:var(--c-num); border-color:var(--c-track); }
.tg-btn:hover { filter:brightness(1.08); }
.tg-hint { font-size:11px; color:var(--c-sub); margin-top:4px; }

/* ---- 风格差异化装饰 ---- */
.tg-style-ev .tg-gauge-wrap { backdrop-filter:blur(2px); }
.tg-style-raw {
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 2px, rgba(0,0,0,.06) 2px 4px),
    linear-gradient(160deg, #2a2a2a, #4a4a4a);
  border:3px solid #6b6b6b;
}
.tg-style-raw .tg-panel-deco::before,
.tg-style-raw .tg-panel-deco::after {
  content:""; position:absolute; width:8px; height:8px; border-radius:50%;
  background:radial-gradient(circle at 30% 30%, #fff, #888); top:8px;
}
.tg-style-raw .tg-panel-deco::before { left:8px; }
.tg-style-raw .tg-panel-deco::after { right:8px; }
.tg-style-luxury {
  background:
    repeating-linear-gradient(45deg, #0c0c0c 0 6px, #161616 6px 12px),
    linear-gradient(160deg, #1a0a0c, #2a0f12);
  border:2px solid #d4af37;
}
.tg-style-luxury .tg-title { color:#f3d27a; }
.tg-style-cute {
  background:linear-gradient(160deg, #fff0f6, #ffe1ee); color:#7a3b56;
  border:3px solid #ffc2dd; border-radius:22px;
}
.tg-style-cute .tg-usage, .tg-style-cute .tg-cost, .tg-style-cute .tg-title, .tg-style-cute .tg-card .v { color:#a6446f; }
  .tg-style-cute .tg-card { background:#fff6fb; border-color:#ffd0e6; }
  .tg-style-cute .tg-card .k { color:#c98bb0; }
.tg-style-cute .tg-track { stroke:#ffd0e6; }
.tg-style-cyber {
  background:linear-gradient(160deg, #0a0014, #16002a);
  border:2px solid #ff2bd6;
}
.tg-style-cyber .tg-title { color:#22e7ff; text-shadow:1px 0 #ff2bd6, -1px 0 #22e7ff; }
.tg-style-cyber .tg-gauge { filter:drop-shadow(0 0 8px #22e7ff) drop-shadow(0 0 4px #ff2bd6); }
.tg-style-retro {
  background:linear-gradient(160deg, #f3e9cf, #e7d8b0); color:#5b3a1a;
  border:3px double #8a6a3a; border-radius:10px;
}
.tg-style-retro .tg-usage, .tg-style-retro .tg-cost, .tg-style-retro .tg-title, .tg-style-retro .tg-card .v { color:#5b3a1a; }
.tg-style-retro .tg-title { font-family:Georgia, "Times New Roman", serif; }
.tg-style-retro .tg-card { background:#efe3c4; border-color:#b89a64; }
.tg-style-retro .tg-card .k { color:#8a6a3a; }
.tg-style-retro .tg-track { stroke:#c9b58a; }
.tg-style-retro .tg-tick { stroke:#8a6a3a; }
.tg-style-retro .tg-ticklabel { fill:#8a6a3a; }
`
}
