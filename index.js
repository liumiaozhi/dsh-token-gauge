import { createUsageService } from './usage-server.js';

export const inject = ['webServer', 'sessionPersistence'];

const ROUTE = '/api/token-gauge/usage-stats';

function isLoopback(req) {
  const address = req.socket && req.socket.remoteAddress;
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

export function apply(ctx) {
  const usage = createUsageService(ctx.sessionPersistence);
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: ROUTE,
      handler: async (req, res) => {
        if (req.method !== 'GET') {
          send(res, 405, { error: 'method not allowed' });
          return;
        }
        if (!isLoopback(req)) {
          send(res, 403, { error: 'loopback only' });
          return;
        }
        try {
          await usage.refresh();
          send(res, 200, usage.snapshot());
        } catch (error) {
          console.warn('[token-gauge] usage refresh failed:', error instanceof Error ? error.message : String(error));
          send(res, 500, { error: 'usage aggregation failed' });
        }
      },
    });
    const timer = setTimeout(() => {
      usage.refresh().catch((error) => {
        console.warn('[token-gauge] warm-up failed:', error instanceof Error ? error.message : String(error));
      });
    }, 700);
    return () => {
      clearTimeout(timer);
      disposeRoute();
    };
  }, 'token-gauge: usage route');
}
