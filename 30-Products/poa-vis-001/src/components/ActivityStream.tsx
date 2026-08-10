import type { EventCategory, OrgEvent } from "@/lib/domain/types";
import { Panel } from "@/components/ui";

const CATEGORY_LABEL: Record<EventCategory, string> = {
  project: "Project",
  capability: "Capability",
  risk: "Risk",
  recommendation: "Recommendation",
  organization: "Organization",
};

/** Recent organizational changes — POA-VIS-001 PRIMARY EXPERIENCE item 3. */
export function ActivityStream({ events }: { events: OrgEvent[] }) {
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
                {CATEGORY_LABEL[event.category]} · {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
