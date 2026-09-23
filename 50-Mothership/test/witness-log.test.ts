/**
 * Out-of-repo Witness log (POA-DEC-SEC-001 S25; Phase 3 "Independent
 * Witness Implementation"). Tests W-A through W-F, plus the Failure
 * Semantics matrix §6 of the brief, and W-G1 through W-G5 (Phase 3
 * "Witness Submission Authentication Ruling" - Class A).
 *
 * "Repository" in these tests means the runtime's in-memory evidence
 * chain (MothershipRuntime's evidenceByMission), never git history -
 * this evidence never reaches git in the current architecture
 * (evidence.ts's own documented boundary). W-C/W-D/W-G exercise exactly
 * that in-memory chain, not any git operation.
 *
 * Since Class A, every submission must carry a Witness Submission
 * Authority signature; W-A..W-F and Failure Semantics submit through
 * `authority` so their assertions still exercise shape/ordering, not auth.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MothershipRuntime } from "@/runtime";
import { createEnvelope, verifyChain, type EvidenceEnvelope } from "@/evidence";
import type { ExecutionPrincipal } from "@/identity";
import { canonicalize } from "@/canonicalize";
import { sha256Hex, signHex, verifyHex } from "@/crypto";
import { computeHeadHash } from "@/witness";
import { OutOfRepoWitnessLog } from "@/witness-log";
import { WitnessSubmissionAuthority, type WitnessCheckpoint } from "@/witness-submission";

let dir: string;
let authority: WitnessSubmissionAuthority;
let log: OutOfRepoWitnessLog;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "poa-witness-log-"));
  authority = new WitnessSubmissionAuthority();
  log = new OutOfRepoWitnessLog(dir, authority.publicKey);
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

/** Authorized submission path - the Witness Submission Authority signs, then submits. */
function submitAuthorized(checkpoint: WitnessCheckpoint, target: OutOfRepoWitnessLog = log) {
  return target.submit(authority.authenticate(checkpoint));
}

function headAtMarkerFor(chain: EvidenceEnvelope[]) {
  return (marker: number) => (marker === 0 ? null : (chain[marker - 1]?.envelopeHash ?? null));
}

function buildRuntimeChain(missionId = "mission-1", organizationId = "org-a") {
  const runtime = new MothershipRuntime();
  runtime.identity.registerOrganization(organizationId, "Organization A");
  const principal = runtime.identity.registerPrincipal("principal-1", organizationId, "execution-agent");
  runtime.identity.grantCapability("principal-1", "mission:execute");
  runtime.createMission(missionId, organizationId);
  runtime.transitionMission(missionId, organizationId, "Running", principal);
  runtime.authorizeAndExecute(missionId, principal, "mission:execute", "action-one");
  runtime.authorizeAndExecute(missionId, principal, "mission:execute", "action-two");
  const chain = runtime.__unsafeGetMutableChainForAdversarialTesting(missionId);
  return { runtime, principal, chain };
}

/** A repository-write actor's coherent rewrite: internally self-consistent, signed with the legitimate evidence key, different content. */
function coherentRewrite(principal: ExecutionPrincipal, length: number): EvidenceEnvelope[] {
  const rewritten: EvidenceEnvelope[] = [];
  let prevHash: string | null = null;
  for (let i = 0; i < length; i++) {
    const envelope = createEnvelope(i, "mission-1", "org-a", principal, true, {
      who: principal.id,
      what: "REWRITTEN_EVENT",
      why: `forged-${i}`,
      when: new Date().toISOString(),
      result: "FORGED",
      mission: "mission-1",
      organization: "org-a",
    }, prevHash);
    rewritten.push(envelope);
    prevHash = envelope.envelopeHash;
  }
  return rewritten;
}

