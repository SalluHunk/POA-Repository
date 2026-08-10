import { describe, expect, it } from "vitest";
import { computeCapabilityGaps } from "@/lib/services/capability";
import { demoOrganization } from "@/lib/data/demo-organization";
import type { Organization } from "@/lib/domain/types";

describe("computeCapabilityGaps", () => {
  it("detects a gap when required units exceed available supply", () => {
    const project = demoOrganization.projects.find((p) => p.id === "proj-enterprise-ai-transformation")!;
    const gaps = computeCapabilityGaps(demoOrganization, project);

    const llmGap = gaps.find((g) => g.capabilityId === "cap-llm-integration")!;
    expect(llmGap.availableUnits).toBe(0);
    expect(llmGap.isGap).toBe(true);
    expect(llmGap.gapUnits).toBe(1);

    const platformGap = gaps.find((g) => g.capabilityId === "cap-platform-eng")!;
    expect(platformGap.isGap).toBe(false);
  });

  it("counts Resource-backed supply toward capability availability", () => {
    const org: Organization = {
      ...demoOrganization,
      projects: [
        {
          id: "proj-devops-only",
          name: "DevOps Only",
          description: "test fixture",
          status: "active",
          sponsorDepartmentId: "dept-engineering",
          startDate: "2026-01-01",
          requiredCapabilities: [{ capabilityId: "cap-devops-tooling", requiredUnits: 1 }],
        },
      ],
    };
    const gaps = computeCapabilityGaps(org, org.projects[0]);
    expect(gaps[0].availableUnits).toBe(1);
    expect(gaps[0].isGap).toBe(false);
  });
});
