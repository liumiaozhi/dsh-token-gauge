# dsh-token-gauge · Token Gauge Dashboard

A DeepSeek Harness (DSH) Web sidebar plugin that shows Token usage and cost on a **motorcycle-style dashboard**.
The needle rotates smoothly as usage grows; usage and cost figures sit below the needle. Click ⚙ to open a settings
popup to switch style, palette, displayed metrics, usage scope, limits (global/daily/weekly/monthly), language, and export reports.

> Default style: **Modern EV Tech** · Default palette: **Neon Blue** · Default metric: **global cumulative**.

## Features

- **Live gauge**: SVG arc gauge; needle rotates with `usage / limit`; turns red when over limit.
- **6 styles**: Modern EV Tech (default), Raw Motorcycle, Luxury Sports, Cute Car, Cyberpunk, Retro Dial.
- **8 palettes**: Amber Gold, Neon Blue, Track Red, Aurora Green, Sakura Pink, Night Purple, Titanium Silver, Volcano Orange (freely combinable with styles).
- **Usage & cost**: total tokens, cost (¥), plus optional cards (input/output, cache hit, sessions, today, quota progress).
- **Limits**: global / daily / weekly / monthly (default global = empty → auto scale).
- **i18n**: one-click zh / en.
- **Export**: one-click CSV / JSON usage reports (global, per-model, per day/week/month/session).
- **Zero runtime deps**: Client is pure DOM/SVG (no React); Host listens to DSH usage events and aggregates on its own.

## Install

```bash
# From marketplace
dsh plugin --profile web add dsh-token-gauge
dsh web

# From source
npm install
node build.mjs
dsh plugin --profile web add .
```

## Data & pricing

- **Source**: Host subscribes to `assistant/message.usage` in the DSH session event stream and aggregates it.
- **Views**: global / daily / weekly / monthly / session / model.
- **Cost**: `(missInput×inMiss + cacheHit×inHit + cacheWrite×write + output×out) / 1,000,000` (¥/M tokens).
  Ships DeepSeek official CNY presets, editable per model in settings (advanced · pricing).

## Settings (⚙ popup)

Language · Style · Palette · Metric (global/session/today/daily/weekly/monthly) · Display toggles ·
Limits (global/daily/weekly/monthly) · Advanced pricing · Export CSV/JSON · Clear / Reset.

## Publish

```bash
npm version patch
npm publish --registry=https://registry.npmjs.org
```

## License

MIT
