/**
 * Opportunity-detection business logic (POA-VIS-002).
 *
 * Deterministic rule for this mission: a capability with assigned supply
 * that is NOT required by any currently active project, but IS required by
 * a planned project, is a redeployment opportunity — that capacity could
 * accelerate the next project's start. Pure functions only.
 */

import type { Organization, Opportunity } from "@/lib/domain/types";
import { availableUnitsFor } from "@/lib/services/capability";

export function deriveOpportunities(organization: Organization): Opportunity[] {
  const activeProjects = organization.projects.filter((p) => p.status === "active");
  const planningProjects = organization.projects.filter((p) => p.status === "planning");

  const requiredByActive = new Set(
    activeProjects.flatMap((p) => p.requiredCapabilities.map((r) => r.capabilityId))
  );

  const opportunities: Opportunity[] = [];

  for (const planningProject of planningProjects) {
    for (const requirement of planningProject.requiredCapabilities) {
      if (requiredByActive.has(requirement.capabilityId)) continue;

      const capability = organization.capabilities.find((c) => c.id === requirement.capabilityId);
      if (!capability) continue;

      const available = availableUnitsFor(capability, organization);
      if (available <= 0) continue;

      const existing = organization.opportunities.find(
        (o) => o.relatedCapabilityId === capability.id && o.relatedProjectId === planningProject.id
      );

      opportunities.push({
        id: existing?.id ?? `opportunity-derived-${capability.id}-${planningProject.id}`,
        title: existing?.title ?? `${capability.name} capacity available for ${planningProject.name}`,
        description:
          existing?.description ??
          `${capability.name} is not required by any currently active project but is required by ${planningProject.name}; this capacity could accelerate that project's start.`,
        relatedCapabilityId: capability.id,
        relatedProjectId: planningProject.id,
        potentialValue: existing?.potentialValue ?? "medium",
        detectedAt: existing?.detectedAt ?? new Date(0).toISOString(),
      });
    }
  }

  return opportunities;
}
