# POA MOTHERSHIP — UI/UX Architecture

## Vision Document (Information Architecture → Experience Architecture → Screen Architecture → Signature Interactions → Visual Design System → Wireframes)

**Executes:** `POA MOTHERSHIP — UI-UX ARCHITECTURAL DESIGN BRIEF.md` (Deployment mirror).
**Informed by (inspiration only, not independently executed):** `POA-MOTHERSHIP — MASTER UI-UX DESIGN PROMPT.md` and the reference concept image the user supplied — used for their visual-direction and terminology cues (`ROLE ≠ MODEL`, ambient sound optional, System Health layering), not treated as a second mission.
**Status:** VISION ARCHITECTURE ONLY. No implementation code has been written under this document. Per the brief's own "do not code yet" instruction and the established BLD-003 precedent, this pauses for review before any implementation.

---

## Binding constraints (from the Commander, this session — read before anything else)

> "Use the existing POA architectural concepts we have already established rather than inventing a parallel product philosophy. The UI is the expression of POA, not a replacement for POA."
>
> "Do not freeze today's terminology or LLM vendors into the architecture. The organizational concepts should remain durable even as models, providers, agents and execution technologies evolve."

Both source documents describe an extremely ambitious product — a conversational AI chief-of-staff with decision-confidence scoring, live impact simulation, an "organizational digital twin," and a boardroom "Listening Mode." **None of this exists in POA's ratified architecture or in the actual Mothership runtime today.** Taken literally, executing these documents as if they were already-decided fact would mean inventing a parallel product philosophy — exactly what the Commander just prohibited. This document therefore does two things throughout, consistently:

1. **Traces every UI concept back to a real, already-established POA architectural primitive** wherever one exists — using POA's own ratified vocabulary as ground truth, not the brief's vocabulary.
2. **Explicitly labels every concept with no current backing as VISION** — described here for narrative and design-system coherence, but carrying **no architectural authorization**. Building any [VISION] item requires its own future `POA-DEC-*` decision mission, per this repository's own governance discipline (CLAUDE.md rule 7: "do not invent missing organizational policy — write TBD").

Legend used throughout this document:

| Marker | Meaning |
|---|---|
| **[REAL]** | Backed by a ratified POA architectural decision and/or already implemented in `50-Mothership/` (BLD-001/002) |
| **[REAL-DESIGNED]** | Backed by real data; screen/interaction already specified in the BLD-003 design artifact, not yet re-litigated here |
| **[VISION]** | No current architectural or runtime backing. Narrative/design-system placeholder only. Requires a future decision mission before implementation |

No vendor or model name appears anywhere below. Every place the source documents or the reference image named a specific AI provider or model, this document uses POA's own durable vocabulary instead: **reasoning intensity** (Low / Medium / High), **executor** (Human / AI / Human+AI / Agentic), and **execution engine** (an opaque, swappable label — already the `engine` field on `ExecutionPrincipal`, added in BLD-002, which today happens to be *populated* with a provider name as sample data, but the *architecture* has never required that and this document does not either).

---

## Grounding table — brief vocabulary → real POA architecture

