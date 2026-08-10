import { describe, expect, it } from "vitest";
import { getOrganizationalState } from "@/lib/organizational-state";

describe("organizational state derivation", () => {
  it("separates derived state from source data and preserves the VIS-001 scenario", () => {
    const state = getOrganizationalState();

    // The VIS-001 scenario outcome must remain unchanged by VIS-002.
    const gaps = state.capabilityGapsByProject["proj-enterprise-ai-transformation"];
    expect(gaps).toBeDefined();
    expect(gaps.length).toBe(8);
    const gapEntries = gaps.filter((g) => g.isGap);
    expect(gapEntries.length).toBe(3);
    expect(gapEntries.map((g) => g.capabilityId).sort()).toEqual(
      ["cap-change-management", "cap-llm-integration", "cap-mlops"].sort()
    );

    expect(state.overallHealth).toBe("at-risk");
  });

  it("derives signals and recommendations rather than reading them verbatim from source data", () => {
    const state = getOrganizationalState();

    expect(state.signals.length).toBeGreaterThan(0);
    expect(state.recommendations.length).toBeGreaterThan(0);

    // Every recommendation must trace back to a real signal.
    for (const recommendation of state.recommendations) {
      expect(state.signals.some((s) => s.id === recommendation.relatedSignalId)).toBe(true);
    }
  });

  it("produces at least one signal of each required type", () => {
    const state = getOrganizationalState();
    const types = new Set(state.signals.map((s) => s.type));
    expect(types.has("risk")).toBe(true);
    expect(types.has("capability-gap")).toBe(true);
    expect(types.has("opportunity")).toBe(true);
    expect(types.has("organizational-health")).toBe(true);
  });
});
