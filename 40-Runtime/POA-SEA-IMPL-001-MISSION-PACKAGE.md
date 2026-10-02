# POA-SEA-IMPL-001 — Mission Package (Lifecycle Verifier, Read-Only)

**Artifact / Mission ID:** `POA-SEA-IMPL-001` (assigned by Commander ruling 2026-10-02, F-1 Option 1; `SEA` is an informal family under `POA-META-002` §E; `POA-STD-011` §6.1 is neither excepted nor modified)
**Date drafted:** 2026-10-02
**Status:** **RATIFIED — EXECUTION BOUNDARY for the Lifecycle Verifier mission ONLY (ratified 2026-10-02).** Authorization is effective upon the Commander act recorded in `POA-ADR-001.md` §"POA-SEA-IMPL-001 — Lifecycle Verifier (Read-Only) Mission Ratification Decision Record (2026-10-02)" (`POA-STD-011` §6.4), committed together with this package and with Record 1 (R-A, R-B, R-C). **Implementation has NOT commenced.** Commencement additionally requires a Commander commencement instruction (R-A; distinct from the `POA-STD-011` §6.5 materializing-commit sense). This package creates no authority beyond its allowlist and does not touch R-1/Q6.
**Derives from:** `SEA-001` decision brief §14 (T8, untracked); `POA-STD-011` §6.3, §6.6; precedent: `POA-ORG-KNOW-P5-IMPL-001-RESCOPED-MISSION-PACKAGE`.
**Labels:** VERIFIED / INFERRED / PROPOSED / UNKNOWN as in the brief. `[CMD]` markers below were resolved by ratification as shown in the Ratification Record.

## Ratification Record (added 2026-10-02; status/ratification fields only — no normative content in §§1–16 is altered by this block, except that `[CMD]` choices are settled as stated)

The Commander's 2026-10-02 rulings: **F-1** identity `POA-SEA-IMPL-001` (Option 1); **F-2…F-7** approved as proposed in `POA-SEA-IMPL-001-R-A-RECONCILIATION-REPORT` and applied to Record 1. The Commander's order to append "proposed ADR Records 1 and 2" as drafted settles, as drafted and recommended: **placement P1** (existing `50-Mothership/`; P2 is not authorized); **effort envelope** of §12 as stated; **Envelope v0** for this mission only; **single agent**, model and effort declared in §3 (declared and recorded, not gated); two records. Anything not stated in this package or the records remains outside the mission. R-1/Q6, Q3, O-1…O-4, MODEL-GATE, R-D/R-E/R-F are untouched.

---

## 1. Purpose and need

Build a **read-only, mechanical Lifecycle Verifier**: given a Mission Package Envelope (§6), it reports whether the declared structure matches repository facts. It **decides nothing and authorizes nothing** (R-C). **Evidence of need (VERIFIED, brief §14):** the same checks — authorization commit ancestry, staged set vs allowlist, record completeness — were done by hand in `POA-GOV-CLOSURE-001`, `POA-ORG-KNOW-P5-IMPL-001` and the readiness audit; SHA-lag and acceptance-linkage gaps recurred (CTD-001).

## 2. Prerequisites (must be committed before commencement)

