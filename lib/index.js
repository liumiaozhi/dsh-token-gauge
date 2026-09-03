// src/host.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
var PLUGIN_ID = "dsh-token-gauge";
var DATA_DIR = join(homedir(), ".dsh-token-gauge");
var STATE_FILE = join(DATA_DIR, "state.json");
var DEFAULT_PRICING = {
  "deepseek-chat": { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  "deepseek-v3": { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  "deepseek-reasoner": { inputHit: 1, inputMiss: 4, output: 16, cacheWrite: 4 },
  "deepseek-r1": { inputHit: 1, inputMiss: 4, output: 16, cacheWrite: 4 },
  "deepseek-v4-flash": { inputHit: 0.5, inputMiss: 2, output: 2, cacheWrite: 2 },
  "deepseek-v4-pro": { inputHit: 1, inputMiss: 4, output: 8, cacheWrite: 4 },
  "deepseek-coder": { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 },
  __default__: { inputHit: 0.5, inputMiss: 2, output: 8, cacheWrite: 2 }
};
function emptyEntry() {
  return { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, cost: 0, calls: 0 };
}
function addEntry(t, s) {
  t.input += s.input;
  t.cacheRead += s.cacheRead;
  t.cacheWrite += s.cacheWrite;
  t.output += s.output;
  t.cost += s.cost;
  t.calls += s.calls;
}
function mergedPricing(settings) {
  return { ...DEFAULT_PRICING, ...settings.pricing || {} };
}
function costFor(modelKey, b, pricing) {
  const p = pricing[modelKey] || pricing["__default__"] || DEFAULT_PRICING["__default__"];
  return (b.input * p.inputMiss + b.cacheRead * p.inputHit + b.cacheWrite * p.cacheWrite + b.output * p.output) / 1e6;
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
function defaultSettings() {
  return {
    style: "ev",
    // 默认风格：现代电车科技
    palette: "neon",
    // 默认配色：霓虹蓝
    lang: "zh",
    metric: "global",
    display: {
      usage: true,
      cost: true,
      io: true,
      cacheMiss: true
    },
    limits: { global: null, daily: null, weekly: null, monthly: null },
    pricing: {}
  };
}
function defaultState() {
  return {
    global: emptyEntry(),
    daily: {},
    weekly: {},
    monthly: {},
    sessions: {},
    models: {},
    activeSession: "",
    settings: defaultSettings()
  };
}
function loadState() {
  try {
    if (existsSync(STATE_FILE)) {
      const raw = JSON.parse(readFileSync(STATE_FILE, "utf8"));
      const base = defaultState();
      const merged = {
        ...base,
        ...raw,
        settings: { ...base.settings, ...raw.settings || {} }
      };
      merged.settings.display = { ...base.settings.display, ...raw.settings?.display || {} };
      merged.settings.limits = { ...base.settings.limits, ...raw.settings?.limits || {} };
      merged.settings.pricing = raw.settings?.pricing || {};
      merged.daily = raw.daily || {};
      merged.weekly = raw.weekly || {};
      merged.monthly = raw.monthly || {};
      merged.sessions = raw.sessions || {};
      merged.models = raw.models || {};
      merged.global = { ...emptyEntry(), ...raw.global || {} };
      return merged;
    }
  } catch (e) {
    console.warn(`[${PLUGIN_ID}] load state failed, use default:`, e);
  }
  return defaultState();
}
function saveState(state) {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch (e) {
    console.warn(`[${PLUGIN_ID}] save state failed:`, e);
  }
}
function extractUsage(data) {
  if (!data) return null;
  const u = data.usage ?? data;
  const input = u.input_tokens ?? u.prompt_tokens ?? u.uncachedInput ?? u.input ?? u.total_input_tokens ?? 0;
  const cacheRead = u.cache_read_tokens ?? u.cacheRead ?? u.prompt_cache_hit_tokens ?? u.cache_read ?? 0;
  const cacheWrite = u.cache_write_tokens ?? u.cacheWrite ?? u.cache_write ?? 0;
  const output = u.output_tokens ?? u.completion_tokens ?? u.output ?? u.total_output_tokens ?? 0;
  if (!input && !cacheRead && !cacheWrite && !output) return null;
  const model = data.model ?? u.model ?? "unknown";
  const session = data.session ?? u.session ?? data.sessionId ?? u.sessionId ?? "";
  const id = data.id ?? u.id ?? data.seq ?? u.seq;
  return {
    buckets: { input: Number(input) || 0, cacheRead: Number(cacheRead) || 0, cacheWrite: Number(cacheWrite) || 0, output: Number(output) || 0 },
    model,
    session,
    id
  };
}
var name = PLUGIN_ID;
var inject = ["events"];
function apply(ctx) {
  const state = loadState();
  let saveTimer = null;
  const scheduleSave = () => {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      saveState(state);
    }, 400);
  };
  const pushState = () => {
    ctx.events.emit(`${PLUGIN_ID}:state`, state);
  };
  const countedIds = /* @__PURE__ */ new Set();
  const accumulate = (data) => {
    const ex = extractUsage(data);
    if (!ex) return;
    if (ex.id) {
      if (countedIds.has(ex.id)) return;
      countedIds.add(ex.id);
    }
    const modelKey = ex.model || "unknown";
    if (ex.session) state.activeSession = ex.session;
    const pricing = mergedPricing(state.settings);
    const cost = costFor(modelKey, ex.buckets, pricing);
    const e = { ...ex.buckets, cost, calls: 1 };
    addEntry(state.global, e);
    const dk = todayKey();
    state.daily[dk] = state.daily[dk] || emptyEntry();
    addEntry(state.daily[dk], e);
    const wk = weekKey();
    state.weekly[wk] = state.weekly[wk] || emptyEntry();
    addEntry(state.weekly[wk], e);
    const mk = monthKey();
    state.monthly[mk] = state.monthly[mk] || emptyEntry();
    addEntry(state.monthly[mk], e);
    if (ex.session) {
      state.sessions[ex.session] = state.sessions[ex.session] || emptyEntry();
      addEntry(state.sessions[ex.session], e);
    }
    state.models[modelKey] = state.models[modelKey] || emptyEntry();
    addEntry(state.models[modelKey], e);
    scheduleSave();
    pushState();
  };
  ctx.effect(() => {
    const onUsage = (data) => accumulate(data);
    ctx.events.on("assistant/message.usage", onUsage);
    ctx.events.on("usage", onUsage);
    ctx.events.on("assistant/message", (data) => {
      if (data && (data.usage || data.data && data.data.usage)) onUsage(data);
    });
    return () => {
      ctx.events.off("assistant/message.usage", onUsage);
      ctx.events.off("usage", onUsage);
    };
  });
  ctx.effect(() => {
    const onCmd = (msg) => {
      if (!msg || typeof msg.type !== "string") return;
      switch (msg.type) {
        case "getState":
          pushState();
          break;
        case "setSettings":
          state.settings = { ...state.settings, ...msg.payload || {} };
          scheduleSave();
          pushState();
          break;
        case "resetSettings":
          state.settings = defaultSettings();
          scheduleSave();
          pushState();
          break;
        case "clearUsage":
          state.global = emptyEntry();
          state.daily = {};
          state.weekly = {};
          state.monthly = {};
          state.sessions = {};
          state.models = {};
          countedIds.clear();
          scheduleSave();
          pushState();
          break;
        default:
          break;
      }
    };
    ctx.events.on(`${PLUGIN_ID}:cmd`, onCmd);
    return () => ctx.events.off(`${PLUGIN_ID}:cmd`, onCmd);
  });
  pushState();
}
export {
  apply,
  inject,
  name
};
