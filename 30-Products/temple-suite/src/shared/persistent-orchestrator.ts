/**
 * DGP-DEV-009: the durable-path orchestrator. Plays exactly the role
 * src/app.ts plays for the in-memory system -- it calls only each
 * module's own persistence functions, never reaches into another
 * module's table, and never bypasses a module's idempotency guard. It is
 * NOT itself a module and owns no table.
 *
 * The idempotency guard is checked FIRST, before any domain record or
 * journey-evidence row is written, and the whole orchestrated action
 * (identity get-or-create + domain record + DGP evidence) is gated by
 * ONE domainEventId per call -- mirroring mission section 8's required
 * sequence exactly: process event E once; persist the guard; a replay
 * of the SAME event id short-circuits before any write.
 */
import type { DatabaseSync } from "node:sqlite";
import { runInTransaction } from "./db.ts";
import * as rm from "../modules/relationship-memory/persistence.ts";
import * as events from "../modules/events/persistence.ts";
import * as seva from "../modules/seva-scheduling/persistence.ts";
import * as dgp from "../modules/dgp/persistence.ts";
import type { PersonIdentity } from "../modules/relationship-memory/types.ts";
import type { EventRegistration } from "../modules/events/types.ts";
import type { SevaBooking } from "../modules/seva-scheduling/types.ts";
import type { JourneyStageRecord, SevaJourneyEvidenceRecord } from "../modules/dgp/types.ts";

/**
 * DGP-DEV-011 fault injection ONLY: inert in every real execution path.
 * Set only by test/persistence-transaction-atomicity.test.ts, on the
 * spawned harness child process's own environment, to force a genuine
 * process-exit crash at a named point mid-transaction -- never inside a
 * caught exception, so no COMMIT and no ROLLBACK can run afterward. This
 * is the mechanism mission section 8 requires ("do not merely assert
 * that a function throws"): the SAME transaction the real code opens is
 * the one left uncommitted, not a separate simulated one.
 */
function maybeCrashAt(point: string): void {
  if (process.env.DGP_DEV_011_CRASH_POINT === point) {
    process.exit(97);
  }
}

export function initDurableSchema(db: DatabaseSync): void {
  rm.ensureSchema(db);
  events.ensureSchema(db);
  seva.ensureSchema(db);
  dgp.ensureSchema(db);
}

export interface BookEventRegistrationDurableInput {
  tenantId: string;
  contactReference: string;
  name: string;
  relationshipContextMarker: string;
  pilotEventId: string;
  domainEventId: string;
}

export interface BookEventRegistrationDurableResult {
  identity: PersonIdentity;
  registration: EventRegistration;
  journeyStages: JourneyStageRecord[];
  wasAlreadyProcessed: boolean;
}

/**
 * DGP-DEV-011 atomicity boundary: the entire logical operation below --
 * identity get-or-create, the idempotency-guard check, and (when not
 * already processed) the domain-record write, journey-stage write, and
 * guard-mark -- runs inside ONE explicit transaction. Property being
 * proved (mission section 6): for one call to this function, either
 * every authoritative durable write it performs is committed, or none
 * of them remain committed -- including the identity row, so a crash
 * mid-sequence cannot leave even a lone surviving identity behind.
 */
export function bookEventRegistrationDurable(
  db: DatabaseSync,
  input: BookEventRegistrationDurableInput
): BookEventRegistrationDurableResult {
  return runInTransaction(db, () => {
    const identity = rm.createOrGetDurable(db, {
      tenantId: input.tenantId,
      contactReference: input.contactReference,
      name: input.name,
      relationshipContextMarker: input.relationshipContextMarker,
    });

    const wasAlreadyProcessed = dgp.hasProcessedDurable(db, input.tenantId, input.domainEventId);
    if (!wasAlreadyProcessed) {
      events.recordDurable(db, {
        tenantId: input.tenantId,
        personId: identity.id,
        pilotEventId: input.pilotEventId,
        domainEventId: input.domainEventId,
      });
      maybeCrashAt("after-domain-write");
      dgp.recordJourneyStageDurable(db, {
        tenantId: input.tenantId,
        personId: identity.id,
        stage: "Registration",
        sourceDomainEventId: input.domainEventId,
      });
      dgp.markProcessedDurable(db, input.tenantId, input.domainEventId);
    }

    const registration = events.findByDomainEventIdDurable(db, input.tenantId, input.domainEventId);
    if (!registration) {
      throw new Error("DGP-DEV-009 invariant violation: no registration found for domainEventId " + input.domainEventId);
    }
    const journeyStages = dgp.getJourneyStagesForPersonDurable(db, input.tenantId, identity.id);

    return { identity, registration, journeyStages, wasAlreadyProcessed };
  });
}

