import { DOMAIN_DETAIL } from "./presenceData";
import { DemoDisclosure } from "./demoLayer";

/**
 * QUARANTINED DEMO SURFACE (POA-DEC-MOTHERSHIP-002) - renders only when the
 * demo layer is explicitly enabled; every fact shown is fictional
 * reference narrative from presenceData.ts's DOMAIN_DETAIL.
 *
 * Domain detail surface, ported verbatim from the reference's `hasDetail`
 * overlay (POA Command.dc.html lines 236-269) - position, sizing, glass
 * gradient, cmEmerge entrance, facts grid, "POA READS THIS AS" confidence
 * bar, and action buttons (first action styled primary/cyan, the rest
 * plain, matching lines 771-772's border/bg/color-by-index mapping).
 */
export function DomainDetailOverlay({ domainId, onClose, onAsk }: { domainId: string; onClose: () => void; onAsk: (q: string) => void }) {
  const detail = DOMAIN_DETAIL[domainId];
  if (!detail) return null;

  return (
    <div
      className="cm-emerge"
      style={{
        position: "fixed",
        left: "calc(50% - 372px)",
        bottom: 246,
        width: 744,
        zIndex: 8,
        padding: "24px 28px",
        borderRadius: 16,
        background: "linear-gradient(160deg,rgba(12,24,46,.92),rgba(6,12,24,.86))",
        border: `1px solid ${detail.border}`,
        backdropFilter: "blur(18px)",
        boxShadow: "0 30px 80px rgba(0,0,0,.6)",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.24em", color: detail.tint }}>
          {detail.kicker}
        </span>
        <button onClick={onClose} className="mono" style={{ background: "none", border: "none", padding: 0, fontSize: 11, letterSpacing: "0.14em", color: "rgba(223,233,247,.6)", cursor: "pointer" }}>
          CLOSE ✕
        </button>
      </div>
      <DemoDisclosure style={{ marginTop: 10 }} />

      <div style={{ marginTop: 12, fontSize: 25, fontWeight: 300, lineHeight: 1.3 }}>{detail.title}</div>
      <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.65, color: "rgba(223,233,247,.82)" }}>{detail.body}</div>

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
        {detail.facts.map((f) => (
          <div key={f.k}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(223,233,247,.55)" }}>
              {f.k}
            </div>
            <div style={{ marginTop: 6, fontSize: 16, color: "rgba(223,233,247,.92)" }}>{f.v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "#c0a8ff" }}>
          POA READS THIS AS
        </div>
        <div style={{ marginTop: 10, fontSize: 15.5, lineHeight: 1.65, color: "rgba(223,233,247,.86)" }}>{detail.read}</div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "rgba(223,233,247,.55)", flex: "none" }}>
            CONFIDENCE
          </span>
          <span style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,.1)" }}>
            <span style={{ display: "block", height: 4, borderRadius: 2, width: detail.confPct, background: "#a78bfa" }} />
          </span>
          <span className="mono" style={{ fontSize: 11, color: "rgba(223,233,247,.85)" }}>
            {detail.conf}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 9 }}>
        {detail.actions.map((a, i) => (
          <button
            key={a.label}
            onClick={() => onAsk(a.q)}
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              padding: "11px 16px",
              borderRadius: 9,
              border: i ? "1px solid rgba(255,255,255,.18)" : "1px solid rgba(127,216,255,.45)",
              background: i ? "transparent" : "rgba(127,216,255,.12)",
              color: i ? "rgba(223,233,247,.8)" : "#c4efff",
              cursor: "pointer",
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
