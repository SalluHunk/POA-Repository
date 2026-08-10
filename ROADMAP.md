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

Superseded by `ADR-002` (2026-08-08). Sprint Alpha (`POA-VIS-001`) application/visual-system materialization is **authorized to proceed** despite the open governance gaps tracked in `GAP-REGISTER-001.md` — that authorization is scoped strictly to `POA-VIS-001` and does not certify, approve, or promote any gap. Any materialization mission beyond `POA-VIS-001` remains gated on its own explicit Commander authorization.

`GAP-001` (`POA-PRS-001` vs. repository identifier convention) remains formally **HELD** — see `40-Runtime/PRS-001-CONFLICT-DOSSIER.md`. No repository identifier or directory may be renamed, moved, or restructured without a dedicated future governance mission resolving it.

---

## Next Queued Mission

`POA-VIS-001` — Sprint Alpha Visual System Materialization — **COMPLETE**. See `40-Runtime/POA-VIS-001-COMPLETION-REPORT.md` and `30-Products/poa-vis-001/`.

Recommended next mission: TBD — requires Mission Control naming. See POA-VIS-001-COMPLETION-REPORT §12 for candidate follow-on scope (voice verification in a real browser, real capacity model, real LLM behind Alexis, real data source).
