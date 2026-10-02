/**
 * POA-LIFECYCLE-LEDGER-001 - lifecycle ledger tests.
 *
 * Boundary: ratified Mission Package POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE (S4, S5 sources,
 * S6 pinning, S7 fields, S8 UNKNOWN codes, S9 schema, S13 evidence EV-1..EV-9).
 *
 * LIMITATION: "The ledger is an observation of repository evidence, not a reconstruction of
 * organizational reality." Passing these tests shows the derivation behaves as specified on
 * synthetic inputs and on throw-away temp repositories; it shows nothing about any real record.
 *
 * This file is the only place that reads fixtures and the only place that may hold the
 * forbidden-term lists used by the static guards (EV-4). Temp repositories live only under the
 * OS temp directory.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { SOURCES, canonicalJson, deriveLedger, listH1 } from "@/lifecycle-ledger";
import { runLedger } from "@/lifecycle-ledger-git";

const FIXTURE_DIR = path.resolve(import.meta.dirname, "fixtures/lifecycle-ledger");
const SRC_DIR = path.resolve(import.meta.dirname, "../src");
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const AUTHORED_FROM = "POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE";
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

function assertMarkers(doc: unknown, label: string): void {
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) throw new Error(`${label}: not a JSON object`);
  const d = doc as Record<string, unknown>;
  if (d.fixtureClass !== "SYNTHETIC") throw new Error(`${label}: fixtureClass must be SYNTHETIC`);
  if (d.authoredFrom !== AUTHORED_FROM) throw new Error(`${label}: authoredFrom marker missing or wrong`);
}
function load(file: string): any {
  const doc = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, file), "utf8"));
  assertMarkers(doc, file);
  return doc;
}
const manifest = load("manifest.json") as { cases: { caseId: string; file: string }[] };
/** Fixtures carry no heading hashes; the harness derives them exactly as the reader does. */
function withHashes(input: any): any {
  if (input === null || typeof input !== "object" || !Array.isArray(input.adrHistory) || input.adrHistory.length === 0) return input;
  const last = input.adrHistory[input.adrHistory.length - 1];
  return { ...input, h1Sha256: listH1(String(last.text)).map((h) => sha256(h.line)) };
}
const at = (obj: any, p: string): any => p.split(".").reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), obj);

describe("harness loader and manifest", () => {
  it("refuses documents lacking the synthetic markers", () => {
    expect(() => assertMarkers({}, "x")).toThrow();
    expect(() => assertMarkers({ fixtureClass: "REAL", authoredFrom: AUTHORED_FROM }, "x")).toThrow();
    expect(() => assertMarkers({ fixtureClass: "SYNTHETIC", authoredFrom: "other" }, "x")).toThrow();
    expect(() => assertMarkers({ fixtureClass: "SYNTHETIC", authoredFrom: AUTHORED_FROM }, "x")).not.toThrow();
  });
  it("manifest and fixture directory agree exactly, within the 20-case cap", () => {
    const files = fs.readdirSync(FIXTURE_DIR).filter((f) => f !== "manifest.json");
    expect(manifest.cases.map((c) => c.file).sort()).toEqual([...files].sort());
    expect(manifest.cases.length).toBeLessThanOrEqual(20);
  });
});

describe("case ledger: fixture expectation vs actual derivation", () => {
  it.each(manifest.cases.map((c) => [c.caseId, c.file] as const))("%s", (_id, file) => {
    const doc = load(file);
    const r = deriveLedger(withHashes(doc.input));
    expect(r.ok, `${doc.caseId} ok`).toBe(doc.expect.ok);
    if (!r.ok) return expect(r.error).toBe(doc.expect.error);
    for (const [p, want] of Object.entries(doc.expect.paths ?? {})) expect(at(r.ledger, p), `${doc.caseId} ${p}`).toEqual(want);
    for (const s of doc.expect.absent ?? []) expect(canonicalJson(r.ledger).includes(s), `${doc.caseId} must not contain ${s}`).toBe(false);
  });
});

