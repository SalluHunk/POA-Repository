import type { AuthorizationDecisionRecord, Mission, MissionDetail, Principal } from "../api/types";
import type { AttentionItem } from "../state/attention";

/**
 * Executive Panel interaction contract (POA-ORG-KNOW-EXEC-INTERACTION-001,
 * Phase 1). Pure data types only - nothing here performs I/O.
 */

/** Where an input came from. Only typed text is authorized; recognition is not. */
export type InteractionSource = "typed";

/**
 * The read-only slice of already-loaded runtime state the interpreter may
 * read. Structurally satisfied by `CommandCenterState`; declared separately so
 * the interaction core carries no React/hook dependency.
 */
export interface InteractionSnapshot {
  loading: boolean;
  missions: readonly Mission[];
  principals: readonly Principal[];
  decisions: readonly AuthorizationDecisionRecord[];
  missionDetails: ReadonlyMap<string, MissionDetail>;
  attention: readonly AttentionItem[];
}

export type SupportedIntentKind = "greeting" | "help" | "attention" | "mission-risks" | "evidence-status" | "navigate";

/** Recognizable requests the system deliberately does not perform. */
export type UnsupportedTopic = "action" | "business-function" | "reasoning";

export type Intent =
  | { status: "supported"; kind: SupportedIntentKind }
  | { status: "unsupported"; topic: UnsupportedTopic }
  | { status: "unknown" };

/** A pointer to the real record a factual statement was read from. */
export interface Citation {
  kind: "mission" | "evidence" | "decision" | "principal" | "snapshot";
  id: string;
  label: string;
}

/**
 * A navigation offer to an EXISTING surface. It is inert data: the UI may only
 * invoke an existing focus action when the user explicitly activates it.
 */
export type NavigateSuggestion =
  | { kind: "mission"; id: string; label: string }
  | { kind: "principal"; id: string; label: string }
  | { kind: "people"; label: string }
  | { kind: "project"; label: string };

/**
 * answered    - supported intent, answered from loaded state
 * unavailable - supported intent, but runtime state is not loaded yet
 * unsupported - recognized, deliberately not provided
 * unknown     - not recognized
 */
export type ResponseStatus = "answered" | "unavailable" | "unsupported" | "unknown";

export interface InteractionResponse {
  status: ResponseStatus;
  intent: Intent;
  text: string;
  /** True when `text` states facts read from runtime state. Then `citations` is never empty. */
  evidenceBearing: boolean;
  citations: Citation[];
  suggestions: NavigateSuggestion[];
}

export interface InteractionTurn {
  id: number;
  source: InteractionSource;
  input: string;
  response: InteractionResponse;
}

/** Extension point. The only authorized implementation is deterministic and local. */
export interface Interpreter {
  interpret(text: string, snapshot: InteractionSnapshot): InteractionResponse;
}
