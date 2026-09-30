/**
 * Executive Panel preservation suite - POA-ORG-KNOW-P5-UI-FOUND-001.
 *
 * The Executive Panel (Commander-confirmed) is the CommandCenter / Executive
 * Home + Presence surface and its command bar: a PRESERVED SURFACE. These
 * tests characterize its CURRENT behaviour so that foundation work (tokens,
 * primitives, defect remediation) cannot change it unnoticed. They assert
 * behaviour only - they add no capability. Overlaps with smoke.test.tsx
 * (mic disabled, unresolved-ID message, quarantine) are deliberately not
 * repeated here.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
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
    mission: { missionId: id, organizationId: ORG, state: mission.state, evidenceCount: 0, headHash: "abc", chainVerified: true, witnessVerified: id === "mission-demo-001" },
    witnessCode: id === "mission-demo-001" ? "MATCH" : "NO_CHECKPOINT",
    origin: "fixture",
  };
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const json = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 404, json: async () => body }) as Response;
      if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions });
      if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals, decisions });
      const detailMatch = url.match(/\/api\/missions\/([^/?]+)\?/);
      if (detailMatch) return json(detailFor(detailMatch[1]));
      return json({ ok: false, code: "NOT_FOUND" }, false);
    }),
  );
});

describe("Executive Panel (CommandCenter / Executive Home + Presence) — preserved behaviour", () => {
  it("states the organization's condition and the attention count from real state", async () => {
    render(<App />);
    expect(await screen.findByText("Your organization is stable.")).toBeInTheDocument();
    expect(await screen.findByText("2 things require attention.")).toBeInTheDocument();
  });

  it("shows the four-stat organizational pulse derived from the loaded data", async () => {
    render(<App />);
    await screen.findByText("2 things require attention.");
    for (const label of ["Missions", "People", "Evidence", "Authority"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText("3")).toBeInTheDocument(); // missions
    expect(screen.getByText("2/2")).toBeInTheDocument(); // active people
    expect(screen.getByText("1/2")).toBeInTheDocument(); // evidence verified / unverified
    expect(screen.getByText("1/1")).toBeInTheDocument(); // authority granted / denied
  });

  it("lists the flagged missions under 'Requires your attention' and opens Focus from one", async () => {
    render(<App />);
    await screen.findByText("2 things require attention.");
    expect(await screen.findByText("Denied")).toBeInTheDocument();
    const unverified = screen.getByText("Unverified");
    expect(unverified).toBeInTheDocument();
    fireEvent.click(unverified.closest("button")!);
    await waitFor(() => expect(screen.getAllByText("mission-demo-002").length).toBeGreaterThan(0));
    expect(screen.getByText(/Mark Running/i)).toBeInTheDocument();
  });

  it("shows the authorization activity feed", async () => {
    render(<App />);
    await screen.findByText("2 things require attention.");
    expect(await screen.findByText(/agent-materializer\s*—\s*mission:execute granted/)).toBeInTheDocument();
    expect(screen.getByText(/agent-unprivileged\s*—\s*mission:execute denied/)).toBeInTheDocument();
  });

  it("renders every quick prompt but keeps each one inert outside the demo layer", async () => {
    render(<App />);
    await screen.findByText("2 things require attention.");
    const prompts = ["What needs my attention?", "Show me mission risks", "Why did evidence fail?", "Prepare my morning brief"];
    for (const p of prompts) {
      const chip = screen.getByRole("button", { name: p });
      expect(chip).toBeDisabled();
      expect(chip).toHaveAttribute("title", expect.stringMatching(/not a POA capability/i));
      fireEvent.click(chip);
    }
    expect(screen.queryByText(/REASONING OVER ORGANIZATIONAL CONTEXT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/DEMO · FICTIONAL/)).not.toBeInTheDocument();
  });

  it("ignores an empty or whitespace-only submission in the command bar", async () => {
    render(<App />);
    const input = await screen.findByPlaceholderText(/Jump to a mission or principal by ID/i);
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.queryByText(/Only mission and principal IDs resolve/i)).not.toBeInTheDocument();
    expect(screen.getByText("Your organization is stable.")).toBeInTheDocument();
  });

  it("opens mission Focus from a real mission ID typed into the command bar, then returns to Presence", async () => {
    render(<App />);
    const input = await screen.findByPlaceholderText(/Jump to a mission or principal by ID/i);
    fireEvent.change(input, { target: { value: "mission-demo-002" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => expect(screen.getByText(/Mark Running/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Return to Presence/i));
    await waitFor(() => expect(screen.getByText("Your organization is stable.")).toBeInTheDocument());
  });
});

describe("People focus (from the People domain orb) — preserved behaviour", () => {
  it("lists every principal with its role, capability count and ACTIVE status", async () => {
    render(<App />);
    await screen.findByText("2 things require attention.");
    const peopleOrb = [...document.querySelectorAll(".domain-orb")].find((o) => /people/i.test(o.textContent ?? ""));
    expect(peopleOrb).toBeTruthy();
    fireEvent.click(peopleOrb!);
    expect(await screen.findByText(/2 principals in this organization/)).toBeInTheDocument();
    const materializer = screen.getByText("agent-materializer").closest("button")!;
    expect(within(materializer).getByText(/execution-agent · 1 capability/)).toBeInTheDocument();
    expect(within(materializer).getByText(/ACTIVE/)).toBeInTheDocument();
    const unprivileged = screen.getByText("agent-unprivileged").closest("button")!;
    expect(within(unprivileged).getByText(/execution-agent · 0 capabilities/)).toBeInTheDocument();
  });
});
