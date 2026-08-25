# POA-PJR-001 — Paravyoma Project Registry

**Status:** Active — living record (append-only; update by dated, additive entries per project, following the pattern already established by `GAP-REGISTER-001.md` and the additive Decision Records in `POA-ADR-001.md`. Do not rewrite a prior observation — append a new dated one.)
**Materialized by:** Mission `POA-PJR-001` (this registry's own establishing mission), per Chief Architect Authorization "Paravyoma Project Registry + Temple SaaS Materialization" (2026-08-25, chat directive; not a Deployment-mirror mission brief — see Provenance note below).
**Mission ID note:** No mission ID was supplied in the authorizing directive. `POA-PJR-001` is chosen by the executing session, following the `POA-<FAMILY>-<NNN>` convention confirmed authoritative by `POA-ADR-001` §"GAP-001 Identifier Convention Decision Record" (2026-08-23) — **not** the stale `CLAUDE.md` Scope Boundary text, which still describes `GAP-001` as "formally HELD." See `40-Runtime/POA-PJR-001-COMPLETION-REPORT.md` §9 for the full drift finding.
**Purpose:** A single, shared, platform-neutral discovery point from which POA can reconstruct the known state of Paravyoma projects regardless of which local machine, execution environment, or hosting platform is in use. Schema is derived from — not newly designed against — the candidate `observation_snapshot_v2` contract validated in `40-Runtime/POA-OBS-001-COMPLETION-REPORT.md` §6/§17.

**What this registry is NOT:** it is not an Observation Store, adapter, dashboard, database, or runtime component in the sense `POA-OBS-001` §18/§21 declined to build. It is a single committed Markdown record — the same class of artifact as `GAP-REGISTER-001.md` — populated by a human/AI reader following `POA-OBS-001`'s already-validated contract, not by an automated adapter. See the completion report §9 for why this distinction holds.

---

## Schema (derived from `POA-OBS-001` §6/§17, with two fields split per this mission's own explicit requirement)

Each project entry below records, at minimum:

| Registry field | Derivation |
|---|---|
| Project identity | `observation_snapshot_v2.project_identity` |
| **Lifecycle state** | New, explicit field — this authorization requires lifecycle state and execution state to be recorded separately. `POA-OBS-001` only had a single `current_phase`/`current_mission` field; this registry splits it. |
| **Execution state** | New, explicit field (see above) — "is there running/deployed software," distinct from "what stage is the initiative at." |
| Authoritative source | `observation_snapshot_v2.authoritative_source_reference` |
| Observation source | The adapter/method that produced this entry (tool used, session, date) |
| Source type | `authoritative_source_reference.source_kind` |
| Current known state | `observation_snapshot_v2.current_state` + `decisions_of_record` |
| Last-observed information | `observation_snapshot_v2.freshness` |
| Unknowns | `observation_snapshot_v2.explicit_unknowns` |
| Provenance | `POA-OBS-001` §7/§13 provenance chain model |

State-confidence markers (`VERIFIED` / `INFERRED` / `SELF-DECLARED, UNVERIFIED` / `UNKNOWN`) are preserved per field, per `POA-OBS-001`'s own discipline. A registry entry never collapses a self-declared claim into a verified fact.

---

## Entry 1 — IEP Website

| Field | Value |
|---|---|
| Project identity | **IEP Website** — Industrial Energy Pioneers' commercial website; engagement type: website design/development, "future Managed IT" (per repo description) |
| Lifecycle state | Post-launch, release-hardening / remediation phase. Last dated status: `REL-001` "Operation RELEASE READINESS" (Interim), 2026-07-24 |
| Execution state | **Live, in production** at `https://iep.technology`. Direct-to-production deployment; no staging environment (`REL-001`, verbatim) |
| Authoritative source | `github.com/SalluHunk/IEP-Website-Repository` (public, default branch `main`) |
| Observation source | GitHub MCP (`mcp__plugin_ecc_github__*`), this session (2026-08-25) and `POA-OBS-001` Precision Revalidation (2026-08-24) |
| Source type | Git repository (GitHub-hosted, public) |
| Current known state | Certification verdict **NO** recorded twice (`CQA-001`, `CQA-002`, 2026-07-23); Release Readiness Statement **❌ Not Ready for Client UAT** (`REL-001`, 2026-07-24) with two unresolved live defects (DEF-01 — Resources page routing collision; DEF-02 — Contact form 30+s latency); Client UAT sign-off **NOT YET SIGNED**. Full reconstructed chronology and contradiction analysis: `POA-OBS-001-COMPLETION-REPORT.md` §6–§9 |
| Last-observed information | Repository `pushed_at` = `2026-08-03T19:09:46Z`, re-confirmed unchanged by this mission's own fresh query today (2026-08-25) — **no repository activity since the `POA-OBS-001` revalidation of 2026-08-24.** Status documents (`README.md`, `CHANGELOG.md`, `REL-001`) are themselves 10–11+ days stale relative to that last commit, per `POA-OBS-001` §14 |
| Unknowns | Whether DEF-01/DEF-02 are resolved; whether a `REL-001` successor report exists; relationship between the DoCs VauLT commercial-proposal corpus and this GitHub repository (never cross-referenced by either evidence base) |
| Provenance | Full chain: `POA-OBS-001-COMPLETION-REPORT.md` §4, §7, §13, Precision Revalidation Addendum. This entry adds one fact only — the repository's `pushed_at` is unchanged as of 2026-08-25, confirmed via `search_repositories(query: "repo:SalluHunk/IEP-Website-Repository")`, this mission |

---

## Entry 2 — PDF Compressor ("SHARP")

| Field | Value |
|---|---|
| Project identity | **PDF Compressor** — user-identified name; the repository and product self-identify as **SHARP**, "a document optimization engine" for PDF compression |
| Lifecycle state | Active implementation with a field-validated release milestone. Per README: full pipeline (render → analyze → engineer features → classify → plan → search → build) implemented; 337 tests; CI green (lint, format, type-check, tests); field-validated against a real 228-page/130 MB scanned document (13.09× compression, 0 page failures) |
| Execution state | Runs as a Python CLI (`sharp optimize input.pdf --target ...`), distributed as an installable package (`pyproject.toml`), MIT licensed |
| Authoritative source | `github.com/SalluHunk/ProjectSHARP` (public, default branch `main`) — identified by the user in this session; **independently verified**, not accepted on assertion alone, via the repository's own `README.md` content, which self-describes the exact product ("SHARP is a document optimization engine... `sharp optimize input.pdf`") |
| Observation source | GitHub MCP (`mcp__plugin_ecc_github__*`), this session (2026-08-25) |
| Source type | Git repository (GitHub-hosted, public) |
| Current known state | Most recent commit: `ceba55a` (2026-07-24T16:14:10Z) — "SHARP-P5-M2: field validation certification," closing a Commander-held field-validation gate. Repository description metadata reads "SHARP Optimization Platform," a generic label that does not name PDF compression explicitly — **a minor identity-drift finding, the same class of finding `POA-OBS-001` §9 found in IEP's README/CHANGELOG** (a human-facing label lagging what the artifact actually is/does), disclosed here rather than silently corrected |
| Last-observed information | Repository `pushed_at` = `2026-07-24T16:14:28Z` — **31 days stale relative to today (2026-08-25)**, with no repository activity recorded since. This is a plain fact about the public default branch, not a judgment about whether "active refinement/quality work" (as characterized in this mission's authorization) is occurring — it may be occurring locally/uncommitted, which this registry cannot see (see Unknowns) |
| Unknowns | Whether "active refinement/quality work" referenced by this mission's authorization reflects activity not yet pushed to the public `main` branch (a direct instance of `POA-OBS-001` §9/§11's local-work-invisible-to-repository-observer concern); whether any non-default branch carries newer work (not queried, a disclosed bounded-scope choice); no dedicated "licensing work" document exists beyond the repository's own MIT `LICENSE` file |
| Provenance | `search_repositories`, `get_file_contents(README.md, root listing)`, `list_commits` — all direct GitHub MCP queries, this mission, 2026-08-25. Identity claim ("this is the PDF Compressor") originates from the user in this session; verified independently against primary evidence (README content) before being recorded here, per `POA-EVID-001` §D's reconstructability test |

---

## Entry 3 — Temple SaaS

| Field | Value |
|---|---|
| Project identity | **Temple SaaS** — name as given in this mission's authorization, and as it appears (product code `TSA`) in `POA-PRS-001.docx`'s illustrative Product Identifier table. **Naming is not fully resolved by evidence** — see Unknowns and the dedicated baseline document. |
| Lifecycle state | **DEFINITION / PLANNED**, in the repository-and-application sense the authorization anchors to (confirmed true: no Temple SaaS product repository or application codebase was found anywhere). **A distinct, self-declared claim exists and is recorded separately, not blended into this line:** Paravyoma's own public "Products & Innovation Lab" page (`Products.pdf`, dated 2026-06-05) places **"Temple Suite"** at product-roadmap stage **VALIDATION** — "Prototype testing with select clients... Being tested with active temple partners." This claim is **SELF-DECLARED, UNVERIFIED** by this mission — no named partner, signed engagement, dated completion artifact, or deployed instance was found corroborating it. |
| Execution state | **DEVELOPMENT NOT STARTED** — no product repository, no application code, no deployed instance exists for a distinct Temple SaaS/Temple Suite product anywhere this mission could search. What does exist is **published marketing/product-definition content** (not a product codebase) committed inside Paravyoma's own corporate website repository, `github.com/SalluHunk/Paravyoma-Site` (`src/app/temple-suite/`, `src/app/temple-solutions/`, `src/app/temple-suite/devotee-growth-platform/`, `src/components/shared/temple-mode.tsx`), added 2026-06-03 through 2026-06-25 per that repository's own commit history |
| Authoritative source | **None dedicated.** Distributed across: (a) `github.com/SalluHunk/Paravyoma-Site` — marketing-site source, not a Temple SaaS product repo; (b) `POA-PRS-001.docx` (Deployment mirror) — a **non-adopted** identifier-convention proposal (`POA-ADR-001` §3.6: "`POA-PRS-001` is not adopted as POA's governing identifier convention") that nonetheless names "Temple SaaS" (TSA) and "Temple Growth Platform" (TGP) as separate product codes; (c) `D:\...\DoCs VauLT\ParavyomaTech\New Site\*.pdf` — dated website-export PDFs (`Solutions-Temple Soluitions.pdf`, `Products.pdf`); (d) several undated internal strategy `.docx` files naming "Temple Suite"/"Temple Solutions" as validation-laboratory/organizational-system examples |
| Observation source | Local filesystem search (this session) + `git log` on `Paravyoma-Site` + `.docx` text extraction (zip/XML parse, this session, 2026-08-25) |
| Source type | Mixed: document-set (PDF/DOCX) + marketing-site source code (no dedicated application repository) |
| Current known state | See `20-Shared/PJR/POA-PJR-002-TEMPLE-SAAS-PROJECT-BASELINE.md` for the full extraction (nine-module structure, four-suite framing, Devotee Growth Platform pilot plan, roadmap, commercial-evaluation and licensing findings) |
| Last-observed information | Website source last touched 2026-06-25 (commit `31da55b`, Paravyoma-Site); `Products.pdf`/`Solutions-Temple Soluitions.pdf` dated 2026-06-05. **62 days stale relative to today (2026-08-25)** by both measures, with no newer Temple-specific artifact found anywhere searched |
| Unknowns | Full list in the baseline document §8. Most consequential: (1) whether "Temple Solutions," "Temple Suite," "Temple Growth Platform" (TGP), and "Temple SaaS" (TSA) denote one initiative under different names at different times, or genuinely distinct products/codes; (2) whether the "being tested with active temple partners" claim reflects any real, named engagement; (3) whether the ISKCON Lucknow pilot plan named in the Devotee Growth Platform page was ever started |
| Provenance | Full chain and per-fact citations: `POA-PJR-002-TEMPLE-SAAS-PROJECT-BASELINE.md` §9 |

---

## Registry Discipline

- This registry records observations. It does not certify, approve, or promote any project's readiness, and it creates no obligation on any project team.
- New observations are appended with a date; existing rows are not silently overwritten, per this repository's established append-only convention (`POA-EVID-001`, `POA-ADR-001`).
- Adding a fourth or later project entry, or converting this registry into an automated/adapter-backed system, requires its own separate authorization — this materialization authorizes exactly three entries (IEP Website, PDF Compressor, Temple SaaS) and the registry's existence as a manually-maintained record.

---

## Addendum (2026-08-25, Session 2) — Chief Architect Naming Resolution

**This section is NOT a rewrite of any text above.** Entry 3's original table (naming ambiguity, project identity row, all other fields) is preserved verbatim, unedited, above. This addendum records a subsequent Chief Architect ruling additively, per this repository's established append-only convention, and per the formal Decision Record materialized in `POA-ADR-001` ("Temple SaaS Canonical Naming Resolution Decision Record," 2026-08-25).

Per Chief Architect Review of `POA-PJR-001` (2026-08-25, chat directive):

> "Temple SaaS is the canonical project/product initiative being materialized under POA. It consists of nine modules as captured in the Temple baseline. Devotee Growth Platform is the first module selected for implementation/commercial advancement."

**Effective, additive update to Entry 3:**

| Field | Resolved value |
|---|---|
| Canonical project identity | **Temple SaaS** — the nine-module platform documented in `POA-PJR-002-TEMPLE-SAAS-PROJECT-BASELINE.md` §4 |
| First module for implementation/commercial advancement | **Devotee Growth Platform** (Module 8 of 9) |
| "Temple Solutions" | Preserved as historical/source terminology only. No additional architectural relationship to Temple SaaS is inferred by this decision — per the Chief Architect's own explicit instruction. |
| "Temple Growth Platform" (TGP) | Preserved as historical/source terminology only. Same instruction applies — not merged into, or distinguished from, Temple SaaS by this decision. |

**What this addendum does NOT do:** it does not resolve whether "Temple Solutions" or "Temple Growth Platform" are the same initiative as Temple SaaS under an earlier name, or genuinely separate — that remains explicitly unmapped, per the Chief Architect's own instruction not to infer additional architectural relationships. Baseline §8 Open Questions 2–6 (partner-engagement verification, ISKCON Lucknow pilot status, alternate-repository existence, licensing-document existence, TGP's own identity) are unaffected and remain open.

