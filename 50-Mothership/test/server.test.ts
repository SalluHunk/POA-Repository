/**
 * Control Panel HTTP layer tests (POA-BLD-002 S19).
 * Spins up a real node:http server on an ephemeral port and drives it with
 * the platform `fetch` - not just calling handler functions in-process -
 * so this exercises the actual request/response path an operator's
 * browser would use.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import type { Server } from "node:http";
import { createMothershipState, type MothershipState } from "../server/state.ts";
import { seedDemoData } from "../server/seed.ts";
import { createMothershipHttpServer } from "../server/http.ts";
import { __resetWitnessForTests } from "@/witness";

let server: Server;
let baseUrl: string;
let state: MothershipState;

beforeEach(async () => {
  __resetWitnessForTests();
  state = createMothershipState();
  seedDemoData(state);
  server = createMothershipHttpServer(state);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (address && typeof address === "object") baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function get(path: string): Promise<{ status: number; body: any }> {
  const res = await fetch(`${baseUrl}${path}`);
  return { status: res.status, body: await res.json() };
}
async function post(path: string, payload: unknown): Promise<{ status: number; body: any }> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { status: res.status, body: await res.json() };
}

describe("Functional (POA-BLD-002 S19)", () => {
  it("application starts and serves the home page", async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("POA Mothership Control Panel");
  });

  it("serves app.js and styles.css statically", async () => {
    const js = await fetch(`${baseUrl}/app.js`);
    const css = await fetch(`${baseUrl}/styles.css`);
    expect(js.status).toBe(200);
    expect(css.status).toBe(200);
  });

  it("lists real organizations seeded into the runtime", async () => {
    const { body } = await get("/api/organizations");
    const ids = body.organizations.map((o: { id: string }) => o.id);
    expect(ids).toContain("org-paravyoma");
    expect(ids).toContain("org-beta");
  });

  it("lists real missions for an organization, including origin tags", async () => {
    const { body } = await get("/api/organizations/org-paravyoma/missions");
    const byId = Object.fromEntries(body.missions.map((m: { id: string; origin: string }) => [m.id, m.origin]));
    expect(byId["mission-demo-001"]).toBe("fixture");
  });

  it("mission detail reflects real runtime state, including the S20 full-lifecycle mission", async () => {
    const { body } = await get("/api/missions/mission-demo-001?org=org-paravyoma");
    expect(body.mission.state).toBe("Closed");
    expect(body.mission.chainVerified).toBe(true);
    expect(body.mission.witnessVerified).toBe(true);
    expect(body.mission.evidenceCount).toBeGreaterThan(0);
  });

  it("evidence view exposes the real evidence envelopes for a mission", async () => {
    const { body } = await get("/api/missions/mission-demo-001/evidence?org=org-paravyoma");
    expect(Array.isArray(body.evidence)).toBe(true);
    expect(body.evidence.length).toBeGreaterThan(0);
    expect(body.evidence[0]).toHaveProperty("envelopeHash");
  });

  it("capability/authorization view surfaces a real denied decision (S5E)", async () => {
    const { body } = await get("/api/organizations/org-paravyoma/capabilities");
    const denied = body.decisions.find((d: { granted: boolean }) => d.granted === false);
    expect(denied).toBeDefined();
    expect(denied.reason).toBe("CAPABILITY_NOT_GRANTED");
  });

  it("full operator-driven mission lifecycle can be observed through the API (S8, S20)", async () => {
    await post("/api/missions", { missionId: "mission-op-test", organizationId: "org-paravyoma" });
    const toRunning = await post("/api/missions/mission-op-test/transition", {
      organizationId: "org-paravyoma", to: "Running", principalId: "agent-materializer",
    });
    expect(toRunning.status).toBe(200);

    const authorize = await post("/api/missions/mission-op-test/authorize", {
      organizationId: "org-paravyoma", principalId: "agent-materializer", capability: "mission:execute", action: "op-action",
    });
    expect(authorize.body.ok).toBe(true);

    await post("/api/missions/mission-op-test/transition", { organizationId: "org-paravyoma", to: "Succeeded", principalId: "agent-materializer" });
    const checkpoint = await post("/api/missions/mission-op-test/checkpoint", { organizationId: "org-paravyoma" });
    expect(checkpoint.body.headHash).not.toBeNull();

    const verify = await get("/api/missions/mission-op-test/verify?org=org-paravyoma");
    expect(verify.body.chain.ok).toBe(true);
    expect(verify.body.witness.ok).toBe(true);

    const closed = await post("/api/missions/mission-op-test/transition", { organizationId: "org-paravyoma", to: "Closed", principalId: "agent-materializer" });
    expect(closed.body.ok).toBe(true);

    const detail = await get("/api/missions/mission-op-test?org=org-paravyoma");
    expect(detail.body.mission.state).toBe("Closed");
    expect(detail.body.origin).toBe("operator");
  });
});

describe("Security / Integrity (POA-BLD-002 S19)", () => {
  it("denies Organization B reading Organization A's evidence over HTTP", async () => {
    const { status, body } = await get("/api/missions/mission-demo-001/evidence?org=org-beta");
    expect(status).toBe(403);
    expect(body.code).toBe("ISOLATION_VIOLATION");
  });

  it("denies Organization B verifying Organization A's mission integrity (checkpointMission/verifyMission have no org guard in runtime.ts - closed at the API layer)", async () => {
    const { status, body } = await get("/api/missions/mission-demo-001/verify?org=org-beta");
    expect(status).toBe(403);
    expect(body.code).toBe("ISOLATION_VIOLATION");
  });

  it("denies Organization B checkpointing Organization A's mission", async () => {
    const { status, body } = await post("/api/missions/mission-demo-001/checkpoint", { organizationId: "org-beta" });
    expect(status).toBe(403);
    expect(body.code).toBe("ISOLATION_VIOLATION");
  });

  it("denies Organization B creating a mission with an ID Organization A already owns (would otherwise overwrite A's mission and destroy its evidence chain)", async () => {
    const before = await get("/api/missions/mission-demo-001/evidence?org=org-paravyoma");
    const { status, body } = await post("/api/missions", { missionId: "mission-demo-001", organizationId: "org-beta" });
    expect(status).toBe(409);
    expect(body.code).toBe("MISSION_ALREADY_EXISTS");
    const after = await get("/api/missions/mission-demo-001/evidence?org=org-paravyoma");
    expect(after.body.evidence.length).toBe(before.body.evidence.length);
    expect(after.body.evidence.length).toBeGreaterThan(0);
  });

  it("mission detail distinguishes a witness that matched (MATCH) from a mission never checkpointed (NO_CHECKPOINT) - both are witness.ok:true but are not the same claim", async () => {
    const checkpointed = await get("/api/missions/mission-demo-001?org=org-paravyoma");
    expect(checkpointed.body.witnessCode).toBe("MATCH");

    const neverCheckpointed = await get("/api/missions/mission-demo-002?org=org-paravyoma");
    expect(neverCheckpointed.body.witnessCode).toBe("NO_CHECKPOINT");
  });

  it("denies a Beta principal acting on a Paravyoma mission even when directly targeted", async () => {
    const { status, body } = await post("/api/missions/mission-beta-001/authorize", {
      organizationId: "org-paravyoma", principalId: "agent-beta", capability: "mission:execute", action: "cross-org-attempt",
    });
    expect(status).toBe(403);
    expect(body.code).toBe("ISOLATION_VIOLATION");
  });

  it("Organization A can still fully operate on its own mission (isolation is not a blanket denial)", async () => {
    const { status } = await get("/api/missions/mission-demo-001/evidence?org=org-paravyoma");
    expect(status).toBe(200);
  });

  it("unauthorized capability remains denied and does not execute (UI cannot bypass runtime authorization)", async () => {
    const { body } = await post("/api/missions/mission-demo-003/authorize", {
      organizationId: "org-paravyoma", principalId: "agent-unprivileged", capability: "mission:execute", action: "second-attempt",
    });
    expect(body.ok).toBe(false);
    expect(body.code).toBe("AUTHORIZATION_DENIED");
  });

  it("tampered evidence is reported as unverified through the verify API (S19: tampered evidence remains detectable)", async () => {
    // Attack the persisted chain directly via the adversarial-testing-only
    // hook, exactly as adversarial.test.ts does, then confirm the HTTP
    // API - not just the runtime function - reports the failure.
    const chain = state.runtime.__unsafeGetMutableChainForAdversarialTesting("mission-demo-001");
    chain[0].payload.result = "TAMPERED";

    const { body } = await get("/api/missions/mission-demo-001/verify?org=org-paravyoma");
    expect(body.chain.ok).toBe(false);
    expect(body.chain.code).toBe("PAYLOAD_HASH_MISMATCH");
  });

  it("no API response ever contains private key material", async () => {
    const responses = await Promise.all([
      get("/api/organizations"),
      get("/api/organizations/org-paravyoma/principals"),
      get("/api/organizations/org-paravyoma/missions"),
      get("/api/organizations/org-paravyoma/capabilities"),
      get("/api/missions/mission-demo-001?org=org-paravyoma"),
      get("/api/missions/mission-demo-001/evidence?org=org-paravyoma"),
      get("/api/missions/mission-demo-001/verify?org=org-paravyoma"),
    ]);
    for (const { body } of responses) {
      const serialized = JSON.stringify(body);
      expect(serialized).not.toMatch(/privateKey/i);
      expect(serialized).not.toMatch(/PRIVATE KEY/);
      expect(serialized).not.toMatch(/BEGIN (EC |RSA )?PRIVATE/);
    }
  });

  it("secrets are not exposed: principal projection only ever contains the whitelisted fields", async () => {
    const { body } = await get("/api/organizations/org-paravyoma/principals");
    for (const p of body.principals) {
      expect(Object.keys(p).sort()).toEqual(["active", "engine", "id", "organizationId", "role"].sort());
    }
  });
});

describe("Regression (POA-BLD-002 S19, S26)", () => {
  it("does not weaken BLD-001's runtime: direct runtime organization-isolation behavior is unchanged", () => {
    const result = state.runtime.getEvidence("mission-demo-001", "org-beta");
    expect(Array.isArray(result)).toBe(false);
  });
});
