import type { OrganizationalEvent, OrganizationalEventType } from "@/lib/domain/types";
import { Panel } from "@/components/ui";

const TYPE_LABEL: Record<OrganizationalEventType, string> = {
  PROJECT_CREATED: "Project",
  CAPABILITY_GAP_DETECTED: "Capability",
  PERSON_JOINED: "People",
  PERSON_UNAVAILABLE: "People",
  BUDGET_CHANGED: "Budget",
  DEADLINE_CHANGED: "Schedule",
  RISK_ESCALATED: "Risk",
  OPPORTUNITY_DETECTED: "Opportunity",
  RECOMMENDATION_ISSUED: "Recommendation",
};

/** Recent organizational changes — POA-VIS-001 PRIMARY EXPERIENCE item 3. */
export function ActivityStream({ events }: { events: OrganizationalEvent[] }) {
  const sorted = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <Panel eyebrow="Material Changes" title="Activity">
      <ol className="space-y-3">
        {sorted.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-poa-text-faint" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs text-poa-text">{event.summary}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-poa-text-faint">
                {TYPE_LABEL[event.type]} · {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
