import { describe, it, expect, beforeEach } from "vitest";
import { getJourneyStagesForPerson } from "@/modules/dgp";
import "@/modules/dgp";
import { registerForEvent } from "@/modules/events";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";
import { SYNTHETIC_PILOT_EVENT_ID } from "../fixtures/synthetic-data";
import * as dgpStore from "@/modules/dgp/store";
import * as eventsStore from "@/modules/events/store";

beforeEach(() => {
  dgpStore._clearForTests();
  eventsStore._clearForTests();
});

describe("DGP", () => {
  it("records a system-recordable journey stage upon consuming EventRegistrationCaptured", () => {
    registerForEvent({
      personId: "identity-test-3",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    const stages = getJourneyStagesForPerson("identity-test-3");
    expect(stages).toHaveLength(1);
    expect(stages[0].stage).toBe("Registration");
    expect(stages[0].tenantId).toBe(SYNTHETIC_TENANT_ID);
  });

  it("never writes more than one stage record for a single non-redelivered registration event", () => {
    registerForEvent({
      personId: "identity-test-4",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getJourneyStagesForPerson("identity-test-4")).toHaveLength(1);
  });

  it("only ever produces stage values within the system-recordable set", () => {
    registerForEvent({
      personId: "identity-test-5",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    const stages = getJourneyStagesForPerson("identity-test-5");
    for (const s of stages) {
      expect(["Awareness", "Visit", "Registration"]).toContain(s.stage);
    }
  });
});
