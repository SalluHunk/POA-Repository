# ADR-003

## POA Core / Expression Layer Architectural Boundary (POA-VIS-003)

---

# 1. Artifact Identity

| Field                 | Value                                          |
| --------------------- | ----------------------------------------------- |
| Artifact ID           | ADR-003                                        |
| Artifact Name         | POA Core / Expression Layer Architectural Boundary |
| Artifact Family       | ADR (Architectural Decision Record)            |
| Status                | **Accepted** — decided by the `POA-VIS-003` mission brief (`STATUS: AUTHORIZED — EXECUTE`), confirmed in-session by Commander authorization, 2026-08-10 |
| Repository Domain     | Shared / Decisions                             |
| Authority             | Commander (matters reserved to Commander per `ORC-001-GOV-001`) |
| Decided               | 2026-08-10                                     |

---

# 2. Context

`POA-VIS-001` and `POA-VIS-002` built one console (`30-Products/poa-vis-001`) that computes organizational intelligence (`src/lib/domain`, `src/lib/services`, `src/lib/organizational-state.ts`) and renders it directly as a single panel-grid UI (`src/components/*`). VIS-002's own execution rule held `POA-VIS-003` open pending Chief Architect review (see `ROADMAP.md`, `40-Runtime/POA-VIS-002-COMPLETION-REPORT.md` §17).

The `POA-VIS-003` mission brief (materialized outside the repository, at the source deployment vault, and read into this mission at execution time — see completion report §1 for its exact location and the reason it isn't itself a repository artifact) requires establishing a controlled boundary so different organizations/industries can eventually express the same organizational truth through different visual languages, without the Expression Layer ever becoming a second organizational-logic layer.

---

# 3. Decision

Split the existing codebase along an explicit seam:

- **POA Core** (`src/lib/domain`, `src/lib/services`, `src/lib/organizational-state.ts`, `src/lib/alexis`) determines organizational truth and must never import from the Expression Layer or from `src/components`.
- **Expression Layer** (`src/lib/expression/*`, `src/components/expression/*`, plus the existing `src/components/*` console as the preserved reference implementation) determines how that truth is rendered, via a typed `OrganizationalVisualProfile` model, and must never derive new organizational facts (no scoring, thresholding, or aggregation).

The existing VIS-001/VIS-002 console becomes the **POA Reference Expression Profile** (`referenceProfile`), left functionally unmodified. A second **Network / Organizational Graph** profile (`networkGraphProfile`) is added as the mission's required proof point — both consume the exact same `OrganizationalState` from the exact same `getOrganizationalState()` call.

Full technical detail is in `40-Runtime/POA-VIS-003-COMPLETION-REPORT.md`.

---

# 4. Scope of This Authorization

This authorization applies **only** to the `POA-VIS-003` Expression Architecture scope, exactly as `ADR-002` scoped `POA-VIS-001` alone. It explicitly does **not**:

- authorize `POA-VIS-004` or any further mission (the mission brief's own governance section requires "STOP and await Chief Architect acceptance" at completion);
- certify, promote, or resolve any item in `GAP-REGISTER-001.md` or the `POA-PRS-001` conflict (`GAP-001` remains **HELD**);
- build any production industry-specific console, multi-tenancy, or client-onboarding platform (mission NON-GOALS, §17) — the Network Graph profile is a demonstration, not a shipped industry product;
- restructure the repository — no `50-Deployment/` was created inside the repository (mission §18); deployment/reference material for this mission stayed outside the tree, consistent with prior sessions.

---

# 5. Consequence

- `30-Products/poa-vis-001/src/lib/expression/` and `src/components/expression/` now exist as the canonical Expression Layer.
- `ROADMAP.md` updated to record `POA-VIS-003` as complete, pending Chief Architect acceptance.
- `CHANGELOG.md` updated with the mission's Added/Changed entries.
- A future industry-specific profile is added by extending `EXPRESSION_PROFILES` in `src/lib/expression/registry.ts` and a new renderer under `src/components/expression/` — no change to POA Core is required, which this mission's boundary tests (`src/lib/expression/expression-boundary.test.ts`) enforce mechanically, not just by convention.

---

# 6. Result

DECISION STATUS: **ACCEPTED.** The POA Core / Expression Layer boundary is established for `30-Products/poa-vis-001`. `POA-VIS-004` and beyond remain gated on their own explicit Commander authorization, per the mission's own governance section.
