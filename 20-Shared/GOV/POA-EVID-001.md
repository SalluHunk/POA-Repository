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

---

# GOV-015 Semantic Boundary Addendum (2026-08-12)

**This section is NOT a rewrite of any text above.** It is an additive record, appended per `POA-INTEGRITY-CONTROL-001` §L(b) and the precedent set by `ORC-001-GOV-001`'s GOV-003 Addendum, `ACS-001`'s GOV-005 Addendum, and `POA-META-002`'s GOV-009 Bounded Acceptance Record. No word of §A–§I or the "# Result" section above is altered. This addendum formalizes the semantic boundary investigated under `CHIEF ARCHITECT DIRECTIVE — GOV-015.md`, following `INT-002`'s finding that `RSR-006`'s RED traceability finding was weighted primarily toward an architectural-interpretation gap: "Evidence Basis," as a field label, does not sufficiently distinguish different relationships a citation may have to cited material.

## 1. Authority

Paravyoma Constitution → Commander authorization following `INT-002`'s findings (`CHIEF ARCHITECT DIRECTIVE — GOV-015.md`) → Mission `GOV-015`, 2026-08-12.

## 2. The Five Concepts (additive vocabulary; §A–§I unchanged)

Full definitions, non-equivalence rules, and their application to `POA-ADR-001`/`POA-ACC-001`/this document: `40-Runtime/GOV-015-PREFLIGHT-REPORT.md` §G–§I, `40-Runtime/GOV-015-COMPLETION-REPORT.md` §D–§F.

- **AUTHORITY BASIS** — the source from which legitimacy derives ("why is this authorized?"). An artifact's own Authority field is its Authority Basis. Authority Basis is never satisfied merely by naming Provenance or Evidence material, even where that material appears within the same field's citation chain.
- **PROVENANCE** — material explaining origin, derivation, design reasoning, or historical context ("where did this come from / why this particular form?"). Provenance does not itself confer authority and does not itself satisfy §C.
- **EVIDENCE** — as already used in §A–§I above: material substantively supporting the factual claim, state, or finding this document's own rule (§B) addresses.
- **RETENTION REQUIREMENT** — whether material must remain durably available; governed entirely by the existing §C/§D test, unchanged by this addendum. Retention is not implied by a citation also being Provenance — §C's four satisfying conditions determine retention sufficiency independently of whether the same material is also explanatory/provenance material.
- **REPOSITORY REFERENCE** — a pointer showing where material can be reconstructed (§C.1–3 are each a form of Repository Reference). A Repository Reference's existence does not itself satisfy Retention (its referent may not be durably present in `git log`), and does not itself establish Authority Basis or Evidence.

## 3. Clarification, Not a New Rule

§B (The Rule) and §C (Satisfying Conditions) are unchanged and continue to govern exactly as before this addendum. This addendum does not add a fifth satisfying condition, narrow the existing four, or change §D's test. It clarifies only that a single citation (e.g., an "Evidence Basis" field entry) may simultaneously be Provenance and a Repository Reference without being Authority Basis, and that §C.4 (evidence restated inline) is satisfied independently of whether the same underlying material is also cited elsewhere as Provenance.

## 4. Application Boundary

This addendum does **not**:

- reclassify, downgrade, or resolve any RED finding recorded by any prior mission — `RSR-006`'s Traceability RED remains RED, unchanged, per `GOV-015-COMPLETION-REPORT.md` §H;
- require commitment of `GOV-012`/`GOV-013`, `GOV-010`, or any other currently uncommitted report;
- close `GAP-002`, `GAP-003`, `GAP-004`, or any other `GAP-REGISTER-001` entry;
- certify this document, activate delegated certification authority, or establish a baseline;
- modify the Identity/Status field above, which remains exactly: "Materialized — acceptance pending (Chief Architect / Commander). Not Approved, Accepted, or Certified";
- require any existing artifact's own "Evidence Basis" or "Authority" field (`POA-ADR-001`, `POA-ACC-001`, `POA-STD-009`, or any other) to be retroactively rewritten — this addendum supplies vocabulary for future use, not a retroactive migration.

## 5. Effective-Status Condition

Per the same discipline as `ACS-001`'s GOV-005 Addendum §J and `POA-META-002`'s GOV-009 Bounded Acceptance Record §5: this addendum's own materialization does not, by itself, constitute acceptance, certification, or activation of anything it describes. It supplies additive vocabulary, available for future citation by this or any other artifact's evidence-classification practice — it is not a ruling on any pending artifact's status, and does not itself resolve the open Chief Architect decision points `GOV-015-COMPLETION-REPORT.md` §M returns.

