# POA-DEC-ORG-KNOWLEDGE-001

## Organizational Knowledge Architecture & Intelligence Substrate — Architectural Decision Record

**Mission Class:** Architectural Decision (architecture and decision records only — NO IMPLEMENTATION)
**Authority:** Commander-authorized mission brief `POA-DEC-ORG-KNOWLEDGE-001.md` (Deployment mirror, outside the repository per the established `reference-deployment-mirror-path` convention)
**Repository Baseline (verified before writing):** `HEAD == 1547472b4a989c17265ff17694eea9366a189596` (matches the brief exactly); `origin/main == 9569b209704a9b361818e0407c893bd9d329324b`; local `main` ahead of `origin/main` by 3 commits (`168708c`, `988602e`, `1547472`), intentionally unpushed per the brief.

**Status — read before anything else.** This document is a **decision-candidate record**, following the precedent of `POA-DEC-ORG-001`, `POA-DEC-ORG-002` and `POA-DEC-SEC-001` §24. It is authored by an Execution Agent. It is **not** a Commander ratification act (`POA-EXB-001` §12; `ACS-001` GOV-005-A Delegation Activation Rule: authorship and materialization do not constitute activation). Every "decision" below (§21) is marked **PROPOSE**, never RATIFY. Where this document says "adopted" or "decided", it means proposed to the Commander for ratification.

**Architecture authorization ≠ development authorization.** `CTD-001` (Commander Transition Declaration Decision Record, `POA-ADR-001`, 2026-08-23) made **Evidence-Gated Development** POA's effective operating condition, and explicitly did not authorize Knowledge Core, Mission Intelligence, Execution Intelligence, Organizational Memory expansion or Mission Console: "each remains subject to its own applicable evidence and authority process." This brief is an architecture authorization. Nothing in this document authorizes building anything (§24). **Q1 is now RESOLVED — NO** by Commander ruling, recorded as the "CTD-001 Scope Interpretation (Q1) Decision Record (2026-09-25)" in `20-Shared/DECISIONS/POA-ADR-001.md` (appended to the tracked file; not yet committed): "CTD-001's Evidence-Gated condition governs development authorization. It does not govern ratification of architecture. … Every implementation phase in §24 stays fully evidence-gated." The ruling permits this document to be *considered* for ratification without demonstrated development need; it does not ratify it (§20 Q1).

**Revision 1.1.0 (2026-09-25) — read with the Status note above.** This revision (a) records Q1 as resolved (above; §20); (b) replaces the open Q15 with the completed classification in `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-Q15-CLASSIFICATION-REPORT.md` [U] — of the ten [U] predecessors, **0 Authority-bearing, 8 Provenance-only, 2 Indeterminate** (§2.4); (c) updates Q3 and §8.4 so that `POA-SVC-001` is not treated as authority; (d) qualifies every RATIFIED / ESTABLISHED tag that rests only on [U] sources as the source's **self-description, not recognized POA authority** (Reading Conventions; §2.4). No KD entry, model section, or proposal is added, removed, or changed in substance. The contradictions the Q15 report records (K1–K9) are disclosed in §2.4 and **not resolved** here.

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | `POA-DEC-ORG-KNOWLEDGE-001` |
| Artifact Name | Organizational Knowledge Architecture & Intelligence Substrate |
| Artifact Family | DEC (Decision) — `ORG-KNOWLEDGE` domain segment, following the existing `POA-DEC-<DOMAIN>-NNN` shape (`POA-DEC-ORG-00x`, `POA-DEC-SEC-001`, `POA-DEC-EXEC-001`, `POA-DEC-MOTHERSHIP-00x`). The domain segment is taken from the brief's own mission ID; no new family or naming convention is introduced (`CLAUDE.md` Rule 5; GAP-001 closure) |
| Version | 1.1.0 — Q1 resolved (Commander ruling recorded in `POA-ADR-001`); Q15 classification applied (§2.4); Q3/§8.4 updated for `POA-SVC-001`'s Provenance-only status; [U]-sourced status tags qualified. Decision content (KD-01–KD-22) unchanged. Prior: 1.0.0 — first materialization |
| Status | **Decision candidate — pending Commander ratification. Not self-executing. Not Approved, Accepted, or Certified.** |
| Authority | Paravyoma Constitution → `ORC-001-GOV-001` ("New architectural layers" is a Matter Reserved for Commander) → Commander-authorized brief `POA-DEC-ORG-KNOWLEDGE-001.md` |
| Repository Domain | Runtime (decision record); references Constitution, Shared and Governance artifacts without modifying any of them |
| Capability Introduced | Canonical conceptual architecture for organizational knowledge (architecture only; no capability is built) |
| Evidence Basis | See §2.2 (evidence reviewed, with per-artifact citation status). Load-bearing content from untracked predecessors is restated inline (`POA-EVID-001` §C.4) so this record remains reconstructable whether or not those files are ever committed |

---

# Reading Conventions

**Status tags, applied inline at the point of each conclusion.** Vocabulary is inherited from the `POA-DEC-*` family, not invented:

| Tag | Meaning |
|---|---|
| **ESTABLISHED** | Already stated by an existing POA artifact; reused, not re-derived |
| **RATIFIED** | Ratified by Commander act. **Qualified in 1.1.0:** a RATIFIED tag whose only source is a [U] record reports that record's *self-description*, not authority POA has recognized. Per the Q15 classification (§2.4), `POA-RAT-ORG-001` and `POA-DEC-EXEC-001` D1–D7 are **INDETERMINATE**, and the other [U] predecessors are Provenance-only; such tags are marked "self-described" where they appear. `POA-DEC-MOTHERSHIP-001` [L] formalizes a Commander ruling in a committed (local-only) record and is outside the Q15 set |
| **DERIVED** | A reasoned extension of established material, shown step by step |
| **PROPOSED** | New in this document; awaits Commander ratification |
| **UNRESOLVED** | Evidence insufficient; named, not invented |
| **REJECTED** | Considered and explicitly declined |
| **TBD — requires architectural decision** | Per `CLAUDE.md` Rule 7: no established source exists; not fabricated |

**Citation status legend**, per `POA-EVID-001`'s reproducibility rule. The brief's own authorities are unevenly synchronized, and this matters for what can be treated as governed repository state:

| Mark | Meaning |
|---|---|
| **[P]** | Committed and present on `origin/main` |
| **[L]** | Committed locally only (in the 3 unpushed commits) |
| **[U]** | Untracked working-tree file — Provenance-grade under the ESR-001 Addendum; load-bearing content restated inline below. Under ESR-001, untracked status does not itself decide authority; each [U] predecessor's actual classification is in §2.4. An **ESTABLISHED** tag whose only sources are [U] means "stated in an existing record POA has not recognized", not recognized authority |

---

# 1. Mission Identity

| Field | Value |
|---|---|
| Mission | `POA-DEC-ORG-KNOWLEDGE-001` — Organizational Knowledge Architecture & Intelligence Substrate |
| Authorization | Commander-authorized (brief, Deployment mirror) |
| Execution resource | Anthropic Claude **Opus 5.5** (`claude-opus-5-5`), verified from the harness's own model declaration — matches the brief's required resource. **Effort/intensity: UNKNOWN** — not surfaced by the harness. Recorded as UNKNOWN rather than inferred, per `POA-DEC-EXEC-001` D3 [U] (restated: "Effort is recorded whenever observable; if unavailable, recorded as UNKNOWN"). The brief specifies no effort level |
| Starting HEAD | `1547472b4a989c17265ff17694eea9366a189596` — matches brief |
| Previous relevant commit | `988602ea40d5bc266b989f4cbe3e1529fc631ae0` — matches brief |
| Pre-existing working-tree state | `CLAUDE.md` already modified before this mission (50 insertions, not authored by this mission; SHA-256 `a56f8bfe…97eb63d` recorded at start and re-verified at end). Numerous pre-existing untracked files (screenshots, `40-Runtime/` reports, `.playwright-mcp/`) — untouched |
| Deliverable | This document only. The optional companion `POA-ORG-KNOWLEDGE-ARCHITECTURE.md` was **not** created: splitting the model from its decisions would force every reader to cross-reference two files for each status tag, which would reduce clarity rather than improve it (brief: "Only create it if it materially improves clarity") |
| Implementation | None. No UI, screen, table, connector, API, agent, integration, commit, push or staging |

---

# 2. Context

## 2.1 What POA already has

POA's existing architecture was built bottom-up from governance and execution: who may authorize, how missions execute, how evidence is retained and made tamper-evident, how organizations are bounded and represented, and how external project state can be observed honestly. **Much of what this brief asks for already exists under other names.** Per the brief ("Identify overlaps before creating anything new… Do not duplicate an existing canonical model"), the reuse map below is the spine of this document. Every later section either reuses, extends or, only where nothing exists, proposes.

### Reuse Map

