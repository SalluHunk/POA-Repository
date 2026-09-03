/**
 * Module-internal persistence. No other module may import this file
 * directly -- enforced by test/architecture-boundary.test.ts.
 */
import type { JourneyStageRecord } from "./types";

const stagesByPerson = new Map<string, JourneyStageRecord[]>();
const processedDomainEventIds = new Set<string>();
let seq = 0;

export function hasProcessed(domainEventId: string): boolean {
  return processedDomainEventIds.has(domainEventId);
}

export function insert(record: Omit<JourneyStageRecord, "id" | "createdAt">): JourneyStageRecord {
  processedDomainEventIds.add(record.sourceDomainEventId);
  const full: JourneyStageRecord = { id: "journey-" + (++seq), createdAt: new Date().toISOString(), ...record };
  const list = stagesByPerson.get(record.personId) ?? [];
  list.push(full);
  stagesByPerson.set(record.personId, list);
  return full;
}

export function getStagesForPerson(personId: string): readonly JourneyStageRecord[] {
  return stagesByPerson.get(personId) ?? [];
}

export function _clearForTests(): void {
  stagesByPerson.clear();
  processedDomainEventIds.clear();
  seq = 0;
}
