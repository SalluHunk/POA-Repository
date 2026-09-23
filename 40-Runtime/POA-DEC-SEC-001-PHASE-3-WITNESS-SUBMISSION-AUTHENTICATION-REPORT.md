# PHASE 3 — WITNESS SUBMISSION AUTHENTICATION IMPLEMENTATION REPORT

**Authorizing instruction:** "POA — PHASE 3 WITNESS SUBMISSION AUTHENTICATION RULING" (Commander ruling: **Class A — payload-level cryptographic submission authentication**), following "POA — Phase 3 Witness Submission Authentication Decision" and the Phase 3 Independent Witness Implementation increment.
**Source architecture:** `POA-DEC-SEC-001` §14, §15, §16, §25.1–§25.5 (`40-Runtime/POA-DEC-SEC-001-DECISION.md`).
**Base commit:** `57f83ce`. **Commit:** none. The working tree is uncommitted, and the brief says "Stop after the report."
**Date:** 2026-09-23

---

## 1. Files Changed

All paths are under `50-Mothership/`.

| File | Change |
|---|---|
| `src/witness-submission.ts` | **New.** `WitnessCheckpoint` type, `AuthenticatedSubmission` type, `WitnessSubmissionAuthority` (holds the dedicated signing credential), and `verifySubmissionSignature()`. |
| `src/witness-log.ts` | **Modified** (the prior increment's file, still untracked). The constructor now **requires** `submissionAuthorityPublicKey`, with no default and no unauthenticated mode. `submit()` now takes a `WitnessSubmission { checkpoint, signature }` and rejects with `UNAUTHENTICATED` or `AUTHENTICATION_FAILED` before reading or writing the log. The `submit()` docstring is updated. Retained-record construction, `verify()`, `verifyLogIntegrity()` and the on-disk format are unchanged. |
| `test/witness-log.test.ts` | **Modified.** W-A…W-F and Failure Semantics now submit through the authority, so their assertions still test shape and ordering rather than authentication. The W-G `it.todo` is replaced by W-G1…W-G5. |

**Not touched:** `git diff --stat -- src server public` is empty, so there are no tracked changes in any source file (`witness.ts`, `runtime.ts`, `evidence.ts`, `identity.ts`, `crypto.ts`, `canonicalize.ts`) or in `server/` or `public/`. The only differences are the three untracked Witness files listed above. No file in `command-center/` (Mothership / People / Principal UI) was edited in this increment. Its pre-existing uncommitted UI changes from earlier sessions are left exactly as they were. No Class B or Class C mechanism was introduced.

## 2. Authentication Contract

**What is authenticated:** exactly the three ratified retained fields, and nothing else:

```
digest    = sha256Hex( canonicalize({ scope, checkpointHash, marker }) )
signature = Ed25519-sign( WitnessSubmissionAuthority.privateKey, digest )
```

- The signing input is built field by field from those three fields, never `canonicalize(candidate)`. Extra submitted fields therefore cannot be carried inside or alongside the signature. One function (`submissionDigest`) serves both sign and verify.
- Every primitive is reused unchanged from the evidence kernel: `generateIdentityKeyPair` (Ed25519), `canonicalize`, `sha256Hex`, `signHex` and `verifyHex`. The hash-then-sign shape is the one `createEnvelope()` already uses. No new cryptographic mechanism, library or algorithm was introduced.

**When:** at the submission boundary, inside `OutOfRepoWitnessLog.submit()`, in this fixed order:

1. **SHAPE:** `MALFORMED` if the scope is empty, the hash is not 64 hex characters, or the marker is not a non-negative integer.
2. **AUTHENTICATION:** `UNAUTHENTICATED` if no signature is present. `AUTHENTICATION_FAILED` if the signature does not verify against the configured Submission Authority public key for this exact `scope` / `checkpointHash` / `marker`.
3. **STORAGE and ORDERING:** only reached by an authenticated submission. Returns `OUT_OF_ORDER`, `CONFLICTING_MARKER`, idempotent duplicate, `UNAVAILABLE`, or append.

A submission that fails step 2 never causes the log to be read or written.

**Not authenticated:** `verify()` and `verifyLogIntegrity()`, the read-side divergence checks. Their semantics are unchanged.

**Replay note:** replaying an already-authenticated submission is harmless under the existing ordering rules. Resubmitting the same marker and hash is an idempotent no-op, and an older marker is `OUT_OF_ORDER`. No nonce or anti-replay mechanism was added. §11's replay-enforcement deferral is untouched.

## 3. Credential Boundary

**Possesses the submission credential:** only the `WitnessSubmissionAuthority` instance. It holds the private key in an ES private field (`#privateKey`) with no accessor, and it is never exported or serialized. Only `publicKey` leaves the object.

**Holds only the verifying half:** `OutOfRepoWitnessLog`. It receives the public key from its caller, the same way it receives `storageDir`. It never generates, holds or can reach the private key. This matches the ruling's §1, which allows the Submission Authority and the Witness holder to be the same trust domain; this implementation does not merge them.

**Explicitly does not possess it:**

- `MothershipRuntime`, the evidence-producing and repository-write side, and its `IdentityRegistry`.
- Every `ExecutionPrincipal`, including every principal's evidence-signing key.
- `server/`, `public/` and `command-center/`.

A grep of `src/runtime.ts`, `src/index.ts`, `server/`, `public/` and `command-center/src` for `witness-submission`, `WitnessSubmissionAuthority`, `witness-log` and `OutOfRepoWitnessLog` returns **no matches**.

W-G3(b) shows the boundary holds even against the repository-write actor's own legitimate evidence key. A correctly formed signature over the exact submission digest, made with `principal.keys.privateKey`, is rejected.

**Scope of that claim:** this is a boundary in code, within one process. It is not OS, process or custody separation. See §7.

## 4. Persistence

The ratified record fields, **`scope + checkpointHash + marker`, are unchanged.** No signature field was added. The signature is used only inside `submit()` and then discarded.

For precision: each retained log line also carries `sequence`, `entryHash` and `prevEntryHash`. These are the append-only log-chain bookkeeping fields from the prior, accepted Witness Implementation increment. They existed before this change and this increment does not touch them. They are not evidence content and not authentication data.

W-G1 checks this directly. The retained key set is exactly `{checkpointHash, entryHash, marker, prevEntryHash, scope, sequence}`, and the raw log does not contain the submission's signature string.

The following are all preserved, and W-A…W-F plus the Failure Semantics tests pass unchanged in their assertions:

- append-only history
- scope isolation (one log file per scope)
- checkpoint hash
- marker
- the entry chain semantics
- `verify()` semantics (`MATCH` / `AHEAD_OF_WITNESS` / `DIVERGED` / `NO_CHECKPOINT` / `UNAVAILABLE`)

The Witness is not a second evidence store.

## 5. W-G Tests

Every rejected submission is built to pass the shape check and the ordering check: its marker is strictly ahead of the last witnessed marker, or it is the first submission in its scope. **Authentication is therefore the only thing that can reject it.** Each rejection is paired with a positive control: the same record, signed by the real authority, is accepted.

| Test | Scenario | Result |
|---|---|---|
| **W-G1: Authorized submission** | The authority signs `{scope, head, marker}` and submits it. | **PASS.** Accepted (`sequence 0`). The retained record contains no signature, and `verify()` returns `MATCH`. |
| **W-G2: Forged or unauthenticated submission** | This is the ruling's §4 scenario exactly. The authority first witnesses the genuine chain. The repository-write actor then rewrites the chain coherently and extends it to `length + 1`, and `verifyChain` passes on the rewrite. It computes a valid new HEAD and submits it (a) with no signature, (b) with `signature: null`, and (c) with a garbage signature. | **PASS.** The results are (a) `UNAUTHENTICATED`, (b) `UNAUTHENTICATED`, (c) `AUTHENTICATION_FAILED`. The raw Witness log is **byte-identical** before and after. `verify()` on the rewrite still returns `DIVERGED / PREFIX_MISMATCH`. The positive control, the same forged record signed by the real authority, is accepted. That proves authentication was the only barrier, and it also shows that authenticated ≠ truthful. |
| **W-G3: Wrong credential** | A valid signature from a non-authorized key: (a) an impostor `WitnessSubmissionAuthority`; (b) the repository-write actor's own legitimate evidence-signing key, over the exact submission digest. | **PASS.** Both return `AUTHENTICATION_FAILED`, and the log stays empty. The test also pins the rebuilt digest as the exact submission digest: the real authority's signature verifies over it. The positive control is accepted. |
| **W-G4: Modified submission** | A genuine authenticated submission is mutated in three ways: (a) `checkpointHash` swapped for a forged head; (b) `marker` moved up by one; (c) one hex digit of the signature flipped. | **PASS.** All three return `AUTHENTICATION_FAILED`, the log stays empty, and the unmodified original is then accepted. |
| **W-G5: Cross-scope misuse, signature binding** | A submission authenticated for `org-a:mission-1` is replayed with the same hash, marker and signature under `org-b:mission-1`, whose log is empty, so ordering alone would accept it. | **PASS.** `AUTHENTICATION_FAILED`. The org-b log is untouched and `verify(org-b)` returns `NO_CHECKPOINT`. The positive control, the same record authenticated by the real authority for org-b, is accepted. |
| **W-G5: Cross-scope misuse, credential-to-scope authorization** | A Submission Authority credential permitted to authenticate only some scopes. | **BLOCKED (`it.todo`): architectural gap reported, not invented.** See below. |

**W-G5 gap, stated precisely:** the ruling says "If scope authorization is not currently defined, STOP before inventing it and report the architectural gap." I searched `POA-DEC-SEC-001` (§1–§25) and all four Phase 3 briefs. "Scope" appears only as the name of a retained Witness field (§25.3). **No artifact defines what a Witness scope denotes, how it maps to an organization or mission, or any scope-bound credential model.**

The `"org-a:mission-1"` format is a test convention, not architecture. `IdentityRegistry`'s organization binding (`evaluateAuthorization` → `ORGANIZATION_MISMATCH`) applies only to `ExecutionPrincipal`s on the repository-write side. Reusing it would both invent a scope-to-organization mapping and put the credential under repository-side control.

The consequence: the current Class A credential is **unscoped**. It can authenticate a checkpoint for any scope. What it cannot do is let a signature made for one scope be replayed onto another; the binding row above covers that.

**Decision required, if scoped authority is wanted:** what a Witness scope denotes, and whether Submission Authority credentials are per-scope, per-organization or global.

**Suite totals** (`vitest run`, all 7 files): **68 passed | 1 todo (69)**, identical across 5 consecutive runs. The pre-increment baseline was 63 passed | 1 todo. This figure is derived, not re-measured: 48 at `57f83ce` plus the prior increment's 15 witness-log tests. W-G1…W-G5 add 5 passing tests, and the prior W-G `it.todo` is replaced by the W-G5 authorization `it.todo`. `tsc --noEmit`: **clean (exit 0)**. `witness-log.test.ts` alone: 20 passed | 1 todo.

## 6. Credential Lifecycle

The ruling requires each lifecycle phase to be addressed explicitly, reusing existing POA key-lifecycle principles, and forbids a parallel lifecycle architecture. The existing POA key-lifecycle architecture is `POA-DEC-SEC-001` §16 plus the evidenced-revocation increment in commit `57f83ce` (`MothershipRuntime.revokePrincipal` → a signed `PRINCIPAL_REVOKED` envelope in the identity-scoped evidence chain → `IdentityRegistry.revokePrincipal` sets `active = false`).

| Phase | Status | What is reused / what is missing |
|---|---|---|
| **Creation / provisioning** | **Implemented by reuse** | `generateIdentityKeyPair()` (Ed25519) is the same primitive `IdentityRegistry.registerPrincipal` uses. §16's "a signing key must be uniquely bound to one producing identity" holds: one key per `WitnessSubmissionAuthority`. |
| **Use** | **Implemented by reuse** | `signHex` / `verifyHex` over a `sha256Hex(canonicalize(...))` digest, the same shape as `createEnvelope` / `verifyChain`. |
| **Protected custody** | **Gap** | Only in-process encapsulation exists (an ES private field). §16 lists "key-management technology, storage" as **Implementation-Deferred**, and no POA custody mechanism exists to reuse. |
| **Rotation** | **Gap** | §16 lists "rotation schedule" as **Implementation-Deferred**. No POA rotation mechanism exists. Today, changing the key means constructing the Witness with a new public key, which is a deployment act, not a lifecycle mechanism. |
| **Revocation** | **Gap, and the existing mechanism cannot be reused** | The only existing revocation mechanism lives on the **repository-write side**: the runtime's `IdentityRegistry` and its identity evidence chain. Reusing it for this credential would let the repository-write actor revoke, replace or re-register the Submission Authority's trust anchor, violating the ruling's mandatory invariant. A Witness-side equivalent would be exactly the parallel lifecycle the ruling forbids. Neither was built. |
| **Compromise** | **Gap** | §16 says a compromised key must be revocable. Since revocation is a gap here, compromise response is too. A compromised Submission Authority key can author checkpoints that are indistinguishable from genuine ones. This is the §16 / Matrix row 4 residual, now applied to this credential. |
| **Retirement** | **Gap** | No retirement concept exists in POA's key lifecycle. |

**The gap, stated precisely:** POA's existing key-lifecycle architecture defines revocation only for `ExecutionPrincipal`s, recorded as evidence on the repository-write side. It defines no custody, rotation or retirement mechanism for any key (§16: Implementation-Deferred). It also defines no lifecycle authority that sits **outside** the repository-write trust domain, which a Witness Submission Authority credential requires.

**Decision required:** who administers the Submission Authority credential's lifecycle, where its revocation is evidenced (on the Witness side or elsewhere), and whether §16's deferred mechanisms are to be specified for it. Per the ruling, this is reported and not built. No `revoke()`, accepted-key set or rotation list was added.

## 7. Independence

**What Class A establishes:** the **submission-credential boundary**. Knowing or computing a valid repository HEAD is not enough to create a Witness checkpoint. A submission is accepted only if it is authenticated by a credential the repository-write actor does not hold. That closes W-G **as a property of the submission protocol**, demonstrated by W-G1 to W-G4 and by the W-G5 binding test.

**What the existing Witness architecture establishes** (prior increment, unchanged):

- **Git-tracking separation / structural storage separation.** The log lives in a caller-supplied directory outside the git-tracked tree, so git operations on POA-Repository cannot touch it.
- An append-only, hash-chained log that makes naive or partial edits detectable (W-E).
- Scope isolation (W-F).
- Fail-closed availability semantics.
- The divergence detection itself (W-C, W-D).

This is structural storage separation. It is **not** repository trust-domain independence.

**What remains unenforced in the current environment:** of the four ratified boundaries in §25.1:

| Boundary | Status |
|---|---|
| Repository access/control | Only git-tracking separation. The same OS user can write the Witness log directly (`__unsafeWriteRawLogForAdversarialTesting` models this). |
| Storage | Structurally separate directory, but same host, same filesystem and same OS user. |
| Credentials | **Submission credential: established in code (Class A).** Storage-write credentials to the Witness log: **not** separated. An actor with filesystem write access can bypass `submit()` entirely and rewrite the log coherently. `verifyLogIntegrity()` does not detect a full, self-consistent recompute. |
| Administration | **Not established.** No separate administrative domain exists. The same operator provisions the authority, the Witness and the runtime, all in one process. |

Class A **by itself does not establish all four independence boundaries**, and this scaffold **is not a production independent Witness.**

## 8. Residual Trust

Even with W-G closed at the protocol level, the following remain trusted:

1. **The Submission Authority itself.** Authenticated ≠ truthful. The authority can witness a false or rewritten state; the W-G2 positive control demonstrates exactly that. The Witness proves origin, not correctness (§25.4).
2. **Custody of the Submission Authority private key.** It is currently an in-process object. Whoever can read process memory, or construct the authority, holds the credential.
3. **Integrity of the trust anchor passed to the Witness.** Whoever constructs `OutOfRepoWitnessLog` chooses which public key it trusts. That wiring is currently unadministered: same process, same operator.
4. **Witness storage write access.** Anyone with direct filesystem write access can bypass the submission boundary and rewrite the log coherently. Class A authenticates *submissions*, not *storage*.
5. **The absence of lifecycle mechanisms** (§6). There is no revocation, rotation or compromise response, so a leaked key stays valid until the trust anchor is replaced by hand.
6. **An unscoped credential** (W-G5 gap). One key can authenticate every scope.
7. **Everything already listed in POA-DEC-SEC-001 §19.** The Witness is not yet wired into `MothershipRuntime`, which still uses the `witness.ts` test double. No backup/restore gate exists (§17). Provenance-only evidence has no integrity protection. Replay enforcement is deferred. Sentinel is unbuilt.

## 9. Governance State

- **Witness Trust Boundary:** RATIFIED (§25.1–§25.4)
- **Submission Authentication:** CLASS A RATIFIED (Commander ruling)
- **Witness implementation:** **SCAFFOLD, with Class A submission authentication implemented and adversarially tested (W-G1 to W-G4 PASS; W-G5 signature-binding PASS; W-G5 credential-to-scope authorization BLOCKED as an architectural gap).** The credential lifecycle is reused for creation and use only; custody, rotation, revocation, compromise and retirement are reported gaps. The scaffold is not wired into the runtime and is not a production independent Witness.
- **POA-DEC-SEC-001 overall Decision Status:** unchanged. DECISION CANDIDATE, pending Commander / Chief Architect ratification (§24). This report does not add a §26 ruling record to that document; recording the Class A ruling there is left to a separately authorized step.
- **Gate H:** CONDITIONAL

**Decisions this increment surfaces for the Commander (not made here):**

1. **W-G5 / scope authorization:** what a Witness scope denotes, and whether Submission Authority credentials are per-scope, per-organization or global.
2. **Credential lifecycle authority:** who administers the Submission Authority credential's custody, rotation, revocation and retirement, and where its revocation is evidenced, given that the existing mechanism sits on the repository-write side.

## 10. Safety Gate

Gate H closure is **not** claimed. Production-grade independent credential custody is absent: there is no custody mechanism, no administrative separation, and no storage-credential separation.

**W-G AUTHENTICATION IMPLEMENTED — PRODUCTION INDEPENDENT WITNESS NOT YET OPERATIONALLY ESTABLISHED.**
