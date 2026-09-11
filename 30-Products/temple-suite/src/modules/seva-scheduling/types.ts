export interface SevaBooking {
  id: string;
  personId: string;
  sevaType: string;
  scheduledFor: string;
  tenantId: string;
  createdAt: string;
}

export interface RecordSevaBookingInput {
  personId: string;
  sevaType: string;
  scheduledFor: string;
  tenantId: string;
}

/** The one domain event this module defines (TSAAS-002 section 6, Seva Scheduling row). */
export interface SevaBookedPayload {
  eventId: string;
  bookingId: string;
  personId: string;
  sevaType: string;
  scheduledFor: string;
  tenantId: string;
  occurredAt: string;
}
