# ADR-002

## Sprint Alpha Materialization Authorized Despite Declared Governance Gaps

---

# 1. Artifact Identity

| Field                 | Value                                          |
| --------------------- | ----------------------------------------------- |
| Artifact ID           | ADR-002                                        |
| Artifact Name         | Sprint Alpha Materialization Authorized Despite Declared Governance Gaps |
| Artifact Family       | ADR (Architectural Decision Record)            |
| Status                | **Accepted** — this is a live Commander decision made in this session, fully traceable, unlike the uncorroborated status claims found elsewhere in the source vault (see `40-Runtime/PRS-001-CONFLICT-DOSSIER.md` §4–5 for contrast) |
| Repository Domain     | Shared / Decisions                             |
| Authority             | Commander (matters reserved to Commander per `ORC-001-GOV-001`) |
| Decided               | 2026-08-08                                     |

---

# 2. Context

`POA-REPO-002` (Authoritative Source Reconciliation) completed its Category A reconciliation and found a genuine, unresolved structural conflict (Category B — `POA-PRS-001` vs. the repository's live artifact-identifier convention, GAP-001) along with several pre-existing governance gaps (GAP-002 through GAP-008, all recorded in `GAP-REGISTER-001.md`).

The next mission, `POA-VIS-001` (Sprint Alpha Visual System Materialization), is application/visual-system work. Prior missions (`POA-REPO-001`, `POA-REPO-002`) both stated that such work should not begin until repository governance reports readiness.

---

# 3. Decision

The Commander authorizes Sprint Alpha (`POA-VIS-001`) application/visual-system materialization to proceed **despite** the governance gaps recorded in `GAP-REGISTER-001.md` remaining open.

---

# 4. Scope of This Authorization

This authorization applies **only** to the `POA-VIS-001` Sprint Alpha materialization scope.

It explicitly does **not**:

- certify, approve, or promote `POA-META-002`, `ACS-001`, `POA-STD-006`–`010` (GAP-002/003/004);
- certify or promote `POA-000`, `POA-001`, `POA-META-001`, `POA-101`–`106`, or `POA-TEMPLATE-001` from Draft to Approved (GAP-005);
- resolve, adopt, or reject `POA-PRS-001` (GAP-001 remains formally **HELD** — no repository identifier or directory may be renamed, moved, or restructured as a result of this decision or of `POA-VIS-001`);
- establish a formal POA Baseline version record (GAP-006);
- authorize any other application, product, or governance materialization beyond `POA-VIS-001` specifically.

Any future mission beyond `POA-VIS-001` that wishes to rely on this precedent must obtain its own explicit Commander authorization — this ADR does not generalize.

---

# 5. Consequence

- `ROADMAP.md` updated to reflect that Sprint Alpha is no longer gated on full governance readiness, citing this ADR.
- `CLAUDE.md` Scope Boundary updated to the same effect, so AI execution agents reading repository operating instructions do not incorrectly block `POA-VIS-001` work.
- `GAP-REGISTER-001.md` remains fully open and in force for everything outside `POA-VIS-001`'s scope.

---

# 6. Result

DECISION STATUS: **ACCEPTED.** Sprint Alpha (`POA-VIS-001`) is unblocked. All declared governance gaps remain open, tracked, and preserved for future dedicated governance missions.
