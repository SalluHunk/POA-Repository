# POA-DEC-ORG-KNOWLEDGE-001 — F-2 Independent Verification — Decision Record

## What "a verifier distinct from its producer" can legitimately mean in POA, and which verification model POA can defend

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact | Decision record filed under the `POA-DEC-ORG-KNOWLEDGE-001` mission prefix. **No new artifact ID is minted** (`CLAUDE.md` Rule 5) |
| Status | **DECIDED (Commander, 2026-09-25).** B′ adopted, including the route-2 control condition. No attesting role is designated. Mechanized verifiers and producers remain UNRESOLVED. Recorded as the "POA-DEC-ORG-KNOWLEDGE-001 F-2 Independent Verification Decision Record (2026-09-25)" in `20-Shared/DECISIONS/POA-ADR-001.md`; see §13 below. Sections 1–12 are kept exactly as drafted when this was a candidate, and their "PROPOSE" and "RECOMMENDATION" wording is historical. Not Approved, Accepted, or Certified as an artifact |
| Filename | Renamed, while still untracked and never committed, from `…-F-2-INDEPENDENT-VERIFICATION-DECISION-CANDIDATE.md` |
| Authority | Commander instruction in session, 2026-09-25: "Proceeding with the F-2 Independent Verification Decision mission from the 5896b6f checkpoint". The stated boundary: read and reconcile existing POA mechanisms first; determine what "independent verification" can legitimately mean; compare the existing alternatives and their consequences; keep verification separate from authority; do not resolve Q3; do not authorize Phase 2; do not implement code, schemas, storage, connectors or UI; produce a decision candidate for review |
| Subject | Friction item F-2 (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-PHASE-1-LABELING-DISCIPLINE-COMPLETION-REPORT.md` §2) and determination D-2, which the Commander left **UNRESOLVED — preserved** (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-TRUTH-PROVENANCE-FRICTION-DECISION.md` §8; `POA-ADR-001` friction disposition record, commit `023a85a`) |
| Question answered | *What verification model can POA defend constitutionally and operationally, given its existing identity, evidence, event and acceptance mechanisms?* |
| Repository baseline | `HEAD == origin/main == 5896b6f08b2eb4fc290713a19d81c0f2ccf817c0`; nothing staged; `CLAUDE.md` modified locally (pre-existing, untouched); untracked material preserved |
| Nature | Architecture analysis only. No code, schema, storage, connector, UI, Phase 2 or Q3 work. `POA-DEC-ORG-KNOWLEDGE-001` (K-001, SHA-256 `ba19e96f…`), the friction decision record, `POA-ADR-001`, `POA-PJR-001` and the Phase 1 reports are **unmodified**. Nothing is appended to ADR-001, because no decision has been made |

**How to read the claims in this document** (applying Phase 1 discipline and D-5/D-8 to this document itself):
- Quotations and status readings of cited artifacts are SOURCE-OBSERVATION, basis VERIFIED (as-committed at `5896b6f`), freshness UNKNOWN (no declared cadence).
- Classifications and readings are INFERENCE. The comparison in §5 is ANALYSIS. §6 is RECOMMENDATION.
- Producer: Claude Opus 5.5 (`claude-opus-5-5`), Execution Agent, 2026-09-25. Method class: non-deterministic analysis over the cited sources. Reasoning text excluded (K-001 §10.2).
- The source-authority axis is not asserted for INFERENCE, ANALYSIS or RECOMMENDATION (D-8).

None of these labels creates authority.

---

# 1. The question, restated precisely

K-001 §9.1 (ratified, KD-12) defines **VERIFIED FACT** as:

> "An observed fact corroborated by a verifier distinct from its producer: deterministic re-check against primary evidence, an independent source, or attestation by an authorized role"

K-001 §10.2 (ratified, KD-13) requires, for kind VERIFIED:

> "The above + verification method + verifier identity (≠ producer) + verification time"

K-001 §6.1 stage 7 VERIFY (ratified with qualification, KD-06) states the gate as:

> "Verifier distinct from producer (`POA-DEC-SEC-001` §5)"

In Phase 1, R9 recomputed a SHA-256 pinned by an earlier Execution-Agent session. That is a deterministic re-check against primary evidence, but producer and re-checker are sessions of the same role. Phase 1 therefore withheld kind VERIFIED FACT. The Commander preserved that interim practice pending this decision (friction record §8, D-2 row: "kind VERIFIED FACT is not claimed on the strength of a same-role re-check").

The question has two parts:
- **Meaning:** what does "distinct" require?
- **Defensibility:** which reading can POA defend, both against its constitutional values and against what its mechanisms can actually record?

---

# 2. Sources read, and the standing of each

Everything below was read from disk at `5896b6f` on 2026-09-25, with two exceptions, which are only partially re-read:
- **`ORC-001-GOV-001`.** Its role names, including the "Chief Architect" terminology addendum, were confirmed by search. The role chain itself is cited as `OPV-003` Track A restates it.
- **The ESR-001 §6 "evidence-policy" precedent.** It is carried over from the friction decision record, and was confirmed only through the ESR-001 Decision Record's Authority line in `POA-ADR-001`.

