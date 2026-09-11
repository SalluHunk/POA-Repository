/**
 * DGP-DEV-001/003 orchestration entry point. Demonstrates the full slice
 * end to end: Synthetic First Contact -> Relationship Memory Identity ->
 * Events Registration -> Domain Event -> DGP Journey Stage + Mentor
 * Recommendation -> Human Confirmation -> Relationship Memory Follow-Up
 * Context.
 *
 * This file is NOT itself a module -- it only calls the public interface
 * each module exports, exactly as any future API/UI layer would
 * (TSAAS-002 section 11). The confirmMentorRecommendation function below
 * IS the explicit authority transition DGP-DEV-003 Phase 4 requires: a
 * separate action, external to both DGP and Relationship Memory, standing
 * in for a human decision -- matching TSAAS-002 section 8's own flow
 * diagram ("Human decision where required" sits between DGP's
 * recommendation output and the resulting domain action).
 */
import { createOrGetPersonIdentity, recordFollowUpAssignment } from "@/modules/relationship-memory";
import type { FollowUpContextRecord } from "@/modules/relationship-memory";
import { registerForEvent } from "@/modules/events";
import { recordSevaBooking } from "@/modules/seva-scheduling";
import {
  getJourneyStagesForPerson,
  getMentorRecommendationsForPerson,
  getMentorRecommendation,
  getSevaJourneyEvidenceForPerson,
} from "@/modules/dgp";
import "@/modules/dgp";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";

export interface SyntheticFirstContactInput {
  name: string;
  contactReference: string;
  relationshipContextMarker: string;
  pilotEventId: string;
}

export function runSyntheticFirstContactFlow(input: SyntheticFirstContactInput) {
  const identity = createOrGetPersonIdentity({
    name: input.name,
    contactReference: input.contactReference,
    relationshipContextMarker: input.relationshipContextMarker,
    tenantId: SYNTHETIC_TENANT_ID,
  });

  const registration = registerForEvent({
    personId: identity.id,
    pilotEventId: input.pilotEventId,
    tenantId: SYNTHETIC_TENANT_ID,
  });

  const journeyStages = getJourneyStagesForPerson(identity.id);
  const mentorRecommendations = getMentorRecommendationsForPerson(identity.id);

  return { identity, registration, journeyStages, mentorRecommendations };
}

/**
 * The human-confirmation step. DGP cannot call this on its own -- it has
 * no import of Relationship Memory's write interface at all. Only this
 * orchestration-level function, invoked as a distinct, separately-taken
 * action, may cause the authoritative Relationship Memory write.
 */
export function confirmMentorRecommendation(recommendationId: string): FollowUpContextRecord {
  const recommendation = getMentorRecommendation(recommendationId);
  if (!recommendation) {
    throw new Error("No such mentor recommendation: " + recommendationId);
  }
  return recordFollowUpAssignment({
    personId: recommendation.personId,
    tenantId: recommendation.tenantId,
    assignedMentorId: recommendation.recommendedMentorId,
    sourceRecommendationId: recommendation.id,
  });
}

/**
 * DGP-DEV-006: exercises the second, independent domain-event chain
 * (Seva Scheduling -> SevaBooked -> DGP) for an EXISTING identity. Takes
 * a personId rather than creating a new identity itself, so the cross-
 * domain test (test/cross-domain.test.ts) can call this after
 * runSyntheticFirstContactFlow for the same synthetic person and prove
 * both domains' evidence coexist without collision.
 */
export interface SyntheticSevaBookingInput {
  personId: string;
  sevaType: string;
  scheduledFor: string;
}

export function runSyntheticSevaBookingFlow(input: SyntheticSevaBookingInput) {
  const booking = recordSevaBooking({
    personId: input.personId,
    sevaType: input.sevaType,
    scheduledFor: input.scheduledFor,
    tenantId: SYNTHETIC_TENANT_ID,
  });

  const sevaJourneyEvidence = getSevaJourneyEvidenceForPerson(input.personId);

  return { booking, sevaJourneyEvidence };
}
