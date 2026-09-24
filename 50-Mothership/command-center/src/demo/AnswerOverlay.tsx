import type { Answer } from "./presenceData";
import { DemoDisclosure } from "./demoLayer";

/**
 * QUARANTINED DEMO SURFACE (POA-DEC-MOTHERSHIP-002) - renders only when the
 * demo layer is explicitly enabled; every answer is a canned, fictional
 * string from presenceData.ts's computeAnswer(), not POA reasoning.
 *
 * POA answer surface, ported verbatim from the reference's `hasAnswer`
 * overlay (POA Command.dc.html lines 271-294) - same position/sizing as
 * the domain detail overlay but violet-tinted, with a pulsing "POA" status
 * dot, optional confidence-bar panel, and optional confidence caption.
 */
export function AnswerOverlay({ answer, onClose }: { answer: Answer; onClose: () => void }) {
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
        background: "linear-gradient(160deg,rgba(18,16,44,.92),rgba(6,10,22,.86))",
        border: "1px solid rgba(167,139,250,.35)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 30px 80px rgba(0,0,0,.6)",
        pointerEvents: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: "cmGlow 2.6s ease-in-out infinite" }} />
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.24em", color: "#c0a8ff" }}>
            POA
          </span>
        </span>
        <button onClick={onClose} className="mono" style={{ background: "none", border: "none", padding: 0, fontSize: 11, letterSpacing: "0.14em", color: "rgba(223,233,247,.6)", cursor: "pointer" }}>
          CLOSE ✕
        </button>
      </div>
      <DemoDisclosure style={{ marginTop: 10 }} />

      <div style={{ marginTop: 14, fontSize: 17.5, lineHeight: 1.7, color: "rgba(223,233,247,.94)" }}>{answer.text}</div>

      {answer.panel && answer.panel.length > 0 && (
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.1)" }}>
          {answer.panelTitle && (
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(223,233,247,.6)" }}>
              {answer.panelTitle}
            </div>
          )}
          {answer.panel.map((p) => (
            <div key={p.k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0" }}>
              <span style={{ width: 210, flex: "none", fontSize: 14, color: "rgba(223,233,247,.85)" }}>{p.k}</span>
              <span style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,.1)" }}>
                <span style={{ display: "block", height: 5, borderRadius: 3, width: p.w, background: p.c }} />
              </span>
              <span className="mono" style={{ width: 140, flex: "none", textAlign: "right", fontSize: 11.5, color: p.c }}>
                {p.v}
              </span>
            </div>
          ))}
        </div>
      )}

      {answer.conf && (
        <div className="mono" style={{ marginTop: 16, fontSize: 10.5, letterSpacing: "0.16em", color: "rgba(223,233,247,.58)" }}>
          {answer.conf}
        </div>
      )}
    </div>
  );
}
