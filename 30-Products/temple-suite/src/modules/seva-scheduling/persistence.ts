/**
 * DGP-DEV-009: Seva Scheduling's OWN durable persistence. Owns the
 * "seva_bookings" table exclusively. See relationship-memory's
 * persistence.ts header for the shared Node-native-executability
 * rationale.
 */
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { assertPersistenceExperimentTenant } from "../../shared/persistence-tenant.ts";
import type { SevaBooking } from "./types.ts";

export function ensureSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS seva_bookings (
      tenant_id TEXT NOT NULL,
      id TEXT NOT NULL,
      person_id TEXT NOT NULL,
      seva_type TEXT NOT NULL,
      scheduled_for TEXT NOT NULL,
      domain_event_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id),
      UNIQUE (tenant_id, domain_event_id)
    );
  `);
}

function rowToBooking(row: Record<string, unknown>): SevaBooking {
  return {
    id: String(row.id),
    personId: String(row.person_id),
    sevaType: String(row.seva_type),
    scheduledFor: String(row.scheduled_for),
    tenantId: String(row.tenant_id),
    createdAt: String(row.created_at),
  };
}

export interface RecordSevaBookingDurableInput {
  tenantId: string;
  personId: string;
  sevaType: string;
  scheduledFor: string;
  domainEventId: string;
}

export function recordDurable(db: DatabaseSync, input: RecordSevaBookingDurableInput): SevaBooking {
  assertPersistenceExperimentTenant(input.tenantId);
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO seva_bookings (tenant_id, id, person_id, seva_type, scheduled_for, domain_event_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?);`
  ).run(input.tenantId, id, input.personId, input.sevaType, input.scheduledFor, input.domainEventId, now);
  return {
    id,
    personId: input.personId,
    sevaType: input.sevaType,
    scheduledFor: input.scheduledFor,
    tenantId: input.tenantId,
    createdAt: now,
  };
}

export function findByDomainEventIdDurable(
  db: DatabaseSync,
  tenantId: string,
  domainEventId: string
): SevaBooking | undefined {
  assertPersistenceExperimentTenant(tenantId);
  const row = db
    .prepare(`SELECT * FROM seva_bookings WHERE tenant_id = ? AND domain_event_id = ?;`)
    .get(tenantId, domainEventId);
  return row ? rowToBooking(row) : undefined;
}

export function findAllForPersonDurable(db: DatabaseSync, tenantId: string, personId: string): SevaBooking[] {
  assertPersistenceExperimentTenant(tenantId);
  const rows = db
    .prepare(`SELECT * FROM seva_bookings WHERE tenant_id = ? AND person_id = ? ORDER BY created_at ASC;`)
    .all(tenantId, personId);
  return rows.map(rowToBooking);
}
