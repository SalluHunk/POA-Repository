import type { OrganizationalState } from "@/lib/domain/types";
import { OrganizationHealth } from "@/components/OrganizationHealth";
import { ProjectOverview } from "@/components/ProjectOverview";
import { CapabilityStatus } from "@/components/CapabilityStatus";
import { RiskPanel } from "@/components/RiskPanel";
import { ActivityStream } from "@/components/ActivityStream";
import { ExecutiveBriefing } from "@/components/ExecutiveBriefing";
import { AlexisPanel } from "@/components/alexis/AlexisPanel";

/**
 * Composes the Mission Console (POA-VIS-001 MISSION CONSOLE) from
 * independent, reusable panels — never a single giant page component.
 */
export function MissionConsole({ state }: { state: OrganizationalState }) {
  const { organization, capabilityGapsByProject } = state;
  const focusProject = organization.projects.find((p) => p.status === "active") ?? organization.projects[0];
  const focusGaps = focusProject ? capabilityGapsByProject[focusProject.id] ?? [] : [];
  const gapCountByProject = Object.fromEntries(
    Object.entries(capabilityGapsByProject).map(([id, gaps]) => [id, gaps.filter((g) => g.isGap).length])
  );

  return (
    <div className="flex flex-col gap-6">
      <ExecutiveBriefing state={state} />

      <OrganizationHealth overallHealth={state.overallHealth} departments={organization.departments} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProjectOverview projects={organization.projects} gapCountByProject={gapCountByProject} />
          {focusProject && <CapabilityStatus projectName={focusProject.name} gaps={focusGaps} />}
        </div>
        <div className="flex flex-col gap-6">
          <RiskPanel risks={organization.risks} recommendations={organization.recommendations} />
          <ActivityStream events={organization.events} />
        </div>
      </div>

      <AlexisPanel state={state} />
    </div>
  );
}
