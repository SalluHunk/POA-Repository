import { PROMPTS } from "../demo/presenceData";
import { isDemoLayerEnabled } from "../demo/demoLayer";

/**
 * Ask-POA prompt chips, ported from the reference (POA Command.dc.html
 * lines 477-480, `askPrompt`) - each wired to the same `send()` flow as
 * the CommandBar, over the reference's own canned demo scenario
 * (presenceData.ts's `computeAnswer`), not a real reasoning capability.
 *
 * Demo quarantine (POA-DEC-MOTHERSHIP-002): the chips stay visible (layout
 * unchanged) but are inert unless the demo layer is explicitly enabled -
 * every prompt only ever surfaces fictional canned content.
 */
export function QuickPrompts({ onAsk }: { onAsk: (q: string) => void }) {
  const demo = isDemoLayerEnabled();
  return (
    <div style={{ position: "fixed", left: "calc(50% - 460px)", bottom: 52, zIndex: 2, display: "flex", justifyContent: "center", gap: 9, flexWrap: "wrap", width: 920, pointerEvents: "auto" }}>
      {PROMPTS.map((p) => (
        <button
          key={p}
          onClick={demo ? () => onAsk(p) : undefined}
          disabled={!demo}
          title={demo ? undefined : "Not yet available — natural-language questions are not a POA capability"}
          className="quick-prompt"
          style={{ fontSize: 13.5, padding: "10px 17px", borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "rgba(10,18,34,.6)", color: "rgba(223,233,247,.8)", cursor: demo ? "pointer" : "default", opacity: demo ? 1 : 0.45 }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