| Concept the brief requires | Existing canonical source | Status | Treatment here |
|---|---|---|---|
| Organization as a first-class identity; POA = Model C (supra-organizational scope, not sovereignty) | `POA-ORG-003` §5–6 [U]; `POA-RAT-ORG-001` §A–D [U] | RATIFIED **(self-described; RAT-ORG-001 INDETERMINATE, ORG-003 Provenance-only — §2.4)** | **Reuse** |
| Human / Service / Execution-Agent identity; Role as attribute, not identity; Project/Product/Capability rejected as first-class *identity* classes | `POA-ORG-003` §5, §8 [U]; `POA-SVC-001` §8 [U]; `POA-IMPL-001` §4 [U] | RATIFIED (via RAT-ORG-001 foundation) / ESTABLISHED **(self-described; all sources [U], none recognized — §2.4)** | **Reuse** — listing items in the knowledge model (§5) does **not** reopen this |
| Representation (who speaks for an organization); bootstrap and recovery | `POA-DEC-ORG-002` §8 [U]; `POA-DEC-ORG-003` [U]; `POA-DEC-ORG-004` [U] | RATIFIED in principle; bootstrap protocol family RATIFIED; recovery CONDITIONALLY RATIFIED **(all self-described; DEC-ORG-002/003/004 Provenance-only; DEC-ORG-003/004's RATIFIED verdicts contradicted by committed `POA-DEC-SEC-001` lines 10, 310 — K1, §2.4)** | **Reuse** |
| Capability grant (scoped Organization/Mission/Action/Time; revocable; never exceeds grantor) | `POA-ORG-003` §13 [U]; `POA-SVC-001` §10 [U]; `POA-IMPL-001` §6 [U] | ESTABLISHED **(in [U] records only; none recognized — §2.4)** | **Reuse** |
| Mission identity and lifecycle (Request ≠ Authorization ≠ Dispatch ≠ Execution; 11-stage lifecycle) | `POA-KER-001` §7 [P]; `POA-EXB-001` [P]; `POA-ORG-003` §15 [U]; `POA-SVC-001` §11 [U]; `POA-IMPL-001` §7 [U] | ESTABLISHED | **Reuse** as the delegation spine (§14) |
| Evidence retention; Authority-bearing vs Provenance-only | `POA-EVID-001` + GOV-015 + ESR-001 Addenda [P] | ESTABLISHED (materialized; acceptance pending) | **Reuse** |
| Evidence integrity (canonical envelope, signatures for authority-bearing evidence, git as sole persistence, independent witness) | `POA-DEC-SEC-001` [P] | Decision candidate + Commander rulings §25–26 | **Reuse; bounded** (§8) |
| Execution action/tool events | `POA-EVT-001` [P] | ESTABLISHED (materialized) | **Reuse** for ACTION evidence |
| Decision records / acceptance records | `POA-ADR-001` [P]; `POA-ACC-001` [P] | `POA-ADR-001` Accepted (Chief Architect, per its BA-001 record); `POA-ACC-001` status not re-read this mission | **Reuse** for DECISION |
| **Observation contract: state vs evidence, provenance chain, freshness (CURRENT/STALE/UNKNOWN), per-field confidence, explicit unknowns, contradiction preservation, platform-neutral adapters** | `POA-OBS-001` completion report + Precision Revalidation Addendum [P] (`observation_snapshot_v2`) | Validated candidate contract (committed) | **Reuse and generalize** from project state to organizational knowledge. This is the single most important reuse in this document |
| Per-field confidence markers VERIFIED / INFERRED / SELF-DECLARED, UNVERIFIED / UNKNOWN; append-only observation | `POA-PJR-001` [P] | Active living record | **Reuse** as the confidence *basis* axis (§12) |
| Knowledge classification: `ORGANIZATION-INFORMATION` / `POA-PATTERN` / `POA-PRIVATE` / `UNCLASSIFIED-DERIVED` / `AUTHORIZED-SHARED`; `UNCLASSIFIED-DERIVED` as default | `POA-DEC-ORG-001` §12 [U]; `POA-ORG-003` §19 [U] | PROPOSED there; adopted by ORG-003 | **Reuse** |
| Sovereignty principles P1–P5 | `POA-ORG-003` §4 [U] (ratified text) | RATIFIED **(self-described; ORG-003's claim rests on its brief's instruction, while source `POA-DEC-ORG-001` says "pending Commander ratification" — K2, §2.4)** | **Reuse** (restated §4) |
| Observability vs Intelligence boundary; Interpretation/Meaning not yet architecture | `EIA-001` Assessments 002–003 [P] | Committed assessments (A2 recorded as ACCEPTED in A3's own header; A3's own acceptance status not verified this mission) | **Reuse as a binding constraint** (§9, §16, §24) |
| Repository tiers (Private POA / Organization / Project / Deployed Runtime) | `POA-SVC-001` §5 [U]; `POA-IMPL-001` §2 [U] | ESTABLISHED **(in [U] records only; both Provenance-only; no authoritative record states the tier rule — §2.4, §8.4, Q3)** | **Reuse** (§8) as design reasoning, not as authority |
| Gate Guard / Sentinel / Deliberation Gate (admission; metadata-only observation; advisory-only deliberation) | `POA-SEC-ORG-002` [U]; `POA-ORG-003` §20–22 [U] | PROPOSED, unbuilt | **Reuse unchanged** |
| Artifact relationships (Authority-field derivation chain) | `POA-STD-009` [P] | Draft / acceptance pending | **Not reused.** Its scope is repository-artifact relationships only; organizational relationships (§5) are a different domain and do not modify or extend it |
| "Knowledge Core" | `PDM-001` §8 [P]; `EIA-001` A2 §14 [P] | Roadmap name, "not evidenced anywhere… would need architectural definition from zero" | **Not adopted as this substrate's name** — non-decision (§22) |
| "Organizational Intelligence Core" | `POA-VIS-002` [P] (a Sprint Alpha visual mission) | Visual/product mission name | **Not adopted** — name collision avoided (§22) |

## 2.2 Evidence reviewed (read from disk this mission, not recalled)

`10-Constitution/CONST-001-Paravyoma-Constitution.md` (via quoted Articles IX, XII–XIV in `POA-DEC-ORG-001` §10) [P]; `10-Constitution/POA-CON-001.md` [P]; `20-Shared/KER/POA-KER-001.md` [P]; `20-Shared/POA-META-002.md` [P]; `20-Shared/GOV/POA-EVID-001.md` [P]; `20-Shared/GOV/POA-EVT-001.md` [P]; `20-Shared/GOV/GAP-REGISTER-001.md` [P]; `20-Shared/GOV/ORC-001-GOV-001.md` (reserved matters) [P]; `20-Shared/PJR/POA-PJR-001-PARAVYOMA-PROJECT-REGISTRY.md` [P]; `20-Shared/DECISIONS/POA-ADR-001.md` (CTD-001, BA-001 and index) [P]; `20-Shared/STD/POA-STD-009.md` (scope) [P]; `40-Runtime/POA-DEC-ORG-001-DECISION.md` [U]; `-002` [U]; `-003` [U]; `-004` [U]; `40-Runtime/POA-RAT-ORG-001-RATIFICATION.md` [U]; `40-Runtime/POA-ORG-003-ARCHITECTURE.md` §4–26 [U]; `40-Runtime/POA-SVC-001-ARCHITECTURE.md` [U]; `40-Runtime/POA-IMPL-001-ARCHITECTURE.md` §1–9 [U]; `40-Runtime/POA-DEC-SEC-001-DECISION.md` §1–14 [P]; `40-Runtime/POA-DEC-EXEC-001-DECISION.md` [U]; `40-Runtime/POA-OBS-001-COMPLETION-REPORT.md` §4–13 and Revalidation §7–24 [P]; `40-Runtime/EIA-001-ASSESSMENT-002-REPORT.md` [P]; `40-Runtime/EIA-001-ASSESSMENT-003-REPORT.md` §1, §11–13 [P]; `40-Runtime/POA-DEC-MOTHERSHIP-001-DECISION.md` [L]; `40-Runtime/POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` (design reference only) [P]; `40-Runtime/TSAAS-EST-002-COMPLETION-REPORT.md` §6 (financial-record absence) [P].

**Added for revision 1.1.0 (2026-09-25):** `20-Shared/DECISIONS/POA-ADR-001.md` "CTD-001 Scope Interpretation (Q1) Decision Record (2026-09-25)" (appended to a [P] file; the addition itself is uncommitted); `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-Q15-CLASSIFICATION-REPORT.md` [U]; `40-Runtime/ESR-001-RECLASSIFICATION-REPORT.md` [P]; `40-Runtime/POA-SEC-ORG-002-ARCHITECTURE.md` [U] (already counted among the ten [U] in Validation; now also listed here).

**Confirmed absent, not reconstructed:** `POA-000` (Foundational Ontology) and `POA-001` (Master Organizational Architecture) remain Draft-only in the external vault (`POA-CON-001` §5; GAP-005). `POA-104` ("Intelligence Layer Specification", Draft v0.1, `REPO-AUTHORITY-RECONCILIATION-REPORT.md`) exists only in the vault as a Draft. None of the three is used as authority, and none is reconstructed from memory.

## 2.3 What is genuinely missing

No existing artifact defines:

- the **business-domain content** of organizational knowledge (financial, sales, operational, workforce, market facts);
- the **business-function sense** of "capability" (Finance *owns* invoicing) and how POA knows who owns a function;
- a **truth-class labeling discipline** spanning observation → decision for organizational knowledge;
- the **repository vs organizational data plane** boundary;
- a **generalized source/connector** model beyond `POA-OBS-001`'s project-state pilot;
- how an executive **question decomposes** across knowledge domains.

These six are what this document proposes. Everything else is reuse.

## 2.4 Authority status of the [U] predecessors (Q15 classification, added 1.1.0)

Source: `40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-Q15-CLASSIFICATION-REPORT.md` [U] (read-only, 2026-09-25), applying the ESR-001 operative test (`40-Runtime/ESR-001-RECLASSIFICATION-REPORT.md` §2): (1) formal citation by a committed, currently-authoritative artifact; (2) record type designated as an authoritative mechanism; otherwise Provenance-only. The classification report is itself an untracked provenance record; this section restates its results and does not add to them.

**Governing distinction:** self-claimed authority ≠ demonstrated authority ≠ provenance. No committed, currently-authoritative record cites any of the ten: `POA-ADR-001` cites none; the only committed decision record that cites them, `POA-DEC-SEC-001`, is itself a decision candidate as a whole (its ratified §25–§26 cite none of the ten); `POA-BLD-001`/`-002` are completion reports (Provenance-only by ESR-001 precedent) (report §4.1). All ten trace their mission authority to briefs held outside the repository, whose authority POA governance has expressly left unaddressed (`POA-ADR-001` §G; `POA-EVID-001` line 96).

| # | Record | Own self-description | Classification |
|---|---|---|---|
| 1 | `POA-RAT-ORG-001` | Records Model C etc. as "RATIFIED" on the basis of its brief | **INDETERMINATE** |
| 2 | `POA-DEC-ORG-001` | Decision candidate; disclaims ratification | Provenance-only |
| 3 | `POA-DEC-ORG-002` | Decision candidate; Model C "PROPOSED" | Provenance-only |
| 4 | `POA-DEC-ORG-003` | Own verdict "RATIFIED — PROTOCOL FAMILY" | Provenance-only (self-claim not demonstrated; K1) |
| 5 | `POA-DEC-ORG-004` | Own verdict "CONDITIONALLY RATIFIED" | Provenance-only (self-claim not demonstrated; K1) |
| 6 | `POA-ORG-003` | P1–P5 "RATIFIED" per its brief's instruction only | Provenance-only (derivative claim; K2) |
| 7 | `POA-SVC-001` | Authorizes implementation planning "if this document is accepted"; no acceptance record found | Provenance-only (conditional claim; K4) |
| 8 | `POA-IMPL-001` | "BUILD AUTHORIZED WITH CONDITIONS" as "this document's own act" | Provenance-only (self-authorization not demonstrated; K3) |
| 9 | `POA-DEC-EXEC-001` | Records Commander rulings D1–D7 from an external directive | **INDETERMINATE** |
| 10 | `POA-SEC-ORG-002` | All new content PROPOSED | Provenance-only |

**Totals: 0 Authority-bearing, 8 Provenance-only, 2 Indeterminate.** Consequence for this document: every RATIFIED or ESTABLISHED tag above or below whose only source is one of these ten reports that record's self-description. This document may *reuse* their content as design reasoning (restated inline), but none of it is recognized POA authority. Whether any of the ten should be recognized is a separate Commander decision, not made here.

**Authority conflicts disclosed by the Q15 report (recorded, not resolved):**

| ID | Conflict / dependency |
|---|---|
| K1 | `POA-DEC-ORG-003`/`-004` declare themselves RATIFIED; committed `POA-DEC-SEC-001` (lines 10, 310) calls `POA-DEC-ORG-001` through `-004` decision-candidate records |
| K2 | P1–P5 are "pending Commander ratification" in `POA-DEC-ORG-001` but "Commander-ratified" in `POA-ORG-003`, on its brief's instruction; no ratification record found |
| K3 | `POA-IMPL-001`'s self-granted build authorization is relied on by pushed `POA-BLD-001` and the pushed `50-Mothership/` runtime, and placed in `POA-DEC-SEC-001`'s Authority chain; no authoritative record recognizes it |
| K4 | `POA-SVC-001`'s authorization is conditional on an acceptance never recorded; external briefs and this document (1.0.0) treated its content as authoritative/ESTABLISHED |
| K5 | This document's 1.0.0 status tags (RATIFIED/ESTABLISHED) rested on [U]-only sources — **addressed in 1.1.0 by qualification only**; the underlying recognition question stays open |
| K6 | The 1.0.0 Q15 row listed nine records; §2.2/Validation counted ten — **corrected in 1.1.0** (§20 Q15 now lists all ten) |
| K7 | `POA-ADR-001` names the ADR family "the sole mechanism" for decision records, while a `DEC-*` decision-record practice exists in `40-Runtime/` |
| K8 | `POA-RAT-ORG-001`'s brief cites a baseline hash that is not a valid object (self-reported; benign) |
| K9 | External directive-source authority is expressly unaddressed by POA governance, yet all ten records trace their authorization to such sources |

K5 and K6 are corrections to this document's own text. K1–K4 and K7–K9 remain open; no existing authoritative record permits resolving them here.

---

# 3. Problem Statement

> How can POA understand an organization — its structure, work, performance, obligations and decisions — well enough to answer executive questions and route intent to the right owner, **without** (a) becoming the organization's operational database, (b) presenting inference as fact, (c) acquiring authority it was never granted, or (d) violating any organization's sovereignty — including Paravyoma's own?

The brief's twenty questions map to this document as follows:

| # | Question | Answered in |
|---|---|---|
| 1 | What organizational knowledge exists? | §5 |
| 2 | Canonical representation | §5.3 (Knowledge Assertion) |
| 3 | Where knowledge lives | §8 |
| 4 | How POA ingests it | §6, §7 |
| 5 | Fact / observation / evidence / inference / analysis / recommendation / decision / action / result | §9 |
| 6 | Provenance | §10 |
| 7 | Historical state | §11 |
| 8 | Staleness | §12.2 |
| 9 | Uncertainty and confidence | §12 |
| 10 | Authority | §13 |
| 11 | Who owns a capability | §13.3, §14 |
| 12 | Delegation across boundaries | §14, §15 |
| 13 | External systems | §7 |
| 14 | Documents | §7.3 |
| 15 | APIs | §7.4 |
| 16 | API provenance | §7.4, §10 |
| 17 | Reconciliation | §19.2 |
| 18 | Contradictions | §19.1 |
| 19 | Multi-domain executive questions | §16 |
| 20 | Evidence-backed analysis without confusing inference with truth | §9, §16.4 |

---

# 4. Architectural Principles

Principles are derived from existing POA commitments wherever possible; genuinely new ones are marked PROPOSED.

**Inherited, restated inline** (P1–P5 are RATIFIED per `POA-ORG-003` §4 [U] — **self-described**; not recognized POA authority, K2, §2.4):

> **P1 — Organizational Sovereignty:** An organization retains sovereignty over its substantive organizational information and interests, subject to explicitly authorized POA capabilities.
> **P2 — Creator Separation:** POA creation/stewardship does not automatically confer organizational access.
> **P3 — Authority Separation:** Technical access does not constitute organizational authority.
> **P4 — Explicit Delegation:** POA acts within an organization's domain through explicitly authorized capabilities.
> **P5 — Provenance:** Derived knowledge crossing organizational boundaries requires sufficient provenance to establish origin, classification, and authorization status.

**Knowledge-architecture principles:**

| ID | Principle | Basis | Status |
|---|---|---|---|
| K-1 | **Reference, don't absorb.** The organization's systems of record remain authoritative for their own data. POA holds references and bounded observations, never a mirror of source content | `POA-OBS-001` §4 (MUST/SHOULD/SOURCE-ONLY/SENSITIVE), §11; brief: "POA sits above the organization's existing systems" | DERIVED |
| K-2 | **Evidence before state.** No state value is held without the evidence reference that justifies it, or an explicit UNKNOWN | `POA-OBS-001` §5 | ESTABLISHED |
| K-3 | **Inference never becomes truth by itself.** A conclusion becomes organizational position only when an authorized human Decision restates it and that Decision is synchronized to the authoritative record | `EIA-001` A3 §1 [P]; `OPV-003` §6 | ESTABLISHED |
| K-4 | **Every knowledge item is self-describing:** kind, provenance, time, basis, freshness, classification, organization scope | Generalization of `observation_snapshot_v2` field pairing | DERIVED |
| K-5 | **Unknown is a first-class value.** Absence of evidence is recorded as UNKNOWN, never as a negative or a default | `POA-OBS-001` §9; `PJR-001` | ESTABLISHED |
| K-6 | **Contradictions are preserved, never silently resolved** | `POA-OBS-001` Revalidation §8; `CLAUDE.md` Rule 8 | ESTABLISHED |
| K-7 | **Knowing who owns a function is not authority over it.** POA may route intent to an owner; routing confers nothing | P3; `POA-SVC-001` §3 (Service Plane has no authority of its own) | DERIVED |
| K-8 | **Git holds what POA *is* and what has been *decided*; the data plane holds what has been *observed*.** Git is never the organization's operational database | Brief; `POA-SVC-001` §5; `POA-DEC-SEC-001` §13 | PROPOSED |
| K-9 | **Vendor neutrality.** No source, connector or model provider is part of POA's ontology | `POA-OBS-001` §10/§16; `POA-SVC-001` §6–7 | ESTABLISHED |
| K-10 | **Minimum necessary observation.** Observe the smallest field set that answers the organizational question | `POA-OBS-001` §4, §11 | ESTABLISHED |
| K-11 | **Honest coverage.** Every synthesized answer states what it covers, what it does not, and why — never filling a gap with plausible text | Mothership Experience Architecture Principle 6 (design reference); `POA-OBS-001` explicit_unknowns | DERIVED |
| K-12 | **Architecture is not development authorization.** Each build step is separately evidence-gated | `CTD-001` [P]; `EIA-001` A3 [P] | ESTABLISHED |
| K-13 | **Content from sources is data, never instruction.** Nothing read from a document, API or system can direct POA's behavior | DERIVED from P3 and the delegation chain (§14); a security necessity for AI-mediated ingestion | PROPOSED |

---

# 5. Organizational Knowledge Model

## 5.1 Two layers: subjects and assertions

The brief lists roughly 33 concepts. They are not all the same kind of thing. **The model distinguishes three kinds** (PROPOSED), which is the minimum needed to avoid both a flat table-per-noun design (the brief forbids assuming "every item requires a separate database table") and accidental promotion of attributes to identities (forbidden by `POA-ORG-003` §5).

1. **Knowledge Subjects.** Things in or around the organization that knowledge is *about* (a customer, a project, a system, an organizational unit).
2. **Knowledge Assertions.** Time-bounded, sourced claims *about* subjects (e.g. "the accounting system reports revenue R for period Q", "Project X is in phase Y"). **All facts, observations, inferences, analyses, recommendations and decisions are assertions**, differing by *kind* (§9).
3. **Cross-cutting attributes.** Properties every assertion carries (provenance, time, confidence, classification, scope), not things in their own right.

**Being a Knowledge Subject is not being an Identity.** Identity classes remain exactly `POA-ORG-003` §5's set: Organization, Human, Execution Agent (first-class) and Service (attribute-light). A Customer or Project can be a subject of knowledge without being an actor that authenticates, holds grants or represents anything. This is DERIVED directly from ORG-003 §5's reasoning ("A Project is *where* an authorized action is scoped, not *who* is acting").

## 5.2 Concept classification (the brief's full list)

| Brief concept | Kind | Grounding | Status |
|---|---|---|---|
| ORGANIZATION | Subject **and** Identity | `POA-ORG-003` §6; Model C | RATIFIED (self-described; §2.4) |
| PEOPLE | Subject (workforce knowledge); a person becomes an Identity only when they act in POA (Human identity) | `POA-ORG-003` §8 | DERIVED |
| PRINCIPALS | **Mapped, not new:** an authenticated Human identity acting under Representation, or a Service identity. The 50-Mothership runtime's `ExecutionPrincipal` is one implementation instance | `POA-SVC-001` §8; `POA-IMPL-001` §4 | ESTABLISHED — no new term |
| ROLES | Attribute of the Human↔Organization relationship, not an identity | `POA-ORG-003` §8 | ESTABLISHED |
| DEPARTMENTS | Subject: **Organizational Unit** (a department is one kind of unit), **self-declared by the organization** | No POA precedent. The organization's internal structure is its own information (P1) | PROPOSED |
| CAPABILITIES (business sense) | Subject: **Business Function**. See §5.4: this is a *distinct* sense from a Capability Grant | No POA precedent in the business sense | PROPOSED |
| AUTHORITIES | Capability Grants plus Representation records (existing), plus an organization's **declared authority requirements** per Business Function action (new, §13.3) | Grants/Representation ESTABLISHED; declared requirements PROPOSED | Mixed |
| PROJECTS | Subject; scope attribute on missions and grants; never an identity | `POA-ORG-003` §5; `POA-PJR-001` | ESTABLISHED |
| MISSIONS | Subject; identity via the EXC/EXB/EXR chain plus Organization field | `POA-KER-001`; `POA-ORG-003` §15 | ESTABLISHED |
| CUSTOMERS | Subject: an **external party** of the organization. Customer information is the organization's information (P1), not the customer's POA relationship. A customer that is itself an Organization using POA remains a separate sovereign (AOI-8, `POA-DEC-ORG-002` §21) | P1; AOI-8 | DERIVED |
| SERVICES / PRODUCTS | Subject: **Offering** — what the organization provides. Distinct from Product *identity*, which ORG-003 §5 rejected as first-class | `POA-PJR-001`/`002`/`003` (Temple SaaS is recorded as a product initiative) | DERIVED |
| FINANCIAL / SALES / OPERATIONAL / WORKFORCE FACTS | **Assertion families** (measures over periods), not subjects (§5.5) | No POA precedent for business-domain facts | PROPOSED |
| MARKET INTELLIGENCE | Assertion family about **external subjects** (markets, competitors); default source authority is non-authoritative/supporting (§12.4) | `POA-OBS-001` source-authority matrix pattern | PROPOSED |
| SYSTEMS | Subject: an organizational **System** (a CRM, accounting platform or repository). A system is infrastructure, never authority (`POA-SVC-001` §6–7). It may be a system of record for specific predicates (§19) | `POA-SVC-001` §6–7 | DERIVED |
| DATA SOURCES | Subject: **Source** — a declared, addressable origin of observations, usually hosted by a System (§7.1) | `POA-OBS-001` `authoritative_source_reference`, `source_kind` | DERIVED |
| DOCUMENTS | Subject **and** Evidence artifact | `POA-OBS-001` §5 | DERIVED |
| EVIDENCE | Existing concept, reused unchanged | `POA-EVID-001`; `POA-DEC-SEC-001` | ESTABLISHED |
| OBSERVATIONS | Assertion kind (§9) | `POA-OBS-001` | ESTABLISHED |
| DECISIONS | Assertion kind; authoritative form is a Decision Record | `POA-ADR-001`; `POA-IMPL-001` §7 | ESTABLISHED |
| ACTIONS | Assertion kind; evidenced by execution events and mission lifecycle records | `POA-EVT-001`; `POA-IMPL-001` §7 | ESTABLISHED |
| RESULTS | Assertion kind: an observed consequence of an action, linked to it by reference. The link is correlation; causation is an inference | `POA-EXB-001` EXR; `POA-IMPL-001` §7 Closure | DERIVED |
| RISKS / OPPORTUNITIES | Assertion kinds: **judgments** (inference or analysis) about subjects, never facts. An identified risk is an analysis with evidence references; an *accepted* risk is a Decision | `EIA-001` A2 §5 ("Identify emerging organizational risk — NOT YET DEMONSTRATED"); `GAP-REGISTER-001` as a manually curated precedent | DERIVED |
| DEPENDENCIES | Relationship type (§5.6) | — | PROPOSED |
| RELATIONSHIPS | Cross-cutting: typed, time-bounded, sourced links between subjects (§5.6). Distinct from `POA-STD-009` artifact relationships | — | PROPOSED |
| HISTORICAL STATE | Cross-cutting: temporal attributes and append-only supersession (§11), not a separate store | `POA-PJR-001` append-only; `POA-EVT-001` §J | DERIVED |
| PROVENANCE | Cross-cutting (§10) | `POA-OBS-001` §7; P5 | ESTABLISHED |
| CONFIDENCE | Cross-cutting (§12) | `POA-PJR-001`; `POA-OBS-001` | ESTABLISHED |
| AUTHORITY | Cross-cutting on Decision and Action assertions (the authority reference), plus the Authority model (§13) | `POA-EVT-001` §D Authority Reference | ESTABLISHED |

## 5.3 Canonical representation: the Knowledge Assertion

**PROPOSED, conceptual only — not a schema, table or API.** A Knowledge Assertion generalizes `observation_snapshot_v2`'s established field-pairing pattern (value + `state_confidence` + `evidence_reference`) from project state to any organizational subject:

```text
KNOWLEDGE ASSERTION (conceptual)
├── Identity            assertion_id (stable, never reused)
├── Organization scope  organization_id  -- every assertion belongs to exactly one organization (P1)
├── Subject             subject reference (+ optional scope attributes: project, offering, unit)
├── Claim               predicate / measure, value (or UNKNOWN), unit, period
├── Kind                SOURCE-OBSERVATION | VERIFIED | DERIVED | INFERENCE | ANALYSIS |
│                       RECOMMENDATION | DECISION | ACTION | RESULT          (§9)
├── Basis               VERIFIED | SELF-DECLARED | INFERRED | ESTIMATED | UNKNOWN   (§12.1)
├── Freshness           CURRENT | STALE | UNKNOWN                              (§12.2)
├── Consistency         CONTRADICTED (+ refs to conflicting assertions) | none known (§12.3)
├── Source authority    AUTHORITATIVE | SUPPORTING | NON-AUTHORITATIVE for this predicate (§12.4)
├── Time                valid period · source_updated_at · observed_at · recorded_at
│                       (+ decided_at / authoritative_at for decisions)       (§11)
├── Provenance          source ref · source record/revision · adapter/observer identity ·
│                       grant reference · evidence refs · derivation inputs   (§10)
├── Classification      ORGANIZATION-INFORMATION | POA-PATTERN | POA-PRIVATE |
│                       UNCLASSIFIED-DERIVED (default) | AUTHORIZED-SHARED   (DEC-ORG-001 §12)
├── Sensitivity         MUST / SHOULD / SOURCE-ONLY / SENSITIVE-RESTRICTED    (OBS-001 §4)
├── Authority ref       required for DECISION and ACTION kinds (who, under which grant/representation)
└── Supersession        supersedes / superseded_by (append-only; never overwritten)
```

**Not every field applies to every kind.** `Authority ref` is mandatory only for DECISION and ACTION. `Source authority` applies to observed kinds. `Derivation inputs` apply to DERIVED, INFERENCE and ANALYSIS. Each field is justified by a question in §3. None is included "because it might be useful someday" (`POA-OBS-001` §6 discipline).

**Why assertions, not entity tables** (DERIVED). Every hard requirement in the brief — history (§11), provenance (§10), contradiction (§19), staleness (§12) and inference-vs-truth (§9) — is a property of a *claim*, not of a thing. An entity table holding "the customer's current revenue" can express none of them without bolting on metadata. The assertion is the smallest unit that can.

## 5.4 Terminology: four senses of "capability"

"Capability" already carries three distinct meanings in POA. The brief introduces a fourth. Collapsing them would silently merge authority with ownership with execution resources, so they are held apart:

| Sense | Meaning | Source | Term used in this document |
|---|---|---|---|
| Capability increase | The organizational capability a production burn adds | `POA-KER-001` §10 [P] | "capability increase" |
| Capability grant | A scoped, revocable, evidenced permission (Org/Mission/Action/Time) | `POA-ORG-003` §13; `POA-SVC-001` §10 [U] | **Capability Grant** |
| Execution capability tier | R0–R5 required reasoning capability (+ optional domain qualifier) | `POA-DEC-EXEC-001` D1 [U], RATIFIED (self-described; DEC-EXEC-001 INDETERMINATE, §2.4) | "R-tier" |
| Business capability (brief) | What the organization can do and who owns it (invoicing belongs to Finance) | Brief | **Business Function** (PROPOSED term) |

**Rule** (PROPOSED): in this document the brief's `INTENT → CAPABILITY → OWNER` chain reads `INTENT → BUSINESS FUNCTION → OWNER`. **A Business Function is organizational knowledge, not a permission.** Knowing that Finance owns invoicing grants nobody anything. The permission to act is always a separate Capability Grant (K-7).

## 5.5 Business-domain fact families

PROPOSED. These are the families of Knowledge Assertions POA must be able to represent to answer the brief's executive questions. Each is a *family of measures over periods*, not a table:

| Family | Typical predicates (illustrative only, not an enumerated schema) | Typical system of record | Default sensitivity |
|---|---|---|---|
| Financial | revenue, expenses, cash position, receivables, payables, margin; statement-level figures by period | Accounting platform, banking feeds, financial statements | SENSITIVE-RESTRICTED for detail; SHOULD for period aggregates |
| Sales | pipeline stage counts/values, bookings, win/loss, customer acquisition | CRM, sales systems | SHOULD aggregates; SOURCE-ONLY deal detail |
| Operational | delivery status, throughput, incidents, SLA adherence, project phase | Project management, ticketing, repositories | MUST/SHOULD |
| Workforce | headcount, allocation, utilization, open roles | HR system | **Aggregates only by default**; individual-level data SENSITIVE-RESTRICTED (§18) |
| Market intelligence | market size claims, competitor moves, pricing signals | External research, public sources | SUPPORTING/NON-AUTHORITATIVE source authority by default |

**Measure definitions are organizational decisions, not POA's** (PROPOSED). Whether "revenue" means invoiced, recognized or collected is a policy of the organization. An executive answer is only interpretable relative to a declared definition. POA records which definition an assertion uses. It never picks one silently, and a missing definition is surfaced as UNKNOWN (§16.3). Governance of definitions: **TBD — requires architectural decision** (§20 Q7).

## 5.6 Relationships

PROPOSED. A relationship is itself an assertion (subject A —type→ subject B, valid period, source, basis), so relationships carry the same provenance, time and confidence as any other claim. Illustrative types: *owns* (unit → business function, self-declared), *serves* (organization → customer), *delivers* (project → offering), *depends-on* (project → system, project → project), *hosted-by* (source → system), *is-system-of-record-for* (system → predicate, org-declared). **No closed relationship taxonomy is enumerated here**, for the same reason `POA-DEC-EXEC-001` §2.1 declined to enumerate a domain-qualifier taxonomy: enumeration is a ratification-level act that would pre-empt organizational declarations.

---

# 6. Knowledge Lifecycle

## 6.1 The fifteen stages

The brief's lifecycle is adopted as a **conceptual sequence, not an implementation pipeline**. Each stage maps to an existing mechanism where one exists.

| # | Stage | What happens | Output (kind) | Gate / authority required | Existing mechanism | Status |
|---|---|---|---|---|---|---|
| 1 | SOURCE | A Source is declared: what it is, who owns it, what it is authoritative for | Source declaration (organization-self-declared) | Organization's Representative | `POA-OBS-001` §15 "declared observation sources" | DERIVED |
| 2 | INGEST | An Observation Adapter reads the source under a grant | Raw observation (transient) | Capability Grant: *observe* (P4; `POA-DEC-ORG-001` §9) | `POA-OBS-001` adapter concept | ESTABLISHED |
| 3 | IDENTIFY | Resolve which subject(s) the observation is about | Subject linkage (deterministic key = VERIFIED; fuzzy match = INFERENCE) | None beyond stage 2 | — | PROPOSED |
| 4 | NORMALIZE | Map to the canonical assertion shape; apply the declared measure definition | SOURCE-OBSERVATION assertion | Classification and sensitivity applied at capture (`POA-DEC-ORG-001` §13) | `observation_snapshot_v2` | DERIVED |
| 5 | STORE | Append to the organization's knowledge plane (§8) | Persisted assertion | Capability Grant: *store* (`POA-DEC-ORG-001` §9) | — (no store exists; none created) | PROPOSED |
| 6 | LINK | Relate the assertion to others (same subject, same period, supersession, contradiction) | Relationship assertions | — | — | PROPOSED |
| 7 | VERIFY | Corroborate against primary evidence or an independent source, or record human attestation | Basis upgraded to VERIFIED (scope stated) or left unchanged | Verifier distinct from producer (`POA-DEC-SEC-001` §5) | `POA-IMPL-001` §7 Verification stage | DERIVED |
| 8 | OBSERVE | Detect changes, staleness and contradictions across assertions | Observation-of-knowledge (e.g. STALE flag, CONTRADICTED flag) | — | `POA-OBS-001` §14; Sentinel (metadata only) | DERIVED |
| 9 | ANALYZE | Deterministic computation (DERIVED facts) and structured composition (ANALYSIS) | DERIVED / ANALYSIS | Capability Grant: *transform/aggregate* (`POA-DEC-ORG-001` §9) | — | PROPOSED |
| 10 | REASON | Non-deterministic interpretation (human or AI) | INFERENCE (Category A per `EIA-001` A2) | Provenance required (`POA-DEC-ORG-001` §13) | Report prose today | ESTABLISHED boundary |
| 11 | RECOMMEND | Propose an action | RECOMMENDATION (non-binding) | Grant to *receive recommendations* (`POA-ORG-003` §13) | Deliberation Gate (advisory) | ESTABLISHED |
| 12 | DECIDE | An authorized human (or POA Governance, for POA scope) decides | DECISION (authority-bearing once synchronized) | Organization authority / POA Governance | `POA-ADR-001`; `POA-IMPL-001` §7 | ESTABLISHED |
| 13 | ACT | Execute through a mission under the decision's grant | ACTION | Request → Authorization → Dispatch → Execution | `POA-SVC-001` §11; `POA-EVT-001` | ESTABLISHED |
| 14 | RECORD RESULT | Observe the consequence and link it to the action | RESULT (enters again at stage 2 as an observation) | — | EXR; `POA-IMPL-001` Closure | ESTABLISHED |
| 15 | LEARN / UPDATE | New assertions supersede old ones; methods and definitions improve | Superseding assertions; revised definitions (by Decision) | Organizational learning is **human/Commander-mediated**, never automatic | `EIA-001` A2 §5 ("Learn from previous execution: Human/Commander-mediated only") | ESTABLISHED |

**Stage 15 honors the Article IX/XIV boundary.** Pattern-level learning (`POA-PATTERN`) may accumulate across engagements (Article IX/XIII, per `POA-DEC-ORG-001` §11 Q1–Q5). Information-level learning stays organization-sovereign (Q7). The unresolved boundary cases (Q6/Q7) are **not resolved here** (§20).

## 6.2 The six-way distinction the brief requires

| Plane | Definition | Kinds | Authority-bearing? | Owner |
|---|---|---|---|---|
| **Source data** | The system of record's own state | — (POA never holds it; it holds observations of it) | Authoritative for its own domain and time only | The organization (its systems) |
| **Organizational knowledge** | Sourced, labeled assertions about the organization | SOURCE-OBSERVATION, VERIFIED, DERIVED | Evidence-grade, not decision-grade: usable as evidence, but no decision by itself | The organization (P1); POA holds custody under grant |
| **Derived analysis** | Structured compositions of knowledge answering a question | ANALYSIS | No — Provenance-only (`EIA-001` A3 §1) | The organization |
| **AI inference** | Non-deterministic conclusions by a model or agent | INFERENCE | **Never** | The organization (information-level); pattern-level per Art. IX, subject to Q6/Q7 |
| **Recommendation** | Proposed action | RECOMMENDATION | Never (advisory) | The organization |
| **Authorized organizational decision** | An authorized act, recorded and synchronized | DECISION | **Yes** — the only authority-bearing plane | The deciding authority |

---

# 7. Source / Connector Architecture

## 7.1 Generic abstraction

**No new mechanism term is introduced.** The brief's "connector" is exactly `POA-OBS-001`'s **Observation Adapter** (producing direction: `Execution Environment → Observation Adapter → Observation Contract → POA`), which `POA-DEC-MOTHERSHIP-001` §1/§4 [L] preserved as the committed meaning of "adapter." That record's vocabulary conflict with the read-time "adapter" label in the Dogfooding D-B table remains unresolved, and this document does not resolve it (§22).

Three separable concepts (DERIVED from `POA-OBS-001` §6/§10):

| Concept | What it is | Carries | Never carries |
|---|---|---|---|
| **Source** (declared) | An addressable origin of organizational information: a system, a document set, a feed, a human | Organization, source kind, location reference (a pointer), declared owner (unit/role), predicates it is declared authoritative for, declared update cadence if any, sensitivity class | Credentials, raw content |
| **Observation Adapter** | The mechanism that reads a Source and emits assertions in the canonical shape | Adapter identity and version; acts as a **Service identity** under a Capability Grant scoped to one organization (`POA-SVC-001` §8/§10) | Standing authority; write access to the source (writing is a separate *execute* grant, §13) |
| **Observation** | One adapter run's output | Assertions + run metadata (`observed_at`, coverage, failures) | Instructions (K-13) |

**Adapter contract (conceptual, PROPOSED):**

1. It authenticates as a Service identity, never as a person, and never with a Steward identity (P2; `POA-SVC-001` §17).
2. It operates under an explicit *observe* grant for exactly one organization. A multi-organization adapter is, architecturally, several scoped instances (isolation dimensions: `POA-SVC-001` §15).
3. It applies field classification at capture (MUST/SHOULD/SOURCE-ONLY/SENSITIVE-RESTRICTED). SOURCE-ONLY fields are referenced, not copied.
4. It reports its own coverage and failures. A partial read is recorded as partial, never as complete (`POA-ORG-003` §26: "Evidence cannot be returned → flagged incomplete, not silently marked successful").
5. It is idempotent per source record and revision: re-reading the same revision produces no duplicate assertion (§19.3).
6. Source-specific detail lives in the adapter or in `source_location_reference`, never in core field names (`POA-OBS-001` §10).

## 7.2 The ten source classes

| # | Source class | Examples (brief) | Provenance anchor | Freshness signal | Default basis of resulting assertions |
|---|---|---|---|---|---|
| 1 | Manual entry | A person records a fact in POA | Entering Human identity + representation + time | Entry time only | **SELF-DECLARED** |
| 2 | Uploaded documents | Balance sheet PDF, contract | Content digest of the uploaded artifact + uploader identity + document's own stated date | Document-internal date (if any; human-maintained and often stale — `POA-OBS-001` Revalidation §14) | VERIFIED *as-stated-by-document* (§7.3) |
| 3 | Structured files | CSV/XLSX exports | Content digest + export metadata + declared schema | Export timestamp | VERIFIED as-exported |
| 4 | APIs | Finance/CRM/HR REST APIs | Source system + endpoint/object type + source record id + source revision/etag + response digest (§7.4) | Source-side modified time (diagnostic) + observed_at | VERIFIED as-sourced |
| 5 | Existing enterprise systems | ERP, accounting platform | As APIs, or the system's export/report identity | As APIs | VERIFIED as-sourced |
| 6 | Databases | Direct read-only queries | Database identity + query identity + as-of/snapshot marker | Snapshot time | VERIFIED as-sourced |
| 7 | Git repositories | GitHub-hosted delivery repos | Repository + commit SHA + path + blob SHA — **the strongest anchor available** (`POA-OBS-001` Revalidation §13; `POA-DEC-SEC-001` §10) | Commit/push timestamp (platform metadata, more reliable than document dates — Revalidation §14) | VERIFIED as-committed |
| 8 | SaaS systems | Google Workspace, marketing tools | Tenant + object id + version/modified | Modified time | VERIFIED as-sourced |
| 9 | Human observations | "Client said X in the meeting" | Observing Human identity + time + context | Observation time | **SELF-DECLARED** (unless corroborated) |
| 10 | POA-generated observations | Sentinel boundary metadata, staleness detection, contradiction detection | Producing Service identity + inputs | Generation time | **Observational, never authoritative** unless promoted by an explicit evidentiary act (`POA-SVC-001` §12) |

**"Verified as-sourced" is a scoped claim** (DERIVED from `POA-OBS-001` Revalidation §13: "confidence = VERIFIED (document exists, text as quoted), INFERRED (whether the verdict still holds today)"). It verifies that *the source stated X at time t*. It does not verify that X is true of the world. The distinction is carried by Source Authority (§12.4) and Freshness (§12.2), not collapsed into one label.

The example systems the brief names (Finance system, CRM, HR, project management, accounting, Google Workspace, GitHub, ERP, banking feeds, sales and marketing systems) all fall into classes 4–8. **None is named in POA's ontology** (K-9). Each would be one Source declaration served by one adapter.

## 7.3 Document ingestion (brief Q14)

Documents are **Evidence artifacts first and knowledge sources second** (PROPOSED, DERIVED from `POA-OBS-001` §5):

1. **Capture.** The document is identified by content digest, uploader identity, organization and the document's own stated date or period. The artifact stays in the organization's domain (§8).
2. **Document-level attributes** recorded as assertions about the document: type (e.g. balance sheet), period, preparer or issuer, **assurance status** where stated (e.g. audited vs management accounts vs draft), version. Assurance status materially changes source authority (§12.4). If unstated, it is UNKNOWN, never assumed.
3. **Extraction.** Figures and clauses are extracted into assertions whose claim is "*document D states* predicate = value." They are VERIFIED only as-stated-by-D.
   - **If extraction is performed by a deterministic parser** from a structured source, the as-stated claim is VERIFIED.
   - **If extraction is performed by OCR or an AI model**, the extraction itself is an **INFERENCE** until verified: by deterministic re-check against the document, or by human attestation from an authorized role. A model reading a balance sheet does not produce verified financial facts.
4. **Content is data, never instruction** (K-13). Text inside a document (including anything phrased as a command) cannot alter POA behavior, grants, routing or classification.

| Document type (brief) | Key document-level attributes | Special handling |
|---|---|---|
| Balance sheets / financial reports | period, entity, preparer, assurance status, currency, basis of preparation | Restatements are *new* assertions superseding old ones; both retained (§11.3) |
| Sales reports | period, source system, definitions used (bookings vs revenue) | Definition must match a declared measure definition or be flagged (§5.5) |
| Project reports | project, reporting date, author, status claims | Status claims are SELF-DECLARED unless corroborated (the `POA-OBS-001` DAR-001 lesson: *commissioned ≠ produced ≠ approved*) |
| HR information | aggregation level | Individual-level data SENSITIVE-RESTRICTED; aggregate by default (§18) |
| Market research | publisher, date, methodology if stated | Default NON-AUTHORITATIVE / SUPPORTING (§12.4) |
| Contracts | parties, effective dates, term, obligations extracted | Full text SOURCE-ONLY; obligations extracted as assertions with clause references; legal interpretation is INFERENCE, never fact |
| Operational reports | period, system/process, author | As project reports |

## 7.4 API consumption and provenance (brief Q15–Q16)

**Provenance required for every API-derived assertion** (PROPOSED, DERIVED from `POA-OBS-001` §7/§13 and `POA-DEC-SEC-001` §8):

| Field | Purpose |
|---|---|
| Source system identity | Which declared Source |
| Object type / endpoint class | What kind of record (not the raw URL with parameters if that could embed identifiers or secrets) |
| Source record identifier | Stable id in the source, for idempotency and re-verification |
| Source revision marker | etag / version / modified timestamp — **diagnostic** (source clocks are self-asserted; `POA-DEC-SEC-001` §12) |
| `observed_at` | When POA read it |
| Response digest | Hash of the canonicalized response fragment the assertion came from, so "what did the source say" can be re-checked |
| Adapter identity + version | Who read it, with which mapping logic |
| Grant reference | Under which *observe* grant |

**Never recorded:** tokens, keys, session cookies or connection strings (`POA-OBS-001` §11; `POA-DEC-ORG-001` §9 "credentials/secrets"). Credentials live only in the Deployed Runtime tier (`POA-SVC-001` §5.D).

**Integrity strength is proportional** (DERIVED from `POA-DEC-SEC-001` §4 Q3). Ordinary observations are Provenance-grade. Only when an observation becomes the *basis* of an authority-bearing decision does it need to meet `POA-EVID-001` §C (reproducibly identifiable). Whether it also needs `POA-DEC-SEC-001`'s signature path is open (§20 Q2).

---

# 8. Repository vs Organizational Data Plane Boundary

## 8.1 The boundary rule

> **Git holds what POA *is* and what has been *decided*. The organizational data plane holds what has been *observed* and *derived*.** (K-8, PROPOSED)

This extends `POA-SVC-001` §5's four-tier boundary test ("does removing this change POA-for-everyone (A), Organization-X-only (B), Project-Y-only (C), or nothing until redeployed (D)?") with a fifth question that the tiers did not need before business data entered scope: **"is this a governed act or definition, or is it an observation of the organization's operating state?"** Governed acts and definitions go to a git tier. Observations go to the data plane. **(1.1.0)** `POA-SVC-001` is Provenance-only (§2.4): its four-tier test is reused here as design reasoning, not as a recognized POA rule; where the placement table below marks a `POA-SVC-001`-sourced row ESTABLISHED, read "stated in an unrecognized record" (Reading Conventions).

## 8.2 Placement table

| Content | Home | Rationale | Status |
|---|---|---|---|
| Constitution, governance, POA architecture, this ADR | Private POA Repository (`10-Constitution/`, `20-Shared/`, `40-Runtime/`) | Tier A — what POA is | ESTABLISHED |
| Knowledge-model definitions (the conceptual model; later, ratified schemas) | Private POA Repository | Tier A — identical for every organization | DERIVED |
| POA governance and execution evidence | Git, via the `POA-DEC-SEC-001` path (envelope → hash → signature for authority-bearing evidence → git → witness) | `POA-DEC-SEC-001` §13: git remains the sole persistence mechanism for this evidence; no second store | ESTABLISHED |
| An organization's decision records, source declarations, business-function map, authority requirements, measure definitions | That organization's **Organization Repository** tier | Tier B — governed, organization-scoped, low-volume, needs history and review | DERIVED |
| Knowledge Assertions (observations, derived facts, inferences, analyses) | That organization's **organizational knowledge plane** (data plane) — outside git | High-volume, frequently superseded, often sensitive: exactly what git must not become | PROPOSED |
| Source artifacts (documents, exports) | **Stay in the system of record**; only references are held, except uploaded documents, which are held in the organization's own domain | K-1 | DERIVED |
| Source references | Inside assertions (provenance) | `POA-OBS-001` `source_location_reference` | ESTABLISHED |
| Derived knowledge | Organizational knowledge plane, classified; `UNCLASSIFIED-DERIVED` by default | `POA-ORG-003` §19 | ESTABLISHED |
| Runtime state (sessions, in-flight adapter state, credentials) | Deployed Runtime tier | `POA-SVC-001` §5.D | ESTABLISHED |
| Cache / index / search structures | Deployed Runtime tier; **derived and rebuildable, never authoritative**; must inherit the access scope of their inputs; must honor revocation and exit | PROPOSED; a cache that outlives a revoked grant is a sovereignty leak |

## 8.3 Evidence-store reconciliation (an apparent tension, resolved by scope)

The brief asks what belongs in an "evidence store". `POA-DEC-SEC-001` §6-B/§13 [P] rejected a general-purpose external evidence database and kept git as the sole persistence mechanism for POA evidence. **These are reconciled by scope, not by exception** (DERIVED):

- **POA's own governance and execution evidence** stays exactly on the `POA-DEC-SEC-001` path, unchanged.
- **An organization's operating evidence** (its invoices, statements, CRM records) is not POA evidence. It lives in the organization's systems of record and is referenced. The knowledge plane holds assertions *about* it plus references to it. `POA-SVC-001` §12 already places mission evidence "Organization-scoped by default (§5.B)."
- **This document creates no store of any kind.** Whether organization-scoped authority-bearing evidence needs `POA-DEC-SEC-001`-grade integrity is an open question (§20 Q2), not decided here.

## 8.4 Observed tension (reported, not resolved): Paravyoma knowledge in the POA Core tier

`POA-PJR-001` [P] is Paravyoma-as-Organization knowledge (Paravyoma's projects, clients and state) stored in `20-Shared/PJR/`, a POA-Core-tier location. Under `POA-SVC-001` §5's boundary rule, content "meaningful only in the context of that one Organization" belongs in Tier B, not Tier A. This is historically explicable: PJR-001 predates Model C's ratification and the Creator/Steward vs Organization-A role split (`POA-RAT-ORG-001` §D). **No migration is proposed or authorized.** The `CLAUDE.md` Scope Boundary and `BA-001` both forbid restructuring without a dedicated governance mission. The tension is recorded so that future Paravyoma knowledge is not added to the POA Core tier by imitation (§20 Q3).

**Revision 1.1.0 — effect of the Q15 classification on this tension.** Both premises above rest on Provenance-only or Indeterminate records: the tier rule on `POA-SVC-001` §5 (Provenance-only; its own authorization is conditional on an acceptance never recorded — K4) and "Model C's ratification" on `POA-RAT-ORG-001` (INDETERMINATE). No committed, authoritative record states the Tier A/Tier B rule (Q15 report §7). Therefore: (a) this remains a **PROPOSED logical classification** of `POA-PJR-001` as Organization-A content held in a POA-Core-tier location — it may still be stated; (b) it **cannot** be presented as a violation of an established POA rule, and `POA-SVC-001` is not cited as authority for it; (c) the "no physical move" conclusion does **not** depend on `POA-SVC-001` — it rests on committed `CLAUDE.md` (no restructuring without a governance mission) and on the hard-coded consumers `50-Mothership/server/repository-records.ts:29` and `50-Mothership/command-center/src/test/project-surface.test.tsx:18`.

---

# 9. Truth Model

## 9.1 Truth classes

PROPOSED as a **labeling discipline**, not as new object types. `EIA-001` A3 [P] found that Interpretation and Meaning "have not earned the right to become architecture" as structural objects. The existing VERIFIED/INFERENCE/UNKNOWN vocabulary is the precedent: a disclosure discipline that is itself architectural. The classes below extend that discipline; they do not create an inference store.

| Class | Definition | Produced by | Can be authority-bearing? | Promotion path |
|---|---|---|---|---|
| **SOURCE TRUTH** | The system of record's own state, in its own domain, at its own time | The organization's systems | Authoritative for that source's domain only; POA never holds it, only observes it | — |
| **OBSERVED FACT** (`SOURCE-OBSERVATION`) | "Source S stated X at time t" | Observation Adapter / human observer | No (evidence-grade) | → VERIFIED by corroboration |
| **VERIFIED FACT** | An observed fact corroborated by a verifier distinct from its producer: deterministic re-check against primary evidence, an independent source, or attestation by an authorized role | Verifier | No (evidence-grade; the strongest evidence) | Cited by DECISION |
| **DERIVED FACT** | A deterministic, reproducible computation over facts (a sum, ratio or period comparison) | Deterministic method (identified, versioned) | No | Inherits the **weakest** basis and **worst** freshness of its inputs (§12.5) |
| **INFERENCE** | A non-deterministic conclusion, by an AI model, an execution agent or a human interpreter | Category A actor (`EIA-001` A2 §6) | **Never** | Only via DECISION restating it |
| **ANALYSIS** | A structured composition of facts and inferences answering a question | Category A actor, possibly aided by DERIVED computations | No (Provenance-only) | Only via DECISION |
| **RECOMMENDATION** | A proposed action with rationale | Category A actor; Deliberation Gate (advisory) | Never | Only via DECISION |
| **DECISION** | An authorized act by an identified authority within its scope, recorded and synchronized | Organization's authorized human (per declared authority requirement) or POA Governance (POA scope) | **Yes, once synchronized** to the authoritative record (`OPV-003` §6; `POA-ACC-001`) | — |
| **ACTION** | Execution under a decision's grant | Runtime / Service / Execution Agent identity | Evidence of execution (`POA-EVT-001`) | — |
| **RESULT** | Observed consequence of an action | Observation | No; enters again as an OBSERVED FACT | Linked to the action by reference; causation is INFERENCE |

## 9.2 The rules that prevent inference from becoming truth

1. **No self-promotion** (ESTABLISHED, `EIA-001` A3 §1). An INFERENCE, ANALYSIS or RECOMMENDATION becomes organizational position only when an authorized human DECISION restates it, cites it as Provenance, and is synchronized.
2. **No basis laundering** (PROPOSED). A model's output can never carry basis VERIFIED. If a model extracts a figure that a deterministic check then confirms, the *check* produces the VERIFIED assertion. The model's output remains an INFERENCE in the record.
3. **No kind erasure in synthesis** (PROPOSED). An answer or analysis that combines kinds must display the kind of each component claim. It must never present a blended paragraph in which verified facts and inferences read identically (§16.4).
4. **Organizational truth, defined** (PROPOSED). At any moment, "what the organization holds as true" is (a) VERIFIED and DERIVED facts that are CURRENT and not CONTRADICTED, plus (b) synchronized DECISIONS. Everything else is presented *with its label*, not excluded.
5. **Mapping to existing retention vocabulary** (DERIVED). DECISION = Authority-bearing evidence (`POA-EVID-001` ESR-001 Addendum). Everything else is Provenance-only unless a Decision cites it as its basis, at which point `POA-EVID-001` §C applies to that citation.

---

# 10. Provenance Model

## 10.1 Chain

Generalized from `POA-OBS-001` §7 and Revalidation §13 (DERIVED):

```text
Knowledge Assertion      "revenue for period Q = R (recognized basis)"
    ↓ produced by
Observation              adapter run / human entry / derivation, at observed_at, under grant G
    ↓ read from
Source                   declared source S (organization O), authoritative-for: {predicates}
    ↓ located at
Source record/artifact   record id / revision / digest  (or document digest + page/clause)
    ↓ originating in
Origin event             the business event itself (valid period), where knowable
```

## 10.2 Required provenance by kind

| Kind | Minimum provenance |
|---|---|
| SOURCE-OBSERVATION | Source ref · record id/revision or document digest (+ location within) · `observed_at` · adapter identity/version or human identity · grant ref |
| VERIFIED | The above + verification method + verifier identity (≠ producer) + verification time |
| DERIVED | Input assertion ids · method identity + version · computation time |
| INFERENCE | Input assertion ids · producer identity (agent/model identity and version where observable, per `POA-DEC-EXEC-001` D5 [U]) · method class · time. **Excluded:** prompts, chain-of-thought and private reasoning (`POA-EVT-001` §I, reused unchanged) |
| ANALYSIS / RECOMMENDATION | Question or trigger · component assertion ids · producer · time |
| DECISION | Deciding identity + representation/role · authority basis (grant or declared requirement) · cited assertions · `decided_at` · synchronization reference |
| ACTION | Mission identity (EXC/EXB/EXR with Organization field) · authority reference · events (`POA-EVT-001`) |

## 10.3 Properties

- **Provenance survives classification** (ESTABLISHED, `POA-ORG-003` §19). Origin Organization Identity is retained even for pattern-level knowledge, so any future reclassification is still possible.
- **Cross-organization crossing requires provenance** (P5, RATIFIED — self-described, §2.4).
- **Integrity is proportional** (DERIVED, `POA-DEC-SEC-001` §4 Q3). Provenance-grade by default; authority-bearing use triggers `POA-EVID-001` §C and possibly `POA-DEC-SEC-001` (§20 Q2).
- **Honest weak provenance.** If a source timestamp or revision is unknowable, it is recorded as UNKNOWN (`POA-OBS-001` §7: "Source timestamp — not reliably resolvable"), never approximated from filesystem metadata.

---

# 11. Temporal Model

## 11.1 Time axes

PROPOSED; each axis is justified by a brief question:

| Axis | Meaning | Answers | Trust weight |
|---|---|---|---|
| **Valid time** (event/effective period) | When the claim is true of the world (a period for measures) | "What was true three months ago?" | As reliable as the source |
| **Source-updated time** (`source_updated_at`) | When the source last changed the record | Freshness assessment | **Diagnostic only**: source clocks are self-asserted (`POA-DEC-SEC-001` §12) |
| **Observation time** (`observed_at`) | When POA read it | "When did we see this?" | POA-controlled |
| **Recorded time** (`recorded_at`, knowledge time) | When the assertion entered POA's knowledge state | "What did we know at that time?" | POA-controlled; append-only |
| **Decision time** (`decided_at`) | When the authority acted | "What did we decide, and when?" | Evidence-grade |
| **Authoritative time** (`authoritative_at`) | When the decision became organization-wide authoritative (synchronization) | "From when was this binding?" | `OPV-003` §6 authority boundary |
| **Supersession** (`superseded_at` / `superseded_by`) | When a newer assertion replaced this one in current knowledge | "What changed?" | Append-only |

Integrity-relevant **ordering** relies on sequence and correlation, not wall-clock time (`POA-DEC-SEC-001` §11–12, reused).

## 11.2 Answering the brief's temporal questions

| Question | Query shape (conceptual) |
|---|---|
| What happened? | Assertions with valid time in the period, kinds VERIFIED/DERIVED/RESULT, as currently known |
| What is happening? | Latest non-superseded assertions with freshness CURRENT; STALE and UNKNOWN shown as such |
| What changed? | Difference between two valid-time slices, each as currently known, plus supersession events in the interval |
| What was true three months ago? | Valid-time as-of (T − 3 months), **using today's knowledge**, including later corrections |
| What did we know at that time? | Knowledge-time as-of: assertions with `recorded_at ≤ T`, **excluding later corrections**. This is what decision-makers actually had |
| What did we decide? | DECISIONs by `decided_at` / `authoritative_at`, with their cited assertions *as known at decision time* |
| What happened afterward? | RESULTs and facts with valid time after the decision, linked by reference. **Correlation, not causation**: "the decision caused X" is always INFERENCE |

The distinction between "what was true then" and "what we knew then" is the reason both valid time and knowledge time are needed. Without both, POA cannot fairly review a past decision against the information that was actually available (DERIVED).

## 11.3 Corrections and restatements

Nothing is overwritten (ESTABLISHED: `POA-PJR-001` append-only; `POA-EVT-001` §J immutability; `POA-INTEGRITY-CONTROL-001` §L). A restated financial figure is a new assertion, with the same valid period, a later `recorded_at` and `supersedes` pointing to the original. Both remain retrievable. "What we knew" at the earlier time still returns the original.

---

# 12. Confidence / Uncertainty Model

The brief's list (verified, self-declared, observed, inferred, estimated, stale, conflicting, unknown) **mixes independent dimensions**. `POA-OBS-001` already keeps them apart: a single field in its snapshot can be simultaneously "VERIFIED (document exists…), INFERRED (whether the verdict still holds today)" and STALE. Collapsing them into one scale would lose exactly the information the brief wants preserved. The model is therefore **four orthogonal axes and no numeric score.**

## 12.1 Basis axis — how is it known?

| Value | Meaning | Source |
|---|---|---|
| **VERIFIED** | Confirmed against primary evidence, with scope stated (as-sourced / as-stated / independently corroborated) | `PJR-001`; `POA-OBS-001` |
| **SELF-DECLARED** | Asserted by a party, not independently checked | `PJR-001` ("SELF-DECLARED, UNVERIFIED") |
| **INFERRED** | Concluded by reasoning (human or AI), not directly evidenced | `PJR-001`; `POA-OBS-001` |
| **ESTIMATED** | A modeled or forward-looking quantity its producer declares as an estimate (forecast, weighted pipeline) | **PROPOSED** (new): needed because a forecast is neither a fact nor an ungrounded inference; it is an explicitly declared model output |
| **UNKNOWN** | Not established | `PJR-001`; `POA-OBS-001` |

**"Observed" is not a basis value.** It is the *provenance mode* (the assertion originated in an observation, §9). An observation yields VERIFIED-as-sourced or SELF-DECLARED depending on the source class (§7.2). This mapping resolves the brief's "observed" without a fifth competing label (DERIVED).

## 12.2 Freshness axis — is it still current?

`CURRENT | STALE | UNKNOWN` (ESTABLISHED, `POA-OBS-001` §8). Plus the established rendering **STALE-LAST-KNOWN: value** (Revalidation §12).

**How POA knows something is stale** (brief Q8). Only by evidence, never by an invented threshold (`POA-OBS-001` §8, Revalidation §14):

1. **Declared cadence.** The organization declares that a source or predicate updates on a cadence (e.g. monthly close). An assertion past its declared next-update point without a newer observation is STALE. The cadence is an organizational declaration (SELF-DECLARED), not a POA default.
2. **Later contrary evidence.** A newer, more reliable signal shows the assertion lagged reality: `POA-OBS-001`'s IEP case, where platform commit metadata was newer than human-maintained status documents.
3. **Otherwise UNKNOWN.** With no declared cadence and no contrary evidence, freshness is UNKNOWN, not CURRENT. Age alone does not prove staleness, and recency alone does not prove currency.

**Different surfaces carry different freshness and are not collapsed** (ESTABLISHED, Revalidation §14).

## 12.3 Consistency axis — does anything contradict it?

`CONTRADICTED` (with references to the conflicting assertions), or no known conflict (ESTABLISHED, `POA-OBS-001` Revalidation §12 "CONTRADICTORY / REQUIRES RESOLUTION"). Handling: §19.1.

## 12.4 Source-authority axis — is the source authoritative for this predicate?

`AUTHORITATIVE | SUPPORTING | NON-AUTHORITATIVE`, per predicate (DERIVED from `POA-OBS-001` Revalidation §7's Source Authority Matrix: "Authoritative", "Supporting only, not authoritative for current state"). Which source is authoritative for which predicate is an **organizational declaration** (e.g. "the accounting system is the system of record for recognized revenue"). Market intelligence defaults to SUPPORTING/NON-AUTHORITATIVE.

## 12.5 Composition and numeric confidence

- **Composition** (PROPOSED). A DERIVED fact inherits the weakest basis, worst freshness and any CONTRADICTED flag of its inputs. An answer (§16) reports per-component labels, never a single blended grade.
- **Numeric confidence: REJECTED for now.** No POA artifact defines calibrated numeric confidence, and the brief forbids inventing numerical semantics without justification. A future inference producer may attach a *method-specific, calibrated* score as an additional attribute. It could never replace or override the basis label. Its semantics are **TBD — requires architectural decision** (§20 Q10).

| Brief term | Represented as |
|---|---|
| verified | Basis VERIFIED (scope stated) |
| self-declared | Basis SELF-DECLARED |
| observed | Provenance mode; basis per source class (§12.1) |
| inferred | Basis INFERRED (kind INFERENCE) |
| estimated | Basis ESTIMATED (PROPOSED) |
| stale | Freshness STALE / STALE-LAST-KNOWN |
| conflicting | Consistency CONTRADICTED |
| unknown | Basis UNKNOWN and/or value UNKNOWN and/or freshness UNKNOWN (each stated separately) |

---

# 13. Authority Model

## 13.1 Who is requesting, and what may they do

Entirely **reused**. No new authority concept is introduced:

| Question | Answer | Source |
|---|---|---|
| WHO is requesting | An authenticated Human identity acting under a Representation claim for an organization (with Role as an attribute), or a Service identity under a delegated grant | `POA-SVC-001` §8 (Authentication ≠ Representation ≠ Authorization ≠ Authority); `POA-IMPL-001` §4 |
| WHAT they may do | Exactly their Capability Grants (Org/Mission/Action/Time), never inherited from role or title | `POA-ORG-003` §8, §13; `POA-IMPL-001` §6 ("no capability listed… is implied by holding another") |
| Both hierarchies required | POA Governance decides POA *can* offer a capability; the organization's own grant decides POA *may* exercise it for that organization | `POA-DEC-ORG-002` §10 dual hierarchy |

## 13.2 What POA itself may do: the seven action modes

Mapped onto `POA-IMPL-001` §6's existing capability list, with POA's default posture (PROPOSED as a mapping; the underlying capabilities are ESTABLISHED):

| Mode (brief) | Maps to | POA may do it… | Never |
|---|---|---|---|
| **observe** | Observe | Only under an explicit *observe* grant for that organization and source | By default, by Creator/Steward status (P2), or by technical access (P3) |
| **recommend** | Deliberate / produce RECOMMENDATION | When the organization has granted *receive recommendations*; produced by a Category A actor | As a decision; the Deliberation Gate recommends only (`POA-ORG-003` §22) |
| **request** | Mission Request (`POA-SVC-001` §11) | On behalf of an authenticated principal, recording intent | As authorization: Request ≠ Authorization |
| **delegate** | Dispatch mediation / routing | Route a confirmed request to the owning Business Function's executor | Delegate *authority*: only a grantor can sub-grant, never exceeding their own scope (`POA-SVC-001` §10) |
| **execute** | Execute | Through a Runtime/Service/Execution-Agent identity bound to a dispatched mission's fixed capability | Beyond the mission's capability; mid-execution renegotiation (`POA-IMPL-001` §3) |
| **commit** | Execute with external effect (a write to a system of record) | Only with an explicit, action-scoped grant covering that write; high-impact or irreversible commits trigger the Deliberation Gate (advisory) and require a Decision | Under an *observe* grant; read access never implies write |
| **approve** | — | **Never on its own authority.** POA holds execution authority only (`POA-KER-001` §3); the Service Plane has none of its own (`POA-SVC-001` §3). POA may *record* an approval and *verify its presence* before dispatch | Approve anything on anyone's behalf. Whether an organization may delegate approval authority to an agent or Service identity is **UNRESOLVED** (§20 Q5) and not authorized by this document |

## 13.3 Which domain owns a capability (brief Q11)

**`POA-META-002` §G keeps Ownership "UNESTABLISHED / GOVERNANCE DEPENDENCY."** POA therefore does not *define* ownership. It **records the organization's own declaration of it** (PROPOSED, DERIVED from P1/P4):

- The organization, through its Representative, declares a **Business Function Map**: Business Function → owning Organizational Unit → responsible Role → authorized executor(s) → **authority requirement** (which role or decision is needed before execution). The map is organizational knowledge of basis SELF-DECLARED, held in the organization's Tier B repository (§8.2) with history.
- POA uses the map to **route**. The map confers no authority (K-7). The executor still needs a Capability Grant.
- **If no declaration exists** for a requested function, POA **refuses or escalates to the requester. It never guesses an owner.** This is the "Authorization cannot be verified → Refuse" row of `POA-ORG-003` §26, applied to routing. Inferring "Finance probably owns invoicing" would be an INFERENCE silently becoming routing authority, exactly what §9.2 forbids.
- Intra-organization boundaries (department A vs department B) are the organization's own declared policy. POA enforces declared policy and does not invent it. Inter-organization boundaries remain POA's own isolation guarantees (`POA-SVC-001` §15), which no declaration can weaken.

---

# 14. Delegation Model

## 14.1 The chain

The brief's chain, with each link's source of truth, recording point and failure behavior (PROPOSED, built on `POA-SVC-001` §11 and `POA-IMPL-001` §7):

| # | Link | What it is | Determined by | Recorded as | If missing or ambiguous |
|---|---|---|---|---|---|
| 1 | **Principal** | Authenticated Human identity + Representation for organization O | Authentication + Representation record | Auth event (`POA-IMPL-001` §7) | Reject (`POA-ORG-003` §26) |
| 2 | **Intent** | What the principal wants, in their own words | The principal | Intent record | — |
| 3 | **Business Function** | Which function the intent belongs to | **Intent resolution is an INFERENCE** (Category A). It must be **confirmed by the principal** before it becomes a Mission Request | Confirmed Mission Request | Ask; never proceed on unconfirmed interpretation |
| 4 | **Owning Unit** | Organizational Unit owning the function | Business Function Map (org-declared) | Reference to map version | Refuse / escalate (§13.3) |
| 5 | **Responsible Role** | Role accountable for the function | Business Function Map | Reference | Refuse / escalate |
| 6 | **Authorized Executor** | Human, system (Service identity) or Execution Agent holding a grant for this action | Capability Grants | Grant reference | Refuse: a role without a grant is not an executor (P3) |
| 7 | **Approval requirement** | Declared authority needed before execution | Org's declared authority requirement; checks the requesting principal's own grant to *initiate* | Authorization record / Decision record | Refuse (preserve state, deny change, preserve evidence: `POA-IMPL-001` §5 Preservation posture) |
| 8 | **Execution** | Dispatch and execute | Service Plane (mechanical) → executor | Dispatch + execution evidence (`POA-EVT-001`) | Contained failure; never silently partial |
| 9 | **Evidence** | Proof of what occurred | Execution environment | Evidence record | Mission flagged incomplete (`POA-ORG-003` §26) |
| 10 | **Result** | Outcome returned to requester | Closure | RESULT assertion + status | Requester informed of failure state, never silence |

**Continuity for the requester.** The requester holds one handle: the **Mission identity** (EXC/EXB/EXR with Organization field, `POA-ORG-003` §15). Status and result flow back through it. The requester never needs to know the internal workflow. What they *see* of the evidence is bounded by their own grants: an executive may receive "invoice issued, reference N, evidence available" without receiving Finance's SOURCE-ONLY internal detail.

## 14.2 Mapping to the existing lifecycle

`Principal/Intent` = IMPL-001 stages *Intent* and *Authentication*. `Business Function → Authorized Executor` = routing inside *Authorization*. `Approval requirement` = *Authorization* (+ *Deliberation* when triggered, + *Decision*). `Execution` = *Dispatch* and *Execution*. `Evidence/Result` = *Evidence*, *Verification* and *Closure*. **No lifecycle stage is added.** Routing is a sub-step of authorization, not a new stage (DERIVED).

---

# 15. Cross-Department Execution Model

## 15.1 Worked example: "Generate an invoice for this customer"

Using Paravyoma as Organization A. **The CEO acts as a Representative of Paravyoma-as-Organization-A, never as Commander or Steward** (`POA-RAT-ORG-001` §D; `POA-SVC-001` §17: "the system never treats a Steward-authenticated session as an Organization-A-authorized session by default"). P2 allows no creator exception. All values are placeholders. **No Paravyoma data is invented.**

| Step | Actor / identity | POA mode | Authority check | Evidence produced |
|---|---|---|---|---|
| 1 | CEO (Human identity, Representative of Org A) states intent | request (intent) | Authenticated; Representation for Org A valid | Intent record |
| 2 | POA resolves intent → "Invoicing" (Business Function) | — (INFERENCE) | None: interpretation, not authority | Inference recorded with inputs |
| 3 | CEO confirms "yes, invoice customer C for engagement E" | request | Principal confirmation | Mission Request |
| 4 | POA looks up the Business Function Map: Invoicing → Finance unit → responsible role → executor (e.g. the accounting system via a Service identity, or a finance person) | delegate (routing) | Map exists? If not, stop and escalate (§13.3) | Routing reference (map version) |
| 5 | Check the CEO's grant to *initiate* invoicing; check the declared approval requirement (e.g. finance-role approval above a threshold, as declared by Org A) | — | Org A's declared authority requirement | Authorization record, or pending-approval state |
| 6 | If approval is required, the responsible finance role approves | — (human act) | That role's grant | Decision / approval record |
| 7 | Service Plane dispatches the mission to the executor | execute / commit (write to accounting system) | Executor's action-scoped *commit* grant | Dispatch record; execution events |
| 8 | Accounting system issues the invoice | (source system acts) | — | Source record id (invoice reference) |
| 9 | POA observes the result from the system of record | observe | *observe* grant | RESULT assertion (VERIFIED as-sourced) |
| 10 | CEO receives status + reference + evidence summary | — | CEO's own visibility scope | Closure record |

**Customer C is an external party**, and its details are Org A's information (P1). If Customer C is *itself* an Organization using POA, nothing crosses to C's domain without C's own grant (AOI-8). Sending the invoice to C is Org A's act through Org A's systems, not a POA cross-organization write.

## 15.2 Multi-function requests

A request spanning several functions (e.g. "onboard this new customer", touching Sales, Finance and Operations) is a **composite mission with one child mission per function**. Each child has its own routing, grant and approval. **No aggregated super-authority is created by composition** (DERIVED from `POA-IMPL-001` §6 non-inheritance). The parent mission's status is a derived view over its children's statuses.

## 15.3 Failure modes

| Failure | Behavior |
|---|---|
| Function has no declared owner | Stop; tell the requester what declaration is missing |
| Executor unavailable | Mission pending; requester informed; no reassignment without a declared alternate |
| Approval denied | Mission closed as denied; denial is a Decision, evidenced |
| System of record unavailable | Contained; retry is a new dispatch attempt, evidenced; no assumed success |
| Partial execution (e.g. invoice created, notification failed) | Mission flagged incomplete with exact partial state (`POA-ORG-003` §26) |
| Grant revoked mid-flight | Contained, not completed (`POA-SVC-001` §10; `POA-DEC-ORG-004` §7) |

---

# 16. Executive Intelligence Model

## 16.1 Position under the EIA-001 boundary

`EIA-001` A2 [P] established that "what happened" is architecture-answerable, while interpretation, causation, pattern and recommendation are Category A: performed by a human or agent under architectural discipline. **This document keeps that boundary.** It defines the architecture that *structures and disciplines* executive-question answering. It does not claim that POA itself "understands." The intelligence engine is **not implemented and not designed at component level** (brief). Whether any part becomes structural architecture remains gated by `EIA-001` A3's necessity test (§24).

## 16.2 Question decomposition architecture (conceptual)

```text
Executive Question  (from an authenticated principal of Organization O)
    ↓
Question Interpretation          → INFERENCE; restated back to the principal when material
    ↓
Question Plan                    → dimensions to cover + the knowledge families each needs
    ↓
Access Scoping                   → plan filtered by the principal's grants (incl. *aggregate*)
    ↓
Per-Dimension Evidence Retrieval → assertions from O's knowledge plane only, with labels
    ↓
Per-Dimension Findings           → facts (labeled), DERIVED computations, gaps (UNKNOWN)
    ↓
Synthesis                        → ANALYSIS (Category A) citing findings
    ↓
Answer Envelope                  → claims with kind/basis/freshness · evidence refs ·
                                   coverage statement · contradictions · unknowns ·
                                   "what would change this answer"
```

**Measure definitions are inputs, not outputs.** A plan dimension like "revenue" binds to the organization's *declared* definition (§5.5). If none is declared, the dimension reports that gap instead of picking a definition.

## 16.3 "How is Paravyoma doing this quarter?", decomposed

| Dimension | Sub-questions | Knowledge families needed | Minimum honest answer when absent |
|---|---|---|---|
| Financial performance | Revenue, expenses, margin, cash vs prior periods | Financial | "No financial source is declared; financial performance UNKNOWN" |
| Sales performance | Bookings, pipeline movement, win rate | Sales | "No sales source declared; UNKNOWN" |
| Project performance | Delivery status, blockers, phase movement | Operational; `PJR-001`-style project state | Per-project state with confidence and freshness (see §17: this dimension is partially answerable today) |
| Resource utilization | Allocation, utilization, capacity | Workforce (aggregate) | UNKNOWN unless declared |
| Customer health | Active engagements, satisfaction signals, sign-off states | Sales + Operational | Partial where project records reference client state |
| Market position | Share, competitor movement, positioning | Market intelligence (SUPPORTING) | UNKNOWN; if present, labeled non-authoritative |
| Operational risks | Open blockers, stale status, contradictions, dependency risk | ANALYSIS over Operational + governance gaps | Can surface *knowledge-quality* risks (staleness, contradictions) as evidence-grade observations; business-risk judgments are INFERENCE |
| Strategic opportunities | Where to invest or expand | ANALYSIS + RECOMMENDATION | Always Category A; labeled recommendation, never fact |

**The other executive questions in the brief** decompose the same way and carry their kind honestly:

- "What changed over the last three months?" → a valid-time diff (§11), evidence-grade.
- "Why did revenue decline?" → Financial DERIVED facts plus **causal INFERENCE**, labeled as such.
- "Which projects consume resources without sufficient return?" → needs a declared return definition plus Workforce and Financial facts; the judgment is ANALYSIS.
- "What should we prioritize?" and "What should I do next?" → RECOMMENDATION.
- "How are we performing against the market?" → Market intelligence, SUPPORTING authority.
- "What risks require my attention?" → knowledge-quality observations plus risk analyses.
- "What opportunities are we missing?" → RECOMMENDATION.

## 16.4 Answer honesty rules (PROPOSED)

1. **Coverage statement is mandatory:** "this answer covers N of M dimensions; the others are UNKNOWN because …"
2. **Per-claim labels:** kind, basis, freshness and consistency are visible or one step away. A verified fact and an inference never read identically.
3. **No gap-filling:** no dimension is answered from general knowledge or plausibility (K-11). An AI model's background knowledge about "companies like this" is not organizational knowledge.
4. **Contradictions surfaced, not averaged.**
5. **No aggregation leak:** a synthesized answer may not reveal what the principal could not access directly. The *aggregate* capability requires its own authorization (`POA-DEC-ORG-001` §9), and synthesis is checked against the principal's scope before return.
6. **Recommendations are separated from findings** and never phrased as decisions.

---

# 17. Paravyoma Dogfood Model

Paravyoma Technologies is modeled **as Organization A**: an Organization using POA with **no exception** by virtue of also being Creator/Steward (`POA-RAT-ORG-001` §C–D; `POA-DEC-ORG-001` §14). Paravyoma's financial or workforce knowledge would be as sovereign against the POA Steward role as any other organization's.

**No values are populated. No Paravyoma data is invented.** The table records only *what POA would need to learn*, the source known to exist today (if any, cited), and the honest current status.

| Knowledge area | Family / kind | Known source today | Status today |
|---|---|---|---|
| Organization | Subject + identity | `CONST-001` (purpose/values; a governance document, not operating data); `POA-RAT-ORG-001` §D (Org A role) [U] | Identity PARTIAL; operating profile UNKNOWN |
| Leadership | Workforce / units | **None as organizational data.** `ORC-001-GOV-001`'s Commander and Chief Navigator & Architecture Steward are *POA governance roles*, not Paravyoma's organizational leadership structure. Conflating them would violate the Steward ≠ Organization-A separation | UNKNOWN |
| Departments / units | Subject (self-declared) | None declared | UNKNOWN |
| Services / offerings | Subject | `POA-PJR-001` Entry 3 references Paravyoma's public product pages (`Products.pdf`, Paravyoma-Site) as SELF-DECLARED marketing content | SELF-DECLARED, partial |
| Customers | Subject (external parties) | `POA-PJR-001` Entries 1 and 3 reference client engagements, with the registry's own confidence markers | PARTIAL, registry-grade; no customer register |
| Projects | Subject | `POA-PJR-001` [P] (three entries, per-field confidence, append-only) | **The one dimension with a governed source today** |
| Historical projects | Subject | Nothing beyond PJR-001 and the delivery repositories it names | UNKNOWN beyond PJR-001 |
| Revenue / expenses / cash | Financial | **None.** `TSAAS-EST-002` [P] §6: a repository-wide search found "No invoice or actual-cost record exists anywhere in this repository" | UNKNOWN; no source declared |
| Sales / pipeline | Sales | None | UNKNOWN |
| Resources | Workforce | None | UNKNOWN |
| Capabilities (business functions) | Business Function Map | None declared | UNKNOWN |
| Current work | Operational / missions | `POA-PJR-001`; `40-Runtime/` mission reports; the 50-Mothership mission runtime | PARTIAL; mission-grade for POA's own work |
| Past work | Operational | `40-Runtime/`, git history, delivery repositories named in PJR-001 | PARTIAL |
| Market / competitors | Market intelligence | None | UNKNOWN |
| Systems | Subject | Delivery repositories named in PJR-001 (GitHub-hosted); this repository | PARTIAL; no system inventory declared |
| Documents | Evidence artifacts | DoCs VauLT and Deployment mirror (outside the repository; not governed sources) | Present but undeclared as Sources |
| Decisions | DECISION | `POA-ADR-001` [P]; `POA-DEC-*` records ([P]/[L]/[U] mix) | Present for POA-governance decisions; Paravyoma *business* decisions UNKNOWN |
| Risks | Analysis | `GAP-REGISTER-001` [P] (governance gaps only) | Governance risks PRESENT; business risks UNKNOWN |
| Opportunities | Recommendation | None | UNKNOWN |

**Dogfood findings** (DERIVED):

1. Of the eight executive dimensions (§16.3), POA could honestly answer **one partially** today (project performance, from PJR-001), and could report knowledge-quality risks. All others are UNKNOWN, and the architecture requires saying so.
2. **The first dogfood step is declaration, not ingestion.** A Paravyoma Source Declaration (which systems hold financial, sales and workforce truth; who owns them; their cadence) would convert most UNKNOWNs into known gaps with named owners, **without POA touching any data** (§24 Phase 2).
3. The governance-vs-organization separation holds in practice. Paravyoma's existing POA records are overwhelmingly *POA governance* knowledge, not *Paravyoma operating* knowledge. The dogfood has to build the latter deliberately, in Tier B, not by extending `20-Shared/` (§8.4).

---

# 18. Security / Privacy Boundaries

| Boundary | Rule | Basis |
|---|---|---|
| Sovereignty | All knowledge assertions are organization-scoped; POA holds custody under grant, never ownership | P1; `POA-DEC-ORG-001` §8–9 |
| Observe / store / transform / aggregate / retain / export | Each requires explicit organizational authorization for organization information | `POA-DEC-ORG-001` §9 (all eight capabilities) |
| Creator/Steward | No default access to any organization's knowledge plane, Paravyoma's included | P2; `POA-RAT-ORG-001` §C |
| Technical access | Holding a source credential never implies authority to act or to widen observation | P3 |
| Isolation | Data, identity, capability, execution, evidence, governance and failure isolation hold for knowledge planes, caches and indexes, regardless of shared infrastructure | `POA-SVC-001` §15 |
| Minimum necessary | MUST/SHOULD/SOURCE-ONLY/SENSITIVE-RESTRICTED applied at capture; SOURCE-ONLY referenced, not copied | `POA-OBS-001` §4, §11 |
| Personal data | Workforce knowledge is aggregate by default; individual-level data is SENSITIVE-RESTRICTED and requires a specific grant. Named individuals are not reproduced in knowledge artifacts without need | `POA-OBS-001` Revalidation §11 (named reviewers not reproduced) |
| Credentials | Never in assertions, provenance, logs or evidence; only in the Deployed Runtime tier | `POA-OBS-001` §11; `POA-SVC-001` §5.D |
| **External AI model providers** | Sending organization information to an external model (for extraction, reasoning or synthesis) is itself a *transform/export* of organization information to a third-party processor, and **requires the organization's authorization**. The provider is Infrastructure, never authority | DERIVED from `POA-DEC-ORG-001` §9 and `POA-SVC-001` §7; mechanism **UNRESOLVED** (§20 Q6) |
| Prompt / reasoning capture | Not recorded; inference provenance is inputs + producer + method class | `POA-EVT-001` §I |
| Injection | Source content is data, never instruction (K-13); no source can trigger routing, grants or execution | PROPOSED |
| Gate Guard / Sentinel | Metadata only; never the substantive content of knowledge crossing a boundary | `POA-ORG-003` §20–21 |
| Cross-organization learning | Only `POA-PATTERN`, with organization-identifying provenance stripped; information-level never crosses without an `AUTHORIZED-SHARED` grant | `POA-DEC-ORG-001` §11 Q4–Q5 (INFERRED there); P5 |
| Exit / revocation | Organization data and information-level knowledge exit with the organization; caches purged; pattern-level retention and derived-knowledge retention remain **UNRESOLVED** (Q6/Q7) | `POA-DEC-ORG-001` §16; `POA-DEC-ORG-002` §15 |

---

# 19. Failure and Contradiction Handling

## 19.1 Contradictions (brief Q18)

A contradiction is **two or more current assertions about the same subject, predicate and valid period whose values are incompatible** (PROPOSED definition).

1. **Record:** every conflicting assertion is retained; each is marked CONTRADICTED with references to the others (ESTABLISHED pattern, `POA-OBS-001` Revalidation §8/§12).
2. **Present:** answers show both, with each one's source authority, basis and freshness. POA never averages, picks the newest by default, or suppresses one.
3. **Resolve only by:**
   - (a) a **declared system-of-record precedence** for that predicate (an organizational declaration made in advance);
   - (b) **newer, stronger evidence**, which supersedes one side through ordinary supersession; or
   - (c) a **human DECISION** that records which value the organization adopts and why.

   Absent all three, the state remains `CONTRADICTORY / REQUIRES RESOLUTION` indefinitely. This is the knowledge-plane analogue of the Preservation Default (`POA-DEC-ORG-004` §3): when POA cannot legitimately determine which is authoritative, it preserves both and decides nothing.

## 19.2 Reconciliation across sources (brief Q17)

- **Entity resolution** (is "Acme Ltd" in the CRM the same as "ACME Limited" in accounting?) is itself an assertion. A deterministic key match (e.g. a shared registered identifier) is VERIFIED. A name-similarity match is an INFERENCE until confirmed. A wrong merge silently corrupts every downstream answer, so merges are never silent (PROPOSED).
- **Predicate-level precedence** is declared by the organization ("accounting is authoritative for recognized revenue; CRM for pipeline"). Without a declaration, multiple sources are shown side by side with their authority labels.
- **Definition alignment:** two sources reporting "revenue" under different definitions are not a contradiction. They are two different predicates, kept apart by the declared measure definitions (§5.5).

## 19.3 Failure modes

| Failure | Required behavior | Basis |
|---|---|---|
| Source unavailable | Keep last-known; mark STALE-LAST-KNOWN once staleness is evidenced; never fabricate | `POA-OBS-001`; `POA-ORG-003` §26 |
| Adapter error / partial read | Record as partial with coverage; no silent partial success | `POA-ORG-003` §26 |
| Schema / format drift | Refuse to map uncertain fields; report UNKNOWN; do not coerce | `POA-SVC-001` §13 ("refused… not silently coerced") by analogy |
| Duplicate ingestion | Idempotent per source record + revision | PROPOSED |
| Late-arriving data / restatement | New assertion, later `recorded_at`, supersedes; original retained | §11.3 |
| Grant revoked | Stop observing immediately; contain in-flight runs; cache purge per the retention decision (UNRESOLVED) | `POA-SVC-001` §10; `POA-DEC-ORG-001` §16 |
| Extraction/inference error | Inferences are never promoted without a Decision, so an error remains a labeled INFERENCE; corrections supersede | §9.2 |
| Malicious or poisoned source content | Treated as data (K-13); cannot alter behavior; anomalous content is surfaced as an observation, not acted upon | PROPOSED |
| Evidence tampering (authority-bearing) | `POA-DEC-SEC-001` path | ESTABLISHED |
| Knowledge plane unavailable | Answers degrade to "unavailable", never to model-generated substitutes | K-11 |

---

# 20. Open Questions

| # | Question | Why it matters | Who must decide |
|---|---|---|---|
| Q1 | Does `CTD-001`'s Evidence-Gated condition govern **ratification of an architectural expansion** like this one, or only development? This document assumes development only, and so seeks ratification of architecture without demonstrated development need | Determines whether this ADR can be ratified now or must wait for need evidence | **RESOLVED — NO** (Commander ruling, 2026-09-24; wording confirmed 2026-09-25): "CTD-001's Evidence-Gated condition governs development authorization. It does not govern ratification of architecture. This is an interpretation of CTD-001's existing scope (§3 defines the condition by 'development need'; §4 separates Architecture Authorization from Development Authorization), not an exception to it. Every implementation phase in §24 stays fully evidence-gated." Recorded in `POA-ADR-001`, "CTD-001 Scope Interpretation (Q1) Decision Record (2026-09-25)" (appended; not yet committed). This answers only whether ratification *may be considered*; ratification itself remains a separate Commander decision |
| Q2 | Must organization-scoped **authority-bearing** evidence (e.g. a decision relying on observed financial facts) use `POA-DEC-SEC-001`'s signature and witness path, or is `POA-EVID-001` §C reproducibility sufficient? | Integrity strength of organizational decisions | Commander / Chief Architect |
| Q3 | Where should Paravyoma-as-Organization-A knowledge physically live, given `POA-PJR-001` sits in the POA Core tier (§8.4)? **(1.1.0)** The Tier A/B rule this question applies comes from `POA-SVC-001` §5, which is **Provenance-only** (§2.4; its authorization is conditional on an acceptance never recorded — K4). The question therefore stands as a PROPOSED logical classification, not as a breach of a recognized POA rule; it cannot cite `POA-SVC-001` as authority. The "no physical move" posture rests independently on `CLAUDE.md` and the hard-coded PJR-001 consumers (§8.4) | Prevents the Tier A/B boundary eroding by precedent | Commander (restructuring is gated by `CLAUDE.md` Scope Boundary and `BA-001`); answering Q3 *as authority* would also require a recognized source for the tier rule — TBD — requires architectural decision |
| Q4 | Retention of observed and derived knowledge after grant revocation or exit | Inherits `POA-DEC-ORG-001` Q6/Q7, still unresolved | Commander (pattern/information boundary) |
| Q5 | May an organization delegate **approval** authority to an agent or Service identity? | Determines whether any autonomous execution is ever possible | Commander |
| Q6 | Authorization model for **external AI model providers** processing organization information | Every AI-assisted ingestion or synthesis crosses this boundary | Commander / Chief Architect |
| Q7 | Governance of **measure definitions** (who declares, versions and approves "revenue") | Executive answers are uninterpretable without them | TBD — requires architectural decision |
| Q8 | Ratification of the **Business Function**, **Organizational Unit** and **Offering** vocabulary | New terms (§5) | Commander |
| Q9 | Ratification of the four-axis confidence model, including the new **ESTIMATED** basis value | Extends `PJR-001`'s vocabulary | Commander |
| Q10 | Semantics of any future **numeric** confidence | Rejected for now (§12.5) | TBD — requires architectural decision |
| Q11 | Entity-resolution standards (what counts as a deterministic key) | Reconciliation correctness | TBD — requires architectural decision |
| Q12 | **Persistent viewer/session identity** (Mothership Experience Architecture open question 5) | Executive intelligence needs a standing "acting as X, authorized for Y" scope | Separate scoping mission |
| Q13 | Can an organization dispute POA's recording or labeling of its own facts, and how is that resolved? | Sovereignty over its own information's representation | TBD — requires architectural decision |
| Q14 | Naming relationship between this substrate and the roadmap term "Knowledge Core" (`PDM-001`) | Avoids a second name for one thing | Commander (non-decision here, §22) |
| Q15 | **Authority/retention status of this document's load-bearing predecessors.** All ten [U] records: `POA-RAT-ORG-001`, `POA-DEC-ORG-001`, `-002`, `-003`, `-004`, `POA-ORG-003`, `POA-SVC-001`, `POA-IMPL-001`, `POA-DEC-EXEC-001`, `POA-SEC-ORG-002` (1.0.0 omitted `POA-SEC-ORG-002` from this row — K6, corrected). `POA-DEC-MOTHERSHIP-001`/`002` are local-only [L] and outside the classified set. **(1.1.0) CLASSIFIED** under the ESR-001 operative test (`40-Runtime/POA-DEC-ORG-KNOWLEDGE-001-Q15-CLASSIFICATION-REPORT.md`): **0 Authority-bearing; 8 Provenance-only** (`DEC-ORG-001`–`004`, `ORG-003`, `SVC-001`, `IMPL-001`, `SEC-ORG-002`); **2 Indeterminate** (`RAT-ORG-001`, `DEC-EXEC-001`) — §2.4 | The classification is done; what remains open is **recognition**: whether either Indeterminate record, or any self-claimed ratification (K1–K4), should be recognized in a form POA treats as authoritative. Until then, this document reuses their content as restated design reasoning only (§2.4). Conflicts K1–K4 and K7–K9 remain unresolved | Commander / Chief Architect (recognition decisions; not made by this document or by the classification report) |

---

# 21. Architectural Decisions

**Every entry is PROPOSE** (decision candidate). None is ratified by this document.

| ID | Decision | Basis | Status |
|---|---|---|---|
| KD-01 | POA's organizational knowledge is modeled as **Knowledge Subjects + Knowledge Assertions + cross-cutting attributes**, not entity tables; being a subject is not being an identity | §5.1; `POA-ORG-003` §5 | PROPOSE |
| KD-02 | The **Knowledge Assertion** (§5.3) is the canonical conceptual representation, generalizing `observation_snapshot_v2` | §5.3; `POA-OBS-001` | PROPOSE |
| KD-03 | The brief's business "capability" is named **Business Function**, distinct from Capability Grant, capability increase and R-tier; a Business Function confers no authority | §5.4 | PROPOSE |
| KD-04 | **Organizational Unit** (incl. departments), **Offering**, **System** and **Source** are subject kinds; all organization-self-declared | §5.2 | PROPOSE |
| KD-05 | Five business-domain **fact families** (Financial, Sales, Operational, Workforce, Market) as assertion families; **measure definitions are organizational decisions** | §5.5 | PROPOSE |
| KD-06 | The fifteen-stage **knowledge lifecycle** with the gates in §6.1, and the six-plane distinction in §6.2 | §6 | PROPOSE |
| KD-07 | The brief's "connector" is `POA-OBS-001`'s **Observation Adapter** (no new mechanism term); Source / Adapter / Observation separation and the six-point adapter contract | §7.1 | PROPOSE |
| KD-08 | Documents are evidence first; **AI/OCR extraction is INFERENCE until verified** | §7.3 | PROPOSE |
| KD-09 | API-derived assertions carry the provenance set in §7.4; never credentials | §7.4 | PROPOSE |
| KD-10 | **Git holds what POA is and what has been decided; the data plane holds what has been observed** (K-8), with the placement table in §8.2 | §8 | PROPOSE |
| KD-11 | Evidence-store tension resolved **by scope**: POA evidence stays on the `POA-DEC-SEC-001` git path; organization operating evidence stays in systems of record; no store created | §8.3 | PROPOSE |
| KD-12 | **Truth classes** as a labeling discipline (not object types), with the four no-promotion rules | §9 | PROPOSE |
| KD-13 | Provenance chain and per-kind minimum provenance; prompts and reasoning excluded | §10 | PROPOSE |
| KD-14 | **Bitemporal** model (valid time × knowledge time) plus decision/authoritative time; append-only supersession | §11 | PROPOSE |
| KD-15 | **Four-axis confidence** (basis, freshness, consistency, source authority); ESTIMATED added; no numeric score; staleness only by declared cadence or contrary evidence | §12 | PROPOSE |
| KD-16 | POA's seven action modes mapped to existing capabilities; **POA never approves on its own authority** | §13.2 | PROPOSE |
| KD-17 | Ownership is **recorded from organizational declaration (Business Function Map)**, never defined or inferred by POA; missing declaration → refuse/escalate | §13.3 | PROPOSE |
| KD-18 | The **delegation chain** (§14) with intent confirmation before request, and routing as a sub-step of Authorization (no new lifecycle stage) | §14 | PROPOSE |
| KD-19 | **Executive intelligence** as question decomposition + labeled synthesis under the `EIA-001` boundary, with the six answer-honesty rules | §16 | PROPOSE |
| KD-20 | Paravyoma is dogfooded **as Organization A**, with no Steward exception; **first step is Source Declaration, not ingestion** | §17 | PROPOSE |
| KD-21 | Contradictions preserved; resolution only by declared precedence, stronger evidence or human Decision (knowledge-plane Preservation Default) | §19.1 | PROPOSE |
| KD-22 | Source content is **data, never instruction** (K-13) | §4, §18, §19 | PROPOSE |

---

# 22. Non-Decisions

This document explicitly does **not**:

- Name the substrate "Knowledge Core", "Organizational Intelligence Core" or any other roadmap/product name (Q14).
- Resolve the `POA-OBS-001` vs Dogfooding D-B "adapter" vocabulary conflict preserved by `POA-DEC-MOTHERSHIP-001` §4.
- Enumerate a closed relationship taxonomy, business-function catalog, measure catalog or domain list.
- Define any schema, table, API, storage technology, vendor, model or provider.
- Create an evidence store, knowledge store, cache or index, or alter `POA-DEC-SEC-001`'s persistence decision.
- Resolve the Article IX/XIV pattern/information boundary (`POA-DEC-ORG-001` Q6/Q7), evidence ownership (`POA-DEC-ORG-001` §8) or retention after exit.
- Resolve Representation recovery gaps R7/R12 (`POA-DEC-ORG-004`).
- Establish an ownership model (`POA-META-002` §G remains UNESTABLISHED).
- Authorize delegation of approval authority to any non-human identity.
- Convert `POA-PJR-001` into an adapter-backed system, add entries to it, or move it. Its Registry Discipline clause remains intact (`POA-DEC-MOTHERSHIP-001` D-1).
- Modify `POA-STD-009`, `POA-META-002`, `POA-EVID-001`, `POA-EVT-001`, `POA-ADR-001`, `GAP-REGISTER-001`, the Constitution, `CLAUDE.md` or any prior mission record.
- Authorize any implementation, development mission, UI, connector, integration or data ingestion.
- Close any `GAP-REGISTER-001` entry.

---

# 23. Consequences

## 23.1 Positive

- POA gains one conceptual model that covers business knowledge **without inventing a parallel universe**: most of it is `POA-OBS-001`, `POA-EVID-001`, `POA-DEC-SEC-001` and the ORG chain, generalized.
- "Inference never becomes truth" is enforceable as a labeling discipline and a promotion rule, and is consistent with `EIA-001`.
- Authority stays where it was: knowing an owner never becomes acting as one; approval stays human.
- Git stays the governance substrate, and the operational-database anti-pattern is ruled out by principle (K-8).

## 23.2 Costs and risks

- **Declaration burden.** The model depends on organizations declaring sources, function ownership, authority requirements, measure definitions and cadences. Without declarations POA honestly answers "UNKNOWN" a lot. That is correct behavior, but it is less impressive than a system that guesses.
- **Label discipline cost.** Every synthesized answer carries labels and a coverage statement. This is heavier UX than a fluent paragraph, by design.
- **Bitemporal storage** is more complex than current-state storage. The complexity is justified only once "what did we know then" is actually asked (§24 gates).
- **Unresolved dependencies** (Q2–Q6; Q1 resolved in 1.1.0) block specific implementation paths.
- **(1.1.0) Unrecognized predecessors.** Much of the reused foundation (§2.1) rests on records classified Provenance-only or Indeterminate (§2.4). Ratifying this document would not, by itself, recognize those records; conflicts K1–K4 and K7–K9 remain open.

## 23.3 Mothership implications (design reference, not authority)

The existing Mothership visual language (`POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` [P], with its REAL / REAL-DEFERRED / VISION discipline) is **a design reference only** (brief). Mapping the brief's twelve experiences to this model:

| Experience | Knowledge-model backing | Honest state today |
|---|---|---|
| Presence | Organization context + attention derived from staleness/contradiction observations | Organization context REAL; knowledge-quality attention VISION until a knowledge plane exists |
| Mission Field | Missions (EXC/EXB/EXR), lifecycle | REAL (existing runtime) |
| Project Intelligence | Project subjects + PJR-001-style assertions with confidence and freshness | REAL for PJR-001 read-path (Project Surface 001); "intelligence" beyond verbatim records is VISION |
| People / Authority | Human identities, representation, grants, Business Function Map | Grants REAL in runtime; Business Function Map VISION |
| Decision Canvas | DECISION assertions with cited evidence, inference and recommendation components visibly separated | VISION (Mothership open question 1: first-class Decision entity) |
| Evidence Explorer | Provenance chains (§10) | REAL for mission evidence; organizational provenance VISION |
| System Health | POA-generated observations (Sentinel metadata) | Minimal REAL aggregate only |
| Agent Observatory | Execution events (`POA-EVT-001`), inference provenance | Partially REAL (events); inference provenance VISION |
| Organizational Knowledge | Subjects and assertions with the four confidence axes | VISION |
| Data Sources / Connectors | Source declarations, adapter coverage and failures | VISION; **the first honest surface to build** would show declarations and their gaps (§24 Phase 2) |
| Executive Intelligence | Question plans, per-dimension coverage, labeled answers | VISION |
| Conversational Intelligence | Front end to question decomposition, resolving to plans and structured lookups | VISION; the Experience Architecture §10 rule stands: never a chat box implying comprehension the runtime lacks |

**Design-language elements the model directly requires:** confidence visualization (four axes, not one gauge), evidence trails (provenance chains), decision cards (with kind-separated components), progressive disclosure (labels one step away), and restrained motion. **Fictional prototype semantics are not imported.** The quarantined demo layer (`POA-DEC-MOTHERSHIP-002`) remains untouched and grants nothing to this model.

---

# 24. Implementation Sequencing

**None of the phases below is authorized by this document.** Each needs its own authorization and must clear `CTD-001`'s Evidence-Gated condition (demonstrated need, existing mechanisms shown insufficient, separate authority decision) and, where it would make interpretation structural, `EIA-001` A3's necessity test. The ordering keeps the lowest-risk, highest-honesty steps first.

| Phase | Scope | Entry gate | Exit evidence | Builds infrastructure? |
|---|---|---|---|---|
| 0 | **Ratification** of KD-01..KD-22 (or a subset) and answers to Q8, Q9 (Q1 resolved in 1.1.0: ratification may be considered without demonstrated development need) | Commander review of this ADR | Ratification record | No |
| 1 | **Apply the labeling discipline to existing records**: truth kind + four-axis confidence in future PJR-style and mission reports | Phase 0 (KD-12, KD-15) | Two or more reports using the labels without friction | No (documentation practice) |
| 2 | **Paravyoma Source Declaration** (Tier B document): which systems hold which truths, owners, cadences, sensitivity; plus a Business Function Map draft. **No data touched** | Phase 0 + Q3 answered (where Tier B lives for Paravyoma) | A declaration that converts UNKNOWNs into owned gaps (§17 finding 2) | No |
| 3 | **One read-only Observation Adapter** for the lowest-sensitivity declared source (e.g. Paravyoma's delivery git repositories: commit metadata, not content), under an explicit observe grant | Demonstrated need (e.g. recurring staleness like `POA-OBS-001` Revalidation §18) + separate authorization | Adapter output in canonical form with provenance/freshness; zero credentials in output | Minimal |
| 4 | **Minimum organizational knowledge plane** (append-only, bitemporal) for Paravyoma only | Evidence that Phase 3 output needs durable querying beyond files (`EIA-001` A3 scaling test) + Q2 answered | Can answer "what did we know at T" for one predicate | Yes, the first real store; gated hardest |
| 5 | **Business-Function routing dry-run** for one function (e.g. invoicing): routing and authorization checks with no *commit* | Phase 2 map + Q5 posture confirmed | Correct refuse/escalate on missing declarations | Minimal |
| 6 | **One executive question**, decomposed with honest coverage over whatever Phases 3–4 hold | Phase 4 + Q6 answered if any external model is used + Q12 scoped | Answer envelope with per-claim labels and coverage | Minimal |
| 7 | **Mothership surfaces**, starting with Data Sources / Connectors (declarations and gaps) | Each surface only after its backing phase is REAL | REAL/VISION discipline preserved | UI only |

Financial, sales and workforce sources come **after** the lowest-sensitivity path has proven the model, and only with explicit organizational authorization per source (§18).

---

# 25. Acceptance Criteria

## 25.1 For Commander review of this document

| # | Criterion | Self-assessment |
|---|---|---|
| A1 | All 25 required sections present | Yes, §1–§25 |
| A2 | No existing canonical model duplicated; overlaps identified before new concepts | Reuse Map §2.1; only six genuinely new areas (§2.3) |
| A3 | Terminology consistent with existing POA vocabulary; collisions named | §5.4 (capability), §5.2 (principal, role), §7.1 (adapter), §22 (Knowledge Core) |
| A4 | No constitutional, governance or prior-record modification | See Validation below |
| A5 | Architectural changes requiring governance recorded as open dependencies, not self-resolved | §20 Q1–Q15 |
| A6 | No fictional Paravyoma values | §17 records sources and UNKNOWN only |
| A7 | Inference cannot silently become truth | §9.2 rules 1–5; §16.4 |
| A8 | Authority model connects to existing principal/governance model without new authority | §13 (reuse); KD-16/17 |
| A9 | Repository-first governance preserved without forcing facts into git | §8 |
| A10 | Every decision candidate, none self-ratified | §21 |

## 25.2 For any future implementation claiming conformance

An implementation conforms only if:

1. Every stored knowledge item carries organization scope, kind, basis, freshness, provenance and classification (KD-02).
2. No model output is ever stored with basis VERIFIED.
3. No inference, analysis or recommendation changes organizational state without a synchronized human Decision.
4. Missing ownership, authority or definition declarations cause refusal or escalation, never inference.
5. No credential appears in any assertion, provenance record, log or evidence.
6. Contradictions are retained and displayed, never auto-resolved.
7. "What did we know at T" is answerable for any stored predicate (once Phase 4 exists).
8. The seven isolation dimensions hold for the knowledge plane and all caches and indexes.
9. Every answer includes a coverage statement.
10. Source content can never alter routing, grants or execution.

---

# Validation

Performed after materialization, in this mission (2026-09-24):

| Check | Method | Result |
|---|---|---|
| Document references | Each of the 36 cited repository paths tested for existence; citation status recomputed from git (tracked? commit ancestor of `origin/main`?) | **All 36 exist.** Status marks match: 24 [P], 2 [L] (`POA-DEC-MOTHERSHIP-001`/`002`), 10 [U] (`POA-DEC-ORG-001`–`004`, `POA-RAT-ORG-001`, `POA-ORG-003`, `POA-SVC-001`, `POA-IMPL-001`, `POA-SEC-ORG-002`, `POA-DEC-EXEC-001`). `POA-INTEGRITY-CONTROL-001` (cited indirectly via `POA-EVT-001` §J) exists at `40-Runtime/POA-INTEGRITY-CONTROL-001.md` |
| Quotation fidelity | Verbatim grep of seven quoted passages against their sources (`TSAAS-EST-002`, `POA-SVC-001` §17, `CTD-001`, `POA-DEC-EXEC-001` D3, `EIA-001` A3 §1, `EIA-001` A2 §5, `PDM-001`/`EIA-001` A2 on Knowledge Core) | **All seven found verbatim** |
| Terminology vs existing vocabulary | Repository-wide search for each newly proposed term (Business Function, Organizational Unit, Knowledge Assertion, Knowledge Subject, ESTIMATED, Offering) outside this document | **Zero prior occurrences**, so no collision. Existing terms reused, not redefined: Capability Grant, Observation Adapter, Representation, Service identity, VERIFIED/INFERRED/SELF-DECLARED/UNKNOWN, CURRENT/STALE/UNKNOWN, the five knowledge classifications |
| Contradictions with existing decisions | Tested against `CTD-001`, `EIA-001` A3, `POA-DEC-SEC-001` §13, `POA-META-002` §G, `POA-STD-009` scope, `POA-PJR-001` Registry Discipline, P1–P5, Model C | **No blocking contradiction.** Three tensions reconciled and disclosed rather than silently resolved: (1) `CTD-001`/`EIA-001` A3 vs defining intelligence architecture → architecture-only, every build step evidence-gated, ratification question put to Commander (Q1); (2) `POA-DEC-SEC-001` "no second evidence store" vs the brief's "evidence store" → resolved by scope (§8.3); (3) `POA-PJR-001` sits in the POA Core tier while being Organization-A knowledge → reported, not migrated (§8.4, Q3) |
| Duplicate concepts | Reuse Map (§2.1) built before any new concept was proposed | Six genuinely new areas only (§2.3); "Knowledge Core" and "Organizational Intelligence Core" names deliberately not adopted |
| Repository-appropriate validation | Governance artifacts are Markdown records validated by reading (`CLAUDE.md` "Code Projects and Commands"); no code was touched, so no build/test/typecheck applies | N/A by design, not skipped |
| Secret scan | Pattern scan of this document for API keys, secret keys, passwords, tokens, bearer strings, `sk-`/`ghp_`/`AKIA` prefixes, PEM headers, connection strings, database URIs | **No matches** |
| Unrelated files unchanged | `git diff --cached --name-only` (empty); `git diff --name-only` (only the pre-existing `CLAUDE.md` modification); `CLAUDE.md` SHA-256 identical at start and end (`a56f8bfe…97eb63d`); HEAD unchanged (`1547472…`) | **Only this file created. Nothing staged, committed or pushed** |
| Section completeness | Count of numbered top-level sections | **25 of 25** required sections present |

**Revision 1.1.0 validation (2026-09-25).** The 1.0.0 table above is historical and unedited.

| Check | Method | Result |
|---|---|---|
| Q1 ruling fidelity | Exact-string match of the quoted ruling against `POA-ADR-001`'s new record; record heading present once | **Identical**; heading found once |
| Q15 result fidelity | §2.4 totals and per-record classifications compared with the Q15 report (§5, §6) | **0 / 8 / 2 matches** report line 321; per-record classifications match |
| Q15 row completeness (K6) | Each of the ten IDs searched within the revised Q15 row | **All ten present** (including `POA-SEC-ORG-002`) |
| Cited evidence lines | `POA-DEC-SEC-001` lines 10 and 310 (candidate characterization); `POA-EVID-001` line 96; `repository-records.ts:29` and `project-surface.test.tsx:18` (PJR-001 path); `ESR-001-RECLASSIFICATION-REPORT.md` present on `origin/main` | **All confirmed** |
| No silent authority conversion | Every remaining RATIFIED occurrence checked for a self-described / INDETERMINATE / resolved qualifier | Only the qualification rule itself (§2.4) and K5 remain unqualified, by design |
| Decision content unchanged | Count of KD rows marked PROPOSE | **22 of 22**, still PROPOSE; no KD text edited |
| Section completeness | Numbered top-level sections | **25 of 25**; §2.4 added as a subsection |
| Secret scan | Same pattern scan as 1.0.0 | Only match is the 1.0.0 Validation row describing the scan itself |
| Other files unchanged | `git diff --numstat`; staged list; HEAD; Q15 report SHA-256 | `POA-ADR-001.md` +58/-0 (the Q1 record, unchanged since recording); `CLAUDE.md` +50/-0 (pre-existing); nothing staged; HEAD `1547472…`; Q15 report `608f6a73…` unchanged |

---

# Final Verdict

# ORGANIZATIONAL KNOWLEDGE SUBSTRATE DEFINED AS A DECISION CANDIDATE — REUSE-FIRST, INFERENCE-LABELED, AUTHORITY-PRESERVING; NO IMPLEMENTATION AUTHORIZED

POA can understand an organization without becoming its database, its authority or its oracle. Knowledge is a set of sourced, time-bounded, labeled assertions. Git keeps what POA is and what has been decided; the organization's data plane keeps what has been observed. Only a synchronized human decision turns analysis into organizational position. Knowing who owns a function never becomes acting as that owner. Most of this already existed in POA under other names (`POA-OBS-001`, `POA-EVID-001`, `POA-DEC-SEC-001`, the ORG chain). This document generalizes them and proposes six genuinely new areas. Every one of those is a decision candidate awaiting the Commander, and each build step remains separately evidence-gated.
