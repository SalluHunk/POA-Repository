# POA-EVT-001

## Execution Action/Tool Event Specification

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | POA-EVT-001 |
| Artifact Name | Execution Action/Tool Event Specification |
| Artifact Family | EVT (Execution Event) — filed under the `GOV` domain folder, consistent with the same evidence-chain lineage as `POA-ACC-001`/`POA-EVID-001`, not a claim of a new top-level directory family |
| Version | 1.0.0 — first materialization |
| Status | **Materialized — acceptance pending (Chief Architect / Commander). Not Approved, Accepted, or Certified. Not yet operationally exercised.** |
| Authority | Paravyoma Constitution → `OPV-001`/`OPV-002`/`OPV-003` (execution-process reconstruction gap, confirmed three times independently) → `EOA-001` (architectural investigation, Option C — Distinct Mechanism Required) → `EAM-001 — Execution Action & Tool Event Materialization.md` (Chief Architect materialization authorization) |
| Repository Domain | Shared / Governance |
| Capability Introduced | Execution Action/Tool Event Recording |
| Evidence Basis | `40-Runtime/EOA-001-DECISION-RECORD.md` (full); `40-Runtime/EOA-001-COMPLETION-REPORT.md` §4/§5/§6; `40-Runtime/OPV-001-PREFLIGHT-REPORT.md` §E.2; `40-Runtime/OPV-002-TRACK-B-COMPLETION-ADDENDUM.md` §G; `40-Runtime/OPV-003-COMPLETION-REPORT.md` §5/§6 |

---

# A. Purpose

