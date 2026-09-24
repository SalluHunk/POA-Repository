# POA-DEC-MOTHERSHIP-001

## Repository Read-Path Authorization Decision Record — Mothership Dogfooding Slice 001 (D-B / D-1 / D-2)

**Mission Class:** Commander Ruling, formalized (not an investigative decision mission; no new investigation is performed by this document).
**Resumes from:** `POA — MOTHERSHIP DOGFOODING SLICE 001 — COMMANDER REVIEW & CHECKPOINT AUTHORIZATION` (chat directive, 2026-09-24), which found Slice 001 technically PASS but BLOCKED on this governance question.
**Repository Baseline (verified):** `HEAD == origin/main == 9569b209704a9b361818e0407c893bd9d329324b`.
**Related:** `POA-ADR-001`, `20-Shared/PJR/POA-PJR-001-PARAVYOMA-PROJECT-REGISTRY.md`, `POA-OBS-001` (adapter vocabulary), `POA-BLD-MOTHERSHIP-001` (the runtime this decision authorizes a read path into).

**Reading note on classification:** this document follows the `POA-DEC-*` artifact family already established by `POA-DEC-ORG-001`–`004` and `POA-DEC-SEC-001` — a dedicated `40-Runtime/*-DECISION.md` record, distinct from the shorter addenda appended directly to `POA-ADR-001.md`. Unlike its `DEC-ORG`/`DEC-SEC` predecessors, this record does not open a new investigation: the investigation (reconnaissance, Commander Decision Brief, Slice 001 implementation, and Commander Review) is already complete and cited by reference in §10. This document exists solely to formalize an already-issued Commander ruling in a committed governance artifact, per that ruling's own D-2 instruction.

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | `POA-DEC-MOTHERSHIP-001` |
| Artifact Name | Repository Read-Path Authorization Decision Record — Mothership Dogfooding Slice 001 |
| Artifact Family | DEC (Decision) — `MOTHERSHIP` domain segment, following the same `POA-<FAMILY>-<DOMAIN>-<NNN>` shape already used by `POA-DEC-ORG-00x`, `POA-DEC-SEC-001`, and the sibling `POA-BLD-MOTHERSHIP-001` |
| Version | 1.0.0 — first materialization |
| Status | **RATIFIED — Commander ruling, formalized.** Not a decision candidate: D-1 and D-2 were issued directly by the Commander (chat directive, 2026-09-24) and are recorded here verbatim, not proposed. |
| Authority | Paravyoma Constitution → Commander (apex authority, no higher acceptance step required — the same reasoning already applied to `GAP-001` and every other direct-Commander record in `POA-ADR-001`) |
| Repository Domain | Runtime (decision record); references `20-Shared/PJR` and `20-Shared/DECISIONS` without modifying either |
| Capability Introduced | None. This is a governance record, not an implementation. It authorizes (already-written) Slice 001 code to be checkpointed; it does not itself add capability. |
| Evidence Basis | `40-Runtime/POA-MOTHERSHIP-DOGFOODING-ARCHITECTURE-RECONNAISSANCE-REPORT.md`, `40-Runtime/POA-MOTHERSHIP-DOGFOODING-COMMANDER-DECISION-BRIEF.md`, `40-Runtime/POA-MOTHERSHIP-DOGFOODING-SLICE-001-COMPLETION-REPORT.md`, `40-Runtime/POA-MOTHERSHIP-DOGFOODING-SLICE-001-COMMANDER-REVIEW-REPORT.md` (all untracked at the time of this decision — see §"Artifact Version/State") |

---

# 1. Context

`POA-PJR-001`'s own "Registry Discipline" clause states: *"Adding a fourth or later project entry, or converting this registry into an automated/adapter-backed system, requires its own separate authorization."* The Mothership Dogfooding Slice 001 implementation adds a read-only runtime path (`50-Mothership/server/repository-records.ts`) that consumes `POA-ADR-001` and `POA-PJR-001` from the committed Git blob, pinned to `HEAD`, with no write route and no mutation of either source.