| Source | Location | Standing | Relevance |
|---|---|---|---|
| K-001 §6.1, §9.1–§9.2, §10.2, §12.1, §12.5, §7.2–§7.3, §11.2, §19.2 | `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-DECISION.md` | **Ratified** (R-1 Act 2): KD-12 and KD-13 without qualification; KD-06 "ratified with qualification: capability-grant gates reference a deferred model"; KD-15 without qualification | Governing text |
| `POA-DEC-SEC-001` §5, §15 | `40-Runtime/POA-DEC-SEC-001-DECISION.md` | **Decision candidate as a whole** (§24). R-1 treats DEC-SEC-001 sections as "referenced, not ratified" (KD-10 and KD-11 qualifications) | The upstream origin of the distinctness gate cited by KD-06 |
| `POA-DEC-SEC-001` §25.1–§25.4, §26.1–§26.4 | same | **Ratified Commander rulings**, scoped to the Independent Witness | A precedent for how POA defines independence |
| `POA-EVID-001` §D | `20-Shared/GOV/` | Materialized — **acceptance pending** | Reproducibility test ("future independent reviewer") |
| `POA-EVT-001` §D | `20-Shared/GOV/` | Materialized — **acceptance pending** | Role-level-only execution identity |
| `OPV-003` Track A; `OPV-002` §3 | `40-Runtime/` | Mission reports (Provenance) | Role granularity is real; instance identity is a "confirmed, genuine absence" |
| OPV-002 Acceptance Record in `POA-ADR-001` | `20-Shared/DECISIONS/` | **Chief Architect ruling** in an Accepted artifact | "The known limitation regarding actor/instance identity and role-level authority remains preserved" |
| `ACS-001` GOV-005 Addendum §D–§F | `20-Shared/GOV/` | Materialized — **acceptance pending**; subject of the GAP-003 contradiction (D-3(c)) | Material-conflict test, certification-scoped |
| `POA-ACC-001` §F | `20-Shared/GOV/` | Materialized — **acceptance pending** | Recommends reusing the ACS-001 test; "not activated or mandated" |
| `50-Mothership/src/identity.ts`, `witness.ts` | code | Implementation (BLD-001) | Operational fact: "Role-level identity only … no instance/session-level identity"; the Witness is a test double |
| `CONST-001` Articles VI, VIII, X, XIV | `10-Constitution/` | Root authority by convention | Values-level constraints only. `POA-CON-001` §4: the Constitution "does not itself define an execution/repository governance model" |

---

# 3. Reconciliation: what "independent" already means in POA

## 3.1 POA already uses three different kinds of independence

A reconciliation across the sources shows that "independent" is carrying **three distinct notions**, each guarding against a different failure. Each has an existing home, and they are not interchangeable (INFERENCE):

| # | Notion | The failure it guards against | Existing home | Standing |
|---|---|---|---|---|
| **I-1** | **Reproducibility.** Method and inputs are recorded so any reviewer can re-run the check | Honest error: transcription, recall, drift, a wrong citation | `POA-EVID-001` §D; K-001 §9.1 DERIVED ("deterministic, reproducible computation"); §9.2 rule 2 | EVID-001 pending; K-001 ratified |
| **I-2** | **Party / control-boundary distinctness.** The verifier is not the party that produced the claim, and does not share its control | A producer confirming its own output, which "provides no adversarial value" | `POA-DEC-SEC-001` §5 and §15 (candidate); §25.1 invariant (ratified, Witness-scoped) | Mixed; see §8 C-1 |
| **I-3** | **Judgment / material-conflict independence.** An attesting or certifying judge has no material conflict in that specific decision | Self-review of one's own work in a judgment act | `ACS-001` GOV-005 §D–§F (certification only); `POA-ACC-001` §F (not activated) | Pending; GAP-003 |

**Reproducibility makes a claim verifiable, not verified (INFERENCE).**
- EVID-001 §D asks whether "a future independent reviewer [could] reconstruct why this authoritative repository state exists". The question is whether independent verification is *possible*.
- EVID-001 is a retention and reproducibility rule (§A–§C). DEC-SEC-001 §6 row A confirms this reading: EVID-001 "is a retention/reproducibility test, not an authenticity mechanism".
- A reproducible check that nobody else re-runs has been checked once, by its producer.
- F-2's Option A treated I-1 as if it were I-2. That conflation is the root of the friction.

## 3.2 What the ratified K-001 text itself supports

- **§9.1 lists three routes.** Each names a different *thing* that is distinct from the producer:
  - route 1, a deterministic re-check against primary evidence;
  - route 2, an independent **source**;
  - route 3, attestation by an authorized **role**.
