# POA-HISTORICAL-EVOLUTION-REGISTER-001

## Historical Evolution Register — Preserved Institutional Memory (Non-Authoritative)

---

# 1. Artifact Identity

| Field                 | Value                                          |
| --------------------- | ----------------------------------------------- |
| Artifact ID           | `POA-HISTORICAL-EVOLUTION-REGISTER-001` — assigned by Commander ruling, 2026-10-02 (mission `POA-GOV-CLOSURE-001`, Phase A1); filename aligned to the ID per `CLAUDE.md` Rule 5 |
| Artifact Name         | Historical Evolution Register                  |
| Version               | 0.1.0                                          |
| Status                | **Draft — tracked; not yet ratified as an authoritative historical-evolution record.** Committed in the bounded `POA-GOV-CLOSURE-001` governance closure commit (SHA recorded in `40-Runtime/POA-GOV-CLOSURE-001-EXECUTION-RECORD.md`; a commit cannot cite its own SHA); not pushed |
| Repository Domain     | Runtime / Evidence (`40-Runtime/`)             |
| Authority             | **None.** This register is not an architectural authority (§2) |
| Established By        | Mission `POA-HISTORICAL-EVOLUTION-REGISTER-001` (creation instruction, Deployment mirror), 2026-10-02 |
| Primary evidence      | `40-Runtime/POA-HISTORICAL-EVOLUTION-ARCHAEOLOGY-001-REPORT.md` (untracked, 2026-10-02), plus the specific artifacts it cites |
| Format reference      | `GAP-REGISTER-001` (numbered sections, Artifact Identity table, append-only register) and `POA-PJR-001` (per-field confidence markers) |

---

# 2. Purpose, Status and Authority

**Purpose.** To preserve what POA believed, learned, changed, kept, rejected and left open — so that POA can evolve without forgetting how it became what it is. Each entry records a historically evidenced concept, its evidence and provenance, its relationship to the current architecture, and an honest disposition.

**Authority statement (binding on every reader of this document):**

> **Historical presence does not make a concept current architecture.**
>
> **Inclusion in this register does not authorize implementation.**
>
> **The register preserves institutional memory; it does not create authority.**

Specifically, this register does not: modify the Constitution, `POA-ADR-001`, any standard or authorization record; ratify, adopt, revive or promote any concept; implement or specify any council, Deliberation Gate, Gate Guard, Sentinel or other component; alter Steward or Execution Agent authority; or alter the Mothership or Command Center. Current authority remains exactly where the committed records place it (`CLAUDE.md` Rules 1–10).

**Relation to `GAP-REGISTER-001`:** that register tracks *governance gaps*; this one tracks *historical concepts*. A concept recorded here as UNRESOLVED is **not** thereby a registered governance gap. Promotion to a gap requires its own Commander act.

---

# 2A. Authority Boundary

*Added by Commander ruling, 2026-10-02 (`POA-GOV-CLOSURE-001`, Phase A2). This section states what authority the register has and does not have; it restates and sharpens §2 and changes none of the 33 entries.*

**What the register is.** A historical / evolutionary **reference** artifact. It records architectural evolution: proposals, experiments, rejected ideas, transformations, and unresolved provenance — each with its evidence, tier and confidence (§4).

**What authority it has.** None over architecture. Its only function is to preserve institutional memory and to make its own classifications and uncertainties explicit and reviewable.

**What it does not do.** The register:

1. **does not authorize implementation** of any recorded concept, or of anything else;
2. **does not amend, supersede, interpret or override** the Constitution (`CONST-001`), `POA-ADR-001` decisions, standards (`POA-STD-011` and others), authorization records (including Mission Packages and their ratifying records), or any ratified architectural ruling, including the Q5 and Q6/R-1 rulings;
3. **does not make any historical entry an architectural requirement** by its presence, its disposition label, or its position in a lineage or "descendant" table;
4. **does not convert ideas into requirements, silently or otherwise.** A disposition such as TRANSFORMED or ABSORBED describes the register's reading of evidence; it is not a ratified finding that the concept is current architecture. Where this register and a committed normative record differ, **the committed normative record governs** and the difference is recorded, not resolved here (`CLAUDE.md` Rule 8).

**Status of unresolved material.** Concepts recorded as **UNRESOLVED**, **UNVERIFIED / PROVENANCE UNRESOLVED**, or carrying the status **PROPOSED** / **UNBUILT** (for example the Five-Counselor Model, Deliberation Gate, Gate Guard, Sentinel, Governance Council, Architecture Governance Board) **must not be treated as current architecture** and must not be cited as authority for any mission, design or review.

**Adoption of a historical concept** requires a later, explicit normative or architectural decision — a Commander act recorded in `POA-ADR-001` (or an artifact of equivalent designated standing) under `POA-STD-011` §6.4, and, for implementation, a Mission Package under §6.3–§6.7. Reclassifying an entry in this register is never such a decision (§10 rule 3).

