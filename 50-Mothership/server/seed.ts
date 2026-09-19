/**
 * Demo/fixture data for the Control Panel (POA-BLD-002 S7, S20).
 *
 * Every entity created here goes through the REAL Mothership runtime -
 * real identity registration, real capability grants, real mission
 * transitions, real evidence envelopes, real signatures, real checkpoint.
 * "TEST FIXTURE" describes WHO created these missions (this seed script,
 * at startup) not WHAT they are made of - they are exactly as real as any
 * mission an operator creates later through the console. The Control
 * Panel labels them "TEST FIXTURE" purely so an operator is never confused
 * about which missions existed before they opened the console.
 *
 * Includes the POA-BLD-002 S20 "Important Test" mission (full lifecycle
 * through Closed + checkpoint + verification), a second organization for
 * the S10 isolation demonstration, an open mission for operators to drive
 * interactively, and one deliberately denied action so the S5E "why was
 * this denied?" view has real evidence to show instead of a placeholder.
 */
import type { MothershipState } from "./state.ts";

export function seedDemoData(state: MothershipState): void {
  const { runtime, missionOrigin } = state;
  const { identity } = runtime;

  // --- Organizations -----------------------------------------------------
  identity.registerOrganization("org-paravyoma", "Paravyoma (Demo Organization)");
  identity.registerOrganization("org-beta", "Organization Beta (Isolation Demo)");

  // --- Identities ----------------------------------------------------------
  const agent = identity.registerPrincipal("agent-materializer", "org-paravyoma", "execution-agent", "claude");
  identity.grantCapability("agent-materializer", "mission:execute");

  // Deliberately no capability grants - used to demonstrate a genuine
  // AUTHORIZATION_DENIED decision below (POA-BLD-002 S5E).
  const unprivileged = identity.registerPrincipal("agent-unprivileged", "org-paravyoma", "execution-agent", "claude");

  const betaAgent = identity.registerPrincipal("agent-beta", "org-beta", "execution-agent", "claude");
  identity.grantCapability("agent-beta", "mission:execute");

  // --- Mission 1: full lifecycle through Closed (POA-BLD-002 S20) --------
  runtime.createMission("mission-demo-001", "org-paravyoma");
  missionOrigin.set("mission-demo-001", "fixture");
  runtime.transitionMission("mission-demo-001", "org-paravyoma", "Running", agent);
  runtime.authorizeAndExecute("mission-demo-001", agent, "mission:execute", "materialize-control-panel-artifact");
  runtime.transitionMission("mission-demo-001", "org-paravyoma", "Succeeded", agent);
  runtime.transitionMission("mission-demo-001", "org-paravyoma", "Closed", agent);
  // Checkpoint AFTER the final transition: checkpointing earlier would be
  // stale the moment the Closed transition appends its own evidence entry,
  // making the witness comparison report a spurious CHECKPOINT_MISMATCH
  // (verified by hitting exactly this bug while building the seed - see
  // 40-Runtime/POA-BLD-002-COMPLETION-REPORT.md, Observations).
  runtime.checkpointMission("mission-demo-001");

  // --- Mission 2: left open for operator interaction (POA-BLD-002 S8) ----
  runtime.createMission("mission-demo-002", "org-paravyoma");
  missionOrigin.set("mission-demo-002", "fixture");

  // --- Mission 3: a genuine denied authorization (POA-BLD-002 S5E) -------
  runtime.createMission("mission-demo-003", "org-paravyoma");
  missionOrigin.set("mission-demo-003", "fixture");
  runtime.transitionMission("mission-demo-003", "org-paravyoma", "Running", unprivileged);
  runtime.authorizeAndExecute("mission-demo-003", unprivileged, "mission:execute", "attempt-materialize-without-grant");

  // --- Mission 4: Organization Beta, for the S10 isolation demo ----------
  runtime.createMission("mission-beta-001", "org-beta");
  missionOrigin.set("mission-beta-001", "fixture");
  runtime.transitionMission("mission-beta-001", "org-beta", "Running", betaAgent);
  runtime.authorizeAndExecute("mission-beta-001", betaAgent, "mission:execute", "beta-own-action");
}
