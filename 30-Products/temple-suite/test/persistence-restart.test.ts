/**
 * DGP-DEV-009 Tests A-D. Every `runHarness` call below is a genuine,
 * separate `node` child process (spawnSync) -- not a new object inside
 * the vitest process. Each test's later call(s) can only see what an
 * EARLIER, now-exited process actually wrote to the shared SQLite file
 * at `dbPath`. This is the distinction mission section 9 requires
 * between "new in-memory object" and "new process reading durable
 * state": there is no code path by which vitest's own process state
 * could leak into these assertions.
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
  workDir = mkdtempSync(path.join(tmpdir(), "dgp-dev-009-"));
  dbPath = path.join(workDir, "restart.db");
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

describe("DGP-DEV-009 Test A: identity restart survival", () => {
  it("an identity created in process 1 is retrievable, with the SAME id, by process 2", () => {
    const created = runHarness("create-identity", TENANT_A, "synthetic-user-a01", "Synthetic Devotee A01", "marker-a01");
    expect(created.id).toBeTruthy();

    const retrieved = runHarness("get-identity", TENANT_A, "synthetic-user-a01");
    expect(retrieved).not.toBeNull();
    expect(retrieved.id).toBe(created.id);
    expect(retrieved.contactReference).toBe("synthetic-user-a01");
  });
});

describe("DGP-DEV-009 Test B: domain record restart survival", () => {
  it("an Events registration created in process 1 is retrievable by process 2", () => {
    const booked = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-b01",
      "Synthetic Devotee B01",
      "marker-b01",
      "pilot-event-b01",
      "domevt-restart-b01"
    );
    const registrations = runHarness("get-registrations", TENANT_A, booked.identity.id);
    expect(registrations).toHaveLength(1);
    expect(registrations[0].id).toBe(booked.registration.id);
    expect(registrations[0].pilotEventId).toBe("pilot-event-b01");
  });

  it("a Seva booking created in process 1 is retrievable by process 2", () => {
    const booked = runHarness(
      "book-seva",
      TENANT_A,
      "synthetic-user-b02",
      "Synthetic Devotee B02",
      "marker-b02",
      "seva-type-cooking",
      "2026-09-20",
      "domevt-seva-restart-b02"
    );
    const bookings = runHarness("get-seva-bookings", TENANT_A, booked.identity.id);
    expect(bookings).toHaveLength(1);
    expect(bookings[0].id).toBe(booked.booking.id);
  });
});

describe("DGP-DEV-009 Test C: DGP journey evidence restart survival", () => {
  it("a journey stage recorded by process 1 is retrievable by process 2", () => {
    const booked = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-c01",
      "Synthetic Devotee C01",
      "marker-c01",
      "pilot-event-c01",
      "domevt-restart-c01"
    );
    const stages = runHarness("get-journey", TENANT_A, booked.identity.id);
    expect(stages).toHaveLength(1);
    expect(stages[0].id).toBe(booked.journeyStages[0].id);
    expect(stages[0].stage).toBe("Registration");
    expect(stages[0].sourceDomainEventId).toBe("domevt-restart-c01");
  });
});

describe("DGP-DEV-009 Test D: idempotency survives restart", () => {
  it("replaying the exact same domain event id from a later process produces no duplicate effect", () => {
    const domainEventId = "domevt-restart-d01";

    // process 1: create identity, process event E for the first time
    const first = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-d01",
      "Synthetic Devotee D01",
      "marker-d01",
      "pilot-event-d01",
      domainEventId
    );
    expect(first.wasAlreadyProcessed).toBe(false);

    // process 2: replay the EXACT SAME event id/payload -- not a newly generated event
    const replay = runHarness(
      "book-event",
      TENANT_A,
      "synthetic-user-d01",
      "Synthetic Devotee D01",
      "marker-d01",
      "pilot-event-d01",
      domainEventId
    );
    expect(replay.wasAlreadyProcessed).toBe(true);
    expect(replay.registration.id).toBe(first.registration.id);
    expect(replay.journeyStages).toHaveLength(1);
    expect(replay.journeyStages[0].id).toBe(first.journeyStages[0].id);
    expect(replay.journeyStages[0].createdAt).toBe(first.journeyStages[0].createdAt);

    // process 3: independently re-verify counts from durable state alone -- what
    // actually prevents duplication is dgp_processed_domain_events, queried
    // inside process 2's own bookEventRegistrationDurable call above via
    // hasProcessedDurable before any write was attempted.
    const registrations = runHarness("get-registrations", TENANT_A, first.identity.id);
    const stages = runHarness("get-journey", TENANT_A, first.identity.id);
    expect(registrations).toHaveLength(1);
    expect(stages).toHaveLength(1);
  });
});
