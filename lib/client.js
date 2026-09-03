// src/styles.ts
var STYLES = [
  { id: "ev", labelZh: "\u73B0\u4EE3\u7535\u8F66\u79D1\u6280", labelEn: "Modern EV Tech", className: "tg-style-ev" },
  { id: "raw", labelZh: "\u539F\u59CB\u673A\u8F66", labelEn: "Raw Motorcycle", className: "tg-style-raw" },
  { id: "luxury", labelZh: "\u8C6A\u534E\u8DD1\u8F66", labelEn: "Luxury Sports", className: "tg-style-luxury" },
  { id: "cute", labelZh: "\u53EF\u7231\u5C0F\u8F66", labelEn: "Cute Car", className: "tg-style-cute" },
  { id: "cyber", labelZh: "\u8D5B\u535A\u670B\u514B", labelEn: "Cyberpunk", className: "tg-style-cyber" },
  { id: "retro", labelZh: "\u590D\u53E4\u673A\u68B0\u8868\u76D8", labelEn: "Retro Dial", className: "tg-style-retro" }
];
var PALETTES = [
  {
    id: "amber",
    labelZh: "\u7425\u73C0\u91D1",
    labelEn: "Amber Gold",
    vars: {
      "--c-bg": "#1c1407",
      "--c-panel": "#2b2009",
      "--c-main": "#f5a623",
      "--c-track": "#3a2c0e",
      "--c-tick": "#f5c451",
      "--c-needle": "#ffcf5c",
      "--c-num": "#ffe39a",
      "--c-danger": "#ff5a3c",
      "--c-glow": "rgba(245,166,35,0.55)",
      "--c-sub": "#caa85e",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "neon",
    labelZh: "\u9713\u8679\u84DD",
    labelEn: "Neon Blue",
    vars: {
      "--c-bg": "#04111f",
      "--c-panel": "#072438",
      "--c-main": "#22d3ee",
      "--c-track": "#0b3550",
      "--c-tick": "#7fe9ff",
      "--c-needle": "#22d3ee",
      "--c-num": "#d6fbff",
      "--c-danger": "#ff4d6d",
      "--c-glow": "rgba(34,211,238,0.55)",
      "--c-sub": "#7fb6cf",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "track-red",
    labelZh: "\u8D5B\u9053\u7EA2",
    labelEn: "Track Red",
    vars: {
      "--c-bg": "#1a0608",
      "--c-panel": "#2a0a0e",
      "--c-main": "#ff3b4e",
      "--c-track": "#3a0d12",
      "--c-tick": "#ff8a96",
      "--c-needle": "#ff3b4e",
      "--c-num": "#ffd9dd",
      "--c-danger": "#ff7a00",
      "--c-glow": "rgba(255,59,78,0.5)",
      "--c-sub": "#cf7a84",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "aurora",
    labelZh: "\u6781\u5149\u7EFF",
    labelEn: "Aurora Green",
    vars: {
      "--c-bg": "#04140d",
      "--c-panel": "#07241a",
      "--c-main": "#34e0a1",
      "--c-track": "#0b3a29",
      "--c-tick": "#8af3cd",
      "--c-needle": "#34e0a1",
      "--c-num": "#d8ffee",
      "--c-danger": "#ffb020",
      "--c-glow": "rgba(52,224,161,0.5)",
      "--c-sub": "#79c7a6",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "sakura",
    labelZh: "\u6A31\u7C89",
    labelEn: "Sakura Pink",
    vars: {
      "--c-bg": "#2a111d",
      "--c-panel": "#3d1a2c",
      "--c-main": "#ff9ecb",
      "--c-track": "#4a2238",
      "--c-tick": "#ffc7e2",
      "--c-needle": "#ff9ecb",
      "--c-num": "#ffe6f3",
      "--c-danger": "#ff5d8f",
      "--c-glow": "rgba(255,158,203,0.5)",
      "--c-sub": "#d29bbb",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "night-purple",
    labelZh: "\u6697\u591C\u7D2B",
    labelEn: "Night Purple",
    vars: {
      "--c-bg": "#120a26",
      "--c-panel": "#1d1238",
      "--c-main": "#a78bfa",
      "--c-track": "#2a1c52",
      "--c-tick": "#cdbcff",
      "--c-needle": "#a78bfa",
      "--c-num": "#ece4ff",
      "--c-danger": "#ff5a8a",
      "--c-glow": "rgba(167,139,250,0.5)",
      "--c-sub": "#9b86d6",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "titanium",
    labelZh: "\u949B\u94F6",
    labelEn: "Titanium Silver",
    vars: {
      "--c-bg": "#0e1116",
      "--c-panel": "#1a1f27",
      "--c-main": "#c7d0db",
      "--c-track": "#2b323d",
      "--c-tick": "#9aa6b4",
      "--c-needle": "#e6edf5",
      "--c-num": "#f2f6fb",
      "--c-danger": "#ff5a3c",
      "--c-glow": "rgba(199,208,219,0.35)",
      "--c-sub": "#8b95a3",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  },
  {
    id: "volcano",
    labelZh: "\u706B\u5C71\u6A59",
    labelEn: "Volcano Orange",
    vars: {
      "--c-bg": "#1f0d04",
      "--c-panel": "#321507",
      "--c-main": "#ff7a18",
      "--c-track": "#45200c",
      "--c-tick": "#ffb070",
      "--c-needle": "#ff7a18",
      "--c-num": "#ffe2cc",
      "--c-danger": "#ff3b2f",
      "--c-glow": "rgba(255,122,24,0.5)",
      "--c-sub": "#cf9468",
      "--c-font": '"Segoe UI", system-ui, sans-serif'
    }
  }
];
function getStyle(id) {
  return STYLES.find((s) => s.id === id) || STYLES[0];
}
function getPalette(id) {
  return PALETTES.find((p) => p.id === id) || PALETTES[1];
}
function applyPalette(el, paletteId) {
  const p = getPalette(paletteId);
  for (const [k, v] of Object.entries(p.vars)) {
    el.style.setProperty(k, v);
  }
}
function buildCss() {
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

/* \u8BBE\u7F6E\u5F39\u7A97 */
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

/* ---- \u98CE\u683C\u5DEE\u5F02\u5316\u88C5\u9970 ---- */
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
`;
}

// src/util.ts
function formatInt(n) {
  return Math.round(n || 0).toLocaleString("en-US");
}
function formatMoney(n) {
  return "\xA5" + (n || 0).toFixed(2);
}
function formatCompact(n) {
  const v = Math.round(n || 0);
  if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(v >= 1e4 ? 0 : 1) + "K";
  return String(v);
}
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function autoMax(value) {
  const v = Math.max(0, value);
  for (let exp = 3; exp <= 12; exp++) {
    for (const m of [1, 2, 5]) {
      const cand = m * Math.pow(10, exp);
      if (cand >= v) return cand;
    }
  }
  return Math.pow(10, 12);
}

// src/gauge.ts
var SVGNS = "http://www.w3.org/2000/svg";
var CX = 100;
var CY = 100;
var R = 78;
var START = 150;
var END = 390;
var SWEEP = END - START;
function polar(angleDeg, r) {
  const a = angleDeg * Math.PI / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
function arcPath(r, a0, a1) {
  const [sx, sy] = polar(a0, r);
  const [ex, ey] = polar(a1, r);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}
function svg(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function createGauge() {
  const wrap = document.createElement("div");
  wrap.className = "tg-gauge-wrap";
  const s = svg("svg", { class: "tg-gauge", viewBox: "0 0 200 200", role: "img" });
  s.appendChild(svg("path", { class: "tg-track", d: arcPath(R, START, END) }));
  const dangerEl = svg("path", { class: "tg-danger", d: arcPath(R, START + SWEEP * 0.85, END) });
  s.appendChild(dangerEl);
  const labelEls = [];
  for (let i = 0; i <= 10; i++) {
    const frac = i / 10;
    const ang = START + SWEEP * frac;
    const major = i % 5 === 0;
    const rOut = R + (major ? 9 : 5);
    const rIn = R - 2;
    const [x1, y1] = polar(ang, rOut);
    const [x2, y2] = polar(ang, rIn);
    s.appendChild(svg("line", { class: "tg-tick", x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), "stroke-width": major ? "2.5" : "1.5" }));
    if (major) {
      const [lx, ly] = polar(ang, R - 18);
      const txt = svg("text", { class: "tg-ticklabel", x: lx.toFixed(2), y: (ly + 3).toFixed(2), "text-anchor": "middle" });
      txt.textContent = String(Math.round(frac * 100));
      s.appendChild(txt);
      labelEls.push({ el: txt, frac });
    }
  }
  const needle = svg("g", { class: "tg-needle" });
  const tipY = CY - (R - 14);
  const poly = svg("polygon", {
    points: `${CX},${tipY} ${CX - 4},${CY + 6} ${CX},${CY + 14} ${CX + 4},${CY + 6}`
  });
  needle.appendChild(poly);
  s.appendChild(needle);
  s.appendChild(svg("circle", { class: "tg-hub", cx: String(CX), cy: String(CY), r: "6" }));
  wrap.appendChild(s);
  const readout = document.createElement("div");
  readout.className = "tg-readout";
  const costEl = document.createElement("div");
  costEl.className = "tg-cost";
  const usageEl = document.createElement("div");
  usageEl.className = "tg-usage";
  const cards = document.createElement("div");
  cards.className = "tg-cards";
  readout.append(costEl, usageEl, cards);
  wrap.appendChild(readout);
  const update = (p) => {
    const max = p.limit && p.limit > 0 ? p.limit : autoMax(p.value);
    const ratio = max > 0 ? p.value / max : 0;
    const visual = clamp(ratio, 0, 1);
    const needleAngle = START + visual * SWEEP;
    const deg = needleAngle - 270;
    needle.style.transform = `rotate(${deg.toFixed(2)}deg)`;
    for (const { el, frac } of labelEls) el.textContent = formatCompact(max * frac);
    const over = ratio >= 1;
    const proximity = clamp((ratio - 0.7) / 0.3, 0, 1);
    dangerEl.style.opacity = (proximity * 0.95).toFixed(3);
    needle.setAttribute("class", over ? "tg-needle tg-over" : "tg-needle");
    if (p.display.cost) {
      costEl.style.display = "";
      costEl.textContent = formatMoney(p.cost);
    } else costEl.style.display = "none";
    if (p.display.usage) {
      usageEl.style.display = "";
      usageEl.innerHTML = `${(p.value / 1e3).toLocaleString("en-US", { maximumFractionDigits: 1 })}<small>k tokens</small>`;
    } else usageEl.style.display = "none";
    cards.innerHTML = "";
    const addCard = (k, v) => {
      const c = document.createElement("div");
      c.className = "tg-card";
      c.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
      cards.appendChild(c);
    };
    if (p.display.io) {
      addCard(p.t("input"), formatInt(p.state?.global?.input || 0));
      addCard(p.t("output"), formatInt(p.state?.global?.output || 0));
    }
    if (p.display.cacheMiss) {
      const hit = p.state?.global?.cacheRead || 0;
      const input = p.state?.global?.input || 0;
      const miss = Math.max(0, input - hit);
      addCard(p.t("cacheHit"), formatInt(hit));
      addCard(p.t("cacheMiss"), formatInt(miss));
    }
  };
  return { el: wrap, update };
}

// src/i18n.ts
var I18N = {
  title: { zh: "Token \u4EEA\u8868\u76D8", en: "Token Gauge" },
  settings: { zh: "\u8BBE\u7F6E", en: "Settings" },
  style: { zh: "\u98CE\u683C", en: "Style" },
  palette: { zh: "\u914D\u8272", en: "Palette" },
  display: { zh: "\u663E\u793A\u5185\u5BB9", en: "Display" },
  metric: { zh: "\u7528\u91CF\u53E3\u5F84", en: "Metric" },
  limit: { zh: "\u9650\u989D", en: "Limit" },
  limitGlobal: { zh: "\u5168\u5C40\u9650\u989D", en: "Global limit" },
  limitDaily: { zh: "\u65E5\u9650\u989D", en: "Daily limit" },
  limitWeekly: { zh: "\u5468\u9650\u989D", en: "Weekly limit" },
  limitMonthly: { zh: "\u6708\u9650\u989D", en: "Monthly limit" },
  usage: { zh: "\u7528\u91CF", en: "Usage" },
  cost: { zh: "\u8D39\u7528", en: "Cost" },
  input: { zh: "\u8F93\u5165", en: "Input" },
  output: { zh: "\u8F93\u51FA", en: "Output" },
  cacheMiss: { zh: "\u7F13\u5B58\u672A\u547D\u4E2D", en: "Cache miss" },
  lang: { zh: "\u8BED\u8A00", en: "Language" },
  export: { zh: "\u5BFC\u51FA\u62A5\u8868", en: "Export report" },
  exportCsv: { zh: "CSV", en: "CSV" },
  exportJson: { zh: "JSON", en: "JSON" },
  close: { zh: "\u5173\u95ED", en: "Close" },
  save: { zh: "\u4FDD\u5B58", en: "Save" },
  reset: { zh: "\u6062\u590D\u9ED8\u8BA4", en: "Reset" },
  clear: { zh: "\u6E05\u7A7A\u7528\u91CF", en: "Clear usage" },
  advanced: { zh: "\u9AD8\u7EA7\xB7\u5B9A\u4EF7(\xA5/\u767E\u4E07token)", en: "Advanced \xB7 Pricing (\xA5/M tokens)" },
  overLimit: { zh: "\u5DF2\u8D85\u51FA\u9650\u989D\uFF01", en: "Over limit!" },
  noData: { zh: "\u6682\u65E0\u7528\u91CF\u6570\u636E\uFF0C\u5F00\u59CB\u5BF9\u8BDD\u540E\u6B64\u5904\u4F1A\u5B9E\u65F6\u66F4\u65B0\u3002", en: "No usage yet. Start a chat to see live updates." },
  autoScale: { zh: "\u81EA\u52A8\u91CF\u7A0B", en: "auto" },
  metricGlobal: { zh: "\u5168\u5C40\u7D2F\u8BA1", en: "Global" },
  metricSession: { zh: "\u5F53\u524D\u4F1A\u8BDD", en: "Session" },
  metricToday: { zh: "\u4ECA\u65E5", en: "Today" },
  metricDaily: { zh: "\u6BCF\u65E5", en: "Daily" },
  metricWeekly: { zh: "\u6BCF\u5468", en: "Weekly" },
  metricMonthly: { zh: "\u6BCF\u6708", en: "Monthly" },
  inputTokens: { zh: "\u8F93\u5165 Token", en: "Input tokens" },
  outputTokens: { zh: "\u8F93\u51FA Token", en: "Output tokens" },
  cacheHit: { zh: "\u7F13\u5B58\u547D\u4E2D", en: "Cache hit" },
  cacheWrite: { zh: "\u7F13\u5B58\u5199\u5165", en: "Cache write" },
  model: { zh: "\u6A21\u578B", en: "Model" },
  period: { zh: "\u5468\u671F", en: "Period" },
  totalCost: { zh: "\u603B\u8D39\u7528", en: "Total cost" },
  totalTokens: { zh: "\u603B Token", en: "Total tokens" },
  calls: { zh: "\u8C03\u7528\u6B21\u6570", en: "Calls" },
  hintLimit: { zh: "\u7559\u7A7A\u8868\u793A\u4E0D\u9650\uFF08\u4EEA\u8868\u76D8\u81EA\u52A8\u91CF\u7A0B\uFF09\u3002", en: "Leave empty for no limit (auto scale)." }
};
function t(lang, key) {
  const e = I18N[key];
  if (!e) return key;
  return e[lang] ?? e.zh;
}
function metricLabel(lang, metric) {
  return t(lang, "metric" + metric.charAt(0).toUpperCase() + metric.slice(1));
}

// src/export.ts
function total(b) {
  return (b.input || 0) + (b.cacheRead || 0) + (b.cacheWrite || 0) + (b.output || 0);
}
function num(v) {
  return String(Math.round(v || 0));
}
function rowOf(key, b) {
  return [key, num(b.input), num(b.cacheRead), num(b.cacheWrite), num(b.output), num(total(b)), (b.cost || 0).toFixed(4), num(b.calls)];
}
function buildCsv(state, lang) {
  const L = (k) => t(lang, k);
  const lines = [];
  lines.push(`# ${L("title")} - ${(/* @__PURE__ */ new Date()).toLocaleString(lang === "zh" ? "zh-CN" : "en-US")}`);
  lines.push("");
  lines.push(`# ${L("global")}`);
  lines.push(["", L("inputTokens"), L("cacheHit"), L("cacheWrite"), L("outputTokens"), L("totalTokens"), L("totalCost") + "(\xA5)", L("calls")].join(","));
  lines.push(rowOf(L("global"), state.global || {}).join(","));
  lines.push("");
  lines.push(`# ${L("model")}`);
  lines.push(["", L("inputTokens"), L("cacheHit"), L("cacheWrite"), L("outputTokens"), L("totalTokens"), L("totalCost") + "(\xA5)", L("calls")].join(","));
  for (const [k, v] of Object.entries(state.models || {})) lines.push(rowOf(k, v).join(","));
  for (const period of ["daily", "weekly", "monthly", "sessions"]) {
    const map = state[period] || {};
    const title = period === "daily" ? L("metricDaily") : period === "weekly" ? L("metricWeekly") : period === "monthly" ? L("metricMonthly") : L("sessions");
    lines.push("");
    lines.push(`# ${title}`);
    lines.push(["", L("inputTokens"), L("cacheHit"), L("cacheWrite"), L("outputTokens"), L("totalTokens"), L("totalCost") + "(\xA5)", L("calls")].join(","));
    for (const [k, v] of Object.entries(map)) lines.push(rowOf(k, v).join(","));
  }
  return lines.join("\n");
}
function buildJson(state) {
  return JSON.stringify(
    {
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      global: state.global || {},
      models: state.models || {},
      daily: state.daily || {},
      weekly: state.weekly || {},
      monthly: state.monthly || {},
      sessions: state.sessions || {},
      settings: state.settings || {}
    },
    null,
    2
  );
}
function downloadReport(state, lang, format) {
  const content = format === "csv" ? buildCsv(state, lang) : buildJson(state);
  const mime = format === "csv" ? "text/csv;charset=utf-8" : "application/json";
  const filename = `token-gauge-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.${format}`;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}

// src/settings.ts
function chip(label, on, onClick) {
  const c = document.createElement("div");
  c.className = "tg-chip" + (on ? " on" : "");
  c.textContent = label;
  c.addEventListener("click", onClick);
  return c;
}
function createSettingsModal(opts) {
  const mask = document.createElement("div");
  mask.className = "tg-modal-mask";
  mask.style.display = "none";
  const box = document.createElement("div");
  box.className = "tg-modal";
  mask.appendChild(box);
  let openState = null;
  let isOpen = false;
  const render = (state) => {
    const lang = opts.getLang();
    const s = state.settings;
    box.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = t(lang, "settings");
    box.appendChild(title);
    const langField = document.createElement("div");
    langField.className = "tg-field";
    langField.innerHTML = `<label>${t(lang, "lang")}</label>`;
    const langRow = document.createElement("div");
    langRow.className = "tg-row";
    langRow.append(
      chip("\u4E2D\u6587", s.lang === "zh", () => opts.onSettings({ lang: "zh" })),
      chip("English", s.lang === "en", () => opts.onSettings({ lang: "en" }))
    );
    langField.appendChild(langRow);
    box.appendChild(langField);
    const styleField = document.createElement("div");
    styleField.className = "tg-field";
    styleField.innerHTML = `<label>${t(lang, "style")}</label>`;
    const styleRow = document.createElement("div");
    styleRow.className = "tg-row";
    for (const st of STYLES) {
      styleRow.appendChild(
        chip(lang === "zh" ? st.labelZh : st.labelEn, s.style === st.id, () => opts.onSettings({ style: st.id }))
      );
    }
    styleField.appendChild(styleRow);
    box.appendChild(styleField);
    const palField = document.createElement("div");
    palField.className = "tg-field";
    palField.innerHTML = `<label>${t(lang, "palette")}</label>`;
    const palRow = document.createElement("div");
    palRow.className = "tg-row";
    for (const p of PALETTES) {
      palRow.appendChild(
        chip(lang === "zh" ? p.labelZh : p.labelEn, s.palette === p.id, () => opts.onSettings({ palette: p.id }))
      );
    }
    palField.appendChild(palRow);
    box.appendChild(palField);
    const metricField = document.createElement("div");
    metricField.className = "tg-field";
    metricField.innerHTML = `<label>${t(lang, "metric")}</label>`;
    const metricRow = document.createElement("div");
    metricRow.className = "tg-row";
    for (const m of ["global", "session", "today", "daily", "weekly", "monthly"]) {
      metricRow.appendChild(chip(metricLabel(lang, m), s.metric === m, () => opts.onSettings({ metric: m })));
    }
    metricField.appendChild(metricRow);
    box.appendChild(metricField);
    const dispField = document.createElement("div");
    dispField.className = "tg-field";
    dispField.innerHTML = `<label>${t(lang, "display")}</label>`;
    const dispKeys = [
      { key: "usage", label: t(lang, "usage") },
      { key: "cost", label: t(lang, "cost") },
      { key: "io", label: t(lang, "input") + "/" + t(lang, "output") },
      { key: "cacheMiss", label: t(lang, "cacheMiss") }
    ];
    for (const d of dispKeys) {
      const row = document.createElement("label");
      row.className = "tg-toggle";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!s.display[d.key];
      cb.addEventListener("change", () => {
        const next = { ...s.display, [d.key]: cb.checked };
        opts.onSettings({ display: next });
      });
      row.append(cb, document.createTextNode(d.label));
      dispField.appendChild(row);
    }
    box.appendChild(dispField);
    const limitField = document.createElement("div");
    limitField.className = "tg-field";
    limitField.innerHTML = `<label>${t(lang, "limit")}</label>`;
    const limitDefs = [
      { key: "global", label: t(lang, "limitGlobal") },
      { key: "daily", label: t(lang, "limitDaily") },
      { key: "weekly", label: t(lang, "limitWeekly") },
      { key: "monthly", label: t(lang, "limitMonthly") }
    ];
    for (const ld of limitDefs) {
      const wrap = document.createElement("div");
      const lab = document.createElement("label");
      lab.className = "tg-toggle";
      lab.textContent = ld.label;
      const inp = document.createElement("input");
      inp.className = "tg-input";
      inp.type = "number";
      inp.min = "0";
      inp.placeholder = "\u221E";
      inp.value = s.limits[ld.key] == null ? "" : String(s.limits[ld.key]);
      inp.addEventListener("change", () => {
        const v = inp.value.trim();
        const val = v === "" ? null : Math.max(0, Number(v));
        if (v !== "" && Number.isNaN(Number(v))) return;
        opts.onSettings({ limits: { ...s.limits, [ld.key]: val } });
      });
      wrap.append(lab, inp);
      limitField.appendChild(wrap);
    }
    const hint = document.createElement("div");
    hint.className = "tg-hint";
    hint.textContent = t(lang, "hintLimit");
    limitField.appendChild(hint);
    box.appendChild(limitField);
    const advField = document.createElement("div");
    advField.className = "tg-field";
    advField.innerHTML = `<label>${t(lang, "advanced")}</label>`;
    const ta = document.createElement("textarea");
    ta.className = "tg-input";
    ta.rows = 5;
    ta.style.fontFamily = "monospace";
    ta.value = JSON.stringify(s.pricing || {}, null, 2);
    advField.appendChild(ta);
    const advErr = document.createElement("div");
    advErr.className = "tg-hint";
    advErr.style.color = "var(--c-danger)";
    const savePrice = document.createElement("button");
    savePrice.className = "tg-btn ghost";
    savePrice.style.marginTop = "6px";
    savePrice.textContent = t(lang, "save");
    savePrice.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(ta.value || "{}");
        opts.onSettings({ pricing: parsed });
        advErr.textContent = "";
      } catch (e) {
        advErr.textContent = String(e);
      }
    });
    advField.append(savePrice, advErr);
    box.appendChild(advField);
    const expField = document.createElement("div");
    expField.className = "tg-field";
    expField.innerHTML = `<label>${t(lang, "export")}</label>`;
    const expRow = document.createElement("div");
    expRow.className = "tg-actions";
    const csvBtn = document.createElement("button");
    csvBtn.className = "tg-btn ghost";
    csvBtn.textContent = "CSV";
    csvBtn.addEventListener("click", () => opts.onExport("csv"));
    const jsonBtn = document.createElement("button");
    jsonBtn.className = "tg-btn ghost";
    jsonBtn.textContent = "JSON";
    jsonBtn.addEventListener("click", () => opts.onExport("json"));
    expRow.append(csvBtn, jsonBtn);
    expField.appendChild(expRow);
    box.appendChild(expField);
    const act = document.createElement("div");
    act.className = "tg-actions";
    const clearBtn = document.createElement("button");
    clearBtn.className = "tg-btn ghost";
    clearBtn.textContent = t(lang, "clear");
    clearBtn.addEventListener("click", () => opts.onClear());
    const resetBtn = document.createElement("button");
    resetBtn.className = "tg-btn ghost";
    resetBtn.textContent = t(lang, "reset");
    resetBtn.addEventListener("click", () => opts.onReset());
    const closeBtn = document.createElement("button");
    closeBtn.className = "tg-btn";
    closeBtn.textContent = t(lang, "close");
    closeBtn.addEventListener("click", () => exports.close());
    act.append(clearBtn, resetBtn, closeBtn);
    box.appendChild(act);
  };
  const exports = {
    el: mask,
    open: (state) => {
      openState = state;
      isOpen = true;
      render(state);
      mask.style.display = "flex";
    },
    close: () => {
      isOpen = false;
      mask.style.display = "none";
    },
    sync: (state) => {
      openState = state;
      if (isOpen) render(state);
    }
  };
  mask.addEventListener("click", (e) => {
    if (e.target === mask) exports.close();
  });
  return exports;
}

// src/client.ts
var PLUGIN_ID = "dsh-token-gauge";
function totalOf(b) {
  return (b?.input || 0) + (b?.cacheRead || 0) + (b?.cacheWrite || 0) + (b?.output || 0);
}
function todayKey(d = /* @__PURE__ */ new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function monthKey(d = /* @__PURE__ */ new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function weekKey(d = /* @__PURE__ */ new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(
    ((date.getTime() - firstThursday.getTime()) / 864e5 - 3 + (firstThursday.getUTCDay() + 6) % 7) / 7
  );
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}
function fallbackState() {
  return {
    global: {},
    daily: {},
    weekly: {},
    monthly: {},
    sessions: {},
    models: {},
    activeSession: "",
    settings: {
      style: "ev",
      palette: "neon",
      lang: "zh",
      metric: "global",
      display: { usage: true, cost: true, io: true, cacheMiss: true },
      limits: { global: null, daily: null, weekly: null, monthly: null },
      pricing: {}
    }
  };
}
var name = PLUGIN_ID;
var inject = ["webview", "events"];
function apply(ctx) {
  if (!document.getElementById("tg-gauge-style")) {
    const st = document.createElement("style");
    st.id = "tg-gauge-style";
    st.textContent = buildCss();
    document.head.appendChild(st);
  }
  let state = null;
  const tr = (k) => t(state?.settings?.lang || "zh", k);
  const root = document.createElement("div");
  root.className = "tg-root tg-style-ev";
  const head = document.createElement("div");
  head.className = "tg-head";
  const titleEl = document.createElement("div");
  titleEl.className = "tg-title";
  titleEl.textContent = "Token \u4EEA\u8868\u76D8";
  const gear = document.createElement("div");
  gear.className = "tg-gear";
  gear.textContent = "\u2699";
  gear.title = "\u8BBE\u7F6E";
  head.append(titleEl, gear);
  root.appendChild(head);
  const empty = document.createElement("div");
  empty.className = "tg-empty";
  empty.style.display = "none";
  root.appendChild(empty);
  const gauge = createGauge();
  root.appendChild(gauge.el);
  const modal = createSettingsModal({
    getLang: () => state?.settings?.lang || "zh",
    onSettings: (patch) => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: "setSettings", payload: patch }),
    onExport: (format) => {
      if (state) downloadReport(state, state.settings.lang || "zh", format);
    },
    onClear: () => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: "clearUsage" }),
    onReset: () => ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: "resetSettings" })
  });
  root.appendChild(modal.el);
  gear.addEventListener("click", () => modal.open(state || fallbackState()));
  const computeMetric = (s) => {
    const metric = s.settings.metric;
    let entry = s.global;
    let limit = s.settings.limits.global;
    if (metric === "session") {
      entry = s.sessions[s.activeSession] || {};
      limit = s.settings.limits.daily;
    } else if (metric === "today" || metric === "daily") {
      entry = s.daily[todayKey()] || {};
      limit = s.settings.limits.daily;
    } else if (metric === "weekly") {
      entry = s.weekly[weekKey()] || {};
      limit = s.settings.limits.weekly;
    } else if (metric === "monthly") {
      entry = s.monthly[monthKey()] || {};
      limit = s.settings.limits.monthly;
    }
    return { value: totalOf(entry), limit, cost: entry.cost || 0 };
  };
  const applyState = (s) => {
    state = s;
    root.className = "tg-root " + getStyle(s.settings.style).className;
    applyPalette(root, s.settings.palette);
    titleEl.textContent = tr("title");
    const m = computeMetric(s);
    gauge.update({ value: m.value, limit: m.limit, cost: m.cost, state: s, display: s.settings.display, t: tr, lang: s.settings.lang });
    const hasData = totalOf(s.global) > 0;
    empty.style.display = hasData ? "none" : "";
    empty.textContent = tr("noData");
    modal.sync(s);
  };
  ctx.effect(() => {
    ctx.events.on(`${PLUGIN_ID}:state`, applyState);
    ctx.events.emit(`${PLUGIN_ID}:cmd`, { type: "getState" });
    return () => ctx.events.off(`${PLUGIN_ID}:state`, applyState);
  });
  ctx.webview.registerSidebarTab({
    id: PLUGIN_ID,
    label: "Token \u4EEA\u8868\u76D8",
    render(container) {
      container.appendChild(root);
    }
  });
}
export {
  apply,
  inject,
  name
};
