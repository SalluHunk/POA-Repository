import { describe, it, expect, beforeEach } from "vitest";
import { runSyntheticFirstContactFlow } from "@/app";
import { SYNTHETIC_PERSON_ONE, SYNTHETIC_PERSON_TWO, SYNTHETIC_PILOT_EVENT_ID } from "../fixtures/synthetic-data";
import { getAuditLog, clearAuditLogForTests } from "@/shared/audit";
import * as rmStore from "@/modules/relationship-memory/store";
import * as eventsStore from "@/modules/events/store";
import * as dgpStore from "@/modules/dgp/store";

beforeEach(() => {
  rmStore._clearForTests();
  eventsStore._clearForTests();
  dgpStore._clearForTests();
  clearAuditLogForTests();
});

describe("DGP-DEV-001 Phase B end-to-end slice", () => {
  it("runs the full flow: identity, registration, domain event, journey stage", () => {
    const result = runSyntheticFirstContactFlow({
      ...SYNTHETIC_PERSON_ONE,
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
    });

    expect(result.identity.name).toBe(SYNTHETIC_PERSON_ONE.name);
    expect(result.registration.personId).toBe(result.identity.id);
    expect(result.journeyStages).toHaveLength(1);
    expect(result.journeyStages[0].stage).toBe("Registration");
    expect(result.journeyStages[0].personId).toBe(result.identity.id);

    const audit = getAuditLog();
    const actions = audit.map((a) => a.action);
    expect(actions).toContain("PersonIdentityCreated");
    expect(actions).toContain("EventRegistrationCaptured");
    expect(actions).toContain("JourneyStageUpdated");
  });

  it("does not create a duplicate identity for the same synthetic person registering twice", () => {
    const first = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    const second = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    expect(second.identity.id).toBe(first.identity.id);
  });

  it("keeps two different synthetic people as two distinct identities", () => {
    const one = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    const two = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_TWO, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    expect(one.identity.id).not.toBe(two.identity.id);
  });

  it("propagates the synthetic tenant discriminator onto every authoritative record", () => {
    const result = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    expect(result.identity.tenantId).toBeTruthy();
    expect(result.registration.tenantId).toBe(result.identity.tenantId);
    expect(result.journeyStages[0].tenantId).toBe(result.identity.tenantId);
  });
});