Full decision record: `20-Shared/DECISIONS/POA-ADR-001.md`, "Temple SaaS Canonical Naming Resolution Decision Record (2026-08-25)."

---

## Addendum (2026-08-25, `TSAAS-DEC-001`) — TGP Naming Evolution Resolved

**This section is NOT a rewrite of any text above.** The Addendum immediately above (Chief Architect Naming Resolution) is preserved verbatim, unedited — including its own explicit statement that "Temple Growth Platform" (TGP) is preserved as historical/source terminology with no relationship to Temple SaaS inferred. This section records a subsequent, additive resolution, per this repository's established append-only convention.

Following `40-Runtime/TSAAS-RECON-001-COMPLETION-REPORT.md`'s reconciliation of a previously unsearched evidence archive (`D:\ISKCON LKO\ISKCON SAAS App`), `TSAAS-DEC-001 — DGP Canonical Naming & Product Boundary Decision.md` (Deployment mirror) formally resolved TGP's relationship to Temple SaaS:

> "Temple Growth Platform (TGP) is retained as historical/working terminology from the earlier discovery/commercial phase of the same product evolution; is not treated as a separate product, module, or competing initiative; remains preserved in historical documents for provenance."

**Effective, additive update to Entry 3:**

| Field | Resolved value |
|---|---|
| Temple Growth Platform (TGP) | Historical/working name from the discovery and commercial-negotiation phase (2026-06-03 → 2026-06-30) of the same product evolution that produced Devotee Growth Platform as its canonical, currently-advancing name. Not a separate product or competing initiative. No formal rename date or signed renaming decision is claimed to exist — this is a naming-evolution characterization, not a documented single rename event. |
| Resulting hierarchy | `Paravyoma → Temple Suite → Devotee Growth Platform`, with `Devotee Growth Platform → ISKCON Lucknow pilot` as the first commercial/pilot implementation, and `Temple Growth Platform → historical/working name` preserved for provenance. |

Full decision record: `20-Shared/DECISIONS/POA-ADR-001.md`, "TSAAS-DEC-001 — DGP Canonical Naming & Product Boundary Decision Record (2026-08-25)." This resolution does not authorize `TSAAS-001` or any implementation, commercial, or pilot activity — see that record's own §4/§7 for the full non-action list.
