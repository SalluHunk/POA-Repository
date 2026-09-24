/**
 * POA-MOTHERSHIP-PROJECT-SURFACE-001. The registry fixture mirrors the real
 * GET /api/repository/project-registry shape (server/repository-records.ts
 * parseProjectRegistry): entries of verbatim field/value pairs and a
 * separate, unattributed addenda list, each with a Repository Reference.
 * Field text is excerpted verbatim from POA-PJR-001; the commit SHA is
 * synthetic.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { App } from "../App";
import projectFocusSource from "../components/ProjectFocus.tsx?raw";
import stateSource from "../state/useCommandCenter.ts?raw";
import clientSource from "../api/client.ts?raw";
import typesSource from "../api/types.ts?raw";

const ORG = "org-paravyoma";
const PATH = "20-Shared/PJR/POA-PJR-001-PARAVYOMA-PROJECT-REGISTRY.md";
const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const ref = (heading: string) => ({ path: PATH, commit: COMMIT, heading });

const registry = {
  entries: [
    {
      fields: [
        { field: "Project identity", value: "**IEP Website** — Industrial Energy Pioneers' commercial website" },
        { field: "Lifecycle state", value: "Post-launch, release-hardening / remediation phase." },
        { field: "Execution state", value: "**Live, in production** at `https://iep.technology`." },
      ],
      repositoryReference: ref("Entry 1 — IEP Website"),
    },
    {
      fields: [
        { field: "Project identity", value: "**PDF Compressor** — user-identified name; the repository and product self-identify as **SHARP**" },
        { field: "Lifecycle state", value: "Active implementation with a field-validated release milestone." },
      ],
      repositoryReference: ref('Entry 2 — PDF Compressor ("SHARP")'),
    },
    {
      fields: [
        { field: "Project identity", value: "**Temple SaaS** — name as given in this mission's authorization. **Naming is not fully resolved by evidence**" },
        { field: "Lifecycle state", value: "This claim is **SELF-DECLARED, UNVERIFIED** by this mission" },
        { field: "Execution state", value: "**DEVELOPMENT NOT STARTED**" },
      ],
      repositoryReference: ref("Entry 3 — Temple SaaS"),
    },
  ],
  addenda: [
    {
      body: '**This section is NOT a rewrite of any text above.** "Temple SaaS is the canonical project/product initiative being materialized under POA."',
      repositoryReference: ref("Addendum (2026-08-25, Session 2) — Chief Architect Naming Resolution"),
    },
    {
      body: "| Temple Growth Platform (TGP) | Historical/working name ... Not a separate product or competing initiative. |",
      repositoryReference: ref("Addendum (2026-08-25, `TSAAS-DEC-001`) — TGP Naming Evolution Resolved"),
    },
  ],
};

const missions = [{ id: "mission-demo-001", organizationId: ORG, state: "Closed", origin: "fixture" }];
const principals = [{ id: "agent-materializer", organizationId: ORG, role: "execution-agent", active: true, engine: "claude", capabilities: ["mission:execute"] }];

type RegistryResponse = { status: number; body: unknown };

function mockFetch(registryResponse: RegistryResponse = { status: 200, body: registry }) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as Response;
    if (url === "/api/repository/project-registry") return json(registryResponse.body, registryResponse.status);
    if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions });
    if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals, decisions: [] });
    const detailMatch = url.match(/\/api\/missions\/([^/?]+)\?/);
    if (detailMatch) {
      return json({
        mission: { missionId: detailMatch[1], organizationId: ORG, state: "Closed", evidenceCount: 0, headHash: null, chainVerified: true, witnessVerified: false },
        witnessCode: "NO_CHECKPOINT",
        origin: "fixture",
      });
    }
    return json({ ok: false, code: "NOT_FOUND" }, 404);
  });
}

async function openProjects() {
  render(<App />);
  fireEvent.click(await screen.findByLabelText(/Open command overlay/i));
  fireEvent.click(await screen.findByText("Projects — repository registry"));
}

let fetchMock: ReturnType<typeof mockFetch>;
beforeEach(() => {
  fetchMock = mockFetch();
  vi.stubGlobal("fetch", fetchMock);
});

describe("Project Surface — POA-PJR-001", () => {
  it("does not read the registry until the Project subject is focused (independent of Presence)", async () => {
    render(<App />);
    await screen.findByText(/organization is stable/i);
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("/repository/"))).toBe(false);
  });

  it("navigates Presence → Projects → Presence and loads the registry read-only", async () => {
    await openProjects();
    expect(await screen.findByText("Entry 1 — IEP Website")).toBeInTheDocument();
    expect(screen.getByText("Paravyoma Project Registry")).toBeInTheDocument();
    expect(screen.getByText(/3 entries · 2 addenda/)).toBeInTheDocument();

    const registryCalls = fetchMock.mock.calls.filter(([u]) => String(u) === "/api/repository/project-registry");
    expect(registryCalls).toHaveLength(1);
    // GET only - no init object, so no method/body: nothing is written.
    expect(registryCalls[0]).toHaveLength(1);

    fireEvent.click(screen.getByText("← Return to Presence"));
    await waitFor(() => expect(screen.queryByText("Paravyoma Project Registry")).not.toBeInTheDocument());
    expect(screen.getByText(/organization is stable/i)).toBeInTheDocument();
  });

  it("renders every entry's fields verbatim, with PJR-001 field names and confidence markers unchanged", async () => {
    await openProjects();
    await screen.findByText("Entry 3 — Temple SaaS");
    expect(screen.getAllByText("Lifecycle state")).toHaveLength(3);
    expect(screen.getAllByText("Execution state")).toHaveLength(2);
    // Markdown is not interpreted and markers are not extracted/aggregated.
    expect(screen.getByText("This claim is **SELF-DECLARED, UNVERIFIED** by this mission")).toBeInTheDocument();
    expect(screen.getByText("**Live, in production** at `https://iep.technology`.")).toBeInTheDocument();
  });

  it("shows the full Repository Reference on every entry and every addendum", async () => {
    await openProjects();
    await screen.findByText("Entry 1 — IEP Website");
    const blocks = document.querySelectorAll("[data-repository-block]");
    expect(blocks).toHaveLength(registry.entries.length + registry.addenda.length);
    const expected = [...registry.entries, ...registry.addenda].map((r) => r.repositoryReference.heading);
    blocks.forEach((block, i) => {
      const refLine = within(block as HTMLElement).getByTestId("repository-reference");
      expect(refLine).toHaveTextContent(PATH);
      expect(refLine).toHaveTextContent(COMMIT);
      expect(refLine).toHaveTextContent(expected[i]);
    });
  });

  it("renders addenda verbatim, after the entries, in registry order, without attributing them to an entry", async () => {
    await openProjects();
    await screen.findByText("Entry 1 — IEP Website");
    const kinds = [...document.querySelectorAll("[data-repository-block]")].map((b) => b.getAttribute("data-repository-block"));
    expect(kinds).toEqual(["entry", "entry", "entry", "addendum", "addendum"]);
    const addenda = document.querySelectorAll('[data-repository-block="addendum"]');
    expect(addenda[0]).toHaveTextContent("Chief Architect Naming Resolution");
    expect(addenda[1]).toHaveTextContent("TGP Naming Evolution Resolved");
    expect(screen.getByText(registry.addenda[1].body)).toBeInTheDocument();
    // Entry blocks contain no addendum text: no merge into Entry 3.
    const entry3 = document.querySelectorAll('[data-repository-block="entry"]')[2];
    expect(entry3).not.toHaveTextContent("Chief Architect Naming Resolution");
  });

  it("keeps Temple SaaS repository-backed and never shows the demo narrative's Temple Growth", async () => {
    await openProjects();
    await screen.findByText("Entry 3 — Temple SaaS");
    // Distinctive strings from src/demo/presenceData.ts's fictional narrative.
    expect(screen.queryByText(/Temple Growth is holding nine weeks ahead of plan/)).not.toBeInTheDocument();
    expect(screen.queryByText(/91 · HOLDING/)).not.toBeInTheDocument();
    expect(screen.queryByText(/velocity deviation/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DEMO · FICTIONAL/)).not.toBeInTheDocument();

    // Every "Temple" on screen sits inside a block carrying its Repository Reference.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let templeNodes = 0;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent?.includes("Temple")) continue;
      templeNodes++;
      const block = n.parentElement!.closest("[data-repository-block]");
      expect(block, `unreferenced "Temple" text: ${n.textContent}`).not.toBeNull();
      expect(within(block as HTMLElement).getByTestId("repository-reference")).toHaveTextContent(COMMIT);
    }
    expect(templeNodes).toBeGreaterThan(0);
  });

  it("keeps the Project data path structurally separate from the demo layer", () => {
    for (const src of [projectFocusSource, stateSource, clientSource, typesSource]) {
      expect(src).not.toMatch(/from\s+["'][^"']*\/demo\//);
      expect(src).not.toMatch(/presenceData/);
    }
  });

  it("shows no mission relationship and no write/action affordance", async () => {
    await openProjects();
    await screen.findByText("Entry 1 — IEP Website");
    const surface = screen.getByText("Paravyoma Project Registry").closest(".depth-contextual") as HTMLElement;
    expect(surface).not.toHaveTextContent("mission-demo-001");
    const buttons = within(surface).getAllByRole("button").map((b) => b.textContent);
    expect(buttons).toEqual(["Presence", "← Return to Presence"]);
  });

  it("reports REPOSITORY_RECORDS_UNAVAILABLE honestly without affecting Presence", async () => {
    fetchMock = mockFetch({ status: 503, body: { ok: false, code: "REPOSITORY_RECORDS_UNAVAILABLE", detail: "git show failed" } });
    vi.stubGlobal("fetch", fetchMock);
    await openProjects();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Project Registry unavailable — REPOSITORY_RECORDS_UNAVAILABLE");
    expect(alert).toHaveTextContent("git show failed");
    expect(document.querySelectorAll("[data-repository-block]")).toHaveLength(0);

    fireEvent.click(screen.getByText("← Return to Presence"));
    expect(await screen.findByText(/organization is stable/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Focus mission mission-demo-001/i)).toBeInTheDocument();
  });

  it("states an empty registry plainly rather than inventing content", async () => {
    fetchMock = mockFetch({ status: 200, body: { entries: [], addenda: [] } });
    vi.stubGlobal("fetch", fetchMock);
    await openProjects();
    expect(await screen.findByText("No entries in the committed registry.")).toBeInTheDocument();
    expect(screen.getByText(/0 entries · 0 addenda/)).toBeInTheDocument();
  });
});

describe("Project Surface — demo mode (POA-DEC-MOTHERSHIP-002 layer enabled)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("never co-renders the fictional listening narrative with the repository-backed registry", async () => {
    vi.stubEnv("MODE", "demo");
    render(<App />);
    fireEvent.click(await screen.findByLabelText(/Start listening/i));
    expect(screen.getByText(/Do we fund Temple Growth before 15 Oct\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Open command overlay/i));
    fireEvent.click(await screen.findByText("Projects — repository registry"));
    await screen.findByText("Entry 3 — Temple SaaS");

    expect(screen.queryByText(/Do we fund Temple Growth before 15 Oct\?/)).not.toBeInTheDocument();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent?.includes("Temple")) continue;
      expect(n.parentElement!.closest("[data-repository-block]"), `unreferenced "Temple" text: ${n.textContent}`).not.toBeNull();
    }
  });
});
