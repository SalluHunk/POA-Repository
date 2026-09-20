# POA Mothership Experience Architecture

**Status:** Formal experience-architecture document. No implementation code. No new POA entities, capabilities, authority, workflows, or runtime assumptions are introduced anywhere below.

**Source of truth (unmodified by this document):** `POA-BLD-003-DESIGN-ARTIFACT.md` (screen inventory, design system, information architecture) and `POA-MOTHERSHIP-UX-ARCHITECTURE.md` (the REAL/[VISION] grounding discipline this document continues to use). This document formalizes the *experience model* — shell, canvas, depth, transitions, motion, interaction grammar — that those two documents' screens and data populate. It does not redesign screens or restate the design system; it explains how a user moves through them.

**Reference note:** the design-mockup link supplied (`claude.ai/design/p/...`) could not be opened — `Claude_Docs.read` returned an access-denial ("not shared, or no doc has this id"). This document is grounded instead in the written specification and the reference concept image already reviewed earlier in this session, which corresponds closely to the same source material (Attention Array, Decision Canvas, Evidence Explorer language).

Legend (unchanged from `POA-MOTHERSHIP-UX-ARCHITECTURE.md`):

| Marker | Meaning |
|---|---|
| **[REAL]** | Backed by a ratified POA primitive and/or already implemented |
| **[REAL-DEFERRED]** | Backed by real data today; not yet designed/built, but requires no new architecture to build |
| **[VISION]** | No current architectural backing; requires a future decision mission before implementation |

---

## The central test

> Does this feel like operating an organization, or does it merely feel like using a dashboard?

Every section below is written against this test, not against visual appeal.

---

## 1. Experience Principles

