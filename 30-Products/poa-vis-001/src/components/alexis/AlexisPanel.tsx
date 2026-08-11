"use client";

import { useState } from "react";
import type { OrganizationalState } from "@/lib/domain/types";
import { deterministicAlexisEngine } from "@/lib/alexis/engine";
import type { AlexisResponse } from "@/lib/alexis/types";
import { browserSpeechOutputProvider } from "@/lib/voice/browser-provider";
import { Panel } from "@/components/ui";
import { ConversationView, type ConversationMessage } from "@/components/alexis/ConversationView";
import { VoiceControl } from "@/components/alexis/VoiceControl";

const SUGGESTED_QUESTIONS = [
  "What is happening in the organization?",
  "What changed?",
  "What requires attention?",
  "Why is this a risk?",
  "What should we do?",
  "Give me an executive briefing.",
];

let messageCounter = 0;
function nextId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

/**
 * Alexis interaction surface: text + voice, both driven by the same
 * deterministic engine and the same OrganizationalState prop, so answers
 * are identical regardless of input modality (POA-VIS-001 ALEXIS + VOICE).
 */
export function AlexisPanel({
  state,
  onResponse,
}: {
  state: OrganizationalState;
  /** Optional hook for a consumer (e.g. the Mothership) to visually highlight the organizational area an answer cites (POA-VIS-004 mission section 20). Renders nothing new when omitted — existing callers are unaffected. */
  onResponse?: (response: AlexisResponse) => void;
}) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(false);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const response = deterministicAlexisEngine.ask(trimmed, state);
    setMessages((prev) => [
      ...prev,
      { id: nextId("user"), role: "user", text: trimmed },
      { id: nextId("alexis"), role: "alexis", text: response.answer, sources: response.sources },
    ]);
    setDraft("");

    if (speechEnabled) browserSpeechOutputProvider.speak(response.answer);
    onResponse?.(response);
  }

  return (
    <Panel eyebrow="Alexis" title="Ask about the organization">
      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="rounded-full border border-poa-border px-3 py-1 text-xs text-poa-text-muted transition-colors hover:border-poa-accent hover:text-poa-text"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto rounded-md border border-poa-border bg-poa-panel-raised p-3">
        <ConversationView messages={messages} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Alexis…"
          className="h-9 flex-1 rounded-md border border-poa-border bg-poa-bg px-3 text-sm text-poa-text placeholder:text-poa-text-faint focus:border-poa-accent focus:outline-none"
        />
        <button
          type="submit"
          className="h-9 rounded-md border border-poa-border px-4 text-xs font-medium text-poa-text transition-colors hover:border-poa-accent"
        >
          Send
        </button>
      </form>

      <VoiceControl
        onFinalTranscript={(text) => ask(text)}
        speechEnabled={speechEnabled}
        onToggleSpeech={() => setSpeechEnabled((v) => !v)}
      />
    </Panel>
  );
}
