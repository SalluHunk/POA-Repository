import type { Department, HealthStatus } from "@/lib/domain/types";
import { Panel, StatusDot } from "@/components/ui";

const HEALTH_LABEL: Record<HealthStatus, string> = {
  healthy: "Healthy",
  attention: "Needs Attention",
  "at-risk": "At Risk",
};

/**
 * Organizational health + per-department signal grid — the first thing
 * an executive sees (POA-VIS-001 PRIMARY EXPERIENCE, items 1 & 5).
 */
export function OrganizationHealth({
  overallHealth,
  departments,
}: {
  overallHealth: HealthStatus;
  departments: Department[];
}) {
  return (
    <Panel eyebrow="Organizational Health" title={HEALTH_LABEL[overallHealth]}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {departments.map((dept) => (
          <li
            key={dept.id}
            className="flex items-center justify-between gap-2 rounded-md border border-poa-border bg-poa-panel-raised px-3 py-2.5"
          >
            <span className="truncate text-xs text-poa-text-muted">{dept.name}</span>
            <StatusDot status={dept.healthStatus} className="shrink-0" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
