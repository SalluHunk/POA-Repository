# POA-DEC-MOTHERSHIP-002

## Layer B Demo-Layer Classification & Quarantine Disposition Record — Mothership Command Center

**Mission Class:** Disposition mission executed under Commander directive. The directive is "POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001 — Option 2", a chat directive dated 2026-09-24. It instructed: *"classify, disposition, and quarantine the Sept 23 demo layer (Layer B)… Do NOT discard the work… Do not modify the existing BLD-MOTHERSHIP-001 completion report merely to eliminate the contradiction."*
**Resumes from:** `40-Runtime/POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001-REVIEW-REPORT.md` §4 and §6.
**Repository Baseline (verified):** `HEAD == 168708c` (local; `origin/main == 9569b20`). Nothing is staged.
**Related:** `POA-BLD-MOTHERSHIP-001` (completion report), `POA-MOTHERSHIP-OPERATIONALIZATION-001-DEMO-LAYER-DISCLOSURE.md`, `POA-DEC-MOTHERSHIP-001`.

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | `POA-DEC-MOTHERSHIP-002` |
| Artifact Name | Layer B Demo-Layer Classification & Quarantine Disposition Record |
| Artifact Family | DEC (Decision), `MOTHERSHIP` domain segment. This follows `POA-DEC-MOTHERSHIP-001`. |
| Version | 1.0.0: first materialization |
| Status | **DISPOSITION EXECUTED IN WORKING TREE — PENDING COMMANDER RATIFICATION.** This record was authored by the executing agent under the Option 2 directive. It is not a Commander ruling and does not ratify itself. |
| Authority | Paravyoma Constitution → Commander. The Commander has not yet ratified this record. |
| Capability Introduced | **None.** This record removes nothing and authorizes nothing. It classifies existing code and restricts where that code runs. |
| Evidence Basis | Direct reading of the Layer B source; the demo-layer disclosure report (§4, §8, §10, §11); the review report §3–§4; the BLD-MOTHERSHIP-001 completion report's REAL/DESIGNED/VISION table. |

---

# 1. What Layer B Represents (directive Q1)

Layer B is the 2026-09-23 port of the reference design `POA Command.dc.html`. It came from a chat directive and has no brief file.

It consists of:
- `presenceData.ts`: `DOMAIN_DETAIL`, `PROMPTS`, `computeAnswer()`.
- `usePresenceAsk.ts`: an 800 ms simulated "thinking" delay, then a canned answer.
- Four overlays: `AnswerOverlay`, `ListeningOverlay`, `DomainDetailOverlay`, `ThinkingIndicator`.
- The reference's example figures and flags for domains that have no backend (`DOMAIN_SPEC` `l1`/`l2`/`flag`).
- The Quick Prompts wiring.

It is a **visual and interaction mock-up of a future experience**. Its content is the reference's own fictional scenario ("Temple Growth", "D-016", "BOARD MEETING · LIVE · 07:42", "1,204 VERIFIED"). It makes zero network calls, performs no reasoning, and has no microphone or transcription capability.

# 2. Classification (directive Q2)

**DEMO.** This uses the class already defined in the disclosure report's REAL / DERIVED / DEMO / EXPERIMENTAL / UNKNOWN taxonomy (§4). This record introduces no new category.

Why the other categories do not apply:
- **Not product behavior.** No design document authorizes it, and the completion report explicitly excludes it (§4 below).
- **Not EXPERIMENTAL.** It tests no hypothesis against real data.
- **Not a fixture.** It is not test input to real code. Its test (§5) exercises the demo itself.

# 3. Authority Status (directive Q3)

**None.** Layer B's content has **no authority to represent POA organizational truth**. The disclosure report §8 already lists these items as "Explicitly NOT Organizational Truth", and this record adopts that list unchanged:
- every `DOMAIN_DETAIL` fact;
- every `computeAnswer()` response;
- the Listening `TOPICS`, `OPEN_QS` and live label;
- the static `l1`/`l2` values for systems, knowledge and governance;
- the evidence orb's `⚠` flag, added here, because it is a static reference value;
- the Quick Prompts text.

Evidence ≠ Authority ≠ Implementation: working Layer B code and a passing Layer B test are implementation evidence only. They confer no authorization.

# 4. Relationship to BLD-MOTHERSHIP-001 — Contradiction Resolution (directive Q4)

The committed completion report states "Natural-language conversation | **VISION** — not built, not implied" and "no listening mode". **This record does not amend, supersede, or reinterpret that report. Both statements remain true and in force.**

The contradiction is resolved by classification, not by editing history:
- The completion report describes **POA product capability**.
- Layer B is DEMO, which is by definition not product capability.
- After quarantine (§6), no default build or dev run exposes Layer B behavior. The default `npm test` run exercises it only inside the labelled demo harness (§5), under a stubbed `demo` mode. Layer B appears only under an explicit `demo` mode, where every surface carries the disclosure "DEMO · FICTIONAL REFERENCE CONTENT — NOT POA ORGANIZATIONAL TRUTH".

So NL conversation remains VISION, listening mode remains not built, and the demo layer asserts neither.

The in-code "§12" authorization citations in `CommandBar.tsx` and `ListeningOverlay.tsx` did not resolve to any authorizing document. They have been **removed and replaced** by comments that say so explicitly.

# 5. The Canned-Answer Test (directive Q5)

