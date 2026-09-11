/**
 * Module-internal persistence. No other module may import this file
 * directly -- enforced by test/architecture-boundary.test.ts.
 */
import type { JourneyStageRecord, MentorRecommendationRecord, SevaJourneyEvidenceRecord } from "./types";

const stagesByPerson = new Map<string, JourneyStageRecord[]>();
const recommendationsByPerson = new Map<string, MentorRecommendationRecord[]>();
const recommendationsById = new Map<string, MentorRecommendationRecord>();
const sevaEvidenceByPerson = new Map<string, SevaJourneyEvidenceRecord[]>();
const processedDomainEventIds = new Set<string>();
let stageSeq = 0;
let recommendationSeq = 0;
let sevaEvidenceSeq = 0;

/**
 * DGP-DEV-003: processed-state tracking is now separate from any single
 * record insert, since one domain event now produces TWO authoritative
 * side effects (a journey-stage record and a mentor recommendation). The
 * event handler marks an event processed exactly once, before creating
 * either record, so a genuine redelivery of the same event id is rejected
 * before touching either store.
 */
export function hasProcessed(domainEventId: string): boolean {
  return processedDomainEventIds.has(domainEventId);
}

export function markProcessed(domainEventId: string): void {
  processedDomainEventIds.add(domainEventId);
}

export function insertJourneyStage(record: Omit<JourneyStageRecord, "id" | "createdAt">): JourneyStageRecord {
  const full: JourneyStageRecord = { id: "journey-" + (++stageSeq), createdAt: new Date().toISOString(), ...record };
  const list = stagesByPerson.get(record.personId) ?? [];
  list.push(full);
  stagesByPerson.set(record.personId, list);
  return full;
}

export function getStagesForPerson(personId: string): readonly JourneyStageRecord[] {
  return stagesByPerson.get(personId) ?? [];
}

export function insertMentorRecommendation(
  record: Omit<MentorRecommendationRecord, "id" | "createdAt">
): MentorRecommendationRecord {
  const full: MentorRecommendationRecord = {
    id: "recommendation-" + (++recommendationSeq),
    createdAt: new Date().toISOString(),
    ...record,
  };
  recommendationsById.set(full.id, full);
  const list = recommendationsByPerson.get(record.personId) ?? [];
  list.push(full);
  recommendationsByPerson.set(record.personId, list);
  return full;
}

export function getRecommendationsForPerson(personId: string): readonly MentorRecommendationRecord[] {
  return recommendationsByPerson.get(personId) ?? [];
}

export function findRecommendationById(id: string): MentorRecommendationRecord | undefined {
  return recommendationsById.get(id);
}

export function insertSevaJourneyEvidence(
  record: Omit<SevaJourneyEvidenceRecord, "id" | "createdAt">
): SevaJourneyEvidenceRecord {
  const full: SevaJourneyEvidenceRecord = {
    id: "seva-evidence-" + (++sevaEvidenceSeq),
    createdAt: new Date().toISOString(),
    ...record,
  };
  const list = sevaEvidenceByPerson.get(record.personId) ?? [];
  list.push(full);
  sevaEvidenceByPerson.set(record.personId, list);
  return full;
}

export function getSevaJourneyEvidenceForPerson(personId: string): readonly SevaJourneyEvidenceRecord[] {
  return sevaEvidenceByPerson.get(personId) ?? [];
}

export function _clearForTests(): void {
  stagesByPerson.clear();
  recommendationsByPerson.clear();
  recommendationsById.clear();
  sevaEvidenceByPerson.clear();
  processedDomainEventIds.clear();
  stageSeq = 0;
  recommendationSeq = 0;
  sevaEvidenceSeq = 0;
}