The Commander Review Report (`POA-MOTHERSHIP-DOGFOODING-SLICE-001-COMMANDER-REVIEW-REPORT.md`) found this implementation technically PASS on all 14 review conditions but **BLOCKED** the checkpoint at exactly this question: does a read-only consumer of `POA-PJR-001` fall inside the Registry Discipline clause's "automated/adapter-backed" language, and if so, does the Commander Decision Brief's `D-B` ruling supply the "separate authorization" the clause requires? That report also noted a vocabulary conflict: the Decision Brief's own `D-B` table names this shape "(a) Read-time adapter over PJR-001," while `POA-OBS-001` and `POA-PJR-001` line 8 use "adapter" to mean something that *produces* observations, which this read path does not do.

The Commander has now ruled directly on both questions (D-1, D-2, quoted verbatim in §3). This document formalizes that ruling in a committed governance record, per D-2's own instruction, without reopening the investigation or introducing new architecture.

---

# 2. Existing POA Architecture Reviewed (cited, not re-investigated)

- `POA-PJR-001` § Registry Discipline (committed) — the clause this decision interprets.
- `POA-PJR-001` line 8 and `POA-OBS-001` §18/§21/§10 (completion report) — the existing, producing-direction sense of "adapter" (`Execution Environment → Observation Adapter → Observation Contract → POA`).
- `POA-MOTHERSHIP-DOGFOODING-COMMANDER-DECISION-BRIEF.md` §4 (`D-B`) — the ruling this decision formalizes, and the source of the "read-time adapter" table label the vocabulary conflict in §1 refers to.
- `50-Mothership/server/repository-records.ts` and `50-Mothership/test/repository-records.test.ts` — the Slice 001 implementation this decision unblocks.

No new architecture, ontology, or artifact beyond this decision record is introduced.

---

# 3. Decision

Quoted verbatim from the Commander's ruling (chat directive, 2026-09-24):

**[DECISION D-1 — RATIFIED]**

> "The read-only runtime path authorized by D-B is a separate authorization to consume committed PJR-001 and POA-ADR-001 records. It does not constitute a conversion, mutation, maintenance, or ownership change of PJR-001. The existing PJR-001 Registry Discipline clause remains intact."

**[DECISION D-2 — RATIFIED]**

> "Formalize the D-B authorization in the appropriate committed POA governance decision record before Slice 001 can be checkpointed. Do not invent a new governance ontology. Follow the existing POA-DEC-* decision convention."

This document (`POA-DEC-MOTHERSHIP-001`) is the record D-2 requires.

---

# 4. Scope of This Authorization

