# POA-ORG-KNOW-EXEC-INTERACTION-001 — Authorization Artifact (Commander-Approved; Effective upon the POA-ADR-001 ratification record)

**Title:** Executive Panel — Interaction Foundation: deterministic text interaction over the existing runtime snapshot with cited responses, plus a P0 speech-output shell.

**Status: APPROVED BY COMMANDER (assent recorded in §3).** This document is the authorization artifact (`POA-STD-011` §6.3). Authorization becomes effective only through the explicit Commander ratification act recorded as its own entry in `POA-ADR-001.md` (`POA-STD-011` §6.4: AUTHORITY → AUTHORIZATION ARTIFACT → EXPLICIT COMMANDER ACT → EFFECTIVE AUTHORIZATION), not by this document's own text. Implementation may commence only after both this artifact and that ratification record are committed (`POA-STD-011` §6.7) **and** the Commander has separately and explicitly instructed implementation to begin (§7).

Revision note: Revision 3 of the proposal `POA-ORG-KNOW-EXEC-INTERACTION-PROPOSED-AUTHORIZATION.md` (prepared against `b0a2936`, untracked, superseded by this artifact). The authority for the decisions recorded here is the Commander's instructions given directly in the authorizing session (2026-10-01); no external mirror copy is relied on as an authority source. Corrections applied: (i) D3 boundary wording used verbatim, speech recognition removed from every authorized list; (ii) "local" removed as a description of speech synthesis; (iii) D1–D7 recorded as decided (D4–D6 added by the Commander's follow-up); (iv) multi-turn intelligence, cross-session memory, analytics, persistent organizational-state changes and P5-UI-002+/follow-on missions added to the exclusions; (v) the assent block carries the Commander's exact assent. The companion `POA-ORG-KNOW-EXEC-INTERACTION-IMPLEMENTATION-PLAN.md` is a planning document, not an authorization artifact, and is not committed by this act; where it differs from this artifact (e.g. a recognition phase), this artifact controls.

---

## 0. Naming Disposition

Mission ID `POA-ORG-KNOW-EXEC-INTERACTION-001` follows the `POA-<FAMILY>-<NNN>` convention (`CLAUDE.md` Rule 5; `POA-STD-011` §6.1) and the `POA-ORG-KNOW-*` family. It is distinct from, and does not extend, `POA-ORG-KNOW-P5-UI-FOUND-001` (foundation, complete at `b0a2936`), which expressly excluded new Executive Panel behavior and interaction work.

## 1. Artifact Identity

Decision to be recorded under `POA-ADR-001` v1.0.0. Mission ID: `POA-ORG-KNOW-EXEC-INTERACTION-001`. Title as above. Subject: **execution of `POA-ORG-KNOW-EXEC-INTERACTION-001` only**, within `50-Mothership/command-center/`.

## 2. Context and Commander Decisions

`POA-DEC-MOTHERSHIP-002` quarantined natural-language conversation and listening as demo-layer VISION; its §7 sets the conditions for any production revival: a separate Commander-authorized mission, real data binding, evidence citations, an explicit listening consent model, and a deliberate change to the `smoke.test.tsx` contract ("never fabricates an answer, figures, or listening by default"). The foundation mission closed at `b0a2936` with a deterministic visual harness and an unchanged Executive Panel. This act authorizes a bounded first interaction capability on that foundation.

| Decision | Commander ruling (2026-10-01) |
|---|---|
| **D1** | **APPROVED** — this mission is the separate authorizing mission contemplated by `POA-DEC-MOTHERSHIP-002` §7 |
| **D2** | **APPROVED** — real data binding, evidence citations, listening consent boundary, and deliberate smoke-test contract treatment are acceptance criteria |
| **D3** | **P0 output only APPROVED; speech recognition NOT AUTHORIZED** |
| **D4** | **APPROVED** — bounded user-gesture greeting |
| **D5** | **APPROVED** — transcript belongs to the existing Executive Panel; no new surface |
| **D6** | **APPROVED** — in-memory evidence only |
| **D7** | **APPROVED** — intentional authorized visual-baseline changes may be recorded |

**D1/D2 detail.** Free-form natural-language conversation is **not** reclassified; the `src/demo/` layer is neither reused nor modified; `POA-DEC-MOTHERSHIP-002` itself is not edited by this act. The §7 conditions are adopted as acceptance criteria: (a) real runtime data binding; (b) evidence citations; (c) explicit listening consent boundary; (d) deliberate treatment/update of the existing `smoke.test.tsx` contract. Because recognition is excluded, no listening occurs in this mission: (c) is satisfied by the *absence* of any listening path, and the microphone control exposes only an honest "not enabled" state.

**D3 detail — required voice boundary (verbatim from the Commander):**

