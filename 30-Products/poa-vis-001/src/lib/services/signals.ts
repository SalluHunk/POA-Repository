/**
 * Signal engine (POA-VIS-002 MISSION 6).
 *
 * Reduces risk, capability-gap, opportunity, and organizational-health
 * findings to one unified Signal shape, so the UI and Alexis can consume a
 * single list instead of four parallel ones. Detection rules are
 * deterministic. Signal IDs are deterministic and derived from their
 * source record so seeded historical data (e.g. demo Recommendations) can
 * reference a signal before it is computed, and both agree.
 */

import type {
  CapabilityGap,
  ID,
  Organization,
  Risk,
  Signal,
} from "@/lib/domain/types";
import { deriveRiskForProject } from "@/lib/services/risk";
import { deriveOpportunities } from "@/lib/services/opportunities";

export function riskSignalId(projectId: ID): string {
  return `signal-risk-${projectId}`;
}

export function capabilityGapSignalId(projectId: ID): string {
  return `signal-gap-${projectId}`;
}

export function opportunitySignalId(opportunityId: ID): string {
  return `signal-opportunity-${opportunityId}`;
}

export const ORGANIZATIONAL_HEALTH_SIGNAL_ID = "signal-health-organization";

const RISK_SEVERITY_TO_SIGNAL_SEVERITY: Record<Risk["severity"], Signal["severity"]> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

export function deriveSignals(
  organization: Organization,
  capabilityGapsByProject: Record<ID, CapabilityGap[]>
): Signal[] {
  const signals: Signal[] = [];

  for (const project of organization.projects) {
    const gaps = capabilityGapsByProject[project.id] ?? [];
    const gapEntries = gaps.filter((g) => g.isGap);

    if (gapEntries.length > 0) {
      signals.push({
        id: capabilityGapSignalId(project.id),
        type: "capability-gap",
        severity: gapEntries.length / gaps.length >= 0.25 ? "high" : "medium",
        source: "capability-gap-detector",
        affectedEntities: [
          { kind: "project", id: project.id, label: project.name },
          ...gapEntries.map((g) => ({ kind: "capability" as const, id: g.capabilityId, label: g.capabilityName })),
        ],
        explanation: `${gapEntries.length} of ${gaps.length} required capabilities for ${project.name} are short of internal supply: ${gapEntries.map((g) => g.capabilityName).join(", ")}.`,
        timestamp: new Date(0).toISOString(),
        recommendedAction: "Close the capability gap before the next delivery milestone.",
        status: "active",
      });

      const risk = deriveRiskForProject(organization, project, gaps);
      if (risk) {
        signals.push({
          id: riskSignalId(project.id),
          type: "risk",
          severity: RISK_SEVERITY_TO_SIGNAL_SEVERITY[risk.severity],
          source: "risk-engine",
          affectedEntities: [
            { kind: "project", id: project.id, label: project.name },
            { kind: "risk", id: risk.id, label: risk.title },
          ],
          explanation: risk.description,
          timestamp: risk.detectedAt,
          recommendedAction: "Fast-track hiring or contracting to close the capability gap.",
          status: "active",
        });
      }
    }
  }

  for (const opportunity of deriveOpportunities(organization)) {
    const project = organization.projects.find((p) => p.id === opportunity.relatedProjectId);
    const capability = organization.capabilities.find((c) => c.id === opportunity.relatedCapabilityId);
    signals.push({
      id: opportunitySignalId(opportunity.id),
      type: "opportunity",
      severity: "info",
      source: "opportunity-detector",
      affectedEntities: [
        ...(project ? [{ kind: "project" as const, id: project.id, label: project.name }] : []),
        ...(capability ? [{ kind: "capability" as const, id: capability.id, label: capability.name }] : []),
      ],
      explanation: opportunity.description,
      timestamp: opportunity.detectedAt,
      recommendedAction: opportunity.title,
      status: "active",
    });
  }

  const atRiskDepartments = organization.departments.filter((d) => d.healthStatus !== "healthy");
  if (atRiskDepartments.length > 0) {
    signals.push({
      id: ORGANIZATIONAL_HEALTH_SIGNAL_ID,
      type: "organizational-health",
      severity: atRiskDepartments.some((d) => d.healthStatus === "at-risk") ? "high" : "medium",
      source: "organizational-health-monitor",
      affectedEntities: [
        { kind: "organization", id: organization.id, label: organization.name },
        ...atRiskDepartments.map((d) => ({ kind: "department" as const, id: d.id, label: d.name })),
      ],
      explanation: `Departments needing attention: ${atRiskDepartments.map((d) => d.name).join(", ")}.`,
      timestamp: new Date(0).toISOString(),
      status: "active",
    });
  }

  return signals;
}