**Governing principle.** *Historical inspiration is input. Ratified architecture is authority.*

---

# 3. Classification Vocabulary

| Disposition | Meaning (used only where evidence supports it) |
|---|---|
| **ABSORBED** | The concept exists substantially, in recognizable form, in the current committed architecture |
| **TRANSFORMED** | The underlying capability survives but its architectural expression changed |
| **SUPERSEDED** | Deliberately replaced by another model (evidence of the replacement is required) |
| **DEFERRED** | Remains valid and was intentionally postponed — **requires a record of the postponement**, not merely "not built" |
| **REJECTED** | Explicitly determined to be wrong or undesirable by the cited record |
| **UNVERIFIED / PROVENANCE UNRESOLVED** | The concept is named in later material but its claimed earlier existence/origin is not established by recovered evidence |
| **UNRESOLVED** | The concept is evidenced, but its disposition cannot be established from the records; **not** a rejection and **not** a deferral |

Status words used in the Notes column (**PROPOSED**, **UNBUILT**, **DRAFT**, **NORMATIVE**) describe the cited artifact's own declared state; they are not dispositions.

**Vocabulary difference from the archaeology report.** The report used LOST / UNRESOLVED and, by inference, DEFERRED. This register has no LOST class, and applies DEFERRED only where a record of postponement exists. Entries the report called "DEFERRED [INFERRED]" (Deliberation Gate, Gate Guard, Sentinel) are therefore recorded here as **UNRESOLVED** with status PROPOSED / UNBUILT; the report's "SUPERSEDED [INFERRED]" for Probe is recorded as **UNVERIFIED / PROVENANCE UNRESOLVED**. This is a deliberate, more conservative reading, not a new finding about the evidence.

---

# 4. Evidence and Provenance Rules

1. **Tags (every substantive entry).** **VERIFIED** — directly supported by a located repository/vault artifact. **INFERRED** — a reasoned mapping from evidence. **UNKNOWN** — not established. `[DECISION]` appears only when quoting an existing authoritative decision.
2. **Source tiers.** **T1** committed repository artifact · **T6** git history · **T7** vault / Deployment-mirror material (docx, images, briefs) · **T8** existing untracked repository report. Tier is cited with every evidence reference. T8 and T7 material establishes *what was written or drawn*, not what was ratified.
3. **No recollection as history.** Conversational recollection, including a brief's statement of a "historical" model, is not evidence. A name appearing in a later brief proves only that the later brief used it.
4. **No manufactured continuity.** Similarity of two concepts is recorded as *resemblance*, never as lineage, unless an artifact itself links them.
5. **No Organization A content.** Entries were drawn only from the cited artifacts; `60-Organization-A/` was not accessed.
6. **Confidence column:** **High** (T1 text read directly) · **Medium** (T7/T8 text read directly, or one inference step) · **Low** (inference, single weak source, or unread-source limitation).
7. **Vault dates** are file-system modification times (INFERRED reliable as creation order; not independently verified).

---

# 5. Historical Evolution Register

> Line numbers refer to the files as read on 2026-10-02.

## 5.1 Foundations and early vision

| ID | Concept | Historical Evidence | Provenance | Disposition | Current Relationship | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| HE-01 | **Constitution as supreme authority** | VERIFIED: Constitution docx (T7, 2026-06-25) reproduced as `CONST-001` (T1); POA-001 §6.5 "Constitution provides the highest governing authority" (T7) | VERIFIED T1/T7 | **ABSORBED** | `10-Constitution/CONST-001…` is root authority; Const. Art. VIII bars AI approval authority (cited by the Q5 record in `POA-ADR-001`) | High | Art. XIV "Stewardship" is a *value* (see HE-18) |
| HE-02 | **Six-layer model** (Identity, Governance, Knowledge, Execution, Intelligence, Technology; POA-001, POA-101…106, Mindmap) | VERIFIED: POA-001 §2.3–2.8, POA-101…106 (T7, 2026-06-25/26); Mindmap image (T7, 06-26); `POA-CON-001` §5 records POA-000/001 as Draft 0.1.0, "not materialized as binding architecture" (T1) | VERIFIED T7; status VERIFIED T1 | **TRANSFORMED** | Repository is organized by artifact families/directories, not by these layers. INFERRED mapping via the later "Five Core Domains" (HE-03) | Medium | Author's own words in T7 "Where We Stand Today": "a refinement of our earlier thinking". No committed record ratifies or rejects the six-layer model. `GAP-REGISTER-001` GAP-005 tracks its Draft status |
| HE-03 | **"Five Core Domains" and Capability Map** (Identity, Governance, Knowledge, Operations, Intelligence; Experience as own domain) | VERIFIED: `POA - Where We Stand Today.docx` (T7, 2026-07-24) | VERIFIED T7 | **UNRESOLVED** | No committed record adopts, maps or rejects it | Medium | **Not the five counselors** — recorded to prevent later conflation. Capability list names *Sentinel* and *Mission Orchestrator* under Operations |
| HE-04 | **ADRs as the decision-record mechanism** | VERIFIED: POA-001 §6.6 (T7); mindmap "ADRs" (T7) | VERIFIED T7 → T1 | **ABSORBED** | `POA-ADR-001`, `ADR-002`, `ADR-003`, `ADR-RM-001` (T1) | High | — |
| HE-05 | **Architectural review / certification** (mindmap "Architecture Review (AQR)"; "Architectural Quality Review", POA-001 §6.8) | VERIFIED: mindmap (T7); POA-001 §6.8 (T7) | VERIFIED T7 | **TRANSFORMED** | `ACS-001` certification under Steward review, Commander supremacy (T1); first certification `CER-001` (2026-08-17) | Medium | INFERRED mapping (function, not lineage). **Acronym AQR has three expansions across vault artifacts — see HE-07 and §8 Q-9** |
| HE-06 | **Architecture Governance Board (AGB)** | VERIFIED: Mindmap "Governance of the Architecture" (T7, 06-26) | VERIFIED T7 (image only) | **UNRESOLVED** | None found. Zero repository hits (`git grep`) | Medium | No recovered text defines AGB's membership, powers or relation to the Commander/Steward. Do not read it as the Governance Council (HE-12) |
| HE-07 | **Architecture Improvement Proposals (AIPs) / After-Action Review (as "AQR")** | VERIFIED: POA-001 §6.9 (AIPs), mindmap (T7); infographic Part 3 "AQR (After Action Review)" (T7, 06-27) | VERIFIED T7 | **UNRESOLVED** | AIPs: zero repository hits. After-action: no committed equivalent step (resemblance only: retrospective/completion reports) | Medium | **Acronym ambiguity:** "AQR" = "Architecture Review" (mindmap), "Architectural Quality Review" (POA-001 §6.8), "After Action Review" (infographic). Recorded as one unresolved vocabulary item |

