/**
 * POA-SEA-IMPL-001 - Lifecycle Verifier tests.
 *
 * Boundary: ratified Mission Package POA-SEA-IMPL-001-MISSION-PACKAGE (S4 allowlist,
 * S7 contract, S8 fixtures, S9 evidence EV-1..EV-9, S10 completion matrix).
 *
 * LIMITATION: passing these tests is evidence that the verifier's structural checks
 * behave as specified on synthetic inputs and on throw-away temp repositories. It is
 * NOT evidence that any mission is authorized, correct or safe, and it does not
 * promote Envelope v0 to a standing standard.
 *
 * This file is the only place that reads fixtures and the only place that may hold
 * the forbidden-term lists used by the static guards (EV-4a). Temp repositories are
 * created only under the OS temp directory (package S8).
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { extractEnvelope, isMandatoryForbidden, readableRefs, verifyEnvelope, REQUIRED_RECORD_HEADINGS } from "@/lifecycle-verifier";
import { assertAllowedGit, verifyPackage } from "@/lifecycle-verifier-git";

const FIXTURE_DIR = path.resolve(import.meta.dirname, "fixtures/lifecycle-verifier");
const SRC_DIR = path.resolve(import.meta.dirname, "../src");
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const AUTHORED_FROM = "POA-SEA-IMPL-001-MISSION-PACKAGE";
const CHECK_IDS = ["V-1", "V-2", "V-3", "V-4", "V-5", "V-6", "V-7", "V-8", "V-9"];

// ---------------------------------------------------------------- harness loader

function assertSyntheticMarkers(doc: unknown, label: string): void {
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) throw new Error(`${label}: not a JSON object`);
  const d = doc as Record<string, unknown>;
  if (d.fixtureClass !== "SYNTHETIC") throw new Error(`${label}: fixtureClass must be SYNTHETIC`);
  if (d.authoredFrom !== AUTHORED_FROM) throw new Error(`${label}: authoredFrom marker missing or wrong`);
}
function loadJson(file: string): any {
  const doc = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, file), "utf8"));
  assertSyntheticMarkers(doc, file);
  return doc;
}
const manifest = loadJson("manifest.json") as { cases: { caseId: string; file: string; expectedOverall: string; expectedChecks: Record<string, string> }[] };
const fixtureFiles = fs.readdirSync(FIXTURE_DIR).filter((f) => f !== "manifest.json");

describe("harness loader and manifest", () => {
  it("refuses documents lacking the synthetic markers", () => {
    expect(() => assertSyntheticMarkers({}, "x")).toThrow();
    expect(() => assertSyntheticMarkers({ fixtureClass: "SYNTHETIC" }, "x")).toThrow();
    expect(() => assertSyntheticMarkers({ fixtureClass: "REAL", authoredFrom: AUTHORED_FROM }, "x")).toThrow();
    expect(() => assertSyntheticMarkers([], "x")).toThrow();
    expect(() => assertSyntheticMarkers({ fixtureClass: "SYNTHETIC", authoredFrom: AUTHORED_FROM }, "x")).not.toThrow();
  });
  it("manifest and fixture directory agree exactly", () => {
    expect(manifest.cases.map((c) => c.file).sort()).toEqual([...fixtureFiles].sort());
    expect(new Set(manifest.cases.map((c) => c.caseId)).size).toBe(manifest.cases.length);
  });
  it("every check has at least one PASS case and one FAIL case (V-8: a FLAG case)", () => {
    for (const id of CHECK_IDS) {
      const statuses = manifest.cases.map((c) => c.expectedChecks[id]).filter(Boolean);
      const expectFail = id === "V-8" ? "FLAG" : "FAIL";
      expect(statuses, `${id} pass-case`).toContain("PASS");
      expect(statuses, `${id} ${expectFail}-case`).toContain(expectFail);
    }
  });
});

// ---------------------------------------------------------------- case ledger (EV-1)

describe("case ledger: manifest expectation vs actual verifier output", () => {
  it.each(manifest.cases.map((c) => [c.caseId, c] as const))("%s", (_id, c) => {
    const doc = loadJson(c.file);
    const rep = verifyEnvelope(doc.envelope, doc.facts);
    expect(rep.overall, `${c.caseId} overall`).toBe(c.expectedOverall);
    for (const [vid, want] of Object.entries(c.expectedChecks)) {
      expect(rep.checks.find((k) => k.id === vid)?.status, `${c.caseId} ${vid}`).toBe(want);
    }
  });
});

// ---------------------------------------------------------------- invariants (EV-3)

describe("invariants", () => {
  const cases = manifest.cases.map((c) => loadJson(c.file));
  it("every report is structural only and carries the non-authority constants", () => {
    for (const d of cases) {
      const r = verifyEnvelope(d.envelope, d.facts);
      expect(r.authorizationImplied).toBe(false);
      expect(r.decides).toBe("nothing");
      expect(r.writes).toEqual([]);
      expect(r.statement).toMatch(/never means authorized/);
      expect(r.checks.map((k) => k.id)).toEqual(CHECK_IDS);
    }
  });
  it("is deterministic and does not mutate its inputs", () => {
    for (const d of cases) {
      const before = JSON.stringify([d.envelope, d.facts]);
      const a = verifyEnvelope(d.envelope, d.facts);
      const b = verifyEnvelope(d.envelope, d.facts);
      expect(a).toEqual(b);
      expect(JSON.stringify([d.envelope, d.facts])).toBe(before);
    }
  });
  it("is total over hostile inputs (never throws; malformed input fails V-1)", () => {
    const proto = JSON.parse('{"__proto__":{"x":1},"constructor":{"prototype":{}}}');
    const hostile: unknown[] = [null, undefined, 0, NaN, -1, "x", "x".repeat(100000), [], [[]], {}, proto, { envelopeVersion: "0" }, { mode: "PRE_COMMIT" }, () => 1, Symbol("s"), 10n];
    for (const e of hostile) {
      for (const f of hostile) {
        const r = verifyEnvelope(e, f);
        expect(r.overall).toBe("FAIL");
        expect(r.checks[0].id).toBe("V-1");
        expect(r.checks[0].status).toBe("FAIL");
        expect(r.authorizationImplied).toBe(false);
      }
    }
    const good = loadJson("C01-pre-base.json");
    expect(verifyEnvelope(good.envelope, proto).overall).toBe("FAIL");
    expect(verifyEnvelope(proto, good.facts).overall).toBe("FAIL");
  });
});

// ---------------------------------------------------------------- envelope extraction and refs

describe("extractEnvelope and readableRefs", () => {
  const block = (json: string) => `intro\n<!-- POA-ENVELOPE v0 -->\n\`\`\`json\n${json}\n\`\`\`\n`;
  it("extracts exactly one line-start marker block", () => {
    expect(extractEnvelope(block('{"a":1}'))).toEqual({ ok: true, envelope: { a: 1 } });
  });
  it("ignores an inline mention of the marker", () => {
    const inline = "headed `<!-- POA-ENVELOPE v0 -->` in the text\n```json\n{\"a\":1}\n```\n";
    expect(extractEnvelope(inline).ok).toBe(false);
  });
  it("rejects zero blocks, two blocks, invalid JSON and non-strings", () => {
    expect(extractEnvelope("nothing").ok).toBe(false);
    expect(extractEnvelope(block("{}") + block("{}")).ok).toBe(false);
    expect(extractEnvelope(block("{oops")).ok).toBe(false);
    expect(extractEnvelope(42 as unknown as string).ok).toBe(false);
  });
  it("readableRefs returns only the three named files and refuses unsafe or forbidden ones", () => {
    const good = loadJson("C01-pre-base.json").envelope;
    expect(readableRefs(good)).toEqual({ authFile: "docs/syn-decisions.md", headingPrefix: "# SYN-MISSION-01 — Title", pkg: "docs/syn-package.md", record: "docs/syn-record.md" });
    const trav = JSON.parse(JSON.stringify(good));
    trav.executionRecord = "../outside.md";
    expect(readableRefs(trav)).toBeNull();
    // forbiddenPaths constrain what a mission may change (V-4/V-5/V-6); reads are refused only for the mandatory entries.
    const locked = JSON.parse(JSON.stringify(good));
    locked.executionRecord = "src/locked/x.md";
    expect(readableRefs(locked)).not.toBeNull();
    const org = JSON.parse(JSON.stringify(good));
    org.package = "60-Organization-A/anything.md";
    expect(readableRefs(org)).toBeNull();
    expect(readableRefs(null)).toBeNull();
    expect(isMandatoryForbidden("60-Organization-A/x")).toBe(true);
    expect(isMandatoryForbidden("CLAUDE.md")).toBe(true);
    expect(isMandatoryForbidden("src/a.ts")).toBe(false);
  });
});

// ---------------------------------------------------------------- git allowlist

describe("assertAllowedGit (closed read-only allowlist)", () => {
  const sha = "a".repeat(40);
  it("accepts the invocations the adapter uses", () => {
    for (const a of [
      ["rev-parse", "HEAD"],
      ["rev-parse", "--abbrev-ref", "HEAD"],
      ["merge-base", "--is-ancestor", sha, "HEAD"],
      ["show", "HEAD:docs/x.md"],
      ["show", `${sha}:docs/x.md`],
      ["log", "--reverse", "--format=%H", "--", "docs/x.md"],
      ["diff", "--cached", "--name-only"],
      ["diff", "--name-only", "abc1234", "HEAD"],
      ["status", "--porcelain", "--", "docs/x.md"],
      ["ls-files", "--", "docs/x.md"],
    ]) expect(() => assertAllowedGit(a), a.join(" ")).not.toThrow();
  });
  it("rejects every write verb and every unlisted option", () => {
    for (const a of [
      ["add", "."], ["commit", "-m", "x"], ["push"], ["pull"], ["fetch"], ["tag", "v1"], ["reset", "--hard"], ["checkout", "x"],
      ["merge", "x"], ["rebase", "x"], ["stash"], ["config", "user.name", "x"], ["branch", "x"], ["clean", "-fd"], ["rm", "x"], ["mv", "a", "b"],
      ["show", "--output=x"], ["show", "HEAD"], ["diff", "--output=x"], ["diff", "--name-only", "-O/tmp/x"], ["log", "-S", "x"],
      ["merge-base", "HEAD", "HEAD"], ["status", "--porcelain=v2", "--", "x"], ["rev-parse", "--git-dir"], [],
    ]) expect(() => assertAllowedGit(a), a.join(" ")).toThrow();
  });
});

// ---------------------------------------------------------------- adapter on temp repositories (EV-5)

const GIT = ["-c", "user.name=syn", "-c", "user.email=syn@example.invalid", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false"];
function git(dir: string, ...args: string[]): string {
  const r = spawnSync("git", [...GIT, ...args], { cwd: dir, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr}`);
  return r.stdout.trim();
}
function envelopeFor(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    envelopeVersion: "0", missionId: "SYN-MISSION-T", package: "docs/syn-package.md",
    authorizationRecord: { file: "docs/syn-decisions.md", headingPrefix: "# SYN-MISSION-T — Title" },
    executionRecord: "docs/syn-record.md", allowlist: ["src/a.ts", "docs/syn-record.md"],
    forbiddenPaths: ["60-Organization-A/", "CLAUDE.md"], stopConditions: ["SC-1"],
    executionProfile: { models: ["Model-X"], maxConcurrentAgents: 1, effort: "HIGH" }, fileOwnership: null, ...over,
  };
}
function makeRepo(over: Record<string, unknown> = {}): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "syn-verifier-"));
  git(dir, "init", "-q");
  fs.mkdirSync(path.join(dir, "docs"));
  fs.writeFileSync(path.join(dir, "docs/syn-decisions.md"), "# older\n\n# SYN-MISSION-T — Title (2026-01-01)\n\ntext\n");
  fs.writeFileSync(path.join(dir, "docs/syn-package.md"), `# pkg\n\n<!-- POA-ENVELOPE v0 -->\n\`\`\`json\n${JSON.stringify(envelopeFor(over), null, 2)}\n\`\`\`\n`);
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "ratify");
  return dir;
}
const status = (rep: ReturnType<typeof verifyPackage>["report"], id: string) => rep.checks.find((c) => c.id === id)?.status;
const RECORD = REQUIRED_RECORD_HEADINGS.map((h) => `## ${h}\n\nx\n`).join("\n");

describe("git adapter on throw-away temp repositories", () => {
  it("pre-commit: committed authorization and a staged set inside the allowlist PASS", () => {
    const dir = makeRepo();
    fs.mkdirSync(path.join(dir, "src"));
    fs.writeFileSync(path.join(dir, "src/a.ts"), "export {};\n");
    git(dir, "add", "src/a.ts");
    const { report } = verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "PRE_COMMIT" });
    expect(report.overall).toBe("PASS");
    for (const id of ["V-1", "V-2", "V-3", "V-4", "V-5", "V-9"]) expect(status(report, id), id).toBe("PASS");
  });
  it("pre-commit: a staged path outside the allowlist FAILS V-5", () => {
    const dir = makeRepo();
    fs.writeFileSync(path.join(dir, "stray.txt"), "x");
    git(dir, "add", "stray.txt");
    expect(status(verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "PRE_COMMIT" }).report, "V-5")).toBe("FAIL");
  });
  it("a heading that was never committed FAILS V-2", () => {
    const dir = makeRepo({ authorizationRecord: { file: "docs/syn-decisions.md", headingPrefix: "# SYN-MISSION-T — Missing" } });
    expect(status(verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "PRE_COMMIT" }).report, "V-2")).toBe("FAIL");
  });
  it("a modified authorization file or package FAILS V-2 / V-3", () => {
    const dir = makeRepo();
    fs.appendFileSync(path.join(dir, "docs/syn-decisions.md"), "edit\n");
    fs.appendFileSync(path.join(dir, "docs/syn-package.md"), "edit\n");
    const { report } = verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "PRE_COMMIT" });
    expect(status(report, "V-2")).toBe("FAIL");
    expect(status(report, "V-3")).toBe("FAIL");
  });
  it("post-flight: changes since the baseline inside the allowlist plus a complete record PASS", () => {
    const dir = makeRepo();
    const baseline = git(dir, "rev-parse", "HEAD");
    fs.mkdirSync(path.join(dir, "src"));
    fs.writeFileSync(path.join(dir, "src/a.ts"), "export {};\n");
    fs.writeFileSync(path.join(dir, "docs/syn-record.md"), RECORD);
    git(dir, "add", "-A");
    git(dir, "commit", "-q", "-m", "work");
    const { report } = verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "POST_FLIGHT", baseline, recordedProfile: { models: ["Model-X"], agentCount: 1, effort: "HIGH" } });
    expect(report.overall).toBe("PASS");
    expect(status(report, "V-6")).toBe("PASS");
    expect(status(report, "V-7")).toBe("PASS");
    expect(status(report, "V-8")).toBe("PASS");
  });
  it("post-flight: a committed change outside the allowlist FAILS V-6; a thin record FAILS V-7", () => {
    const dir = makeRepo();
    const baseline = git(dir, "rev-parse", "HEAD");
    fs.writeFileSync(path.join(dir, "stray.txt"), "x");
    fs.writeFileSync(path.join(dir, "docs/syn-record.md"), "## Limitations\n");
    git(dir, "add", "-A");
    git(dir, "commit", "-q", "-m", "work");
    const { report } = verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "POST_FLIGHT", baseline });
    expect(status(report, "V-6")).toBe("FAIL");
    expect(status(report, "V-7")).toBe("FAIL");
    expect(status(report, "V-8")).toBe("UNKNOWN");
  });
  it("refuses a package path in a forbidden location and reads nothing", () => {
    const dir = makeRepo();
    const r = verifyPackage({ repo: dir, packagePath: "60-Organization-A/x.md", mode: "PRE_COMMIT" });
    expect(r.report.overall).toBe("FAIL");
    expect(r.notes.join(" ")).toMatch(/refused/);
    const t = verifyPackage({ repo: dir, packagePath: "../x.md", mode: "PRE_COMMIT" });
    expect(t.notes.join(" ")).toMatch(/refused/);
  });
  it("EV-5: running the adapter leaves HEAD, index bytes, status and file contents unchanged", () => {
    const dir = makeRepo();
    fs.mkdirSync(path.join(dir, "src"));
    fs.writeFileSync(path.join(dir, "src/a.ts"), "export {};\n");
    git(dir, "add", "src/a.ts");
    fs.writeFileSync(path.join(dir, "untracked.txt"), "u");
    const snap = () => {
      const h = crypto.createHash("sha256");
      h.update(git(dir, "rev-parse", "HEAD"));
      h.update(fs.readFileSync(path.join(dir, ".git", "index")));
      h.update(git(dir, "status", "--porcelain"));
      for (const f of ["docs/syn-decisions.md", "docs/syn-package.md", "src/a.ts", "untracked.txt"]) h.update(fs.readFileSync(path.join(dir, f)));
      return h.digest("hex");
    };
    const before = snap();
    verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "PRE_COMMIT" });
    verifyPackage({ repo: dir, packagePath: "docs/syn-package.md", mode: "POST_FLIGHT", baseline: git(dir, "rev-parse", "HEAD") });
    expect(snap()).toBe(before);
  });
});

// ---------------------------------------------------------------- dogfood shape (real package, synthetic facts)

describe("this mission's own package envelope", () => {
  it("parses and passes the static checks V-1, V-4 and V-9 against synthetic facts", () => {
    const text = fs.readFileSync(path.join(REPO_ROOT, "40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md"), "utf8");
    const ex = extractEnvelope(text);
    expect(ex.ok).toBe(true);
    if (!ex.ok) return;
    const facts = { mode: "PRE_COMMIT", headingPresentAtHead: true, introducingCommitIsAncestorOfHead: true, authorizationFileDirty: false, packageCommittedAtHead: true, packageFileDirty: false, stagedPaths: [], changedPathsSinceBaseline: null, executionRecordHeadings: null, recordedProfile: null };
    const rep = verifyEnvelope(ex.envelope, facts);
    for (const id of ["V-1", "V-4", "V-9"]) expect(rep.checks.find((c) => c.id === id)?.status, id).toBe("PASS");
    expect(readableRefs(ex.envelope)).not.toBeNull();
  });
});

// ---------------------------------------------------------------- static guards (EV-4a)

const SOURCES = ["lifecycle-verifier.ts", "lifecycle-verifier-git.ts"].map((f) => ({ name: f, text: fs.readFileSync(path.join(SRC_DIR, f), "utf8") }));
const WRITE_APIS = ["writeFile", "appendFile", "mkdir", "rmSync", "rmdir", "unlink", "rename", "copyFile", "createWriteStream", "writeSync", "truncate", "symlink", "chmod", "utimes", "openSync"];
const NET_MODEL = ["fetch(", "node:http", "node:https", "node:net", "node:dgram", "WebSocket", "XMLHttpRequest", "openai", "anthropic", "Anthropic", "LLM"];
const FORBIDDEN_IMPORTS = ["/runtime", "/identity", "/knowledge-plane", "/index", "server/"];
const GIT_WRITE_VERBS = ["add", "commit", "push", "pull", "fetch", "tag", "reset", "checkout", "merge", "rebase", "stash", "config", "branch", "clean", "rm", "mv", "apply", "cherry-pick", "revert", "restore", "switch", "init", "clone"];
const ORG_DIR = "60-Organization-A";
const GATED_FILE_HINTS = ["Business-Function-Map", "Source-Declaration"];

function guardViolations(name: string, text: string): string[] {
  const v: string[] = [];
  for (const api of WRITE_APIS) if (new RegExp(`\\b${api}`).test(text)) v.push(`${name}: write-capable API ${api}`);
  for (const t of NET_MODEL) if (text.includes(t)) v.push(`${name}: network/model token ${t}`);
  for (const m of text.matchAll(/from\s+"([^"]+)"/g)) {
    if (!m[1].startsWith("node:") && !m[1].startsWith("./lifecycle-verifier")) v.push(`${name}: import ${m[1]}`);
    if (FORBIDDEN_IMPORTS.some((x) => m[1].includes(x))) v.push(`${name}: forbidden import ${m[1]}`);
  }
  for (const verb of GIT_WRITE_VERBS) if (text.includes(`"${verb}"`)) v.push(`${name}: git verb literal "${verb}"`);
  for (const h of GATED_FILE_HINTS) if (text.includes(h)) v.push(`${name}: gated file name ${h}`);
  return v;
}

describe("static guards over the two source files", () => {
  it("contain no write-capable API, network/model token, forbidden import or git write verb", () => {
    for (const s of SOURCES) expect(guardViolations(s.name, s.text)).toEqual([]);
  });
  it("the core imports nothing and uses no clock, randomness, process or filesystem", () => {
    const core = SOURCES[0].text;
    expect(/^\s*import\s/m.test(core)).toBe(false);
    for (const t of ["Date", "Math.random", "process", "require(", "node:"]) expect(core.includes(t), t).toBe(false);
  });
  it("the adapter imports only node:fs (read), node:path, node:child_process, node:url and the core", () => {
    const imports = Array.from(SOURCES[1].text.matchAll(/from\s+"([^"]+)"/g)).map((m) => m[1]).sort();
    expect(imports).toEqual(["./lifecycle-verifier", "node:child_process", "node:fs", "node:path", "node:url"]);
    expect(/import\s*\{([^}]*)\}\s*from\s*"node:fs"/.exec(SOURCES[1].text)?.[1].trim()).toBe("readFileSync");
  });
  it("the Organization-directory literal appears once, only as the core's mandatory-forbidden constant, and never in the adapter", () => {
    const core = SOURCES[0].text.split("\n").filter((l) => l.includes(ORG_DIR));
    expect(core.length).toBe(1);
    expect(core[0]).toMatch(/MANDATORY_FORBIDDEN\s*=/);
    expect(SOURCES[1].text.includes(ORG_DIR)).toBe(false);
  });
  it("guard negative control: the guard detects planted violations", () => {
    expect(guardViolations("x", 'fs.writeFileSync("a","b")').length).toBeGreaterThan(0);
    expect(guardViolations("x", 'run("commit")').length).toBeGreaterThan(0);
    expect(guardViolations("x", 'import a from "./runtime"').length).toBeGreaterThan(0);
    expect(guardViolations("x", "await fetch(u)").length).toBeGreaterThan(0);
    expect(guardViolations("x", "Business-Function-Map").length).toBeGreaterThan(0);
  });
  it("index.ts does not export the verifier and package.json is not wired to it", () => {
    expect(fs.readFileSync(path.join(SRC_DIR, "index.ts"), "utf8")).not.toMatch(/lifecycle-verifier/);
    expect(fs.readFileSync(path.resolve(SRC_DIR, "../package.json"), "utf8")).not.toMatch(/lifecycle-verifier/);
  });
});

// ---------------------------------------------------------------- fixture integrity (SF-style)

describe("fixture integrity", () => {
  it("every fixture is synthetic: SYN- mission ids, generic paths, no gated file names, no real mission ids", () => {
    for (const c of manifest.cases) {
      const doc = loadJson(c.file);
      const raw = JSON.stringify([doc.envelope, doc.facts]);
      expect(doc.caseId).toBe(c.caseId);
      if (typeof doc.envelope === "object" && doc.envelope !== null && "missionId" in doc.envelope) expect(String(doc.envelope.missionId)).toMatch(/^SYN-/);
      for (const h of GATED_FILE_HINTS) expect(raw.includes(h), `${c.file} ${h}`).toBe(false);
      for (const real of ["POA-ORG-KNOW", "POA-SEA-IMPL", "SEA-IMPL"]) expect(raw.includes(real), `${c.file} ${real}`).toBe(false);
      for (const m of raw.matchAll(new RegExp(ORG_DIR, "g"))) expect(raw.slice(m.index!, m.index! + ORG_DIR.length + 1)).toBe(`${ORG_DIR}/`);
    }
  });
});
