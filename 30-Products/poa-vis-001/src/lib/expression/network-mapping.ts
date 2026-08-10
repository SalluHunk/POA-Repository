import type { OrganizationalState, SignalSeverity } from "@/lib/domain/types";
import type { OrganizationalVisualProfile } from "@/lib/expression/types";

/**
 * Pure view-shaping for the Network / Organizational Graph profile
 * (POA-VIS-003 MISSION 8). This function SELECTS and LABELS records that
 * OrganizationalState already computed — it must never derive a severity,
 * a gap, or a health status itself. That would duplicate POA Core's
 * business logic inside the Expression Layer, which the mission forbids.
 *
 * Read-only over `state` — never mutates it (verified by
 * expression-boundary.test.ts, DoD "changing visual profile does not alter
 * organizational truth").
 */

export type GraphNodeKind = "organization" | "project" | "signal";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  detail: string;
  severity?: SignalSeverity;
}

export interface GraphEdge {
  fromId: string;
  toId: string;
}

export interface NetworkGraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function mapStateToNetworkGraph(
  state: OrganizationalState,
  profile: OrganizationalVisualProfile
): NetworkGraphModel {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const coreId = `org:${state.organization.id}`;
  nodes.push({
    id: coreId,
    kind: "organization",
    label: profile.terminology.organizationalCoreLabel,
    detail: state.organization.name,
  });

  const projectNodeId = (projectId: string) => `project:${projectId}`;

  for (const project of state.organization.projects) {
    const projectId = projectNodeId(project.id);
    nodes.push({
      id: projectId,
      kind: "project",
      label: project.name,
      detail: `${profile.terminology.projectLabel} · ${project.status}`,
    });
    edges.push({ fromId: coreId, toId: projectId });
  }

  for (const signal of state.signals) {
    const signalId = `signal:${signal.id}`;
    nodes.push({
      id: signalId,
      kind: "signal",
      label: profile.terminology.signalLabel,
      detail: signal.explanation,
      severity: signal.severity,
    });

    const affectedProjectIds = signal.affectedEntities
      .filter((entity) => entity.kind === "project")
      .map((entity) => projectNodeId(entity.id))
      .filter((id) => nodes.some((node) => node.id === id));

    const targets = affectedProjectIds.length > 0 ? affectedProjectIds : [coreId];
    for (const targetId of targets) {
      edges.push({ fromId: targetId, toId: signalId });
    }
  }

  return { nodes, edges };
}