- **§10.2 (KD-13) requires "verifier identity (≠ producer)".** An identity comparison has to be recordable. Under POA's role-level identity (§3.4), the only recordable distinctness between actors is **role-level**. Distinctness between sources is recordable through source identity (§10.2 "Source ref").
- **§9.1 already provides a separate, ratified kind for deterministic re-checks: DERIVED FACT.** It is "a deterministic, reproducible computation over facts", produced by a "Deterministic method (identified, versioned)", and it inherits "the weakest basis and worst freshness of its inputs" (§12.5). Phase 1 used exactly this for R9 ("SOURCE-OBSERVATION + DERIVED comparison").
- **§9.2 rule 2 is satisfied at basis level.** It reads "the *check* produces the VERIFIED assertion". A DERIVED check over basis-VERIFIED inputs carries basis VERIFIED. Rule 2 speaks of basis VERIFIED and does not require *kind* VERIFIED FACT (INFERENCE).

## 3.3 What actually depends on the kind VERIFIED FACT (the discriminating check)

K-001 was searched for every rule that keys on the *kind* rather than the *basis*:

| Rule | Text | Is DERIVED admitted on the same terms? |
|---|---|---|
| §9.2 rule 4 (organizational truth) | "(a) VERIFIED and DERIVED facts that are CURRENT and not CONTRADICTED, plus (b) synchronized DECISIONS" | **Yes** |
| §11.2 ("What happened?") | "kinds VERIFIED/DERIVED/RESULT" | **Yes** |
| §6.2 (organizational knowledge) | "SOURCE-OBSERVATION, VERIFIED, DERIVED" | **Yes** |
| §9.1 promotion path for VERIFIED ("Cited by DECISION") | DECISION provenance cites "cited assertions" of any kind (§10.2) | Not exclusive to VERIFIED |

**Result (SOURCE-OBSERVATION of K-001; the conclusion is INFERENCE).**
- **Nothing in ratified K-001 grants a deterministic re-check anything as VERIFIED FACT that it lacks as DERIVED FACT.**
- **The kind adds something only on routes 2 and 3, where the corroboration is not a computation.** Those are an independent source, or a distinct role's attestation.
- **A strict reading of "distinct" therefore costs POA almost nothing.** Deterministic work done by the Execution Agent stays fully usable as DERIVED, on the same footing for organizational truth.
- **Separately:** rule 4 also requires CURRENT freshness, which is unreachable today without a declared cadence (F-4). That constraint applies to every option equally.

**Disclosed ambiguities in the rule-4 argument (not resolved):**
- **Whether rule 4 is ratified.** KD-12 ratifies "the four no-promotion rules" (K-001 §21), but §9.2 lists five rules, and rule 4 ("Organizational truth, defined") is a definition rather than a no-promotion rule. Neither the Proposed Ratification Act report nor the Readiness Review says which four are meant, so whether rule 4 is within ratified KD-12 is ambiguous.
- **Why the argument survives.** The conclusion does not rest on rule 4 alone: §6.2 and §11.2 also admit DERIVED alongside VERIFIED.
- **Kind or basis.** "VERIFIED" in rule 4 could mean the kind or the basis. The conclusion holds either way, because DERIVED is listed as a separate, co-equal member.

## 3.4 The identity constraint is operational, not a matter of preference

At instance level, POA cannot record *which* session, agent instance or individual produced or checked anything:
- `POA-EVT-001` §D: the execution context is recorded "at role level only" and "does **not** introduce instance/session-level identity".
- `OPV-003` Track A: instance identity is "a confirmed, genuine absence".
- The OPV-002 Acceptance Record, a Chief Architect ruling: "The known limitation regarding actor/instance identity and role-level authority remains preserved. No remediation is authorized by this ruling."
- `50-Mothership/src/identity.ts`, line 3: "Role-level identity only … no instance/session-level identity".
- R-1 §4 **defers** the identity/capability-grant model.

**Consequence (INFERENCE).** A verification model whose distinctness test needs *instance-level* identity **cannot be evidenced**. It would require recording a fact that POA has no mechanism to capture, contrary to K-001 §10.3 ("Honest weak provenance": unknowables are recorded as UNKNOWN, never approximated). Such a model is not operationally defensible now. **Role-level** and **source-level** distinctness, by contrast, are recordable today.

## 3.5 Constitutional constraints (values level only)

The Constitution defines no execution governance (`POA-CON-001` §4), so it constrains this question only at the level of values (INFERENCE throughout):
- **Article X** ("Assumptions with evidence"; "Excellence should never depend upon individual memory"). Deterministic, recorded checks are favored over recollection. Every option satisfies this.
- **Article VIII** ("AI improves consistency"; humans "remain responsible for … Accountability. Critical decisions"; AI "does not replace human responsibility"). Deterministic AI checking is endorsed, since that is consistency work. Attestation, a judgment act that someone answers for, belongs with an accountable human role. Verification must not become a channel for AI authority.
- **Article XIV** ("We communicate honestly. We acknowledge uncertainty. … Integrity is non-negotiable"). Labels must not overstate. A same-role re-check presented as "independently corroborated" would overstate.
- **Article VI** ("Creates greater clarity"; "Reduces unnecessary complexity"; "Strengthens trust"). Two kinds for one act, or certification machinery imported into labeling, cut against clarity.

---

# 4. What "independent verification" can legitimately mean (determinations as INFERENCE)

