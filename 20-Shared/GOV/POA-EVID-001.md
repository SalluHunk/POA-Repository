# POA-EVID-001

## Evidence Retention & Reproducibility Rule

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | POA-EVID-001 |
| Artifact Name | Evidence Retention & Reproducibility Rule |
| Artifact Family | GOV |
| Version | 1.0.0 — first materialization |
| Status | **Materialized — acceptance pending (Chief Architect / Commander). Not Approved, Accepted, or Certified.** |
| Authority | Paravyoma Constitution → `GOV-012` (reproducibility failure confirmed against `GOV-009`/`010`/`011`/`POA-STD-009`) → `GOV-013` (narrow rule proposed, in place of a blanket retention principle, OPTION D) → `CHIEF ARCHITECT DIRECTIVE — GOV-014.md` (materialization authorization — this narrow rule ONLY) |
| Repository Domain | Shared / Governance |
| Capability Introduced | Evidence Reproducibility Test |
| Evidence Basis | `40-Runtime/GOV-012-PREFLIGHT-REPORT.md` §H (the concrete `POA-STD-009` ↔ `GOV-010` citation failure); `40-Runtime/GOV-013-PREFLIGHT-REPORT.md` §D/§L |

---

# A. Purpose

`GOV-012` confirmed, against all four examples it tested (`GOV-009`, `GOV-010`, `GOV-011`, `POA-STD-009`), that a committed, authoritative artifact's own citation to specific evidence can point to a file that does not exist in `origin/main` — most concretely, `POA-STD-009.md`'s own committed "Evidence Basis" field naming `GOV-010-PREFLIGHT-REPORT.md`/`-COMPLETION-REPORT.md`, both uncommitted. This document formalizes **only** the narrow rule the Chief Architect approved following `GOV-013`'s design — not the broader principle `GOV-013` also evaluated and did not ratify on its own authority, and not a blanket requirement that every runtime report be committed, which `GOV-012` explicitly warned against assuming and this document's own authorizing directive explicitly prohibits.

---

# B. The Rule

> **"When a governed repository state relies upon evidence, that evidence must be reproducibly identifiable from the governed repository."**

Stated verbatim, per the authorizing directive.

---

# C. Satisfying Conditions

Any **one** of the following satisfies the rule for a given piece of relied-upon evidence:

1. **A committed evidence artifact** — the cited report/file itself is committed and present in `git log`.
2. **A governed repository reference** — a citation to another already-committed, already-authoritative artifact that itself carries the needed content.
3. **A commit reference** — a specific commit SHA identifying the exact repository state the evidence corresponds to.
4. **Evidence restated inline** — the citing artifact's own text restates the needed content directly, rather than merely pointing to an external or uncommitted file.

No particular one of these four is mandatory — any single one, applied to a specific piece of relied-upon evidence, is sufficient.

---

# D. The Test

> **"Could a future independent reviewer reconstruct why this authoritative repository state exists?"**

- **YES** — evidence retention is sufficient for that repository state. No action required.
- **NO** — the authoritative state has an evidence-retention deficiency. Per `POA-INTEGRITY-CONTROL-001`'s existing Control Law, this is **reported**, not silently repaired — the same discipline already governing RED findings.

---

# E. Explicit Boundary

This rule does **NOT**:

- Require every runtime, preflight, or completion report to be committed.
- Require every operational scratch artifact to enter the repository.
- Apply to general mission context or working evidence that no committed, authoritative artifact actually cites as its basis.

**It applies only where a governed, authoritative repository state — an artifact's own committed Identity/Status/Evidence-Basis field content — actually relies upon specific evidence**, i.e., names it by file or section as the basis for a decision or status, not to evidence that is merely contextually related.

---

# F. Worked Example (Not Retroactively Resolved)

`POA-STD-009.md`'s own committed "Evidence Basis" field names `40-Runtime/GOV-010-PREFLIGHT-REPORT.md` and `-COMPLETION-REPORT.md`, both currently uncommitted (confirmed fresh, `GOV-012`/`GOV-013`, unchanged as of this mission's own `git status`). This is exactly the deficiency §D's test identifies. **This rule, materialized now, does not retroactively resolve that specific case** — no historical migration is performed by this mission, per its authorizing directive's explicit prohibition. It is recorded here only as the worked example that motivated the rule, consistent with `POA-INTEGRITY-CONTROL-001` §D's own evidence-citation discipline (every finding must cite specific file/section evidence).

---

# G. Relationship to POA-INTEGRITY-CONTROL-001

This rule supplies `POA-INTEGRITY-CONTROL-001`'s Traceability and Reproducibility evaluation (already applied, informally, as dimensions of every `GOV-*` mission's own INT-001 cycle this session) with an explicit, named, citable test — where previously each mission applied its own ad hoc reasoning. `POA-INTEGRITY-CONTROL-001` itself is **not modified** by this materialization, per explicit prohibition — this rule is available for a future INT-001 cycle to cite by reference, not automatically wired into that document's own text.

---

# H. Relationship to Other GOV-014 Mechanisms

This rule is **not a stage** in the governance evidence chain (GOVERNANCE DECISION → ADR → MISSION → ... → REPOSITORY STATE → INT-001) — it is a cross-cutting test, applicable wherever any stage's own evidence citation (a Decision Record's Related Evidence field, `POA-ADR-001` §D.5; an Acceptance Record's Related Evidence field, `POA-ACC-001` §C) needs to be checked for reproducibility. It does not replace, absorb, or narrow `POA-ADR-001` or `POA-ACC-001`'s own distinct roles.

---

# I. Non-Goals

This document, and the mission that materializes it (`GOV-014`), explicitly do **not**:

- Mandate committing `GOV-006`, `007`, `008`, or `010`.
- Require any historical migration of any kind.
- Modify `POA-INTEGRITY-CONTROL-001`, `POA-RSR-001`, or any existing artifact.
- Resolve the external-directive-source versioning question — strictly out of scope, per the authorizing directive.
- Create `/50-Deployment/` or modify `.gitignore`.
- Certify anything, activate certification, or establish a baseline.
- Close any `GAP` or modify `GAP-REGISTER-001`.
- Modify application code.
- Commit or push any change.

---

# Result

`POA-EVID-001` MATERIALIZED. Governance-standard artifact, not constitutional authority. Status: acceptance pending. The rule is narrow, evidence-triggered, and non-retroactive — it does not require blanket commitment of runtime reports, and does not resolve the `GOV-010`/`POA-STD-009` case it uses as its own worked example.
