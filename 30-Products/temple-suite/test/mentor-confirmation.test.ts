import { describe, it, expect, beforeEach } from "vitest";
import { runSyntheticFirstContactFlow, confirmMentorRecommendation } from "@/app";
import { getFollowUpContext } from "@/modules/relationship-memory";
import { SYNTHETIC_PERSON_ONE, SYNTHETIC_PILOT_EVENT_ID } from "../fixtures/synthetic-data";
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

describe("DGP-DEV-003: mentor recommendation is non-authoritative until human-confirmed", () => {
  it("a recommendation alone does not create an authoritative Relationship Memory fact", () => {
    const result = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    expect(result.mentorRecommendations).toHaveLength(1);
    // Non-authority: no follow-up context exists yet, even though a recommendation does.
    expect(getFollowUpContext(result.identity.id)).toBeUndefined();
  });

  it("confirmation is a separate action that produces the authoritative Relationship Memory update", () => {
    const result = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    const recommendation = result.mentorRecommendations[0];

    const followUp = confirmMentorRecommendation(recommendation.id);

    expect(followUp.personId).toBe(result.identity.id);
    expect(followUp.assignedMentorId).toBe(recommendation.recommendedMentorId);
    expect(followUp.sourceRecommendationId).toBe(recommendation.id);
    expect(getFollowUpContext(result.identity.id)).toEqual(followUp);
  });

  it("confirming an unknown recommendation id throws rather than silently creating a fact", () => {
    expect(() => confirmMentorRecommendation("recommendation-does-not-exist")).toThrow();
  });

  it("demonstrates the full multi-domain orchestration chain: Relationship Memory -> Events -> DGP -> Recommendation -> Confirmation -> Relationship Memory", () => {
    const result = runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });

    // Relationship Memory: identity created.
    expect(result.identity.id).toBeTruthy();
    // Events: registration owned and recorded by Events, referencing the RM identity.
    expect(result.registration.personId).toBe(result.identity.id);
    // DGP: journey stage recorded from the Events-originated domain event.
    expect(result.journeyStages).toHaveLength(1);
    // DGP: mentor recommendation produced from the same domain event.
    expect(result.mentorRecommendations).toHaveLength(1);

    // Human confirmation: a distinct, separately-invoked action.
    const followUp = confirmMentorRecommendation(result.mentorRecommendations[0].id);

    // Relationship Memory: the confirmed fact is now authoritative there, and only there.
    expect(getFollowUpContext(result.identity.id)).toEqual(followUp);

    const actions = getAuditLog().map((a) => a.action);
    expect(actions).toContain("PersonIdentityCreated");
    expect(actions).toContain("EventRegistrationCaptured");
    expect(actions).toContain("JourneyStageUpdated");
    expect(actions).toContain("MentorMatchRecommended");
    expect(actions).toContain("FollowUpAssignmentRecorded");
  });
});