1. **Complexity is summoned, not displayed.** Nothing appears because it might be useful; it appears because the user asked a question that requires it.
2. **The shell orients; the canvas explains.** The shell never changes meaning — it always answers "where am I, as whom, in which organization." All explanation of a specific subject lives in the canvas.
3. **Depth is chosen, not scrolled into.** Moving from Presence to Context to Forensics is always a deliberate act (a click, a drill, a command) — never an accident of a long page.
4. **Every transition preserves origin.** The user can always answer "how did I get here" and return to exactly where they were — no dead ends, no lost context (this generalizes BLD-003's breadcrumb requirement to the whole canvas, not just Mission Detail).
5. **Integrity and Authority remain distinct at every depth**, per `POA-BLD-003-DESIGN-ARTIFACT.md` §D.6 — this document does not relitigate that decision, only confirms it survives the shell/canvas reframing (§4, §11 below).
6. **State is never implied it wasn't earned.** A capability, a verification, a confidence — none of it is shown unless the runtime actually computed it. This is `POA-MOTHERSHIP-UX-ARCHITECTURE.md`'s REAL/[VISION] discipline, restated as an experience rule rather than a documentation convention: **the UI must never imply a [VISION] capability already exists**, in interaction as much as in content.
7. **Calm is the default state, not an achievement.** Level 1 does not need to justify its minimalism by promising more is coming — minimalism is correct when nothing needs attention.

---

## 2. Stable Shell Architecture

The shell is everything that does **not** transform as the user moves through depths. It answers identity and location questions; the canvas answers subject questions.

| Shell element | Status | Notes |
|---|---|---|
| POA identity mark | [REAL] | A static, non-interactive mark (BLD-003 §G's glyph discipline — no animated orb; see §7 below) |
| Organization context | [REAL] | The organization picker — already the one persistent context-switcher in the current implementation |
| User identity / authority context | **[VISION — gap, not a design choice]** | **The runtime today has no concept of "who is operating this UI right now."** `ExecutionPrincipal` selection happens per-form, per-action (a dropdown on each transition/authorize form), not as a standing session identity. The shell cannot display a real "acting as X, authorized for Y" indicator until this gap is closed — see Open Question 5 (§14). Until then, the shell must not fabricate a persistent identity indicator; it should either omit this element or label it honestly as "no active session — select an identity per action," which is what the current implementation already, correctly, does |
| System state | [REAL, minimal] | Not a System Health Map ([VISION], per `POA-MOTHERSHIP-UX-ARCHITECTURE.md`'s grounding table) — only the real aggregate already computed (chain/witness verification counts, mission-state counts). A single word or glyph, not a dashboard panel |
| Global navigation | [REAL] | BLD-003 §B.2's three items (Executive, Mission Control, People & Capabilities) plus a Diagnostics affordance — unchanged |
| Conversational entry point | **[VISION slot, REAL-honest fallback]** | The *position* for this element in the shell is architecturally reserved now (per the user's explicit requirement that it be a stable element), but its *behavior* is [VISION] — no natural-language engine exists. Until built, this slot must either (a) not render at all, or (b) render as a structured, honestly-scoped command affordance (e.g., "jump to mission by ID" — a real, simple lookup), never as a conversational input that implies understanding it doesn't have. Presenting an inert or keyword-matched box as "Ask POA anything" would violate Principle 6 |

---

## 3. Contextual Canvas Architecture

The canvas is the **single dynamic region** of the interface. Unlike a conventional dashboard (many permanent, simultaneously-visible panels), the canvas holds exactly one primary subject at a time, at one depth.

**Canvas states:**

| State | Trigger | Content |
|---|---|---|
| **Idle** | No subject selected (shell just loaded) | Level 1 Presence content only — real aggregate + attention list |
| **Focused** | A subject is selected (a mission, a principal, an attention item) | Level 2 Context content for that subject |
| **Drilled** | The user explicitly requests deeper investigation of the focused subject | Level 3 Forensics content, still scoped to the same subject |
| **Comparative** `[REAL-DEFERRED]` | Two subjects of the same type are selected together (e.g., two missions) | Not built today, not designed by BLD-003, but requires **no new data** — both subjects already have identical, real API shapes. This is deferred by choice, not blocked by architecture; it is *not* [VISION] |

The canvas never holds two *unrelated* subjects at once (e.g., a mission and an unrelated principal side by side) — that would reintroduce the "many permanent cards" pattern this document exists to avoid. Comparative state is the one deliberate exception, and only for same-type subjects being explicitly compared.

---

## 4. Three Experience Depths

### Level 1 — Presence `[REAL]`

Exactly BLD-003's redesigned Executive Home: organization state, the severity-ranked attention list, real aggregate counts. No permanent chart, no KPI wall — this document adds no new content here, only confirms the shell/canvas split applies: Level 1 is the canvas's **idle state**.

### Level 2 — Context `[REAL]`

Activated by selecting an attention item, a mission, or a principal. The canvas reorganizes around that subject:

- A mission subject surfaces: its state, origin, evidence *count* (not the full chain), the identity that most recently acted on it, and its one currently-legal next action.
- A principal subject surfaces: role, engine label, active/revoked status, granted capabilities.
- Related subjects appear **contextually, not exhaustively** — e.g. a mission's Context view names the principal who acted on it (real: `producerId`) without pulling in that principal's entire roster entry; a full principal view is a separate, deliberate focus-shift (§6), not an automatic sibling panel.

This is real data already specified as BLD-003's "Overview" tab — reframed here as "Level 2," not as a new tab.

### Level 3 — Forensics `[REAL]`

Only entered by explicit request from Level 2. High density is earned here, per the user's own instruction — this is where BLD-003's full evidence chain (§D.6's seven-facet model), the complete authorization-decision history, and the Isolation Check diagnostic all live. Nothing here is hidden by ambiguity — a user who drills to Level 3 gets the full, real, dense record, including the explicitly-labeled gaps (`AND POA-MOTHERSHIP-UX-ARCHITECTURE.md`'s "not yet available" placeholders for Observation/Analysis/Learning).

---

## 5. State-Transition Model

`Presence → Context → Investigation → Decision/Action → Verification → Memory`

| Stage | Real trigger | Status |
|---|---|---|
| Presence | Home loads, canvas idle | [REAL] |
| Context | User selects an attention item or mission; canvas focuses | [REAL] |
| Investigation | User drills into evidence/history; canvas depth increases to Level 3 | [REAL] |
| Decision/Action | User transitions a mission or authorizes-and-executes an action | [REAL] — this is literally `transitionMission`/`authorizeAndExecute` |
| Verification | Chain/witness check runs; result shown as Integrity/Verification facets | [REAL] — `verifyChain()` + witness comparison |
| Memory | *(see below)* | **[VISION], with one REAL component** |

**Memory** is the one stage in this model without a genuine architectural home. The closest real proxy is that the evidence chain itself is a **durable, immutable record** — nothing is forgotten, in the narrow sense that past evidence remains inspectable forever (this is [REAL] — it is exactly what the hash chain guarantees). But there is no mechanism by which a past outcome *changes* a future recommendation, ranking, or default — no learning loop exists. This document takes the same position as `POA-MOTHERSHIP-UX-ARCHITECTURE.md`: the durable record is real; any *use* of it to adapt future behavior is [VISION] and is not implied anywhere in this experience model.

**On page navigation vs. transformation:** the user's brief explicitly asks that the interface not assume every transition requires traditional navigation. The current implementation is a hash-routed single-page app — technically a "navigation" at the URL level for Context/Investigation transitions, but with no full page reload and shared shell/state throughout, which is the substance of what "transformation, not navigation" is asking for. Whether to further collapse Context/Investigation into in-place DOM transformation (vs. the current route-per-depth pattern) is an implementation decision, not an experience-architecture one, and is left to the next implementation phase rather than decided here.

---

## 6. Interaction Grammar

The verbs available to a user, each graded by real backing:

| Verb | Meaning | Status |
|---|---|---|
| **Select** | Choose a subject from Level 1/2 to focus the canvas on | [REAL] |
| **Expand** | Reveal one additional fact about the current subject without changing depth (e.g., opening one evidence entry's facets) | [REAL] |
| **Drill** | Move the canvas from Context to Forensics for the current subject | [REAL] |
| **Return** | Move back up one depth, preserving the subject | [REAL] — the breadcrumb pattern already specified in BLD-003 |
| **Compare** | Focus the canvas on two same-type subjects at once | [REAL-DEFERRED] — see §3 |
| **Act** | Trigger a consequential state change (transition, authorize, checkpoint) | [REAL] |
| **Ask** | Issue a natural-language command that resolves to one of the above verbs | **[VISION]** — see §10 |

Every verb except **Ask** resolves to a real, already-implemented server call. This table is also the honest boundary of what "conversational interaction" could ever mean here without new architecture: a working conversational layer would be a natural-language *front end* to this same verb set, not a separate capability.

---

## 7. Spatial Visualization Principles

Per the explicit instruction: a spatial object must represent an actual POA concept or relationship, never decoration.

| Object | What it must represent | Status |
|---|---|---|
| Organization state mark | The real distribution of mission states and verification results — e.g., a ring whose completeness reflects the real chain/witness-verified fraction, not an abstract "energy level" | [REAL] — this replaces the earlier vision document's more speculative "Organizational Intelligence Core" framing with a concrete, countable encoding |
| Attention items | Real severity-ranked list entries (§4, Level 1) | [REAL] |
| Evidence entries "entering" a chain | The real, literal order in which `EvidenceEnvelope`s were appended (`sequence`) | [REAL] |
| Mission position/grouping in any future landscape view | Real state + real severity, per `POA-MOTHERSHIP-UX-ARCHITECTURE.md`'s Mission Universe treatment | [REAL-DEFERRED] |

**Explicitly rejected:** glowing spheres, orbiting planets, avatars, or any object whose form is chosen for futurism rather than encoding. If a future spatial object cannot be described as "this shape/position IS this real number/relationship," it does not belong in the system, regardless of how it tests visually.

---

## 8. Animation / Motion Principles

Each example from the brief, mapped to its real trigger:

| Motion | Real trigger | Status |
|---|---|---|
| Healthy = restrained ambient motion | No Failed/unverified/denied items in the attention list | [REAL] |
| Attention = focused pulse | A new item enters the attention list | [REAL] |
| New evidence = node entering the field | A new `EvidenceEnvelope` is appended (real `sequence` increment) | [REAL] |
| Execution = visible progression | A mission transitions `Running` → `Succeeded`/`Failed` | [REAL] |
| Authorization = requested → evaluated → granted/denied | `authorizeAndExecute`'s real sequence: capability requested, `AuthorizationDecision` evaluated, `AUTHORIZATION_DECISION` evidence recorded | [REAL], **with one implementation nuance**: today's API call is synchronous — request and decision resolve in one round trip, so there is no real "evaluating…" interval to animate. Building a visible three-beat animation (requested → evaluating → decided) would currently be simulating a delay that doesn't exist. The transition should reflect actual latency, not manufacture a pause for effect — if the real call is fast, the animation should be too. |
| Verification = visible independent confirmation | `checkpointMission`/witness comparison completing | [REAL] |

No animation in this system is decorative; every one above is a state-change already computed by the runtime, given visible form.

---

## 9. Progressive-Disclosure Rules

1. Level 1 shows only the real attention list and real aggregate counts — never a raw enumeration of all missions/principals.
2. Nothing below Level 1 is expanded by default; every additional fact requires an explicit Select/Expand/Drill.
3. Raw technical fields (envelope hashes, signatures, prevHash) appear only at Level 3.
4. A "not yet available" placeholder (for [VISION] gaps like Observation/Analysis/Learning) is shown only where the user has explicitly drilled to the point that gap would matter — never surfaced proactively at Level 1/2, where it would just be noise.
5. No content changes on screen without a user-initiated action (no silent auto-refresh reshuffling the attention list while it's being read) — calm by default extends to *stability* of what's currently shown, not just to sparse initial content.

---

## 10. Conversational Interaction Model

Per §2 and §6: the *slot* is stable shell furniture; the *capability* is [VISION]. This section defines what would need to be true for it to become real, without proposing to build it:

- A conversational layer, if built, would be a natural-language front end to the Interaction Grammar (§6) — it would resolve an utterance to `Select`/`Expand`/`Drill`/`Compare`/`Act`, all of which already exist. It would **not** be a separate reasoning system that answers questions the runtime can't already answer.
- It could not honestly answer anything the runtime doesn't compute today — e.g., it could resolve "show me mission-w" to a real `Select`, but could not honestly answer "why will this mission succeed" (no such judgment exists anywhere in the runtime).
- Until built, the shell's reserved slot is either absent or a structured, real lookup (§2) — never a chat-shaped input that implies comprehension it doesn't have.

This is the single clearest application of Principle 6 in the whole document: the temptation to make the product *feel* conversational is exactly where a [VISION] capability is most easily implied by accident.

---

## 11. Screen / State Inventory

Reframed from BLD-003's screen list into shell+canvas+depth terms (this is a re-description, not a new inventory):

| Shell + Canvas state | Depth | Corresponds to (BLD-003) |
|---|---|---|
| Canvas idle | Level 1 | Executive Home |
| Canvas focused: mission | Level 2 | Mission Detail — Overview tab |
| Canvas drilled: mission | Level 3 | Mission Detail — Evidence tab |
| Canvas focused: organization roster | Level 2 | People & Capabilities — roster table |
| Canvas drilled: authorization history | Level 3 | People & Capabilities — decision history panel |
| Canvas comparative: two missions | Level 2/3 (deferred) | Not yet designed — §3 |
| Diagnostic mode | *(orthogonal to the depth model)* | Isolation Check — a security-verification tool, not an organizational-state experience; it deliberately does not participate in Presence/Context/Forensics because it answers a different question ("is isolation enforced," not "what is the state of my organization") |

---

## 12. Mapping to Real POA Primitives

| Experience concept (this document) | Real POA primitive |
|---|---|
| Shell "organization context" | `Organization` |
| Shell "system state" | Aggregate `chainVerified`/witness-code counts across `listMissions()` |
| Canvas "mission subject" | `Mission` + its `EvidenceEnvelope[]` |
| Canvas "principal subject" | `ExecutionPrincipal` + capability grants |
| Level 2 "current phase / next action" | `Mission.state` + the lifecycle state machine's legal-transition set |
| Level 3 "evidence chain" | `EvidenceEnvelope[]`, `verifyChain()` |
| "Verification" transition stage | `verifyMission()` (chain + witness) |
| "Decision/Action" transition stage | `transitionMission()` / `authorizeAndExecute()` |
| "Attention list" | Derived, client-side, from real mission/evidence/witness state — no new server field required |

Nothing in this document requires a new field, endpoint, or entity beyond what BLD-002/BLD-003 already established.

---

## 13. Explicit [VISION] Boundary

Consolidated from the sections above — none of the following exist today, none are proposed for implementation by this document, and the UI must never render as if they do:

- Natural-language conversational engine
- Decision as a scored, simulatable first-class entity (confidence, alternatives, "what would change this")
- Impact simulation
- Organization Graph / Digital Twin
- Predictive intelligence / autonomous chief-of-staff behavior
- A learning/memory loop that adapts future behavior from past outcomes
- Animated "intelligence core" objects not tied to a real, countable value
- Observation, Analysis, and Learning as evidence-chain steps (only Evidence, Decision, Action, and terminal-state-as-Outcome exist)

---

## 14. Open Architectural Questions (for future missions, not decided here)

Carried forward from `POA-MOTHERSHIP-UX-ARCHITECTURE.md` (unchanged, not re-litigated):

1. Should POA gain a first-class **Decision** entity beyond the binary `AUTHORIZATION_DECISION`?
2. Should **reasoning intensity** become a structured field, replacing the free-text `engine` string?
3. Should the evidence model gain **Observation**, **Analysis**, and **Learning** as first-class types?
4. Is an **Organization Graph / Digital Twin** in scope for POA at all?

New, surfaced by this document:

5. **Should POA gain a persistent viewer/session identity concept?** This document's shell architecture (§2) exposed a genuine gap: there is no runtime concept of "who is currently operating this interface" distinct from "which principal is named in this specific form submission." Today's per-action principal dropdown is honest (it never implies an authenticated session that doesn't exist), but it also means the shell cannot display a real "acting as" indicator — a piece of stable-shell furniture the user's own brief calls for. This is not decided here; it would need its own scoping (is this authentication, or merely a UI-remembered default principal with no security implication?) before any implementation.
6. **Should Comparative canvas state (§3) be scoped for the next implementation phase?** It requires no new architecture, only a decision about priority — named here so it isn't lost, not because it needs a decision mission.

---

**This document contains no implementation code and introduces no new POA entity, capability, authority, workflow, or runtime assumption.** It formalizes how a user moves through the real, already-ratified system described by `POA-BLD-003-DESIGN-ARTIFACT.md` and `POA-MOTHERSHIP-UX-ARCHITECTURE.md`.
