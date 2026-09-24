/**
 * Read-only repository -> runtime path for committed, authority-bearing
 * records (POA - MOTHERSHIP DOGFOODING SLICE 001, rulings D-B / D-C / D-D).
 *
 * Exactly two sources, kept as independent feeds with no join between them
 * (D-A: Project<->Mission stays unspecified):
 *   - POA-ADR-001 Decision Records
 *   - POA-PJR-001 Project Registry
 *
 * Content is read from the committed blob at a pinned commit (`git show
 * <sha>:<path>`), never from the working tree, so an uncommitted local edit
 * cannot masquerade as committed repository truth, and an untracked file
 * (e.g. an uncommitted 40-Runtime report) cannot be read at all.
 *
 * Every exposed fact carries a Repository Reference (POA-EVID-001 GOV-015
 * §2; POA-EVT-001 §G: file path plus commit SHA) plus the record's own
 * verbatim heading as the within-file locator - the same way PJR-001
 * already cites POA-ADR-001 records by quoted heading.
 *
 * Text is passed through verbatim (only CRLF -> LF and surrounding
 * whitespace / `---` separators are trimmed), so PJR-001's existing
 * confidence markers survive unchanged. Nothing here classifies, merges,
 * or derives status.
 */
import { execFileSync } from "node:child_process";

export const AUTHORITATIVE_SOURCES = {
  decisionRecords: "20-Shared/DECISIONS/POA-ADR-001.md",
  projectRegistry: "20-Shared/PJR/POA-PJR-001-PARAVYOMA-PROJECT-REGISTRY.md",
} as const;

export interface RepositoryReference {
  path: string;
  commit: string;
  heading: string;
}

export interface Section {
  heading: string;
  body: string;
}

export interface DecisionRecord {
  title: string;
  date: string;
  preamble: string;
  sections: Section[];
  repositoryReference: RepositoryReference;
}

export interface ProjectRegistryEntry {
  fields: Array<{ field: string; value: string }>;
  repositoryReference: RepositoryReference;
}

export interface ProjectRegistryAddendum {
  body: string;
  repositoryReference: RepositoryReference;
}

export interface ProjectRegistry {
  entries: ProjectRegistryEntry[];
  addenda: ProjectRegistryAddendum[];
}

export type FeedResult<T> = { ok: true; value: T } | { ok: false; detail: string };

/** Each feed succeeds or fails on its own; only resolving the commit is shared. */
export interface RepositoryRecords {
  commit: string;
  decisionRecords: FeedResult<DecisionRecord[]>;
  projectRegistry: FeedResult<ProjectRegistry>;
}

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", ["-C", repoRoot, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function findRepositoryRoot(fromDir: string): string {
  return git(fromDir, ["rev-parse", "--show-toplevel"]).trim();
}

function readCommittedFile(repoRoot: string, commit: string, path: string): string {
  return git(repoRoot, ["show", `${commit}:${path}`]).replace(/\r\n/g, "\n");
}

interface Block {
  heading: string;
  line: number;
  lines: string[];
}

/** Splits on headings of exactly `marker` level, ignoring fenced code. Text before the first heading is returned as `lead`. */
function splitByHeading(lines: string[], marker: "#" | "##"): { lead: string[]; blocks: Block[] } {
  const prefix = `${marker} `;
  const lead: string[] = [];
  const blocks: Block[] = [];
  let inFence = false;
  lines.forEach((line, index) => {
    if (line.startsWith("```")) inFence = !inFence;
    if (!inFence && line.startsWith(prefix)) {
      blocks.push({ heading: line.slice(prefix.length).trim(), line: index + 1, lines: [] });
      return;
    }
    (blocks.length ? blocks[blocks.length - 1].lines : lead).push(line);
  });
  return { lead, blocks };
}

function cleanBody(lines: string[]): string {
  const out = [...lines];
  const isTrim = (l: string | undefined) => l !== undefined && (l.trim() === "" || l.trim() === "---");
  while (isTrim(out[0])) out.shift();
  while (isTrim(out[out.length - 1])) out.pop();
  return out.join("\n");
}

