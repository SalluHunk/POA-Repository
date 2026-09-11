/**
 * Seva Scheduling is the sole authoritative owner and sole writer of the
 * seva-booking record (TSAAS-002 section 6, Seva Scheduling row). This
 * module never creates or duplicates person-identity data -- it consumes
 * personId as a read-only reference produced by Relationship Memory, the
 * same convention the Events module already established.
 */
import { assertSyntheticTenant } from "@/shared/tenant";
import { recordAudit } from "@/shared/audit";
import { eventBus } from "@/shared/eventBus";
import * as store from "./store";
import type { SevaBooking, RecordSevaBookingInput, SevaBookedPayload } from "./types";

export type { SevaBooking, RecordSevaBookingInput, SevaBookedPayload };

export const SEVA_BOOKED = "SevaBooked";

/**
 * DGP-DEV-006: this module's own domain-event id sequence, prefixed
 * distinctly ("domevt-seva-") from the Events module's ("domevt-"). DGP's
 * processed-event guard (src/modules/dgp/store.ts) is a single Set shared
 * across every domain-event producer; a colliding id from two independent
 * producers would cause a genuine SevaBooked delivery to be silently
 * dropped as a false "already processed" redelivery. The distinct prefix
 * is what makes non-collision provable rather than merely likely -- see
 * test/cross-domain.test.ts.
 */
let domainEventSeq = 0;

export function recordSevaBooking(input: RecordSevaBookingInput): SevaBooking {
  assertSyntheticTenant(input.tenantId);
  const booking = store.insert({
    personId: input.personId,
    sevaType: input.sevaType,
    scheduledFor: input.scheduledFor,
    tenantId: input.tenantId,
  });
  recordAudit({
    module: "seva-scheduling",
    action: "SevaBooked",
    recordId: booking.id,
    tenantId: booking.tenantId,
  });

  const payload: SevaBookedPayload = {
    eventId: "domevt-seva-" + (++domainEventSeq),
    bookingId: booking.id,
    personId: booking.personId,
    sevaType: booking.sevaType,
    scheduledFor: booking.scheduledFor,
    tenantId: booking.tenantId,
    occurredAt: booking.createdAt,
  };
  eventBus.emit<SevaBookedPayload>(SEVA_BOOKED, payload);

  return booking;
}

export function getSevaHistory(personId: string): readonly SevaBooking[] {
  return store.findAllForPerson(personId);
}
