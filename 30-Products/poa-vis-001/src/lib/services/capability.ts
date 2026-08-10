/**
 * Capability-gap business logic.
 *
 * Pure functions only — no UI, no data fetching. Given an Organization and
 * a Project, compute the supply/demand position for every required
 * capability. This is the "PROJECT -> CAPABILITY REQUIREMENT ->
 * ORGANIZATIONAL CAPABILITY -> CAPABILITY GAP" chain from POA-VIS-001.
 *
 * "Available units" is a simplified capacity model for this vertical
 * slice: one unit per person currently holding that capability, plus one
 * unit per Resource explicitly supplying it, plus one unit if a department
 * provides it with no named person or resource (shared/latent capacity).
 * This is intentionally simple and documented as such — a real capacity
 * model is out of scope for POA-VIS-001/POA-VIS-002.
 */

import type { Capability, CapabilityGap, Organization, Project } from "@/lib/domain/types";

export function availableUnitsFor(capability: Capability, organization: Organization): number {
  const personUnits = organization.people.filter((person) =>
    person.capabilityIds.includes(capability.id)
  ).length;

  const resourceUnits = organization.resources
    .filter((resource) => capability.providedByResourceIds.includes(resource.id))
    .reduce((sum, resource) => sum + resource.capacityUnits, 0);

  const hasUnstaffedDepartmentSupply =
    personUnits === 0 && resourceUnits === 0 && capability.providedByDepartmentIds.length > 0;

  return personUnits + resourceUnits + (hasUnstaffedDepartmentSupply ? 1 : 0);
}

export function computeCapabilityGaps(
  organization: Organization,
  project: Project
): CapabilityGap[] {
  return project.requiredCapabilities.map((requirement) => {
    const capability = organization.capabilities.find((c) => c.id === requirement.capabilityId);
    const capabilityName = capability?.name ?? requirement.capabilityId;
    const availableUnits = capability ? availableUnitsFor(capability, organization) : 0;
    const gapUnits = Math.max(0, requirement.requiredUnits - availableUnits);

    return {
      capabilityId: requirement.capabilityId,
      capabilityName,
      requiredUnits: requirement.requiredUnits,
      availableUnits,
      gapUnits,
      isGap: gapUnits > 0,
    };
  });
}

export function computeAllCapabilityGaps(
  organization: Organization
): Record<string, CapabilityGap[]> {
  return Object.fromEntries(
    organization.projects.map((project) => [project.id, computeCapabilityGaps(organization, project)])
  );
}

export interface CapabilitySummary {
  requiredCount: number;
  availableCount: number;
  gapCount: number;
}

export function summarizeCapabilityGaps(gaps: CapabilityGap[]): CapabilitySummary {
  return {
    requiredCount: gaps.length,
    availableCount: gaps.filter((gap) => !gap.isGap).length,
    gapCount: gaps.filter((gap) => gap.isGap).length,
  };
}
