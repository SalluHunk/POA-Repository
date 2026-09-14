/**
 * DGP-DEV-009: the restart-survival harness. This file is invoked
 * DIRECTLY by Node as a brand-new OS process -- `node
 * test/persistence-harness.ts <command> <dbFilePath> ...args` -- never
 * imported into the vitest process. Every invocation starts with zero
 * in-memory state: no module of this codebase has ever run in this
 * process before. Whatever a command reports came only from the SQLite
 * file at <dbFilePath>, written by a PRIOR, now-exited process. This is
 * what makes the restart tests (test/persistence-restart.test.ts)
 * evidence of "new process reading durable state," not "new in-memory
 * object" (mission section 9).
 *
 * Deliberately plain relative imports with explicit ".ts" extensions,
 * no "@/" alias -- see src/shared/db.ts's header.
 */
import { openDurableDatabase, closeDurableDatabase } from "../src/shared/db.ts";
import {
  initDurableSchema,
  createIdentityDurable,
  bookEventRegistrationDurable,
  bookSevaDurable,
  getIdentityDurable,
  getEventRegistrationsDurable,
  getEventRegistrationByDomainEventIdDurable,
  getSevaBookingsDurable,
  getJourneyStagesDurable,
  getSevaJourneyEvidenceDurable,
} from "../src/shared/persistent-orchestrator.ts";

function printJson(value: unknown): void {
  process.stdout.write(JSON.stringify(value) + "\n");
}

function fail(message: string): never {
  process.stderr.write("HARNESS ERROR: " + message + "\n");
  process.exit(1);
}

const [, , command, dbPath, ...rest] = process.argv;

if (!command || !dbPath) {
  fail("usage: node persistence-harness.ts <command> <dbPath> ...args");
}

const db = openDurableDatabase(dbPath);

try {
  switch (command) {
    case "init": {
      initDurableSchema(db);
      printJson({ ok: true });
      break;
    }
    case "create-identity": {
      initDurableSchema(db);
      const [tenantId, contactReference, name, marker] = rest;
      printJson(createIdentityDurable(db, { tenantId, contactReference, name, relationshipContextMarker: marker }));
      break;
    }
    case "get-identity": {
      const [tenantId, contactReference] = rest;
      printJson(getIdentityDurable(db, tenantId, contactReference) ?? null);
      break;
    }
    case "book-event": {
      initDurableSchema(db);
      const [tenantId, contactReference, name, marker, pilotEventId, domainEventId] = rest;
      const result = bookEventRegistrationDurable(db, {
        tenantId,
        contactReference,
        name,
        relationshipContextMarker: marker,
        pilotEventId,
        domainEventId,
      });
      printJson(result);
      break;
    }
    case "book-seva": {
      initDurableSchema(db);
      const [tenantId, contactReference, name, marker, sevaType, scheduledFor, domainEventId] = rest;
      const result = bookSevaDurable(db, {
        tenantId,
        contactReference,
        name,
        relationshipContextMarker: marker,
        sevaType,
        scheduledFor,
        domainEventId,
      });
      printJson(result);
      break;
    }
    case "get-registrations": {
      const [tenantId, personId] = rest;
      printJson(getEventRegistrationsDurable(db, tenantId, personId));
      break;
    }
    case "get-registration-by-domain-event": {
      const [tenantId, domainEventId] = rest;
      printJson(getEventRegistrationByDomainEventIdDurable(db, tenantId, domainEventId) ?? null);
      break;
    }
    case "get-seva-bookings": {
      const [tenantId, personId] = rest;
      printJson(getSevaBookingsDurable(db, tenantId, personId));
      break;
    }
    case "get-journey": {
      const [tenantId, personId] = rest;
      printJson(getJourneyStagesDurable(db, tenantId, personId));
      break;
    }
    case "get-seva-evidence": {
      const [tenantId, personId] = rest;
      printJson(getSevaJourneyEvidenceDurable(db, tenantId, personId));
      break;
    }
    default:
      fail("unknown command: " + command);
  }
} finally {
  closeDurableDatabase(db);
}
