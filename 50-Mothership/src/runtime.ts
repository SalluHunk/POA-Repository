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
}