## 5.2 Knowledge-lifecycle concepts (June 2026 vault vision)

| ID | Concept | Historical Evidence | Provenance | Disposition | Current Relationship | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| HE-08 | **Deep Space Quarantine (DSQ)** — external findings and mission telemetry examined, challenged and validated before entering permanent repositories | VERIFIED: `POA_Infographics.png` Part 8 (T7, 2026-06-27) | VERIFIED T7 (image only) | **UNRESOLVED** | None by name. INFERRED *resemblance only*: ratified knowledge model's classification default `UNCLASSIFIED-DERIVED`, provenance, contradiction preservation (`POA-DEC-ORG-KNOWLEDGE-001`, T1) — no admission/quarantine step | Medium | Zero repository hits for "Deep Space Quarantine"/"DSQ". Listed in §9 |
| HE-09 | **Knowledge Burn** | VERIFIED: infographic Part 3 learning cycle (T7) | VERIFIED T7 | **UNRESOLVED** | None. "production burn" (`POA-KER-001`, `POA-EXB-001`, 2026-06-27, T1) is a repository-production term — **resemblance, not equivalence** | Low | Meaning of "Knowledge Burn" is not defined in any recovered text; UNKNOWN |
| HE-10 | **Research & Learning Layer / learning cycle** (Reality → Mission → Experience → Mission Logs → DSQ → AQR → Knowledge Burn → Repositories → Intelligence Engines → Decision & Execution → New Reality) | VERIFIED: infographic Parts 2–3 (T7); mindmap "Continuous Evolution Loop" Observe→Learn→Decide→Evolve (T7) | VERIFIED T7 | **UNRESOLVED** | INFERRED partial: observation contract, temporal/staleness model (`POA-DEC-ORG-KNOWLEDGE-001` §11–12, T1, ratified) | Medium | Whole cycle not adopted or rejected by any record |
| HE-11 | **Intelligence Engines** (Commercial, Delivery, Financial, Governance) | VERIFIED: infographic Part 6 (T7); POA-001 §2.7 Intelligence Layer "augments human judgment while preserving human accountability" (T7) | VERIFIED T7 | **DEFERRED** | Executive-question synthesis is Phase 6 of `POA-DEC-ORG-KNOWLEDGE-001` §24, "None of the phases below is authorized" (T1); `EIA-001` A2/A3 boundary (T1) | Medium | DEFERRED rests on the committed §24 sequencing and the EIA boundary (postponement is recorded); the per-domain "engine" framing itself is not adopted |

## 5.3 Governance, deliberation and Steward/Execution concepts

