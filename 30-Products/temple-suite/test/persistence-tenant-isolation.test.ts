/**
 * DGP-DEV-009 Tests E-F. Unlike Tests A-D, these are not restart tests
 * (mission section 16 does not describe a stop/start sequence for
 * them) -- they run in-process against an in-memory SQLite database,
 * proven through the same authoritative interfaces
 * (persistent-orchestrator.ts) the restart harness uses, per mission
 * section 10's "test it through the application's authoritative
 * interfaces" requirement.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { openDurableDatabase, closeDurableDatabase } from "../src/shared/db.ts";
import {
  initDurableSchema,
  bookEventRegistrationDurable,
  createIdentityDurable,
  getIdentityDurable,
  getJourneyStagesDurable,
} from "../src/shared/persistent-orchestrator.ts";
import { PERSISTENCE_EXPERIMENT_TENANT_A, PERSISTENCE_EXPERIMENT_TENANT_B } from "../src/shared/persistence-tenant.ts";

let db: DatabaseSync;

beforeEach(() => {
  db = openDurableDatabase(":memory:");
  initDurableSchema(db);
});

afterEach(() => {
  closeDurableDatabase(db);
});

describe("DGP-DEV-009 Test E: two-tenant isolation", () => {
  it("tenant A cannot retrieve tenant B's identity or journey evidence, and vice versa", () => {
    const bookedA = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-e-a",
      name: "Synthetic Devotee EA",
      relationshipContextMarker: "marker-ea",
      pilotEventId: "pilot-event-ea",
      domainEventId: "domevt-e-a",
    });
    const bookedB = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_B,
      contactReference: "synthetic-user-e-b",
      name: "Synthetic Devotee EB",
      relationshipContextMarker: "marker-eb",
      pilotEventId: "pilot-event-eb",
      domainEventId: "domevt-e-b",
    });

    expect(getIdentityDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, "synthetic-user-e-a")?.id).toBe(bookedA.identity.id);
    expect(getIdentityDurable(db, PERSISTENCE_EXPERIMENT_TENANT_B, "synthetic-user-e-a")).toBeUndefined();
    expect(getIdentityDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, "synthetic-user-e-b")).toBeUndefined();

    expect(getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, bookedB.identity.id)).toHaveLength(0);
    expect(getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_B, bookedA.identity.id)).toHaveLength(0);
    expect(getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, bookedA.identity.id)).toHaveLength(1);
    expect(getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_B, bookedB.identity.id)).toHaveLength(1);
  });

  it("idempotency state is tenant-safe: the same domainEventId in two tenants does not collide", () => {
    const domainEventId = "domevt-shared-id-e";
    const a = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-e-idem-a",
      name: "Synthetic Devotee E-Idem-A",
      relationshipContextMarker: "marker",
      pilotEventId: "pilot-idem",
      domainEventId,
    });
    const b = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_B,
      contactReference: "synthetic-user-e-idem-b",
      name: "Synthetic Devotee E-Idem-B",
      relationshipContextMarker: "marker",
      pilotEventId: "pilot-idem",
      domainEventId, // identical to tenant A's, deliberately
    });
    expect(a.wasAlreadyProcessed).toBe(false);
    expect(b.wasAlreadyProcessed).toBe(false); // tenant B's own guard was not pre-tripped by tenant A's write
    expect(a.registration.id).not.toBe(b.registration.id);
  });
});

describe("DGP-DEV-009 Test F: same contact reference across tenants does not collide", () => {
  it("two tenants using the identical contactReference (synthetic-user-001) produce two distinct identities", () => {
    const a = createIdentityDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-001",
      name: "Tenant A Devotee",
      relationshipContextMarker: "marker",
    });
    const b = createIdentityDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_B,
      contactReference: "synthetic-user-001",
      name: "Tenant B Devotee",
      relationshipContextMarker: "marker",
    });

    expect(a.id).not.toBe(b.id);
    expect(a.contactReference).toBe("synthetic-user-001");
    expect(b.contactReference).toBe("synthetic-user-001");
    expect(a.tenantId).toBe(PERSISTENCE_EXPERIMENT_TENANT_A);
    expect(b.tenantId).toBe(PERSISTENCE_EXPERIMENT_TENANT_B);

    const aAgain = createIdentityDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-001",
      name: "Tenant A Devotee",
      relationshipContextMarker: "marker",
    });
    expect(aAgain.id).toBe(a.id);
  });
});
