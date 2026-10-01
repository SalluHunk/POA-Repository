import type { CSSProperties } from "react";
import type { InteractionTurn, NavigateSuggestion, ResponseStatus } from "../interaction";
import { Chip, buttonStyle } from "./shared";

interface Props {
  turns: InteractionTurn[];
  error: string | null;
  /** Fired only when the user explicitly activates a suggestion. */
  onNavigate: (s: NavigateSuggestion) => void;
}

// Standard visually-hidden pattern for the screen-reader announcer; it
// produces no pixels and introduces no visual value.
const SR_ONLY: CSSProperties = { position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 };

const STATUS_CHIP: Partial<Record<ResponseStatus, { tone: "amber" | "neutral"; label: string }>> = {
  unsupported: { tone: "amber", label: "NOT SUPPORTED" },
  unknown: { tone: "neutral", label: "NOT RECOGNIZED" },
  unavailable: { tone: "amber", label: "NOT YET AVAILABLE" },
};

/**
 * Transcript region of the existing Executive Panel (authorization D5): the
 * same glass panel language as ActivityPanel, anchored above the command bar.
 * Renders nothing until there is something to show, so the resting Presence
 * surface is unchanged. A persistent visually-hidden status region announces
 * each new response (it must exist before its content changes to be
 * announced reliably); the visible log itself is `aria-live="off"` to avoid
 * double announcements.
 */
export function InteractionTranscript({ turns, error, onNavigate }: Props) {
  const last = turns[turns.length - 1];
  const announcement = error ?? (last ? `${last.response.text}${last.response.citations.length ? ` Sources: ${last.response.citations.map((c) => c.label).join("; ")}.` : ""}` : "");
  const visible = turns.length > 0 || Boolean(error);

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY}>
        {announcement}
      </div>
      {visible && (
        <div className="depth-contextual fade-in" style={{ position: "fixed", left: "calc(50% - 320px)", bottom: 172, zIndex: 2, width: 640, borderRadius: "var(--radius-14)", overflow: "hidden", pointerEvents: "auto" }}>
          <div style={{ padding: "15px 18px", borderBottom: "1px solid var(--border)" }}>
            <span className="mono" style={{ fontSize: "var(--fs-10)", letterSpacing: "var(--ls-wide)", color: "var(--text-dim)" }}>
              INTERACTION · THIS SESSION ONLY
            </span>
          </div>
          <div
            role="log"
            aria-live="off"
            aria-label="Interaction transcript"
            tabIndex={0}
            style={{ padding: "6px 18px 14px", overflowY: "auto", maxHeight: 240 }}
          >
            {turns.map((t, i) => {
              const chip = STATUS_CHIP[t.response.status];
              return (
                <article key={t.id} aria-label={`Exchange ${i + 1}`} style={{ padding: "10px 0", borderBottom: i < turns.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="mono" style={{ fontSize: "var(--fs-11)", color: "var(--text-faint)" }}>
                    YOU
                  </div>
                  <div style={{ fontSize: "var(--fs-13-5)", lineHeight: 1.4, color: "var(--text)", wordBreak: "break-word" }}>{t.input}</div>
                  <div className="mono" style={{ marginTop: "var(--space-10)", fontSize: "var(--fs-11)", color: "var(--cyan)" }}>
                    POA
                  </div>
                  {chip && (
                    <div style={{ margin: "var(--space-6) 0" }}>
                      <Chip tone={chip.tone}>{chip.label}</Chip>
                    </div>
                  )}
                  <div style={{ fontSize: "var(--fs-13-5)", lineHeight: 1.4, color: "var(--text)", wordBreak: "break-word" }}>{t.response.text}</div>
                  {t.response.citations.length > 0 && (
                    <ul aria-label="Sources" className="mono" style={{ margin: "var(--space-8) 0 0", padding: 0, listStyle: "none", fontSize: "var(--fs-11)", color: "var(--text-faint)" }}>
                      {t.response.citations.map((c) => (
                        <li key={`${c.kind}:${c.id}`}>Source · {c.label}</li>
                      ))}
                    </ul>
                  )}
                  {t.response.suggestions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", marginTop: "var(--space-10)" }}>
                      {t.response.suggestions.map((s) => (
                        <button key={`${s.kind}:${"id" in s ? s.id : s.label}`} type="button" onClick={() => onNavigate(s)} style={buttonStyle("quiet")}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
            {error && (
              <div role="alert" style={{ padding: "10px 0" }}>
                <Chip tone="red">✕ ERROR</Chip>
                <div style={{ marginTop: "var(--space-6)", fontSize: "var(--fs-13-5)", color: "var(--text)" }}>{error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
