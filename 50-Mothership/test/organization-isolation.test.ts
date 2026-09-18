/**
 * Test I - Organization crossing (POA-BLD-001 S15, S17).
 * Organization A's mission/evidence must never be readable, mutable, or
 * transitionable through an Organization B identity.
 */
import { describe, expect, it } from "vitest";
import { MothershipRuntime } from "@/runtime";

function setupTwoOrganizations() {
  const runtime = new MothershipRuntime();
  runtime.identity.registerOrganization("org-a", "Organization A");
  runtime.identity.registerOrganization("org-b", "Organization B");
  const principalA = runtime.identity.registerPrincipal("principal-a", "org-a", "execution-agent");
  const principalB = runtime.identity.registerPrincipal("principal-b", "org-b", "execution-agent");
  runtime.identity.grantCapability("principal-a", "mission:execute");
  runtime.identity.grantCapability("principal-b", "mission:execute");
  runtime.createMission("mission-a", "org-a");
  runtime.transitionMission("mission-a", "org-a", "Running", principalA);
  runtime.authorizeAndExecute("mission-a", principalA, "mission:execute", "own-action");
  return { runtime, principalA, principalB };
}

describe("Test I - Organization isolation (POA-BLD-001 S15)", () => {
  it("rejects Organization B reading Organization A's evidence", () => {
    const { runtime } = setupTwoOrganizations();
    const result = runtime.getEvidence("mission-a", "org-b");
    expect(Array.isArray(result)).toBe(false);
    if (!Array.isArray(result)) {
      expect(result.code).toBe("ISOLATION_VIOLATION");
    }
  });

  it("rejects Organization B transitioning Organization A's mission", () => {
    const { runtime, principalB } = setupTwoOrganizations();
    const result = runtime.transitionMission("mission-a", "org-b", "Succeeded", principalB);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ISOLATION_VIOLATION");
  });

  it("rejects Organization B's own principal acting on Organization A's mission even when directly targeted", () => {
    const { runtime, principalB } = setupTwoOrganizations();
    const result = runtime.authorizeAndExecute("mission-a", principalB, "mission:execute", "cross-org-attempt");
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ISOLATION_VIOLATION");
  });

  it("rejects Organization B reading Organization A's mission result", () => {
    const { runtime } = setupTwoOrganizations();
    const result = runtime.produceMissionResult("mission-a", "org-b");
    expect(result.ok).toBe(false);
    expect(result.code).toBe("ISOLATION_VIOLATION");
  });

  it("Organization A can still fully operate on its own mission (isolation is not a blanket denial)", () => {
    const { runtime, principalA } = setupTwoOrganizations();
    const result = runtime.getEvidence("mission-a", "org-a");
    expect(Array.isArray(result)).toBe(true);
    const transitionResult = runtime.transitionMission("mission-a", "org-a", "Succeeded", principalA);
    expect(transitionResult.ok).toBe(true);
  });
});
