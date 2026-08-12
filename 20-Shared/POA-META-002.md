# POA-META-002

## Repository Meta-Model

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | POA-META-002 |
| Artifact Name | Repository Meta-Model |
| Artifact Family | META |
| Version | 0.1.0 — first materialization |
| Status | **Bounded Accepted (Model B) — accepted for its established architectural provisions only: §A, §B, §C, §H, §I, §J, §K, §O, §P, §Q, §R, §S, §T. Six provisions — Repository Object Ontology (§D), Object/Artifact Categories (§E–F), Ownership Model (§G), Lifecycle Authoritativeness (§L), Identity Ratification (§M), Version Normalization (§N) — remain explicitly EXCLUDED from this acceptance and retain their own prior classification unchanged. Not Certified. Not a baseline. See "GOV-009 Bounded Acceptance Record" below.** (Per Chief Architect ruling under Mission `GOV-008`, formalized by Mission `GOV-009`, 2026-08-12.) This bounded acceptance does not itself close `GAP-002` — full closure requires a separate register-update act, not performed by this materialization; see §S and the GOV-009 record below. |
| Authority | Paravyoma Constitution → Commander authorization of Mission `GOV-004` (`CHIEF ARCHITECT DIRECTIVE — GOV-004.md`) → Commander decisions GOV-004-A/B/C (`CHIEF ARCHITECT AUTHORIZATION — GOV-004 MATERIALIZATION.md`, Deployment mirror) |
| Repository Domain | Shared / Governance |
| Capability Introduced | Repository Meta-Model (abstract Repository Object / Role / Lifecycle / Relationship classification) |
| Evidence Basis | `40-Runtime/GOV-004-PREFLIGHT-REPORT.md`, `40-Runtime/GOV-004-COMPLETION-REPORT.md` — every section below cites its grounding there or is marked RESERVED / UNESTABLISHED / GOVERNANCE DEPENDENCY where no grounding exists |

---

# A. Purpose

`POA-META-002` is the formal architectural parent of the POA Repository Meta-Model. Per Commander decision **GOV-004-A**, it is authored fresh, consolidating and formalizing architectural knowledge already scattered across existing Approved and Materialized artifacts, without inventing unsupported authority.

Before this document, "repository meta-model" existed only as a name and a one-line gloss (`ROADMAP.md`'s "Known Pending Governance Standards" table; `ADR-RM-001` §6's topic catalog; `GAP-REGISTER-001` `GAP-002`; `POA-CON-001` §5/§7) — never as content. This document supplies that content only where existing authority already supports it, and marks everything else RESERVED / UNESTABLISHED / GOVERNANCE DEPENDENCY rather than inventing it.

---

# B. Scope

This document's scope is the **abstract classification vocabulary** used to describe repository artifacts, roles, state, lifecycle, identity, and relationships — the meta-model, not any specific artifact's content.

It is, per **GOV-004-B**, the declared architectural parent and parent dependency for `POA-STD-006` through `POA-STD-010` (§R). It does not author any child standard's content.

**Out of scope**, per the authorizing directive:

- Certification mechanics — governed exclusively by `ACS-001`; this document only records the relationship (§P).
- The POA Baseline concept — `GAP-006` remains untouched; nothing about a baseline is established here (§T).
- `POA-STD-006`–`010` content — named as dependents only (§R); not modified, not authored.
- Renaming, replacing, or redefining `Commander`, `Chief Navigator & Architecture Steward`, `Construction Corps`, or `Mission Control` (**GOV-004-C**).

---

# C. Repository Meta-Model Definition

The Repository Meta-Model is the set of abstract classifications — **Repository Object, Category, Ownership, Authorizing Role, Constructing Role, Reviewing Role, Lifecycle, Identity, Relationship** — used to describe *any* repository artifact, independent of that artifact's own specific domain content (per **GOV-004-C**).

