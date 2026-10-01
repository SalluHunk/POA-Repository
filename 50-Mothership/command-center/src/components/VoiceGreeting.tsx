import type { VoiceGreeting } from "../state/useVoiceGreeting";

/**
 * Spoken-greeting control + status (POA-ORG-KNOW-EXEC-INTERACTION-001, Phase 3).
 * Same circular control language as the command bar's microphone button. This
 * is speech OUTPUT only; it is not listening and is never labelled as such.
 * An unsupported browser keeps the control focusable (aria-disabled, not
 * disabled) so activating it explains the limitation instead of failing
 * silently.
 */
export function VoiceGreetingButton({ voice }: { voice: VoiceGreeting }) {
  const speaking = voice.kind === "speaking";
  const unsupported = voice.kind === "unsupported";
  const label = unsupported ? "Spoken greeting not supported" : speaking ? "Stop speaking" : "Speak greeting";
  return (
    <button
      type="button"
      onClick={voice.toggle}
      aria-label={label}
      aria-pressed={speaking}
      aria-disabled={unsupported || undefined}
      title={unsupported ? "Spoken greeting is not supported in this browser" : speaking ? "Stop the spoken greeting" : "Hear a spoken greeting (speech output only)"}
      className="command-bar-mic"
      style={{
        width: 44,
        height: 44,
        flex: "none",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: speaking ? "rgba(167,139,250,.24)" : "rgba(127,216,255,.12)",
        border: `1px solid ${speaking ? "rgba(167,139,250,.7)" : "rgba(127,216,255,.35)"}`,
        cursor: unsupported ? "default" : "pointer",
        opacity: unsupported ? 0.4 : 1,
      }}
    >
      <svg width="17" height="17" viewBox="0 0 22 22" fill="none" stroke={speaking ? "#cbb6ff" : "#9fe9ff"} strokeWidth={1.5} aria-hidden="true">
        <path d="M3 8.5h3.5L11 5v12l-4.5-3.5H3z" />
        <path d="M14.5 8a4 4 0 0 1 0 6M16.5 5.5a7.5 7.5 0 0 1 0 11" />
      </svg>
    </button>
  );
}

/**
 * Persistent polite status region; visible text appears only for non-idle
 * states. Absolutely positioned just above the command bar so showing or
 * clearing it never moves the bar and never covers the quick prompts below it
 * (the caller's container is `position: fixed`; the transcript leaves room).
 */
export function VoiceStatus({ voice }: { voice: VoiceGreeting }) {
  const failed = voice.kind === "blocked" || voice.kind === "error" || voice.kind === "unsupported";
  return (
    <div role="status" aria-label="Voice status" aria-live="polite" className="mono" style={{ position: "absolute", left: 0, right: 0, bottom: "calc(100% + var(--space-6))", fontSize: "var(--fs-12)", textAlign: "center", color: failed ? "var(--amber)" : "var(--text-dim)", pointerEvents: "none" }}>
      {voice.message}
    </div>
  );
}
