# POA-LIFECYCLE-LEDGER-001 — Execution Record (Lifecycle Ledger, Read-Only Derivation)

**Mission:** `POA-LIFECYCLE-LEDGER-001` · **Date:** 2026-10-02 · **Executor:** single agent (Sonnet 5.5)
**Status:** **EXECUTED — AWAITING COMMANDER ACCEPTANCE.** This record does not accept, close or certify the mission (R-A.3, R-A.4). No Acceptance Record exists yet.
**Boundary:** `40-Runtime/POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE.md` (ratified; the complete execution boundary).
**Binding limitation (Commander):** "The ledger is an observation of repository evidence, not a reconstruction of organizational reality."

## 1. Identity and authority

- Authorizing record: `20-Shared/DECISIONS/POA-ADR-001.md`, heading "POA-LIFECYCLE-LEDGER-001 — Lifecycle Ledger (Read-Only Derivation) Mission Ratification Decision Record (2026-10-02)", with the standing record "Execution Architecture Standing Rulings R-A, R-B, R-C — Decision Record (2026-10-02)". Both committed; the mission record in `d425ba69208155eb363dfa230a9a56a577925aba` (present at HEAD before work began, SC-7 verified).
- Mission Package: `40-Runtime/POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE.md` (same commit). Commander rulings D-1…D-5 are recorded in it.
- Commander commencement instruction (quoted): "I hereby authorize commencement of POA-LIFECYCLE-LEDGER-001 as ratified in the committed ADR-001 record at d425ba69208155eb363dfa230a9a56a577925aba. The mission may now execute strictly within the ratified Mission Package boundary."
- R-1/Q6 untouched; `60-Organization-A/` and `POA-PJR-00x` not accessed; no successor mission authorized.

## 2. Starting state

HEAD `d425ba69208155eb363dfa230a9a56a577925aba`, branch `main`; local `origin/main` `d19d18f`, HEAD 32 ahead (no fetch). Staged: none. Modified tracked: `CLAUDE.md` only (pre-existing, not touched). Untracked entries outside any `60-*` path: 163 at start (including the untracked proposed-ADR-record draft). Baseline in `50-Mothership/`: `npm test` 12 files, **241 passed**, 1 todo; `npm run typecheck` clean.

## 2a. Ending state

After the single bounded local commit, HEAD is the implementation commit and its parent is `d425ba69208155eb363dfa230a9a56a577925aba`. Nothing is pushed. A commit cannot cite itself (R-A.4(b)); retrieve its SHA with `git log -1 --format=%H -- 50-Mothership/src/lifecycle-ledger.ts`. Modified tracked `CLAUDE.md` remains unstaged and uncommitted.

## 3. Execution profile — declared vs actual

| Field | Declared (envelope) | Actual |
|---|---|---|
| Models | Sonnet 5.5 | Sonnet 5.5 (stated by the environment) |
| Agent count | 1 | 1 — no sub-agent was spawned |
| Effort | HIGH | `UNKNOWN` — not observable by the agent |
| Ownership | `fileOwnership: null` | n/a (single agent) |

## 4. Files changed vs allowlist

Committed set (exactly the package §4 allowlist, 20 files; nothing else is staged):

- `50-Mothership/src/lifecycle-ledger.ts` (A-1, pure core) and `50-Mothership/src/lifecycle-ledger-git.ts` (A-2, pinned-blob reader + CLI)
- `50-Mothership/test/lifecycle-ledger.test.ts` (A-3)
- `50-Mothership/test/fixtures/lifecycle-ledger/**` — 14 synthetic fixtures + `manifest.json` (A-4)
- `40-Runtime/POA-LIFECYCLE-LEDGER-001-LEDGER.md` (A-5, the one derived record)
- `40-Runtime/POA-LIFECYCLE-LEDGER-001-EXECUTION-RECORD.md` (A-6, this file)

Subset/equality statement: the staged set equals the union of these entries (V-5, §10). Untouched: the Lifecycle Verifier (source, test, fixtures — asserted by test), `index.ts`, `package.json`, lockfiles, every existing test, ADR-001, `POA-STD-011`, `POA-ACC-001`, `CLAUDE.md`, `60-Organization-A/`.
Effort envelope (SC-11, `wc -l`): sources 145 + 84 = **229 lines** (≈250 proposed; trigger >375); **3** source/test files (A-1, A-2, A-3; limit 3); **14** synthetic fixture cases (limit 20); one bounded commit; no new dependency; test file 230 lines.

## 5. Commands and results (reproducible)

