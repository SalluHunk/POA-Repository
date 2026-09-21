import type { MissionState } from "../api/types";

/**
 * Mirrors 50-Mothership/src/mission.ts's ALLOWED_TRANSITIONS exactly.
 * Used only to decide what to OFFER - the server (mission.ts's own
 * `transition()`) remains the sole authority on what is actually legal,
 * per BLD-003 §F.2's guidance-only client mirroring.
 */
const ALLOWED_TRANSITIONS: Record<MissionState, MissionState[]> = {
  Created: ["Running"],
  Running: ["Succeeded", "Failed"],
  Succeeded: ["Closed"],
  Failed: ["Closed"],
  Closed: [],
};

export function legalTransitions(state: MissionState): MissionState[] {
  return ALLOWED_TRANSITIONS[state];
}
