# POA-MOTHERSHIP-PROJECT-SURFACE-001 — Implementation Report

**Mission:** POA-MOTHERSHIP-PROJECT-SURFACE-001 — Implementation (Deployment mirror brief `POA-MOTHERSHIP-PROJECT-SURFACE-001 — IMPLEMENTATION.md`)
**Governing brief:** `40-Runtime/POA-MOTHERSHIP-PROJECT-SURFACE-COMMANDER-DECISION-BRIEF.md` (D1–D6)
**Baseline:** HEAD `988602ea40d5bc266b989f4cbe3e1529fc631ae0` (POA-MOTHERSHIP-002: quarantine demo layer)
**Date:** 2026-09-24
**Status:** Implemented in working tree. **Not staged, not committed.** Awaiting Commander review.

---

## 1. Execution Resource

| Item | Value | How observed |
|---|---|---|
| Provider | Anthropic | Harness system context |
| Model | Claude Opus 5.5 | Harness system context ("You are powered by the model named Opus 5.5") |
| Model ID | `claude-opus-5-5` | Same system context |
| Effort | `medium` | `$CLAUDE_EFFORT` read directly from this session's process environment |

Both match the mission requirement (Opus 5.5 / Medium). Work proceeded.

---

## 2. Pre-Implementation Inspection (Directive steps 1–5)

- **Command Center:** `App.tsx` routes `subject`/`depth` to Focus surfaces inside `ContextualSurface`; demo overlays (`src/demo/*`) render only at `depth === "presence"` and only when `isDemoLayerEnabled()`.
- **People/Principal pattern:** `Subject` union in `useCommandCenter.ts` with `{ type: "people" }` (no id), `focusPeople` action setting `subject` + `depth: "context"`, rendered by `PeopleFocus.tsx`.
- **Repository-record contract:** `GET /api/repository/project-registry` (Slice 001, `server/http.ts` → `server/api.ts:getProjectRegistry`) returns `{ entries: [{ fields: [{field, value}], repositoryReference: {path, commit, heading} }], addenda: [{ body, repositoryReference }] }` on success, or `503 { ok:false, code:"REPOSITORY_RECORDS_UNAVAILABLE", detail }`. The loader explicitly does **not** attribute addenda to entries ("reconciling them is not a decision this path makes").
- **PJR-001 at HEAD:** 3 entries (IEP Website; PDF Compressor ("SHARP"); Temple SaaS), 2 dated addenda (Chief Architect Naming Resolution; `TSAAS-DEC-001` TGP Naming Evolution). Confidence markers live inline in field values.
- **Live contract confirmation:** the running console server's response was queried directly — keys `entries`/`addenda`, headings as above, `SELF-DECLARED, UNVERIFIED` present verbatim in Entry 3. (A pre-existing console process on port 5310 from an earlier session is pinned at `9569b20`; a fresh load at HEAD `988602e` also reported "3 entries, 2 addenda" before exiting on `EADDRINUSE`. The pre-existing process was left untouched.)

---

## 3. Files Created / Modified

All within `50-Mothership/command-center/`:

| File | Change |
|---|---|
| `src/api/types.ts` | **Modified (additive).** `RepositoryReference`, `ProjectRegistryEntry`, `ProjectRegistryAddendum`, `ProjectRegistry` — mirror of the server feed types. |
| `src/api/client.ts` | **Modified (additive).** `getProjectRegistry()` via the existing `getJson` wrapper. No existing export changed. |
| `src/state/useCommandCenter.ts` | **Modified (additive).** `{ type: "project" }` Subject variant; `ProjectRegistryState` (`idle`/`loading`/`ok`/`failed`); `projectRegistry` state field; `focusProject` action. No existing field/action/type changed. |
| `src/components/ProjectFocus.tsx` | **Created.** The Project Surface. |
| `src/components/CommandOverlay.tsx` | **Modified (additive).** `onProjects` prop + "Projects — repository registry" entry. |
| `src/App.tsx` | **Modified (additive).** Renders `ProjectFocus` at `depth === "context" && subject.type === "project"`; wires `onProjects`; excludes the demo `ListeningOverlay` while the Project subject is focused (Deviation §6.4). |
| `src/test/project-surface.test.tsx` | **Created.** 11 focused tests (§5). |

