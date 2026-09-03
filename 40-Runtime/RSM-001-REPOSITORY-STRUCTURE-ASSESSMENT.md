# RSM-001 — Repository Structure & Boundary Assessment

## Mission Metadata

| Field | Value |
|---|---|
| Mission ID | RSM-001 |
| Mission Name | Repository Structure & Boundary Assessment |
| Authority | Directive `RSM-001 — Repository Structure & Boundary Assessment.md` (Deployment mirror, external to this repository) |
| Mode | READ-ONLY REPOSITORY / ARCHITECTURAL ASSESSMENT |
| Execution date | 2026-08-22 |
| Repository modifications performed | One new file: this report. No existing artifact created, edited, moved, renamed, deleted, staged, committed, or pushed. No git configuration, remote, branch, or `.gitignore` change. |
| Status | COMPLETE — returned to Chief Architect / Commander review per §23 |

This report answers the mission directive in full. It is boundary analysis only. It does not restructure the repository, does not create a second repository, does not implement automation, and does not authorize or begin beta development.

---

## 1. Executive Finding

The repository currently functions as **one repository holding two organizationally distinct things**: an authoritative governance/evidence core (`00-Bootstrap`, `10-Constitution`, `20-Shared`, `40-Runtime`) and exactly one self-contained, zero-dependency product prototype (`30-Products/poa-vis-001`). These two things are **already cleanly separable on the evidence** — the prototype imports nothing from, writes nothing to, and reads nothing from the governance/evidence material, and vice versa. Separation would be cheap *today*, specifically because integration has not yet happened.

Three findings should govern how that fact is used:

1. **The organizational boundary is not identical to the repository boundary.** A material share of the authority actually governing this repository — Commander directives, mission briefs, acceptance/certification rulings quoted verbatim inside committed artifacts — originates in an external Deployment mirror vault *outside* the git repository entirely. The repository is not the sole seat of POA Core authority; it is the durable, versioned record of a subset of it.
2. **A live, Commander-reserved Transition question is already open and currently resolves to "deferred," not "approved."** `40-Runtime/COMMANDER-TRANSITION-CASE-REVIEW-REPORT.md` (2026-08-19/20) evaluated the specific transition into "Evidence-Gated Development" against six required criteria and found five satisfied and one (**Retention and reconstructability**) **PARTIAL**. Its own conclusion is **TRANSITION DEFERRED — AWAITING COMMANDER REVIEW**, not TRANSITION UNPROVEN and not TRANSITION APPROVED. RSM-001's own opening premise ("POA is approaching the transition... toward future beta/productization") sits inside this exact open question. This assessment does not resolve it and does not need to in order to answer its own boundary questions — but any *future* mission that would act on this report's hypothesis (e.g., actually create a second repository) would be exercising "architectural expansion," which the Destination Condition Decision Record explicitly keeps "separately authorized" and outside what Evidence-Gated Development itself grants.
3. **A separate, still-HELD naming-convention conflict (`GAP-001`) constrains, but does not block, any future topology decision.** `POA-PRS-001` mandates a different artifact-ID scheme than the one this repository actually uses; that conflict is open and, per `CLAUDE.md`'s own Scope Boundary, "no repository identifier or directory may be renamed, moved, or restructured" until it is resolved by a dedicated mission. Creating a genuinely *new* repository does not rename an existing identifier, so `GAP-001` does not by itself forbid the topology this report describes — but it does forbid *reshaping* the existing repository's own naming/layout as part of getting there, which narrows the migration approach available later (§16, §19).

The evidence supports a **two-repository hypothesis (POA Core, POA Platform)**, not the three-repository hypothesis the directive offers as its starting template. No third-repository candidate ("Developer/Execution Tooling") currently has enough material to justify separate existence — see §15, §18.

---

## 2. Repository Inventory

Repository root: `d:/Salluz Zone!!/Projects/Claude Codes/POA-Repository` (git remote `origin` → `https://github.com/SalluHunk/POA-Repository.git`, branch `main` tracking `origin/main`, 0 ahead / 0 behind at assessment time).

