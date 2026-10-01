/**
 * P0 voice shell UI - POA-ORG-KNOW-EXEC-INTERACTION-001, Phase 3. Browser
 * speech APIs are mocked. Proves: speech starts only on a user gesture; honest
 * unsupported / blocked / error states; the text interaction path is
 * unaffected by voice failure; and recognition/capture stay absent.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import { App } from "../App";

const ORG = "org-paravyoma";
const missions = [
  { id: "mission-demo-001", organizationId: ORG, state: "Closed", origin: "fixture" },
  { id: "mission-demo-002", organizationId: ORG, state: "Created", origin: "fixture" },
  { id: "mission-demo-003", organizationId: ORG, state: "Running", origin: "fixture" },
];
const principals = [{ id: "agent-materializer", organizationId: ORG, role: "execution-agent", active: true, engine: "claude", capabilities: ["mission:execute"] }];
const decisions = [{ missionId: "mission-demo-003", producerId: "agent-materializer", capability: "mission:execute", reason: "CAPABILITY_NOT_GRANTED", granted: false }];
const detailFor = (id: string) => ({
  mission: { missionId: id, organizationId: ORG, state: "Running", evidenceCount: 1, headHash: "h", chainVerified: true, witnessVerified: true },
  witnessCode: "MATCH",
  origin: "fixture",
});

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const json = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as Response;
    if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions });
    if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals, decisions });
    const m = url.match(/\/api\/missions\/([^/?]+)\?/);
    return json(m ? detailFor(m[1]) : {});
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

type Utter = { text: string; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null };

function installSynth(onSpeak?: (u: Utter) => void) {
  const spoken: Utter[] = [];
  const speak = vi.fn((u: Utter) => {
    spoken.push(u);
    onSpeak?.(u);
  });
  const cancel = vi.fn();
  vi.stubGlobal("speechSynthesis", { speak, cancel });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      onend: Utter["onend"] = null;
      onerror: Utter["onerror"] = null;
      constructor(public text: string) {}
    },
  );
  return { speak, cancel, spoken };
}

// Fixture: mission-demo-003 has a denied decision -> exactly 1 attention item.
async function ready() {
  const view = render(<App />);
  await screen.findByText("1 thing requires attention.");
  return view;
}
const voiceStatus = () => screen.getByRole("status", { name: "Voice status" });
const ASK = /Jump to a mission or principal by ID/i;

describe("voice shell — unsupported browser (no speech synthesis)", () => {
  it("keeps the control focusable, marked aria-disabled, and explains the limit when activated", async () => {
    await ready();
    const button = screen.getByRole("button", { name: "Spoken greeting not supported" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled(); // reachable by keyboard; never a silent dead end
    expect(voiceStatus()).toHaveTextContent("");
    fireEvent.click(button);
    expect(voiceStatus()).toHaveTextContent(/not supported in this browser\. Text interaction is unaffected\./);
  });

  it("leaves typed interaction fully working", async () => {
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Spoken greeting not supported" }));
    const input = screen.getByPlaceholderText(ASK);
    fireEvent.change(input, { target: { value: "what needs attention" } });
    fireEvent.submit(input.closest("form")!);
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(within(log).getByText(/1 thing requires attention/)).toBeInTheDocument();
  });
});

describe("voice shell — supported browser", () => {
  it("never speaks without a user gesture", async () => {
    const synth = installSynth();
    await ready();
    expect(synth.speak).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Speak greeting" })).toHaveAttribute("aria-pressed", "false");
  });

  it("speaks a greeting derived from the loaded snapshot on click, shows it, and returns to idle when finished", async () => {
    const synth = installSynth();
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(synth.spoken[0].text).toBe("Hello. 1 thing requires attention.");
    expect(screen.getByRole("button", { name: "Stop speaking" })).toHaveAttribute("aria-pressed", "true");
    expect(voiceStatus()).toHaveTextContent("Speaking: Hello. 1 thing requires attention.");
    act(() => synth.spoken[0].onend?.());
    await waitFor(() => expect(screen.getByRole("button", { name: "Speak greeting" })).toHaveAttribute("aria-pressed", "false"));
    expect(voiceStatus()).toHaveTextContent("");
  });

  it("stops speaking when activated again", async () => {
    const synth = installSynth();
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    const cancelsBefore = synth.cancel.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "Stop speaking" }));
    expect(synth.cancel.mock.calls.length).toBeGreaterThan(cancelsBefore);
    expect(screen.getByRole("button", { name: "Speak greeting" })).toBeInTheDocument();
    expect(voiceStatus()).toHaveTextContent("");
  });

  it("reports a browser block honestly (not-allowed) and keeps text interaction working", async () => {
    installSynth((u) => u.onerror?.({ error: "not-allowed" }));
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    expect(voiceStatus()).toHaveTextContent(/browser blocked speech output\. Text interaction is unaffected\./);
    const input = screen.getByPlaceholderText(ASK);
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByRole("log", { name: /Interaction transcript/i })).toBeInTheDocument();
  });

  it("reports a synthesis error with its code, never as success", async () => {
    installSynth((u) => u.onerror?.({ error: "synthesis-failed" }));
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    expect(voiceStatus()).toHaveTextContent(/Speech output failed \(synthesis-failed\)\. Text interaction is unaffected\./);
    expect(voiceStatus()).not.toHaveTextContent(/Speaking:/);
  });

  it("treats a thrown speak() as an error state", async () => {
    installSynth(() => {
      throw new Error("no voices");
    });
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    expect(voiceStatus()).toHaveTextContent(/Speech output failed\. Text interaction is unaffected\./);
    expect(screen.getByRole("button", { name: "Speak greeting" })).toHaveAttribute("aria-pressed", "false");
  });

  it("returns quietly to idle when the utterance is canceled or interrupted", async () => {
    installSynth((u) => u.onerror?.({ error: "interrupted" }));
    await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    expect(voiceStatus()).toHaveTextContent("");
  });

  it("cancels speech when the Executive Panel unmounts", async () => {
    const synth = installSynth();
    const view = await ready();
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    const before = synth.cancel.mock.calls.length;
    view.unmount();
    expect(synth.cancel.mock.calls.length).toBeGreaterThan(before);
  });
});

describe("voice shell — keyboard and ARIA", () => {
  it("is a real, focusable button with a stable accessible name and a polite status region", async () => {
    installSynth();
    await ready();
    const button = screen.getByRole("button", { name: "Speak greeting" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button"); // never submits the ask form
    expect(button).not.toHaveAttribute("tabindex", "-1");
    button.focus();
    expect(button).toHaveFocus();
    expect(voiceStatus()).toHaveAttribute("aria-live", "polite");
  });
});

describe("voice shell — listening and capture stay absent", () => {
  it("keeps the microphone control disabled and honest, and never touches the microphone, permissions, recognition, network or storage", async () => {
    const getUserMedia = vi.fn();
    const query = vi.fn();
    const Recognition = vi.fn();
    vi.stubGlobal("navigator", { ...globalThis.navigator, mediaDevices: { getUserMedia }, permissions: { query } });
    vi.stubGlobal("SpeechRecognition", Recognition);
    vi.stubGlobal("webkitSpeechRecognition", Recognition);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const synth = installSynth();
    await ready();
    const fetchesAfterLoad = fetchMock.mock.calls.length;

    const mic = screen.getByLabelText(/Listening not available/i);
    expect(mic).toBeDisabled();
    expect(mic).toHaveAttribute("title", expect.stringMatching(/Listening is not enabled in this release\. No microphone access is requested\. This browser exposes a microphone API; it is not used\./));

    fireEvent.click(mic);
    fireEvent.click(screen.getByRole("button", { name: "Speak greeting" }));
    act(() => synth.spoken[0].onend?.());
    const input = screen.getByPlaceholderText(ASK);
    fireEvent.change(input, { target: { value: "evidence status" } });
    fireEvent.submit(input.closest("form")!);
    await screen.findByRole("log", { name: /Interaction transcript/i });

    expect(getUserMedia).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
    expect(Recognition).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.length).toBe(fetchesAfterLoad);
    expect(setItem).not.toHaveBeenCalled();
    expect(screen.queryByLabelText(/Start listening|Stop listening/i)).not.toBeInTheDocument();
  });

  it("states honestly when the browser exposes no microphone API", async () => {
    vi.stubGlobal("navigator", { ...globalThis.navigator, mediaDevices: undefined });
    await ready();
    expect(screen.getByLabelText(/Listening not available/i)).toHaveAttribute("title", expect.stringMatching(/exposes no microphone API/));
  });
});