> **P0 voice output:** browser-provided speech synthesis only; no application-controlled network request, external inference, or audio upload is authorized. The implementation must expose capability and failure states honestly.

Speech synthesis is **not** described as definitively "local" unless the implementation can establish that technically. No microphone recognition and no audio capture/transmission path is implemented. Speech recognition may be proposed later only as a separately authorized P1 mission/decision.

**D4 detail.** The P0 spoken greeting may be (a) generic and non-personalized, or (b) derived from currently available runtime state where that state is already legitimately exposed. It must not invent organizational facts, imply unsupported capabilities, or invoke an LLM/external inference service, and it must occur only after an explicit user gesture.

**D5 detail.** The transcript region is part of the existing Executive Panel interaction surface. It is not authorization for a new Mothership surface; the Executive Panel is not to be expanded into a new navigation surface, and no other Mothership surface is independently introduced.

**D6 detail.** Interaction evidence is in-memory only. No persistent evidence store, database, KnowledgePlane expansion, cross-session memory, analytics pipeline, or organizational-state persistence is authorized. The evidence model may carry the citation/reference information needed to make responses auditable within the session.

**D7 detail.** If the authorized command-bar placeholder change alters the Presence-family visual baselines, those changes are intentional and are classified as authorized visual updates, not regressions.

## 3. Commander Assent

Commander assent:
"APPROVED as drafted, subject to the corrections and scope decisions stated in this review."

*(This record does not represent the drafted text as a verbatim historical statement by the Commander beyond that exact assent.)*

## 4. Implementation Boundary (per `POA-STD-011` §6.6 — four separately labeled elements)

### 4.1 Authorized Work

Only, inside `50-Mothership/command-center/`:

1. **Deterministic text interaction:** bounded-length text entry, submit, and a deterministic response. Typed real mission/principal IDs continue to use the existing lookup path unchanged; empty/whitespace submission is ignored as today.
2. **Known-intent interpretation against the existing runtime snapshot:** a pure, deterministic interpreter over already-loaded read-only state (intents: greeting, help, attention, mission risks, evidence status, navigate-by-suggestion to existing surfaces, unsupported). The interpreter is expressed behind an `Interpreter` abstraction as an extension point; the authorized implementation is deterministic and contains no network or LLM invocation.
3. **Cited responses:** every factual answer is read from live loaded state and cites its Mission/Evidence/Decision record; an honest "unsupported / not available" response is given where no real data or intent exists; no fabricated answer, figure, or thinking indicator.
4. **In-session history:** turn history held in memory for the current session only, rendered as a transcript region of the existing Executive Panel (D5) using existing tokens/primitives and no new route, subject, or depth.
5. **Genuine processing/success/error states:** reflecting real state only — no artificial delay or simulated thinking.
6. **Keyboard/accessibility behavior:** keyboard operability, focus visibility, and `aria-live` announcement of responses and states.
7. **P0 speech-output shell and fallback states:** per the D3 boundary wording — browser-provided speech synthesis only; capability detection; a user-gesture-initiated spoken greeting bounded by D4; honest unsupported/blocked/error states; a microphone control that states honestly that listening is not enabled.
8. **In-memory interaction evidence (D6):** session-scoped records including citation/reference information, usable by tests and for in-session auditability.
9. **Tests and evidence necessary to prove the above:** unit/component/voice-adapter (mocked browser APIs) tests, including a no-application-network guard on the interaction path; visual-regression additions; the deliberate replacement of the `smoke.test.tsx` DEC-MOTHERSHIP-002 contract test with the new contract (answers only from real, cited runtime state; unsupported stated honestly; no fabrication; no listening); and classified baseline updates per D7.

### 4.2 Explicit Exclusions

- speech recognition;
- microphone audio capture or transmission of any kind;
- LLM calls or LLM-shaped stubs that invoke anything;
- external inference;
- autonomous agents;
- multi-turn intelligence;
- cross-session memory or any persistence of interaction state;
- business-function routing;
- KnowledgePlane expansion or modification;
- approval or transition execution (interaction may offer navigation to existing flows; it never confirms or executes a consequential action);
- new Mothership surfaces, expansion of the Executive Panel into a new navigation surface, or redesign of the Executive Panel or any existing surface;
- Phase 6 or Phase 7 work;
- resurrection or reuse of the old demo interaction layer (`src/demo/` is neither used as a content source nor modified);
- persistent organizational-state changes, persistent evidence stores or databases, external side effects, or unauthorized integrations;
- analytics of any kind;
- any modification to `POA-DEC-ORG-KNOWLEDGE-001` §24, to `POA-DEC-MOTHERSHIP-002`, or any other governance artifact by the implementation;
- new dependencies, Playwright configuration changes, pixel-threshold changes, test quarantine;
- investigation or remediation of the known environmental LCD sub-pixel rendering anomaly;
- spoken responses beyond the P0 greeting, and any P1/P2 capability;
- `P5-UI-002` or any successor or other follow-on mission — this act authorizes exactly one bounded mission and creates no standing authority for further work;
- any work outside the named mission boundary.

