/**
 * Relationship Memory is the sole authoritative owner and sole writer of
 * the person-identity record AND the follow-up-context record
 * (TSAAS-DEC-002 Decision 1/6; TSAAS-002 section 6). Idempotent by design:
 * identity is created at most once per (tenantId, contactReference) pair.
 */
import { assertSyntheticTenant } from "@/shared/tenant";
import { recordAudit } from "@/shared/audit";
import * as store from "./store";
import type {
  PersonIdentity,
  CreateOrGetIdentityInput,
  FollowUpContextRecord,
  RecordFollowUpAssignmentInput,
} from "./types";

export type { PersonIdentity, CreateOrGetIdentityInput, FollowUpContextRecord, RecordFollowUpAssignmentInput };

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

/**
 * DGP-DEV-003. This is the ONLY function anywhere in the codebase that may
 * create a FollowUpContextRecord -- the authoritative, human-confirmed
 * fact of a mentor assignment. It is never called by DGP directly; only
 * the orchestration-level confirmation step (src/app.ts) calls it, after
 * a human-confirmation action.
 */
export function recordFollowUpAssignment(input: RecordFollowUpAssignmentInput): FollowUpContextRecord {
  assertSyntheticTenant(input.tenantId);
  const created = store.insertFollowUpContext({
    personId: input.personId,
    tenantId: input.tenantId,
    assignedMentorId: input.assignedMentorId,
    sourceRecommendationId: input.sourceRecommendationId,
  });
  recordAudit({
    module: "relationship-memory",
    action: "FollowUpAssignmentRecorded",
    recordId: created.id,
    tenantId: created.tenantId,
  });
  return created;
}

export function getFollowUpContext(personId: string): FollowUpContextRecord | undefined {
  return store.findFollowUpContextForPerson(personId);
}
