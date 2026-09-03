/**
 * System-recordable journey stages only, per DGP-DEV-001 Phase B section
 * "SLICE BOUNDARY". Belonging and later stages require human judgement
 * (POA-PJR-003 section 6) and are structurally excluded -- there is no
 * value this type can take that represents them.
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
