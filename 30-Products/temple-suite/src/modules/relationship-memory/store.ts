/**
 * Module-internal persistence. Per TSAAS-002 section 7 / section 10, no
 * other module may import this file directly -- access is only through
 * index.ts, the file this module exports as its public interface.
 * Enforced by test/architecture-boundary.test.ts.
 *
 * In-memory only (implementation-level decision, DGP-DEV-001 Phase B): no
 * database is introduced for this architecture-proving slice. The
 * database-level module-boundary enforcement technique TSAAS-002 section
 * 10 leaves OPEN (per-module schema namespace vs flat schema) is
 * therefore not yet applicable -- it remains a recommendation for
 * whichever future slice introduces a real database.
 */
import type { PersonIdentity } from "./types";

const identitiesById = new Map<string, PersonIdentity>();
const identitiesByNaturalKey = new Map<string, string>();
let seq = 0;

export function findByNaturalKey(tenantId: string, contactReference: string): PersonIdentity | undefined {
  const id = identitiesByNaturalKey.get(tenantId + "::" + contactReference);
  return id ? identitiesById.get(id) : undefined;
}

export function insert(record: Omit<PersonIdentity, "id" | "createdAt" | "updatedAt">): PersonIdentity {
  const now = new Date().toISOString();
  const id = "identity-" + (++seq);
  const full: PersonIdentity = { id, createdAt: now, updatedAt: now, ...record };
  identitiesById.set(id, full);
  identitiesByNaturalKey.set(record.tenantId + "::" + record.contactReference, id);
  return full;
}

export function findById(id: string): PersonIdentity | undefined {
  return identitiesById.get(id);
}

export function _clearForTests(): void {
  identitiesById.clear();
  identitiesByNaturalKey.clear();
  seq = 0;
}