---

*End of GOV-015 Semantic Boundary Addendum. Authorized by: Chief Architect investigation under Mission `GOV-015`, following `INT-002`. Materialized by: Mission `GOV-015`, 2026-08-12.*

---

# ESR-001 Evidence Retention Decision Addendum (2026-08-17)

**This section is NOT a rewrite of any text above.** It is an additive record, appended per `POA-INTEGRITY-CONTROL-001` §L(b) and the precedent set by `ORC-001-GOV-001`'s GOV-003 Addendum, `ACS-001`'s GOV-005 and GCR-001 Addenda, `POA-META-002`'s GOV-009 Bounded Acceptance Record, and the GOV-015 Semantic Boundary Addendum immediately above. No word of §A–§I, the "# Result" section, or the GOV-015 Semantic Boundary Addendum is altered. This addendum records the effect, on this document's own retention rule, of the Chief Architect's Evidence Retention Decision, recorded in full (with verbatim decision text) as the symmetric "ESR-001 Evidence Retention Decision Record" in `20-Shared/DECISIONS/POA-ADR-001.md`.

## 1. Authority

Paravyoma Constitution → `ESR-001` (evidence-retention gap classified; Mission-Level Determination C — Evidence Retention Policy Required) → Chief Architect governance directive, 2026-08-17.

## 2. The Retention Principle (additive; §B–§D unchanged)

§B (The Rule) and §C (Satisfying Conditions) are unchanged and continue to govern exactly as before. This addendum adds an organizational-role-based retention criterion, using the GOV-015 vocabulary (§ "GOV-015 Semantic Boundary Addendum" §2, unchanged) as its analytical basis:

- **Authority-bearing evidence** — evidence that establishes, records, or is explicitly required to support an authoritative organizational state or decision (e.g., named in a committed artifact's own Evidence Basis field, or itself constituting the designated authoritative-state-reporting mechanism for its artifact type, per that artifact type's own governing specification). Authority-bearing evidence requires authoritative retention.
- **Provenance-only evidence** — mission reports and other artifacts that document the execution or reasoning behind an outcome already represented authoritatively elsewhere, without themselves being named as required grounding. Provenance-only evidence does not automatically require authoritative repository synchronization merely because it exists, was referenced informally, or remains uncommitted.
- Retention follows the artifact's **organizational role and reconstructability requirement**, not its file type (preflight vs. completion vs. state report vs. decision record carries no retention implication on its own).
- **Synchronization is a consequence, not a determinant, of an authority/retention determination.** An artifact's uncommitted status is never itself evidence of its correct classification, in either direction.

## 3. Clarification, Not a New Test

§D (The Test — "could a future independent reviewer reconstruct why this authoritative repository state exists?") is unchanged. This addendum does not add a new satisfying condition to §C, nor change what counts as reconstruction. It clarifies which artifacts §D's test needs to be run against in the first place: Authority-bearing evidence is in scope for the retention question; Provenance-only evidence is not automatically in scope merely because it exists in the working tree.

## 4. Application Boundary

This addendum does **not**:

- retroactively rewrite, reword, or reclassify any prior mission report or historical instruction — including any prior "no commit/push" statement, which is preserved exactly as recorded;
- mandate synchronization of any specific artifact — the reclassification performed under this principle (`40-Runtime/ESR-001-RECLASSIFICATION-REPORT.md`) identifies a synchronization set without executing it;
- close `GAP-002`, `GAP-003`, `GAP-004`, or any other `GAP-REGISTER-001` entry;
- certify this document, activate delegated certification authority, or establish a baseline;
- modify the Identity/Status field above, which remains exactly: "Materialized — acceptance pending (Chief Architect / Commander). Not Approved, Accepted, or Certified";
- create a new evidence repository, Runtime Observation Register, event system, governance mechanism, or persistence mechanism — `EOA-002`'s prior determination (no separate persistence mechanism required) remains in force, unchanged.

## 5. Effective-Status Condition

Per the same discipline as the GOV-015 Semantic Boundary Addendum's own §5: this addendum's materialization does not, by itself, constitute acceptance, certification, or activation of anything it describes, and does not itself commit or push any artifact — including this document's own still-uncommitted delta.

---

*End of ESR-001 Evidence Retention Decision Addendum. Authorized by: Chief Architect governance directive, following `ESR-001`. Materialized by: this record, 2026-08-17.*
