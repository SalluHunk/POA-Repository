import type { MissionDetail } from "../api/types";
import { legalTransitions } from "../state/legalTransitions";

interface Props {
  missionId: string;
  detail: MissionDetail | undefined;
  onDrill: () => void;
  onRequestTransition: (to: string) => void;
  onReturn: () => void;
}

export function MissionFocus({ missionId, detail, onDrill, onRequestTransition, onReturn }: Props) {
  if (!detail) return null;
  const legal = legalTransitions(detail.mission.state);

  return (
    <div className="depth-contextual converge-in" style={{ borderRadius: 10, padding: "40px 48px", maxWidth: 640, margin: "60px auto" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
        MISSION
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 18 }}>{missionId}</div>

      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <span className="mono" style={{ fontSize: 12.5, padding: "5px 11px", borderRadius: 4, background: "rgba(79,179,232,.12)", border: "1px solid rgba(79,179,232,.35)", color: "var(--cyan)" }}>
          ● {detail.mission.state}
        </span>
        <span className="mono" style={{ fontSize: 12.5, padding: "5px 11px", borderRadius: 4, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--text-dim)" }}>
          {detail.origin === "fixture" ? "TEST FIXTURE" : "OPERATOR-CREATED"}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 12.5,
            padding: "5px 11px",
            borderRadius: 4,
            background: detail.witnessCode === "MATCH" ? "rgba(62,207,142,.12)" : "var(--panel-2)",
            border: `1px solid ${detail.witnessCode === "MATCH" ? "rgba(62,207,142,.35)" : "var(--border-2)"}`,
            color: detail.witnessCode === "MATCH" ? "var(--green)" : "var(--text-dim)",
          }}
        >
          {detail.witnessCode === "MATCH" ? "✓✓ VERIFIED" : detail.witnessCode === "NO_CHECKPOINT" ? "○ UNVERIFIED — not yet checked" : "✕ MISMATCH"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <button onClick={onDrill} style={buttonStyle("quiet")}>
          Investigate — "why?" →
        </button>
        {legal.map((to) => (
          <button key={to} onClick={() => onRequestTransition(to)} style={buttonStyle("caution")}>
            Mark {to}
          </button>
        ))}
        {legal.length === 0 && (
          <span className="mono" style={{ fontSize: 12, color: "var(--text-faint)", alignSelf: "center" }}>
            No legal action from {detail.mission.state} — this is the terminal state, not a gap.
          </span>
        )}
      </div>

      <button onClick={onReturn} className="mono" style={{ marginTop: 22, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: 0 }}>
        ← Return to Presence
      </button>
    </div>
  );
}

export function buttonStyle(kind: "caution" | "quiet") {
  return {
    padding: "10px 16px",
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 500 as const,
    cursor: "pointer",
    border: "1px solid",
    background: kind === "caution" ? "rgba(217,164,65,.1)" : "var(--panel-2)",
    borderColor: kind === "caution" ? "rgba(217,164,65,.4)" : "var(--border-2)",
    color: kind === "caution" ? "var(--amber)" : "var(--text-dim)",
  };
}
