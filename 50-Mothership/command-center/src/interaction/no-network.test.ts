import { afterEach, describe, expect, it, vi } from "vitest";
import { interpret } from "./index";
import type { InteractionSnapshot } from "./index";

// No-network guard for the interaction core (POA-ORG-KNOW-EXEC-INTERACTION-001).
// 1) Static: the module sources reference no network/inference/demo/api surface.
// 2) Runtime: with every network primitive trapped, interpretation still works
//    and never touches them.

const sources = import.meta.glob("./{types,interpret,index}.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const FORBIDDEN: Array<[string, RegExp]> = [
  ["fetch", /\bfetch\s*\(/],
  ["XMLHttpRequest", /XMLHttpRequest/],
  ["WebSocket", /WebSocket/],
  ["EventSource", /EventSource/],
  ["sendBeacon", /sendBeacon/],
  ["importScripts/dynamic import", /\bimportScripts\b|\bimport\s*\(/],
  ["speech APIs", /speechSynthesis|SpeechRecognition|webkitSpeech|getUserMedia|mediaDevices/],
  ["timers", /\bsetTimeout\b|\bsetInterval\b/],
  ["randomness/clock", /Math\.random|Date\.now|new Date\(/],
  ["api client import", /from\s+["'][^"']*\/api\/client["']/],
  ["demo layer import", /from\s+["'][^"']*\/demo\//],
  ["react import", /from\s+["']react["']/],
];

const EMPTY: InteractionSnapshot = { loading: false, missions: [], principals: [], decisions: [], missionDetails: new Map(), attention: [] };

afterEach(() => vi.unstubAllGlobals());

describe("interaction core — no network", () => {
  it("scans the three interaction source files", () => {
    expect(Object.keys(sources).sort()).toEqual(["./index.ts", "./interpret.ts", "./types.ts"]);
  });

  for (const [name, pattern] of FORBIDDEN) {
    it(`source contains no ${name}`, () => {
      for (const [file, text] of Object.entries(sources)) {
        // Strip comments so explanatory prose cannot trip or hide a match.
        const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
        expect(code, `${file} must not use ${name}`).not.toMatch(pattern);
      }
    });
  }

  it("interprets every intent with all network primitives trapped", () => {
    const trap = vi.fn(() => {
      throw new Error("network access attempted by interaction core");
    });
    vi.stubGlobal("fetch", trap);
    vi.stubGlobal("XMLHttpRequest", trap);
    vi.stubGlobal("WebSocket", trap);
    vi.stubGlobal("EventSource", trap);
    for (const q of ["hello", "help", "attention", "risks", "evidence", "show people", "approve x", "summarize", "zzz"]) {
      expect(() => interpret(q, EMPTY)).not.toThrow();
    }
    expect(trap).not.toHaveBeenCalled();
  });
});
