# POA Mothership Experience State Model

**Status:** Formal state model. No implementation code. No new POA ontology. No visual redesign. This document transforms `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md`'s shell/canvas/depth model into a precise, enumerable set of states, transitions, and a screen/state matrix. It is the direct input to the next stage (Interaction & Visual System Design) and does not itself specify visuals.

**Source of truth (unmodified):** `POA-BLD-003-DESIGN-ARTIFACT.md`, `POA-MOTHERSHIP-UX-ARCHITECTURE.md`, `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md`. Terminology (Presence/Context/Forensics, the shell, the canvas, the Interaction Grammar's verbs) is reused exactly as those documents defined it — not redefined here.

Legend (unchanged): **[REAL]** backed today · **[REAL-DEFERRED]** real data, not yet built, no new architecture needed · **[VISION]** no current backing, requires a future decision mission.

---

## 1. The actual experience states (screen ≠ state ≠ mode ≠ transformation)

Four distinct kinds of thing, not interchangeable:

- **Screen** — a stable route with its own URL, one per top-level shell destination. There are exactly **three** in the current architecture: Executive Home, Mission Control, People & Capabilities (plus Diagnostics, which is a Mode, not a Screen — see below).
- **State** — a specific configuration of the canvas: a subject, a depth, and whether anything within it is expanded. States are what this document enumerates; most are **not** separate screens.
- **Mode** — a cross-cutting behavior that changes how the canvas behaves without itself being a subject. Only one exists today: **Diagnostic Mode** (Isolation Check) — it doesn't participate in Presence/Context/Forensics at all, because it answers a structurally different question ("is isolation enforced" rather than "what is my organization's state").
- **Contextual transformation** — the act of moving between states (Focus, Drill, Expand, Return, Act, Verify — the Interaction Grammar's verbs). A transformation is not itself a state; it is the edge between two states.

**Enumerated states** (the complete real set, plus one deferred and named [VISION] gaps):

| # | State | Kind | Depth |
|---|---|---|---|
| S0 | Presence | State | Level 1 |
| S1 | Attention-Expanded | State (in-place expansion of S0, no depth change) | Level 1 |
| S2 | Mission-Focused | State | Level 2 |
| S3 | Mission-Investigation (Evidence) | State | Level 3 |
| S4 | Evidence-Entry-Expanded | State (in-place expansion of S3) | Level 3 |
| S5 | Principal-Focused | State | Level 2 |
| S6 | Authorization-History-Investigation | State | Level 3 |
| S7 | Action-Confirming | State (overlay, not a route) | — (attaches to S2/S3) |
| S8 | Action-Result | State (transient) | — |
| S9 | Verification-Result | State (transient, updates S2/S3 in place) | — |
| S10 | Diagnostic | Mode | — (orthogonal) |
| S11 | Comparative-Focused | State `[REAL-DEFERRED]` | Level 2/3 |

S7–S9 are not places the user "goes" — they are transient states layered onto whichever subject-state (S2 or S3) triggered them, then resolve back into that subject-state with updated content. This distinction matters for the matrix in §9.

---

## 2. The default experience (S0 — Presence)

**Visible:** organization name, a single real state indicator (§7 of the Experience Architecture — a mark encoding the real chain/witness-verified fraction, not decoration), the attention list (§6 below) if non-empty, and real aggregate mission-state counts as secondary text.

**Deliberately hidden:** the full mission list, the full principal roster, any evidence field, any hash or signature, any authorization-decision detail. All of these exist and are real — they are hidden by design, not by absence of data, per Experience Architecture Principle 1.

**What changes dynamically:** the attention list's contents change **on each load or organization switch** — there is no live/push update mechanism in the runtime `[REAL constraint, not VISION — this is simply the current transport: the client fetches on navigation, it does not subscribe]`. Presenting Presence as if it updates in real time without the user acting would overclaim; it updates when the user (re)enters it.

**What constitutes "attention":** defined precisely in §6 — never a generic priority label, always a named real state.

**What constitutes "organizational change":** this is the one place the default experience runs into Open Question 5 (`POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` §14) squarely. "What changed since I was last here" requires knowing when "here" last was, for a specific viewer — and no persistent viewer/session identity exists. Two honest options, clearly distinguished:
- **[REAL-DEFERRED]** — a session-local, browser-only "since this tab was opened" marker (no server change, no identity model, resets whenever the tab/session ends). This does *not* touch Open Question 5.
- **[VISION]** — genuine "since your last visit," which requires the exact persistent-identity concept Open Question 5 leaves unresolved. **This document does not resolve that question and does not propose the REAL-DEFERRED option as a substitute for it** — it only distinguishes the two so a future mission doesn't conflate them.

**Primary interaction:** Select an attention item (→ S1 or directly → S2/S5, see §3).
**Secondary interaction:** switch organization (a global reset back to S0, scoped to the new organization).

---

## 3. Progressive disclosure — the formal sequence

The user-proposed sequence is **Presence → Focus → Context → Investigation → Action → Verification**. Checked against the Experience Architecture: this is architecturally correct with one clarification, not a replacement. "Focus" and "Context" are not two sequential depths — **Focus is the transition, Context is the depth it produces.** The Experience Architecture's depth model (§4 of that document) already named the destinations (Context, Forensics); this document makes explicit the transition that reaches each one, which is the missing precision the prior document didn't need but this one does:

```
Presence  --[Focus]-->  Context  --[Drill]-->  Investigation  --[Act]-->  Action  --[Verify]-->  Verification
   S0                    S2/S5                 S3/S6                       S7/S8                 S9
```

One structural correction to a naive linear reading: **Action is reachable directly from Context, not only after Investigation.** The real Mission Detail's Actions surface (transition/authorize/checkpoint) is a sibling of the Evidence investigation, not nested beneath it (`POA-BLD-003-DESIGN-ARTIFACT.md` §E's tab structure: Overview / Evidence / Actions, three siblings). A user can Act on a mission they've only reached Context-depth on, without ever drilling into its full evidence chain. The diagram above shows the common path; the actual graph has an additional edge, `Context --[Act]--> Action`, shown in the transition table below.

**Per-transition definition:**

| Transition | Trigger | Resulting state | Revealed | Hidden (still) | Available actions | Exit path |
|---|---|---|---|---|---|---|
| **Focus** | Select an attention item, a mission, or a principal | S2 or S5 | Subject's own state/origin/role/capabilities; its most recent actor | Full evidence, full decision history, raw hashes | Drill, Act, Return | Return → S0 |
| **Drill (from Context)** | Explicit request for full evidence or full decision history | S3 or S6 | Full evidence chain (7-facet model) or full authorization history | Nothing — this is maximum real density | Expand (S4), Act, Return | Return → S2/S5 |
| **Act (from Context)** | Transition / authorize / checkpoint initiated at S2 | S7 → S8 → (S9) | Confirmation content (org, capability, impact) → result | — | Confirm, cancel | Cancel → S2; Confirm → S8 |
| **Act (from Investigation)** | Same actions, initiated at S3 | S7 → S8 → (S9) | Same | — | Same | → S3 (updated) |
| **Verify** | Automatic after checkpoint, or explicit re-check | S9 (updates S2/S3 in place) | Updated Integrity/Verification facets | — | Return | Merges back into S2/S3 |
| **Expand** | Open one evidence entry's facets, in place | S4 (within S3) | That entry's Attribution/Integrity/Authority/Decision | Other entries stay collapsed | Collapse, Return | Collapse → S3 |
| **Return** | Explicit navigation up one level | The prior state in the chain | — | Deeper content re-hides | (whatever that state offers) | — |

---

## 4. Contextual transformations by subject

The user asks for seven subjects. Each is evaluated on its actual data shape, not given a uniform treatment:

| Subject | Behavior | Why |
|---|---|---|
| **Mission** | **Canvas transformation** (Focus → Context; Drill → Forensics) | A `Mission` is a real, self-contained, richly-attributed entity — the canonical case the shell/canvas model was built for |
| **Evidence** | **Drill-down**, nested under a Mission focus — not a standalone top-level subject | `EvidenceEnvelope`s have no existence independent of a mission (`missionId` is required); there is no "browse all evidence" concept in the runtime, so there is no independent focus mode for it |
| **Authorization** | **Side expansion / dual-entry facet** — surfaced within Mission-Investigation (per-decision, in an evidence entry) *and* within Principal-Focused/Investigation (aggregate history) | An `AuthorizationDecision` genuinely belongs to two subjects at once (a mission and a principal); it is not itself a subject you focus on independently, it is a fact you find by focusing on either of its real owners |
| **Execution** | **Two distinct real moments, not one state**: (a) an **Action state** (S7→S8) — something the user *does*; (b) an **evidence fact** (`ACTION_EXECUTED`, inspectable via Drill) — a record of something that *happened* | Conflating "executing" with "the record of execution" would blur an interactive control with a read-only historical fact — they have different real backings (`authorizeAndExecute()` vs. a stored envelope) |
| **Organization** | **No dedicated focus state — it is the frame, not a subject** | `Organization` has only `id`/`name`; there is nothing to drill into beyond what the shell's org-switcher already exposes and what Mission Control / People & Capabilities already scope by it. Treating Organization as a seventh focusable subject would invent a screen with no content of its own |
| **Repository** | **No transformation defined — `[VISION]`** | No in-runtime repository/version-history concept exists (confirmed in `POA-MOTHERSHIP-UX-ARCHITECTURE.md`'s grounding table). Inventing a plausible-looking drill-down here would be exactly the kind of fabrication both prior documents were written to prevent |
| **System state** | **Folded into Presence, no separate mode** | Only real aggregate counts exist; a layered "System Health Map" is `[VISION]`. System state is shell furniture (Experience Architecture §2), not a focusable subject |

---

## 5. Conversational transitions — real resolution vs. [VISION] understanding

**Critical distinction, stated once and enforced throughout this section:** every row below states what a *hypothetical* natural-language layer could honestly resolve to. **None of it claims such a layer exists.** No NLP, no intent parsing, no conversational engine exists in the runtime today — the presence of a shell command slot (Experience Architecture §2/§10) implies nothing about comprehension.

| Utterance | Resolves to (if the layer existed) | Status |
|---|---|---|
| "Show me this mission" | `Select(mission)` → S2 | Target is [REAL]; understanding the sentence is [VISION] |
| "Show me the evidence" | `Drill(current mission)` → S3 | Target is [REAL]; understanding is [VISION] |
| "What requires my attention?" | Render the real attention list (already S0 content) | Target is [REAL]; understanding is [VISION] |
| "Why was this authorization denied?" | `Select(mission)` + `Expand(the AUTHORIZATION_DECISION entry)` → S4, surfacing the real `reason` code | Target is [REAL]; understanding is [VISION] |
| "Why is this at risk?" | Only answerable if "risk" is scoped to mean *one of §6's named real attention reasons* — POA computes no risk score, no likelihood, no prediction | **Partially [VISION] even at the target**: the word "risk" itself must not be echoed back as if POA assessed risk. A real answer can only say *which named real condition* flagged the item |
| "What changed?" | Requires either the [REAL-DEFERRED] session-local marker or the [VISION] persistent-identity mechanism from §2 | **[VISION]** until at least the deferred version is built — there is no real target to resolve to today |

Four of six examples have a fully real target; one requires careful language scoping even if built; one has no real target at all yet. This table is the boundary of what a future conversational layer could honestly claim — not a proposal to build one.

---

## 6. Attention architecture — derived from real state, not badges

Per the instruction not to reduce this to priority labels: attention is derived from an actual severity ordering of real, already-computed conditions.

| Tier | Condition | Real source | Why this tier |
|---|---|---|---|
| **1 — Integrity compromised** | `chainVerified = false`, or witness `CHECKPOINT_MISMATCH` | `verifyChain()`, `verifyAgainstCheckpoint()` | The evidence record itself is in question — tampering or rollback was actually caught. Nothing is more severe than not being able to trust the record |
| **2 — Negative outcome** | `Mission.state = Failed`; an `AuthorizationDecision` with a denial reason | `Mission.state`, `AUTHORIZATION_DECISION.result` | A real negative event occurred, but the record of it is intact and trustworthy |
| **3 — Unresolved verification** | Witness `NO_CHECKPOINT` | `verifyAgainstCheckpoint()` | An absence, not a failure (per `witness.ts`'s own framing) — still needs action, but nothing has gone wrong |
| **4 — Staleness `[REAL-DEFERRED]`** | A mission `Created` with no subsequent evidence for an extended period | The first evidence entry's `payload.when` (already real, but explicitly "diagnostic only" per `evidence.ts` — usable for a client-side staleness heuristic, not for anything integrity-bearing) | Computable today with existing fields; not yet wired into an attention rule, and no staleness threshold has been decided |

Nothing above Tier 4 is proposed. "Newly evidenced" (something changed since a viewer's last visit) is **not** included as an attention tier here — it depends on the same unresolved viewer-identity question as §2/§5, and adding it as a tier would smuggle that resolution in through the back door.

---

## 7. Visual information hierarchy per state

| State | Primary (seconds) | Secondary (after attention) | Tertiary (only on investigation) |
|---|---|---|---|
| S0 Presence | Org state mark, attention count | Aggregate mission counts | — |
| S1 Attention-Expanded | Which subject, which tier (§6) | The one-line reason | — |
| S2 Mission-Focused | State, next legal action | Origin, most recent actor | — |
| S3 Mission-Investigation | Chain/witness verdict | Per-entry Integrity/Authority | Raw hashes, signatures, sequence numbers |
| S4 Evidence-Entry-Expanded | The Decision line (plain language) | Attribution, timestamps | Envelope hash, signature prefix |
| S5 Principal-Focused | Active/revoked, role | Granted capabilities | Engine/reasoning-intensity label |
| S6 Authorization-History | Granted vs. denied count | Per-decision list | Per-decision mission link |
| S7 Action-Confirming | What will happen, to what | Organization, capability | — |
| S8 Action-Result | Success/failure | Server-provided detail text | Raw response code |
| S9 Verification-Result | Updated Integrity/Verification badges | — | — |

This table is the direct mechanism for Experience Principle 1 ("complexity summoned, not displayed") — nothing in the Tertiary column is ever shown unless the state itself is S3/S4, which only exist because the user explicitly drilled there.

---

## 8. Motion / state transitions

Extending `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` §8 with the states named in §1 above — every entry still requires the same test: **does this motion communicate a real state change, or is it decoration?**

| Motion | Semantic trigger |
|---|---|
| Attention item appearing in S0's list | A mission actually entered one of §6's tiers |
| S0 → S1 (Attention-Expanded) | In-place reveal of one more real fact — no navigation, no page-level transition |
| S1/S0 → S2/S5 (Focus) | Canvas reframes around the selected subject — communicates "the frame changed," not "a new page loaded" |
| S2 → S3 (Drill) | Density increase — visually distinct from Focus (a reframe) because it is an *intensification*, not a change of subject |
| S3 → S4 (Expand) | One entry opening in place — the smallest-scale transformation in the model |
| Entering S7 (Action-Confirming) | Deliberate, non-decorative appearance — this state exists specifically to slow the user down before a consequential action; it should not animate quickly or playfully |
| S7 → S8 (Action-Result) | Reflects actual request latency (per Experience Architecture §8's nuance) — never a manufactured pause |
| S8/S9 merging back into S2/S3 | Badges update in place — no full re-render flash, so the user's position in the model is never lost |

---

## 9. Screen / state matrix

| State | Trigger | Purpose | Primary information | Secondary information | Actions | Exit | POA primitive |
|---|---|---|---|---|---|---|---|
| S0 Presence | Load / org switch | Answer "does anything need me" | Org state mark, attention list | Aggregate counts | Focus | (entry state) | `Organization`, aggregate `Mission`/`EvidenceEnvelope`/witness state |
| S1 Attention-Expanded | Expand on an S0 item | Preview before committing to Focus | Subject id, tier, one-line reason | — | Focus, Collapse | Collapse → S0 | Same as S0, filtered to one item |
| S2 Mission-Focused | Focus(mission) | Understand one mission's current state | State, next legal action | Origin, most recent actor | Drill, Act, Return | Return → S0/S1 | `Mission` |
| S3 Mission-Investigation | Drill(mission) | Full evidentiary review | Chain/witness verdict, per-entry facets | Attribution details | Expand, Act, Return | Return → S2 | `EvidenceEnvelope[]`, `verifyChain()` |
| S4 Evidence-Entry-Expanded | Expand(entry) | Inspect one fact fully | Decision line, Integrity/Authority | Timestamps, attribution | Collapse, Return | Collapse → S3 | One `EvidenceEnvelope` |
| S5 Principal-Focused | Focus(principal) | Understand one identity | Role, active state, capabilities | Engine/reasoning label | Drill, Return | Return → S0 | `ExecutionPrincipal` |
| S6 Authorization-History | Drill(principal or org) | Review granted/denied pattern | Granted vs. denied count, list | Per-decision mission link | Return | Return → S5 or S0 | `AuthorizationDecision[]` (aggregate) |
| S7 Action-Confirming | Act (from S2 or S3) | Prevent unintended consequential action | What/to what/under what capability | Organization, requester | Confirm, Cancel | Cancel → origin state | The pending `transitionMission`/`authorizeAndExecute` call |
| S8 Action-Result | Confirm from S7 | Communicate outcome | Success/failure, real detail text | Raw response code | Return | → origin state | `RuntimeResult` |
| S9 Verification-Result | Automatic after checkpoint, or explicit re-check | Confirm integrity after an action | Updated Integrity/Verification badges | — | Return | Merges into S2/S3 | `verifyMission()` |
| S10 Diagnostic (Mode) | Navigate to Diagnostics | Verify isolation enforcement (security tool, not org-state) | Attempt result (allowed/denied) | Requested org, target org | Attempt again | Leave Diagnostic Mode | `getEvidence()`'s isolation guard |
| S11 Comparative-Focused `[REAL-DEFERRED]` | Focus two same-type subjects | Direct comparison | Both subjects' Primary facts side by side | Both subjects' Secondary facts | Drill either, Return | Return → S0 | Two `Mission` or `ExecutionPrincipal` |
| *(no state)* Repository focus | — | — | — | — | — | — | **`[VISION]`** — no primitive exists |
| *(no state)* System Health Map | — | — | — | — | — | — | **`[VISION]`** beyond S0's real aggregate |

---

## 10. Architectural boundary

Every state above is either **[REAL]** (S0–S10), **[REAL-DEFERRED]** (S11, the Tier-4 staleness rule, the session-local "changed" marker), or explicitly absent and marked **[VISION]** (Repository, System Health Map, any state implying risk-scoring, prediction, or comprehension of natural language).

**This document does not resolve Open Question 5** (`POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` §14: whether POA should gain a persistent viewer/session identity). Every place that question was relevant here (§2's "organizational change," §5's "what changed," §6's explicit exclusion of "newly evidenced" as a tier) treats it as **still open** and routes around it rather than through it. **No "Acting As" runtime model is introduced anywhere in this document** — S2/S3's Act transitions still require selecting a principal per action, exactly as the current implementation does, and this document proposes no change to that.

---

## 11. Final test

Applied to two representative states, to demonstrate the model actually answers the required six questions — not just asserts that it does:

**S3, Mission-Investigation, reached by Drill(mission-w) from S2:**
- *Where am I?* Investigation depth, Mission Control lineage.
- *What am I looking at?* mission-w's complete evidence chain.
- *Why am I seeing it?* I explicitly drilled from mission-w's focused view.
- *What can I do from here?* Expand any entry (S4), Act on the mission (S7), or Return to S2.
- *What will change if I act?* A new evidence entry is appended; the mission's state may transition; S9 will reflect the updated Integrity/Verification result.
- *How will POA verify the result?* `verifyChain()` and the witness comparison, surfaced as S9.

**S7, Action-Confirming, reached by Act(checkpoint) from S3:**
- *Where am I?* A confirmation overlay attached to mission-w's investigation.
- *What am I looking at?* The specific consequential action about to run, its organization, and its scope.
- *Why am I seeing it?* Checkpointing is consequential enough to require confirmation, per Experience Architecture §9's disclosure rules.
- *What can I do from here?* Confirm or cancel.
- *What will change if I act?* The witness store records a new checkpoint against the current evidence head.
- *How will POA verify the result?* The very next state, S9, is that verification.

**Flag for review, per the instruction to surface conventional navigation where a transformation would be more appropriate:** the current implementation reaches S2/S3 (Focus, Drill) via hash-route navigation (`#/missions/:id`), not in-place canvas transformation. Every state in this model is defined independent of that implementation detail, but the *actual* transition today is closer to "go to another page" than "the canvas reorganizes around you." This was already noted as an implementation question in `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md` §5 and is restated here because this document's Focus/Drill/Expand vocabulary makes the gap concrete: **S2→S3 (Drill) and S0→S2 (Focus) are the two transitions most worth reimplementing as true in-place transformations, rather than route changes, when implementation resumes.** This is flagged for the next stage, not decided here.

---

**This document introduces no new POA ontology, no implementation code, and no visual redesign.** It is the direct input to Mothership Interaction & Visual System Design.
