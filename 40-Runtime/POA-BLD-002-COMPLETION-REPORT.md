# POA-BLD-002
================================

**Mission:** Mothership Operational Console
**Predecessor:** POA-BLD-001 (commit `db29a7a7caf43f97476e5e47217f67cf19a551fb`)

Starting HEAD: `db29a7a7caf43f97476e5e47217f67cf19a551fb` (VERIFIED — matches the mission brief's stated predecessor commit)
Ending HEAD: `c7381e4` (VERIFIED)
Commit SHA: `c7381e4` (VERIFIED)

Mission status: **COMPLETE** — a functional first-generation Control Panel exists, runs against the real `50-Mothership` runtime, and was exercised live in a real browser (VERIFIED).

---

## Control Panel

**VERIFIED.** Four views, all data-driven from the live runtime, no hardcoded demonstration data:

- **Home** (`#/`) — organization context, runtime status, live mission-state counts, aggregate chain/witness verification counts, and a documented (not runtime-derived) "Known Conditional Conditions" list.
- **Mission Console** (`#/missions`) — lists real missions for the selected organization with state and origin (`TEST FIXTURE` vs `OPERATOR-CREATED`) badges; includes a live "Create Mission" form.
- **Mission Detail** (`#/missions/:id`) — state, evidence count, head hash, chain/witness/overall-trust badges, lifecycle-transition and authorize-and-execute forms, a checkpoint button, and the full evidence "Why?" chain inline (satisfies the Evidence View requirement without a redundant separate route, since evidence is inherently mission-scoped).
- **Capability / Authorization** (`#/capabilities`) — identity→capability table per organization, plus an authorization-decision history table derived entirely from real `AUTHORIZATION_DECISION` evidence (answers "why allowed/denied" with real provenance, never a fabricated explanation).
- **Isolation Check** (`#/isolation`) — an interactive UI-level Organization-A/Organization-B cross-access demonstration (POA-BLD-001 S15, Test I), live-verified to correctly deny.

Technology: plain `node:http` server + vanilla HTML/CSS/JS frontend, no framework, no bundler, no build step — the existing repository had zero frontend/HTTP infrastructure, so this is the smallest option consistent with it (S15). One new devDependency, `tsx`, was added solely to execute the TypeScript server directly during development (`npm run console`); it was verified to resolve the existing `@/*` tsconfig path alias identically to how `vitest` already does, so server code uses the same `@/...` import style as `src/` and `test/`.

## Runtime integration

**VERIFIED.** The server holds one long-lived `MothershipRuntime` instance (`server/state.ts`), seeded at startup (`server/seed.ts`) through the runtime's real public API only — no synthetic JSON, no bypassing of identity/capability/evidence machinery. Every Control Panel screen fetches from an HTTP API (`server/api.ts`, routed by `server/http.ts`) that itself only calls `MothershipRuntime`/`IdentityRegistry` methods. A live end-to-end operator session was run in an actual browser (Playwright): a mission was created, transitioned Created→Running, authorized-and-executed, transitioned to Succeeded, checkpointed, verified, and transitioned to Closed — entirely through UI interactions, and the resulting real signed evidence chain was confirmed via the API.

## Organization context

**VERIFIED.** Two organizations are registered (`org-paravyoma`, `org-beta`) to keep the console honest about supporting more than one; an organization picker in the header drives every view; nothing assumes a single hardcoded organization.

## Mission console

**VERIFIED** — see Control Panel section above.

## Evidence console

**VERIFIED.** Full evidence envelopes (sequence, who/what/why/result/when, envelopeHash, prevHash, signature) are shown per mission, distinguishing `AUTHORITY-BEARING` (signed) from `LIFECYCLE-ONLY` (unsigned) entries — matching `src/evidence.ts`'s actual behavior rather than presenting all evidence as uniformly signed.

## Capability / authorization

**VERIFIED.** Identity→capability relationships and a real authorization-decision history (including a genuine `CAPABILITY_NOT_GRANTED` denial, seeded deliberately per S5E) are both derived from live runtime state, confirmed by both an automated test and a live browser screenshot.

## Integrity visibility

**VERIFIED.** Each mission shows `Evidence chain: PASS/FAIL`, `Independent witness: PASS/FAIL`, and `Overall evidence trust: CONDITIONAL/FAIL` — CONDITIONAL (never PASS) whenever the underlying checks pass, because the witness is a test double, not a production trust anchor. This distinction is pulled live from `runtime.verifyMission()`, not hardcoded.

## Independent Witness

**VERIFIED — still TEST DOUBLE ONLY, honestly represented.** The Home page, every Mission Detail page, and the server's `/api/health` endpoint all explicitly label it as such. No UI surface implies production-independent trust.

## Execution-engine neutrality

**VERIFIED (minimum abstraction only, as instructed).** `ExecutionPrincipal` gained an `engine: string` field (defaulted to `"unspecified"` so no existing call site changes), populated in the seed data with `"claude"`, and surfaced in the Capability/Authorization view and every principal dropdown. No adapters for any specific engine were built, per S17's explicit instruction not to.

## Functional tests

**VERIFIED.** 18 new tests in `test/server.test.ts`, spinning up a real `node:http` server on an ephemeral port and driving it with the platform `fetch` (not just calling handler functions in-process): home-page serving, static asset serving, organization/mission/evidence/capability listing against real seeded state, and a full operator-driven create→transition→authorize→checkpoint→verify→close lifecycle through the HTTP API.

## Regression tests

**VERIFIED.** All 20 original POA-BLD-001 tests (`lifecycle`, `adversarial`, `organization-isolation`, `witness`) still pass unmodified. `npm run typecheck` is clean. 38/38 tests pass total.

## Adversarial tests

**VERIFIED.** No existing adversarial coverage was reduced or replaced. One new adversarial-style test was added at the HTTP layer: after using the existing `__unsafeGetMutableChainForAdversarialTesting` hook to tamper a mission's evidence (same technique as `adversarial.test.ts`), the `/api/missions/:id/verify` endpoint correctly reports `chainVerified: false` with code `PAYLOAD_HASH_MISMATCH` — proving the Control Panel surfaces tampering, not just the underlying library function.

---

## Observations discovered

1. **Runtime limitation (security-relevant): `checkpointMission` and `verifyMission` have no organization guard.** Unlike every other `MothershipRuntime` entry point (`getEvidence`, `transitionMission`, `authorizeAndExecute`, `produceMissionResult`), these two methods take only a `missionId`, with no requesting-organization parameter — harmless while their only callers were same-organization test code, but a real gap the moment an HTTP surface exists: Organization B could otherwise read Organization A's integrity state or mutate Organization A's witness checkpoint. **Closed at the API layer** (`server/api.ts`'s `assertMissionOwnedBy`, which reuses the already-guarded `getEvidence` as the ownership check) rather than by changing the runtime's signatures, since that would have broken `witness.test.ts`'s and `lifecycle.test.ts`'s existing call sites (forbidden by S19/S26). Classification: **implementation-level gap, fixed at implementation level** — no architecture mission needed (S22), but a real BLD-001 finding worth carrying into any future direct callers of these two methods.
2. **Difficult workflow: checkpoint-before-final-transition ordering trap.** `checkpointMission` snapshots the current evidence head; any subsequent mission-lifecycle transition appends its own `MISSION_TRANSITION` evidence entry, moving the head *past* the checkpoint. The first draft of this mission's own seed data checkpointed before the final `Closed` transition and consequently showed a spurious `witnessVerified: false` for an otherwise-healthy mission — caught by the test suite, not inspection. This is real, reproducible operator-facing behavior (not a bug: the checkpoint genuinely is stale at that point), but it is easy to trigger by accident and the runtime gives no warning. Classification: **UI/workflow problem** — a future increment could either warn "this mission has transitioned since its last checkpoint" or auto-checkpoint the terminal state; no architectural change implied.
3. **Naming collision, not a conflict:** `30-Products/poa-vis-001/src/app/expression/mothership/page.tsx` (POA-VIS-004) also uses the word "Mothership" as a UI expression-theme name over an unrelated mock `getOrganizationalState()` data source. It shares no code, data, or directory with `50-Mothership/`. Flagged per this repository's CLAUDE.md rule 8 ("identify conflicts rather than silently resolving them"); on inspection this is coincidental terminology reuse across two independent missions, not an architectural contradiction, and required no action.
4. **Missing capability catalog:** `IdentityRegistry` has no concept of "all capabilities that exist" — only "capabilities granted to a given principal." The Capability/Authorization view therefore shows granted capabilities per principal and a real decision history, but cannot show an "available but ungranted capabilities" catalog, because the runtime has no such catalog to read (correctly showing nothing rather than inventing one, per S4). Classification: **runtime limitation, correctly left unaddressed** — inventing a catalog would have violated S4's "do not invent" instruction.

## Implementation limitations

- In-memory only: the Control Panel's data (including any operator-created missions) does not survive a server restart, consistent with S16's instruction not to prematurely build persistence.
- No authentication/session layer: "current operator identity" is a plain dropdown selection from real registered principals, not an authenticated session — appropriate for this increment's scope (S18's human-approval boundary was not exercised because no in-scope action crosses it).
- `HEAD` requests to static assets return 405 (only `GET` is implemented for static files); irrelevant to normal browser use, noted for completeness.
- Playwright's native `browser_click` action hung against this environment's rendering (root cause not diagnosed — outside this mission's scope); `browser_evaluate`-dispatched clicks and `browser_type`/`fill` worked reliably and were used for all live verification instead. This is a tooling/environment observation, not a Control Panel defect.

## Architecture contradictions

**None found.** No genuine architectural contradiction, missing invariant, or unavoidable new trust boundary was discovered. Per S22 (Architecture Stopping Rule), no architecture mission was opened.

## Remaining conditions

Carried forward from POA-BLD-001 (unchanged by this mission):
- Production-grade Independent Witness (non-test-double) remains unimplemented, pending Commander designation of a holder.
- POA-SVC-001 §17's Commander/Steward separation enforcement remains unconfirmed.
- Mechanism 2's external-verification method (POA-DEC-ORG-003) remains unselected.

New from this mission:
- The `checkpointMission`/`verifyMission` organization-guard gap (Observation 1) is closed at the API layer for this Control Panel, but any *other* future direct caller of `MothershipRuntime.checkpointMission`/`verifyMission` (outside this HTTP layer) would need the same guard re-applied at its own call site — it is not fixed inside `runtime.ts` itself.

## Recommended next increment

Per S21/S22: continue building rather than escalating. Natural next steps, in priority order, are operator-experience polish (surface Observation 2's stale-checkpoint condition proactively in the UI) and closing the `checkpointMission`/`verifyMission` guard gap directly in `runtime.ts` itself (adding the organization parameter, updating the two existing test call sites) so the protection is structural rather than API-layer-only — a small, low-risk implementation task, not an architecture mission.
