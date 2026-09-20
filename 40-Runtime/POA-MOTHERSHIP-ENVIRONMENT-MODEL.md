# POA Mothership Environment Model

**Status:** Formal environment model, integrated into the Interaction & Visual System Design stage. No implementation code. No new POA ontology. No new visual language — this document reuses the color/typography/glyph tokens already established in `POA-BLD-003-DESIGN-ARTIFACT.md` §D and `POA-MOTHERSHIP-UX-ARCHITECTURE.md` §E, and specifies only the *arrangement and behavior* of one new focal object (§3) built entirely from those existing tokens.

**Reference note:** the message describing this direction referenced an attached concept image; no image file was present in what I received. This document is built from the written description alone. If the image matters, please resend it.

**Source of truth (unmodified):** `POA-BLD-003-DESIGN-ARTIFACT.md`, `POA-MOTHERSHIP-UX-ARCHITECTURE.md`, `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md`, `POA-MOTHERSHIP-EXPERIENCE-STATE-MODEL.md`. This document does not discard any of them — it reframes the shell/canvas/state model around a single ordering principle (Organization → Intelligence Core → Contextual Field → Informational Surfaces → Investigation → Action → Learning) and answers one specific question the prior documents didn't pose directly: **how does the environment change when the user's intent changes.**

Legend (unchanged): **[REAL]** · **[REAL-DEFERRED]** · **[VISION]**.

---

## 0. What is actually changing here

Nothing in the underlying architecture changes. What changes is the **ordering principle** the prior documents' pieces are read through:

- The **Canvas** (Experience Architecture §3) is renamed, in this document only, the **Contextual Field** — same concept, same states (S0–S11 in the State Model), no new mechanics.
- The **Shell**'s org-state mark + attention list + command slot (Experience Architecture §2, State Model §2) are consolidated into one named focal object, the **Intelligence Core** (§3 below) — this *is* new, but only as an arrangement of already-real elements, not a new capability.
- "User intent" is defined precisely, and restrictively, as **the set of real interaction-grammar verbs already enumerated** (State Model §1, §3) — **not** natural-language intent. This is the load-bearing distinction in the whole document: the brief's own vocabulary ("conversation, intent, and investigation should cause the environment to reconfigure") is honored for *investigation* (real) and *structured intent* (real), and explicitly not yet honored for *conversation* (VISION) — see §6.

**On the reference image:** per the explicit instruction, the *interaction philosophy* is extracted (a central focal point, peripheral information emerging around it, contextual reconfiguration rather than page navigation) — not any literal visual motif. No humanoid figure, avatar, or presentation-room imagery appears anywhere in this document, and none is proposed.

---

## 1. Why "dashboard with an AI assistant" is rejected — and what's already true

The prior documents already moved away from a card-wall dashboard: BLD-003 redesigned Home around a single ranked attention list (not a KPI grid), and the Experience Architecture's shell/canvas split already meant only one dynamic region exists, not many permanent panels. What this document adds is the missing piece: **a single named focal point that the rest of the environment is arranged around**, rather than an unordered set of "the shell has these five things" (Experience Architecture §2's table, which listed shell elements without an ordering principle between them).

The rejected pattern — `Sidebar → Dashboard → Cards → Detail Page → Modal` — never fully existed in this system (there was never a sidebar), but two of its habits did survive into BLD-003/Experience Architecture and are corrected here:
- Three peer navigation items (Home / Mission Control / People & Capabilities) read as **three separate destinations of equal weight** — closer to a nav bar than to "one core, with surfaces emerging from it."
- S7 (Action-Confirming) was described as "an overlay, not a route" but not yet specified as *emerging from* the subject rather than interrupting it like a modal.

Both are corrected in §3–§4 below, without inventing any new data or capability.

---

## 2. The pipeline, mapped

`Organization → Intelligence Core → Contextual Field → Informational Surfaces → Investigation → Action → Learning`

