interface Stat {
  v: string;
  k: string;
  sub: string;
}

/** Bottom-left glass panel, ported layout (POA Command.dc.html lines 95-115). Stats are real derived counts; the pulse status is real (loading/attention-derived). */
export function OrganizationalPulse({ pulseLabel, pulseColor, stats }: { pulseLabel: string; pulseColor: string; stats: Stat[] }) {
  return (
    <div className="depth-contextual" style={{ position: "fixed", left: 32, bottom: 250, zIndex: 2, width: 352, padding: "22px 24px", borderRadius: 14, pointerEvents: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "rgba(223,233,247,.68)" }}>
          ORGANIZATIONAL PULSE
        </span>
        <span className="mono" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, letterSpacing: "0.16em", color: pulseColor }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: pulseColor, animation: "cmGlow 3s ease-in-out infinite" }} />
          {pulseLabel}
        </span>
      </div>

      {/* Decorative ambient line only - not a real time-series (no
          trend/history endpoint exists yet); neutral tone, not implying
          a positive/negative reading. */}
      <svg viewBox="0 0 300 60" style={{ width: "100%", height: 76, marginTop: 16, display: "block" }} aria-hidden>
        <path d="M0 38 C 34 24, 58 48, 92 36 S 148 14, 186 27 S 244 46, 300 20" fill="none" stroke="rgba(127,216,255,.32)" strokeWidth={1.4} />
        <path d="M0 44 C 36 34, 62 54, 96 44 S 152 25, 190 36 S 246 52, 300 32" fill="none" stroke="rgba(127,216,255,.16)" strokeWidth={1} />
      </svg>

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.k}>
            <div style={{ fontSize: 23 }}>{s.v}</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: "rgba(223,233,247,.82)" }}>{s.k}</div>
            <div className="mono" style={{ marginTop: 2, fontSize: 10, color: "rgba(223,233,247,.5)" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
