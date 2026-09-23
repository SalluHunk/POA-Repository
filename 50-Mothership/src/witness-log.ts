/**
 * Out-of-repository, same-host Witness log (POA-DEC-SEC-001 S25; Phase 3
 * "Independent Witness Implementation").
 *
 * Deliberately NOT named "IndependentWitness": this module honestly
 * achieves exactly one of the four ratified independence boundaries
 * (S25.1) - storage outside the git-tracked repository tree, so no git
 * operation (force-push, reset, rebase, history rewrite) on
 * POA-Repository can touch it. It does NOT achieve credential or
 * administrative independence in this environment: the storage directory
 * is caller-supplied (never hardcoded/auto-created outside the repo by
 * this module), and nothing here prevents the same OS user/process that
 * can write the evidence runtime from also writing this log directly.
 * That gap is disclosed, not hidden - see the Phase 3 Implementation
 * Report's Independence section.
 *
 * Content-blind by design (S25.3/S25's Ruling 3): a retained record is
 * exactly {scope, checkpointHash, marker} - no evidence payload, no
 * envelope, no signature is ever stored here. This is not a second
 * evidence store.
 *
 * `marker` is the evidence chain's LENGTH at checkpoint time, not a
 * wall-clock timestamp. The whole Evidence Integrity architecture
 * already treats wall-clock time as diagnostic, never integrity-bearing
 * (POA-DEC-SEC-001 S12); a single head-hash-only comparison (as the
 * existing witness.ts test double does) cannot distinguish "repository
 * legitimately grew past the checkpoint" from "repository diverged" -
 * chain length can. This is the one additional field this module
 * introduces beyond S25.3's three named fields, and this paragraph is
 * that field's required justification.
 *
 * Retention is W2 (S25.3): append-only. Records are chained by a
 * prevEntryHash/entryHash pair over the log itself, reusing the exact
 * same canonicalize()/sha256Hex() primitives evidence.ts already uses -
 * no new hashing mechanism invented. This chain does NOT raise the bar
 * against an actor with full file-write access to the log (recomputing
 * SHA-256 is free); it only makes a NAIVE or PARTIAL edit (hand-editing
 * one line without recomputing everything after it) self-evidently
 * detectable. That is the only claim verifyLogIntegrity() makes.
 */
import type { KeyObject } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { canonicalize } from "@/canonicalize";
import { sha256Hex } from "@/crypto";
import { verifySubmissionSignature, type WitnessCheckpoint } from "@/witness-submission";

export interface WitnessCheckpointRecord {
  sequence: number; // position in THIS scope's witness log - distinct from the evidence chain's own sequence field
  scope: string;
  checkpointHash: string;
  marker: number; // evidence-chain length at checkpoint time
}

type LogEntry = WitnessCheckpointRecord & { entryHash: string; prevEntryHash: string | null };

export type WitnessSubmitResult =
  | { accepted: true; idempotent: boolean; sequence: number }
  | { accepted: false; code: "MALFORMED" | "UNAUTHENTICATED" | "AUTHENTICATION_FAILED" | "OUT_OF_ORDER" | "CONFLICTING_MARKER" | "UNAVAILABLE"; detail: string };

/** What crosses the submission boundary: a checkpoint plus its transient Class A signature. The signature is verified, then discarded - never retained. */
export interface WitnessSubmission {
  checkpoint: Partial<WitnessCheckpoint>;
  signature?: string | null;
}

export type WitnessVerification =
  | { status: "NO_CHECKPOINT" }
  | { status: "MATCH"; marker: number }
  | { status: "AHEAD_OF_WITNESS"; witnessedMarker: number; currentMarker: number }
  | { status: "DIVERGED"; reason: "BEHIND" | "REWRITE" | "PREFIX_MISMATCH"; witnessedMarker: number; witnessedHash: string; currentMarker: number; currentHead: string | null }
  | { status: "UNAVAILABLE"; detail: string };

export interface LogIntegrityResult {
  ok: boolean;
  index: number;
  code?: "ENTRY_HASH_MISMATCH" | "CHAIN_BROKEN" | "SEQUENCE_MISMATCH";
  detail?: string;
}

function entrySigningInput(r: WitnessCheckpointRecord, prevEntryHash: string | null): string {
  return canonicalize({ sequence: r.sequence, scope: r.scope, checkpointHash: r.checkpointHash, marker: r.marker, prevEntryHash });
}

