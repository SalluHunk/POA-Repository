/**
 * POA-SEA-IMPL-001 - Lifecycle Verifier, pure core.
 *
 * Boundary: the ratified Mission Package POA-SEA-IMPL-001-MISSION-PACKAGE
 * (S6 Envelope v0, S7 verifier contract) and ADR-001 rulings R-A, R-B, R-C.
 *
 * This module is a VERIFIER, NOT AN AUTHORITY SOURCE. It checks whether a
 * declared envelope matches repository facts that are passed in as plain data.
 * It performs no input/output, reads no clock, uses no randomness and imports
 * nothing. A PASS means "the declared structure matches the supplied facts";
 * it never means "authorized" (R-C.2).
 */

const ENVELOPE_VERSION = "0";
export const VERIFIER_VERSION = "0";
const MAX_LEN = 2000;

/** Entries every envelope's forbiddenPaths must contain (package S6). */
const MANDATORY_FORBIDDEN = ["60-Organization-A/", "CLAUDE.md"];

/** R-B.1 section names an Execution Record must carry as headings (V-7). */
export const REQUIRED_RECORD_HEADINGS = [
  "Identity and authority",
  "Starting state",
  "Ending state",
  "Execution profile",
  "Files changed",
  "Commands and results",
  "Content hashes",
  "Stop-condition",
  "Evidence-gate",
  "Limitations",
  "Interpretation points",
  "Pointers",
];

export type Mode = "PRE_COMMIT" | "POST_FLIGHT";
export type Status = "PASS" | "FAIL" | "FLAG" | "UNKNOWN";
export interface CheckResult {
  id: string;
  status: Status;
  detail: string;
}
export interface VerifierReport {
  verifierVersion: string;
  mode: Mode | null;
  checks: CheckResult[];
  overall: "PASS" | "FAIL";
  authorizationImplied: false;
  decides: "nothing";
  writes: [];
  statement: string;
}

interface Envelope {
  missionId: string;
  pkg: string;
  authFile: string;
  headingPrefix: string;
  record: string;
  allowlist: string[];
  forbidden: string[];
  stops: string[];
  models: string[];
  maxAgents: number;
  effort: string;
  ownership: Record<string, string[]> | null;
}
interface Facts {
  mode: Mode;
  headingPresentAtHead: boolean | null;
  introducingCommitIsAncestorOfHead: boolean | null;
  authorizationFileDirty: boolean | null;
  packageCommittedAtHead: boolean | null;
  packageFileDirty: boolean | null;
  stagedPaths: string[] | null;
  changedPathsSinceBaseline: string[] | null;
  executionRecordHeadings: string[] | null;
  recordedProfile: { models: string[] | null; agentCount: number | null; effort: string | null } | null;
}

// ---------------------------------------------------------------- helpers

