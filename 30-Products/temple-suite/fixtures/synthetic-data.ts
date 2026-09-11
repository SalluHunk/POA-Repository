/**
 * DGP-DEV-001 Phase B -- synthetic data ONLY. Every value below is
 * fictitious and was invented for this architecture-proving slice. None of
 * it refers to any real person, temple, client, or engagement. See the
 * materialization report section titled Synthetic-data verification.
 */
export const SYNTHETIC_PERSON_ONE = {
  name: "Synthetic Test Devotee One",
  contactReference: "synthetic-devotee-one@example.test",
  relationshipContextMarker: "synthetic-first-visit-note",
};

export const SYNTHETIC_PERSON_TWO = {
  name: "Synthetic Test Devotee Two",
  contactReference: "synthetic-devotee-two@example.test",
  relationshipContextMarker: "synthetic-second-visit-note",
};

export const SYNTHETIC_PILOT_EVENT_ID = "synthetic-pilot-event-001";

/** DGP-DEV-006 -- synthetic Seva Scheduling fixtures. Fixed, not derived from new Date(), per deterministic-behavior convention. */
export const SYNTHETIC_SEVA_TYPE = "synthetic-seva-type-flower-offering";
export const SYNTHETIC_SEVA_SLOT = "2026-01-01T06:00:00.000Z";
