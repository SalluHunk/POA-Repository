import { useMemo, useState } from "react";
import type { Mission, MissionDetail } from "../api/types";
import type { AttentionItem } from "../state/attention";

interface Props {
  missions: Mission[];
  missionDetails: Map<string, MissionDetail>;
  attention: AttentionItem[];
  loading: boolean;
  error: string | null;
  lookupError: string | null;
  onFocusMission: (id: string) => void;
  onLookup: (query: string) => void;
}

// Deterministic pseudo-random offset per id, so the field is organic
// (not a perfect ring) but stable across re-renders - never Math.random().
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function pointFor(id: string, index: number, total: number) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (hash(id) % 100) / 100;
  const radius = 130 + (hash(id) % 70);
  return {
    x: 260 + Math.cos(angle) * radius,
    y: 260 + Math.sin(angle) * radius,
  };
}

export function Presence({ missions, missionDetails, attention, loading, error, lookupError, onFocusMission, onLookup }: Props) {
  const [query, setQuery] = useState("");

  const points = useMemo(
    () =>
      missions.map((m, i) => {
        const detail = missionDetails.get(m.id);
        const attn = attention.find((a) => a.missionId === m.id);
        return { mission: m, detail, attn, pos: pointFor(m.id, i, missions.length) };
      }),
    [missions, missionDetails, attention],
  );

  const headline = loading ? "Reading the organization…" : "Your organization is stable.";
  const subline = loading
    ? ""
    : attention.length === 0
      ? "Nothing requires attention."
      : attention.length === 1
        ? "1 thing requires attention."
        : `${attention.length} things require attention.`;

  return (
    <div className="fade-in" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, rgba(79,179,232,.035), transparent 62%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", width: 520, height: 520, margin: "40px auto 0" }}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(207,224,235,.05), transparent 70%)",
            filter: "blur(18px)",
            animation: "breathe 9s ease-in-out infinite",
          }}
        />

        {points.map(({ mission, attn, pos }) => {
          const flagged = Boolean(attn);
          const color = attn?.tier === 1 ? "var(--red)" : attn?.tier === 2 ? "var(--red)" : attn?.tier === 3 ? "var(--grey)" : "var(--green)";
          const size = flagged ? (attn!.tier <= 2 ? 15 : 9) : 6;
          return (
            <button
              key={mission.id}
              onClick={() => onFocusMission(mission.id)}
              aria-label={`Focus mission ${mission.id}${attn ? ` — ${attn.label}` : ""}`}
              title={`${mission.id}${attn ? ` — ${attn.label}` : ""}`}
              style={{
                position: "absolute",
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                background: color,
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size > 12 ? 8 : 0,
                color: "#0e1116",
                animation: flagged && attn!.tier <= 2 ? "pulse 2.4s ease-in-out infinite" : undefined,
              }}
            >
              {size > 12 ? attn!.glyph : null}
            </button>
          );
        })}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 400 }}>{headline}</div>
          <div style={{ fontSize: 15, color: "var(--text-dim)" }}>{subline}</div>
        </div>
      </div>

      {error && (
        <div className="mono" style={{ textAlign: "center", color: "var(--red)", marginTop: 16, fontSize: 12.5 }}>
          {error}
        </div>
      )}

      <div style={{ maxWidth: 400, margin: "48px auto 0", textAlign: "center" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLookup(query);
            setQuery("");
          }}
        >
          <label htmlFor="cc-lookup" className="mono" style={{ display: "block", fontSize: 10, letterSpacing: "0.14em", color: "var(--text-faint)", marginBottom: 6 }}>
            LOOKUP
          </label>
          <input
            id="cc-lookup"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a mission or principal — e.g. mission-demo-003"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--border-2)",
              padding: "6px 2px",
              color: "var(--text-dim)",
              fontSize: 13,
              textAlign: "center",
              outline: "none",
            }}
          />
        </form>
        {lookupError && (
          <div className="mono" style={{ marginTop: 8, fontSize: 12, color: "var(--amber)" }}>
            {lookupError}
          </div>
        )}
      </div>
    </div>
  );
}
