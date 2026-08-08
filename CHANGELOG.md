# Changelog

All notable changes to POA-Repository are recorded here. Entries are grounded in actual commit history (`git log`) and mission completion reports — not reconstructed from memory.

---

## [Unreleased] — POA-REPO-003

**Mission:** Repository Structural Conformance

### Moved
- `REPO-INTEGRITY-REPORT.md` → `40-Runtime/REPO-INTEGRITY-REPORT.md`
- `REPO-AUTHORITY-RECONCILIATION-REPORT.md` → `40-Runtime/REPO-AUTHORITY-RECONCILIATION-REPORT.md`
- `PRS-001-CONFLICT-DOSSIER.md` → `40-Runtime/PRS-001-CONFLICT-DOSSIER.md`

Reason: the Commander-approved top-level architecture defines exactly four root documents (`README.md`, `CLAUDE.md`, `CHANGELOG.md`, `ROADMAP.md`). These three mission reports had no approved root location; `40-Runtime/` is explicitly defined by the approved architecture as covering "missions... production/runtime evidence," a direct textual match. Moved with `git mv` to preserve history; all 9 cross-references across the repository updated to the new paths; no artifact ID or content changed.

### Added
- `40-Runtime/REPO-STRUCTURE-AUDIT-003.md`
- `40-Runtime/REPO-STRUCTURE-REPORT.md`

---

## [Unreleased] — POA-REPO-001

**Mission:** Repository Integrity & Governance Materialization

### Added
- `10-Constitution/POA-CON-001.md` — Constitutional & Governance Baseline (Interim)
- `20-Shared/DECISIONS/ADR-RM-001.md` — first Architectural Decision Record (materialized from source deployment vault)
- `40-Runtime/POA-MAT-001.md` — POA Materialization Playbook
- `CHANGELOG.md` (this file)
- `ROADMAP.md`
- `CLAUDE.md` — AI operating instructions
- `REPO-INTEGRITY-REPORT.md`

### Notes
- No existing artifact was deleted, overwritten, or relocated.
- Local and `origin/main` were found byte-identical at mission start (0-diff reconciliation) — the divergence risk flagged in the mission brief had already been resolved by a prior push in this session.

---

## 2026-07-25 — `3d1ea4e`

**feat(standards): materialize POA-STD-011 Mission Package Standard**

- Added `20-Shared/STD/POA-STD-011.md`, materialized from the source deployment vault per `MP-0001` / `ADR-RM001-011`.

---

## 2026-06-27 — `d0a5b55`

**feat(bootstrap): initialize POA Execution System**

- Bootstrap `BOOT-001`: established repository hierarchy (`00-Bootstrap/`, `10-Constitution/`, `20-Shared/{KER,RSR,EXB}/`, `30-Products/`, `40-Runtime/`).
- Added `20-Shared/KER/POA-KER-001.md` (Execution System Architecture), `20-Shared/RSR/POA-RSR-001.md` (Repository State Report Specification), `20-Shared/EXB/POA-EXB-001.md` (Execution Bundle Specification).
- Added `00-Bootstrap/BOOT-001-Manifest.md`, `BOOT-001-Validation-Report.md`, `BOOT-001-Completion-Report.md`.
- Added `README.md`.
