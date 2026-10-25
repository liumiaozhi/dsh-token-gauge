/**
 * Self-contained usage aggregation for the token gauge.
 *
 * Reads DSH's append-only session logs through the public
 * `sessionPersistence` service and derives the small snapshot the Client
 * dashboard needs. It deliberately knows nothing about any billing plugin.
 */

const PAGE_SIZE = 1000;
const MAX_TURNS = 600;
const VERSION = 1;
const SEARCH_CALL_COST = 0.02;

const DEFAULT_PRICE = { input: 2, cacheHit: 0.04, output: 8 };
const PRICES = {
  flash: { input: 2, cacheHit: 0.04, output: 8 },
  pro: { input: 9, cacheHit: 0.3, output: 27 },
};

function count(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

function emptyBucket() {
  return { calls: 0, input: 0, output: 0, cacheHit: 0, cacheMiss: 0, cost: 0, reasoning: 0, searchCalls: 0 };
}

function addBucket(target, source) {
  target.calls += source.calls || 0;
  target.input += source.input || 0;
  target.output += source.output || 0;
  target.cacheHit += source.cacheHit || 0;
  target.cacheMiss += source.cacheMiss || 0;
  target.cost += source.cost || 0;
  target.reasoning += source.reasoning || 0;
}

function localDayKey(timeMs) {
  const date = new Date(timeMs);
  const part = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}`;
}

function isPeak(timeMs) {
  const date = new Date(timeMs);
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) return false;
  const hour = date.getHours();
  return (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18);
}

function modelKeyOf(model) {
  const value = String(model || '').toLowerCase();
  if (value.includes('flash')) return 'flash';
  if (value.includes('pro')) return 'pro';
  return 'default';
}

function priceOf(model, timeMs) {
  const base = PRICES[modelKeyOf(model)] || DEFAULT_PRICE;
  const factor = isPeak(timeMs) ? 1 : 0.5;
  return {
    input: base.input * factor,
    cacheHit: base.cacheHit * factor,
    output: base.output * factor,
  };
}

function costOf(model, usage, timeMs) {
  // DSH reports the uncached prompt in inputTokens and the cached prefix in
  // cacheReadTokens; the billed prompt is their sum.
  const cacheMiss = count(usage.inputTokens) + count(usage.cacheWriteTokens);
  const cacheHit = count(usage.cacheReadTokens);
  const input = cacheMiss + cacheHit;
  const output = count(usage.outputTokens);
  const price = priceOf(model, timeMs);
  return {
    input,
    cacheHit,
    cacheMiss,
    output,
    reasoning: count(usage.reasoningTokens),
    cost: (cacheMiss * price.input + cacheHit * price.cacheHit + output * price.output) / 1_000_000,
  };
}

function messageTitle(event) {
  const content = event && event.data && event.data.message && event.data.message.content;
  if (!Array.isArray(content)) return undefined;
  const text = content
    .filter((block) => block && block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > 64 ? `${text.slice(0, 61)}...` : text;
}

function modelOf(event) {
  const source = event && event.data && event.data.message && event.data.message.source;
  return source && typeof source.model === 'string' ? source.model : 'unknown';
}

export function createUsageService(persistence) {
  const sessions = new Map();
  const total = emptyBucket();
  const byModel = new Map();
  const byDay = new Map();
  const turns = new Map();
  const sessionRows = new Map();
  let updatedAt = 0;
  let inflight;

  function sessionRow(id, snapshot) {
    let row = sessionRows.get(id);
    if (!row) {
      row = {
        id,
        title: undefined,
        cwd: snapshot && snapshot.header ? snapshot.header.cwd : undefined,
        calls: 0,
        cost: 0,
        lastActive: 0,
      };
      sessionRows.set(id, row);
    }
    if (!row.cwd && snapshot && snapshot.header) row.cwd = snapshot.header.cwd;
    return row;
  }

  function turnRow(id, turn, timeMs, model) {
    const key = `${id}:${turn}`;
    let row = turns.get(key);
    if (!row) {
      row = {
        sessionId: id,
        turn,
        model,
        input: 0,
        output: 0,
        cacheHit: 0,
        cacheMiss: 0,
        cost: 0,
        calls: 0,
        startedAt: timeMs,
        endedAt: undefined,
      };
      turns.set(key, row);
    }
    if (timeMs < row.startedAt) row.startedAt = timeMs;
    if (model && model !== 'unknown') row.model = model;
    return row;
  }

  function processEvent(id, event, snapshot) {
    if (!event || typeof event.type !== 'string') return;
    const timeMs = count(event.time) || Date.now();
    if (event.type === 'web/deepseek-search-llm-request') {
      const row = sessionRow(id, snapshot);
      row.cost += SEARCH_CALL_COST;
      row.lastActive = Math.max(row.lastActive, timeMs);
      total.cost += SEARCH_CALL_COST;
      total.searchCalls += 1;
      const dayKey = localDayKey(timeMs);
      let day = byDay.get(dayKey);
      if (!day) {
        day = emptyBucket();
        byDay.set(dayKey, day);
      }
      day.cost += SEARCH_CALL_COST;
      day.searchCalls += 1;
      return;
    }
    if (event.type === 'user/message') {
      const row = sessionRow(id, snapshot);
      if (!row.title) row.title = messageTitle(event);
      row.lastActive = Math.max(row.lastActive, timeMs);
      return;
    }
    if (event.type === 'turn/start') {
      turnRow(id, event.data.turn, timeMs, undefined);
      return;
    }
    if (event.type === 'turn/end') {
      const row = turnRow(id, event.data.turn, timeMs, undefined);
      row.endedAt = Math.max(row.endedAt || 0, timeMs);
      return;
    }
    if (event.type !== 'assistant/message') return;
    const usage = event.data && event.data.usage;
    if (!usage) return;

    const idRow = sessionRow(id, snapshot);
    const model = modelOf(event);
    const values = costOf(model, usage, timeMs);
    if (values.input === 0 && values.output === 0) return;
    const turn = turnRow(id, event.data.turn, timeMs, model);
    turn.input += values.input;
    turn.output += values.output;
    turn.cacheHit += values.cacheHit;
    turn.cacheMiss += values.cacheMiss;
    turn.cost += values.cost;
    turn.calls += 1;

    const adding = {
      calls: 1,
      input: values.input,
      output: values.output,
      cacheHit: values.cacheHit,
      cacheMiss: values.cacheMiss,
      cost: values.cost,
      reasoning: values.reasoning,
    };
    addBucket(total, adding);

    const dayKey = localDayKey(timeMs);
    let day = byDay.get(dayKey);
    if (!day) {
      day = emptyBucket();
      byDay.set(dayKey, day);
    }
    addBucket(day, adding);

    const modelName = modelKeyOf(model) === 'default' ? model : modelKeyOf(model);
    let modelRow = byModel.get(modelName);
    if (!modelRow) {
      modelRow = emptyBucket();
      byModel.set(modelName, modelRow);
    }
    addBucket(modelRow, adding);

    idRow.calls += 1;
    idRow.cost += values.cost;
    idRow.lastActive = Math.max(idRow.lastActive, timeMs);
  }

  async function readSession(snapshot) {
    const id = snapshot.header.id;
    const expected = typeof snapshot.eventCount === 'number' ? snapshot.eventCount : undefined;
    let cache = sessions.get(id);
    if (!cache) {
      cache = { cursor: 0, eventCount: -1, title: undefined };
      sessions.set(id, cache);
    }
    if (expected !== undefined && cache.eventCount === expected) return;

    let handle;
    try {
      handle = await persistence.open(id, 'read');
      let cursor = cache.cursor;
      for (let page = 0; page < 10_000; page += 1) {
        const result = await handle.read(cursor, PAGE_SIZE);
        const events = result && Array.isArray(result.events) ? result.events : [];
        if (events.length === 0) break;
        for (const event of events) processEvent(id, event, snapshot);
        cursor += events.length;
        cache.cursor = cursor;
        if (events.length < PAGE_SIZE) break;
        if (expected !== undefined && cursor >= expected) break;
      }
      cache.eventCount = expected ?? cursor;
      const row = sessionRow(id, snapshot);
      if (!row.title) row.title = cache.title;
    } catch (error) {
      console.warn('[token-gauge] could not read session', id, error instanceof Error ? error.message : String(error));
    } finally {
      if (handle) {
        try {
          await handle.close();
        } catch {
          // Closing a read handle is best-effort.
        }
      }
    }
  }

  async function refresh() {
    if (inflight) return inflight;
    inflight = (async () => {
      const snapshots = await persistence.list();
      const seen = new Set();
      for (const snapshot of snapshots) {
        if (!snapshot || !snapshot.header || !snapshot.header.id) continue;
        if (snapshot.formatStatus !== undefined && snapshot.formatStatus !== 'current') continue;
        seen.add(snapshot.header.id);
        await readSession(snapshot);
      }
      for (const id of sessions.keys()) {
        if (!seen.has(id)) sessions.delete(id);
      }
      updatedAt = Date.now();
    })().finally(() => {
      inflight = undefined;
    });
    return inflight;
  }

  function snapshot() {
    const byTurn = [...turns.values()]
      .sort((left, right) => right.startedAt - left.startedAt)
      .slice(0, MAX_TURNS)
      .map((row) => ({
        sessionId: row.sessionId,
        turn: row.turn,
        model: row.model,
        input: row.input,
        output: row.output,
        cacheHit: row.cacheHit,
        cacheMiss: row.cacheMiss,
        cost: row.cost,
        calls: row.calls,
        startedAt: row.startedAt,
        ...(row.endedAt === undefined ? {} : { endedAt: row.endedAt }),
      }));
    const bySession = [...sessionRows.values()]
      .filter((row) => row.calls > 0)
      .sort((left, right) => right.cost - left.cost)
      .map((row) => ({
        id: row.id,
        ...(row.title === undefined ? {} : { title: row.title }),
        ...(row.cwd === undefined ? {} : { cwd: row.cwd }),
        calls: row.calls,
        cost: row.cost,
        lastActive: row.lastActive,
      }));
    return {
      version: VERSION,
      updatedAt,
      source: 'session-logs',
      total: { ...total },
      byModel: Object.fromEntries(byModel),
      byDay: Object.fromEntries(byDay),
      byTurn,
      bySession,
      pricing: {
        currency: 'CNY',
        basis: 'DeepSeek Flash/Pro list prices, peak/off-peak; unknown models fall back to Flash rates',
      },
    };
  }

  return { refresh, snapshot };
}
