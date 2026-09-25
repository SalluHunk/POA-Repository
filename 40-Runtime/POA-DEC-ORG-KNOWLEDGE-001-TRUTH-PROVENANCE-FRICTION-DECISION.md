# POA-DEC-ORG-KNOWLEDGE-001 — Truth/Provenance Friction Disposition — Decision Record

## Disposition of Phase 1 friction items F-1, F-2, F-3, F-5, F-8 against existing POA mechanisms

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact | Decision record filed under the `POA-DEC-ORG-KNOWLEDGE-001` mission prefix. **No new artifact ID is minted.** Assigning one, if the Commander wants a standalone record, is left to the Commander (`CLAUDE.md` Rule 5) |
| Status | **Decided in part (Commander, 2026-09-25). D-1, D-3, D-5 and D-8 were ADOPTED AS PROPOSED; D-2 (F-2) remains UNRESOLVED.** Recorded as the "POA-DEC-ORG-KNOWLEDGE-001 Truth/Provenance Friction Disposition Decision Record (2026-09-25)" in `20-Shared/DECISIONS/POA-ADR-001.md`; see §8 below. Sections 1–7 are kept exactly as drafted when this was a candidate, and their "PROPOSE" and "RECOMMENDATION" wording is historical. Not Approved, Accepted, or Certified as an artifact |
| Filename | Renamed, while still untracked and never committed, from `…-TRUTH-PROVENANCE-FRICTION-DECISION-CANDIDATE.md` |
| Authority | Commander instruction in session, 2026-09-25: trace the Phase 1 friction findings against existing POA mechanisms and produce a decision-candidate ADR, not implementation |
| Subject | Friction items F-1, F-2, F-3, F-5 and F-8 of `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-PHASE-1-LABELING-DISCIPLINE-COMPLETION-REPORT.md` (committed `0f37a06` / `3f6b2b6`) |
| Repository baseline | `HEAD == origin/main == 3f6b2b6`; nothing staged; `CLAUDE.md` modified locally (preserved, untouched); untracked material preserved |
| Nature | Architecture analysis only. **No code, database, connectors, Mothership UI, Phase 2 execution, or Q3 work.** `POA-PJR-001`, `POA-DEC-ORG-KNOWLEDGE-001` (K-001, SHA-256 `ba19e96f…`), the Phase 1 reports and `POA-ADR-001` are unmodified. Nothing is appended to ADR-001, because no decision has been made |

**How to read the claims in this document** (Phase 1 discipline, applied to itself):
- Each **disposition** is ANALYSIS.
- Each **"Proposed determination"** is RECOMMENDATION.
- Each **classification verdict** (sufficient / needs extension / new decision / documentation ambiguity) is INFERENCE. Producer: Claude Opus 5.5 (`claude-opus-5-5`), Execution Agent, 2026-09-25; method class: non-deterministic analysis over the cited sources; reasoning text excluded (K-001 §10.2).
- Quotations and status readings of cited artifacts are SOURCE-OBSERVATION, basis VERIFIED (as-sourced), freshness UNKNOWN (no declared cadence). They were read from disk at `3f6b2b6` on 2026-09-25.

None of these labels creates authority.

---

# 1. The boundary this candidate preserves

> Facts, observations, decisions, authority, verification, inference and analysis must not collapse into one another. (Commander instruction, 2026-09-25)

## 1.1 Diagnosis

Each Phase 1 report had one **"Source authority"** column, and one **"Basis"** column that also carried verification. Tracing the friction items shows that the column was being asked to hold **several distinct existing concepts at once**. Four of the five items (F-1, F-3, F-5, F-8) arise from that conflation, and F-2 arises from a conflict between existing mechanisms. No item shows a missing concept.

## 1.2 Non-equivalence table (existing notions only; no new vocabulary)

Following the precedent of the GOV-015 Semantic Boundary Addendum, which separates concepts that a single field label had been conflating (`POA-EVID-001`, GOV-015 Addendum §2):

