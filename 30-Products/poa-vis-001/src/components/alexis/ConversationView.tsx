import type { AlexisSource } from "@/lib/alexis/types";

export interface ConversationMessage {
  id: string;
  role: "user" | "alexis";
  text: string;
  sources?: AlexisSource[];
}

/**
 * USER -> ALEXIS -> ORGANIZATIONAL STATE -> ANALYSIS -> RESPONSE
 * (POA-VIS-001 TEXT). Every Alexis message can show which organizational
 * records it was derived from, so the interaction reads as analysis, not
 * generic chat.
 */
export function ConversationView({ messages }: { messages: ConversationMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-poa-text-faint">
        Ask Alexis about the organization — try &ldquo;give me an executive briefing.&rdquo;
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
              message.role === "user"
                ? "bg-poa-panel-raised text-poa-text"
                : "border border-poa-border bg-poa-bg text-poa-text"
            }`}
          >
            {message.role === "alexis" && (
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-poa-accent">Alexis</p>
            )}
            <p>{message.text}</p>
            {message.sources && message.sources.length > 0 && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-poa-text-faint">
                Source: {message.sources.map((s) => s.label).join(", ")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
