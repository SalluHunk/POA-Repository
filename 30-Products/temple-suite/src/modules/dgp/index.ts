/**
 * DGP is an orchestration domain, not a system of record for any other
 * module (TSAAS-002 section 6 / section 8). It consumes
 * EventRegistrationCaptured READ-ONLY through the event bus -- it never
 * queries the Events module store directly -- and writes ONLY its own
 * journey-stage and mentor-recommendation records. It never writes to the
 * Events registration record or to Relationship Memory's records.
 *
 * DGP-DEV-003: on the same event, DGP also produces a mentor
 * recommendation using a deterministic, non-AI synthetic mentor pool.
 * The recommendation is explicitly non-authoritative -- DGP has no write
 * interface into Relationship Memory at all, so it is structurally
 * incapable of finalizing a mentor relationship (TSAAS-DEC-002 Decision 5;
 * TSAAS-TECH-001 Decision 6).
 *
 * DGP-DEV-006: DGP additionally consumes SevaBooked READ-ONLY from Seva
 * Scheduling, a second and fully independent domain-event producer, and
 * writes ONLY its own SevaJourneyEvidenceRecord -- it never queries the
 * Seva Scheduling module store directly and never calls Seva
 * Scheduling's booking-write interface. The two producers' domain-event
 * ids never collide
 * (Events: "domevt-"; Seva Scheduling: "domevt-seva-"), so the shared
 * processed-event guard cannot mistake one producer's event for the
 * other's. This event deliberately does NOT trigger a mentor
 * recommendation (mission directive section 10).
 */
import { recordAudit } from "@/shared/audit";
import { eventBus } from "@/shared/eventBus";
import { EVENT_REGISTRATION_CAPTURED } from "@/modules/events";
import type { EventRegistrationCapturedPayload } from "@/modules/events";
import { SEVA_BOOKED } from "@/modules/seva-scheduling";
import type { SevaBookedPayload } from "@/modules/seva-scheduling";
import * as store from "./store";
import type { JourneyStageRecord, MentorRecommendationRecord, SevaJourneyEvidenceRecord } from "./types";

export type { JourneyStageRecord, MentorRecommendationRecord, SevaJourneyEvidenceRecord };

export const MENTOR_MATCH_RECOMMENDED = "MentorMatchRecommended";

interface MentorMatchRecommendedPayload {
  eventId: string;
  recommendationId: string;
  personId: string;
  tenantId: string;
  recommendedMentorId: string;
  occurredAt: string;
}

/** Deterministic, non-AI synthetic mentor pool -- proves the boundary, not mentor-selection intelligence. */
const SYNTHETIC_MENTOR_POOL = ["synthetic-mentor-001", "synthetic-mentor-002", "synthetic-mentor-003"] as const;
let mentorPickSeq = 0;

function pickSyntheticMentor(): string {
  const mentor = SYNTHETIC_MENTOR_POOL[mentorPickSeq % SYNTHETIC_MENTOR_POOL.length];
  mentorPickSeq += 1;
  return mentor;
}

function handleEventRegistrationCaptured(payload: EventRegistrationCapturedPayload): void {
  if (store.hasProcessed(payload.eventId)) {
    return;
  }
  store.markProcessed(payload.eventId);

  const stageRecord = store.insertJourneyStage({
    personId: payload.personId,
    tenantId: payload.tenantId,
    stage: "Registration",
    sourceDomainEventId: payload.eventId,
  });
  recordAudit({
    module: "dgp",
    action: "JourneyStageUpdated",
    recordId: stageRecord.id,
    tenantId: stageRecord.tenantId,
  });

  const recommendation = store.insertMentorRecommendation({
    personId: payload.personId,
    tenantId: payload.tenantId,
    recommendedMentorId: pickSyntheticMentor(),
    sourceDomainEventId: payload.eventId,
  });
  recordAudit({
    module: "dgp",
    action: "MentorMatchRecommended",
    recordId: recommendation.id,
    tenantId: recommendation.tenantId,
  });
  eventBus.emit<MentorMatchRecommendedPayload>(MENTOR_MATCH_RECOMMENDED, {
    eventId: "domevt-mentor-" + recommendation.id,
    recommendationId: recommendation.id,
    personId: recommendation.personId,
    tenantId: recommendation.tenantId,
    recommendedMentorId: recommendation.recommendedMentorId,
    occurredAt: recommendation.createdAt,
  });
}

eventBus.on<EventRegistrationCapturedPayload>(EVENT_REGISTRATION_CAPTURED, handleEventRegistrationCaptured);

/**
 * DGP-DEV-006: a second, independent handler for a second, independent
 * domain event producer. Deliberately does NOT call pickSyntheticMentor()
 * or produce a MentorRecommendationRecord -- mission directive section 10
 * explicitly excludes SevaBooked -> Mentor Recommendation from this
 * slice's scope. This handler only ever writes to DGP's own
 * SevaJourneyEvidenceRecord store; it never touches Seva Scheduling's or
 * Relationship Memory's records.
 */
function handleSevaBooked(payload: SevaBookedPayload): void {
  if (store.hasProcessed(payload.eventId)) {
    return;
  }
  store.markProcessed(payload.eventId);

  const evidence = store.insertSevaJourneyEvidence({
    personId: payload.personId,
    tenantId: payload.tenantId,
    sevaType: payload.sevaType,
    sourceDomainEventId: payload.eventId,
  });
  recordAudit({
    module: "dgp",
    action: "SevaJourneyEvidenceRecorded",
    recordId: evidence.id,
    tenantId: evidence.tenantId,
  });
}

eventBus.on<SevaBookedPayload>(SEVA_BOOKED, handleSevaBooked);

export function getJourneyStagesForPerson(personId: string): readonly JourneyStageRecord[] {
  return store.getStagesForPerson(personId);
}

export function getSevaJourneyEvidenceForPerson(personId: string): readonly SevaJourneyEvidenceRecord[] {
  return store.getSevaJourneyEvidenceForPerson(personId);
}

export function getMentorRecommendationsForPerson(personId: string): readonly MentorRecommendationRecord[] {
  return store.getRecommendationsForPerson(personId);
}

export function getMentorRecommendation(id: string): MentorRecommendationRecord | undefined {
  return store.findRecommendationById(id);
}
