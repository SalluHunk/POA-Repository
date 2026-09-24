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
import type { RepositoryRecords } from "./repository-records.ts";

export type MissionOrigin = "fixture" | "operator";

// Kept outside `runtime` and `missionOrigin` on purpose: repository records
// are not missions and never pass through the fixture/operator runtime.
export type RepositoryRecordsSlot = { ok: true; records: RepositoryRecords } | { ok: false; detail: string };

export interface MothershipState {
  runtime: MothershipRuntime;
  missionOrigin: Map<string, MissionOrigin>;
  repositoryRecords: RepositoryRecordsSlot;
}

export function createMothershipState(): MothershipState {
  return {
    runtime: new MothershipRuntime(),
    missionOrigin: new Map<string, MissionOrigin>(),
    repositoryRecords: { ok: false, detail: "NOT_LOADED" },
  };
}
