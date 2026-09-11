import { describe, it, expect, beforeEach } from "vitest";
import { createOrGetPersonIdentity, getPersonIdentity, recordFollowUpAssignment, getFollowUpContext } from "@/modules/relationship-memory";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";
import { SYNTHETIC_PERSON_ONE } from "../fixtures/synthetic-data";
import * as store from "@/modules/relationship-memory/store";

beforeEach(() => {
  store._clearForTests();
});

describe("Relationship Memory", () => {
  it("creates a person identity with exactly the authorized minimal field set", () => {
    const identity = createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: SYNTHETIC_TENANT_ID });
    expect(identity.name).toBe(SYNTHETIC_PERSON_ONE.name);
    expect(identity.contactReference).toBe(SYNTHETIC_PERSON_ONE.contactReference);
    expect(identity.relationshipContextMarker).toBe(SYNTHETIC_PERSON_ONE.relationshipContextMarker);
    expect(identity.tenantId).toBe(SYNTHETIC_TENANT_ID);
    expect(identity.id).toBeTruthy();
    expect(identity.createdAt).toBeTruthy();
  });

  it("is idempotent: a repeated first contact for the same synthetic person does not create a duplicate identity", () => {
    const first = createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: SYNTHETIC_TENANT_ID });
    const second = createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: SYNTHETIC_TENANT_ID });
    expect(second.id).toBe(first.id);
  });

  it("rejects any tenant other than the one synthetic tenant authorized for this slice", () => {
    expect(() =>
      createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: "some-other-tenant" })
    ).toThrow();
  });

  it("getPersonIdentity returns the stored record by id", () => {
    const created = createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: SYNTHETIC_TENANT_ID });
    expect(getPersonIdentity(created.id)).toEqual(created);
  });

  it("records a follow-up-context fact only via recordFollowUpAssignment, and it is the authoritative record", () => {
    const identity = createOrGetPersonIdentity({ ...SYNTHETIC_PERSON_ONE, tenantId: SYNTHETIC_TENANT_ID });
    expect(getFollowUpContext(identity.id)).toBeUndefined();
    const followUp = recordFollowUpAssignment({
      personId: identity.id,
      tenantId: SYNTHETIC_TENANT_ID,
      assignedMentorId: "synthetic-mentor-001",
      sourceRecommendationId: "recommendation-test-1",
    });
    expect(followUp.assignedMentorId).toBe("synthetic-mentor-001");
    expect(getFollowUpContext(identity.id)).toEqual(followUp);
  });
});
