/**
 * Witness Submission Authentication - Class A (Phase 3 "Witness Submission
 * Authentication Ruling"): payload-level cryptographic authentication of a
 * checkpoint SUBMISSION by a dedicated Witness Submission Authority
 * credential, independently controlled from the repository-write authority.
 *
 * What this establishes, and nothing more: that a submitted checkpoint
 * originated from the holder of the Submission Authority's private key.
 * Authenticated checkpoint != truthful checkpoint - it says nothing about
 * Evidence Correctness, Evidence Authority, the truth of the checkpointed
 * state, or the correctness of Steward decisions (POA-DEC-SEC-001 S25.4).
 *
 * The signature exists ONLY at the submission boundary. It is verified by
 * OutOfRepoWitnessLog.submit() and then discarded - it is never persisted
 * in the Witness record, which stays scope + checkpointHash + marker.
 *
 * Nothing new is invented cryptographically: key generation, hashing,
 * canonicalization and sign/verify all reuse the exact primitives
 * evidence.ts already uses (generateIdentityKeyPair / sha256Hex /
 * canonicalize / signHex / verifyHex), with the same hash-then-sign shape
 * as an evidence envelope.
 *
 * Deliberately NOT here: revocation, rotation, retirement, or custody of
 * this credential. The existing POA key-lifecycle mechanism (S16 +
 * runtime.revokePrincipal's evidenced revocation) lives on the
 * repository-write side, so reusing it would place this credential under
 * the actor it must be independent of; building a Witness-side equivalent
 * would be the parallel lifecycle the ruling forbids. That gap is reported,
 * not filled - see the Phase 3 Witness Submission Authentication
 * Implementation Report, section 6.
 */
import type { KeyObject } from "node:crypto";
import { canonicalize } from "@/canonicalize";
import { generateIdentityKeyPair, sha256Hex, signHex, verifyHex } from "@/crypto";

/** The ratified retained Witness fields (S25.3) - the only data a submission signature covers. */
export interface WitnessCheckpoint {
  scope: string;
  checkpointHash: string;
  marker: number;
}

export interface AuthenticatedSubmission {
  checkpoint: WitnessCheckpoint;
  signature: string;
}

/**
 * Single signing input for both sign and verify. Built field-by-field from
 * the three ratified fields - never canonicalize(candidate) - so extra
 * submitted fields cannot ride along inside, or outside, the signature.
 */
function submissionDigest(c: WitnessCheckpoint): string {
  return sha256Hex(canonicalize({ scope: c.scope, checkpointHash: c.checkpointHash, marker: c.marker }));
}

export function verifySubmissionSignature(authorityPublicKey: KeyObject, checkpoint: WitnessCheckpoint, signature: string): boolean {
  return verifyHex(authorityPublicKey, submissionDigest(checkpoint), signature);
}

/**
 * Holder of the Witness Submission Authority credential. The private key
 * is an ES private field: it has no accessor and is never exported. Only
 * the public key leaves this object, and that is all the Witness needs.
 */
export class WitnessSubmissionAuthority {
  readonly #privateKey: KeyObject;
  readonly publicKey: KeyObject;

  constructor() {
    const keys = generateIdentityKeyPair();
    this.#privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;
  }

  authenticate(checkpoint: WitnessCheckpoint): AuthenticatedSubmission {
    const signed: WitnessCheckpoint = { scope: checkpoint.scope, checkpointHash: checkpoint.checkpointHash, marker: checkpoint.marker };
    return { checkpoint: signed, signature: signHex(this.#privateKey, submissionDigest(signed)) };
  }
}