1. **Legitimate now: a role-distinct check.** A deterministic check run by a role recordably distinct from the producing role (for example, the Commander or Chief Architect re-running a check on an Execution-Agent observation). Recordable under POA's existing role model (`ORC-001-GOV-001`, including its "Chief Architect" terminology addendum; EVT-001 §D). *Attestation* by a distinct role becomes legitimate only once an attesting role is designated (§6, D-2′(f)).
2. **Legitimate now: source-distinct corroboration, if the producer does not control the source.** A corroborating source distinct from the source of the original observation, with both source identities recorded (§10.2). The independence belongs to the *source*, so it holds only when the producing role neither authored the corroborating source's content for the predicate nor can unilaterally alter it. Example: local `HEAD` compared with `origin/main` (`ls-remote`) is **not** source-independent when the producing role pushed that remote. It is a DERIVED check, because the remote is under the same repository-write control. That is the case `POA-DEC-SEC-001` §14 names. Separately, if either reading or the agreement judgment is non-deterministic, the corroboration is an INFERENCE until checked (§7.3; KD-08).
3. **Not independence: reproducibility.** Reproducibility is a property of the *record* (I-1), and it is what makes independent verification *possible*. When the reproducible re-check is run by the producing role, it is a **DERIVED FACT**, not a VERIFIED FACT.
4. **Not usable now: instance-level distinctness.** No POA mechanism can record it (§3.4). Two sessions of the Execution Agent are the same role, and are not "distinct" in any evidenceable sense.
5. **Not what verification claims: adversarial or tamper independence** (I-2 in its strong form):
   - That is the job of `POA-DEC-SEC-001`'s integrity layer and Independent Witness. The Witness "is a **history-divergence detector**, not a truth oracle" (§25.4, ratified).
   - **No VERIFIED FACT route claims tamper-resistance.** A compromised producer could fabricate both an observation and its check record. Reproducibility makes that detectable only if someone actually re-runs the check. A distinct-role verifier reduces the risk but does not eliminate it while both parties rely on the same repository.
6. **Never authority.** VERIFIED FACT remains evidence-grade (§9.1: "Can be authority-bearing? No"). See §7.

---

# 5. The alternatives compared (ANALYSIS)

The existing option set is the interim practice plus Options A, B and C from friction record §3 F-2. **Option B′** is a refinement of B, constructed here from existing fields only. It introduces no new kind, basis value, scope value, field or mechanism.

| Option | Meaning of "distinct" | Evidenceable under role-level identity? | Fidelity to ratified K-001 text | Depends on F-3b / ACS-001 (GAP-003)? | Consistent with DEC-SEC-001 §5 framing? | Overstatement risk |
|---|---|---|---|---|---|---|
| **Interim practice** (D-2 row, friction §8) | Same-role re-checks do not yield kind VERIFIED FACT; otherwise undefined | Yes | Faithful as far as it goes, but leaves routes 1–3 undefined | No | Yes | Low |
| **A — reproducibility reading** | The deterministic method is the verifier, whoever runs it | Yes, but only by reading "verifier identity" in §10.2 as a *method* identity (a KD-13 interpretation) | **Weak.** The method always differs from the observer, so "distinct from its producer" does no work on route 1. It also makes VERIFIED FACT and DERIVED FACT two kinds for the same act | No | **No.** §5: "Self-verification by the producing identity provides no adversarial value" | **High.** It presents I-1 as corroboration |
| **B — identity reading** (as drafted) | Same-role never qualifies; VERIFIED FACT only via an independent source or a distinct role's attestation, with the ACS-001 §D material-conflict test imported | Yes (role-level) | Good, but it drops route 1 entirely, even when a *distinct* role runs the re-check | **Yes.** It imports a pending, certification-scoped test that is caught up in GAP-003, and it takes on evidence-policy character (Chief Architect precedent) | Yes | Low |
| **C — split by method** | A for deterministic re-checks; B's material-conflict test for attestations | Partly | Inherits A's weakness on route 1 | **Yes** (attestation half) | Partly | Medium-high on route 1 |
| **B′ — role/source-distinct reading, deterministic same-role checks routed to DERIVED** | All three routes kept. Distinctness is **role-level** (routes 1 and 3) or **source-level, where the producer does not control the corroborating source** (route 2). Same-role deterministic re-checks are DERIVED FACTs. No ACS-001 import | **Yes, today, with no new identity mechanism** | **Strong.** Every route keeps its meaning; §10.2's "≠ producer" stays a real, recordable test; DERIVED keeps its ratified role | **No.** It rests on ratified K-001 text only; EVID-001 is cited as corroboration (D-3(a)) | **Yes**, consistent with it, without depending on it | Low |

## Consequences of each option

- **Interim practice.**
  - Safe, but incomplete. Future reports have no rule for when kind VERIFIED FACT *may* be claimed.
  - Leaves route 2 (independent source) and route 3 (attestation) uninterpreted.
  - Friction would recur at the first attestation or cross-source corroboration.
- **A.**
  - Relabels, as VERIFIED FACT, work that ratified K-001 already represents as DERIVED FACT. Nothing new is gained (§3.3).
  - Empties the distinctness clause for route 1.
  - Requires the Commander to interpret KD-13's "verifier identity" as a method identity.
  - Conflicts with DEC-SEC-001 §5's framing, which KD-06 cites.
  - Lets an AI's own deterministic check present as corroboration by another party, which Article XIV's honesty value weighs against.
  - Would retroactively make Phase 1's R9 eligible for a stronger kind than it claimed.
