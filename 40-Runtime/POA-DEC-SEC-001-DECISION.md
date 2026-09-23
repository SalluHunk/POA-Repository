# POA-DEC-SEC-001

## Evidence Integrity & Tamper-Detection Architecture

**Mission Class:** Architectural Decision (Evidence-Grounded, NO IMPLEMENTATION)
**Resumes from:** `POA-IMPL-001` checkpoint — closes (or narrows) Gate H ("Evidence Integrity")
**Repository Baseline (verified):** `HEAD == origin/main == 92d088517dc6a64ae833db44428e8dcdaee56ad8`
**Related:** `POA-EVID-001`, `POA-EVT-001`, `POA-KER-001`, `POA-EXB-001`, `POA-ADR-001`, `POA-SEC-ORG-002`, `POA-SVC-001`, `POA-DEC-ORG-004`, `POA-IMPL-001`

**Reading note on classification:** as with every predecessor decision mission in this chain (`POA-DEC-ORG-001` through `-004`), this document is a **decision-candidate record**, not a self-executing Commander/Chief-Architect ratification. Nothing here is ESTABLISHED merely for being written here — status tags (ESTABLISHED / RATIFIED / DERIVED / PROPOSED / UNRESOLVED / IMPLEMENTATION-DEFERRED) are applied per item, following this chain's own convention.

---

# Artifact Identity

| Field | Value |
|---|---|
| Artifact ID | POA-DEC-SEC-001 |
| Artifact Name | Evidence Integrity & Tamper-Detection Architecture |
| Artifact Family | DEC (Decision) — follows `POA-DEC-ORG-001`–`004`'s own precedent of a dedicated `40-Runtime/*-DECISION.md` file for an investigative decision mission, distinct from the shorter Commander-ruling addenda appended directly to `POA-ADR-001.md` |
| Version | 1.2.0 — Phase 3 Witness Authority Model ruling added (§26); overall Decision Status (§24) unchanged. Prior: 1.1.0 — Phase 3 Independent Witness trust-boundary ruling added (§25); this document's own overall Decision Status (§24) is unchanged by that addition |
| Status | **Decision candidate — pending Commander / Chief Architect ratification. Not self-executing. Not Approved, Accepted, or Certified.** |
| Authority | Paravyoma Constitution → `ORC-001-GOV-001` execution-authority chain → `POA-IMPL-001` (Gate H, CONDITIONAL; Condition 2: "the evidence tamper-detection mechanism must be selected and specified in a dedicated ADR before any evidence-store component is marked production-ready") → this mission's own Claude Execution Brief |
| Repository Domain | Runtime (decision record); references Shared/Governance artifacts unchanged |
| Capability Introduced | Evidence Tamper-Detection Mechanism Selection (architecture only — no implementation) |
| Evidence Basis | `20-Shared/GOV/POA-EVID-001.md`, `20-Shared/GOV/POA-EVT-001.md`, `20-Shared/KER/POA-KER-001.md`, `20-Shared/EXB/POA-EXB-001.md`, `20-Shared/DECISIONS/POA-ADR-001.md`, `40-Runtime/POA-SEC-ORG-002-ARCHITECTURE.md`, `40-Runtime/POA-SVC-001-ARCHITECTURE.md` §12/§19 scenario 14, `40-Runtime/POA-DEC-ORG-004-DECISION.md` §16 scenario 18 (all re-read from disk this mission, not recalled) |

---

# 1. Context

`POA-IMPL-001` (2026-09-17) evaluated 12 Build Gates and found 10 PASS cleanly; Gate H ("Evidence Integrity — Authority/execution events produce trustworthy evidence") could only read **CONDITIONAL**, because — confirmed by direct re-read of `POA-SVC-001` §12/§19 scenario 14 and `POA-DEC-ORG-004` §16 scenario 18 — a tamper-detection mechanism for evidence has been named and left **UNRESOLVED** since `POA-SVC-001`, restated unchanged by `POA-DEC-ORG-004`, and never selected. `POA-IMPL-001`'s own Condition 2 requires exactly this ADR before any evidence-store component may claim production-readiness. This mission produces it.

---

# 2. Problem Statement

> How does POA know that an important piece of evidence has not been altered, deleted, substituted, replayed, or falsely attributed after creation?

Per the brief's own architectural principles, this document treats as distinct and non-collapsible:

```text
Evidence Integrity  ≠  Evidence Authority
Immutable Evidence   ≠  Correct Evidence
```

A cryptographically intact record proves only that its *content has not silently changed since some known-good point*. It does not prove the underlying claim is true, the actor was authorized, the decision was legitimate, or the evidence was created under correct governance. This document answers only the Integrity question — Authority remains governed by `ORC-001-GOV-001`/`POA-KER-001` unchanged, and Correctness is explicitly out of scope (§20).

---

# 3. Existing POA Architecture Reviewed (re-read from disk, not recalled)

