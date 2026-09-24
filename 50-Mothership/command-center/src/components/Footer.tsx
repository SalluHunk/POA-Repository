/** Persistent footer, exact reference position/copy (POA Command.dc.html lines 484-488) — company tagline, not organizational data, so honest to port verbatim. */
export function Footer() {
  return (
    <>
      <div style={{ position: "fixed", left: 34, bottom: 30, zIndex: 2, pointerEvents: "none" }}>
        <div className="mono" style={{ fontSize: 12.5, letterSpacing: "0.3em", color: "rgba(127,216,255,.85)" }}>PARAVYOMA</div>
        <div className="mono" style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.18em", color: "rgba(223,233,247,.45)" }}>SOLUTIONS FOR A HIGHER TOMORROW</div>
      </div>
      <div className="mono" style={{ position: "fixed", right: 34, bottom: 30, zIndex: 2, fontSize: 10, letterSpacing: "0.16em", color: "rgba(223,233,247,.4)", pointerEvents: "none" }}>
        HUMAN WISDOM + AI LEVERAGE + HIGHER PURPOSE
      </div>
    </>
  );
}
