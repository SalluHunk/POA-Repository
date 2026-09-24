// QUARANTINED DEMO MODULE (POA-DEC-MOTHERSHIP-002): simulated "thinking" delay
// for the canned demo answer flow - no reasoning happens behind it.
/**
 * Ported verbatim from the reference (POA Command.dc.html lines 296-303) -
 * 3 bars pulsing cmThink at staggered delays, cmFade entrance, exact label.
 */
export function ThinkingIndicator() {
  return (
    <div
      className="mono"
      style={{
        position: "fixed",
        left: "calc(50% - 160px)",
        width: 320,
        justifyContent: "center",
        bottom: 250,
        zIndex: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        animation: "cmFade .2s ease",
        pointerEvents: "none",
      }}
    >
      <span style={{ width: 3, height: 16, background: "#a78bfa", animation: "cmThink 1s ease-in-out infinite" }} />
      <span style={{ width: 3, height: 16, background: "#a78bfa", animation: "cmThink 1s ease-in-out .15s infinite" }} />
      <span style={{ width: 3, height: 16, background: "#a78bfa", animation: "cmThink 1s ease-in-out .3s infinite" }} />
      <span style={{ marginLeft: 10, fontSize: 10.5, letterSpacing: "0.2em", color: "rgba(223,233,247,.66)" }}>REASONING OVER ORGANIZATIONAL CONTEXT</span>
    </div>
  );
}