export interface BookSevaDurableInput {
  tenantId: string;
  contactReference: string;
  name: string;
  relationshipContextMarker: string;
  sevaType: string;
  scheduledFor: string;
  domainEventId: string;
}

export interface BookSevaDurableResult {
  identity: PersonIdentity;
  booking: SevaBooking;
  sevaJourneyEvidence: SevaJourneyEvidenceRecord[];
  wasAlreadyProcessed: boolean;
}

/**
 * DGP-DEV-011: same transaction boundary as bookEventRegistrationDurable,
 * applied for consistency (identical write-sequence shape, same
 * idempotency-guard table). Not independently crash-tested -- see the
 * mission report's Concurrency Boundary / Implemented-but-Unproven
 * sections. Proven only by code symmetry with the Events path.
 */
export function bookSevaDurable(db: DatabaseSync, input: BookSevaDurableInput): BookSevaDurableResult {
  return runInTransaction(db, () => {
    const identity = rm.createOrGetDurable(db, {
      tenantId: input.tenantId,
      contactReference: input.contactReference,
      name: input.name,
      relationshipContextMarker: input.relationshipContextMarker,
    });

    const wasAlreadyProcessed = dgp.hasProcessedDurable(db, input.tenantId, input.domainEventId);
    if (!wasAlreadyProcessed) {
      seva.recordDurable(db, {
        tenantId: input.tenantId,
        personId: identity.id,
        sevaType: input.sevaType,
        scheduledFor: input.scheduledFor,
        domainEventId: input.domainEventId,
      });
      dgp.recordSevaJourneyEvidenceDurable(db, {
        tenantId: input.tenantId,
        personId: identity.id,
        sevaType: input.sevaType,
        sourceDomainEventId: input.domainEventId,
      });
      dgp.markProcessedDurable(db, input.tenantId, input.domainEventId);
    }

    const booking = seva.findByDomainEventIdDurable(db, input.tenantId, input.domainEventId);
    if (!booking) {
      throw new Error("DGP-DEV-009 invariant violation: no seva booking found for domainEventId " + input.domainEventId);
    }
    const sevaJourneyEvidence = dgp.getSevaJourneyEvidenceForPersonDurable(db, input.tenantId, identity.id);

    return { identity, booking, sevaJourneyEvidence, wasAlreadyProcessed };
  });
}

export interface CreateIdentityDurableInput {
  tenantId: string;
  contactReference: string;
  name: string;
  relationshipContextMarker: string;
}

export function createIdentityDurable(db: DatabaseSync, input: CreateIdentityDurableInput): PersonIdentity {
  return rm.createOrGetDurable(db, input);
}

export function getIdentityDurable(db: DatabaseSync, tenantId: string, contactReference: string): PersonIdentity | undefined {
  return rm.findByNaturalKeyDurable(db, tenantId, contactReference);
}

export function getEventRegistrationsDurable(db: DatabaseSync, tenantId: string, personId: string): EventRegistration[] {
  return events.findAllForPersonDurable(db, tenantId, personId);
}

/**
 * DGP-DEV-011: read-only passthrough added so the crash-boundary test can
 * directly inspect durable state by domainEventId alone, without needing
 * a personId -- required specifically because a crashed, rolled-back
 * operation may leave no identity to look a person up by at all.
 */
export function getEventRegistrationByDomainEventIdDurable(
  db: DatabaseSync,
  tenantId: string,
  domainEventId: string
): EventRegistration | undefined {
  return events.findByDomainEventIdDurable(db, tenantId, domainEventId);
}

export function getSevaBookingsDurable(db: DatabaseSync, tenantId: string, personId: string): SevaBooking[] {
  return seva.findAllForPersonDurable(db, tenantId, personId);
}

export function getJourneyStagesDurable(db: DatabaseSync, tenantId: string, personId: string): JourneyStageRecord[] {
  return dgp.getJourneyStagesForPersonDurable(db, tenantId, personId);
}

export function getSevaJourneyEvidenceDurable(
  db: DatabaseSync,
  tenantId: string,
  personId: string
): SevaJourneyEvidenceRecord[] {
  return dgp.getSevaJourneyEvidenceForPersonDurable(db, tenantId, personId);
}
