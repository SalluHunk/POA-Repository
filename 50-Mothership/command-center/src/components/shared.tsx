import type { CSSProperties, ReactNode } from "react";

const TONES: Record<string, { bg: string; border: string; color: string }> = {
  green: { bg: "rgba(62,207,142,.12)", border: "rgba(62,207,142,.35)", color: "var(--green)" },
  red: { bg: "rgba(224,85,79,.12)", border: "rgba(224,85,79,.35)", color: "var(--red)" },
  amber: { bg: "rgba(217,164,65,.12)", border: "rgba(217,164,65,.35)", color: "var(--amber)" },
  cyan: { bg: "rgba(79,179,232,.12)", border: "rgba(79,179,232,.35)", color: "var(--cyan)" },
  violet: { bg: "rgba(152,132,224,.12)", border: "rgba(152,132,224,.35)", color: "var(--violet)" },
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
        gap: 6,
        fontSize: 12.5,
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
    <div className="mono fade-in" style={{ fontSize: 12, marginBottom: 28, textAlign: "center" }}>
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
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid",
    background: kind === "caution" ? "rgba(217,164,65,.1)" : "var(--panel-2)",
    borderColor: kind === "caution" ? "rgba(217,164,65,.4)" : "var(--border-2)",
    color: kind === "caution" ? "var(--amber)" : "var(--text-dim)",
  };
}
