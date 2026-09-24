/**
 * POA - MOTHERSHIP DOGFOODING SLICE 001: read-only repository -> runtime
 * path for POA-ADR-001 and POA-PJR-001.
 *
 * Record counts are never asserted exactly - both sources are append-only
 * and will grow. Known records are asserted present instead.
 */
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Server } from "node:http";
import {
  AUTHORITATIVE_SOURCES,
  findRepositoryRoot,
  loadRepositoryRecords,
  parseDecisionRecords,
  parseProjectRegistry,
  type DecisionRecord,
  type FeedResult,
  type ProjectRegistry,
  type RepositoryRecords,
} from "../server/repository-records.ts";
import { createMothershipState } from "../server/state.ts";
import { seedDemoData } from "../server/seed.ts";
import { createMothershipHttpServer } from "../server/http.ts";
import * as api from "../server/api.ts";
import { __resetWitnessForTests } from "@/witness";

const git = (cwd: string, args: string[]) =>
  execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const repoRoot = findRepositoryRoot(import.meta.dirname);
const headCommit = git(repoRoot, ["rev-parse", "HEAD"]).trim();
const committedBlob = (path: string) => git(repoRoot, ["show", `HEAD:${path}`]).replace(/\r\n/g, "\n");
const sourceStatus = () => git(repoRoot, ["status", "--porcelain", "--", ...Object.values(AUTHORITATIVE_SOURCES)]);

function unwrap<T>(feed: FeedResult<T>): T {
  if (!feed.ok) throw new Error(`feed unavailable: ${feed.detail}`);
  return feed.value;
}

let records: RepositoryRecords;
let decisionRecords: DecisionRecord[];
let projectRegistry: ProjectRegistry;
let statusBeforeLoad: string;

beforeAll(() => {
  statusBeforeLoad = sourceStatus();
  records = loadRepositoryRecords(repoRoot);
  decisionRecords = unwrap(records.decisionRecords);
  projectRegistry = unwrap(records.projectRegistry);
});

