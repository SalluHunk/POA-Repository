import { useState } from "react";
import { isDemoLayerEnabled } from "../demo/demoLayer";

interface Props {
  onAsk: (q: string) => void;
  onLookup: (id: string) => void;
  isKnownId: (id: string) => boolean;
  lookupError: string | null;
  listening: boolean;
  onToggleListen: () => void;
}

/**
 * Elevated ask-bar, ported pill styling and placeholder verbatim
 * (POA Command.dc.html lines 467-475: "Ask POA anything...", mic toggles
 * the listening surface). Submission is hybrid: a real mission/principal
 * ID still routes to the real Focus flow exactly as before (preserving
 * that tested capability).
 *
 * Demo quarantine (POA-DEC-MOTHERSHIP-002): by default every submission goes
 * to the real structured lookup and the mic is inert - natural-language
 * conversation is VISION and listening mode is not built. Only when the
 * demo layer is explicitly enabled does free text reach the fictional
 * ask-POA -> thinking -> canned answer flow, and the mic open the fictional
 * listening overlay. (An earlier comment here cited "§12" as authorization
 * for the mic; that citation did not resolve to any authorizing document.)
 */
export function CommandBar({ onAsk, onLookup, isKnownId, lookupError, listening, onToggleListen }: Props) {
  const [query, setQuery] = useState("");
  const demo = isDemoLayerEnabled();
  return (
    <div style={{ position: "fixed", left: "calc(50% - 410px)", bottom: 96, zIndex: 2, width: 820, pointerEvents: "auto" }}>
      <form
        className="command-bar-form"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = query.trim();
          if (!trimmed) return;
          if (isKnownId(trimmed) || !demo) onLookup(trimmed);
          else onAsk(trimmed);
          setQuery("");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 16px 13px 13px",
          borderRadius: 999,
          background: "linear-gradient(120deg,rgba(14,26,48,.88),rgba(8,14,28,.8))",
          border: "1px solid rgba(127,216,255,.24)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <button
          type="button"
          onClick={demo ? onToggleListen : undefined}
          disabled={!demo}
          title={demo ? undefined : "Listening is not a POA capability (not built)"}
          aria-label={demo ? (listening ? "Stop listening" : "Start listening") : "Listening not available"}
          className="command-bar-mic"
          style={{
            width: 44,
            height: 44,
            flex: "none",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: listening ? "rgba(167,139,250,.24)" : "rgba(127,216,255,.12)",
            border: `1px solid ${listening ? "rgba(167,139,250,.7)" : "rgba(127,216,255,.35)"}`,
            cursor: demo ? "pointer" : "default",
            opacity: demo ? 1 : 0.4,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 22 22" fill="none" stroke={listening ? "#cbb6ff" : "#9fe9ff"} strokeWidth={1.5}>
            <rect x="8" y="2.5" width="6" height="11" rx="3" />
            <path d="M4.5 10.5a6.5 6.5 0 0 0 13 0M11 17v3" />
          </svg>
        </button>
        <input
          id="cc-ask"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={demo ? "Ask POA anything..." : "Jump to a mission or principal by ID..."}
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", fontSize: 18, color: "#dfe9f7" }}
        />
        <span style={{ color: "#7fd8ff", fontSize: 16 }}>✦</span>
        <button
          type="submit"
          aria-label="Go"
          className="command-bar-submit"
          style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(127,216,255,.14)", border: "1px solid rgba(127,216,255,.4)", color: "#c4efff", fontSize: 16, cursor: "pointer" }}
        >
          ↑
        </button>
      </form>
      {lookupError && (
        <div className="mono" style={{ marginTop: 8, fontSize: 12, color: "var(--amber)", textAlign: "center" }}>
          {lookupError}
          {!demo && " Only mission and principal IDs resolve; natural-language questions are not a POA capability."}
        </div>
      )}
    </div>
  );
}
