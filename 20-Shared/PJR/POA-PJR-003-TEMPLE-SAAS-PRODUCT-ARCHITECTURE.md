# POA-PJR-003 — Temple Suite Product Architecture

**Status:** Materialized — conceptual product architecture. Not frozen. Contains `OPEN` decisions by design.
**Materialized by:** Mission `TSAAS-001` (Chief Architect / Commander Authorization: EXECUTE, `TSAAS-001 — Temple Suite Product Architecture.md`, Deployment mirror, 2026-08-25).
**Mode:** Architecture materialization only. This document defines conceptual product architecture — domain boundaries, a candidate shared-record model, DGP's architectural role, the devotee journey model, the human/software boundary, and open decisions. It contains **no schemas, no database migrations, no APIs, no UI, and no application code**, per the authorizing mission's own explicit prohibition (§13 of the brief).
**Provenance discipline:** every claim below carries one of the six classifications established by `TSAAS-RECON-001` and preserved by `TSAAS-DEC-001` §3 — `DECIDED` / `SOURCE-DERIVED` / `HISTORICAL` / `PROPOSED` / `INFERRED` / `UNKNOWN` — plus, for architecture decisions specifically, the brief's own `OPEN` / `READY` pair (§14 of the brief: "if a decision cannot yet be justified by evidence, classify it as OPEN, not READY"). No new classification vocabulary is introduced.
**Do not rewrite history:** this document does not alter `POA-PJR-002`, `POA-ADR-001`, `TSAAS-RECON-001-COMPLETION-REPORT.md`, or any other prior artifact. Where this document adds a new observation not previously catalogued (see §3, §6), it is disclosed as new, not retrofitted into a prior report.

**Naming-convention note (per `CLAUDE.md` Rule 7 — do not invent missing policy):** this artifact is filed as `POA-PJR-003` under the existing `PJR` family/folder (`20-Shared/PJR/`), continuing the numbering established by `POA-PJR-001` (registry) and `POA-PJR-002` (Temple SaaS baseline), because it is a direct architectural continuation of `POA-PJR-002`'s evidence rather than a new artifact class. This follows the same precedent already accepted in this repository for `POA-EVT-001` (filed under the `GOV` domain folder "consistent with the same evidence-chain lineage... not a claim of a new top-level directory family"). No claim is made that "product architecture" is a formally adopted artifact family distinct from "project registry/baseline" — that distinction, if the Chief Architect wants one, is recorded as an `OPEN` item in §14, not decided unilaterally here.

---

## 0. Evidence Base

Per the brief's §3 instruction to review and use the available evidence. Sources actually consulted for this mission, each with what it contributed:

| Source | Contribution |
|---|---|
| `TSAAS-RECON-001-COMPLETION-REPORT.md` (2026-08-25) | Primary reconciled evidence layer — product identity/hierarchy, module reconciliation, DGP architectural-role finding (§7), journey/MVP-boundary finding (§8/§11), human/software boundary convergence (§9), commercial-state reconciliation (§10). Treated as authoritative ground truth for this mission; not re-derived. **This report remains untracked in git** at the time of this mission (see §16) — it is cited by content, not assumed committed. |
| `TSAAS-DEC-001` Decision Record (`POA-ADR-001.md`) | Canonical naming/hierarchy ruling; explicit instruction that DGP's architectural characterization is a requirement for `TSAAS-001` "to investigate and materialize, not as an architecture decided here" (§3 item 4) — this document is that materialization. |
| `POA-PJR-001` / `POA-PJR-002` | Nine-module extraction (`POA-PJR-002` §4), naming table (§1), Chief Architect addenda. Re-read in full this session. |
| `Temple Growth Platform - Module 001.docx` ("Relationship Memory") | **Newly read for this mission** (flagged `UNRESOLVED` placement by `TSAAS-RECON-001` §6 item 9, not previously analyzed for architectural content). Primary evidence for §4 (Shared Record Model) — see full extraction reproduced there. |
| `Temple Suite Strategic Direction.pdf` | **Newly read for this mission.** Contributes: the explicit "not an ERP/CRM" positioning; the university analogy; the "record layer / operations workflow layer / governance layer / insight layer" four-layer framing referenced by the brief's own §10 diagram; the ISKCON Lucknow pilot-scope statement; and one additional, previously-uncatalogued journey enumeration (§6 below). |
| `Licensing Proposal_V2.docx` | **Newly read for this mission**, for licensing *structure* only (not status, which `TSAAS-RECON-001` §10 already settled). Contributes the ownership-separation model and licensing-tier progression used in §11 (Commercial architecture considerations). |
| Live Paravyoma Temple Suite / Devotee Growth Platform web pages | Not re-fetched this session — `TSAAS-RECON-001` §2's fresh 2026-08-25 fetch is treated as still current; re-fetching would not change any finding used here. |

**What this mission did not do:** re-inventory the 41-file `D:\ISKCON LKO\ISKCON SAAS App` archive (already done by `TSAAS-RECON-001`); re-open the TGP naming question (`TSAAS-DEC-001` is standing); re-verify commercial figures (`TSAAS-RECON-001` §10 is standing).

---

## 1. Executive Architectural Statement

Temple Suite is not, architecturally, a set of nine independent modules that happen to share a login page. The evidence supports a narrower and more specific claim: Temple Suite is a **person-centered operating system for a temple's community**, in which a small number of operational domains (donations, seva, volunteers, events, inventory, book distribution) each own their own transactional records, and a distinct growth/orchestration capability (Devotee Growth Platform) interprets activity across those domains to advance an individual's relationship with the temple — without owning the underlying transactions itself. `SOURCE-DERIVED`: the product's own positioning material rejects "generic administration software" and a "generic ERP" framing explicitly (`temple-suite/page.tsx` "moat" section, as captured verbatim by `POA-PJR-002` §4/§8 — not independently re-read by this mission; `Temple Suite Strategic Direction.pdf` p.1, read directly this mission, "We do NOT want to build another generic ERP"), and instead centers the devotee/visitor lifecycle as the organizing principle (`Strategic Direction.pdf` p.3: "Temple Suite should be built around the complete devotee lifecycle. Not around accounting. Not around inventory. Not around administration. Those are supporting modules.").

