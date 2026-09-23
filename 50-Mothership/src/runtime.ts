/**
 * Mothership runtime orchestrator (POA-BLD-001 S2, S5, S6, S15).
 * Ties Identity + Capability + Mission Lifecycle + Evidence + Witness into
 * one mission flow, enforcing Organization Isolation at every read/write
 * boundary (S15: Organization A's mission/evidence must never be
 * reachable through an Organization B request).
 */
import { IdentityRegistry, evaluateAuthorization, type ExecutionPrincipal } from "@/identity";
import { createEnvelope, verifyChain, type EvidenceEnvelope, type EvidencePayload, type VerificationResult } from "@/evidence";
import { transition, type Mission, type MissionState } from "@/mission";
import { checkpoint, verifyAgainstCheckpoint, computeHeadHash, type WitnessComparison } from "@/witness";

export interface RuntimeResult {
  ok: boolean;
  code: string;
  detail?: string;
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

export class MothershipRuntime {
  readonly identity = new IdentityRegistry();
  private missions = new Map<string, Mission>();
  private evidenceByMission = new Map<string, EvidenceEnvelope[]>();

  createMission(missionId: string, organizationId: string): Mission {
    if (!this.identity.getOrganization(organizationId)) {
      throw new Error(`Unknown organization: ${organizationId}`);
    }
    const mission: Mission = { id: missionId, organizationId, state: "Created" };
    this.missions.set(missionId, mission);
    this.evidenceByMission.set(missionId, []);
    return mission;
  }

  /**
   * Read-only enumeration for the Control Panel (POA-BLD-002 S5B).
   * Scoped to one organization - never returns another organization's
   * missions, preserving the S15 isolation boundary.
   */
  listMissions(organizationId: string): Mission[] {
    return [...this.missions.values()].filter((m) => m.organizationId === organizationId);
  }

  private appendEvidence(
    mission: Mission,
    producer: ExecutionPrincipal,
    authorityBearing: boolean,
    what: string,
    why: string,
    result: string,
  ): EvidenceEnvelope {
    const chain = this.evidenceByMission.get(mission.id)!;
    const payload: EvidencePayload = {
      who: producer.id,
      what,
      why,
      when: new Date().toISOString(),
      result,
      mission: mission.id,
      organization: mission.organizationId,
    };
    const prevHash = chain.length > 0 ? chain[chain.length - 1].envelopeHash : null;
    const envelope = createEnvelope(chain.length, mission.id, mission.organizationId, producer, authorityBearing, payload, prevHash);
    chain.push(envelope);
    return envelope;
  }

  /** Organization Isolation enforcement point (POA-BLD-001 S15, Test I). */
  private requireSameOrganization(mission: Mission, requestingOrganizationId: string): RuntimeResult | null {
    if (mission.organizationId !== requestingOrganizationId) {
      return {
        ok: false,
        code: "ISOLATION_VIOLATION",
        detail: `organization ${requestingOrganizationId} attempted to access mission ${mission.id} owned by ${mission.organizationId}`,
      };
    }
    return null;
  }

  getEvidence(missionId: string, requestingOrganizationId: string): EvidenceEnvelope[] | RuntimeResult {
    const mission = this.missions.get(missionId);
    if (!mission) return { ok: false, code: "UNKNOWN_MISSION" };
    const violation = this.requireSameOrganization(mission, requestingOrganizationId);
    if (violation) return violation;
    return this.evidenceByMission.get(missionId)!;
  }

  transitionMission(missionId: string, requestingOrganizationId: string, to: MissionState, producer: ExecutionPrincipal): RuntimeResult {
    const mission = this.missions.get(missionId);
    if (!mission) return { ok: false, code: "UNKNOWN_MISSION" };
    const violation = this.requireSameOrganization(mission, requestingOrganizationId);
    if (violation) return violation;
    const result = transition(mission, to);
    this.appendEvidence(mission, producer, false, "MISSION_TRANSITION", `${result.from}->${result.to}`, result.code);
    if (!result.ok) {
      return { ok: false, code: "INVALID_TRANSITION", detail: `${result.from} -> ${result.to} is not a permitted transition` };
    }
    return { ok: true, code: "TRANSITIONED" };
  }

  /** Capability Evaluated -> Action Authorized -> Action Executed (POA-BLD-001 S6, S8). */
  authorizeAndExecute(missionId: string, producer: ExecutionPrincipal, capability: string, action: string): RuntimeResult {
    const mission = this.missions.get(missionId);
    if (!mission) return { ok: false, code: "UNKNOWN_MISSION" };
    const violation = this.requireSameOrganization(mission, producer.organizationId);
    if (violation) return violation;

    const decision = evaluateAuthorization(this.identity, producer.id, mission.organizationId, capability);
    this.appendEvidence(mission, producer, true, "AUTHORIZATION_DECISION", capability, decision.reason);
    if (!decision.granted) {
      return { ok: false, code: "AUTHORIZATION_DENIED", detail: decision.reason };
    }

    this.appendEvidence(mission, producer, true, "ACTION_EXECUTED", action, "EXECUTED");
    return { ok: true, code: "EXECUTED" };
  }

  checkpointMission(missionId: string): string | null {
    const chain = this.evidenceByMission.get(missionId);
    if (!chain) return null;
    return checkpoint(missionId, chain);
  }

  verifyMission(missionId: string): { chain: VerificationResult; witness: WitnessComparison } {
    const chain = this.evidenceByMission.get(missionId) ?? [];
    const chainResult = verifyChain(missionId, chain, (id) => this.identity.getPrincipal(id));
    const witnessResult = verifyAgainstCheckpoint(missionId, chain);
    return { chain: chainResult, witness: witnessResult };
  }

