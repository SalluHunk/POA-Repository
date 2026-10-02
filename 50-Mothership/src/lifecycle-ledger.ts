/**
 * POA-LIFECYCLE-LEDGER-001 - lifecycle ledger, pure derivation core.
 *
 * Boundary: the ratified Mission Package POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE
 * (S5 sources, S7 fields, S8 UNKNOWN codes, S9 schema). Plain data in, ledger out:
 * no I/O, clock or randomness. The output is a DERIVED OBSERVATION: it is not
 * authorization, not an acceptance and not a status of record. It reports which
 * lifecycle states committed evidence supports and never infers the rest.
 *
 * "The ledger is an observation of repository evidence, not a reconstruction of
 * organizational reality."
 */
import { REQUIRED_RECORD_HEADINGS } from "./lifecycle-verifier";

export const SOURCES = {
  adr: "20-Shared/DECISIONS/POA-ADR-001.md",
  pkg: "40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md",
  exec: "40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md",
} as const;
/** The only four ADR sections ever derived, matched by exact heading prefix (S5). */
export const PREFIXES = [
  "# POA-R-001 —",
  "# POA-STD-011 Approval —",
  "# Execution Architecture Standing Rulings R-A, R-B, R-C —",
  "# POA-SEA-IMPL-001 —",
];
const U = { ABSENT: "UNKNOWN_NOT_PRESENT", EVID: "UNKNOWN_NOT_EVIDENCEABLE", ALLOW: "UNKNOWN_NOT_IN_ALLOWLIST", PRE: "UNKNOWN_PRE_R_A" } as const;
const NOT_EVIDENCEABLE = ["READY", "COMMENCED", "EXECUTING", "VERIFIED", "CLOSED_UNDER_6_12"];
const ENUMS = new Set<string>([...Object.values(U), ...NOT_EVIDENCEABLE, "RATIFIED", "MATERIALIZED", "ACCEPTED", "DRAFT", "OTHER", "MISSION", "STANDING_RULING", "R_A_ERA", "PRE_R_A", "RECORDED", "BLANK", "FIELD_ABSENT", "NOT_IN_ALLOWLIST", "0", ...REQUIRED_RECORD_HEADINGS]);
const HEX40 = /^[0-9a-f]{40}$/;
const HEX64 = /^[0-9a-f]{64}$/;
type Rec = Record<string, unknown>;
export type LedgerResult = { ok: true; ledger: Rec } | { ok: false; error: string };

const isObj = (x: unknown): x is Rec => x !== null && typeof x === "object" && !Array.isArray(x);
const strOrNull = (x: unknown): x is string | null => x === null || typeof x === "string";
const hexArr = (x: unknown): x is string[] => Array.isArray(x) && x.every((e) => typeof e === "string" && HEX40.test(e));

/** H1 lines outside fenced code, in file order. */
export function listH1(text: string): { ordinal: number; line: string; at: number }[] {
  const out: { ordinal: number; line: string; at: number }[] = [];
  let fenced = false;
  text.split(/\r?\n/).forEach((l, at) => {
    if (l.trimStart().startsWith("```")) fenced = !fenced;
    else if (!fenced && l.startsWith("# ")) out.push({ ordinal: out.length, line: l, at });
  });
  return out;
}
const headingsOf = (t: string): string[] => t.split(/\r?\n/).map((l) => /^#{1,6}\s+(.*)$/.exec(l)?.[1]).filter((h): h is string => h !== undefined);

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (isObj(v)) return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
  return v;
}
export const canonicalJson = (v: unknown): string => JSON.stringify(sortKeys(v), null, 2);