This has one direct architectural consequence the rest of this document follows: **the eight non-DGP domains are correctly understood as system-of-record modules for their own operational activity, not as competitors to DGP for ownership of the devotee relationship.** DGP does not replace them; it reads from them. Where this document cannot go further than that (e.g., precise entity schemas, API contracts), it says so and marks the gap `PROPOSED` or `OPEN`, per the brief's own instruction not to assume architecture the evidence does not support.

**Classification: `INFERRED`** (the synthesis itself); the underlying textual evidence for each component claim is `SOURCE-DERIVED` and cited throughout.

---

## 2. Product Hierarchy

```
Paravyoma  (organization)
   │
   └── Temple SaaS  (canonical POA project/product initiative)
          │
          └── Temple Suite  (canonical product/platform family — the nine-module platform)
                 │
                 ├── Devotee Growth Platform (DGP)   ← first module authorized for
                 │                                      implementation/commercial advancement
                 │
                 └── [eight other Temple Suite modules — §3]

Historical/working terminology (preserved, not merged):
   Temple Solutions        → pre-productization services framing (four suites), predates Temple Suite
   Temple Growth Platform  → discovery/commercial-negotiation-phase working name for the
                              product evolution that produced DGP as its canonical name
```

**Classification: `DECIDED`** — this is `TSAAS-DEC-001` §3 item 3's hierarchy, restated verbatim in structure, not re-derived.

### Architecture layers

The product's own marketing source names a four-layer architecture (`temple-suite/page.tsx`, cited by `POA-PJR-002` §4: "record layer, operations workflow layer, governance layer, insight layer" — recorded there "for completeness, not further extracted"). This mission extracts and refines it, per the brief's §10 instruction to develop a conceptual architecture "refin[ing] this only where evidence supports it," using the brief's own minimum-diagram shape:

```
Temple Suite
     │
     ├── Shared/Core Records        (candidate: "Relationship Memory" — §4 below)
     │        — corresponds to the source's "record layer"
     │
     ├── Operational Domains        (Donation, Seva, Volunteer, Events, Inventory, Book Distribution)
     │        — corresponds to the source's "operations workflow layer"
     │
     ├── DGP / Growth                (journey orchestration, segmentation, mentor assignment)
     │        — not named as a distinct layer in the source; this mission's own placement,
     │          justified by §5/§6's finding that DGP behaves cross-modularly, not as a peer
     │          "operations workflow" domain — INFERRED placement, SOURCE-DERIVED justification
     │
     ├── Cross-domain Workflows       (follow-up automation, mentor-assignment triggers)
     │        — PROPOSED: named in Strategic Direction.pdf ("Follow-Up Automation") and DGP's
     │          own stage list, but no source names this as a distinct architectural layer
     │
     ├── Communications / Automation  (WhatsApp confirmations, reminders, notifications)
     │        — PROPOSED, same basis
     │
     └── Analytics / Intelligence     (Analytics module, Community Analytics)
              — corresponds to the source's "insight layer"; also the source's "governance layer"
                (trustee/oversight function) is treated as a use of this layer, not a sibling of it —
                INFERRED, since no source elaborates "governance layer" beyond the one label
```

**Classification:** the four base layers (record/operations/governance/insight) are `SOURCE-DERIVED`. Their expansion into the brief's six-node diagram, and the placement of DGP as its own node rather than inside "operations workflow," is `INFERRED` — a reasonable extension the evidence supports but does not itself state. This is **not** forced into a generic ERP/CRM shape (per the brief's §10 instruction) — it deliberately keeps DGP out of "Operational Domains," because §5/§6 below establish that DGP does not behave like a peer operational domain.

---

## 3. Domain Map

Per the brief §4: purpose, primary responsibility, major records/entities, primary users, important workflows, dependencies, upstream/downstream relationships, classification (foundational/operational/growth-oriented/analytical), and what each domain must NOT own. **Evidence ceiling, disclosed up front:** for eight of the nine domains, the only source is one row of `POA-PJR-002` §4 — a tier label, one description sentence, and three named features. This supports `purpose` and `primary responsibility` at `SOURCE-DERIVED` confidence. It does **not** support detailed entity lists, full workflows, or dependency graphs — those fields are marked `PROPOSED` throughout, meaning: a plausible architectural inference, not evidenced fact. DGP (§5–§6) is the one domain with real depth of evidence and is treated separately.

The brief's own instruction — "do not assume all nine are technically independent modules merely because they are presented as nine product cards" — is applied by explicit "must NOT own" statements and by flagging one direct ownership ambiguity (Community Engagement vs. DGP, below) rather than silently resolving it.

