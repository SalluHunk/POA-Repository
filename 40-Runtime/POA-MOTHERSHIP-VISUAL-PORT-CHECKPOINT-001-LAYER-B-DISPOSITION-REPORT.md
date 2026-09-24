# POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001 (Option 2) — Layer B Disposition Report

| Field | Value |
|---|---|
| Mission | POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001, Option 2: Layer B classification, disposition and quarantine (Commander chat directive, 2026-09-24) |
| Baseline HEAD | `168708c` (local; `origin/main` `9569b20`) |
| Final HEAD | `168708c` (unchanged) |
| Decision record | `40-Runtime/POA-DEC-MOTHERSHIP-002-DECISION.md`, status **executed, pending Commander ratification** |
| Supersedes | Nothing. `POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001-REVIEW-REPORT.md` is left unedited; its §5 path list is stale after this mission, and §4 below replaces it. |
| Staged / committed | **Nothing.** |

## 1. Outcome

- **Classification:** Layer B is **DEMO**, with **no authority** to represent POA organizational truth.
- **Disposition:** quarantine, label, and convert to demo-only infrastructure. It is default-off and reachable only through `npm run dev:demo`.
- **Contradiction:** resolved by classification. The BLD-MOTHERSHIP-001 completion report is **not modified**. NL conversation remains VISION, and listening mode remains not built.
- **Canned-answer test:** it tested demo behavior, not a product contract. It was moved to a demo harness and replaced by an anti-fabrication product-contract test.

Full reasoning is in POA-DEC-MOTHERSHIP-002 §1–§7.

## 2. Files Changed by This Mission

**Moved** (untracked, content otherwise preserved apart from the headers and disclosure listed under "Edited"):

| From | To |
|---|---|
| `src/state/presenceData.ts` | `src/demo/presenceData.ts` |
| `src/state/usePresenceAsk.ts` | `src/demo/usePresenceAsk.ts` |
| `src/components/AnswerOverlay.tsx` | `src/demo/AnswerOverlay.tsx` |
| `src/components/DomainDetailOverlay.tsx` | `src/demo/DomainDetailOverlay.tsx` |
| `src/components/ListeningOverlay.tsx` | `src/demo/ListeningOverlay.tsx` |
| `src/components/ThinkingIndicator.tsx` | `src/demo/ThinkingIndicator.tsx` |

**Created:**
- `src/demo/demoLayer.tsx`: the gate plus `DemoDisclosure`.
- `src/demo/demo.test.tsx`: the demo harness, headed "NOT A PRODUCT CONTRACT".
- `src/state/phases.ts`: `PHASES`, moved out of the demo module.
- `src/vite-env.d.ts`: the standard Vite client types, needed to type `import.meta.env`.
- `40-Runtime/POA-DEC-MOTHERSHIP-002-DECISION.md`.
- This report.

**Edited:**
- `App.tsx`: gate on the overlays, the domain-detail selection, the unbacked-domain figures and the `⚠` flag; global disclosure in demo mode.
- `CommandBar.tsx`: default routes to the real lookup; inert mic; non-NL placeholder; lookup-miss note; phantom §12 citation removed.
- `QuickPrompts.tsx`: inert by default.
- `Header.tsx`: now imports `PHASES` from `state/phases`.
- `environment/DomainOrbits.tsx`: the flag is now supplied by the caller.
- `environment/constants.ts`: comments mark the `l1`/`l2`/`flag` values as fictional.
- `demo/AnswerOverlay.tsx`, `demo/DomainDetailOverlay.tsx`, `demo/ListeningOverlay.tsx`: disclosure plus quarantine header; the §12 citation is removed from the Listening overlay.
- `demo/presenceData.ts`, `demo/usePresenceAsk.ts`, `demo/ThinkingIndicator.tsx`: quarantine headers; `PHASES` removed from `presenceData`.
- `src/test/smoke.test.tsx`: the canned-answer test is replaced by an anti-fabrication test; the principal test uses the default-mode placeholder.
- `package.json`: adds the `"dev:demo": "vite --mode demo"` script.

**Untouched:**
- `POA-BLD-MOTHERSHIP-001-COMPLETION-REPORT.md`, the demo-layer disclosure report, and the checkpoint review report.
- `useCommandCenter.ts` and all Layer C files except `App.tsx`: `PeopleFocus.tsx` and `PrincipalFocus.tsx` are unchanged.
- All Layer A files except the shared ones listed above.
- `CLAUDE.md`, `.playwright-mcp/`, the root PNGs, and all other `40-Runtime` reports.

## 3. Validation

