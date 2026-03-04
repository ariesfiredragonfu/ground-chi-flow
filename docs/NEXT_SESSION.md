# GroundChiFlow — Pick up here (Coach session)

**Last updated:** 2026-03-03 (end of day)

---

## Done today

- **Coach tab is live:** Re-added to `app/(tabs)/_layout.tsx` and pushed to GitLab `master`. Step 1 + Step 2 prompts in `constants/AgentPrompt.ts` (one next step, daily briefing, longevity framing, weekly reflection, gentle habit nudges). Bridge client: `lib/grokBridge.ts`; UI: `app/(tabs)/agent.tsx`.
- **Staging branch:** `staging` on GitLab is a copy of the pre–go-live state (Coach in repo, tab off). Use it to compare or roll back if needed.
- **Bridge test script:** `scripts/test-coach-bridge.mjs` — run with bridge reachable: `node scripts/test-coach-bridge.mjs` (optional: `EXPO_PUBLIC_GROK_BRIDGE_URL` or `GROK_BRIDGE_URL`).

---

## For morning / later

- **Step 3 (app work):** HRV/routine completion in context, daily check-in, lab interpretation. Implement on a branch, test locally, then merge and go live.
- **Deploy:** Trigger howell-forge-website (or your pipeline) rebuild so the app build includes the Coach tab. Ensure `EXPO_PUBLIC_GROK_BRIDGE_URL` is set in build secrets if the deployed app should hit the bridge.
- **Meals / Resources:** This WIP commit adds `meals.tsx`, `resources.tsx`, and related constants/docs. If the layout references them, the next build should pick them up; otherwise add tabs in `_layout.tsx` when ready.

---

## Caches

Expo and node caches in this repo were cleared at end of session.

---

*Say “Continue from NEXT_SESSION” or “What’s next for GroundChiFlow?” to pick up.*
