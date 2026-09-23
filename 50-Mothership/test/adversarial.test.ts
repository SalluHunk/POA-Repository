/**
 * Adversarial Verification (POA-BLD-001 S17-S18): Tests A, B, C, D, E, G.
 * Test F (tail rollback) lives in witness.test.ts, since it specifically
 * targets the Independent Witness. Test H (capability bypass) lives in
 * lifecycle.test.ts, Test I (organization crossing) in
 * organization-isolation.test.ts.
 *
 * Every attack here uses __unsafeGetMutableChainForAdversarialTesting to
 * simulate an actor who has already compromised storage/service access -
 * i.e. these tests attack the persisted evidence directly, bypassing the
 * ordinary runtime API entirely, exactly as a real attacker with storage
 * access would.
 */
import { describe, expect, it } from "vitest";
import { MothershipRuntime } from "@/runtime";
import { verifyChain } from "@/evidence";
import { canonicalize } from "@/canonicalize";
import { sha256Hex } from "@/crypto";

function buildMissionWithThreeAuthorityBearingEvents(missionId = "mission-1", organizationId = "org-a") {
  const runtime = new MothershipRuntime();
  runtime.identity.registerOrganization(organizationId, "Organization A");
  const principal = runtime.identity.registerPrincipal("principal-1", organizationId, "execution-agent");
  runtime.identity.grantCapability("principal-1", "mission:execute");
  runtime.createMission(missionId, organizationId);
  runtime.transitionMission(missionId, organizationId, "Running", principal);
  runtime.authorizeAndExecute(missionId, principal, "mission:execute", "action-one");
  runtime.authorizeAndExecute(missionId, principal, "mission:execute", "action-two");
  return { runtime, principal };
}

describe("Test A - Modification (POA-BLD-001 S17)", () => {
  it("detects a directly mutated payload as VERIFICATION FAILED", () => {
    const { runtime, principal } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    chain[1].payload.result = "TAMPERED";

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("PAYLOAD_HASH_MISMATCH");
    void principal;
  });
});

describe("Test B - Substitution (POA-BLD-001 S17)", () => {
  it("detects a wholesale-substituted evidence item (attacker lacks the producer's private key) as VERIFICATION FAILED", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    const original = chain[1];

    // Attacker fabricates a fully self-consistent replacement payload and
    // recomputes payloadHash/envelopeHash correctly - everything an
    // attacker WITHOUT the signing key can do.
    const newPayload = { ...original.payload, what: "FORGED_ACTION", result: "FORGED_RESULT" };
    const newPayloadHash = sha256Hex(canonicalize(newPayload));
    const newEnvelopeHash = sha256Hex(
      canonicalize({
        sequence: original.sequence,
        missionId: original.missionId,
        organizationId: original.organizationId,
        producerId: original.producerId,
        authorityBearing: original.authorityBearing,
        payloadHash: newPayloadHash,
        prevHash: original.prevHash,
      }),
    );
    chain[1] = {
      ...original,
      payload: newPayload,
      payloadHash: newPayloadHash,
      envelopeHash: newEnvelopeHash,
      signature: original.signature, // attacker cannot produce a valid new signature
    };

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("SIGNATURE_INVALID");
  });
});

describe("Test C - Reordering (POA-BLD-001 S17)", () => {
  it("detects two swapped evidence items as VERIFICATION FAILED", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    [chain[1], chain[2]] = [chain[2], chain[1]];

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("SEQUENCE_MISMATCH");
  });
});

