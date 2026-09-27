# POA-DEC-ORG-KNOWLEDGE-001 — Q6 Decision Candidate

## Proposed Commander wording: the scope of the R-1 Q6 gate and an interim AI-processing boundary (partial answer to Q6)

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact | Decision candidate filed under the `POA-DEC-ORG-KNOWLEDGE-001` mission prefix. **No new artifact ID is minted** (`CLAUDE.md` Rule 5) |
| Status | **Decision candidate — pending Commander ruling. Not self-executing.** Not Approved, Accepted, or Certified. Nothing here takes effect unless the Commander adopts it, and nothing is recorded in `POA-ADR-001` until the Commander authorizes that separately |
| Authority | In-session instruction, 2026-09-26: *"produce: POA-DEC-ORG-KNOWLEDGE-001-Q6-DECISION-CANDIDATE.md. No ADR-001 modification yet. No commit. No push. No implementation or Phase 2 activity. Then stop for Commander review of the actual wording before anything is committed."* |
| Basis | `…-Q6-DECISION-BRIEF.md` ("Brief") and `…-Q6-GATE-RECONCILIATION-REPORT.md` ("Q6-R"), both unmodified. The analysis is not repeated here |
| Repository baseline | `HEAD == origin/main == 65aaa8df7fa70b0bc96a071cb20fad45516772cb`; nothing staged; `CLAUDE.md` modified locally (pre-existing, untouched) |
| Protected files | K-001 `ba19e96fc6499a41…`; `POA-ADR-001` `928ffde4d0ed929d…`; `POA-EXB-001` `16e5882462a5be93…` (SHA-256 prefixes). All read only |
| Execution resource and interest | Anthropic Claude Opus 5.5 (`claude-opus-5-5`), Execution Agent. **The agent that drafted the proposed selections is itself governed by them.** Every proposed default is labeled as such. Where a default is the more restrictive option, that restrictiveness is not a reason the Commander must accept it. Where it is the less restrictive option, the textual reason is given and workability is **not** offered as a reason |

---

# 1. How to Read This Candidate

- **§2 is the verbatim-ready ruling text.** Bracketed markers **⟦SP-n⟧** are selection points. Each shows the proposed default wording, and **§3** gives every alternative in full, ready to swap in. **SP-2 has no default.** The Commander must choose.
- **§4** tests the proposed combination against the work needed to act on it.
- **§5** states what the ruling would and would not do. **§6** lists open items.
- Where the Brief found only one supported reading (Q6 identity; the gated runtime activities), there is no selection point.

---

# 2. Proposed Ruling Text (verbatim-ready)

