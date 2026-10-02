/**
 * POA-LIFECYCLE-LEDGER-001 - read-only pinned-blob reader and CLI.
 *
 * Boundary: ratified Mission Package POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE (S4 A-2, S5, S6).
 * Reads exactly the three source paths as committed blobs at a pinned 40-hex commit,
 * through the verifier's exported closed git allowlist (assertAllowedGit). It never
 * reads the working tree, never writes, and prints the ledger to stdout only.
 *
 *   npx tsx src/lifecycle-ledger-git.ts --pin <40-hex commit> [--repo <repository root>]
 * Exit codes: 0 ledger printed, 2 refused or failed (nothing printed to stdout).
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { assertAllowedGit } from "./lifecycle-verifier-git";
import { SOURCES, canonicalJson, deriveLedger, listH1, type LedgerResult } from "./lifecycle-ledger";

const HEX40 = /^[0-9a-f]{40}$/;
const sha256 = (s: string): string => createHash("sha256").update(s).digest("hex");
const lines = (s: string): string[] => s.split(/\r?\n/).filter((l) => l.length > 0);

function git(repo: string, args: string[]): { code: number; out: string } {
  assertAllowedGit(args);
  const r = spawnSync("git", ["--no-optional-locks", "-c", "core.quotepath=false", ...args], { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  return { code: r.status ?? 2, out: r.stdout ?? "" };
}

/** Commits touching a path, oldest first, cut at the pin (the pin must be in the list). */
function historyUpTo(repo: string, pin: string, path: string): string[] | null {
  const r = git(repo, ["log", "--reverse", "--format=%H", "--", path]);
  const all = r.code === 0 ? lines(r.out).filter((c) => HEX40.test(c)) : [];
  const i = all.indexOf(pin);
  return i < 0 ? null : all.slice(0, i + 1);
}
const blobAt = (repo: string, commit: string, path: string): string | null => {
  const r = git(repo, ["show", `${commit}:${path}`]);
  return r.code === 0 ? r.out : null;
};

export function runLedger(repo: string, pin: string): LedgerResult {
  if (!HEX40.test(pin)) return { ok: false, error: "PIN_NOT_40_HEX" };
  const anc = git(repo, ["merge-base", "--is-ancestor", pin, "HEAD"]);
  if (anc.code !== 0) return { ok: false, error: "PIN_NOT_ANCESTOR_OF_HEAD" };
  const adrCommits = historyUpTo(repo, pin, SOURCES.adr);
  if (adrCommits === null) return { ok: false, error: "PIN_NOT_IN_ADR_HISTORY" };
  const adrHistory = adrCommits.map((commit) => ({ commit, text: blobAt(repo, commit, SOURCES.adr) ?? "" }));
  const pkgText = blobAt(repo, pin, SOURCES.pkg);
  const execText = blobAt(repo, pin, SOURCES.exec);
  const meta = (path: string, text: string | null) => (text === null ? [] : [{ path, sha256: sha256(text), bytes: Buffer.byteLength(text, "utf8") }]);
  const pinText = adrHistory[adrHistory.length - 1].text;
  return deriveLedger({
    pin, pinIsAncestorOfHead: true, adrHistory, pkgText, execText,
    execHistory: historyUpTo(repo, pin, SOURCES.exec),
    h1Sha256: listH1(pinText).map((h) => sha256(h.line)),
    sources: [...meta(SOURCES.adr, pinText), ...meta(SOURCES.pkg, pkgText), ...meta(SOURCES.exec, execText)],
  });
}

export function main(argv: string[]): number {
  const arg = (name: string): string | undefined => (argv.indexOf(name) >= 0 ? argv[argv.indexOf(name) + 1] : undefined);
  const pin = arg("--pin");
  const repo = arg("--repo") ?? process.cwd();
  if (pin === undefined) {
    console.error("lifecycle-ledger: usage: --pin <40-hex commit> [--repo <repository root>]");
    return 2;
  }
  try {
    const r = runLedger(repo, pin);
    if (!r.ok) {
      console.error(`lifecycle-ledger: refused: ${r.error}`);
      return 2;
    }
    console.log(canonicalJson(r.ledger));
    return 0;
  } catch (e) {
    console.error(`lifecycle-ledger: tool error: ${e instanceof Error ? e.message : String(e)}`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