  produceMissionResult(missionId: string, requestingOrganizationId: string): RuntimeResult & { result?: MissionResult } {
    const mission = this.missions.get(missionId);
    if (!mission) return { ok: false, code: "UNKNOWN_MISSION" };
    const violation = this.requireSameOrganization(mission, requestingOrganizationId);
    if (violation) return violation;
    const chain = this.evidenceByMission.get(missionId)!;
    const { chain: chainResult, witness } = this.verifyMission(missionId);
    const result: MissionResult = {
      missionId,
      organizationId: mission.organizationId,
      state: mission.state,
      evidenceCount: chain.length,
      headHash: computeHeadHash(chain),
      chainVerified: chainResult.ok,
      witnessVerified: witness.ok,
    };
    return { ok: true, code: "RESULT_PRODUCED", result };
  }

  /**
   * Adversarial-testing hook ONLY (POA-BLD-001 S17-S18): grants direct
   * mutation access to a mission's raw evidence array, simulating an
   * attacker who has already compromised storage/service/repository
   * access. Never used by the ordinary mission-lifecycle path above.
   */
  __unsafeGetMutableChainForAdversarialTesting(missionId: string): EvidenceEnvelope[] {
    return this.evidenceByMission.get(missionId)!;
  }

  // --- Key-Lifecycle Evidence (POA-DEC-SEC-001 S16; Phase 3 "Authorize
  // Key-Lifecycle Evidence") -------------------------------------------
  //
  // Revocation is a principal-lifecycle event, not a mission event, so it
  // cannot live in evidenceByMission - EvidenceEnvelope.missionId would
  // then falsely claim membership in a real mission (Data Integrity Rule).
  // This reuses the exact same envelope/hash/signature/chain mechanism
  // from evidence.ts, completely unmodified, keyed by organization instead
  // of mission. Deliberately NOT wired to witness.ts/checkpoint - that
  // remains out of this phase's authorized scope.

  private identityEvidenceByOrganization = new Map<string, EvidenceEnvelope[]>();

  /** Reserved chain-scope label - distinguishable from any real mission id (never collides: real mission ids come from createMission's caller-supplied string, this format is reserved). */
  private identityScope(organizationId: string): string {
    return `__identity__:${organizationId}`;
  }

  private appendIdentityEvidence(
    organizationId: string,
    producer: ExecutionPrincipal,
    authorityBearing: boolean,
    what: string,
    why: string,
    result: string,
  ): EvidenceEnvelope {
    const chain = this.identityEvidenceByOrganization.get(organizationId) ?? [];
    this.identityEvidenceByOrganization.set(organizationId, chain);
    const payload: EvidencePayload = {
      who: producer.id,
      what,
      why,
      when: new Date().toISOString(),
      result,
      mission: this.identityScope(organizationId),
      organization: organizationId,
    };
    const prevHash = chain.length > 0 ? chain[chain.length - 1].envelopeHash : null;
    const envelope = createEnvelope(chain.length, this.identityScope(organizationId), organizationId, producer, authorityBearing, payload, prevHash);
    chain.push(envelope);
    return envelope;
  }

  /**
   * Revocation requested -> revocation act recorded as evidence ->
   * principal becomes inactive -> subsequent authorization attempts are
   * evaluated against the new state. Sequence enforced by construction:
   * the evidence is appended BEFORE identity.revokePrincipal() mutates
   * anything, never after. authorityBearing=true - revocation determines
   * the outcome of every future authorization check against this
   * principal, exactly the category of event this model already signs
   * (compare AUTHORIZATION_DECISION/ACTION_EXECUTED, both signed; only
   * MISSION_TRANSITION, a bookkeeping-only event, is not).
   */
  revokePrincipal(targetPrincipalId: string, organizationId: string, revoker: ExecutionPrincipal): RuntimeResult {
    const target = this.identity.getPrincipal(targetPrincipalId);
    if (!target) return { ok: false, code: "UNKNOWN_IDENTITY" };
    if (target.organizationId !== organizationId || revoker.organizationId !== organizationId) {
      return {
        ok: false,
        code: "ISOLATION_VIOLATION",
        detail: `organization ${organizationId} cannot revoke a principal outside its own organization`,
      };
    }
    this.appendIdentityEvidence(organizationId, revoker, true, "PRINCIPAL_REVOKED", targetPrincipalId, "ACTIVE->REVOKED");
    this.identity.revokePrincipal(targetPrincipalId);
    return { ok: true, code: "REVOKED" };
  }

  /** Read-only enumeration, organization-isolated like getEvidence() above. */
  getIdentityEvidence(organizationId: string, requestingOrganizationId: string): EvidenceEnvelope[] | RuntimeResult {
    if (organizationId !== requestingOrganizationId) {
      return {
        ok: false,
        code: "ISOLATION_VIOLATION",
        detail: `organization ${requestingOrganizationId} attempted to read organization ${organizationId}'s identity evidence`,
      };
    }
    return this.identityEvidenceByOrganization.get(organizationId) ?? [];
  }

  /** Adversarial-testing hook ONLY - mirrors __unsafeGetMutableChainForAdversarialTesting above, for the identity-scoped chain. */
  __unsafeGetMutableIdentityChainForAdversarialTesting(organizationId: string): EvidenceEnvelope[] {
    return this.identityEvidenceByOrganization.get(organizationId) ?? [];
  }
}