| Brief's term | Real POA primitive it maps to | Status |
|---|---|---|
| "The organization itself" | `Organization` (`id`, `name`) — `src/identity.ts` | [REAL] |
| "People / AI Workforce" | `ExecutionPrincipal` (`id`, `role`, `engine`, `active`) + capability grants | [REAL] |
| "Missions" | `Mission` lifecycle state machine (`Created→Running→Succeeded/Failed→Closed`) | [REAL] |
| "Evidence" | `EvidenceEnvelope` — hash-chained, identity-signed, per-mission | [REAL] |
| "Capabilities / Authorization" | Capability grants + `AuthorizationDecision` (`AUTHORIZED`/`CAPABILITY_NOT_GRANTED`/etc.) | [REAL] |
| "Integrity / Verification" | `verifyChain()` + Independent Witness (explicitly a test double, not production-independent) | [REAL] |
| "Model Intensity" / "Reasoning Intensity" | Not yet a field anywhere. `ExecutionPrincipal.engine` exists but is a free-text label, not a tiered taxonomy | [VISION] — durable vocabulary defined below, no runtime field yet |
| "Decision" (as a scored, simulatable entity with confidence %, alternatives, "what would change this") | Only exists today as an `AUTHORIZATION_DECISION` evidence entry — binary granted/denied with a reason code, no confidence score, no alternatives, no simulation | [VISION] for everything beyond the binary decision; [REAL] for the binary decision itself |
| "Evidence Explorer" 7-step chain (Observation→Evidence→Analysis→Decision→Action→Outcome→Learning) | Real evidence only covers 3 of these steps today: **Evidence** (the envelope), **Decision** (`AUTHORIZATION_DECISION`), **Action** (`ACTION_EXECUTED`). Observation, Analysis, Outcome, and Learning have no corresponding evidence type | [VISION] for 4 of 7 steps — see §Evidence Explorer below |
| "AI Workforce Matrix" / "Agent Observatory" | `ExecutionPrincipal.engine` + `role` fields exist; there is no agent registry, no live "Status: Working," no per-agent performance tracking | [VISION] beyond the two real fields |
| "Organizational Digital Twin" / "Organization Graph" | No graph/relationship model exists between people, missions, systems, resources | [VISION], entirely |
| "Repository / Version History" as organizational lineage | Only git's own commit history exists (real, but external to the runtime — the Mothership has no in-runtime versioning concept) | [VISION] as an in-product feature; [REAL] only as "the repository this document itself lives in" |
| "System Health Map" (Mothership/services/evidence/identity/witness/storage layers) | Only mission/evidence/witness aggregate counts exist today (Home page stats) | [VISION] for a layered health map; [REAL] for the underlying counts |
| "Listening Mode" | No audio, no NLP, nothing | [VISION], entirely — the brief itself already calls this "future, not core" |
| "Conversation Mode" / "Ask POA anything" | No natural-language interface exists anywhere in the runtime or API | [VISION], entirely |
| "Impact Simulation" | No simulation engine exists | [VISION], entirely |

This table is the single most important artifact in this document: **it is the difference between designing POA's UI and designing a different, fictional product that happens to share POA's name.**

---

## A. Information Architecture

```
POA MOTHERSHIP
│
├── EXECUTIVE PRESENCE (Level 1)                                    [REAL-DESIGNED, per BLD-003]
│     Organization state · Attention items · Immediate actions
│     (Conversational entry point is [VISION] — see Signature Interactions)
│
├── MISSION UNIVERSE (Level 2 entry)                                [REAL data; landscape framing is VISION]
│     ├── List view                                                  [REAL-DESIGNED — "Mission Control"]
│     └── Landscape/constellation view                               [VISION — visual layer only, same underlying data]
│           └── MISSION DETAIL (Level 2→3)                           [REAL-DESIGNED, major redesign]
│                 ├── Overview                                       [REAL]
│                 ├── Evidence chain ("Why?")                        [REAL, redesigned — see §Evidence Explorer]
│                 ├── Actions (transition / authorize / checkpoint)  [REAL]
│                 └── Decision Canvas (per pending authorization)    [REAL binary decision; VISION scoring/simulation layer]
│
├── PEOPLE & CAPABILITIES                                           [REAL-DESIGNED, per BLD-003]
│     Identity roster · capability grants · authorization history
│     (Full "AI Workforce Matrix" with performance/availability is VISION)
│
├── DIAGNOSTICS                                                     [REAL-DESIGNED, per BLD-003]
│     Organization Isolation Check
│
└── FUTURE MODULES (named, zero implementation, own decision mission required)
      ├── Organization Graph / Digital Twin                          [VISION]
      ├── Repository / Version History (in-product)                  [VISION]
      ├── System Health Map (layered)                                 [VISION]
      ├── Conversation / "Ask POA"                                    [VISION]
      ├── Impact Simulation                                           [VISION]
      └── Meeting / Listening Mode                                    [VISION — explicitly deferred by the brief itself]
```

This nests, rather than replaces, the BLD-003 information architecture. BLD-003's three-item primary navigation (Executive / Mission Control / People & Capabilities) remains the **entire real surface area of the product today**; everything else in this tree is either a visual reframing of that same real data (Mission Universe's landscape view) or explicitly unauthorized future scope.

