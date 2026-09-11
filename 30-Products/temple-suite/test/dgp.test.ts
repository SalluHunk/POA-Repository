import { describe, it, expect, beforeEach } from "vitest";
import {
  getJourneyStagesForPerson,
  getMentorRecommendationsForPerson,
  getSevaJourneyEvidenceForPerson,
  MENTOR_MATCH_RECOMMENDED,
} from "@/modules/dgp";
import "@/modules/dgp";
import { registerForEvent, EVENT_REGISTRATION_CAPTURED } from "@/modules/events";
import type { EventRegistrationCapturedPayload } from "@/modules/events";
import { recordSevaBooking, SEVA_BOOKED } from "@/modules/seva-scheduling";
import type { SevaBookedPayload } from "@/modules/seva-scheduling";
import { eventBus } from "@/shared/eventBus";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";
import { SYNTHETIC_PILOT_EVENT_ID, SYNTHETIC_SEVA_TYPE, SYNTHETIC_SEVA_SLOT } from "../fixtures/synthetic-data";
import * as dgpStore from "@/modules/dgp/store";
import * as eventsStore from "@/modules/events/store";
import * as sevaStore from "@/modules/seva-scheduling/store";

beforeEach(() => {
  dgpStore._clearForTests();
  eventsStore._clearForTests();
  sevaStore._clearForTests();
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

  it("produces exactly one non-authoritative mentor recommendation per registration event, from the deterministic synthetic pool", () => {
    registerForEvent({
      personId: "identity-test-6",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    const recs = getMentorRecommendationsForPerson("identity-test-6");
    expect(recs).toHaveLength(1);
    expect(recs[0].recommendedMentorId).toMatch(/^synthetic-mentor-\d{3}$/);
    expect(recs[0].tenantId).toBe(SYNTHETIC_TENANT_ID);
  });

  it("emits MentorMatchRecommended on the shared event bus", () => {
    const received: unknown[] = [];
    eventBus.on(MENTOR_MATCH_RECOMMENDED, (payload) => {
      received.push(payload);
    });
    registerForEvent({
      personId: "identity-test-7",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(received).toHaveLength(1);
  });

  it("DGP-DEV-003 Phase 6: actually redelivering the identical registration event does not create a duplicate journey-stage or recommendation record", () => {
    const captured: EventRegistrationCapturedPayload[] = [];
    eventBus.on<EventRegistrationCapturedPayload>(EVENT_REGISTRATION_CAPTURED, (payload) => {
      captured.push(payload);
    });

    registerForEvent({
      personId: "identity-test-8",
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getJourneyStagesForPerson("identity-test-8")).toHaveLength(1);
    expect(getMentorRecommendationsForPerson("identity-test-8")).toHaveLength(1);
    expect(captured).toHaveLength(1);

    // Redeliver the EXACT SAME captured payload (same eventId) a second time,
    // simulating a broker/at-least-once redelivery of the identical message --
    // not a second, distinct registration.
    eventBus.emit<EventRegistrationCapturedPayload>(EVENT_REGISTRATION_CAPTURED, captured[0]);

    expect(getJourneyStagesForPerson("identity-test-8")).toHaveLength(1);
    expect(getMentorRecommendationsForPerson("identity-test-8")).toHaveLength(1);
  });

  it("DGP-DEV-006: records seva journey evidence upon consuming SevaBooked", () => {
    recordSevaBooking({
      personId: "identity-test-seva-dgp-1",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    const evidence = getSevaJourneyEvidenceForPerson("identity-test-seva-dgp-1");
    expect(evidence).toHaveLength(1);
    expect(evidence[0].sevaType).toBe(SYNTHETIC_SEVA_TYPE);
    expect(evidence[0].tenantId).toBe(SYNTHETIC_TENANT_ID);
  });

  it("DGP-DEV-006: a SevaBooked event produces zero mentor recommendations (mission directive section 10)", () => {
    recordSevaBooking({
      personId: "identity-test-seva-dgp-2",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getMentorRecommendationsForPerson("identity-test-seva-dgp-2")).toHaveLength(0);
  });

  it("DGP-DEV-006: actually redelivering the identical SevaBooked event twice does not create duplicate seva journey evidence", () => {
    const captured: SevaBookedPayload[] = [];
    eventBus.on<SevaBookedPayload>(SEVA_BOOKED, (payload) => {
      captured.push(payload);
    });

    recordSevaBooking({
      personId: "identity-test-seva-dgp-3",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getSevaJourneyEvidenceForPerson("identity-test-seva-dgp-3")).toHaveLength(1);
    expect(captured).toHaveLength(1);

    // Deliver the exact same captured payload (same eventId) a second time,
    // then a third time -- genuine redelivery, not a simulated duplicate.
    eventBus.emit<SevaBookedPayload>(SEVA_BOOKED, captured[0]);
    eventBus.emit<SevaBookedPayload>(SEVA_BOOKED, captured[0]);

    expect(getSevaJourneyEvidenceForPerson("identity-test-seva-dgp-3")).toHaveLength(1);
  });
});