> **Commander ruling — POA-DEC-ORG-KNOWLEDGE-001 Q6: Scope of the R-1 Gate and Interim AI-Processing Boundary (partial answer).**
>
> **Capacity.** I act as Commander, the apex authority under `ORC-001-GOV-001`, in my POA-governance capacity. K-001 §20 names "Commander / Chief Architect" as deciders of Q6. This ruling is made by the Commander. ⟦SP-2-B only: Organization A's paired act in §3 is made separately, in my capacity as interim Organization A Representative.⟧
>
> **Q6-1 — Identity.** The question answered in part here is K-001 §20 Q6, "Authorization model for external AI model providers processing organization information", and the gate recorded by the R-1 Ratification Decision Record, §3 (KD-08, KD-19 qualifications) and §4 ("Q6 (no external AI provider processes organization information until answered)"). It is not `POA-DEC-ORG-001` §11 Q6 (post-exit pattern retention), which remains within K-001 §20 Q4 and is unaffected.
>
> **Q6-2 — Classification.** ⟦SP-1, default:⟧ This is an interpretive governance decision on the scope of an existing ratified gate, as the CTD-001 Scope Interpretation (Q1) ruling was an interpretation of an existing scope. It is not an architectural expansion and not a Development Authorization.
>
> **Q6-3 — External AI provider.** ⟦SP-3, default:⟧ For the gate, an "external AI provider" is any AI model operated by a party other than the organization whose information is concerned. That includes AI Execution Agents (for example the consumers named in `POA-EXB-001` §8), whether or not they operate under an Execution Bundle.
>
> **Q6-4 — Processes.** ⟦SP-4, default:⟧ For the gate, "processes" includes any transmission of organization information to an external AI provider, whatever the purpose, including reading it in an agent session, as well as extraction, reasoning or synthesis over it.
>
> **Q6-5 — Organization information.** ⟦SP-2: the Commander selects wording 2-A or 2-B from §3. There is no default.⟧
>
> **Q6-6 — Named records.** Whatever is selected at SP-2, the following apply:
> (a) The content of any Organization A Source Declaration, Business Function Map, or measure definition, including its systems, owners, cadences and sensitivities, is organization information. AI processing of it remains gated by R-1 until Q6 is fully answered and Organization A has authorized that processing.
> (b) ⟦SP-5, default:⟧ The engagement entries of `POA-PJR-001` are organization information. Its status line, schema, registry discipline, location, file hash and consumers are POA governance material. This classifies content for the gate only. It does not move, convert or modify PJR-001, and does not decide K-001 §8.4 or Q3.
> (c) ⟦SP-6, default:⟧ POA governance reasoning that refers to Organization A by role, capacity, structure, or the existence or absence of its knowledge, without reproducing Organization A's operating information, is POA governance material.
>
> **Q6-7 — Relationship to `POA-EXB-001`.** `POA-EXB-001` §8 continues to authorize AI Execution Agents to perform POA work. That authorization does not extend to processing organization information, which remains subject to the R-1 gate.
>
> **Q6-8 — Effect on the R-1 gate.** This ruling states the gate's scope. It **does not lift** the gate for any organization information. The R-1 gate stays in force for all organization information until the full authorization model (K-001 §20 Q6) is decided and the organization concerned has authorized the processing. External-model ingestion, extraction and synthesis over organization information (KD-08; KD-19; K-001 §24 Phases 3–6 where a model is used) remain gated.
>
> **Q6-9 — What remains open.** The full authorization model, including its form, scope dimensions and revocation; the Organization A authorization path ⟦SP-2-A: in full⟧ ⟦SP-2-B: beyond §3's paired act⟧; the treatment of client organizations recorded in `POA-PJR-001`/`002`/`003`; and the vendor data-handling question are all not decided.
>
> **Q6-10 — No other effect.** This ruling:
> - does not decide Q3 (location or authority);
> - does not authorize Phase 2 or any development, runtime, connector, or AI integration;
> - does not modify K-001, `POA-EXB-001`, `POA-PJR-001`, or `CLAUDE.md`;
> - does not resolve Q3-A O-1 to O-3 ⟦SP-2-A: or O-4⟧;
> - does not determine the status of any prior work. The post-R-1 inventory in the Q6 Gate Reconciliation Report §7.2 remains reserved for any separate Commander determination.
>
> **Q6-11 — Recording.** Upon authorization, this ruling is recorded additively in `POA-ADR-001` as a dated Decision Record.

---

# 3. Selection Points — Alternatives in Full

