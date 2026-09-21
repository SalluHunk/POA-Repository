import type { EvidenceEnvelope } from "../api/types";

interface Props {
  missionId: string;
  evidence: EvidenceEnvelope[];
  chainVerified: boolean;
  onReturn: () => void;
}

function decisionLine(e: EvidenceEnvelope): string {
  if (e.payload.what === "AUTHORIZATION_DECISION") {
    return e.payload.result === "AUTHORIZED" ? `Authorized — ${e.payload.why} granted` : `Denied — ${e.payload.result}`;
  }
  if (e.payload.what === "ACTION_EXECUTED") return `Executed — ${e.payload.why}`;
  if (e.payload.what === "MISSION_TRANSITION") return e.payload.why;
  return e.payload.result;
}

export function MissionInvestigate({ missionId, evidence, chainVerified, onReturn }: Props) {
  return (
    // Tier 2 - always fully opaque, regardless of which state renders it
    // (POA-MOTHERSHIP-MVP-DECISION-BRIEF.md §E). This is evidence content.
    <div className="depth-evidence converge-in" style={{ borderRadius: 10, padding: "36px 44px", maxWidth: 720, margin: "48px auto" }}>
      <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{missionId} — evidence chain</div>
      <div className="mono" style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 24 }}>
        chain {chainVerified ? "✓ intact" : "✕ broken"} · {evidence.length} {evidence.length === 1 ? "entry" : "entries"}
      </div>

      {evidence.length === 0 && (
        <div className="mono" style={{ fontSize: 13, color: "var(--text-faint)" }}>
          No evidence recorded yet — this mission has not been acted on.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {evidence.map((e) => (
          <div key={e.sequence} style={{ background: "var(--panel-2)", border: "1px solid var(--border)", borderLeft: "2px solid var(--cyan)", borderRadius: 8, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>
                #{e.sequence + 1} · SEQUENCE {e.sequence}
              </span>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>
                {e.payload.what}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span
                className="mono"
                style={{
                  fontSize: 11.5,
                  padding: "3px 9px",
                  borderRadius: 4,
                  background: chainVerified ? "rgba(62,207,142,.12)" : "rgba(224,85,79,.12)",
                  border: `1px solid ${chainVerified ? "rgba(62,207,142,.35)" : "rgba(224,85,79,.35)"}`,
                  color: chainVerified ? "var(--green)" : "var(--red)",
                }}
              >
                {chainVerified ? "✓ INTEGRITY — intact" : "✕ INTEGRITY — broken"}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 11.5,
                  padding: "3px 9px",
                  borderRadius: 4,
                  background: e.authorityBearing ? "rgba(62,207,142,.12)" : "var(--panel)",
                  border: `1px solid ${e.authorityBearing ? "rgba(62,207,142,.35)" : "var(--border-2)"}`,
                  color: e.authorityBearing ? "var(--green)" : "var(--text-dim)",
                }}
              >
                {e.authorityBearing ? "✓ AUTHORITY — signed" : "↳ AUTHORITY — informational"}
              </span>
            </div>
            <div style={{ fontSize: 13.5 }}>{decisionLine(e)}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>
              {e.producerId}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onReturn} className="mono" style={{ marginTop: 24, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: 0 }}>
        ← Return to mission
      </button>
    </div>
  );
}
