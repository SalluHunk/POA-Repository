/**
 * System-recordable journey stages only, per DGP-DEV-001 Phase B section
 * "SLICE BOUNDARY". Belonging and later stages require human judgement
 * (POA-PJR-003 section 6) and are structurally excluded.
 */
export type SystemRecordableJourneyStage = "Awareness" | "Visit" | "Registration";

export interface JourneyStageRecord {
  id: string;
  personId: string;
  tenantId: string;
  stage: SystemRecordableJourneyStage;
  sourceDomainEventId: string;
  createdAt: string;
}

/**
 * DGP-DEV-003: a mentor recommendation. Explicitly non-authoritative --
 * per TSAAS-DEC-002 Decision 5 / TSAAS-TECH-001 Decision 6, DGP may
 * recommend but never finalize. This record type has no "confirmed"
 * status field by construction: a confirmed fact lives only in
 * Relationship Memory's FollowUpContextRecord, never here.
 */
export interface MentorRecommendationRecord {
  id: string;
  personId: string;
  tenantId: string;
  recommendedMentorId: string;
  sourceDomainEventId: string;
  createdAt: string;
}

/**
 * DGP-DEV-006: evidence that a seva booking occurred for this person,
 * consumed read-only from Seva Scheduling's SevaBooked event. This is
 * deliberately NOT a SystemRecordableJourneyStage value. The canonical
 * 10-stage journey (POA-PJR-003 section 6) places "Service" -- the stage
 * seva participation would map to on that ladder -- past the
 * First-Association/Belonging human-judgement boundary, and section 8
 * names "seva participation" explicitly as evidence a human uses to
 * judge a transition, not as a transition the system computes itself.
 * Recording it as a distinct evidence type (rather than inventing a new
 * SystemRecordableJourneyStage literal, or misusing an existing one)
 * keeps that boundary intact: DGP surfaces the evidence; which canonical
 * stage it implies, if any, remains an open human-judgement question.
 */
export interface SevaJourneyEvidenceRecord {
  id: string;
  personId: string;
  tenantId: string;
  sevaType: string;
  sourceDomainEventId: string;
  createdAt: string;
}