- Record 1 (R-A, R-B, R-C) and Record 2 (this package's ratification) in `POA-ADR-001`, committed (`POA-STD-011` §6.5, §6.7).
- A Commander commencement instruction after those commits (R-A: COMMENCED).
- Nothing else. No R-D/R-E/R-F, no MODEL-GATE, no Organization A matter.

## 3. Execution profile (declared and recorded; not gated)

One agent. Model: Sonnet 5.5. Effort: HIGH (declared; observability **UNKNOWN**, record as such). Concurrency 1; no integrator role is needed. No sub-agents. Settled by ratification (see Ratification Record).

## 4. Authorized work — exhaustive allowlist (STD-011 §6.6 element 1)

**Placement (CLAUDE.md Rule 9 reserves repository-structure choices) — P1 ratified; P2 not authorized:**
- **P1 (ratified):** files in the existing `50-Mothership/` package, following the P5 single-file precedent. No new directory. Risk: places a governance tool in the runtime package; mitigated by no imports from `runtime`/`identity`/`knowledge-plane`, no export from `index.ts`, no npm-script or `package.json` change.
- **P2 (not authorized):** a new top-level directory. A structural change that would need its own governance act.

Allowlist under P1:

| # | Item | Path |
|---|---|---|
| A-1 | Pure core: `verifyEnvelope(envelope, facts)` — no I/O, no clock, no randomness | `50-Mothership/src/lifecycle-verifier.ts` |
| A-2 | Read-only git fact reader + CLI entry (runs via `npx tsx`; no script added) | `50-Mothership/src/lifecycle-verifier-git.ts` |
| A-3 | One test file | `50-Mothership/test/lifecycle-verifier.test.ts` |
| A-4 | Synthetic envelopes/facts and manifest | `50-Mothership/test/fixtures/lifecycle-verifier/**` |
| A-5 | Execution record (R-B) | `40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md` |
| A-6 | One bounded local commit citing Record 1, Record 2 and this package | — |

Nothing else is created or modified. Untouched: `index.ts`, `package.json`, lockfiles, every existing test, `command-center/`, `60-Organization-A/`, `20-Shared/`, `10-Constitution/`, `CLAUDE.md`, ADR-001.

## 5. Explicit exclusions (element 2)

- **X-1** Any path under `60-Organization-A/`, any description of its content, `POA-PJR-001` entries (R-1/Q6 in force; not lifted).
- **X-2** The tool never writes: no file write (outside the test's OS-temp repos), no `git add/commit/push/tag/reset/checkout/merge/rebase/stash/config`, no network, no model/agent call, no process spawn other than the read-only git allowlist (§7).
- **X-3** Never authorizes, widens, transitions or implies authorization (R-C); never changes a lifecycle state; never invokes an agent or dispatcher.
- **X-4** No dispatcher, console surface, registry, MODEL-GATE, `AUTHORIZED/` folder logic.
- **X-5** The verifier does not read the **contents** of allowlisted or staged files, only their paths; it reads only the files the envelope names as the authorization record, the package and the execution record.
- **X-6** No persistence, event store, or telemetry output beyond stdout/exit code.
- **X-7** No export from `index.ts`; no new npm dependency.
- **X-8** No successor mission (any `SEA-IMPL-002`/`003`); no modification of ADR-001, STD-011, ACC-001, Q6, or any governance artifact; no push, amend or rebase.

## 6. Envelope v0 (defined here; ratified only for this mission)

A fenced JSON block headed `<!-- POA-ENVELOPE v0 -->` in the package. Synthetic illustration (this package's own envelope appears at the end, §14):

```json
{
  "envelopeVersion": "0",
  "missionId": "SYN-MISSION-01",
  "package": "40-Runtime/SYN-PACKAGE.md",
  "authorizationRecord": { "file": "20-Shared/DECISIONS/POA-ADR-001.md", "headingPrefix": "SYN-MISSION-01 — Title" },
  "executionRecord": "40-Runtime/SYN-EXECUTION-RECORD.md",
  "allowlist": ["src/a.ts", "test/fixtures/x/**"],
  "forbiddenPaths": ["60-Organization-A/", "CLAUDE.md"],
  "stopConditions": ["SC-1", "SC-2"],
  "executionProfile": { "models": ["Model-X"], "maxConcurrentAgents": 1, "effort": "HIGH" },
  "fileOwnership": null
}
```

Rules: `allowlist` entries are exact paths or a single trailing `/**` under a named directory; a bare `**`, a leading `/**`, or `..` is rejected. `forbiddenPaths` must include `60-Organization-A/` and `CLAUDE.md`. The authorization record is located by **file + headingPrefix**, never a SHA (avoids the SHA-lag self-citation problem). `fileOwnership` must be `null` when `maxConcurrentAgents` is 1; if >1 it must be disjoint per owner (structure only — multi-agent execution still requires R-D and is outside this mission).

## 7. Verifier contract (specification, not code)

`verifyEnvelope(envelope: unknown, facts: unknown): VerifierReport` — pure and total (never throws; malformed input → `FAIL` on V-1). `facts` is plain data supplied by the git adapter or by fixtures: `headCommit`, `branch`, `headingPresentAtHead`, `headingIntroducingCommit`, `introducingCommitIsAncestorOfHead`, `authorizationFileDirty`, `packageFileDirty`, `stagedPaths`, `changedPathsSinceBaseline`, `executionRecordSections`, `recordedProfile`.

Check set (each result is `PASS`, `FAIL`, `FLAG` or `UNKNOWN`, with a short factual detail):

| ID | Check | Failure / flag |
|---|---|---|
| V-1 | Envelope parses; required fields present and well-typed; `envelopeVersion` = "0" | FAIL |
| V-2 | Authorization record: heading prefix present in the committed file at HEAD; introducing commit is an ancestor of HEAD; file not modified in the working tree | FAIL |
| V-3 | Package file committed at HEAD and clean | FAIL |
| V-4 | Allowlist well-formed (no wildcard broader than §6); does not overlap `forbiddenPaths`; `forbiddenPaths` contains the mandatory entries | FAIL |
| V-5 | Pre-commit mode: every staged path matches the allowlist (and none matches `forbiddenPaths`). Reports exact set difference | FAIL |
| V-6 | Post-flight mode: changed paths since baseline ⊆ allowlist ∪ nothing else | FAIL |
| V-7 | Post-flight mode: execution record contains the R-B.1 required sections (headings by name) | FAIL |
| V-8 | Declared vs recorded profile mismatch (models, agent count, effort) | **FLAG only**; unobservable → `UNKNOWN` |
| V-9 | Ownership/concurrency declared consistently (§6 rules) | FAIL |

Report fields: `verifierVersion`, `mode`, `checks[]`, `overall` (`PASS` iff no FAIL; FLAG/UNKNOWN are surfaced, not hidden), and the constants `authorizationImplied: false`, `decides: "nothing"`, `writes: []`. Exit codes of the CLI: 0 PASS, 1 FAIL, 2 tool error. `overall: PASS` never means "authorized" (R-C.2).

**Git adapter (A-2) read-only allowlist:** `rev-parse`, `merge-base --is-ancestor`, `show HEAD:<path>` (only for the three envelope-named files), `log` (with `-S`/`--format`), `diff --name-only`, `diff --cached --name-only`, `status --porcelain`, `ls-files`. Any other verb is a stop condition (SC-4).

## 8. Synthetic fixtures

Fixtures are JSON envelope/facts pairs with `"fixtureClass": "SYNTHETIC"`, invented mission IDs prefixed `SYN-`, no real path names beyond generic placeholders (`src/a.ts`), never copied from a real package or from Organization A material. A `manifest.json` lists each case, its mode, and the expected overall and per-check outcome. The harness refuses fixtures lacking the marker. Adapter tests build throw-away git repositories **in the OS temp directory only**, never inside the repository; they are the only writes the tests perform.

## 9. Evidence the mission must produce

- **EV-1** Case ledger in the execution record: case → fixture + hash → expected → actual → pass/fail.
- **EV-2** `npm test` and `npm run typecheck` in `50-Mothership/` — full results; existing test count unchanged; no existing test modified.
- **EV-3** Invariant tests: purity/determinism; `writes: []`; `authorizationImplied: false` on every report; no input mutation; hostile-input totality (null, wrong types, huge strings, prototype keys).
- **EV-4** Mechanical guards: static test over the two source files — no `60-Organization-A`, no write-capable fs APIs, no git verbs outside the allowlist, no network/model identifiers, no import of `runtime`/`identity`/`knowledge-plane`; `git diff --name-only` equals §4 allowlist; guard negative control.
- **EV-5** Adapter read-only evidence: repository HEAD, index and working tree hash-identical before and after the adapter runs against the real repository.
- **EV-6** Non-access attestation (self-attestation backed by EV-4): no `60-Organization-A/` path was opened.
- **EV-7** Limitations statement: the verifier proves *structure matches repository facts*, not that a mission is authorized, correct or safe; it does not read file contents; it is the first implementation of an unratified-as-standing Envelope v0.
- **EV-8** Dogfood: a post-flight run of the verifier against this package's own §14 envelope, with the real report included verbatim.
- **EV-9** EVT-001-shaped, role-level action events and all R-B.1 fields, inside the execution record only (no runtime event store).

## 10. Completion condition

Complete iff all hold: **C-1** every V-1…V-9 check has at least one pass-case and one fail-case fixture (V-8 a flag-case); **C-2** invariants and guards pass; **C-3** `npm run typecheck` and the full `50-Mothership` suite pass with no existing test changed; **C-4** changed paths equal the §4 allowlist exactly; **C-5** the execution record contains EV-1…EV-9 and all R-B.1 fields; **C-6** one bounded local commit citing Record 1, Record 2 and this package, no push/amend/rebase; **C-7** no stop condition fired, or any that fired is reported with the remainder named (`POA-STD-011` §6.12(a)).
Completion does **not** mean: the Envelope is a standing standard; any dispatcher, two-agent trial or other mission is authorized; the mission is ACCEPTED or CLOSED (those are Commander acts, R-A.3).

## 11. Stop conditions (element 3)

Authority to act ends on completion or the first of these; the agent stops, records done/undone, and escalates without resolving.

- **SC-1** Any step needs `60-Organization-A/**`, a description of it, or other gated content.
- **SC-2** Any need to run the verifier's logic on content rather than paths, or to read the contents of non-envelope-named files.
- **SC-3** A fixture fails §8, or resembles/derives from a real mission package or Organization A material.
- **SC-4** Any need for a git verb or process outside the §7 allowlist, any network/model/agent call, or any import of `runtime`/`identity`/`knowledge-plane`.
- **SC-5** Any write outside the §4 allowlist (other than OS-temp test repos), edit of an existing test/config/`package.json`, or persistence.
- **SC-6** Any need to modify ADR-001, STD-011, ACC-001, Q6 or any governance artifact.
- **SC-7** Record 1 or Record 2 absent from, or uncommitted in, committed `POA-ADR-001` (verify by `git show HEAD:`), or no commencement instruction.
- **SC-8** A conflict between this package and R-A/R-B/R-C, STD-011 §6, Q6/R-1 or CLAUDE.md that the package does not resolve (report; do not choose a side).
- **SC-9** Pressure to extend scope (dispatcher, console, gate, registry, authorization effects, auto-fix, multi-agent, new checks beyond V-1…V-9).
- **SC-10** Ambiguity in the §7 check table or §6 envelope rules not settled by their text.
- **SC-11** Effort envelope (§12) exceeded by more than 50%.
- **SC-12** The verifier, run against the real repository, would need to write to it, or a check cannot be made mechanical without a judgment about authority.

## 12. Effort envelope (SC-11) — as ratified

≤ 2 source files, ≈ 400 lines of source total; 1 test file; ≈ 30 fixtures; execution record ≈ 250 lines. A single session. The P5 precedent left the envelope UNKNOWN; this is an estimate, not a measurement; the agent reports before continuing if the effort is in doubt.

## 13. Decision boundaries (element 4) and open items

**The mission MAY decide:** internal names; code structure within the two source files; fixture wording/order (subject to §8); `manifest.json` layout; report `detail` phrasing.
**The mission MUST escalate:** expanding the allowlist, check set or envelope schema; any write/commit/dispatch/authorization behavior; a different placement; promoting Envelope v0 to a standing rule; changing R-A–R-C; anything touching Organization A; push.

| ID | Item | Status |
|---|---|---|
| B-1 | Record 1 and Record 2 committed in ADR-001 | **SATISFIED 2026-10-02** — committed with this package |
| B-2 | Placement P1/P2 | **RULED** — P1 |
| B-3 | Effort envelope | **RULED** — §12 as stated |
| B-4 | Envelope v0 approved for this mission only | **RULED** |
| B-5 | Non-access evidence is self-attestation plus mechanical guards (no independent audit of reads) | Limitation |
| B-6 | R-1/Q6, Q3, MODEL-GATE, R-D/R-E/R-F | Outside the mission; unresolved |
| B-7 | `POA-ACC-001` closure adoption (R-A.5) | **RULED** — adopted §B–§E with limits (F-4), in Record 1 |

## 14. This package's own Envelope (synthetic-format example is §6; real instance below)

<!-- POA-ENVELOPE v0 -->
```json
{
  "envelopeVersion": "0",
  "missionId": "POA-SEA-IMPL-001",
  "package": "40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md",
  "authorizationRecord": {
    "file": "20-Shared/DECISIONS/POA-ADR-001.md",
    "headingPrefix": "# POA-SEA-IMPL-001 — Lifecycle Verifier"
  },
  "executionRecord": "40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md",
  "allowlist": [
    "50-Mothership/src/lifecycle-verifier.ts",
    "50-Mothership/src/lifecycle-verifier-git.ts",
    "50-Mothership/test/lifecycle-verifier.test.ts",
    "50-Mothership/test/fixtures/lifecycle-verifier/**",
    "40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md"
  ],
  "forbiddenPaths": ["60-Organization-A/", "CLAUDE.md", "20-Shared/", "10-Constitution/", "50-Mothership/src/index.ts", "50-Mothership/package.json"],
  "stopConditions": ["SC-1","SC-2","SC-3","SC-4","SC-5","SC-6","SC-7","SC-8","SC-9","SC-10","SC-11","SC-12"],
  "executionProfile": { "models": ["Sonnet 5.5"], "maxConcurrentAgents": 1, "effort": "HIGH" },
  "fileOwnership": null
}
```

## 15. What this package does not do

No implementation; no fixture; no ADR/standard/authorization change; no commit or push; no Organization A processing; no authority created or implied; no successor mission authorized; no standing Envelope format; no dispatcher; MODEL-GATE unresolved.

## 16. Separate Commander authorization required before execution

**Partly satisfied.** The ratifying act (Records 1 and 2) is committed in `POA-ADR-001` together with this package (`POA-STD-011` §6.4, §6.5, §6.7). **Still required before any implementation:** an explicit Commander commencement instruction (R-A COMMENCED). Any expansion beyond this package requires its own governance act.