| Pipeline stage | What it is | Status | Corresponds to |
|---|---|---|---|
| **Organization** | The frame everything renders within | [REAL] | Unchanged from State Model §4 — Organization is still not a focusable subject, it is the scope |
| **Intelligence Core** | The single focal object — real state summary + real attention list + a structured command slot | [REAL] object; [VISION] "intelligence" | §3 below |
| **Contextual Field** | The one dynamic region that reorganizes around a selected subject | [REAL] | = the Canvas, renamed (Experience Architecture §3, State Model S2–S6) |
| **Informational Surfaces** | The specific facts that emerge within the Field for a given subject/depth | [REAL] | = State Model §7's Primary/Secondary/Tertiary content per state |
| **Investigation** | Maximum real density, explicitly entered | [REAL] | = State Model S3/S6 (Drill) |
| **Action** | Consequential state change, confirmed before it runs | [REAL] | = State Model S7/S8 |
| **Learning** | A loop that adapts future behavior from past outcomes | **[VISION]** | Exactly the same gap as "Memory" in the Experience Architecture's state-transition model (§5 of that document) — renamed by the new brief, not made real by the rename |

**Learning is not accepted as real just because this pipeline names it as a terminus.** The durable-record argument from the Experience Architecture (the evidence chain persists, but nothing adapts from it) applies unchanged. This document does not propose to build it.

---

## 3. The Intelligence Core, precisely defined

**What it is (all real today):**

1. The organizational state mark (Experience Architecture §7 — a shape encoding the real chain/witness-verified fraction, never an abstract "energy level").
2. The real, severity-tiered attention list (State Model §6 — four tiers, all derived from `chainVerified`, witness codes, mission state, and authorization-decision results).
3. A structured command slot (Experience Architecture §2/§10) — a real, honest lookup (e.g., jump to a mission by id), not a conversational input.

**What it explicitly is not:**

- Not a character, avatar, face, or personality.
- Not a system that understands language, infers intent, or reasons about the organization.
- Not a single "chat window" — its command slot, if built, resolves structured input to the same real verbs every other interaction uses (§6).

**Its architectural role — "primary interaction surface":** every Focus transformation (State Model §3) now has exactly one point of origin: the Core. Concretely:

- Selecting an attention item *on* the Core → Focus (State Model S0→S1→S2/S5), exactly as before.
- Issuing a structured command *through* the Core's slot → the same Focus transformation, reached by a different input method, resolving to an identical real state.
- **Browsing without a specific target** (e.g., "show me every mission," "show me the full roster") is still a real, legitimate need that attention-tiering does not cover — not everything reduces to "what's flagged." This document names two **Informational Surfaces** that exist for exactly this reason and are reached *from* the Core (via its command slot or an explicit "browse" affordance on the Core itself), not as independent, permanently-visible navigation tabs:
  - **Overview Surface** — the full mission list (was: Mission Control as a standalone nav destination)
  - **Roster Surface** — the full principal list (was: People & Capabilities as a standalone nav destination)

This is the one real architectural change in this document: **three peer nav tabs collapse into one Core plus two on-demand surfaces reachable from it.** Nothing about the surfaces' own content changes — BLD-003's Mission Control and People & Capabilities specifications are unmodified; only their relationship to the shell (peer tabs vs. Core-originated surfaces) changes.

---

## 4. The Contextual Field

Unchanged in mechanics from Experience Architecture §3 / State Model S2–S11 — renamed only. It holds exactly one subject (or, in the deferred Comparative state, two same-type subjects) at one depth, and reconfigures — never accumulates additional permanent panels — as the subject or depth changes.

---

## 5. Informational Surfaces, Investigation, Action

No new specification beyond State Model §7 (the Primary/Secondary/Tertiary table) and §9 (the full state matrix). This document's contribution is purely the framing: these are described as **surfaces that emerge within the Field when summoned**, not pages a user navigates to find. The mechanism producing them (Focus/Drill/Expand) is identical to before.

**On Action specifically, the "modal" correction:** S7 (Action-Confirming) is respecified here as **emerging within the Contextual Field, anchored to the subject it concerns** — not a screen-centered dialog interrupting the whole environment. A modal, by convention, blocks and centers itself irrespective of subject; an emerging confirmation stays visually attached to the mission or principal it concerns, consistent with Principle 4 ("every transition preserves origin," Experience Architecture §1). This is a presentation refinement of an already-real state, not a new one.

---

## 6. The critical question: how does the environment change when intent changes?

"Intent" here means exactly the Interaction Grammar's real verbs (State Model §1/§3) — never inferred natural-language meaning. For each:

