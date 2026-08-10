"use client";

import { useEffect, useState } from "react";
import { browserSpeechInputProvider, browserSpeechOutputProvider } from "@/lib/voice/browser-provider";

/**
 * Voice interaction boundary UI (POA-VIS-001 VOICE). Talks only to the
 * SpeechInputProvider/SpeechOutputProvider interfaces, never directly to
 * the Web Speech API, so a different provider can be swapped in later
 * without touching this component.
 */
export function VoiceControl({
  onFinalTranscript,
  speechEnabled,
  onToggleSpeech,
}: {
  onFinalTranscript: (text: string) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}) {
  const [support, setSupport] = useState({ input: false, output: false });
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { input: supported, output: outputSupported } = support;

  // Feature detection depends on `window`, which is unavailable during SSR,
  // so it can only run after mount — an effect is the correct (not just
  // convenient) tool here, not a substitute for render-time derivation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupport({
      input: browserSpeechInputProvider.isSupported(),
      output: browserSpeechOutputProvider.isSupported(),
    });
  }, []);

  function toggleListening() {
    if (listening) {
      browserSpeechInputProvider.stop();
      setListening(false);
      return;
    }

    setError(null);
    setListening(true);
    browserSpeechInputProvider.start(
      (transcript, isFinal) => {
        if (isFinal) {
          setInterim("");
          setListening(false);
          onFinalTranscript(transcript);
        } else {
          setInterim(transcript);
        }
      },
      (message) => {
        setError(message);
        setListening(false);
      }
    );
  }

  return (
    <div className="flex items-center gap-2 border-t border-poa-border pt-3">
      <button
        type="button"
        onClick={toggleListening}
        disabled={!supported}
        aria-pressed={listening}
        className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 font-mono text-[11px] uppercase tracking-wide transition-colors ${
          listening
            ? "border-poa-accent text-poa-accent"
            : "border-poa-border text-poa-text-muted hover:text-poa-text"
        } disabled:cursor-not-allowed disabled:opacity-40`}
        title={supported ? "Toggle voice input" : "Voice input not supported in this browser"}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${listening ? "bg-poa-accent" : "bg-poa-text-faint"}`} aria-hidden />
        {listening ? "Listening…" : "Voice"}
      </button>

      <button
        type="button"
        onClick={onToggleSpeech}
        disabled={!outputSupported}
        aria-pressed={speechEnabled}
        className={`inline-flex h-8 items-center rounded-md border px-3 font-mono text-[11px] uppercase tracking-wide transition-colors ${
          speechEnabled ? "border-poa-accent text-poa-accent" : "border-poa-border text-poa-text-muted hover:text-poa-text"
        } disabled:cursor-not-allowed disabled:opacity-40`}
        title={outputSupported ? "Toggle spoken responses" : "Speech output not supported in this browser"}
      >
        {speechEnabled ? "Voice reply on" : "Voice reply off"}
      </button>

      {!supported && !outputSupported && (
        <span className="font-mono text-[11px] text-poa-text-faint">Voice not available in this browser</span>
      )}
      {interim && <span className="truncate text-xs text-poa-text-muted">&ldquo;{interim}&rdquo;</span>}
      {error && <span className="text-xs text-poa-at-risk">{error}</span>}
    </div>
  );
}
