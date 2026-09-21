import { useState } from "react";
import type { Principal } from "../api/types";
import type { MissionActionKind } from "../state/useCommandCenter";

interface Props {
  missionId: string;
  action: MissionActionKind;
  principals: Principal[];
  onConfirm: (principalId: string) => void;
  onCancel: () => void;
}

// S7, anchored to the subject it concerns - a partial-width panel sharing
// an edge with the mission card, never a screen-centered/dimming modal
// (POA-MOTHERSHIP-ENVIRONMENT-MODEL.md §5).
export function ActionConfirm({ missionId, action, principals, onConfirm, onCancel }: Props) {
  const [principalId, setPrincipalId] = useState(principals[0]?.id ?? "");
  const label = action.kind === "transition" ? `Transition ${missionId} → ${action.to}` : `Authorize & execute "${action.action}" on ${missionId}`;

  return (
    <div
      // Tier 2 - decision-critical, always fully opaque even though it
      // emerges from a Tier-1 (translucent) context surface a moment
      // earlier (POA-MOTHERSHIP-MVP-DECISION-BRIEF.md §E).
      className="depth-evidence converge-in"
      style={{ borderRadius: 10, padding: "28px 32px", maxWidth: 420, margin: "24px auto", borderColor: "var(--amber)" }}
    >
      <div className="mono" style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.08em", marginBottom: 12 }}>
        CONFIRM — CONSEQUENTIAL ACTION
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 18 }}>{label}</div>

      <label htmlFor="cc-principal" className="mono" style={{ display: "block", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 6 }}>
        ACTING AS — no standing session identity; select per action
      </label>
      <select
        id="cc-principal"
        value={principalId}
        onChange={(e) => setPrincipalId(e.target.value)}
        style={{ width: "100%", background: "var(--panel-2)", border: "1px solid var(--border-2)", borderRadius: 4, padding: "8px 10px", color: "var(--text)", fontSize: 13.5, marginBottom: 20 }}
      >
        {principals.map((p) => (
          <option key={p.id} value={p.id}>
            {p.id} ({p.role})
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => onConfirm(principalId)}
          disabled={!principalId}
          style={{ flex: 1, background: "var(--amber)", color: "#1a1406", border: "none", borderRadius: 6, padding: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}
        >
          Confirm
        </button>
        <button onClick={onCancel} style={{ flex: 1, background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border-2)", borderRadius: 6, padding: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
