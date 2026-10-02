/**
 * POA-ORG-KNOW-P5-IMPL-001 - synthetic-fixture routing dry-run tests.
 *
 * Boundary: the ratified Mission Package POA-ORG-KNOW-P5-IMPL-001-RESCOPED-
 * MISSION-PACKAGE (S4 allowlist, S6 fixture definition SF-1..SF-9, S7 contract,
 * S9 evidence, S10 completion matrix). R-1/Q6 remains in force.
 *
 * LIMITATION: passing these tests is evidence ONLY about the synthetic routing
 * mechanism. It is no evidence that any real organization's declarations route
 * correctly.
 *
 * This file is the only place that reads fixture files (the routing module does
 * no input/output) and the only place that may hold the forbidden-term lists
 * used by the static guards (Mission Package EV-4a).
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { routeDryRun } from "@/routing";

type Decision = ReturnType<typeof routeDryRun>;

const FIXTURE_DIR = path.resolve(import.meta.dirname, "fixtures/routing-synthetic");
const SRC_DIR = path.resolve(import.meta.dirname, "../src");
const SERVER_DIR = path.resolve(import.meta.dirname, "../server");
const AUTHORED_FROM = "POA-ORG-KNOW-P5-IMPL-001-RESCOPED-MISSION-PACKAGE";
const ALLOWED_ORGS = ["SYN-ORG-S", "SYN-ORG-T"];

// ---------------------------------------------------------------- harness loader (SF-5)

/** Throws unless the document carries all three required synthetic markers. */
function assertSyntheticMarkers(doc: unknown, label: string): void {
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) {
    throw new Error(`${label}: not a JSON object`);
  }
  const d = doc as Record<string, unknown>;
  if (d.fixtureClass !== "SYNTHETIC") throw new Error(`${label}: fixtureClass must be SYNTHETIC`);
  if (typeof d.organization !== "string" || !ALLOWED_ORGS.includes(d.organization)) {
    throw new Error(`${label}: organization must be one of ${ALLOWED_ORGS.join(", ")}`);
  }
  if (d.authoredFrom !== AUTHORED_FROM) throw new Error(`${label}: authoredFrom marker missing or wrong`);
}

// Fixture documents are test data of intentionally open shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any;