Plus this report. **Untouched:** `50-Mothership/src/` (BLD-001 runtime), `50-Mothership/server/*` (Slice 001 server), `POA-PJR-001`, `POA-ADR-001`, `src/demo/*` including `presenceData.ts`, `DOMAIN_SPEC`, `CLAUDE.md`, all other 40-Runtime reports, `smoke.test.tsx`, `demo.test.tsx`.

---

## 4. Implementation Completed (mapped to the directive's Required list)

1. **Project Subject/state/navigation (D1):** `{ type: "project" }` Subject + `focusProject`, same subject/depth mechanism as `focusPeople`. Return via breadcrumb / "Return to Presence" (`returnTo("presence")` clears the subject).
2. **Client registry access (D6):** `getProjectRegistry()`.
3. **Project Surface component (D6):** `ProjectFocus.tsx`.
4. **PJR-001 entries + addenda (D4):** all entries, then all addenda, in registry order, verbatim. See Deviation §6.1.
5. **Repository Reference preserved:** full `path @ commit · "heading"` rendered unconditionally on every entry and every addendum — never collapsed.
6. **Confidence markers preserved exactly:** field names and values rendered as plain text; no markdown interpretation, no marker extraction, chip, or aggregate.
7. **Demo data separate:** Project path imports nothing from `src/demo/`; surface renders only at `context` depth; demo detail/answer overlays render only at `presence`; the demo `ListeningOverlay` (not depth-gated, and naming the fictional "Temple Growth") is excluded while the Project subject is focused (§6.4).
8. **Temple SaaS / Temple Growth:** no project-name lookup was added to the Command Bar (avoids fuzzy "Temple" matching); every "Temple" string on the Project surface sits inside a block carrying its Repository Reference; demo narrative strings never appear there. No badge taxonomy introduced.
9. **Project↔Mission UNSPECIFIED:** no relationship affordance, count, or link.
10. **No write actions:** GET only; the surface's only buttons are navigation (breadcrumb, Return).
11–15. PJR-001, POA-ADR-001, `presenceData.ts`, the Mission runtime model: unmodified. No new ontology entity.
16. Additive throughout (the 3 removed lines are single-line signatures/unions re-emitted in extended form).

**Failure isolation:** the registry is fetched lazily on `focusProject`, outside `loadPresence`'s `Promise.all`, so a `REPOSITORY_RECORDS_UNAVAILABLE` 503 shows an honest in-surface alert (code + detail, no fallback content) and never blanks Missions/People.

---

## 5. Tests and Typecheck

| Check | Result |
|---|---|
| Command Center `tsc --noEmit` | Clean |
| Command Center `vitest run` | **19/19 pass** (3 files: smoke 7, project-surface 11, demo 1) — smoke and demo suites unchanged |
| Command Center `npm run build` | Succeeds (`dist/` is gitignored) |
| 50-Mothership `tsc --noEmit` | Clean |
| 50-Mothership `vitest run` | **89 pass, 1 todo** (8 files) — server unchanged; run because the client/server boundary is consumed |

New tests (`project-surface.test.tsx`): registry not read until focus (independence from Presence); Presence → Projects → Presence navigation with a single GET; verbatim fields/markers; Repository Reference on every entry and addendum (path, commit, heading); addenda order and non-attribution; Temple SaaS vs demo Temple Growth; static no-`src/demo` import check on the Project path; no mission relationship / no action affordance; 503 failure state with Presence intact; empty-registry state; **demo mode**: listening enabled at Presence, then Projects opened — the fictional listening narrative is not rendered and every on-screen "Temple" sits inside a Repository-Referenced block. This demo-mode test was written first and **failed against the pre-fix code** (co-rendering confirmed), then passed after §6.4.

---

## 6. Deviations from the Brief