---

## B. Experience Architecture

The brief's requested flow — Executive Presence → Context → Investigation → Decision → Action → Evidence → Learning — is mapped against what can genuinely be delivered with real data today:

```
Executive Presence   →   Context          →   Investigation      →   Decision            →   Action           →   Evidence           →   Learning
[REAL-DESIGNED]           [REAL-DESIGNED]      [REAL-DESIGNED]         [REAL binary;            [REAL]               [REAL, redesigned]     [VISION]
Home "attention" list     Mission Detail       Evidence chain          VISION scoring/          transition /                                No mechanism exists
                          opened from a         drill-down              simulation layer]        authorize /                                 today to feed an
                          flagged item                                                            checkpoint                                  outcome back into
                                                                                                                                                future recommendations
```

"Learning" is included in the diagram because the brief names it as the terminus of the epistemic chain, but it is marked [VISION] without qualification: there is no runtime concept today that closes the loop from an outcome back into a future recommendation. This is not a gap this document proposes to fill — it is named so a future mission does not have to rediscover it.

---

## C. Screen Architecture

Only screens with real data get a full specification. Vision-only screens (Organization Graph, Conversation, Simulation, Listening Mode, Repository, System Health Map) are named in §A/§F but not specified to this level of detail, per the Stopping Rule — specifying interaction models for screens with no backing data would itself be a form of inventing a parallel product.

### Executive Home `[REAL-DESIGNED]`

| Field | Value |
|---|---|
| Purpose | Answer "does anything need me" in under 10 seconds |
| Primary user | Executive / Commander |
| Primary question answered | "What requires my attention?" |
| Default information | Organization name, a severity-ranked "needs attention" list (Failed missions, never-checkpointed missions, denied authorizations), aggregate mission-state counts |
| Revealed on demand | Full mission list (via Mission Control), full principal roster (via People & Capabilities) |
| Primary action | Open a flagged item |
| Secondary action | Switch organization context |
| Interaction model | Static page, org-scoped, refetches on org switch |
| Transitions | → Mission Detail (from an attention item) · → Mission Control · → People & Capabilities |

### Mission Universe / Mission Control `[REAL-DESIGNED, list view = BLD-003; landscape view = VISION framing over the same data]`

| Field | Value |
|---|---|
| Purpose | See every mission and its state at a glance; create new missions |
| Primary user | Operator |
| Primary question answered | "What state is each mission in, and what needs action?" |
| Default information | Mission list: id, state, origin, (landscape view, if built: relative position/size by state severity — no new data required, purely a different rendering of the same list) |
| Revealed on demand | Mission Detail |
| Primary action | Open a mission |
| Secondary action | Create a mission |
| Interaction model | List is the [REAL-DESIGNED] baseline; a landscape/constellation rendering is an optional visual alternative over the *identical* API response — no separate data model, so it can be added later as pure presentation without an architecture decision |
| Transitions | → Mission Detail |

### Mission Detail `[REAL-DESIGNED, major redesign per BLD-003 + this document's Evidence Explorer]`

| Field | Value |
|---|---|
| Purpose | Understand one mission's full state and drive its lifecycle |
| Primary user | Operator, Mission owner |
| Primary question answered | "Where is this mission, what's blocking it, why did things happen the way they did?" |
| Default information | State, origin, evidence count, integrity status (Overview tab) |
| Revealed on demand | Full evidence chain (Evidence tab), lifecycle/authorize/checkpoint actions (Actions tab) |
| Primary action | The single currently-legal lifecycle transition, or authorize-and-execute |
| Secondary action | Checkpoint |
| Interaction model | Tabbed, progressive disclosure (Overview → Evidence → Actions), per BLD-003 §H |
| Transitions | ← Mission Control / Home · → back to Mission Control via breadcrumb |

### Evidence Explorer `[REAL, redesigned — partial-fidelity to the brief's 7-step chain]`

The brief's chain is **Observation → Evidence → Analysis → Decision → Action → Outcome → Learning**. Real evidence today only instantiates three of these seven steps:

| Chain step | Real data | Disposition |
|---|---|---|
| Observation | *(none)* | [VISION] — no runtime concept of "what was observed before evidence was created" |
| **Evidence** | `EvidenceEnvelope` | **[REAL]** |
| Analysis | *(none)* | [VISION] — no runtime concept of interpretation distinct from the evidence itself |
| **Decision** | `AUTHORIZATION_DECISION` payload | **[REAL]** (binary: granted/denied + reason code; no confidence, no alternatives) |
| **Action** | `ACTION_EXECUTED` payload | **[REAL]** |
| Outcome | *(the mission's terminal state — Succeeded/Failed — is the closest real proxy)* | **[REAL, partial]** — a terminal mission state is a real outcome signal, but there is no structured "outcome record" distinct from the state itself |
| Learning | *(none)* | [VISION] |

The honest, currently-buildable version of this screen is therefore a **3.5-step real chain** (Evidence → Decision → Action → terminal state as a proxy for Outcome), presented using the brief's Integrity/Authority separation (BLD-003 §D.6's seven-step Evidence/Source/Attribution/Integrity/Verification/Authority/Decision model, which decomposes the single "Evidence" step above into real sub-fields already present on the envelope). The four-step gap (Observation, Analysis, Outcome-as-a-record, Learning) is displayed, if at all, as explicitly labeled "not yet available" placeholders — never fabricated content, per Design Principle 4 (BLD-003 §C).

### People & Capabilities `[REAL-DESIGNED, per BLD-003]`

Unchanged from BLD-003's specification. This document adds one framing note: the brief's "AI Workforce Matrix" / "Agent Observatory" concepts are this same screen, described with more ambitious language than the current two real fields (`role`, `engine`) support. No new fields (availability, cost, performance) are proposed here — see §Signature Interactions for the one durable addition this document does propose (reasoning-intensity vocabulary), which is a labeling convention, not a new data model.

---

## D. Signature Interactions

Eight interactions, each graded by whether it can be built against real data today:

1. **"Why?" drill-down** `[REAL]` — from any evidence entry, expand to its Attribution/Integrity/Authority/Decision facets (already-real fields, newly organized).
2. **Cross-organization isolation probe** `[REAL]` — already built in BLD-002 (Isolation Check), reframed as a diagnostic rather than a primary screen.
3. **Legal-transition-only lifecycle control** `[REAL]` — offering only the mission's actually-legal next states, sourced from the same state machine the server enforces (BLD-003 §F.2).
4. **Consequential-action confirmation** `[REAL]` — a confirm step before transition/authorize showing organization, capability, and impact, per BLD-003 §D.5's Modal spec.
5. **Attention-ranked Home** `[REAL]` — severity-first framing of real aggregate data, replacing raw stat grids (BLD-003 §F.1).
6. **Reasoning-intensity labeling** `[VISION scaffold, REAL-compatible]` — introduce the vocabulary (Low/Medium/High) as a *display convention* over the existing `engine` field, with no new runtime field required; this is the one piece of this document safe to adopt immediately without an architecture decision, because it changes only how an existing string is *labeled*, not what data exists.
7. **Evidence-Integrity-vs-Authority split view** `[REAL]` — BLD-003's named centerpiece, unchanged.
8. **"Ask POA anything" conversational entry point** `[VISION]` — named here because the brief treats it as central, but it requires a natural-language interface with no current architectural home; **not proposed for implementation**, listed so its absence is a documented decision, not an oversight.

Interactions from the source documents *not* included above (Impact Simulation, Listening Mode, Organization Graph zoom, sound/ambient feedback) are omitted entirely rather than stubbed, per the Stopping Rule.

---

## E. Visual Design System

This extends, rather than replaces, BLD-003's design system (§D of that document). Where the two source documents' visual language is compatible with BLD-003's already-specified dark neutral palette, it is adopted; where it would require new dependencies or contradict BLD-003's zero-decoration principle, it is not.