| Command (cwd `50-Mothership/`) | Result |
|---|---|
| `npm test` (before) | 12 files, 241 passed, 1 todo |
| `npx vitest run test/lifecycle-ledger.test.ts` | 28 passed |
| `npm test` (after) | **13 files, 269 passed**, 1 todo — +28 tests; no existing test modified |
| `npm run typecheck` (before and after) | clean (`tsc --noEmit`) |
| `npx tsx src/lifecycle-ledger-git.ts --pin f78dea2b2fdb3da71bbd15b16e5b0a356cbc2ccc --repo ..` (twice) | exit 0 both; stdout byte-identical (`cmp`); stdout SHA-256 `6bcd6f44f62a35c6127584816726fa30dfeac327546e5d07934286bf0aa9dd11` |
| `npx tsx src/lifecycle-verifier-git.ts --package 40-Runtime/POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE.md --mode pre-commit --repo ..` | §10 |
| same, `--mode post-flight --baseline d425ba69208155eb363dfa230a9a56a577925aba` | §10 |

## 6. Content hashes

Sources read at the pin (also in the ledger's `sources`):

- `20-Shared/DECISIONS/POA-ADR-001.md` — SHA-256 `3e1c1330104b4a05072f3e3b73ee43b32ba2c683672ed107c9eb4cd4dbf86111`, 252403 bytes
- `40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md` — SHA-256 `88ac655119c7fce372de9867a22fd93e7b14eca495c392c5dc1f8ae9cc3c2c4c`, 17518 bytes
- `40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md` — SHA-256 `c163c03b10f3201e99e5cea26a8060cd5186419f98e3eab36a459f942a0e4a92`, 24211 bytes

Fixture hashes: §7. `manifest.json` SHA-256 `4d1525e937b136a0150cf66ccd87337da46675c21d73690d30e803d322aef740`. Ledger stdout SHA-256: `6bcd6f44f62a35c6127584816726fa30dfeac327546e5d07934286bf0aa9dd11`.

## 7. Evidence EV-1 — Case ledger (fixture expectation vs actual)

| Case | Fixture | SHA-256 (12) | Expected | Actual | Result |
|---|---|---|---|---|---|
| L01 | `L01-full-lifecycle.json` | faa380c1d30d | ok; 23 path assertions | ok; 23/23 matched | PASS |
| L02 | `L02-no-acceptance-heading.json` | 0b1797488b8d | ok; 3 path assertions | ok; 3/3 matched | PASS |
| L03 | `L03-sha-blank.json` | f6acb0eb7bbf | ok; 2 path assertions | ok; 2/2 matched | PASS |
| L04 | `L04-package-not-allowlisted.json` | 80d66d761f02 | ok; 5 path assertions | ok; 5/5 matched | PASS |
| L05 | `L05-package-absent-at-pin.json` | 20267fb53dab | ok; 2 path assertions | ok; 2/2 matched | PASS |
| L06 | `L06-record-missing-sections.json` | ff7676f4e9df | ok; 1 path assertions | ok; 1/1 matched | PASS |
| L07 | `L07-execution-record-absent.json` | 5e53f55388db | ok; 5 path assertions | ok; 5/5 matched | PASS |
| L08 | `L08-sha-not-in-record-history.json` | 5593d94c5e50 | ok; 2 path assertions | ok; 2/2 matched | PASS |
| L09 | `L09-index-rows-and-fences.json` | 6bbfce8d09da | ok; 3 path assertions; 2 absent-text | ok; 3/3 matched | PASS |
| L10 | `L10-missing-heading.json` | 61a2f89e9f68 | refused MISSING_HEADING | refused MISSING_HEADING | PASS |
| L11 | `L11-pin-not-ancestor.json` | 26c450134a09 | refused PIN_NOT_ANCESTOR_OF_HEAD | refused PIN_NOT_ANCESTOR_OF_HEAD | PASS |
| L12 | `L12-output-validation-rejects.json` | fdaeebc5317a | refused OUTPUT_VALIDATION_REJECTED | refused OUTPUT_VALIDATION_REJECTED | PASS |
| L13 | `L13-malformed-and-pin-not-last.json` | a9c3b6b37756 | refused MALFORMED_INPUT | refused MALFORMED_INPUT | PASS |
| L14 | `L14-pin-not-last.json` | d1e23fce340a | refused PIN_NOT_LAST_IN_HISTORY | refused PIN_NOT_LAST_IN_HISTORY | PASS |

**Ledger: 14/14 pass** (SHA-256 shown to 12 hex digits; reproducible with the harness in `lifecycle-ledger.test.ts`).

## 8. Evidence EV-2 and EV-3 — tests and invariants

EV-2: §5. EV-3 (asserted in `lifecycle-ledger.test.ts`): the core is pure; two derivations are byte-identical and keys are sorted; no timestamp appears; `authoritative:false`, `authorizationImplied:false`, `derivedObservation:true`, `writes:[]` on every ledger; the input is not mutated; the core refuses 18 hostile inputs without throwing; the output-validation gate rejects an allowlisted heading carrying over-long free text (`OUTPUT_VALIDATION_REJECTED`); excluded headings contribute no text (fixture L09 plants distinctive excluded text and asserts it is absent).

## 9. Evidence EV-4 and EV-6 — mechanical guards and pin evidence

EV-4: static guard test over both sources — no write-capable API; no file-read API (`node:fs` is not imported by either source); no network/model token; no git write-verb literal; no forbidden name; no path literal other than the three package sources; imports limited to `./lifecycle-verifier` (only `REQUIRED_RECORD_HEADINGS`), `./lifecycle-verifier-git` (only `assertAllowedGit`), `./lifecycle-ledger` and `node:` modules; the core has no clock, randomness, `process` or `node:`; every git call passes the verifier's unmodified `assertAllowedGit`; `index.ts` and `package.json` do not mention the ledger; the Lifecycle Verifier files have no diff against HEAD. Guard negative control: seven planted violations are all detected. `git diff --cached --name-only` equals the §4 allowlist (§10).
EV-6: the pin is a 40-hex commit that is an ancestor of HEAD; refused otherwise (tested: non-40-hex, unknown commit, pin not in the ADR history). Every source read is `git show <40-hex>:<path>` for the three paths; tests prove the output is unchanged by later commits and by uncommitted working-tree edits.

## 10. Evidence EV-5 and EV-8 — read-only run, ledger and verifier reports

**EV-5, real repository.** Snapshot before and after both ledger runs (HEAD, `.git/index` bytes, `git status --porcelain`, `git diff HEAD`):

    HEAD d425ba69208155eb363dfa230a9a56a577925aba
    index_sha256 b53c3bfc4d0d7b28605a258f8e213201a53594eb468f7de5cd5dbf3cf29c3477
    status_sha256 2b0901a70e89519f5256fdcea9f7285f031d0e5d5e089ec1afcd7d75b5892d08
    tracked_diff_sha256 9299d938fa7166ce133223a1b61724dac0a96ff31a67e7bf449066834409c291

After both runs: **identical** (`cmp` of the snapshots).

**EV-8, the ledger** is the committed record `40-Runtime/POA-LIFECYCLE-LEDGER-001-LEDGER.md` (JSON block = stdout verbatim; SHA-256 above). Summary: 38 H1 headings in the pinned ADR-001; 4 derived rows; 34 index-only rows (ordinal + heading hash only); `unknownCounts` NOT_PRESENT 21, NOT_EVIDENCEABLE 2, NOT_IN_ALLOWLIST 0, PRE_R_A 6; the `POA-SEA-IMPL-001` row evidences RATIFIED, MATERIALIZED and ACCEPTED.

**Verifier, pre-commit mode against this mission's own §18 envelope** (all 20 files staged; this record already staged), unmodified verifier:

```json
{
  "report": {
    "verifierVersion": "0",
    "mode": "PRE_COMMIT",
    "checks": [
      {
        "id": "V-1",
        "status": "PASS",
        "detail": "envelope and facts are well-formed"
      },
      {
        "id": "V-2",
        "status": "PASS",
        "detail": "authorization heading committed at HEAD, ancestry confirmed, file clean"
      },
      {
        "id": "V-3",
        "status": "PASS",
        "detail": "package committed at HEAD and clean"
      },
      {
        "id": "V-4",
        "status": "PASS",
        "detail": "allowlist well-formed, mandatory forbidden entries present, no overlap"
      },
      {
        "id": "V-5",
        "status": "PASS",
        "detail": "20 staged path(s), all within the allowlist"
      },
      {
        "id": "V-6",
        "status": "UNKNOWN",
        "detail": "not applicable in mode PRE_COMMIT (applies in POST_FLIGHT)"
      },
      {
        "id": "V-7",
        "status": "UNKNOWN",
        "detail": "not applicable in mode PRE_COMMIT (applies in POST_FLIGHT)"
      },
      {
        "id": "V-8",
        "status": "UNKNOWN",
        "detail": "not applicable in mode PRE_COMMIT (applies in POST_FLIGHT)"
      },
      {
        "id": "V-9",
        "status": "PASS",
        "detail": "ownership and concurrency declarations are consistent"
      }
    ],
    "overall": "PASS",
    "authorizationImplied": false,
    "decides": "nothing",
    "writes": [],
    "statement": "Structural report only: PASS means the declared structure matches the supplied repository facts. It never means authorized (R-C.2)."
  },
  "adapterNotes": []
}
```

**Verifier, post-flight mode** (baseline `d425ba6`, run before the commit, so V-6 sees an empty committed diff — limitation I-9):

```json
{
  "report": {
    "verifierVersion": "0",
    "mode": "POST_FLIGHT",
    "checks": [
      {
        "id": "V-1",
        "status": "PASS",
        "detail": "envelope and facts are well-formed"
      },
      {
        "id": "V-2",
        "status": "PASS",
        "detail": "authorization heading committed at HEAD, ancestry confirmed, file clean"
      },
      {
        "id": "V-3",
        "status": "PASS",
        "detail": "package committed at HEAD and clean"
      },
      {
        "id": "V-4",
        "status": "PASS",
        "detail": "allowlist well-formed, mandatory forbidden entries present, no overlap"
      },
      {
        "id": "V-5",
        "status": "UNKNOWN",
        "detail": "not applicable in mode POST_FLIGHT (applies in PRE_COMMIT)"
      },
      {
        "id": "V-6",
        "status": "PASS",
        "detail": "0 changed path(s), all within the allowlist"
      },
      {
        "id": "V-7",
        "status": "PASS",
        "detail": "all R-B.1 sections present as headings"
      },
      {
        "id": "V-8",
        "status": "UNKNOWN",
        "detail": "unobservable recorded fields: [effort]"
      },
      {
        "id": "V-9",
        "status": "PASS",
        "detail": "ownership and concurrency declarations are consistent"
      }
    ],
    "overall": "PASS",
    "authorizationImplied": false,
    "decides": "nothing",
    "writes": [],
    "statement": "Structural report only: PASS means the declared structure matches the supplied repository facts. It never means authorized (R-C.2)."
  },
  "adapterNotes": []
}
```

A genuine post-commit post-flight run is reported to the Commander in the completion message, not here (a commit cannot cite itself). **Accepted limitation (Commander, recorded, not worked around):** the verifier cannot validate post-envelope closure bookkeeping or replay history; closure edits ADR-001 and is outside this envelope; the verifier was not modified.

## 11. Stop-condition table

| SC | Fired? | Evidence |
|---|---|---|
| SC-1 gated content | No | `60-Organization-A/`, `POA-PJR-00x`, the P5/ORG-KNOWLEDGE lineage never opened; no record body displayed to the agent |
| SC-2 read outside sources / working tree / unpinned | No | three paths only, `git show <40-hex>:<path>`; tests of pin refusal and working-tree independence |
| SC-3 fixture integrity | No | integrity test: synthetic text, fake SHAs, no forbidden name, no foreign path |
| SC-4 git verb/process/import outside allowlist | No | `assertAllowedGit` for every call; import guard; no model/network/write API |
| SC-5 write outside allowlist | No | §4; ledger record composed from stdout by the agent (I-8) |
| SC-6 governance/verifier mutation | No | none; verifier diff-vs-HEAD empty |
| SC-7 ratification absent / no commencement | No | record at `HEAD:20-Shared/DECISIONS/POA-ADR-001.md`; commencement instruction §1 |
| SC-8 conflict with R-A–R-C/STD-011/Q6/CLAUDE.md | No | none found |
| SC-9 scope pressure | No | exactly the four rows and the §7 fields; no Tier-B record, classifier, dashboard, closure workaround or verifier change |
| SC-10 ambiguity in §5–§9 | No (see note) | I-1 and I-2 are tooling-form conflicts resolved to the stricter reading of the package's own rule ("only those assertAllowedGit already permits"); flagged for acceptance rather than stopping |
| SC-11 effort envelope | No | 229 lines (≤375), 3 files, 14 fixture cases (≤20) — I-6 on the test-block count |
| SC-12 output-validation gate | No | gate passed on the real run; rejects planted over-long heading (L13) |
| SC-13 headings missing / pin not ancestor | No | all four headings found; pin is an ancestor of HEAD |

## 12. Evidence-gate statements (EV-7, EV-9)

**EV-7 non-access and exposure attestation (agent self-attestation backed by the EV-4 guards, not an independent audit):** no `60-Organization-A/` or PJR path was opened or passed to git; no excluded record's text was displayed to the agent — only the closed-format ledger and counts were viewed; no ADR-001 body text was printed during development or the real run; the output-validation gate passed. The tool necessarily holds the pinned ADR-001 blob, and each earlier ADR-001 blob up to the pin (heading-line comparison only), in process memory (I-5). This does not establish that ADR-001 is free of Organization A information (D-1).
**EV-9 events** (role-level, EVT-001-shaped; timestamps `UNKNOWN` — not exposed by the environment): (1) start: verify ratification at HEAD, pin, baseline suite; (2) author pure core; (3) author pinned-blob reader; (4) typecheck; (5) generate 14 synthetic fixtures and manifest; (6) author tests; (7) fix two test assertions (core-purity regex matched a property name; fixture-integrity path allowlist) and one self-inflicted defect — a Python string-escape edit briefly turned two guard regexes into vacuous patterns (backspace bytes); found by byte inspection, repaired, and re-verified; (8) real ledger run twice, read-only snapshots; (9) compose the ledger record from stdout; (10) stage, verify, commit (one bounded local commit).

## 13. Limitations statement

"The ledger is an observation of repository evidence, not a reconstruction of organizational reality." It shows what four ADR-001 sections' fields and three files' headings evidence at one pin; it does not show that any record is correct, authorized, accepted or closed; it is silent on every excluded record (including the whole ORG-KNOWLEDGE/P5 lineage), so its R-A coverage is partial (34 of 38 H1 headings are index-only); it holds one fully-evidenced mission; it is not a status dashboard or a classifier; heading presence shows a section exists, not that its content is right. Tests use synthetic inputs and temp repositories; the real runs demonstrate the derivation for this pin only. Non-access is attested, not independently audited. Effort is `UNKNOWN`. The verifier's closure-window and replay limitations stand (§10).

## 14. Interpretation points (for Commander acceptance)

- **I-1** Package §6 gives the history scan as `git log --reverse --format=%H <PIN> -- <path>`, but §4/§6 also bind the reader to `assertAllowedGit`, whose `log` form takes no commit argument. The reader uses the permitted form (`log --reverse --format=%H -- <path>`, history of HEAD) and truncates the oldest-first list at the pin, requiring the pin to be in the list (else refuse `PIN_NOT_IN_ADR_HISTORY`). Same commit set for linear history; stricter on tooling.
- **I-2** `assertAllowedGit` permits `merge-base --is-ancestor <sha> HEAD` only, so "ancestor of the pin" cannot be asked of git. `implementationSha.ancestorOfPin` is therefore `true` only when the recorded SHA is in the execution record's commit history cut at the pin (pin must be in that list), else `UNKNOWN_NOT_EVIDENCEABLE`. It is exact for the SEA row; it is not general ancestry. MATERIALIZED is evidenced only under that condition.
- **I-3** `rAApplicability` compares positions in the oldest-first ADR-001 history, valid for the linear history of `main`.
- **I-4** The implementation-SHA field is detected as the phrase `Implementation commit SHA:` anywhere in a section line (the SEA record places it mid-paragraph); the 40-hex is taken from the rest of that line. `recordClass` is `MISSION` iff the phrase occurs in the section; POA-R-001 and the STD-011 approval therefore read `UNKNOWN_NOT_EVIDENCEABLE`.
- **I-5** To find introducing commits the reader loads every ADR-001 blob up to the pin and compares heading lines; no body text is output. Package §6 prescribes this scan; it reads earlier versions of the same file, which D-1 ("the committed blob at the pin") does not state separately.
- **I-6** The 20-case cap is read as fixture cases (package §12: "synthetic cases exceed 20"): 14. The test file has 28 `it` blocks, of which 14 are the fixture cases.
- **I-7** `sources` lists only sources present at the pin; `index` rows contain exactly `ordinal`, `headingSha256`, `status`.
- **I-8** The ledger record was composed by the agent from the stdout file (a fixed header plus the JSON verbatim) rather than by raw shell redirection, because the header is required; the tool itself only prints.
- **I-9** The committed record can contain only a post-flight run made before the commit (V-6 vacuous); the genuine post-commit run is in the completion message.
- **I-10** `executionRecordPath` is derived by naming convention (`PATH_CONVENTION`), stated in the ledger header, not in the JSON schema.

## 15. Pointers

Acceptance Record: **none** — to be added additively by the Commander's act per R-A.4(a)/(c). Closure bookkeeping (implementation SHA in the ADR-001 mission record §10; `POA-STD-011` §6.12 check): **pending**, outside the envelope. Retrieve the implementation commit with `git log -1 --format=%H -- 50-Mothership/src/lifecycle-ledger.ts`.

Readiness: package completion conditions C-1…C-8 are met as of the commit (C-6 per §10 and the completion message); the mission is **ready for Commander acceptance**, which this record neither grants nor presumes.
