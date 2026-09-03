/**
 * DGP-DEV-001 Phase B orchestration entry point. Demonstrates the full
 * slice end to end: Synthetic First Contact -> Relationship Memory
 * Identity -> Events Registration -> Domain Event -> DGP Journey Stage.
 *
 * This file is NOT itself a module -- it only calls the public interface
 * each module exports, exactly as any future API/UI layer would
 * (TSAAS-002 section 11).
 */
import { createOrGetPersonIdentity } from "@/modules/relationship-memory";
import { registerForEvent } from "@/modules/events";
import { getJourneyStagesForPerson } from "@/modules/dgp";
import "@/modules/dgp";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";

export interface SyntheticFirstContactInput {
  name: string;
  contactReference: string;
  relationshipContextMarker: string;
  pilotEventId: string;
}

export function runSyntheticFirstContactFlow(input: SyntheticFirstContactInput) {
  const identity = createOrGetPersonIdentity({
    name: input.name,
    contactReference: input.contactReference,
    relationshipContextMarker: input.relationshipContextMarker,
    tenantId: SYNTHETIC_TENANT_ID,
  });

  const registration = registerForEvent({
    personId: identity.id,
    pilotEventId: input.pilotEventId,
    tenantId: SYNTHETIC_TENANT_ID,
  });

  const journeyStages = getJourneyStagesForPerson(identity.id);

  return { identity, registration, journeyStages };
}