const isObj = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === "object" && !Array.isArray(x);
const own = (o: Record<string, unknown>, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const isStr = (x: unknown): x is string => typeof x === "string" && x.length > 0 && x.length <= MAX_LEN;
const isStrArr = (x: unknown): x is string[] => Array.isArray(x) && x.every((e) => typeof e === "string" && e.length <= MAX_LEN);
const boolOrNull = (x: unknown): boolean | null => (typeof x === "boolean" ? x : null);
const strArrOrNull = (x: unknown): string[] | null => (isStrArr(x) ? x : null);

/** Reason a relative path is malformed, or null when it is well-formed. */
function badPath(p: string): string | null {
  const t = p.endsWith("/") ? p.slice(0, -1) : p;
  if (t.length === 0) return "empty path";
  if (t.includes("\\") || t.includes("\0")) return "backslash or NUL";
  if (t.startsWith("/") || /^[A-Za-z]:/.test(t)) return "absolute path";
  if (t.split("/").some((s) => s === ".." || s === "." || s === "")) return "dot or empty segment";
  return null;
}
const globBase = (e: string): string | null => (e.endsWith("/**") ? e.slice(0, -3) : null);
/** Allowlist entry problems: exact path, or exactly one trailing /** under a named directory. */
function badAllowEntry(e: string): string | null {
  const base = globBase(e);
  const body = base === null ? e : base;
  if (body.includes("*")) return "wildcard outside a single trailing /**";
  if (body.endsWith("/")) return "trailing slash";
  return badPath(body);
}
function matchesAllow(entry: string, p: string): boolean {
  const base = globBase(entry);
  return base === null ? p === entry : p.startsWith(base + "/");
}
function matchesForbidden(entry: string, p: string): boolean {
  return entry.endsWith("/") ? p.startsWith(entry) : p === entry;
}
/** Do two allowlist-style entries cover any common path? */
function allowOverlap(a: string, b: string): boolean {
  const ga = globBase(a);
  const gb = globBase(b);
  if (ga !== null && gb !== null) return (ga + "/").startsWith(gb + "/") || (gb + "/").startsWith(ga + "/");
  if (ga !== null) return b.startsWith(ga + "/");
  if (gb !== null) return a.startsWith(gb + "/");
  return a === b;
}
function allowVsForbidden(allow: string, forb: string): boolean {
  const g = globBase(allow);
  if (forb.endsWith("/")) {
    if (g !== null) return (g + "/").startsWith(forb) || forb.startsWith(g + "/");
    return allow.startsWith(forb);
  }
  return g !== null ? forb.startsWith(g + "/") : allow === forb;
}

// ---------------------------------------------------------------- parsing

function parseEnvelope(raw: unknown): { ok: true; env: Envelope } | { ok: false; detail: string } {
  const bad = (detail: string) => ({ ok: false as const, detail });
  if (!isObj(raw)) return bad("envelope missing or not an object");
  if (!own(raw, "envelopeVersion") || raw.envelopeVersion !== ENVELOPE_VERSION) return bad(`envelopeVersion must be "${ENVELOPE_VERSION}"`);
  for (const k of ["missionId", "package", "executionRecord"]) if (!own(raw, k) || !isStr(raw[k])) return bad(`${k} must be a non-empty string`);
  const ar = own(raw, "authorizationRecord") ? raw.authorizationRecord : undefined;
  if (!isObj(ar) || !isStr(ar.file) || !isStr(ar.headingPrefix)) return bad("authorizationRecord must carry file and headingPrefix strings");
  for (const k of ["allowlist", "forbiddenPaths", "stopConditions"]) {
    const v = own(raw, k) ? raw[k] : undefined;
    if (!isStrArr(v) || v.length === 0 || v.some((e) => e.length === 0)) return bad(`${k} must be a non-empty array of non-empty strings`);
  }
  const ep = own(raw, "executionProfile") ? raw.executionProfile : undefined;
  if (!isObj(ep) || !isStrArr(ep.models) || ep.models.length === 0 || !isStr(ep.effort)) return bad("executionProfile needs models[] and effort");
  const n = ep.maxConcurrentAgents;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1) return bad("executionProfile.maxConcurrentAgents must be an integer >= 1");
  let ownership: Record<string, string[]> | null = null;
  const fo = own(raw, "fileOwnership") ? raw.fileOwnership : undefined;
  if (fo === undefined) return bad("fileOwnership must be present (null or an object)");
  if (fo !== null) {
    if (!isObj(fo)) return bad("fileOwnership must be null or an object");
    ownership = {};
    for (const k of Object.keys(fo)) {
      const v = fo[k];
      if (!isStrArr(v)) return bad("fileOwnership values must be string arrays");
      ownership[k] = v;
    }
  }
  return {
    ok: true,
    env: {
      missionId: raw.missionId as string,
      pkg: raw.package as string,
      authFile: ar.file,
      headingPrefix: ar.headingPrefix,
      record: raw.executionRecord as string,
      allowlist: raw.allowlist as string[],
      forbidden: raw.forbiddenPaths as string[],
      stops: raw.stopConditions as string[],
      models: ep.models,
      maxAgents: n,
      effort: ep.effort,
      ownership,
    },
  };
}

