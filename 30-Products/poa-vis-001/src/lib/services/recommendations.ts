/**
 * Recommendation engine (POA-VIS-002 MISSION 7).
 *
 * Generates Recommendation records independently of presentation, always
 * traceable back to the Signal that produced them. One risk signal
 * produces one recommendation; capability-gap signals do not duplicate it
 * (the risk signal's recommendation already covers the gap). Opportunity
 * signals each produce a lower-priority recommendation to act on them.
 */

import type { Organization, Recommendation, Signal } from "@/lib/domain/types";

function responsibleAreaFor(organization: Organization, projectId: string | undefined): string | undefined {
  if (!projectId) return undefined;
  const project = organization.projects.find((p) => p.id === projectId);
  if (!project) return undefined;
  return organization.departments.find((d) => d.id === project.sponsorDepartmentId)?.name;
}

export function deriveRecommendations(organization: Organization, signals: Signal[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const signal of signals) {
    if (signal.type === "risk") {
      const projectRef = signal.affectedEntities.find((e) => e.kind === "project");
      const existing = organization.recommendations.find((r) => r.relatedSignalId === signal.id);

      recommendations.push({
        id: existing?.id ?? `rec-derived-${signal.id}`,
        title: existing?.title ?? "Close the capability gap before the next delivery milestone",
        rationale: existing?.rationale ?? signal.explanation,
        priority: signal.severity === "critical" || signal.severity === "high" ? "high" : "medium",
        relatedSignalId: signal.id,
        affectedEntity: projectRef ?? { kind: "organization", id: organization.id, label: organization.name },
        suggestedAction: existing?.suggestedAction ?? signal.recommendedAction ?? "Review and address this risk.",
        responsibleArea: existing?.responsibleArea ?? responsibleAreaFor(organization, projectRef?.id),
      });
    }

    if (signal.type === "opportunity") {
      const projectRef = signal.affectedEntities.find((e) => e.kind === "project");
      recommendations.push({
        id: `rec-derived-${signal.id}`,
        title: signal.recommendedAction ?? "Act on available capacity",
        rationale: signal.explanation,
        priority: "low",
        relatedSignalId: signal.id,
        affectedEntity: projectRef ?? { kind: "organization", id: organization.id, label: organization.name },
        suggestedAction: signal.recommendedAction ?? "Evaluate redeploying this capacity.",
        responsibleArea: responsibleAreaFor(organization, projectRef?.id),
      });
    }
  }

  return recommendations;
}