**Authorizes:**
1. The Slice 001 read-only runtime path (`50-Mothership/server/repository-records.ts`) as a legitimate consumer of `POA-ADR-001` and `POA-PJR-001`, exercised under this decision (D-1) rather than under the Registry Discipline clause's "separate authorization for conversion" language — D-1 rules that no conversion occurs, so that clause's own authorization requirement is not the gate this path passes through; this decision is the gate instead, per D-2.
2. The Slice 001 checkpoint to proceed on governance grounds. (Whether the checkpoint proceeds in fact still depends on the Commander Review Report's other conditions and file-scope rules, all of which already PASS — see that report §3–§4.)

**Does NOT:**
- Modify `POA-PJR-001` or its Registry Discipline clause. The clause's text, and its requirement that a fourth registry entry or an actual conversion needs its own separate authorization, are unchanged and remain intact (D-1, explicit).
- Grant PJR-001 write access, maintenance authority, or ownership to the Mothership runtime, to this decision, or to any future consumer. PJR-001 remains a manually-maintained, human/AI-reader-populated record per its own line 8.
- Retroactively authorize any *other* consumer of PJR-001 or ADR-001 that does not match Slice 001's own read-only, committed-source-only, HEAD-pinned, no-write shape. A future consumer with different characteristics (for example, one that writes back, or one that is not pinned to a resolved commit) is not covered and needs its own decision.
- Resolve the `POA-OBS-001` / `D-B` table vocabulary conflict noted in §1. Both usages of the word "adapter" stand as written in their own source documents; this decision rules on substance (conversion vs. consumption), not on which document's word choice was more precise.
- Authorize Slice 002, a Project↔Mission adapter, a new ontology, new provenance vocabulary, MODEL-GATE, the Dispatcher, the execution-resource registry, Claude API integration, or any Command Center UI change. None of these is touched by this decision.
- Add a fourth `POA-PJR-001` registry entry. That remains gated by the Registry Discipline clause exactly as before.

---

# 5. Consequence

The Commander Review Report's BLOCKED determination (§7 of that report) is resolved by this decision. With D-1/D-2 now formalized in a committed record, the governance boundary that report identified no longer blocks the checkpoint. The Slice 001 checkpoint readiness must still be re-verified against the Commander Review Report's other conditions (file scope, tests, working-tree state) before proceeding — that re-verification is performed separately, immediately after this record, per the Commander's own instruction and is not itself part of this decision.

---

# 6. Decision Authority

Commander, directly — the apex authority under the existing chain, exercising the same "no higher acceptance step required for a direct Commander ruling" reasoning already applied to `GAP-001` (`POA-ADR-001`) and every `POA-DEC-*` Commander ruling before it. Communicated via chat directive, 2026-09-24 ("Resume POA from the current Mothership Dogfooding Slice 001 checkpoint" / D-1, D-2).

---

# 7. Artifact

`POA-PJR-001` (the registry this decision interprets, unmodified); `50-Mothership/server/repository-records.ts` (the implementation this decision authorizes for checkpoint); `POA-ADR-001` (the specification whose Decision Record pattern this document's Artifact Identity block follows, per §C/§D, without modifying `POA-ADR-001` itself).

---

# 8. Artifact Version/State

`POA-PJR-001` Status "Active — living record (append-only)" unchanged by this decision; three entries, Registry Discipline clause text unchanged. `POA-ADR-001` v1.0.0, unchanged and unmodified by this document (this is a separate `POA-DEC-*` artifact, not an ADR-001 addendum). The four `40-Runtime/` reports cited in the "Evidence Basis" field are untracked at the time of this decision — their own retention/traceability status (per §4.3 of the Commander Review Report) is a separate, still-open question this decision does not resolve.

---

# 9. Related Mission

`POA — MOTHERSHIP DOGFOODING ARCHITECTURE` (reconnaissance and Commander Decision Brief, producing `D-A` through `D-D`); `POA — MOTHERSHIP DOGFOODING SLICE 001` (implementation); `POA — MOTHERSHIP DOGFOODING SLICE 001 — COMMANDER REVIEW & CHECKPOINT AUTHORIZATION` (the review that identified the boundary this decision resolves); the resuming directive that issued D-1/D-2 (chat, 2026-09-24).

---

# 10. Related Evidence

`40-Runtime/POA-MOTHERSHIP-DOGFOODING-COMMANDER-DECISION-BRIEF.md` §4 (`D-B` ruling and its "read-time adapter" table label); `40-Runtime/POA-MOTHERSHIP-DOGFOODING-SLICE-001-COMPLETION-REPORT.md` §9 item 8 (the open question this decision closes); `40-Runtime/POA-MOTHERSHIP-DOGFOODING-SLICE-001-COMMANDER-REVIEW-REPORT.md` §7–§8 (the BLOCKED determination and the D-1/D-2 decision-boundary framing this record formalizes); `20-Shared/PJR/POA-PJR-001-PARAVYOMA-PROJECT-REGISTRY.md` line 8 and § Registry Discipline (the clause interpreted).

---

# 11. Resulting Commit / Repository State

Not yet committed. To be populated additively once known, per this field's own "where applicable, once known" rule (`POA-ADR-001` §D.6).

---

# Result

`POA-DEC-MOTHERSHIP-001` MATERIALIZED. D-1 and D-2 are formalized as RATIFIED, verbatim, in a committed `POA-DEC-*` governance decision record. `POA-PJR-001` and its Registry Discipline clause are unmodified. No new ontology, adapter mechanism, or governance rule is introduced. The Mothership Dogfooding Slice 001 checkpoint's governance blocker is resolved by this record; its remaining readiness conditions are re-verified separately (see the follow-on Commander Review re-run).

---

*End of POA-DEC-MOTHERSHIP-001 Decision Record. Authorized by: Commander, directly, via chat directive, 2026-09-24 (D-1, D-2). Materialized by: this mission, 2026-09-24.*