function readFacts(raw: unknown): { ok: true; facts: Facts } | { ok: false; detail: string; mode: Mode | null } {
  if (!isObj(raw)) return { ok: false, detail: "facts missing or not an object", mode: null };
  const mode = raw.mode;
  if (mode !== "PRE_COMMIT" && mode !== "POST_FLIGHT") return { ok: false, detail: "facts.mode must be PRE_COMMIT or POST_FLIGHT", mode: null };
  let rp: Facts["recordedProfile"] = null;
  if (isObj(raw.recordedProfile)) {
    const p = raw.recordedProfile;
    rp = {
      models: strArrOrNull(p.models),
      agentCount: typeof p.agentCount === "number" && Number.isFinite(p.agentCount) ? p.agentCount : null,
      effort: typeof p.effort === "string" ? p.effort : null,
    };
  }
  return {
    ok: true,
    facts: {
      mode,
      headingPresentAtHead: boolOrNull(raw.headingPresentAtHead),
      introducingCommitIsAncestorOfHead: boolOrNull(raw.introducingCommitIsAncestorOfHead),
      authorizationFileDirty: boolOrNull(raw.authorizationFileDirty),
      packageCommittedAtHead: boolOrNull(raw.packageCommittedAtHead),
      packageFileDirty: boolOrNull(raw.packageFileDirty),
      stagedPaths: strArrOrNull(raw.stagedPaths),
      changedPathsSinceBaseline: strArrOrNull(raw.changedPathsSinceBaseline),
      executionRecordHeadings: strArrOrNull(raw.executionRecordHeadings),
      recordedProfile: rp,
    },
  };
}

/** True when a path falls under an entry every envelope must forbid. */
export function isMandatoryForbidden(p: string): boolean {
  return MANDATORY_FORBIDDEN.some((f) => matchesForbidden(f, p));
}

/**
 * The only paths an adapter may read for an envelope: its authorization record,
 * package and execution record. Null when the envelope is malformed, any path is
 * unsafe, or any path falls under a mandatory forbidden entry.
 */
export function readableRefs(envelope: unknown): { authFile: string; headingPrefix: string; pkg: string; record: string } | null {
  const p = parseEnvelope(envelope);
  if (!p.ok) return null;
  const e = p.env;
  const refs = [e.authFile, e.pkg, e.record];
  for (const r of refs) {
    if (badPath(r) !== null) return null;
    // forbiddenPaths constrain what a mission may change (V-4..V-6); a read is refused only for the mandatory entries.
    if (isMandatoryForbidden(r)) return null;
  }
  return { authFile: e.authFile, headingPrefix: e.headingPrefix, pkg: e.pkg, record: e.record };
}

/** Extract the envelope: one line-start marker followed by a ```json fence. */
export function extractEnvelope(markdown: string): { ok: true; envelope: unknown } | { ok: false; error: string } {
  if (typeof markdown !== "string") return { ok: false, error: "input is not a string" };
  const re = /^<!-- POA-ENVELOPE v0 -->[ \t]*\r?\n```json\r?\n([\s\S]*?)\r?\n```/gm;
  const hits = Array.from(markdown.matchAll(re));
  if (hits.length === 0) return { ok: false, error: "no envelope marker block found" };
  if (hits.length > 1) return { ok: false, error: "more than one envelope marker block found" };
  try {
    return { ok: true, envelope: JSON.parse(hits[0][1]) };
  } catch {
    return { ok: false, error: "envelope block is not valid JSON" };
  }
}

// ---------------------------------------------------------------- checks

const chk = (id: string, status: Status, detail: string): CheckResult => ({ id, status, detail });
const NA = (id: string, mode: Mode, wanted: Mode) => chk(id, "UNKNOWN", `not applicable in mode ${mode} (applies in ${wanted})`);

