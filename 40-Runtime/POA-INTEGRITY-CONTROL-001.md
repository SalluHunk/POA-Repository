# POA-INTEGRITY-CONTROL-001

## POA Integrity Control — Recurring Repository Integrity Verification Mechanism

---

# Artifact Identity

| Field              | Value |
| ------------------ | ----- |
| Artifact ID         | `POA-INTEGRITY-CONTROL-001` (naming-convention deviation from `POA-<FAMILY>-<NNN>` noted per `CLAUDE.md` Rule 5 — the filename is specified verbatim by `CHIEF ARCHITECT DIRECTIVE — INT-001.md`; not normalized) |
| Artifact Type       | **Operational Control** — not a constitutional authority, not a new governance standard |
| Materialized By     | Mission `INT-001` — Integrity Control & Traceability Hardening |
| Status              | Materialized — acceptance pending (Chief Architect). **Not** Approved/Accepted/Certified — this status intentionally excludes it from a future RSR §4 Artifact Inventory under `POA-RSR-001`'s own literal-status rule, until a dedicated acceptance event occurs. |
| Repository Domain   | Runtime |
| Authority            | Formalizes existing practice already implied by `POA-KER-001` §6.8 (Validator capability) and `POA-RSR-001` §7 (RSR regeneration lifecycle). Introduces no new constitutional authority. |

---

## A. Purpose

This control exists to verify, after a major implementation change, that POA's implementation state, mission state, acceptance state, repository state, governance state, documentation state, and traceability state remain mutually consistent — and to do so as a **repeatable, named procedure** rather than as an incidental byproduct of whichever mission happens to be running.

This control does not itself determine organizational purpose, does not modify governance, and does not carry constitutional authority. It is a Validator-class function per `POA-KER-001` §6.8, made explicit and operational.

---

## B. Trigger Conditions

The Integrity Control SHOULD be exercised:

1. After any mission that materializes or modifies a product artifact under `30-Products/` and receives Chief Architect acceptance (a "major-change" trigger — see §H).
2. After any mission that changes `ROADMAP.md`, `CHANGELOG.md`, or a `40-Runtime/` completion/state report (a "lightweight" trigger — see §G).
3. When explicitly directed by a Chief Architect directive (as `INT-001` itself was).

The Integrity Control is **not** triggered automatically by routine commits, and is not a pre-commit gate — `CLAUDE.md` Rule 10 (validate before commit) already governs individual commits. This control operates at the mission-cycle grain, not the commit grain.

---

## C. Integrity Dimensions

Every integrity cycle SHALL evaluate, where applicable to the change under review:

