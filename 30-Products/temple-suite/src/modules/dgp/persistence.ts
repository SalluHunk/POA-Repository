/**
 * DGP-DEV-009: DGP's OWN durable persistence. Owns three tables
 * exclusively: "dgp_journey_stages", "dgp_seva_journey_evidence", and
 * critically "dgp_processed_domain_events" -- the durable idempotency
 * guard this whole mission exists to prove (mission section 3B/8).
 *
 * The in-memory dgp/store.ts's hasProcessed/markProcessed use a
 * process-lifetime-only Set -- this table is the direct answer to the
 * question that guard could never answer: does the SAME logical guard
 * state survive a process restart. There is no in-memory fallback or
 * cache here by design; every hasProcessedDurable call is a real query
 * against durable state, so a second process genuinely cannot know an
 * event was processed unless the first process's write actually
 * persisted.
 */
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { assertPersistenceExperimentTenant } from "../../shared/persistence-tenant.ts";
import type { JourneyStageRecord, SevaJourneyEvidenceRecord, SystemRecordableJourneyStage } from "./types.ts";

export function ensureSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dgp_journey_stages (
      tenant_id TEXT NOT NULL,
      id TEXT NOT NULL,
      person_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      source_domain_event_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id)
    );
    CREATE TABLE IF NOT EXISTS dgp_seva_journey_evidence (
      tenant_id TEXT NOT NULL,
      id TEXT NOT NULL,
      person_id TEXT NOT NULL,
      seva_type TEXT NOT NULL,
      source_domain_event_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id)
    );
    CREATE TABLE IF NOT EXISTS dgp_processed_domain_events (
      tenant_id TEXT NOT NULL,
      domain_event_id TEXT NOT NULL,
      processed_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, domain_event_id)
    );
  `);
}

export function hasProcessedDurable(db: DatabaseSync, tenantId: string, domainEventId: string): boolean {
  assertPersistenceExperimentTenant(tenantId);
  const row = db
    .prepare(`SELECT 1 FROM dgp_processed_domain_events WHERE tenant_id = ? AND domain_event_id = ?;`)
    .get(tenantId, domainEventId);
  return row !== undefined;
}

export function markProcessedDurable(db: DatabaseSync, tenantId: string, domainEventId: string): void {
  assertPersistenceExperimentTenant(tenantId);
  db.prepare(
    `INSERT INTO dgp_processed_domain_events (tenant_id, domain_event_id, processed_at) VALUES (?, ?, ?);`
  ).run(tenantId, domainEventId, new Date().toISOString());
}

function rowToJourneyStage(row: Record<string, unknown>): JourneyStageRecord {
  return {
    id: String(row.id),
    personId: String(row.person_id),
    tenantId: String(row.tenant_id),
    stage: String(row.stage) as SystemRecordableJourneyStage,
    sourceDomainEventId: String(row.source_domain_event_id),
    createdAt: String(row.created_at),
  };
}

export interface RecordJourneyStageDurableInput {
  tenantId: string;
  personId: string;
  stage: SystemRecordableJourneyStage;
  sourceDomainEventId: string;
}

export function recordJourneyStageDurable(db: DatabaseSync, input: RecordJourneyStageDurableInput): JourneyStageRecord {
  assertPersistenceExperimentTenant(input.tenantId);
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO dgp_journey_stages (tenant_id, id, person_id, stage, source_domain_event_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`
  ).run(input.tenantId, id, input.personId, input.stage, input.sourceDomainEventId, now);
  return {
    id,
    personId: input.personId,
    tenantId: input.tenantId,
    stage: input.stage,
    sourceDomainEventId: input.sourceDomainEventId,
    createdAt: now,
  };
}

export function getJourneyStagesForPersonDurable(
  db: DatabaseSync,
  tenantId: string,
  personId: string
): JourneyStageRecord[] {
  assertPersistenceExperimentTenant(tenantId);
  const rows = db
    .prepare(`SELECT * FROM dgp_journey_stages WHERE tenant_id = ? AND person_id = ? ORDER BY created_at ASC;`)
    .all(tenantId, personId);
  return rows.map(rowToJourneyStage);
}

function rowToSevaEvidence(row: Record<string, unknown>): SevaJourneyEvidenceRecord {
  return {
    id: String(row.id),
    personId: String(row.person_id),
    tenantId: String(row.tenant_id),
    sevaType: String(row.seva_type),
    sourceDomainEventId: String(row.source_domain_event_id),
    createdAt: String(row.created_at),
  };
}

export interface RecordSevaJourneyEvidenceDurableInput {
  tenantId: string;
  personId: string;
  sevaType: string;
  sourceDomainEventId: string;
}

export function recordSevaJourneyEvidenceDurable(
  db: DatabaseSync,
  input: RecordSevaJourneyEvidenceDurableInput
): SevaJourneyEvidenceRecord {
  assertPersistenceExperimentTenant(input.tenantId);
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO dgp_seva_journey_evidence (tenant_id, id, person_id, seva_type, source_domain_event_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`
  ).run(input.tenantId, id, input.personId, input.sevaType, input.sourceDomainEventId, now);
  return {
    id,
    personId: input.personId,
    tenantId: input.tenantId,
    sevaType: input.sevaType,
    sourceDomainEventId: input.sourceDomainEventId,
    createdAt: now,
  };
}

export function getSevaJourneyEvidenceForPersonDurable(
  db: DatabaseSync,
  tenantId: string,
  personId: string
): SevaJourneyEvidenceRecord[] {
  assertPersistenceExperimentTenant(tenantId);
  const rows = db
    .prepare(`SELECT * FROM dgp_seva_journey_evidence WHERE tenant_id = ? AND person_id = ? ORDER BY created_at ASC;`)
    .all(tenantId, personId);
  return rows.map(rowToSevaEvidence);
}
