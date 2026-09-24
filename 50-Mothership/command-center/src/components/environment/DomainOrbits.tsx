import type { DomainSpec } from "./constants";
import { DOMAIN_SPEC } from "./constants";

export interface DomainDatum {
  l1: string;
  l2: string;
  /** Status flag glyph; supplied by the caller so fictional reference flags stay demo-gated. */
  flag?: string;
}

const WARN = "#f2a53c";
const QUIET = "rgba(223,233,247,.72)";

/**
 * One domain orb - clickable (reference's `pickDomain`, POA Command.dc.html
 * line 220), with the selection ripple/dim/glow/label-color states from
 * `renderVals()`'s `orbs` mapping (lines 806-810). `l1`/`l2` text is
 * supplied by the caller (App.tsx) - real derived counts for the domains
 * that have a real backend concept, the reference's own narrative labels
 * for the three that don't - everything else (tilt/ring/anim/dur/delay/
 * spin/l2Tone/flag) comes straight off DOMAIN_SPEC.
 */
function DomainOrb({ spec, l1, l2, flag, selected, dimmed, onSelect }: { spec: DomainSpec; l1: string; l2: string; flag?: string; selected: boolean; dimmed: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="domain-orb"
      style={{
        position: "absolute",
        left: spec.left,
        top: spec.top,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        opacity: dimmed ? 0.4 : 1,
        transition: "opacity .35s",
      }}
    >
      <span style={{ position: "relative", width: spec.size, height: spec.size, flex: "none", animation: `${spec.anim} ${spec.dur} ease-in-out infinite`, animationDelay: spec.delay }}>
        <span style={{ position: "absolute", inset: "-34%", borderRadius: "50%", background: `radial-gradient(circle, ${spec.glow} 0%, transparent 68%)`, opacity: selected ? 1 : 0.55 }} />
        <span
          className="domain-orb-sphere"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, #ffffff 0%, ${spec.c1} 16%, ${spec.c2} 52%, #050a16 100%)`,
            boxShadow: `0 0 30px ${spec.glow}, inset -6px -8px 22px rgba(0,0,0,.7)`,
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, transparent 0deg, ${spec.glow} 70deg, transparent 150deg, ${spec.glow} 250deg, transparent 330deg)`,
            opacity: 0.2,
            animation: `cmSpin ${spec.spin} linear infinite`,
          }}
        />
        <span style={{ position: "absolute", inset: "-22%", borderRadius: "50%", border: `1px solid ${spec.ring}`, transform: `rotate(${spec.tilt}) scaleY(.36)` }} />
        <span style={{ position: "absolute", inset: "-30%", borderRadius: "50%", border: `1px solid ${spec.c1}`, opacity: selected ? 0.7 : 0, animation: "cmRipple 3s ease-out infinite" }} />
      </span>
      <span style={{ textAlign: "left", maxWidth: "clamp(70px, 11vw, 150px)", overflow: "hidden" }}>
        <span className="mono domain-orb-label" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, letterSpacing: "0.2em", color: selected ? "#ffffff" : "rgba(223,233,247,.95)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {spec.label}
          {flag && <span style={{ fontSize: 11, color: flag === "⚠" ? WARN : "rgba(223,233,247,.5)" }}>{flag}</span>}
        </span>
        <span className="mono" style={{ display: "block", marginTop: 7, fontSize: 12, lineHeight: 1.75, color: "rgba(223,233,247,.72)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {l1}
        </span>
        <span className="mono" style={{ display: "block", fontSize: 12, lineHeight: 1.75, color: spec.l2Tone === "warn" ? WARN : QUIET, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {l2}
        </span>
      </span>
    </button>
  );
}

/** All 7 domain orbs at their reference positions. */
export function DomainOrbits({ data, selectedId, onSelect }: { data: Record<string, DomainDatum>; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <>
      {DOMAIN_SPEC.map((spec) => (
        <DomainOrb key={spec.id} spec={spec} {...data[spec.id]} selected={selectedId === spec.id} dimmed={Boolean(selectedId) && selectedId !== spec.id} onSelect={() => onSelect(spec.id)} />
      ))}
    </>
  );
}
