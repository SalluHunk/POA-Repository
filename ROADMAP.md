# ROADMAP

Mission direction for POA-Repository, grounded in existing completion reports and the governance gaps recorded in `10-Constitution/POA-CON-001.md`. Nothing here commits to a date or implementation approach that has not already been approved — where timing or ownership is unknown, it is marked TBD.

---

## Current State (as of SR-001 State Reconciliation, 2026-08-11)

- Bootstrap complete (`BOOT-001`).
- Repository governance and operating foundation established across three missions: `POA-REPO-001` (self-reported READY), `POA-REPO-002` (self-reported READY WITH DECLARED GAPS; the only mission in this repository with a dated, named Commander Disposition acceptance record — `40-Runtime/REPO-AUTHORITY-RECONCILIATION-REPORT.md` §16), `POA-REPO-003` (self-reported READY FOR POA-VIS-001).
- Shared execution architecture materialized: `POA-KER-001`, `POA-RSR-001`, `POA-EXB-001`.
- First governance standard materialized: `POA-STD-011` (Mission Package Standard) — remains **Draft for Architecture Review**; not promoted by this or any subsequent mission.
- Repository governance foundation materialized: `POA-CON-001` (interim cross-reference index), `CONST-001` (Paravyoma Constitution, materialized verbatim), `POA-MAT-001`, `ORC-001-GOV-001` (Approved), first ADR (`ADR-RM001-011`).
- `10-Constitution/`, `20-Shared/`, and `40-Runtime/` populated; remaining governance gaps (`POA-META-002`, `ACS-001`, `POA-STD-006`–`010` non-existent; `POA-000`/`POA-001`/`POA-META-001`/`POA-101`–`106`/`POA-TEMPLATE-001` Draft/uncertified; no formal POA Baseline record) are tracked, all still OPEN or HELD, in `20-Shared/GOV/GAP-REGISTER-001.md`.
- `30-Products/poa-vis-001/` materialized across four missions — `POA-VIS-001`, `POA-VIS-002`, `POA-VIS-003`, `POA-VIS-004` — each self-reporting MISSION STATUS: COMPLETE in its own completion report (see "Next Queued Mission" below for acceptance-traceability detail).
- Current canonical repository HEAD: local `main` verified identical to `origin/main`, the post-`POA-VIS-004` synchronized state. Full evidence-supported reconciliation, including the acceptance-traceability distinctions summarized above, is recorded in `40-Runtime/SR-001-STATE-RECONCILIATION-REPORT.md`.

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

`POA-VIS-002` — Organizational Intelligence Core — **COMPLETE**. See `40-Runtime/POA-VIS-002-COMPLETION-REPORT.md`.

`POA-VIS-003` — Expression Architecture — **COMPLETE, ACCEPTED.** Executed under in-session Commander authorization (see `ADR-003`) after the VIS-002 execution rule's review gate was surfaced. Chief Architect acceptance granted in-session, 2026-08-11. **Acceptance-traceability note (recorded by SR-001 State Reconciliation):** this acceptance's sole evidentiary basis is the in-session conversational exchange itself — repository acceptance traceability comparable to `POA-REPO-002`'s dated Commander Disposition record (§16) was previously incomplete for this mission. See `40-Runtime/POA-VIS-003-COMPLETION-REPORT.md` and `40-Runtime/SR-001-STATE-RECONCILIATION-REPORT.md`.

`POA-VIS-004` — Organizational Mothership — **COMPLETE, ACCEPTED.** Mission brief sourced from the Deployment mirror (`POA-VIS-004 — ORGANIZATIONAL MOTHERSHIP.md`, STATUS: AUTHORIZED — EXECUTE), authorized in-session by Commander on 2026-08-11 following recorded VIS-003 acceptance. Chief Architect acceptance granted in-session, 2026-08-11, per `CHIEF ARCHITECT DIRECTIVE — SR-001 PHASE 2.md`; repository synchronized after acceptance — current canonical repository HEAD is this post-VIS-004 synchronized state. Builds a living visual embodiment of organizational state (central Organizational Core, People/Projects/Capabilities domains, signal propagation, risk/opportunity visual language, heartbeat, event response, Alexis integration) atop POA Core / Organizational Intelligence / Expression Architecture, as a third registered Expression Profile. See `40-Runtime/POA-VIS-004-COMPLETION-REPORT.md`.

Recommended next mission: TBD — requires Mission Control naming.
