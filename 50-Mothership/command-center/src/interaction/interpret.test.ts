import { describe, expect, it } from "vitest";
import { createTurn, interpret, MAX_INPUT_LENGTH } from "./index";
import type { InteractionSnapshot } from "./index";
import type { MissionDetail, MissionState } from "../api/types";

// Synthetic snapshot: real runtime shapes, invented IDs.
function detail(id: string, state: MissionState, witnessCode: MissionDetail["witnessCode"], opts: { chainVerified?: boolean; headHash?: string | null } = {}): MissionDetail {
  return {
    mission: {
      missionId: id,
      organizationId: "org-t",
      state,
      evidenceCount: opts.headHash === null ? 0 : 3,
      headHash: opts.headHash === undefined ? `hash-${id}` : opts.headHash,
      chainVerified: opts.chainVerified ?? true,
      witnessVerified: witnessCode === "MATCH",
    },
    witnessCode,
    origin: "fixture",
  };
}

function snap(overrides: Partial<InteractionSnapshot> = {}): InteractionSnapshot {
  return {
    loading: false,
    missions: [
      { id: "mission-a", organizationId: "org-t", state: "Succeeded" },
      { id: "mission-b", organizationId: "org-t", state: "Failed" },
      { id: "mission-c", organizationId: "org-t", state: "Running" },
      { id: "mission-d", organizationId: "org-t", state: "Created" },
    ],
    principals: [{ id: "agent-one", organizationId: "org-t", role: "executor", active: true, engine: "x" }],
    decisions: [{ missionId: "mission-c", producerId: "agent-one", capability: "cap.write", reason: "no grant", granted: false }],
    missionDetails: new Map([
      ["mission-a", detail("mission-a", "Succeeded", "MATCH")],
      ["mission-b", detail("mission-b", "Failed", "MATCH")],
      ["mission-c", detail("mission-c", "Running", "MATCH")],
      ["mission-d", detail("mission-d", "Created", "NO_CHECKPOINT", { headHash: null })],
    ]),
    attention: [
      { tier: 2, missionId: "mission-b", glyph: "x", label: "Failed" },
      { tier: 2, missionId: "mission-c", glyph: "x", label: "Denied" },
      { tier: 3, missionId: "mission-d", glyph: "o", label: "Unverified" },
    ],
    ...overrides,
  };
}

describe("interpret — classification", () => {
  it("recognizes supported intents", () => {
    expect(interpret("hello", snap()).intent).toEqual({ status: "supported", kind: "greeting" });
    expect(interpret("Help?", snap()).intent).toEqual({ status: "supported", kind: "help" });
    expect(interpret("What needs attention?", snap()).intent).toEqual({ status: "supported", kind: "attention" });
    expect(interpret("which missions are at risk", snap()).intent).toEqual({ status: "supported", kind: "mission-risks" });
    expect(interpret("evidence status", snap()).intent).toEqual({ status: "supported", kind: "evidence-status" });
    expect(interpret("open people", snap()).intent).toEqual({ status: "supported", kind: "navigate" });
  });

  it("separates recognizable-but-unsupported from unknown", () => {
    expect(interpret("approve mission-b", snap())).toMatchObject({ status: "unsupported", intent: { status: "unsupported", topic: "action" } });
    expect(interpret("mark mission-c running", snap())).toMatchObject({ status: "unsupported", intent: { topic: "action" } });
    expect(interpret("what is our revenue", snap())).toMatchObject({ status: "unsupported", intent: { topic: "business-function" } });
    expect(interpret("Prepare my morning brief", snap())).toMatchObject({ status: "unsupported", intent: { topic: "reasoning" } });
    expect(interpret("blorp zindle", snap())).toMatchObject({ status: "unknown", intent: { status: "unknown" } });
  });

  it("never fabricates on unsupported/unknown: no evidence, citations or suggestions", () => {
    for (const q of ["approve mission-b", "what is our revenue", "explain everything", "blorp zindle"]) {
      const r = interpret(q, snap());
      expect(r.evidenceBearing).toBe(false);
      expect(r.citations).toEqual([]);
      expect(r.suggestions).toEqual([]);
    }
  });

  it("states honestly that actions are not performed", () => {
    expect(interpret("approve mission-b", snap()).text).toMatch(/do not take or confirm actions/i);
  });

  it("rejects over-long input without interpreting it", () => {
    const long = "attention ".repeat(40);
    expect(long.length).toBeGreaterThan(MAX_INPUT_LENGTH);
    const r = interpret(long, snap());
    expect(r.status).toBe("unknown");
    expect(r.text).toMatch(/shorter/i);
  });
});