These are **abstract meta-model classifications**, not new organizational offices or a competing state/authority model. Where an existing Approved artifact (`POA-RSR-001`'s state model, `ACS-001`'s certification model, `ORC-001-GOV-001`'s authority delegation) already governs a concrete instance of one of these classifications, that artifact continues to govern it — this document names the abstract category and defers to the concrete governing artifact rather than restating or superseding it.

---

# D. Repository Object Ontology

**Partially derivable; full ontology UNESTABLISHED.**

No prior artifact used the term "Repository Object" (zero occurrences, direct repo-wide grep, `GOV-004-PREFLIGHT-REPORT.md` §B/§C.E). This document introduces the term as the abstract label the meta-model classifies.

The narrowest evidenced instance is directly derivable from practice: **any artifact carrying its own Artifact Identity block** (the ID/Name/Family/Version/Status/Authority/Domain table pattern used consistently across the repository — 25 files, direct grep, `GOV-004-PREFLIGHT-REPORT.md` §B) is a Repository Object.

Whether the category extends beyond that — to directories, capabilities, missions, or execution artifacts (EXC/EXB/EXR) that do not themselves carry an Identity block — is **UNESTABLISHED / GOVERNANCE DEPENDENCY**. No prior artifact answers this, and this document does not invent an answer.

---

# E. Object / Artifact Classes

**Partially derivable from practice, not formally enumerated.**

The "Artifact Family" field, present in every observed Identity block, functions as an informal, unenumerated class system by repetition: `KER`, `RSR`, `EXB`, `STD`, `GOV`, `ADR`, `CON`, `MAT`, `META`, and others observed in current use. No document formally enumerates the closed or open set of classes, nor governs how a new class is introduced.

This document records the pattern as observed practice. It does not enumerate a closed class list or a class-introduction rule — both remain **UNESTABLISHED**.

---

# F. Category Model

**Partially derivable from practice, not formally governed.**

The "Repository Domain" field, observed across materialized artifacts, carries values including: Shared, Governance, Runtime, Constitution, Decisions. This functions as an informal category system by repetition — the same pattern noted in `GOV-004-PREFLIGHT-REPORT.md` §C.D.

No document formally enumerates this taxonomy or governs how a new category is added. This document records the observed values as current practice only. The taxonomy itself and its extension rule remain **UNESTABLISHED / GOVERNANCE DEPENDENCY**.

---

# G. Ownership Model

**UNESTABLISHED / GOVERNANCE DEPENDENCY.**

Per **GOV-004-C**, "Ownership" is named as an abstract meta-model classification, distinct from "Authority" (which denotes derivation-of-authority — an artifact's chain back to the Constitution — not custodianship of an artifact). No prior artifact uses "Ownership" in this or any sense (zero occurrences, direct repo-wide grep, `GOV-004-PREFLIGHT-REPORT.md` §F #4).

This document names Ownership as a meta-model classification distinct from Authority. It does **not** derive an ownership model from the Authority field, from mission authorship, or from any other proxy — doing so would invent content the content boundary forbids. Concrete ownership rules (who owns a Repository Object, what owning entails, how ownership transfers) are **UNESTABLISHED**.

---

# H. Authorizing Role Abstraction

**Abstract classification, per GOV-004-C. Concrete mappings recorded only where established, and only for their specific context — not as a flat equivalence, per the Role Model Rule.**

Two context-scoped bindings are directly evidenced:

1. **For Matters Reserved for Commander** (constitutional changes, new architectural layers, commercial strategy, product vision, major scope expansion, budget/organizational decisions, release approval — `ORC-001-GOV-001` "Matters Reserved for Commander") and **for mission-level authorization** (every `CHIEF ARCHITECT DIRECTIVE`/`AUTHORIZATION` this repository has acted on states "Commander has authorized [mission]") — the Authorizing Role, in this context, is currently exercised by **Commander**.
2. **For continuation of already-approved workstreams within the approved Genesis scope** ("Execute Approved Workstreams," "Manage the Program" — `ORC-001-GOV-001`, delegated) — the Authorizing Role, in this narrower context, is currently exercised by the **Chief Navigator & Architecture Steward**.

This document does **not** state "Authorizing Role = Commander" as a general equivalence — the two bindings above are scoped to their specific, cited contexts, exactly as **GOV-004-C**'s Role Model Rule requires. Whether other contexts exist with no current binding is **UNESTABLISHED**.

---

# I. Constructing Role Abstraction

**Abstract classification, per GOV-004-C. One Approved-grounded binding.**

The Constructing Role, for materialization of approved work, is exercised by the **Execution Agent / Repository Materializer** — established by `POA-EXB-001` §8 (Consumers: "Claude Code, Codex, Gemini CLI, Human Engineering Teams, any approved Repository Materializer") and §12 ("Execution Agents SHALL: Materialize. Validate. Report. Execution Agents SHALL NOT: Redesign. Reinterpret. Extend organizational architecture."), an Approved artifact.

**Note on "Construction Corps":** this term appears paired with "Execution Agent" in `POA-STD-011` §2 (Draft status), `POA-MAT-001` §5 (Interim status), and `ADR-RM001-011` §9 (Accepted decision record, recording STD-011's execution rules) — it does not appear in `POA-EXB-001` itself. It is recorded here as an observed synonym found in Draft/Interim/Accepted-decision-record sources, not as an independently Approved-*specification*-grounded binding in the same sense as `POA-EXB-001`'s own text. The Constructing Role's only binding grounded in an Approved specification (as opposed to a Draft standard or a decision record about that standard) is Execution Agent / Repository Materializer, per `POA-EXB-001`.

---

# J. Reviewing Role Abstraction

**Abstract classification, per GOV-004-C. Context-scoped, not a flat equivalence.**

1. **For certification review specifically** — the Reviewing Role is exercised by the **Chief Navigator & Architecture Steward**, per `ORC-001-GOV-001`'s GOV-003 Addendum §2 and `ACS-001` §H, subject to Commander's retained reserve/escalate/override/withhold/revoke supremacy (`ORC-001-GOV-001` GOV-003 Addendum §3).
2. **For internal architectural review generally** — the Reviewing Role is exercised by the same **Chief Navigator & Architecture Steward**, per `ORC-001-GOV-001` ("Manage the Program" → "Conduct internal architectural reviews").

Both bindings are scoped to their cited context. This document does not declare a general "Reviewing Role = Chief Navigator & Architecture Steward" equivalence beyond what these two cited contexts establish.

---

# K. Repository State Model

**Derivable — deferred, not restated.**

`POA-RSR-001` (Approved) already establishes a Status-field-based repository state model, in force universally across the repository. This document does not define a new or competing state model. It records `POA-RSR-001`'s model as the meta-model's Repository State Model and as a **boundary condition**: any future meta-model provision must remain consistent with `POA-RSR-001`, never supersede it, since an unapproved `POA-META-002` cannot outrank an Approved `POA-RSR-001`. No conflict was found between the two.

---

# L. Lifecycle Model

**Recorded as observed current practice — not restated as newly authoritative.**

The sequence

```text
Proposed → Draft → Review → Approved → Active → Revised → Superseded → Archived
```

is the lifecycle sequence in current repository-wide use. Its original textual source is `POA-META-001` §7 — itself a **Draft, non-authoritative** document (`REPO-AUTHORITY-RECONCILIATION-REPORT.md` §2). This document discloses that sourcing rather than treating the sequence as independently authoritative; it records the sequence as observed practice, already once extended (`ACS-001`'s Certified-stage insertion). It does not restate `ACS-001`'s Certified-stage insertion rule — see §P.

Whether this sequence should itself become independently authoritative (rather than resting on a Draft source) is **UNESTABLISHED / GOVERNANCE DEPENDENCY**.

---

# M. Identity Relationship

**Derivable from practice; not codified in any single Approved document.**

The Artifact Identity table convention (ID, Name, Family, Version, Status, Authority, Repository Domain, Capability Introduced — with minor per-artifact variation) is the most consistently observed repository-wide pattern (25 files, direct grep, `GOV-004-PREFLIGHT-REPORT.md` §B/§C.C). This document records it as the meta-model's Identity relationship.

This pattern is derivable from repeated practice only — it is not codified as a rule in any single Approved document. `POA-META-001` §7 (Draft, non-authoritative) intended to be such a Document Identity Standard but was never ratified. Formal ratification of an Identity Standard remains **UNESTABLISHED / GOVERNANCE DEPENDENCY**.

---

# N. Version Relationship

**UNESTABLISHED as a normative rule — observed practice is inconsistent.**

Version-field practice across materialized artifacts is **actively inconsistent**:

- `1.0.0` (`POA-KER-001`, `POA-RSR-001`, `POA-EXB-001`)
- `0.1.0` / `0.2.0` with free-text supersession notes (`ACS-001` "0.2.0 — supersedes v0.1.0"; `POA-MAT-001` "0.1.0")
- No version field at all (`ORC-001-GOV-001`)

This document records the inconsistency rather than resolving it. It does not assert semantic versioning, or any other specific versioning rule, as a governing norm — doing so would invent a rule the repository's own practice does not actually support. Reconciling this inconsistency is **UNESTABLISHED / GOVERNANCE DEPENDENCY**.

---

# O. Relationship Model

**Derivable from practice.**

Every observed Identity block's "Authority" field cites that artifact's own derivation chain (e.g., `POA-EXB-001` Authority: `POA-KER-001`, `POA-RSR-001`; `POA-RSR-001` Authority: `POA-KER-001`) — a consistent, well-evidenced pattern (`GOV-004-PREFLIGHT-REPORT.md` §F #12). This document records this as the meta-model's Relationship model: a directed derivation chain, artifact to artifact via each artifact's own Authority field, terminating at the Paravyoma Constitution.

---

# P. Certification Relationship

**Deferred entirely to `ACS-001`, per the authorizing directive's Critical Authority Rule. Not redefined here.**

This document states only:

1. Certification is a governed lifecycle/status-tier concept, reachable only after Approved or Accepted status, defined and governed exclusively by `ACS-001` (§K, §M).
2. A Repository Object references its certification state through the same mechanism it references any other status — its own Identity-block Status field, updated in place (`ACS-001` §J.1).
3. Certification is distinct from ordinary completion or approval (`ACS-001` §M) — this document does not restate or narrow that distinction, it defers to it.

This document does **not** define who grants certification, certification activation, certification evidence, certification exceptions, or self-review rules — see `ACS-001` §E–§L for all of these. It does not create a competing certification authority.

---

# Q. RSR Relationship

`POA-RSR-001` (Approved) remains the sole authoritative description of repository operational state (`POA-RSR-001` §12). This document's Repository State Model (§K) is required to remain consistent with `POA-RSR-001`, never to supersede it. No conflict was found.

This document is not itself an RSR-pipeline artifact — it is not among `POA-RSR-001` §8's authorized RSR consumers (Repository Orchestrator, Repository Analyzer, Validator, Repository Dashboard) and does not modify or regenerate any RSR instance.

---

# R. Parent / Child Standard Relationship

Per **GOV-004-B**, `POA-META-002` is established as the architectural parent of, and the parent dependency for:

- `POA-STD-006` — topic: Ontology
- `POA-STD-007` — topic: Categories
- `POA-STD-008` — topic: Lifecycle
- `POA-STD-009` — topic: Relationships
- `POA-STD-010` — topic: Identity

(Topic assignments per `ADR-RM-001` §6's catalog table — a table of contents, not content.)

This section establishes the **dependency relationship only**. None of the five child standards exists (`GAP-004`, OPEN, untouched by this mission). This document does not create, imply, or anticipate their content. Per `GOV-004-B`, they "remain downstream and MUST NOT be modified or formalized as part of GOV-004." When authored under their own future missions, each child standard is expected to derive its domain-specific content from the corresponding section above (D, F, L, O, M respectively) — but that derivation is future work, not performed here.

---

# S. Governance Dependencies

The following open governance items relate to this document and remain unresolved by its materialization:

- **`GAP-002`** (this document's own gap) — this materialization is evidence toward closing `GAP-002`, not closure itself. Per the `ACS-001` precedent, `GAP-002`'s resolution path requires the document to be "authored **and** approved" — approval is a distinct, future Chief Architect / Commander act, not accomplished by materialization alone.
- **`GAP-004`** (`POA-STD-006`–`010`) — remains OPEN; untouched (§R).
- **`GAP-005`** (`POA-000`, `POA-001`, `POA-META-001`, `POA-101`–`106`, `POA-TEMPLATE-001` — uncertified Drafts) — remains OPEN; this document is informed by `POA-META-001` §7 (§L, §M) but does not certify it or promote it.
- **`GAP-006`** (no formal POA Baseline record) — remains OPEN and out of scope (§T).
- **`GAP-001`** (`POA-PRS-001` identifier-scheme conflict, HELD) — untouched; this document uses the repository's live `POA-<FAMILY>-<NNN>` convention, consistent with `CLAUDE.md` Rule 5.
- **`ACS-001`'s own open structural questions** — the self-review question (§I: reviewer and grantor both resolve to the Steward) and the procedural mechanics of Commander reservation/escalation (`ORC-001-GOV-001` GOV-003 Addendum §3) remain unresolved by `ACS-001` itself; this document does not attempt to resolve them and defers entirely (§P).
- **Mission Package Certification mechanics** (`ACS-001` §D.2) — remains `RESERVED / GOVERNANCE DEPENDENCY`; this document does not touch it.

---

# T. Non-Goals

This document, and the mission that materializes it (`GOV-004`), explicitly do **not**:

- Establish a POA Baseline, baseline version, baseline certification, or baseline authority (`GAP-006` untouched).
- Define, grant, redefine, or narrow certification authority or certification mechanics — fully deferred to `ACS-001` (§P).
- Create or modify any content of `POA-STD-006` through `POA-STD-010` (§R).
- Modify, rename, or replace `ACS-001`, `ORC-001-GOV-001`, `POA-RSR-001`, or `GAP-REGISTER-001`.
- Rename, replace, or silently redefine the existing formal organizational roles `Commander`, `Chief Navigator & Architecture Steward`, `Construction Corps`, or `Mission Control` (**GOV-004-C**) — the abstract Role classifications in §H–§J are recorded as classifications with context-scoped concrete bindings, not as replacements for these titles.
- Close `GAP-002` — materialization is evidence toward closure, not closure itself (§S).
- Modify `ROADMAP.md` or `CHANGELOG.md`.
- Modify any application code under `30-Products/`.
- Commit or push any change.

---

# Result

`POA-META-002` MATERIALIZED. Governance-architecture artifact, not constitutional authority. Status: acceptance pending. `GAP-002` remains OPEN pending Chief Architect / Commander approval; `POA-STD-006`–`010` remain unmaterialized and untouched; no baseline, certification authority, or existing formal role was created, redefined, or modified by this materialization.

---

# GOV-009 Bounded Acceptance Record — Model B Formalization (2026-08-12)

**This section is NOT a rewrite of any text above.** It is an additive record, appended per `POA-INTEGRITY-CONTROL-001` §L(b) and the precedent set by `ORC-001-GOV-001`'s GOV-003 Addendum and `ACS-001`'s GOV-005 Addendum. No word of §A–§T or the "# Result" section above is altered. This record formalizes the Chief Architect's ruling on `POA-META-002`'s acceptance status, communicated via `CHIEF ARCHITECT DIRECTIVE — GOV-009.md`, following the evidence-gathering findings of Missions `GOV-006`, `GOV-007`, `GOV-008`, and `GOV-008`'s Evidence Reconciliation.

## 1. Acceptance Authority

Paravyoma Constitution → Commander authorization of Mission `GOV-008` → Chief Architect ruling (recorded in `CHIEF ARCHITECT DIRECTIVE — GOV-009.md`'s "GOV-008 CHIEF ARCHITECT RULING" section) → formalized by Mission `GOV-009`.

## 2. Acceptance Model

**MODEL B — Bounded Acceptance.** `POA-META-002` is accepted only for its established architectural content; completeness of every internal provision, downstream-standard readiness, certification eligibility, and baseline eligibility are explicitly NOT implied by this acceptance (per the five-way separation first drawn in `GOV-007-PREFLIGHT-REPORT.md` §F).

## 3. Accepted Architectural Boundary

§A (Purpose), §B (Scope), §C (Repository Meta-Model Definition), §H (Authorizing Role Abstraction), §I (Constructing Role Abstraction), §J (Reviewing Role Abstraction), §K (Repository State Model), §O (Relationship Model), §P (Certification Relationship), §Q (RSR Relationship), §R (Parent/Child Standard Relationship), §S (Governance Dependencies), §T (Non-Goals) — thirteen sections, as classified in `GOV-007-PREFLIGHT-REPORT.md` §D and reconciled in `CHIEF ARCHITECT EVIDENCE RECONCILIATION — GOV-008.md` §2. The Identity/Status field and "# Result" section above remain factual self-reporting and are not independently treated as accepted architectural provisions in addition to this list.

## 4. Excluded Boundary

The following six provisions remain explicitly OUTSIDE the accepted authority boundary, each retaining its own prior classification exactly as already established — none is resolved, narrowed, or silently upgraded by this record:

1. **Repository Object Ontology (§D)** — own words: "Partially derivable; full ontology **UNESTABLISHED**."
2. **Object/Artifact Categories (§E–F)** — own words: "Partially derivable from practice, not formally enumerated / not formally governed" — **UNESTABLISHED** (§E) / **UNESTABLISHED / GOVERNANCE DEPENDENCY** (§F).
3. **Ownership Model (§G)** — own words, in full: "**UNESTABLISHED / GOVERNANCE DEPENDENCY**."
4. **Lifecycle Authoritativeness (§L)** — own words: "recorded as observed current practice — not restated as newly authoritative"; authoritativeness "**UNESTABLISHED / GOVERNANCE DEPENDENCY**," sourced from Draft, unmaterialized `POA-META-001` §7.
5. **Identity Ratification (§M)** — own words: "Derivable from practice; not codified in any single Approved document"; ratification "**UNESTABLISHED / GOVERNANCE DEPENDENCY**."
6. **Version Normalization (§N)** — own words: "**UNESTABLISHED as a normative rule** — observed practice is actively inconsistent" — a **CONTRADICTORY** practice pattern, explicitly disclosed as such.

## 5. Effective-Status Condition — What This Acceptance Does NOT Constitute

Per explicit Chief Architect instruction, stated without qualification, this bounded acceptance does **not**:

- certify `POA-META-002`;
- activate certification delegation;
- establish a baseline;
- close any GAP (`GAP-002` specifically remains OPEN — see §S above and `GAP-REGISTER-001`, unmodified by this record; closure requires a separate, future register-update act);
- accept the six excluded provisions listed in §4 above;
- establish universal lifecycle semantics;
- establish ownership semantics;
- establish a Repository Object ontology;
- establish category taxonomy;
- ratify Identity;
- normalize repository versions;
- automatically authorize `POA-STD-006` through `POA-STD-010` materialization — including `POA-STD-009`, whose own separate Commander-authorization prerequisite (named in `GOV-006-PREFLIGHT-REPORT.md` §N Decision 6) remains outstanding and is not satisfied by this record.

## 6. Historical Integrity

No word of §A–§T or the "# Result" section above is altered, deleted, or retroactively reinterpreted by this record. No terminology used in §A–§T is normalized or restated differently here than in its own original text (§4 above quotes each excluded provision's own original wording verbatim). The history of Missions `GOV-004`, `GOV-007`, and `GOV-008` is not altered by this record — this record formalizes a Chief Architect ruling made *after* those missions' own findings, additively, consistent with `POA-INTEGRITY-CONTROL-001` §L's historical-integrity discipline.

---

*End of GOV-009 Bounded Acceptance Record. Authorized by: Chief Architect ruling under Mission `GOV-008`, via `CHIEF ARCHITECT DIRECTIVE — GOV-009.md`. Materialized by: Mission `GOV-009`, 2026-08-12.*