describe("Test D - Replay (POA-BLD-001 S17)", () => {
  it("detects an old event from a different mission inserted into a new mission's sequence as VERIFICATION FAILED", () => {
    const { runtime: runtimeOne } = buildMissionWithThreeAuthorityBearingEvents("mission-1", "org-a");
    const oldEvent = runtimeOne.__unsafeGetMutableChainForAdversarialTesting("mission-1")[1];

    const runtimeTwo = new MothershipRuntime();
    runtimeTwo.identity.registerOrganization("org-a", "Organization A");
    const principal = runtimeTwo.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtimeTwo.identity.grantCapability("principal-1", "mission:execute");
    runtimeTwo.createMission("mission-2", "org-a");
    runtimeTwo.transitionMission("mission-2", "org-a", "Running", principal);
    runtimeTwo.authorizeAndExecute("mission-2", principal, "mission:execute", "genuine-action");

    const chainTwo = runtimeTwo.__unsafeGetMutableChainForAdversarialTesting("mission-2");
    chainTwo.push(oldEvent); // replay: insert mission-1's validly-signed event into mission-2's chain

    const result = verifyChain("mission-2", chainTwo, (id) => runtimeTwo.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("MISSION_MISMATCH");
  });
});

describe("Test E - Interior deletion (POA-BLD-001 S17)", () => {
  it("detects a removed earlier evidence item as VERIFICATION FAILED", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    chain.splice(1, 1); // remove the interior item

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    // Caught by sequence-continuity before the hash chain is even walked -
    // both are valid, complementary detection layers (see completion report).
    expect(result.code).toBe("SEQUENCE_MISMATCH");
  });
});

describe("Test G - Identity substitution (POA-BLD-001 S17)", () => {
  it("detects evidence re-attributed to a different execution principal as VERIFICATION FAILED", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const other = runtime.identity.registerPrincipal("principal-2", "org-a", "execution-agent");
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    const original = chain[1];

    // Attacker re-attributes the entry to `other` and recomputes the
    // envelope hash to stay internally consistent - but cannot produce a
    // valid signature under `other`'s private key.
    const newEnvelopeHash = sha256Hex(
      canonicalize({
        sequence: original.sequence,
        missionId: original.missionId,
        organizationId: original.organizationId,
        producerId: other.id,
        authorityBearing: original.authorityBearing,
        payloadHash: original.payloadHash,
        prevHash: original.prevHash,
      }),
    );
    chain[1] = { ...original, producerId: other.id, envelopeHash: newEnvelopeHash, signature: original.signature };

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("SIGNATURE_INVALID");
  });
});

// Timestamp Manipulation (POA-DEC-SEC-001 S18 row 7; Phase 3 "Authorize
// Key-Lifecycle Evidence" Objective 5). `when` is diagnostic-only by design
// (never the basis for ordering - `sequence`/`prevHash` do that) but it IS
// part of the hashed payload, so it is not unprotected either. Two distinct
// claims, tested separately, per the objective's explicit instruction not
// to conflate them:
describe("Timestamp Manipulation (POA-DEC-SEC-001 S18 row 7)", () => {
  it("naive timestamp mutation (hash left stale) is detected as a hash-integrity failure", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    chain[1].payload.when = "2099-01-01T00:00:00.000Z"; // payloadHash left unchanged - stale

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("PAYLOAD_HASH_MISMATCH");
  });

  it("a recomputed forged timestamp is correctly understood as a forgery/authenticity problem, not a timestamp-specific one - identical in kind to Test B's substitution, because that is exactly what it is", () => {
    const { runtime } = buildMissionWithThreeAuthorityBearingEvents();
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    const original = chain[1];

    // Attacker forges a false wall-clock time AND fully recomputes both
    // hashes to stay internally self-consistent - everything an attacker
    // WITHOUT the signing key can do. This is not "solved" merely because
    // the result is internally coherent; it is caught for the same reason
    // Test B is caught (no valid new signature), never because of anything
    // timestamp-specific - there is no timestamp-specific defense here by
    // design (S12).
    const newPayload = { ...original.payload, when: "2099-01-01T00:00:00.000Z" };
    const newPayloadHash = sha256Hex(canonicalize(newPayload));
    const newEnvelopeHash = sha256Hex(
      canonicalize({
        sequence: original.sequence,
        missionId: original.missionId,
        organizationId: original.organizationId,
        producerId: original.producerId,
        authorityBearing: original.authorityBearing,
        payloadHash: newPayloadHash,
        prevHash: original.prevHash,
      }),
    );
    chain[1] = { ...original, payload: newPayload, payloadHash: newPayloadHash, envelopeHash: newEnvelopeHash, signature: original.signature };

    const result = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("SIGNATURE_INVALID");
  });
});
