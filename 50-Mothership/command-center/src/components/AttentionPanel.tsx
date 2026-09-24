import type { AttentionItem } from "../state/attention";

/** Top-right glass panel, ported layout and entrance animation (POA Command.dc.html lines 117-133, cmSlide). Content is the real derived attention list; clicking navigates to the real Mission Focus. */
export function AttentionPanel({ attention, onFocusMission }: { attention: AttentionItem[]; onFocusMission: (id: string) => void }) {
  return (
    <div className="depth-contextual" style={{ borderRadius: 14, overflow: "hidden", maxHeight: 380, pointerEvents: "auto", animation: "cmSlide .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(223,233,247,.7)" }}>
          REQUIRES YOUR ATTENTION
        </span>
        {attention.length > 0 && (
          <span
            className="mono"
            style={{ minWidth: 22, height: 22, padding: "0 6px", borderRadius: 11, background: "#f2a53c", color: "#06101f", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 500 }}
          >
            {attention.length}
          </span>
        )}
      </div>
      {attention.length === 0 ? (
        <div className="mono" style={{ padding: 18, fontSize: 12.5, color: "var(--text-faint)" }}>
          Nothing outstanding.
        </div>
      ) : (
        attention.map((a) => (
          <button
            key={a.missionId}
            onClick={() => onFocusMission(a.missionId)}
            style={{ display: "flex", width: "100%", alignItems: "center", gap: 13, padding: "15px 18px", border: "none", borderBottom: "1px solid rgba(255,255,255,.055)", background: "transparent", cursor: "pointer", textAlign: "left" }}
          >
            <span
              className="mono"
              style={{ width: 34, height: 34, flex: "none", borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(224,85,79,.12)", border: "1px solid rgba(224,85,79,.3)", color: "var(--red)", fontSize: 13 }}
            >
              {a.glyph}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14.5, color: "rgba(223,233,247,.95)" }}>{a.missionId}</span>
              <span style={{ display: "block", marginTop: 4, fontSize: 12.5, color: "rgba(223,233,247,.58)" }}>{a.label}</span>
            </span>
            <span style={{ color: "rgba(223,233,247,.45)", fontSize: 15 }}>›</span>
          </button>
        ))
      )}
    </div>
  );
}
