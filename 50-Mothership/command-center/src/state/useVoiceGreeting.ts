import { useCallback, useEffect, useRef, useState } from "react";
import { composeGreeting, detectSpeechOutput, speechEnv } from "../voice/voiceShell";
import type { InteractionSnapshot } from "../interaction";

export type VoiceKind = "unsupported" | "idle" | "speaking" | "blocked" | "error";

const TEXT_STILL_WORKS = "Text interaction is unaffected.";

/**
 * P0 spoken greeting (POA-ORG-KNOW-EXEC-INTERACTION-001, Phase 3): a thin
 * adapter over browser speech synthesis. Speech starts ONLY from `toggle()`,
 * which the UI calls from a click/keypress (the user gesture). Every failure
 * is surfaced honestly and leaves the text interaction path untouched.
 * In-memory only; no network, no recognition, no microphone.
 */
export function useVoiceGreeting(snapshot: InteractionSnapshot) {
  const [supported] = useState(() => detectSpeechOutput());
  const [kind, setKind] = useState<VoiceKind>(supported ? "idle" : "unsupported");
  const [message, setMessage] = useState<string | null>(null);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const currentRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    const u = currentRef.current;
    currentRef.current = null;
    if (u) {
      u.onend = null;
      u.onerror = null;
      try {
        speechEnv().synth?.cancel();
      } catch {
        /* nothing further to do; state is reset below */
      }
    }
    setKind(supported ? "idle" : "unsupported");
    setMessage(null);
  }, [supported]);

  const toggle = useCallback(() => {
    if (!supported) {
      setMessage(`Spoken greeting is not supported in this browser. ${TEXT_STILL_WORKS}`);
      return;
    }
    if (currentRef.current) {
      stop();
      return;
    }
    const env = speechEnv();
    try {
      env.synth!.cancel();
      const text = composeGreeting(snapshotRef.current);
      const utterance = new env.Utterance!(text);
      utterance.onend = () => {
        if (currentRef.current !== utterance) return;
        currentRef.current = null;
        setKind("idle");
        setMessage(null);
      };
      utterance.onerror = (event) => {
        if (currentRef.current !== utterance) return;
        currentRef.current = null;
        const code = (event as SpeechSynthesisErrorEvent).error;
        if (code === "canceled" || code === "interrupted") {
          setKind("idle");
          setMessage(null);
        } else if (code === "not-allowed") {
          setKind("blocked");
          setMessage(`The browser blocked speech output. ${TEXT_STILL_WORKS}`);
        } else {
          setKind("error");
          setMessage(`Speech output failed${code ? ` (${code})` : ""}. ${TEXT_STILL_WORKS}`);
        }
      };
      currentRef.current = utterance;
      setKind("speaking");
      setMessage(`Speaking: ${text}`);
      env.synth!.speak(utterance);
    } catch {
      currentRef.current = null;
      setKind("error");
      setMessage(`Speech output failed. ${TEXT_STILL_WORKS}`);
    }
  }, [supported, stop]);

  // Never leave speech running after the Executive Panel unmounts.
  useEffect(
    () => () => {
      const u = currentRef.current;
      if (u) {
        u.onend = null;
        u.onerror = null;
        try {
          speechEnv().synth?.cancel();
        } catch {
          /* unmounting; nothing to report */
        }
      }
    },
    [],
  );

  return { kind, message, supported, toggle };
}

export type VoiceGreeting = ReturnType<typeof useVoiceGreeting>;
