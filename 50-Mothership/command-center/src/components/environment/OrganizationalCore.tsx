import { CORE_CENTER } from "./constants";

function seedRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const MESH = Array.from({ length: 26 }, (_, i) => ({
  x: 8 + seedRand(i * 3.7) * 84,
  y: 8 + seedRand(i * 6.1 + 1) * 84,
  r: 0.5 + seedRand(i * 4.9 + 2) * 1,
  o: 0.4 + seedRand(i * 8.3 + 3) * 0.55,
  delay: `${(seedRand(i * 2.6 + 4) * 3).toFixed(2)}s`,
  dur: `${(2.5 + seedRand(i * 5.1 + 5) * 4).toFixed(2)}s`,
}));

const CAPTION = ["ALIGNING PEOPLE", "TECHNOLOGY", "HIGHER PURPOSE"];

/**
 * The glowing organizational core - glass shell, wireframe mesh, wordmark,
 * tagline caption, beam, and pedestal. Pure atmosphere/branding, no
 * organizational data (POA Command.dc.html lines 176-217). `recede` dims
 * and shrinks it away from Presence - same mechanism as the prior round.
 * `caption`/`captionColor` let a selected domain override the default
 * tagline (reference's coreCaption/coreCaptionColor, lines 811-812).
 */
export function OrganizationalCore({ recede = false, caption, captionColor }: { recede?: boolean; caption?: string[]; captionColor?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: CORE_CENTER.left,
        top: CORE_CENTER.top,
        width: 430,
        height: 430,
        transform: `translate(-50%,-50%) scale(${recede ? 0.5 : 1})`,
        opacity: recede ? 0.28 : 1,
        transition: "transform 0.6s cubic-bezier(.2,.7,.3,1), opacity 0.6s ease",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "absolute", inset: -70, borderRadius: "50%", background: "radial-gradient(circle, rgba(64,170,255,.2) 0%, rgba(30,90,170,.07) 48%, transparent 72%)", animation: "cmBreathe 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1px solid rgba(127,216,255,.28)" }} />
      <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(127,216,255,.18)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 42% 34%, rgba(150,225,255,.3) 0%, rgba(30,110,200,.22) 38%, rgba(10,36,80,.5) 68%, rgba(4,12,28,.85) 100%)",
          boxShadow: "0 0 90px rgba(45,140,235,.35), inset -20px -26px 70px rgba(2,6,16,.8), inset 14px 18px 60px rgba(120,200,255,.14)",
        }}
      />

      <svg viewBox="0 0 430 430" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <clipPath id="cmBall">
          <circle cx={215} cy={215} r={214} />
        </clipPath>
        <g clipPath="url(#cmBall)">
          <g fill="none" stroke="rgba(150,220,255,.22)" strokeWidth={1}>
            <ellipse cx={215} cy={215} rx={214} ry={52} />
            <ellipse cx={215} cy={215} rx={214} ry={112} />
            <ellipse cx={215} cy={215} rx={214} ry={170} />
            <ellipse cx={215} cy={215} rx={52} ry={214} />
            <ellipse cx={215} cy={215} rx={112} ry={214} />
            <ellipse cx={215} cy={215} rx={170} ry={214} />
            <circle cx={215} cy={215} r={214} />
          </g>
          <g stroke="rgba(120,230,220,.3)" strokeWidth={1} fill="none">
            <path d="M40 150 L120 108 L196 140 L268 96 L352 132" />
            <path d="M52 268 L134 300 L206 262 L284 306 L372 268" />
            <path d="M120 108 L134 300" />
            <path d="M268 96 L284 306" />
            <path d="M196 140 L206 262" />
          </g>
          <g fill="#c9f4ff">
            {MESH.map((n, i) => (
              <circle
                key={i}
                cx={(n.x / 100) * 430}
                cy={(n.y / 100) * 430}
                r={n.r}
                opacity={n.o}
                style={{ animation: `cmTwinkle ${n.dur} ease-in-out infinite`, animationDelay: n.delay }}
              />
            ))}
          </g>
        </g>
        <circle cx={215} cy={215} r={214} fill="none" stroke="rgba(160,225,255,.35)" strokeWidth={1} />
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", textShadow: "0 0 22px rgba(10,30,60,.9)" }}>
        <div style={{ fontSize: 40, fontWeight: 300, letterSpacing: "0.14em", color: "#eaf8ff" }}>POA</div>
        <div className="mono" style={{ marginTop: 8, fontSize: 15, letterSpacing: "0.3em", color: "rgba(223,233,247,.8)" }}>
          PARAVYOMA
        </div>
        <div className="mono" style={{ marginTop: 22, fontSize: 10.5, letterSpacing: "0.2em", lineHeight: 2, color: captionColor ?? "rgba(223,233,247,.7)" }}>
          {(caption ?? CAPTION).map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: "50%", top: "100%", transform: "translateX(-50%)", width: 2, height: "24%", background: "linear-gradient(180deg,rgba(127,216,255,.55),rgba(127,216,255,0))", animation: "cmBeam 6s ease-in-out infinite", transformOrigin: "top" }} />
      <div style={{ position: "absolute", left: "50%", top: "142%", transform: "translate(-50%,-50%)", width: "74%", height: "18%", borderRadius: "50%", border: "1px solid rgba(127,216,255,.2)", boxShadow: "0 0 40px rgba(50,150,240,.18)" }} />
      <div style={{ position: "absolute", left: "50%", top: "142%", transform: "translate(-50%,-50%)", width: "46%", height: "11%", borderRadius: "50%", border: "1px solid rgba(127,216,255,.3)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "142%",
          transform: "translate(-50%,-50%)",
          width: "20%",
          height: "5%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(190,240,255,.85), rgba(80,190,255,.18) 60%, transparent 75%)",
          animation: "cmGlow 5s ease-in-out infinite",
        }}
      />
    </div>
  );
}
