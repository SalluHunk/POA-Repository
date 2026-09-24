import { CORE_CENTER } from "./environment/constants";
import type { Mission, Principal } from "../api/types";
import type { AttentionItem } from "../state/attention";

interface Props {
  missions: Mission[];
  principals: Principal[];
  attention: AttentionItem[];
  focusedMissionId: string | null;
  focusedPrincipalId: string | null;
  onFocusMission: (id: string) => void;
  onFocusPrincipal: (id: string) => void;
}

// Deterministic pseudo-random offset per id, so the field is organic
// (not a perfect ring) but stable across re-renders - never Math.random().
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

// Radius bands in stage px (the Stage's canonical 1536x1024 space, not
// viewport units - vmin would resolve against the real viewport and break
// under the Stage's uniform scale-to-fit transform).
function orbitOffset(id: string, index: number, total: number, band: [number, number]) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (hash(id) % 100) / 100;
  const radius = band[0] + (hash(id) % (band[1] - band[0]));
  return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius * 0.68 };
}

/**
 * Individual mission/principal markers orbiting the core - mounted
 * persistently at App.tsx's root, same as Environment, so a focused
 * object stays spatially connected to its origin through Focus/
 * Investigate/Confirm instead of disappearing (ROUND 4 §D/§E/§I).
 * When something is focused, that marker brightens and others recede -
 * this is the concrete mechanism behind "relevant node brightens,
 * unrelated nodes recede."
 */
export function OrbitMarkers({ missions, principals, attention, focusedMissionId, focusedPrincipalId, onFocusMission, onFocusPrincipal }: Props) {
  const hasFocus = Boolean(focusedMissionId || focusedPrincipalId);
  const missionPoints = missions.map((m, i) => ({ mission: m, attn: attention.find((a) => a.missionId === m.id), off: orbitOffset(m.id, i, missions.length, [105, 155]) }));
  const principalPoints = principals.map((p, i) => ({ principal: p, off: orbitOffset(p.id, i, principals.length, [165, 215]) }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }}>
      {missionPoints.map(({ mission, attn, off }) => {
        const isFocused = mission.id === focusedMissionId;
        const flagged = Boolean(attn);
        const color = attn?.tier === 1 || attn?.tier === 2 ? "var(--red)" : attn?.tier === 3 ? "var(--grey)" : "var(--green)";
        const baseSize = flagged ? (attn!.tier <= 2 ? 15 : 9) : 6;
        const size = isFocused ? baseSize + 8 : baseSize;
        return (
          <button
            key={mission.id}
            className="orbit-marker"
            onClick={() => onFocusMission(mission.id)}
            aria-label={`Focus mission ${mission.id}${attn ? ` — ${attn.label}` : ""}`}
            title={`${mission.id}${attn ? ` — ${attn.label}` : ""}`}
            style={{
              position: "absolute",
              left: `calc(${CORE_CENTER.left} + ${off.dx}px)`,
              top: `calc(${CORE_CENTER.top} + ${off.dy}px)`,
              transform: "translate(-50%,-50%) scale(var(--marker-scale, 1))",
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              border: isFocused ? "2px solid #fff" : "none",
              cursor: "pointer",
              padding: 0,
              opacity: hasFocus && !isFocused ? 0.22 : 1,
              boxShadow: isFocused ? `0 0 22px ${color}, 0 0 40px ${color}` : `0 0 12px ${color}`,
              animation: flagged && attn!.tier <= 2 && !hasFocus ? "pulse 2.4s ease-in-out infinite" : undefined,
              transition: "opacity 0.4s ease, width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease",
              pointerEvents: "auto",
            }}
          />
        );
      })}

      {principalPoints.map(({ principal, off }) => {
        const isFocused = principal.id === focusedPrincipalId;
        const size = isFocused ? 14 : 8;
        return (
          <button
            key={principal.id}
            className="orbit-marker"
            onClick={() => onFocusPrincipal(principal.id)}
            aria-label={`Focus principal ${principal.id}`}
            title={`${principal.id} — ${principal.role}`}
            style={{
              position: "absolute",
              left: `calc(${CORE_CENTER.left} + ${off.dx}px)`,
              top: `calc(${CORE_CENTER.top} + ${off.dy}px)`,
              transform: "translate(-50%,-50%) rotate(45deg) scale(var(--marker-scale, 1))",
              width: size,
              height: size,
              borderRadius: 2,
              background: principal.active ? "var(--violet)" : "var(--text-faint)",
              border: isFocused ? "2px solid #fff" : "none",
              cursor: "pointer",
              padding: 0,
              opacity: hasFocus && !isFocused ? 0.22 : 1,
              boxShadow: isFocused ? "0 0 22px var(--violet), 0 0 40px var(--violet)" : principal.active ? "0 0 10px var(--violet)" : "none",
              transition: "opacity 0.4s ease, width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease",
              pointerEvents: "auto",
            }}
          />
        );
      })}
    </div>
  );
}