### 3.1 Donation Management
- **Purpose / responsibility:** receipts, donor profiles, pledge history, payment references, trustee-ready summaries. `SOURCE-DERIVED`.
- **Classification:** foundational (source tier: "Core records"). `INFERRED` mapping of the source's own tier label onto the brief's four-category taxonomy.
- **Major records/entities (`PROPOSED`):** Donor, Donation/Pledge, Receipt, Payment Reference.
- **Primary users (`PROPOSED`):** donors (self-service, per "online donations"); trustees/finance admin (per "trustee-ready summaries").
- **Important workflows (`SOURCE-DERIVED` at bullet level):** counter and online donations; automatic receipt generation and history; donor relationship view.
- **Dependencies (`PROPOSED`):** consumes shared identity (§4) to link a donation to a known person rather than an anonymous transaction — not stated by any source, but implied by "donor relationship view."
- **Upstream/downstream:** feeds Analytics (donations reporting, per Analytics' own description). `INFERRED`.
- **Must NOT own:** devotee journey state, mentor assignment, volunteer scheduling, seva bookings. `PROPOSED` — stated here as an explicit boundary, not evidenced as a documented rule.

### 3.2 Seva Scheduling
- **Purpose / responsibility:** seva bookings, priest availability, confirmations, material readiness, daily rosters. `SOURCE-DERIVED`.
- **Classification:** operational ("Daily operations"). `INFERRED` mapping.
- **Major records/entities (`PROPOSED`):** Seva Booking, Priest/Officiant Availability, Slot/Capacity, Confirmation.
- **Primary users (`PROPOSED`):** devotees booking sevas; temple staff managing rosters.
- **Important workflows (`SOURCE-DERIVED`):** daily seva calendar; capacity and slots; WhatsApp confirmations.
- **Dependencies (`PROPOSED`):** Inventory (material readiness, per its own description overlap with "material readiness" language here) — an unstated cross-reference this mission surfaces, not a documented dependency.
- **Upstream/downstream:** DGP's own stage list names "Seva Participation" as a journey signal it consumes (`SOURCE-DERIVED`, `TSAAS-RECON-001` §7) — Seva Scheduling is therefore a documented **upstream source** for DGP.
- **Must NOT own:** devotee journey/segmentation logic, donation records. `PROPOSED`.

### 3.3 Volunteer Management
- **Purpose / responsibility:** volunteer profiles, availability, festival roles, shift assignments, attendance tracking. `SOURCE-DERIVED`.
- **Classification:** operational ("People coordination"). `INFERRED`.
- **Major records/entities (`PROPOSED`):** Volunteer Profile, Availability, Role Assignment, Attendance Record.
- **Primary users (`PROPOSED`):** volunteers; volunteer coordinators.
- **Important workflows (`SOURCE-DERIVED`):** availability tracking; role-based rosters; coverage alerts.
- **Dependencies/upstream-downstream:** DGP's stage list names "Volunteer Engagement" as a consumed signal (`SOURCE-DERIVED`, `TSAAS-RECON-001` §7) — documented upstream source for DGP. Also related to Leadership Development pathways (§6) — `PROPOSED` link, since "volunteer roles" and "future leaders" (Strategic Direction.pdf, "Leadership Development... Group leaders") plausibly overlap without any source stating the relationship.
- **Must NOT own:** devotee spiritual-journey classification, mentor assignment logic (that is DGP's, per §5) — though DGP references this domain's engagement records rather than duplicating them. `PROPOSED`, and this is the clearest instance of the brief's own "must NOT own" instruction: Volunteer Management owns the fact that someone volunteered; DGP owns what that fact means for their journey stage.

### 3.4 Events
- **Purpose / responsibility:** festival registrations, classes, capacity, ticketing, participant lists, post-event reporting. `SOURCE-DERIVED`.
- **Classification:** operational ("Community programs"). `INFERRED`.
- **Major records/entities (`PROPOSED`):** Event, Registration, Ticket, Participant, Post-event Report.
- **Primary users (`PROPOSED`):** attendees; event organizers.
- **Important workflows (`SOURCE-DERIVED`):** registration forms; capacity management; participant records.
- **Dependencies/upstream-downstream:** DGP's stage list names "Event Registration" as a consumed signal (`SOURCE-DERIVED`) — documented upstream source for DGP.
- **Must NOT own:** devotee journey-stage interpretation of "attended an event" — Events records that a registration/attendance happened; DGP decides what that means for the person's stage. `PROPOSED`.

### 3.5 Inventory
- **Purpose / responsibility:** puja materials, prasadam items, books, supplies, thresholds, movement history. `SOURCE-DERIVED`.
- **Classification:** foundational/operational ("Supplies and stock" — the source tier name itself straddles the brief's categories; recorded as ambiguous rather than forced into one, `INFERRED`).
- **Major records/entities (`PROPOSED`):** Stock Item, Threshold, Movement/Usage Record.
- **Primary users (`PROPOSED`):** temple operations staff.
- **Important workflows (`SOURCE-DERIVED`):** stock levels; low-stock alerts; usage by event.
- **Dependencies:** Events ("usage by event," `SOURCE-DERIVED` cross-reference within Inventory's own feature list). Book Distribution shares the general category of "stock" but the source treats them as separate domains — no merger is proposed here.
- **Must NOT own:** book distribution outreach/campaign tracking (a separate domain, §3.6), donor or devotee identity. `PROPOSED`.

### 3.6 Book Distribution
- **Purpose / responsibility:** book stock, distribution records, outreach campaigns, counters, community requests. `SOURCE-DERIVED`.
- **Classification:** operational ("Mission support"). `INFERRED`.
- **Major records/entities (`PROPOSED`):** Book Stock, Distribution Record, Campaign, Request.
- **Primary users (`PROPOSED`):** book distribution volunteers/coordinators.
- **Important workflows (`SOURCE-DERIVED`):** stock and sales; distribution counters; campaign tracking.
- **Dependencies/upstream-downstream:** DGP's stage list names "Book Distribution Tracking" as a consumed signal (`SOURCE-DERIVED`) — documented upstream source for DGP.
- **Must NOT own:** devotee journey-stage interpretation of "received a book" — same ownership-boundary pattern as Events/Volunteer. `PROPOSED`.

### 3.7 Community Engagement
- **Purpose / responsibility:** member profiles, announcements, reminders, program updates, segmented communication. `SOURCE-DERIVED`.
- **Classification:** operational, adjacent to growth ("Devotee connection"). `INFERRED`.
- **Major records/entities (`PROPOSED`):** Member Profile, Announcement, Segment, Reminder.
- **Primary users (`PROPOSED`):** temple communications staff; general congregation as recipients.
- **Important workflows (`SOURCE-DERIVED`):** member directory; segmented updates; reminder workflows.
- **Explicit ambiguity — NOT resolved here, per the brief's own instruction to identify rather than silently resolve boundary uncertainty:** Community Engagement's own description ("segmented communication," "reminder workflows") overlaps materially with DGP's "Follow-Up Automation" stage (`Strategic Direction.pdf`: "Welcome message, Event reminders, Follow-up calls, Mentor introduction, Course recommendations") and with DGP's own "notifications" function named at every journey stage (`POA-PJR-002` §4). No source states which domain owns the underlying communication/notification infrastructure versus which owns the journey-specific triggering logic. **This is flagged as an open architectural ambiguity, not resolved by inference** — see §13, decision "Domain ownership: Community Engagement vs. DGP communications boundary."
- **Must NOT own:** individual mentor-assignment or journey-stage data (that is DGP's, per §5) — Community Engagement's "member profile" is a communications-list concept, not the same thing as DGP's journey-state record, though the two plausibly need to reference the same underlying person identity (§4). `PROPOSED`.

### 3.8 Devotee Growth Platform (DGP)
Treated in full depth in §5–§6, per the brief's own emphasis. Summary fields only, here, for domain-map completeness:
- **Purpose / responsibility:** "Attract, register, engage, nurture, retain and develop devotees through a structured spiritual engagement journey." `SOURCE-DERIVED`.
- **Classification:** growth-oriented ("Strategic growth"). `SOURCE-DERIVED` tier label, direct match to the brief's own taxonomy term — the only domain where this mapping is not an inference.
- **Presented as:** a conventional Temple Suite module (Module 8 of 9). **Functions as:** a cross-module journey-orchestration capability. See §5–§6 for the full analysis and the "must NOT own" boundary (god-module prohibition).

### 3.9 Analytics
- **Purpose / responsibility:** daily activity, donations, volunteer coverage, program growth, operational health. `SOURCE-DERIVED`.
- **Classification:** analytical ("Trustee visibility"). `SOURCE-DERIVED` tier label, direct match.
- **Major records/entities (`PROPOSED`):** none of its own in the operational sense — Analytics is a read/aggregation layer over other domains' records, not a system of record itself. This is this mission's own inference, not stated by the source, but consistent with "insight layer" in the four-layer architecture (§2).
- **Primary users (`SOURCE-DERIVED`):** trustees (per "trustee dashboards," "audit-ready exports").
- **Important workflows (`SOURCE-DERIVED`):** trustee dashboards; monthly summaries; audit-ready exports.
- **Dependencies:** downstream consumer of every other domain, including DGP ("Community Analytics" is also named within DGP's own 10-item module list per `Strategic Direction.pdf`, and DGP's own dashboards feed Analytics per `TSAAS-RECON-001` §7). `SOURCE-DERIVED`.
- **Must NOT own:** primary operational transactions of any kind — Analytics aggregates; it does not originate donation, seva, volunteer, event, inventory, book, or journey records. `PROPOSED`, but directly consistent with the "insight layer" framing.

---

## 4. Shared Record Model

**This is the strongest evidentiary find of this mission, not previously analyzed for architectural content by any prior TSAAS report.** `TSAAS-RECON-001` §6 item 9 catalogued `Temple Growth Platform - Module 001` ("Relationship Memory") only as an `UNRESOLVED`-placement item; this mission reads it in full and finds it answers the brief's §5 question almost directly.

**Module 001's own stated purpose:** *"Relationship Memory enables the temple to remember and build upon every meaningful interaction with an individual, allowing volunteers and departments to continue relationships with consistency, context, and care. The module does not create relationships. It preserves organizational memory so that relationships can naturally deepen over time."* `SOURCE-DERIVED`, quoted verbatim.

Its five "Information Domains" map with unusual directness onto the brief's own candidate entity list (§5 of the brief):

| Brief's candidate concept | Module 001's own field | Classification |
|---|---|---|
| Devotee/person identity | **Identity** — Name, Preferred Name, Contact Information, Language, Location | `SOURCE-DERIVED` (name and shape); `PROPOSED` (as an adopted Temple Suite entity — Module 001 is TGP-era archive material, not yet ratified into Temple Suite architecture) |
| Household/family | Identity → **Family Members** (partial — a field, not a modeled entity in its own right) | `SOURCE-DERIVED` (the field exists); `PROPOSED` (whether "household" is a first-class entity or a field on Identity is not stated — see §13) |
| Visit / interaction | **Relationship History** → Visits, Conversations | `SOURCE-DERIVED` field names; `PROPOSED` as adopted entities |
| Interest | **Relationship Preferences** → Areas of Interest, Programs of Interest | `SOURCE-DERIVED`; `PROPOSED` |
| Relationship/mentor | **Follow-up Context** → Assigned Volunteer; cross-referenced by DGP's own "Mentor Assignment" stage | `SOURCE-DERIVED`; `PROPOSED` |
| Program participation | **Relationship History** → Programs Attended | `SOURCE-DERIVED`; `PROPOSED` |
| Seva participation | **Relationship History** → Seva Participation (named explicitly) | `SOURCE-DERIVED`; `PROPOSED` |
| Volunteer role | **Relationship History** → Volunteer Interactions | `SOURCE-DERIVED`; `PROPOSED` |
| Event participation | **Relationship History** → Festivals Participated | `SOURCE-DERIVED`; `PROPOSED` |
| Communication history | **Relationship History** → Conversations; **Relationship Preferences** → Preferred Communication, Best Contact Time | `SOURCE-DERIVED`; `PROPOSED` |
| Journey state | **Not present in Module 001.** DGP's own 10-stage list and the strategic journey (§6) are the only sources for this concept. | `UNKNOWN` whether Module 001's author considered "journey state" part of Relationship Memory or a separate DGP concept — no source states it either way |
| Consent/preferences | **Organizational Rules** → "Respect privacy and consent"; **Relationship Preferences** category generally | `SOURCE-DERIVED` (the principle is stated); `PROPOSED` (no consent data model is specified) |

**Architectural placement (`INFERRED`, this mission's own synthesis, not stated by any source):** Relationship Memory reads as belonging to the **Shared/Core Records layer** (§2), not to DGP itself, because Module 001's own text is explicit that "the module does not create relationships" and exists to "make organizational knowledge available to the right people at the right time" — a shared-substrate framing, not a growth-journey framing. If adopted, this resolves part of the brief's §6 god-module concern structurally: DGP would consume identity/history/preference data owned by a shared layer, rather than owning that data itself.

**Explicitly not decided here, per the brief's own instruction ("do not implement schemas... establish conceptual ownership only"):** whether "household/family" is a first-class entity; the exact boundary between "Relationship History" (raw log, arguably shared-layer) and "journey state" (interpreted signal, arguably DGP-owned); whether Module 001 (TGP-era, undated within itself) is intended by anyone to carry forward into Temple Suite/DGP at all, versus being superseded TGP-phase material. All three are logged as `OPEN` in §13.

---

## 5. DGP Architecture

Restating `TSAAS-RECON-001` §7's finding, which this mission is authorized to materialize (`TSAAS-DEC-001` §3 item 4) but not to re-derive or reopen:

**Presentation hierarchy:** a conventional module — "Module 8 of 9," "Temple Suite module," "Phase 3A." `DECIDED`/`SOURCE-DERIVED`.

**Architectural reality:** DGP's own 10-stage journey definition names and consumes signals from at least five peer domains by name — Book Distribution ("Book Distribution Tracking"), Volunteer Management ("Volunteer Engagement"), Seva Scheduling ("Seva Participation"), Events ("Event Registration"), and Analytics (DGP's dashboards feed it; "Community Analytics" also appears inside DGP's own module list per `Strategic Direction.pdf`). No other Temple Suite module names this many explicit peer-domain dependencies. `SOURCE-DERIVED`.

**Conclusion, preserved exactly:** DGP is **presented** as a peer module but **functions** as a journey/orchestration capability. `INFERRED` (the combination reading); the underlying cross-references are `SOURCE-DERIVED`.

**This mission's own materialization, going one level further than `TSAAS-RECON-001` did (which stopped at "orchestration capability" without specifying ownership boundaries) — per the brief's explicit instruction not to let DGP become a "god module":**

### What belongs directly to DGP (`PROPOSED`, architectural boundary — not evidenced as a documented rule, but consistent with every source read)
- Journey/segmentation state (which stage a person is at, and why).
- Interest classification and routing logic (which programs/groups a person is directed toward).
- Mentor-assignment decisions and mentor-relationship tracking *as a journey concept* (distinct from a Volunteer Management "role assignment," which is a different fact about a different kind of relationship).
- Journey-specific follow-up triggering ("this person is at stage X, therefore trigger Y").
- Its own stage-progression analytics feeding the Analytics domain.

### What belongs to peer domains, and DGP references rather than owns (`PROPOSED`, direct application of the brief's own "must NOT own" instruction)
- Seva bookings/records — owned by Seva Scheduling; DGP reads seva-participation signals.
- Volunteer shift/role records — owned by Volunteer Management; DGP reads volunteer-engagement signals.
- Book distribution stock/records — owned by Book Distribution; DGP reads distribution-tracking signals.
- Event registration/attendance records — owned by Events; DGP reads registration signals.
- Donation records — owned by Donation Management; no source establishes DGP consuming this directly, and none is proposed here.
- Raw identity/relationship-history data — per §4, proposed to belong to a shared Core Records layer, with DGP as a consumer, not the owner.
- General (non-journey-triggered) community communications — per §3.7's flagged ambiguity, this boundary is explicitly **not** resolved.

**Anti-pattern named and avoided:** if DGP were to directly own seva records, volunteer records, book records, or event records (rather than referencing signals from the domains that own them), it would become the "god module" the brief explicitly prohibits (§6 of the brief). This document does not authorize that shape.

---

## 6. Devotee Journey Model

**The strategic journey, preserved exactly, per the brief's own §7 text and `TSAAS-DEC-001` §3 item 5:**

```
Awareness → Visit → Registration → First Association → Belonging → Education → Practice → Service → Leadership → Guide Others
```

**Stage classification (`SOURCE-DERIVED`, restating `TSAAS-RECON-001` §8, not re-derived):**

| Stages | Classification |
|---|---|
| Awareness → Visit → Registration → First Association → Belonging | Pilot/MVP capability — the PNG's own "MVP Boundary" marker is drawn here |
| Education → Practice → Service → Leadership → Guide Others | Future capability — vision, not first-implementation scope |

**Evidence-triggered vs. human-judgement transitions (`INFERRED`, this mission's own synthesis, directly anchored to the five-source Human/Software convergence `TSAAS-RECON-001` §9 already established as the strongest `SOURCE-DERIVED` material in the whole evidence base):**

- **System-assisted, evidence-recordable transitions:** Awareness→Visit (a registration/check-in event), Visit→Registration (a registration form submission), Registration→First Association (recorded attendance/interaction count crossing a threshold — mechanism `PROPOSED`, not specified by any source). The system may record that these events *occurred*.
- **Requires human judgement, per the Human/Software boundary (§7):** First Association→Belonging, and every transition from Belonging onward, because "Belonging" and later stages are relational/spiritual states, not transaction counts — consistent with every one of the five sources' "shall not... determine spiritual advancement" language. The system may surface evidence (visit frequency, seva participation, mentor notes) that a human uses to judge the transition; it must not compute the transition itself. `INFERRED` from the Human/Software principle, applied to this specific journey.

**A previously-uncatalogued fourth-ish enumeration, disclosed additively (per the brief's "preserve the conflict" instruction), not merged into any list above:** `Temple Suite Strategic Direction.pdf` p.3 states a "Proposed Temple Suite Model" journey chain — *"Visitor → Registration → Follow-up → Mentor Assignment → Course Enrollment → Book Distribution → Seva Participation → Volunteer Engagement → Leadership Development → Community Builder"* — presented as the *journey-centric* alternative to a *"Visitor → Donation → Receipt → Report"* transaction-centric model. This is worded differently from both DGP's own canonical 10-stage list (`TSAAS-RECON-001` §6 item 2: Outreach Programs→...→Leadership Development) and from `Strategic Direction.pdf`'s own separate page-4 "Devotee Growth Platform Modules" 10-item list (already catalogued by `TSAAS-RECON-001` §6 item 6). Three non-identical enumerations now exist within evidence touching this one document alone. **This mission does not attempt to reconcile them** — consistent with `TSAAS-RECON-001` §6's own explicit discipline ("do not select the newest list merely because it is newest") and the brief's own instruction to preserve rather than silently merge conflicting evidence. Logged in §14 (Evidence/Provenance Matrix) and flagged as `OPEN` in §13.

---

## 7. Workflow Map

Given the evidence ceiling (§3), this is a map of **documented cross-domain signal flows**, not a full business-process workflow specification — the brief authorizes conceptual architecture, not workflow design at implementation depth.

```
Seva Scheduling  ──(seva participation)──────────────┐
Volunteer Mgmt   ──(volunteer engagement)─────────────┤
Book Distribution──(distribution tracking)────────────┼──►  DGP  ──► journey-stage evidence ──► Analytics
Events           ──(registration/attendance)──────────┤            │
[Shared Records] ──(identity, history, preferences)───┘            └──► Communications/Automation
                                                                          (follow-up triggers, notifications —
                                                                           boundary with Community Engagement
                                                                           unresolved, §3.7)

Donation Mgmt ─────────────────────────────────────────────────────► Analytics  (no evidenced DGP linkage)
Inventory ─────(usage by event)───────────────────────► Events
```

**Classification:** the four DGP-inbound arrows are `SOURCE-DERIVED` (§5–§6). The Shared Records arrow is `PROPOSED` (§4). The Donation→Analytics and Inventory→Events arrows are `INFERRED` from each domain's own feature description, not explicitly cross-referenced by any source. This diagram is illustrative of conceptual data flow, not an implementation-ready sequence or event schema.

---

## 8. Human/Software Boundary

Restated in full, per the brief's own requirement that this document include it, drawing directly on `TSAAS-RECON-001` §9's five-source convergence — not re-derived, since that finding is already at maximum available evidentiary strength:

| | Human | Software |
|---|---|---|
| Responsibilities | Welcoming, relationship building, guidance, teaching, mentoring, encouragement, spiritual care | Registration, segmentation, guide-assignment support, notifications, reminders, engagement tracking, analytics |

**Governing principle, quoted across five independently-dated sources (`SOURCE-DERIVED`):** *"Temple Suite does not replace human relationships. It ensures that sincere seekers do not get lost."* Its strongest, most operational restatement is Module 001's own: *"Technology shall not: Replace conversations. Determine spiritual progress. Automate pastoral care. Override human judgment."*

**Where the boundary is explicitly uncertain (per the brief's §8 instruction to identify ambiguity, not resolve it):**
1. **Mentor assignment.** Is the *initial suggestion* of a mentor a software function (segmentation-based routing, "software responsibility") or does the assignment itself require human confirmation before it takes effect? No source specifies whether "Guide Assignment Support" (explicitly a software responsibility) stops at suggesting a match or extends to finalizing one. `UNKNOWN`.
2. **Follow-up prioritization.** "Follow-Up Automation" (Strategic Direction.pdf) is framed as software, but deciding *which* follow-up matters most for a specific person edges toward judgement about their spiritual readiness — the same boundary Module 001's "Organizational Rules" warn against ("Never make spiritual judgments") applied to a different function (triage, not advancement). `UNKNOWN`, flagged rather than assumed.

**Recommendation on constitutional elevation, carried forward unchanged from `TSAAS-RECON-001` §9 and `TSAAS-DEC-001` §3 item 6:** evidence strongly supports elevating this principle to a Temple Suite Product Principle; this document does not perform that elevation (it would be a constitutional act outside this mission's authority) and records it as `OPEN` in §13.

---

## 9. Pilot Boundary

Preserved exactly, per the brief's §9 instruction and `TSAAS-DEC-001` §3 item 5:

**Pilot scope:** Awareness → Visit → Registration → First Association → Belonging.

**Three-way distinction, restated from `TSAAS-RECON-001` §11 (`SOURCE-DERIVED`, not re-derived):**

| Layer | Scope | Evidence |
|---|---|---|
| **Platform capability** (full vision) | All nine Temple Suite modules; full 10-stage strategic journey through "Guide Others" | `POA-PJR-002` §4; brief §7 |
| **Pilot capability** (first DGP implementation) | Awareness→Belonging span; ISKCON Lucknow named pilot site; `Strategic Direction.pdf`'s own explicit pilot scope: *"Registration, Segmentation, Follow-up, Mentor assignment, Course tracking, Volunteer onboarding, Reporting"* — **note this list includes "Course tracking," which sits astride the Belonging/Education boundary; this is a direct textual tension with the PNG's own MVP-boundary marker (Belonging as the cutoff) that this mission does not resolve, flagged as `OPEN`** | `Strategic Direction.pdf` p.7; `TSAAS-RECON-001` §8/§11 |
| **Future roadmap capability** | Education→Guide Others stages; remaining eight modules beyond DGP; multi-temple rollout | Explicit exclusions in `TSAAS-001`'s own MVP definition and the PNG's MVP marker |

**What the first DGP implementation must prove (`INFERRED`, this mission's synthesis from `Strategic Direction.pdf`'s own stated philosophy — "Run the New Devotee Program. Observe bottlenecks. Document processes. Measure outcomes. Build software around proven workflows"):** that a structured registration→follow-up→mentor-assignment→engagement-tracking flow measurably improves whether a first-time visitor becomes a returning, known individual — not that the full nine-module platform works end-to-end, and not that later spiritual-development stages can be system-assisted.

**Not expanded merely because later stages exist in the vision**, per the brief's explicit instruction — this document does not add Book Distribution, full Volunteer Management, Donation Management, or multi-temple scope to the pilot boundary.

---

## 10. Multi-Tenant Considerations

The brief authorizes conceptual-level examination only ("do not implement multi-tenancy yet"). No source addresses multi-tenancy directly — every principle below is `PROPOSED`, derived by this mission from the single-tenant (ISKCON Lucknow) evidence base by extrapolation, not from any multi-tenant-specific source material.

Candidate tenant-safety principles, each `PROPOSED`:
1. **Identity must be tenant-scoped from the start**, even in a single-temple pilot — because Relationship Memory (§4) is explicitly person-centered, and a person's data must not leak across temple boundaries once a second temple is onboarded. `Licensing Proposal_V2.docx` §3's data-ownership split ("ISKCON Lucknow retains ownership of: Organizational data, Devotee information...") is consistent with this but does not itself state a technical tenancy model.
2. **Module activation must be tenant-configurable**, not globally on/off — `Licensing Proposal_V2.docx` §4/§10's tiered licensing model ("Standard Temple License, Multi-Temple License, Enterprise License...") implies different temples may activate different module subsets, which has direct architectural weight: domain ownership boundaries (§3) must not assume every tenant has every module active.
3. **DGP's journey model may need to be tenant-configurable in its later stages** (Education/Practice/Service content is plausibly institution-specific — e.g., ISKCON-specific course names like "Bhagavad Gita," "Bhakti Shastri" appear in `Strategic Direction.pdf`), while the shared-record substrate (§4) and the pilot-stage journey (Awareness→Belonging) are more plausibly tenant-generic. `PROPOSED`, not evidenced — no source states this distinction; it follows from the ISKCON-specific naming observed in the one pilot's own materials.
4. **Analytics aggregation must respect tenant boundaries** by default, with any cross-temple ("Network," per the source's own four-phase roadmap: "Foundation → Expansion → Automation → Network") aggregation being an explicit, opt-in capability rather than the default. `PROPOSED`, loosely anchored to the "Network" roadmap-phase name but not elaborated by any source.

None of this is implemented, decided, or frozen here.

---

## 11. Commercial Architecture Considerations

Per the brief's explicit instruction: no pricing is performed here. `TSAAS-RECON-001` §10's commercial-status findings stand unchanged and are not restated in full — only their **architectural implications** are addressed, using `Licensing Proposal_V2.docx`'s structure (read fresh this session for shape, not status) as the evidentiary basis. Every item below is `PROPOSED`.

- **Ownership separation has architectural weight, not just legal weight:** `Licensing Proposal_V2.docx` §3 separates "Paravyoma Technologies retains ownership of: Source Code, Product Architecture, IP, Product Roadmap, Standard Modules..." from "ISKCON Lucknow retains ownership of: Organizational data, Devotee information...". This implies the shared-record model (§4) and journey data (§6) must be architecturally exportable/deletable per-tenant independent of the platform codebase — a data-portability requirement this document surfaces but does not design.
- **Subscription vs. implementation-services split** (`Licensing Proposal_V2.docx` §5–§6: platform access/updates/support vs. configuration/training/deployment as a separately-scoped engagement) implies the architecture should be able to distinguish "platform-standard behavior" from "tenant-specific configuration" as a first-class concept, not an ad hoc customization layer.
- **Module activation as a licensing unit** (§10's tier progression: Pilot SaaS License → Standard Temple License → Multi-Temple License → Enterprise License, "Each model follows the same architectural and governance principles while allowing commercial flexibility") implies the nine-module domain map (§3) should remain independently activatable per module, reinforcing rather than contradicting §3's domain-boundary findings.
- **Pilot → production progression** is named as a licensing path, not an architecture decision — this document does not propose a specific technical migration mechanism for it.

**Not performed:** any price, term, or specific licensing clause. All commercial figures remain exactly as `TSAAS-RECON-001` §10 classified them (`HISTORICAL`/`PROPOSED`, none `APPROVED`/`EXECUTED`).

---

## 12. AI/Automation Boundary

Per the brief's §13, restating `TSAAS-RECON-001` §9's already-quoted material (not re-fetched, since that report already extracted the precise language needed):

**Where AI/automation could eventually assist (`PROPOSED`, per `Temple SaaS Vision.docx`'s own "Good" list, quoted by `TSAAS-RECON-001` §9):** classify leads, summarize, automate reminders, route enquiries. Extending this to the domain map (§3) and journey model (§6), plausible future assistance points, `PROPOSED`, not evidenced beyond the general principle: segmentation suggestions (interest classification, §5), follow-up prioritization *support* (surfacing candidates for human review, not deciding), anomaly detection in Analytics (e.g., unusual drop in seva participation), and administrative summarization (mentor-meeting notes, per Module 001's "Notes" field).

**Where AI/automation must remain advisory, never authoritative (`SOURCE-DERIVED`, quoted verbatim by `TSAAS-RECON-001` §9 from three of that section's five independently-dated sources — `Temple SaaS Vision.docx`'s "Bad" list, `Temple SaaS Operational Validation.docx`'s "shall not" list, and `Temple Growth Platform - Module 001.docx`'s "Technology shall not" list):** it must not replace counseling, make spiritual decisions, determine devotional readiness, judge spiritual advancement, replace personal guidance, automate pastoral decisions, or override human judgment. This applies directly to §6's stage-transition boundary: any AI/automation touching Belonging-and-later transitions is explicitly out of bounds by this evidence, not merely by general caution.

**No AI agents are built by this document or authorized by this mission**, per the brief's explicit stop condition.

---

## 13. Open Decisions

Per the brief's §14 instruction: "if a decision cannot yet be justified by evidence, classify it as `OPEN`, not `READY`." Every decision below is `OPEN` — none is `READY`, because none has the kind of direct, unambiguous evidentiary support that `TSAAS-DEC-001` required before ruling on naming/hierarchy.

1. **Product/module boundaries** — specifically, the Community Engagement vs. DGP communications-ownership ambiguity (§3.7). `OPEN`.
2. **Shared identity** — whether Relationship Memory (§4) is adopted as Temple Suite's shared-record substrate, whether "household/family" is first-class, and whether "Relationship History" (raw log) and "journey state" (interpreted) are owned by the same or different layers. `OPEN`.
3. **Domain ownership** — the full "must NOT own" boundary set in §3/§5 is `PROPOSED` by this mission, not ratified by any Chief Architect decision. `OPEN`.
4. **DGP orchestration boundary** — §5's "what belongs directly to DGP" list is this mission's own proposal, explicitly flagged as such. `OPEN`.
5. **Journey-state model** — which of the (now four, per §6) non-identical journey/module enumerations, if any, becomes authoritative for implementation; the "Course tracking" pilot-scope tension noted in §9. `OPEN`.
6. **Human/software boundary** — whether to elevate the principle (§8) into a formal Temple Suite Product Principle or constitutional artifact; the two specific ambiguities named in §8 (mentor-assignment finalization, follow-up prioritization). `OPEN`.
7. **Pilot boundary** — confirmed at the Awareness→Belonging level by `TSAAS-DEC-001`, but the "Course tracking" tension (§9) is `OPEN` within that otherwise-settled scope.
8. **Tenant boundary** — every principle in §10 is `PROPOSED`, none `READY`. `OPEN`.
9. **Integration boundary** — not addressed by this document at all; no source discusses external system integration for Temple Suite. `OPEN`, unaddressed.
10. **Observability requirements** — not addressed by this document; the brief's own stop condition explicitly excludes "runtime observation infrastructure" from this mission. `OPEN`, unaddressed, and explicitly out of scope for `TSAAS-001` itself.
11. **Artifact family designation** — whether "product architecture" documents (this one) should have their own artifact family distinct from `PJR`, per the naming-convention note in this document's header. `OPEN`.
12. **TGP↔ISKCON-Lucknow-pilot identity** — unaffected by this mission, remains `OPEN` per `TSAAS-RECON-001` §5/§13 (not re-adjudicated here; outside this mission's scope).

---

## 14. Evidence/Provenance Matrix

| Conclusion | Classification | Primary source(s) |
|---|---|---|
| Temple Suite rejects generic ERP/CRM framing, centers devotee lifecycle | `SOURCE-DERIVED` | `Strategic Direction.pdf` pp.1,3 (read directly); `temple-suite/page.tsx` "moat" section (via `POA-PJR-002` §4/§8's capture, not independently re-read) |
| Product hierarchy: Paravyoma→Temple SaaS→Temple Suite→DGP | `DECIDED` | `TSAAS-DEC-001` §3 |
| Four-layer architecture (record/operations/governance/insight) | `SOURCE-DERIVED` | `temple-suite/page.tsx`, cited `POA-PJR-002` §4 |
| DGP node placement outside "Operational Domains" | `INFERRED` | This mission, §2, justified by §5 |
| Eight non-DGP domains' purpose/responsibility | `SOURCE-DERIVED` | `POA-PJR-002` §4 |
| Eight non-DGP domains' entities/workflows/dependencies/must-not-own | `PROPOSED` | This mission's own extrapolation, §3 |
| DGP presented as module, functions as cross-module orchestrator | `DECIDED` (characterization requirement), `INFERRED`/`SOURCE-DERIVED` (the finding itself) | `TSAAS-RECON-001` §7; `TSAAS-DEC-001` §3 item 4 |
| DGP ownership boundary (owns journey state, references peer records) | `PROPOSED` | This mission, §5 |
| Community Engagement/DGP communications overlap | `SOURCE-DERIVED` (the overlap exists), unresolved by design | This mission, §3.7 |
| Relationship Memory as candidate shared-record model | `SOURCE-DERIVED` (content), `PROPOSED` (adoption) | `Temple Growth Platform - Module 001.docx`, this mission's first read of it, §4 |
| Strategic 10-stage journey, MVP boundary at Belonging | `DECIDED`/`SOURCE-DERIVED` | `TSAAS-DEC-001` §3 item 5; `TSAAS-RECON-001` §8 |
| A fourth, previously-uncatalogued journey enumeration exists | `SOURCE-DERIVED` (its existence), `UNKNOWN` (its relationship to others) | `Strategic Direction.pdf` p.3, this mission's own read |
| Human/software boundary, five-source convergence | `SOURCE-DERIVED` | `TSAAS-RECON-001` §9 |
| Pilot scope tension ("Course tracking" vs. Belonging cutoff) | `SOURCE-DERIVED` (the tension), `OPEN` (resolution) | `Strategic Direction.pdf` p.7 vs. PNG MVP marker, this mission, §9 |
| Multi-tenant principles | `PROPOSED` | This mission, §10, extrapolated from `Licensing Proposal_V2.docx` |
| Commercial architecture implications | `PROPOSED` | `Licensing Proposal_V2.docx` §3, §5–§6, §10 |
| AI/automation boundary | `SOURCE-DERIVED` | `TSAAS-RECON-001` §9 (not re-fetched) |

---

## 15. Explicit Non-Actions

Per the brief's §17 STOP CONDITION, this mission did **not**:
- Write application code, database migrations, APIs, or UI.
- Deploy anything, or begin the ISKCON Lucknow pilot.
- Create the POA dashboard or runtime observation infrastructure.
- Begin `TSAAS-002` or any subsequent mission.
- Implement any schema — §4's entity list is conceptual ownership only, explicitly marked `PROPOSED`.
- Perform pricing, or treat any commercial figure as operative (§11).
- Build AI agents (§12).
- Elevate the Human/Software boundary into a constitutional artifact (§8, §13 item 6).
- Resolve the TGP↔DGP-pilot identity question (`TSAAS-RECON-001` §5/§13) — untouched, outside scope.
- Resolve the Community Engagement/DGP communications ambiguity (§3.7) or any of the twelve `OPEN` items in §13 — identified, not decided.
- Rewrite `POA-PJR-002`, `POA-ADR-001`, `TSAAS-RECON-001-COMPLETION-REPORT.md`, or any other prior artifact — this document is new (`POA-PJR-003`); any cross-reference into prior artifacts is additive (see §16).
- Restructure any repository directory, or create a `30-Products/` workspace for Temple Suite/DGP — this document lives entirely under the existing `20-Shared/PJR/` path.
- Modify the source archive (`D:\ISKCON LKO\ISKCON SAAS App`) in any way.

---

## 16. Integrity Verification

- **Evidence sources newly read this mission** (`Temple Growth Platform - Module 001.docx`, `Temple Suite Strategic Direction.pdf`, `Licensing Proposal_V2.docx`) are disclosed as newly read in §0, not presented as if previously catalogued by `TSAAS-RECON-001`.
- **`TSAAS-RECON-001` and `TSAAS-DEC-001` findings are cited, not re-derived** — every restatement in §5, §6 (strategic journey/MVP boundary), §8, §9, §12 is attributed to its origin, and this document does not claim independent verification of those findings.
- **`TSAAS-RECON-001-COMPLETION-REPORT.md` remains untracked in git** at the time of this mission — cited by content per §0, not assumed committed; this mission does not commit it (it belongs to that mission, per that report's own §16).
- **No prior artifact was rewritten.** `POA-PJR-002` receives one additive addendum ("Addendum (2026-08-25, `TSAAS-001`) — Product Architecture Materialized," appended to the end of that file) pointing to this document's existence; no existing section of any prior file is altered.
- **Repository state before this mission's commit:** `HEAD == origin/main`, working tree clean except pre-existing untracked files from prior sessions (43 files under `40-Runtime/`, none of which this mission created, edited, or staged).
- **Commit scope:** this mission stages and commits only `20-Shared/PJR/POA-PJR-003-TEMPLE-SAAS-PRODUCT-ARCHITECTURE.md`, the additive addendum to `POA-PJR-002`, and `40-Runtime/TSAAS-001-COMPLETION-REPORT.md`, by explicit path — never a broad `git add`.
- **Post-commit verification:** exact commit SHA and full changed-file list are reported in `40-Runtime/TSAAS-001-COMPLETION-REPORT.md` §"Resulting Commit," populated after the commit, following this repository's established pattern for `#11`/`§11` fields in prior TSAAS records.

**This document stops here. No development, no pilot, no dashboard, and no `TSAAS-002` proceeds without separate, explicit Chief Architect/Commander authorization, per the brief's own STOP CONDITION.**