- **B.**
  - Defensible on identity, but it discards route 1 when a distinct role runs a deterministic check, which is the clearest case of all.
  - Couples F-2 to F-3b and to the unresolved GAP-003 / `ACS-001` existence contradiction.
  - Extends a certification-scoped test into labeling. The `ACS-001` GOV-005 Addendum §F declines to establish any blanket review rule ("No general 'four-eyes' or blanket independent-review rule is established"). It does not address labeling, but it gives no support for extending the test beyond certification.
- **C.**
  - Carries A's route-1 problem and B's F-3 dependency together. It does not remove either.
- **B′.**
  - Formalizes the interim practice rather than replacing it. No Phase 1 label changes.
  - Completes routes 1–3 using fields that already exist.
  - Costs nothing in reachability of organizational truth (§3.3).
  - Leaves sub-questions open and says so: which roles are authorized to attest; whether a mechanized party (verifier or producer) counts as a distinct role; and whether to adopt the route-2 control condition (§6, D-2′(d), (f), (g)).
  - Its residual cost: VERIFIED FACT becomes relatively rare in Execution-Agent-driven work. That is the honest reflection of POA having one role doing most of the observing.

---

# 6. Recommendation (RECOMMENDATION)

**Adopt Option B′ as the reading of KD-12 (§9.1) and KD-13 (§10.2), and of the KD-06 stage-7 gate as it applies to labeling.**

**Proposed determination D-2′:**

- **(a) Meaning of "distinct".** A verifier is distinct from a producer when the distinctness is recordable. That means at **role** level (routes 1 and 3), or at **source** level (route 2). Instance-level distinctness is neither required nor claimed. It remains unknowable under the preserved identity limitation (OPV-002 Acceptance Record).
- **(b) Route 1 — deterministic re-check.** This qualifies for kind VERIFIED FACT only when the re-check is executed by a role distinct from the role that produced the observation, and the §10.2 fields are recorded:
  - the verification method, including the method identity;
  - the verifier identity, meaning the role;
  - the verification time.
- **(c) Same-role deterministic re-checks are DERIVED FACTs.** They are recorded as DERIVED (§9.1, §12.5), with the method identity and version and the input assertion ids, and they inherit basis. They are admitted to organizational truth on the same terms as VERIFIED FACTs (§9.2 rule 4). They are **not** VERIFIED FACTs, whatever their reproducibility.
- **(d) Route 2 — independent source.** This qualifies when all four of the following hold:
  - the corroborating source is distinct from the original observation's source;
  - both source identities are recorded;
  - both readings and the agreement comparison are deterministic (otherwise the corroboration is an INFERENCE until checked; §7.3, KD-08);
  - **control condition:** the corroborating source's content for the predicate was not authored by the producing role, and cannot be unilaterally altered by it.

  If the control condition fails, the check is DERIVED under (c). Example: local `HEAD` vs `origin/main` when the producing role pushed the remote.

  Where the control condition comes from (INFERENCE, a separable choice for the Commander):
  - It is modeled on the ratified invariant of `POA-DEC-SEC-001` §25.1: "No actor whose credentials can coherently rewrite the authoritative POA repository may also possess unilateral authority to alter, replace, or erase the Witness record". That is used as **precedent, not governing text**, because §25.1 is scoped to the Witness.
  - If the Commander declines the condition, route 2's control requirement becomes **TBD — requires architectural decision**. It is not left open by default.

  Source distinctness asserted here does not settle either source's **source authority** (N2; D-1), which stays on its own axis.
- **(e) Route 3 — attestation.** This qualifies only when it comes from a role that is both distinct from the producing role and authorized to attest.
- **(f) Who may attest.** No existing record designates which roles are authorized to attest facts. **Route 3 cannot be claimed until a designation exists.** This follows ratified KD-17 / K-001 §13.3: where no declaration exists, POA "refuses or escalates … It never guesses". It is not a prohibition that any record states. The designation is **TBD — requires architectural decision**.
  - The Commander could make it in the same ruling that decides D-2′, which makes this a natural decision point.
  - It is not proposed here, because it may touch the identity/capability-grant model that R-1 deferred.
  - INFERENCE, for the Commander's consideration: Article VIII supports reserving attestation to accountable human roles.
  - No record designates the Execution Agent as an attesting role, so route 3 is not available to it.
- **(g) Mechanized parties.** Two questions are open on the same deferred identity/capability-grant track, both **TBD — requires architectural decision**:
  - whether a mechanized *verifier* (for example, CI, or a separately registered runtime principal) counts as a role distinct from the Execution Agent for route 1;
  - whether a mechanized *producer* counts as a role distinct from the Execution Agent. For Organization-A facts, the producer is an Observation Adapter (§10.2 "adapter identity/version"). So whether an Execution-Agent re-check of adapter output is role-distinct is the same question.

  Until they are decided, such checks are DERIVED under (c).
