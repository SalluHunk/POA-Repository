/**
 * Alexis interaction contract.
 *
 * Alexis is the conversational/interface intelligence through which
 * organizational state becomes understandable to the user (POA-VIS-001).
 * This vertical slice ships a deterministic AlexisEngine implementation
 * (src/lib/alexis/engine.ts) that answers strictly from application
 * state — no fabricated intelligence. A real LLM-backed engine can
 * implement this same interface later without changing the UI or the
 * organizational logic it reads from.
 */

import type { OrganizationalState } from "@/lib/domain/types";

export interface AlexisSource {
  kind: "project" | "capability" | "risk" | "recommendation" | "event";
  id: string;
  label: string;
}

export interface AlexisResponse {
  answer: string;
  sources: AlexisSource[];
}

export interface AlexisEngine {
  ask(question: string, state: OrganizationalState): AlexisResponse;
}
