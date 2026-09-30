/**
 * POA-ORG-DATA-REM-001 D5: regression protection for the repository-vs-
 * data-plane boundary (POA-DEC-ORG-KNOWLEDGE-001 S8.1) - KnowledgePlane
 * must never mutate Git-tracked governance directories.
 *
 * A meaningful test here is not "grep the source for fs imports" (that
 * proves nothing about behavior, and a future contributor could add an fs
 * call without ever re-reading this comment). Instead this snapshots the
 * actual on-disk state (path + size + mtime) of every governed directory
 * before and after a substantial battery of KnowledgePlane writes/reads,
 * and asserts byte-for-byte identical snapshots - so an accidental write,
 * touch, or file creation anywhere under these directories fails this
 * test, regardless of how it was introduced.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { IdentityRegistry } from "@/identity";
import { KnowledgePlane } from "@/knowledge-plane";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");
const GOVERNED_DIRS = ["10-Constitution", "20-Shared", "40-Runtime"];

interface Snapshot {
  path: string;
  size: number;
  mtimeMs: number;
}

function snapshot(dir: string): Snapshot[] {
  const entries: Snapshot[] = [];
  function walk(current: string) {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        entries.push({ path: full, size: stat.size, mtimeMs: stat.mtimeMs });
      }
    }
  }
  walk(dir);
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

describe("KnowledgePlane filesystem/Git isolation", () => {
  it("never mutates 10-Constitution/, 20-Shared/, or 40-Runtime/ across a full write/read battery", () => {
    const before = GOVERNED_DIRS.map((d) => ({ dir: d, files: snapshot(join(REPO_ROOT, d)) }));

    const identity = new IdentityRegistry();
    identity.registerOrganization("org-fs-isolation", "FS Isolation Test Org");
    const knowledge = new KnowledgePlane(identity);

    // A representative battery: record, supersede, relationship, DECISION
    // with authorityRef, and every read method - exercising every code
    // path that could plausibly touch disk if one were ever introduced.
    const first = knowledge.recordAssertion({
      organizationId: "org-fs-isolation",
      subjectRef: "project:isolation-probe",
      predicate: "status",
      value: "initial",
      kind: "SOURCE-OBSERVATION",
      basis: "SELF-DECLARED",
      freshness: "CURRENT",
      sourceAuthority: "AUTHORITATIVE",
      sensitivity: "SHOULD",
      provenance: { sourceRef: "manual-entry", producerId: "fs-isolation-test", evidenceRefs: [] },
      validFrom: "2026-09-30",
      observedAt: "2026-09-30T00:00:00.000Z",
    });
    expect(first.ok).toBe(true);
    if (first.ok) {
      knowledge.supersede(first.assertion.assertionId, { ...first.assertion, value: "updated" });
      knowledge.recordAssertion({
        ...first.assertion,
        predicate: "depends-on",
        value: "project:other",
        kind: "SOURCE-OBSERVATION",
      });
      knowledge.recordAssertion({
        ...first.assertion,
        kind: "DECISION",
        authorityRef: "human-commander",
      });
    }
    knowledge.listBySubject("org-fs-isolation", "project:isolation-probe");
    knowledge.listCurrent("org-fs-isolation");
    knowledge.getAsOfKnowledgeTime("org-fs-isolation", "project:isolation-probe", "status", new Date().toISOString());
    knowledge.getAsOfValidTime("org-fs-isolation", "project:isolation-probe", "status", "2026-09-30");

    const after = GOVERNED_DIRS.map((d) => ({ dir: d, files: snapshot(join(REPO_ROOT, d)) }));

    expect(after).toEqual(before);
  });
});
