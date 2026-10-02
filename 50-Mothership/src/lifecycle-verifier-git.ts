/**
 * POA-SEA-IMPL-001 - Lifecycle Verifier, read-only git fact reader and CLI.
 *
 * Boundary: ratified Mission Package POA-SEA-IMPL-001-MISSION-PACKAGE S4 (A-2), S7.
 * Reads repository facts through a closed allowlist of read-only git verbs and
 * reads only the three files an envelope names (authorization record, package,
 * execution record). It writes nothing, authorizes nothing and decides nothing;
 * the report it prints is structural evidence only (R-C).
 *
 * Usage (no package script is added):
 *   npx tsx src/lifecycle-verifier-git.ts --package <repo-relative path> --mode pre-commit|post-flight
 *        [--baseline <sha>] [--recorded-profile '<json>'] [--repo <dir>]
 * Exit codes: 0 PASS, 1 FAIL, 2 tool error.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { extractEnvelope, isMandatoryForbidden, readableRefs, verifyEnvelope, type Mode, type VerifierReport } from "./lifecycle-verifier";

const SHA = /^[0-9a-f]{7,40}$/;
const FULL_SHA = /^[0-9a-f]{40}$/;
const ALLOWED_VERBS = new Set(["rev-parse", "merge-base", "show", "log", "diff", "status", "ls-files"]);

/** Throws unless args are one of the closed set of read-only git invocations. */
export function assertAllowedGit(args: string[]): void {
  const [verb, ...rest] = args;
  if (!ALLOWED_VERBS.has(verb)) throw new Error(`git verb not allowed: ${String(verb)}`);
  const ok = (() => {
    switch (verb) {
      case "rev-parse":
        return (rest.length === 1 && rest[0] === "HEAD") || (rest.length === 2 && rest[0] === "--abbrev-ref" && rest[1] === "HEAD");
      case "merge-base":
        return rest.length === 3 && rest[0] === "--is-ancestor" && FULL_SHA.test(rest[1]) && rest[2] === "HEAD";
      case "show":
        return rest.length === 1 && /^(HEAD|[0-9a-f]{40}):[^\s-][^\0]*$/.test(rest[0]);
      case "log":
        return rest.length === 4 && rest[0] === "--reverse" && rest[1] === "--format=%H" && rest[2] === "--" && !rest[3].startsWith("-");
      case "diff": {
        const flags = rest.filter((a) => a.startsWith("-"));
        const pos = rest.filter((a) => !a.startsWith("-"));
        return flags.every((a) => a === "--name-only" || a === "--cached") && pos.every((a) => a === "HEAD" || SHA.test(a)) && pos.length <= 2;
      }
      case "status":
        return rest.length === 3 && rest[0] === "--porcelain" && rest[1] === "--" && !rest[2].startsWith("-");
      case "ls-files":
        return rest.length === 2 && rest[0] === "--" && !rest[1].startsWith("-");
      default:
        return false;
    }
  })();
  if (!ok) throw new Error(`git invocation not allowed: ${args.join(" ")}`);
}

