# ROADMAP

Mission direction for POA-Repository, grounded in existing completion reports and the governance gaps recorded in `10-Constitution/POA-CON-001.md`. Nothing here commits to a date or implementation approach that has not already been approved — where timing or ownership is unknown, it is marked TBD.

---

## Current State (as of POA-REPO-001)

- Bootstrap complete (`BOOT-001`).
- Shared execution architecture materialized: `POA-KER-001`, `POA-RSR-001`, `POA-EXB-001`.
- First governance standard materialized: `POA-STD-011` (Mission Package Standard).
- Repository governance foundation materialized: `POA-CON-001` (interim), `POA-MAT-001`, first ADR (`ADR-RM001-011`).
- `10-Constitution/` and `40-Runtime/` no longer empty, but both remain **interim** pending Steward ratification.
- `30-Products/` remains empty — no product-domain mission has been approved yet.

---

## Known Pending Governance Standards

Sourced from `10-Constitution/POA-CON-001.md` §5. Order not implied — sequencing is TBD, owned by Mission Control, not this document.

| Standard   | Governs                     |
| ---------- | ---------------------------- |
| ACS-001    | Certification                 |
| META-001   | Architectural documentation   |
| META-002   | Repository meta-model         |
| STD-006    | Ontology                      |
| STD-007    | Categories                    |
| STD-008    | Lifecycle                     |
| STD-009    | Relationships                 |
| STD-010    | Identity                      |

Full Paravyoma Constitution text: **TBD — requires Steward ratification.**

---

## Carried-Forward Next Steps (from BOOT-001-Completion-Report §7)

- Generate the first Repository State Report (RSR) instance conforming to `POA-RSR-001`, now that a repository baseline commit exists.
- Await the next approved Mission and Execution Bundle before further production burns into `30-Products/`.

---

## Explicit Non-Commitments

The following are named in prior organizational discussion but have no approved timeline, owner, or specification in this repository. They are **not** roadmap items until an approved Mission Package authorizes them:

- Application / product-level materialization (explicitly out of scope for `POA-REPO-001` — "DO NOT start building the POA application yet").
- Mission Orchestrator, runtime scheduling, Squadrons, mission dependency graphs, execution analytics (deferred to `ORC-001` per `ADR-RM001-011` §10 — not yet materialized).

---

## Gate

Per `POA-REPO-001`: application/visual-system materialization begins only after this mission reports repository readiness as **READY** — see `REPO-INTEGRITY-REPORT.md`.