function runChecks(env: Envelope, f: Facts): CheckResult[] {
  const out: CheckResult[] = [chk("V-1", "PASS", "envelope and facts are well-formed")];

  // V-2 authorization record
  const p2: string[] = [];
  if (f.headingPresentAtHead !== true) p2.push(f.headingPresentAtHead === false ? "heading prefix not present in the committed file at HEAD" : "heading presence unavailable");
  if (f.introducingCommitIsAncestorOfHead !== true) p2.push(f.introducingCommitIsAncestorOfHead === false ? "introducing commit is not an ancestor of HEAD" : "ancestry unavailable");
  if (f.authorizationFileDirty !== false) p2.push(f.authorizationFileDirty === true ? "authorization file modified in the working tree" : "authorization file state unavailable");
  out.push(p2.length ? chk("V-2", "FAIL", p2.join("; ")) : chk("V-2", "PASS", "authorization heading committed at HEAD, ancestry confirmed, file clean"));

  // V-3 package
  const p3: string[] = [];
  if (f.packageCommittedAtHead !== true) p3.push(f.packageCommittedAtHead === false ? "package not committed at HEAD" : "package commit state unavailable");
  if (f.packageFileDirty !== false) p3.push(f.packageFileDirty === true ? "package modified in the working tree" : "package state unavailable");
  out.push(p3.length ? chk("V-3", "FAIL", p3.join("; ")) : chk("V-3", "PASS", "package committed at HEAD and clean"));

  // V-4 allowlist / forbidden well-formedness
  const p4: string[] = [];
  for (const e of env.allowlist) {
    const r = badAllowEntry(e);
    if (r) p4.push(`allowlist entry "${e}": ${r}`);
  }
  for (const e of env.forbidden) {
    if (e.includes("*")) p4.push(`forbidden entry "${e}": wildcard not allowed`);
    else {
      const r = badPath(e);
      if (r) p4.push(`forbidden entry "${e}": ${r}`);
    }
  }
  for (const m of MANDATORY_FORBIDDEN) if (!env.forbidden.includes(m)) p4.push(`forbiddenPaths lacks mandatory entry "${m}"`);
  if (p4.length === 0) {
    for (const a of env.allowlist) for (const fb of env.forbidden) if (allowVsForbidden(a, fb)) p4.push(`allowlist entry "${a}" overlaps forbidden "${fb}"`);
  }
  out.push(p4.length ? chk("V-4", "FAIL", p4.join("; ")) : chk("V-4", "PASS", "allowlist well-formed, mandatory forbidden entries present, no overlap"));

  // V-5 staged set (pre-commit)
  if (f.mode !== "PRE_COMMIT") out.push(NA("V-5", f.mode, "PRE_COMMIT"));
  else if (f.stagedPaths === null) out.push(chk("V-5", "FAIL", "staged set unavailable"));
  else {
    const outside = f.stagedPaths.filter((s) => !env.allowlist.some((a) => matchesAllow(a, s)));
    const forb = f.stagedPaths.filter((s) => env.forbidden.some((x) => matchesForbidden(x, s)));
    out.push(
      outside.length || forb.length
        ? chk("V-5", "FAIL", `staged outside allowlist: [${outside.join(", ")}]; staged in forbidden paths: [${forb.join(", ")}]`)
        : chk("V-5", "PASS", `${f.stagedPaths.length} staged path(s), all within the allowlist`),
    );
  }

  // V-6 changed paths since baseline (post-flight)
  if (f.mode !== "POST_FLIGHT") out.push(NA("V-6", f.mode, "POST_FLIGHT"));
  else if (f.changedPathsSinceBaseline === null) out.push(chk("V-6", "FAIL", "changed paths since baseline unavailable"));
  else {
    const outside = f.changedPathsSinceBaseline.filter((s) => !env.allowlist.some((a) => matchesAllow(a, s)));
    out.push(
      outside.length
        ? chk("V-6", "FAIL", `changed outside allowlist: [${outside.join(", ")}]`)
        : chk("V-6", "PASS", `${f.changedPathsSinceBaseline.length} changed path(s), all within the allowlist`),
    );
  }

  // V-7 execution-record headings (post-flight)
  if (f.mode !== "POST_FLIGHT") out.push(NA("V-7", f.mode, "POST_FLIGHT"));
  else if (f.executionRecordHeadings === null) out.push(chk("V-7", "FAIL", "execution record headings unavailable"));
  else {
    const hs = f.executionRecordHeadings.map((h) => h.toLowerCase());
    const missing = REQUIRED_RECORD_HEADINGS.filter((r) => !hs.some((h) => h.includes(r.toLowerCase())));
    out.push(missing.length ? chk("V-7", "FAIL", `missing record sections: [${missing.join(", ")}]`) : chk("V-7", "PASS", "all R-B.1 sections present as headings"));
  }

  // V-8 declared vs recorded profile (flag only)
  const rp = f.recordedProfile;
  if (f.mode !== "POST_FLIGHT") out.push(NA("V-8", f.mode, "POST_FLIGHT"));
  else if (rp === null) out.push(chk("V-8", "UNKNOWN", "recorded profile not supplied; declared profile cannot be compared"));
  else {
    const flags: string[] = [];
    const unknown: string[] = [];
    if (rp.models === null) unknown.push("models");
    else {
      const declared = env.models.map((m) => m.toLowerCase());
      const extra = rp.models.filter((m) => !declared.includes(m.toLowerCase()));
      if (extra.length) flags.push(`recorded models not declared: [${extra.join(", ")}]`);
    }
    if (rp.agentCount === null) unknown.push("agentCount");
    else if (rp.agentCount > env.maxAgents) flags.push(`recorded agent count ${rp.agentCount} exceeds declared maximum ${env.maxAgents}`);
    if (rp.effort === null) unknown.push("effort");
    else if (rp.effort.toLowerCase() !== env.effort.toLowerCase()) flags.push(`recorded effort "${rp.effort}" differs from declared "${env.effort}"`);
    if (flags.length) out.push(chk("V-8", "FLAG", flags.join("; ")));
    else if (unknown.length) out.push(chk("V-8", "UNKNOWN", `unobservable recorded fields: [${unknown.join(", ")}]`));
    else out.push(chk("V-8", "PASS", "recorded profile matches declared profile"));
  }

  // V-9 ownership / concurrency declaration
  const p9: string[] = [];
  if (env.maxAgents === 1) {
    if (env.ownership !== null) p9.push("fileOwnership must be null when maxConcurrentAgents is 1");
  } else if (env.ownership === null) p9.push("fileOwnership required when maxConcurrentAgents > 1");
  else {
    const owners = Object.keys(env.ownership);
    if (owners.length < 2) p9.push("fileOwnership needs at least two owners");
    for (const o of owners) {
      const set = env.ownership[o];
      if (set.length === 0) p9.push(`owner "${o}" owns no files`);
      for (const e of set) if (!env.allowlist.includes(e)) p9.push(`owner "${o}" entry "${e}" is not an allowlist entry`);
    }
    for (let i = 0; i < owners.length; i++)
      for (let j = i + 1; j < owners.length; j++)
        for (const a of env.ownership[owners[i]]) for (const b of env.ownership[owners[j]]) if (allowOverlap(a, b)) p9.push(`owners "${owners[i]}" and "${owners[j]}" overlap on "${a}" / "${b}"`);
  }
  out.push(p9.length ? chk("V-9", "FAIL", p9.join("; ")) : chk("V-9", "PASS", "ownership and concurrency declarations are consistent"));
  return out;
}