describe("interpret — answers from real snapshot state, with citations", () => {
  it("attention lists attention items, citing each mission", () => {
    const r = interpret("what needs attention", snap());
    expect(r.status).toBe("answered");
    expect(r.text).toMatch(/3 things require attention/);
    expect(r.text).toContain("mission-b: Failed");
    expect(r.citations.map((c) => c.id)).toEqual(["mission-b", "mission-c", "mission-d"]);
    expect(r.suggestions.map((s) => s.kind)).toEqual(["mission", "mission", "mission"]);
  });

  it("attention with nothing flagged cites the snapshot rather than asserting uncited", () => {
    const r = interpret("attention", snap({ attention: [] }));
    expect(r.text).toBe("Nothing requires attention.");
    expect(r.evidenceBearing).toBe(true);
    expect(r.citations[0].kind).toBe("snapshot");
  });

  it("risks include only tier 1-2 and cite the denying decision record", () => {
    const r = interpret("mission risks", snap());
    expect(r.text).toMatch(/2 missions carry/);
    expect(r.text).not.toContain("mission-d");
    expect(r.citations).toContainEqual(expect.objectContaining({ kind: "decision", id: "mission-c/cap.write" }));
    expect(r.citations).toContainEqual(expect.objectContaining({ kind: "mission", id: "mission-b" }));
  });

  it("evidence status counts honestly, keeps NO_CHECKPOINT distinct from a pass, and cites", () => {
    const r = interpret("evidence status", snap());
    expect(r.text).toContain("3 witness-verified");
    expect(r.text).toContain("1 with no checkpoint");
    expect(r.text).toContain("0 witness mismatch");
    // mission-d has no head hash -> falls back to its mission record.
    expect(r.citations).toContainEqual(expect.objectContaining({ kind: "mission", id: "mission-d" }));
    expect(r.citations[0].kind).toBe("snapshot");
  });

  it("evidence status cites the evidence head when one exists, and reports missing detail", () => {
    const s = snap({
      missionDetails: new Map([["mission-a", detail("mission-a", "Succeeded", "MISMATCH", { chainVerified: false })]]),
    });
    const r = interpret("verification", s);
    expect(r.text).toContain("1 witness mismatch");
    expect(r.text).toContain("1 chain verification failed");
    expect(r.text).toContain("3 missions have no loaded detail");
    expect(r.citations).toContainEqual(expect.objectContaining({ kind: "evidence", id: "mission-a#hash-mission-a" }));
  });

  it("reports unavailable while loading instead of inventing an answer", () => {
    const r = interpret("what needs attention", snap({ loading: true }));
    expect(r.status).toBe("unavailable");
    expect(r.evidenceBearing).toBe(false);
    expect(r.citations).toEqual([]);
  });

  it("greeting and help state no organizational facts and need no citation", () => {
    for (const q of ["hello", "help"]) {
      const r = interpret(q, snap({ loading: true }));
      expect(r.status).toBe("answered");
      expect(r.evidenceBearing).toBe(false);
    }
    expect(interpret("help", snap()).text).toMatch(/do not take actions/i);
  });
});

describe("interpret — navigate suggestions are inert offers over real records", () => {
  it("offers People and Projects without invoking anything", () => {
    expect(interpret("show people", snap()).suggestions).toEqual([{ kind: "people", label: "Open People" }]);
    expect(interpret("go to projects", snap()).suggestions).toEqual([{ kind: "project", label: "Open Projects" }]);
  });

  it("resolves a loaded mission or principal by ID (case-insensitive) with canonical ID and a citation", () => {
    const m = interpret("Open mission MISSION-B", snap());
    expect(m.suggestions).toEqual([{ kind: "mission", id: "mission-b", label: "Open mission-b" }]);
    expect(m.citations[0]).toMatchObject({ kind: "mission", id: "mission-b" });
    const p = interpret("show agent-one", snap());
    expect(p.suggestions).toEqual([{ kind: "principal", id: "agent-one", label: "Open agent-one" }]);
  });

  it("does not suggest a target that is not in the loaded state", () => {
    const r = interpret("open mission mission-zzz", snap());
    expect(r.suggestions).toEqual([]);
    expect(r.text).toMatch(/No loaded mission or principal matches/);
    expect(r.citations[0].kind).toBe("snapshot");
  });
});

describe("interpret — contract invariants", () => {
  const QUESTIONS = [
    "hello", "help", "attention", "risks", "evidence", "open people", "open mission mission-a", "open mission nope",
    "approve x", "revenue", "explain", "gibberish", "",
  ];

  it("is deterministic: repeated calls give deep-equal responses", () => {
    for (const q of QUESTIONS) expect(interpret(q, snap())).toEqual(interpret(q, snap()));
  });

  it("does not mutate the snapshot", () => {
    const s = snap();
    const before = JSON.stringify({ ...s, missionDetails: [...s.missionDetails] });
    for (const q of QUESTIONS) interpret(q, s);
    expect(JSON.stringify({ ...s, missionDetails: [...s.missionDetails] })).toBe(before);
  });

  it("evidenceBearing is exactly 'has at least one citation'", () => {
    for (const q of QUESTIONS) {
      for (const loading of [false, true]) {
        const r = interpret(q, snap({ loading }));
        expect(r.evidenceBearing).toBe(r.citations.length > 0);
      }
    }
  });

  it("every state-reading answer is evidence-bearing", () => {
    for (const q of ["attention", "risks", "evidence", "open mission mission-a", "open mission nope"]) {
      const r = interpret(q, snap());
      expect(r.status).toBe("answered");
      expect(r.evidenceBearing).toBe(true);
    }
  });

  it("createTurn is a pure constructor", () => {
    const r = interpret("help", snap());
    expect(createTurn(7, "typed", "help", r)).toEqual({ id: 7, source: "typed", input: "help", response: r });
  });
});
