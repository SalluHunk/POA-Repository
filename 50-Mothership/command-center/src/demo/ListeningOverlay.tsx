import { DemoDisclosure } from "./demoLayer";

const TOPICS = [
  { n: "Budget allocation", v: "4 MENTIONS", c: "#4fc9ff" },
  { n: "HR SaaS timeline", v: "6 MENTIONS", c: "rgba(160,190,230,.75)" },
  { n: "Evidence recovery", v: "9 MENTIONS", c: "#f2a53c" },
  { n: "Agent authority", v: "2 MENTIONS", c: "#a78bfa" },
];

const OPEN_QS = ["Who owns HR SaaS after this quarter?", "Do we fund Temple Growth before 15 Oct?", "Can an agent hold commit authority on evidence?"];

// Reference lines 841-844 - deterministic sin/cos-driven bar heights per
// side, not random, so the two waveform clusters read as distinct shapes.
function wave(side: "l" | "r") {
  const fn = side === "l" ? Math.sin : Math.cos;
  return Array.from({ length: 9 }, (_, i) => ({
    h: `${24 + ((fn(i * 1.1) + 1) / 2) * 62}%`,
    c: side === "l" ? (i % 2 ? "rgba(79,201,255,.85)" : "rgba(167,139,250,.85)") : i % 2 ? "rgba(167,139,250,.85)" : "rgba(79,201,255,.85)",
    d: `${0.9 + ((side === "l" ? i : i + 2) % 4) * 0.22}s`,
    delay: `${i * (side === "l" ? 0.09 : 0.07)}s`,
  }));
}

const WAVE_L = wave("l");
const WAVE_R = wave("r");

function WaveBars({ bars }: { bars: typeof WAVE_L }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height: 92 }}>
      {bars.map((w, i) => (
        <span key={i} style={{ width: 4, borderRadius: 2, height: w.h, background: w.c, animation: `cmWave ${w.d} ease-in-out infinite`, animationDelay: w.delay }} />
      ))}
    </div>
  );
}

/**
 * Full-screen listening surface, ported verbatim from the reference
 * (POA Command.dc.html lines 501-552) - waveform bars, dual staggered
 * cmHalo rings, conic-spin mic center, detected topics, unresolved
 * questions, and action buttons.
 *
 * QUARANTINED DEMO SURFACE (POA-DEC-MOTHERSHIP-002) - renders only when the
 * demo layer is explicitly enabled. No microphone, transcription, or
 * listening capability exists in POA; TOPICS/OPEN_QS and the "BOARD
 * MEETING · LIVE" label are fixed fictional strings. Listening mode remains
 * not built (POA-BLD-MOTHERSHIP-001-COMPLETION-REPORT.md). An earlier
 * comment here cited "§12" as authorization; that citation did not resolve
 * to any authorizing document and has been removed.
 */
export function ListeningOverlay({ onAskOpinion, onStop }: { onAskOpinion: () => void; onStop: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Listening"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
        padding: "40px 0",
        background: "radial-gradient(900px 600px at 50% 46%, rgba(14,20,52,.94) 0%, rgba(2,4,9,.97) 70%)",
        backdropFilter: "blur(10px)",
        animation: "cmFade .3s ease",
      }}
    >
      <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <DemoDisclosure />
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <WaveBars bars={WAVE_L} />
          <div style={{ position: "relative", width: 216, height: 216, display: "grid", placeItems: "center" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(127,216,255,.5)", animation: "cmHalo 2.8s ease-out infinite" }} />
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(167,139,250,.45)", animation: "cmHalo 2.8s ease-out 1.4s infinite" }} />
            <span style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "conic-gradient(from 0deg,#4fe3ff,#a78bfa,#2ee6a6,#4fe3ff)", opacity: 0.5, animation: "cmSpin 7s linear infinite" }} />
            <span style={{ position: "absolute", inset: 32, borderRadius: "50%", background: "#050c18", border: "1px solid rgba(255,255,255,.14)" }} />
            <svg width="44" height="44" viewBox="0 0 22 22" fill="none" stroke="#e6f7ff" strokeWidth={1.2} style={{ position: "relative" }}>
              <rect x={8} y={2.5} width={6} height={11} rx={3} />
              <path d="M4.5 10.5a6.5 6.5 0 0 0 13 0M11 17v3" />
            </svg>
          </div>
          <WaveBars bars={WAVE_R} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 25, fontWeight: 300, color: "#dff3ff" }}>Listening to the room</div>
          <div className="mono" style={{ marginTop: 8, fontSize: 11, letterSpacing: "0.24em", color: "rgba(223,233,247,.62)" }}>
            BOARD MEETING · LIVE · 07:42
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,300px)", gap: 18 }}>
          <div style={{ padding: "20px 22px", borderRadius: 14, background: "rgba(10,18,34,.72)", border: "1px solid rgba(127,216,255,.18)" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "rgba(223,233,247,.6)" }}>
              DETECTED TOPICS
            </div>
            {TOPICS.map((t) => (
              <div key={t.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.c, flex: "none" }} />
                <span style={{ flex: 1, fontSize: 15, color: "rgba(223,233,247,.88)" }}>{t.n}</span>
                <span className="mono" style={{ fontSize: 10, color: "rgba(223,233,247,.55)" }}>
                  {t.v}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px 22px", borderRadius: 14, background: "linear-gradient(180deg,rgba(167,139,250,.1),rgba(10,18,34,.72))", border: "1px solid rgba(167,139,250,.3)" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "#c0a8ff" }}>
              UNRESOLVED IN THE ROOM
            </div>
            {OPEN_QS.map((q) => (
              <div key={q} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.07)", fontSize: 15, lineHeight: 1.45, color: "rgba(223,233,247,.88)" }}>
                {q}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onAskOpinion} className="mono listening-ask" style={{ fontSize: 12, letterSpacing: "0.14em", padding: "14px 22px", borderRadius: 999, border: "1px solid rgba(167,139,250,.6)", background: "rgba(167,139,250,.12)", color: "#cbb6ff", cursor: "pointer" }}>
            "POA, WHAT DO YOU THINK?"
          </button>
          <button onClick={onStop} className="mono listening-stop" style={{ fontSize: 12, letterSpacing: "0.14em", padding: "14px 22px", borderRadius: 999, border: "1px solid rgba(255,255,255,.18)", background: "none", color: "rgba(223,233,247,.75)", cursor: "pointer" }}>
            STOP LISTENING
          </button>
        </div>

        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(223,233,247,.5)" }}>
          MICROPHONE AUTHORIZED BY YOU · NOTHING IS SEALED UNTIL YOU SEAL IT
        </div>
      </div>
    </div>
  );
}
