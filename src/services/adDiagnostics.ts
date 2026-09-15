type AdEvent = 'init-ready' | 'init-error' | 'consent-blocked' | 'banner-loaded' | 'banner-error' | 'interstitial-loaded' | 'interstitial-error' | 'reward-error' | 'reward-earned' | 'reward-cancelled';
type Diagnostic = { event: AdEvent; at: number; code?: string };
const recent: Diagnostic[] = [];

// Local, bounded, memory-only diagnostics. Never store SDK payloads or identifiers.
export const recordAdEvent = (event: AdEvent, error?: unknown) => {
  const entry: Diagnostic = { event, at: Date.now() };
  // Retain only known SDK categories, never raw messages/response information.
  try {
    const raw = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    const code = typeof raw === 'string' ? raw.split('/').pop() : undefined;
    if (code && ['no-fill', 'network-error', 'invalid-request', 'internal-error', 'timeout', 'not-ready'].includes(code)) entry.code = code;
  } catch { /* Error objects are untrusted; diagnostics must not interrupt the app. */ }
  recent.push(entry);
  if (recent.length > 40) recent.shift();
};
export const getAdDiagnostics = (): readonly Diagnostic[] => recent.map((entry) => ({ ...entry }));