describe("invariants", () => {
  const full = load("L01-full-lifecycle.json").input;
  it("is deterministic (byte-identical), canonical (sorted keys) and carries the non-authority constants", () => {
    const a = deriveLedger(withHashes(full));
    const b = deriveLedger(withHashes(full));
    if (!a.ok || !b.ok) throw new Error("expected ok");
    expect(canonicalJson(a.ledger)).toBe(canonicalJson(b.ledger));
    const sorted = (v: unknown): boolean => (Array.isArray(v) ? v.every(sorted) : v && typeof v === "object" ? Object.keys(v).join() === Object.keys(v).sort().join() && Object.values(v).every(sorted) : true);
    expect(sorted(JSON.parse(canonicalJson(a.ledger)))).toBe(true);
    expect(a.ledger).toMatchObject({ derivedObservation: true, authoritative: false, authorizationImplied: false, writes: [], ledgerVersion: "0" });
    expect(canonicalJson(a.ledger)).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:/);
  });
  it("does not mutate its input", () => {
    const input = withHashes(full);
    const before = JSON.stringify(input);
    deriveLedger(input);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("is total over hostile inputs (never throws; always refuses)", () => {
    const proto = JSON.parse('{"__proto__":{"x":1},"constructor":{"prototype":{}},"pin":"x"}');
    const hostile: unknown[] = [null, undefined, 0, NaN, "x", "x".repeat(100000), [], [[]], {}, { pin: "x" }, proto, () => 1, Symbol("s"), 10n, { ...full, adrHistory: "no" }, { ...withHashes(full), sources: null }, { ...withHashes(full), h1Sha256: ["zz"] }, { ...withHashes(full), execHistory: ["nope"] }];
    for (const h of hostile) expect(deriveLedger(h).ok).toBe(false);
  });
});

// ---------------------------------------------------------------- reader on temp repositories (EV-5, EV-6)

const GIT = ["-c", "user.name=syn", "-c", "user.email=syn@example.invalid", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false"];
function git(dir: string, ...args: string[]): string {
  const r = spawnSync("git", [...GIT, ...args], { cwd: dir, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr}`);
  return r.stdout.trim();
}
const H = ["# POA-R-001 — SYNTHETIC one (2026-01-01)", "# POA-STD-011 Approval — SYNTHETIC two (2026-01-02)", "# Execution Architecture Standing Rulings R-A, R-B, R-C — SYNTHETIC (2026-01-03)", "# POA-SEA-IMPL-001 — SYNTHETIC mission (2026-01-04)"];
const adrText = (n: number, sha = "") => "# A. Purpose\n\nsynthetic\n\n" + H.slice(0, n).map((h, i) => (i === 3 ? `${h}\n\nArtifact: \`${SOURCES.pkg}\`. Implementation commit SHA: \`${sha}\`.\n\n` : `${h}\n\nbody\n\n`)).join("");
const REC = ["Identity and authority", "Starting state", "Ending state", "Execution profile", "Files changed", "Commands and results", "Content hashes", "Stop-condition table", "Evidence-gate", "Limitations", "Interpretation points", "Pointers"].map((h) => `## ${h}\n\nx\n`).join("\n");
function write(dir: string, rel: string, text: string) {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  fs.writeFileSync(path.join(dir, rel), text);
}
function makeRepo(): { dir: string; pin: string; impl: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "syn-ledger-"));
  git(dir, "init", "-q");
  write(dir, SOURCES.adr, adrText(3));
  git(dir, "add", "-A"); git(dir, "commit", "-q", "-m", "records");
  write(dir, SOURCES.pkg, "# Pkg\n\n**Status:** RATIFIED — synthetic\n");
  write(dir, SOURCES.exec, "# Exec\n\n" + REC);
  git(dir, "add", "-A"); git(dir, "commit", "-q", "-m", "impl");
  const impl = git(dir, "rev-parse", "HEAD");
  write(dir, SOURCES.adr, adrText(4, impl));
  write(dir, SOURCES.exec, "# Exec\n\n" + REC + "\n## Acceptance Record\n\nx\n\n## Acceptance Recorded\n\nx\n");
  git(dir, "add", "-A"); git(dir, "commit", "-q", "-m", "closure");
  return { dir, pin: git(dir, "rev-parse", "HEAD"), impl };
}