| Check | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm test` | **2 files, 8/8 pass**: `smoke.test.tsx` 7 (including the new default-mode anti-fabrication contract) and `demo/demo.test.tsx` 1 (demo harness) |
| `npm run build` | success |
| Default-build content check (`dist/assets/*.js`) | gated surfaces tree-shaken: "BOARD MEETING" 0, "DEMO · FICTIONAL" 0. **Residual:** "Temple Growth" 1, the canned answer 1, and "1,204 VERIFIED" 1 remain as unreachable data (DEC-002 §6 residuals) |
| Unrelated-file check | `git status --short` compared against the pre-mission baseline snapshot. The only differences are `package.json` (M), the 6 moved files, `src/demo/`, `src/state/phases.ts` and `src/vite-env.d.ts`, plus the two new 40-Runtime records. No other path changed. |
| Staged | 0 paths |
| Live browser | **Not performed this mission.** DOM behavior is covered by the tests. Visual confirmation of the default and `dev:demo` modes is outstanding. |

## 4. Staging Eligibility (regenerated; supersedes review report §5)

These paths are **eligible for staging only after Commander ratification of POA-DEC-MOTHERSHIP-002**, as a single commit. Stage them individually and never as a bare directory.

**Tracked, modified (12):**
```
50-Mothership/command-center/index.html
50-Mothership/command-center/package.json
50-Mothership/command-center/src/App.tsx
50-Mothership/command-center/src/components/ActionResult.tsx
50-Mothership/command-center/src/components/CommandOverlay.tsx
50-Mothership/command-center/src/components/MissionFocus.tsx
50-Mothership/command-center/src/components/MissionInvestigate.tsx
50-Mothership/command-center/src/components/PrincipalFocus.tsx
50-Mothership/command-center/src/state/useCommandCenter.ts
50-Mothership/command-center/src/styles/environment.css
50-Mothership/command-center/src/styles/tokens.css
50-Mothership/command-center/src/test/smoke.test.tsx
```
**Tracked, deleted (1):**
```
50-Mothership/command-center/src/components/Presence.tsx
```
**Untracked, new: product code (23):**
```
50-Mothership/command-center/src/vite-env.d.ts
50-Mothership/command-center/src/state/phases.ts
50-Mothership/command-center/src/components/ActivityPanel.tsx
50-Mothership/command-center/src/components/AttentionPanel.tsx
50-Mothership/command-center/src/components/CommandBar.tsx
50-Mothership/command-center/src/components/CommandCenter.tsx
50-Mothership/command-center/src/components/ContextualSurface.tsx
50-Mothership/command-center/src/components/Footer.tsx
50-Mothership/command-center/src/components/Greeting.tsx
50-Mothership/command-center/src/components/Header.tsx
50-Mothership/command-center/src/components/OrbitMarkers.tsx
50-Mothership/command-center/src/components/OrganizationalPulse.tsx
50-Mothership/command-center/src/components/PeopleFocus.tsx
50-Mothership/command-center/src/components/QuickPrompts.tsx
50-Mothership/command-center/src/components/Stage.tsx
50-Mothership/command-center/src/components/shared.tsx
50-Mothership/command-center/src/components/environment/Atmosphere.tsx
50-Mothership/command-center/src/components/environment/DomainOrbits.tsx
50-Mothership/command-center/src/components/environment/Environment.tsx
50-Mothership/command-center/src/components/environment/OrbitalGeometry.tsx
50-Mothership/command-center/src/components/environment/OrganizationalCore.tsx
50-Mothership/command-center/src/components/environment/Starfield.tsx
50-Mothership/command-center/src/components/environment/constants.ts
```
**Untracked, new: QUARANTINED demo infrastructure (8).** These are staging-eligible *as quarantined DEMO code*. The quarantine is enforced in code and labelled in history; it does not hold these paths out of the commit.
```
50-Mothership/command-center/src/demo/demoLayer.tsx
50-Mothership/command-center/src/demo/demo.test.tsx
50-Mothership/command-center/src/demo/presenceData.ts
50-Mothership/command-center/src/demo/usePresenceAsk.ts
50-Mothership/command-center/src/demo/AnswerOverlay.tsx
50-Mothership/command-center/src/demo/DomainDetailOverlay.tsx
50-Mothership/command-center/src/demo/ListeningOverlay.tsx
50-Mothership/command-center/src/demo/ThinkingIndicator.tsx
```
**Governance records (3), to be committed with the code so history carries the classification:**
```
40-Runtime/POA-DEC-MOTHERSHIP-002-DECISION.md
40-Runtime/POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001-REVIEW-REPORT.md
40-Runtime/POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001-LAYER-B-DISPOSITION-REPORT.md
```
Total: 47 paths (44 code + 3 records).

**Excluded:**
- `CLAUDE.md`: uncommitted `/init` text, and it now names stale demo-module paths (follow-up item).
- `.playwright-mcp/`.
- The root `*.png` files.
- All other `40-Runtime` reports.

## 5. Commit Eligibility

**Not authorized.** POA-DEC-MOTHERSHIP-002 §8 explicitly withholds commit authorization pending Commander ratification. An agent-authored disposition does not authorize the commit of the agent's own work. Mission stopped before staging.