| Aspect | Decision |
|---|---|
| Base palette | BLD-003's existing near-black/charcoal base is kept unchanged — it already satisfies both source documents' "near-black / midnight" direction without introducing a new color system |
| Accent semantics | Adopts the source documents' semantic mapping cleanly: cyan/blue → information & active state, violet → reasoning/intelligence-adjacent content (used sparingly — see below), green → verified/healthy, amber → attention, red → critical. This is additive to BLD-003 §D.7's glyph system, not a replacement — **every accent color still requires its BLD-003 non-color glyph carrier** |
| "Intelligence" visual presence | The brief's "Organizational Intelligence Core" / orbital symbol is [VISION] as a literal animated 3D/canvas object — no such rendering exists and building one is a genuine engineering investment with no functional payoff yet. The *concept* is honored minimally: Home's severity indicator (BLD-003 §F.1) can use a simple, static geometric mark (not an animated orb) whose **shape** changes with organizational state (e.g., a ring that's unbroken when stable, notched where attention is needed) — communicating state through form, not motion, avoiding both new dependencies and "AI gimmick" aesthetics (explicitly prohibited by BLD-003 §G and both source documents' own anti-pattern lists) |
| Glass/translucent surfaces | Not adopted. BLD-003's flat bordered-panel system already reads as premium and restrained; translucency would require layering/backdrop-filter effects with real performance and legibility cost for no functional gain, and both source documents themselves warn against "excessive glassmorphism" |
| Motion | BLD-003's existing stance (single ~120ms fade, no persistent animation) is kept. The source documents' more elaborate motion language (orbital movement, "breathing," morphing transitions) is [VISION] — appropriate for a future canvas/graph module, not for the current flat-page architecture |
| Iconography | BLD-003's Unicode/CSS-glyph approach (no icon-font, no SVG-sprite dependency) is kept and extended with the same discipline for any new concepts introduced here |
| Sound | [VISION], explicitly optional per both source documents. Not scoped for any near-term work |
| Typography, spacing, components | Unchanged from BLD-003 §D.1–D.5 |

**Reasoning-intensity vocabulary (durable, provider-agnostic — replaces every vendor-specific label anywhere in this system):**

| Tier | Meaning |
|---|---|
| Low | Fast, low-cost execution; suitable for routine/low-stakes actions |
| Medium | Balanced |
| High | Deep reasoning; suitable for consequential or ambiguous decisions |

The underlying `engine` field may continue to store any implementation-specific value as data — that is an implementation detail, not a design-system concept, and the UI never surfaces it as a first-class label; the UI surfaces only the tier.

---

## F. Wireframes (low-to-medium fidelity, first five core experiences)

ASCII, matching the source documents' own diagramming convention. All content shown is illustrative structure, not literal copy.

### F.1 — Executive Home `[REAL]`