function runGit(repo: string, args: string[]): { code: number; out: string } {
  assertAllowedGit(args);
  const r = spawnSync("git", ["--no-optional-locks", "-c", "core.quotepath=false", ...args], { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  return { code: r.status ?? 2, out: r.stdout ?? "" };
}
const lines = (s: string): string[] => s.split(/\r?\n/).filter((l) => l.length > 0);

export interface CollectOptions {
  repo: string;
  packagePath: string;
  mode: Mode;
  baseline?: string;
  recordedProfile?: unknown;
}
export interface Collected {
  envelope: unknown;
  facts: Record<string, unknown>;
  notes: string[];
}

/** Gather plain-data facts. Any fact that cannot be observed stays null. */
export function collectFacts(o: CollectOptions): Collected {
  const notes: string[] = [];
  const facts: Record<string, unknown> = { mode: o.mode };
  let envelope: unknown = null;
  // The package path is supplied by the operator; it is vetted by the same rule as envelope paths.
  if (path.isAbsolute(o.packagePath) || o.packagePath.split(/[\\/]/).includes("..") || o.packagePath.includes("\\") || isMandatoryForbidden(o.packagePath)) {
    notes.push("package path refused (absolute, traversal or forbidden location)");
    return { envelope, facts, notes };
  }
  let text: string;
  try {
    text = readFileSync(path.join(o.repo, o.packagePath), "utf8");
  } catch {
    notes.push("package file could not be read");
    return { envelope, facts, notes };
  }
  const ex = extractEnvelope(text);
  if (!ex.ok) {
    notes.push(`envelope extraction failed: ${ex.error}`);
    return { envelope, facts, notes };
  }
  envelope = ex.envelope;
  const refs = readableRefs(envelope);
  if (refs === null) {
    notes.push("envelope references are malformed, unsafe or forbidden; no files read");
    return { envelope, facts, notes };
  }

  const head = runGit(o.repo, ["rev-parse", "HEAD"]);
  facts.headCommit = head.code === 0 ? head.out.trim() : null;
  const branch = runGit(o.repo, ["rev-parse", "--abbrev-ref", "HEAD"]);
  facts.branch = branch.code === 0 ? branch.out.trim() : null;

  // authorization record: heading at HEAD, introducing commit, ancestry, cleanliness
  const authAtHead = runGit(o.repo, ["show", `HEAD:${refs.authFile}`]);
  const headingLine = authAtHead.code === 0 ? lines(authAtHead.out).find((l) => l.startsWith(refs.headingPrefix)) : undefined;
  facts.headingPresentAtHead = authAtHead.code === 0 ? headingLine !== undefined : null;
  facts.introducingCommit = null;
  facts.introducingCommitIsAncestorOfHead = null;
  if (headingLine !== undefined) {
    const history = runGit(o.repo, ["log", "--reverse", "--format=%H", "--", refs.authFile]);
    for (const sha of history.code === 0 ? lines(history.out) : []) {
      if (!FULL_SHA.test(sha)) continue;
      const blob = runGit(o.repo, ["show", `${sha}:${refs.authFile}`]);
      if (blob.code === 0 && lines(blob.out).includes(headingLine)) {
        facts.introducingCommit = sha;
        facts.introducingCommitIsAncestorOfHead = runGit(o.repo, ["merge-base", "--is-ancestor", sha, "HEAD"]).code === 0;
        break;
      }
    }
  }
  const authDirty = runGit(o.repo, ["status", "--porcelain", "--", refs.authFile]);
  facts.authorizationFileDirty = authDirty.code === 0 ? authDirty.out.trim().length > 0 : null;

  // package: committed at HEAD and clean
  facts.packageCommittedAtHead = runGit(o.repo, ["show", `HEAD:${refs.pkg}`]).code === 0;
  const pkgDirty = runGit(o.repo, ["status", "--porcelain", "--", refs.pkg]);
  facts.packageFileDirty = pkgDirty.code === 0 ? pkgDirty.out.trim().length > 0 : null;

  const staged = runGit(o.repo, ["diff", "--cached", "--name-only"]);
  facts.stagedPaths = staged.code === 0 ? lines(staged.out) : null;

  facts.changedPathsSinceBaseline = null;
  if (o.baseline !== undefined) {
    if (!SHA.test(o.baseline)) notes.push("baseline is not a commit hash; ignored");
    else {
      const d = runGit(o.repo, ["diff", "--name-only", o.baseline, "HEAD"]);
      facts.changedPathsSinceBaseline = d.code === 0 ? lines(d.out) : null;
    }
  }
  facts.executionRecordHeadings = null;
  if (o.mode === "POST_FLIGHT") {
    try {
      const rec = readFileSync(path.join(o.repo, refs.record), "utf8");
      facts.executionRecordHeadings = lines(rec)
        .map((l) => /^#{1,6}\s+(.*)$/.exec(l))
        .filter((m): m is RegExpExecArray => m !== null)
        .map((m) => m[1]);
    } catch {
      notes.push("execution record could not be read");
    }
  }
  facts.recordedProfile = o.recordedProfile ?? null;
  return { envelope, facts, notes };
}

export function verifyPackage(o: CollectOptions): { report: VerifierReport; notes: string[] } {
  const c = collectFacts(o);
  return { report: verifyEnvelope(c.envelope, c.facts), notes: c.notes };
}

function parseArgs(argv: string[]): CollectOptions {
  const m = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith("--") || i + 1 >= argv.length) throw new Error(`bad arguments near "${argv[i]}"`);
    m.set(argv[i], argv[i + 1]);
  }
  const mode = m.get("--mode");
  const pkg = m.get("--package");
  if (!pkg || (mode !== "pre-commit" && mode !== "post-flight")) throw new Error("--package and --mode (pre-commit|post-flight) are required");
  let recordedProfile: unknown;
  const rp = m.get("--recorded-profile");
  if (rp !== undefined) recordedProfile = JSON.parse(rp);
  return {
    repo: path.resolve(m.get("--repo") ?? process.cwd()),
    packagePath: pkg,
    mode: mode === "pre-commit" ? "PRE_COMMIT" : "POST_FLIGHT",
    baseline: m.get("--baseline"),
    recordedProfile,
  };
}

export function main(argv: string[]): number {
  try {
    const { report, notes } = verifyPackage(parseArgs(argv));
    console.log(JSON.stringify({ report, adapterNotes: notes }, null, 2));
    return report.overall === "PASS" ? 0 : 1;
  } catch (e) {
    console.error(`lifecycle-verifier: tool error: ${e instanceof Error ? e.message : String(e)}`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