The former `smoke.test.tsx` case "answers a free-text ask-POA question with the reference's canned response" was **testing demo behavior, not an authorized product contract**. No product contract for natural-language answers exists.

Disposition:
- **The test moved** to `src/demo/demo.test.tsx`. It is headed "NOT A PRODUCT CONTRACT", it runs only with `MODE=demo` stubbed, and it also asserts the disclosure is present.
- **A product-contract test replaced it** in `smoke.test.tsx`: "never fabricates an answer, figures, or listening by default". In the default mode it asserts that:
  - free text gets the real lookup failure plus the note "Only mission and principal IDs resolve";
  - no canned answer or reasoning banner appears;
  - the 3 unbacked domains show `NOT CONNECTED`;
  - the mic is disabled;
  - no demo disclosure appears.

# 6. Disposition (directive Q6)

**QUARANTINE + LABEL + CONVERT TO DEMO-ONLY INFRASTRUCTURE.** The directive's options were quarantine, label, convert to fixtures/demo-only infrastructure, remove, or separately authorize. Of these:
- **Not removed:** the directive says not to discard the work, and disclosure §10 notes its value as a design reference.
- **Not separately authorized:** production authorization is out of scope (§7).

What was executed:
1. **Structural quarantine.** All Layer B modules moved to `50-Mothership/command-center/src/demo/`. The leaf components (`CommandBar`, `QuickPrompts`) import only the gate and the prompt text from `demo/`. `App.tsx`, the composition root, imports the demo modules and gates their rendering. The structural `PHASES` vocabulary was moved out to `src/state/phases.ts`, so the Header no longer depends on the demo module.
2. **Default-off gate.** `isDemoLayerEnabled()` returns `import.meta.env.MODE === "demo"`, which is false in dev, test and production builds. It is opt-in only, via `npm run dev:demo` (`vite --mode demo`). When the gate is off:
   - the Domain Detail, Answer, Thinking and Listening overlays never render;
   - the six non-People domain orbs are inert;
   - free text goes to the real structured lookup;
   - the mic and Quick Prompts stay visible (layout unchanged) but are disabled;
   - the unbacked domains show the DESIGNED `NOT CONNECTED` placeholder that Round 3 established;
   - the reference `⚠` flag is hidden;
   - the placeholder reads "Jump to a mission or principal by ID...".
3. **Labelling when opted in.** A per-surface `DemoDisclosure` appears on the Answer, Domain Detail and Listening overlays, plus a global disclosure while demo mode is active. That global disclosure is there because the orbs then show fictional figures.
4. **Headers.** Every file in `src/demo/` carries a quarantine header citing this record.

**Named residuals (disclosed, not hidden):**
- The fictional strings are still bundled in the default production build as unreachable data. A grep of `dist/` finds "Temple Growth", the canned answer text and "1,204 VERIFIED", because `usePresenceAsk` and `DOMAIN_SPEC` are imported unconditionally. The gated surfaces themselves (Listening overlay, disclosure) are tree-shaken. Removing the strings from the bundle would need a lazy or dynamic import boundary. That is **TBD — requires architectural decision**, and it is not done here, to avoid restructuring the app's module graph.
- The five-phase Header strip (`ACT`/`EVOLVE`) came from Layer B but is display vocabulary, not fictional organizational data. It is left ungated.
- The uncommitted `/init` text in `CLAUDE.md` names the old paths of `presenceData.ts` and `usePresenceAsk.ts` under `src/state/`. `CLAUDE.md` is outside this mission's scope, so this is a follow-up item.

# 7. Conditions for Future Production Authorization (directive Q7)

Any part of Layer B may become production-authorized behavior **only** when every condition below is met. The conditions come from existing sources; where no source exists, this record says so.
1. **A separate, explicitly Commander-authorized mission** reclassifies the specific capability from VISION. This follows Operating Rules 4 and 9. The disclosure report §11 already lists the Intelligence Core, execution providers and real-data binding as "future missions, each requiring its own Commander authorization".
2. **Real data binding.** Every displayed fact is read from committed POA runtime or repository state, never from a static string. This is the REAL definition in the BLD-MOTHERSHIP-001 REAL/DESIGNED/VISION boundary.
3. **Evidence citation.** Every answer cites the specific Mission, Evidence or Decision record it drew from, so an absent citation is itself the disclosure. This is the direction proposed in disclosure §10.
4. **Listening mode** additionally requires an authorized capture, transcription and consent model. No source exists for one: **TBD — requires architectural decision**.
5. **Knowledge domain** content depends on first resolving the Article IX/XIV tension (disclosure §11).
6. The product contract in `smoke.test.tsx` is changed deliberately, by that authorizing mission. It is not relaxed to make demo behavior pass.

Until then, `src/demo/` content must never be read, quoted, or relied upon as organizational fact by any mission, review or automated process.

# 8. Commit Authorization

**This record does not authorize the commit of the Mothership visual-port bundle.**

The executing agent authored this record, so authorizing its own work's commit would collapse Evidence and Authority. The gate is **Commander ratification of POA-DEC-MOTHERSHIP-002**. On ratification, the staging set in `40-Runtime/POA-MOTHERSHIP-VISUAL-PORT-CHECKPOINT-001-LAYER-B-DISPOSITION-REPORT.md` §4 becomes eligible for a single commit that includes this record. History then carries the classification alongside the code it classifies.

# 9. Artifact Version/State

Untracked at the time of writing. It is proposed for inclusion in the checkpoint commit upon ratification.
