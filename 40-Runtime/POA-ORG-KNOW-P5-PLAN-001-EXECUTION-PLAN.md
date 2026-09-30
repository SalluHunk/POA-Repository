POA-ORG-KNOW-P5-PLAN-001 — Phase 5 Business-Function Digitalization — Entry-Gate Review & Execution Plan

Mode: Planning and architecture reconstruction only. No implementation. No Mothership/KnowledgePlane/Organization-A-artifact/POA-STD-011/POA-ADR-001 modification. No routing, API, UI, agent, or automation created. Nothing pushed. This document does not authorize Phase 5.

---

## 1. Mission Identity

| Field | Value |
|---|---|
| Mission | `POA-ORG-KNOW-P5-PLAN-001` — Phase 5 Entry-Gate Review + Digitalization Execution Plan |
| Authorization basis | Commander-authorized mission brief, `POA-ORG-KNOW-P5-PLAN-001` (supplied directly in this session's execution instructions) |
| Execution resource | `claude-sonnet-5` (Sonnet 5), as declared by the harness. Effort/intensity: **UNKNOWN** — not surfaced by the harness, recorded as UNKNOWN rather than inferred, per the same discipline `POA-DEC-EXEC-001` D3 states (itself INDETERMINATE authority — §14 below) |
| Starting HEAD | `b65d3653aaab497aa57622666d547eb16d24f179` |
| Repository state at start | Clean except: `CLAUDE.md` pre-existing uncommitted modification (untouched by this mission); ~140 pre-existing untracked files (screenshots, `.playwright-mcp/`, numerous `40-Runtime/*.md` reports) — none touched by this mission |
| Deliverable | This document + `40-Runtime/POA-ORG-KNOW-P5-PLAN-001-EXECUTION-RECORD.md` |
| Implementation performed | **None.** No code, schema, UI, route, agent, or connector was written. `50-Mothership/`, `50-Mothership/command-center/`, `60-Organization-A/`, `20-Shared/`, `10-Constitution/` are all read-only in this mission |

---

## 2. Authorization Basis

This mission is authorized directly by the Commander-issued brief `POA-ORG-KNOW-P5-PLAN-001`, which is explicit that it is a **combined Entry-Gate Review + Execution Plan**, not an implementation authorization, and explicitly forbids treating a PASS gate result as authorization (brief, "STRICT NON-AUTHORIZATION RULE"). It sits downstream of:

- `POA-DEC-ORG-KNOWLEDGE-001` v1.1.0 (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-DECISION.md`) — the architectural source, **partially ratified** by the Commander Ratification Decision Record appended to `20-Shared/DECISIONS/POA-ADR-001.md` (2026-09-25, commit `9729df9d890a165005015f52828f90584ebbf72c`) — see §4.
- `POA-ORG-KNOW-P2-002` (`40-Runtime/POA-ORG-KNOW-P2-002-EXECUTION-RECORD.md`, commit `b65d365`) — materialized Organization A's Source Declaration and Business Function Map.
- `POA-Q5-001` — resolved Q5 (`EXISTING AUTHORITY PROHIBITS` delegation of approval authority to AI/agent/Service identities, CONST-001 Article VIII).
- `POA-ORG-KNOW-BOUNDARY-001-REPORT.md` — the report whose §10 three-item Phase 5 blocker list (Source Declaration content, Business Function Map content, Q5) was closed by `POA-ORG-KNOW-P2-002`.

This document does not modify, ratify, or reinterpret any of the above. It reconstructs Phase 5 from them and states what remains for the Commander to decide.

---

## 3. Current Repository HEAD

`b65d3653aaab497aa57622666d547eb16d24f179` (unchanged throughout this mission until the single bounded commit described in §17).

---

## 4. Phase 5 Entry-Gate Analysis (Mission 1)

### 4.1 Critical finding: the brief's "Phase 5" and the architecture's Phase 5 are different scopes

**This is the single most important finding of this review, and it is disclosed, not resolved, per `CLAUDE.md` Operating Rule 8.**

The mission brief that authorized this review describes Phase 5 as a broad transition — "explicitly modeled, observable, knowledge-aware, governed, digitally navigable" business functions, with a digitalization model, source-authority model, KnowledgePlane and Mothership integration, and a runtime UX surface (brief Missions 3–9).

`POA-DEC-ORG-KNOWLEDGE-001` §24's own Implementation Sequencing table defines **Phase 5** narrowly:

> **Phase 5 — Scope:** "Business-Function routing dry-run for **one** function (e.g. invoicing): routing and authorization checks with no *commit*." **Entry gate:** "Phase 2 map + Q5 posture confirmed." **Exit evidence:** "Correct refuse/escalate on missing declarations." **Builds infrastructure:** "Minimal."

The broader capabilities the brief describes — one executive question (§24 Phase 6), Mothership surfaces including Data Sources/Connectors (§24 Phase 7) — are **later, separately-gated phases** in the ratified architecture, not Phase 5. Building UI, a KnowledgePlane consumption path beyond the dry-run's read of the Business Function Map, or an executive-question surface under the name "Phase 5" would be **reinterpreting Phase 5 and inventing capability sequencing the architecture does not grant** (`CLAUDE.md` Rule 4).

**Resolution adopted in this plan:** this document treats **"Phase 5" as `POA-DEC-ORG-KNOWLEDGE-001` §24's Phase 5** (the routing dry-run) for entry-gate purposes, and reconstructs the brief's broader "digitalization" ambition as a **separate forward track spanning §24 Phases 5 through 7**, decomposed into bounded missions in §12, each carrying its own gate. This keeps the entry-gate verdict honest without silently either (a) shrinking the Commander's evident intent to one function's dry-run, or (b) inflating "Phase 5" to cover UI and executive intelligence it was never gated for.

### 4.2 Question 1 — Does the Source Declaration satisfy the Phase 5 prerequisite?

**YES.** `60-Organization-A/Paravyoma-Source-Declaration.md` was materialized (not merely scaffolded) under `POA-ORG-KNOW-P2-002`, commit `b65d365`. It is not a blank template: seven source domains are populated with Commander-declared owner/cadence/sensitivity data, tagged `[C-D]`/`[R-E]`/`[D-S]`/`[UNK]` per field. This satisfies `POA-DEC-ORG-KNOWLEDGE-001` §24 Phase 2's own exit evidence ("A declaration that converts UNKNOWNs into owned gaps").

### 4.3 Question 2 — Does the Business Function Map satisfy the Phase 5 prerequisite?

**YES, with a scope note.** `60-Organization-A/Business-Function-Map.md` maps the twelve Commander-named business functions to owners (mostly `[C-D]`). §24 Phase 2 calls for "a Business Function Map **draft**" — the materialized document's own Artifact Type field still says "Draft," consistent with the gate. **Scope note:** the map records **owners**, not the §13.3 "**authority requirement**" (which role/decision is needed before execution) that the delegation chain (§14.1 link 7) needs for a *complete* dry-run of an approval-gated function like invoicing. Channel Partner Management has **no single declared owner** (`[UNK]`) — this is not a defect; it is exactly the kind of gap the dry-run's exit evidence ("correct refuse/escalate on missing declarations") is designed to exercise, and should be used as a first test fixture (§13).

### 4.4 Question 3 — Is Q5 resolved?

**YES.** `POA-Q5-001` resolved Q5 (`EXISTING AUTHORITY PROHIBITS`, CONST-001 Article VIII: an organization may not delegate approval authority to an AI/agent/Service identity). `POA-ORG-KNOW-P2-002` §10 confirms this was not reopened and nothing in the materialized content contradicts it. This directly constrains the dry-run design (§13): the dry-run may check whether approval *would* be required and whether the checking principal holds a grant to *initiate*, but it may never simulate or record an approval on any non-human identity's authority.

### 4.5 Question 4 — Are there additional Phase 5 prerequisites?

**YES — two, beyond the three-item list `POA-ORG-KNOW-BOUNDARY-001-REPORT.md` originally named:**

1. **The CTD-001 Evidence-Gated condition**, which `POA-DEC-ORG-KNOWLEDGE-001` §24's preamble states applies to *every* phase without exception: *"Each needs its own authorization and must clear `CTD-001`'s Evidence-Gated condition (demonstrated need, existing mechanisms shown insufficient, separate authority decision)."* This is **separate from and in addition to** the phase's own "Entry gate" column. No repository record found in this mission demonstrates a specific operational need for a Business-Function routing dry-run (e.g., a recurring manual-routing failure, an actual invoicing request that needed one). Absent that evidence, this condition is **not yet met** (§4.8).
2. **Commander acceptance of the Phase 2 artifacts.** Both `60-Organization-A/Paravyoma-Source-Declaration.md` and `60-Organization-A/Business-Function-Map.md` name "Acceptance Authority: Commander, acting in the Organization-A-executive capacity (per Operational Questions Decision, OQ-5)" in their own Artifact Identity tables. No repository record found in this mission (grep of `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-PHASE-2-AUTHORIZATION-DECISION.md` and related Phase 2 records) shows that acceptance act has occurred. `POA-ORG-KNOW-P2-002` §12 itself leaves this explicitly open: "Whether that gate being satisfied is itself sufficient for the Commander to authorize Phase 5, or whether the Commander wishes additional review of the materialized content's completeness/accuracy first, is the Commander's own decision — not concluded here." This mission does not conclude it either.

### 4.6 Question 5 — Are those prerequisites satisfied?

Per §4.2–§4.5: the three originally-identified items (Source Declaration, Business Function Map, Q5) — **satisfied**. The two additional items found in this review — CTD-001 demonstrated need, and Commander acceptance of the Phase 2 artifacts — **not satisfied / not evidenced**.

### 4.7 Question 6 — Is the authorization chain intact?

**Yes, with one nuance worth recording.** `POA-DEC-ORG-KNOWLEDGE-001` v1.1.0 was ratified — **partially** — by the Commander Ratification Decision Record appended to `20-Shared/DECISIONS/POA-ADR-001.md` (2026-09-25, committed as `9729df9d890a165005015f52828f90584ebbf72c`; **this commit is not yet on the branch this mission's HEAD `b65d365` inherits from in this working copy's own log**, i.e. it is a separate line of history reached via `POA-ADR-001.md`'s own file content, not verified by this mission to be an ancestor of `b65d365` — recorded as an open verification item, not asserted). That record's **Act 2 — Architectural Ratification**:

- Ratified outright (10 KDs): KD-03, KD-04, KD-07, KD-09, KD-12, KD-13, KD-15, **KD-17**, KD-21, KD-22.
- Ratified with qualification (11 KDs, including at least KD-10 — "the organizational knowledge plane is adopted as a cross-cutting, organization-scoped plane within the existing architecture, not a new POA layer; tier labels are proposed").
- The full list of the qualified 11 and the remaining unratified KD(s) (10 + 11 = 21 of 22) was **not fully re-read in this mission** — recorded as **TBD — requires architectural decision / verification** rather than guessed. In particular, **KD-16** (POA never approves on its own authority) and **KD-18** (the delegation chain, with routing as an Authorization sub-step) are the two decisions the routing dry-run depends on most directly beyond KD-17, and their exact ratification status (outright vs. qualified vs. not yet reached) should be confirmed before Phase 5 implementation begins.

**Critically for this gate: KD-17 — "ownership is recorded from organizational declaration (Business Function Map), never defined or inferred by POA; missing declaration → refuse/escalate" — is RATIFIED OUTRIGHT.** This is the specific decision the dry-run's exit evidence ("correct refuse/escalate on missing declarations") tests. The authorization chain for *that* piece of Phase 5 is intact.

`POA-DEC-ORG-KNOWLEDGE-001-DECISION.md`'s own file text is unmodified by the ratification (its KD rows still read "PROPOSE" — the ratification act lives in `POA-ADR-001.md` as an additive record, per that record's own §"This section is NOT a rewrite of any text above"). This mission did not edit `POA-DEC-ORG-KNOWLEDGE-001-DECISION.md`.

### 4.8 Question 7 — Is there a governance contradiction that prevents Phase 5?

No contradiction was found that would *block* Phase 5 outright. Two tensions are disclosed, not resolved:

- **T1 — Scope divergence (§4.1).** The authorizing brief's "Phase 5" is broader than the architecture's Phase 5. Not a contradiction in the strict sense (no two records assert incompatible facts), but a naming/scope mismatch that could cause a future mission to over-build under Phase 5's name. Mitigated in this plan by treating the broader ambition as Phases 5–7 (§12).
- **T2 — Demonstrated-need evidence gap (§4.5 item 1).** `POA-DEC-ORG-KNOWLEDGE-001` §24's preamble requires demonstrated need for every phase; no such record exists for the dry-run specifically. This is a genuine gap, not a contradiction, and is the primary reason this gate does not return an unconditional PASS.

### 4.9 Question 8 — Verdict

## PHASE 5 ENTRY GATE: **PASS WITH CONDITIONS**

**Conditions (must be closed, or explicitly waived by the Commander, before Phase 5 implementation begins):**

- **C1.** Commander acceptance of the two Phase 2 artifacts (`Paravyoma-Source-Declaration.md`, `Business-Function-Map.md`) as sufficiently complete for use, per the OQ-5 "Acceptance Authority: Commander" clause each document already names. Absent this, Phase 5 would route against organizational facts the Commander has not yet confirmed as final.
- **C2.** A recorded demonstrated need for the routing dry-run specifically, per `POA-DEC-ORG-KNOWLEDGE-001` §24's Evidence-Gated preamble (not merely "the architecture exists" — an actual instance of the problem the dry-run addresses).
- **C3.** Confirmation of KD-16 and KD-18's exact ratification status (§4.7), since the dry-run's authorization-check and non-approval behavior depends on both.
- **C4.** Verification that `POA-ADR-001.md`'s ratification commit (`9729df9d…`) is reachable from / consistent with this repository's current `main` (§4.7's open verification item) — a mechanical git check, not a policy question, but one that should precede treating the ratification as binding on this branch.

**READY vs. AUTHORIZED — held apart, per the brief's own instruction:**

- **Phase 5 is READY** in the sense that its own three originally-identified blocking items (Source Declaration, Business Function Map, Q5) are closed, and its core mechanism (KD-17) is ratified.
- **Phase 5 is NOT AUTHORIZED.** No Commander act in this repository authorizes implementation of the routing dry-run or any broader digitalization work. C1–C4 above are conditions on readiness, not steps toward self-authorization — closing them still requires a separate Commander authorization act, per `CTD-001` and this brief's own Strict Non-Authorization Rule.

## IMPLEMENTATION AUTHORIZATION: **NOT GRANTED BY THIS MISSION**

**Exact Commander action required to authorize Phase 5:** a Commander decision act (following the `POA-DEC-ORG-KNOWLEDGE-001` Ratification Decision Record's own precedent format in `POA-ADR-001.md`) that (a) records acceptance of the two Phase 2 artifacts under OQ-5, (b) records the demonstrated need for the routing dry-run (or explicitly waives C2 as unnecessary for a bounded pilot), (c) confirms or completes KD-16/KD-18's ratification status, and (d) explicitly authorizes `POA-DEC-ORG-KNOWLEDGE-001` §24 Phase 5 implementation, scoped to the routing dry-run only (not Phases 6–7).

---

## 5. Phase 5 Architectural Reconstruction (Mission 2)

Reconstructed from `POA-DEC-ORG-KNOWLEDGE-001` §24 row 5, §13.3, §14, and §15 (the worked invoicing example), with no invented capability:

| Element | Content | Source |
|---|---|---|
| Objective | Prove that POA can correctly route a business-function request to its declared owner and correctly refuse/escalate when a declaration is missing — with no side effect | §24 Phase 5 |
| Scope | **One** business function (e.g. invoicing), routing + authorization *checks* only | §24 Phase 5 |
| Non-scope | Any *commit*/write to a system of record; any approval action; any UI; any executive-question synthesis; any function beyond the one piloted | §24 Phase 5 ("no commit"); §22 Non-Decisions |
| Authorized capabilities | Read the Business Function Map (§13.3); resolve intent → Business Function (as an INFERENCE requiring principal confirmation, §14.1 link 3); look up owning unit/responsible role (§14.1 links 4–5); check the requesting principal's grant to *initiate* (§14.1 link 7, partial — approval itself out of scope); refuse/escalate on any missing declaration | §13.3, §14.1 |
| Required data | The materialized Business Function Map (`60-Organization-A/Business-Function-Map.md`) and, if authority requirements are to be checked, a Commander declaration of them (not yet materialized — §7 below) | §13.3 |
| Required knowledge | None beyond the map itself; the dry-run does not need the knowledge plane's assertion history, freshness, or provenance machinery (those belong to Phases 3–4 and 6, not 5) | §24 row 5 "Minimal" infrastructure |
| Required organizational relationships | Business Function → Owning Unit → Responsible Role (declared, §5.6 relationship type *owns*) | §5.6, §13.3 |
| Required runtime behavior | Deterministic refuse/escalate when a declaration is missing (never guess an owner, §13.3); intent-to-function mapping treated as INFERENCE requiring confirmation, never silently acted on (§9.2) | §13.3, §9.2 |
| Expected outputs | A routing decision (proceed-to-authorization-check / refuse / escalate) plus the map-version reference used, for each of a small number of test intents against the twelve declared functions | §14.1 link 4 "Routing reference (map version)" |
| Evidence requirements | Per-run record of: intent, resolved function, map version consulted, decision (route/refuse/escalate), reason | §14.1, `POA-EVT-001` (existing action-evidence mechanism, reused) |
| Validation requirements | At minimum: one function with a clear declared owner (e.g. Finance/Accounting) routes correctly; Channel Partner Management (no declared owner) refuses/escalates correctly; an unconfirmed intent-to-function mapping is never acted on | §13.3 exit evidence |
| Stop conditions | Any attempt to have the dry-run *commit* a write; any attempt to have it approve on a non-human identity's authority (Q5); any attempt to expand it to a second function or a UI surface without a new gate | §24 "no commit"; Q5; §4.1 T1 |

**Ambiguity recorded, not invented:** the architecture does not specify *which* function should be piloted first. §13.3's example is invoicing (Finance/Accounting); §4.3 above recommends Channel Partner Management as a second, deliberately-missing-owner fixture. This choice is left to the authorizing Commander decision (§4.9).

---

## 6. Digitalization Model (Mission 3)

`POA-DEC-ORG-KNOWLEDGE-001` §5 already answers "how does a real organizational function become digitally represented inside POA," and this plan reuses it rather than inventing a parallel model (`CLAUDE.md` Rule 4). The model is **not** the linear chain the mission brief's example sketches (`Organization → Business Function → Responsibility → Activity → Knowledge → Source → Evidence → Decision/Action → Outcome`); the ratified architecture's actual model is two layers plus cross-cutting attributes (§5.1–§5.3):

```
ORGANIZATION (Subject + Identity)
  |
  BUSINESS FUNCTION (Subject; KD-03, ratified)  --owned-by-->  ORGANIZATIONAL UNIT (Subject; KD-04, ratified)
  |                                                                    |
  |                                                          RESPONSIBLE ROLE (attribute, not identity)
  |
  KNOWLEDGE ASSERTION (§5.3) — the single canonical representation for:
      SOURCE-OBSERVATION | VERIFIED | DERIVED | INFERENCE | ANALYSIS |
      RECOMMENDATION | DECISION | ACTION | RESULT
      each carrying: organization scope, subject, claim, basis, freshness,
      consistency, source authority, time, provenance, classification,
      sensitivity, authority ref (if DECISION/ACTION), supersession
  |
  SOURCE (Subject; declared, §7.1) --served-by--> OBSERVATION ADAPTER (Service identity)
  |
  EVIDENCE (existing `POA-EVID-001` concept, reused unchanged)
```

**Why the brief's linear "Responsibility → Activity" chain is not adopted as a separate entity ladder:** §5.1 explicitly rejects "a flat table-per-noun design"; "Responsibility" and "Activity" are not named subject kinds anywhere in the ratified model. Responsibility is carried as the Business-Function-Map-declared Role (attribute of the ownership relationship, §13.3); Activity is not a first-class concept in the ratified architecture at all — the nearest concept is a Mission (§5.2, ESTABLISHED, reused unchanged from `POA-KER-001`). Inventing a distinct "Activity" subject here would duplicate Mission without authorization. **This divergence from the brief's illustrative chain is recorded, per Mission 3's own instruction ("Do NOT assume these exact entities exist"), not treated as an error in the brief.**

**Decision (DECISION, not INFERENCE) still separate from Action:** the model preserves the brief's Decision/Action/Outcome distinction exactly, as truth-kinds within one Knowledge Assertion representation (§9, §6.2), not as separate entity tables.

---

## 7. Organization A Function Mapping (Mission 4)

Reused verbatim from `60-Organization-A/Business-Function-Map.md` (MATERIALIZED, commit `b65d365`) — **not re-derived or re-invented here**, per `CLAUDE.md` Rule 4/7 and the brief's own instruction not to reopen materialized content:

| Function (as declared) | Primary owner | Authority requirement (KD-17/§13.3) | Digitalization readiness |
|---|---|---|---|
| Leadership and Strategy | Siddharth Gaur, Ritesh Pandita (joint) | **Not declared** | Owner known; refuse/escalate on any approval check until declared |
| Business Development / Sales | Ritesh Pandita | **Not declared** | Owner known; CRM platform `[UNK]` — no adapter possible yet (Phase 3+) |
| Operations | Ritesh Pandita | **Not declared** | Owner known |
| Engineering / Technical Delivery | Siddharth Gaur | **Not declared** | Owner known; cadence/sensitivity `[UNK]` |
| Project Delivery | Siddharth Gaur (tech) + Ritesh Pandita (BD/sales) — `[D-S]` grouping, not a new fact | **Not declared** | Composite ownership; routing must resolve to the correct sub-owner per request type |
| Finance / Accounting | Bharti Bhat (Accounts Manager) + Anupam Mishra (external CPA) | **Not declared**, but cadence (monthly) and sensitivity (confidential) are | **Best first pilot candidate** — owner, cadence, sensitivity all declared; accounting platform `[UNK]` (no data touched in Phase 5 regardless) |
| Source Code / Technical Asset Administration | Siddharth Gaur | **Not declared** | Owner known |
| Resource Acquisition / Staffing | Founders/operating team (direct) | **Not declared**; no HR department (explicitly, by design) | Owner known at the "team" level, not an individual role |
| Channel Partner Management | **Not individually assigned** `[UNK]` | **Not declared** | **Deliberate refuse/escalate test fixture** (§4.3, §13) — the architecture's own worked failure mode |
| Product / IP Development | Represented via POA/Temple SaaS activities, not a department | **Not declared** | Not a conventional routable "function" in the invoicing sense; likely out of Phase 5's pilot scope |
| POA development | Company-owned product activity (this repository) | **Not declared** | Same as above |
| Temple SaaS development | Company-owned product activity | **Not declared** | Same as above |

**No function beyond these twelve is added here.** No authority requirement is declared for *any* function — this is a genuine gap (not a defect in the Phase 2 materialization, which the Commander explicitly scoped to owner/cadence/sensitivity, not authority thresholds). **A Phase 5 pilot that includes an approval check (§14.1 link 7) cannot proceed on any function until at least one authority requirement is declared by the Commander.** A pilot restricted to *routing-only* (links 1–5, stopping before the approval-requirement check) can proceed against Finance/Accounting or Channel Partner Management today.

---

## 8. KnowledgePlane Integration Model (Mission 6)

**Inspected, not modified**, per the brief's explicit instruction. `50-Mothership/src/knowledge-plane.ts` (268 lines) already implements `POA-ORG-DATA-001` — "minimal Organizational Data Plane," per its own header comment, "implements the Knowledge Assertion model of `POA-DEC-ORG-KNOWLEDGE-001` §5.3, minimally." Supporting evidence: `40-Runtime/POA-ORG-DATA-001-EXECUTION-RECORD.md`, `POA-ORG-DATA-001-EXECUTION-START-REPORT.md`, `POA-ORG-DATA-REM-001-EXECUTION-RECORD.md` (remediation, per commit `d47e063` "close KnowledgePlane conformance gaps D1-D5"), `POA-ORG-DATA-VAL-001-VALIDATION-REPORT.md`; tests `50-Mothership/test/knowledge-plane.test.ts` and `knowledge-plane-fs-isolation.test.ts`.

This is **materially ahead of §24's own sequencing**: §24 places "minimum organizational knowledge plane" at **Phase 4**, gated on "evidence that Phase 3 output needs durable querying" — yet no Phase 3 Observation Adapter exists in this repository (grep confirms no adapter module). **This is a sequencing divergence, recorded per `CLAUDE.md` Rule 8, not resolved here**: either (a) the knowledge plane was built ahead of its stated gate under a separate authorization this mission did not locate, or (b) the gate's sequencing assumption (adapter before plane) does not bind exactly as read. Either way, Phase 5 does not itself need the knowledge plane (§5 above: "Minimal" infrastructure, map-lookup only) — so this divergence is **not a blocker for Phase 5**, but it should be resolved (or at least acknowledged by the Commander) before any Phase 6 work that would actually write dry-run evidence into the knowledge plane.

**What Phase 5 specifically would need from KnowledgePlane, if anything:** per §5 and §6.2's six-plane distinction, the dry-run's own routing decisions are themselves Knowledge Assertions of kind ACTION (or, if merely evaluated with no dispatch, a DECISION-adjacent record) — but §24 Phase 5 does not require them to be *persisted* in the knowledge plane; `POA-EVT-001`'s existing action-evidence mechanism (already reused for missions generally) is sufficient and lower-risk. **Recommendation for the future authorizing decision:** Phase 5 evidence should go through `POA-EVT-001`, not through `knowledge-plane.ts`, keeping the "K-8 boundary" (git decisions vs. data-plane observations) intact and avoiding blurring Tier-B declarations (the Business Function Map, which lives in git) with data-plane assertions (§9 below records this same tension for consumption).

**Organizational assertions needed vs. existing:**

| Needed | Exists? | Gap |
|---|---|---|
| Business Function ownership assertions | **No** — ownership lives in the git-tracked Business Function Map (Tier B), not as KnowledgePlane assertions | Open design question (§9) |
| Authority-requirement assertions | **No** — not declared anywhere yet (§7) | Genuine data gap, Commander-only to close |
| Routing-decision (dry-run output) assertions | **No** — Phase 5 not yet implemented | Would be produced by Phase 5 itself, if authorized |
| Provenance / temporal / isolation machinery | **Yes** — `knowledge-plane.ts` already implements assertion shape, org-scoping (tested by `organization-isolation.test.ts` and `knowledge-plane-fs-isolation.test.ts`), and append-only supersession per §5.3/§11 | Available for Phase 6+, not required by Phase 5 |

---

## 9. Critical Architectural Decision: how Phase 5 consumes Tier B declarations (recorded, not decided)

The Business Function Map and Source Declaration are **Tier B governed documents in git** (`60-Organization-A/`), materialized under Phase 2 as Markdown, not as KnowledgePlane assertions. A Phase 5 dry-run needs to read them programmatically. Two paths, neither decided here:

1. **Parse the Markdown directly** (or a structured sibling of it) at dry-run time. Keeps K-8's boundary crisp (git = decided/declared; data plane = observed) but is brittle to formatting drift and duplicates parsing logic across future consumers.
2. **Load them once into the KnowledgePlane as SELF-DECLARED assertions** (basis SELF-DECLARED, per §7.2 source class 1 "Manual entry"), giving Phase 5 a queryable, versioned view. This blurs K-8 only if it is understood correctly: the *assertions* would be Provenance-only copies referencing the git document as their source, never replacing the git document as the authoritative record — the KnowledgePlane's own doctrine (`POA-DEC-ORG-KNOWLEDGE-001` §8.1) already anticipates SELF-DECLARED, manual-entry-sourced assertions as a legitimate source class, so this need not itself be a K-8 violation if the git document remains authoritative and the assertion is clearly downstream.

**This document records the choice as open, for the Commander or a future architecture mission — not decided here.**

---

## 10. Mothership Integration Model (Mission 7)

**Inspected, not modified.** Current structure:

- `50-Mothership/src/` — runtime: `runtime.ts`, `knowledge-plane.ts`, `identity.ts` (implied by `IdentityRegistry` import), `index.ts`.
- `50-Mothership/server/` — HTTP console server (route definitions not enumerated by this mission's grep — no `app.get`/`router.get` patterns matched in a top-level scan; server internals were not opened further, per the brief's "do not begin implementation" and "keep Mothership inspection bounded" instruction).
- `50-Mothership/test/` — `adversarial.test.ts`, `identity-lifecycle.test.ts`, `knowledge-plane-fs-isolation.test.ts`, `knowledge-plane.test.ts`, `lifecycle.test.ts`, `organization-isolation.test.ts`, `repository-records.test.ts`, `server.test.ts`, `witness-log.test.ts`, `witness.test.ts`.
- `50-Mothership/command-center/` — separate React/Vite presentation package. `src/state/useCommandCenter.ts` (top-level state hook), `src/state/phases.ts`, `src/state/legalTransitions.ts`, `src/state/attention.ts`; `src/api/client.ts` and `src/api/types.ts` (talks to the `50-Mothership` server).

**Where Phase 5 belongs:** nowhere in `command-center/` yet — Phase 5 is check-only, produces no UI-visible state, and per §24 UI belongs to Phase 7, gated on its backing phase being REAL. Phase 5's natural home, if and when authorized, is a **new, isolated module in `50-Mothership/src/`** (e.g. a `routing.ts` alongside `knowledge-plane.ts` and `identity.ts`), consuming the Business Function Map per §9's still-open choice, and tested the same way `knowledge-plane-fs-isolation.test.ts` tests the plane — **not** a change to `runtime.ts`'s existing dispatch path unless a future mission demonstrates that reuse is safe.

**Surfaces that can support it today:** none — this is a backend-only capability per §24 Phase 5's own "no commit" scope; there is no UI requirement.

**Surfaces that would be required (future, Phase 7 only):** a "Data Sources / Connectors" surface (`POA-DEC-ORG-KNOWLEDGE-001` §23.3's own recommendation, "the first honest surface to build") is named as the correct **first** Mothership surface once its backing phase (declarations) is REAL — which it now is (Phase 2 materialized). This is recorded as a Phase 7 candidate, not proposed for building now.

**Components that must remain untouched by any Phase 5 implementation mission:** `command-center/src/components/environment/*` (visual background system — unrelated), the existing `runtime.ts` dispatch path (until reuse is demonstrated safe), `POA-DEC-MOTHERSHIP-002`'s quarantined demo layer (explicitly named untouchable by `POA-DEC-ORG-KNOWLEDGE-001` §23.3).

**Navigation model (Organization → Function → Knowledge → Evidence → Action):** not yet backed by any REAL surface end-to-end. Organization context is REAL (Presence experience, per §23.3's own table); Function (Business Function Map) is now REAL as a git artifact but not yet surfaced; Knowledge/Evidence/Action remain VISION per that same table, unchanged by this mission.

---

## 11. Source Authority Model (Mission 5)

Per function, using only what `60-Organization-A/Paravyoma-Source-Declaration.md` and `Business-Function-Map.md` actually declare (no invention):

| Function | Authoritative source | Owner | Cadence | Sensitivity | Evidence type | System of record | KnowledgePlane consumption? |
|---|---|---|---|---|---|---|---|
| Finance / Accounting | Accounting records | Bharti Bhat; Anupam Mishra (external CPA) | Monthly | Confidential | Manual entry / documents (platform `[UNK]`) | `[UNK]` platform | Not yet — no adapter exists (§24 Phase 3 prerequisite) |
| Business Development / Sales | CRM (platform `[UNK]`) | Ritesh Pandita | `[UNK]` | `[UNK]` | `[UNK]` | `[UNK]` | Not yet |
| Engineering / Technical Delivery | Technical project records | Siddharth Gaur | `[UNK]` | `[UNK]` | `[UNK]` | `[UNK]` | Not yet |
| Source Code / Technical Asset Administration | GitHub-hosted delivery repositories | Siddharth Gaur | `[UNK]` | `[UNK]` | Git commits (§7.2 source class 7, "the strongest anchor available") | GitHub | **Best Phase 3 adapter candidate** — matches §24 Phase 3's own example verbatim ("Paravyoma's delivery git repositories: commit metadata, not content") |
| Resource Acquisition / Staffing | Resource database (platform `[UNK]`) + channel-partner relationships | Founders/operating team | `[UNK]` | `[UNK]` | `[UNK]` | `[UNK]` | Not yet |
| Channel Partner Management | Not declared as a system; known principal example Covian Consulting | Not individually assigned | `[UNK]` | `[UNK]` | `[UNK]` | `[UNK]` | Not yet |
| Company Documents | `[UNK]` platform | `[UNK]` | `[UNK]` | `[UNK]` | Documents | `[UNK]` | Not yet |

**Every `[UNK]` cell above remains UNKNOWN**, exactly as `60-Organization-A/Paravyoma-Source-Declaration.md` records it — none is inferred or filled in here, per `CLAUDE.md` Rule 7 and the mission's own "Unknown systems remain UNKNOWN" instruction.

---

## 12. Runtime UX / Surface Model (Mission 8)

No implementation. The digitalization surface's honesty test, per the brief itself: *"Can a human understand what this organization is doing, who is responsible, what knowledge supports it, and what evidence exists?"* Mapped against `POA-DEC-ORG-KNOWLEDGE-001` §23.3's REAL/VISION table (unchanged by this mission):

- **Organization** context — REAL today (Presence experience).
- **Function** (who is responsible) — the raw fact is now REAL (Business Function Map, git), but **no surface exposes it yet**. This is the honest gap Phase 7's "Data Sources / Connectors" surface (and a sibling "Function Map" view) would close.
- **Knowledge** (what supports it) — VISION; depends on Phase 3/4 (adapters, knowledge plane) actually holding organizational assertions, which they do not yet for Organization A.
- **Evidence** — REAL for POA's own mission evidence (`POA-EVT-001`); VISION for organizational (Organization-A) evidence.
- **Action** — not yet applicable; Phase 5 itself produces no user-facing action.

No visual-spectacle or ERP-clone direction is proposed; §23.3's own design-language elements (four-axis confidence, evidence trails, decision cards, progressive disclosure, restrained motion) are reaffirmed as the standing design constraint for whenever a surface is built.

---

## 13. Implementation Decomposition (Mission 9)

Every mission below requires its own separate Commander authorization; none is authorized by this plan. Ordered by the architecture's own §24 sequence, split into the narrow Phase 5 (routing dry-run) and the broader digitalization ambition as later, explicitly separate phases.

| Mission ID (proposed) | Objective | Prerequisites | Exact files/components expected to change | Architectural boundary | Tests | Runtime evidence | Acceptance criteria | Commit checkpoint | Stop condition | Authorization dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| `POA-ORG-KNOW-P5-ACCEPT-001` | Commander acceptance of the two Phase 2 artifacts (C1) | Phase 2 materialized (done) | None (a Commander decision record only, e.g. `40-Runtime/POA-ORG-KNOW-P5-ACCEPT-001-DECISION.md`) | Governance only | N/A (Markdown) | N/A | Explicit Commander acceptance recorded under OQ-5 | One bounded commit | Do not modify the Phase 2 artifacts themselves | Commander decision act |
| `POA-ORG-KNOW-P5-NEED-001` | Record demonstrated need for the routing dry-run, or an explicit Commander waiver of C2 | None | `40-Runtime/POA-ORG-KNOW-P5-NEED-001-REPORT.md` | Governance only | N/A | N/A | A concrete instance of the routing problem, or an explicit waiver | One bounded commit | Do not proceed to implementation without this closing | Commander decision act |
| `POA-ORG-KNOW-P5-AUTH-001` | Commander authorization act for Phase 5 implementation (closes C3/C4, grants build authority, scopes to routing dry-run only) | `P5-ACCEPT-001`, `P5-NEED-001` | `20-Shared/DECISIONS/POA-ADR-001.md` (additive record, following the K-001 Ratification Decision Record's own format) | Governance only | N/A | N/A | Explicit, scoped authorization, following the same PROPOSE→RATIFY discipline as K-001 | One bounded commit | Do not authorize Phases 6–7 in the same act unless the Commander explicitly chooses to | Commander act (this is the authorization itself) |
| `POA-ORG-KNOW-P5-IMPL-001` | Build the routing dry-run for one function (Finance/Accounting recommended, §7) | `P5-AUTH-001` | New `50-Mothership/src/routing.ts` (or equivalent); new test file (e.g. `50-Mothership/test/routing.test.ts`) | Backend logic only; no UI; no write path; reads `60-Organization-A/Business-Function-Map.md` per the §9 consumption choice the authorizing act should also settle | New unit tests: correct route for a declared owner; correct refuse/escalate for Channel Partner Management (no owner); unconfirmed-intent case never proceeds | `POA-EVT-001`-based per-run evidence (§5) | §5's validation requirements met; `npm test`/`npx vitest run` passes in `50-Mothership/` | One bounded commit referencing `P5-AUTH-001` | No commit/write to any system of record; no approval simulated on a non-human identity's authority (Q5) | `P5-AUTH-001` |
| `POA-ORG-KNOW-P5-EVID-001` | Evidence checkpoint / commit checkpoint report for the dry-run | `P5-IMPL-001` | `40-Runtime/POA-ORG-KNOW-P5-EVID-001-REPORT.md` | Governance/evidence only | N/A | Restates test + runtime evidence from `P5-IMPL-001` | Exit evidence matches §5 | One bounded commit | N/A | `P5-IMPL-001` complete |
| `POA-ORG-KNOW-P6-PLAN-001` (future, not this plan's scope) | Plan (not build) one executive question over Phases 3–4 output | §24 Phase 4 REAL; Q6 answered if any external model used; Q12 scoped | Planning doc only | Governance only | N/A | N/A | Plan document | One bounded commit | Do not build | Commander |
| `POA-ORG-KNOW-P7-PLAN-001` (future, not this plan's scope) | Plan (not build) the first Mothership surface ("Data Sources / Connectors") | Its backing phase REAL (§23.3) | Planning doc only | Governance only | N/A | N/A | Plan document | One bounded commit | Do not build | Commander |

**Financial, sales and workforce sources come after the lowest-sensitivity path has proven the model** (§24's own closing instruction) — reaffirmed here, not reopened.

---

## 14. Mission Dependency Graph

```
POA-ORG-KNOW-P2-002 (done, b65d365)
        |
        v
POA-ORG-KNOW-P5-PLAN-001 (THIS MISSION)
        |
        +--> POA-ORG-KNOW-P5-ACCEPT-001  (C1)  --\
        |                                          \
        +--> POA-ORG-KNOW-P5-NEED-001    (C2)  ---+--> POA-ORG-KNOW-P5-AUTH-001 (C3+C4 verified here)
        |                                          /             |
        +--> [C3/C4 verification, folded into  --/               v
              P5-AUTH-001's own drafting]                POA-ORG-KNOW-P5-IMPL-001
                                                                  |
                                                                  v
                                                          POA-ORG-KNOW-P5-EVID-001
                                                                  |
                                                                  v
                                                  (only after this: P6-PLAN-001, P7-PLAN-001)
```

No edge in this graph is itself an authorization; every arrow into an `-AUTH-001` or `-IMPL-001` node requires a Commander act, per §4.9.

---

## 15. Model / Execution-Resource Requirements (Mission 10)

- **This mission's own execution resource:** `claude-sonnet-5`, effort UNKNOWN (harness does not surface it). Recorded, not inferred, per `POA-DEC-EXEC-001` D3's stated discipline — though that record's own authority status is **INDETERMINATE** (Q15 classification, §2.4 of `POA-DEC-ORG-KNOWLEDGE-001`), so its discipline is followed here as good practice, not as binding governance.
- **Does a MODEL-GATE mechanism exist?** **Partially, as an unratified decision brief.** `40-Runtime/POA-EXECUTION-RESOURCE-ARCHITECTURE-COMMANDER-DECISION-BRIEF.md` §4 defines "MODEL-GATE: what 'satisfies' means" as a concept, and §8 lists "Minimum Commander decisions before implementation" — meaning the brief itself states MODEL-GATE is **not yet Commander-decided**. A grep of `20-Shared/DECISIONS/POA-ADR-001.md` for a ratified MODEL-GATE ruling found none in this mission. **Conclusion: no ratified MODEL-GATE mechanism currently binds this repository.** This is stated explicitly rather than silently assuming Sonnet 5 is always correct (per the brief's own Mission 10 instruction).
- **Precedent, not a rule:** `POA-DEC-ORG-KNOWLEDGE-001` itself (architecture-defining work) was executed on Claude **Opus 5.5**. This planning mission (entry-gate review + decomposition, explicitly not architecture-defining) was executed on Sonnet 5, consistent with the unratified brief's own stated principle ("use the least expensive execution profile that is demonstrably sufficient") even though that principle is not yet binding governance.
- **Recommendation for future missions, not a rule imposed here:** architecture-defining or ratification-adjacent missions (e.g. `P5-AUTH-001`) should default to the stronger tier used for `POA-DEC-ORG-KNOWLEDGE-001` itself, absent a ratified MODEL-GATE saying otherwise; bounded implementation missions (`P5-IMPL-001`) are plausibly Sonnet-tier work, consistent with this mission's own tier, but this is a recommendation, not a gate.
- **Telemetry requirements:** `POA-EXEC-001-COMPLETION-REPORT.md` found "No POA artifact currently records, per mission: selected execution profile, actual execution profile, escalation events." This plan follows the same ad hoc recording this document itself uses (§1 table) rather than inventing new telemetry infrastructure.

---

## 16. Testing Strategy (Mission 11)

| Category | Applies to Phase 5? | Method |
|---|---|---|
| 1. Unit correctness | Yes (`P5-IMPL-001`) | `npx vitest run` new `routing.test.ts` alongside existing `50-Mothership/test/*.test.ts` |
| 2. Architectural correctness | Yes | Manual review against §5's table (this document) — does the implementation stay inside "routing + authorization checks, no commit"? |
| 3. Organizational correctness | Yes | Does the routing decision match the actual, Commander-declared Business Function Map — not an inferred or guessed mapping? Verified by re-reading `60-Organization-A/Business-Function-Map.md` against test fixtures, not by trusting the code's own comments |
| 4. Authorization correctness | Yes | Does the dry-run correctly stop before any approval action, per Q5 and KD-16? |
| 5. Provenance correctness | Yes | Does each routing decision cite the exact Business Function Map version/commit it consulted? |
| 6. Runtime behavior | Yes | Live run against the fixtures named in §5's validation requirements |
| 7. Cross-organization isolation | Yes, reused | `50-Mothership/test/organization-isolation.test.ts` pattern — a routing module must not leak Organization-A declarations to any other organization scope, even though only one organization exists today |
| 8. Regression safety | Yes | Full `50-Mothership/` test suite (`npm test`) must stay green; `command-center/` untouched, so its suite is unaffected |
| 9. Filesystem/Git isolation | Yes, reused | `knowledge-plane-fs-isolation.test.ts` pattern, if §9's KnowledgePlane-consumption path is chosen; N/A if the direct-Markdown-parse path is chosen |
| 10. Live runtime evidence | Yes | `POA-EVT-001`-based evidence record per run (§5), reviewed manually as part of `P5-EVID-001` |

**"Tests pass" is explicitly not treated as sufficient for organizational correctness** (brief Mission 11) — category 3 above requires a human re-read of the actual Commander-declared map, not just green tests against fixtures a developer wrote from memory of the map.

---

## 17. Evidence Strategy (Mission 12)

No second evidence database is created; no parallel governance chain is created (brief Mission 12, and `POA-DEC-ORG-KNOWLEDGE-001` KD-11). Reused exactly:

- **POA governance/mission evidence** (this plan, the acceptance/need/authorization records) → `POA-EVID-001` + `POA-DEC-SEC-001` git path, in `40-Runtime/` and `20-Shared/DECISIONS/`, exactly as every other mission in this chain already does.
- **Phase 5 routing-decision evidence** → `POA-EVT-001` execution-action events (existing mechanism), per §8's recommendation, **not** `knowledge-plane.ts` (avoids prematurely resolving §9's open consumption question and keeps the K-8 boundary crisp for this narrow, no-commit pilot).
- **Organization A source declarations** (Business Function Map, Source Declaration) → remain exactly where Phase 2 placed them, `60-Organization-A/`, Tier B git documents. Not duplicated into any other store by this plan or by the missions in §13.

---

## 18. Commit Strategy (Mission 13)

- No push. No history rewrite. No amend.
- This mission makes **one bounded commit**: the two files this plan required (`POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md`, this document, and `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-RECORD.md`), staged by explicit path only.
- `CLAUDE.md`'s pre-existing uncommitted modification is left exactly as found — not staged, not touched.
- The ~140 pre-existing untracked files (screenshots, other `40-Runtime/*.md` reports) are left exactly as found — not staged, not touched.
- Every future implementation commit in §13's mission table must reference its authorizing mission/artifact in its commit message (`CLAUDE.md` Rule 6), following the pattern already used by e.g. commit `b65d365`'s own message.

---

## 19. Cost / Session Strategy (Mission 14)

This mission was scoped, per its own brief, to maximize architectural leverage within the current session rather than spend the window on implementation: entry-gate determination (§4), full reconstruction (§5–§12), mission decomposition with exact files named (§13), dependency graph (§14), test/evidence strategy (§16–§17). No implementation was attempted. The next session/mission can begin directly at `POA-ORG-KNOW-P5-ACCEPT-001` or `POA-ORG-KNOW-P5-NEED-001` (§13) without repository rediscovery, using this document and its execution record as the starting context.

---

## 20. Risks

- **R1 — Scope creep under the "Phase 5" name.** The single largest risk this review identified (§4.1). A future mission reading only the brief's Phase 5 framing (not this document) could build UI or executive-intelligence capability under Phase 5's authorization, which §24 does not grant it. Mitigation: this plan's mission table (§13) explicitly separates P5/P6/P7.
- **R2 — Acting on unaccepted Phase 2 content.** Building the dry-run before Commander acceptance (C1) risks routing against organizational facts the Commander has not confirmed as final (e.g. Channel Partner Management's owner gap could later turn out to be a materialization oversight, not a true unknown).
- **R3 — KD-16/KD-18 ratification ambiguity (§4.7).** If either is not actually ratified (only the ten outright + partially-checked eleven are confirmed), the dry-run's "never approve" and "routing as an Authorization sub-step" behaviors would rest on an unratified basis. Low likelihood (K-001's overall ratification was broad) but not zero.
- **R4 — Phase 3/4 sequencing divergence (§8) resurfacing.** The knowledge plane already exists ahead of its stated Phase 3 gate. A future mission might assume this means Phase 3/4 are "done" and skip demonstrating adapter need — this plan explicitly does not conclude that.
- **R5 — Tier boundary blur (§9).** Whichever consumption path (parse vs. load-as-assertion) is chosen without a Commander ruling risks setting an unreviewed precedent for every future Tier-B-to-KnowledgePlane consumption.

---

## 21. Explicit Non-Scope

Per the brief's Stop Condition, none of the following was done, or is authorized by this document:

- Implement Phase 5 (or any phase).
- Modify `50-Mothership/`, `50-Mothership/command-center/`, or any code file.
- Modify `50-Mothership/src/knowledge-plane.ts` or any KnowledgePlane behavior.
- Modify `60-Organization-A/Paravyoma-Source-Declaration.md` or `Business-Function-Map.md`.
- Modify `20-Shared/STD/POA-STD-011.md` or `20-Shared/DECISIONS/POA-ADR-001.md`.
- Implement routing, create business-function APIs, create UI, create agents, create automation.
- Push any change.
- Resolve Q2, Q3, Q4, Q6, Q7, or any other `POA-DEC-ORG-KNOWLEDGE-001` §20 open question.
- Resolve the §4.1 scope-divergence tension (T1) or the §8 sequencing divergence — both are recorded, not resolved, per `CLAUDE.md` Rule 8.
- Resolve §9's KnowledgePlane-consumption choice.

---

## 22. Exact Commander Authorization Required for Implementation

Restated from §4.9 for a single point of reference:

1. **`POA-ORG-KNOW-P5-ACCEPT-001`** — Commander acceptance of the two materialized Phase 2 artifacts under OQ-5.
2. **`POA-ORG-KNOW-P5-NEED-001`** — a recorded demonstrated need for the routing dry-run, or an explicit Commander waiver of that CTD-001 condition for this bounded pilot.
3. **`POA-ORG-KNOW-P5-AUTH-001`** — a Commander decision act, in `POA-ADR-001.md`'s own established format, that (a) incorporates 1–2 above, (b) confirms or completes KD-16/KD-18's ratification status, (c) confirms the ratification commit `9729df9d…`'s relationship to this branch, and (d) explicitly authorizes implementation of `POA-DEC-ORG-KNOWLEDGE-001` §24 Phase 5 — the routing dry-run for one function — and no other phase.

Without all three, no implementation mission in §13 may proceed.
