import type { CSSProperties } from "react";

/**
 * DEMO LAYER GATE - POA-DEC-MOTHERSHIP-002 (quarantine of the 2026-09-23
 * reference-design demo layer, "Layer B").
 *
 * Everything in src/demo/ is fictional reference content ported from
 * POA Command.dc.html: canned Ask-POA answers, the listening overlay, and
 * the domain-detail narrative (Temple Growth, D-016, etc.). None of it is
 * POA organizational truth, none of it is POA runtime capability, and none
 * of it is authorized product behavior. Natural-language conversation
 * remains VISION and listening mode remains not built, exactly as
 * POA-BLD-MOTHERSHIP-001-COMPLETION-REPORT.md records.
 *
 * The layer is OFF by default (dev, test, and production builds). It is
 * reachable only by explicit opt-in: `npm run dev:demo` (vite --mode demo).
 * When on, every demo surface carries DEMO_DISCLOSURE.
 *
 * Read at call time (not module load) so tests can opt in via vi.stubEnv.
 */
export function isDemoLayerEnabled(): boolean {
  return import.meta.env.MODE === "demo";
}

export const DEMO_DISCLOSURE = "DEMO · FICTIONAL REFERENCE CONTENT — NOT POA ORGANIZATIONAL TRUTH";

/** Visible per-surface disclosure line, rendered on every demo surface. */
export function DemoDisclosure({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="mono"
      role="note"
      style={{ fontSize: 10, letterSpacing: ".16em", color: "#f2a53c", border: "1px solid rgba(242,165,60,.4)", borderRadius: 4, padding: "4px 8px", display: "inline-block", ...style }}
    >
      {DEMO_DISCLOSURE}
    </div>
  );
}