```
┌──────────────────────────────────────────────────────────────┐
│  POA MOTHERSHIP                              [Org: ▾ ]         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│   Good morning.  Your organization is [state glyph] Stable.    │
│                                                                │
│   ┌─ NEEDS ATTENTION ─────────────────────────────────────┐   │
│   │  ⛔  1 mission Failed             → mission-x           │   │
│   │  ○  2 missions never checkpointed → mission-y, -z       │   │
│   │  ✕  1 authorization denied        → mission-w           │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                │
│   [ Mission summary: 6 total · 2 Running · 1 Closed · … ]      │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### F.2 — Mission Universe (list view) `[REAL]`

```
┌──────────────────────────────────────────────────────────────┐
│  Mission Control                                [+ Create]    │
├──────────────────────────────────────────────────────────────┤
│  ID                  STATE       ORIGIN                       │
│  mission-demo-001    ✓ Closed    ⬥ Fixture              >     │
│  mission-demo-002    ○ Created   ⬥ Fixture              >     │
│  mission-demo-003    ● Running   ⬥ Fixture              >     │
└──────────────────────────────────────────────────────────────┘
```

### F.3 — Mission Detail (Evidence tab) `[REAL]`

```
┌──────────────────────────────────────────────────────────────┐
│  Mission Control / mission-demo-001                            │
│  [Overview] [Evidence] [Actions]                                │
├──────────────────────────────────────────────────────────────┤
│  #1 · AUTHORIZATION_DECISION                                    │
│    Attribution: agent-materializer                              │
│    Integrity:  ✓ intact         Authority: ✓ AUTHORIZED         │
│    Decision:  "mission:execute granted"                         │
│  ────────────────────────────────────────────────────────────  │
│  #2 · ACTION_EXECUTED                                           │
│    Attribution: agent-materializer                               │
│    Integrity:  ✓ intact         Authority: (inherits #1)        │
└──────────────────────────────────────────────────────────────┘
```

### F.4 — People & Capabilities `[REAL]`

```
┌──────────────────────────────────────────────────────────────┐
│  People & Capabilities                                         │
├──────────────────────────────────────────────────────────────┤
│  agent-materializer   execution-agent   [Reasoning: High]       │
│    Capabilities: mission:execute                                │
│  agent-unprivileged   execution-agent   [Reasoning: High]        │
│    Capabilities: (none granted)                                 │
├──────────────────────────────────────────────────────────────┤
│  Decision history: mission-demo-001 → AUTHORIZED                │
│                     mission-demo-003 → CAPABILITY_NOT_GRANTED   │
└──────────────────────────────────────────────────────────────┘
```

### F.5 — Diagnostics / Isolation Check `[REAL]`

```
┌──────────────────────────────────────────────────────────────┐
│  Diagnostics → Isolation Check                                  │
├──────────────────────────────────────────────────────────────┤
│  Mission owned by [org ▾]   mission [▾]   requested as [org ▾]  │
│  [ Attempt Access ]                                             │
│  → DENIED — organization org-beta attempted org-paravyoma's...  │
└──────────────────────────────────────────────────────────────┘
```

**No wireframe is produced for Decision Canvas, Evidence-as-Observation-through-Learning, Organization Graph, Conversation, Simulation, or Listening Mode** — producing a wireframe for a screen with no backing data would itself misrepresent it as more real than it is. These remain named, not drawn, in §A.

---

## G — High-fidelity concept

Published as a standalone concept mockup: **Executive Home + Contextual Canvas transition** — [claude.ai/code/artifact/457ba52f-732b-4233-8c72-9a6bfa9627df](https://claude.ai/code/artifact/457ba52f-732b-4233-8c72-9a6bfa9627df).

It demonstrates §E's visual design system (reused BLD-003 color tokens, non-color glyph carriers, IBM Plex typography) and one real signature interaction from §D (an attention item expanding in place into the Integrity/Authority evidence split — Level 1 → Level 2 without navigating away). All content is illustrative sample data, clearly labeled on the page itself as a concept, not the live application. It contains no vendor or model name — reasoning intensity is shown only as the Low/Medium/High tier from §E. It is not wired to the live API and is not part of the shipped application.

---

## Relationship to POA-BLD-003

This document does not replace `POA-BLD-003-DESIGN-ARTIFACT.md`; it wraps it. BLD-003's screen inventory (§E of that document) is the **entirety of what this document marks [REAL-DESIGNED]**. Every [VISION] item here is, by definition, out of scope for the implementation BLD-003 already planned. If and when implementation resumes, BLD-003's ordered implementation plan (§I of that document) remains the correct next steps — nothing here changes it.

## Architectural questions surfaced but NOT decided here (escalation, per CLAUDE.md rule 8)

Per this repository's own governance discipline, the following are named as open questions this document raises but does not resolve — each would need its own `POA-DEC-*` mission before any implementation commitment:

1. Should POA gain a first-class **Decision** entity (beyond the binary `AUTHORIZATION_DECISION`) with confidence, alternatives, and simulation? This is the single largest architectural gap this document surfaces.
2. Should **reasoning intensity** become a real, structured field on `ExecutionPrincipal` (replacing the current free-text `engine` string), or remain a display-only convention over existing data?
3. Should the evidence model gain **Observation**, **Analysis**, and **Learning** as first-class evidence types, closing the brief's seven-step chain?
4. Is an **Organization Graph / Digital Twin** relationship model in scope for POA at all, or does it belong to a different product layer entirely?

This document takes no position on any of the four questions above. They are recorded so a future mission does not have to rediscover them.