describe("pinned-blob reader on throw-away temp repositories", () => {
  it("derives the ledger from pinned blobs and finds the evidence", () => {
    const { dir, pin, impl } = makeRepo();
    const r = runLedger(dir, pin);
    if (!r.ok) throw new Error(r.error);
    const row = (r.ledger.rows as any[])[3];
    expect(row.implementationSha).toEqual({ state: "RECORDED", value: impl, ancestorOfPin: true });
    expect(row.evidencedStates).toEqual(["RATIFIED", "MATERIALIZED", "ACCEPTED"]);
    expect(row.ratifiedCommit).toBe(pin);
    expect((r.ledger.sources as any[]).map((s) => s.path)).toEqual([SOURCES.adr, SOURCES.pkg, SOURCES.exec]);
  });
  it("EV-5/EV-6: pinned: output unchanged by later commits and by uncommitted working-tree edits; reads leave the repository untouched", () => {
    const { dir, pin } = makeRepo();
    const snap = () => {
      const h = crypto.createHash("sha256");
      h.update(git(dir, "rev-parse", "HEAD")).update(fs.readFileSync(path.join(dir, ".git", "index"))).update(git(dir, "status", "--porcelain"));
      for (const f of [SOURCES.adr, SOURCES.pkg, SOURCES.exec]) h.update(fs.readFileSync(path.join(dir, f)));
      return h.digest("hex");
    };
    const first = runLedger(dir, pin);
    const before = snap();
    const again = runLedger(dir, pin);
    expect(snap()).toBe(before);
    if (!first.ok || !again.ok) throw new Error("expected ok");
    expect(canonicalJson(again.ledger)).toBe(canonicalJson(first.ledger));
    fs.appendFileSync(path.join(dir, SOURCES.adr), "# Uncommitted edit\n");
    write(dir, "unrelated.txt", "later");
    git(dir, "add", "unrelated.txt"); git(dir, "commit", "-q", "-m", "later");
    const later = runLedger(dir, pin);
    if (!later.ok) throw new Error(later.error);
    expect(canonicalJson(later.ledger)).toBe(canonicalJson(first.ledger));
  });
  it("refuses a non-40-hex pin, an unknown commit and a pin that is not in the ADR history", () => {
    const { dir } = makeRepo();
    expect(runLedger(dir, "HEAD")).toEqual({ ok: false, error: "PIN_NOT_40_HEX" });
    expect(runLedger(dir, "abc1234")).toEqual({ ok: false, error: "PIN_NOT_40_HEX" });
    expect(runLedger(dir, "0".repeat(40))).toEqual({ ok: false, error: "PIN_NOT_ANCESTOR_OF_HEAD" });
    write(dir, "unrelated.txt", "later");
    git(dir, "add", "unrelated.txt"); git(dir, "commit", "-q", "-m", "later");
    expect(runLedger(dir, git(dir, "rev-parse", "HEAD"))).toEqual({ ok: false, error: "PIN_NOT_IN_ADR_HISTORY" });
  });
});

// ---------------------------------------------------------------- static guards (EV-4)

const FILES = ["lifecycle-ledger.ts", "lifecycle-ledger-git.ts"].map((f) => ({ name: f, text: fs.readFileSync(path.join(SRC_DIR, f), "utf8") }));
const WRITE_APIS = ["writeFile", "appendFile", "mkdir", "rmSync", "rmdir", "unlink", "rename", "copyFile", "createWriteStream", "writeSync", "truncate", "symlink", "chmod", "utimes", "openSync"];
const READ_APIS = ["readFile", "readdir", "existsSync", "statSync", "createReadStream", "node:fs"];
const NET_MODEL = ["fetch(", "node:http", "node:https", "node:net", "WebSocket", "XMLHttpRequest", "openai", "anthropic", "Anthropic", "LLM"];
const GIT_WRITE_VERBS = ["add", "commit", "push", "pull", "fetch", "tag", "reset", "checkout", "merge", "rebase", "stash", "config", "branch", "clean", "rm", "mv", "apply", "cherry-pick", "revert", "restore", "switch", "init", "clone"];
const FORBIDDEN_NAMES = ["60-Organization-A", "PJR", "Business-Function-Map", "Source-Declaration"];
const ALLOWED_IMPORTS: Record<string, string[]> = {
  "lifecycle-ledger.ts": ["./lifecycle-verifier"],
  "lifecycle-ledger-git.ts": ["./lifecycle-ledger", "./lifecycle-verifier-git", "node:child_process", "node:crypto", "node:url"],
};
function guardViolations(name: string, text: string): string[] {
  const v: string[] = [];
  for (const api of WRITE_APIS) if (new RegExp(`\\b${api}`).test(text)) v.push(`${name}: write API ${api}`);
  for (const api of READ_APIS) if (text.includes(api)) v.push(`${name}: file-read API ${api}`);
  for (const t of NET_MODEL) if (text.includes(t)) v.push(`${name}: network/model token ${t}`);
  for (const verb of GIT_WRITE_VERBS) if (text.includes(`"${verb}"`)) v.push(`${name}: git verb literal "${verb}"`);
  for (const f of FORBIDDEN_NAMES) if (text.includes(f)) v.push(`${name}: forbidden name ${f}`);
  for (const m of text.matchAll(/\b(\d{2}-[A-Za-z][A-Za-z-]*\/[A-Za-z0-9._/-]+)/g)) if (!Object.values(SOURCES).includes(m[1] as never)) v.push(`${name}: path literal ${m[1]}`);
  return v;
}

