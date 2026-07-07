# HF UI Lab — live preview

Static build of the Hugging Face onboarding UX experiment, running real
moon-landing components with a client-side mocked API (state persists in
localStorage).

**Live:** https://chuntelee.github.io/hf-ui-lab-preview/

## What to try

- **UI LAB panel** (bottom-left) — simulate onboarding tasks; the real
  6-step popover, gradient progress button, and toasts react.
- **Sonner-style toast stack** (lower-right) — completions stack as a deck;
  hover to fan them out; the final step fires a celebration toast + confetti.
- **Page switcher** in the panel — `#/activity` (composed) and
  `#/model-kimi` (a real model page, hydrated). On the model page the
  **like** and **follow** buttons work and feed onboarding progress.

Mocked, client-side, no backend. Use "reset" in the panel to start over.
