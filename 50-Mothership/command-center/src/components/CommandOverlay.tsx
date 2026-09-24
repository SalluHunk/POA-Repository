import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCommandCenter: () => void;
  onFocusLookup: () => void;
  onProjects: () => void;
}

// A glass command surface emerging from the environment, positioned near
// the hamburger that opened it - not a centered modal with a dark scrim
// (POA Command.dc.html lines 491-498: translucent gradient, cyan border,
// backdrop-filter blur(18px), cmEmerge). The click-catcher behind it is
// transparent so the environment stays visible, matching the brief's "no
// hard white/gray modal treatment" requirement.
//
// Only entries that are actually functional are active; Diagnostics is
// not built in this MVP and stays visibly inert rather than a dead link
// (POA-BLD-MOTHERSHIP-001 §21's scope stopping rule).
// Open animates in via .converge-in on mount; close needs the opposite -
// React would otherwise unmount this instantly on `open=false`, giving no
// chance to play an exit transition. A short-lived `closing` state keeps
// it mounted just long enough to play .overlay-exit first.
export function CommandOverlay({ open, onClose, onCommandCenter, onFocusLookup, onProjects }: Props) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const t = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 180);
    return () => clearTimeout(t);
  }, [open, mounted]);

  if (!mounted) return null;
  return (
    <div role="dialog" aria-label="Command overlay" style={{ position: "fixed", inset: 0, zIndex: 20 }} onClick={onClose}>
      <div
        className={closing ? "overlay-exit" : "cm-emerge"}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: 34,
          top: 76,
          width: 300,
          borderRadius: 14,
          padding: 8,
          background: "linear-gradient(160deg, rgba(12,24,46,.95), rgba(6,12,24,.9))",
          border: "1px solid rgba(127,216,255,.22)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 26px 70px rgba(0,0,0,.6)",
        }}
      >
        <button
          className="overlay-item"
          onClick={() => {
            onCommandCenter();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          Command Center
        </button>
        <button
          className="overlay-item"
          onClick={() => {
            onFocusLookup();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          Missions — jump to one
        </button>
        <button
          className="overlay-item"
          onClick={() => {
            onFocusLookup();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          People — jump to one
        </button>
        {/* POA-PJR-001 Project Registry (read-only repository record). An
            overlay entry rather than an eighth domain orb: DOMAIN_SPEC is a
            verbatim port of the reference's seven domains. */}
        <button
          className="overlay-item"
          onClick={() => {
            onProjects();
            onClose();
          }}
          style={overlayItemStyle(true)}
        >
          Projects — repository registry
        </button>
        <button className="overlay-item" disabled style={overlayItemStyle(false)} aria-disabled="true" title="Not built in this MVP">
          Diagnostics <span className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>not yet available</span>
        </button>
      </div>
    </div>
  );
}

function overlayItemStyle(active: boolean) {
  return {
    color: active ? "var(--text)" : "var(--text-faint)",
    cursor: active ? "pointer" : "not-allowed",
  };
}