function isWellFormed(r: Partial<WitnessCheckpointRecord>): r is Pick<WitnessCheckpointRecord, "scope" | "checkpointHash" | "marker"> {
  return (
    typeof r.scope === "string" &&
    r.scope.length > 0 &&
    typeof r.checkpointHash === "string" &&
    /^[0-9a-f]{64}$/.test(r.checkpointHash) &&
    typeof r.marker === "number" &&
    Number.isInteger(r.marker) &&
    r.marker >= 0
  );
}

export class OutOfRepoWitnessLog {
  private readonly storageDir: string;
  private readonly submissionAuthorityPublicKey: KeyObject;

  /**
   * storageDir is always caller-supplied. This class never selects, creates, or defaults to a path outside the repository on its own - that remains a deployment decision for a future, separately-authorized step.
   *
   * submissionAuthorityPublicKey is the Witness Submission Authority's trust anchor (Class A). Required - there is no default and no unauthenticated mode. Caller-supplied like storageDir: this class never generates, holds, or can reach the matching private key.
   */
  constructor(storageDir: string, submissionAuthorityPublicKey: KeyObject) {
    this.storageDir = storageDir;
    this.submissionAuthorityPublicKey = submissionAuthorityPublicKey;
  }

  private logPath(scope: string): string {
    // Filename derived from a hash of the scope, not the scope string itself -
    // reuses the existing sha256Hex primitive and sidesteps any filesystem-
    // path-safety question (arbitrary characters, length, traversal) rather
    // than inventing a bespoke sanitizer.
    return join(this.storageDir, `${sha256Hex(scope)}.witnesslog`);
  }