const STATEMENT = "Structural report only: PASS means the declared structure matches the supplied repository facts. It never means authorized (R-C.2).";

function report(mode: Mode | null, checks: CheckResult[]): VerifierReport {
  return {
    verifierVersion: VERIFIER_VERSION,
    mode,
    checks,
    overall: checks.some((c) => c.status === "FAIL") ? "FAIL" : "PASS",
    authorizationImplied: false,
    decides: "nothing",
    writes: [],
    statement: STATEMENT,
  };
}

/** Pure and total: never throws; malformed input yields FAIL on V-1. */
export function verifyEnvelope(envelope: unknown, facts: unknown): VerifierReport {
  try {
    const e = parseEnvelope(envelope);
    const f = readFacts(facts);
    if (!e.ok || !f.ok) {
      const why = [e.ok ? null : e.detail, f.ok ? null : f.detail].filter((x) => x !== null).join("; ");
      const checks = [chk("V-1", "FAIL", why)];
      for (let i = 2; i <= 9; i++) checks.push(chk(`V-${i}`, "UNKNOWN", "not evaluated: V-1 failed"));
      return report(f.ok ? f.facts.mode : f.mode, checks);
    }
    return report(f.facts.mode, runChecks(e.env, f.facts));
  } catch {
    return report(null, [chk("V-1", "FAIL", "internal error while verifying; treated as malformed input")]);
  }
}