| ID | Concept | Historical Evidence | Provenance | Disposition | Current Relationship | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| HE-12 | **Governance Council · Oversight** (console navigation item) | VERIFIED: `POA_Console.png`, `POA_Console_2.png` (T7, 2026-06-30) | VERIFIED T7 (AI-generated concept art; in-image date "SEP 12, 2025", significance UNKNOWN) | **UNRESOLVED** | None found. Possible relation to Deliberation Gate (HE-21) or AGB (HE-06) is **UNKNOWN** | Low | Image label only; no text defines it |
| HE-13 | **Five-Counselor Model** — Contrarian, First Principles Thinker, Expansionist, Outsider, Executor | VERIFIED: the five names appear as a set in `POA-SEC-ORG-001/002 — Mission Execution Brief` (T7, 2026-09-15), the reports answering them (T8), and the 2026-10-02 archaeology brief. **Zero** occurrences in committed files, git history (`git log --all -S`), vault docx or images | **PROVENANCE UNRESOLVED.** Existence earlier than 2026-09-15 **not established**; **not** recorded as the "original POA architecture" | **UNVERIFIED / PROVENANCE UNRESOLVED** | No committed counterpart. T8 `POA-SEC-ORG-002` §9 (PROPOSED) judged a fixed five-seat body "not justified by current evidence" and proposed a reduced Deliberation Gate (HE-21) | High (for the absence finding) | VERIFIED: the five names and their order exactly match the advisor roster of the `llm-council` skill (T7, user-installed; "Based on Karpathy's LLM Council methodology"). INFERRED: an external deliberation-practice origin is likely; UNKNOWN: whether earlier conversations treated it as a POA council. Names are recorded because they appear in later POA material; their claimed earlier provenance is not established |
| HE-14 | **Constitutional Guardian** (possible sixth role) | VERIFIED: named as "previously remembered" in the SEC-ORG-001/002 briefs (T7); merged with the First-Principles lens in T8 `POA-SEC-ORG-002` §9 | **PROVENANCE UNRESOLVED** | **UNVERIFIED / PROVENANCE UNRESOLVED** | INFERRED function overlap: `CLAUDE.md` Rules 3 and 7 (constitutional precedence; no invented policy) | Low | Whether it was ever a formal role: UNKNOWN. Five-vs-six count is unresolved (§8 Q-2) |
| HE-15 | **Executor-as-Counselor** | VERIFIED: appears only as one of the five hypothesis names in the 2026-09-15 briefs; T8 `POA-SEC-ORG-002` §9 (line 142): "Rejected as a counselor role" under Principle G (Execution Does Not Govern) | VERIFIED T7/T8 (a later *explored* concept, rejected in the same work) | **REJECTED** | "Executor" in POA means the executing agent / Authorized Executor (`POA-KER-001`, `POA-EXB-001`, `POA-DEC-ORG-KNOWLEDGE-001` §14.1, T1) | Medium | **Authority caveat:** the rejection is made in an *untracked PROPOSED* report, not in a ratified or committed record. Recorded as the rejection by that architecture work, per the creating instruction; no ratified decision is claimed |
| HE-16 | **Steward as purpose-determining principal** ("The Steward determines purpose"; "steward-approved intent") | VERIFIED: `POA-KER-001` §2, §4 and `README.md` in bootstrap commit `d0a5b55` (2026-06-27, T1/T6); `BOOT-001` "Execution Result returned to Steward" | VERIFIED T1 | **ABSORBED** | Text remains in current Approved `POA-KER-001`. Referent is **ambiguous** (see HE-18): `POA-CON-001` §4 states the six-line "Governing Principle" chain does not appear in the Constitution — "this repository's own interpretive extension" | High (text); Low (referent) | Steward and Execution Agent both exist in the *earliest* committed state. **No "Executor → Steward" evolutionary sequence is recorded or implied** |
| HE-17 | **Chief Navigator & Architecture Steward (= "Chief Architect")** | VERIFIED: `ORC-001-GOV-001.docx` (T7, 2026-07-28) → committed `ORC-001-GOV-001.md`; GOV-003 Addendum (2026-08-11) equates the two titles and delegates certification authority, subject to Commander supremacy (T1) | VERIFIED T7/T1 | **ABSORBED** | NORMATIVE: `ACS-001` §H, `POA-META-002`, `POA-ACC-001` bind this role (T1) | High | Open structural question named, unresolved: reviewer and grantor are the same role (`ACS-001` §I line 122; `POA-META-002` line 233) |
| HE-18 | **Steward — other senses** (S2 Art. XIV Stewardship value; S4 "architectural stewardship" as organizational responsibility; S5 "Steward" metadata field = "Production Engine") | VERIFIED: `CONST-001` Art. XIV (T1); POA-001 §6.11/§11.10/§12.6, POA-Template-001 §2.8 (T7); `POA-PRS-001.docx` (T7) | VERIFIED T1/T7 | **ABSORBED** (S2) · **UNRESOLVED** (S4) · **UNRESOLVED** (S5, carried with PRS-001 — see HE-33) | S2: Constitution. S4/S5: no committed counterpart | Medium | Five senses of "Steward" coexist (S1 = HE-16, S2/S4/S5 here, S3 = HE-17). **Preserved as ambiguity; do not unify** |
| HE-19 | **Execution Agent / "execution authority only"** | VERIFIED: `POA-KER-001` §3 "execution authority only … no governance authority"; `POA-EXB-001` (transfer of approved mission to an Execution Agent), both in `d0a5b55` (2026-06-27) (T1/T6) | VERIFIED T1 | **ABSORBED** | Current: KER-001/EXB-001 Approved; `POA-DEC-ORG-KNOWLEDGE-001` §13.2 "POA holds execution authority only"; approve "never on its own authority"; Q5 prohibits delegating approval to AI/agent/Service identities (`POA-ADR-001`) | High | **Execution and governance were separated in the earliest committed architecture** |
| HE-20 | **Triad "Counsel deliberates. Steward authorizes. Executor executes."** | UNKNOWN as an artifact: not found verbatim anywhere. Nearest text: T8 `POA-SEC-ORG-002` line 101 and §9 "Counsel Authority Boundary" (Counsel challenges/advises; Governance authorizes/decides/certifies) | **PROVENANCE UNRESOLVED** (formulation) | **UNVERIFIED / PROVENANCE UNRESOLVED** | Authorization ≠ Execution is VERIFIED in T1 (HE-19). Deliberation is **not** a ratified component (HE-21) | Medium | Not authoritative on the strength of any brief (the 2026-10-02 brief says so itself) |
| HE-21 | **Deliberation Gate** (advisory, per-decision lenses: constitutional/first-principles, adversarial/contrarian, conditional sovereignty/outsider) | VERIFIED: T8 `POA-SEC-ORG-002` §9 (2026-09-15, PROPOSED); T1 `POA-DEC-ORG-KNOWLEDGE-001` §2.1 line 97 "PROPOSED, unbuilt — Reuse unchanged"; §6.1 line 352; §13.2 | VERIFIED T8; mention VERIFIED T1 | **UNRESOLVED** — status **PROPOSED / UNBUILT** | **Not current normative architecture.** No ratified record builds, mandates or schedules it; absent from §24 sequencing | Medium | See §3 vocabulary note (the report said DEFERRED [INFERRED]). A tension inside the committed decision is recorded at §8 Q-5 |
| HE-22 | **Gate Guard** (boundary admission: "may this cross?") | VERIFIED: T8 `POA-SEC-ORG-002` §7; T1 `POA-DEC-ORG-KNOWLEDGE-001` line 97; `POA-DEC-SEC-001` (T1) | VERIFIED T8; mention VERIFIED T1 | **UNRESOLVED** — status **PROPOSED / UNBUILT** | Not current normative architecture. The Q6 / R-1 gate is handled by governance records, not a Gate Guard component | Medium | T8 itself says "a genuinely new proposal, not a recovered mechanism". Distinct from the local GateGuard tooling hook (name coincidence; not a POA artifact) |
| HE-23 | **Sentinel** (continuity/integrity observation; metadata only, observe-and-escalate) | VERIFIED: infographic/console images "Sentinel · Guardian" (T7, 06-27/06-30); `Where We Stand Today` Capability Map (T7); T8 `POA-SEC-ORG-002` §8; T1 `POA-DEC-SEC-001` lines 61, 248, 260 ("PROPOSED, unbuilt"; detection "inherits Sentinel's own unbuilt status") | VERIFIED T7/T8/T1 | **UNRESOLVED** — status **PROPOSED / UNBUILT** | Witness verification in `50-Mothership` is a partial, INFERRED functional neighbor — not Sentinel | Medium | T8 `POA-SEC-ORG-001` called Sentinel a "clean miss"; that is accurate for the repository and incomplete for the vault (§8 Q-6) |
| HE-24 | **Probe / Mission Probe** | VERIFIED: appears only in the 2026-09-15 briefs; zero other occurrences (T8 `POA-SEC-ORG-001`); T8 `POA-SEC-ORG-002` §10 "do not introduce 'Probe' as new terminology" | **PROVENANCE UNRESOLVED** | **UNVERIFIED / PROVENANCE UNRESOLVED** | INFERRED: the existing Mission Package → EXB → Execution Agent chain covers the described function | Low | No evidence the concept existed to be superseded |