| # | Notion | Question it answers | Existing home |
|---|---|---|---|
| N1 | **Epistemic basis / verification** | How is this claim known, and has someone other than its producer corroborated it? | K-001 §12.1 (basis axis); §9.1 (VERIFIED FACT kind) |
| N2 | **Source authority (per predicate)** | Is the *source* of this claim authoritative for this predicate? | K-001 §12.4 (organizational declaration) |
| N3 | **Authority basis** | Why is this decision or artifact legitimate? | GOV-015 Addendum §2 "AUTHORITY BASIS" (an artifact's own Authority field); K-001 §10.2 DECISION provenance ("authority basis") |
| N4 | **Retention class** | Must this material be retained authoritatively? | ESR-001 Decision Record (ADR-001), Authority-bearing vs Provenance-only; `POA-EVID-001` §B–§D |
| N5 | **Acceptance state of a governing standard** | Has the standard that defines a term been accepted? | `POA-ACC-001` §D (AUTHORIZED / MATERIALIZED / APPROVED / ACCEPTED / SYNCHRONIZED / CERTIFIED) |
| N6 | **Provenance / Repository Reference** | Where did this come from, and where can it be reconstructed? | GOV-015 Addendum §2 "PROVENANCE", "REPOSITORY REFERENCE"; K-001 §10 |

## 1.3 Non-equivalence rules

Each rule restates an existing statement; no rule is new:
- N1 ≠ N2. A VERIFIED claim can come from a NON-AUTHORITATIVE source, and an AUTHORITATIVE source can make an unverified claim (K-001 §7.2 "verified as-sourced is a scoped claim").
- N1 ≠ N3. Verification never confers authority: a VERIFIED FACT remains evidence-grade (K-001 §9.1, "Can be authority-bearing? No").
- N2 ≠ N3. Source authority covers a *source* for a *predicate*. Authority basis covers a *decision or artifact* (GOV-015: authority basis "is never satisfied merely by naming Provenance or Evidence material").
- N3 ≠ N4. Being Authority-bearing for **retention** says the material must be kept. It does not make that material a source of organizational authority (ESR-001: "Synchronization is a consequence … and must not itself determine authority").
- N5 ≠ N3. A standard's acceptance state is a fact about the standard. It does not by itself grant or deny any decision's authority basis (`POA-ACC-001` §D: acceptance "SHALL NOT, by itself" authorize downstream work).
- N6 ≠ N3 and N6 ≠ N4. Provenance and a Repository Reference satisfy neither authority basis nor retention by themselves (GOV-015 Addendum §2).

---

# 2. Standing of every mechanism relied on

Each disposition below depends on the standing of the mechanisms it cites. The standing is shown so that no disposition silently borrows authority.

| Mechanism | Location | Standing (as observed at `3f6b2b6`) |
|---|---|---|
| `POA-ADR-001` (Decision Record specification) | `20-Shared/DECISIONS/` | **Accepted (Chief Architect)**, by the OPV-002 Acceptance Record, 2026-08-15 |
| ESR-001 Evidence Retention Decision | ADR-001 Decision Record | Chief Architect decision (evidence-policy authority, per its §6) |
| CTD-001; CTD-001 Scope Interpretation (Q1); R-1 Ratification; Phase 1 Authorization | ADR-001 Decision Records | Commander decisions |
| `POA-DEC-ORG-KNOWLEDGE-001` v1.1.0 (KD-12, KD-15) | `40-Runtime/` | **Ratified architecture** (R-1, Act 2). KD-12 and KD-15 ratified without qualification |
| `ORC-001-GOV-001` | `20-Shared/GOV/` | **APPROVED — Effective Immediately** |
| `POA-EVID-001` (incl. GOV-015 and ESR-001 Addenda) | `20-Shared/GOV/` | Materialized — **acceptance pending** |
| `POA-ACC-001` | `20-Shared/GOV/` | Materialized — **acceptance pending**. It was nonetheless *exercised* by the OPV-002 Acceptance Record, which states that acceptance of ACC-001 itself "would require its own separate ruling, not granted here" |
| `POA-EVT-001` | `20-Shared/GOV/` | Materialized — **acceptance pending**; "not yet operationally exercised" |
| `ACS-001` (incl. GOV-005 Addendum) | `20-Shared/GOV/` | Materialized — **acceptance pending**. **CONTRADICTED:** `GAP-REGISTER-001` GAP-003 (OPEN) states "`ACS-001` … does not exist anywhere in the authoritative source", yet the file exists. This candidate does not resolve that |
| `POA-INTEGRITY-CONTROL-001` | `40-Runtime/` | Materialized — **acceptance pending** |
| `POA-OBS-001` (+ Precision Revalidation Addendum) | `40-Runtime/` completion report | Mission report. K-001's Reuse Map records it as a "validated candidate contract (committed)". Treated here as **precedent and provenance**, not as authority |
| `GAP-REGISTER-001` GAP-005 rule | `20-Shared/GOV/` | A tracked register entry: uncertified artifacts "may be referenced informationally, must never be presented as certified" |

**Consequence (INFERENCE).** Any disposition resting on EVID-001, ACC-001, EVT-001, ACS-001 or INTEGRITY-CONTROL-001 is **conditional on F-3's disposition**, and says so where it applies.

---

# 3. Per-item dispositions

Classification key: **(S)** existing mechanism sufficient · **(X)** existing mechanism needs extension · **(N)** genuinely new architectural decision required · **(D)** documentation ambiguity only.

## F-1 — Source authority has nothing to bind to

**Notion:** N2. Phase 1 also risked conflating it with N3 and N4.

**Finding restated.** K-001 §12.4 requires a per-predicate *organizational declaration*. No declaration existed for the predicates observed in Phase 1, so the axis read UNKNOWN in every row.

**Trace.** The Phase 1 predicates fall on both sides of the line R-1 Act 1 draws between POA's Creator/Steward role and Paravyoma as Organization A. The two sides trace differently.

**F-1a — POA's own governance and repository predicates** (HEAD, commit ancestry, decision-record content, synchronization):

| Candidate existing basis | What it actually says | Usable as a §12.4 declaration? |
|---|---|---|
| `POA-ADR-001` §A (Accepted) | It is the specification for recording architectural and governance decisions | It designates *where decisions are recorded*. That is closest to a §12.4 declaration for the predicate "content of a recorded decision", but §12.4 speaks of an *organizational* declaration, and POA governance is not an organization in the Act 1 sense |
| `POA-ACC-001` §G (pending) | "It does not record the decision itself (`POA-ADR-001` governs that)" | The same designation; conditional on F-3 |
| `POA-ACC-001` §D SYNCHRONIZED (pending) | "the commit's own existence on `origin/main`" | Defines a state, not a source's authority; conditional on F-3 |
| `CLAUDE.md` Rule 1 | "This repository is the authoritative source of organizational truth" | Repository-wide rather than per-predicate. The file self-describes as encoding, not creating, authority. **Not usable** |
| ESR-001 "designated authoritative-state-reporting mechanism for its artifact type" | A **retention** criterion (N4) | **Not usable.** Using it would collapse N4 into N2, contrary to §1.3 |

**Disclosed tension (not resolved).** `POA-OBS-001` Revalidation §7 assigned source authority from a source's **self-designation** ("the sheet's own text designates itself 'the formal client acceptance record'") and from **platform nature** ("live platform metadata", "cryptographically-anchored"). Ratified §12.4 requires an **organizational declaration**. Both are precedents, and they differ.

**F-1b — Paravyoma-as-Organization-A business predicates** (financial, sales, workforce, and so on). §12.4's design is exactly right for these. K-001 §17 finding 2 and §24 Phase 2 already name the mechanism that would supply the declarations: the **Paravyoma Source Declaration**. The declarations do not yet exist, so UNKNOWN is the correct label. The labels in Phase 1 were not defective.

**Classification (INFERENCE).**
- **F-1a — (X):** the §12.4 mechanism needs an explicit extension or interpretation stating what counts as the declaration for POA-scope predicates. The nearest candidate is the governing specification's designation of its recording mechanism (ADR-001 §A, Accepted). An interpretation of ratified KD-15 is a Commander matter (the Q1 precedent).
- **F-1b — (S):** existing, ratified design; instances are pending Phase 2.

**Proposed determination D-1 (RECOMMENDATION).**
- **(a)** For POA-scope predicates, a governing specification's own designation of the mechanism that records a predicate may serve as the §12.4 declaration for that predicate. The standing of that specification (§2) is disclosed with the label. Where no such designation exists, the axis remains UNKNOWN.
- **(b)** D-1(a) confers no **authority basis** (N3) and implies no **retention class** (N4).
- **(c)** For Organization-A predicates, §12.4 applies as ratified. UNKNOWN persists until a Source Declaration exists.
- **(d)** The OBS-001 self-designation / platform-nature precedent is recorded as a tension for separate decision. It is not adopted by D-1.

**Dependencies.**
- F-1b depends on Phase 2, which is gated on **Q3** (R-1 §4). F-1a does **not** depend on Q3.
- D-1(a) cites ACC-001 only as corroboration; ADR-001 §A (Accepted) is sufficient by itself.

## F-2 — Independent verification ("verifier distinct from its producer")

**Notion:** N1. It must not leak into N3.

**Finding restated.** K-001 §9.1 defines VERIFIED FACT as "corroborated by a verifier distinct from its producer: deterministic re-check against primary evidence, an independent source, or attestation by an authorized role". Phase 1 could not tell whether a later Execution-Agent session re-checking an earlier session's SHA-256 counts as distinct.

**Trace. The existing mechanisms conflict; they are not silent.**

| Mechanism | Standing | What it implies |
|---|---|---|
| K-001 §9.1 | Ratified (KD-12) | One reading: a *deterministic re-check against primary evidence* is itself the distinct verifier. The independence lies in the method's reproducibility, not in who runs it |
| `POA-EVID-001` §D | Pending | The test is whether "a future **independent reviewer**" could reconstruct the state. Reproducibility, not identity, is the criterion |
| `POA-EVT-001` §D | Pending | Execution identity is recorded **at role level only**. It "does **not** introduce instance/session-level identity" (per `OPV-003` Track A). Two sessions of the Execution Agent are the **same role** |
| OPV-002 Acceptance Record §5 (in Accepted ADR-001) | Chief Architect ruling | "The known limitation regarding actor/instance identity and role-level authority **remains preserved**" |
| `ACS-001` GOV-005 Addendum §D–§F | Pending; scoped to **certification** | A **material-conflict** test, "not role overlap in the abstract"; "No general 'four-eyes' or blanket independent-review rule is established" |
| `POA-ACC-001` §F | Pending | *Recommends* reuse of the ACS-001 test by reference for acceptance, and states it is "**not activated or mandated**" |

**Trace result.**
- Under the reproducibility reading (K-001 §9.1 and EVID-001 §D), a recorded, deterministic, re-runnable check against primary evidence qualifies regardless of which session ran it.
- Under the identity reading, POA's accepted-as-preserved role-level identity limitation (EVT-001; OPV-002) means distinctness between same-role sessions **cannot be established at all**.
- Importing the ACS-001 material-conflict test would be an **extension** beyond certification. ACC-001 §F shows that the extension is contemplated but not activated.

**Classification (INFERENCE): (X).** The mechanisms needed exist but point in different directions, and choosing among them extends at least one beyond its current scope. No new mechanism is required.

**Proposed determination D-2: options, with no preference stated** (RECOMMENDATION of the option set only):
- **Option A — reproducibility reading.** A deterministic re-check against primary evidence, with method and inputs recorded so any reviewer can rerun it (EVID-001 §D), constitutes the distinct verifier regardless of actor identity. This is consistent with EVT-001's role-level identity. It covers deterministic checks only.
- **Option B — identity reading.** Same-role re-checks never qualify. VERIFIED FACT arises only from an independent source or from attestation by a distinct authorized role, with ACS-001 GOV-005 §D's material-conflict test applied by reference (activating the ACC-001 §F recommendation for this purpose).
- **Option C — split by method.** Option A for deterministic re-checks, and Option B's material-conflict test for attestations.

**Boundary constraint (applies to every option).** A VERIFIED FACT remains evidence-grade (N1). No independence rule may make verification authority-bearing (N3), and none may import certification authority (ACS-001).

**Deciding authority.** This is the Commander's to decide, as an interpretation of ratified KD-12. Options B and C also extend a certification-scoped test, which has evidence-policy character (Chief Architect precedent: ESR-001 §6).

**Dependencies.** Options B and C depend on the standing of ACS-001 and ACC-001, and therefore on F-3. There is no Q3 dependency.

## F-3 — Dependency on acceptance state

**Notion:** N5.

**Finding restated.** `POA-ACC-001`, whose status is "acceptance pending", defines SYNCHRONIZED and names ADR-001 as the decision-recording mechanism. Phase 1 could not tell whether a definition in a not-yet-accepted standard may ground a label, so it downgraded the affected basis to SELF-DECLARED.

**Trace.**
- **Existing disclosure rule.** `GAP-REGISTER-001` GAP-005: uncertified artifacts "may be referenced informationally, must never be presented as certified".
- **Existing acceptance mechanism, already exercised.** The OPV-002 Acceptance Record accepted ADR-001 *by exercising ACC-001 while ACC-001 was itself pending*. It stated that acceptance of ACC-001 or EVID-001 "would require its own separate ruling, not granted here".
- **Existing practice.** Recorded decisions have invoked pending standards operationally:
  - the ESR-001 Decision extends EVID-001 §B–§D;
  - the R-1 Ratification applies "ESR-001 test (1)" and `POA-EVID-001` §C.
- **Existing states.** ACC-001 §D separates MATERIALIZED from ACCEPTED, and states that acceptance does not, by itself, authorize downstream work.
- **What no record states** is a general rule on whether a MATERIALIZED-but-not-ACCEPTED GOV standard is binding.

**Trace result (INFERENCE).** There are two separable questions.
- **F-3a — labeling.** Existing mechanisms are sufficient. A label that depends on a term defined in a standard discloses that standard's acceptance state (the GAP-005 pattern), and never upgrades basis because of it. Phase 1's SELF-DECLARED downgrade in G3 was a conservative application of this. Whether "SELF-DECLARED" or "VERIFIED (as-sourced), definition acceptance-pending" is the more precise rendering is a documentation choice for D-3(a).
- **F-3b — the general standing of pending GOV standards.** No new *mechanism* is needed: the acceptance mechanism exists and has been exercised (OPV-002). What is missing is **acceptance acts** for EVID-001, ACC-001, EVT-001, ACS-001 and INTEGRITY-CONTROL-001, or an explicit ruling on the standing of pending standards. This is a governance question **outside knowledge-architecture scope**.

**Classification (INFERENCE).**
- **F-3a — (S)**, with a **(D)** rendering choice.
- **F-3b — (S) as a mechanism.** Resolving it is a governance decision about existing standards: acceptance rulings under ACC-001, by the authority ACC-001 §C names (Commander or Chief Architect). It is **not** a new architectural decision within K-001.

**Proposed determination D-3 (RECOMMENDATION).**
- **(a)** Labels disclose the acceptance state of any governing standard whose definition they rely on. Basis is never upgraded on the strength of a pending standard.
- **(b)** F-3b is referred for separate acceptance rulings under `POA-ACC-001`, following the OPV-002 precedent. It is not decided within the knowledge architecture.
- **(c)** The GAP-003 / `ACS-001` existence contradiction is referred to the same governance track. It is not resolved here.

**Dependencies.** D-1(a)'s corroboration, D-2 Options B and C, and D-5 (partly) are conditional on F-3b. There is no Q3 dependency.

## F-5 — Restating a recorded decision

**Notions:** N3, N4 and N6. The question is how to keep them apart when one report restates another record's decision.

**Finding restated.** K-001 §9.1 defines DECISION as the authorized act. A report that restates a recorded decision needed to mark that it is not itself the decision, so Phase 1 used the qualifier "DECISION (as recorded)".

**Trace. The existing mechanisms already separate the layers.**

| Layer | Existing concept | Source |
|---|---|---|
| The underlying claim (for example, "R-1 ratified KD-15") | Kind **DECISION** | K-001 §9.1 |
| Why that decision is legitimate | **Authority basis**: the deciding authority and the decision record | GOV-015 §2; K-001 §10.2 DECISION provenance fields |
| The reading of the decision record by the reporter | **SOURCE-OBSERVATION**, basis VERIFIED (as-sourced), with scope "the record states it" | K-001 §9.1, §12.1 |
| The restating report itself | **Provenance** + **Repository Reference**; Provenance-only for retention unless a decision cites it | GOV-015 §2; ESR-001; K-001 §9.2 rule 5 |
| Fidelity of the restatement | Restated inline and reconstructible | `POA-EVID-001` §C.4; `POA-ACC-001` §C DECISION field ("restated inline") |

**Classification (INFERENCE): (D) with (S).** Every layer has an existing home. K-001 §9.1 simply does not say how to *render* a restated claim. "DECISION (as recorded)" is one rendering of these existing semantics, not a new label.

**Proposed determination D-5 (RECOMMENDATION).** Acknowledge the following as the reading of KD-12 for restatements:
- **(i)** The restated claim keeps kind DECISION, and its authority basis is the cited decision record, never the restating report.
- **(ii)** The act of reading it is a SOURCE-OBSERVATION of that record.
- **(iii)** The restating report is Provenance and a Repository Reference, and confers nothing.
- **(iv)** Any rendering that shows (i) and (ii) distinctly is acceptable. No new label value is created.

**Dependencies.** The fidelity element cites EVID-001 §C.4 and ACC-001 §C, both pending (F-3b); the layer separation itself rests on ratified K-001 and the GOV-015 vocabulary. There is no Q3 dependency.

## F-8 — The source-authority axis for kinds that have no source

**Notions:** N2 (and whether N1 composition may carry it).

**Finding restated.** §12.4 is defined per *source* predicate, so it is undefined for claims with no source, such as an INFERENCE produced by the Execution Agent. Phase 1 improvised "n/a (not sourced)".

**Trace (ratified text only).**
- K-001 §9.1: INFERENCE, ANALYSIS and RECOMMENDATION are produced by a Category A actor, and INFERENCE "Can be authority-bearing? **Never**".
- K-001 §9.2 rule 1 (no self-promotion) and rule 2 (no basis laundering).
- K-001 §10.2: INFERENCE provenance consists of the input assertion ids, the producer, the method class and the time. It has no source field.
- K-001 §12.5: the composition rule (inherit the weakest basis and worst freshness) is stated **for DERIVED only**.
- `EIA-001` Assessment-003: inference never becomes truth by itself.

**Trace result (INFERENCE).** Inheritance by analogy to §12.5 would let an INFERENCE whose inputs are AUTHORITATIVE *present as* AUTHORITATIVE. That is the laundering that §9.2 rules 1–2 forbid, in a different form. The ratified text therefore supports reading §12.4 as **applying only to claims that have a source**:
- SOURCE-OBSERVATION and VERIFIED FACT, directly;
- DERIVED FACT, through its inputs under the §12.5 composition rule;
- for INFERENCE, ANALYSIS and RECOMMENDATION, the axis is **not asserted**. Their inputs' source-authority labels remain visible through the provenance input ids.

For DECISION, legitimacy is **authority basis** (N3), not source authority (N2), as F-5 records.

**Classification (INFERENCE): (D).** No new mechanism is needed, but this interprets ratified KD-15, which is a Commander matter under the Q1 precedent.

**Proposed determination D-8 (RECOMMENDATION).**
- **(a)** The source-authority axis applies to sourced kinds only.
- **(b)** For INFERENCE, ANALYSIS and RECOMMENDATION it is not asserted, and in particular is never inherited from inputs.
- **(c)** For DECISION, authority basis is shown instead.
- **(d)** Nothing in D-8 creates a new axis value. "Not asserted" is the absence of a label, not a fifth value.

**Dependencies.** None on F-3. None on Q3.

---

# 4. One coherent model, or separate decisions?

**Determination (INFERENCE, offered as RECOMMENDATION): a single coherent interpretive frame, with five separately decidable determinations. No new "Knowledge Truth/Provenance model" artifact is proposed.**

**Reasons they cohere:**
- All five items are resolved by *existing* concepts (N1–N6) kept apart according to §1.3.
- No item required a concept that POA lacks.
- The frame is §1, and it uses only ratified K-001 text, the GOV-015 vocabulary, ESR-001 and `POA-ACC-001` §D.

**Reasons they cannot be one decision:**

| Item | Deciding authority | Depends on F-3b? | Depends on Q3? |
|---|---|---|---|
| D-1(a) (F-1a) | Commander (interpretation of ratified KD-15) | Corroboration only | No |
| D-1(c) (F-1b) | Already decided (ratified KD-15); instances via Phase 2 | No | **Yes, via Phase 2** |
| D-2 (F-2) | Commander (KD-12); options B/C also have evidence-policy character (Chief Architect precedent) | Options B/C: yes | No |
| D-3(a) (F-3a) | Commander (labeling practice) | — | No |
| D-3(b) (F-3b) | Commander or Chief Architect, as acceptance rulings under ACC-001 (a separate governance track) | Is F-3b | No |
| D-5 (F-5) | Commander (reading of KD-12) | Fidelity element only | No |
| D-8 (F-8) | Commander (interpretation of KD-15) | No | No |

- **Different deciding authorities.** Five determinations are KD interpretations for the Commander. F-3b is acceptance rulings on GOV standards under ACC-001, which is outside knowledge architecture.
- **Different dependencies.** F-1b depends on Q3 through Phase 2; D-2 Options B/C depend on F-3b; D-8 and D-3(a) depend on nothing.
- **Bundling them into one ratifiable model** would either stall D-8 and D-5 behind F-3b and Q3, or pull a governance-wide question into the knowledge architecture. It would also amount to creating a new mechanism without demonstrated necessity, which the instruction rules out.

**Suggested decision order (RECOMMENDATION; each is independent):**
1. **D-8 and D-5.** They have no dependencies and are pure interpretation.
2. **D-3(a).**
3. **D-1(a) and (b)**, after D-3(a).
4. **D-2.** The option choice benefits from F-3b.
5. **F-3b**, on its own governance track, whenever the Commander or Chief Architect chooses.

D-1(c) needs no decision now.

---

# 5. Q3

- **Only F-1b depends on Q3**, through Phase 2's entry gate ("Phase 0 + Q3 answered").
- **Existing authority does not permit resolving Q3 here.** R-1 §4 disposes of Q3 as follows:
  - its **physical-location** aspect is *Deferred* and remains a gate on Phase 2 ("restructuring still needs a governance mission");
  - its **authority** aspect is a *Condition*: it "cannot be answered as authority without a recognized tier source". `POA-SVC-001`'s tier vocabulary was explicitly deferred.
- **Q3 is not resolved, and no Q3 work was performed.** F-1b's correct interim label is UNKNOWN, as Phase 1 already applied.

---

# 6. Out of scope

- **F-4** (freshness UNKNOWN immediately after observation), **F-6** (composite claims) and **F-7** (`observed_at` granularity) are not addressed.
  - One observation is recorded without disposition: `POA-OBS-001` Revalidation §14 labeled live-queried platform metadata "CURRENT". Ratified §12.2 rule 3 yields UNKNOWN absent a declared cadence. This bears on F-4 only.
- Not addressed at all: Phase 2; Q2–Q14; K1–K4 and K7–K9; the K-001 Status-field wording.

---

# 7. Validation (performed 2026-09-25, before this file was written)

| Check | Result |
|---|---|
| `HEAD == origin/main` | `3f6b2b6` == `3f6b2b6` (after fetch) |
| Staged changes | 0 |
| Modified tracked files | `CLAUDE.md` only (pre-existing; untouched) |
| Files modified by this work | **None.** This file is the only addition, and it is untracked |
| `POA-PJR-001`, K-001, Phase 1 reports, ADR-001 | Unmodified |
| Code, database, connectors, UI, Phase 2, Q3 | None |
| New artifact ID, family or label value | None |

---

# Final Verdict

**THE FIVE FRICTION ITEMS ARE ONE DIAGNOSIS: EXISTING NOTIONS WERE CONFLATED IN ONE COLUMN. THEY NEED FIVE SEPARATE DETERMINATIONS AND NO NEW MECHANISM.**

- **F-5 and F-8** are documentation ambiguity resolvable from ratified text.
- **F-1** splits:
  - POA-scope predicates need an interpretive extension of §12.4;
  - Org-A predicates are already correctly designed and wait for Phase 2 and Q3.
- **F-2** is a conflict between existing mechanisms, resolvable by choosing among three options.
- **F-3** is sufficient for labeling. Its general form is a pending-acceptance governance matter that belongs on the ACC-001 track, outside the knowledge architecture.

Every determination is PROPOSE, and none is self-executing.

*End of decision candidate as drafted. Materialized 2026-09-25 by the Execution Agent.*

---

# 8. Commander Rulings (2026-09-25)

This section is additive. Sections 1–7 are unchanged apart from the Artifact Identity rows above.

**Commander instruction, quoted verbatim:** "finalize the friction ADR with the rulings above; preserve F-2 as unresolved; make no Q3 changes; make no Phase 2 implementation; make no changes to PJR-001; add the appropriate Commander decision record to POA-ADR-001".

**Clarification, confirmed in session:**
- *Question:* "Your message didn't include ruling text, so I read "the rulings above" as adopting my proposed determinations as written: D-1(a–d), D-3(a–c), D-5 and D-8, with F-2 (D-2) left unresolved. Is that right?"
- *Commander's answer:* "Yes, adopt as proposed".

| Determination | Ruling | Effect |
|---|---|---|
| **D-1 (a)–(d)** (F-1) | **ADOPTED AS PROPOSED** | (a) For POA-scope predicates, a governing specification's own designation of the mechanism that records a predicate may serve as the K-001 §12.4 declaration, with that specification's standing disclosed; otherwise UNKNOWN. (b) This confers no authority basis and implies no retention class. (c) For Organization-A predicates, §12.4 applies as ratified, and UNKNOWN persists until a Source Declaration exists (via Phase 2, gated on Q3). (d) The `POA-OBS-001` self-designation / platform-nature precedent is recorded as a tension and is not adopted |
| **D-2** (F-2) | **UNRESOLVED — preserved** | Options A, B and C (§3, F-2) remain open. Until decided, the Phase 1 practice stands: kind VERIFIED FACT is not claimed on the strength of a same-role re-check |
| **D-3 (a)–(c)** (F-3) | **ADOPTED AS PROPOSED** | (a) Labels disclose the acceptance state of any governing standard whose definition they rely on, and basis is never upgraded on the strength of a pending standard. (b) The general standing of acceptance-pending GOV standards is referred to separate acceptance rulings under `POA-ACC-001` and is not decided here. (c) The GAP-003 / `ACS-001` existence contradiction is referred to that same track and is not resolved here |
| **D-5** (F-5) | **ADOPTED AS PROPOSED** | (i) A restated claim keeps kind DECISION, with its authority basis in the cited decision record. (ii) Reading it is a SOURCE-OBSERVATION of that record. (iii) The restating report is Provenance plus a Repository Reference and confers nothing. (iv) Any rendering that shows (i) and (ii) distinctly is acceptable; no new label value is created |
| **D-8** (F-8) | **ADOPTED AS PROPOSED** | (a) The source-authority axis applies to sourced kinds only. (b) It is not asserted for INFERENCE, ANALYSIS or RECOMMENDATION, and is never inherited from inputs. (c) For DECISION, authority basis is shown instead. (d) No new axis value is created |

**Not decided by these rulings:**
- D-2 / F-2;
- Q3 (unchanged);
- Phase 2 (not authorized; no implementation);
- acceptance of `POA-EVID-001`, `POA-ACC-001`, `POA-EVT-001`, `ACS-001` or `POA-INTEGRITY-CONTROL-001`;
- the GAP-003 contradiction;
- the OBS-001 tension;
- F-4, F-6 and F-7;
- K1–K4 and K7–K9.

**Unchanged by these rulings:** `POA-PJR-001`, K-001 (SHA-256 `ba19e96f…`) and the Phase 1 reports.

**Recorded wording.** The "Effect" column restates §3 in condensed form, drafted by the Execution Agent. The Commander adopted the determinations "as proposed", so §3 controls wherever the two differ.

*End of POA-DEC-ORG-KNOWLEDGE-001 Truth/Provenance Friction Disposition Decision Record.*
