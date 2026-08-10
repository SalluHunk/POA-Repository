/**
 * Risk derivation business logic.
 *
 * "CAPABILITY GAP -> RISK -> RECOMMENDATION" from POA-VIS-001. Given the
 * live capability gaps for a project, decide whether they constitute a
 * risk, and if so, at what severity. Pure functions only.
 */

import type { CapabilityGap, HealthStatus, Organization, Project, Risk } from "@/lib/domain/types";

export function severityForGapRatio(gapCount: number, requiredCount: number): Risk["severity"] {
  if (requiredCount === 0 || gapCount === 0) return "low";
  const ratio = gapCount / requiredCount;
  if (ratio >= 0.4) return "critical";
  if (ratio >= 0.25) return "high";
  if (ratio >= 0.1) return "medium";
  return "low";
}

/**
 * Live-derived risk for a project, computed from its current capability
 * gaps rather than read from stored state. Returns null when there is no
 * gap (no risk to report).
 */
export function deriveRiskForProject(
  organization: Organization,
  project: Project,
  gaps: CapabilityGap[]
): Risk | null {
  const gapEntries = gaps.filter((gap) => gap.isGap);
  if (gapEntries.length === 0) return null;

  const existing = organization.risks.find((risk) => risk.relatedProjectId === project.id);
  const severity = severityForGapRatio(gapEntries.length, gaps.length);

  return {
    id: existing?.id ?? `risk-derived-${project.id}`,
    title: existing?.title ?? `Delivery risk: capability shortage on ${project.name}`,
    description:
      existing?.description ??
      `${gapEntries.length} of ${gaps.length} required capabilities for ${project.name} are short of internal supply: ${gapEntries
        .map((gap) => gap.capabilityName)
        .join(", ")}.`,
    severity,
    relatedProjectId: project.id,
    relatedCapabilityIds: gapEntries.map((gap) => gap.capabilityId),
    detectedAt: existing?.detectedAt ?? new Date(0).toISOString(),
  };
}

const HEALTH_RANK: Record<HealthStatus, number> = { healthy: 0, attention: 1, "at-risk": 2 };
const SEVERITY_TO_HEALTH: Record<Risk["severity"], HealthStatus> = {
  low: "healthy",
  medium: "attention",
  high: "attention",
  critical: "at-risk",
};

export function computeOverallHealth(organization: Organization, activeRisks: Risk[]): HealthStatus {
  const fromDepartments = organization.departments.reduce<HealthStatus>(
    (worst, dept) => (HEALTH_RANK[dept.healthStatus] > HEALTH_RANK[worst] ? dept.healthStatus : worst),
    "healthy"
  );
  const fromRisks = activeRisks.reduce<HealthStatus>((worst, risk) => {
    const mapped = SEVERITY_TO_HEALTH[risk.severity];
    return HEALTH_RANK[mapped] > HEALTH_RANK[worst] ? mapped : worst;
  }, "healthy");

  return HEALTH_RANK[fromRisks] > HEALTH_RANK[fromDepartments] ? fromRisks : fromDepartments;
}