describe("1. POA-ADR-001 is consumed", () => {
  it("exposes known dated Decision Records", () => {
    const gap001 = decisionRecords.find((r) => r.title === "GAP-001 Identifier Convention Decision Record");
    expect(gap001?.date).toBe("2026-08-23");
    expect(gap001?.sections.length).toBeGreaterThan(0);
    expect(decisionRecords.some((r) => r.title === "OPV-002 Acceptance Record")).toBe(true);
    for (const record of decisionRecords) expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("excludes the specification preamble from the records", () => {
    expect(decisionRecords.some((r) => ["POA-ADR-001", "A. Purpose", "Result"].includes(r.title))).toBe(false);
  });

  it("passes every section through verbatim", () => {
    const blob = committedBlob(AUTHORITATIVE_SOURCES.decisionRecords);
    for (const record of decisionRecords) {
      expect(blob).toContain(record.preamble);
      for (const section of record.sections) {
        expect(blob).toContain(`## ${section.heading}`);
        expect(blob).toContain(section.body);
      }
    }
  });
});

describe("2. POA-PJR-001 is consumed", () => {
  it("exposes the registry entries and addenda", () => {
    const headings = projectRegistry.entries.map((e) => e.repositoryReference.heading);
    expect(headings).toEqual(expect.arrayContaining(["Entry 1 — IEP Website", "Entry 2 — PDF Compressor (\"SHARP\")", "Entry 3 — Temple SaaS"]));
    expect(projectRegistry.addenda.length).toBeGreaterThan(0);
    for (const addendum of projectRegistry.addenda) expect(addendum.repositoryReference.heading).toMatch(/^Addendum/);
  });

  it("preserves every field value, and so every confidence marker, verbatim", () => {
    const blob = committedBlob(AUTHORITATIVE_SOURCES.projectRegistry);
    for (const entry of projectRegistry.entries) {
      for (const { field, value } of entry.fields) expect(blob).toContain(`| ${field} | ${value} |`);
    }
    for (const addendum of projectRegistry.addenda) expect(blob).toContain(addendum.body);

    const temple = projectRegistry.entries.find((e) => e.repositoryReference.heading === "Entry 3 — Temple SaaS");
    const lifecycle = temple?.fields.find((f) => f.field === "Lifecycle state")?.value;
    expect(lifecycle).toContain("SELF-DECLARED, UNVERIFIED");
  });

  it("admits no entity without a registry entry (D-C: no HR SaaS)", () => {
    expect(JSON.stringify(projectRegistry)).not.toContain("HR SaaS");
  });
});

describe("3. Repository-derived facts are read-only", () => {
  it("is deeply frozen", () => {
    const entry = projectRegistry.entries[0];
    expect(() => {
      (entry.fields[0] as { value: string }).value = "tampered";
    }).toThrow(TypeError);
    expect(() => {
      (decisionRecords as unknown[]).push({});
    }).toThrow(TypeError);
    expect(Object.isFrozen(decisionRecords[0].repositoryReference)).toBe(true);
    expect(Object.isFrozen(records.projectRegistry)).toBe(true);
  });

  it("does not modify either source", () => {
    expect(sourceStatus()).toBe(statusBeforeLoad);
  });

  describe("reads committed content only, each feed independently (temporary repository)", () => {
    let tempRepo: string;
    const adr = "# POA-ADR-001\n\n# A. Purpose\n\nSpec.\n\n# Example Decision Record (2026-01-02)\n\nIntro.\n\n## 1. Decision\n\nCommitted text.\n";
    const pjr = "# POA-PJR-001\n\n## Schema\n\nSchema.\n\n## Entry 1 — Example\n\n| Field | Value |\n|---|---|\n| Project identity | Example |\n";
    const commit = (message: string) =>
      git(tempRepo, ["-c", "user.name=test", "-c", "user.email=test@example.invalid", "commit", "-q", "-m", message]);
    const write = (path: string, text: string) => writeFileSync(join(tempRepo, path), text);

    beforeAll(() => {
      tempRepo = mkdtempSync(join(tmpdir(), "poa-repository-records-"));
      git(tempRepo, ["init", "-q"]);
      for (const [path, text] of [
        [AUTHORITATIVE_SOURCES.decisionRecords, adr],
        [AUTHORITATIVE_SOURCES.projectRegistry, pjr],
      ]) {
        mkdirSync(join(tempRepo, path, ".."), { recursive: true });
        write(path, text);
      }
    });

    afterAll(() => rmSync(tempRepo, { recursive: true, force: true }));

    it("reports an uncommitted source unavailable without blocking the committed one", () => {
      git(tempRepo, ["add", AUTHORITATIVE_SOURCES.decisionRecords]);
      commit("adr only");
      const loaded = loadRepositoryRecords(tempRepo);
      expect(loaded.decisionRecords.ok).toBe(true);
      expect(loaded.projectRegistry.ok).toBe(false);
    });

    it("serves the committed blob, not a working-tree edit", () => {
      git(tempRepo, ["add", AUTHORITATIVE_SOURCES.projectRegistry]);
      commit("registry");
      write(AUTHORITATIVE_SOURCES.decisionRecords, adr.replace("Committed text.", "Uncommitted edit."));

      const loaded = loadRepositoryRecords(tempRepo);
      const serialized = JSON.stringify(unwrap(loaded.decisionRecords));
      expect(serialized).toContain("Committed text.");
      expect(serialized).not.toContain("Uncommitted edit.");
      expect(loaded.commit).toBe(git(tempRepo, ["rev-parse", "HEAD"]).trim());
    });

    it("a malformed POA-ADR-001 does not take down the project registry", () => {
      write(AUTHORITATIVE_SOURCES.decisionRecords, `${adr}\n# Stray Heading\n\nNot a record.\n`);
      git(tempRepo, ["add", AUTHORITATIVE_SOURCES.decisionRecords]);
      commit("malformed adr");

      const loaded = loadRepositoryRecords(tempRepo);
      expect(loaded.decisionRecords).toMatchObject({ ok: false, detail: expect.stringContaining("Stray Heading") });
      expect(unwrap(loaded.projectRegistry).entries[0].fields).toEqual([{ field: "Project identity", value: "Example" }]);
    });
  });
});

describe("4. Source identity is preserved", () => {
  it("attaches a Repository Reference (path, commit, heading) to every fact", () => {
    const items = [...decisionRecords, ...projectRegistry.entries, ...projectRegistry.addenda];
    const allowed = Object.values(AUTHORITATIVE_SOURCES) as string[];
    for (const { repositoryReference: ref } of items) {
      expect(allowed).toContain(ref.path);
      expect(ref.commit).toBe(headCommit);
      expect(committedBlob(ref.path)).toMatch(new RegExp(`^#{1,2} ${ref.heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
    }
    expect(decisionRecords[0].repositoryReference.path).toBe(AUTHORITATIVE_SOURCES.decisionRecords);
    expect(projectRegistry.entries[0].repositoryReference.path).toBe(AUTHORITATIVE_SOURCES.projectRegistry);
  });
});

describe("5. Fixture data cannot masquerade as repository data", () => {
  it("loading records leaves the fixture runtime untouched, and fixtures never enter the feeds", () => {
    __resetWitnessForTests();
    const state = createMothershipState();
    seedDemoData(state);
    const orgsBefore = JSON.stringify(state.runtime.identity.listOrganizations());
    const originsBefore = JSON.stringify([...state.missionOrigin]);

    state.repositoryRecords = { ok: true, records: loadRepositoryRecords(repoRoot) };

    expect(JSON.stringify(state.runtime.identity.listOrganizations())).toBe(orgsBefore);
    expect(JSON.stringify([...state.missionOrigin])).toBe(originsBefore);

    const feeds = JSON.stringify(state.repositoryRecords.records);
    for (const fixtureId of ["mission-demo-", "mission-beta-", "org-paravyoma", "org-beta", "Demo Organization", "agent-materializer"]) {
      expect(feeds).not.toContain(fixtureId);
    }
  });

  it("an unloaded runtime reports the feeds unavailable instead of serving anything else", () => {
    const state = createMothershipState();
    seedDemoData(state);
    expect(state.repositoryRecords).toEqual({ ok: false, detail: "NOT_LOADED" });
    expect(api.getDecisionRecords(state).status).toBe(503);
    expect(api.getProjectRegistry(state).status).toBe(503);
  });

  it("a failed feed returns 503 while the other feed is still served", () => {
    const state = createMothershipState();
    state.repositoryRecords = { ok: true, records: { ...records, decisionRecords: { ok: false, detail: "parse failure" } } };
    expect(api.getDecisionRecords(state)).toMatchObject({ status: 503, body: { code: "REPOSITORY_RECORDS_UNAVAILABLE", detail: "parse failure" } });
    expect(api.getProjectRegistry(state).status).toBe(200);
  });
});

describe("parser strictness (no silent drops)", () => {
  it("rejects an undated top-level heading after the first record", () => {
    const text = "# Spec\n\n# A Decision Record (2026-01-02)\n\n## 1. Decision\n\nx\n\n# Stray Heading\n\ny\n";
    expect(() => parseDecisionRecords(text, "p", "c")).toThrow(/Stray Heading/);
  });

  it("rejects an unrecognized registry section", () => {
    const text = "## Entry 1 — X\n\n| Field | Value |\n|---|---|\n| Project identity | X |\n\n## Observation 2026-09-01\n\nz\n";
    expect(() => parseProjectRegistry(text, "p", "c")).toThrow(/Observation 2026-09-01/);
  });

  it("rejects a registry row that is not exactly field | value", () => {
    const text = "## Entry 1 — X\n\n| Field | Value |\n|---|---|\n| Project identity | X | extra |\n";
    expect(() => parseProjectRegistry(text, "p", "c")).toThrow(/exactly two cells/);
  });
});

describe("HTTP exposure", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    __resetWitnessForTests();
    const state = createMothershipState();
    seedDemoData(state);
    state.repositoryRecords = { ok: true, records };
    for (let attempt = 1; attempt <= 5; attempt++) {
      server = createMothershipHttpServer(state);
      await new Promise<void>((resolve) => server.listen(0, resolve));
      const address = server.address();
      if (!address || typeof address !== "object") throw new Error("server failed to bind to a port");
      baseUrl = `http://127.0.0.1:${address.port}`;
      try {
        await fetch(`${baseUrl}/api/health`);
        return;
      } catch (error) {
        await new Promise<void>((resolve) => server.close(() => resolve()));
        if (attempt === 5) throw error;
      }
    }
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  const getJson = async (path: string): Promise<any> => (await fetch(`${baseUrl}${path}`)).json();

  it("serves both feeds with their Repository References", async () => {
    const decisions = await getJson("/api/repository/decision-records");
    expect(decisions.decisionRecords[0].repositoryReference.commit).toBe(headCommit);
    const registry = await getJson("/api/repository/project-registry");
    expect(registry.entries[0].repositoryReference.path).toBe(AUTHORITATIVE_SOURCES.projectRegistry);
  });

  it("offers no write path", async () => {
    for (const path of ["/api/repository/decision-records", "/api/repository/project-registry"]) {
      const res = await fetch(`${baseUrl}${path}`, { method: "POST", body: "{}" });
      expect(res.status).toBe(404);
    }
  });

  it("keeps the fixture mission list free of repository records", async () => {
    const body = await getJson("/api/organizations/org-paravyoma/missions");
    expect(body.missions.every((m: { origin: string }) => m.origin === "fixture")).toBe(true);
    expect(JSON.stringify(body)).not.toContain("repositoryReference");
  });
});
