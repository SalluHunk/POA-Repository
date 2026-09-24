/**
 * Smoke suite per POA-BLD-MOTHERSHIP-001 §19's minimum list. Not a
 * component-test framework - fetch is mocked with shapes matching the
 * real API (server/api.ts) and the real seed data (server/seed.ts), so
 * these tests exercise the client's real request/response contract
 * without needing the actual Node server running.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../App";

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
    mission: { missionId: id, organizationId: ORG, state: mission.state, evidenceCount: id === "mission-demo-001" ? 4 : id === "mission-demo-003" ? 1 : 0, headHash: "abc", chainVerified: true, witnessVerified: id === "mission-demo-001" },
    witnessCode: id === "mission-demo-001" ? "MATCH" : "NO_CHECKPOINT",
    origin: "fixture",
  };
}

const evidenceByMission: Record<string, unknown[]> = {
  "mission-demo-001": [
    { sequence: 0, missionId: "mission-demo-001", organizationId: ORG, producerId: "agent-materializer", authorityBearing: true, payload: { who: "agent-materializer", what: "AUTHORIZATION_DECISION", why: "mission:execute", when: "t", result: "AUTHORIZED", mission: "mission-demo-001", organization: ORG }, payloadHash: "h", prevHash: null, envelopeHash: "e0", signature: "s" },
  ],
  "mission-demo-002": [],
  "mission-demo-003": [
    { sequence: 0, missionId: "mission-demo-003", organizationId: ORG, producerId: "agent-unprivileged", authorityBearing: true, payload: { who: "agent-unprivileged", what: "AUTHORIZATION_DECISION", why: "mission:execute", when: "t", result: "CAPABILITY_NOT_GRANTED", mission: "mission-demo-003", organization: ORG }, payloadHash: "h", prevHash: null, envelopeHash: "e0", signature: "s" },
  ],
};

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const json = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 404, json: async () => body }) as Response;

    if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions });
    if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals, decisions });
    const evidenceMatch = url.match(/\/api\/missions\/([^/]+)\/evidence/);
    if (evidenceMatch) return json({ missionId: evidenceMatch[1], evidence: evidenceByMission[evidenceMatch[1]] ?? [] });
    const detailMatch = url.match(/\/api\/missions\/([^/?]+)\?/);
    if (detailMatch) return json(detailFor(detailMatch[1]));
    if (url.includes("/transition")) return json({ ok: true, code: "TRANSITIONED" });
    if (url.includes("/checkpoint")) return json({ missionId: "mission-demo-002", headHash: "abc" });
    return json({ ok: false, code: "NOT_FOUND" }, false);
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch());
});

describe("Mothership Command Center — smoke", () => {
  it("loads the application and renders real mission data (Presence)", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/organization is stable/i)).toBeInTheDocument());
    // Real attention derived from real seeded state: mission-demo-002 and
    // -003 are NO_CHECKPOINT/denied; exactly matches the mocked shapes above.
    await waitFor(() => expect(screen.getByText(/things? require attention/i)).toBeInTheDocument());
  });

  it("focuses a mission (Focus) from the Presence field", async () => {
    render(<App />);
    const point = await screen.findByLabelText(/Focus mission mission-demo-002/i);
    fireEvent.click(point);
    await waitFor(() => expect(screen.getAllByText("mission-demo-002").length).toBeGreaterThan(0));
    expect(screen.getByText(/Mark Running/i)).toBeInTheDocument();
  });

  it("investigates a mission's evidence (Drill)", async () => {
    render(<App />);
    const point = await screen.findByLabelText(/Focus mission mission-demo-003/i);
    fireEvent.click(point);
    await screen.findByText(/Investigate/i);
    fireEvent.click(screen.getByText(/Investigate/i));
    await waitFor(() => expect(screen.getByText(/evidence chain/i)).toBeInTheDocument());
    expect(screen.getByText(/Denied — CAPABILITY_NOT_GRANTED/i)).toBeInTheDocument();
  });

  it("focuses a principal via a real ID typed into the ask bar", async () => {
    render(<App />);
    await screen.findByPlaceholderText(/Jump to a mission or principal by ID/i);
    fireEvent.change(screen.getByPlaceholderText(/Jump to a mission or principal by ID/i), { target: { value: "agent-materializer" } });
    fireEvent.submit(screen.getByPlaceholderText(/Jump to a mission or principal by ID/i).closest("form")!);
    await waitFor(() => expect(screen.getAllByText("agent-materializer").length).toBeGreaterThan(0));
    expect(screen.getByText(/GRANTED CAPABILITIES/i)).toBeInTheDocument();
  });

  // Product contract (POA-DEC-MOTHERSHIP-002): by default the Layer-B demo
  // layer is quarantined - free text never yields a fabricated answer, the
  // unbacked domains show the honest NOT CONNECTED placeholder, and the
  // listening affordance is inert. The canned-answer behavior itself is
  // exercised only in src/demo/demo.test.tsx, as demo behavior.
  it("never fabricates an answer, figures, or listening by default (demo layer quarantined)", async () => {
    render(<App />);
    await screen.findByPlaceholderText(/Jump to a mission or principal by ID/i);
    fireEvent.change(screen.getByPlaceholderText(/Jump to a mission or principal by ID/i), { target: { value: "Prepare my morning brief" } });
    fireEvent.submit(screen.getByPlaceholderText(/Jump to a mission or principal by ID/i).closest("form")!);
    await waitFor(() => expect(screen.getByText(/Only mission and principal IDs resolve/i)).toBeInTheDocument());
    expect(screen.queryByText(/REASONING OVER ORGANIZATIONAL CONTEXT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/eleven o'clock/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("NOT CONNECTED")).toHaveLength(3);
    expect(screen.queryByText("1,204 VERIFIED")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Listening not available/i)).toBeDisabled();
    expect(screen.queryByText(/DEMO · FICTIONAL/)).not.toBeInTheDocument();
  });

  it("opens and closes the command overlay", async () => {
    render(<App />);
    fireEvent.click(await screen.findByLabelText(/Open command overlay/i));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/not yet available/i)).toBeInTheDocument(); // Diagnostics, visibly inert
    fireEvent.click(screen.getByRole("dialog"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("completes Act → Verify for a mission with a legal transition", async () => {
    render(<App />);
    const point = await screen.findByLabelText(/Focus mission mission-demo-002/i);
    fireEvent.click(point);
    fireEvent.click(await screen.findByText(/Mark Running/i));
    await screen.findByText(/CONFIRM — CONSEQUENTIAL ACTION/i);
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => expect(screen.getByText(/TRANSITIONED/i)).toBeInTheDocument());
  });
});
