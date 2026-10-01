import { interpret } from "../interaction";
import type { InteractionSnapshot } from "../interaction";

/**
 * P0 voice shell helpers (POA-ORG-KNOW-EXEC-INTERACTION-001, Phase 3).
 *
 * Authorized: browser-provided speech SYNTHESIS only, started by an explicit
 * user gesture. Not authorized and absent here: speech recognition, any
 * microphone capture or permission request, any audio upload, any
 * application-controlled network request. Detection below is by property
 * inspection only - it never calls getUserMedia and never queries permissions.
 */

export interface SpeechOutputEnv {
  synth?: SpeechSynthesis;
  Utterance?: typeof SpeechSynthesisUtterance;
}

/** Reads the browser globals at call time (so tests can stub them). */
export function speechEnv(): SpeechOutputEnv {
  const g = globalThis as { speechSynthesis?: SpeechSynthesis; SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance };
  return { synth: g.speechSynthesis ?? undefined, Utterance: g.SpeechSynthesisUtterance };
}

export function detectSpeechOutput(env: SpeechOutputEnv = speechEnv()): boolean {
  return Boolean(env.synth && typeof env.synth.speak === "function" && typeof env.Utterance === "function");
}

/**
 * Informational only: does this browser expose a microphone API at all? The
 * answer is shown in the (disabled) microphone control's tooltip. The API is
 * never used.
 */
export function detectMicrophoneApi(nav: Navigator | undefined = globalThis.navigator): "present" | "absent" {
  return typeof nav?.mediaDevices?.getUserMedia === "function" ? "present" : "absent";
}

/**
 * The spoken greeting. Generic, or derived from the actually loaded snapshot
 * via the existing deterministic interpreter - never invented, and it claims
 * no capability (no "ask me", no listening).
 */
export function composeGreeting(snapshot: InteractionSnapshot): string {
  if (snapshot.loading) return "Hello. Organizational state is still loading.";
  const attention = interpret("what needs attention", snapshot);
  const firstSentence = attention.status === "answered" ? attention.text.split(/(?<=\.)\s/)[0] : "";
  return firstSentence ? `Hello. ${firstSentence}` : "Hello.";
}
