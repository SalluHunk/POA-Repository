import type { AuthorizationDecisionRecord } from "../api/types";

/**
 * Ported layout (POA Command.dc.html lines 135-152) but honest content.
 * The reference's equivalent panel shows a fabricated live event timeline
 * with invented timestamps and a "LIVE" claim. We don't have a real
 * time-ordered event feed yet, so no "LIVE" badge and no times are
 * shown - only what's actually real (who, which capability, granted or
 * denied) is rendered, using the already-fetched decisions array.
 */
export function ActivityPanel({ decisions }: { decisions: AuthorizationDecisionRecord[] }) {
  return (
    <div className="depth-contextual" style={{ borderRadius: 14, overflow: "hidden", maxHeight: 240, pointerEvents: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(223,233,247,.7)" }}>
          AUTHORIZATION ACTIVITY
        </span>
      </div>
      <div style={{ padding: "6px 18px 14px", overflowY: "auto", maxHeight: 190 }}>
        {decisions.length === 0 ? (
          <div className="mono" style={{ padding: "10px 0", fontSize: 12.5, color: "var(--text-faint)" }}>
            No decisions recorded yet.
          </div>
        ) : (
          decisions.map((d, i) => (
            <div key={`${d.missionId}-${d.producerId}-${i}`} style={{ display: "flex", gap: 13, padding: "10px 0", borderBottom: i < decisions.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.granted ? "var(--green)" : "var(--red)", flex: "none", marginTop: 6 }} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.4, color: "rgba(223,233,247,.9)" }}>
                  {d.producerId} — {d.capability} {d.granted ? "granted" : "denied"}
                </span>
                <span className="mono" style={{ display: "block", marginTop: 3, fontSize: 11, color: "rgba(223,233,247,.5)" }}>
                  {d.missionId}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