const okHeading = (h: string): boolean => PREFIXES.some((p) => `# ${h}`.startsWith(p)) && h.length <= 200 && /^[^\r\n`]*$/.test(h);
/** Fail-closed gate (SC-12): every string must be a closed enum, SHA, date, allowlisted path or allowlisted heading. */
function leaks(v: unknown): boolean {
  if (typeof v === "string") return !(ENUMS.has(v) || HEX40.test(v) || HEX64.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v) || Object.values(SOURCES).includes(v as never) || okHeading(v));
  if (Array.isArray(v)) return v.some(leaks);
  return isObj(v) ? Object.values(v).some(leaks) : false;
}

export function deriveLedger(raw: unknown): LedgerResult {
  const no = (error: string): LedgerResult => ({ ok: false, error });
  try {
    if (!isObj(raw) || typeof raw.pin !== "string" || !HEX40.test(raw.pin)) return no("MALFORMED_INPUT");
    if (raw.pinIsAncestorOfHead !== true) return no("PIN_NOT_ANCESTOR_OF_HEAD");
    const hist = raw.adrHistory;
    if (!Array.isArray(hist) || hist.length === 0 || !hist.every((h) => isObj(h) && HEX40.test(String(h.commit)) && typeof h.text === "string")) return no("MALFORMED_INPUT");
    const blobs = hist as { commit: string; text: string }[];
    if (blobs[blobs.length - 1].commit !== raw.pin) return no("PIN_NOT_LAST_IN_HISTORY");
    const { pkgText, execText, execHistory, h1Sha256, sources } = raw;
    if (!strOrNull(pkgText) || !strOrNull(execText) || !(execHistory === null || hexArr(execHistory)) || !Array.isArray(h1Sha256) || !h1Sha256.every((s) => typeof s === "string" && HEX64.test(s)) || !Array.isArray(sources)) return no("MALFORMED_INPUT");

    const pinText = blobs[blobs.length - 1].text;
    const h1 = listH1(pinText);
    if (h1Sha256.length !== h1.length) return no("H1_HASH_COUNT_MISMATCH");
    const lines = pinText.split(/\r?\n/);
    const found = PREFIXES.map((p) => h1.find((h) => h.line.startsWith(p)));
    if (found.some((f) => f === undefined)) return no("MISSING_HEADING");
    const histLines = blobs.map((b) => new Set(b.text.split(/\r?\n/)));
    const ratifiedIdx = (line: string): number => histLines.findIndex((s) => s.has(line));
    const raIdx = ratifiedIdx((found[2] as { line: string }).line);
    const pkgPresent = pkgText !== null;
    const execPresent = execText !== null;
    const execHeads = execPresent ? headingsOf(execText) : [];
    const execPinned = execHistory !== null && execHistory[execHistory.length - 1] === raw.pin ? execHistory : null;

    const rows = found.map((f) => {
      const { ordinal, line, at } = f as { ordinal: number; line: string; at: number };
      const next = h1.find((h) => h.at > at);
      const section = lines.slice(at + 1, next ? next.at : lines.length);
      const heading = line.slice(2);
      const idx = ratifiedIdx(line);
      const shaLine = section.find((l) => l.includes("Implementation commit SHA:"));
      const recordClass = shaLine !== undefined ? "MISSION" : heading.includes("Standing Rulings") ? "STANDING_RULING" : U.EVID;
      const preRA = idx >= 0 && raIdx >= 0 && idx < raIdx;
      const rAApplicability = idx < 0 || raIdx < 0 ? U.EVID : preRA ? "PRE_R_A" : "R_A_ERA";
      const pkgPath = /`(40-Runtime\/[A-Za-z0-9._-]+-MISSION-PACKAGE\.md)`/.exec(section.join("\n"))?.[1];
      const pkgIn = pkgPath === SOURCES.pkg;
      const pkgField = pkgPath === undefined ? U.ABSENT : pkgIn ? pkgPath : U.ALLOW;
      const execPath = pkgIn ? SOURCES.pkg.replace("-MISSION-PACKAGE.md", "-EXECUTION-RECORD.md") : undefined;
      const execIn = execPath === SOURCES.exec;
      const execField = !pkgIn ? pkgField : execIn ? SOURCES.exec : U.ALLOW;
      const statusLine = pkgPresent ? (pkgText as string).split(/\r?\n/).find((l) => l.startsWith("**Status:**")) : undefined;
      const sha = shaLine === undefined ? undefined : /[0-9a-f]{40}/.exec(shaLine.slice(shaLine.indexOf("Implementation commit SHA:")))?.[0];
      const shaState = shaLine === undefined ? "FIELD_ABSENT" : sha === undefined ? "BLANK" : "RECORDED";
      const ancestor = sha !== undefined ? (execPinned !== null && execPinned.includes(sha) ? true : U.EVID) : U.ABSENT;
      const rb = REQUIRED_RECORD_HEADINGS.filter((r) => !execHeads.some((h) => h.toLowerCase().includes(r.toLowerCase())));
      const execFact = (v: boolean) => (preRA ? U.PRE : !execIn ? execField : execPresent ? v : U.ABSENT);
      const accepted = execHeads.some((h) => h.includes("Acceptance Record"));
      const evidenced = [idx >= 0 ? "RATIFIED" : null, shaState === "RECORDED" && ancestor === true ? "MATERIALIZED" : null, recordClass === "MISSION" && execFact(accepted) === true ? "ACCEPTED" : null].filter((s) => s !== null);
      return {
        ordinal, heading,
        decidedDate: /\((\d{4}-\d{2}-\d{2})\)\s*$/.exec(heading)?.[1] ?? U.ABSENT,
        ratifiedCommit: idx >= 0 ? blobs[idx].commit : U.ABSENT,
        recordClass, rAApplicability, packagePath: pkgField,
        packagePresentAtPin: pkgIn ? pkgPresent : pkgField,
        packageStatus: !pkgIn ? pkgField : !pkgPresent ? U.ABSENT : statusLine === undefined ? U.ABSENT : statusLine.includes("RATIFIED") ? "RATIFIED" : statusLine.includes("DRAFT") ? "DRAFT" : "OTHER",
        executionRecordPath: execField,
        executionRecordPresentAtPin: execIn ? execPresent : execField,
        rBSectionsPresent: preRA ? U.PRE : !execIn ? execField : !execPresent ? U.ABSENT : { present: REQUIRED_RECORD_HEADINGS.length - rb.length, of: REQUIRED_RECORD_HEADINGS.length, missing: rb },
        implementationSha: { state: shaState, value: sha ?? null, ancestorOfPin: ancestor },
        acceptanceRecordHeadingPresent: execFact(accepted),
        symmetryNoteHeadingPresent: execFact(execHeads.some((h) => h.includes("Acceptance Recorded"))),
        evidencedStates: evidenced, notEvidenceable: NOT_EVIDENCEABLE,
      };
    });
    const derived = new Set(found.map((f) => (f as { ordinal: number }).ordinal));
    const index = h1.filter((h) => !derived.has(h.ordinal)).map((h) => ({ ordinal: h.ordinal, headingSha256: h1Sha256[h.ordinal], status: "NOT_IN_ALLOWLIST" }));
    const dump = JSON.stringify(rows);
    const count = (c: string) => dump.split(`"${c}"`).length - 1;
    const ledger: Rec = {
      ledgerVersion: "0", derivedObservation: true, authoritative: false, authorizationImplied: false, writes: [],
      pin: { commit: raw.pin, pinIsAncestorOfHead: true }, sources, rows, index,
      summary: { h1Count: h1.length, derivedRows: rows.length, indexOnlyRows: index.length, unknownCounts: Object.fromEntries(Object.values(U).map((c) => [c, count(c)])) },
    };
    return leaks(ledger) ? no("OUTPUT_VALIDATION_REJECTED") : { ok: true, ledger };
  } catch {
    return no("INTERNAL_ERROR");
  }
}
