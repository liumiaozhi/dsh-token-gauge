# dsh-token-gauge · Token Gauge Dashboard

<p align="center">
  <img src="screenshots/single-classical.png" alt="Single gauge · Vintage skin" width="48%">
  <img src="screenshots/dual-starfield.png" alt="Dual gauge · Starfield skin" width="48%">
</p>

<p align="center">
  <img src="screenshots/styles.png" alt="Vintage / Macaron / Minimal / Starfield skins" width="78%">
</p>

<p align="center">
  <a href="https://github.com/liumiaozhi/dsh-token-gauge/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/liumiaozhi/dsh-token-gauge?style=flat-square"></a>
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/github/license/liumiaozhi/dsh-token-gauge?style=flat-square"></a>
  <img alt="DeepSeek Harness" src="https://img.shields.io/badge/DeepSeek%20Harness-Web%20Plugin-4f46e5?style=flat-square">
</p>

A sidebar Token gauge for **DeepSeek Harness (DSH)**. Four skins — Vintage, Macaron, Minimal and Starfield — turn token speed, session/today usage and spend, and cache hit rate into a quick car-dashboard read.

> Preview images use sample data. Real values come from local DSH sessions through the billing plugin; nothing is fabricated.

## Features

- **Two structures**
  - **Single**: token-speed gauge on the left, current-session / today tokens and spend on the right, cache-hit progress bar at the bottom.
  - **Dual**: token-speed gauge and cache-hit gauge side by side on top; current-session and today tokens / spend below.
- **Four skins**: Vintage (warm amber), Macaron, Minimal, Starfield. Structure and skin combine freely — eight presentations.
- **Live speed**: reads streaming output deltas from the current session and moves the needle smoothly across 0–500 tokens/s.
- **Cache gauge**: 70–100% range with 70 / 75 / 100 ticks; below 70% the needle parks at 70% while the readout keeps the real value.
- **Token formatting**: always in **k (thousand tokens)**, two decimals and thousands separators, e.g. `15,098.77k`.
- **Settings**: the slider icon at the card's top-right opens structure/skin choices; selections persist in `localStorage`.
- **Theme-aware** and dependency-free on the client: no chart library, no external CDN.

## Install

The dashboard reuses the Host aggregation endpoint `/api/billing/usage-stats` from [@kenz1117/dsh-ui-usage-billing](https://github.com/kenz1117/dsh-ui-usage-billing). Install it first, otherwise the gauge shows `--` / zero.

```bash
dsh plugin --profile web add @kenz1117/dsh-ui-usage-billing
dsh plugin --profile web add dsh-token-gauge
```

From source:

```bash
git clone https://github.com/liumiaozhi/dsh-token-gauge.git
dsh plugin --profile web add "link:<absolute-path-to-repo>"
```

Restart or hard-refresh DSH Web. The card replaces the original billing trigger at the same sidebar-footer slot, while the billing plugin keeps serving its Host API and composer cost chip.

## Usage

1. Click the slider icon at the **top-right** of the card.
2. Choose **Single / Dual** under Layout.
3. Pick one of **Vintage / Macaron / Minimal / Starfield**.
4. Start a conversation; speed follows streaming output and usage refreshes every 1.5s.

<p align="center">
  <img src="screenshots/settings.png" alt="Settings: layout and four skins" width="62%">
</p>

## Data

| Metric | Source |
| --- | --- |
| Token speed | Streaming text / reasoning / tool-call deltas of the current session, estimated over a 0–500 tokens/s scale |
| Current-session tokens | `input + output` over all turns of the current session |
| Today tokens | Today's `input + output` in the billing plugin's `byDay` snapshot |
| Current-session spend | `bySession.cost + subCost` (sub-agents included) |
| Today spend | Billing plugin estimate at current model prices |
| Cache hit rate | Today's `cacheHit / (cacheHit + cacheMiss)`, gauge range 70–100% |

Amounts are billing-plugin estimates, not an official invoice.

## Development

```bash
git clone https://github.com/liumiaozhi/dsh-token-gauge.git
cd dsh-token-gauge
dsh plugin --profile web add "link:$PWD"
```

`client.js` is a hand-written Client bundle; no build step. DSH Client HMR reloads it after edits; refresh the page if HMR is unavailable.

## Compatibility

- DSH Web (`platform: web`), requiring `@deepseek-ai/dsh-client-ui-sidebar` and `@deepseek-ai/dsh-client-ui-session`.
- Requires `@kenz1117/dsh-ui-usage-billing >= 1.7.0` for data.
- Preview images are generated from the actual component styles with sample data.

## License

[MIT](LICENSE) © 2026 liumiaozhi
