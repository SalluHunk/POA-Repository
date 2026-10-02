# POA-ORG-KNOW-P5-IMPL-001 — Re-scoped Mission Package / Execution Brief (Synthetic-Fixture Routing Dry-Run)

**Artifact ID:** `POA-ORG-KNOW-P5-IMPL-001-RESCOPED-MISSION-PACKAGE`
**Date drafted:** 2026-10-02
**Status:** **RATIFIED — EXECUTION BOUNDARY for the re-scoped synthetic-fixture dry-run ONLY (ratified 2026-10-02).** Authorization is effective upon the Commander act recorded in `POA-ADR-001.md` §"POA-ORG-KNOW-P5-IMPL-001 — Re-scoped Synthetic-Fixture Routing Dry-Run Ratification Decision Record (2026-10-02)" (`POA-STD-011` §6.4), which is committed together with this package. **Implementation has NOT commenced.** This package is the execution boundary (§6.3, §6.6); it creates no Organization A processing authority and does not satisfy, modify, suspend or lift R-1/Q6. See the Ratification Record immediately below.
**Drafted under:** Commander directive of 2026-10-02 ("governance-resolution phase for P5-IMPL-001"), following `POA-ORG-KNOW-P5-R1-RECON-001-RECONCILIATION-REPORT.md` (disposition BLOCKED — GOVERNANCE CONDITION).
**Authorizing record this package relates to:** `POA-ORG-KNOW-P5-AUTH-001` (`POA-ADR-001.md` §"POA-ORG-KNOW-P5-AUTH-001", commit `c4fe638`) — **preserved unmodified as historical record** (§13 below).

## Ratification Record (added 2026-10-02; status/ratification fields only — no normative content in §§1–15 is altered by this block)

The Commander approved the synthetic-fixture re-scope in principle on 2026-10-02, subject to recording the ratifying act in `POA-ADR-001`, which is done in the Decision Record cited in the Status line. The Commander's rulings, as recorded there, are applied to this package as follows:

1. **R-1/Q6 remains fully in force**; this mission does not satisfy, modify, suspend or lift it (EC-4 stands).
2. Execution only against genuinely synthetic fixtures satisfying SF-1 through SF-9.
3. **KnowledgePlane consumption path rejected**; the pure-function path of §7–§8 is used.
4. `SYN-FINANCE-ACCOUNTING` approved as a **synthetic nominal label only** — never derived, copied, structurally mirrored or populated from Organization A content (settles B-3, label part).
5. The routing module's private, unexported types are approved as **implementation-private**; they must not be exported from the module or from `index.ts` and must not become an exported business-function data model (settles B-3, types part).
6. Outcome mappings approved and **not to be silently reinterpreted**: missing owner or role → ASK / ESCALATE; missing grant → REFUSE (settles B-6; §7 table governs; any ambiguity → SC-10).
7. EVT-001 evidence may be retained in the execution record only; **no runtime evidence store** (settles B-7; EV-5 and X-8 stand).
8. Q3, O-1–O-4 and MODEL-GATE remain outside this mission.
9. No inspection, parsing, transformation, anonymization, copying, structural mirroring, summarization or other processing of Organization A business-function content.
10. `POA-ORG-KNOW-P5-AUTH-001` remains preserved as unchanged historical record (§13 stands).
11. **Evidence limitation:** successful execution provides evidence **only about the synthetic routing mechanism**, and **no** evidence that Organization A's real declarations route correctly (EV-7 stands and must be stated in the execution record).

Not ruled on by the ratifying act, and therefore still open exactly as stated in §12: B-4, B-5, B-8, B-9, B-10; the SC-11 effort envelope remains UNKNOWN. All "DECISION (proposed)" items in §§3–12 are ratified as written, except that any item touching B-4/B-5 is not thereby resolved. Implementation commits must cite `POA-ORG-KNOW-P5-AUTH-001`, this package, and the commit of the ratifying `POA-ADR-001` record (§10 C-6).

---

## 0. Label convention

| Label | Meaning |
|---|---|
| **VERIFIED** | Read directly from a committed/located source in this drafting session; source cited. |
| **INFERRED** | My reasoning from verified text; not stated in any source. |
| **UNKNOWN** | Not established; not guessed. |
| **DECISION** | A choice. **DECISION (Commander)** = made by the Commander's 2026-10-02 directive. **DECISION (proposed)** = proposed by this package; has no effect until ratified. |