describe("W-A - Normal checkpoint", () => {
  it("a valid checkpoint is accepted and independently retrievable via verify()", () => {
    const { chain } = buildRuntimeChain();
    const result = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });
    expect(result).toEqual({ accepted: true, idempotent: false, sequence: 0 });

    const verification = log.verify("org-a:mission-1", chain.length, computeHeadHash(chain), headAtMarkerFor(chain));
    expect(verification).toEqual({ status: "MATCH", marker: chain.length });
  });
});

describe("W-B - Append-only history", () => {
  it("two sequential checkpoints are retained as two records, not one replacing the other", () => {
    const { chain } = buildRuntimeChain();
    const first = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain.slice(0, 3))!, marker: 3 });
    const second = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });
    expect(first).toEqual({ accepted: true, idempotent: false, sequence: 0 });
    expect(second).toEqual({ accepted: true, idempotent: false, sequence: 1 });

    const raw = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");
    expect(raw.trim().split("\n").length).toBe(2);
    expect(log.verifyLogIntegrity("org-a:mission-1")).toEqual({ ok: true, index: 2 });
  });
});

describe("W-C - Repository tail rollback", () => {
  it("a chain rolled back behind the latest witnessed checkpoint is detected", () => {
    const { runtime, chain } = buildRuntimeChain();
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });

    chain.pop(); // simulate a coherent rollback, exactly witness.test.ts's Test F scenario
    void runtime;

    const verification = log.verify("org-a:mission-1", chain.length, computeHeadHash(chain), headAtMarkerFor(chain));
    expect(verification.status).toBe("DIVERGED");
    if (verification.status === "DIVERGED") expect(verification.reason).toBe("BEHIND");
  });
});

describe("W-D - Coherent repository rewrite (the defining Witness test)", () => {
  it("a repository history that is internally self-consistent but diverges from the witnessed checkpoint is detected", () => {
    const { runtime, principal, chain } = buildRuntimeChain();
    const checkpointedHash = computeHeadHash(chain)!;
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: checkpointedHash, marker: chain.length });

    // Attacker holds the legitimate signing key (compromised Steward, not an
    // external forger) and rebuilds an entirely new, equal-length,
    // internally self-consistent chain with different content.
    const rewritten = coherentRewrite(principal, chain.length);

    // Proves it is "coherent": the chain-only check passes on its own.
    const chainOnly = verifyChain("mission-1", rewritten, (id) => runtime.identity.getPrincipal(id));
    expect(chainOnly.ok).toBe(true);
    expect(computeHeadHash(rewritten)).not.toBe(checkpointedHash); // genuinely different content

    const verification = log.verify("org-a:mission-1", rewritten.length, computeHeadHash(rewritten), headAtMarkerFor(rewritten));
    expect(verification.status).toBe("DIVERGED");
    if (verification.status === "DIVERGED") expect(verification.reason).toBe("REWRITE");
  });
});

describe("W-E - Witness mutation", () => {
  it("a hand-edited retained record is detected as a hash-integrity failure", () => {
    const { chain } = buildRuntimeChain();
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });

    const raw = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");
    const record = JSON.parse(raw.trim());
    record.checkpointHash = "f".repeat(64); // edited without recomputing entryHash
    log.__unsafeWriteRawLogForAdversarialTesting("org-a:mission-1", JSON.stringify(record) + "\n");

    expect(log.verifyLogIntegrity("org-a:mission-1")).toMatchObject({ ok: false, code: "ENTRY_HASH_MISMATCH" });
  });

  it("interior deletion of a retained record breaks the chain", () => {
    const { chain } = buildRuntimeChain();
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain.slice(0, 3))!, marker: 3 });
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });

    const raw = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");
    const lines = raw.trim().split("\n");
    log.__unsafeWriteRawLogForAdversarialTesting("org-a:mission-1", lines[1] + "\n"); // drop the first entry

    expect(log.verifyLogIntegrity("org-a:mission-1")).toMatchObject({ ok: false, code: "SEQUENCE_MISMATCH" });
  });
});

