/**
 * Independent Checkpoint / Witness (POA-BLD-001 S14; implements
 * POA-DEC-SEC-001 S14).
 *
 * TRUST BOUNDARY, STATED EXPLICITLY (per the brief's own S14 instruction):
 * this module's checkpoint store is a TEST DOUBLE, not a production-
 * independent witness. It happens to be a separate module-scoped map in
 * the same process. The property it demonstrates is real - detecting a
 * coherent rollback that an internal hash chain alone cannot catch - but
 * the ISOLATION (a party who cannot also alter the checkpoint) is not
 * actually enforced by process/privilege separation here. Do not read a
 * passing witness.test.ts as evidence of a production-independent trust
 * anchor. See the completion report's Gate H Treatment section.
 *
 * Architecturally, only two operations cross this boundary:
 * checkpoint() (write, called once per finalized mission) and
 * verifyAgainstCheckpoint() (read-only compare). The evidence module
 * (evidence.ts) has no import of, or access to, this module's internal
 * `checkpoints` map.
 */
import type { EvidenceEnvelope } from "@/evidence";

const checkpoints = new Map<string, string>();

export function computeHeadHash(chain: EvidenceEnvelope[]): string | null {
  if (chain.length === 0) return null;
  return chain[chain.length - 1].envelopeHash;
}

export function checkpoint(missionId: string, chain: EvidenceEnvelope[]): string | null {
  const head = computeHeadHash(chain);
  if (head !== null) checkpoints.set(missionId, head);
  return head;
}

export interface WitnessComparison {
  ok: boolean;
  checkpointedHead: string | null;
  currentHead: string | null;
  code: "NO_CHECKPOINT" | "MATCH" | "CHECKPOINT_MISMATCH";
}

export function verifyAgainstCheckpoint(missionId: string, chain: EvidenceEnvelope[]): WitnessComparison {
  const checkpointedHead = checkpoints.get(missionId) ?? null;
  const currentHead = computeHeadHash(chain);
  if (checkpointedHead === null) {
    return { ok: true, checkpointedHead, currentHead, code: "NO_CHECKPOINT" };
  }
  if (checkpointedHead !== currentHead) {
    return { ok: false, checkpointedHead, currentHead, code: "CHECKPOINT_MISMATCH" };
  }
  return { ok: true, checkpointedHead, currentHead, code: "MATCH" };
}

/** Test-only: clears witness state between test files so checkpoints don't leak across missions of the same id. */
export function __resetWitnessForTests(): void {
  checkpoints.clear();
}
