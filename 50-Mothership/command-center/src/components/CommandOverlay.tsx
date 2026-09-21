interface Props {
  open: boolean;
  onClose: () => void;
  onCommandCenter: () => void;
  onFocusLookup: () => void;
}

// Not a permanent sidebar, not a top nav bar - a compact overlay above the
// environment (POA-BLD-MOTHERSHIP-001 §8). Only entries that are actually
// functional are active; Diagnostics is not built in this MVP and stays
// visibly inert rather than a dead link (§21's scope stopping rule).
export function CommandOverlay({ open, onClose, onCommandCenter, onFocusLookup }: Props) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Command overlay"
      style={{ position: "fixed", inset: 0, background: "rgba(6,8,11,.72)", backdropFilter: "blur(4px)", zIndex: 20, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 120 }}
      onClick={onClose}
    >
      <div className="depth-evidence" onClick={(e) => e.stopPropagation()} style={{ borderRadius: 10, padding: 8, width: 320 }}>
        <button
          onClick={() => {
            onCommandCenter();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          Command Center
        </button>
        <button
          onClick={() => {
            onFocusLookup();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          Missions — jump to one
        </button>
        <button
          onClick={() => {
            onFocusLookup();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          People — jump to one
        </button>
        <button disabled style={overlayItemStyle(false)} aria-disabled="true" title="Not built in this MVP">
          Diagnostics <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>not yet available</span>
        </button>
      </div>
    </div>
  );
}

function overlayItemStyle(active: boolean) {
  return {
    display: "block",
    width: "100%",
    textAlign: "left" as const,
    background: "none",
    border: "none",
    borderRadius: 6,
    padding: "12px 14px",
    fontSize: 14,
    color: active ? "var(--text)" : "var(--text-faint)",
    cursor: active ? "pointer" : "not-allowed",
  };
}
