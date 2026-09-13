// External links never pass arbitrary query strings or malformed encodings to the
// router's legacy query decoder (GHSA-vcc3-ghjq-m6fr). This app has no query-based features.
const ROUTES = new Set(['/', '/plan', '/calculate', '/history', '/extras', '/settings', '/privacy', '/terms', '/report-ad', '/compare', '/result']);
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  try {
    if (typeof path !== 'string' || path.length > 2048) return '/';
    let candidate = path.split(/[?#]/, 1)[0];
    if (candidate.includes('://')) {
      const url = new URL(candidate);
      if (!['powercost:', 'exp:', 'exps:', 'http:', 'https:'].includes(url.protocol)) return '/';
      candidate = url.protocol === 'powercost:' ? '/' + url.hostname + url.pathname : url.pathname;
    }
    candidate = decodeURIComponent(candidate).replace(/^\/--\//, '/').replace(/\/$/, '') || '/';
    return ROUTES.has(candidate) ? candidate : '/';
  } catch { return '/'; }
}
