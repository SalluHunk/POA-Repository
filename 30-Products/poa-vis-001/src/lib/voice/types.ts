/**
 * Voice interaction boundary for POA-VIS-001.
 *
 * Alexis's voice input/output is defined behind these two interfaces so
 * ElevenLabs, OpenAI, Deepgram, browser APIs, or any other provider can be
 * connected later without changing Alexis or organizational logic. This
 * vertical slice ships one implementation, BrowserSpeechProvider
 * (src/lib/voice/browser-provider.ts), using the Web Speech API where the
 * browser supports it.
 */

export interface SpeechInputProvider {
  isSupported(): boolean;
  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (message: string) => void
  ): void;
  stop(): void;
}

export interface SpeechOutputProvider {
  isSupported(): boolean;
  speak(text: string): void;
  cancel(): void;
}
