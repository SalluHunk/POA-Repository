# POA-ORG-KNOW-P5-UI-FOUND-001 — Authorization Artifact (Commander-Approved; Effective upon the POA-ADR-001 ratification record)

**Title:** Mothership Design-System Formalization & Runtime Baseline (Foundational, Non-Surface)

**Status: APPROVED BY COMMANDER (assent recorded in §3, 2026-09-30).** This document is the authorization artifact (`POA-STD-011` §6.3). Authorization becomes effective only through the explicit Commander ratification act recorded as its own entry in `POA-ADR-001.md` (`POA-STD-011` §6.4: AUTHORITY → AUTHORIZATION ARTIFACT → EXPLICIT COMMANDER ACT → EFFECTIVE AUTHORIZATION), not by this document's own text. Implementation may commence only after both this artifact and that ratification record are committed (`POA-STD-011` §6.7).

Revision note: this text is Revision 2 as approved by the Commander, incorporating every finding of the authorization-form review performed against `POA-STD-011` §6, the `POA-ADR-001` mechanism, and the `P5-AUTH-001` pattern. On recording, the Commander's authorization message added: scope item 10 (documentation/evidence necessary to establish the foundation), two stop conditions (`POA-DEC-ORG-KNOWLEDGE-001` §24 must be changed; another governance or architectural decision is required), and the execution-profile preference in §6. The scope in §2 is unchanged.

---

## 0. Naming Disposition

The original brief's self-assigned identifier `P5-UI-001` is **not reused** for this narrower authorization. Reasons:

1. `P5-UI-001` (no `POA-` prefix) does not follow this repository's `POA-<FAMILY>-<NNN>` convention (`CLAUDE.md` Rule 5; `POA-STD-011` §6.1); reusing it would also risk being read as ratifying the original, broader brief by name.
2. The original brief's own scope (§7 "Executive Panel Compatibility," §15 item 8 "Executive Panel prepared for P5-UI-002") sits closer to Mothership-surface territory than the Commander's narrowed "foundational" category permits.

**Proposed identifier: `POA-ORG-KNOW-P5-UI-FOUND-001`**, title as stated above — consistent with the existing `POA-ORG-KNOW-P5-*` family (`P5-PLAN-001`, `P5-ACCEPT-001`, `P5-NEED-001`, `P5-AUTH-001`).

---

## 1. Artifact Identity (proposed)

Decision to be recorded under `POA-ADR-001` v1.0.0, if approved. Mission ID: `POA-ORG-KNOW-P5-UI-FOUND-001`. Title: as stated above. Subject: **execution of `POA-ORG-KNOW-P5-UI-FOUND-001` only** — a bounded foundational UI/runtime mission, narrower than and distinct from the original external `P5-UI-001` brief.

## 2. Context

Following `POA-ORG-KNOW-P5-AUTH-001` (authorizing `POA-ORG-KNOW-P5-IMPL-001` only) and the read-only `40-Runtime/P5-UI-001-AUTHORIZATION-RECONCILIATION-REPORT.md` (finding P5-UI-001 as originally briefed REQUIRES A NEW COMMANDER AUTHORIZATION ACT, and sits under the unmet Phase 7 surface gate), the Commander made a placement determination, 2026-09-30:

`POA-DEC-ORG-KNOWLEDGE-001` §24's text contains no exemption from the Phase 7 surface gate for any category of UI work, and none is invented here. Instead, the Commander split the originally-briefed `P5-UI-001` scope into two architecturally distinct categories:

- **FOUNDATIONAL UI/RUNTIME WORK** — design-system inventory/formalization, preservation of existing visual language, reusable primitives where required, runtime/UI shell baseline, responsive baseline, accessibility baseline, visual-regression/test infrastructure, runtime-validation infrastructure, and preservation/regression-validation of the existing Executive Panel **without expanding its behavior**. This category does not itself constitute a new Mothership surface.
- **MOTHERSHIP SURFACE IMPLEMENTATION** — any new surface, new Executive Panel behavior, or capability that exposes organizational/business-function data — remains subject to the Phase 7 gate ("each surface only after its backing phase is REAL"), **not currently met** (Phases 3, 4, 6 have no execution evidence in this repository).

This draft act authorizes only the first category.

## 3. Commander Assent

Commander assent:
"APPROVED as drafted, subject to the corrections identified in the authorization-form review."

