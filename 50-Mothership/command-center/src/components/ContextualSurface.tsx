import type { ReactNode } from "react";

/**
 * Wraps Focus/Investigate/Confirm/Result content so it emerges as a
 * floating layer over the persistent Environment rather than replacing it
 * with a conventional page (POA Command.dc.html's detail-overlay
 * mechanism, lines 236-243). Positioning only - each wrapped component
 * keeps its own depth-contextual/depth-evidence glass styling, so nothing
 * gets double-boxed.
 */
export function ContextualSurface({ children, variant = "anchored" }: { children: ReactNode; variant?: "anchored" | "scroll" }) {
  return (
    <div
      className="converge-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4,
        display: "flex",
        alignItems: variant === "anchored" ? "flex-end" : "center",
        justifyContent: "center",
        paddingTop: variant === "scroll" ? 90 : 0,
        paddingBottom: variant === "anchored" ? "16%" : 40,
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto", width: "100%", maxHeight: variant === "scroll" ? "calc(100vh - 130px)" : undefined, overflowY: variant === "scroll" ? "auto" : undefined }}>{children}</div>
    </div>
  );
}
