/**
 * DGP-DEV-009: Relationship Memory's OWN durable persistence. Owns the
 * "rm_identities" table exclusively -- no other module's persistence.ts
 * may reference it (extended in test/architecture-boundary.test.ts).
 *
 * Deliberately does not import "@/shared/tenant", "@/shared/audit", or
 * this module's own "./index"/"./store" -- see src/shared/db.ts's header
 * for why (Node-native process-boundary executability). This is a
 * parallel, additive persistence path; the existing in-memory
 * createOrGetPersonIdentity/store.ts are completely untouched.
 *
 * Idempotent by the same natural key as the in-memory version
 * (tenantId, contactReference), via INSERT ... ON CONFLICT DO NOTHING
 * followed by a SELECT -- so a genuine duplicate call (including one
 * from a second, later process) never creates a second identity.
 */
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { assertPersistenceExperimentTenant } from "../../shared/persistence-tenant.ts";
import type { PersonIdentity } from "./types.ts";

export function ensureSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rm_identities (
      tenant_id TEXT NOT NULL,
      contact_reference TEXT NOT NULL,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      relationship_context_marker TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, contact_reference)
    );
  `);
}

function rowToIdentity(row: Record<string, unknown>): PersonIdentity {
  return {
    id: String(row.id),
    name: String(row.name),
    contactReference: String(row.contact_reference),
    relationshipContextMarker: String(row.relationship_context_marker),
    tenantId: String(row.tenant_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.created_at),
  };
}

export interface CreateOrGetIdentityDurableInput {
  tenantId: string;
  contactReference: string;
  name: string;
  relationshipContextMarker: string;
}

export function createOrGetDurable(db: DatabaseSync, input: CreateOrGetIdentityDurableInput): PersonIdentity {
  assertPersistenceExperimentTenant(input.tenantId);
  const candidateId = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO rm_identities (tenant_id, contact_reference, id, name, relationship_context_marker, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(tenant_id, contact_reference) DO NOTHING;`
  ).run(input.tenantId, input.contactReference, candidateId, input.name, input.relationshipContextMarker, now);

  const row = db
    .prepare(`SELECT * FROM rm_identities WHERE tenant_id = ? AND contact_reference = ?;`)
    .get(input.tenantId, input.contactReference);
  if (!row) {
    throw new Error("DGP-DEV-009 invariant violation: identity insert-or-get produced no row.");
  }
  return rowToIdentity(row);
}

export function findByNaturalKeyDurable(
  db: DatabaseSync,
  tenantId: string,
  contactReference: string
): PersonIdentity | undefined {
  assertPersistenceExperimentTenant(tenantId);
  const row = db
    .prepare(`SELECT * FROM rm_identities WHERE tenant_id = ? AND contact_reference = ?;`)
    .get(tenantId, contactReference);
  return row ? rowToIdentity(row) : undefined;
}
