import { describe, expect, it } from "vitest";
import { computeAllCapabilityGaps } from "@/lib/services/capability";
import { deriveSignals } from "@/lib/services/signals";
import { deriveRecommendations } from "@/lib/services/recommendations";
import { demoOrganization } from "@/lib/data/demo-organization";

describe("deriveRecommendations", () => {
  it("produces a high-priority recommendation for the risk signal, traceable back to it", () => {
    const gapsByProject = computeAllCapabilityGaps(demoOrganization);
    const signals = deriveSignals(demoOrganization, gapsByProject);
    const recommendations = deriveRecommendations(demoOrganization, signals);

    const riskSignal = signals.find((s) => s.type === "risk")!;
    const recommendation = recommendations.find((r) => r.relatedSignalId === riskSignal.id);

    expect(recommendation).toBeDefined();
    expect(recommendation?.priority).toBe("high");
    expect(recommendation?.suggestedAction.length).toBeGreaterThan(0);
    expect(recommendation?.responsibleArea).toBe("Client Delivery");
  });

  it("produces a lower-priority recommendation for opportunity signals", () => {
    const gapsByProject = computeAllCapabilityGaps(demoOrganization);
    const signals = deriveSignals(demoOrganization, gapsByProject);
    const recommendations = deriveRecommendations(demoOrganization, signals);

    const opportunitySignal = signals.find((s) => s.type === "opportunity")!;
    const recommendation = recommendations.find((r) => r.relatedSignalId === opportunitySignal.id);

    expect(recommendation).toBeDefined();
    expect(recommendation?.priority).toBe("low");
  });
});