### 4.3 Stop Conditions

The mission MUST stop and escalate — not proceed, not work around, not reinterpret its own boundary — if it discovers that:

- a behavior requires data that is not read from real runtime/repository state, or an answer cannot cite a record;
- speech recognition, microphone capture/transmission, an application-controlled network request, external inference, an LLM, or an agent is needed;
- a new surface, a redesign, a new dependency, or persistence is needed;
- any existing test other than the deliberately replaced DEC-MOTHERSHIP-002 contract test must change;
- an existing baseline changes for a reason other than the D7-classified placeholder change (and the authorized new transcript/voice-state baselines);
- the existing ID-lookup path or any existing Executive Panel behavior regresses;
- `POA-DEC-ORG-KNOWLEDGE-001` §24 or any governance artifact must change, or another governance or architectural decision is required;
- cost or size exceeds the declared envelope by more than 50 % (§6);
- any requested work falls outside the authorized boundary (§4.1) as written.

### 4.4 Decision Boundaries

- The mission may itself decide: module/file layout, exact intent phrasing tables, component structure, test-fixture selection, and how to compose the new hook beside `useCommandCenter` — provided no item in §4.2/§4.3 is triggered.
- The mission may NOT itself decide: whether any ambiguity should be resolved by expanding scope, whether speech synthesis may be described as local, whether recognition or any audio path may be added, whether a change in an existing baseline is "authorized", or whether §4.3 applies in a borderline case — each escalates to the Commander, per `CLAUDE.md` Rule 8.

## 5. Evidence / Reporting Obligations (per `POA-STD-011` §6.9)

- A completion/execution record is **mandatory** (e.g. `40-Runtime/POA-ORG-KNOW-EXEC-INTERACTION-001-EXECUTION-RECORD.md`), updated at each checkpoint, citing this authorization, its `POA-ADR-001` ratification record, and the ratification commit SHA.
- Reproducible typecheck, build, existing-test, backend-test and canonical visual-suite output is mandatory; 60 consecutive runs per affected or added visual surface with zero tolerance preserved.
- Evidence for each acceptance criterion: real-data binding, citation per factual answer, no-network interaction path, absence of any listening/capture path, speech-output capability and failure states, keyboard/`aria-live` behavior, and a baseline inventory with each changed baseline classified (D7-authorized vs. other).
- The known environmental LCD sub-pixel event is reported as known and not investigated.
- This clause does not redesign POA's broader evidence-integrity architecture (`POA-STD-011` §6.9 scope note).

## 6. Execution-Resource Statement

No ratified MODEL-GATE mechanism binds this repository; none is created or implied. The execution record MUST identify the actual model/resource/profile used and any material mismatch.

**Commander execution-resource preference — an execution preference, NOT a MODEL-GATE rule:** Claude Sonnet 5.5 for routine governance and implementation work; Claude Opus 5.5 only when genuinely necessary for difficult architectural reasoning or escalation. Given the critical session-cost condition: avoid unnecessary long-context re-reading; use compact continuation/clear commands when prior task context is no longer required.

**Intended execution strategy (a preference):** first freeze the core interaction contract; then use parallel agents only on genuinely disjoint files, at most two concurrent implementers, and not even that where it creates unnecessary cache/session cost. Shared integration files — `App.tsx`, `CommandBar.tsx`, `CommandCenter.tsx`, `shared.tsx` — remain under one integrator. Potential decomposition: A — `src/interaction/` deterministic interpreter and tests; B — transcript/presentation component and accessibility tests; C — P0 speech-output adapter and voice-state tests. Estimated size: about 6–9 new and 3–5 modified files (+900–1,300 lines including tests); a >50 % overrun is a stop condition (§4.3).

## 7. Commit / Push Boundary

- Bounded commits only: one per validated checkpoint; each contains only that checkpoint's authorized files; no unrelated files staged.
- No history rewriting; no amend/rebase of prior commits; `CLAUDE.md` is never touched.
- No push. Any later push requires separate authorization.
- Implementation commits must cite this mission ID and the ratification record (`POA-STD-011` §6.8).
- **Commencement gate:** implementation does not begin on the strength of this artifact's commit alone. It begins only when the Commander explicitly instructs it to proceed after reviewing the authorization commit.

## 8. Scope Preservation Statement

This act grants execution authority for the bounded mission only.

