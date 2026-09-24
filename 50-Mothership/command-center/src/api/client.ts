/**
 * Typed fetch wrapper over the real, unmodified Mothership API
 * (50-Mothership/server/api.ts, via server/http.ts's route table).
 * Every path/shape here matches an actually-implemented handler - nothing
 * here is speculative.
 */
import type {
  AuthorizationDecisionRecord,
  EvidenceEnvelope,
  Mission,
  MissionDetail,
  Organization,
  Principal,
  ProjectRegistry,
  RuntimeResult,
} from "./types";

const BASE = "/api";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  const body = (await res.json()) as T;
  if (!res.ok) throw new ApiError(res.status, body);
  return body;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  // authorizeAndExecute returns 200 for a real, honest DENIAL - callers
  // must read the response body's `ok`/`code`, never treat res.ok alone
  // as "the request succeeded" meaning "the action was authorized."
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`);
  }
}

export function listOrganizations(): Promise<{ organizations: Organization[] }> {
  return getJson("/organizations");
}

export function listMissions(organizationId: string): Promise<{ organizationId: string; missions: Mission[] }> {
  return getJson(`/organizations/${encodeURIComponent(organizationId)}/missions`);
}

export function listPrincipals(organizationId: string): Promise<{ organizationId: string; principals: Principal[] }> {
  return getJson(`/organizations/${encodeURIComponent(organizationId)}/principals`);
}

export function getCapabilityView(
  organizationId: string,
): Promise<{ organizationId: string; principals: (Principal & { capabilities: string[] })[]; decisions: AuthorizationDecisionRecord[] }> {
  return getJson(`/organizations/${encodeURIComponent(organizationId)}/capabilities`);
}

export function getMissionDetail(missionId: string, organizationId: string): Promise<MissionDetail> {
  return getJson(`/missions/${encodeURIComponent(missionId)}?org=${encodeURIComponent(organizationId)}`);
}

export function getMissionEvidence(
  missionId: string,
  organizationId: string,
): Promise<{ missionId: string; evidence: EvidenceEnvelope[] }> {
  return getJson(`/missions/${encodeURIComponent(missionId)}/evidence?org=${encodeURIComponent(organizationId)}`);
}

export function verifyMission(
  missionId: string,
  organizationId: string,
): Promise<{ missionId: string; chain: { ok: boolean }; witness: { ok: boolean; code: string } }> {
  return getJson(`/missions/${encodeURIComponent(missionId)}/verify?org=${encodeURIComponent(organizationId)}`);
}

export function transitionMission(
  missionId: string,
  organizationId: string,
  to: string,
  principalId: string,
): Promise<RuntimeResult> {
  return postJson(`/missions/${encodeURIComponent(missionId)}/transition`, { organizationId, to, principalId });
}

export function authorizeAndExecute(
  missionId: string,
  organizationId: string,
  principalId: string,
  capability: string,
  action: string,
): Promise<RuntimeResult> {
  return postJson(`/missions/${encodeURIComponent(missionId)}/authorize`, {
    organizationId,
    principalId,
    capability,
    action,
  });
}

export function checkpointMission(
  missionId: string,
  organizationId: string,
): Promise<{ missionId: string; headHash: string | null }> {
  return postJson(`/missions/${encodeURIComponent(missionId)}/checkpoint`, { organizationId });
}

// Read-only; not organization-scoped (server/api.ts: repository records are
// never hung off the fictional seed organization). A 503
// REPOSITORY_RECORDS_UNAVAILABLE surfaces as ApiError with the server's
// { ok, code, detail } body.
export function getProjectRegistry(): Promise<ProjectRegistry> {
  return getJson("/repository/project-registry");
}
