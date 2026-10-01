/**
 * Executive Panel interaction integration - POA-ORG-KNOW-EXEC-INTERACTION-001,
 * Phase 2. Exercises typed input -> deterministic interpretation -> cited
 * transcript, over fetch mocked with the real API shapes (as smoke.test.tsx).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within, renderHook, act } from "@testing-library/react";
import { App } from "../App";
import { useInteraction } from "../state/useInteraction";
import type { InteractionSnapshot } from "../interaction";

const ORG = "org-paravyoma";

const missions = [
  { id: "mission-demo-001", organizationId: ORG, state: "Closed", origin: "fixture" },
  { id: "mission-demo-002", organizationId: ORG, state: "Created", origin: "fixture" },
  { id: "mission-demo-003", organizationId: ORG, state: "Running", origin: "fixture" },
];
const principals = [
  { id: "agent-materializer", organizationId: ORG, role: "execution-agent", active: true, engine: "claude", capabilities: ["mission:execute"] },
  { id: "agent-unprivileged", organizationId: ORG, role: "execution-agent", active: true, engine: "claude", capabilities: [] },
];
const decisions = [
  { missionId: "mission-demo-001", producerId: "agent-materializer", capability: "mission:execute", reason: "AUTHORIZED", granted: true },
  { missionId: "mission-demo-003", producerId: "agent-unprivileged", capability: "mission:execute", reason: "CAPABILITY_NOT_GRANTED", granted: false },
];
function detailFor(id: string) {
  const mission = missions.find((m) => m.id === id)!;
  return {
    mission: { missionId: id, organizationId: ORG, state: mission.state, evidenceCount: 1, headHash: `hash-${id}`, chainVerified: true, witnessVerified: id === "mission-demo-001" },
    witnessCode: id === "mission-demo-001" ? "MATCH" : "NO_CHECKPOINT",
    origin: "fixture",
  };
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const json = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 404, json: async () => body }) as Response;
    if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions });
    if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals, decisions });
    const evidenceMatch = url.match(/\/api\/missions\/([^/]+)\/evidence/);
    if (evidenceMatch) return json({ missionId: evidenceMatch[1], evidence: [] });
    const detailMatch = url.match(/\/api\/missions\/([^/?]+)\?/);
    if (detailMatch) return json(detailFor(detailMatch[1]));
    return json({ ok: false, code: "NOT_FOUND" }, false);
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.restoreAllMocks());

const ASK = /Jump to a mission or principal by ID/i;

async function ready() {
  render(<App />);
  await screen.findByText("2 things require attention.");
  return screen.getByPlaceholderText(ASK);
}
function ask(input: HTMLElement, text: string) {
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest("form")!);
}

describe("Executive Panel interaction — typed input to cited transcript", () => {
  it("answers 'what needs attention' from real loaded state and cites each mission", async () => {
    const input = await ready();
    ask(input, "What needs attention?");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(within(log).getByText("What needs attention?")).toBeInTheDocument(); // user turn
    expect(within(log).getByText(/mission-demo-003: Denied; mission-demo-002: Unverified/)).toBeInTheDocument(); // system turn
    const sources = within(log).getByLabelText("Sources");
    expect(within(sources).getByText(/Mission mission-demo-003/)).toBeInTheDocument();
    expect(within(sources).getByText(/Mission mission-demo-002/)).toBeInTheDocument();
  });

  it("is honest when it does not recognize the input: no citation, no fabricated answer", async () => {
    const input = await ready();
    ask(input, "blorp zindle");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(within(log).getByText("NOT RECOGNIZED")).toBeInTheDocument();
    expect(within(log).queryByLabelText("Sources")).not.toBeInTheDocument();
  });

  it("states it does not take actions, and does not execute one", async () => {
    const input = await ready();
    ask(input, "approve mission-demo-002");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(within(log).getByText(/do not take or confirm actions/i)).toBeInTheDocument();
    expect(within(log).getByText("NOT SUPPORTED")).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([u]) => /transition|checkpoint|authorize/i.test(String(u)))).toBe(false);
    expect(screen.getByText("Your organization is stable.")).toBeInTheDocument(); // still on Presence
  });

  it("keeps history for the session and accumulates turns", async () => {
    const input = await ready();
    ask(input, "help");
    ask(screen.getByPlaceholderText(ASK), "evidence status");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    await waitFor(() => expect(within(log).getAllByRole("article")).toHaveLength(2));
    expect(within(log).getByText(/Evidence status across 3 loaded missions: 1 witness-verified, 2 with no checkpoint/)).toBeInTheDocument();
  });

  it("clears the input after submitting and bounds its length", async () => {
    const input = (await ready()) as HTMLInputElement;
    expect(input.maxLength).toBe(280);
    ask(input, "help");
    await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(input.value).toBe("");
  });
});

describe("Executive Panel interaction — existing behaviour preserved", () => {
  it("a typed real ID still uses the existing lookup (Focus), never the interaction layer", async () => {
    const input = await ready();
    ask(input, "mission-demo-002");
    await waitFor(() => expect(screen.getByText(/Mark Running/i)).toBeInTheDocument());
    expect(screen.queryByRole("log", { name: /Interaction transcript/i })).not.toBeInTheDocument();
  });

  it("navigation suggestions are inert until clicked, then use the existing focus action", async () => {
    const input = await ready();
    ask(input, "open mission mission-demo-002");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    const suggestion = within(log).getByRole("button", { name: "Open mission-demo-002" });
    // Offered, but nothing has navigated.
    expect(screen.queryByText(/Mark Running/i)).not.toBeInTheDocument();
    expect(screen.getByText("Your organization is stable.")).toBeInTheDocument();
    fireEvent.click(suggestion);
    await waitFor(() => expect(screen.getByText(/Mark Running/i)).toBeInTheDocument());
  });

  it("People suggestion opens the existing People surface only on click", async () => {
    const input = await ready();
    ask(input, "show people");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(screen.queryByText(/principals in this organization/)).not.toBeInTheDocument();
    fireEvent.click(within(log).getByRole("button", { name: "Open People" }));
    expect(await screen.findByText(/2 principals in this organization/)).toBeInTheDocument();
  });

  it("the microphone stays inert and no listening is introduced", async () => {
    await ready();
    expect(screen.getByLabelText(/Listening not available/i)).toBeDisabled();
  });
});

describe("Executive Panel interaction — accessibility", () => {
  it("announces each response through a persistent polite status region", async () => {
    const input = await ready();
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("");
    ask(input, "mission risks");
    await waitFor(() => expect(status).toHaveTextContent(/1 mission carries a failed, denied or integrity-compromised condition/));
    expect(status).toHaveTextContent(/Sources: Mission mission-demo-003/);
  });

  it("exposes the transcript as a labelled, keyboard-focusable log, and suggestions as real buttons", async () => {
    const input = await ready();
    expect(input.closest("form")!.querySelector('button[type="submit"]')).toHaveAttribute("aria-label", "Go");
    expect(input).toHaveAttribute("aria-label");
    ask(input, "what needs attention");
    const log = await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(log).toHaveAttribute("tabindex", "0");
    expect(log).toHaveAttribute("aria-live", "off"); // announced once, by the status region
    const button = within(log).getAllByRole("button")[0];
    expect(button.tagName).toBe("BUTTON");
    button.focus();
    expect(button).toHaveFocus();
  });
});

describe("Executive Panel interaction — no network, no persistence", () => {
  it("makes no network request and writes no storage when interacting", async () => {
    const input = await ready();
    const before = fetchMock.mock.calls.length;
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    ask(input, "what needs attention");
    ask(screen.getByPlaceholderText(ASK), "evidence");
    await screen.findByRole("log", { name: /Interaction transcript/i });
    expect(fetchMock.mock.calls.length).toBe(before);
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("useInteraction — state", () => {
  const snapshot: InteractionSnapshot = { loading: false, missions: [], principals: [], decisions: [], missionDetails: new Map(), attention: [] };

  it("records a typed turn with id, source and response, and ignores blank input", () => {
    const { result } = renderHook(() => useInteraction(snapshot));
    act(() => result.current.submit("   "));
    expect(result.current.turns).toHaveLength(0);
    act(() => result.current.submit("help"));
    expect(result.current.turns).toHaveLength(1);
    expect(result.current.turns[0]).toMatchObject({ id: 1, source: "typed", input: "help" });
    expect(result.current.error).toBeNull();
  });

  it("reports an interpreter failure honestly: error set, no turn and no success recorded", () => {
    const throwing = { interpret: () => { throw new Error("boom"); } };
    const { result } = renderHook(() => useInteraction(snapshot, throwing));
    act(() => result.current.submit("help"));
    expect(result.current.turns).toHaveLength(0);
    expect(result.current.error).toMatch(/no answer was produced/i);
  });

  it("clear() empties history and error", () => {
    const { result } = renderHook(() => useInteraction(snapshot));
    act(() => result.current.submit("help"));
    act(() => result.current.clear());
    expect(result.current.turns).toHaveLength(0);
  });
});
