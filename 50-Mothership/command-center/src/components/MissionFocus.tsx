import type { MissionDetail } from "../api/types";
import { legalTransitions } from "../state/legalTransitions";
import { Chip, Breadcrumb, buttonStyle } from "./shared";

interface Props {
  missionId: string;
  detail: MissionDetail | undefined;
  dimmed?: boolean;
  onDrill: () => void;
  onRequestTransition: (to: string) => void;
  onReturn: () => void;
}

export function MissionFocus({ missionId, detail, dimmed, onDrill, onRequestTransition, onReturn }: Props) {
  if (!detail) return null;
  const legal = legalTransitions(detail.mission.state);
  const witnessTone = detail.witnessCode === "MATCH" ? "green" : detail.witnessCode === "MISMATCH" ? "red" : "neutral";

  return (
    <div
      className="depth-contextual converge-in"
      style={{ borderRadius: 10, padding: "40px 48px", maxWidth: 640, margin: "60px auto 0", opacity: dimmed ? 0.5 : 1, pointerEvents: dimmed ? "none" : undefined, transition: "opacity 0.25s ease" }}
    >
      <Breadcrumb segments={[{ label: "Presence", onClick: onReturn }, { label: missionId }]} />

      <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
        MISSION
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 18 }}>{missionId}</div>

      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <Chip tone="cyan">● {detail.mission.state}</Chip>
        <Chip>{detail.origin === "fixture" ? "TEST FIXTURE" : "OPERATOR-CREATED"}</Chip>
        <Chip tone={witnessTone}>
          {detail.witnessCode === "MATCH" ? "✓✓ VERIFIED" : detail.witnessCode === "NO_CHECKPOINT" ? "○ UNVERIFIED — not yet checked" : "✕ MISMATCH"}
        </Chip>
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
