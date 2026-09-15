# Ads correction audit — 2026-09-15

## Scope

Recover transient advertising initialization errors; prevent pending rewarded ads from appearing after route changes; add local diagnostics; repair web service parity; isolate test advertising from production. Advertising density is unchanged. Native and App Open remain disabled, consistently with the privacy policy.

## Implementation

- SDK readiness is observable: banners recover when a later rewarded request or retry initializes the SDK. Consent withdrawal publishes `false` and invalidates cached interstitials.
- Foreground/online retries are checked every 30 seconds; initialization failures back off from 30 seconds to a maximum of 5 minutes. A consent response with `canRequestAds: false` blocks automatic re-prompting for the session. The user can explicitly revisit privacy options.
- Rewarded cards abort pending requests on route blur/unmount and suppress stale alerts. Once presentation begins, native reward/closure listeners remain attached; route changes do not discard earned benefits or release the fullscreen lock early.
- Diagnostics retain only 40 event names/timestamps and allowlisted error categories in memory; no raw SDK payloads, identifiers, persistence or network transmission. Developers can inspect `getAdDiagnostics()` from `src/services/adDiagnostics.ts` in a controlled debugging session. There is no remote telemetry/dashboard.
- Web exports the lifecycle and preloading APIs used by the context, without native ad requests.
- EAS development/preview set `EXPO_PUBLIC_ADS_TEST_MODE=true`; production explicitly sets `false`. Local development also uses test IDs via `__DEV__`. This is a build-time testing setting, not a reviewer-specific switch.

## Release procedure / remaining external checks

Local verification completed: 34/34 regression tests passed (including iOS/Android SDK mocks, web API parity and context readiness recovery); TypeScript and lint passed; Expo export completed for iOS, Android and web with 18 static routes. No signed native build or physical-device ad delivery was tested. Bundles are ignored generated files under `dist/ads-audit`.

1. Run `npm test`, `npm run check`, and export iOS/Android/web. Tests mock the native SDK; they do not prove real ad delivery.
2. Install development/preview builds on physical iPhone and Android devices. Confirm test creatives, denial/acceptance of consent, reward delivery, route cancellation, offline recovery and background/foreground behavior.
3. Before interacting with production/TestFlight ads, register the physical devices as test devices in AdMob and confirm test mode. Do not click live ads for testing.
4. Verify AdMob app readiness, ad-unit status and published UMP/IDFA messages; verify App Privacy/Data Safety and actual ATT behavior. These account settings are not established by repository tests.
5. Check the final EAS build log for Xcode 26+ and iOS SDK 26+ before submission. No unverified image name is pinned in this change.
6. Support/reporting still uses the existing public GitHub issues URL with disclosure. A private channel requires an actual operator-provided address or endpoint; none was invented.

Official references: https://developers.google.com/admob/ios/test-ads ; https://developer.apple.com/app-store/review/guidelines/ ; https://developer.apple.com/news/upcoming-requirements/?id=04282026a
