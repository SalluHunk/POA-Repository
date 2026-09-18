/**
 * Happy-path end-to-end mission lifecycle (POA-BLD-001 S6), invalid
 * mission-transition rejection (S9), and capability enforcement including
 * Test H - Capability bypass (S17).
 */
import { describe, expect, it } from "vitest";
import { MothershipRuntime } from "@/runtime";

describe("mission lifecycle - happy path (POA-BLD-001 S6)", () => {
  it("walks Created -> Identity -> Capability -> Authorize -> Execute -> Evidence -> Integrity -> Persist -> Checkpoint -> Retrieve -> Verify -> Result -> Closed", () => {
    const runtime = new MothershipRuntime();

    // Mission Created + Identity Established
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtime.identity.grantCapability("principal-1", "mission:execute");
    const mission = runtime.createMission("mission-1", "org-a");
    expect(mission.state).toBe("Created");

    // Running
    const toRunning = runtime.transitionMission("mission-1", "org-a", "Running", principal);
    expect(toRunning.ok).toBe(true);

    // Capability Evaluated -> Action Authorized -> Action Executed -> Evidence Created/Protected/Persisted
    const action = runtime.authorizeAndExecute("mission-1", principal, "mission:execute", "materialize-artifact");
    expect(action).toEqual({ ok: true, code: "EXECUTED" });

    // Succeeded
    const toSucceeded = runtime.transitionMission("mission-1", "org-a", "Succeeded", principal);
    expect(toSucceeded.ok).toBe(true);

    // Checkpoint / Witness Created
    const headAtCheckpoint = runtime.checkpointMission("mission-1");
    expect(headAtCheckpoint).not.toBeNull();

    // Evidence Retrieved
    const evidence = runtime.getEvidence("mission-1", "org-a");
    expect(Array.isArray(evidence)).toBe(true);
    if (Array.isArray(evidence)) {
      expect(evidence.length).toBeGreaterThan(0);
    }

    // Evidence Verified
    const { chain, witness } = runtime.verifyMission("mission-1");
    expect(chain.ok).toBe(true);
    expect(witness.ok).toBe(true);

    // Mission Result Produced
    const outcome = runtime.produceMissionResult("mission-1", "org-a");
    expect(outcome.ok).toBe(true);
    expect(outcome.result?.chainVerified).toBe(true);
    expect(outcome.result?.witnessVerified).toBe(true);

    // Mission Closed
    const toClosed = runtime.transitionMission("mission-1", "org-a", "Closed", principal);
    expect(toClosed.ok).toBe(true);
    const finalResult = runtime.produceMissionResult("mission-1", "org-a");
    expect(finalResult.result?.state).toBe("Closed");
  });
});

describe("mission lifecycle - invalid transitions must not silently succeed (POA-BLD-001 S9)", () => {
  function setup() {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtime.createMission("mission-1", "org-a");
    return { runtime, principal };
  }

  it("rejects Closed -> Running", () => {
    const { runtime, principal } = setup();
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    runtime.transitionMission("mission-1", "org-a", "Succeeded", principal);
    runtime.transitionMission("mission-1", "org-a", "Closed", principal);
    const result = runtime.transitionMission("mission-1", "org-a", "Running", principal);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("INVALID_TRANSITION");
  });

  it("rejects Succeeded -> Running", () => {
    const { runtime, principal } = setup();
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    runtime.transitionMission("mission-1", "org-a", "Succeeded", principal);
    const result = runtime.transitionMission("mission-1", "org-a", "Running", principal);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("INVALID_TRANSITION");
  });

  it("rejects Failed -> Running", () => {
    const { runtime, principal } = setup();
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    runtime.transitionMission("mission-1", "org-a", "Failed", principal);
    const result = runtime.transitionMission("mission-1", "org-a", "Running", principal);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("INVALID_TRANSITION");
  });

  it("still records an evidence entry for a rejected transition attempt (S9: 'the lifecycle transition itself must generate evidence')", () => {
    const { runtime, principal } = setup();
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    runtime.transitionMission("mission-1", "org-a", "Succeeded", principal);
    runtime.transitionMission("mission-1", "org-a", "Closed", principal);
    const before = (runtime.getEvidence("mission-1", "org-a") as unknown[]).length;
    runtime.transitionMission("mission-1", "org-a", "Running", principal);
    const after = (runtime.getEvidence("mission-1", "org-a") as unknown[]).length;
    expect(after).toBe(before + 1);
  });
});

describe("Test H - Capability bypass (POA-BLD-001 S17)", () => {
  it("denies an unauthorized action and does not execute it", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    // Deliberately no grantCapability call.
    const mission = runtime.createMission("mission-1", "org-a");
    runtime.transitionMission("mission-1", "org-a", "Running", principal);

    const result = runtime.authorizeAndExecute("mission-1", principal, "mission:execute", "materialize-artifact");
    expect(result.ok).toBe(false);
    expect(result.code).toBe("AUTHORIZATION_DENIED");
    expect(result.detail).toBe("CAPABILITY_NOT_GRANTED");

    const evidence = runtime.getEvidence("mission-1", "org-a");
    expect(Array.isArray(evidence)).toBe(true);
    if (Array.isArray(evidence)) {
      const executed = evidence.filter((e) => e.payload.what === "ACTION_EXECUTED");
      expect(executed).toHaveLength(0); // rejected request must not silently execute
    }
    expect(mission.state).toBe("Running");
  });

  it("denies an action from a revoked identity (key lifecycle, POA-DEC-SEC-001 S16)", () => {
    const runtime = new MothershipRuntime();
    runtime.identity.registerOrganization("org-a", "Organization A");
    const principal = runtime.identity.registerPrincipal("principal-1", "org-a", "execution-agent");
    runtime.identity.grantCapability("principal-1", "mission:execute");
    runtime.identity.revokePrincipal("principal-1");
    runtime.createMission("mission-1", "org-a");
    runtime.transitionMission("mission-1", "org-a", "Running", principal);

    const result = runtime.authorizeAndExecute("mission-1", principal, "mission:execute", "materialize-artifact");
    expect(result.ok).toBe(false);
    expect(result.detail).toBe("IDENTITY_REVOKED");
  });
});
