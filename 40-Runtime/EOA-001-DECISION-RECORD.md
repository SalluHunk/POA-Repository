# EOA-001-DECISION-RECORD

**This is an EOA-001 architecture-decision artifact. It is explicitly NOT a `POA-ADR-001` Decision Record** — per EOA-001's own §17 instruction ("do not modify the existing ADR-001 unless separately authorized") and §16's Critical Restraint, this document is a standalone `40-Runtime/` artifact, not filed under `20-Shared/DECISIONS/`. It records an architectural determination only; it implements nothing.

---

## Decision

**Execution Observability, in POA, is the discipline of retaining enough *observable execution-event* evidence — specifically, what action or tool was invoked, on what target, in what mission, at what time — to let an authorized observer independently reconstruct an organizational execution, without retaining private model reasoning.** It is a distinct architectural concern from Decision Recording, Acceptance, Materialization, or Repository State — each of which already has its own owning mechanism and already works, per `OPV-001`/`OPV-002`/`OPV-003`. Execution Observability's job is narrower than any of those: it exists solely to cover the one link in the organizational chain — EXECUTION — that currently has no owning mechanism at all.

---

## Rationale

Three independent, real reconstructions (`OPV-001` on `GOV-014`; `OPV-002`'s own acceptance-mechanism exercise; `OPV-003` on commit `e115178`) each found the identical, narrow gap: every category of evidence resolved directly except "what tool/action was performed, in what sequence." Nothing else was ever missing across three separate real cases. This is not a hypothesis — it is a triple-confirmed empirical finding. Separately, a repository-wide search (this mission) found that "Runtime Observation Register"/"ROR" — the mechanism `EOA-001`'s own directive assumed already exists — has **zero occurrences** anywhere in the materialized POA repository, and exactly one occurrence in the Deployment mirror (`POA-REPO-003`), which explicitly warns: *"Do not invent ROR structures or runtime subsystems unless an authoritative artifact requires them."* This mission's own evidence — the triple-confirmed gap above — is precisely such a requirement, satisfying `POA-REPO-003`'s own condition rather than contradicting it.

---

## Scope

Execution Observability covers exactly one event category: **Action/Tool Events** — an execution agent invoking a tool or performing an external action, against a specific target, within a specific mission, at a specific time. It references, and does not duplicate, the mechanisms that already own every adjacent link: Authority (`ORC-001-GOV-001`), Decision (`POA-ADR-001`), Materialization/Artifact-state (git), Acceptance (`POA-ACC-001`), and Authoritative State (`POA-EVID-001` + the synchronization model, `OPV-003`).

---

## Exclusions

Explicitly out of scope, per direct evidence, not merely per the directive's own restraint list:

- **Private model reasoning, hidden chain-of-thought, internal deliberation traces** — none of the three real reconstructions this evidence chain examined ever required these to succeed; the one gap found (action/tool identity) is an observable-event gap, not a reasoning gap (`OPV-002-PREFLIGHT-REPORT.md` §G, reconfirmed by every subsequent mission).
- **Verbatim raw tool output** — no reconstruction examined needed this; only the fact that an action occurred, its target, and its outcome.
- **Artifact-read events** — useful, never required; every real reconstruction succeeded without knowing what was merely *read*, only what was *modified* (already fully evidenced via git).
- **Instance/session-level actor identity** — per `OPV-003` Track A, useful, never required; every real reconstruction succeeded at role-level actor identity alone.
- **A duplicate authority or identity hierarchy** — Execution Observability references `Commander → Chief Architect → Execution Agent` (`OPV-003`) directly; it does not define a new one.
- **Decision, Acceptance, Materialization, or Authoritative-State recording** — each already has a working, evidenced, owning mechanism; Execution Observability must not re-implement any of them.

---

## Minimum Evidence Boundary

Per Track C's analysis of the twelve-item reconstruction list against three real cases:

- **REQUIRED, and already satisfied by existing mechanisms** (no new capability needed): mission identity, authority citation, timestamp, artifact/evidence touched, organizational state changed, what was materialized, final authoritative state.
- **REQUIRED, and currently unsatisfied — the sole gap this decision addresses:** what action/tool occurred, and what it targeted.
- **CONDITIONAL** (required only when applicable): what decision resulted (only for executions producing one); what was accepted (only for executions involving acceptance).
- **USEFUL, not required:** artifact-read events; instance-level actor identity; sub-day timestamp precision in report text (git already carries it).
- **UNNECESSARY:** private model reasoning; verbatim raw tool output; keystroke/token-level capture.

---

## Relationship to ROR

**DISTINCT MECHANISM REQUIRED (Option C) — but not for the reason the directive's own framing assumed.** ROR is not an existing architectural foundation that was tested and found the wrong shape; it is not a materialized concept at all. Its only textual trace, anywhere, is a single cautionary sentence against inventing it without cause. This mission's own evidence supplies that cause, narrowly: a small, distinctly-named mechanism, scoped exactly to Action/Tool Events, is warranted — not an extension of something that does not exist, and not a re-derivation of "ROR" as a name, which carries no established meaning to build on.

---

## Relationship to Mission Console

Out of scope, per §3.1/§16. This decision defines the observable domain only (Action/Tool Events, as scoped above); no UI, dashboard, or console component is designed, implied, or required by this decision.

---

## Relationship to Authority

References, does not duplicate, the existing `Commander → Chief Architect → Execution Agent` model (`ORC-001-GOV-001`, confirmed Approved, reconfirmed `OPV-003`). An Action/Tool Event, if ever materialized, would carry a role-level actor reference and a mission-authority citation — the same pattern every existing report and record (`POA-ADR-001`, `POA-ACC-001`) already uses successfully. No new identity hierarchy is created.

---

## Relationship to Authoritative State

Preserves, does not reopen, `OPV-003`'s finding that synchronization is part of POA's authoritative state model. An Action/Tool Event record, like an Acceptance Record, would exist as WORKING STATE until committed, SYNCHRONIZED once pushed, and organization-wide AUTHORITATIVE only then — exactly the chain `POA-ADR-001`'s own real acceptance already demonstrated this session. No new state model is required; the existing MATERIALIZED → ACCEPTED → SYNCHRONIZED → AUTHORITATIVE chain already accommodates it.

---

*This decision is architectural only. No code, schema, API, telemetry infrastructure, or Mission Console component was created by this mission. Nothing above is implemented, materialized as a runtime mechanism, or activated.*
