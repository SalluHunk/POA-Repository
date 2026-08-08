# PRS-001 CONFLICT DOSSIER

## Evidence dossier for Commander decision — POA-PRS-001 vs. current repository structure

Mission: POA-REPO-002 (Authoritative Source Reconciliation), Category B (HELD, not acted upon).

This document presents evidence only. It reaches a scope determination (what PRS-001 actually governs, per its literal text) but does **not** decide whether PRS-001 should be adopted, superseded, or reconciled — that decision is reserved to the Commander/Steward.

---

# 1. The Exact Artifact

Source file: `POA-PRS-001.docx`, authoritative source vault (root — `ParavyomaTech/New Direction of Company/POA- Repository/`, not `Deployment/`).

Its own metadata table (reproduced verbatim):

| Field | Value |
|---|---|
| Artifact ID | **PRS-001** (note: the document's own metadata table says "PRS-001," not "POA-PRS-001," despite the source filename being `POA-PRS-001.docx` and despite its own §4 example list showing "POA-PRS-001" as the canonically-formatted form of itself — an internal inconsistency in the source document itself, not introduced by this audit) |
| Artifact Name | Repository Naming Standard |
| Repository Path | `/00-Shared/Repository-Standards/PRS-001-Repository-Naming-Standard.md` |
| Version | 1.0.0 |
| Status | Accepted |
| Authority | Paravyoma Constitution → POA Governance |
| Derived From | POA-000, POA-001 |
| Artifact Type | Production Repository Standard |
| Steward | Production Engine |
| Review Status | Passed |
| Classification | Shared Standard |

---

# 2. Document ID, Version, Status

- **Document ID:** PRS-001 (as self-declared; `POA-PRS-001` per its own filename and its own naming-format example)
- **Version:** 1.0.0
- **Status:** Accepted

---

# 3. Complete Authority / Depends On Chain

As stated in the document itself: **Authority: Paravyoma Constitution → POA Governance.** **Derived From: POA-000, POA-001.**

Two observations:

1. "POA Governance" is not a citation to any specific document, artifact ID, or named body found anywhere in the vault. No document titled or identified as "POA Governance" exists. It functions as a generic phrase, not a traceable authority reference (contrast with `POA-META-001`, which cites simply "Constitution" — one hop, directly traceable).
2. **PRS-001 explicitly derives from `POA-000` and `POA-001` — both of which are "Foundational Draft," never certified, still in that same status today.** A document cannot be more authoritative than the uncertified foundations it says it derives from without an intervening approval event that specifically certifies the derivation. No such intervening event is documented anywhere.

---

# 4. Exact Evidence That It Is "Accepted"

The **entire** body of evidence is the single word "Accepted" in PRS-001's own Status field, plus "Review Status: Passed" in the same self-contained metadata table.

No other document in the vault — not the Constitution, not `POA-000`, not `POA-001`, not `POA-META-001`, not `ORC-001-GOV-001`, not `ADR-RM001-011`, not `MP-0001`, not any of the narrative documents (`Where We Stand Today`, `Project Summary`, `Founder's Reflection`, `The Materialization Philosophy`) — mentions "PRS-001," "Repository Naming Standard," or references its acceptance in any way. It is **entirely self-asserted and uncorroborated** by any independent record found in the authoritative source vault.

Compare this to `POA-META-001`'s own Change Governance process (§10 of that document): *Change Identified → Discovery Recorded → ADR created → Impact Analysis → Draft Revision → Review → Approval granted → Version updated → Change History recorded.* No trace of any step in that process exists for PRS-001 — no ADR references it, no discovery record precedes it, no change history is attached to it (its own metadata table has no "Change History" field at all, despite `POA-META-001` §5 listing "Change History" as a *required* field for every compliant artifact).

---

# 5. Approving Authority and Sign-Off Record

**None found.** The "Steward" field reads "Production Engine" — not a named human, role-holder, or governance body (contrast `ORC-001-GOV-001`, which is an explicit Commander → Chief Navigator delegation with two identifiable parties). There is no signature block, no named approver, no reference to a review meeting, decision record, or ADR. "Review Status: Passed" does not state who reviewed it or against what criteria.

---

# 6. Date / Version at Which It Became Accepted

**Not stated.** No date field exists anywhere in the document — no "Effective Date," "Accepted Date," or equivalent. Version is given as 1.0.0 with no version history. This cannot be determined from the source; it is not guessed here.

---

# 7. Exact Scope — What PRS-001 Governs

Read section by section, precisely:

| Section | Governs | Mandatory language used |
|---|---|---|
| §2 Repository Domains | Domain codes (GOV, PRS, TMP, REF, BUS, MOD, ARC, EXP, ENG, QLT, RUN) | "Rule: An artifact SHALL NOT belong to multiple domains" |
| §3 Product Identifier | Product codes (POA, TGP, WDF, TSA, CRM, ERP) | "Product Codes are immutable once assigned" |
| §4 Artifact Identifier Format | `<Product>-<Domain>-<Sequence>` | **"Every artifact SHALL use the following canonical identifier"** — unhedged, mandatory |
| §5 Versioning Standard | Semantic versioning | Descriptive, not phrased as a hard requirement on pre-existing artifacts |
| §6 Repository File Naming | `<ArtifactID>-<ArtifactName>.md` | Follows directly from §4 |
| §7 Directory Naming | Numeric ordering of directories | **"Directories SHALL use numeric ordering to preserve deterministic navigation."** The specific folder names that follow (`00-Shared`, `10-Products`, `20-Runtime`, and the six sub-folders) are introduced with the word **"Example:"** — not phrased as "directories SHALL be named exactly as follows." The mandatory clause is the numeric-ordering principle; the specific names given are illustrative. |
| §8 Reserved Prefixes | Restates the §2 domain list | "No custom prefixes may be introduced without governance approval" |
| §9 Identity Principles | Artifact identity is independent of location/filename/version | Declarative |
| §10 Naming Governance Rules | Production Engine's enforcement duties | Declarative |

**Conclusion on scope: PRS-001 explicitly and mandatorily governs artifact identifiers (§4, unhedged "SHALL"). It also addresses directory structure (§7), but its mandatory clause there is the numeric-ordering principle, not the specific example folder names.**

---

# 8. Exact Clauses That Conflict With the Current Repository

**Direct, mandatory conflict — artifact identifiers (§4):**

Current repo artifact IDs: `POA-KER-001`, `POA-RSR-001`, `POA-EXB-001`, `POA-STD-011`, `POA-CON-001`, `POA-MAT-001`, `CONST-001`, `ORC-001-GOV-001`, `ADR-RM001-011`.

None of these use PRS-001's mandatory `<Product>-<Domain>-<Sequence>` format with a Domain drawn from PRS-001's reserved list (`GOV, PRS, TMP, REF, BUS, MOD, ARC, EXP, ENG, QLT, RUN`). `KER`, `RSR`, `EXB`, `STD`, `CON`, `MAT`, `CONST` are not reserved PRS-001 domain codes. (`GOV` is the one exception — `ORC-001-GOV-001` and its repository placement under `20-Shared/GOV/` happen to already align with PRS-001's `GOV` domain code, coincidentally, since that ID came verbatim from the source document itself, not from repository convention.)

**No mandatory conflict found — directory structure (§7):**

The current repository's `00-Bootstrap/10-Constitution/20-Shared/30-Products/40-Runtime` **does** use ascending numeric ordering (`00, 10, 20, 30, 40`), which is what §7's mandatory clause actually requires ("SHALL use numeric ordering to preserve deterministic navigation"). It differs from PRS-001's *Example* names and semantics (`00-Shared/10-Products/20-Runtime`), but differing from an example is not the same as violating a "SHALL" clause. Read literally and conservatively, **PRS-001 does not explicitly prohibit the current directory structure.**

---

# 9. Are `POA-KER-001`, `POA-RSR-001`, `POA-EXB-001`, etc. Non-Compliant, or a Different Family?

Both, precisely stated:

- **Under PRS-001's rule, they are non-compliant** — `KER`, `RSR`, `EXB` are not among PRS-001's reserved Domain codes, so these IDs cannot be validly formed under PRS-001's `<Product>-<Domain>-<Sequence>` model at all.
- **Under `POA-META-001` §7's rule, they are fully compliant** — that document's "Identification & Numbering" table reserves family prefixes including `STD`, `ADR`, and (by the established repo convention) implicitly supports arbitrary two-to-four-letter family codes like `KER`, `RSR`, `EXB` following the pattern `POA-<FAMILY>-<NNN>`.

These are not two dialects of the same scheme — they are two structurally different identification models (domain-code-based vs. family-prefix-based) that happen to share a hyphenated, three-segment visual shape. An ID cannot be "slightly off" from one and compliant with the other; it belongs to one model or the other.

---

# 10. Is the Existing Directory Structure Explicitly Prohibited or Merely Different?

**Merely different**, per §7's literal text (see §7 and §8 above). The mandatory requirement — numeric ordering — is satisfied. The specific names shown are marked "Example," not "SHALL be named."

---

# 11. Comparison Against Named Reference Documents

| Document | Status | Relationship to PRS-001 |
|---|---|---|
| Paravyoma Constitution | No status marker; treated as root authority | Does not mention repository naming, directories, or artifact identifiers anywhere. PRS-001's citation of it as "Authority" is not contradicted, but also not directly corroborated — the Constitution simply doesn't address this subject. |
| POA-000 | Foundational Draft | PRS-001 claims to derive from it. POA-000 defines the general concept of "Domain" (§4, Domain Ontology) but does not itself define repository-specific domain codes or an identifier format. The derivation is conceptually plausible but the source is uncertified. |
| POA-001 | Foundational Draft (internal); filename says "v1.0" | PRS-001 claims to derive from it. POA-001 (Chapter 2) does discuss "Domains" as an architectural concept but does not specify a repository naming standard. Same uncertified-source issue as POA-000. |
| POA-META-001 | Foundational Draft | **Never mentioned by PRS-001, and PRS-001 is never mentioned by it.** Defines a directly competing, mutually exclusive identifier scheme (§7) and its own required-metadata standard, which PRS-001's own metadata table does not fully satisfy (missing "Approval Authority" and "Change History," both required by `POA-META-001` §5). Both are Draft-linked in different ways: `POA-META-001` is itself Draft; PRS-001 is "Accepted" but derives from two Draft documents and doesn't reference `POA-META-001` at all — the two appear to have been written without awareness of each other. |
| POA-META-002 | **Not found.** No file with this name or identity exists anywhere in the source vault (root or `Deployment/`), confirmed across two independent inventory passes (`POA-REPO-001` and `POA-REPO-002`). It is named only in a narrative reflection document (`POA - Where We Stand Today.docx`) as something once "produced," with no corresponding artifact located. **This dossier cannot evaluate a document that does not exist.** If the Commander has access to it outside the designated authoritative source vault, it has not been supplied to this audit and was not evaluated. |
| Any later accepted governance decision modifying the naming model | **None found.** No document anywhere supersedes, amends, or references either PRS-001's or `POA-META-001`'s naming scheme. |

---

# 12. Precedence Analysis (Authority → Status → Approval → Version → Supersession → Scope)

Applying the Commander's specified precedence order, in that order, without assuming the newer-looking or higher-version-numbered document wins by default:

1. **Authority** — Both PRS-001 and `POA-META-001` cite the Constitution as ultimate authority (PRS-001 indirectly, via "POA Governance"; `POA-META-001` directly). Neither has a stronger constitutional citation than the other. **Tied — no clear precedence from Authority alone.**
2. **Status** — PRS-001: Accepted. `POA-META-001`: Foundational Draft. **PRS-001 leads on this factor alone.**
3. **Approval** — PRS-001: no named approver, no date, no corroborating record anywhere in the vault (§4–§5 above). `POA-META-001`: also has no explicit approval record (it is self-labeled Draft, so this is expected and consistent — a Draft does not need approval evidence to be honestly labeled Draft). **Neither has verifiable approval evidence; PRS-001's is more concerning because it claims a status that would normally require such evidence and does not have it, while `POA-META-001` makes no such claim to begin with.**
4. **Version** — PRS-001: 1.0.0. `POA-META-001`: 0.1. By the semantic-versioning convention that `POA-META-001` §11 itself defines (which PRS-001 does not cite as its versioning authority), 1.0.0 conventionally signals a stable first release. **PRS-001 leads on this factor, but weakly — it does not operate under the versioning authority it would need to for this comparison to be fully apples-to-apples.**
5. **Supersession** — Neither document supersedes the other; neither acknowledges the other exists. **No precedence from this factor.**
6. **Scope** — PRS-001 explicitly and mandatorily governs artifact identifiers (§4). `POA-META-001` also explicitly governs artifact identifiers (§7), under a different model. **Direct scope overlap on identifiers — this is where the conflict actually lives.** On directory structure, PRS-001's mandatory clause (numeric ordering) does not conflict with the current repository at all (§10 above).

**Net finding:** PRS-001 leads on Status and (weakly) Version. It does not lead on Authority, Approval, or Supersession — on Approval, in fact, it is markedly weaker evidence than its "Accepted" label suggests once corroboration is checked. This does not, on its own, resolve the conflict — it is presented as evidence for the Commander's decision, not a recommendation.

---

# 13. Summary for Commander Decision

- PRS-001 **does** genuinely, mandatorily conflict with the repository's current artifact-identifier convention. This part of the conflict is real and requires a decision.
- PRS-001 does **not** explicitly prohibit the repository's current directory structure — its mandatory clause there is already satisfied. This part does not require restructuring.
- PRS-001's "Accepted" status has no corroborating evidence anywhere in the vault — no named approver, no date, no cross-reference, no change history — despite claiming a status that `POA-META-001`'s own (Draft) documentation standard would require such evidence for.
- `POA-META-002`, cited by the Commander as potentially relevant, was not found and could not be evaluated.

No structural, naming, or directory change has been made to the repository as a result of this dossier.