- It is not Phase 6/7 authority, not Mothership-surface authority, not architectural ratification, and not authority for LLM, agent, recognition, or any P1/P2 capability.
- No text of `POA-DEC-ORG-KNOWLEDGE-001` §24 or `POA-DEC-MOTHERSHIP-002` is altered, reinterpreted, or exempted by this act; the §7 conditions are satisfied *by this mission's acceptance criteria*, not waived.
- **The existing design system remains authoritative.** No competing typography, color, spacing or component language is introduced; the mission reuses the tokens and primitives established through `b0a2936`. A new visual value that does not already exist as a token is a stop condition.
- LLM integration and autonomous-agent integration are NOT authorized. The `Interpreter` abstraction is a local type only; it contains no network code and invokes nothing external.
- Any successor mission (speech recognition, spoken responses, memory, LLM/agent interpretation, `P5-UI-002`+) requires its own Commander authorization act.

## 9. Capability Classification (as authorized)

| Class | Capabilities |
|---|---|
| **P0 — authorized** | text entry/submit; deterministic responses; known-intent interpretation over the existing snapshot; cited responses and honest unsupported response; in-session history; real processing/success/error states; keyboard/accessibility; P0 speech-output shell (capability detection, user-gesture greeting, unsupported/blocked/error states, honest "listening not enabled" microphone state); in-memory evidence; tests |
| **P1 — NOT authorized** | speech recognition (separately authorized mission/decision required); spoken responses beyond the greeting; evidence view in the UI; voice-state visual polish beyond what P0 tests require |
| **P2 — NOT authorized** | cross-session memory; multi-turn intelligence; on-device recognition; richer intents; analytics; LLM/agent interpreters |

## 10. Authorization-Form Review (against `POA-STD-011` §6 and the `P5-UI-FOUND-001` pattern)

| # | Requirement | Where satisfied | Result |
|---|---|---|---|
| 1 | §6.1 distinct mission ID, `POA-<FAMILY>-<NNN>` | header, §0, §1 | PASS |
| 2 | §6.2 authority is the Commander; no self-authorization | §3 (assent), §2 (rulings) | PASS |
| 3 | §6.3 artifact carries identity and boundary statement | §1, §4 | PASS |
| 4 | §6.4 effectiveness only via explicit Commander act recorded in `POA-ADR-001` | header, §13; ADR record | PASS |
| 5 | §6.5/§6.7 implementation only after artifact and ratification are committed | header, §7 | PASS |
| 6 | §6.6 authorized work stated separately | §4.1 | PASS |
| 7 | §6.6 explicit exclusions stated separately | §4.2 | PASS |
| 8 | §6.6 stop conditions stated separately | §4.3 | PASS |
| 9 | §6.6 decision boundaries stated separately | §4.4 | PASS |
| 10 | §6.8 commit traceability by mission ID | §7 | PASS |
| 11 | §6.9 evidence obligations with link to authorization and ratification SHA | §5 | PASS |
| 12 | §6.10–§6.12 no emergency loophole; no fabricated provenance; closure discipline; assent recorded without drafted text attributed verbatim; scope preservation, no §24/DEC-002 change; model preference not a MODEL-GATE | §3, §6, §8 | PASS |

Result: **12/12 PASS**, consistent with the `P5-UI-FOUND-001` pattern (identity, context, assent, four-part boundary, evidence, resource statement, commit/push boundary, scope preservation, artifact/state/related/commit sections).

## 11. Artifact / Version State

`POA-ADR-001` (ratification record); `40-Runtime/POA-ORG-KNOW-EXEC-INTERACTION-PROPOSED-AUTHORIZATION.md` (superseded draft, untracked); `40-Runtime/POA-ORG-KNOW-EXEC-INTERACTION-IMPLEMENTATION-PLAN.md` (planning document, untracked, non-authoritative). No implementation file modified by this act; `50-Mothership/` and `50-Mothership/command-center/` unmodified; `POA-DEC-ORG-KNOWLEDGE-001-DECISION.md` §24 and `POA-DEC-MOTHERSHIP-002` unchanged.

## 12. Related Mission / Evidence

`POA-ORG-KNOW-P5-UI-FOUND-001` (foundation, `b0a2936`); `POA-ORG-KNOW-P5-UI-FOUND-001-FOUNDATION-REMEDIATION-REPORT.md`; `POA-DEC-MOTHERSHIP-002` §7; `POA-STD-011` §6; `POA-ORG-KNOW-P5-UI-FOUND-001-AUTHORIZATION.md` (pattern).

## 13. Resulting Commit / Repository State

This artifact and the ratification record in `POA-ADR-001.md` are committed together in one bounded governance commit. The commit SHA may be added additively by a later bookkeeping commit, per the `POA-ADR-001.md` "where applicable, once known" rule.

---

*End of `POA-ORG-KNOW-EXEC-INTERACTION-001` authorization artifact, Revision 3 as Commander-approved. Effective authorization is the ratification record appended to `POA-ADR-001.md`. Implementation requires a further explicit Commander instruction.*
