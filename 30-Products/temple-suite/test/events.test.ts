import { describe, it, expect, beforeEach } from "vitest";
import { registerForEvent, getRegistration, EVENT_REGISTRATION_CAPTURED } from "@/modules/events";
import { eventBus } from "@/shared/eventBus";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";
import { SYNTHETIC_PILOT_EVENT_ID } from "../fixtures/synthetic-data";
import * as store from "@/modules/events/store";

beforeEach(() => {
  store._clearForTests();
});

describe("Events", () => {
  it("creates an event registration owned solely by the Events module", () => {
    const registration = registerForEvent({
      personId: "identity-test-1",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(registration.id).toBeTruthy();
    expect(getRegistration(registration.id)).toEqual(registration);
  });

  it("emits EventRegistrationCaptured on successful registration", () => {
    const received: unknown[] = [];
    eventBus.on(EVENT_REGISTRATION_CAPTURED, (payload) => {
      received.push(payload);
    });
    const registration = registerForEvent({
      personId: "identity-test-2",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(received).toHaveLength(1);
    expect((received[0] as { registrationId: string }).registrationId).toBe(registration.id);
  });
});
