/**
 * Assembles the full OrganizationalState (raw Organization + everything
 * derived from it) from the demo dataset. This is the single seam a
 * future mission replaces to swap demo data for a repository-backed
 * store, database, or API — see POA-VIS-001 "DATA ARCHITECTURE".
 *
 * POA-VIS-002 ARCHITECTURAL PRINCIPLE: this is the one place derived
 * organizational intelligence (capability gaps, signals, recommendations,
 * overall health) is assembled. Alexis and the UI both consume the result
 * of this function — neither recomputes it independently.
 */

import { demoOrganization } from "@/lib/data/demo-organization";
import type { Organization, OrganizationalState } from "@/lib/domain/types";
import { computeAllCapabilityGaps } from "@/lib/services/capability";
import { computeOverallHealth, deriveRiskForProject } from "@/lib/services/risk";
import { deriveSignals } from "@/lib/services/signals";
import { deriveRecommendations } from "@/lib/services/recommendations";

export function buildOrganizationalState(organization: Organization): OrganizationalState {
  const capabilityGapsByProject = computeAllCapabilityGaps(organization);

  const liveRisks = organization.projects
    .map((project) => deriveRiskForProject(organization, project, capabilityGapsByProject[project.id] ?? []))
    .filter((risk): risk is NonNullable<typeof risk> => risk !== null);

  const overallHealth = computeOverallHealth(organization, liveRisks);
  const signals = deriveSignals(organization, capabilityGapsByProject);
  const recommendations = deriveRecommendations(organization, signals);

  return { organization, capabilityGapsByProject, signals, recommendations, overallHealth };
}

export function getOrganizationalState(): OrganizationalState {
  return buildOrganizationalState(demoOrganization);
}
