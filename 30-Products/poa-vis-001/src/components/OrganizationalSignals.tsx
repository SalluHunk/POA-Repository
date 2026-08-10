import type { Recommendation, Signal, SignalType } from "@/lib/domain/types";
import { Panel, SeverityLabel } from "@/components/ui";

/**
 * Organizational Signals (POA-VIS-002 MISSION 9): a single unified list —
 * risk, capability-gap, opportunity, organizational-health — replacing the
 * VIS-001 risk-only panel. This is the UI surface for the signal engine;
 * it renders state.signals/state.recommendations as-is and computes
 * nothing itself (POA-VIS-002 DoD #9: no business logic in presentation).
 */
const TYPE_LABEL: Record<SignalType, string> = {
  risk: "Risk",
  "capability-gap": "Capability Gap",
  opportunity: "Opportunity",
  "organizational-health": "Organizational Health",
};

const SEVERITY_RANK: Record<Signal["severity"], number> = { info: 0, low: 1, medium: 2, high: 3, critical: 4 };

export function OrganizationalSignals({
  signals,
  recommendations,
}: {
  signals: Signal[];
  recommendations: Recommendation[];
}) {
  const sorted = [...signals].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);

  return (
    <Panel
      eyebrow="Organizational Signals"
      title={sorted.length > 0 ? `${sorted.length} active signal${sorted.length === 1 ? "" : "s"}` : "No active signals"}
    >
      <ul className="space-y-4">
        {sorted.map((signal) => {
          const recommendation = recommendations.find((r) => r.relatedSignalId === signal.id);
          return (
            <li key={signal.id} className="border-l-2 border-poa-border pl-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-wide text-poa-text-faint">
                  {TYPE_LABEL[signal.type]}
                </p>
                <SeverityLabel severity={signal.severity} />
              </div>
              <p className="mt-1 text-sm text-poa-text">{signal.explanation}</p>
              {recommendation && (
                <div className="mt-2 rounded-md bg-poa-panel-raised px-3 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-poa-accent">Recommendation</p>
                  <p className="mt-1 text-xs text-poa-text">{recommendation.suggestedAction}</p>
                  {recommendation.responsibleArea && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-poa-text-faint">
                      Owner: {recommendation.responsibleArea}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
