import { CORE_CENTER } from "./constants";

/**
 * Halo + concentric rings + 2 slowly counter-rotating dashed orbit lines
 * around the core - exact reference coordinates (POA Command.dc.html
 * lines 155-174: viewBox 0 0 1060 820, halo r=380, rings rx/ry 470/188,
 * 420/286, 360/342 at their exact rotations, centered on (530,410) - the
 * same local point as CORE_CENTER). Pure decoration, no data.
 */
export function OrbitalGeometry() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1060 820"
      style={{
        position: "fixed",
        left: CORE_CENTER.left,
        top: CORE_CENTER.top,
        transform: "translate(-50%,-50%)",
        width: 1060,
        height: 820,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <radialGradient id="cmHalo">
          <stop offset="0%" stopColor="#3ea8ff" stopOpacity={0.3} />
          <stop offset="60%" stopColor="#1f5ba8" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#0a1830" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={530} cy={410} r={380} fill="url(#cmHalo)" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "cmBreathe 9s ease-in-out infinite" }} />
      <g fill="none" stroke="rgba(120,190,255,.16)" strokeWidth={1}>
        <ellipse cx={530} cy={410} rx={470} ry={188} transform="rotate(-14 530 410)" />
        <ellipse cx={530} cy={410} rx={420} ry={286} transform="rotate(9 530 410)" />
        <ellipse cx={530} cy={410} rx={360} ry={342} transform="rotate(-4 530 410)" />
      </g>
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "cmSpin 160s linear infinite" }}>
        <ellipse cx={530} cy={410} rx={470} ry={188} transform="rotate(-14 530 410)" fill="none" stroke="rgba(79,201,255,.4)" strokeWidth={1.2} strokeDasharray="4 26" style={{ animation: "cmFlow 18s linear infinite" }} />
      </g>
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "cmSpinR 240s linear infinite" }}>
        <ellipse cx={530} cy={410} rx={420} ry={286} transform="rotate(9 530 410)" fill="none" stroke="rgba(160,120,255,.3)" strokeWidth={1} strokeDasharray="2 22" />
      </g>
    </svg>
  );
}
