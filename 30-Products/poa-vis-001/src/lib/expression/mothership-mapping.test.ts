import { describe, expect, it } from "vitest";
import { getOrganizationalState } from "@/lib/organizational-state";
import { deterministicAlexisEngine } from "@/lib/alexis/engine";
import { mapStateToMothership, resolveEventHighlight, resolveSourceHighlight } from "@/lib/expression/mothership-mapping";
import { mothershipProfile, referenceProfile } from "@/lib/expression/profiles";

describe("mapStateToMothership", () => {
  it("1. consumes OrganizationalState: one project node per organization project, connected to the Projects domain", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    expect(model.projects).toHaveLength(state.organization.projects.length);
    const projectsDomain = model.domains.find((d) => d.key === "projects")!;
    for (const project of model.projects) {
      expect(model.edges).toContainEqual({ fromId: projectsDomain.id, toId: project.id, kind: "domain" });
    }
  });

  it("3. uses the profile's terminology, not a hard-coded string (ExpressionProfile remains the configuration boundary)", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    expect(model.core.label).toBe(mothershipProfile.terminology.organizationalCoreLabel);
    expect(model.signals[0]?.label).toBe(mothershipProfile.terminology.signalLabel);
  });

  it("4. signals map to visual state without changing signal semantics (same severity, one node per signal)", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    expect(model.signals).toHaveLength(state.signals.length);
    const severityById = new Map(state.signals.map((s) => [s.id, s.severity]));
    for (const node of model.signals) {
      expect(node.severity).toBe(severityById.get(node.entityId));
    }
  });

  it("5. risk severity remains sourced from organizational state", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    const riskSignalsInState = state.signals.filter((s) => s.type === "risk");
    const riskNodesInModel = model.signals.filter((s) => s.kind === "risk");
    expect(riskNodesInModel).toHaveLength(riskSignalsInState.length);
    for (const node of riskNodesInModel) {
      const source = state.signals.find((s) => s.id === node.entityId)!;
      expect(node.severity).toBe(source.severity);
    }
  });

  it("6. opportunity state remains sourced from organizational state", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    const opportunitySignalsInState = state.signals.filter((s) => s.type === "opportunity");
    const opportunityNodesInModel = model.signals.filter((s) => s.kind === "opportunity");
    expect(opportunityNodesInModel).toHaveLength(opportunitySignalsInState.length);
    for (const node of opportunityNodesInModel) {
      const source = state.signals.find((s) => s.id === node.entityId)!;
      expect(node.detail).toBe(source.explanation);
    }
  });

  it("7. existing VIS-002 scenario remains functional (8 required / 5 available / 3 short, unchanged)", () => {
    const state = getOrganizationalState();
    const gaps = state.capabilityGapsByProject["proj-enterprise-ai-transformation"] ?? [];
    expect(gaps.length).toBe(8);
    expect(gaps.filter((g) => !g.isGap).length).toBe(5);
    expect(gaps.filter((g) => g.isGap).length).toBe(3);
  });

  it("capability threads connect only projects to capabilities they actually require, with the gap flag sourced from the existing gap computation", () => {
    const state = getOrganizationalState();
    const model = mapStateToMothership(state, mothershipProfile);

    const gapCapability = model.capabilities.find((c) => c.entityId === "cap-llm-integration")!;
    expect(gapCapability.isGap).toBe(true);
    const suppliedCapability = model.capabilities.find((c) => c.entityId === "cap-platform-eng")!;
    expect(suppliedCapability.isGap).toBe(false);
  });

  it("does not mutate the OrganizationalState it was given", () => {
    const state = getOrganizationalState();
    const before = JSON.stringify(state);

    mapStateToMothership(state, mothershipProfile);

    expect(JSON.stringify(state)).toBe(before);
  });

  it("is agnostic to which profile it is called with — same state, any profile, same node counts", () => {
    const state = getOrganizationalState();
    const modelA = mapStateToMothership(state, mothershipProfile);
    const modelB = mapStateToMothership(state, referenceProfile);

    expect(modelA.projects.length).toBe(modelB.projects.length);
    expect(modelA.signals.length).toBe(modelB.signals.length);
  });
});

describe("resolveEventHighlight", () => {
  it("10. an existing organizational event resolves to the graph nodes it actually touches (event/state transition produces the intended visual response)", () => {
    const state = getOrganizationalState();
    const gapEvent = state.organization.events.find((e) => e.id === "event-capability-gap-detected")!;

    const highlight = resolveEventHighlight(gapEvent, state);

    expect(highlight.domainKeys).toContain("projects");
    expect(highlight.projectIds).toContain("proj-enterprise-ai-transformation");
  });

  it("resolves an opportunity event to its related capability and signal, without inventing a relationship absent from state", () => {
    const state = getOrganizationalState();
    const opportunityEvent = state.organization.events.find((e) => e.id === "event-opportunity-detected")!;

    const highlight = resolveEventHighlight(opportunityEvent, state);

    expect(highlight.projectIds).toContain("proj-client-portal-refresh");
    expect(highlight.signalIds.length).toBeGreaterThan(0);
  });

  it("propagates event -> project -> active signal -> capability, without the event needing a direct relatedCapabilityId (mission section 7 propagation chain)", () => {
    const state = getOrganizationalState();
    // event-budget-allocated has only relatedProjectId set (no relatedCapabilityId) — the
    // capabilities-domain highlight must come from that project's own active capability-gap
    // signal, not from a capability field on the event itself.
    const budgetEvent = state.organization.events.find((e) => e.id === "event-budget-allocated")!;
    expect(budgetEvent.relatedCapabilityId).toBeUndefined();

    const highlight = resolveEventHighlight(budgetEvent, state);

    expect(highlight.domainKeys).toContain("capabilities");
    expect(highlight.capabilityIds).toContain("cap-llm-integration");
  });
});

describe("resolveSourceHighlight", () => {
  it("8. Alexis 'what requires attention?' sources resolve to the same signals Alexis itself cited (Alexis stays connected to the same organizational intelligence)", () => {
    const state = getOrganizationalState();
    const response = deterministicAlexisEngine.ask("What requires attention?", state);
    expect(response.sources.length).toBeGreaterThan(0);

    const highlight = resolveSourceHighlight(response.sources, state);

    for (const source of response.sources) {
      if (source.kind === "signal") expect(highlight.signalIds).toContain(source.id);
    }
  });

  it("asking Alexis does not change the answer it gives (resolving highlight is read-only)", () => {
    const state = getOrganizationalState();
    const before = deterministicAlexisEngine.ask("give me an executive briefing", state);

    resolveSourceHighlight(before.sources, state);

    const after = deterministicAlexisEngine.ask("give me an executive briefing", state);
    expect(after).toEqual(before);
  });

  it("a recommendation source resolves to its related signal, not a fabricated node", () => {
    const state = getOrganizationalState();
    const recommendation = state.recommendations[0];
    expect(recommendation).toBeDefined();

    const highlight = resolveSourceHighlight([{ kind: "recommendation", id: recommendation.id, label: recommendation.title }], state);

    expect(highlight.signalIds).toContain(recommendation.relatedSignalId);
  });
});
