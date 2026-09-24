import type { MissionDetail, RuntimeResult } from "../api/types";
import { Chip } from "./shared";

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
        <Chip tone={result.ok ? "green" : "red"}>
          {result.ok ? "✓" : "✕"} {result.code}
        </Chip>
        {detail && <Chip tone={detail.witnessCode === "MATCH" ? "green" : "neutral"}>{detail.witnessCode === "MATCH" ? "✓✓ VERIFIED — witness matched" : detail.witnessCode}</Chip>}
      </div>
      {result.detail && <div style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{result.detail}</div>}
    </div>
  );
}