| Artifact | Relevant finding |
|---|---|
| `POA-EVT-001` §J | Immutability/integrity requirements are stated as **conceptual only** — "No cryptographic infrastructure, storage technology, schema, or API is prescribed" — and explicitly reuses "git's own commit-SHA integrity rather than introducing a new hash mechanism," per `EAM-001` §9's instruction "not to solve hypothetical security requirements." **This confirms the tamper-detection question was deliberately deferred, not overlooked, by `POA-EVT-001` itself.** |
| `POA-EVID-001` §B–§D | Supplies a **retention/reproducibility** test ("could a future independent reviewer reconstruct why this state exists?"), not an authenticity/tamper-detection test. It assumes retained evidence is trustworthy once retained; it does not itself detect tampering. |
| `POA-EVID-001` ESR-001 Addendum | Formally distinguishes **Authority-bearing evidence** (requires authoritative/committed retention) from **Provenance-only evidence** (may legitimately remain permanently uncommitted, working-tree-only). This is load-bearing for this mission: it means a meaningful share of POA's evidence, by *existing, already-ratified* policy, will never reach git's own integrity guarantees at all. This document does not override that policy. |
| `POA-KER-001` §6.9 | Repository Adapter synchronizes approved artifacts via Repository Commit — confirms git/the repository is the established persistence mechanism; no parallel evidence store exists or is implied. |
| `POA-EXB-001` §6 | Execution Result / Validation Report pattern — evidence of execution outcome, unchanged by this mission. |
| `POA-ADR-001` §C/§D | Baseline ADR fields (Identity, Context, Decision, Scope, Consequence, Result) plus GOV-family additive fields (Decision Authority, Artifact, Artifact Version/State, Related Mission, Related Evidence, Resulting Commit) — this document's structure follows both, extended with the mission-brief's own required 24-point structure, consistent with how `POA-EVID-001`/`POA-SEC-ORG-002` each extended the baseline with domain-specific sections beyond it. |
| `POA-SEC-ORG-002` §8, §11 | Sentinel (Continuity/Integrity Observation Capability) is **PROPOSED, unbuilt** — anomaly detection for compromised-service/compromised-storage threat classes (§4 below) architecturally depends on Sentinel existing; it does not yet. Evidence retention for Gate Guard/Sentinel/Deliberation records is explicitly deferred to `POA-EVID-001`, reused not reinvented. |
| `POA-SVC-001` §12, §19 scenario 14 | "Tamper detection: requires provenance-chain integrity; UNRESOLVED at the mechanism level." Scenario 14 (evidence tampering): detection mechanism named as "Sentinel / provenance verification (mechanism UNRESOLVED)." |
| `POA-DEC-ORG-004` §16 scenario 18 | Recovery-evidence tampering restates the identical unresolved dependency, inherited unchanged. |
| `POA-IMPL-001` §8, §17–18 | Evidence Integrity property: CONDITIONAL. Gate H: CONDITIONAL — "the evidence *model* is sound... but 'trustworthy' requires tamper-detection, which remains UNRESOLVED." Condition 2 (quoted in full): "The evidence tamper-detection mechanism must be selected and specified in a dedicated Architecture Decision Record before any evidence-store component is marked production-ready. Engineering may build evidence-recording scaffolding under Gate H's CONDITIONAL status, but may not claim Evidence Integrity is satisfied until this ADR exists." |

**No parallel architecture is invented.** Every mechanism below either reuses an existing, established POA mechanism (git persistence, `POA-EVT-001`'s event fields, `POA-EVID-001`'s retention test, the Authority/Provenance split) or is introduced as the narrowest addition the investigation found necessary.

---

# 4. Investigation of the Working Hypothesis

The brief's hypothesis:

```text
Canonical Evidence Envelope → Payload Hash → Identity-bound Signature →
Ordered Integrity Chain → Normal Repository Persistence →
Independent Checkpoint/Witness → Independent Verification
```

This is treated as a hypothesis to validate, not an instruction — tested question by question:

