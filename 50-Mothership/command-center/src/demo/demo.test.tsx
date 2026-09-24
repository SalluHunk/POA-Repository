/**
 * DEMO-LAYER HARNESS - POA-DEC-MOTHERSHIP-002.
 *
 * NOT A PRODUCT CONTRACT. These tests pin the quarantined Layer-B demo
 * layer's own behavior (fictional canned content ported from
 * POA Command.dc.html) so that it keeps working as a design reference and
 * keeps carrying its disclosure. Passing here authorizes nothing: natural-
 * language conversation remains VISION and listening mode remains not built
 * (POA-BLD-MOTHERSHIP-001-COMPLETION-REPORT.md). The product contract is in
 * src/test/smoke.test.tsx, which asserts the demo layer is OFF by default.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../App";

const ORG = "org-paravyoma";

beforeEach(() => {
  vi.stubEnv("MODE", "demo");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const json = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as Response;
      if (url.includes(`/api/organizations/${ORG}/missions`)) return json({ organizationId: ORG, missions: [] });
      if (url.includes(`/api/organizations/${ORG}/capabilities`)) return json({ organizationId: ORG, principals: [], decisions: [] });
      return { ok: false, status: 404, json: async () => ({ ok: false, code: "NOT_FOUND" }) } as Response;
    }),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Demo layer (quarantined, fictional) — POA-DEC-MOTHERSHIP-002", () => {
  it("in demo mode, free text reaches the canned demo answer, which carries the disclosure", async () => {
    render(<App />);
    await screen.findByPlaceholderText(/Ask POA anything/i);
    fireEvent.change(screen.getByPlaceholderText(/Ask POA anything/i), { target: { value: "Prepare my morning brief" } });
    fireEvent.submit(screen.getByPlaceholderText(/Ask POA anything/i).closest("form")!);
    await waitFor(() => expect(screen.getByText(/REASONING OVER ORGANIZATIONAL CONTEXT/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Nothing else needs you before your eleven o'clock/i)).toBeInTheDocument(), { timeout: 2000 });
    // Global mode disclosure + the answer surface's own disclosure.
    expect(screen.getAllByText(/DEMO · FICTIONAL REFERENCE CONTENT/).length).toBeGreaterThanOrEqual(2);
  });
});
