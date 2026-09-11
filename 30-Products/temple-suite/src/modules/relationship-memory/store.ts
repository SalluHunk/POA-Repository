/**
 * Module-internal persistence. Per TSAAS-002 section 7 / section 10, no
 * other module may import this file directly -- access is only through
 * index.ts, the file this module exports as its public interface.
 * Enforced by test/architecture-boundary.test.ts.
 *
 * In-memory only (implementation-level decision, DGP-DEV-001 Phase B): no
 * database is introduced for this architecture-proving slice.
 */
import type { PersonIdentity, FollowUpContextRecord } from "./types";

const identitiesById = new Map<string, PersonIdentity>();
const identitiesByNaturalKey = new Map<string, string>();
let identitySeq = 0;

export function findByNaturalKey(tenantId: string, contactReference: string): PersonIdentity | undefined {
  const id = identitiesByNaturalKey.get(tenantId + "::" + contactReference);
  return id ? identitiesById.get(id) : undefined;
}

export function insert(record: Omit<PersonIdentity, "id" | "createdAt" | "updatedAt">): PersonIdentity {
  const now = new Date().toISOString();
  const id = "identity-" + (++identitySeq);
  const full: PersonIdentity = { id, createdAt: now, updatedAt: now, ...record };
  identitiesById.set(id, full);
  identitiesByNaturalKey.set(record.tenantId + "::" + record.contactReference, id);
  return full;
}

export function findById(id: string): PersonIdentity | undefined {
  return identitiesById.get(id);
}

const followUpContextsByPerson = new Map<string, FollowUpContextRecord>();
let followUpSeq = 0;

export function insertFollowUpContext(
  record: Omit<FollowUpContextRecord, "id" | "createdAt" | "confirmedAt">
): FollowUpContextRecord {
  const now = new Date().toISOString();
  const full: FollowUpContextRecord = {
    id: "followup-" + (++followUpSeq),
    createdAt: now,
    confirmedAt: now,
    ...record,
  };
  followUpContextsByPerson.set(record.personId, full);
  return full;
}

export function findFollowUpContextForPerson(personId: string): FollowUpContextRecord | undefined {
  return followUpContextsByPerson.get(personId);
}

export function _clearForTests(): void {
  identitiesById.clear();
  identitiesByNaturalKey.clear();
  identitySeq = 0;
  followUpContextsByPerson.clear();
  followUpSeq = 0;
}
