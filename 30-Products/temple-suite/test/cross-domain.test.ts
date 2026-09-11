import { describe, it, expect, beforeEach } from "vitest";
import { runSyntheticFirstContactFlow, runSyntheticSevaBookingFlow } from "@/app";
import { getJourneyStagesForPerson, getSevaJourneyEvidenceForPerson } from "@/modules/dgp";
import { getRegistration } from "@/modules/events";
import { getSevaHistory } from "@/modules/seva-scheduling";
import {
  SYNTHETIC_PERSON_ONE,
  SYNTHETIC_PILOT_EVENT_ID,
  SYNTHETIC_SEVA_TYPE,
  SYNTHETIC_SEVA_SLOT,
} from "../fixtures/synthetic-data";
import { getAuditLog, clearAuditLogForTests } from "@/shared/audit";
import * as rmStore from "@/modules/relationship-memory/store";
import * as eventsStore from "@/modules/events/store";
import * as dgpStore from "@/modules/dgp/store";
import * as sevaStore from "@/modules/seva-scheduling/store";

beforeEach(() => {
  rmStore._clearForTests();
  eventsStore._clearForTests();
  dgpStore._clearForTests();
  sevaStore._clearForTests();
  clearAuditLogForTests();
});

/**
 * DGP-DEV-006 mission directive section 6: "the most important test in
 * the mission." Person A is run through BOTH independent domain-event
 * chains -- Events -> EventRegistrationCaptured -> DGP -> journey stage,
 * and Seva Scheduling -> SevaBooked -> DGP -> seva journey evidence --
 * and the test proves DGP aggregates both without collision, duplication,
 * or ownership violation.
 */
describe("DGP-DEV-006: cross-domain proof -- Events and Seva Scheduling evidence for the same person", () => {
  it("both domains' evidence coexist for Person A without collision or overwrite", () => {
    const eventsResult = runSyntheticFirstContactFlow({
      ...SYNTHETIC_PERSON_ONE,
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
    });
    const personId = eventsResult.identity.id;

    // Events evidence exists before the Seva flow runs at all.
    expect(getJourneyStagesForPerson(personId)).toHaveLength(1);
    expect(getJourneyStagesForPerson(personId)[0].stage).toBe("Registration");

    const sevaResult = runSyntheticSevaBookingFlow({
      personId,
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
    });

    // Events evidence is retained, unmodified, after the Seva flow runs.
    const stagesAfterSeva = getJourneyStagesForPerson(personId);
    expect(stagesAfterSeva).toHaveLength(1);
    expect(stagesAfterSeva[0].stage).toBe("Registration");
    expect(stagesAfterSeva[0].sourceDomainEventId).toBe(eventsResult.journeyStages[0].sourceDomainEventId);

    // Seva evidence is retained.
    const sevaEvidence = getSevaJourneyEvidenceForPerson(personId);
    expect(sevaEvidence).toHaveLength(1);
    expect(sevaEvidence[0].sevaType).toBe(SYNTHETIC_SEVA_TYPE);
    expect(sevaEvidence).toEqual(sevaResult.sevaJourneyEvidence);

    // The two records do not collide: distinct domain-event ids, distinct record ids.
    expect(stagesAfterSeva[0].sourceDomainEventId).not.toBe(sevaEvidence[0].sourceDomainEventId);
    expect(stagesAfterSeva[0].id).not.toBe(sevaEvidence[0].id);

    // DGP aggregates both, correctly attributed to the one person.
    expect(stagesAfterSeva[0].personId).toBe(personId);
    expect(sevaEvidence[0].personId).toBe(personId);

    // Both domains retain their own authoritative ownership boundary:
    // Events still owns the registration record, Seva Scheduling still
    // owns the booking record -- DGP holds only its own derived evidence.
    expect(getRegistration(eventsResult.registration.id)).toEqual(eventsResult.registration);
    expect(getSevaHistory(personId)).toEqual([sevaResult.booking]);

    // Audit trail shows both domains' writes plus DGP's two independent evidence writes.
    const actions = getAuditLog().map((a) => a.action);
    expect(actions).toContain("EventRegistrationCaptured");
    expect(actions).toContain("JourneyStageUpdated");
    expect(actions).toContain("SevaBooked");
    expect(actions).toContain("SevaJourneyEvidenceRecorded");
  });

  it("running the Seva flow first, then the Events flow, still produces both records without collision (order independence)", () => {
    const identity = runSyntheticFirstContactFlow({
      ...SYNTHETIC_PERSON_ONE,
      pilotEventId: SYNTHETIC_PILOT_EVENT_ID,
    }).identity;
    // Reset only the domain-event stores, not the identity, to isolate order effects
    // on the two domain-event chains while keeping the same personId.
    eventsStore._clearForTests();
    dgpStore._clearForTests();
    sevaStore._clearForTests();

    runSyntheticSevaBookingFlow({
      personId: identity.id,
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
    });
    expect(getJourneyStagesForPerson(identity.id)).toHaveLength(0);
    expect(getSevaJourneyEvidenceForPerson(identity.id)).toHaveLength(1);

    runSyntheticFirstContactFlow({ ...SYNTHETIC_PERSON_ONE, pilotEventId: SYNTHETIC_PILOT_EVENT_ID });
    expect(getJourneyStagesForPerson(identity.id)).toHaveLength(1);
    expect(getSevaJourneyEvidenceForPerson(identity.id)).toHaveLength(1);
  });
});
