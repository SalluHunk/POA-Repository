import { useEffect, useState } from "react";
import { PHASES, type Phase } from "../state/phases";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Persistent top bar - hamburger, wordmark, phase selector, live clock.
 * No avatar/name (POA Command.dc.html lines 62-84 also shows a "Good
 * morning, Siddharth" greeting + avatar) - POA has no persistent "Acting
 * As" identity, every consequential action requires per-action principal
 * selection (ActionConfirm), so a fixed greeter identity would misrepresent
 * that. The phase selector itself is ported in full (all 5 phases,
 * clickable): the reference's `pickPhase` (line 855) is a pure
 * `setState({phase:id})` with no backing system signal anywhere in the
 * reference either - it's a manual display toggle, not a claim about real
 * state, so porting it faithfully doesn't fabricate anything.
 */
export function Header({ onToggleOverlay }: { onToggleOverlay: () => void }) {
  const now = useClock();
  const [phase, setPhase] = useState<Phase>("OBSERVE");
  const dateLabel = now
    .toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
    .toUpperCase();

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button
          onClick={onToggleOverlay}
          aria-label="Open command overlay"
          className="header-hamburger"
          style={{ width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "var(--text)", cursor: "pointer" }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" stroke="#cfe3ff" strokeWidth={1.4}>
            <path d="M0 1h16M0 6h16M0 11h16" />
          </svg>
        </button>
        <span>
          <span style={{ display: "block", fontSize: 17, fontWeight: 500, letterSpacing: "0.16em" }}>POA</span>
          <span className="mono" style={{ display: "block", marginTop: 3, fontSize: 9.5, letterSpacing: "0.2em", color: "rgba(223,233,247,.55)" }}>
            ORGANIZATIONAL INTELLIGENCE
          </span>
        </span>
      </div>

      <div className="mono" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {PHASES.map((p, i) => (
          <span key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setPhase(p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.22em",
                padding: "7px 12px",
                color: p === phase ? "#dff3ff" : "rgba(223,233,247,.6)",
                borderBottom: p === phase ? "1px solid rgba(127,216,255,.7)" : "1px solid transparent",
              }}
            >
              {p}
            </button>
            {i < PHASES.length - 1 && <span style={{ color: "rgba(223,233,247,.25)", fontSize: 10 }}>·</span>}
          </span>
        ))}
      </div>

      <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: "rgba(223,233,247,.72)" }}>
        {dateLabel}
      </span>
    </header>
  );
}
