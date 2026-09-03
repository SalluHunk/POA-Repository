/**
 * Events is the sole authoritative owner and sole writer of the
 * event-registration record (TSAAS-002 section 6, Events row). This
 * module never creates or duplicates person-identity data -- it consumes
 * personId as a read-only reference produced by Relationship Memory.
 */
import { assertSyntheticTenant } from "@/shared/tenant";
import { recordAudit } from "@/shared/audit";
import { eventBus } from "@/shared/eventBus";
import * as store from "./store";
import type { EventRegistration, RegisterForEventInput, EventRegistrationCapturedPayload } from "./types";

export type { EventRegistration, RegisterForEventInput, EventRegistrationCapturedPayload };

export const EVENT_REGISTRATION_CAPTURED = "EventRegistrationCaptured";

let domainEventSeq = 0;

export function registerForEvent(input: RegisterForEventInput): EventRegistration {
  assertSyntheticTenant(input.tenantId);
  const registration = store.insert({
    personId: input.personId,
    pilotEventId: input.pilotEventId,
    tenantId: input.tenantId,
  });
  recordAudit({
    module: "events",
    action: "EventRegistrationCaptured",
    recordId: registration.id,
    tenantId: registration.tenantId,
  });

  const payload: EventRegistrationCapturedPayload = {
    eventId: "domevt-" + (++domainEventSeq),
    registrationId: registration.id,
    personId: registration.personId,
    pilotEventId: registration.pilotEventId,
    tenantId: registration.tenantId,
    occurredAt: registration.createdAt,
  };
  eventBus.emit<EventRegistrationCapturedPayload>(EVENT_REGISTRATION_CAPTURED, payload);

  return registration;
}

export function getRegistration(id: string): EventRegistration | undefined {
  return store.findById(id);
}
