import { useEffect, useRef, useState, type ReactNode } from "react";

const STAGE_WIDTH = 1536;
const STAGE_HEIGHT = 1024;

/**
 * The reference's canonical composition model (POA Command.dc.html's
 * `measureFit()`/`attachStage()`): a fixed 1536x1024 design space,
 * centered in the viewport and uniformly scaled to fit via a computed
 * `fit` factor - not a generic responsive grid. Everything nested inside
 * this component uses the reference's own pixel coordinate system
 * directly; `transform: scale(fit)` here is what makes those coordinates
 * resolve correctly at any real viewport size.
 *
 * A CSS `transform` on this element also makes it the containing block
 * for any `position: fixed` descendant (CSS Transforms spec) - so nested
 * components can keep using `position: fixed` and still size/position
 * relative to this 1536x1024 stage rather than the raw viewport.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [fit, setFit] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const w = outerRef.current?.clientWidth ?? window.innerWidth;
      const h = outerRef.current?.clientHeight ?? window.innerHeight;
      const f = Math.min(w / STAGE_WIDTH, h / STAGE_HEIGHT);
      setFit(f > 0 ? f : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && outerRef.current) ro.observe(outerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  return (
    <div ref={outerRef} style={{ position: "fixed", inset: 0, width: "100vw", height: "100dvh", overflow: "hidden", background: "var(--bg)" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `translate(-50%,-50%) scale(${fit})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