Three independent, real reconstructions (`OPV-001` on `GOV-014`; `OPV-002`'s own acceptance-mechanism exercise; `OPV-003` on commit `e115178`) each found the identical gap: every category of organizational evidence resolved directly except "what action or tool was invoked." `EOA-001` confirmed this is not a missing `ROR` capability — `ROR` does not exist anywhere in materialized POA architecture, and its only textual trace (`POA-REPO-003`, Deployment mirror) explicitly permits, rather than forbids, introducing a narrow new mechanism once evidence requires it. This document supplies exactly that narrow mechanism — nothing broader.

---

# B. Scope

An **Execution Action/Tool Event** represents one observable action or tool invocation performed by an execution actor/agent in the course of an authorized POA mission. It is organizational execution evidence. Per `EAM-001` §2, it is explicitly **not**: private model reasoning, chain-of-thought, hidden deliberation, prompt logging, a general-purpose telemetry platform, an application performance monitoring system, a Mission Console, a replacement for Decision Recording, a replacement for Acceptance, a replacement for repository history, or a new authority hierarchy.

---

# C. Event Semantics

An event may represent, singly or in combination, without requiring every category on every occasion (per `EAM-001` §8):

- **Action** — an observable operation performed by the execution agent (e.g., editing a file, running a command).
- **Tool invocation** — an observable invocation of an internal or external tool.
- **Artifact interaction** — a reference to an artifact the action touched, where relevant.
- **Result** — the observable consequence or output of the action, where applicable.

A tool invocation may produce only a result reference without touching any POA artifact; an artifact-modifying action may have no separate "tool" beyond the action itself. Neither case requires forcing an event into a shape it does not fit.

---

# D. Minimum Event Information

Each field below is justified against `EAM-001` §7's five-question test: why required, what reconstruction question it answers, whether it is available elsewhere, whether it can be referenced instead of duplicated, and whether it is necessary for organizational auditability.

| Field | Required? | Justification |
|---|---|---|
| **Event Identity** | Yes | Answers "which specific event is this," needed for correlation and immutability; not available elsewhere (no existing mechanism assigns event-level identity). |
| **Mission Context** | Yes | Answers "for which mission" — already the universal pattern in every existing report; referenced by mission ID, not duplicated. |
| **Execution Context (role)** | Yes, at role level only | Answers "under which execution context" — references the existing `Commander → Chief Architect → Execution Agent` model (`ORC-001-GOV-001`, `OPV-003`) directly; does **not** introduce instance/session-level identity, per `OPV-003` Track A's own finding that instance-level identity was never required for any successful reconstruction. |
| **Authority Reference** | Yes | Answers "under what authority" — a citation to the authorizing directive, matching the convention every existing artifact already uses; referenced, not restated in full. |
| **Timestamp** | Yes | Answers "when" — the primary ordering/correlation anchor; not available elsewhere at the needed granularity (report-text dates are day-level only, per `OPV-003` §5). |
| **Action/Tool Identity** | Yes | The primary missing evidence identified by `OPV-001` through `OPV-003` — answers "what action/tool was invoked." No existing mechanism records this at all. |
| **Target/Context** | Conditional | Answers "what artifact/repository object/execution target was affected," where relevant — populated only when an action has a target; referenced by path/identifier, not duplicated content. |
| **Result/Reference** | Conditional | Answers "what observable result occurred," where applicable — a concise reference (e.g., an artifact path, a commit SHA once known) to the resulting artifact, state change, output, or evidence; never a duplication of that artifact's own content. |
| **Sequence/Correlation** | Yes | Answers "where does this fit among the surrounding mission's other events" — the minimum ordering information needed for §I's integrity requirements; satisfied by event ordering within a mission, not a separate elaborate field. |

**No other field is included.** Instance-level actor identity, verbatim tool output, and artifact-read events were each considered and excluded — per `EOA-001-DECISION-RECORD.md`'s own Minimum Evidence Boundary, none was ever required by any of the three real reconstructions examined.

---

# E. Authority Linkage

References, does not duplicate, the existing role-authority model (`ORC-001-GOV-001`, Approved; `POA-META-002` §H/I/J; reconfirmed `OPV-003`). An event's Execution Context field names the acting role (typically Execution Agent, per `POA-EXB-001` §8/§12); its Authority Reference field cites the mission's own authorizing directive — the same two-part pattern `POA-ADR-001`'s Decision Authority field and `POA-ACC-001`'s WHO field already use successfully. No new identity hierarchy, delegation model, or authority concept is created.

---

# F. Mission Linkage

Every event belongs to exactly one mission, identified by that mission's own ID (e.g., `EAM-001`), matching the convention every `40-Runtime/` report already follows. An event does not itself authorize or constitute a mission; it is evidence produced *during* one, correlated to it by this single field.

---

# G. Artifact/Evidence Linkage

Where an event's Target/Context or Result/Reference names a POA artifact, that reference is a pointer (file path, and — once synchronized — a commit SHA), never a copy of the artifact's own content. This mirrors `POA-EVID-001` §C's own satisfying conditions (a committed evidence artifact, a governed repository reference, a commit reference, or evidence restated inline) — an event does not need a new evidence-integrity mechanism; it reuses this one by reference.

---

# H. State Relationship

An Execution Action/Tool Event follows the same WORKING → MATERIALIZED → SYNCHRONIZED → AUTHORITATIVE chain `OPV-003` established, without modification: it exists as WORKING STATE from the moment it is recorded, becomes MATERIALIZED and SYNCHRONIZED together with the commit that includes it (typically alongside the artifact/report it describes, per existing mission convention), and is organization-wide AUTHORITATIVE only once that commit reaches `origin/main`. Unlike a Decision or Acceptance Record, an event does not itself require a separate ACCEPTED state — it is descriptive evidence of an action already taken under existing authority, not a ruling requiring Commander/Chief-Architect acceptance in its own right. This does not reopen `OPV-003`'s synchronization finding; it applies that finding to a new kind of artifact.

---

# I. Retention Boundary

- **Persisted:** the event's own minimal fields (§D) — event identity, mission, role, authority reference, timestamp, action/tool identity, sequence.
- **Referenced, not duplicated:** target artifacts and result artifacts — pointed to by path/commit reference (§G), never copied into the event.
- **Ephemeral:** any detail beyond a concise action/tool identity and outcome — raw tool output, verbose intermediate content; useful only during execution, not required after.
- **Excluded, explicitly:** private model reasoning; hidden chain-of-thought; internal deliberation traces; speculative reconstruction of private reasoning; prompt logs; keystroke- or token-level capture; verbatim raw tool output. None of these was ever needed by any of the three real reconstructions this specification is derived from.

---

# J. Immutability & Integrity (Conceptual Only)

- **Unique event identity** — required for correlation and to prevent silent overwrite.
- **Immutable after recording** — append-only, reusing `POA-INTEGRITY-CONTROL-001` §L's existing historical-integrity discipline; no new mechanism invented.
- **Timestamp** — required, per §D.
- **Mission correlation** — required, per §D/§F.
- **Execution-authority reference** — required, per §D/§E.
- **Ordering** — events within a mission are meaningfully sequenced (before/after each other); no global cross-mission ordering is required.
- **Artifact/evidence references** — per §G, reusing git's own commit-SHA integrity rather than introducing a new hash mechanism, per `EAM-001` §9's explicit instruction not to solve hypothetical security requirements.
- **Source provenance** — each event traces to the mission that produced it (§F); no separate provenance mechanism is introduced.

No cryptographic infrastructure, storage technology, schema, or API is prescribed. These are conceptual integrity requirements only.

---

# K. Relationship to Other POA Mechanisms

```text
AUTHORITY (ORC-001-GOV-001)
    ↓
MISSION (directive + report convention)
    ↓
EXECUTION ACTION/TOOL EVENT (this specification) ──► ARTIFACT / EVIDENCE (git, by reference)
    ↓
DECISION (POA-ADR-001, where applicable)
    ↓
MATERIALIZATION (git, existing convention)
    ↓
ACCEPTANCE (POA-ACC-001, where applicable)
    ↓
SYNCHRONIZATION (commit + push, OPV-003)
    ↓
AUTHORITATIVE STATE (HEAD = origin/main, OPV-003/POA-EVID-001)
```

This is a conceptual relationship, not a literal implementation sequence (`EAM-001` §10). This specification owns exactly one link — EXECUTION ACTION/TOOL EVENT — and does not absorb, narrow, or duplicate any other mechanism's ownership of its own link.

---

# L. Non-Goals

Per `EAM-001` §2/§12, this specification, and the mission that materializes it (`EAM-001`), explicitly do **not**:

- Create, revive, rename, or imply a Runtime Observation Register, ROR subsystem, ROR architecture, or ROR schema — `EOA-001` confirmed ROR does not exist in materialized POA architecture, and this specification does not introduce it under any name.
- Record private model reasoning, chain-of-thought, hidden deliberation, or speculative reasoning traces.
- Create a general-purpose telemetry platform, distributed tracing system, generic logging framework, metrics platform, infrastructure monitoring, or application performance monitoring system.
- Create Mission Console components, dashboards, UI, or APIs.
- Modify `POA-ADR-001` or `POA-ACC-001` — both remain exactly as `OPV-002`/`OPV-003` left them.
- Replace Decision Recording, Acceptance, or repository history.
- Introduce a new authority or identity hierarchy.
- Introduce cryptographic infrastructure beyond what git already provides.
- Certify anything, activate certification, or establish a baseline.
- Close any GAP or modify `GAP-REGISTER-001`.
- Commit or push any change (that authorization, if granted, belongs to the mission itself, not to this artifact's own text).

---

# Result

`POA-EVT-001` MATERIALIZED. Governance-standard artifact, not constitutional authority. Status: acceptance pending, not yet operationally exercised. The specification is narrow, evidence-derived, and non-duplicative — it does not create ROR, does not modify `POA-ADR-001`/`POA-ACC-001`, and introduces exactly one new capability: recording what action or tool was invoked, by whom (at role level), under what authority, when, and with what target/result — the single gap `OPV-001` through `OPV-003` and `EOA-001` each independently confirmed.