| # | Question | Determination |
|---|---|---|
| 1 | Is canonicalization required? | **YES.** Before hashing or signing, the evidence payload must be serialized deterministically (stable field order/encoding). Without it, two semantically identical payloads could hash/sign differently, breaking verification and creating a "which one is real" ambiguity. Minimal discipline, not new infrastructure. |
| 2 | Is payload hashing sufficient for the threat model? | **NO, alone.** A hash only proves content self-consistency against an already-known-good hash. It does not establish origin or authorization (directly instantiates Evidence Integrity ≠ Evidence Authority) and does not resist wholesale substitution by an actor who can hash their own forged content just as validly. Necessary, not sufficient. |
| 3 | Are identity-bound signatures required? | **YES, for Authority-bearing evidence only.** `POA-IMPL-001` §8 already distinguishes authoritative evidence (binding on subsequent authority decisions) from diagnostic/observational evidence. Signature-level identity binding is required exactly where evidence is Authority-bearing (per the ESR-001 Addendum's own vocabulary); Provenance-only/diagnostic evidence is not held to the same strength, consistent with existing proportionality practice (`POA-EVT-001` §D's role-level-only identity). |
| 4 | Is ordered chaining required? | **CONDITIONAL — reuse, do not rebuild.** For evidence that reaches committed, AUTHORITATIVE state, git's own Merkle-DAG commit chain already supplies ordered integrity chaining; a bespoke parallel chain would duplicate it, which the brief explicitly warns against. For Provenance-only working-tree evidence, no chain exists and none is retrofitted here — doing so would silently override the ESR-001 Addendum's own protected retention policy, which is out of this mission's scope. |
| 5 | Is independent checkpointing required? | **YES — the one genuinely new mechanism this investigation finds necessary.** See §14. |
| 6 | Does git/repository persistence remain the normal evidence store? | **YES, confirmed.** No evidence found that a second general-purpose evidence database is architecturally necessary; the brief's own instruction not to introduce one is honored because the actual gap (see below) is authenticity + external witnessing, not storage capacity. |
| 7 | Is an external trust-domain witness required for repository-compromise/rollback detection? | **YES.** See §14 — this is the load-bearing finding of this investigation. |
| 8 | Must key lifecycle/revocation be part of the architecture? | **YES**, if signatures are required (Q3): an unmanaged key is a single point of compromise structurally identical to "compromised Steward." Named as an architectural requirement; concrete mechanism is Implementation-Deferred (§16), consistent with `POA-EVT-001`'s own precedent of not prescribing cryptographic infrastructure ahead of proven need. |
| 9 | Must timestamp and logical ordering be treated separately? | **YES.** A self-asserted wall-clock timestamp is not trustworthy under a compromised-execution-environment threat model. Logical/sequence ordering (`POA-EVT-001` §D's existing Sequence/Correlation field, reused) is comparatively robust because it is checked by relative chain position, not trusted verbatim. Timestamp is treated as diagnostic, not integrity-bearing (§12). |

**Refinement to the hypothesis, not a rubber-stamp:** "Ordered Integrity Chain" is not a new mechanism — it is git's already-existing chain, reused for committed evidence, deliberately not extended to Provenance-only evidence. This narrows the hypothesis rather than adopting it wholesale.

---

# 5. Trust Boundaries

- **Evidence producer (Service/Execution identity)** — trusted to canonicalize, hash, and sign correctly *at creation time*. Compromise of this identity is a named threat (§6, row: compromised service), mitigated by key lifecycle (§16), detected only downstream (Sentinel, or the Witness), not prevented at the point of creation.
- **Repository (git, hosted on `SalluHunk/POA-Repository`)** — trusted for storage-integrity of already-committed data via content-addressing. **Not trusted, alone**, to prove its own history was never coherently rewritten by whoever holds push/administrative credentials. This is exactly why the Witness (§14) must sit outside repository write-access.
- **Verifier** — must be a party distinct from the evidence's own producer (hypothesis step 7, "Independent Verification"). Self-verification by the producing identity provides no adversarial value.
- **Witness holder** — a genuinely new trust anchor this architecture requires POA to designate: a party/mechanism whose record of "last known-good state" cannot be altered by whoever controls the repository or Steward credentials. *Who or what holds it is Implementation-Deferred and Commander-level* — this mission does not select it (consistent with the Scope Boundary's exclusion of solving catastrophic recovery/authority questions).

---

# 6. Considered Alternatives

| Alternative | Verdict | Reasoning |
|---|---|---|
| **A. No new mechanism** — rely on `POA-EVT-001` + `POA-EVID-001` as-is | **Rejected** | Both artifacts explicitly disclaim solving this: `POA-EVT-001` §J states integrity requirements are conceptual only and defers cryptographic mechanism; `POA-EVID-001` is a retention/reproducibility test, not an authenticity mechanism. Confirmed by direct re-read, not assumed. |
| **B. General-purpose external evidence database / ledger for all evidence** | **Rejected** | Brief explicitly prohibits this absent proven necessity. Investigation (Q6) found git persistence remains sufficient for the storage function — the actual gap is authenticity + external witnessing, not storage capacity or query capability. |
| **C. Full cryptographic/PKI infrastructure built now** (org-wide key management, HSMs) | **Rejected as premature** | This mission is architecture-only and explicitly barred from creating production infrastructure/credentials. Key lifecycle is named as a *requirement* (§16) with mechanism Implementation-Deferred — matching `POA-EVT-001`'s own established restraint precedent. |
| **D. Layered model** — canonicalize → hash → identity-bind-sign (Authority-bearing evidence only) → reuse git's existing chain for committed evidence → add a narrowly-scoped Independent Checkpoint/Witness → verify independently | **Adopted (§7)** | Reuses every existing, sufficient mechanism (git persistence, `POA-EVT-001` fields, `POA-EVID-001` retention test, the Authority/Provenance split) and introduces exactly one new architectural concept (the Witness) plus one refinement (mandatory canonicalization + selective signing) — the minimum found necessary to close the threat classes nothing else addresses. |

---

# 7. Decision

**POA adopts the following layered Evidence Integrity architecture, refining rather than rubber-stamping the brief's hypothesis:**

```text
Canonical Evidence Envelope
        ↓
Payload Hash
        ↓
Identity-bound Signature          (Authority-bearing evidence only — §9)
        ↓
Repository Persistence            (git — existing mechanism, reused, unchanged — §13)
        ↓
Git's own Commit/Merkle Chain     (reused as the Ordered Integrity Chain for
                                    committed evidence — NOT a new chain — §11)
        ↓
Independent Checkpoint / Witness  (NEW — narrowly scoped — §14, Implementation-Deferred)
        ↓
Independent Verification          (performed by a party distinct from the producer — §15)
```

Provenance-only evidence (per the ESR-001 Addendum) is explicitly and deliberately **outside** the strong-integrity path above — it retains exactly the protection the existing, already-ratified retention policy gives it (none, beyond working-tree presence), and this document does not silently expand that policy's scope.

---

# 8. Evidence Envelope

A Canonical Evidence Envelope wraps an existing `POA-EVT-001` event (or any other Authority-bearing evidence record) with exactly:

| Field | Source |
|---|---|
| Canonicalized payload | The event's own `POA-EVT-001` §D fields, serialized deterministically |
| Payload Hash | Computed over the canonicalized payload |
| Producer Identity Reference | `POA-EVT-001` §D's existing Execution Context (role) + Authority Reference fields — reused, not duplicated |
| Signature (Authority-bearing evidence only) | Over the Payload Hash, by the producer's bound key (§9) |
| Sequence/Correlation | `POA-EVT-001` §D's existing field — reused |

No field is invented beyond what §D already specifies plus the hash/signature this document adds. This is an envelope *around* the existing event specification, not a competing one.

---

# 9. Identity Binding

Reuses `POA-EVT-001` §E's existing authority-linkage pattern (Execution Context names the acting role; Authority Reference cites the authorizing mission) and adds exactly one new requirement: for Authority-bearing evidence, the producing identity must hold a signing key uniquely bound to it, and the signature is the verification anchor — not merely the self-declared Execution Context field. This closes forged-evidence and identity-substitution at the role level (§6); it does **not** introduce instance-level actor identity, which `POA-EVT-001` §D already deliberately excluded and this mission does not reopen.

---

# 10. Integrity Mechanism

Two-tier, matching §4 Q2–Q4:

1. **Payload Hash** — detects accidental corruption and any silent content change against a known-good hash. Necessary, not sufficient alone.
2. **Signature (Authority-bearing evidence)** — binds the hash to a specific producing identity, closing forgery and identity-substitution for that tier of evidence. Provenance-only evidence carries neither, unchanged from current policy.

For **committed** evidence, git's own Merkle-DAG (content-addressed, parent-chained) supplies chain-level integrity automatically — this document does not add a second hash-chain on top of it.

---

# 11. Ordering / Replay Protection

- **Ordering:** `POA-EVT-001` §D's existing Sequence/Correlation field, bound *inside* the signed/hashed envelope (not a separate mutable field) — reordering committed evidence is additionally detectable via git commit ancestry.
- **Replay:** the signature must be scoped to its originating mission + sequence context (bound inside the envelope), so a previously valid envelope cannot be silently reinterpreted as a new event elsewhere. **The concrete anti-replay enforcement mechanism (e.g., nonce or monotonic-counter checking) is Implementation-Deferred** — this is not a new gap; `POA-IMPL-001` §7 already recorded "Replay/duplication handling is Implementation-Deferred," and this document is consistent with, not contradicting, that prior determination.

---

# 12. Timestamp Semantics

Wall-clock timestamp (`POA-EVT-001` §D's existing Timestamp field) is treated as **diagnostic, not integrity-bearing** — a compromised execution environment can forge a timestamp as easily as any other self-asserted field. Integrity-relevant ordering relies on Sequence/Correlation (§11), not on the timestamp. This is a deliberate design choice (demote timestamp's trust weight) rather than an attempt to solve trusted-time, which this mission does not attempt.

---

# 13. Persistence

**Confirmed unchanged: git (`POA-KER-001` §6.9's Repository Adapter → Repository Commit) remains the sole, sufficient persistence mechanism.** No second evidence store is created (§4 Q6, §6 Alternative B rejected). Authority-bearing evidence following the strong-integrity path above must reach committed state to gain git's own chain-integrity benefit; Provenance-only evidence may remain working-tree-only exactly as the ESR-001 Addendum already permits.

---

# 14. Independent Checkpointing

**The single genuinely new mechanism this investigation finds architecturally necessary.**

**Why:** hashing, signing, and even git's own Merkle chain can make tampering *within a single coherent history* evident — but none of them can detect a *wholesale, internally-consistent replacement* of that history by whoever controls write access to the authoritative remote. A rewritten history remains perfectly self-consistent to any verifier who only ever inspects the current `origin/main`. This is the precise mechanism gap behind the "compromised repository," "compromised Steward," and "backup/restore manipulation" threats (§6), and it is why the brief's own hypothesis named an external trust-domain witness as an open question rather than an assumed given.

**What is required, architecturally, not operationally:**
- A periodically-recorded, independently-held reference to the current authoritative `HEAD` hash.
- Held by a party or mechanism whose record cannot be altered by whoever holds repository push/administrative credentials — critically, **not the Steward alone**, since Steward-held-and-Steward-alterable would collapse the witness into the very actor it must be independent of.
- A witness *pointer*, not a second evidence store — it holds a hash and a timestamp/sequence marker, not evidence content.

**What this document does NOT do:** select who or what holds the witness, specify its storage technology, or build it. That is Implementation-Deferred, Commander/Chief-Architect-level (who is trusted to hold something the Steward cannot alter is itself an authority question, not an architecture one), and explicitly outside this mission's scope (§20: "solve catastrophic recovery," "authorize unrelated implementation").

---

# 15. Verification

Verification must be performed by a party distinct from the evidence's own producer (hypothesis step 7). A verifier: (a) recomputes the payload hash and checks it against the envelope's stated hash; (b) checks the signature (Authority-bearing evidence) against the claimed producer identity's key; (c) for committed evidence, confirms git ancestry/content-addressing is internally consistent; (d) compares the current repository state against the most recent Independent Checkpoint, where one exists. Step (d) is the only step that can detect wholesale history replacement (§14); steps (a)–(c) detect tampering within a single coherent history.

---

# 16. Key Lifecycle

Named as an architectural requirement, not specified at the mechanism level (consistent with `POA-EVT-001`'s own precedent of not prescribing cryptographic infrastructure ahead of proven need, and with this mission's Scope Boundary against creating production credentials):

- A signing key must be uniquely bound to one producing identity (§9).
- Key compromise must be revocable, and revocation must itself be evidenced (an auditable act, not a silent state change).
- An unmanaged/unrevoked compromised key is architecturally equivalent to "compromised Service" (§6) — signatures produced with it are indistinguishable from genuine ones until revocation is recorded and propagated.
- **Implementation-Deferred**: concrete key-management technology, storage, rotation schedule, and revocation-propagation mechanism.

---

# 17. Backup/Restore Handling

No backup/restore procedure currently exists anywhere in POA's materialized architecture to attach a check to — this is itself a disclosed gap, not invented away. The architectural requirement recorded here: **any future restore procedure must compare the restored state's `HEAD`/hash against the most recent Independent Checkpoint (§14) before that restored state is treated as authoritative.** Without this check, a restored backup could silently reintroduce tampered or stale evidence, or silently drop legitimate evidence, with no internal signal that anything changed. Mechanism: Implementation-Deferred.

---

# 18. Adversarial Test Matrix

Per the brief's required chain for every threat: **Threat → Attack mechanism → Detection mechanism → Trust assumption → Residual limitation.** No row claims "protected" where the architecture only makes an attack detectable.

| # | Threat | Attack mechanism | Detection mechanism | Trust assumption | Residual limitation |
|---|---|---|---|---|---|
| 1 | Evidence modification | Alter committed blob/commit content, or edit working-tree evidence before it is ever synchronized | Git content-addressing + Payload Hash, for **committed** evidence only | Verifier holds/can obtain the last-known-good hash or Checkpoint independently of the modifier | **Provenance-only (uncommitted) evidence has no detection at all** — explicitly out of scope, per the ESR-001 Addendum's existing, protected retention policy |
| 2 | Evidence deletion | History rewrite / force-push removing a commit, or simply never committing | Mismatch against Independent Checkpoint (§14), if one predates the deletion | Checkpoint is genuinely held out-of-band from repository write access | Undetected if deletion occurs before any Checkpoint was ever taken, or the Checkpoint interval is coarser than the deletion window |
| 3 | Evidence substitution | Replace envelope content while preserving surface metadata | Payload Hash + Signature (Authority-bearing evidence) | Signer's key uncompromised; verifier actually checks the signature, not merely the presence of a hash field | Undetected for Provenance-only evidence (no signature requirement) |
| 4 | Forged evidence | Fabricate an envelope claiming false origin/action | Identity-bound signature verification against the claimed identity's key | Key management prevents unauthorized possession of a legitimate identity's signing key | A compromised key produces forgeries indistinguishable from genuine evidence until revocation propagates (§16 gap) |
| 5 | Replayed evidence | Resubmit a previously valid, correctly signed envelope in a new context | Sequence/Correlation binding + mission-context binding inside the signed payload (§11) | Verifier actually checks context binding, not just raw signature validity | Concrete anti-replay enforcement mechanism is Implementation-Deferred — unchanged from `POA-IMPL-001` §7's own prior determination, not newly introduced here |
| 6 | Reordered events | Present genuine events out of their true sequence | Sequence/Correlation field (bound inside the envelope) + git commit ancestry for committed evidence | Sequence field is bound inside the signed/hashed envelope, not a separately mutable field | No ordering guarantee for Provenance-only evidence |
| 7 | Timestamp manipulation | Assert a false wall-clock time | None directly — by design (§12) | Verification relies on logical/sequence ordering, never on the timestamp field, for any integrity-relevant determination | Any future process that *does* rely on wall-clock timestamp for a security-relevant decision (none proposed here) would remain exposed — flagged as a constraint on future use |
| 8 | Identity substitution | Actor claims a different identity's role/authority when producing evidence | Signature verification tied to the claimed identity's key, checked against Execution Context/Authority Reference | Signing key uniquely bound to the claimed identity, not shared | Role-level (not instance-level) identity, per `POA-EVT-001`'s own existing, unexpanded scope — substitution *within* the same role is not distinguishable; an accepted pre-existing limitation, not newly created or newly closed here |
| 9 | Compromised storage | Underlying git objects/filesystem/hosted repo corrupted or tampered with directly | Git's own content-addressing detects corruption/mismatch automatically, for committed data | Verifier re-derives hashes independently rather than trusting the storage layer's own report | Addresses integrity only, not availability — data loss is out of scope |
| 10 | Compromised service | Attacker operates through a legitimate Service identity's already-authorized channel | Anomalous evidence pattern detection (Sentinel's proposed role, `POA-SEC-ORG-002` §8) + key revocation once discovered | An observation capability (Sentinel) exists and is watching | **Sentinel is currently PROPOSED and unbuilt** (`POA-SEC-ORG-002`) — no detection exists during the window before compromise is discovered and revocation propagates; Evidence Integrity's real-world strength is directly dependent on a capability this document does not build |
| 11 | Compromised repository | Whoever holds write/admin credentials over `origin/main` rewrites history coherently | **Only** the Independent Checkpoint/Witness (§14), compared against current repository state | Witness is held by a party/mechanism independent of repository write access | Full, undetectable exposure until a Witness mechanism is actually implemented (Implementation-Deferred) — **the single most consequential open item this document surfaces** |
| 12 | Compromised Steward | The Steward, who holds legitimate push/administrative authority, acts outside authorized scope, including rewriting evidence | Same Independent Checkpoint/Witness as #11, **provided** the Witness is held independently of the Steward's own control | Steward does not also control the Witness | If the Steward controls both repository and Witness, no detection is architecturally possible — bounds what "Steward compromise" can ever mean here, consistent with `POA-DEC-ORG-003`/`-004`'s own prior finding that Steward compromise is a named, accepted residual limit, not something POA claims to fully solve |
| 13 | Backup/restore manipulation | A restored backup silently substitutes for, or is silently reconciled with, current state, reintroducing tampered/stale evidence or dropping legitimate evidence | Restored state's `HEAD`/hash compared against the most recent Independent Checkpoint before being treated as authoritative (§17) | Restore procedure includes this comparison as a mandatory gate, not an assumed given | Mechanism Implementation-Deferred; **no backup/restore procedure currently exists anywhere in POA architecture** to attach this check to — a further, disclosed gap |

---

# 19. Residual Risks

1. **Compromised repository / compromised Steward (rows 11–12) remain fully open until the Independent Checkpoint/Witness is actually implemented** — this is architecturally specified, not operationally solved. This is the single largest residual item.
2. **Provenance-only evidence (rows 1, 3, 6) carries no integrity protection whatsoever**, by design, consistent with the already-ratified ESR-001 Addendum. This is a disclosed, deliberate boundary, not an oversight.
3. **Replay enforcement (row 5) and key lifecycle (row 4, §16) are both Implementation-Deferred** — named requirements, not built mechanisms.
4. **Sentinel-dependent detection (row 10) inherits Sentinel's own unbuilt status** (`POA-SEC-ORG-002`) — this document's strength for compromised-service detection is bounded by a capability that does not yet exist.
5. **Role-level (not instance-level) identity (row 8)** is an accepted, pre-existing limitation carried from `POA-EVT-001`, not newly introduced or newly resolved.
6. **No backup/restore procedure currently exists** to attach §17's requirement to.

None of these are manufactured away. Each is named because the brief explicitly requires this document not to claim "protected" where the architecture only makes an attack detectable, and not to report closure the evidence does not support.

---

# 20. Explicit Non-Goals

Per the brief's Scope Boundary, this mission explicitly does **NOT**:

- Redesign POA ontology, Organizational Representation architecture, or Mission Control.
- Build UI.
- Create production infrastructure or production credentials — the Witness (§14) and signing keys (§16) are named requirements, not built systems.
- Create a general-purpose evidence database (§6 Alternative B rejected).
- Redefine Evidence Authority — `ORC-001-GOV-001`/`POA-KER-001`'s existing authority model is unchanged; this document adds an *integrity* layer beneath it, not a competing authority mechanism.
- Solve Evidence Correctness — a validly signed, hash-chained, checkpointed record can still assert something substantively false; this document verifies internal integrity/authenticity only, never the truth of a claim.
- Solve catastrophic recovery — §14/§17 name requirements the Witness/restore-check must satisfy; they do not resolve `POA-DEC-ORG-004`'s own still-open R7/R12 gaps, which remain untouched.
- Authorize unrelated implementation.
- Create `POA-BLD-001` — that remains a separate future mission, referenced only as this document's own recommended next step (§Final Report).

---

# 21. Implementation Boundary

**Authorized by this document for future engineering (not performed here):** canonicalization discipline; payload hashing; identity-bound signing for Authority-bearing evidence; the Independent Checkpoint/Witness mechanism (once a holder is Commander-designated); key lifecycle/revocation tooling; the backup/restore comparison gate.

**Not authorized by this document:** selection of cryptographic algorithms/libraries, key-storage technology, Witness-holder identity, or any production deployment of the above — each remains a distinct future decision or engineering task, consistent with `POA-IMPL-001`'s own Condition 2 language ("engineering may build evidence-recording scaffolding under Gate H's CONDITIONAL status, but may not claim Evidence Integrity is satisfied until this ADR exists") — this ADR now exists; the scaffolding it authorizes may proceed, but production-readiness claims remain gated on implementing §14/§16/§17, not merely on this document's existence.

---

# 22. Consequences

- `POA-IMPL-001`'s **Condition 2 is satisfied**: a dedicated ADR selecting and specifying the tamper-detection mechanism now exists.
- Gate H narrows from "mechanism UNRESOLVED" to "mechanism SPECIFIED, implementation PENDING" — a real, evidenced improvement, not a cosmetic one.
- Engineering may now build evidence-recording scaffolding (canonicalization, hashing, signing, the envelope shape) under this specification, per `POA-IMPL-001`'s own already-standing authorization for that scope.
- Gate H does **not** move to a plain PASS (§Gate Closure Determination) — "trustworthy," Gate H's own bar, requires the mechanism to actually operate, not merely be architected, and the Witness/key-lifecycle/restore-gate pieces remain unbuilt.
- No existing artifact (`POA-EVT-001`, `POA-EVID-001`, `POA-KER-001`, `POA-EXB-001`, `POA-SEC-ORG-002`) is modified. This document is additive.

---

# 23. Related POA Artifacts

`POA-EVID-001` (retention/reproducibility test, reused unchanged), `POA-EVT-001` (event specification, extended by envelope wrapping, unchanged itself), `POA-KER-001` (Repository Adapter/persistence, reused unchanged), `POA-EXB-001` (Execution Result/Validation, unchanged), `POA-ADR-001` (document conventions followed), `POA-SEC-ORG-002` (Sentinel dependency named, not built), `POA-SVC-001` §12/§19 scenario 14 (originating UNRESOLVED finding), `POA-DEC-ORG-004` §16 scenario 18 (restated finding), `POA-IMPL-001` §8/§17–18 (Gate H, Condition 2 — the condition this document acts on).

---

# 24. Decision Status

**DECISION CANDIDATE — pending Commander / Chief Architect ratification.** Consistent with every predecessor decision mission in this chain (`POA-DEC-ORG-001` through `-004`), this document's determinations are not self-executing. Ratification would formally close `POA-IMPL-001` Condition 2; it would not, by itself, resolve the residual risks named in §19 or authorize the Witness/key-lifecycle implementation — those remain future engineering/authority decisions.

---

# 25. Commander Ruling — Independent Witness Trust Boundary (Phase 3)

**Provenance:** materialized per the Phase 3 mission chain ("POA — Phase 3 Independent Witness Decision Analysis" → "POA — Phase 3 Independent Witness Ruling"), following the frozen Key-Lifecycle Evidence increment (commit `57f83ce`). This section records a Commander-level ruling on the specific open sub-questions §5 and §14 left Implementation-Deferred. It narrows those sections; it does not select a Witness holder, implement one, or ratify this document as a whole.

**Governance clarification, stated explicitly and not to be conflated:**

> The Phase 3 Independent Witness Trust Boundary (§25.1–§25.4 below) is ratified.

is a distinct fact from:

> `POA-DEC-SEC-001` as a whole remains **DECISION CANDIDATE — pending Commander/Chief Architect ratification** (§24, unchanged by this section).

The first is true; the second remains true; neither implies the other. No future mission may represent this section as ratifying the document as a whole absent a separate, explicit ratification record.

## 25.1 Minimum Independence Boundary (Ruling 1)

Refines §5's Witness-holder definition and §14's independence requirement into an explicit, testable boundary. An Independent Witness must be independently controlled from the Steward/repository-write authority across exactly four boundaries: **repository access/control, storage, credentials, administration.**

Governing invariant:

> No actor whose credentials can coherently rewrite the authoritative POA repository may also possess unilateral authority to alter, replace, or erase the Witness record.

Process/runtime separation — the dimension `witness.ts`'s own header comment already discloses as unmet by the current test double — is ratified as an **implementation mechanism that serves this invariant**, not itself a fifth independent architectural trust property alongside the four above.

Organizational/legal independence is explicitly **NOT mandated** by this ruling (see §25.2).

This does not permit the Steward to administer the Witness under any reading — the invariant above forecloses that directly.

## 25.2 Organizational Boundary (Ruling 2)

POA does **not** currently require the Witness to be a separate legal or organizational entity. A genuinely separated internal trust domain may satisfy §25.1's requirement, **provided the independence invariant is actually enforceable** in that domain, not merely asserted.

> Organizational/legal independence remains a stronger, optional trust boundary and may be revisited if POA later requires protection against broader organization-level administrative compromise.

Internal independence and external organizational independence are not equivalent and must not be silently treated as such by any future implementation mission.

## 25.3 Witness Retention (Ruling 3)

Adopted: **W2 — Append-only checkpoint history.** This refines §14's "a witness pointer ... it holds a hash and a timestamp/sequence marker" from a single-latest-value model — as the current test-double `witness.ts` implements it, a map overwritten on every `checkpoint()` call — to a retained **sequence** of accepted checkpoints, never overwritten.

At minimum, each retained Witness record must preserve exactly what this document already authorizes, and no more:

* scope
* checkpoint hash
* checkpoint time/marker

No evidence content is added by this ruling. The Witness does not become a second evidence store. No additional field is authorized here merely because it might be useful — if ordering or verification is later found to architecturally require more, that must be identified and separately authorized before implementation, not assumed now.

## 25.4 Witness Meaning (Ruling 4)

Ratified semantic boundary, refining §15's Independent Verification and directly reinforcing §2's non-collapsible distinction:

> The Independent Witness establishes whether the currently observed authoritative history has diverged from a previously witnessed checkpoint.

It does **not** establish Evidence Correctness, Evidence Authority, the truth of the witnessed content, the correctness of the Steward's decisions, or the correctness of the underlying evidence. The Witness is a **history-divergence detector**, not a truth oracle — consistent with §2's

```text
Evidence Integrity  ≠  Evidence Authority
Immutable Evidence   ≠  Correct Evidence
```

which this ruling does not relax in either direction.

## 25.5 What This Ruling Does Not Do

* Does not select a Witness holder, provider, storage technology, or administrative entity — §14's "Implementation-Deferred and Commander-level: this mission does not select it" remains exactly as unresolved for the WHO/WHAT as before this ruling; only the *shape* any future holder must satisfy is now decided.
* Does not implement anything — `witness.ts` is untouched by this ruling; its test-double status, and the honest disclosure in its own header comment, remain accurate.
* Does not ratify `POA-DEC-SEC-001` as a whole — §24's Decision Status stands unchanged.
* Does not close Matrix rows 11–13 (§18) or move Gate H off CONDITIONAL (see Gate Closure Determination, unchanged below) — closure still requires a real, adversarially-verified Witness built against this now-ratified boundary, not merely the boundary's specification.

---

# 26. Commander Ruling — Witness Authority Model (Phase 3)

**Provenance:** materialized per "POA — Formalize Witness Authority Model" (a governance formalization mission, not an implementation mission). It starts from repository checkpoint `3356ba02864288e77c0ade4cc39ce3cd3daf67cd` ("feat(poa-dec-sec-001): materialize independent witness authentication"), which implemented Class A payload-level submission authentication under the Phase 3 Witness Submission Authentication Ruling. That increment's implementation report (`40-Runtime/POA-DEC-SEC-001-PHASE-3-WITNESS-SUBMISSION-AUTHENTICATION-REPORT.md` §5–§6, §9) surfaced two open authority questions: Witness scope, and credential lifecycle authority. The Commander has ratified all three rulings below.

This section allocates authority. It narrows §5 (Witness holder), §14 (Independent Checkpointing), §16 (Key Lifecycle) and §25. It does not implement anything, does not select a Witness holder, provider or storage technology, and does not ratify this document as a whole.

The governance clarification in §25 applies here unchanged:

> The Phase 3 Witness Authority Model (§26.1–§26.3 below) is ratified.

That is a distinct fact from:

> `POA-DEC-SEC-001` as a whole remains **DECISION CANDIDATE — pending Commander/Chief Architect ratification** (§24, unchanged by this section).

Neither statement implies the other.

## 26.1 Witness Scope (Ruling A)

Ratified:

* **Witness scope is PER-SCOPE.** Each Witness scope keeps its own independent checkpoint history. This is consistent with §25.3's per-scope retention.
* **Witness submission credentials are scope-bound.** A credential authorized for scope X MUST NOT authorize, or authenticate, a submission for scope Y.
* **The scope identifier participates in the authenticated submission contract.** It must be covered by the submission authentication, not asserted alongside it. The current Class A contract already binds `scope` inside the signed data. It does not yet bind a credential to a scope, and that authorization is what this ruling now requires.
* **Scope semantics must use existing POA terminology.** No new scope taxonomy or organizational ontology is authorized by this ruling.

**Concrete scope identifier:** `TBD — requires architectural decision`.

The governance record reviewed for this ruling (§1–§25 of this document and the Phase 3 mission chain) names "scope" only as a retained Witness field (§25.3). It never defines what a Witness scope concretely denotes. The nearest existing vocabulary points in more than one direction:

* §11 scopes a signature to its "originating mission + sequence context".
* §14 defines the Witness as a reference to "the current authoritative `HEAD` hash".

Choosing between these, or combining them, is itself the open decision.

**Consequence for implementation:** scope-bound credential implementation must stop at this point rather than invent a scope identity. It may proceed only once the concrete scope identifier is fixed in existing POA terminology by an explicit decision.

## 26.2 Submission Authority / Witness Holder (Ruling B)

Ratified:

* **The Witness Submission Authority and the Witness Holder are the SAME genuinely independent trust party / trust domain.**
* **Legal or organizational separation is not mandatory.** This is consistent with §25.2. Organizational/legal independence remains the stronger, optional boundary that §25.2 describes.
* **Genuine trust-domain separation from the repository-write authority remains mandatory.**
* **The four ratified independence boundaries of §25.1 are unchanged:** repository access/control, storage, credentials, administration.
* **§25.1's invariant remains fully operative:**

  > No actor whose credentials can coherently rewrite the authoritative POA repository may also possess unilateral authority to alter, replace, or erase the Witness record.

Stated explicitly:

> **Same independent party does not mean same trust boundary as the Steward/repository controller.**

Combining the Submission Authority and the Witness Holder into one party consolidates two Witness-side roles. It relaxes no boundary between that party and the Steward or repository-write authority. The Steward may not be, administer, or hold credentials for this party under any reading. §25.1's closing sentence already forecloses that.

## 26.3 Credential Lifecycle Authority (Ruling C)

Ratified: lifecycle authority over the Witness submission credential belongs to the **Commander-designated Independent Witness Authority**, the independent party of §26.2. That authority controls:

* creation
* provisioning
* protected custody
* use
* rotation
* revocation
* retirement
* compromise handling
* lifecycle recording

> **Repository-write authority has no unilateral authority over the Witness submission credential lifecycle.**

This allocates authority. It creates no lifecycle mechanism. §16's requirements are unchanged: key uniquely bound, revocation itself evidenced, a compromised key equivalent to a compromised service. They now apply to this credential under this authority. The concrete mechanisms remain **Implementation-Deferred**, exactly as §16 already records: custody technology, rotation schedule, revocation propagation, and where the lifecycle record is kept. The existing principal revocation mechanism sits on the repository-write side (the runtime identity registry and identity evidence chain, commit `57f83ce`), so it does not satisfy this ruling for this credential.

The identity of the Commander-designated Independent Witness Authority is **not selected by this section**. Designating it remains a Commander act (Gate Closure Determination, required evidence (d)).

## 26.4 Semantic Boundaries Preserved

Nothing in §26 alters §2, §25.4, or the authentication/truth distinction:

```text
Evidence Integrity          ≠  Evidence Authority
Immutable Evidence          ≠  Correct Evidence
Authenticated checkpoint    ≠  truthful checkpoint
Witness                     ≠  truth oracle
Witness                     =  history-divergence detector
```

Scope binding and the allocation of lifecycle authority establish **who may authorize a checkpoint for which scope**. They do not establish:

* evidence correctness
* evidence authority
* the truth of the checkpointed content
* the correctness of Steward decisions
* the correctness of the underlying evidence

## 26.5 What This Ruling Does Not Do

* **Does not implement** scope-bound credentials, rotation, revocation, compromise handling, lifecycle recording, or production credential custody.
* **Does not change the current code.** `witness-submission.ts`, `witness-log.ts`, `runtime.ts` and all tests are unchanged. The Class A credential in the current scaffold remains unscoped, and its lifecycle gaps remain as reported at `3356ba0`.
* **Does not select** a Witness holder, provider, HSM/KMS, or storage technology, and does not deploy a Witness.
* **Does not define** a concrete scope identifier (§26.1: `TBD — requires architectural decision`).
* **Does not change the Decision Status.** `POA-DEC-SEC-001` as a whole remains DECISION CANDIDATE (§24 unchanged). Decision ratified ≠ implementation complete.
* **Does not close anything.** Matrix rows 11–13 (§18) stay open and Gate H is not moved off **CONDITIONAL** (Gate Closure Determination, unchanged below). This ruling establishes the authority under which future implementation must operate. It is not evidence that such an implementation exists. No production independent Witness exists.

---

# Gate Closure Determination

```text
EVIDENCE INTEGRITY CONDITION

Status:
CONDITIONAL

Reason:
The mechanism-selection question POA-IMPL-001's Condition 2 required is now
answered: a Canonical Evidence Envelope with Payload Hash, selective
Identity-bound Signature (Authority-bearing evidence), reuse of git's own
commit chain, and a newly-specified Independent Checkpoint/Witness together
form an internally coherent, evidence-grounded architecture (criterion 1 of
the brief's PASS test is satisfied). However, Gate H's own bar is
"trustworthy" evidence, not merely "architected" evidence — and three
load-bearing pieces (the Witness itself, §14; key lifecycle, §16; the
backup/restore comparison gate, §17) are named as requirements but remain
Implementation-Deferred, unbuilt. Rows 11-13 of the Adversarial Test Matrix
(§18) — compromised repository, compromised Steward, backup/restore
manipulation — are architecturally addressed but operationally open until
that implementation exists. A plain PASS would overstate what has actually
closed; a plain FAIL would understate the real, evidenced progress made.
CONDITIONAL is the honest result.

Required evidence:
(a) Implementation and exercise of the Independent Checkpoint/Witness
mechanism, held independently of repository/Steward write access (§14);
(b) a key-lifecycle/revocation mechanism (§16); (c) a backup/restore
procedure incorporating the Checkpoint comparison gate (§17); (d) Commander
designation of who/what holds the Witness (an authority decision this
document does not make).

Remaining gap:
Gate H moves from "mechanism UNRESOLVED" to "mechanism SPECIFIED,
implementation PENDING." Compromised-repository and compromised-Steward
detection (the hardest, most consequential threat rows) remain fully open
until (a)-(d) above are actually built. Provenance-only evidence integrity
(§19 item 2) is a deliberate, disclosed, permanent boundary, not a gap this
mission was ever asked to close.
```

**This satisfies `POA-IMPL-001` Condition 2** (the ADR now exists, with a selected and specified mechanism) **without inflating Gate H itself to PASS.** No genuine architectural contradiction was discovered during this investigation — the remaining work (Witness, key lifecycle, restore-gate) is implementation, not further undecided design.

---

# Repository Validation

Performed after materialization, per the brief's explicit requirement:

- **Working tree state:** clean of tracked modifications; this document is the only new file.
- **Changed files:** `40-Runtime/POA-DEC-SEC-001-DECISION.md` (new, untracked) — no other file touched.
- **Artifact path:** `40-Runtime/POA-DEC-SEC-001-DECISION.md`, matching this chain's own `*-DECISION.md` naming convention for investigative decision missions.
- **Artifact contents:** verified against this document's own text as written.
- **References to existing POA artifacts:** every citation above (§3, §23) was re-read directly from disk this mission, not recalled — `POA-EVID-001`, `POA-EVT-001`, `POA-KER-001`, `POA-EXB-001`, `POA-ADR-001`, `GAP-REGISTER-001`, `POA-SEC-ORG-002`, `POA-SVC-001`, `POA-DEC-ORG-004`, `POA-IMPL-001`.
- **No unintended modifications:** confirmed — no existing tracked or untracked file was altered by this mission.
- **Repository HEAD:** `92d088517dc6a64ae833db44428e8dcdaee56ad8`, unchanged before and after this mission (re-verified below).
- **Commit ancestry / branch/base state:** unchanged — no commit created, no branch changed, no push performed.
- **Required governance metadata:** Artifact Identity table (above) populated per `POA-ADR-001` §C/§D conventions; Decision Status recorded per §24.

**No write operation failed. No commit is claimed — none was performed, consistent with every predecessor mission in this chain.**

---

# Final Report

```text
POA-DEC-SEC-001
================

Mission status:
CONDITIONAL

Evidence Integrity condition:
OPEN (narrowed — mechanism SPECIFIED, implementation PENDING; was previously
UNRESOLVED at the mechanism-selection level)

ADR:
40-Runtime/POA-DEC-SEC-001-DECISION.md

Repository HEAD:
92d088517dc6a64ae833db44428e8dcdaee56ad8 (unchanged)

Changes:
One new untracked file: 40-Runtime/POA-DEC-SEC-001-DECISION.md. No existing
artifact modified. No commit, no push.

Threat model:
13 threats adversarially evaluated (§18): evidence modification, deletion,
substitution, forgery, replay, reordering, timestamp manipulation, identity
substitution, compromised storage/service/repository/Steward, backup/restore
manipulation. 10 of 13 rows resolve to "detectable, given stated trust
assumptions"; rows 11-13 (compromised repository, compromised Steward,
backup/restore manipulation) resolve to "architecturally addressed, but
undetectable until the Independent Checkpoint/Witness is actually built."

Architectural decision:
Canonical Evidence Envelope -> Payload Hash -> Identity-bound Signature
(Authority-bearing evidence only) -> git's existing commit/Merkle chain
(reused, not rebuilt) -> Independent Checkpoint/Witness (new, narrowly
scoped, Implementation-Deferred) -> Independent Verification. No second
general-purpose evidence database created. Provenance-only evidence
deliberately left outside the strong-integrity path, per existing,
already-ratified retention policy (ESR-001 Addendum).

Residual risks:
(1) Compromised-repository/Steward detection fully open until the Witness is
built; (2) Provenance-only evidence has no integrity protection, by design;
(3) replay enforcement and key lifecycle are Implementation-Deferred;
(4) compromised-service detection depends on Sentinel, itself unbuilt
(POA-SEC-ORG-002); (5) identity substitution within the same role remains
undetectable, an accepted pre-existing limitation; (6) no backup/restore
procedure currently exists to attach the restore-gate to.

Implementation implications:
POA-IMPL-001 Condition 2 is satisfied by this ADR's existence. Engineering
may build evidence-recording scaffolding (canonicalization, hashing,
signing, envelope shape) under Gate H's status. Evidence Integrity may not
be claimed production-ready until the Witness, key lifecycle, and
restore-gate (S14/S16/S17) are actually implemented and exercised.

Next authorized mission:
POA-BLD-001 - POA Mothership Foundation (per the brief's own instruction),
with the Witness/key-lifecycle/restore-gate implementation carried forward
as named, tracked engineering work within it - not as a precondition
blocking its start, mirroring how POA-IMPL-001 itself proceeded under two
conditional gates.

Architecture missions remaining:
NO

Reason:
No genuine architectural contradiction was discovered. The mechanism-
selection question this mission was created to answer is answered. What
remains (rows 11-13's residual risk) is implementation work - building the
Witness, the key-lifecycle mechanism, and the restore-gate - not an
undecided design question requiring another POA-DEC-* mission. Inventing
one merely because these residual risks are interesting would violate the
brief's own explicit stopping instruction.
```