const DECISION_RECORD_HEADING = /^(.+) \((\d{4}-\d{2}-\d{2})\)$/;

/**
 * POA-ADR-001 = the specification preamble, then additive records, each a
 * top-level `# <Title> (<YYYY-MM-DD>)` heading. Once the first record is
 * seen, any top-level heading that isn't a dated record is an error rather
 * than a silent drop.
 */
export function parseDecisionRecords(text: string, path: string, commit: string): DecisionRecord[] {
  const { blocks } = splitByHeading(text.split("\n"), "#");
  const firstRecord = blocks.findIndex((b) => DECISION_RECORD_HEADING.test(b.heading));
  if (firstRecord === -1) throw new Error(`${path}: no dated Decision Record headings found`);

  return blocks.slice(firstRecord).map((block) => {
    const match = DECISION_RECORD_HEADING.exec(block.heading);
    if (!match) {
      throw new Error(`${path}:${block.line}: top-level heading "${block.heading}" is not a dated Decision Record`);
    }
    const { lead, blocks: sections } = splitByHeading(block.lines, "##");
    return {
      title: match[1],
      date: match[2],
      preamble: cleanBody(lead),
      sections: sections.map((s) => ({ heading: s.heading, body: cleanBody(s.lines) })),
      repositoryReference: { path, commit, heading: block.heading },
    };
  });
}

const REGISTRY_FRAMING_SECTIONS = ["Schema", "Registry Discipline"];

function parseFieldTable(lines: string[], where: string): Array<{ field: string; value: string }> {
  const fields: Array<{ field: string; value: string }> = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "" || line === "---") continue;
    if (!line.startsWith("|")) throw new Error(`${where}: unexpected non-table content "${line}"`);
    const cells = line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
    if (cells.length !== 2) throw new Error(`${where}: table row does not have exactly two cells: "${line}"`);
    if (/^-+$/.test(cells[0]) || (cells[0] === "Field" && cells[1] === "Value")) continue;
    fields.push({ field: cells[0], value: cells[1] });
  }
  return fields;
}

/**
 * POA-PJR-001 = framing sections, `## Entry N — <Name>` field tables, and
 * dated `## Addendum ...` sections. Addenda are exposed verbatim and are
 * NOT merged into the entries they update - reconciling them is not a
 * decision this path makes.
 */
export function parseProjectRegistry(text: string, path: string, commit: string): ProjectRegistry {
  const { blocks } = splitByHeading(text.split("\n"), "##");
  const registry: ProjectRegistry = { entries: [], addenda: [] };
  for (const block of blocks) {
    const repositoryReference = { path, commit, heading: block.heading };
    if (/^Entry \d+\b/.test(block.heading)) {
      registry.entries.push({ fields: parseFieldTable(block.lines, `${path}:${block.line}`), repositoryReference });
    } else if (block.heading.startsWith("Addendum")) {
      registry.addenda.push({ body: cleanBody(block.lines), repositoryReference });
    } else if (!REGISTRY_FRAMING_SECTIONS.some((name) => block.heading.startsWith(name))) {
      throw new Error(`${path}:${block.line}: unrecognized registry section "${block.heading}"`);
    }
  }
  if (registry.entries.length === 0) throw new Error(`${path}: no registry entries found`);
  return registry;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function loadFeed<T>(
  repoRoot: string,
  commit: string,
  path: string,
  parse: (text: string, path: string, commit: string) => T,
): FeedResult<T> {
  try {
    return { ok: true, value: parse(readCommittedFile(repoRoot, commit, path), path, commit) };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export function loadRepositoryRecords(repoRoot: string): RepositoryRecords {
  const commit = git(repoRoot, ["rev-parse", "HEAD"]).trim();
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`unexpected HEAD commit "${commit}"`);
  const { decisionRecords, projectRegistry } = AUTHORITATIVE_SOURCES;
  return deepFreeze({
    commit,
    decisionRecords: loadFeed(repoRoot, commit, decisionRecords, parseDecisionRecords),
    projectRegistry: loadFeed(repoRoot, commit, projectRegistry, parseProjectRegistry),
  });
}
