import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getOrganizationalState } from "@/lib/organizational-state";
import { deterministicAlexisEngine } from "@/lib/alexis/engine";
import { mapStateToNetworkGraph } from "@/lib/expression/network-mapping";
import { EXPRESSION_PROFILES } from "@/lib/expression/registry";
import { POA_VISUAL_DNA } from "@/lib/expression/visual-dna";

/**
 * Architectural boundary tests (POA-VIS-003 MISSION 14). These are the
 * mechanical proof that POA Core and the Expression Layer stay separated —
 * not prose, actual assertions over the source tree and over a live
 * OrganizationalState. Typecheck/lint/build/browser validation (mission
 * DoD item "type safety is preserved" and the four `npm run` validations)
 * are run separately, not duplicated here.
 */

const SRC_ROOT = path.resolve(import.meta.dirname, "..", "..");

function listFiles(relativeDir: string, extensions: string[]): string[] {
  const dir = path.join(SRC_ROOT, relativeDir);
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(path.relative(SRC_ROOT, full), extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function importSpecifiers(fileText: string): string[] {
  return [...fileText.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
}

describe("POA Core / Expression Layer architectural boundary", () => {
  it("1. POA Core (domain, services, alexis, organizational-state) never imports the Expression Layer or components", () => {
    const coreFiles = [
      ...listFiles("lib/domain", [".ts"]),
      ...listFiles("lib/services", [".ts"]),
      ...listFiles("lib/alexis", [".ts"]),
      path.join(SRC_ROOT, "lib", "organizational-state.ts"),
    ].filter((f) => !f.endsWith(".test.ts"));

    expect(coreFiles.length).toBeGreaterThan(0);

    for (const file of coreFiles) {
      const text = fs.readFileSync(file, "utf8");
      for (const spec of importSpecifiers(text)) {
        expect(spec.startsWith("@/components")).toBe(false);
        expect(spec.startsWith("@/lib/expression")).toBe(false);
      }
    }
  });

  it("2. No component, in either expression profile, imports business-logic services directly", () => {
    const componentFiles = listFiles("components", [".tsx", ".ts"]).filter(
      (f) => !f.endsWith(".test.ts") && !f.endsWith(".test.tsx")
    );
    expect(componentFiles.length).toBeGreaterThan(0);

    for (const file of componentFiles) {
      const text = fs.readFileSync(file, "utf8");
      for (const spec of importSpecifiers(text)) {
        expect(spec.startsWith("@/lib/services")).toBe(false);
      }
    }
  });

  it("2b. The Expression Layer's own lib code (mapping/registry/profiles) never imports business-logic services", () => {
    const expressionLibFiles = listFiles("lib/expression", [".ts"]).filter((f) => !f.endsWith(".test.ts"));
    expect(expressionLibFiles.length).toBeGreaterThan(0);

    for (const file of expressionLibFiles) {
      const text = fs.readFileSync(file, "utf8");
      for (const spec of importSpecifiers(text)) {
        expect(spec.startsWith("@/lib/services")).toBe(false);
      }
    }
  });

  it("3 & 6. Signals remain identical, and organizational truth is unchanged, after every profile consumes the state", () => {
    const state = getOrganizationalState();
    const snapshot = JSON.stringify(state);

    for (const profile of Object.values(EXPRESSION_PROFILES)) {
      mapStateToNetworkGraph(state, profile);
    }

    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it("4. Multiple visual profiles can consume the SAME OrganizationalState instance without duplicating business logic", () => {
    const state = getOrganizationalState();
    const results = Object.values(EXPRESSION_PROFILES).map((profile) => mapStateToNetworkGraph(state, profile));

    expect(results).toHaveLength(Object.keys(EXPRESSION_PROFILES).length);
    for (const graph of results) {
      expect(graph.nodes.filter((n) => n.kind === "signal")).toHaveLength(state.signals.length);
    }
  });

  it("5. The current VIS-002 scenario remains functional (unchanged baseline: 3 gaps, at-risk health)", () => {
    const state = getOrganizationalState();
    const gaps = state.capabilityGapsByProject["proj-enterprise-ai-transformation"] ?? [];
    expect(gaps.filter((g) => g.isGap).length).toBe(3);
    expect(state.overallHealth).toBe("at-risk");
  });

  it("7. Alexis receives an identical response before and after the Expression Layer reads the same state", () => {
    const state = getOrganizationalState();
    const before = deterministicAlexisEngine.ask("give me an executive briefing", state);

    mapStateToNetworkGraph(state, EXPRESSION_PROFILES["network-graph"]);

    const after = deterministicAlexisEngine.ask("give me an executive briefing", state);
    expect(after).toEqual(before);
  });

  it("every registered profile shares the exact same POA Visual DNA reference (no per-profile drift)", () => {
    for (const profile of Object.values(EXPRESSION_PROFILES)) {
      expect(profile.visualIdentity.sharedPrinciples).toBe(POA_VISUAL_DNA);
    }
  });
});
