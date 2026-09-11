/**
 * DGP-DEV-009: Events' OWN durable persistence. Owns the
 * "events_registrations" table exclusively. See relationship-memory's
 * persistence.ts header for the Node-native-executability rationale
 * shared by every file in this persistence path.
 *
 * "domain_event_id" is stored and UNIQUE-constrained per tenant so a
 * genuine duplicate delivery of the same domain event can never create a
 * second registration row, even as a defense-in-depth backstop behind
 * DGP's own idempotency guard (dgp/persistence.ts) -- the orchestrator
 * checks that guard BEFORE calling this function, so this constraint is
 * never expected to fire in normal operation; it exists to make a
 * hypothetical guard bypass loud rather than silent.
 */
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { assertPersistenceExperimentTenant } from "../../shared/persistence-tenant.ts";
import type { EventRegistration } from "./types.ts";

export function ensureSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events_registrations (
      tenant_id TEXT NOT NULL,
      id TEXT NOT NULL,
      person_id TEXT NOT NULL,
      pilot_event_id TEXT NOT NULL,
      domain_event_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id),
      UNIQUE (tenant_id, domain_event_id)
    );
  `);
}

function rowToRegistration(row: Record<string, unknown>): EventRegistration {
  return {
    id: String(row.id),
    personId: String(row.person_id),
    pilotEventId: String(row.pilot_event_id),
    tenantId: String(row.tenant_id),
    createdAt: String(row.created_at),
  };
}

export interface RecordEventRegistrationDurableInput {
  tenantId: string;
  personId: string;
  pilotEventId: string;
  domainEventId: string;
}

export function recordDurable(db: DatabaseSync, input: RecordEventRegistrationDurableInput): EventRegistration {
  assertPersistenceExperimentTenant(input.tenantId);
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO events_registrations (tenant_id, id, person_id, pilot_event_id, domain_event_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`
  ).run(input.tenantId, id, input.personId, input.pilotEventId, input.domainEventId, now);
  return { id, personId: input.personId, pilotEventId: input.pilotEventId, tenantId: input.tenantId, createdAt: now };
}

export function findByDomainEventIdDurable(
  db: DatabaseSync,
  tenantId: string,
  domainEventId: string
): EventRegistration | undefined {
  assertPersistenceExperimentTenant(tenantId);
  const row = db
    .prepare(`SELECT * FROM events_registrations WHERE tenant_id = ? AND domain_event_id = ?;`)
    .get(tenantId, domainEventId);
  return row ? rowToRegistration(row) : undefined;
}

export function findAllForPersonDurable(db: DatabaseSync, tenantId: string, personId: string): EventRegistration[] {
  assertPersistenceExperimentTenant(tenantId);
  const rows = db
    .prepare(`SELECT * FROM events_registrations WHERE tenant_id = ? AND person_id = ? ORDER BY created_at ASC;`)
    .all(tenantId, personId);
  return rows.map(rowToRegistration);
}