*(This record does not attribute drafted ruling language to the Commander as if quoted verbatim, per the authorization-form review's finding. The above is the Commander's own assent, recorded exactly as given, to this document as revised.)*

## 4. Implementation Boundary (per `POA-STD-011` §6.6 — four separately labeled elements)

### 4.1 Authorized Work

- Evidence-based inventory of the existing Mothership design system (typography, spacing, geometry, color/state, motion, iconography, responsive breakpoints, interaction patterns) — documentation only, no invented values.
- Extraction of reusable UI primitives from the existing implementation, only where genuinely required for consistency (no abstraction for its own sake, no mass refactor).
- Preservation of existing visual language, typography, navigation, and interaction conventions — no redesign, no new visual identity, no replacement of existing navigation.
- Runtime baseline verification: typecheck, build, existing test suite, application boot, existing API/runtime behavior — verification and stabilization only, not new runtime capability.
- Responsive baseline validation at desktop/tablet/mobile widths, for existing surfaces only.
- Practical accessibility baseline pass (keyboard focus, focus visibility, semantic controls, contrast, reduced-motion) on existing surfaces — findings recorded, not a full audit.
- Visual-regression and runtime-validation test infrastructure, reusing existing frameworks already present in the repository (no new testing framework unless demonstrated necessary).
- Preservation and regression validation of the existing Executive Panel's **current** behavior only — confirming it still renders and behaves as it does today after any primitive extraction.
- Documentation and evidence necessary to establish the above foundation.

### 4.2 Explicit Exclusions

- new Executive Panel behavior of any kind;
- expanded text interaction on the Executive Panel;
- voice assistant implementation;
- speech recognition;
- text-to-speech;
- LLM interaction or integration of any kind;
- autonomous agent behavior;
- any new Mothership surface (including any "Data Sources / Connectors" surface named in `POA-DEC-ORG-KNOWLEDGE-001` §23.3);
- KnowledgePlane expansion or modification;
- business-function implementation or any business-function API/data model;
- any Phase 6 or Phase 7 work otherwise;
- `POA-ORG-KNOW-P5-IMPL-001` work (separately authorized, unaffected by this act);
- `P5-UI-002` or any successor UI implementation mission — this act authorizes exactly one bounded mission and does not create standing authority for further UI work;
- any modification to `POA-DEC-ORG-KNOWLEDGE-001` §24.

### 4.3 Stop Conditions

The mission MUST stop and escalate to a separate governance/authorization decision — not proceed, not work around, not reinterpret its own boundary — if it discovers that:

- a change would modify or expand a Mothership surface;
- existing Executive Panel behavior must be changed;
- voice/speech/TTS/LLM functionality is required;
- KnowledgePlane/API/data-model changes are required;
- a new business-function capability is required;
- autonomous behavior is required;
- `POA-DEC-ORG-KNOWLEDGE-001` §24 must be changed;
- an architectural or governance conflict is discovered, or another governance or architectural decision is required;
- any requested work falls outside the authorized boundary (§4.1) as written.

### 4.4 Decision Boundaries

- The mission may itself decide: implementation details of primitive extraction, exact component boundaries, test-fixture selection, and which existing frameworks to reuse for visual-regression/runtime-validation infrastructure (§4.1) — provided no item in §4.2/§4.3 is triggered.
- The mission may NOT itself decide: whether any encountered ambiguity should be resolved by expanding scope, whether a "foundational" change might indirectly enable future surface work, or whether §4.3's stop conditions apply in a borderline case — any such judgment call escalates to the Commander, per `CLAUDE.md` Rule 8 (identify conflicts, do not silently resolve them).

## 5. Evidence / Reporting Obligations (per `POA-STD-011` §6.9)

- A completion/execution record is **mandatory** (e.g. `40-Runtime/POA-ORG-KNOW-P5-UI-FOUND-001-EXECUTION-RECORD.md`), following this repository's standing evidence-before-completion discipline.
- That record **must cite** this authorization act (`POA-ORG-KNOW-P5-UI-FOUND-001`, once recorded in `POA-ADR-001.md`) and its ratification-commit SHA, per §6.8/§6.9(b).
- Reproducible typecheck/build/test evidence is **mandatory** — actual command output, not narrative assertion, per §6.9(c).
- Runtime validation evidence (application boot, existing API/runtime behavior) **must be recorded** where applicable.
- Visual/responsive/accessibility validation evidence **must be recorded** for the foundational work where applicable (desktop/tablet/mobile inspection; accessibility baseline findings).
- This clause does not redesign POA's broader evidence-integrity architecture (`POA-STD-011` §6.9's own scope note) — it states only the minimum this authorization requires.