  private readLog(scope: string): LogEntry[] | { error: string } {
    const path = this.logPath(scope);
    if (!existsSync(path)) return [];
    try {
      const raw = readFileSync(path, "utf8");
      if (raw.trim().length === 0) return [];
      return raw
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line) as LogEntry);
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  private writeLog(scope: string, entries: LogEntry[]): { ok: true } | { ok: false; error: string } {
    try {
      if (!existsSync(this.storageDir)) mkdirSync(this.storageDir, { recursive: true });
      writeFileSync(this.logPath(scope), entries.map((e) => JSON.stringify(e)).join("\n") + (entries.length ? "\n" : ""), "utf8");
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /**
   * Submit path: a checkpoint proposed by the Witness Submission Authority.
   * Order is SHAPE -> AUTHENTICATION -> storage/ORDERING: a submission whose
   * Class A signature does not verify against the configured authority key
   * is rejected before the log is ever read or written. The signature is
   * used only here and is never persisted - the retained record is built
   * from scope/checkpointHash/marker alone. Authentication establishes
   * origin, not truth (S25.4); content-blindness is unchanged.
   */
  submit(submission: WitnessSubmission): WitnessSubmitResult {
    const candidate = submission.checkpoint;
    if (!isWellFormed(candidate)) {
      return { accepted: false, code: "MALFORMED", detail: "checkpoint must have a non-empty scope, a 64-hex-char checkpointHash, and a non-negative integer marker" };
    }
    if (typeof submission.signature !== "string" || submission.signature.length === 0) {
      return { accepted: false, code: "UNAUTHENTICATED", detail: "checkpoint submission carries no Witness Submission Authority signature" };
    }
    if (!verifySubmissionSignature(this.submissionAuthorityPublicKey, candidate, submission.signature)) {
      return { accepted: false, code: "AUTHENTICATION_FAILED", detail: "signature does not verify against the Witness Submission Authority key for this exact scope/checkpointHash/marker" };
    }
    const existing = this.readLog(candidate.scope);
    if ("error" in existing) return { accepted: false, code: "UNAVAILABLE", detail: existing.error };

    const last = existing[existing.length - 1] ?? null;

    if (last) {
      if (candidate.marker < last.marker) {
        return { accepted: false, code: "OUT_OF_ORDER", detail: `submitted marker ${candidate.marker} is behind the last retained marker ${last.marker}` };
      }
      if (candidate.marker === last.marker) {
        if (candidate.checkpointHash === last.checkpointHash) {
          return { accepted: true, idempotent: true, sequence: last.sequence }; // duplicate, same marker + same hash - idempotent by design
        }
        return { accepted: false, code: "CONFLICTING_MARKER", detail: `marker ${candidate.marker} already retained with a different hash` };
      }
    }

    const sequence = last ? last.sequence + 1 : 0;
    const prevEntryHash = last ? last.entryHash : null;
    const record: WitnessCheckpointRecord = { sequence, scope: candidate.scope, checkpointHash: candidate.checkpointHash, marker: candidate.marker };
    const entryHash = sha256Hex(entrySigningInput(record, prevEntryHash));
    const entry: LogEntry = { ...record, entryHash, prevEntryHash };

    const write = this.writeLog(candidate.scope, [...existing, entry]);
    if (!write.ok) return { accepted: false, code: "UNAVAILABLE", detail: write.error };
    return { accepted: true, idempotent: false, sequence };
  }

  /**
   * Verify path: given the CURRENT authoritative state (the runtime's
   * in-memory evidence chain for this scope - never git history, which
   * this evidence never reaches, per evidence.ts's own documented
   * boundary), establish whether it has diverged from the last witnessed
   * checkpoint. Never returns MATCH/AHEAD on an unavailable log - fails
   * closed (POA-BLD-002 commit e3d9a65's own precedent: a flattened
   * "ok:true" on an honest absence/failure is exactly the bug class this
   * must not repeat).
   */
  verify(scope: string, currentMarker: number, currentHead: string | null, headAtMarker: (marker: number) => string | null): WitnessVerification {
    const log = this.readLog(scope);
    if ("error" in log) return { status: "UNAVAILABLE", detail: log.error };
    if (log.length === 0) return { status: "NO_CHECKPOINT" };

    const witnessed = log[log.length - 1];

    if (currentMarker === witnessed.marker) {
      if (currentHead === witnessed.checkpointHash) return { status: "MATCH", marker: currentMarker };
      return { status: "DIVERGED", reason: "REWRITE", witnessedMarker: witnessed.marker, witnessedHash: witnessed.checkpointHash, currentMarker, currentHead };
    }

    if (currentMarker < witnessed.marker) {
      return { status: "DIVERGED", reason: "BEHIND", witnessedMarker: witnessed.marker, witnessedHash: witnessed.checkpointHash, currentMarker, currentHead };
    }

    // currentMarker > witnessed.marker: the chain grew past the checkpoint.
    // Legitimate growth ONLY if the checkpointed point is still a genuine
    // prefix of the current chain - never assumed, always re-derived via
    // the caller-supplied headAtMarker (never trust a cached value here).
    const prefixHead = headAtMarker(witnessed.marker);
    if (prefixHead === witnessed.checkpointHash) {
      return { status: "AHEAD_OF_WITNESS", witnessedMarker: witnessed.marker, currentMarker };
    }
    return { status: "DIVERGED", reason: "PREFIX_MISMATCH", witnessedMarker: witnessed.marker, witnessedHash: witnessed.checkpointHash, currentMarker, currentHead };
  }

  /**
   * Independent Verification for the log itself (W-E): detects a naive or
   * partial post-hoc edit of a retained record, or interior deletion -
   * exactly evidence.ts's verifyChain() pattern, reused, not reinvented.
   * Does NOT detect a fully-recomputed, self-consistent rewrite of the
   * whole log by an actor with full file-write access - that is precisely
   * the credential/administrative independence gap this module discloses,
   * not solves.
   */
  verifyLogIntegrity(scope: string): LogIntegrityResult {
    const log = this.readLog(scope);
    if ("error" in log) return { ok: false, index: -1, code: "CHAIN_BROKEN", detail: log.error };

    let expectedPrev: string | null = null;
    for (let i = 0; i < log.length; i++) {
      const e = log[i];
      if (e.sequence !== i) return { ok: false, index: i, code: "SEQUENCE_MISMATCH", detail: `entry[${i}] declares sequence ${e.sequence}, expected ${i}` };
      if (e.prevEntryHash !== expectedPrev) return { ok: false, index: i, code: "CHAIN_BROKEN", detail: `entry[${i}] prevEntryHash does not match its predecessor` };
      const recomputed = sha256Hex(entrySigningInput(e, e.prevEntryHash));
      if (recomputed !== e.entryHash) return { ok: false, index: i, code: "ENTRY_HASH_MISMATCH", detail: `entry[${i}] hash does not match its own fields` };
      expectedPrev = e.entryHash;
    }
    return { ok: true, index: log.length };
  }

  /** Adversarial-testing hook ONLY - direct read/write access to a scope's raw log file, simulating an actor who already has filesystem access to the Witness store. Mirrors runtime.ts's own __unsafeGetMutableChainForAdversarialTesting. */
  __unsafeReadRawLogForAdversarialTesting(scope: string): string {
    const path = this.logPath(scope);
    return existsSync(path) ? readFileSync(path, "utf8") : "";
  }

  __unsafeWriteRawLogForAdversarialTesting(scope: string, raw: string): void {
    if (!existsSync(this.storageDir)) mkdirSync(this.storageDir, { recursive: true });
    writeFileSync(this.logPath(scope), raw, "utf8");
  }
}
