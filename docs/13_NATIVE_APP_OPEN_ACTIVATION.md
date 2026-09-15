# Native and App Open activation — 2026-09-15

This update supersedes the disabled-format description in audit 12. Both platforms use their existing registered IDs; development/preview builds retain test IDs.

- Home replaces its banner with a labeled native ad, SDK-registered assets, media, and a separate report action. The upper-right area reserves space for SDK AdChoices. Native resources are destroyed on loss of focus, consent/ad-free changes or unmount, including late loads.
- App Open is preloaded after consent while Home is focused. It may show immediately upon a genuine return to Home after at least 60 seconds in the background. Minimum interval: 10 minutes. Cache lifetime: under 4 hours. No cold-start wait or load-triggered display; a missing/expired ad skips that opportunity.
- System inactive-only events do not trigger presentation. Leaving Home removes its listener. Background transitions during a fullscreen ad or consent initialization do not create an opportunity. All fullscreen formats share the same lock. Offline/ad-free/consent state gates the Home integration.
- Privacy policy in all four languages and App Review notes reflect the enabled formats. No reviewer-specific behavior or remote feature flags were added.

Automated checks cover cache validity, skipped opportunities, consent withdrawal, fullscreen lock, cooldown and native late-load destruction. Native SDKs are mocked. Physical iPhone/Android testing is still required to confirm creative rendering, AdChoices/close controls, real fill and lifecycle behavior. App Store acceptance is not guaranteed.

Reference: https://developers.google.com/admob/ios/app-open
