# App Review — Guideline 5.6 response

Updated August 24, 2026.

## Changes in the new build

- Every rewarded feature is permanently visible in the main **Extras** tab.
- The previous indirect `/unlock` route was removed.
- The non-functional “PowerCost Plus — Coming soon” placeholder was removed.
- Banner and native ad eligibility no longer depends on completing a first calculation.
- Reviewer notes now list every ad format, rewarded feature, duration, prerequisite, and test path.
- There is no reviewer-specific code, secret gesture, hidden account, remote feature flag, or remotely downloaded functionality.

## Response to App Review

> Hello App Review Team,
>
> Thank you for bringing this concern to our attention. We take Guideline 5.6 seriously.
>
> PowerCost does not contain reviewer-specific behavior, secret gestures, hidden accounts, remote feature flags, or server-controlled functionality intended to change the experience during review.
>
> During our audit, we identified a discoverability issue: the complete rewarded-extras screen was included in the binary but was not permanently available in the main tab bar. Some entry points became visible only after completing calculations or reaching a local history limit. Advertising placements also became eligible only after the first calculation. Although this was intended as progressive disclosure, we understand how it could appear that functionality was hidden.
>
> In this build, every rewarded feature is permanently visible under the Extras tab. We removed the indirect unlock route and all “coming soon” content. Advertising eligibility no longer depends on completing a first calculation, and the Notes for Review now document every ad format and rewarded feature.
>
> The five optional rewarded features are:
> 1. Remove ads for 30 minutes.
> 2. Compare up to 10 appliances for 24 hours.
> 3. Add 5 history slots for 24 hours.
> 4. Unlock a personalized energy-saving plan for the current estimate.
> 5. Unlock “What if?” scenarios for 30 minutes.
>
> Core calculations are always available without watching a rewarded ad. A temporary benefit is granted only after Google Mobile Ads reports the EARNED_REWARD event. Internet access and ad inventory are required.
>
> Review path: open the Extras tab to see all rewarded features. For result-based features, go to Home > Calculate Now, select an appliance, enter usage and electricity rate, and tap Calculate.
>
> We respectfully ask you to review this new build and let us know if any additional specific behavior requires clarification.
>
> Thank you.
