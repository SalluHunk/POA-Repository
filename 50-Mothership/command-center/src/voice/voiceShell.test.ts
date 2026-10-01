import { afterEach, describe, expect, it, vi } from "vitest";
import { composeGreeting, detectMicrophoneApi, detectSpeechOutput } from "./voiceShell";
import type { InteractionSnapshot } from "../interaction";

// POA-ORG-KNOW-EXEC-INTERACTION-001 Phase 3: pure voice-shell helpers plus a
// static guard that the voice sources contain no recognition, capture,
// permission, network or storage surface.

const base: InteractionSnapshot = { loading: false, missions: [], principals: [], decisions: [], missionDetails: new Map(), attention: [] };

afterEach(() => vi.unstubAllGlobals());

describe("detection (no permission prompt, no capture)", () => {
  it("detects speech output only when synth.speak and an Utterance constructor both exist", () => {
    class U {}
    expect(detectSpeechOutput({ synth: { speak: () => {} } as unknown as SpeechSynthesis, Utterance: U as unknown as typeof SpeechSynthesisUtterance })).toBe(true);
    expect(detectSpeechOutput({ synth: { speak: () => {} } as unknown as SpeechSynthesis })).toBe(false);
    expect(detectSpeechOutput({ Utterance: U as unknown as typeof SpeechSynthesisUtterance })).toBe(false);
    expect(detectSpeechOutput({})).toBe(false);
  });

  it("detects the microphone API by property inspection and never calls it or queries permissions", () => {
    const getUserMedia = vi.fn();
    const query = vi.fn();
    const nav = { mediaDevices: { getUserMedia }, permissions: { query } } as unknown as Navigator;
    expect(detectMicrophoneApi(nav)).toBe("present");
    expect(detectMicrophoneApi({} as Navigator)).toBe("absent");
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
  });
});

describe("composeGreeting — generic or from the loaded snapshot, never invented", () => {
  it("states loading honestly while state is not loaded", () => {
    expect(composeGreeting({ ...base, loading: true })).toBe("Hello. Organizational state is still loading.");
  });

  it("reports nothing flagged from a loaded, empty attention list", () => {
    expect(composeGreeting(base)).toBe("Hello. Nothing requires attention.");
  });

  it("reports the real attention count only (no mission detail read aloud)", () => {
    const s: InteractionSnapshot = {
      ...base,
      missions: [{ id: "m-a", organizationId: "o", state: "Failed" }],
      attention: [{ tier: 2, missionId: "m-a", glyph: "x", label: "Failed" }],
    };
    expect(composeGreeting(s)).toBe("Hello. 1 thing requires attention.");
  });

  it("claims no capability: no invitation to ask, no listening", () => {
    for (const s of [base, { ...base, loading: true }]) {
      expect(composeGreeting(s)).not.toMatch(/ask me|listen|hear you|say |voice command|help you/i);
    }
  });
});

// Static guard: the voice sources expose no recognition / capture /
// permission / network / storage surface. Comments are stripped first.
const sources = import.meta.glob(["./voiceShell.ts", "../state/useVoiceGreeting.ts", "../components/VoiceGreeting.tsx"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const FORBIDDEN: Array<[string, RegExp]> = [
  ["fetch", /\bfetch\s*\(/],
  ["XMLHttpRequest", /XMLHttpRequest/],
  ["WebSocket", /WebSocket/],
  ["EventSource", /EventSource/],
  ["sendBeacon", /sendBeacon/],
  ["speech recognition", /SpeechRecognition|webkitSpeechRecognition|\.recognition\b/],
  ["getUserMedia call", /getUserMedia\s*\(/],
  ["permissions API", /\bpermissions\b/],
  ["MediaRecorder/AudioContext", /MediaRecorder|AudioContext|createMediaStream/],
  ["storage", /localStorage|sessionStorage|indexedDB/],
  ["api client / demo imports", /\/api\/client|\/demo\//],
];

describe("voice sources — static guard", () => {
  it("scans the three voice source files", () => {
    expect(Object.keys(sources).sort()).toEqual(["../components/VoiceGreeting.tsx", "../state/useVoiceGreeting.ts", "./voiceShell.ts"]);
  });

  for (const [name, pattern] of FORBIDDEN) {
    it(`contains no ${name}`, () => {
      for (const [file, text] of Object.entries(sources)) {
        const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
        expect(code, `${file} must not use ${name}`).not.toMatch(pattern);
      }
    });
  }
});
