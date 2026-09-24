/**
 * Shared coordinate anchor for the Environment layer and everything that
 * orbits it (DomainOrbits here, individual mission/principal markers in
 * OrbitMarkers) - the reference's exact core center within the canonical
 * 1536x1024 stage (POA Command.dc.html line 155: the orbital geometry box
 * is centered at left:50%, top:462px within the stage; the core sphere is
 * centered within that box at local (530,410), which is the box's own
 * center - so both land on the same absolute stage point, (768, 462)).
 */
export const CORE_CENTER = { left: "768px", top: "462px" };

export interface DomainSpec {
  id: string;
  label: string;
  left: string;
  top: string;
  size: number;
  c1: string;
  c2: string;
  glow: string;
  ring: string;
  tilt: string;
  anim: "cmDrift" | "cmDriftB";
  dur: string;
  delay: string;
  spin: string;
  /** Reference example figures - FICTIONAL demo content (POA-DEC-MOTHERSHIP-002); displayed only when the demo layer is enabled. */
  l1: string;
  l2: string;
  l2Tone: "warn" | "quiet";
  /** Reference example status flag - FICTIONAL demo content; displayed only when the demo layer is enabled. */
  flag: string;
}

/**
 * The 7 organizational domains - exact positions, colors, and per-domain
 * motion (tilt/anim/dur/delay/spin) and status fields ported verbatim from
 * the reference's DOMAINS object (POA Command.dc.html lines 557-606).
 */
export const DOMAIN_SPEC: DomainSpec[] = [
  { id: "missions", label: "MISSIONS", left: "46.5%", top: "11.5%", size: 62, c1: "#7ef2b8", c2: "#0f7a56", glow: "rgba(60,220,150,.55)", ring: "rgba(126,242,184,.35)", tilt: "-18deg", anim: "cmDrift", dur: "11s", delay: "0s", spin: "26s", l1: "4 ACTIVE", l2: "1 ATTENTION", l2Tone: "warn", flag: "—" },
  { id: "people", label: "PEOPLE", left: "28.5%", top: "22.5%", size: 54, c1: "#9fc6ff", c2: "#1d4494", glow: "rgba(100,150,255,.5)", ring: "rgba(159,198,255,.3)", tilt: "22deg", anim: "cmDriftB", dur: "13s", delay: ".8s", spin: "32s", l1: "38 ENGAGED", l2: "12 WORKING", l2Tone: "quiet", flag: "" },
  { id: "evidence", label: "EVIDENCE", left: "62.5%", top: "24.5%", size: 58, c1: "#ffd98a", c2: "#9a5a10", glow: "rgba(245,165,60,.55)", ring: "rgba(255,217,138,.35)", tilt: "-10deg", anim: "cmDrift", dur: "9s", delay: ".4s", spin: "22s", l1: "1 DEGRADED", l2: "3 PENDING", l2Tone: "warn", flag: "⚠" },
  { id: "systems", label: "SYSTEMS", left: "64.5%", top: "46.5%", size: 50, c1: "#9ff0e4", c2: "#0f5f6e", glow: "rgba(70,210,220,.5)", ring: "rgba(159,240,228,.3)", tilt: "14deg", anim: "cmDriftB", dur: "12s", delay: "1.2s", spin: "29s", l1: "7 / 9 HEALTHY", l2: "1 WARNING", l2Tone: "warn", flag: "" },
  { id: "authority", label: "AUTHORITY", left: "59.5%", top: "62.5%", size: 56, c1: "#e8f2ff", c2: "#34507e", glow: "rgba(180,210,255,.45)", ring: "rgba(232,242,255,.3)", tilt: "-24deg", anim: "cmDrift", dur: "14s", delay: ".2s", spin: "34s", l1: "2 DECISIONS", l2: "AWAITING YOU", l2Tone: "warn", flag: "" },
  { id: "knowledge", label: "KNOWLEDGE", left: "32.5%", top: "61.5%", size: 58, c1: "#e0a7ff", c2: "#5a1f8c", glow: "rgba(180,90,255,.5)", ring: "rgba(224,167,255,.3)", tilt: "18deg", anim: "cmDriftB", dur: "10s", delay: ".6s", spin: "24s", l1: "1,204 VERIFIED", l2: "6 NEW TODAY", l2Tone: "quiet", flag: "" },
  { id: "governance", label: "GOVERNANCE", left: "26%", top: "45%", size: 52, c1: "#ffb489", c2: "#8a3510", glow: "rgba(255,130,70,.45)", ring: "rgba(255,180,137,.3)", tilt: "-14deg", anim: "cmDrift", dur: "12.5s", delay: "1s", spin: "28s", l1: "0 BREACHES", l2: "1 REVIEW", l2Tone: "warn", flag: "" },
];
