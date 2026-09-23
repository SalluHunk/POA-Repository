/**
 * Key-Lifecycle Evidence (POA-DEC-SEC-001 S16; Phase 3 "Authorize
 * Key-Lifecycle Evidence"). Demonstrates that MothershipRuntime.revokePrincipal
 * produces real, verifiable evidence for the revocation act itself, reusing
 * the exact same envelope/hash/signature/chain mechanism proven in
 * adversarial.test.ts against mission evidence - not a new one. Continues
 * this project's existing lettered test convention (A-I already used
 * across adversarial.test.ts, witness.test.ts, lifecycle.test.ts,
 * organization-isolation.test.ts).
 */
import { describe, expect, it } from "vitest";
import { MothershipRuntime } from "@/runtime";
import { verifyChain } from "@/evidence";

function buildOrgWithAdminAndTarget(organizationId = "org-a") {
  const runtime = new MothershipRuntime();
  runtime.identity.registerOrganization(organizationId, "Organization A");
  const admin = runtime.identity.registerPrincipal("admin-1", organizationId, "steward");
  const target = runtime.identity.registerPrincipal("agent-1", organizationId, "execution-agent");
  runtime.identity.grantCapability("agent-1", "mission:execute");
  return { runtime, admin, target };
}

describe("Test J - Valid revocation (POA-DEC-SEC-001 S16)", () => {
  it("produces a valid, verifiable, authority-bearing evidence envelope", () => {
    const { runtime, admin, target } = buildOrgWithAdminAndTarget();
    const result = runtime.revokePrincipal(target.id, "org-a", admin);
    expect(result.ok).toBe(true);
    expect(result.code).toBe("REVOKED");

    const chain = runtime.__unsafeGetMutableIdentityChainForAdversarialTesting("org-a");
    expect(chain.length).toBe(1);
    expect(chain[0].authorityBearing).toBe(true);
    expect(chain[0].signature).not.toBeNull();

    const verified = verifyChain(chain[0].missionId, chain, (id) => runtime.identity.getPrincipal(id));
    expect(verified.ok).toBe(true);
  });
});

describe("Test K - Revocation attribution (POA-DEC-SEC-001 S16)", () => {
  it("identifies the actor performing the revocation and the principal being revoked", () => {
    const { runtime, admin, target } = buildOrgWithAdminAndTarget();
    runtime.revokePrincipal(target.id, "org-a", admin);

    const [envelope] = runtime.__unsafeGetMutableIdentityChainForAdversarialTesting("org-a");
    expect(envelope.producerId).toBe(admin.id); // who performed the revocation
    expect(envelope.payload.what).toBe("PRINCIPAL_REVOKED");
    expect(envelope.payload.why).toBe(target.id); // who was revoked
    expect(envelope.payload.result).toBe("ACTIVE->REVOKED");
  });
});

describe("Test L - Tampering (POA-DEC-SEC-001 S16; adversarial matrix)", () => {
  it("detects a mutated revocation envelope as VERIFICATION FAILED", () => {
    const { runtime, admin, target } = buildOrgWithAdminAndTarget();
    runtime.revokePrincipal(target.id, "org-a", admin);

    const chain = runtime.__unsafeGetMutableIdentityChainForAdversarialTesting("org-a");
    chain[0].payload.why = "some-other-principal"; // attacker retargets the revocation after the fact

    const result = verifyChain(chain[0].missionId, chain, (id) => runtime.identity.getPrincipal(id));
    expect(result.ok).toBe(false);
    expect(result.code).toBe("PAYLOAD_HASH_MISMATCH");
  });
});

describe("Test M - Ordering / chain integrity (POA-DEC-SEC-001 S16)", () => {
  it("multiple revocations chain correctly, and reordering them is detected", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const admin = runtime.identity.registerPrincipal("admin-1", "org-a", "steward");
    const targetOne = runtime.identity.registerPrincipal("agent-1", "org-a", "execution-agent");
    const targetTwo = runtime.identity.registerPrincipal("agent-2", "org-a", "execution-agent");

    runtime.revokePrincipal(targetOne.id, "org-a", admin);
    runtime.revokePrincipal(targetTwo.id, "org-a", admin);

    const chain = runtime.__unsafeGetMutableIdentityChainForAdversarialTesting("org-a");
    expect(chain.length).toBe(2);
    expect(chain[1].prevHash).toBe(chain[0].envelopeHash);
    const validResult = verifyChain(chain[0].missionId, chain, (id) => runtime.identity.getPrincipal(id));
    expect(validResult.ok).toBe(true);

    [chain[0], chain[1]] = [chain[1], chain[0]]; // swap
    const swappedResult = verifyChain(chain[0].missionId, chain, (id) => runtime.identity.getPrincipal(id));
    expect(swappedResult.ok).toBe(false);
    expect(swappedResult.code).toBe("SEQUENCE_MISMATCH");
  });
});

describe("Test N - Post-revocation behavior (POA-DEC-SEC-001 S16)", () => {
  it("a subsequent authorization attempt from the revoked principal is denied per the existing capability model", () => {
    const { runtime, admin, target } = buildOrgWithAdminAndTarget();
    runtime.createMission("mission-1", "org-a");

    const before = runtime.authorizeAndExecute("mission-1", target, "mission:execute", "before-revocation");
    expect(before.ok).toBe(true);

    runtime.revokePrincipal(target.id, "org-a", admin);

    const after = runtime.authorizeAndExecute("mission-1", target, "mission:execute", "after-revocation");
    expect(after.ok).toBe(false);
    expect(after.code).toBe("AUTHORIZATION_DENIED");
    expect(after.detail).toBe("IDENTITY_REVOKED");
  });
});

describe("Test O - Organization isolation (POA-DEC-SEC-001 S16; POA-BLD-001 S15)", () => {
  it("a cross-organization revocation attempt is denied, mutates nothing, and does not touch the other organization's identity evidence chain", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    runtime.identity.registerOrganization("org-b", "Organization B");
    const targetA = runtime.identity.registerPrincipal("agent-a", "org-a", "execution-agent");
    const adminB = runtime.identity.registerPrincipal("admin-b", "org-b", "steward");

    // Org B's admin attempts to revoke Org A's principal.
    const crossOrgAttempt = runtime.revokePrincipal(targetA.id, "org-a", adminB);
    expect(crossOrgAttempt.ok).toBe(false);
    expect(crossOrgAttempt.code).toBe("ISOLATION_VIOLATION");
    expect(targetA.active).toBe(true); // unchanged

    const orgBChain = runtime.__unsafeGetMutableIdentityChainForAdversarialTesting("org-b");
    expect(orgBChain.length).toBe(0);
  });
});
