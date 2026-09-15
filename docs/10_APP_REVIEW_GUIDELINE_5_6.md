# App Review — current notes for Guidelines 5.6 and 4.3

Updated September 13, 2026. Use only with a new build containing these changes.

## Suggested review notes

PowerCost has no login, reviewer-specific behavior, secret gestures, remote feature flags or server-controlled functionality. The same features are visible to every user.

The free household workflow is independent of simulation-history limits:
1. Home > Calculate Now > choose an appliance and enter usage, quantity, room and rate > Calculate > Save/update household appliance.
2. Home > House energy plan > open/edit an appliance, recalculate, then save/update it. This updates the existing household appliance instead of adding another one.
3. In House energy plan, select actions, enter a bill month (YYYY-MM), currency, target, kWh and/or cost, then Save plan. Zero bill values are supported.
4. Open another saved period to inspect its bill, estimate snapshot, recorded actions and differences from the previous period in the same currency. Monthly figures are estimates, not measurements or proof of savings caused by an action.
5. Settings > Currency changes the default for new work, never converts existing amounts. Each bill and calculation retains its currency. Calculation history and household inventory are separate.

All five optional rewards remain visible in Extras: remove ads for 30 minutes; compare up to 10 simulations for 24 hours; add 5 simulation-history slots for 24 hours; unlock an illustrative savings simulation for the current result; and unlock What-if scenarios for 30 minutes. Internet and ad inventory are needed to watch a new ad. A confirmed reward is recorded on EARNED_REWARD and remains usable offline until expiry.

This version displays banners after consent, optional rewarded ads and preloaded interstitials at the Calculate another transition, subject to frequency limits. An unavailable interstitial is skipped; it does not appear later. A labeled native ad is displayed on Home. A preloaded App Open ad may appear when returning to Home after at least 1 minute in the background, with a minimum 10-minute interval. No cold-start delay or late display is introduced; the ad-free benefit suppresses both formats. Report inappropriate ads through Settings > Report inappropriate ad, or the link below a banner. This opens a public GitHub report form with a privacy warning and requires user submission.

Household data, history, settings and rewards are on-device. Settings > Delete all local data clears them. Privacy choices can be reopened in Settings when supported by UMP. Please identify any specific similarities that remain concerning under 4.3 so we can address the comparison precisely.

## Publisher checks before submitting

- Confirm the rejected build number and ask Apple for examples of similarities. Do not claim that source changes alone prove uniqueness.
- Confirm ownership/provenance of code, assets and text, and disclose any related apps when answering Apple.
- Replace screenshots with captures of this actual build; do not claim functions beyond those listed above.
- Verify the AdMob UMP/ATT message configuration and App Store privacy declarations on the publisher accounts.
- Test each enabled ad format on a real iPhone with test ads, consent granted/denied, offline transitions and process restart.
- Confirm that the public GitHub support channel accepts reports and that the ad creative offers required targeting information/AdChoices. The app-level reporting link does not replace those SDK controls.
- Confirm the actual EAS image uses Xcode 26 / iOS 26 SDK or later in build logs before submitting. Source configuration alone is not proof of the final binary.

References: [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/), [Google App Open guidance](https://developers.google.com/admob/ios/app-open).
