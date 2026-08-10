import type { Project } from "@/lib/domain/types";
import { Panel } from "@/components/ui";

const STATUS_LABEL: Record<Project["status"], string> = {
  planning: "Planning",
  active: "Active",
  blocked: "Blocked",
  completed: "Completed",
};

const STATUS_CLASS: Record<Project["status"], string> = {
  planning: "text-poa-text-muted",
  active: "text-poa-accent",
  blocked: "text-poa-at-risk",
  completed: "text-poa-healthy",
};

/** Active missions/projects — POA-VIS-001 PRIMARY EXPERIENCE item 2. */
export function ProjectOverview({ projects, gapCountByProject }: { projects: Project[]; gapCountByProject: Record<string, number> }) {
  return (
    <Panel eyebrow="Active Missions" title="Projects">
      <ul className="divide-y divide-poa-border">
        {projects.map((project) => {
          const gapCount = gapCountByProject[project.id] ?? 0;
          return (
            <li key={project.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm text-poa-text">{project.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-poa-text-muted">{project.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`font-mono text-[11px] uppercase tracking-wide ${STATUS_CLASS[project.status]}`}>
                  {STATUS_LABEL[project.status]}
                </span>
                {gapCount > 0 && (
                  <span className="font-mono text-[11px] text-poa-at-risk">{gapCount} capability gap{gapCount === 1 ? "" : "s"}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
