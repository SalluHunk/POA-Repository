/**
 * Process-wide Mothership state for the Control Panel (POA-BLD-002).
 *
 * The runtime itself (src/runtime.ts) has no concept of "where a mission
 * came from" - that is a Control Panel presentation concern, not a runtime
 * concern, so it is tracked here rather than by adding a field to Mission
 * (POA-BLD-002 S7: distinguish REAL RUNTIME DATA from TEST FIXTURE without
 * mutating BLD-001's tested Mission shape).
 */
import { MothershipRuntime } from "@/runtime";

export type MissionOrigin = "fixture" | "operator";

export interface MothershipState {
  runtime: MothershipRuntime;
  missionOrigin: Map<string, MissionOrigin>;
}

export function createMothershipState(): MothershipState {
  return {
    runtime: new MothershipRuntime(),
    missionOrigin: new Map<string, MissionOrigin>(),
  };
}