## 6. Execution-Resource Statement

No ratified MODEL-GATE mechanism currently binds this repository, therefore model/resource/profile declaration is not an authorization condition. The execution record MUST nevertheless identify the actual model/resource/profile used and report any material execution resource mismatch.

**Commander execution-profile preference (2026-09-30) — an execution preference, NOT a new MODEL-GATE governance rule:**
- Preferred implementation model: Claude Sonnet 5.5.
- Preferred effort: High for substantial implementation passes; Medium for routine validation, test and iteration loops.
- Escalation: Claude Opus 5.5 may be used when architectural ambiguity, governance conflict, or materially complex reasoning requires it.

*(No MODEL-GATE rule is invented by this statement — it restates the finding already recorded in `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md` §15: no ratified MODEL-GATE exists, so none is treated as binding here.)*

## 7. Commit / Push Boundary

- Bounded commits only.
- No history rewriting.
- No amend/rebase of prior governance commits.
- No unrelated files staged.
- No push.
- Any later push requires separate authorization.

## 8. Scope Preservation Statement

This act, if recorded, grants execution authority for the bounded foundational mission only — not Mothership-surface authority, not Phase 7 authority, and not architectural ratification.

- No text of `POA-DEC-ORG-KNOWLEDGE-001` §24 is altered, reinterpreted, or exempted by this act. The Phase 7 surface gate remains exactly as written and remains unmet.
- The original external brief `P5-UI-001` ("Mothership Design System + Runtime Baseline," self-declared "AUTHORIZED IMPLEMENTATION MISSION") is **not** ratified, adopted, or treated as authorized by this act, in whole or in part, in name or by reference.
- `POA-ORG-KNOW-P5-UI-FOUND-001` must reference this record as its authorizing mission, per `CLAUDE.md` Rule 6.
- Any Mothership surface work, Executive Panel behavior expansion, or Phase 6/7 work requires its own separate Commander authorization act, gated on Phase 7's own conditions being met — this act creates no shortcut or precedent toward that gate.
- A successor foundational mission (if more foundational work is later identified) is not authorized by this act either; it would require its own act.

## 9. Artifact (proposed)

`POA-ADR-001` (if recorded); `40-Runtime/P5-UI-001-AUTHORIZATION-RECONCILIATION-REPORT.md` (interpreted, unmodified); the original external brief (interpreted only for its non-surface, non-Executive-Panel-expansion content, not adopted).

## 10. Artifact Version/State

No repository file modified by this draft. `POA-DEC-ORG-KNOWLEDGE-001-DECISION.md` §24 unchanged and unchangeable by this act. `50-Mothership/` and `50-Mothership/command-center/` unmodified.

## 11. Related Mission

`POA-ORG-KNOW-P5-PLAN-001`; `POA-ORG-KNOW-P5-AUTH-001`; the read-only `P5-UI-001-AUTHORIZATION-RECONCILIATION-REPORT.md`; would enable (if recorded) `POA-ORG-KNOW-P5-UI-FOUND-001` as a new implementation mission.

## 12. Related Evidence

`40-Runtime/P5-UI-001-AUTHORIZATION-RECONCILIATION-REPORT.md` (classification: REQUIRES A NEW COMMANDER AUTHORIZATION ACT; Phase 7 gate unmet); `POA-DEC-ORG-KNOWLEDGE-001-DECISION.md` §23.3, §24; `POA-STD-011` §6 (authorization-form requirements applied in this revision); the Commander's placement ruling recorded in §2 above and assent recorded in §3.

## 13. Resulting Commit / Repository State

This artifact and the ratification record in `POA-ADR-001.md` are committed together in one bounded governance commit. The commit SHA may be added additively by a later bookkeeping commit, per the `POA-ADR-001.md` "where applicable, once known" rule.

---

*End of `POA-ORG-KNOW-P5-UI-FOUND-001` authorization artifact, Revision 2 as Commander-approved. Effective authorization is the ratification record appended to `POA-ADR-001.md`.*