describe("static guards over the two source files", () => {
  it("contain no write or file-read API, network/model token, git write verb, forbidden name or foreign path literal", () => {
    for (const f of FILES) expect(guardViolations(f.name, f.text)).toEqual([]);
  });
  it("import only the allowed modules, and the verifier only by its two named exports", () => {
    for (const f of FILES) expect(Array.from(f.text.matchAll(/from\s+"([^"]+)"/g)).map((m) => m[1]).sort(), f.name).toEqual([...ALLOWED_IMPORTS[f.name]].sort());
    expect(/import\s*\{([^}]*)\}\s*from\s*"\.\/lifecycle-verifier"/.exec(FILES[0].text)?.[1].trim()).toBe("REQUIRED_RECORD_HEADINGS");
    expect(/import\s*\{([^}]*)\}\s*from\s*"\.\/lifecycle-verifier-git"/.exec(FILES[1].text)?.[1].trim()).toBe("assertAllowedGit");
  });
  it("the core uses no clock, randomness, process or node module; every read is of a pinned <40-hex>:<path> blob", () => {
    for (const t of [/\bDate\b/, /Math\.random/, /\bprocess\b/, /require\(/, /node:/]) expect(t.test(FILES[0].text), String(t)).toBe(false);
    expect(FILES[1].text).not.toMatch(/"HEAD:/);
    expect(FILES[1].text).not.toMatch(/\[\s*"show"\s*,\s*"HEAD/);
  });
  it("guard negative control: the guard detects planted violations", () => {
    for (const bad of ['fs.writeFileSync("a","b")', 'import fs from "node:fs"', 'git(["commit"])', "await fetch(u)", "x = '40-Runtime/OTHER.md'", "PJR-001", "readFileSync(p)"]) expect(guardViolations("x", bad).length, bad).toBeGreaterThan(0);
  });
  it("does not touch index.ts, package.json or the Lifecycle Verifier (source, tests, fixtures)", () => {
    expect(fs.readFileSync(path.join(SRC_DIR, "index.ts"), "utf8")).not.toMatch(/lifecycle-ledger/);
    expect(fs.readFileSync(path.resolve(SRC_DIR, "../package.json"), "utf8")).not.toMatch(/lifecycle-ledger/);
    const r = spawnSync("git", ["diff", "HEAD", "--name-only", "--", "50-Mothership/src/lifecycle-verifier.ts", "50-Mothership/src/lifecycle-verifier-git.ts", "50-Mothership/test/lifecycle-verifier.test.ts", "50-Mothership/test/fixtures/lifecycle-verifier"], { cwd: REPO_ROOT, encoding: "utf8" });
    expect(r.stdout.trim()).toBe("");
  });
});

describe("fixture integrity", () => {
  it("every fixture is synthetic: fake SHAs only, no foreign path, no forbidden name, no real record text", () => {
    for (const c of manifest.cases) {
      const raw = JSON.stringify(load(c.file).input);
      for (const f of FORBIDDEN_NAMES) expect(raw.includes(f), `${c.file} ${f}`).toBe(false);
      for (const m of raw.matchAll(/\b(\d{2}-[A-Za-z][A-Za-z-]*\/[A-Za-z0-9._/-]+)/g)) expect([...Object.values(SOURCES), "40-Runtime/OTHER-MISSION-PACKAGE.md"], `${c.file} ${m[1]}`).toContain(m[1]);
      if (typeof load(c.file).input === "object") expect(raw.toLowerCase().includes("synthetic") || raw.includes("pinIsAncestorOfHead")).toBe(true);
    }
  });
});
