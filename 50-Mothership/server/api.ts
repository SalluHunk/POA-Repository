/**
 * HTTP API surface for the Mothership Control Panel (POA-BLD-002).
 *
 * Two rules govern every handler in this file:
 *
 * 1. Organization isolation (POA-BLD-001 S15) must hold at the HTTP
 *    boundary exactly as it holds inside the runtime. `runtime.ts`'s
 *    `getEvidence` / `transitionMission` / `authorizeAndExecute` /
 *    `produceMissionResult` already guard themselves - this file must not
 *    bypass that. `checkpointMission` and `verifyMission`, however, take
 *    no requesting-organization parameter at all (POA-BLD-001 never needed
 *    one - only test code called them, always from the owning organization's
 *    own context). Exposing them directly over HTTP would let Organization
 *    B read Organization A's integrity state or mutate Organization A's
 *    witness checkpoint. `assertMissionOwnedBy` closes that gap HERE,
 *    without changing either method's signature (which would break
 *    witness.test.ts's and lifecycle.test.ts's existing call sites) - see
 *    40-Runtime/POA-BLD-002-COMPLETION-REPORT.md, "Runtime limitation"
 *    observations.
 *
 * 2. No response body may ever contain an ExecutionPrincipal's `keys`
 *    (private Ed25519 key material). Every principal that leaves this
 *    file goes through `projectPrincipal`, never a raw spread/stringify.
 */
import type { MothershipState } from "./state.ts";
import type { MissionState } from "@/mission";
import type { ExecutionPrincipal } from "@/identity";

export interface ApiResponse {
  status: number;
  body: unknown;
}

function ok(body: unknown, status = 200): ApiResponse {
  return { status, body };
}

function err(status: number, code: string, detail?: string): ApiResponse {
  return { status, body: { ok: false, code, detail } };
}

/** The only shape an ExecutionPrincipal is ever allowed to leave this process in. */
function projectPrincipal(p: ExecutionPrincipal) {
  return { id: p.id, organizationId: p.organizationId, role: p.role, active: p.active, engine: p.engine };
}

/**
 * Ownership gate for the two runtime methods that don't take a requesting
 * organization. Reuses `getEvidence`'s existing, already-tested isolation
 * check as the source of truth for "does this organization own this
 * mission" rather than re-implementing that logic.
 */
function assertMissionOwnedBy(state: MothershipState, missionId: string, organizationId: string): ApiResponse | null {
  const result = state.runtime.getEvidence(missionId, organizationId);
  if (!Array.isArray(result)) {
    return err(result.code === "UNKNOWN_MISSION" ? 404 : 403, result.code, result.detail);
  }
  return null;
}

export function getHealth(): ApiResponse {
  return ok({
    ok: true,
    status: "RUNNING",
    runtime: "poa-mothership-bld-001",
    independentWitness: "TEST_DOUBLE_ONLY",
  });
}

export function listOrganizations(state: MothershipState): ApiResponse {
  return ok({ organizations: state.runtime.identity.listOrganizations() });
}

export function listPrincipals(state: MothershipState, organizationId: string): ApiResponse {
  if (!state.runtime.identity.getOrganization(organizationId)) {
    return err(404, "UNKNOWN_ORGANIZATION");
  }
  const principals = state.runtime.identity.listPrincipals(organizationId).map(projectPrincipal);
  return ok({ organizationId, principals });
}

export function getCapabilityView(state: MothershipState, organizationId: string): ApiResponse {
  if (!state.runtime.identity.getOrganization(organizationId)) {
    return err(404, "UNKNOWN_ORGANIZATION");
  }
  const principals = state.runtime.identity.listPrincipals(organizationId).map((p) => ({
    ...projectPrincipal(p),
    capabilities: state.runtime.identity.listCapabilities(p.id),
  }));

  // Authorization-decision history, derived entirely from real evidence
  // already recorded by runtime.ts's authorizeAndExecute (POA-BLD-002 S5E,
  // S6) - never fabricated.
  const decisions: Array<{
    missionId: string;
    producerId: string;
    capability: string;
    reason: string;
    granted: boolean;
  }> = [];
  for (const mission of state.runtime.listMissions(organizationId)) {
    const evidence = state.runtime.getEvidence(mission.id, organizationId);
    if (!Array.isArray(evidence)) continue;
    for (const e of evidence) {
      if (e.payload.what !== "AUTHORIZATION_DECISION") continue;
      decisions.push({
        missionId: mission.id,
        producerId: e.producerId,
        capability: e.payload.why,
        reason: e.payload.result,
        granted: e.payload.result === "AUTHORIZED",
      });
    }
  }

  return ok({ organizationId, principals, decisions });
}

