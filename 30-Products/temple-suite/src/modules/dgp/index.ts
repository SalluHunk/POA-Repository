/**
 * DGP is an orchestration domain, not a system of record for any other
 * module (TSAAS-002 section 6 / section 8). It consumes
 * EventRegistrationCaptured READ-ONLY through the event bus -- it never
 * queries the Events module store directly -- and writes ONLY its own
 * journey-stage record. It never writes to the Events registration
 * record or to the Relationship Memory identity record.
 *
 * For this slice, a registration is treated as first-contact evidence for
 * the registering person and is recorded at the Registration stage.
 * Fabricating intermediate Awareness/Visit records with no corresponding
 * evidence would misrepresent what was actually observed, so only the
 * evidenced stage is written. Belonging and later stages are structurally
 * unreachable -- see types.ts.
 */
import { recordAudit } from "@/shared/audit";
import { eventBus } from "@/shared/eventBus";
import { EVENT_REGISTRATION_CAPTURED } from "@/modules/events";
import type { EventRegistrationCapturedPayload } from "@/modules/events";
import * as store from "./store";
import type { JourneyStageRecord } from "./types";

export type { JourneyStageRecord };

function handleEventRegistrationCaptured(payload: EventRegistrationCapturedPayload): void {
  if (store.hasProcessed(payload.eventId)) {
    return;
  }
  const record = store.insert({
    personId: payload.personId,
    tenantId: payload.tenantId,
    stage: "Registration",
    sourceDomainEventId: payload.eventId,
  });
  recordAudit({
    module: "dgp",
    action: "JourneyStageUpdated",
    recordId: record.id,
    tenantId: record.tenantId,
  });
}

eventBus.on<EventRegistrationCapturedPayload>(EVENT_REGISTRATION_CAPTURED, handleEventRegistrationCaptured);

export function getJourneyStagesForPerson(personId: string): readonly JourneyStageRecord[] {
  return store.getStagesForPerson(personId);
}
