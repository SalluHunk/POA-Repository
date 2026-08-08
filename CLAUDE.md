# CLAUDE.md

## AI Operating Instructions for POA-Repository

This file governs how Claude (and any equivalent AI execution agent) operates within this repository. It was materialized by Mission `POA-REPO-001` per Phase 5 of that mission's specification. It does not modify constitutional authority — it only encodes existing constraints already established across `POA-KER-001`, `POA-EXB-001`, `POA-STD-011`, and `10-Constitution/POA-CON-001.md`.

---

## Operating Rules

1. **This repository is the authoritative source of organizational truth.** Do not treat conversational context, memory, or assumptions as overriding what is committed here.

2. **Read relevant POA architecture before modifying implementation.** Before touching `20-Shared/`, `10-Constitution/`, or `40-Runtime/`, read the artifacts already present in that domain.

3. **Constitutional documents take precedence over local convenience.** `10-Constitution/POA-CON-001.md` and any future ratified Constitution outrank expedience, speed, or a request that conflicts with them.

4. **Architecture must not be changed implicitly through implementation.** A code or content change is not a license to redesign the structure it lives in. Architectural change requires an explicit mission and explicit approval.

5. **Existing naming/versioning conventions must be preserved.** Artifact IDs follow `POA-<FAMILY>-<NNN>`; filenames match artifact IDs; version fields follow semantic versioning where already established. Do not introduce a competing convention.

6. **Changes must be traceable.** Every materialization should be able to answer: which mission authorized it, which source artifact it derives from, and which commit introduced it.

7. **Do not invent missing organizational policy.** Where a required concept has no established source (Constitution text, `POA-META-001`, `POA-META-002`, `ACS-001`, etc.), write `TBD — requires architectural decision`. Do not fabricate governance to fill the gap.

8. **Identify architectural conflicts rather than silently resolving them.** If local and remote diverge in a way that isn't a clean fast-forward, or two artifacts assert contradictory authority, stop and report — do not pick a side unilaterally.

9. **Major architectural changes require explicit approval.** A Mission Package (`POA-STD-011`) or equivalent explicit authorization is required before restructuring directories, renaming artifact families, or altering governance documents.

10. **Repository changes must be validated before commit.** Run `git status` / `git diff` review, confirm no secrets or unintended deletions, and confirm required documents/folders exist, before every commit.

---

## Relationship to `.claude/`

This repository's `.claude/` directory currently contains only `settings.local.json` (personal, machine-local settings — correctly excluded from version control by the user's global gitignore). No shared `.claude/settings.json` exists. If one is added later, it must not conflict with the rules above; this file (`CLAUDE.md`) takes precedence over local tool configuration on any point of governance.

---

## Scope Boundary

Per `ADR-002` (2026-08-08), Sprint Alpha (`POA-VIS-001`) application/visual-system materialization is **authorized to proceed** despite the open governance gaps tracked in `20-Shared/GOV/GAP-REGISTER-001.md`. That authorization is scoped strictly to `POA-VIS-001` — it does not certify, approve, or promote any tracked gap, and it does not authorize any other application/product materialization mission. Any mission beyond `POA-VIS-001` remains gated on its own explicit Commander authorization.

`GAP-001` (`POA-PRS-001` vs. the repository's identifier convention) remains formally **HELD** — see `PRS-001-CONFLICT-DOSSIER.md`. No repository identifier or directory may be renamed, moved, or restructured without a dedicated future governance mission resolving it, regardless of what other work is in progress.