## 5.4 Mothership, console and experience concepts

| ID | Concept | Historical Evidence | Provenance | Disposition | Current Relationship | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| HE-25 | **Mothership / Mission Console — early organizational-visualization vision** | VERIFIED: infographic (mothership motif, T7, 06-27); console concept images "POA // MOTHERSHIP … TRUTH → JUDGMENT → ACTION → IMPACT" (T7, 06-30); "operating interface … the UI becomes a window into POA — not the place where POA is invented" (T7, 07-24) | VERIFIED T7 | **TRANSFORMED** | `50-Mothership` runtime + Command Center, grounded in REAL/DESIGNED/VISION (`POA-MOTHERSHIP-UX-ARCHITECTURE`, `-EXPERIENCE-ARCHITECTURE`, T1); Expression-boundary `ADR-003` (T1) | Medium | INFERRED conceptual lineage via the June vision |
| HE-26 | **"Organizational Mothership" as an Expression Profile** (`POA-VIS-004`) | VERIFIED: `4837e57` (2026-08-11), `POA-VIS-004-COMPLETION-REPORT` (T1/T6) | VERIFIED T1 | **ABSORBED** (as a product profile in `poa-vis-001`) | Remains a registered Expression Profile of `poa-vis-001` | High | **Name collision:** distinct from `50-Mothership` (HE-25). No citation of VIS-004 by BLD-001 or `50-Mothership/IMPLEMENTATION.md` was found — **no lineage asserted** |
| HE-27 | **Mothership as control-plane / governance overseer** | UNKNOWN: asserted only as the premise of the 2026-09-15 briefs; T8 `POA-SEC-ORG-001` found no supporting artifact; T8 `POA-SEC-ORG-002`: "Mothership ≠ Control Plane ≠ Control Panel" | **PROVENANCE UNRESOLVED** | **UNVERIFIED / PROVENANCE UNRESOLVED** | No committed definition | Medium | Three senses of "Mothership" coexist (HE-25, HE-26, this entry); no committed document reconciles them |
| HE-28 | **Layer B demo interaction layer** (canned answers, fictional scenario) | VERIFIED: `POA-DEC-MOTHERSHIP-002` (2026-09-24, T1): classified DEMO, quarantined, default-off | VERIFIED T1 | **REJECTED** (as production behavior; preserved as a labelled design reference) | `src/demo/` quarantined; production use requires a separate authorized mission, real data binding, citation, consent model (`POA-DEC-MOTHERSHIP-002` §7) | High | `[DECISION]` per that record: "QUARANTINE + LABEL + CONVERT TO DEMO-ONLY INFRASTRUCTURE" |
| HE-29 | **"Dashboard with an AI assistant" pattern; decorative celestial objects** | VERIFIED: `POA-MOTHERSHIP-ENVIRONMENT-MODEL` §1 (rejected pattern); `POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE` line 141 "Explicitly rejected: glowing spheres, orbiting planets, avatars … chosen for futurism rather than encoding" (T1) | VERIFIED T1 | **REJECTED** | Governing design constraints for the Command Center | High (for the rejection text) | **Unreconciled tension recorded, not resolved:** the Command Center ships `Starfield`, `OrganizationalCore`, `OrbitalGeometry`, `DomainOrbits`; no read record justifies them as data-encoding (§8 Q-7) |
| HE-30 | **Console navigation domains: Knowledge Core, Experience Core, Mission Intelligence, Repository/Mission Orchestrator, Squadrons** | VERIFIED: console images (T7, 06-30); Handover roadmap chain (T7, 08-19); `PDM-001` §8 (T1); `POA-DEC-ORG-KNOWLEDGE-001` §22 (name "Knowledge Core" deliberately not adopted); `ROADMAP.md` line 51 (Mission Orchestrator/Squadrons "deferred to `ORC-001` … not yet materialized") | VERIFIED T7/T1 | **DEFERRED** (Mission/Repository Orchestrator, Squadrons — postponement recorded in `ROADMAP.md`, `ADR-RM-001`) · **TRANSFORMED** (Experience Core → Expression Layer, INFERRED via `PDM-001` §8) · **UNRESOLVED** (Knowledge Core as a *name*; successor is the not-yet-authorized §24 knowledge-plane phases) | As stated per sub-concept | Medium | Single row; sub-dispositions kept separate to avoid forcing one class |
| HE-31 | **Alexis** (AI executive persona, `POA-VIS-001`) | VERIFIED: `1ea1b34` (2026-08-10); `PDM-001` §8 "real, working, deterministic decision-support example" (T1) | VERIFIED T1 | **UNRESOLVED** | No cited lineage to the Executive Panel / `POA-ORG-KNOW-EXEC-INTERACTION-001`; carried-forward vs. left-in-product is UNKNOWN | Low | Recorded for completeness only |