function loadSyntheticFixture(file: string): Doc {
  const full = path.join(FIXTURE_DIR, file);
  const doc: unknown = JSON.parse(fs.readFileSync(full, "utf8"));
  assertSyntheticMarkers(doc, file);
  return doc;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function deepFreeze<T>(v: T): T {
  if (v !== null && typeof v === "object") {
    for (const key of Object.keys(v as object)) deepFreeze((v as Record<string, unknown>)[key]);
    Object.freeze(v);
  }
  return v;
}

const manifest = loadSyntheticFixture("manifest.json") as {
  cases: { caseId: string; file: string; matrixCase: string; expected: { outcome: string; reasonCode: string } }[];
};

// First non-satisfied link per case; null = all satisfied (ROUTE); 0 = rule 0 (no link evaluated).
const FAILING_LINK: Record<string, number | null> = {
  C01: null,
  C02: 1, C03: 1,
  C04: 3, C05: 3, C06: 3, C07: 3,
  C08: 4, C09: 5,
  C10: 6, C11: 6, C14: 6,
  C12: 7, C13: 7, C17: 7,
  C15: 0, C16: 0,
};

const REQUIRED_MATRIX = [
  "happy-path ROUTE",
  "unauthenticated principal",
  "cross-organization principal",
  "no alias match",
  "ambiguous alias",
  "intent UNCONFIRMED",
  "intent REJECTED",
  "function with no owning unit",
  "function with no responsible role",
  "no ACTIVE grant (none declared)",
  "REVOKED grant only",
  "principal lacks initiation grant",
  "approval requirement undeclared",
  "APPROVE-only grants held by SERVICE/EXECUTION_AGENT subjects",
  "malformed input",
  "non-synthetic fixture refused",
];

function run(file: string): { doc: Doc; decision: Decision } {
  const doc = loadSyntheticFixture(file);
  return { doc, decision: routeDryRun(doc.declarations, doc.request) };
}

// ---------------------------------------------------------------- loader (SF-5)

describe("synthetic marker loader (SF-5)", () => {
  const good = { fixtureClass: "SYNTHETIC", organization: "SYN-ORG-S", authoredFrom: AUTHORED_FROM };

  it("accepts a document carrying all three markers", () => {
    expect(() => assertSyntheticMarkers(good, "good")).not.toThrow();
    expect(() => assertSyntheticMarkers({ ...good, organization: "SYN-ORG-T" }, "good-T")).not.toThrow();
  });

  it.each([
    ["missing fixtureClass", { organization: "SYN-ORG-S", authoredFrom: AUTHORED_FROM }],
    ["wrong fixtureClass", { ...good, fixtureClass: "UNMARKED" }],
    ["missing organization", { fixtureClass: "SYNTHETIC", authoredFrom: AUTHORED_FROM }],
    ["organization outside SYN-ORG-S/T", { ...good, organization: "SYN-ORG-X" }],
    ["missing authoredFrom", { fixtureClass: "SYNTHETIC", organization: "SYN-ORG-S" }],
    ["wrong authoredFrom", { ...good, authoredFrom: "SOMETHING-ELSE" }],
  ])("rejects: %s", (_name, doc) => {
    expect(() => assertSyntheticMarkers(doc, "bad")).toThrow();
  });

  it.each([[null], [undefined], [7], ["SYNTHETIC"], [[]]])("rejects a non-object document (%j)", (doc) => {
    expect(() => assertSyntheticMarkers(doc, "bad")).toThrow();
  });

  it("every file in the fixture directory loads through the marker check", () => {
    for (const f of fs.readdirSync(FIXTURE_DIR)) {
      expect(() => loadSyntheticFixture(f)).not.toThrow();
    }
  });
});

// ---------------------------------------------------------------- manifest (SF-9)

describe("fixture manifest (SF-9) and case matrix (S10 C-1)", () => {
  it("lists exactly the fixture files in the directory", () => {
    const onDisk = fs.readdirSync(FIXTURE_DIR).filter((f) => f !== "manifest.json").sort();
    const listed = manifest.cases.map((c) => c.file).sort();
    expect(listed).toEqual(onDisk);
  });

  it("covers every required matrix case", () => {
    const covered = manifest.cases.map((c) => c.matrixCase);
    for (const required of REQUIRED_MATRIX) expect(covered).toContain(required);
  });

  it("uses unique case ids and matches each file's own caseId", () => {
    const ids = manifest.cases.map((c) => c.caseId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of manifest.cases) expect(loadSyntheticFixture(c.file).caseId).toBe(c.caseId);
  });
});

// ---------------------------------------------------------------- outcomes (S7 table)

describe("routing outcome matrix (S7 table, applied as written)", () => {
  it.each(manifest.cases)("$caseId $matrixCase -> $expected.outcome / $expected.reasonCode", (c) => {
    const { decision } = run(c.file);
    expect(decision.outcome).toBe(c.expected.outcome);
    expect(decision.reasonCode).toBe(c.expected.reasonCode);
  });

  it("covers all four outcomes", () => {
    const seen = new Set(manifest.cases.map((c) => run(c.file).decision.outcome));
    expect([...seen].sort()).toEqual(["ASK", "ESCALATE", "REFUSE", "ROUTE"]);
  });

  it("ruling 6: missing owner or role -> ESCALATE; missing grant -> REFUSE", () => {
    expect(run("C08-owning-unit-absent.json").decision.outcome).toBe("ESCALATE");
    expect(run("C09-responsible-role-null.json").decision.outcome).toBe("ESCALATE");
    for (const f of ["C10-no-grants-declared.json", "C11-revoked-grants-only.json", "C12-principal-lacks-initiation-grant.json"]) {
      expect(run(f).decision.outcome).toBe("REFUSE");
    }
  });

  it("happy path ROUTE returns the declared owner, role and the single declared executor", () => {
    const { decision } = run("C01-route-happy-path.json");
    expect(decision.route).toEqual({
      owningUnit: "SYN-UNIT-01",
      responsibleRole: "SYN-ROLE-01",
      executorSubjectId: "SYN-SERVICE-01",
    });
    expect(decision.inference).toEqual({ resolvedFunctionId: "SYN-FN-FINANCE-ACCOUNTING", kind: "INFERENCE", confirmed: true });
  });

  it("route is non-null only when the outcome is ROUTE", () => {
    for (const c of manifest.cases) {
      const { decision } = run(c.file);
      expect(decision.route !== null).toBe(decision.outcome === "ROUTE");
    }
  });

  it("evaluates links 1-7 in order; links after the first failing link are NOT_EVALUATED", () => {
    for (const c of manifest.cases) {
      const { decision } = run(c.file);
      const failing = FAILING_LINK[c.caseId];
      expect(decision.links.map((l) => l.n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      decision.links.forEach((link, i) => {
        const n = i + 1;
        if (failing === null) expect(link.status).toBe("SATISFIED");
        else if (failing === 0) expect(link.status).toBe("NOT_EVALUATED");
        else if (n < failing) expect(link.status).toBe("SATISFIED");
        else if (n === failing) expect(["MISSING", "AMBIGUOUS"]).toContain(link.status);
        else expect(link.status).toBe("NOT_EVALUATED");
      });
    }
  });

  it("marks an ambiguous alias match as AMBIGUOUS on link 3 and resolves no function", () => {
    const { decision } = run("C05-intent-ambiguous-alias.json");
    expect(decision.links[2].status).toBe("AMBIGUOUS");
    expect(decision.inference.resolvedFunctionId).toBeNull();
    expect(decision.inference.confirmed).toBe(false);
  });

  it("never proceeds on an unconfirmed interpretation (confirmed=false, later links not evaluated)", () => {
    for (const f of ["C06-intent-unconfirmed.json", "C07-intent-rejected.json"]) {
      const { decision } = run(f);
      expect(decision.inference.confirmed).toBe(false);
      expect(decision.links.slice(3).every((l) => l.status === "NOT_EVALUATED")).toBe(true);
    }
  });

  it("missing declarations are explicit nulls or absent fields (SF-6)", () => {
    expect(loadSyntheticFixture("C08-owning-unit-absent.json").declarations.functions[0]).not.toHaveProperty("owningUnit");
    expect(loadSyntheticFixture("C09-responsible-role-null.json").declarations.functions[0].responsibleRole).toBeNull();
    expect(loadSyntheticFixture("C17-approval-authority-explicit-null.json").declarations.approvalRequirements[0].declaredAuthority).toBeNull();
  });
});

// ---------------------------------------------------------------- invariants (S7)

describe("invariants (S7, S10 C-2)", () => {
  it("same input yields the same output (determinism)", () => {
    for (const c of manifest.cases) {
      const doc = loadSyntheticFixture(c.file);
      const a = routeDryRun(doc.declarations, doc.request);
      const b = routeDryRun(clone(doc.declarations), clone(doc.request));
      expect(a).toEqual(b);
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });

  it("committed is always false, writes is always empty, approvalsSimulated is always 0", () => {
    for (const c of manifest.cases) {
      const { decision } = run(c.file);
      expect(decision.committed).toBe(false);
      expect(decision.writes).toEqual([]);
      expect(decision.approvalsSimulated).toBe(0);
    }
  });

  it("does not mutate its inputs (deep-frozen inputs, before/after identical)", () => {
    for (const c of manifest.cases) {
      const doc = loadSyntheticFixture(c.file);
      const before = JSON.stringify(doc);
      deepFreeze(doc);
      expect(() => routeDryRun(doc.declarations, doc.request)).not.toThrow();
      expect(JSON.stringify(doc)).toBe(before);
    }
  });

  it("returns a fresh result per call (no shared mutable state between calls)", () => {
    const doc = loadSyntheticFixture("C01-route-happy-path.json");
    const a = routeDryRun(doc.declarations, doc.request);
    const b = routeDryRun(doc.declarations, doc.request);
    expect(a).not.toBe(b);
    expect(a.links).not.toBe(b.links);
    expect(a.writes).not.toBe(b.writes);
  });

  it("an APPROVE grant never produces approval and never moves the outcome toward ROUTE", () => {
    for (const c of manifest.cases) {
      const doc = loadSyntheticFixture(c.file);
      if (!Array.isArray(doc.declarations.grants)) continue; // malformed-input case
      const baseline = routeDryRun(doc.declarations, doc.request);

      // (a) turn every INITIATE grant into an APPROVE grant: never ROUTE.
      const flipped = clone(doc.declarations);
      for (const g of flipped.grants) if (g.action === "INITIATE") g.action = "APPROVE";
      expect(routeDryRun(flipped, doc.request).outcome).not.toBe("ROUTE");

      // (b) add ACTIVE APPROVE grants for every kind of subject: outcome and reason unchanged.
      const augmented = clone(doc.declarations);
      for (const [subjectId, subjectKind] of [
        ["SYN-PRINCIPAL-01", "HUMAN"],
        ["SYN-SERVICE-01", "SERVICE"],
        ["SYN-AGENT-01", "EXECUTION_AGENT"],
      ] as const) {
        for (const fn of augmented.functions) {
          augmented.grants.push({ subjectId, subjectKind, functionId: fn.functionId, action: "APPROVE", status: "ACTIVE" });
        }
      }
      const after = routeDryRun(augmented, doc.request);
      expect(after.outcome).toBe(baseline.outcome);
      expect(after.reasonCode).toBe(baseline.reasonCode);
      expect(after.route).toEqual(baseline.route);
      expect(after.approvalsSimulated).toBe(0);
    }
  });

  it("a SERVICE or EXECUTION_AGENT subject holding only APPROVE never becomes an executor", () => {
    const { decision } = run("C14-approve-only-service-and-agent.json");
    expect(decision.outcome).toBe("REFUSE");
    expect(decision.reasonCode).toBe("NO_AUTHORIZED_EXECUTOR");
    expect(decision.route).toBeNull();
  });

  it("is total: malformed or hostile inputs return REFUSE and never throw", () => {
    const doc = loadSyntheticFixture("C01-route-happy-path.json");
    const hostile: unknown[] = [null, undefined, 0, "x", [], {}, { fixtureClass: "SYNTHETIC" }];
    for (const bad of hostile) {
      for (const [d, r] of [[bad, doc.request], [doc.declarations, bad], [bad, bad]] as const) {
        const out = routeDryRun(d, r);
        expect(out.outcome).toBe("REFUSE");
        expect(["MALFORMED_INPUT", "NOT_SYNTHETIC"]).toContain(out.reasonCode);
        expect(out.route).toBeNull();
      }
    }
  });

  it("rejects malformed declaration and request fields (rule 0) rather than guessing", () => {
    const doc = loadSyntheticFixture("C01-route-happy-path.json");
    const mutations: ((d: Doc) => void)[] = [
      (d) => { d.functions[0].aliases = "SYN-INTENT-LEDGER-ENTRY"; },
      (d) => { d.functions[0].functionId = ""; },
      (d) => { d.functions[0].owningUnit = 7; },
      (d) => { d.grants[0].action = "EXECUTE"; },
      (d) => { d.grants[0].status = "PENDING"; },
      (d) => { d.grants[0].subjectKind = "ROBOT"; },
      (d) => { d.approvalRequirements[0].declaredAuthority = 7; },
      (d) => { delete d.version; },
      (d) => { delete d.organization; },
    ];
    for (const mutate of mutations) {
      const d = clone(doc.declarations);
      mutate(d);
      const out = routeDryRun(d, doc.request);
      expect(out.outcome).toBe("REFUSE");
      expect(out.reasonCode).toBe("MALFORMED_INPUT");
    }
    for (const badRequest of [
      { ...doc.request, principalConfirmation: "MAYBE" },
      { ...doc.request, intentLabel: 7 },
      { ...doc.request, principal: { ...doc.request.principal, authenticated: "yes" } },
      { ...doc.request, principal: { ...doc.request.principal, organization: 7 } },
      { ...doc.request, requestId: "" },
    ]) {
      expect(routeDryRun(doc.declarations, badRequest).reasonCode).toBe("MALFORMED_INPUT");
    }
  });
});

// ---------------------------------------------------------------- static guards (EV-4a)

describe("routing core guards (EV-4a): no input/output, no dependencies, no integration", () => {
  const source = fs.readFileSync(path.join(SRC_DIR, "routing.ts"), "utf8");
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  const FORBIDDEN_IN_SOURCE: [string, RegExp][] = [
    ["an Organization A path", /60-Organization-A/],
    ["a declaration-map file name", /Business-Function-Map/],
    ["a source-declaration file name", /Source-Declaration/],
    ["the knowledge plane", /knowledge-?plane/i],
    ["the runtime module", /\bruntime\b/i],
    ["the file system", /\bfs\b/],
    ["a node builtin scheme", /node:/],
    ["the network", /\b(fetch|XMLHttpRequest|WebSocket|http|https|net|dgram)\b/],
    ["a model client", /anthropic|openai|\bllm\b|\bgpt\b|completion/i],
    ["process / environment", /\bprocess\b/],
    ["a clock or timer", /\bDate\b|performance\.now|setTimeout|setInterval/],
    ["randomness or crypto", /Math\.random|crypto/],
    ["the identity module", /\bidentity\b/i],
  ];

  it.each(FORBIDDEN_IN_SOURCE)("routing.ts contains no reference to %s", (_label, re) => {
    expect(re.test(source)).toBe(false);
  });

  it("routing.ts has no import, require or dynamic import", () => {
    expect(/^\s*import\s/m.test(code)).toBe(false);
    expect(/\brequire\s*\(/.test(code)).toBe(false);
    expect(/\bimport\s*\(/.test(code)).toBe(false);
  });

  it("routing.ts exports exactly one binding: routeDryRun (private types stay unexported)", () => {
    const exportsFound = code.match(/^\s*export\s+.*$/gm) ?? [];
    expect(exportsFound).toHaveLength(1);
    expect(exportsFound[0]).toMatch(/export function routeDryRun\(/);
  });

  it("src/index.ts does not import or re-export the routing module", () => {
    expect(fs.readFileSync(path.join(SRC_DIR, "index.ts"), "utf8")).not.toMatch(/["'](@\/|\.\/)routing["']/);
  });

  it("no production source or server file imports the routing module", () => {
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".ts") ? [path.join(dir, e.name)] : [],
      );
    for (const file of [...walk(SRC_DIR), ...(fs.existsSync(SERVER_DIR) ? walk(SERVER_DIR) : [])]) {
      if (path.basename(file) === "routing.ts") continue;
      expect(fs.readFileSync(file, "utf8")).not.toMatch(/from\s+["'][^"']*\/routing["']/);
    }
  });
});

// ---------------------------------------------------------------- fixture integrity (SF-1..SF-9)

describe("synthetic fixture integrity (SF-1..SF-9, EV-4a)", () => {
  const files = fs.readdirSync(FIXTURE_DIR);
  const caseFiles = files.filter((f) => f !== "manifest.json");
  const FORBIDDEN_IN_FIXTURES = [/60-Organization-A/, /Business-Function-Map/, /Source-Declaration/, /@/, /https?:/i, /\.com\b/i];
  const SYN_KEYS = ["functionId", "label", "owningUnit", "responsibleRole", "declaredAuthority", "subjectId", "id", "intentLabel", "requestId", "version", "aliases"];

  /** Walks a JSON value; array elements inherit their parent's key. */
  function* walk(v: unknown, key: string): Generator<[string, unknown]> {
    yield [key, v];
    if (Array.isArray(v)) {
      for (const x of v) yield* walk(x, key);
    } else if (v !== null && typeof v === "object") {
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) yield* walk(x, k);
    }
  }

  it("every fixture file carries SYNTHETIC, SYN-ORG-S/T and the authoredFrom marker", () => {
    expect(files.length).toBeGreaterThan(1);
    for (const f of files) {
      const doc = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, f), "utf8"));
      expect(doc.fixtureClass).toBe("SYNTHETIC");
      expect(ALLOWED_ORGS).toContain(doc.organization);
      expect(doc.authoredFrom).toBe(AUTHORED_FROM);
    }
  });

  it("every identifier-bearing value is a SYN- identifier (SF-3)", () => {
    for (const f of caseFiles) {
      const doc = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, f), "utf8"));
      for (const part of [doc.declarations, doc.request]) {
        for (const [key, value] of walk(part, "")) {
          if (typeof value === "string" && SYN_KEYS.includes(key)) {
            expect(value, `${f} ${key}`).toMatch(/^SYN-[A-Z0-9][A-Z0-9-]*$/);
          }
          if (key === "organization" && typeof value === "string") expect(ALLOWED_ORGS).toContain(value);
        }
      }
    }
  });

  it("fixture text contains no path, file-name, address or domain reference (SF-1, SF-7)", () => {
    for (const f of files) {
      const text = fs.readFileSync(path.join(FIXTURE_DIR, f), "utf8");
      for (const re of FORBIDDEN_IN_FIXTURES) expect(re.test(text), `${f} ${re}`).toBe(false);
    }
  });

  it("the nominal finance label appears only as the approved synthetic label (ruling 4)", () => {
    for (const f of caseFiles) {
      const text = fs.readFileSync(path.join(FIXTURE_DIR, f), "utf8");
      for (const m of text.match(/[A-Z-]*FINANCE[A-Z-]*/g) ?? []) {
        expect(["SYN-FINANCE-ACCOUNTING", "SYN-FN-FINANCE-ACCOUNTING"]).toContain(m);
      }
    }
  });

  it("only the cross-organization isolation case uses SYN-ORG-T (SF-2)", () => {
    for (const f of caseFiles) {
      const doc = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, f), "utf8"));
      const text = JSON.stringify(doc);
      if (doc.caseId === "C03") expect(text).toContain("SYN-ORG-T");
      else expect(text).not.toContain("SYN-ORG-T");
    }
  });

  it("fixtures live only under the authorized synthetic directory (SF-7)", () => {
    expect(path.relative(path.resolve(import.meta.dirname, ".."), FIXTURE_DIR).replace(/\\/g, "/")).toBe(
      "test/fixtures/routing-synthetic",
    );
  });
});
