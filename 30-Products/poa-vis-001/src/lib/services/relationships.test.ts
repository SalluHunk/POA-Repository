import { describe, expect, it } from "vitest";
import { getOrganizationalState } from "@/lib/organizational-state";
import { traceProjectImpactChain } from "@/lib/services/relationships";

describe("traceProjectImpactChain", () => {
  it("traces PROJECT -> CAPABILITY REQUIREMENT -> CAPABILITY GAP -> DEPARTMENT -> RISK -> RECOMMENDATION", () => {
    const state = getOrganizationalState();
    const chain = traceProjectImpactChain(
      state.organization,
      "proj-enterprise-ai-transformation",
      state.capabilityGapsByProject["proj-enterprise-ai-transformation"],
      state.recommendations
    );

    expect(chain).not.toBeNull();
    const stages = chain!.links.map((l) => l.stage);

    expect(stages[0]).toBe("project");
    expect(stages).toContain("capability-requirement");
    expect(stages).toContain("capability-gap");
    expect(stages).toContain("department");
    expect(stages).toContain("risk");
    expect(stages).toContain("recommendation");

    // Ordering: gap-related stages must appear after requirement stages,
    // and risk/recommendation must be the last two stages.
    expect(stages.indexOf("capability-gap")).toBeGreaterThan(stages.indexOf("capability-requirement"));
    expect(stages[stages.length - 1]).toBe("recommendation");
    expect(stages[stages.length - 2]).toBe("risk");
  });

  it("returns null for an unknown project id", () => {
    const state = getOrganizationalState();
    const chain = traceProjectImpactChain(state.organization, "proj-does-not-exist", [], []);
    expect(chain).toBeNull();
  });
});
