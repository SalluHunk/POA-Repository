/**
 * Evidence Integrity Kernel (POA-BLD-001 S11-S13; implements
 * POA-DEC-SEC-001 S7-S12).
 *
 * Canonical Evidence Envelope -> Payload Hash -> Identity-bound Signature
 * (authority-bearing evidence only) -> Ordered Integrity Relationship.
 *
 * The "Ordered Integrity Relationship" here is a per-mission prevHash chain
 * bound INSIDE the signed envelope, distinct from git's own commit chain
 * (POA-DEC-SEC-001 S4 Q4: git's chain is reused only for evidence that
 * reaches committed state; this in-process evidence never does, so a
 * per-mission event hash chain is the mechanism that actually makes
 * reordering/interior-deletion/replay detectable at the evidence-item
 * level - this is a clarification of S4 Q4's "reuse, don't rebuild"
 * finding, not a departure from it: nothing here duplicates git's own
 * commit-chain purpose, which remains untouched).
 */
import { canonicalize } from "@/canonicalize";
import { sha256Hex, signHex, verifyHex } from "@/crypto";
import type { ExecutionPrincipal } from "@/identity";

export interface EvidencePayload {
  who: string;
  what: string;
  why: string;
  when: string; // diagnostic only, never integrity-bearing (POA-DEC-SEC-001 S12)
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

type EnvelopeCore = Omit<EvidenceEnvelope, "envelopeHash" | "signature">;

function envelopeSigningInput(e: EnvelopeCore): string {
  return canonicalize({
    sequence: e.sequence,
    missionId: e.missionId,
    organizationId: e.organizationId,
    producerId: e.producerId,
    authorityBearing: e.authorityBearing,
    payloadHash: e.payloadHash,
    prevHash: e.prevHash,
  });
}

export function createEnvelope(
  sequence: number,
  missionId: string,
  organizationId: string,
  producer: ExecutionPrincipal,
  authorityBearing: boolean,
  payload: EvidencePayload,
  prevHash: string | null,
): EvidenceEnvelope {
  const payloadHash = sha256Hex(canonicalize(payload));
  const core: EnvelopeCore = {
    sequence,
    missionId,
    organizationId,
    producerId: producer.id,
    authorityBearing,
    payload,
    payloadHash,
    prevHash,
  };
  const envelopeHash = sha256Hex(envelopeSigningInput(core));
  const signature = authorityBearing ? signHex(producer.keys.privateKey, envelopeHash) : null;
  return { ...core, envelopeHash, signature };
}

export type VerificationFailureCode =
  | "MISSION_MISMATCH"
  | "SEQUENCE_MISMATCH"
  | "CHAIN_BROKEN"
  | "PAYLOAD_HASH_MISMATCH"
  | "ENVELOPE_HASH_MISMATCH"
  | "SIGNATURE_INVALID";

export interface VerificationResult {
  ok: boolean;
  index: number;
  code?: VerificationFailureCode;
  detail?: string;
}

/**
 * Independent Verification (POA-DEC-SEC-001 S15): walks the chain from the
 * genesis entry, recomputing every hash and re-checking every signature -
 * never trusts a stored hash/signature at face value.
 */
export function verifyChain(
  missionId: string,
  chain: EvidenceEnvelope[],
  resolvePrincipal: (id: string) => ExecutionPrincipal | undefined,
): VerificationResult {
  let expectedPrevHash: string | null = null;
  for (let i = 0; i < chain.length; i++) {
    const e = chain[i];
    if (e.missionId !== missionId) {
      return { ok: false, index: i, code: "MISSION_MISMATCH", detail: `evidence[${i}] belongs to mission ${e.missionId}, not ${missionId}` };
    }
    if (e.sequence !== i) {
      return { ok: false, index: i, code: "SEQUENCE_MISMATCH", detail: `evidence[${i}] declares sequence ${e.sequence}, expected ${i}` };
    }
    if (e.prevHash !== expectedPrevHash) {
      return { ok: false, index: i, code: "CHAIN_BROKEN", detail: `evidence[${i}] prevHash does not match its predecessor's envelopeHash` };
    }
    const recomputedPayloadHash = sha256Hex(canonicalize(e.payload));
    if (recomputedPayloadHash !== e.payloadHash) {
      return { ok: false, index: i, code: "PAYLOAD_HASH_MISMATCH", detail: `evidence[${i}] payload does not match its stored hash` };
    }
    const recomputedEnvelopeHash = sha256Hex(envelopeSigningInput(e));
    if (recomputedEnvelopeHash !== e.envelopeHash) {
      return { ok: false, index: i, code: "ENVELOPE_HASH_MISMATCH", detail: `evidence[${i}] envelope hash does not match its own fields` };
    }
    if (e.authorityBearing) {
      const principal = resolvePrincipal(e.producerId);
      if (!principal || !e.signature || !verifyHex(principal.keys.publicKey, e.envelopeHash, e.signature)) {
        return { ok: false, index: i, code: "SIGNATURE_INVALID", detail: `evidence[${i}] signature does not verify against claimed producer ${e.producerId}` };
      }
    }
    expectedPrevHash = e.envelopeHash;
  }
  return { ok: true, index: chain.length };
}
