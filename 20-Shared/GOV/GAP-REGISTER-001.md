# GAP-REGISTER-001

## Controlled Governance Gap Register

---

# 1. Artifact Identity

| Field                 | Value                                          |
| --------------------- | ----------------------------------------------- |
| Artifact ID           | GAP-REGISTER-001                               |
| Artifact Name         | Controlled Governance Gap Register             |
| Status                | Active — living record, updated as gaps open/close |
| Repository Domain     | Shared / Governance                            |
| Authority             | POA-REPO-002 (Authoritative Source Reconciliation); waiver recorded in `ADR-002` |
| Established By        | Commander decision, 2026-08-08, following `POA-REPO-002` |

---

# 2. Purpose

This register formally tracks every governance gap identified by `POA-REPO-001` and `POA-REPO-002` so they are not lost, silently forgotten, or accidentally treated as resolved. Its existence is what makes it safe to authorize scoped work (e.g. Sprint Alpha) despite open gaps: the gaps remain visible and tracked rather than papered over.

**No entry in this register may be closed by simply removing it.** An entry closes only when the artifact it describes is actually authored/approved/reconciled by a dedicated future governance mission, at which point this register is updated to record that resolution and cite the mission that performed it.

---

# 3. Register

| Gap ID | Title | Category | Status | Blocking? | Discovered In | Resolution Path |
|---|---|---|---|---|---|---|
| GAP-001 | `POA-PRS-001` artifact-identifier scheme conflicts with the repository's live convention | Category B — Structural Conflict | **HELD** (Commander decision) | Blocks adoption of a PRS-001-compliant identifier scheme. **Does NOT block Sprint Alpha (`POA-VIS-001`)** per `ADR-002`. | `POA-REPO-002` | Dedicated future governance mission to adopt / supersede / reconcile. Full evidence: `40-Runtime/PRS-001-CONFLICT-DOSSIER.md`. |
| GAP-002 | `POA-META-002` does not exist as a document anywhere in the authoritative source | Missing Governance Standard | OPEN | Blocks full resolution of `POA-STD-011`'s authority citation. Does not block Sprint Alpha. | `POA-REPO-001`, confirmed `POA-REPO-002` | Must be authored and approved by a future governance mission. **Not to be authored merely to close this gap.** |
| GAP-003 | `ACS-001` (Certification standard) does not exist anywhere in the authoritative source | Missing Governance Standard | OPEN | Blocks formal certification of any Draft artifact. Does not block Sprint Alpha. | `POA-REPO-001`, confirmed `POA-REPO-002` | Same as GAP-002. |
| GAP-004 | `POA-STD-006` through `POA-STD-010` do not exist anywhere in the authoritative source | Missing Governance Standards | OPEN | Blocks completion of the Standards catalog. Does not block Sprint Alpha. | `POA-REPO-001`, confirmed `POA-REPO-002` | Same as GAP-002. |
| GAP-005 | `POA-000`, `POA-001`, `POA-META-001`, `POA-101`–`106`, `POA-TEMPLATE-001` all remain Draft/Construction, never certified | Uncertified Architecture | OPEN | Not blocking — may be referenced informationally, must never be presented as certified. | `POA-REPO-002` | Future architecture review/certification mission, following each document's own stated lifecycle. |
| GAP-006 | No formal POA Baseline version record (v1.0 / v1.1 / v1.2) exists anywhere | Missing Baseline Record | OPEN | Not blocking. Nothing has been invented in its place. | `POA-REPO-002` | Future baseline-establishment mission. |
| GAP-007 | The Constitution (`CONST-001`) carries no formal approval/status metadata block, unlike what `POA-META-001`'s own Document Identity Standard would require of a compliant artifact | Documentation Compliance | OPEN | Not blocking. | `POA-REPO-002` | Steward action to formally ratify/stamp `CONST-001`, or amend the standard. |
| GAP-008 | `POA-001` filename says "v1.0" but internal metadata says "0.1.0 (Foundational Draft)"; `POA-TEMPLATE-001` §2.2 mislabels `POA-104`/`105`/`106` relative to their actual titles | Drafting Inconsistency | OPEN | Not blocking. | `POA-REPO-002` | To be corrected when `POA-001` / `POA-TEMPLATE-001` undergo formal review. |

---

# 4. Explicit Non-Actions

Per Commander instruction, none of the following are to be performed as a side effect of closing gaps quickly:

- Do not author `POA-META-002`, `ACS-001`, or `POA-STD-006`–`010` merely to remove GAP-002/003/004 from this register.
- Do not rename, move, or restructure any existing repository artifact or directory to resolve GAP-001.
- Do not promote any Draft/Construction document (GAP-005) to Approved/Certified status without that document's own governed review.
- Do not invent a baseline version number to close GAP-006.

---

# 5. Relationship to Sprint Alpha (`POA-VIS-001`)

The Commander has authorized Sprint Alpha application/visual-system materialization to proceed despite every gap in this register remaining open. That authorization is recorded in `ADR-002` and is scoped **only** to Sprint Alpha — it does not certify, approve, or promote anything in this register. This register continues to apply to all other governance and architecture work.
