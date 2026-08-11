# POA-VIS-004 Completion Report — Organizational Mothership

MISSION: `POA-VIS-004` — Organizational Mothership
STATUS: **COMPLETE.** All 26 Definition-of-Done items are satisfied. STOP and await Chief Architect acceptance (mission's own EXECUTION GOVERNANCE, §27).

---

## 1. Governance / Pre-Flight

Read before modifying anything: `10-Constitution/CONST-001-Paravyoma-Constitution.md`, `10-Constitution/POA-CON-001.md`, `20-Shared/DECISIONS/ADR-002-Sprint-Alpha-Gap-Waiver.md`, `ADR-003-Expression-Architecture-Boundary.md`, `POA-VIS-001/002/003` completion reports, `README.md`, `ROADMAP.md`, `CHANGELOG.md`, and the current VIS-003 implementation (`src/lib/expression/*`, `src/components/expression/NetworkGraphConsole.tsx`).

`POA-000` / `POA-001`, named in the mission brief's pre-flight list, do not exist in this repository under those identifiers — **TBD, no such artifact in repository.** Per CLAUDE.md Rule 7, this is recorded rather than silently substituted with `POA-CON-001`/`CONST-001`.

Authorization chain: mission brief sourced from the Deployment mirror (`D:\...\POA-Repository\Deployment\POA-VIS-004 — ORGANIZATIONAL MOTHERSHIP.md`, `STATUS: AUTHORIZED — EXECUTE`). Its own gate — "STOP and await Chief Architect acceptance" of VIS-003 — was satisfied in-session on 2026-08-11 (Commander confirmed VIS-003 acceptance before VIS-004 execution began); recorded in `ROADMAP.md` and `POA-VIS-003-COMPLETION-REPORT.md` §20 as the first commit of this mission, per CLAUDE.md Rule 6 (traceability).

No repository restructuring performed: canonical domains (`00-Bootstrap/`, `10-Constitution/`, `20-Shared/`, `30-Products/`, `40-Runtime/`) unchanged; `50-Deployment/` not created; `GAP-001` / `PRS-001-CONFLICT-DOSSIER.md` untouched.

---

## 2. Architectural Objective

Implemented as a **third registered `OrganizationalVisualProfile`** (`"mothership"`), following the exact extension seam VIS-003's registry already documented ("adding a future profile means adding one entry here plus its renderer"). This keeps the diagram from §2 —

```
OrganizationalState → OrganizationalVisualProfile → Mothership Expression → Visual Components
```

— literal: `mapStateToMothership(state, profile)` occupies the "Expression" slot exactly as `mapStateToNetworkGraph` does for the Network profile, and `MothershipConsole.tsx` is a pure renderer of that pure mapping's output. No parallel organizational-intelligence engine was built — every number the Mothership shows (health, gap counts, signal severities) is read from the same `OrganizationalState` every other profile reads.

---

## 3–10. Central Core, Domains, Projects, Capabilities, Signal Propagation, Risk/Opportunity Language, Health, Heartbeat

- **Central Organizational Core** (§3): one node at the visual center, restrained idle heartbeat (`.poa-heartbeat`, 4.5s, ±3.5% scale) — alive without being busy.
- **Domains** (§4): People, Projects, Capabilities — the three named in the mission's own §2 diagram, each backed by real counts (`organization.people.length`, `.projects.length`, `.capabilities.length`) and qualitative detail text (e.g. "3 department(s) need attention"). No domain fabricated to fill space.
- **Projects** (§5): one node per `organization.projects` entry, status read directly from `Project.status`; gap flag read from `capabilityGapsByProject`, not recomputed.
- **Capabilities** (§6): capability nodes rendered only for capabilities actually required by a project (the connected subset) — the full consequence chain (project → required capability → gap → visual pressure) is drawn as a dashed red "capability-thread" edge, with the domain's own count still reflecting the organization's full capability roster.
- **Signal propagation** (§7): every `Signal.affectedEntities` reference resolves to the matching project/capability node; the "Event Response" control replays an existing `OrganizationalEvent` and highlights exactly the nodes `resolveEventHighlight` (pure, tested) resolves from it — no invented propagation.
- **Risk language** (§8): severity-scaled "pressure ring" (radius grows with severity) plus restrained pulse (`.poa-pulse`, high/critical only — same rule as the Network profile).
- **Opportunity language** (§9): a distinct, *finite* "bloom" ring (`.poa-bloom-ring`, plays once on mount, `animation-iteration-count: 1`) — deliberately not risk's continuous pulse with a different color.
- **Organizational health** (§10): `state.overallHealth` shown via the existing `StatusDot`/badge and an "Organizational Health" panel; no numeric score invented where the model only has a qualitative status.
- **Heartbeat** (§11): one animated node (the core), CSS-only, negligible GPU cost.

## 11–13. Event Response, Alexis

- **Event response** (§12/§18 STATE B): the "Event Response" panel lists every real `organization.events` entry; selecting one calls `resolveEventHighlight(event, state)` — a pure function matching purely on the event's own relational fields plus each signal's already-computed `affectedEntities`. No second event engine.
- **Alexis** (§13/§20): `AlexisPanel` gained one optional prop, `onResponse?: (response: AlexisResponse) => void` (backward-compatible — `MissionConsole`'s existing call site is unaffected). The Mothership route renders `AlexisPanel` directly and wires `onResponse` to `resolveSourceHighlight(response.sources, state)`, translating Alexis's own cited sources into the same graph highlight the Event Response control uses. Demonstrated interaction: **"What requires attention?"** → Alexis answers from `state.signals` → the capability-gap/risk chain (Capabilities domain, Projects domain, Enterprise AI Transformation, the 3 gap capabilities) highlights; unrelated nodes (People domain, non-gap capabilities) dim. See screenshot 3.

## 14–15. Expression Architecture / Visual DNA

- `mothershipProfile.visualIdentity.sharedPrinciples` is the *same array reference* as `POA_VISUAL_DNA` (asserted by the existing boundary test "every registered profile shares the exact same POA Visual DNA reference").
- Every label in the console (`Core`, domain names, `riskLabel`, `signalLabel`, etc.) is read from `profile.terminology` / `profile.visualMetaphor` — zero hard-coded strings duplicate what the profile object already declares (verified by test: "uses the profile's terminology, not a hard-coded string").

## 16–17. Responsive / Performance

- **Desktop**: the SVG radial layout (`900×620` viewBox), shown ≥ `md`.
- **Mobile/compact** (§16): a genuinely different, text-first stacked expression shown < `md` (health line, domain cards, project list with status/gap tags, gap-only capability list) — not the desktop canvas shrunk down. Screenshot 4.
- Fixed as part of this pass: the shared `AppShell` header did not wrap on narrow viewports (health badge was clipped at 390px) — added `flex-wrap`/`gap-y-2` (additive Tailwind classes only, no prop/behavior change; verified no regression on the reference and network routes).
- **Performance** (§17): one continuously-animated element (the heartbeat); severity pulse restrained to high/critical only; opportunity bloom is finite (plays once); DOM node count for the demo scenario is ~40 (core + 3 domains + 2 projects + 8 capabilities + 4 signals + edges) — no virtualization or canvas needed at this scale.

## 18–19. Two Experience States / Acceptance Scenario

- **State A** (organization at rest): default render, no highlight active. Screenshot 1.
- **State B** (organizational event): "Capability gap detected on Enterprise AI Transformation" selected — highlight propagates to Projects/Capabilities domains, the affected project, and the 3 gap capabilities; unrelated nodes dim. Screenshot 2.
- **Acceptance scenario** (§19) verified unchanged: **8 required / 5 available / 3 short** on Enterprise AI Transformation, `overallHealth: "at-risk"` — asserted by test ("existing VIS-002 scenario remains functional") before any Mothership code was written, and again in the final suite run.

## 20. Alexis Visual Interaction

Covered above (§11–13). Screenshot 3 shows the question, Alexis's sourced answer, and the corresponding highlighted graph state together on one page.

## 21. Non-Goals

None of the excluded scope (production 3D mothership, VR/AR, industry profiles, multi-tenant, production auth/billing, predictive analytics, autonomous decisions, production voice infra, ERP integrations, unrestricted AI-generated profiles) was built. The "Mothership" is a structural metaphor (central core + domains), not a literal 3D object.

---

## 22. Tests

`src/lib/expression/mothership-mapping.test.ts` — 15 tests, mapped to the mission's own 12-item list:

| # | Requirement | Test |
|---|---|---|
| 1 | Mothership consumes OrganizationalState | "consumes OrganizationalState: one project node per organization project..." |
| 2 | No duplicated domain logic | Covered by existing boundary tests 1/2/2b (generic over `src/lib/expression`, `src/components`) — `mothership-mapping.ts` imports no `@/lib/services`; `MothershipConsole.tsx` imports no `@/lib/services` |
| 3 | ExpressionProfile remains the configuration boundary | "uses the profile's terminology, not a hard-coded string" |
| 4 | Signals map to visual state without changing semantics | "signals map to visual state without changing signal semantics" |
| 5 | Risk severity sourced from organizational state | "risk severity remains sourced from organizational state" |
| 6 | Opportunity state sourced from organizational state | "opportunity state remains sourced from organizational state" |
| 7 | Existing VIS-002 scenario remains functional | "existing VIS-002 scenario remains functional (8 required / 5 available / 3 short, unchanged)" |
| 8 | Alexis continues using the same organizational intelligence | "Alexis 'what requires attention?' sources resolve to the same signals Alexis itself cited" + "asking Alexis does not change the answer it gives" |
| 9 | Idle state renders without errors | Verified by browser validation (§23) — this repo's test suite (like VIS-001–003's) is pure-function only, no component-rendering harness; zero console errors captured across all 4 screenshot states plus regression check of the other two routes |
| 10 | Event/state transition produces the intended visual response | "an existing organizational event resolves to the graph nodes it actually touches" + "propagates event → project → active signal → capability" |
| 11 | No forbidden Core → Expression dependency introduced | Existing boundary test 1 (generic over `lib/domain`, `lib/services`, `lib/alexis`, `organizational-state.ts`) |
| 12 | No new repository-domain violation | `git status` reviewed below — only `30-Products/poa-vis-001/` and `40-Runtime/` touched |

Full suite: **50/50 passing** (35 pre-existing + 15 new).

Also run: `npx tsc --noEmit` (0 errors), `npx eslint .` (0 warnings/errors), `npm run build` (clean, all 4 routes — `/`, `/expression/network`, `/expression/mothership`, `/_not-found` — prerendered as static).

---

## 23. Visual Acceptance Evidence

Captured via headless Chromium (Puppeteer) against the real `next dev` server — the Playwright MCP browser bridge extension was unavailable in this environment (connection timeout), so the same Puppeteer fallback used for VIS-003's screenshot evidence was used again. All four required states captured at `40-Runtime/POA-VIS-004-screenshots/`:

1. `01-mothership-at-rest.png` — organization at rest, 1280×900.
2. `02-mothership-active-signal.png` — "Capability gap detected" event selected; highlighted chain visible, dimmed unrelated nodes, Event Response panel description confirms state, 1280×900.
3. `03-mothership-alexis-highlight.png` — full page: "What requires attention?" asked and answered by Alexis, with sources, alongside the corresponding highlighted graph and Signals detail list.
4. `04-mothership-mobile.png` — 390×844 compact expression: health line, domain cards, project/capability lists.

`console-errors.log` in the same directory: **0 errors** across all four captures (after the hydration fix below), plus a separate regression check of `/` and `/expression/network` at 1280×900: **0 errors**.

---

## Bug found and fixed during this pass: floating-point hydration mismatch

Puppeteer's first capture run surfaced a real React hydration mismatch on every Mothership screenshot: `Math.cos`/`Math.sin`-derived SVG coordinates (`cx`, `cy`, `x1`, `y1`, `x2`, `y2`) differed in their last 1–2 significant digits between the Node.js SSR pass and the browser's V8, because transcendental trig functions are not guaranteed bit-identical across V8 builds/engines even for identical inputs (unlike `+`/`-`/`*`/`/`, which are exact under IEEE-754). React serializes full float precision into the SSR HTML, so a 1-ULP difference is enough to trip the mismatch warning.

**Fix**: added a `round(value)` helper (`Math.round(value * 100) / 100`) in `MothershipConsole.tsx` and applied it at every point coordinates are computed (`pointAt`, the signal-satellite offset). SSR and CSR now serialize identically regardless of any sub-hundredth floating-point drift. Re-verified: 0 console errors post-fix, full suite still green.

This is a latent risk in `NetworkGraphConsole.tsx` too (same `ringPosition` → `Math.cos`/`Math.sin` pattern), which has not (yet) surfaced it in practice — noted here for a future pass, not fixed in this mission (out of VIS-004's scope; VIS-003's component was not touched).

---

## Files Created

- `src/lib/expression/mothership-mapping.ts` — pure view-shaping + `resolveEventHighlight` + `resolveSourceHighlight`
- `src/lib/expression/mothership-mapping.test.ts` — 15 tests
- `src/components/expression/MothershipConsole.tsx` — desktop SVG + mobile compact renderer
- `src/components/expression/ExpressionSwitcher.tsx` — registry-driven 3-way profile switcher
- `src/app/expression/mothership/page.tsx` — the new route
- `40-Runtime/POA-VIS-004-screenshots/` — 4 PNGs + console-errors.log
- `40-Runtime/POA-VIS-004-COMPLETION-REPORT.md` — this report

## Files Modified

- `src/lib/expression/types.ts` — `ExpressionProfileId`, `spatialComposition`, `MotionLanguage` unions widened (additive)
- `src/lib/expression/profiles.ts` — added `mothershipProfile`
- `src/lib/expression/registry.ts` — registered `"mothership"`
- `src/components/alexis/AlexisPanel.tsx` — added optional `onResponse` prop (additive)
- `src/components/AppShell.tsx` — header `flex-wrap` for mobile (additive CSS)
- `src/app/page.tsx`, `src/app/expression/network/page.tsx` — switched to `ExpressionSwitcher`
- `src/app/globals.css` — added `.poa-heartbeat`, `.poa-bloom-ring` (additive)
- `ROADMAP.md`, `40-Runtime/POA-VIS-003-COMPLETION-REPORT.md` — recorded VIS-003 acceptance + VIS-004 start (first commit of this mission, per CLAUDE.md Rule 6)

## Architecture Changes

None beyond the designed extension seam: a third `OrganizationalVisualProfile` registered exactly as VIS-003's own documentation anticipated. No canonical directory added/renamed/moved. No `50-Deployment/`.

## Known Limitations

- Idle-state "renders without errors" is verified by browser validation, not a component-rendering unit test — consistent with this repo's existing test-suite style (pure-function tests only; no `@testing-library/react` dependency present).
- The Mothership's People domain shows department-level health/count only, not individual person nodes — kept the graph legible at this data scale; a larger organization would need this design re-examined.
- `NetworkGraphConsole.tsx`'s trig-based layout carries the same latent 1-ULP hydration risk this mission fixed in `MothershipConsole.tsx` — not patched here (out of scope), flagged for a future pass.
- `POA-000`/`POA-001` (mission pre-flight) do not exist in this repository — TBD per CLAUDE.md Rule 7.

## Recommended Next Step

TBD — requires Chief Architect acceptance of this mission before any further materialization mission is authorized, per the mission's own EXECUTION GOVERNANCE (§27) and this repository's ROADMAP gate.

---

## Commit / Sync State

Committed to `main` locally: `4837e57`. **Not yet pushed to `origin/main`** — the mission brief authorizes push, but that authorization lives outside this repository and is not durable instruction in `CLAUDE.md`; push requires explicit user confirmation in this session (see the git-push safety note in the operator's standing instructions). Awaiting that confirmation.