- **(h) Scope rendering, using existing values only.** The §12.1 scope value "independently corroborated" is used **only** for VERIFIED FACTs under (b), (d) or (e). It is never used for DERIVED re-checks under (c). The route is disclosed in §10.2's existing "verification method" field. No new label value is created.
- **(i) No import of the material-conflict test.** The `ACS-001` GOV-005 §D material-conflict test is **not** imported. Role-distinctness is the ratified K-001 test. Whether attestations should *additionally* meet a material-conflict test is left to the F-3b governance track. It is not a precondition of D-2′.
- **(j) The interim practice becomes the rule.** The Phase 1 practice preserved by the D-2 row is confirmed and stated as a general rule under (c). No Phase 1 report is relabeled.

---

# 7. Keeping verification separate from authority

These separations hold under every option. D-2′ restates them; it does not relax any of them:

1. **Verification ≠ authority** (N1 ≠ N3). VERIFIED FACT is evidence-grade (§9.1). It becomes organizational position only when a synchronized DECISION cites it (§9.2 rule 1; §10.2 DECISION provenance).
2. **Attestation ≠ decision.** An attestation under route 3 is corroboration of a fact. It is not a DECISION, even when the attesting person also holds decision authority. A DECISION needs its own authority basis, a record, and synchronization (§9.1; `POA-ADR-001`). One person can perform both acts, but only as two separately recorded acts.
3. **Verification ≠ integrity ≠ witnessing.** A VERIFIED FACT label is not tamper-evidence. Integrity and history-divergence detection belong to `POA-DEC-SEC-001` (§15; §25.4 ratified: the Witness does not establish "Evidence Correctness, Evidence Authority, the truth of the witnessed content").
4. **Verification ≠ source authority** (N1 ≠ N2). A VERIFIED FACT can come from a NON-AUTHORITATIVE source (friction record §1.3; D-1).
5. **Verification ≠ certification or acceptance.** Nothing in D-2′ creates or borrows certification authority (`ACS-001`) or acceptance authority (`POA-ACC-001`).

---

# 8. Conflicts identified, not resolved (`CLAUDE.md` Rule 8)

- **C-1 — The KD-06 gate cites a candidate section with a different concern.**
  - K-001 §6.1 stage 7 (ratified with qualification) grounds "Verifier distinct from producer" in `POA-DEC-SEC-001` §5. §5 is part of a document that remains a decision candidate as a whole (§24), and R-1's KD-10 and KD-11 qualifications treat DEC-SEC-001 sections as "referenced, not ratified".
  - §5's concern is adversarial (evidence tamper-detection). K-001 §9.1's concern is epistemic (corroboration).
  - B′ is *consistent with* §5 but does not *depend on* it: B′ rests on K-001's own ratified words.
  - Whether §5 governs the knowledge-plane gate at all is not decided here.
- **C-2 — EVID-001 §D's "independent reviewer" is a reconstruction test, not a verification event.** Reading it as a verifier criterion (Option A's basis) conflates I-1 with I-2 (§3.1). This candidate records the conflation. It does not amend EVID-001, which is acceptance-pending (F-3b).
- **C-3 — Nobody is designated to attest.** K-001 §9.1 names attestation "by an authorized role", but no record designates such a role for facts. Recorded as TBD under D-2′(f).
- **C-4 — The identity limitation constrains verification.** The preserved role-level identity limitation (OPV-002 Acceptance Record) limits what verification can prove. This candidate operates within that limitation and does not propose remedying it; the identity/capability-grant model is deferred (R-1 §4).

---

# 9. Worked example: Phase 1 R9

