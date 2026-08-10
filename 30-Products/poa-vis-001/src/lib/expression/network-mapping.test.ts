import { describe, expect, it } from "vitest";
import { getOrganizationalState } from "@/lib/organizational-state";
import { mapStateToNetworkGraph } from "@/lib/expression/network-mapping";
import { networkGraphProfile, referenceProfile } from "@/lib/expression/profiles";

describe("mapStateToNetworkGraph", () => {
  it("produces one signal node per state.signal, with matching severity (DoD: signals remain identical regardless of expression)", () => {
    const state = getOrganizationalState();
    const graph = mapStateToNetworkGraph(state, networkGraphProfile);

    const signalNodes = graph.nodes.filter((n) => n.kind === "signal");
    expect(signalNodes.length).toBe(state.signals.length);

    const severityById = new Map(state.signals.map((s) => [`signal:${s.id}`, s.severity]));
    for (const node of signalNodes) {
      expect(node.severity).toBe(severityById.get(node.id));
    }
  });

  it("produces one project node per organization project, each connected to the organizational core", () => {
    const state = getOrganizationalState();
    const graph = mapStateToNetworkGraph(state, networkGraphProfile);

    const projectNodes = graph.nodes.filter((n) => n.kind === "project");
    expect(projectNodes.length).toBe(state.organization.projects.length);

    const coreId = `org:${state.organization.id}`;
    for (const project of state.organization.projects) {
      const projectId = `project:${project.id}`;
      expect(graph.edges).toContainEqual({ fromId: coreId, toId: projectId });
    }
  });

  it("does not mutate the OrganizationalState it was given", () => {
    const state = getOrganizationalState();
    const before = JSON.stringify(state);

    mapStateToNetworkGraph(state, networkGraphProfile);

    expect(JSON.stringify(state)).toBe(before);
  });

  it("is agnostic to which profile it is called with — same state, any profile, same graph shape (DoD: multiple profiles can consume the same state)", () => {
    const state = getOrganizationalState();
    const graphA = mapStateToNetworkGraph(state, networkGraphProfile);
    const graphB = mapStateToNetworkGraph(state, referenceProfile);

    expect(graphA.nodes.length).toBe(graphB.nodes.length);
    expect(graphA.edges.length).toBe(graphB.edges.length);
  });

  it("uses the profile's terminology for node labels, not a hard-coded string", () => {
    const state = getOrganizationalState();
    const graph = mapStateToNetworkGraph(state, networkGraphProfile);

    const coreNode = graph.nodes.find((n) => n.kind === "organization");
    expect(coreNode?.label).toBe(networkGraphProfile.terminology.organizationalCoreLabel);

    const signalNode = graph.nodes.find((n) => n.kind === "signal");
    expect(signalNode?.label).toBe(networkGraphProfile.terminology.signalLabel);
  });
});
