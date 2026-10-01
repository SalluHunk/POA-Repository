import type { CSSProperties, ReactNode } from "react";

/** A status-token color at partial opacity, so tints track the current palette instead of old rgba copies. */
const tint = (token: string, pct: number) => `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;

const TONES: Record<string, { bg: string; border: string; color: string }> = {
  green: { bg: tint("--green", 12), border: tint("--green", 35), color: "var(--green)" },
  red: { bg: tint("--red", 12), border: tint("--red", 35), color: "var(--red)" },
  amber: { bg: tint("--amber", 12), border: tint("--amber", 35), color: "var(--amber)" },
  cyan: { bg: tint("--cyan", 12), border: tint("--cyan", 35), color: "var(--cyan)" },
  violet: { bg: tint("--violet", 12), border: tint("--violet", 35), color: "var(--violet)" },
  neutral: { bg: "var(--panel-2)", border: "var(--border-2)", color: "var(--text-dim)" },
};

/** A chip/badge - every semantic status carries glyph + word, never color alone. */
export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <span
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-6)",
        fontSize: "var(--fs-12-5)",
        fontWeight: 500,
        padding: "5px 11px",
        borderRadius: 4,
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.color,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Preserves origin at every depth (Experience Architecture Principle 4:
 * "every transition preserves origin"). Not new navigation scope - it's
 * the existing state model's own requirement, made visible.
 */
export function Breadcrumb({ segments }: { segments: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="mono fade-in" style={{ fontSize: "var(--fs-12)", marginBottom: 28, textAlign: "center" }}>
      {segments.map((s, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: "var(--text-faint)", margin: "0 8px" }}>›</span>}
          {s.onClick ? (
            <button onClick={s.onClick} style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>
              {s.label}
            </button>
          ) : (
            <span style={{ color: "var(--text)" }}>{s.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function buttonStyle(kind: "caution" | "quiet"): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: "var(--radius-6)",
    fontSize: "var(--fs-13-5)",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid",
    background: kind === "caution" ? tint("--amber", 10) : "var(--panel-2)",
    borderColor: kind === "caution" ? tint("--amber", 40) : "var(--border-2)",
    color: kind === "caution" ? "var(--amber)" : "var(--text-dim)",
  };
}