1. **Addenda are shown at registry level, not "under" each entry.** D4 wording is "current entry plus its own addenda." The API returns addenda as a separate, unattributed list, and neither the addendum headings nor the loader identify which entry an addendum updates; attributing them on the client would require parsing prose ("update to Entry 3") — the exact reconciliation the Slice 001 loader declines to make. The smallest additive solution, faithful to "exactly as PJR-001 already stores them": one surface renders every entry, then every addendum, in file order, each with its Repository Reference. D4's purpose (Entry 3 is never shown without its resolving addenda) is preserved because they always render on the same surface.
2. **Subject shape is `{ type: "project" }` (no `id`),** rather than D6's sketch `{ type: "project", id }`. D6 also says "following the existing focusPeople pattern exactly" (`{ type: "people" }` has no id), §11.3 leaves the exact shape to implementation, and the uniform-depth whole-registry surface (D2 safety property) has no per-project selection to carry.
3. **Entry point is a Command Overlay item,** not an eighth domain orb — `DOMAIN_SPEC` is a verbatim port of the reference's seven domains, and changing it would be a visual/architectural change beyond this brief.

4. **Demo `ListeningOverlay` gating narrowed in `App.tsx`:** condition extended from `demo && listening` to `demo && listening && subject?.type !== "project"`. Reason: in demo mode the overlay is not depth-gated and its content names the fictional "Temple Growth"; without this, it co-rendered with the repository-backed registry (confirmed by a failing test), violating required items 7–8. Deliberately *not* changed to `depth === "presence"`, which would alter demo behavior for mission/people surfaces. No `src/demo/` file was edited. This touches POA-MOTHERSHIP-002 demo gating in the smallest possible way; the Commander may prefer a different resolution.

None alters architecture; all are documented choices within the brief's latitude.

---

## 7. New Architectural Boundaries Encountered

**None requiring a stop.** Noted for later scope, not acted on:
- Per-entry addendum attribution, if ever wanted, belongs in the server loader (or PJR-001's own structure) under its own decision — not in the client.
- In demo mode, the global `DEMO · FICTIONAL` disclosure (POA-MOTHERSHIP-002 contract) remains visible over the real registry, so repository data could be read as fictional in that mode. Not changed — suppressing it would alter the disclosure contract; flagged for Commander review.
- A pre-existing console server on :5310 (PID 4168, started before HEAD advanced) serves Repository Reference commit `9569b20`; a live review will show that commit until it is restarted at HEAD `988602e`.
- A live browser check of the Project Surface against the running server was not performed (unit/integration tests + live API contract query only).

---

## 8. Git Status (mission-relevant)

HEAD `988602e`, nothing staged. Mission changes:

```
 M 50-Mothership/command-center/src/App.tsx
 M 50-Mothership/command-center/src/api/client.ts
 M 50-Mothership/command-center/src/api/types.ts
 M 50-Mothership/command-center/src/components/CommandOverlay.tsx
 M 50-Mothership/command-center/src/state/useCommandCenter.ts
?? 50-Mothership/command-center/src/components/ProjectFocus.tsx
?? 50-Mothership/command-center/src/test/project-surface.test.tsx
?? 40-Runtime/POA-MOTHERSHIP-PROJECT-SURFACE-001-IMPLEMENTATION-REPORT.md
```

Pre-existing, unrelated, untouched: ` M CLAUDE.md`, untracked 40-Runtime reports, root-level screenshots, `.playwright-mcp/`.

## 9. Paths to Stage for This Mission (8)

```
50-Mothership/command-center/src/App.tsx
50-Mothership/command-center/src/api/client.ts
50-Mothership/command-center/src/api/types.ts
50-Mothership/command-center/src/components/CommandOverlay.tsx
50-Mothership/command-center/src/state/useCommandCenter.ts
50-Mothership/command-center/src/components/ProjectFocus.tsx
50-Mothership/command-center/src/test/project-surface.test.tsx
40-Runtime/POA-MOTHERSHIP-PROJECT-SURFACE-001-IMPLEMENTATION-REPORT.md
```

**Stopped before staging/commit. Awaiting Commander review.**