R9 (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-PHASE-1-REPOSITORY-STATE-LABELED-OBSERVATION-REPORT.md`) computed the full SHA-256 of `POA-DEC-ORG-KNOWLEDGE-001-DECISION.md` and compared it with the value pinned in the R-1 ADR record.

- **What was actually verified is a prefix match.** The full 64-hex digest `ba19e96fc6499a41f7a2c18c1c07e74ee7d3d73f8543848fff4fecc1a197e1e5` was compared against the 16-hex **prefix** `ba19e96fc6499a41…` pinned in ADR-001. The predicate is "the file's digest begins with the pinned prefix", not "the file's digest equals a pinned full digest". This holds under every option.
- **Under B′:**
  - The digest is a SOURCE-OBSERVATION (method `sha256sum`), basis VERIFIED (as-committed).
  - The prefix comparison is a **DERIVED FACT**: a deterministic method, with the inputs being the observed digest and ADR-001's pinned prefix. Basis VERIFIED is inherited.
  - The kind is **not** VERIFIED FACT, because producer and re-checker are the same role. This is exactly how Phase 1 labeled it, so nothing changes.
- **How R9 could become a VERIFIED FACT:**
  - the Commander or Chief Architect re-runs the digest (D-2′(b));
  - an attesting role, once designated, attests it (D-2′(e)–(f));
  - a mechanized verifier is recognized as a distinct role (D-2′(g)).
- **Under Option A,** R9 would already be a VERIFIED FACT, with no gain over its DERIVED standing (§3.3).

---

# 10. Deciding authority and dependencies

| Item | Deciding authority | Depends on F-3b? | Depends on Q3? | Depends on Phase 2? |
|---|---|---|---|---|
| D-2′ (a)–(e), (h)–(j) | **Commander**, as an interpretation of ratified KD-12 and KD-13, and of the KD-06 gate as it applies to labeling (the Q1 precedent) | **No.** EVID-001 is cited only as corroboration (D-3(a)) | **No** | **No** |
| D-2′ (f) (who may attest) | Commander; it touches the deferred identity/capability-grant model | No | No | No |
| D-2′ (g) (mechanized verifiers and producers) | Commander; the same deferred track | No | No | No |
| D-2′ (d) control condition | Commander; it can be adopted or declined separately (declining makes it TBD) | No | No | No |
| Options B / C (for comparison) | Commander, plus evidence-policy character (Chief Architect precedent, ESR-001 §6), because they import ACS-001 | **Yes** | No | No |

- **Q3 is not touched.** Nothing here concerns where Organization-A knowledge lives, or tier authority (R-1 §4).
- **Phase 2 is not authorized.** Nothing here is a Source Declaration, an adapter, or a store. D-2′ governs *labels* in documents, which is Phase 1 practice.
- **Nothing is implemented.** No code, schema, storage, connector or UI is created. `identity.ts`, `witness.ts` and `evidence.ts` are unmodified.

---

# 11. Out of scope

The following are not addressed here:
- Q3 and Q2–Q14.
- Phase 2 and every later §24 phase.
- The identity/capability-grant model, beyond naming (f) and (g) as dependent on it.
- F-3b (acceptance of EVID-001, ACC-001, EVT-001, ACS-001 and INTEGRITY-CONTROL-001) and the GAP-003 contradiction.
- F-4, F-6 and F-7.
- The standing of `POA-DEC-SEC-001` as a whole.
- The OBS-001 source-authority tension (D-1(d)).
- K1–K4 and K7–K9.

---

# 12. Validation (performed 2026-09-25)

| Check | Result |
|---|---|
| `HEAD == origin/main` before writing | `5896b6f` == `5896b6f` |
| Staged changes | 0 |
| Modified tracked files | `CLAUDE.md` only (pre-existing; untouched) |
| Files modified by this work | **None.** This file is the only addition, and it is untracked and uncommitted |
| K-001, friction decision record, `POA-ADR-001`, `POA-PJR-001`, Phase 1 reports | Unmodified |
| Code, schema, storage, connectors, UI, Phase 2, Q3 | None |
| New artifact ID, family, kind, basis value, scope value or field | None. B′ uses §9.1 kinds, §10.2 fields and §12.1 scope values as ratified |

---

# Final Verdict

**Reproducibility makes a claim verifiable; it does not make it independently verified. POA can defend independence at role level and at source level, both of which its mechanisms can record. It cannot defend independence at instance level, which nothing in POA can record.**

- The defensible model is **B′**:
  - keep all three §9.1 routes;
  - require recordable role-level distinctness, or source-level distinctness where the producer does not control the corroborating source;
  - record same-role deterministic re-checks as the DERIVED FACTs they already are under ratified K-001.
- **The cost of the strict reading is near zero.** Ratified K-001 gives DERIVED facts the same standing in organizational truth as VERIFIED facts.
- **Honesty is the gain.** A label never presents an actor's own re-check as corroboration by another party.
- **The model is self-contained.** It needs no new mechanism, imports no certification test, has no F-3b or Q3 dependency, and changes no Phase 1 label.
- **Sub-questions are left openly TBD:** who may attest, and whether a mechanized verifier or producer counts as a distinct role. The route-2 control condition is offered as a separable choice.
- **Verification stays evidence-grade throughout.** It is never authority, never integrity, and never a decision.

Every determination is PROPOSE, and none is self-executing.

*End of decision candidate as drafted. Materialized 2026-09-25 by the Execution Agent.*

---

# 13. Commander Rulings (2026-09-25)

This section is additive. Sections 1–12 are unchanged apart from the title and the Artifact Identity rows above.

**Commander instruction, quoted verbatim:**

> "Proceed to finalize F-2 with these rulings:
>
> B′ adopted.
> Independent-source control condition adopted.
> No attesting role designated.
> CI / adapters / mechanized checkers remain unresolved pending the identity/capability-grant track.
> Preserve the distinction between reproducibility, verification, independence, authority and attestation.
> Do not resolve Q3.
> Do not authorize Phase 2.
> Do not modify PJR-001.
> Do not change Phase 1 reports.
> No code or infrastructure implementation.
>
> After that, prepare the Commander decision record in POA-ADR-001, but stop before committing or pushing so we can inspect the exact wording."

## 13.1 Rulings

| Determination | Ruling | Effect |
|---|---|---|
| **D-2′ (a)** Meaning of "distinct" | **ADOPTED** (B′) | Distinctness is recordable **role-level** (routes 1 and 3) or **source-level** (route 2) distinctness. Instance-level distinctness is neither required nor claimed |
| **D-2′ (b)** Route 1 — deterministic re-check | **ADOPTED** | Kind VERIFIED FACT only when the re-check is executed by a role distinct from the producing role, with verification method (including method identity), verifier identity (role) and verification time recorded (K-001 §10.2) |
| **D-2′ (c)** Same-role deterministic re-checks | **ADOPTED** | Recorded as DERIVED FACT (K-001 §9.1, §12.5), inheriting basis. Never VERIFIED FACT, however reproducible |
| **D-2′ (d)** Route 2 — independent source, **including the control condition** | **ADOPTED** | Qualifies only when the corroborating source is distinct, both source identities are recorded, readings and comparison are deterministic, **and the producing role neither authored the corroborating source's content for the predicate nor can unilaterally alter it**. Otherwise the check is DERIVED under (c). The control condition is modeled on `POA-DEC-SEC-001` §25.1 as precedent, not as governing text. Source distinctness does not settle source authority (D-1) |
| **D-2′ (e)** Route 3 — attestation | **ADOPTED** | Qualifies only from a role that is both distinct from the producing role and authorized to attest |
| **D-2′ (f)** Who may attest | **NO ATTESTING ROLE DESIGNATED** | Route 3 cannot be claimed by any role until a designation is made by a separate, explicit decision. This ruling designates no role; it neither designates nor forecloses any particular role. No record designates the Execution Agent, so route 3 is not available to it |
| **D-2′ (g)** Mechanized verifiers and producers (CI, Observation Adapters, mechanized checkers) | **UNRESOLVED — pending the identity/capability-grant track** (deferred by R-1 §4) | Until decided, such checks are DERIVED under (c) |
| **D-2′ (h)** Scope rendering | **ADOPTED** | The §12.1 scope value "independently corroborated" is used only for VERIFIED FACTs under (b), (d) or (e), never for DERIVED re-checks. The route is disclosed in §10.2's existing "verification method" field. No new label value |
| **D-2′ (i)** No material-conflict import | **ADOPTED** | The `ACS-001` GOV-005 §D test is not imported. Any additional material-conflict requirement for attestation stays on the F-3b governance track |
| **D-2′ (j)** Interim practice | **ADOPTED** | The Phase 1 practice preserved by the friction record's D-2 row is confirmed as the general rule under (c). No Phase 1 report is relabeled |

**Effect on the friction decision record.** That committed record (`023a85a`) and its ADR-001 record show D-2 as "UNRESOLVED — preserved". They are **not edited**; they remain a true record of that moment (`POA-INTEGRITY-CONTROL-001` §L(b) historical-integrity discipline). D-2 is resolved by these rulings and by the ADR-001 record that cites this file.

## 13.2 Distinctions preserved (per the Commander's instruction)

| Concept | What it is | What it is not |
|---|---|---|
| **Reproducibility** | A property of the *record*: method and inputs recorded so any reviewer could re-run the check (I-1; `POA-EVID-001` §D) | Not verification, and not independence. It makes a claim *verifiable*, not *verified* |
| **Verification** | A corroboration act producing basis VERIFIED (by a DERIVED check) or kind VERIFIED FACT (by routes 1–3 under D-2′) | Not authority, not integrity or tamper-evidence, not source authority, not certification or acceptance |
| **Independence** | Recordable distinctness of the verifier from the producer: role-level, or source-level under the control condition | Not instance-level. Not adversarial/tamper independence, which belongs to `POA-DEC-SEC-001` (the Witness is a history-divergence detector, not a truth oracle, §25.4) |
| **Authority** | The standing of a DECISION, which derives from its authority basis and synchronization (K-001 §9.1; GOV-015 "AUTHORITY BASIS") | Never conferred by verification. VERIFIED FACT remains evidence-grade and becomes organizational position only when a synchronized DECISION cites it |
| **Attestation** | Corroboration of a fact by an authorized, distinct role (route 3). Currently unavailable: no role is designated | Not a DECISION, even when the attesting person also holds decision authority. The two acts must be recorded separately |

## 13.3 Not decided by these rulings

- Designation of any attesting role (D-2′(f)).
- Mechanized verifiers and producers (D-2′(g)), and the identity/capability-grant model generally.
- Q3 (unchanged).
- Phase 2 (not authorized; no implementation).
- The standing of `POA-DEC-SEC-001` as a whole, including whether §5 governs the knowledge-plane gate (C-1).
- Which four §9.2 rules KD-12 ratifies (§3.3 disclosed ambiguity).
- F-3b (acceptance of the pending GOV standards) and the GAP-003 contradiction.
- F-4, F-6 and F-7; K1–K4 and K7–K9.

**Unchanged by these rulings:** `POA-PJR-001`, K-001 (SHA-256 `ba19e96f…`), the Phase 1 reports, the friction decision record, and all code (`50-Mothership/`, `30-Products/`).

**Recorded wording.** The "Effect" column restates §6 in condensed form, drafted by the Execution Agent. The Commander adopted B′ and the control condition as drafted, so §6 controls wherever the two differ, **except for D-2′(f)**. There the controlling text is the Commander's ruling "No attesting role designated", as rendered above.

*End of POA-DEC-ORG-KNOWLEDGE-001 F-2 Independent Verification Decision Record.*