| Intent (real verb) | Core | Contextual Field | Surfaces that emerge | Surfaces that recede |
|---|---|---|---|---|
| **(none — idle)** | Shows real attention summary | Idle (S0 content, folded into the Core itself — see note below) | — | Everything but the Core stays quiet |
| **Select** an attention item or a Core-issued lookup result | Recedes to a compact persistent presence (still visible, no longer the sole focus) | Focuses on the subject (S2/S5) | The subject's Level-2 facts (State Model §7) | Any previously-focused subject's facts |
| **Drill** | Stays compact | Increases density (S3/S6) | Full evidence chain or decision history | Nothing — Investigation adds, it doesn't replace, the Context facts already shown |
| **Expand** | Unchanged | One entry opens in place (S4) | That entry's full facet set | Other entries stay collapsed, unaffected |
| **Act** | Unchanged | An emerging confirmation attaches to the subject (S7, §5) | What/to-what/under-what-capability | — |
| *(confirm)* | Unchanged | Result appears in place (S8), then Verification (S9) | Updated Integrity/Verification badges | The confirmation itself |
| **Return** | Unchanged | Steps back one depth or to idle | The prior state's facts re-emerge | The deeper facts just shown recede |
| **Compare** `[REAL-DEFERRED]` | Unchanged | Holds two same-type subjects (S11) | Both subjects' Primary/Secondary facts, side by side | Any single-subject focus |
| **Ask (structured, real fallback)** | Slot accepts input, resolves to a real lookup | Same as **Select**, once resolved | Same as **Select**'s target | Same as **Select** |
| **Ask (natural language)** | **[VISION]** — no such capability exists | — | — | — |

**Idle-state note:** the State Model's S0 (Presence) content — org state, attention list — is now understood as content rendered *by the Core itself*, not a separate canvas state the Core points at. This is the one place this document's reframing changes which document "owns" a piece of content: S0 was previously canvas content; it is now Core content, with the Contextual Field genuinely idle (empty) until a Focus occurs. This is consistent with, not contradictory to, the State Model — S0's real data sources are unchanged, only which conceptual region renders them.

---

## 7. Explicit [VISION] boundary (reaffirmed, not expanded)

Unchanged from the Experience Architecture (§13) and State Model (§10), with one addition specific to this document's own vocabulary:

- **"Conversation" as a mechanism for reconfiguration is [VISION] in its understanding layer**, exactly as "Ask" was in the State Model §5 — this document's "Ask (structured, real fallback)" row above is the entire honest real surface area; "Ask (natural language)" has zero backing.
- **"Learning" is [VISION]**, per §2 above — carried forward from "Memory," not newly authorized by this document's renaming.
- No humanoid, avatar, or agent-personality visual is proposed anywhere in this document, regardless of the reference material's imagery.

---

## 8. Integration with the Interaction & Visual System Design stage

This document supplies the **interaction-philosophy spine** for that stage. It does not itself specify new visual tokens: the Intelligence Core's real-data elements (§3.1–3.3) are rendered using the color/typography/glyph system already defined in `POA-BLD-003-DESIGN-ARTIFACT.md` §D and extended in `POA-MOTHERSHIP-UX-ARCHITECTURE.md` §E — no new palette, no new typeface, no new motion primitive is introduced here. The remaining work for that stage, not done in this document, is narrow and concrete:

1. The Core's compact/expanded visual states (§6's "recedes to a compact persistent presence") — a layout specification, not a new design system.
2. The emerging-confirmation's exact anchoring behavior (§5) relative to its subject — an interaction-choreography detail.
3. Whether the Overview/Roster surfaces (§3) are reached via a visible affordance on the Core or only via the command slot — an open design decision, not an architectural one.

---

## 9. Open questions (carried forward, none resolved here)

Unchanged from the Experience Architecture (§14) and State Model (§10) — Decision-as-entity, structured reasoning-intensity, Observation/Analysis/Learning as evidence types, Organization Graph, and the still-unresolved persistent viewer/session identity question. **No "Acting As" runtime model is introduced.** One addition:

7. **Should the Overview/Roster surfaces (§3) remain reachable only from the Core, or also via a minimal always-visible affordance (e.g., a small persistent link) for users who prefer direct browsing over the Core-first flow?** This is a usability question for the next design pass, not an architectural one — named here so it isn't decided by default omission.

---

**This document introduces no new POA entity, capability, authority, workflow, or runtime assumption, and no new visual language.** It reframes the existing shell/canvas/state architecture around one focal object and answers, concretely, how the environment reconfigures under every real user intent available today.

---

*Session note: cost is running high across this document chain (five architecture documents this session). Flagging once more here rather than gating again — happy to continue, pause, or split further work into a fresh session, whichever you prefer.*