export function listMissions(state: MothershipState, organizationId: string): ApiResponse {
  if (!state.runtime.identity.getOrganization(organizationId)) {
    return err(404, "UNKNOWN_ORGANIZATION");
  }
  const missions = state.runtime.listMissions(organizationId).map((m) => ({
    ...m,
    origin: state.missionOrigin.get(m.id) ?? "operator",
  }));
  return ok({ organizationId, missions });
}

export function getMissionDetail(state: MothershipState, missionId: string, organizationId: string): ApiResponse {
  const violation = assertMissionOwnedBy(state, missionId, organizationId);
  if (violation) return violation;

  const outcome = state.runtime.produceMissionResult(missionId, organizationId);
  if (!outcome.ok || !outcome.result) {
    return err(404, outcome.code, outcome.detail);
  }
  return ok({
    mission: outcome.result,
    origin: state.missionOrigin.get(missionId) ?? "operator",
  });
}

export function getMissionEvidence(state: MothershipState, missionId: string, organizationId: string): ApiResponse {
  const evidence = state.runtime.getEvidence(missionId, organizationId);
  if (!Array.isArray(evidence)) {
    return err(evidence.code === "UNKNOWN_MISSION" ? 404 : 403, evidence.code, evidence.detail);
  }
  return ok({ missionId, evidence });
}

export function verifyMission(state: MothershipState, missionId: string, organizationId: string): ApiResponse {
  const violation = assertMissionOwnedBy(state, missionId, organizationId);
  if (violation) return violation;
  const { chain, witness } = state.runtime.verifyMission(missionId);
  return ok({ missionId, chain, witness });
}

export function createMission(state: MothershipState, missionId: string, organizationId: string): ApiResponse {
  if (!missionId || !organizationId) return err(400, "MISSING_FIELDS", "missionId and organizationId are required");
  if (!state.runtime.identity.getOrganization(organizationId)) {
    return err(404, "UNKNOWN_ORGANIZATION");
  }
  if (state.runtime.listMissions(organizationId).some((m) => m.id === missionId)) {
    return err(409, "MISSION_ALREADY_EXISTS");
  }
  const mission = state.runtime.createMission(missionId, organizationId);
  state.missionOrigin.set(missionId, "operator");
  return ok({ mission, origin: "operator" }, 201);
}

export function transitionMission(
  state: MothershipState,
  missionId: string,
  organizationId: string,
  to: MissionState,
  principalId: string,
): ApiResponse {
  const principal = state.runtime.identity.getPrincipal(principalId);
  if (!principal) return err(400, "UNKNOWN_PRINCIPAL");
  const result = state.runtime.transitionMission(missionId, organizationId, to, principal);
  if (!result.ok) {
    return err(result.code === "UNKNOWN_MISSION" ? 404 : result.code === "ISOLATION_VIOLATION" ? 403 : 422, result.code, result.detail);
  }
  return ok(result);
}

export function authorizeAndExecute(
  state: MothershipState,
  missionId: string,
  organizationId: string,
  principalId: string,
  capability: string,
  action: string,
): ApiResponse {
  const principal = state.runtime.identity.getPrincipal(principalId);
  if (!principal) return err(400, "UNKNOWN_PRINCIPAL");
  if (principal.organizationId !== organizationId) {
    return err(403, "ISOLATION_VIOLATION", "principal does not belong to the requesting organization");
  }
  const result = state.runtime.authorizeAndExecute(missionId, principal, capability, action);
  const status = result.ok ? 200 : result.code === "UNKNOWN_MISSION" ? 404 : result.code === "ISOLATION_VIOLATION" ? 403 : 200;
  return { status, body: result };
}

export function checkpointMission(state: MothershipState, missionId: string, organizationId: string): ApiResponse {
  const violation = assertMissionOwnedBy(state, missionId, organizationId);
  if (violation) return violation;
  const headHash = state.runtime.checkpointMission(missionId);
  return ok({ missionId, headHash });
}
