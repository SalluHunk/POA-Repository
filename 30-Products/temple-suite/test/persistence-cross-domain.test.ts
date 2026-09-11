/**
 * DGP-DEV-009 Test G. Mirrors the existing (in-memory)
 * test/cross-domain.test.ts, through the durable path instead --
 * proving the already-demonstrated cross-domain non-collision property
 * (DGP-DEV-006) still holds once evidence is written to and read from
 * SQLite rather than an in-memory Map. In-process, per section 16's own
 * Test G wording (no stop/start sequence described for it).
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { openDurableDatabase, closeDurableDatabase } from "../src/shared/db.ts";
import {
  initDurableSchema,
  bookEventRegistrationDurable,
  bookSevaDurable,
  getJourneyStagesDurable,
  getSevaJourneyEvidenceDurable,
} from "../src/shared/persistent-orchestrator.ts";
import { PERSISTENCE_EXPERIMENT_TENANT_A } from "../src/shared/persistence-tenant.ts";

let db: DatabaseSync;

beforeEach(() => {
  db = openDurableDatabase(":memory:");
  initDurableSchema(db);
});

afterEach(() => {
  closeDurableDatabase(db);
});

describe("DGP-DEV-009 Test G: existing cross-domain evidence remains independently represented after persistence", () => {
  it("the same synthetic person can durably carry both Events and Seva journey evidence without collision", () => {
    const eventBooking = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-g01",
      name: "Synthetic Devotee G01",
      relationshipContextMarker: "marker-g01",
      pilotEventId: "pilot-event-g01",
      domainEventId: "domevt-g01",
    });
    const sevaBooking = bookSevaDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-g01", // same person
      name: "Synthetic Devotee G01",
      relationshipContextMarker: "marker-g01",
      sevaType: "seva-type-kitchen",
      scheduledFor: "2026-10-01",
      domainEventId: "domevt-seva-g01",
    });

    expect(sevaBooking.identity.id).toBe(eventBooking.identity.id);

    const journeyStages = getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, eventBooking.identity.id);
    const sevaEvidence = getSevaJourneyEvidenceDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, eventBooking.identity.id);

    expect(journeyStages).toHaveLength(1);
    expect(journeyStages[0].stage).toBe("Registration");
    expect(sevaEvidence).toHaveLength(1);
    expect(sevaEvidence[0].sevaType).toBe("seva-type-kitchen");
  });

  it("order independence: Seva booked before Events registration still yields both, uncollided", () => {
    const sevaBooking = bookSevaDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-g02",
      name: "Synthetic Devotee G02",
      relationshipContextMarker: "marker-g02",
      sevaType: "seva-type-flowers",
      scheduledFor: "2026-10-02",
      domainEventId: "domevt-seva-g02",
    });
    const eventBooking = bookEventRegistrationDurable(db, {
      tenantId: PERSISTENCE_EXPERIMENT_TENANT_A,
      contactReference: "synthetic-user-g02",
      name: "Synthetic Devotee G02",
      relationshipContextMarker: "marker-g02",
      pilotEventId: "pilot-event-g02",
      domainEventId: "domevt-g02",
    });

    expect(eventBooking.identity.id).toBe(sevaBooking.identity.id);
    expect(getJourneyStagesDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, eventBooking.identity.id)).toHaveLength(1);
    expect(getSevaJourneyEvidenceDurable(db, PERSISTENCE_EXPERIMENT_TENANT_A, eventBooking.identity.id)).toHaveLength(1);
  });
});