## 5.5 Maturity, naming and identifier concepts

| ID | Concept | Historical Evidence | Provenance | Disposition | Current Relationship | Confidence | Notes |
|---|---|---|---|---|---|---|---|
| HE-32 | **"Renaissance Age" / "Second Age" / developmental Phase as a state or mechanism** | VERIFIED: console image header "RENAISSANCE AGE" (T7, 06-30); Handover §2 (T7, 08-19): "developmental and communication abstractions … No formal Age mechanism"; `CTR-001`, `TRC-002` §2 (T1): "NOT ESTABLISHED"; `PDM-001` §6 | VERIFIED T7/T1 | **REJECTED** (as a formal/constitutional mechanism; retained as a developmental abstraction) | No Age-transition machinery exists | High | Handover §14 lists "Age as a developmental abstraction" among items not to be reopened |
| HE-33 | **`POA-PRS-001` repository identifier scheme** | VERIFIED: `POA-PRS-001.docx` (T7); `GAP-001` closure: `POA-ADR-001` Resolution A (T1) `[DECISION]` — existing `POA-<FAMILY>-<NNN>` convention retained, `POA-PRS-001` not adopted | VERIFIED T1 | **REJECTED** (not adopted) | Current convention `POA-<FAMILY>-<NNN>` (`CLAUDE.md` Rule 5) | High | No identifier may be renamed without a dedicated governance mission |

