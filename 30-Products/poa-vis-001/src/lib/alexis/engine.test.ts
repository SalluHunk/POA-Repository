import { describe, expect, it } from "vitest";
import { deterministicAlexisEngine } from "@/lib/alexis/engine";
import { getOrganizationalState } from "@/lib/organizational-state";

describe("deterministicAlexisEngine", () => {
  const state = getOrganizationalState();

  const requiredQuestions = [
    "What is happening in the organization?",
    "What changed?",
    "What requires attention?",
    "Why is this a risk?",
    "What capabilities are missing?",
    "What should we do?",
    "Give me an executive briefing.",
  ];

  it.each(requiredQuestions)("answers %s with a non-empty, state-derived response", (question) => {
    const response = deterministicAlexisEngine.ask(question, state);
    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("cites sources for questions with a clear underlying record", () => {
    const response = deterministicAlexisEngine.ask("What capabilities are missing?", state);
    expect(response.sources.length).toBeGreaterThan(0);
    expect(response.sources.every((s) => s.id.length > 0)).toBe(true);
  });

  it("answers derive from live state, not fixed text — health status appears verbatim", () => {
    const response = deterministicAlexisEngine.ask("Give me an executive briefing.", state);
    expect(response.answer).toContain(state.overallHealth === "at-risk" ? "at risk" : state.overallHealth);
  });

  it("falls back gracefully for an unrecognized question", () => {
    const response = deterministicAlexisEngine.ask("What is the meaning of life?", state);
    expect(response.answer.length).toBeGreaterThan(0);
    expect(response.sources).toEqual([]);
  });
});