describe("W-F - Scope isolation", () => {
  it("a checkpoint for one scope cannot be interpreted as a valid checkpoint for another", () => {
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 2 });
    submitAuthorized({ scope: "org-b:mission-1", checkpointHash: "b".repeat(64), marker: 5 });

    const orgARaw = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");
    const orgBRaw = log.__unsafeReadRawLogForAdversarialTesting("org-b:mission-1");
    expect(orgARaw).not.toBe(orgBRaw);
    expect(JSON.parse(orgARaw.trim()).checkpointHash).toBe("a".repeat(64));
    expect(JSON.parse(orgBRaw.trim()).checkpointHash).toBe("b".repeat(64));

    // Org A's own state is unaffected by Org B's checkpoint.
    const orgAVerify = log.verify("org-a:mission-1", 2, "a".repeat(64), () => null);
    expect(orgAVerify).toEqual({ status: "MATCH", marker: 2 });
  });
});

// ---------------------------------------------------------------------------
// W-G - Submission authentication (Class A). Every rejected submission below
// is deliberately built to be SHAPE-valid and ORDERING-valid (marker strictly
// ahead of the last witnessed marker, or first in its scope), so the only
// thing that can reject it is authentication. Each rejection is paired with
// a positive control showing the same record, signed by the real authority,
// would have been accepted.
// ---------------------------------------------------------------------------

describe("W-G1 - Authorized submission", () => {
  it("a correctly authenticated checkpoint is accepted, and the signature is not retained", () => {
    const { chain } = buildRuntimeChain();
    const submission = authority.authenticate({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });
    expect(log.submit(submission)).toEqual({ accepted: true, idempotent: false, sequence: 0 });

    const raw = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");
    const retained = JSON.parse(raw.trim());
    expect(Object.keys(retained).sort()).toEqual(["checkpointHash", "entryHash", "marker", "prevEntryHash", "scope", "sequence"]);
    expect(raw).not.toContain(submission.signature);
    expect(log.verify("org-a:mission-1", chain.length, computeHeadHash(chain), headAtMarkerFor(chain))).toEqual({ status: "MATCH", marker: chain.length });
  });
});

describe("W-G2 - Forged submission by the repository-write actor (the defining W-G scenario)", () => {
  it("a coherent rewrite with a valid new HEAD, submitted without the Submission Authority credential, is rejected", () => {
    const { runtime, principal, chain } = buildRuntimeChain();
    // 0. The authority witnesses the genuine state.
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });
    const before = log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1");

    // 1-2. Repository-write authority coherently rewrites history AND extends
    // it, so the forged checkpoint's marker is AHEAD of the witnessed one -
    // ordering alone would accept it.
    const rewritten = coherentRewrite(principal, chain.length + 1);
    expect(verifyChain("mission-1", rewritten, (id) => runtime.identity.getPrincipal(id)).ok).toBe(true);
    const forged: WitnessCheckpoint = { scope: "org-a:mission-1", checkpointHash: computeHeadHash(rewritten)!, marker: rewritten.length };

    // 3-5. It submits without the credential it does not possess -> rejected.
    expect(log.submit({ checkpoint: forged })).toMatchObject({ accepted: false, code: "UNAUTHENTICATED" });
    expect(log.submit({ checkpoint: forged, signature: null })).toMatchObject({ accepted: false, code: "UNAUTHENTICATED" });
    expect(log.submit({ checkpoint: forged, signature: "00".repeat(64) })).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });

    // Rejection is observable: the Witness record is byte-identical, and the
    // rewritten chain is still detected as diverged from the real checkpoint.
    expect(log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1")).toBe(before);
    const verification = log.verify("org-a:mission-1", rewritten.length, computeHeadHash(rewritten), headAtMarkerFor(rewritten));
    expect(verification).toMatchObject({ status: "DIVERGED", reason: "PREFIX_MISMATCH" });

    // Positive control: authentication was the ONLY barrier - the same record
    // signed by the real authority is accepted. (This also demonstrates
    // Authenticated != truthful: the authority can witness a false state.)
    expect(submitAuthorized(forged)).toEqual({ accepted: true, idempotent: false, sequence: 1 });
  });
});

