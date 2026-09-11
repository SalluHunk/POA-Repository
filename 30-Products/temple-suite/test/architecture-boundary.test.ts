/**
 * DGP-DEV-001 Phase B acceptance test #1: no module directly queries
 * another module underlying tables. Enforced by scanning every module
 * source file for an import path that reaches into a sibling module
 * beyond that sibling module public index -- e.g. "modules/events/store"
 * is disallowed anywhere outside the events module itself; only a bare
 * "modules/events" (its index) is allowed.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const MODULES_DIR = path.resolve(import.meta.dirname, "../src/modules");
const MODULE_NAMES = readdirSync(MODULES_DIR).filter((name) =>
  statSync(path.join(MODULES_DIR, name)).isDirectory()
);

function collectTsFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(full));
    } else if (entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function extractImportPaths(content: string): string[] {
  const paths: string[] = [];
  const importRegex = /from\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = importRegex.exec(content))) {
    paths.push(m[1]);
  }
  return paths;
}

describe("module boundary: cross-module imports must resolve to a sibling public index only", () => {
  for (const moduleName of MODULE_NAMES) {
    it("module " + moduleName + " only imports sibling modules via their public index", () => {
      const files = collectTsFiles(path.join(MODULES_DIR, moduleName));
      for (const file of files) {
        const content = readFileSync(file, "utf8");
        for (const importPath of extractImportPaths(content)) {
          const match = importPath.match(/modules\/([^/]+)(\/(.*))?$/);
          if (!match) continue;
          const otherModule = match[1];
          const rest = match[3];
          if (otherModule === moduleName) continue;
          const label = path.relative(MODULES_DIR, file) + " imports " + importPath;
          expect(rest === undefined || rest === "index", label).toBe(true);
        }
      }
    });
  }
});

/**
 * DGP-DEV-006 mission directive section 9: prove DGP does not write to
 * Seva Scheduling, Seva Scheduling does not write to DGP internals, and
 * DGP does not bypass the event/interface boundary by reaching for Seva
 * Scheduling's write interface directly. Extends the existing static
 * scan mechanism above rather than introducing a second one.
 */
describe("DGP-DEV-006: DGP <-> Seva Scheduling peer-module write boundary", () => {
  it("Seva Scheduling never imports from dgp (in either direction, peer modules do not reach into each other)", () => {
    const sevaFiles = collectTsFiles(path.join(MODULES_DIR, "seva-scheduling"));
    for (const file of sevaFiles) {
      const content = readFileSync(file, "utf8");
      for (const importPath of extractImportPaths(content)) {
        const label = path.relative(MODULES_DIR, file) + " imports " + importPath;
        expect(importPath.includes("modules/dgp"), label).toBe(false);
      }
    }
  });

  it("dgp's source never references Seva Scheduling's write interface (recordSevaBooking)", () => {
    const dgpFiles = collectTsFiles(path.join(MODULES_DIR, "dgp"));
    for (const file of dgpFiles) {
      const content = readFileSync(file, "utf8");
      const label = path.relative(MODULES_DIR, file) + " must not reference recordSevaBooking";
      expect(content.includes("recordSevaBooking"), label).toBe(false);
    }
  });

  it("dgp only imports seva-scheduling's public index, never its internal store", () => {
    const dgpFiles = collectTsFiles(path.join(MODULES_DIR, "dgp"));
    for (const file of dgpFiles) {
      const content = readFileSync(file, "utf8");
      for (const importPath of extractImportPaths(content)) {
        if (!importPath.includes("modules/seva-scheduling")) continue;
        const label = path.relative(MODULES_DIR, file) + " imports " + importPath;
        expect(importPath.endsWith("/store"), label).toBe(false);
      }
    }
  });
});