| Path | What it actually is |
|---|---|
| `00-Bootstrap/` | 3 files (`BOOT-001-Manifest.md`, `-Validation-Report.md`, `-Completion-Report.md`). The historical record of the mission that established the repository's top-level skeleton and its first three shared architecture artifacts. Not a live governance area — a completed, self-contained bootstrap log. |
| `10-Constitution/` | 2 files. `CONST-001-Paravyoma-Constitution.md` — the actual Constitution, reproduced verbatim from an external source document, values-level prose (Purpose, Vision, Beliefs, Decision Principles, etc.), root authority by convention. `POA-CON-001.md` — a "Governance Cross-Reference Index," explicitly *not* a constitutional substitute; it tracks which named governance documents genuinely exist and discloses that the oft-quoted "Governing Principle" chain does not literally appear in the real Constitution text. |
| `20-Shared/` | 16 files across `DECISIONS/`, `EXB/`, `GOV/`, `KER/`, `RSR/`, `STD/`, plus `POA-META-002.md`. This is the live governance/architecture-specification area: decision records, the certification standard, the delegated-authority document, the execution-system and repository-state specifications, and the (largely Draft/Bounded-Accepted) standards layer. Full inventory in §3. |
| `30-Products/poa-vis-001/` | A Next.js/React/TypeScript web application — 65 git-tracked files (source + config only; `node_modules/` and `.next/` build output are present on disk but correctly excluded from tracking by the app's own nested `.gitignore`, verified via `git ls-files`). This is the "dashboard" material named in the directive. Full analysis in §7. |
| `40-Runtime/` | 97 entries (94 markdown files + 3 screenshot subdirectories), 68 tracked / 38 currently untracked. Purely generated mission evidence — completion reports, preflight reports, repository-state-report instances, decision dossiers, and prior repository-structure audits. No source code, no build config, no hand-authored architecture. Full inventory in §3. |
| `.claude/` | 2 files: `launch.json` (a VS Code-style debug config running `npm run dev --prefix 30-Products/poa-vis-001`) and `settings.local.json` (a Bash/tool permission allowlist — command *patterns* only, no hooks, no secret/token *values*). Machine-local developer tooling. |
| Repo root files | `CLAUDE.md` (AI operating rules for this repository), `README.md`, `ROADMAP.md`, `CHANGELOG.md`, `.gitignore` (8 lines — excludes `*.stackdump` and `/50-Deployment/`), and an untracked `bash.exe.stackdump` (a Git-Bash crash artifact, already gitignored, already root-caused per the `.gitignore` comment). |
| `50-Deployment/` | Referenced in `.gitignore` as a "local convenience mirror of mission-brief source docs," but **does not exist on disk in this checkout**. The actual mission-brief/ADR source vault this session used lives entirely outside this repository, at a separate filesystem location, and is never committed here. |

**No prototypes, experiments, scratch directories, generated-artifact directories (outside `poa-vis-001`'s own gitignored build output), test-only directories, or duplicated/redundant top-level structures were found.** The top-level tree is exactly the five numbered directories plus `.claude/` and root files — consistent with the prior `REPO-STRUCTURE-AUDIT-003.md` finding that the tree matches "approved architecture" with no extras.

---

## 3. Artifact Classification

Applying §5's categories. Classification is by evidence, not by directory name; several artifacts carry an internal governance *status* (Draft, Materialized, Bounded Accepted) that is independent of their *authority-category* here — a Draft standard is still Category A material (it is trying to become organizational truth), just not yet Approved.

**A — Authoritative POA Core**
- `10-Constitution/CONST-001-Paravyoma-Constitution.md`, `POA-CON-001.md`
- `00-Bootstrap/*` (historical record of Core's own establishment)
- `20-Shared/POA-META-002.md`, all of `20-Shared/GOV/` (`ACS-001`, `GAP-REGISTER-001`, `ORC-001-GOV-001`, `POA-ACC-001`, `POA-EVID-001`, `POA-EVT-001`), all of `20-Shared/DECISIONS/` (`ADR-002`, `ADR-003`, `ADR-RM-001`, `POA-ADR-001` and its five appended Decision/Acceptance Records), `20-Shared/EXB/POA-EXB-001.md`, `20-Shared/KER/POA-KER-001.md`, `20-Shared/RSR/POA-RSR-001.md`, `20-Shared/STD/POA-STD-009.md` and `POA-STD-011.md`.
- Of these, only `ORC-001-GOV-001`, `POA-KER-001`, `POA-RSR-001`, and `POA-EXB-001` carry unqualified **Approved** status. `POA-META-002` is Bounded Accepted (13 of 19 sections). Everything else in `GOV/` and `DECISIONS/POA-ADR-001.md` is **Accepted or Materialized — acceptance/certification pending**, and `STD-009`/`STD-011` are **Draft**. This internal status gradient does not change the *category* (A) — it changes how much weight each artifact currently carries, which §4–§6 rely on directly.

**B — Operational Runtime / Evidence**
- All of `40-Runtime/` — every `*-COMPLETION-REPORT.md`, `*-PREFLIGHT-REPORT.md`, `*-REPOSITORY-STATE-REPORT.md`, the two dossiers, the three prior `REPO-*` structural audits, `POA-MAT-001.md`, `POA-INTEGRITY-CONTROL-001.md`, and the three `POA-VIS-*-screenshots/` directories (the only binary/log content in the repository — visual-QA evidence from prior product missions).

**C — Developmental / Working Material**
- No dedicated area exists. `30-Products/poa-vis-001`'s own test files (`*.test.ts`) are ordinary software-engineering practice inside a Category D product, not independently classifiable working material.

**D — Product / Interface Material**
- `30-Products/poa-vis-001/` in full. See §7 for the important qualifier: its *stated intent* (per internal code comments — no governing document states this) is client-facing product material, but its *current maturity* is an explicitly self-labeled demo/prototype with a single hardcoded dataset and no external integration. It is D-by-intent, not yet D-by-substance.

**E — Developer Tooling / Automation**
- `.claude/launch.json`, `.claude/settings.local.json`. Nothing else in the repository qualifies — no CI/CD, no `scripts/` directory, no dispatcher artifact of any kind (§14).

**F — Experimental / Temporary**
- `bash.exe.stackdump` (root, gitignored, already root-caused).

**G — UNKNOWN**
- The "Mission Dispatcher PoC" the directive asks this assessment to consider **does not exist anywhere in this repository** — not as code, not as a stub, not as a design document. It cannot be classified because there is nothing to classify. This is reported as an absence, not forced into a category (§14, §17).

---

## 4. Current POA Core Boundary

**Where POA Core actually begins and ends today:** `00-Bootstrap/` + `10-Constitution/` + `20-Shared/` — traced by authority, not by folder name, as follows. `CONST-001` is treated as root authority by convention (every other artifact cites it; nothing supersedes it), even though the source document carries no internal Approved/Draft marker of its own. Beneath it, `ORC-001-GOV-001` is the one artifact in the whole repository with genuine, unqualified pre-existing Approved status and is the operative authority-delegation instrument (it names what the Chief Navigator & Architecture Steward — "Chief Architect" — may do, and what is reserved to Commander alone: constitutional change, new architectural layers, commercial strategy, product vision, budget, release approval). Everything else in `20-Shared/GOV/` and `DECISIONS/` either derives its authority from `ORC-001-GOV-001` directly or from a Commander/Chief-Architect ruling recorded as an addendum to it or to `POA-ADR-001`.

**Areas physically inside the repository but conceptually outside Core:** `30-Products/poa-vis-001/` (product material, verified zero-coupling, §7) and `.claude/` (machine-local developer tooling, Category E). `40-Runtime/` is a harder case: it is physically inside the repository and is *produced by* Core's own missions, but per `POA-RSR-001`'s own governing principle ("the Repository reports truth, it does not infer"), `40-Runtime` records and evidences Core state — it does not constitute Core state itself. The organizational truth lives in `10-Constitution/` and `20-Shared/`; `40-Runtime/` is the evidentiary trail proving how that truth was reached. It is Core-adjacent evidence, not Core proper — but see the bidirectional citation finding in §6, which complicates a clean split.

**Areas that appear separate but are actually required for Core authority:** the external Deployment mirror vault (outside this git repository entirely). Repeated Commander directives and Chief-Architect rulings quoted verbatim inside committed artifacts (`ORC-001-GOV-001`'s own source, the `OPV-002` Acceptance ruling, the `GCR-001` certification-activation ruling, the `TRC-002` Transition Framework and Destination Condition rulings) trace their Authority Basis to files that live in that external vault, not in this repository. The repository holds the *materialized, quoted derivative* of those rulings; the vault holds a share of the primary authority itself. This is the clearest evidence in this assessment that **POA Core as an organizational concept is not fully co-extensive with the POA-Repository git repository** (elaborated in §11).

---

## 5. Authority Analysis

Authority flows in one direction at the top and forks below:

```
Paravyoma Constitution (root, external-sourced, values-level)
        │
        ▼
ORC-001-GOV-001 (Approved — the operative delegation instrument)
        │
        ├── Chief Navigator & Architecture Steward ("Chief Architect")
        │     — operates within "approved Genesis scope"
        │     — certification authority delegated but required explicit
        │       Commander activation before use (ACS-001 GOV-005 Addendum;
        │       activated 2026-08-17 via GCR-001)
        │
        └── Commander (apex, retains reserve/escalate/override/withhold/
              revoke supremacy; sole authority over constitutional change,
              new architectural layers, Transition, commercial strategy,
              product vision, budget, release approval)
```

Every artifact in `20-Shared/GOV/` and `20-Shared/DECISIONS/` cites this chain explicitly; none claims independent authority. The one artifact that most aggressively asserts authority beyond its own status — `POA-STD-011` ("the constitutional execution protocol of POA") — is itself still Draft, never promoted, a genuine (disclosed, not concealed) tension between claimed and actual status that this assessment surfaces rather than resolves, per `CLAUDE.md` Rule 8.

`GAP-001` (`POA-PRS-001` vs. this repository's `POA-<FAMILY>-<NNN>` convention and `00-Bootstrap/…/40-Runtime` layout) remains the one item classified **HELD** rather than open — every governance artifact that touches it declines to resolve it, and `CLAUDE.md`'s own Scope Boundary reaffirms this. `PRS-001-CONFLICT-DOSSIER.md`'s finding is precise and narrower than it might first appear: the **identifier scheme** conflicts mandatorily; the **directory structure** does not (PRS-001's only binding clause is numeric ordering, which the current tree already satisfies). This matters directly for §12/§18: a topology recommendation that adds a *new* repository, rather than renaming anything inside this one, does not reopen `GAP-001`.

---

## 6. Dependency Analysis

| Relationship | Classification | Evidence |
|---|---|---|
| `10-Constitution` / `20-Shared` (POA Core) → everything else | Core → Component | Root authority; nothing in the repository claims authority independent of this chain. |
| `40-Runtime` ↔ POA Core | **Bidirectional** | Core mechanisms (`POA-RSR-001`, `POA-EXB-001`) define what Runtime must produce (Core → Runtime). But `ESR-001-COMPLETION-REPORT.md` §5/§6 found six specific `40-Runtime` files are named directly in committed Core artifacts' formal Evidence Basis fields (e.g. `POA-STD-009.md` cites `GOV-010`'s reports; `POA-ADR-001.md` cites `GOV-012`/`GOV-013`/`GCR-001` reports) — meaning specific Runtime evidence is load-bearing *for* Core's own committed authority (Runtime → Core). This bidirectionality is exactly why POA had to invent the Authority-vs-Provenance distinction (`ESR-001`, `GOV-015`) rather than treat all of `40-Runtime` as one uniform category. |
| `30-Products/poa-vis-001` → POA Core | **Independent today; Component→Core by declared design intent** | Zero code-level coupling verified by direct grep: no reference anywhere in `src/` to `20-Shared`, `40-Runtime`, `10-Constitution`, or `00-Bootstrap`; no path traversal outside its own `src/`; no `fetch`/`axios`/network calls; no `process.env` usage. All organizational data is one hardcoded file (`src/lib/data/demo-organization.ts`) whose own header states it is "THIS IS DEMONSTRATION DATA, not real organizational data... written to be trivially replaceable by a repository-backed store, database, or API in a future mission." The dependency is real in intent and absent in fact — both halves matter: claiming plain "Independent" understates the design intent; claiming "Component→Core" today overstates what the code actually does. |
| `.claude/` (Developer Tooling) → POA Core | Independent | No file in `.claude/` is cited by, or cites, any governance-authority field. `settings.local.json`'s allowlist scopes tool permissions to this repository's own path; `launch.json` merely launches the product app's dev server. Operational convenience, not authority coupling. |
| External Deployment mirror vault → committed repository artifacts | Core-input → Component (reversed direction from the table above) | The vault holds primary Commander-directive and mission-brief text; the repository holds materialized, quoted derivatives of it. See §4, §11. |

No APIs or interfaces were designed in producing this table — only dependency direction, per §7's own instruction.

---

## 7. Dashboard / Project Analysis

`30-Products/poa-vis-001/` is a Next.js 16 / React 19 / Tailwind web application, 65 tracked files, tested with Vitest.

**What it contains:** a presentation shell (`AppShell`, `ExecutiveBriefing`, `MissionConsole`, `OrganizationHealth`, `OrganizationalSignals`, `ProjectOverview`, `ActivityStream`, `CapabilityStatus`); a pluggable visual-theming layer (`src/lib/expression/` — `registry.ts`, `profiles.ts`, `visual-dna.ts`, `mothership-mapping.ts`, `network-mapping.ts`) explicitly designed so that, per its own code comment, "POA Core... never needs to change" when a new visual profile is added; a deterministic (non-LLM) Q&A engine (`src/lib/alexis/`) whose own header states "This is NOT a chatbot — every sentence... is generated from real fields on the current state, and every answer carries `sources`"; a browser-only Web Speech API wrapper (`src/lib/voice/`); and a domain/services layer (`src/lib/services/` — capability, opportunities, recommendations, relationships, risk, signals) that computes derived organizational intelligence purely in-memory, with no I/O.

**Does it contain authoritative POA material?** No. All organizational data is synthetic, confined to one file, and explicitly labeled as demonstration data.

**Does it directly modify Core artifacts?** No — confirmed by direct grep; no filesystem write path touches anything outside `30-Products/poa-vis-001/`.

**Is it currently a prototype, product, interface, or architectural component?** All at once, in different senses, and the report does not force a single answer: it is architecturally structured *as if* it were a product (real component boundaries, a real test suite, an enforced internal Core/Expression-Layer separation per `ADR-003` — see the important terminology note below), but its actual current substance is a prototype/demo with one hardcoded dataset and no external integration.

**What would it require to become a future client-facing platform?** Per its own `package.json`, it currently has no backend framework, no database client, no authentication library, and no external API integration of any kind. Becoming client-facing would require, at minimum, all of these — none of which exist today even in stub form. This assessment does not design them (§7, §9 of the directive both forbid it); it reports their absence.

**Should it remain in the Core repository, or become independent?** See §15/§18 — the evidence supports eventual separation, not immediate separation.

**Important terminology note carried into §13:** `src/lib/expression/expression-boundary.test.ts` and `ADR-003-Expression-Architecture-Boundary.md` already use the term **"POA Core"** for a boundary *internal to this one application* — its own domain layer versus its own presentation/Expression layer — a boundary already Accepted by Commander decision (scoped only to `POA-VIS-003`). This is a distinct usage from "POA Core" as used throughout the rest of this report (the authoritative organizational repository material). The two must not be conflated when any future topology decision is made — see Open Architectural Questions, §20.

Governance documentation gap, noted but not corrected (out of scope — read-only): none of `CLAUDE.md`, `AGENTS.md`, or `README.md` inside `poa-vis-001` state the application's purpose, scope, or relationship to POA Core. `CLAUDE.md` there is an 11-byte pointer to `AGENTS.md`; `AGENTS.md` is Next.js's own auto-generated boilerplate; `README.md` is the unmodified `create-next-app` template. All actual scope/boundary intent for this application currently lives only in source-code comments and in `ADR-003`, not in any of the three files a reader would normally check first.

---

## 8. Future Beta Boundary

The directive lists a long set of future-beta concerns (client-facing users, UI, dashboard, text/voice/visual interaction, authentication, application services, integrations, APIs, external systems, tenant/client data, product configuration, operational data) and asks which conceptual bucket each belongs to. This assessment answers only what current evidence supports and marks the rest `TBD — requires architectural decision`, per `CLAUDE.md` Rule 7 — inventing specifics here would itself be beta-system design, which §9 of the directive explicitly forbids.

- **UI, dashboard, text interaction, visual interaction** → **POA Platform**. A concrete (prototype-stage) instance already exists (`poa-vis-001`).
- **Voice interaction** → **POA Platform**, prototype-stage (`src/lib/voice/`, browser-only today).
- **Authentication, application services, integrations, APIs, tenant/client data, product configuration, operational data, external systems** → **TBD — requires architectural decision.** None currently exist in any form, not even a stub or a named dependency in `package.json`. This assessment does not assign them to Platform, External Infrastructure, or Core by default; doing so without evidence would be exactly the kind of invented policy `CLAUDE.md` Rule 7 forbids.

---

## 9. Privacy / Exposure Assessment

- **Git remote:** `origin` → `https://github.com/SalluHunk/POA-Repository.git`. **Visibility (public/private) cannot be determined from git metadata alone** and was not checked further (out of this assessment's read-only repository scope). Given that this repository contains the full Constitution text, Commander rulings, certification/authority chains, and an internal gap register, **this is flagged as an open item requiring direct confirmation** (§20) — its answer materially changes the stakes of every other finding in this section.
- **Filename-pattern secret scan** (`*.env*`, `*secret*`, `*credential*`, `*password*`, `*.pem`, `*.key`, `*token*`, excluding `node_modules/` and `.git/`): **zero matches.** No potential secret/configuration exposure detected by filename anywhere in the repository.
- **Tracked vs. ignored build output:** `30-Products/poa-vis-001/node_modules/` and `.next/` exist on disk but are correctly excluded from git tracking by that app's own nested `.gitignore` — verified directly via `git ls-files 30-Products` (65 files, none under `node_modules` or `.next`).
- **Repo-root `.gitignore`** (full contents, reproduced as it contains no sensitive values): excludes `*.stackdump` (a documented, already-root-caused Git-Bash crash artifact) and `/50-Deployment/` (a local mirror folder that does not currently exist in this checkout).
- **Client/tenant information:** none found — the only organizational data anywhere in the repository is `poa-vis-001`'s explicitly-labeled synthetic demo dataset.
- **No secret, token, password, API key, private key, or connection-string value is reproduced anywhere in this report,** per the mission's Security rule.

---

## 10. Git Integrity Assessment

- **Current branch:** `main`. **HEAD:** matches `origin/main` exactly (`git rev-list --left-right --count main...origin/main` → `0  0`).
- **Remote:** `origin` → `https://github.com/SalluHunk/POA-Repository.git` (fetch and push identical).
- **Working-tree state:** no modified tracked files. **38 untracked files**, all confined to `40-Runtime/`.
- **Whether local HEAD matches remote:** yes, exactly, with zero divergence in either direction.
- **Whether there are uncommitted changes:** no modifications to tracked content; only new, untracked files (see below).
- **Whether ignored files appear to contain important POA material:** no — the only gitignored content found is a crash-artifact file and third-party build output, both already accounted for above.
- **Whether repository history reveals an existing architectural split:** no evidence of a prior split or de-merge was found in the commit history reviewed; the single-repository structure appears to have held since `POA-REPO-001`'s original bootstrap.

**On the 38 untracked files — this is not a git-hygiene defect; it is a deliberate, ruled-on retention policy, and reporting it as sloppiness would misrepresent an accepted governance decision.** `ESR-001-COMPLETION-REPORT.md` (2026-08-17) found POA's prior "uncommitted mission evidence" state (then 37 files + 1 modified tracked file) was caused by a genuine **Evidence Model Gap** — no rule existed for which mission evidence must be authoritative versus may legitimately remain working-tree-only. The Chief Architect then ruled (recorded as the ESR-001 Evidence Retention Decision Record, appended to `POA-ADR-001.md`): *"POA shall distinguish Authority from Provenance. Authority-bearing evidence must be retained authoritatively... Mission reports and other provenance artifacts do not automatically require authoritative repository synchronization merely because they document execution or reasoning behind an outcome already represented authoritatively."* Commit `e691d15` ("ESR-001: Synchronize the nine Authority-bearing evidence artifacts...") then executed exactly the selective synchronization that decision authorized. The 38 files currently untracked are the remaining, deliberately Provenance-classified set — their operative conclusions are already restated inline in committed governance text, satisfying `POA-EVID-001`'s existing reproducibility rule.

One narrower, still-open exception exists: `COMMANDER-TRANSITION-CASE-REVIEW-REPORT.md` (2026-08-19/20) found that three specific files — `TRC-002-COMPLETION-REPORT.md`, `DRA-001-COMPLETION-REPORT.md`, and `TRC-002-COMMANDER-DECISION-DOSSIER.md` — are cited by name in committed Decision Records' own Related Evidence fields, which under ESR-001's own Authority-bearing test makes them Authority-bearing *for those specific citations*, independent of their earlier Provenance-only classification for their own mission-report role. This is exactly why that review's Criterion 6 (Retention and reconstructability) is marked **PARTIAL** rather than satisfied, and exactly why its overall conclusion is **TRANSITION DEFERRED** rather than approved. This assessment does not close that gap (doing so would require a commit, which RSM-001's own §22/§23 forbid) — it reports the gap's existence and its precise cause, because it is directly relevant to any future decision about what must move together if a repository split is later authorized (§16).

**Confirmation required by §11 of the directive:** No git operation of any kind that mutates repository state was executed during RSM-001. No tracked file was modified, moved, renamed, or deleted. The sole filesystem change made by this mission is the creation of this report, which is itself untracked pending its own future retention determination under the same Authority-vs-Provenance principle described above.

---

## 11. Repository vs Organizational Boundary

`POA Core = POA Core repository` is **mostly, but not exactly, true today** — and the direction of the exception matters. It is not that Core spans *multiple git repositories*; it is that a meaningful share of Core's own *primary* authority — the actual Commander directive text, mission briefs, and rulings that this repository's committed artifacts quote and derive from — exists only in the external Deployment mirror vault, never committed to this repository at all. `ORC-001-GOV-001` itself (the one document in this repository with genuine unqualified Approved status) is a verbatim reproduction of an external source `.docx`. The `OPV-002` acceptance ruling, the `GCR-001` certification-activation ruling, and the entire `TRC-002` Transition Framework / Destination Condition chain are each recorded in this repository only as **quoted derivatives** of directives that live in the vault.

This means: for the specific artifacts this assessment reviewed, the repository is a faithful, reproducible *record* of Core decisions, but is not itself the exhaustive *seat* of Core authority. A future repository-boundary decision should treat this as a known, standing condition, not as something RSM-001 needs to fix — but it directly informs Open Architectural Question #4 (§20): should that external vault eventually be brought under the same version-control discipline this repository already applies to everything else?

Separately, and by contrast: `30-Products/poa-vis-001` is verified to be **exactly** repository-bounded — nothing about it exists or is authoritative outside its own tracked files. Its boundary and the git repository's boundary for that subtree are identical.

---

## 12. Future Repository Topology

Based on the evidence gathered (not the directive's own illustrative diagram, which is explicitly offered only as a hypothesis to test):

```
POA CORE  (00-Bootstrap, 10-Constitution, 20-Shared, 40-Runtime)
    │
    ├── Constitution & governance decisions (10-Constitution, 20-Shared)
    ├── Mission/evidence trail (40-Runtime)
    │     — kept WITH Core, not split out, because specific Runtime
    │       files are load-bearing citations inside committed Core
    │       artifacts' own Evidence Basis fields (§6's bidirectional
    │       finding) — splitting them would break reproducibility
    │       unless duplicated or transformed, which itself requires
    │       a fresh authority/provenance ruling under POA-EVID-001
    └── Bootstrap record (00-Bootstrap)

POA PLATFORM  (30-Products/poa-vis-001, and any future sibling products)
    │
    ├── Client UI / dashboard / voice / text interaction
    └── Product services (currently: demo-data-only, no auth, no API)
```

**No third topology tier ("Developer / Execution Tooling") is supported by current evidence** — see §15. The directive's own instruction ("do not assume three repositories are required... recommend the minimum separation necessary") is decisive here: a Repository C candidate would today contain only two small JSON configuration files with no CI, no scripts, and no automation artifact of any kind. There is nothing to migrate into it.

---

## 13. Authority Direction

The directive asks whether **"Client-facing software consumes POA capabilities but does not become authoritative over POA Core"** is supported.

**Supported, on all current evidence — but trivially so, because it has not yet been tested under real coupling.** Every fact in §6/§7 is consistent with this principle: zero write paths from `poa-vis-001` into any Core directory; the product's own data-access seam is explicitly designed to be swapped for "a repository-backed store... in a future mission" (i.e., a future one-way read, not a write); and the app's own internal `ADR-003` boundary test already enforces a Core/Expression separation *within* itself. But none of this has been exercised against a live dependency yet — the principle is currently satisfied by absence of integration, not by a tested, enforced boundary mechanism. Whether it survives the first real integration is an open question this assessment cannot answer without seeing that integration built, which is explicitly out of scope here.

The second stated relationship — **Developer Tooling ↕ POA Core (bidirectional)** — is also supported: `.claude/settings.local.json`'s permission allowlist operates on the repository (reads/writes/executes within it), and the repository's own `CLAUDE.md` governs what tooling may do — a genuine two-way operational relationship, though not an authority relationship (tooling does not assert organizational truth; see Category E, §3).

---

## 14. Beta Repository Isolation Analysis

Evaluated against each named criterion, on current evidence only:

| Criterion | Finding |
|---|---|
| Security | No secrets, credentials, or client data exist in the repository today (§9); isolating the product does not currently reduce or increase exposure, because there is nothing sensitive in the product subtree to isolate. |
| Privacy | The governance/Constitution material (`10-Constitution`, `20-Shared`) is the sensitive content in this repository, not the product. Isolating the product does not address the actual privacy question, which is the parent repository's own GitHub visibility (§9, unresolved). |
| Authority | Fully separable today — zero authority coupling either direction (§6, §13). |
| Deployment lifecycle | The product has its own independent build/deploy surface (Next.js, its own `package.json`, its own dev-server config in `.claude/launch.json`) already decoupled from the governance material's lifecycle (which has no build/deploy step at all — it is documents, not software). |
| Client exposure | Not yet applicable — no client-facing deployment exists yet (demo-only, local dev server). |
| Development velocity | A future team iterating on the product would currently gain nothing from separation, since there is no shared build tooling, shared dependency graph, or shared CI to conflict over — none of those exist yet in either subtree. |
| Dependency management | Already effectively separate (`poa-vis-001` has its own `package.json`/`package-lock.json`; the governance material has no dependency graph at all). |
| Release lifecycle | Not yet applicable — no release process exists for either subtree. |
| Team access | Cannot be assessed from repository evidence alone — GitHub-level access control was not reviewed (out of scope for a read-only repository-content assessment). |
| CI/CD | None exists for either subtree (§9's `.github/` check: absent entirely). |
| Rollback | Git history is currently shared/interleaved between governance and product commits in one repository; separating now, while history is still small, is cheaper than separating later. |
| Auditability | Currently trivial either way — one small, clean, linear history. |
| Future commercialization | The product is the only subtree with any commercialization relevance; keeping governance material out of a future public/commercial product repository is the clearer privacy posture once the product moves beyond demo stage. |

**Finding, not preference:** the criteria that actually discriminate today are *auditability-while-small* and *future commercialization exposure* — both favor eventual separation, and both favor doing it **early, while it is cheap**, rather than later. Every other criterion is currently a wash because neither subtree has matured enough (no CI, no deployment, no client exposure, no dependency conflicts) for separation to matter operationally yet. This points toward **Option C (separate repository under the same organizational workspace)** as the directionally-supported *future* answer — not Option A (same repository, indefinitely) and not a currently-executable Option B/D distinction, since nothing about deployment or team structure yet forces the sharper edges Option B implies. This is not a recommendation to act now (§15, §19) — Transition remains DEFERRED and no such migration is authorized by this report.

---

## 15. Migration Risk Analysis

*If* separation is later authorized:

- **Must remain Core:** `10-Constitution/`, `20-Shared/` in full, `00-Bootstrap/` (historical record), and the specific `40-Runtime` files named in committed Core artifacts' Evidence Basis fields (the nine files synchronized under `ESR-001`, plus the three files currently PARTIAL under the Transition Case Review's Criterion 6 — see §10).
- **May move:** `30-Products/poa-vis-001/` in full — self-contained, zero verified dependency in either direction.
- **Require duplication:** none identified — no artifact today is simultaneously needed, unmodified, in both a future Core repository and a future Platform repository.
- **Require transformation:** none identified today, precisely because there is no live coupling to transform.
- **Must never be duplicated:** Constitution and governance-decision text — forking it across two repositories would create exactly the single-source-of-truth risk `POA-EVID-001`'s reproducibility rule exists to prevent.
- **Dependency risks:** low today; the entire risk is prospective — if `poa-vis-001` is later wired to read live Core data (its own stated future intent), that dependency must be designed as one-way (Component→Core read-only) before separation, or separation later becomes much more expensive.
- **Git history concerns:** the product subtree's commit history is currently interleaved with governance commits in one linear history. Extracting it into a new repository while preserving authorship/provenance would require a history-preserving extraction (e.g. a filtered subtree export), not a plain copy — a real decision, not a mechanical step, and one this assessment does not perform or design.
- **Provenance / synchronization / authority concerns:** covered in full in §6, §10, §11 above — the load-bearing finding is that `40-Runtime`'s Authority-bearing subset is genuinely coupled to committed Core artifacts and cannot be silently left behind or duplicated without a fresh `POA-EVID-001` determination.
- **Privacy concerns:** the unresolved GitHub-visibility question (§9) should be answered *before*, not after, any repository-creation step, since it changes what "separation" is even solving for.

No migration was performed. This section identifies risk only, per §16 of the directive.

---

## 16. Automation Ownership Analysis

The directive asks where "the Mission Dispatcher PoC and future ChatGPT/Claude/Codex workflow" should conceptually live. The evidentiary answer is that **there is currently nothing to place**: a repository-wide search for "dispatcher," "Mission Dispatcher," "ChatGPT," and "Codex integration" returned zero matches anywhere in the repository; no `.github/` directory exists; no `scripts/` directory exists at the repository root or elsewhere (the only `scripts/` hits found are third-party npm package internals inside `node_modules`, not repository-authored automation).

The only automation-adjacent material that exists at all is `.claude/launch.json` (a single VS Code debug configuration that runs the product's own `npm run dev`) and `.claude/settings.local.json` (a tool-permission allowlist, no hooks, no execution logic). Neither constitutes a dispatcher, an orchestrator, or a CI/CD mechanism. `20-Shared/KER/POA-KER-001.md` (Execution System Architecture) is the closest *conceptual* definition of where execution automation ownership would sit — it already describes a Repository Orchestrator / Mission Analyzer / Execution Kernel model — but this is an architectural specification for a capability that has not been materialized as the Mission Dispatcher the directive names.

**Conceptual ownership, marked accordingly:** if and when a Mission Dispatcher is materialized, `POA-KER-001`'s existing execution-system model is the natural architectural home for *deciding* how it should work — but *where its code should live* (Core, Platform, a future Repository C, or External CI/CD) is `TBD — requires architectural decision`, per `CLAUDE.md` Rule 7. This assessment does not narrate an architecture for something that does not yet exist as an artifact.

---

## 17. Recommended Target State

**Two repositories, not three, on current evidence:**

- **Repository A — POA Core.** Purpose: authoritative organizational source of truth. Contents: `00-Bootstrap`, `10-Constitution`, `20-Shared`, `40-Runtime` (kept together per §12's reproducibility finding).
- **Repository B — POA Platform.** Purpose: client-facing/product/application layer. Contents: `30-Products/poa-vis-001` and any future sibling products.
- **No Repository C (Developer/Execution Tooling) is recommended.** The evidence does not support a third repository: the entire current tooling surface is two small local-configuration files with no CI, no scripts, and no dispatcher artifact. Recommending a repository for material that does not yet exist would violate the directive's own "minimum separation necessary" instruction. If a genuine automation surface is later materialized (§16), this question should be reassessed then, on real evidence — not pre-built now.

This target state is a hypothesis for a *future* decision, not an action taken by this mission.

---

## 18. Recommended Migration Sequence

Conceptual only, consistent with §19 of the directive, and gated by the open items in §20:

```
This Assessment (RSM-001)
        ↓
Boundary acceptance (Chief Architect / Commander review of this report)
        ↓
Resolution of blocking prerequisites (§20: Transition Criterion 6 closure,
   GAP-001 status confirmation, GitHub visibility confirmation)
        ↓
Repository snapshot
        ↓
Target repository creation (Repository B only, per §17)
        ↓
Artifact classification (confirm §15's move/remain lists against the
   repository state at that future time, not this report's snapshot)
        ↓
Migration (history-preserving extraction of 30-Products/poa-vis-001)
        ↓
Dependency repair (none currently anticipated, per §6's zero-coupling
   finding — to be re-verified at migration time)
        ↓
Integrity validation
        ↓
Authority validation
        ↓
Beta development (separately authorized, not granted by this sequence)
```

No step in this sequence has been executed. No migration occurs in RSM-001.

---

## 19. Explicit Non-Goals

RSM-001 does not authorize, and this report does not perform: repository split; repository creation; file movement; dashboard migration; API creation; beta architecture; making the repository public; automation implementation; Mission Dispatcher implementation; ChatGPT/Claude/Codex integration; GitHub Actions or other CI/CD changes; any POA architectural change; any rename, move, or restructuring of any existing repository identifier or directory (independently forbidden while `GAP-001` remains HELD); any commit, push, pull, merge, rebase, or branch alteration; any modification to `.gitignore`, Git configuration, or remotes.

---

## 20. Open Architectural Questions

1. **"POA Core" is used with two different meanings in this repository today** — the repository-wide organizational-authority sense used throughout this report, and the narrower intra-application domain-vs-Expression-Layer sense already established by `ADR-003` inside `poa-vis-001` itself. Any future topology decision needs to disambiguate these explicitly (e.g., rename one usage) before it can be stated precisely — this report has not renamed anything, consistent with §22, but flags the collision.
2. **`GAP-001` (`POA-PRS-001` identifier-scheme conflict) remains HELD.** It does not block creating a new repository, but it does block reshaping this repository's existing identifiers/layout as part of any migration — a real constraint on *how* Repository A could ever be reorganized internally, separate from whether Repository B is created.
3. **The Commander Transition Review is DEFERRED, not approved, with one specific, narrow, already-identified closure path** (committing or inline-restating three named files, per `COMMANDER-TRANSITION-CASE-REVIEW-REPORT.md` §6). Should that closure happen independently of, before, or regardless of any future repository-topology decision? This report treats them as separate questions but notes they are procedurally adjacent — both are Commander-reserved.
4. **Should the external Deployment mirror vault itself eventually come under version control**, given how many committed rulings cite it as their Authority Basis (§11)? This assessment surfaces the dependency; resolving it is a distinct governance question this mission was not authorized to decide.
5. **GitHub repository visibility (public/private) was not determinable from git metadata and was not otherwise checked.** This is the single fact most likely to change the real-world stakes of §9's findings and should be confirmed directly before any further exposure-sensitive decision is made.
6. **Repository C (tooling) has no evidentiary basis today.** If a Mission Dispatcher or comparable automation artifact is ever materialized, this question should be reopened on that evidence — not answered speculatively now.

---

## 21. Recommendation for Next Mission

Given that (a) the Commander Transition Review currently resolves to **DEFERRED**, not approved, with a narrow and already-identified closure path, and (b) `GAP-001` remains **HELD**, this assessment recommends against proceeding directly to a repository-splitting mission next. The evidence-supported next steps, in order of how directly they unblock everything else:

1. **Closure of the Transition Case Review's Criterion 6 gap** (Commander/Chief-Architect decision to commit, or inline-restate, the three files named in `COMMANDER-TRANSITION-CASE-REVIEW-REPORT.md` §6) — a small, already-scoped, low-risk action with a clear owner and a clear test for "done."
2. **Direct confirmation of the GitHub repository's visibility setting** — cheap to obtain, and materially changes the urgency of everything in §9.
3. Only after (1) and, separately, a dedicated `GAP-001`-resolution mission (if a future migration is ever to touch this repository's own identifiers) — a **"Boundary Acceptance"** mission, per §19's own sequence, in which Chief Architect / Commander formally accept or amend this report's Repository A / Repository B hypothesis, before any repository is actually created.

RSM-001 itself stops here, per §23. No further action was taken by this mission beyond producing this report.

---

**RSM-001 COMPLETE — STRICT READ-ONLY MAINTAINED THROUGHOUT — NO REPOSITORY MUTATION OTHER THAN THE CREATION OF THIS FILE — RETURNED FOR CHIEF ARCHITECT / COMMANDER REVIEW — NO MIGRATION, NO BETA DEVELOPMENT, NO SECOND REPOSITORY, NO AUTOMATION IMPLEMENTATION AUTHORIZED BY THIS MISSION.**