---

# 6. Concept Lineage Map

*Lineage is drawn only where an artifact links the concepts; dotted lines (`···`) mean resemblance or UNKNOWN link, **not** lineage.*

```text
VAULT VISION (T7, June–July 2026)                    REPOSITORY (T1/T6, from 2026-06-27)
-----------------------------------                  -----------------------------------------------
Constitution (06-25) ───────────────────────────────► CONST-001 (root authority)                [HE-01]
POA-001 six layers / POA-101..106 ··(refined)·· Five domains (07-24) ···► [no adoption record]   [HE-02/03]
                                                       d0a5b55 bootstrap (06-27):
                                                         KER-001: Steward determines purpose     [HE-16]
                                                         KER-001/EXB-001: execution authority    [HE-19]
                                                         only; Execution Agent  ── separation present from the start
ORC-001-GOV-001 docx (07-28) ──────────────────────► ORC-001 + GOV-003 Addendum (08-11):         [HE-17]
                                                         Chief Navigator & Architecture Steward
                                                         = Chief Architect; Commander supremacy
POA-001 §6 ADRs / Architecture Review (AQR) ────────► POA-ADR-001, ACS-001, CER-001 (08-17)     [HE-04/05]
Infographic DSQ → AQR → Knowledge Burn ···········   [no repository counterpart]                [HE-08..10]
AGB / AIPs (mindmap) ·······························   [no repository counterpart]                [HE-06/07]
Console: Governance Council / Sentinel ·············   (T8 proposals only, 2026-09-15..17)        [HE-12/23]

2026-09-15 briefs (T7) ► SEC-ORG-001/002 reports (T8, PROPOSED):
   five-counselor names (provenance unresolved) ► Executor rejected ► reduced Deliberation Gate    [HE-13/15/21]
   Gate Guard, Sentinel, "Probe" as hypotheses                                                       [HE-22..24]
   ──► committed `POA-DEC-ORG-KNOWLEDGE-001` (ratified 09-25) cites Gate Guard / Sentinel /
       Deliberation Gate as "PROPOSED, unbuilt — Reuse unchanged"; sets authorization ≠ execution
       (KD-16, Q5)

Mothership motif (06-27) / console "POA // MOTHERSHIP" (06-30) ···► VIS-004 Expression Profile (08-11)   [HE-26]
                                                    (separate artifact) ► 50-Mothership BLD-001 (09-18) ► Command Center [HE-25]
                                                         ► Layer B quarantined (09-24)                   [HE-28]
```

---

# 7. Current Architectural Descendants

| Current element (normative unless noted) | Register entries | Status of the relationship |
|---|---|---|
| `CONST-001` root authority; Art. VIII, XIV | HE-01, HE-18 | ABSORBED (VERIFIED) |
| Execution System / Execution Agent (`KER-001`, `EXB-001`) | HE-16, HE-19 | ABSORBED, present from the earliest committed state (VERIFIED) |
| Commander + Chief Navigator & Architecture Steward; `ACS-001`; `POA-META-002` | HE-17, HE-05 | ABSORBED / TRANSFORMED (VERIFIED) |
| ADRs (`POA-ADR-001`, `ADR-002/003`, `ADR-RM-001`) | HE-04 | ABSORBED (VERIFIED) |
| Organizational knowledge architecture (ratified `POA-DEC-ORG-KNOWLEDGE-001`); Q5, Q6/R-1 | HE-08, HE-10, HE-19 | INFERRED resemblance for HE-08/10; VERIFIED for HE-19 |
| Mothership Command Center (`50-Mothership`); Expression boundary (`ADR-003`) | HE-25, HE-26, HE-30 | TRANSFORMED (INFERRED lineage) |
| `POA-DEC-MOTHERSHIP-002` quarantine; UX/Environment constraints | HE-28, HE-29 | REJECTED-as-production (VERIFIED) |
| *None* — no current component descends from | HE-06, HE-07, HE-09, HE-12, HE-13, HE-14, HE-20, HE-21..24, HE-27 | Not current architecture |

---

# 8. Unresolved Historical Questions

