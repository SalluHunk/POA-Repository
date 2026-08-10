import type { CapabilityGap } from "@/lib/domain/types";
import { Panel } from "@/components/ui";

/**
 * Renders the PROJECT -> CAPABILITY REQUIREMENT -> ORGANIZATIONAL
 * CAPABILITY -> CAPABILITY GAP chain (POA-VIS-001 VERTICAL SLICE) for one
 * project: required vs. available units, per capability.
 */
export function CapabilityStatus({ projectName, gaps }: { projectName: string; gaps: CapabilityGap[] }) {
  const required = gaps.reduce((sum, g) => sum + g.requiredUnits, 0);
  const available = gaps.reduce((sum, g) => sum + Math.min(g.availableUnits, g.requiredUnits), 0);
  const gapCount = gaps.filter((g) => g.isGap).length;

  return (
    <Panel eyebrow={`Capability Status — ${projectName}`} title={`${gapCount} of ${gaps.length} capabilities short`}>
      <div className="mb-4 flex items-baseline gap-4 font-mono text-xs text-poa-text-muted">
        <span>
          Required <span className="text-poa-text">{required}</span>
        </span>
        <span>
          Available <span className="text-poa-text">{available}</span>
        </span>
        <span>
          Gap <span className="text-poa-at-risk">{required - available}</span>
        </span>
      </div>
      <ul className="space-y-3">
        {gaps.map((gap) => {
          const pct = gap.requiredUnits === 0 ? 0 : Math.min(100, (gap.availableUnits / gap.requiredUnits) * 100);
          return (
            <li key={gap.capabilityId}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-poa-text">{gap.capabilityName}</span>
                <span className={`font-mono ${gap.isGap ? "text-poa-at-risk" : "text-poa-healthy"}`}>
                  {gap.availableUnits} / {gap.requiredUnits}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-poa-panel-raised">
                <div
                  className={`h-full rounded-full ${gap.isGap ? "bg-poa-at-risk" : "bg-poa-healthy"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
