/**
 * Client-side mirror of the real runtime shapes exposed by
 * 50-Mothership/server/api.ts. This package has its own tsconfig/module
 * graph (Vite, not tsx + `@/` path aliases), so these are re-declared
 * rather than imported across package boundaries - kept intentionally
 * narrow, matching exactly what the API actually returns.
 *
 * ExecutionPrincipal never carries `keys` here: server/api.ts's
 * `projectPrincipal` strips private key material before any response
 * leaves the process, and this type must never imply otherwise.
 */

export type MissionState = "Created" | "Running" | "Succeeded" | "Failed" | "Closed";

export interface Mission {
  id: string;
  organizationId: string;
  state: MissionState;
  origin?: "fixture" | "operator";
}

export interface Organization {
  id: string;
  name: string;
}

export interface Principal {
  id: string;
  organizationId: string;
  role: string;
  active: boolean;
  engine: string;
}

export interface AuthorizationDecisionRecord {
  missionId: string;
  producerId: string;
  capability: string;
  reason: string;
  granted: boolean;
}

export interface EvidencePayload {
  who: string;
  what: string;
  why: string;
  when: string;
  result: string;
  mission: string;
  organization: string;
}

export interface EvidenceEnvelope {
  sequence: number;
  missionId: string;
  organizationId: string;
  producerId: string;
  authorityBearing: boolean;
  payload: EvidencePayload;
  payloadHash: string;
  prevHash: string | null;
  envelopeHash: string;
  signature: string | null;
}

export interface MissionResult {
  missionId: string;
  organizationId: string;
  state: MissionState;
  evidenceCount: number;
  headHash: string | null;
  chainVerified: boolean;
  witnessVerified: boolean;
}

/**
 * The distinction server/api.ts carries `witnessCode` specifically to
 * preserve (commit e3d9a65): NO_CHECKPOINT is an honest absence, never a
 * false pass. This type must never flatten it to a boolean.
 */
export type WitnessCode = "MATCH" | "MISMATCH" | "NO_CHECKPOINT";

export interface MissionDetail {
  mission: MissionResult;
  witnessCode: WitnessCode;
  origin: "fixture" | "operator";
}

export interface RuntimeResult {
  ok: boolean;
  code: string;
  detail?: string;
}