| SP | Proposed default | Alternative wording (swap in verbatim) | Consequence of each |
|---|---|---|---|
| **SP-1** Classification | Interpretive governance decision (Q1 precedent) | **1-alt-a:** "This is an architectural decision under the Commander's reserved matters, recorded as a qualification of the R-1 ratification." **1-alt-b:** "This ruling is a condition to be incorporated in any future Phase 2+ Development Authorization under CTD-001 and takes effect only with it." | Default: effective on recording. 1-alt-a: same effect, heavier classification. 1-alt-b: nothing takes effect until a Development Authorization; the gate's scope stays unstated meanwhile |
| **SP-2** Organization information | **No default** | **2-A (operating information):** "For the gate, 'organization information' means an organization's substantive operating information: its financial, sales, workforce, customer, project, product and operational data and documents, and descriptions of them. An organization's governance acts recorded in POA governance records, such as its designation of a Representative, are not organization information for the gate, except as Q6-6(a) provides." **2-B (operating information plus governance acts):** the 2-A text without its second sentence, followed by: "An organization's own governance acts (its decisions, designations, policies and declarations) are organization information." **2-B also requires a paired Organization A act and two further rulings** (below) | **2-A:** Execution Agents may read `POA-ADR-001` (which contains Act-OA) and cite Act-OA's bounds in governance work. The candidate contains **no Organization A act**. Textual basis: P1 "substantive"; K-001 §17 governance/operating split. **2-B:** Without the paired act, no Execution Agent may read `POA-ADR-001`, cite Act-OA, prepare Q3, or record this ruling (see §4). With it, those uses are permitted only for Act-OA's recorded text. Textual basis: P1 "and interests"; Article XIV "their information"; Q3-A §2.1 treats Act-OA as Organization A's act |
| SP-2-B paired acts | — | **Ruling on O-4 (Commander, POA capacity):** "The interim Organization A Representative's authority under RD-3 includes authority to grant or refuse POA a processing role over Organization A's governance acts recorded in POA governance records, and no other processing role." **Ruling on grant form (Commander, POA capacity):** "Pending the deferred identity/capability-grant model, such a grant may be made by a statement restated inline in `POA-ADR-001`, expressly labeled as Organization A's act, stating its capacity, scope and revocability." **Organization A act (Commander, as interim Organization A Representative):** "Organization A permits AI Execution Agents working on POA governance matters to read and cite Organization A's governance acts recorded in `POA-ADR-001`. This permission covers no operating information, no Source Declaration content, and no drafting of new Organization A acts. It is interim, revocable by Organization A, and non-precedential." | Resolves Q3-A O-4 narrowly and creates an interim grant form. That goes beyond Q6 itself and touches R-1 item 2 (the grant model is deferred). The act is made by the same person in a distinct capacity (Q3-A §4 identity limit applies) |
| **SP-3** External provider | Any third-party model, including Execution Agents (Brief E-1) | **3-alt-a (E-2):** "…means an AI model invoked by POA's runtime or knowledge substrate. AI Execution Agents are governed by `POA-EXB-001` and `POA-KER-001`, not by this gate." **3-alt-b (E-3):** "…means an automated AI pipeline. A human-directed AI Execution Agent is an execution resource under `POA-EXB-001`." | Default is the more restrictive option. Under 3-alt-a or 3-alt-b, **Execution-Agent drafting of the Source Declaration would not be gated by Q6.** That is the Phase-2-relevant effect. Whether agents may see organization information would then have **no recorded answer** (Brief §4) |
| **SP-4** Processes | Any transmission (Brief P-1) | **4-alt (P-2):** "…means extraction, reasoning or synthesis over organization information. Incidental exposure without such use is not processing." | Default is the more restrictive option. 4-alt permits incidental exposure, such as a file displayed while checking its format. Neither option permits drafting over organization information |
| **SP-5** PJR-001 | Entries are organization information; metadata is governance material | **5-alt:** "`POA-PJR-001` is classified as organization information in its entirety for the gate." **5-alt-2:** "`POA-PJR-001` is treated as POA governance material pending K-001 §8.4 and Q3." | Default: Execution Agents may not read or maintain PJR-001 entry content. The deterministic Mothership read path (no model) is unaffected. 5-alt: agents may not even check its hash or status. 5-alt-2: less restrictive; conflicts with §8.4's PROPOSED classification and covers client-organization entries too |
| **SP-6** Analysis about Organization A | Governance material if it does not reproduce operating information | **6-alt (Brief S-3):** "Any information describing Organization A, including POA's analysis of it, is organization information." | Default is the less restrictive option. Textual basis: P1 "substantive"; K-001 §17 itself lists Organization A's knowledge areas as governance content. **Workability is not the reason offered.** Under 6-alt, Execution-Agent preparation of Q3, and further Execution-Agent drafting on Q6, are gated; human preparation is not |

