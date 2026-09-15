/* Regression tests run against transpiled production modules, with native SDKs mocked. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function loader(mocks = {}, globals = {}) {
  const cache = new Map();
  const load = (file) => {
    file = path.resolve(root, file);
    if (!path.extname(file)) file += fs.existsSync(file + '.ts') ? '.ts' : '.tsx';
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    vm.runInNewContext(source, {
      exports, console, Date, URL, setTimeout, clearTimeout, setInterval, clearInterval,
      require: (name) => Object.hasOwn(mocks, name) ? mocks[name] :
        name.startsWith('.') ? load(path.resolve(path.dirname(file), name)) : require(name),
      ...globals,
    }, { filename: file });
    return exports;
  };
  return load;
}
const flush = async () => { for (let i = 0; i < 40; i++) await Promise.resolve(); };
const valid = () => ({ id: 'one', createdAt: '2026-08-10T12:00:00Z', currency: 'BRL',
  input: { applianceId: 'lamp', applianceName: 'Lamp', powerWatts: 100, hoursPerDay: 2, daysPerMonth: 30, tariffPerKwh: 0.9, quantity: 1 },
  result: { costPerMonth: 999 } });
const validation = loader()('src/utils/persistence');
test('native deep links allow only known routes and discard hostile query payloads', () => {
  const { redirectSystemPath } = loader()('app/+native-intent');
  const go = (path) => redirectSystemPath({ path, initial: true });
  assert.equal(go('powercost://plan?x=' + '%FF'.repeat(100)), '/plan');
  assert.equal(go('powercost://%FF%FE'), '/');
  assert.equal(go('powercost://plan?x=' + '%FF'.repeat(10000)), '/');
  assert.equal(go('exp://127.0.0.1/--/settings'), '/settings');
  assert.equal(go('/unknown'), '/');
});
test('history recomputes all result fields and sanitizes metadata', () => {
  const sample = valid(); sample.currency = 'INVALID'; sample.input.room = 42;
  const [v] = validation.normalizeHistory([sample], 'EUR');
  assert.equal(v.currency, 'EUR'); assert.equal(v.input.room, undefined);
  assert.ok(Math.abs(v.result.costPerYear - 64.8) < 1e-9); assert.equal(v.result.consumptionKwhYear, 72);
});
test('invalid inputs, duplicates and nonfinite data are rejected', () => {
  const v = valid();
  assert.equal(validation.normalizeHistory([v, v, { ...v, id: 'bad', input: { ...v.input, powerWatts: Infinity } }], 'BRL').length, 1);
  assert.equal(validation.normalizePlan({ targetMonthlyCost: Infinity }, 'BRL').targetMonthlyCost, undefined);
  assert.throws(() => validation.parseStored('{bad'));
  assert.equal(validation.parseStored('null'), null);
});
test('migration preserves legacy bill currency and does not invent house appliances', () => {
  const p = validation.normalizePlan({ schemaVersion: 3, currency: 'EUR', measuredMonthlyCost: 300, updatedAt: '2026-08-15T12:00:00Z' }, 'USD');
  assert.equal(p.schemaVersion, 4); assert.equal(p.appliances.length, 0);
  assert.equal(p.periods[0].currency, 'EUR'); assert.equal(p.periods[0].measuredMonthlyCost, 300);
  assert.equal(p.periods[0].estimatedCost, undefined);
});
test('currency-specific targets survive migration and an explicit second-currency goal', () => {
  const first = validation.normalizePlan({ currency: 'BRL', targetMonthlyCost: 300 }, 'USD');
  assert.equal(first.targets.BRL, 300);
  const next = validation.normalizePlan({ ...first, currency: 'USD', targetMonthlyCost: 400, targets: { ...first.targets, USD: 400 } }, 'USD');
  assert.equal(next.targets.BRL, 300); assert.equal(next.targets.USD, 400);
});
test('periods keep currencies, zero bills, snapshots and every saved month', () => {
  const periods = Array.from({ length: 30 }, (_, i) => ({ id: (2020 + Math.floor(i / 12)) + '-' + String(i % 12 + 1).padStart(2, '0'), currency: 'USD',
    measuredMonthlyCost: 0, estimatedCost: 2, actions: ['standby'], createdAt: '2026-08-15T12:00:00Z' }));
  periods.push({ ...periods[0], currency: 'BRL' });
  const result = validation.normalizePlan({ periods }, 'EUR');
  assert.equal(result.periods.length, 31);
  assert.equal(result.periods[0].measuredMonthlyCost, 0); assert.equal(result.periods[0].estimatedCost, 2);
  assert.equal(validation.validMonth('2026-13'), false);
  assert.equal(validation.localMonth({ getFullYear: () => 2026, getMonth: () => 7 }), '2026-08');
});

function adsHarness(platform = 'ios') {
  const timers = new Map(), instances = [], lifecycle = new Set();
  let timerId = 0, online = true;
  let now = Date.now();
  const appState = { currentState: 'active', addEventListener: (_, fn) => { lifecycle.add(fn); return { remove: () => lifecycle.delete(fn) }; } };
  const factory = { createForAdRequest: () => {
    const listeners = new Map();
    const ad = { shown: 0, addAdEventListener: (e, fn) => { listeners.set(e, fn); return () => listeners.delete(e); },
      load: () => {}, show: async () => { ad.shown++; }, emit: (e) => listeners.get(e)?.() };
    instances.push(ad); return ad;
  } };
  const sdk = { default: () => ({ initialize: async () => {}, setRequestConfiguration: async () => {} }),
    AdsConsent: { gatherConsent: async () => ({ canRequestAds: true }), showPrivacyOptionsForm: async () => ({ canRequestAds: false }) },
    InterstitialAd: factory, RewardedAd: factory, AppOpenAd: factory, TestIds: {},
    AdEventType: { LOADED: 'loaded', ERROR: 'error', CLOSED: 'closed' },
    RewardedAdEventType: { LOADED: 'loaded', EARNED_REWARD: 'earned' } };
  const svc = loader({
    'expo-constants': { executionEnvironment: 'standalone', ExecutionEnvironment: { StoreClient: 'expo' } },
    'react-native': { Platform: { OS: platform }, AppState: appState },
    'expo-network': { getNetworkStateAsync: async () => ({ isConnected: online, isInternetReachable: online }) },
    '../config/ads': { getAdUnitId: () => 'test' },
    'react-native-google-mobile-ads': { ...sdk, __esModule: true },
  }, { Date: class extends Date { static now() { return now; } }, setTimeout: (fn, ms) => { const id = ++timerId; timers.set(id, { fn, ms }); return id; }, clearTimeout: (id) => timers.delete(id) })('src/services/adsService');
  return { svc, sdk, advance: (ms) => { now += ms; }, instances, timers, offline: () => { online = false; }, background: () => {
    appState.currentState = 'background'; lifecycle.forEach((fn) => fn('background'));
  } };
}
test('concurrent reward requests create only one native ad', async () => {
  const h = adsHarness(); const a = h.svc.showRewardedAd(), b = h.svc.showRewardedAd();
  await flush(); assert.equal(h.instances.length, 1); assert.equal(await b, 'unavailable');
  h.instances[0].emit('closed'); assert.equal(await a, 'unavailable');
});
test('reward delivered immediately, once, offline and before close; no presentation timeout', async () => {
  const h = adsHarness(); let grants = 0;
  const promise = h.svc.showRewardedAd(() => grants++); await flush();
  h.instances[0].emit('loaded'); h.offline(); h.instances[0].emit('earned'); h.instances[0].emit('earned');
  assert.equal(grants, 1); assert.equal(h.timers.size, 0);
  assert.equal(await h.svc.showInterstitialAd(), false);
  h.instances[0].emit('error'); assert.equal(await promise, 'earned');
});
test('load timeout cannot show a late reward; background cancels pending opportunity', async () => {
  const h = adsHarness(), promise = h.svc.showRewardedAd(); await flush();
  [...h.timers.values()][0].fn(); assert.equal(await promise, 'unavailable');
  h.instances[0].emit('loaded'); assert.equal(h.instances[0].shown, 0);
  const p2 = h.svc.showRewardedAd(); await flush(); h.background();
  h.instances[1].emit('loaded'); assert.equal(await p2, 'unavailable'); assert.equal(h.instances[1].shown, 0);
});
test('interstitial skips missing cache, never shows on late load, holds lock until CLOSED', async () => {
  const h = adsHarness(); await h.svc.initializeAds();
  assert.equal(await h.svc.showInterstitialAd(), false);
  h.instances[0].emit('loaded'); assert.equal(h.instances[0].shown, 0);
  const p = h.svc.showInterstitialAd(); await flush();
  assert.equal(h.instances[0].shown, 1); assert.equal(h.timers.size, 0);
  assert.equal(await h.svc.showInterstitialAd(), false);
  h.instances[0].emit('closed'); assert.equal(await p, true);
});
test('consent withdrawal invalidates cached ads and blocks App Open', async () => {
  const h = adsHarness(); await h.svc.initializeAds(); h.svc.preloadInterstitialAd(); h.instances[0].emit('loaded');
  await h.svc.showAdsPrivacyOptions(); assert.equal(await h.svc.showInterstitialAd(), false);
  assert.equal(await h.svc.showAppOpenAd(), false); assert.equal(h.instances[0].shown, 0);
});
test('privacy form cannot race a rewarded presentation', async () => {
  const h = adsHarness(), reward = h.svc.showRewardedAd(); await flush();
  h.instances[0].emit('loaded');
  assert.equal((await h.svc.showAdsPrivacyOptions()).opened, false);
  h.instances[0].emit('closed'); await reward;
});

function contextHarness(initial = {}, failingKey, initiallyReady = true) {
  const data = new Map(Object.entries(initial)), written = [], state = [], effects = [], refs = [];
  let stateIndex = 0, effectIndex = 0, refIndex = 0, pendingEffects = [], value, rewardCallback, online = true;
  let readinessListener;
  const react = { createContext: () => ({ Provider: 'provider' }), createElement: (_, props) => props,
    useState: (init) => { const id = stateIndex++; if (!(id in state)) state[id] = typeof init === 'function' ? init() : init;
      return [state[id], (next) => { state[id] = typeof next === 'function' ? next(state[id]) : next; }]; },
    useRef: (init) => refs[refIndex++] ?? (refs[refIndex - 1] = { current: init }),
    useMemo: (fn) => fn(), useCallback: (fn) => fn,
    useEffect: (fn, deps) => { const id = effectIndex++, previous = effects[id];
      if (!previous || deps.some((v, i) => !Object.is(v, previous[i]))) { effects[id] = deps; pendingEffects.push(fn); } },
  };
  const app = loader({
    react, 'expo-localization': { getLocales: () => [{ languageCode: 'pt' }] },
    'react-native': { useColorScheme: () => 'light', AppState: { addEventListener: () => ({ remove() {} }) } },
    'expo-network': { useNetworkState: () => ({ isConnected: online, isInternetReachable: online }) },
    '@react-native-async-storage/async-storage': {
      getItem: async (key) => { if (key === failingKey) throw new Error('read failure'); return data.get(key) ?? null; },
      setItem: async (key, v) => { written.push(key); data.set(key, v); },
      multiRemove: async (keys) => keys.forEach((key) => data.delete(key)),
    },
    '../services/adsService': { retryAdsInitialization: async () => initiallyReady, subscribeAdsReady: (listener) => { readinessListener = listener; listener(initiallyReady); return () => {}; }, preloadInterstitialAd() {}, showInterstitialAd: async () => false,
      showRewardedAd: async (callback) => { rewardCallback = callback; return new Promise(() => {}); } },
  }, { setInterval: () => 1, clearInterval: () => {} })('src/context/AppContext');
  const render = () => {
    stateIndex = effectIndex = refIndex = 0; pendingEffects = [];
    value = app.AppProvider({ children: null }).value;
    pendingEffects.forEach((fn) => fn());
    return value;
  };
  return { data, written, render, setAdsReady: (ready) => readinessListener(ready), get value() { return value; },
    settle: async () => { for (let i = 0; i < 5; i++) { render(); await flush(); } render(); },
    earn: () => rewardCallback(), offline: () => { online = false; } };
}
const settingsKey = '@powercost/app_settings', historyKey = '@powercost/history', planKey = '@powercost/energy_plan', adsKey = '@powercost/ads_state';
test('one failed read never overwrites that key and preserves healthy history', async () => {
  const h = contextHarness({ [historyKey]: JSON.stringify([valid()]), [planKey]: 'preserve me' }, planKey);
  await h.settle(); assert.equal(h.value.storageError, true); assert.equal(h.value.history.length, 1);
  assert.equal(h.written.includes(planKey), false); assert.equal(h.data.get(planKey), 'preserve me');
});
test('malformed JSON is protected; failed settings never relabel dependent stored currency', async () => {
  const h = contextHarness({ [settingsKey]: '{bad', [historyKey]: JSON.stringify([valid()]) });
  await h.settle(); assert.equal(h.value.storageError, true);
  assert.equal(h.written.includes(settingsKey), false); assert.equal(h.written.includes(historyKey), false);
});
test('action toggles after currency switch preserve plan and period currencies', async () => {
  const h = contextHarness({ [planKey]: JSON.stringify({ currency: 'BRL', targetMonthlyCost: 300, periods: [{ id: '2026-08', currency: 'BRL', measuredMonthlyCost: 250, createdAt: '2026-08-15T12:00:00Z' }] }) });
  await h.settle(); h.value.setCurrency('USD'); h.render(); h.value.updatePlan({ actions: ['standby'] }); h.render();
  assert.equal(h.value.plan.currency, 'BRL'); assert.equal(h.value.plan.targetMonthlyCost, 300);
  assert.equal(h.value.plan.periods[0].currency, 'BRL'); assert.equal(h.value.settings.defaultTariffPerKwh, undefined);
});
test('recalculate preserves currency and increments form revision', async () => {
  const h = contextHarness(); await h.settle(); h.value.setCurrency('USD'); h.render();
  const revision = h.value.draftRevision; h.value.recalculate(valid()); h.render();
  assert.equal(h.value.draft.currency, 'BRL'); assert.equal(h.value.draft.tariffPerKwh, 0.9);
  assert.equal(h.value.draftRevision, revision + 1);
  assert.equal(h.value.completeCalculation(h.value.draft).currency, 'BRL');
});
test('house inventory is independent and editing updates without duplicating or changing result ID', async () => {
  const h = contextHarness({ [historyKey]: JSON.stringify(Array.from({ length: 5 }, (_, i) => ({ ...valid(), id: String(i) }))) });
  await h.settle(); h.value.completeCalculation(valid().input); h.render();
  assert.equal(h.value.saveCurrent(), 'limit');
  const resultId = h.value.currentSimulation.id; h.value.saveHousehold(); h.render(); h.value.saveHousehold(); h.render();
  assert.equal(h.value.plan.appliances.length, 1); assert.equal(h.value.currentSimulation.id, resultId);
  h.value.clearHistory(); h.render(); assert.equal(h.value.plan.appliances.length, 1);
  h.value.recalculate(h.value.plan.appliances[0]); h.render();
  h.value.completeCalculation({ ...h.value.draft, quantity: 2 }); h.render();
  const newResultId = h.value.currentSimulation.id; h.value.saveHousehold(); h.render();
  assert.equal(h.value.plan.appliances.length, 1); assert.equal(h.value.plan.appliances[0].input.quantity, 2);
  assert.equal(h.value.currentSimulation.id, newResultId);
});
test('earned benefit is written before native close and remains active offline', async () => {
  const h = contextHarness(); await h.settle(); void h.value.unlockFeature('what_if');
  h.earn(); await flush();
  assert.ok(JSON.parse(h.data.get(adsKey)).whatIfUnlockedUntil);
  h.offline(); h.render(); assert.equal(h.value.whatIfActive, true);
});
for (const platform of ['ios', 'android']) {
  test(platform + ': App Open uses only a fresh cached ad and holds the fullscreen lock', async () => {
    const h = adsHarness(platform); await h.svc.initializeAds();
    h.svc.preloadAppOpenAd(); h.instances[0].emit('loaded');
    const backgroundAt = h.svc.beginAppOpenBackground(); h.advance(61_000);
    const opening = h.svc.showAppOpenAd(backgroundAt); await flush();
    assert.equal(h.instances[0].shown, 1);
    assert.equal(h.svc.beginAppOpenBackground(), null);
    assert.equal(await h.svc.showRewardedAd(), 'unavailable');
    h.instances[0].emit('closed'); assert.equal(await opening, true);
    h.instances[1].emit('loaded');
    assert.equal(await h.svc.showAppOpenAd(backgroundAt), false);
  });
  test(platform + ': App Open skips missing, expired and short-background opportunities', async () => {
    const h = adsHarness(platform); await h.svc.initializeAds();
    const backgroundAt = h.svc.beginAppOpenBackground();
    assert.equal(await h.svc.showAppOpenAd(backgroundAt), false);
    h.advance(61_000); assert.equal(await h.svc.showAppOpenAd(backgroundAt), false);
    h.instances[0].emit('loaded'); assert.equal(h.instances[0].shown, 0);
    h.advance(4 * 60 * 60_000); assert.equal(await h.svc.showAppOpenAd(backgroundAt), false);
    assert.equal(h.instances[0].shown, 0);
  });
  test(platform + ': consent withdrawal cancels in-flight App Open loading', async () => {
    const h = adsHarness(platform); await h.svc.initializeAds();
    h.svc.preloadAppOpenAd(); const backgroundAt = h.svc.beginAppOpenBackground();
    await h.svc.showAdsPrivacyOptions(); h.instances[0].emit('loaded'); h.advance(61_000);
    assert.equal(await h.svc.showAppOpenAd(backgroundAt), false);
    assert.equal(h.instances[0].shown, 0);
  });
  test(platform + ': initialization retries transient failures and publishes readiness', async () => {
    const h = adsHarness(platform), ready = [];
    let calls = 0;
    h.sdk.AdsConsent.gatherConsent = async () => { if (++calls === 1) throw Error('temporary'); return { canRequestAds: true }; };
    const unsubscribe = h.svc.subscribeAdsReady((value) => ready.push(value));
    assert.equal(await h.svc.retryAdsInitialization(), false);
    assert.equal(await h.svc.retryAdsInitialization(), false);
    assert.equal(calls, 1);
    h.advance(31_000);
    assert.equal(await h.svc.retryAdsInitialization(), true);
    assert.deepEqual(ready, [false, true]);
    await h.svc.showAdsPrivacyOptions();
    assert.equal(ready.at(-1), false);
    unsubscribe();
  });
  test(platform + ': consent refusal is not reprompted by automatic retries', async () => {
    const h = adsHarness(platform); let calls = 0;
    h.sdk.AdsConsent.gatherConsent = async () => { calls++; return { canRequestAds: false }; };
    await h.svc.retryAdsInitialization(); h.advance(600_000); await h.svc.retryAdsInitialization();
    assert.equal(calls, 1);
    h.sdk.AdsConsent.showPrivacyOptionsForm = async () => ({ canRequestAds: true });
    assert.equal((await h.svc.showAdsPrivacyOptions()).adsReady, true);
  });
  test(platform + ': leaving a route cancels pending reward and prevents late display', async () => {
    const h = adsHarness(platform), controller = new AbortController();
    const reward = h.svc.showRewardedAd(() => assert.fail('unearned'), controller.signal);
    await flush(); controller.abort();
    assert.equal(await reward, 'unavailable');
    h.instances[0].emit('loaded'); assert.equal(h.instances[0].shown, 0);
  });
  test(platform + ': route cancellation during presentation does not discard reward or release lock', async () => {
    const h = adsHarness(platform), controller = new AbortController(); let grants = 0;
    const reward = h.svc.showRewardedAd(() => grants++, controller.signal);
    await flush(); h.instances[0].emit('loaded'); controller.abort(); h.instances[0].emit('earned');
    assert.equal(grants, 1); assert.equal(await h.svc.showRewardedAd(), 'unavailable');
    h.instances[0].emit('closed'); assert.equal(await reward, 'earned');
  });
  test(platform + ': cancellation before SDK initialization cannot show an ad', async () => {
    const h = adsHarness(platform), controller = new AbortController();
    const reward = h.svc.showRewardedAd(() => {}, controller.signal); controller.abort();
    assert.equal(await reward, 'unavailable'); assert.equal(h.instances.length, 0);
  });
  test(platform + ': preview uses test IDs while production retains registered IDs', () => {
    for (const mode of ['true', 'false']) {
      const config = loader({ 'react-native': { Platform: { OS: platform } } }, { __DEV__: false, process: { env: { EXPO_PUBLIC_ADS_TEST_MODE: mode } } })('src/config/ads');
      for (const kind of ['banner', 'interstitial', 'rewarded', 'native', 'appOpen']) {
        assert.equal(config.getAdUnitId(kind, 'test-id'), mode === 'true' ? 'test-id' : config.PRODUCTION_AD_UNITS[kind]);
      }
    }
  });
}
test('web service exposes the context lifecycle without native requests', async () => {
  const svc = loader()('src/services/adsService.web.ts');
  svc.preloadInterstitialAd(); svc.cancelPreloadedAds();
  let ready = false; const off = svc.subscribeAdsReady((v) => { ready = v; });
  assert.equal(ready, true); off();
  assert.equal(await svc.showRewardedAd(), 'unavailable');
  assert.equal(await svc.showInterstitialAd(), false);
});
test('native ads loaded after leaving Home are destroyed without updating the screen', async () => {
  let effect, resolveAd, destroyed = 0, visible = null;
  const component = loader({
    react: { useState: () => [null, (v) => { visible = v; }], useEffect: (fn) => { effect = fn; } },
    'react-native': { StyleSheet: { create: (v) => v } },
    '@react-navigation/native': { useIsFocused: () => true }, 'expo-router': { router: {} },
    '../context/AppContext': { useApp: () => ({ canShowBanner: true }) },
    '../config/ads': { getAdUnitId: () => 'test' }, '../services/adsService': { nativeAdsAvailable: true },
    './AdErrorBoundary': {}, './ui': {},
    'react-native-google-mobile-ads': { TestIds: { NATIVE: 'test' }, NativeAd: { createForAdRequest: () => new Promise((resolve) => { resolveAd = resolve; }) } },
  })('src/components/NativeAdSlot');
  component.NativeAdSlot(); const cleanup = effect(); cleanup();
  resolveAd({ destroy: () => { destroyed++; } }); await flush();
  assert.equal(destroyed, 1); assert.equal(visible, null);
});
test('ad diagnostics are bounded and callers cannot modify internal entries', () => {
  const diagnostics = loader()('src/services/adDiagnostics');
  for (let i = 0; i < 100; i++) diagnostics.recordAdEvent('banner-error');
  const entries = diagnostics.getAdDiagnostics(); assert.equal(entries.length, 40);
  entries[0].event = 'modified';
  assert.equal(diagnostics.getAdDiagnostics()[0].event, 'banner-error');
  assert.deepEqual(Object.keys(entries[1]).sort(), ['at', 'event']);
  diagnostics.recordAdEvent('banner-error', { code: 'googleMobileAds/no-fill', message: 'private message', identifier: 'private' });
  assert.equal(diagnostics.getAdDiagnostics().at(-1).code, 'no-fill');
  assert.equal(JSON.stringify(diagnostics.getAdDiagnostics()).includes('private'), false);
});
test('context restores banners after SDK recovery and removes them on consent withdrawal', async () => {
  const h = contextHarness({}, undefined, false); await h.settle();
  assert.equal(h.value.canShowBanner, false);
  h.setAdsReady(true); h.render(); assert.equal(h.value.canShowBanner, true);
  h.setAdsReady(false); h.render(); assert.equal(h.value.canShowBanner, false);
});

test('new translations exist in every locale and interpolation resolves', () => {
  const { dictionaries, translate } = loader()('src/i18n/translations');
  const keys = Object.keys(loader()('src/i18n/corrections').corrections['en-US']);
  for (const locale of Object.keys(dictionaries)) for (const key of keys) assert.equal(typeof dictionaries[locale][key], 'string');
  assert.ok(!translate('fr-FR', 'house.summary', { count: 2, periods: 3 }).includes('{'));
});