---

## 1. What changed and why (context)

1. **VERIFIED** — `P5-AUTH-001` §4 authorizes execution of `POA-ORG-KNOW-P5-IMPL-001` only: a Finance/Accounting routing dry-run whose function is "declared per `60-Organization-A/Business-Function-Map.md` and `Paravyoma-Source-Declaration.md`", consumption path left to the implementing mission between plan §9's two options. It contains no mention of R-1 or Q6.
2. **VERIFIED** — The Q6 ruling (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-Q6-DECISION.md`, recorded additively in `POA-ADR-001`) provides: **Q6-3** AI Execution Agents are external AI providers; **Q6-4** "processes" includes "reading it in an agent session"; **Q6-6(a)** the content of any Organization A Source Declaration or Business Function Map "including its systems, owners, cadences and sensitivities, is organization information. AI processing of it remains gated by R-1 until Q6 is fully answered and Organization A has authorized that processing"; **Q6-7** `POA-EXB-001` §8 does not extend to organization information; **Q6-8** the ruling does not lift the gate; **Q6-9** the Organization A authorization path is undecided.
3. **VERIFIED** — The R1 reconciliation report found no committed record that lifts, modifies or reconciles the gate, and no record of Organization A authorizing processing.
4. **DECISION (Commander)** — Do **not** reinterpret `P5-AUTH-001` as overriding the gate. Do **not** attempt to create Organization A processing authority now. Pursue the **synthetic-fixture path**.
5. **INFERRED** — Consequence: the dry-run can still demonstrate the *routing logic* (DEC §14.1 links 1–7) without ever touching gated content, but it can no longer demonstrate that Organization A's *real* declarations route correctly. This package states that limitation in §9 and §10 rather than hiding it.

## 2. Authorization chain and what this package is

| Element | Status |
|---|---|
| Mission identity | `POA-ORG-KNOW-P5-IMPL-001` (unchanged ID; re-scoped execution brief) — **VERIFIED** ID per P5-AUTH §4 |
| Original authorization | `P5-AUTH-001`, effective upon recording (c4fe638) — **VERIFIED**; remains historically true as recorded |
| This package | Execution brief supplying the §6.6 elements P5-AUTH-001 lacks (stop conditions, decision boundaries) — **VERIFIED** gap per R1 report |
| Effective authorization for the *re-scoped* mission | **EXISTS — synthetic boundary only — effective upon recording** of the 2026-10-02 `POA-ADR-001` Decision Record (B-1, B-2 satisfied; see Ratification Record). Does not extend beyond this package. |
| Org A processing authority | **DOES NOT EXIST; not created or implied by this package** |

---

## 3. The R-1 / Q6 gate as an explicit execution constraint

**DECISION (proposed; binding on this mission once ratified):**

- **EC-1.** The R-1 gate (K-001 §20 Q6; R-1 Ratification Decision Record §§3–4; Q6-3 … Q6-9) is **in force** for the entire execution of this mission and constrains it.
- **EC-2.** This mission shall not read, parse, load, transform, index, embed, summarize, extract from, reason over, copy, paraphrase, de-identify, anonymize, or otherwise process **any Organization A business-function content** (§5, X-1…X-3), in any form, by any actor that is an AI Execution Agent, or by any tool whose output is placed in an AI Execution Agent session.
- **EC-3.** The mission's design input is this package and the cited governance material only. It shall not use any description of Organization A's declarations as design input — including any such description reproduced inside a governance document (see §12 B-4).
- **EC-4.** **This re-scoping does NOT satisfy, lift, narrow, interpret or bypass the R-1 gate.** Q6 remains not fully answered; Organization A has not authorized processing; the Organization A authorization path remains undecided (Q6-9). The re-scope only makes this mission's execution **independent of** gated content. If any step would require gated content, the mission **stops** (§11, SC-1).
- **EC-5.** Nothing here modifies the Q6 ruling, ADR-001, `P5-AUTH-001`, or any KD text.

---

## 4. Proposed exact scope — authorized work (STD-011 §6.6 element 1)

**DECISION (proposed).** Build and test a **pure, deterministic Business-Function routing + authorization-check dry-run** over a **synthetic declaration set**, covering `POA-DEC-ORG-KNOWLEDGE-001` §14.1 links 1–7 only (principal; intent; business function [INFERENCE requiring confirmation]; owning unit; responsible role; authorized executor [grant]; approval requirement [initiation-grant check only]). Concretely:

| # | Authorized item | Allowed paths (exhaustive allowlist) |
|---|---|---|
| A-1 | One new isolated routing module (pure functions; no I/O, no clock, no randomness in the decision path) | `50-Mothership/src/routing.ts` |
| A-2 | One new test file | `50-Mothership/test/routing.test.ts` |
| A-3 | Synthetic fixtures and a fixture manifest | `50-Mothership/test/fixtures/routing-synthetic/**` |
| A-4 | Mission execution record (agent-action evidence, case ledger, limitations) | `40-Runtime/POA-ORG-KNOW-P5-IMPL-001-EXECUTION-RECORD.md` |
| A-5 | One bounded commit citing `P5-AUTH-001`, this package and the ratifying act (§6.8) | — |

Nothing else may be created or modified. `50-Mothership/src/index.ts`, `runtime.ts`, `knowledge-plane.ts`, `identity.ts`, all existing tests, `command-center/`, `60-Organization-A/`, `20-Shared/`, `CLAUDE.md` are **untouched**. The module is **not exported** from `index.ts` and exposes no API surface.

**Function label.** The synthetic function set may include a function labelled `SYN-FINANCE-ACCOUNTING` as a purely **nominal domain label** (all attributes invented, per §6), so the mission remains recognizably the "Finance/Accounting" pilot. **DECISION (proposed); requires Commander confirmation** that a nominally-labelled synthetic function is acceptable under P5-AUTH §4 "Function piloted: Finance / Accounting only" (§12 B-3).

---

## 5. Explicit exclusions (STD-011 §6.6 element 2)

**Prohibited content (EC-2 applies to all):**

- **X-1.** `60-Organization-A/Business-Function-Map.md` and `60-Organization-A/Paravyoma-Source-Declaration.md` — and the whole `60-Organization-A/` directory.
- **X-2.** Any Organization A measure definition, or any Organization A systems/owners/cadences/sensitivities/platforms/people/client names, from any source.
- **X-3.** Any derived description of X-1/X-2 wherever it appears (including inside plans, reports, ADR text, or this session's own earlier outputs) — not usable as design input or fixture seed.
- **X-4.** `POA-PJR-001` engagement entries (organization information per Q6-6(b)).

**Prohibited operations (for all content, not only gated):** KnowledgePlane read/write/ingest/assert/load (X-5); any model/LLM/agent/external-inference call from the routing path (X-6); network, filesystem I/O inside the routing core (X-7); persistence of any kind, including the Mothership witness log or evidence store (X-8); any commit/write to a system of record; any approval, or any action that simulates/records approval on any identity's authority (Q5, KD-16) (X-9); UI changes, new endpoints, new business-function API, persisted data model (X-10); any other function or Phase 6/7 work (X-11); modifying ADR-001, `P5-AUTH-001`, the Q6 ruling, STD-011, existing tests, baselines, configuration (X-12); push, amend, rebase (X-13); resolving Q3, O-1…O-4, MODEL-GATE or any unrelated governance question (X-14).

---

## 6. Synthetic fixture definition

A file qualifies as a **synthetic fixture** only if **all** of SF-1…SF-9 hold. Any doubt → it does not qualify (SC-3).

- **SF-1 Invented from specification.** Authored solely from this package (§6–§7) and the architecture's own link definitions (DEC §14.1, §13.3). Not copied, adapted, transformed, "anonymized", paraphrased or structurally mirrored from any Organization A document or from any description of one.
- **SF-2 Fictitious organization.** One invented organization, id `SYN-ORG-S` (and optionally a second invented `SYN-ORG-T` solely for the cross-organization isolation case). No real organization, client, vendor or product name.
- **SF-3 Synthetic identifiers only.** Every identifier carries the `SYN-` prefix (e.g. `SYN-PRINCIPAL-01`, `SYN-UNIT-01`, `SYN-ROLE-01`, `SYN-FN-FINANCE-ACCOUNTING`). No real person, role-holder, email, system, platform or cadence value.
- **SF-4 Invented attribute values.** Owning units, roles, grants and authority requirements are arbitrary, case-driven values chosen to exercise a route/refuse/escalate outcome; none is chosen to resemble a real declaration.
- **SF-5 Explicit marker.** Each file's top level carries `"fixtureClass": "SYNTHETIC"`, `"organization": "SYN-ORG-S"` (or `-T`), and `"authoredFrom": "POA-ORG-KNOW-P5-IMPL-001-RESCOPED-MISSION-PACKAGE"`. The test harness loader refuses any file lacking all three.
- **SF-6 Declared gaps are explicit.** Missing declarations are represented as explicit `null` / absent fields per case (to exercise refuse/escalate), never as copies of any real `[UNK]` pattern.
- **SF-7 Location.** Only under `50-Mothership/test/fixtures/routing-synthetic/`. Never under `60-Organization-A/`, never loaded into the KnowledgePlane, never referenced by production code outside tests.
- **SF-8 Format.** JSON (a typed structure, not a Markdown mimic of the Business Function Map). Rationale: no Markdown parser that could later be pointed at the real map is built or implied.
- **SF-9 Manifest.** `manifest.json` lists every fixture, its case id (§10 matrix), and its expected outcome, so each case is reviewable against the matrix without running code.

---

## 7. Input / output contract for the dry-run (exact)

Specification, not code. Names are normative; TypeScript syntax is illustrative.

**Function:** `routeDryRun(declarations: SyntheticDeclarationSet, request: DryRunRequest): RoutingDecision` — pure and total (never throws on well-typed input; malformed input → `REFUSE` with `MALFORMED_INPUT`).

```
SyntheticDeclarationSet {
  fixtureClass: "SYNTHETIC"; organization: string; version: string;
  functions: [{ functionId, label, aliases: string[],
                owningUnit: string|null, responsibleRole: string|null }]
  grants: [{ subjectId, subjectKind: "HUMAN"|"SERVICE"|"EXECUTION_AGENT",
             functionId, action: "INITIATE"|"APPROVE", status: "ACTIVE"|"REVOKED" }]
  approvalRequirements: [{ functionId, declaredAuthority: string|null }]
}
DryRunRequest {
  requestId: string; principal: { id, authenticated: boolean, organization: string|null }
  intentLabel: string                       // matched against declared aliases; no NLP, no model
  principalConfirmation: "CONFIRMED"|"UNCONFIRMED"|"REJECTED"
}
RoutingDecision {
  requestId; outcome: "ROUTE"|"ASK"|"ESCALATE"|"REFUSE"; reasonCode: <enum below>
  links: [{ n:1..7, name, status: "SATISFIED"|"MISSING"|"AMBIGUOUS"|"NOT_EVALUATED", ref: string|null }]
  inference: { resolvedFunctionId: string|null, kind: "INFERENCE", confirmed: boolean }
  route: { owningUnit, responsibleRole, executorSubjectId } | null   // non-null only when outcome=ROUTE
  declarationSetVersion; committed: false; writes: []; approvalsSimulated: 0
}
```

**Deterministic rules (DECISION (proposed); sourced from DEC §14.1/§13.3 — VERIFIED sources):**

| Order | Condition | Outcome | reasonCode | Source |
|---|---|---|---|---|
| 0 | Input malformed / wrong `fixtureClass` | REFUSE | `MALFORMED_INPUT` / `NOT_SYNTHETIC` | package |
| 1 | Principal unauthenticated, or `principal.organization ≠ declarations.organization` | REFUSE | `PRINCIPAL_REJECTED` / `ORG_MISMATCH` | §14.1 link 1; SVC-001 §15 isolation |
| 3a | `intentLabel` matches no alias | ASK | `FUNCTION_UNRESOLVED` | link 3: "Ask; never proceed on unconfirmed interpretation" |
| 3b | Matches >1 function | ASK | `FUNCTION_AMBIGUOUS` | link 3 |
| 3c | Resolved but `principalConfirmation ≠ CONFIRMED` | ASK (UNCONFIRMED) / REFUSE (REJECTED) | `INTENT_UNCONFIRMED` / `INTENT_REJECTED` | link 3 |
| 4 | `owningUnit` null/absent | ESCALATE | `NO_OWNING_UNIT_DECLARED` | §13.3 "refuses or escalates to the requester; never guesses an owner" |
| 5 | `responsibleRole` null/absent | ESCALATE | `NO_RESPONSIBLE_ROLE_DECLARED` | §13.3 |
| 6 | No ACTIVE `INITIATE` grant for any executor on the function | REFUSE | `NO_AUTHORIZED_EXECUTOR` | link 6: "a role without a grant is not an executor" |
| 7 | Principal holds no ACTIVE `INITIATE` grant, or approval requirement entry missing | REFUSE | `NO_INITIATION_GRANT` / `APPROVAL_REQUIREMENT_UNDECLARED` | link 7: checks initiation grant only |
| — | All links satisfied | ROUTE | `ROUTABLE_DRY_RUN` | — |

Invariants (each tested): same input ⇒ same output; `committed` is always `false`; `writes` is always `[]`; `approvalsSimulated` is always `0`; an `APPROVE` grant, or an `EXECUTION_AGENT`/`SERVICE` subject, never produces an approval and never changes the outcome toward ROUTE on approval grounds; links after the first failing link are `NOT_EVALUATED`; no input mutation. Evaluation order shown is the contract; the ESCALATE-vs-REFUSE assignment (links 4/5 vs 6/7) is **DECISION (proposed)** because §14.1 prints "Refuse / escalate" without distinguishing them for links 4–5 — flagged for Commander confirmation (§12 B-6).

---

## 8. Resolved consumption path

**DECISION (proposed; within the delegation P5-AUTH §4 leaves to the implementing mission, but made here so the Commander ratifies it explicitly):**

- **Path chosen: plan §9 option 1, as a "structured sibling" — direct consumption of a synthetic structured declaration set (JSON), passed to a pure routing function.** The fixture is read from disk **only by the test harness**, which validates SF-5 before use; `routing.ts` itself performs no I/O.
- **Plan §9 option 2 (loading into the KnowledgePlane as SELF-DECLARED assertions) is rejected for this mission**, because it is a KnowledgePlane modification, which P5-AUTH §4 excludes ("any KnowledgePlane modification"), and would write persistent state (X-5, X-8). This resolves — **by avoidance, not by interpretation** — the R1 report's internal-inconsistency finding for this re-scoped mission.
- **No Markdown parser** of the Business Function Map's format is built (SF-8). No adapter for Organization A content is built, designed for, or stubbed.
- **INFERRED limitation:** this does not decide how a *future* Organization-A-sourced run would consume its declarations. That remains open and out of scope; `routeDryRun`'s source-agnostic input type must not be extended speculatively (SC-9).

---

## 9. Evidence the dry-run must produce

- **EV-1 Case ledger** (in the execution record): for every matrix case (§10): case id → fixture file + content hash → expected outcome/reasonCode → actual outcome/reasonCode → pass/fail. Reproducible from `manifest.json` and the test run.
- **EV-2 Test and build evidence:** `routing.test.ts` pass count; `npm test` and `npm run typecheck` in `50-Mothership/` — full results, with prior-suite count unchanged (no existing test modified).
- **EV-3 Invariant evidence:** the §7 invariants asserted by tests (determinism, `committed:false`, `writes:[]`, `approvalsSimulated:0`, no input mutation).
- **EV-4 Guard evidence (mechanical):** (a) static guard test over `routing.ts` and the fixtures: no reference to `60-Organization-A`, `Business-Function-Map`, `Source-Declaration`, `knowledge-plane`, `runtime`, `fs`, `node:fs`, network or model-client identifiers (the guard file itself is the sole allowed holder of those strings as a forbidden list); (b) `git diff --name-only` equals the §4 allowlist.
- **EV-5 Agent-action events:** EVT-001-shaped (role-level) action events for the execution (EVT-001 §D fields), recorded **inside the execution record**, committed with it. **No runtime event store is written** (X-8).
- **EV-6 Non-access attestation:** an explicit statement in the execution record that no `60-Organization-A/` path was opened and no X-3 description was used as input. **INFERRED strength:** this is an agent self-attestation backed by EV-4 mechanical checks, not an independent audit of the agent's reads — stated as such (§12 B-5).
- **EV-7 Limitations statement:** the run demonstrates routing logic on synthetic data only; it is **not** evidence that Organization A's real declarations route correctly, and does **not** satisfy `POA-DEC-ORG-KNOWLEDGE-001` §24 Phase 5's exit criterion as applied to Organization A.

---

## 10. Completion condition (exact)

`POA-ORG-KNOW-P5-IMPL-001` (re-scoped) is **complete if and only if ALL** hold:

1. **C-1 Case matrix passes** — at minimum these cases, each with its own fixture and expected outcome: happy-path ROUTE; unauthenticated principal; cross-organization principal; no alias match; ambiguous alias; intent UNCONFIRMED; intent REJECTED; function with no owning unit; function with no responsible role; no ACTIVE grant (none declared); REVOKED grant only; principal lacks initiation grant; approval requirement undeclared; `APPROVE`-only grant held by a `SERVICE`/`EXECUTION_AGENT` subject (must not route on approval grounds); malformed input; non-synthetic fixture refused.
2. **C-2** Invariants (§7) hold in tests.
3. **C-3** `npm run typecheck` and the full `50-Mothership` test suite pass, with no pre-existing test changed.
4. **C-4** Guards (EV-4) pass; changed paths equal the §4 allowlist exactly.
5. **C-5** Execution record written containing EV-1…EV-7.
6. **C-6** One bounded local commit exists referencing `P5-AUTH-001`, this package, and the ratifying act's commit (STD-011 §6.5/§6.8); no push, amend or rebase.
7. **C-7** No stop condition (§11) fired, or any that fired is reported with the remainder named (STD-011 §6.12(a)).

Completion **does not** mean: Phase 5 satisfied for Organization A; Q6 or the R-1 gate answered; any Org A authorization created; any successor mission (Phase 6/7, other functions, `P5-EVID-001`) authorized.

---

## 11. Stop / termination conditions (STD-011 §6.6 element 3)

The mission's authority to act **ends** on completion (§10) or on the first of the following, whereupon the agent stops, writes down what is done/undone, and escalates — it does **not** resolve the matter itself:

- **SC-1** Any step would require opening, reading or processing `60-Organization-A/**`, an X-3 description, or any other gated content.
- **SC-2** Any need arises to run the routing on non-synthetic data.
- **SC-3** Any fixture fails SF-1…SF-9, or is suspected of resembling or deriving from Organization A material.
- **SC-4** Any need to import/call `knowledge-plane`, `runtime`, `identity`, filesystem or network inside the routing core, or any model/agent/external-inference component.
- **SC-5** Any write outside the §4 allowlist, any modification of an existing test/baseline/config, or any persistence.
- **SC-6** Any need to modify ADR-001, `P5-AUTH-001`, the Q6 ruling, STD-011, or any governance artifact.
- **SC-7** The ratifying Commander act (§12 B-1) is absent from committed `POA-ADR-001`, or is uncommitted (STD-011 §6.5/§6.7).
- **SC-8** A conflict is found between this package and `P5-AUTH-001`, Q6, DEC §13.3/§14.1, or CLAUDE.md that the package does not already resolve (CLAUDE.md Rule 8: report, do not choose a side).
- **SC-9** Any pressure to extend the contract (extra functions, adapters for real declarations, UI, endpoints, events store, approval flows).
- **SC-10** Any outcome-mapping ambiguity not settled by the §7 table.
- **SC-11** Size/effort envelope exceeded by >50% of the Commander-ratified estimate (to be stated in the ratifying act; otherwise **UNKNOWN** and the agent reports before continuing).

---

## 12. Decision boundaries (STD-011 §6.6 element 4) and open governance items

**The mission MAY decide itself:** internal function/variable names; test organization inside the allowlisted files; fixture wording and case ordering (subject to SF-1…SF-9); how `manifest.json` is laid out; code structure within `routing.ts`.

**The mission MUST escalate (separate governance act):** anything touching Organization A content or authorization; any expansion beyond the §4 allowlist or §7 contract; KnowledgePlane use; any model/agent processing path; persistent evidence/event storage; changing the outcome table; additional functions, phases or surfaces; amending `P5-AUTH-001`/ADR-001/Q6; push; any claim that the R-1 gate is satisfied.

**Remaining governance blockers / items (status as of this package):**

| ID | Item | Class |
|---|---|---|
| **B-1** | A Commander ratifying act, recorded in `POA-ADR-001` (or equivalent designated standing), that makes this re-scoped package effective (STD-011 §6.4); the package cannot self-ratify. | **SATISFIED 2026-10-02** — ratifying Decision Record in `POA-ADR-001` (committed with this package) |
| **B-2** | Whether the synthetic-fixture re-scope is within `P5-AUTH-001` or requires a new authorization. **INFERRED, high confidence:** it requires an explicit act, because P5-AUTH §4's scope is defined by reference to the Organization A declarations. Recommended: one additive ADR-001 record that (a) ratifies this package, (b) states it does not lift the gate, (c) leaves `P5-AUTH-001` text intact. | **SATISFIED 2026-10-02 (same act as B-1)** — additive record; `P5-AUTH-001` text left intact |
| **B-3** | Interpretation: P5-AUTH §4 excludes "new business-function API, or new business-function data model". **INFERRED:** the module-private, un-exported, un-persisted types in §7 are not such a model, but a reading that they are is not excluded by text. Also confirm the nominal `SYN-FINANCE-ACCOUNTING` label under "Finance / Accounting only". | **RULED 2026-10-02** — Commander rulings 4–5: nominal `SYN-FINANCE-ACCOUNTING` label approved; private unexported types approved, not to be exported |
| **B-4** | **Exposure note (VERIFIED):** the committed `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md` reproduces, in its §11 table (and likely §7, which I did not open), declared Organization A facts (owners, cadences, sensitivities). I read the §11 table range incidentally while locating §9 in this drafting session. I did not use it as design input and nothing here derives from it. **UNKNOWN / INFERRED:** whether that plan content is itself "organization information" under Q6-5 ("descriptions of them") and what follows is **not decided here**; it is recorded as an open item for the Commander. I did not open the Business Function Map or the Source Declaration. | **Open item (disclosure)** |
| **B-5** | Non-access evidence is agent attestation plus mechanical guards (EV-6); no independent audit of reads exists. | **UNKNOWN / limitation** |
| **B-6** | Whether links 4/5 → ESCALATE and 6/7 → REFUSE (§7) is the Commander's intended mapping; DEC §14.1 prints "Refuse / escalate". | **RULED 2026-10-02** — Commander ruling 6: mapping approved (missing owner or role → ASK / ESCALATE; missing grant → REFUSE); not to be silently reinterpreted |
| **B-7** | Fit of EVT-001 to this use. **VERIFIED:** EVT-001 specifies per-mission agent action/tool events committed with the mission's report (§D, §H); it is not a runtime routing-decision store. P5-AUTH §4/plan §17 call for evidence "via POA-EVT-001"; this package interprets that as EV-5 only. **UNKNOWN** whether the Commander intended a runtime store. | **RULED 2026-10-02** — Commander ruling 7: EVT-001 evidence retained in the execution record only; no runtime evidence store |
| **B-8** | Q3, O-1…O-4, MODEL-GATE: **not resolved or broadened here.** **INFERRED:** none materially affects synthetic execution (no Organization A content, no model, no representation act). I did not examine MODEL-GATE's text. | **Dependency, non-blocking** |
| **B-9** | The R-1 gate, Q6 full answer and Organization A authorization path remain open and **block any Organization-A-based Phase 5 run** (not this re-scoped one). | **Remains open; outside scope** |
| **B-10** | Push of 24 local commits, untracked reports, pre-existing `CLAUDE.md` modification: unchanged and unrelated. | **Housekeeping, unchanged** |

---

## 13. Preservation of the original authorization

`P5-AUTH-001` (c4fe638) is **not modified, superseded or re-labelled** by this package. Its text remains the historical record of what the Commander authorized on 2026-09-30. This package records, additively and as a proposal, how a narrower synthetic-fixture execution would proceed **in light of** the later Q6 ruling. Whether to amend, supersede, or merely annotate it is a Commander decision (B-2), not made here.

## 14. What this package does not do

No dry-run executed; no fixture created; no code written; no ADR/authorization/Q6/STD change; no commit or push; no KnowledgePlane touch; no processing of Organization A content; no Organization A authority created or implied; no inference that representative authority equals processing authority (Q3-A).

## 15. Separate Commander authorization required before execution

**Satisfied, within the synthetic boundary only.** The ratifying Commander act in B-1/B-2 is recorded in `POA-ADR-001` and committed together with this package, before any implementation commit (STD-011 §6.4, §6.5, §6.7). Any expansion beyond this package still requires its own separate governance act.
