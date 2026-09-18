/**
 * Mission Lifecycle state machine (POA-BLD-001 S9).
 * Terminal states (Closed) and other terminal-adjacent states must not
 * silently accept further transitions - see ALLOWED_TRANSITIONS.
 */
export type MissionState = "Created" | "Running" | "Succeeded" | "Failed" | "Closed";

const ALLOWED_TRANSITIONS: Record<MissionState, MissionState[]> = {
  Created: ["Running"],
  Running: ["Succeeded", "Failed"],
  Succeeded: ["Closed"],
  Failed: ["Closed"],
  Closed: [],
};

export interface Mission {
  id: string;
  organizationId: string;
  state: MissionState;
}

export interface TransitionResult {
  ok: boolean;
  from: MissionState;
  to: MissionState;
  code: "TRANSITIONED" | "INVALID_TRANSITION";
}

export function transition(mission: Mission, to: MissionState): TransitionResult {
  const from = mission.state;
  const allowed = ALLOWED_TRANSITIONS[from].includes(to);
  if (!allowed) {
    return { ok: false, from, to, code: "INVALID_TRANSITION" };
  }
  mission.state = to;
  return { ok: true, from, to, code: "TRANSITIONED" };
}
