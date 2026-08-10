import { describe, expect, it } from "vitest";
import { computeAllCapabilityGaps } from "@/lib/services/capability";
import { deriveSignals, capabilityGapSignalId, riskSignalId } from "@/lib/services/signals";
import { demoOrganization } from "@/lib/data/demo-organization";

describe("deriveSignals", () => {
  it("generates a capability-gap and risk signal for the AI Transformation project", () => {
    const gapsByProject = computeAllCapabilityGaps(demoOrganization);
    const signals = deriveSignals(demoOrganization, gapsByProject);

    const gapSignal = signals.find((s) => s.id === capabilityGapSignalId("proj-enterprise-ai-transformation"));
    expect(gapSignal).toBeDefined();
    expect(gapSignal?.type).toBe("capability-gap");
    expect(gapSignal?.status).toBe("active");

    const riskSignal = signals.find((s) => s.id === riskSignalId("proj-enterprise-ai-transformation"));
    expect(riskSignal).toBeDefined();
    expect(riskSignal?.type).toBe("risk");
    expect(["high", "critical"]).toContain(riskSignal?.severity);
  });

  it("generates an opportunity signal for redeployable capacity", () => {
    const gapsByProject = computeAllCapabilityGaps(demoOrganization);
    const signals = deriveSignals(demoOrganization, gapsByProject);

    const opportunitySignal = signals.find((s) => s.type === "opportunity");
    expect(opportunitySignal).toBeDefined();
    expect(opportunitySignal?.severity).toBe("info");
  });

  it("every signal carries an explanation and at least one affected entity", () => {
    const gapsByProject = computeAllCapabilityGaps(demoOrganization);
    const signals = deriveSignals(demoOrganization, gapsByProject);

    for (const signal of signals) {
      expect(signal.explanation.length).toBeGreaterThan(0);
      expect(signal.affectedEntities.length).toBeGreaterThan(0);
    }
  });
});