1. **Implementation** — does the code/artifact exist and match what its own completion report claims was built?
2. **Functional validation** — do the tests/typecheck/lint/build results claimed in a completion report still hold (or were they run and reported at all)?
3. **Mission state** — does the mission's own completion report state match its own internal fields (e.g., a status header vs. a body claim)?
4. **Acceptance state** — is Chief Architect / Commander acceptance recorded, and is its evidentiary basis (in-session confirmation vs. a dated external record) stated accurately rather than implied to be stronger than it is?
5. **Repository state** — does `git status`/`git log` match what mission documentation claims about HEAD, branch, and remote sync?
6. **Governance state** — do `GAP-REGISTER-001`, ADRs, and standard-artifact statuses (Draft/Approved/etc.) remain what they were before the cycle, unless a dedicated governance mission changed them?
7. **Documentation state** — are `ROADMAP.md` and `CHANGELOG.md` mutually consistent and consistent with the artifacts they describe?
8. **Traceability** — can every changed artifact answer: which mission authorized it, which source artifact it derives from, which commit introduced it (`CLAUDE.md` Rule 6)?
9. **Historical integrity** — has any historical narrative (a prior mission's own account of what it did) been rewritten rather than additively corrected or annotated?
10. **Unknowns / unresolved authority** — are open governance gaps (`GAP-REGISTER-001`) and undefined concepts (RM-001, CTR-001, etc.) still recorded as unresolved, rather than silently resolved or silently dropped?

---

## D. Evidence Requirements

Every finding MUST cite: the specific file(s) and line(s)/section(s) compared, and, where a correction is proposed, the specific authoritative source establishing the corrected state (a completion report's own body, `ROADMAP.md`, a Chief Architect directive, or `git log`/`git status` output). A finding without a citable source is recorded as an ambiguity (§F/§L), never corrected.

---

## E. Severity Classification

**GREEN** — No meaningful inconsistency. Reported for completeness only.

**AMBER** — Documentation or traceability inconsistency that does not invalidate the implementation. The underlying work is sound; a description of it disagrees with itself or with another document.

**RED** — Authority, scope, governance, repository integrity, or implementation contradiction that prevents advancement (e.g., a mission claims acceptance that contradicts an explicit unaccepted status elsewhere with no resolving evidence; a repository-structure claim contradicted by actual directory layout).

**BLACK / STOP** — Unknown authority, unauthorized scope, destructive historical rewrite, or inability to determine canonical state. Any BLACK/STOP finding halts the integrity cycle and escalates to Chief Architect review before any correction is attempted.

---

## F. Stop Conditions

The Integrity Control SHALL stop and escalate to Chief Architect review, without attempting correction, when:

- A finding is BLACK/STOP severity (§E).
- Two authoritative sources contradict each other with no evident basis to determine which is current (`CLAUDE.md` Rule 8).
- A proposed correction would require rewriting a historical narrative rather than additively annotating it.
- A proposed correction would require inventing organizational policy that has no established source (`CLAUDE.md` Rule 7).
- A correction would fall outside the authorizing directive's explicit scope.

---

## G. Lightweight Integrity Check

Scope: documentation and traceability only (dimensions 7, 8, 9, 10 from §C). Used for the trigger in §B.2. Does not require re-running application tests/build. Produces a short finding list; does not require a standalone report file unless findings are RED or above.

---

## H. Major-Change Integrity Check

Scope: all ten dimensions (§C). Used for the trigger in §B.1 or an explicit directive (§B.3). Requires:
- A Preflight phase (evidence collection, no modification).
- A defined-control-execution phase (this document, for the first cycle).
- A controlled-repair phase, bounded by §Control Law below.
- A validation phase (`git diff --check`, full diff inspection, re-verification that historical narrative was preserved).
- A written Integrity Report.

This is the check `INT-001` itself performs as its first execution (Phase 3 of the authorizing directive).

---

## I. Full State Reconciliation Escalation

If a Major-Change Integrity Check (§H) surfaces inconsistencies broader than isolated artifact-identity drift — e.g., systemic divergence between `ROADMAP.md`/`CHANGELOG.md` and the mission history they claim to summarize — the Integrity Control SHALL NOT attempt that scale of repair itself. It escalates to a dedicated State Reconciliation mission (the `SR-001` pattern), which carries its own broader authorization. This control performs narrow, evidenced, non-destructive repairs only (§Control Law); it is not a substitute for `SR-001`-class reconciliation.

---

## J. RSR Relationship

`POA-RSR-001` §7 requires the Repository State Report to be regenerated after an accepted production burn, a repository commit, a rollback, or an approved architectural revision. When a Major-Change Integrity Check (§H) performs a repair that changes a fact the current RSR instance asserts, the Integrity Control SHALL regenerate (amend in place) the current RSR instance as part of its own Phase 5/validation step, rather than leaving the RSR to drift out of sync until some later, unrelated mission notices. The RSR *specification* (`20-Shared/RSR/POA-RSR-001.md`) is never modified by this control; only the runtime RSR *instance* (`40-Runtime/RSR-001-REPOSITORY-STATE-REPORT.md` or its successor) may be amended, and only to correct facts the RSR itself asserts about artifacts the integrity cycle has just repaired.

---

## K. Acceptance / Synchronization Gate

A correction recording that "Chief Architect acceptance was granted" MAY be made only when that acceptance is independently traceable to a prior, already-recorded event (e.g., `SR-001-STATE-RECONCILIATION-REPORT.md`, `ROADMAP.md`). This control does not itself grant acceptance — it may only reconcile an artifact's own self-description with an acceptance already recorded elsewhere. Repository-synchronization claims (pushed/not-pushed) are corrected only against direct `git`-verified evidence at the time of the integrity cycle, and a prior "not yet pushed" statement is treated as a true historical record of that moment, not an error — it is annotated additively, never edited in place, and never merged into a status-field correction it is not part of.

---

## L. Historical Integrity Rules

- A completion report's narrative section (what was built, why, what was tested) is never rewritten by this control.
- A correction touches only the specific field or line objectively shown to be stale, and is either (a) an in-place field update where the field is a status/identity field designed to be current (e.g., an Artifact Identity table's Status column), or (b) an additively appended, clearly dated addendum/correction-log entry where the original text is a historical statement-of-fact at time of writing (e.g., a push-status note).
- Every correction records: what changed, the authoritative source for the new value, and that acceptance/provenance is not fabricated (no invented external approval record where only in-session confirmation exists).

---

## M. Traceability Rules

Every correction performed by this control SHALL record, in the artifact it corrects and in the resulting Integrity Report: the authorizing directive, the source evidence, and the commit that introduces the correction. This is `CLAUDE.md` Rule 6 applied specifically to integrity-repair actions.

---

## N. Success Criteria

This control is operating successfully when:
1. A major-change integrity cycle can be run to completion (Preflight → Execution → Controlled Repair → Validation → Report) without requiring invention of new governance.
2. Every reported inconsistency cites its evidence.
3. Every performed correction is non-destructive, in-scope, and traceable.
4. Every held-not-corrected ambiguity is explicitly named as such, never silently resolved.
5. The RSR instance and the artifacts it describes remain mutually consistent after the cycle (§J).

---

## Control Law (governs §F and all repair phases)

The integrity control may **REPORT** an inconsistency at any time.

It may **CORRECT** an inconsistency only when:
- the authoritative state is objectively established,
- the correction does not alter historical meaning,
- the correction is within the authorizing mission's explicit scope,
- and the correction is explicitly authorized by that mission.

Otherwise it must **HOLD** the issue and report it, unresolved.

---

**POA-INTEGRITY-CONTROL-001 MATERIALIZED. Operational control, not constitutional authority. Status: acceptance pending.**