| # | Question | Why it is open |
|---|---|---|
| Q-1 | Where does the five-counselor model first appear, and was it ever a POA architectural body? | Not in any committed/vault artifact; roster matches an external tool's; earlier conversations are outside the evidence |
| Q-2 | Five or six roles (Constitutional Guardian)? | Briefs say "previously remembered"; no record |
| Q-3 | What was the Governance Council (console label) and how did it relate to AGB and the Deliberation Gate? | Image label only |
| Q-4 | What did "Knowledge Burn" mean, and was DSQ ever specified beyond the infographic? | Single image source |
| Q-5 | Is the Deliberation Gate "ESTABLISHED" or "PROPOSED, unbuilt" in `POA-DEC-ORG-KNOWLEDGE-001`? | §2.1 (line 97) says PROPOSED, unbuilt; §6.1 (line 352) shows status ESTABLISHED next to it. INFERRED the latter describes the stage mapping — **unconfirmed** |
| Q-6 | Were Sentinel / Mothership present in the vault before the SEC-ORG reports? | YES for both in vault images/docx (VERIFIED); T8 `POA-SEC-ORG-001` searched the repository only |
| Q-7 | Do authoritative records justify orbital/starfield components against the "explicitly rejected" rule? | `ENVIRONMENT-MODEL` has no such text; the `VISUAL-PORT-CHECKPOINT-001` records were not read |
| Q-8 | Which "Steward" does `KER-001` §4 mean (S1), and what does `POA-CON-001` §6/§7 "Steward decision" mean? | Five senses coexist; preserved |
| Q-9 | What does **AQR** stand for? | Three expansions across vault artifacts (mindmap, POA-001 §6.8, infographic). **Newly consolidated by this register** |
| Q-10 | Was Alexis carried into the Executive Panel? | No cited lineage |
| Q-11 | Unread material: `POA Mothership — Intelligence Environment.pdf`, UI-mockup media | Tool limitation (no PDF renderer) — contents UNKNOWN |

---

# 9. Future / Deferred Architecture Inventory

*Inclusion here does not authorize implementation. "Listed" means only "worth a Commander disposition decision".*

| Item | Register | Recorded state | Basis |
|---|---|---|---|
| Deliberation Gate / councils | HE-21, HE-13 | UNRESOLVED; PROPOSED / UNBUILT | T8 proposal; T1 "PROPOSED, unbuilt" |
| Gate Guard; Sentinel | HE-22, HE-23 | UNRESOLVED; PROPOSED / UNBUILT | T8; T1 `POA-DEC-SEC-001` |
| Knowledge admission / quarantine / after-action learning (DSQ, Knowledge Burn, AQR) | HE-08..10 | UNRESOLVED | T7 only |
| AGB; AIPs | HE-06, HE-07 | UNRESOLVED | T7 only |
| Intelligence Engines; Phase 6 executive synthesis | HE-11 | DEFERRED | `POA-DEC-ORG-KNOWLEDGE-001` §24 (no phase authorized); `EIA-001` boundary |
| Mission/Repository Orchestrator, Squadrons | HE-30 | DEFERRED | `ROADMAP.md` line 51; `ADR-RM-001` |
| Speech recognition, LLM, autonomous interpretation in the Executive Panel | — | Explicitly not authorized | `POA-ADR-001` record for `POA-ORG-KNOW-EXEC-INTERACTION-001` (T1) |

---

# 10. Preservation Rules

1. **Append-only.** Add entries by dated, additive records; never delete or silently rewrite a prior entry (pattern: `GAP-REGISTER-001`, `POA-ADR-001`). A disposition change is a new dated line citing its evidence.
2. **Pointers, not copies.** Vault material is cited by path and tier, not reproduced, so that no historical concept is made normative by being copied into the repository.
3. **No promotion.** An entry may be reclassified only on new evidence; "UNRESOLVED → DEFERRED / REJECTED / adopted" requires a cited record (ADR or Commander act). Reclassification in this register is never itself such a record.
4. **No inference upgrades.** INFERRED/UNKNOWN may be upgraded to VERIFIED only by reading a located artifact; this register never converts recollection into fact.
5. **Organization A.** Entries must not process or summarize `60-Organization-A/` content.
6. **Ambiguity preserved.** Where terms collide (Steward, AQR, Mothership, Counsel), the collision is recorded rather than resolved.
7. **Conflicts reported, not chosen between** (`CLAUDE.md` Rule 8).

---

# 11. Review Requirements

1. **Commander ratification required** before the register is treated as an authoritative historical-evolution record or cited by other artifacts as one. Until then it is a tracked draft and carries no authority beyond §2A.
2. Items for the Commander: (a) *settled* — artifact ID `POA-HISTORICAL-EVOLUTION-REGISTER-001` and filename `40-Runtime/POA-HISTORICAL-EVOLUTION-REGISTER-001.md`, by Commander ruling 2026-10-02 (`POA-GOV-CLOSURE-001`, Phase A1); (b) *settled* — committed as a tracked draft in the `POA-GOV-CLOSURE-001` closure commit, Commander-authorized 2026-10-02; (c) the open questions Q-1…Q-11, in particular Q-1/Q-2 (premise status) and Q-5/Q-9 (internal tension and acronym ambiguity); (d) whether register-level dispositions should replace the archaeology report's vocabulary (§3).
3. Reviewers should check each entry against its cited evidence; confidence is stated per entry.
4. The register does not modify, and must not be read as modifying, any authoritative record.

---
*End of register v0.1.0. Draft — tracked; not yet ratified as an authoritative historical-evolution record; no authority created; no implementation authorized.*
