export interface EventRegistration {
  id: string;
  personId: string;
  pilotEventId: string;
  tenantId: string;
  createdAt: string;
}

export interface RegisterForEventInput {
  personId: string;
  pilotEventId: string;
  tenantId: string;
}

/** The one domain event this slice defines (TSAAS-002 section 6, Events row). */
export interface EventRegistrationCapturedPayload {
  eventId: string;
  registrationId: string;
  personId: string;
  pilotEventId: string;
  tenantId: string;
  occurredAt: string;
}
