/**
 * Hashing and identity-bound signing (POA-DEC-SEC-001 S10, S16).
 * node:crypto only - no external cryptographic dependency, no key
 * management infrastructure (key lifecycle mechanism remains
 * Implementation-Deferred per POA-DEC-SEC-001 S16; this module supplies
 * only the primitive a future key-management layer would call).
 */
import {
  createHash,
  generateKeyPairSync,
  sign as cryptoSign,
  verify as cryptoVerify,
  type KeyObject,
} from "node:crypto";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export interface KeyPair {
  publicKey: KeyObject;
  privateKey: KeyObject;
}

export function generateIdentityKeyPair(): KeyPair {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return { publicKey, privateKey };
}

export function signHex(privateKey: KeyObject, dataHex: string): string {
  return cryptoSign(null, Buffer.from(dataHex, "utf8"), privateKey).toString("hex");
}

export function verifyHex(publicKey: KeyObject, dataHex: string, signatureHex: string): boolean {
  try {
    return cryptoVerify(null, Buffer.from(dataHex, "utf8"), publicKey, Buffer.from(signatureHex, "hex"));
  } catch {
    return false;
  }
}
