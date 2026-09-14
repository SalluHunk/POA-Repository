/**
 * DGP-DEV-011 Tests A-C. Property under test (mission section 6): for one
 * call to bookEventRegistrationDurable, either every authoritative
 * durable write it performs -- identity get-or-create, the Events
 * domain-record write, the DGP journey-stage write, and the guard-mark
 * -- is committed, or none of them remain committed.
 *
 * Test B's crash is injected into the REAL production function via
 * DGP_DEV_011_CRASH_POINT, set only on the spawned child process's own
 * environment (src/shared/persistent-orchestrator.ts's maybeCrashAt is
 * inert unless this exact env var is set) -- the transaction that rolls
 * back is the same one bookEventRegistrationDurable itself opens, not a
 * separate simulated one. The crash is a real process.exit(97) call,
 * never inside a caught exception, so no COMMIT and no ROLLBACK can run
 * afterward -- confirmed empirically before this file was written (see
 * mission report section 6/9): a row inserted inside an uncommitted
 * BEGIN, followed by process.exit(), is absent when a second process
 * reopens the same WAL-mode SQLite file.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const HARNESS_PATH = path.resolve(import.meta.dirname, "./persistence-harness.ts");
const TENANT_A = "tenant-synthetic-a";

let workDir: string;
let dbPath: string;

beforeEach(() => {
  workDir = mkdtempSync(path.join(tmpdir(), "dgp-dev-011-"));
  dbPath = path.join(workDir, "atomicity.db");
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function runHarness(command: string, ...args: string[]): any {
  const result = spawnSync(process.execPath, [HARNESS_PATH, command, dbPath, ...args], {
    encoding: "utf8",
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  });
  if (result.status !== 0) {
    throw new Error('persistence-harness "' + command + '" exited ' + result.status + ": " + result.stderr);
  }
  return JSON.parse(result.stdout.trim());
}

/** Does not assert a zero exit -- the caller inspects the raw spawnSync result. */
function runHarnessRaw(command: string, extraEnv: Record<string, string>, ...args: string[]) {
  return spawnSync(process.execPath, [HARNESS_PATH, command, dbPath, ...args], {
    encoding: "utf8",
    env: { ...process.env, NODE_NO_WARNINGS: "1", ...extraEnv },
  });
}

describe("DGP-DEV-011 Test A: uninterrupted operation commits the complete logical state", () => {
  it("identity, domain record, journey stage, and the idempotency guard all survive together", () => {
    const domainEventId = "domevt-atomic-a01";
    const booked = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-atomic-a01",
      "Synthetic Devotee Atomic A01",
      "marker-atomic-a01",
      "pilot-event-atomic-a01",
      domainEventId
    );
    expect(booked.wasAlreadyProcessed).toBe(false);

    // process 2: independently confirm every row exists post-commit
    const identity = runHarness("get-identity", TENANT_A, "synthetic-user-atomic-a01");
    expect(identity).not.toBeNull();
    expect(identity.id).toBe(booked.identity.id);

    const registration = runHarness("get-registration-by-domain-event", TENANT_A, domainEventId);
    expect(registration).not.toBeNull();
    expect(registration.id).toBe(booked.registration.id);

    const stages = runHarness("get-journey", TENANT_A, identity.id);
    expect(stages).toHaveLength(1);

    // process 3: replay proves the guard was durably marked as part of the same commit
    const replay = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-atomic-a01",
      "Synthetic Devotee Atomic A01",
      "marker-atomic-a01",
      "pilot-event-atomic-a01",
      domainEventId
    );
    expect(replay.wasAlreadyProcessed).toBe(true);
  });
});

describe("DGP-DEV-011 Test B: a genuine crash mid-transaction leaves NO forbidden partial durable state", () => {
  it("a process killed after the domain-record write but before COMMIT leaves neither the identity nor the domain record behind", () => {
    const domainEventId = "domevt-crash-b01";
    const crashResult = runHarnessRaw(
      "book-event",
      { DGP_DEV_011_CRASH_POINT: "after-domain-write" },
      TENANT_A,
      "synthetic-user-crash-b01",
      "Synthetic Devotee Crash B01",
      "marker-crash-b01",
      "pilot-event-crash-b01",
      domainEventId
    );

    // the crash must be a genuine, non-zero-status termination -- process.exit(97)
    // firing INSIDE the open transaction, before any JSON result could be printed.
    expect(crashResult.status).toBe(97);
    expect(crashResult.stdout.trim()).toBe("");

    // process 2 (fresh, no crash env var set): inspect durable state directly
    const identity = runHarness("get-identity", TENANT_A, "synthetic-user-crash-b01");
    expect(identity).toBeNull(); // identity write was part of the SAME uncommitted transaction

    const registration = runHarness("get-registration-by-domain-event", TENANT_A, domainEventId);
    expect(registration).toBeNull(); // the write that immediately preceded the crash point did not survive
  });

  it("recovery: replaying the identical logical operation after the crash succeeds cleanly, with exactly one of each row", () => {
    const domainEventId = "domevt-crash-b02";
    const crashResult = runHarnessRaw(
      "book-event",
      { DGP_DEV_011_CRASH_POINT: "after-domain-write" },
      TENANT_A,
      "synthetic-user-crash-b02",
      "Synthetic Devotee Crash B02",
      "marker-crash-b02",
      "pilot-event-crash-b02",
      domainEventId
    );
    expect(crashResult.status).toBe(97);

    // process 2: retry the exact same logical operation (same contactReference,
    // same domainEventId) through the normal, uninterrupted path. If any
    // orphaned row from the crashed attempt had survived, this would either
    // throw on a UNIQUE(tenant_id, domain_event_id) violation or produce a
    // duplicate row -- neither happens, because nothing survived the crash.
    const retried = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-crash-b02",
      "Synthetic Devotee Crash B02",
      "marker-crash-b02",
      "pilot-event-crash-b02",
      domainEventId
    );
    expect(retried.wasAlreadyProcessed).toBe(false); // guard was never marked by the crashed attempt

    const registration = runHarness("get-registration-by-domain-event", TENANT_A, domainEventId);
    expect(registration).not.toBeNull();
    expect(registration.id).toBe(retried.registration.id);

    const stages = runHarness("get-journey", TENANT_A, retried.identity.id);
    expect(stages).toHaveLength(1); // not two -- no leftover journey stage from the crashed attempt
  });
});

describe("DGP-DEV-011 Test C: crash-point hook is inert without the env var (no accidental production crash surface)", () => {
  it("a normal call with DGP_DEV_011_CRASH_POINT unset completes normally even though the hook is present in the code path", () => {
    const domainEventId = "domevt-inert-c01";
    const result = runHarnessRaw(
      "book-event",
      {}, // no DGP_DEV_011_CRASH_POINT set
      TENANT_A,
      "synthetic-user-inert-c01",
      "Synthetic Devotee Inert C01",
      "marker-inert-c01",
      "pilot-event-inert-c01",
      domainEventId
    );
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed.wasAlreadyProcessed).toBe(false);
  });
});