describe("W-G3 - Wrong credential", () => {
  it("a valid signature produced by a non-authorized key is rejected", () => {
    const { principal, chain } = buildRuntimeChain();
    const checkpoint: WitnessCheckpoint = { scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length };

    // (a) A structurally genuine Submission Authority that is not the one this Witness trusts.
    const impostor = new WitnessSubmissionAuthority();
    expect(log.submit(impostor.authenticate(checkpoint))).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });

    // (b) The repository-write actor's own legitimate evidence-signing key,
    // producing a correctly-formed signature over the exact submission digest.
    const digest = sha256Hex(canonicalize({ scope: checkpoint.scope, checkpointHash: checkpoint.checkpointHash, marker: checkpoint.marker }));
    expect(verifyHex(authority.publicKey, digest, authority.authenticate(checkpoint).signature)).toBe(true); // pins: this IS the exact submission digest
    expect(log.submit({ checkpoint, signature: signHex(principal.keys.privateKey, digest) })).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });

    expect(log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1")).toBe("");
    expect(submitAuthorized(checkpoint)).toEqual({ accepted: true, idempotent: false, sequence: 0 }); // positive control
  });
});

describe("W-G4 - Modified submission", () => {
  it("mutating any authenticated field after signing causes authentication failure", () => {
    const { principal, chain } = buildRuntimeChain();
    const genuine = authority.authenticate({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain)!, marker: chain.length });
    const forgedHead = computeHeadHash(coherentRewrite(principal, chain.length))!;

    // Hash swapped at the same (first-in-scope, so ordering-valid) marker.
    expect(log.submit({ checkpoint: { ...genuine.checkpoint, checkpointHash: forgedHead }, signature: genuine.signature })).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });
    // Marker moved upward (still ordering-valid).
    expect(log.submit({ checkpoint: { ...genuine.checkpoint, marker: genuine.checkpoint.marker + 1 }, signature: genuine.signature })).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });
    // Signature itself tampered.
    const flipped = (genuine.signature[0] === "0" ? "1" : "0") + genuine.signature.slice(1);
    expect(log.submit({ checkpoint: genuine.checkpoint, signature: flipped })).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });

    expect(log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1")).toBe("");
    expect(log.submit(genuine)).toEqual({ accepted: true, idempotent: false, sequence: 0 }); // positive control: unmodified original
  });
});

describe("W-G5 - Cross-scope misuse", () => {
  it("signature binding: an authenticated submission for one scope cannot be replayed onto another scope", () => {
    const genuine = authority.authenticate({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 3 });
    expect(log.submit(genuine)).toEqual({ accepted: true, idempotent: false, sequence: 0 });

    // Same hash, same marker, same signature - only the scope is changed.
    // org-b's log is empty, so ordering alone would accept it.
    const replayed = { checkpoint: { ...genuine.checkpoint, scope: "org-b:mission-1" }, signature: genuine.signature };
    expect(log.submit(replayed)).toMatchObject({ accepted: false, code: "AUTHENTICATION_FAILED" });
    expect(log.__unsafeReadRawLogForAdversarialTesting("org-b:mission-1")).toBe("");
    expect(log.verify("org-b:mission-1", 3, "a".repeat(64), () => null)).toEqual({ status: "NO_CHECKPOINT" });

    // Positive control: the same record, authenticated by the real authority FOR org-b, is accepted.
    expect(submitAuthorized({ ...genuine.checkpoint, scope: "org-b:mission-1" })).toEqual({ accepted: true, idempotent: false, sequence: 0 });
  });

  // Credential-to-scope AUTHORIZATION (a Submission Authority key permitted
  // to authenticate only some scopes) is not implemented: neither
  // POA-DEC-SEC-001 S25 nor any Phase 3 brief defines what a Witness scope
  // denotes or any scope-bound credential model. Per the ruling's explicit
  // W-G5 instruction, this is reported as an architectural gap, not invented.
  it.todo("BLOCKED - credential-to-scope authorization: no scope-bound credential model is defined; see Phase 3 Witness Submission Authentication Implementation Report §5");
});

