# POA-ADR-001

## Architectural Decision Record Specification

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | POA-ADR-001 |
| Artifact Name | Architectural Decision Record Specification |
| Artifact Family | ADR (Family field follows `ACS-001`'s own precedent of citing the family as it is actually used in the repository, not a normalized alternative) |
| Version | 1.0.0 — first materialization |
| Status | **Materialized — acceptance pending (Chief Architect / Commander). Not Approved, Accepted, or Certified.** |
| Authority | Paravyoma Constitution → `GOV-012` (evidence-chain gap identified, OPTION D) → `GOV-013` (architecture designed, OPTION D, this mechanism specifically approved) → `CHIEF ARCHITECT DIRECTIVE — GOV-014.md` (materialization authorization) |
| Repository Domain | Shared / Decisions |
| Capability Introduced | GOV-family Governance Decision Traceability |
| Evidence Basis | `40-Runtime/GOV-012-PREFLIGHT-REPORT.md` §C/§L; `40-Runtime/GOV-013-PREFLIGHT-REPORT.md` §C/§F; direct reads of `20-Shared/DECISIONS/ADR-002-Sprint-Alpha-Gap-Waiver.md`, `ADR-003-Expression-Architecture-Boundary.md`, `ADR-RM-001.md` |

---

# A. Purpose

Before this document, POA's `ADR` (Architectural Decision Record) pattern existed only as three independently-authored instances (`ADR-002`, `ADR-003`, `ADR-RM001-011`) sharing a consistent but never formally documented shape — no prior artifact specifies what an ADR is or what fields it carries (`GOV-013-PREFLIGHT-REPORT.md` §C, confirmed by direct search). This document supplies that specification for the first time, from the pattern already in consistent use, and additively extends it with a small set of optional fields — approved by the Chief Architect following `GOV-013`'s design — to make future `GOV`-family governance decisions specifically reproducible (`GOV-012`'s confirmed reproducibility failure). It does not redesign the ADR system and does not alter any existing ADR.

---

# B. Scope

Applies to future Architectural Decision Records, of any family (`POA-VIS`-application-scope decisions, `POA-STD-011`-protocol-scope decisions, and — newly enabled by this document — `GOV`-family governance-standard decisions). Does **not** apply retroactively: `ADR-002`, `ADR-003`, and `ADR-RM001-011` are not modified, amended, or required to be brought into conformance with this specification.

---

# C. Baseline Template (Documented, Not Invented)

The following fields are already in consistent use across every existing ADR (`ADR-002` §1/§2/§3/§4/§5/§6; `ADR-003` §1/§2/§3/§4/§5/§6; `ADR-RM001-011` §1/§3/§4/§5/§11) — this document records them as the established baseline, not as new invention:

1. **Artifact Identity** — ID, Name, Family, Status, Authority, Decided date.
2. **Context** — the situation the decision responds to.
3. **Decision** — the ruling itself, stated in full (not merely cited to an external source).
4. **Scope of This Authorization** — including an explicit list of what the decision does **NOT** authorize or generalize to (present in every existing ADR read this mission — `ADR-002` §4, `ADR-003` §4).
5. **Consequence** — what changes as a direct result.
6. **Result** — a terminal `DECISION STATUS` line.

Every future ADR — `GOV`-family or otherwise — SHALL continue to carry these six baseline elements. Nothing above is changed by this document.

---

# D. GOV-Family Additive Fields (New, Optional)

The following fields are **additive and optional** — present "where applicable," per the authorizing directive's explicit instruction not to make every field mandatory where existing architecture does not support that. They extend, not replace, §C:

1. **Decision Authority** — where finer-grained than the existing Authority field alone (e.g., distinguishing the Commander-level authorization from the Chief-Architect-level ruling that followed it, as `POA-META-002`'s own "GOV-009 Bounded Acceptance Record" already does informally in its §1).
2. **Artifact** — the specific repository artifact ID this decision concerns (distinct from Context prose, which already names it but not as a queryable field).
3. **Artifact Version/State** — the artifact's own version/status **at the time of this decision**. Directly closes the "acceptance of wrong artifact version" failure mode identified in `GOV-013-PREFLIGHT-REPORT.md` §O.
4. **Related Mission** — the mission ID that produced or executes this decision (e.g. `GOV-009`, `GOV-011`).
5. **Related Evidence** — explicit citation of the specific preflight/completion report file(s) and, where applicable, section(s) this decision rests on. This is the field that, combined with `POA-EVID-001`'s reproducibility rule, directly closes the exact failure `GOV-012` found: `POA-STD-009`'s own Evidence Basis field citing `GOV-010`'s reports by name with no requirement that they be reproducible.
6. **Resulting Commit / Repository State** — added **additively, after the fact**, once the decision's own materialization is committed. Never edited into the original Decision/Context text — appended as a dated addendum, per `POA-INTEGRITY-CONTROL-001` §L's existing historical-integrity discipline (append, never rewrite).

**Not every field is mandatory.** A decision with no specific artifact-version dependency, for example, need not populate field 3. The governing test is whether the field's absence would leave the decision's own reproducibility (per `POA-EVID-001`) deficient — not a blanket completeness requirement.

---

# E. Relationship to Existing ADRs

`ADR-002`, `ADR-003`, and `ADR-RM001-011` remain valid, complete, and unmodified. None is required to be retrofitted with §D's additive fields. This document does not diminish, reinterpret, or add conditions to any existing ADR's own recorded decision.

---

# F. Relationship to Other GOV-014 Mechanisms

A Decision Record materialized under this specification is the **first stage** of the governance evidence chain (`CHIEF ARCHITECT DIRECTIVE — GOV-014.md`'s own diagram: GOVERNANCE DECISION → ADR → MISSION → ... ). It does not itself record acceptance (`POA-ACC-001` governs that, separately) and does not itself enforce evidence reproducibility (`POA-EVID-001` supplies that test, applied to whatever evidence a Decision Record's Related Evidence field names). Each retains its own distinct role; none absorbs another's authority, per the authorizing directive's explicit instruction.

---

# G. Non-Goals

This document, and the mission that materializes it (`GOV-014`), explicitly do **not**:

- Create a new decision-record artifact type — the `ADR` family remains the sole mechanism.
- Redesign ADR numbering or naming.
- Rewrite, amend, or retrofit `ADR-002`, `ADR-003`, or `ADR-RM001-011`.
- Make any §D field universally mandatory.
- Certify anything, activate certification, or establish a baseline.
- Close any GAP or modify `GAP-REGISTER-001`.
- Resolve the `GAP-001` (`POA-PRS-001`) naming-convention conflict — this document's own ID (`POA-ADR-001`) follows the repository's live `POA-<FAMILY>-<NNN>` convention, consistent with `CLAUDE.md` Rule 5, without resolving `GAP-001`.
- Modify `.gitignore`, create `/50-Deployment/`, or address external directive-source authority.
- Modify application code.
- Commit or push any change.

---

# Result

`POA-ADR-001` MATERIALIZED. Governance-standard artifact, not constitutional authority. Status: acceptance pending. No existing ADR is modified; the ADR mechanism remains the sole Decision Record type; no new authority is created.