---

# 4. Self-Consistency Test of the Combinations

Three activities are needed to act on this candidate: **(i)** reading `POA-ADR-001`; **(ii)** citing Act-OA's bounds in governance work; **(iii)** preparing Q3.

| Combination | (i) | (ii) | (iii) | Note |
|---|---|---|---|---|
| Defaults + 2-A | Permitted | Permitted | Permitted, over governance material only | Source Declaration content still gated by Q6-6(a) |
| Defaults + 2-B **without** paired acts | **Barred** | **Barred** | **Barred** | An Execution Agent could not record this ruling. Recording would have to be done by a human |
| Defaults + 2-B **with** paired acts | Permitted (Act-OA text only) | Permitted | Permitted, over governance material only | Adds an O-4 ruling and an interim grant form |
| Any + 6-alt | Depends on SP-2 | Depends on SP-2 | **Barred for agents** | Human preparation is unaffected |
| Any + 3-alt-a or 3-alt-b | Permitted | Permitted | Permitted | Q6-6(a) no longer reaches agents, so AI drafting of the Source Declaration would be ungated by Q6 (other Phase 2 gates remain) |

**No selection was softened to pass this test.** Barred outcomes are reported as consequences.

---

# 5. What This Candidate Would and Would Not Do

**Would (if adopted):**

- fix which Q6 is meant;
- define the three terms for the gate;
- classify the named straddling records;
- state that `POA-EXB-001` agents may continue POA governance work over governance material;
- state that the gate is not lifted for any organization information.

**Answer to the continued-use question under this candidate.** With the defaults and 2-A, or 2-B with its paired acts, POA may continue using an external AI provider to reason over POA governance material. Organization A's operating information, the content of its Source Declaration, Business Function Map and measure definitions, and PJR-001's entries stay outside the AI processing boundary.

**Would not:**

- lift the gate for organization information;
- decide the full authorization model;
- decide Q3;
- authorize Phase 2;
- create any new labeling vocabulary or agent reporting duty;
- determine the status of prior work.

**Phase 2 effect, stated expressly.** Under the defaults, **Execution-Agent drafting of the Source Declaration and Business Function Map stays gated** (Q6-6(a) with SP-3/SP-4 defaults). Human drafting is not gated by Q6. Phase 2 remains unauthorized in all cases (CTD-001; separate Development Authorization; Q3).

---

# 6. Open Items for Commander Review

1. **SP-2 has no default** and must be selected. If 2-B is selected, choose whether to include the three paired acts.
2. **Same-person acts.** SP-2-B's Organization A act is made by the Commander as interim Representative. The Q3-A §4 identity limit applies, and each act must state its capacity.
3. **Chief Architect.** K-001 §20 names "Commander / Chief Architect". The candidate proposes a Commander-only ruling. Whether Chief Architect concurrence is wanted is for the Commander.
4. **Client organizations** in PJR-001/002/003 are not addressed beyond SP-5.
5. **Vendor data-handling terms** are outside the repository and not relied on.
6. **Recording** in `POA-ADR-001`, the commit, and the push each await separate authorization.

---

# 7. Non-Actions and Validation

| Action | Taken? |
|---|---|
| Modify `POA-ADR-001`, K-001, `POA-EXB-001`, `POA-PJR-001`, `CLAUDE.md`, the Brief or Q6-R | **No** |
| Decide Q6 or any selection point; decide Q3; authorize Phase 2; implement anything | **No** |
| Make any Organization A act | **No** (SP-2-B wording is proposed only) |
| Stage, commit, push | **No** |

Validation performed after writing: the three protected files were re-hashed; `git status` shows this file as the only new path; nothing is staged. Results are reported in the session's closing message.

---

*End of Q6 Decision Candidate. Written 2026-09-26 by the Execution Agent for Commander review of wording. Not self-executing; untracked; not staged, committed, or pushed.*
