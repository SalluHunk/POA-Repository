/**
 * Test F - Tail rollback (POA-BLD-001 S14, S17).
 *
 * This test demonstrates the exact architectural finding POA-DEC-SEC-001
 * S14 made: an internal hash chain alone CANNOT detect a coherent rollback
 * (truncating the chain back to an earlier, still-internally-consistent
 * state) - only an Independent Witness, checked separately, can. Both
 * assertions below matter: the chain-only check must still read OK (proving
 * it genuinely cannot see the problem on its own), and the witness check
 * must independently catch it.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { MothershipRuntime } from "@/runtime";
import { verifyChain } from "@/evidence";
import { __resetWitnessForTests } from "@/witness";

beforeEach(() => {
  __resetWitnessForTests();
});

describe("Test F - Tail rollback / checkpoint mismatch (POA-BLD-001 S14)", () => {
  it("valid state -> checkpoint -> rollback -> chain-only check still passes, witness check independently fails", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtime.identity.grantCapability("principal-1", "mission:execute");
    runtime.createMission("mission-1", "org-a");
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    runtime.authorizeAndExecute("mission-1", principal, "mission:execute", "action-one");
    runtime.authorizeAndExecute("mission-1", principal, "mission:execute", "action-two");

    // Valid repository state -> Checkpoint
    const checkpointedHead = runtime.checkpointMission("mission-1");
    expect(checkpointedHead).not.toBeNull();

    // Repository history altered / rolled back: truncate the chain back to
    // an earlier point (simulating a force-push/restore-to-earlier-backup
    // by whoever controls the store, e.g. a compromised Steward).
    const chain = runtime.__unsafeGetMutableChainForAdversarialTesting("mission-1");
    chain.pop();

    // The rolled-back chain is, on its own, still perfectly internally
    // consistent - this is the whole point: hash-chaining alone cannot see
    // the rollback.
    const chainOnlyResult = verifyChain("mission-1", chain, (id) => runtime.identity.getPrincipal(id));
    expect(chainOnlyResult.ok).toBe(true);

    // Independent verification against the Witness's separately-held
    // checkpoint DOES catch it.
    const { chain: chainResult, witness } = runtime.verifyMission("mission-1");
    expect(chainResult.ok).toBe(true); // confirms the "chain alone is blind to this" claim above
    expect(witness.ok).toBe(false);
    expect(witness.code).toBe("CHECKPOINT_MISMATCH");
  });

  it("no checkpoint yet means no witness claim is made (honest absence, not a false pass)", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtime.createMission("mission-1", "org-a");
    runtime.transitionMission("mission-1", "org-a", "Running", principal);

    const { witness } = runtime.verifyMission("mission-1");
    expect(witness.code).toBe("NO_CHECKPOINT");
  });
});
