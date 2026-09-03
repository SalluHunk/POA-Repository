/**
 * Relationship Memory is the sole authoritative owner and sole writer of
 * the person-identity record (TSAAS-DEC-002 Decision 1/6; TSAAS-002
 * section 6). Idempotent by design: identity is created at most once per
 * (tenantId, contactReference) pair, satisfying TSAAS-DEC-002 Decision 6
 * (Relationship Memory is authoritative regardless of first-touch entry
 * point) and DGP-DEV-001 Phase B acceptance test #6.
 */
import { assertSyntheticTenant } from "@/shared/tenant";
import { recordAudit } from "@/shared/audit";
import * as store from "./store";
import type { PersonIdentity, CreateOrGetIdentityInput } from "./types";

export type { PersonIdentity, CreateOrGetIdentityInput };

export function createOrGetPersonIdentity(input: CreateOrGetIdentityInput): PersonIdentity {
  assertSyntheticTenant(input.tenantId);
  const existing = store.findByNaturalKey(input.tenantId, input.contactReference);
  if (existing) {
    return existing;
  }
  const created = store.insert({
    name: input.name,
    contactReference: input.contactReference,
    relationshipContextMarker: input.relationshipContextMarker,
    tenantId: input.tenantId,
  });
  recordAudit({
    module: "relationship-memory",
    action: "PersonIdentityCreated",
    recordId: created.id,
    tenantId: created.tenantId,
  });
  return created;
}

export function getPersonIdentity(id: string): PersonIdentity | undefined {
  return store.findById(id);
}