describe("Failure Semantics", () => {
  it("Witness unavailable (storage inaccessible) never returns MATCH/AHEAD - fails closed", () => {
    const blockedPath = join(dir, "blocked-file");
    writeFileSync(blockedPath, "not a directory");
    const brokenLog = new OutOfRepoWitnessLog(join(blockedPath, "nested"), authority.publicKey); // parent is a file, mkdir must fail

    const submitResult = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 1 }, brokenLog);
    expect(submitResult.accepted).toBe(false);
    if (!submitResult.accepted) expect(submitResult.code).toBe("UNAVAILABLE");
  });

  it("malformed checkpoint is an invalid submission", () => {
    const result = submitAuthorized({ scope: "", checkpointHash: "not-a-hash", marker: -1 });
    expect(result).toMatchObject({ accepted: false, code: "MALFORMED" });
  });

  it("out-of-order checkpoint is an invalid submission", () => {
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 5 });
    const result = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "b".repeat(64), marker: 3 });
    expect(result).toMatchObject({ accepted: false, code: "OUT_OF_ORDER" });
  });

  it("conflicting marker (same marker, different hash) is an invalid submission", () => {
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 3 });
    const result = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "b".repeat(64), marker: 3 });
    expect(result).toMatchObject({ accepted: false, code: "CONFLICTING_MARKER" });
  });

  it("duplicate checkpoint (same marker, same hash) is idempotent, not appended twice", () => {
    const first = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 3 });
    const second = submitAuthorized({ scope: "org-a:mission-1", checkpointHash: "a".repeat(64), marker: 3 });
    expect(first).toEqual({ accepted: true, idempotent: false, sequence: 0 });
    expect(second).toEqual({ accepted: true, idempotent: true, sequence: 0 });
    expect(log.__unsafeReadRawLogForAdversarialTesting("org-a:mission-1").trim().split("\n").length).toBe(1);
  });

  it("repository ahead of the Witness, with the checkpointed prefix intact, is reported honestly - not as a plain match", () => {
    const { chain } = buildRuntimeChain();
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: computeHeadHash(chain.slice(0, 3))!, marker: 3 });

    const verification = log.verify("org-a:mission-1", chain.length, computeHeadHash(chain), headAtMarkerFor(chain));
    expect(verification).toEqual({ status: "AHEAD_OF_WITNESS", witnessedMarker: 3, currentMarker: chain.length });
  });

  it("repository ahead of the Witness but the checkpointed prefix itself no longer matches is a divergence, not a match", () => {
    const witnessedHash = "c".repeat(64);
    submitAuthorized({ scope: "org-a:mission-1", checkpointHash: witnessedHash, marker: 2 });

    // headAtMarker deliberately returns a value that does NOT match the
    // witnessed hash at that position - the chain grew, but its own
    // earlier content silently changed underneath the checkpoint.
    const verification = log.verify("org-a:mission-1", 4, "d".repeat(64), () => "e".repeat(64));
    expect(verification).toEqual({ status: "DIVERGED", reason: "PREFIX_MISMATCH", witnessedMarker: 2, witnessedHash, currentMarker: 4, currentHead: "d".repeat(64) });
  });

  it("no checkpoint yet is an honest absence, not a false match", () => {
    const verification = log.verify("org-a:never-checkpointed", 3, "a".repeat(64), () => null);
    expect(verification).toEqual({ status: "NO_CHECKPOINT" });
  });
});
