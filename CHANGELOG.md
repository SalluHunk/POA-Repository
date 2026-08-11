# Changelog

All notable changes to POA-Repository are recorded here. Entries are grounded in actual commit history (`git log`) and mission completion reports — not reconstructed from memory.

---

## [Unreleased] — POA-VIS-004

**Mission:** Organizational Mothership (authorized by the mission's own `STATUS: AUTHORIZED — EXECUTE`, sourced from the Deployment mirror; executed after in-session Chief Architect acceptance of POA-VIS-003)

### Added
- `src/lib/expression/mothership-mapping.ts` — pure view-shaping for a third `OrganizationalVisualProfile` (`"mothership"`): central Organizational Core, People/Projects/Capabilities domains, capability consequence threads, signal/risk/opportunity nodes, plus `resolveEventHighlight` and `resolveSourceHighlight` (pure, tested — no second event or Alexis engine).
- `src/components/expression/MothershipConsole.tsx` — desktop SVG radial renderer + a genuinely distinct mobile/compact text-first expression (not the desktop canvas shrunk down).
- `src/components/expression/ExpressionSwitcher.tsx` — registry-driven profile switcher, replacing the two routes' hand-hardcoded single links now that a third profile exists.
- `src/app/expression/mothership/page.tsx` — the third expression route.
- `src/lib/expression/mothership-mapping.test.ts` — 15 tests, up from 35 to 50 total.
- `40-Runtime/POA-VIS-004-COMPLETION-REPORT.md`, `40-Runtime/POA-VIS-004-screenshots/`.

### Changed
- `src/lib/expression/types.ts` — `ExpressionProfileId`, `spatialComposition`, `MotionLanguage` unions widened (additive) to admit the Mothership profile.
- `src/lib/expression/profiles.ts`, `registry.ts` — added and registered `mothershipProfile`.
- `src/components/alexis/AlexisPanel.tsx` — added an optional `onResponse` prop so a consumer can visually highlight the area an Alexis answer cites (existing `MissionConsole` call site unaffected).
- `src/components/AppShell.tsx` — header now wraps on narrow viewports (`flex-wrap`), fixing a health-badge clipping bug the mobile screenshot pass surfaced; no other markup changed.
- `src/app/page.tsx`, `src/app/expression/network/page.tsx` — switched to `ExpressionSwitcher`.
- `src/app/globals.css` — added `.poa-heartbeat` (restrained core idle animation) and `.poa-bloom-ring` (finite, one-time opportunity animation, distinct from risk's continuous pulse).

### Fixed
- A React hydration mismatch from `Math.cos`/`Math.sin` producing non-bit-identical floats between SSR and CSR (not guaranteed identical across V8 builds, unlike `+`/`-`/`*`/`/`) — fixed by rounding all computed SVG coordinates in `MothershipConsole.tsx`. The same latent pattern exists in `NetworkGraphConsole.tsx` (not yet observed failing there) and is flagged, not fixed, in the completion report.

### Notes
- No existing VIS-001/002/003 component, service, or domain file was rewritten. The acceptance scenario (8 required / 5 available / 3 short, `at-risk`) remains test-enforced, now from a third independent profile.
- Per the mission's own execution governance, POA-VIS-004 is complete; STOP and await Chief Architect acceptance before any further mission.

---

## [Unreleased] — POA-VIS-003

**Mission:** Expression Architecture (authorized by the mission's own `STATUS: AUTHORIZED — EXECUTE`, confirmed in-session; see `ADR-003`)

### Added
- `src/lib/expression/` — POA Core / Expression Layer boundary: `types.ts` (`OrganizationalVisualProfile` typed model), `visual-dna.ts` (shared `POA_VISUAL_DNA`), `profiles.ts` (`referenceProfile`, `networkGraphProfile`), `registry.ts` (`EXPRESSION_PROFILES`), `network-mapping.ts` (pure state→graph view-shaping).
- `src/components/expression/NetworkGraphConsole.tsx` and `src/app/expression/network/page.tsx` — second demonstration expression (Network / Organizational Graph), consuming the identical `OrganizationalState` as the reference console.
- `src/lib/expression/network-mapping.test.ts` (5 tests), `src/lib/expression/expression-boundary.test.ts` (8 tests, including static import-boundary scans) — 35 tests total, up from 22.
- `20-Shared/DECISIONS/ADR-003-Expression-Architecture-Boundary.md`.
- `40-Runtime/POA-VIS-003-COMPLETION-REPORT.md`.

### Changed
- `src/components/AppShell.tsx` — added one optional `expressionSwitcher?: ReactNode` prop (renders nothing if omitted); no other markup changed.
- `src/app/page.tsx` — added a small link to the new Network Expression route; now documented as the POA Reference Expression Profile.
- `src/app/globals.css` — added a restrained `.poa-pulse` animation, applied only to high/critical-severity signal nodes in the new graph profile.

### Notes
- No existing VIS-001/VIS-002 component, service, or domain file was rewritten — `MissionConsole` and all panels are functionally unchanged; the original scenario numbers (8 required / 3 gapped / at-risk) remain test-enforced.
- Chief Architect acceptance granted in-session, 2026-08-11. POA-VIS-004 is now authorized and complete — see the entry above.

---

## [Unreleased] — POA-VIS-002

**Mission:** Organizational Intelligence Core

### Added
- `services/opportunities.ts`, `services/signals.ts`, `services/recommendations.ts`, `services/relationships.ts` — signal engine, recommendation engine, and relationship/impact traversal, all queryable independently of the UI.
- `components/OrganizationalSignals.tsx` (replaces `RiskPanel.tsx`) — unified risk/capability-gap/opportunity/organizational-health signal display.
- Vitest test suite: 22 tests across 6 files covering state derivation, capability-gap detection, signal generation, recommendation generation, relationship traversal, and all 7 required Alexis questions.
- `40-Runtime/POA-VIS-002-COMPLETION-REPORT.md`.

### Changed
- Domain model expanded: `Role`, `Resource`, `Budget`, `Opportunity`, `Decision`, `Signal`, `ImpactChain`; `OrgEvent` replaced by a typed `OrganizationalEvent`.
- `alexis/engine.ts` now reads `OrganizationalState.signals`/`.recommendations` instead of recomputing risk logic inline.
- POA-VIS-001 scenario numbers (8 required / 5 available / 3 short) preserved unchanged and test-enforced.

### Notes
- Not a UI redesign — Mission Console panels other than the risk-panel swap are unchanged.
- No constitutional architecture changes. Per the mission's own execution rule, POA-VIS-003 is not begun.

---

## [Unreleased] — POA-VIS-001

**Mission:** Sprint Alpha Visual System Materialization (authorized by `ADR-002`)

### Added
- `30-Products/poa-vis-001/` — first product-domain materialization: a Next.js/TypeScript Mission Console vertical slice (domain model, demo dataset, capability-gap/risk services, deterministic Alexis engine, voice provider boundary, Mission Console UI).
- `40-Runtime/POA-VIS-001-COMPLETION-REPORT.md` — full mission completion report.
- `.claude/launch.json` — local dev-server preview configuration.

### Notes
- Does not alter constitutional architecture, resolve `PRS-001`, or restructure the repository — scope confirmed against `ADR-002` before starting.
- `30-Products/` is no longer empty; `README.md` and `ROADMAP.md` updated to reflect this.

---

## [Unreleased] — POA-REPO-003

**Mission:** Repository Structural Conformance

### Moved
- `REPO-INTEGRITY-REPORT.md` → `40-Runtime/REPO-INTEGRITY-REPORT.md`
- `REPO-AUTHORITY-RECONCILIATION-REPORT.md` → `40-Runtime/REPO-AUTHORITY-RECONCILIATION-REPORT.md`
- `PRS-001-CONFLICT-DOSSIER.md` → `40-Runtime/PRS-001-CONFLICT-DOSSIER.md`

Reason: the Commander-approved top-level architecture defines exactly four root documents (`README.md`, `CLAUDE.md`, `CHANGELOG.md`, `ROADMAP.md`). These three mission reports had no approved root location; `40-Runtime/` is explicitly defined by the approved architecture as covering "missions... production/runtime evidence," a direct textual match. Moved with `git mv` to preserve history; all 9 cross-references across the repository updated to the new paths; no artifact ID or content changed.

### Added
- `40-Runtime/REPO-STRUCTURE-AUDIT-003.md`
- `40-Runtime/REPO-STRUCTURE-REPORT.md`

---

## [Unreleased] — POA-REPO-001

**Mission:** Repository Integrity & Governance Materialization

### Added
- `10-Constitution/POA-CON-001.md` — Constitutional & Governance Baseline (Interim)
- `20-Shared/DECISIONS/ADR-RM-001.md` — first Architectural Decision Record (materialized from source deployment vault)
- `40-Runtime/POA-MAT-001.md` — POA Materialization Playbook
- `CHANGELOG.md` (this file)
- `ROADMAP.md`
- `CLAUDE.md` — AI operating instructions
- `REPO-INTEGRITY-REPORT.md`

### Notes
- No existing artifact was deleted, overwritten, or relocated.
- Local and `origin/main` were found byte-identical at mission start (0-diff reconciliation) — the divergence risk flagged in the mission brief had already been resolved by a prior push in this session.

---

## 2026-07-25 — `3d1ea4e`

**feat(standards): materialize POA-STD-011 Mission Package Standard**

- Added `20-Shared/STD/POA-STD-011.md`, materialized from the source deployment vault per `MP-0001` / `ADR-RM001-011`.

---

## 2026-06-27 — `d0a5b55`

**feat(bootstrap): initialize POA Execution System**

- Bootstrap `BOOT-001`: established repository hierarchy (`00-Bootstrap/`, `10-Constitution/`, `20-Shared/{KER,RSR,EXB}/`, `30-Products/`, `40-Runtime/`).
- Added `20-Shared/KER/POA-KER-001.md` (Execution System Architecture), `20-Shared/RSR/POA-RSR-001.md` (Repository State Report Specification), `20-Shared/EXB/POA-EXB-001.md` (Execution Bundle Specification).
- Added `00-Bootstrap/BOOT-001-Manifest.md`, `BOOT-001-Validation-Report.md`, `BOOT-001-Completion-Report.md`.
- Added `README.md`.
