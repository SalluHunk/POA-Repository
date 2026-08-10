import type { Recommendation, Risk } from "@/lib/domain/types";
import { Panel, SeverityLabel } from "@/components/ui";

/**
 * RISK -> RECOMMENDATION (POA-VIS-001 VERTICAL SLICE). Risks and the
 * recommendations generated from them, shown together so the causal link
 * is visible rather than implied.
 */
export function RiskPanel({ risks, recommendations }: { risks: Risk[]; recommendations: Recommendation[] }) {
  return (
    <Panel eyebrow="Risks & Recommendations" title={risks.length > 0 ? `${risks.length} active risk${risks.length === 1 ? "" : "s"}` : "No active risks"}>
      <ul className="space-y-4">
        {risks.map((risk) => {
          const recs = recommendations.filter((r) => r.relatedRiskId === risk.id);
          return (
            <li key={risk.id} className="border-l-2 border-poa-border pl-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-poa-text">{risk.title}</p>
                <SeverityLabel severity={risk.severity} />
              </div>
              <p className="mt-1 text-xs text-poa-text-muted">{risk.description}</p>
              {recs.map((rec) => (
                <div key={rec.id} className="mt-2 rounded-md bg-poa-panel-raised px-3 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-poa-accent">Recommendation</p>
                  <p className="mt-1 text-xs text-poa-text">{rec.suggestedAction}</p>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
