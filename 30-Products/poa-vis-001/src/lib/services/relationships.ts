/**
 * Relationship / impact traversal model (POA-VIS-002 MISSION 5).
 *
 * Builds the PROJECT -> CAPABILITY REQUIREMENT -> CAPABILITY GAP ->
 * DEPARTMENT/PEOPLE -> RISK -> RECOMMENDATION chain as queryable data.
 * Application services and Alexis call this; it is never hard-coded
 * inside a React component.
 */

import type { CapabilityGap, ImpactChain, ImpactChainLink, Organization, Recommendation } from "@/lib/domain/types";
import { deriveRiskForProject } from "@/lib/services/risk";

export function traceProjectImpactChain(
  organization: Organization,
  projectId: string,
  gaps: CapabilityGap[],
  recommendations: Recommendation[]
): ImpactChain | null {
  const project = organization.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const links: ImpactChainLink[] = [
    { stage: "project", id: project.id, label: project.name, detail: project.description },
  ];

  for (const requirement of project.requiredCapabilities) {
    const capability = organization.capabilities.find((c) => c.id === requirement.capabilityId);
    links.push({
      stage: "capability-requirement",
      id: requirement.capabilityId,
      label: capability?.name ?? requirement.capabilityId,
      detail: `${requirement.requiredUnits} unit(s) required`,
    });
  }

  const gapEntries = gaps.filter((g) => g.isGap);
  for (const gap of gapEntries) {
    links.push({
      stage: "capability-gap",
      id: gap.capabilityId,
      label: gap.capabilityName,
      detail: `${gap.availableUnits}/${gap.requiredUnits} available — short by ${gap.gapUnits}`,
    });
  }

  const affectedDepartmentIds = new Set(
    gapEntries.flatMap((gap) => {
      const capability = organization.capabilities.find((c) => c.id === gap.capabilityId);
      return capability?.providedByDepartmentIds ?? [];
    })
  );
  affectedDepartmentIds.add(project.sponsorDepartmentId);
  for (const departmentId of affectedDepartmentIds) {
    const department = organization.departments.find((d) => d.id === departmentId);
    if (department) {
      links.push({ stage: "department", id: department.id, label: department.name });
    }
  }

  const risk = deriveRiskForProject(organization, project, gaps);
  if (risk) {
    links.push({ stage: "risk", id: risk.id, label: risk.title, detail: `severity: ${risk.severity}` });

    const recommendation = recommendations.find((r) => r.affectedEntity.id === project.id);
    if (recommendation) {
      links.push({
        stage: "recommendation",
        id: recommendation.id,
        label: recommendation.title,
        detail: recommendation.suggestedAction,
      });
    }
  }

  return { projectId: project.id, links };
}
