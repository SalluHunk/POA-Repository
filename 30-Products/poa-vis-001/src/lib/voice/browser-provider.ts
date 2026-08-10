/**
 * Browser Web Speech API implementation of the SpeechInputProvider /
 * SpeechOutputProvider boundary (src/lib/voice/types.ts). Feature-detects
 * at call time so it is safe to import from a Server Component tree; all
 * methods are no-ops with isSupported() === false outside a supporting
 * browser (or during SSR, where `window` does not exist).
 */

import type { SpeechInputProvider, SpeechOutputProvider } from "@/lib/voice/types";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

class BrowserSpeechInputProvider implements SpeechInputProvider {
  private recognition: SpeechRecognitionLike | null = null;

  isSupported(): boolean {
    return getSpeechRecognitionCtor() !== null;
  }

  start(onResult: (transcript: string, isFinal: boolean) => void, onError: (message: string) => void): void {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      onError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: unknown) => {
      const results = (event as { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }).results;
      const last = results[results.length - 1];
      if (last) onResult(last[0].transcript, last.isFinal);
    };
    recognition.onerror = (event: unknown) => {
      const error = (event as { error?: string }).error ?? "unknown speech recognition error";
      onError(error);
    };

    this.recognition = recognition;
    recognition.start();
  }

  stop(): void {
    this.recognition?.stop();
    this.recognition = null;
  }
}

class BrowserSpeechOutputProvider implements SpeechOutputProvider {
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  cancel(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
  }
}

export const browserSpeechInputProvider: SpeechInputProvider = new BrowserSpeechInputProvider();
export const browserSpeechOutputProvider: SpeechOutputProvider = new BrowserSpeechOutputProvider();
