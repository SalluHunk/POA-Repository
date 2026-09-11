/**
 * DGP-DEV-009: a generic, domain-agnostic SQLite connection helper. This
 * file (and everything else DGP-DEV-009 adds under `persistence.ts` /
 * `persistent-orchestrator.ts`) deliberately avoids the `@/` path alias
 * and extension-less imports the rest of this codebase uses, because the
 * restart-survival tests (mission section 9) must invoke this code as a
 * genuine separate OS process via a plain `node` invocation -- which
 * understands neither tsconfig path aliases nor bundler-style extension
 * resolution, only plain relative imports with an explicit extension.
 * See IMPLEMENTATION.md for the full rationale.
 *
 * This module carries zero domain knowledge (no table names, no
 * schema). Schema ownership stays with each module's own
 * `persistence.ts`, per mission section 7.
 */
import { DatabaseSync } from "node:sqlite";

export function openDurableDatabase(filePath: string): DatabaseSync {
  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

export function closeDurableDatabase(db: DatabaseSync): void {
  db.close();
}
