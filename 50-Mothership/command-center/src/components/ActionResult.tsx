import type { MissionDetail, RuntimeResult } from "../api/types";

interface Props {
  result: RuntimeResult;
  detail: MissionDetail | undefined;
}

// S8 (result) -> S9 (verification), merged into the subject in place -
// no full re-render flash, badges update where they already are
// (POA-MOTHERSHIP-EXPERIENCE-ARCHITECTURE.md §8).
export function ActionResult({ result, detail }: Props) {
  return (
    <div className="depth-evidence converge-in" style={{ borderRadius: 10, padding: "24px 28px", maxWidth: 640, margin: "0 auto 24px", borderColor: result.ok ? "rgba(62,207,142,.35)" : "rgba(224,85,79,.35)" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: detail ? 12 : 0 }}>
        <span
          className="mono"
          style={{
            fontSize: 12.5,
            padding: "5px 11px",
            borderRadius: 4,
            background: result.ok ? "rgba(62,207,142,.12)" : "rgba(224,85,79,.12)",
            border: `1px solid ${result.ok ? "rgba(62,207,142,.35)" : "rgba(224,85,79,.35)"}`,
            color: result.ok ? "var(--green)" : "var(--red)",
          }}
        >
          {result.ok ? "✓" : "✕"} {result.code}
        </span>
        {detail && (
          <span
            className="mono"
            style={{
              fontSize: 12.5,
              padding: "5px 11px",
              borderRadius: 4,
              background: detail.witnessCode === "MATCH" ? "rgba(62,207,142,.12)" : "var(--panel-2)",
              border: `1px solid ${detail.witnessCode === "MATCH" ? "rgba(62,207,142,.35)" : "var(--border-2)"}`,
              color: detail.witnessCode === "MATCH" ? "var(--green)" : "var(--text-dim)",
            }}
          >
            {detail.witnessCode === "MATCH" ? "✓✓ VERIFIED — witness matched" : detail.witnessCode}
          </span>
        )}
      </div>
      {result.detail && <div style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{result.detail}</div>}
    </div>
  );
}
