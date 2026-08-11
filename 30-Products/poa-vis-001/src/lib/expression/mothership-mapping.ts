import type {
  ID,
  OrganizationalEvent,
  OrganizationalState,
  ProjectStatus,
  SignalSeverity,
  SignalType,
} from "@/lib/domain/types";
import type { AlexisSource } from "@/lib/alexis/types";
import type { OrganizationalVisualProfile } from "@/lib/expression/types";

/**
 * Pure view-shaping for the Organizational Mothership profile (POA-VIS-004).
 * Like network-mapping.ts, this SELECTS and LABELS records that
 * OrganizationalState / the capability-gap and signal engines already
 * computed — it must never derive a severity, a gap, or a health status
 * itself (mission section 6/8/9/10: gap consequence, risk/opportunity
 * language, and health must all remain sourced from POA Core).
 *
 * Read-only over `state` — never mutates it.
 */

export type MothershipDomainKey = "people" | "projects" | "capabilities";

export interface MothershipDomain {
  id: string;
  key: MothershipDomainKey;
  label: string;
  count: number;
  detail: string;
}

export interface MothershipProjectNode {
  id: string;
  entityId: ID;
  label: string;
  status: ProjectStatus;
  hasGap: boolean;
}

export interface MothershipCapabilityNode {
  id: string;
  entityId: ID;
  label: string;
  isGap: boolean;
  projectIds: string[];
}

export interface MothershipSignalNode {
  id: string;
  entityId: ID;
  kind: SignalType;
  severity: SignalSeverity;
  label: string;
  detail: string;
  affectedProjectIds: string[];
  affectedCapabilityIds: string[];
}

export interface MothershipEdge {
  fromId: string;
  toId: string;
  kind: "domain" | "capability-thread" | "signal";
  isGap?: boolean;
}

export interface MothershipRecommendation {
  id: ID;
  title: string;
  suggestedAction: string;
  priority: string;
  relatedSignalId: ID;
}

export interface MothershipModel {
  core: { id: string; label: string; detail: string };
  health: OrganizationalState["overallHealth"];
  domains: MothershipDomain[];
  projects: MothershipProjectNode[];
  capabilities: MothershipCapabilityNode[];
  signals: MothershipSignalNode[];
  recommendations: MothershipRecommendation[];
  edges: MothershipEdge[];
}

export interface EventHighlight {
  domainKeys: MothershipDomainKey[];
  projectIds: string[];
  capabilityIds: string[];
  signalIds: string[];
}

const coreNodeId = (organizationId: ID) => `org:${organizationId}`;
const domainNodeId = (key: MothershipDomainKey) => `domain:${key}`;
export const mothershipProjectNodeId = (projectId: ID) => `project:${projectId}`;
export const mothershipCapabilityNodeId = (capabilityId: ID) => `capability:${capabilityId}`;
const mothershipSignalNodeId = (signalId: ID) => `signal:${signalId}`;

/** Capabilities actually required by at least one project — the connected subset the mission's capability-consequence chain (section 6) is drawn over. Capabilities with no project relationship are not fabricated as graph nodes, though they remain part of the domain's count. */
function connectedCapabilityIds(state: OrganizationalState): Set<ID> {
  return new Set(
    state.organization.projects.flatMap((project) => project.requiredCapabilities.map((r) => r.capabilityId))
  );
}

export function mapStateToMothership(
  state: OrganizationalState,
  profile: OrganizationalVisualProfile
): MothershipModel {
  const { organization } = state;
  const edges: MothershipEdge[] = [];
  const coreId = coreNodeId(organization.id);

  const peopleDomainId = domainNodeId("people");
  const projectsDomainId = domainNodeId("projects");
  const capabilitiesDomainId = domainNodeId("capabilities");

  const atRiskDepartments = organization.departments.filter((d) => d.healthStatus !== "healthy");
  const domains: MothershipDomain[] = [
    {
      id: peopleDomainId,
      key: "people",
      label: "People",
      count: organization.people.length,
      detail:
        atRiskDepartments.length > 0
          ? `${atRiskDepartments.length} department(s) need attention: ${atRiskDepartments.map((d) => d.name).join(", ")}.`
          : "All departments healthy.",
    },
    {
      id: projectsDomainId,
      key: "projects",
      label: "Projects",
      count: organization.projects.length,
      detail: `${organization.projects.filter((p) => p.status === "active").length} active.`,
    },
    {
      id: capabilitiesDomainId,
      key: "capabilities",
      label: "Capabilities",
      count: organization.capabilities.length,
      detail: `${Object.values(state.capabilityGapsByProject).flat().filter((g) => g.isGap).length} gap(s) across active projects.`,
    },
  ];
  for (const domain of domains) edges.push({ fromId: coreId, toId: domain.id, kind: "domain" });

  const connectedCapabilities = connectedCapabilityIds(state);

  const projects: MothershipProjectNode[] = organization.projects.map((project) => {
    const gaps = state.capabilityGapsByProject[project.id] ?? [];
    const projectId = mothershipProjectNodeId(project.id);
    edges.push({ fromId: projectsDomainId, toId: projectId, kind: "domain" });
    return {
      id: projectId,
      entityId: project.id,
      label: project.name,
      status: project.status,
      hasGap: gaps.some((g) => g.isGap),
    };
  });

  const capabilityProjectIds = new Map<ID, Set<ID>>();
  const capabilityGapById = new Map<ID, boolean>();
  for (const project of organization.projects) {
    const gaps = state.capabilityGapsByProject[project.id] ?? [];
    for (const requirement of project.requiredCapabilities) {
      if (!connectedCapabilities.has(requirement.capabilityId)) continue;
      if (!capabilityProjectIds.has(requirement.capabilityId)) capabilityProjectIds.set(requirement.capabilityId, new Set());
      capabilityProjectIds.get(requirement.capabilityId)!.add(project.id);
      const gap = gaps.find((g) => g.capabilityId === requirement.capabilityId);
      capabilityGapById.set(requirement.capabilityId, gap?.isGap ?? false);

      edges.push({
        fromId: mothershipProjectNodeId(project.id),
        toId: mothershipCapabilityNodeId(requirement.capabilityId),
        kind: "capability-thread",
        isGap: gap?.isGap ?? false,
      });
    }
  }

  const capabilities: MothershipCapabilityNode[] = organization.capabilities
    .filter((capability) => connectedCapabilities.has(capability.id))
    .map((capability) => {
      const capabilityId = mothershipCapabilityNodeId(capability.id);
      edges.push({ fromId: capabilitiesDomainId, toId: capabilityId, kind: "domain" });
      return {
        id: capabilityId,
        entityId: capability.id,
        label: capability.name,
        isGap: capabilityGapById.get(capability.id) ?? false,
        projectIds: [...(capabilityProjectIds.get(capability.id) ?? [])].map(mothershipProjectNodeId),
      };
    });

  const projectNodeIds = new Set(projects.map((p) => p.id));
  const capabilityNodeIds = new Set(capabilities.map((c) => c.id));

  const signals: MothershipSignalNode[] = state.signals.map((signal) => {
    const signalId = mothershipSignalNodeId(signal.id);
    const affectedProjectIds = signal.affectedEntities
      .filter((entity) => entity.kind === "project")
      .map((entity) => mothershipProjectNodeId(entity.id))
      .filter((id) => projectNodeIds.has(id));
    const affectedCapabilityIds = signal.affectedEntities
      .filter((entity) => entity.kind === "capability")
      .map((entity) => mothershipCapabilityNodeId(entity.id))
      .filter((id) => capabilityNodeIds.has(id));

    const targets = [...affectedProjectIds, ...affectedCapabilityIds];
    for (const targetId of targets.length > 0 ? targets : [coreId]) {
      edges.push({ fromId: targetId, toId: signalId, kind: "signal" });
    }

    return {
      id: signalId,
      entityId: signal.id,
      kind: signal.type,
      severity: signal.severity,
      label: profile.terminology.signalLabel,
      detail: signal.explanation,
      affectedProjectIds,
      affectedCapabilityIds,
    };
  });

  return {
    core: { id: coreId, label: profile.terminology.organizationalCoreLabel, detail: organization.name },
    health: state.overallHealth,
    domains,
    projects,
    capabilities,
    signals,
    recommendations: state.recommendations.map((r) => ({
      id: r.id,
      title: r.title,
      suggestedAction: r.suggestedAction,
      priority: r.priority,
      relatedSignalId: r.relatedSignalId,
    })),
    edges,
  };
}

/**
 * Resolves which already-computed graph nodes an existing organizational
 * event touches (mission section 12/18, STATE B). Matches purely by the
 * event's own relational fields and each signal's already-computed
 * `affectedEntities` — it derives no new organizational fact and builds no
 * second event engine, it only selects among what POA Core already
 * produced.
 */
export function resolveEventHighlight(event: OrganizationalEvent, state: OrganizationalState): EventHighlight {
  const projectIds = event.relatedProjectId ? [event.relatedProjectId] : [];
  const directCapabilityIds = event.relatedCapabilityId ? [event.relatedCapabilityId] : [];

  const relatedSignals = state.signals.filter((signal) =>
    signal.affectedEntities.some(
      (entity) =>
        (entity.kind === "project" && projectIds.includes(entity.id)) ||
        (entity.kind === "risk" && entity.id === event.relatedRiskId) ||
        (entity.kind === "opportunity" && entity.id === event.relatedOpportunityId)
    )
  );

  const signalCapabilityIds = relatedSignals.flatMap((signal) =>
    signal.affectedEntities.filter((entity) => entity.kind === "capability").map((entity) => entity.id)
  );

  const capabilityIds = [...new Set([...directCapabilityIds, ...signalCapabilityIds])];

  const domainKeys: MothershipDomainKey[] = [];
  if (projectIds.length > 0) domainKeys.push("projects");
  if (capabilityIds.length > 0) domainKeys.push("capabilities");

  return {
    domainKeys,
    projectIds,
    capabilityIds,
    signalIds: relatedSignals.map((signal) => signal.id),
  };
}

/**
 * Resolves an Alexis response's `sources` (mission section 13/20: "SEE
 * something -> ASK ALEXIS -> RECEIVE EXPLANATION -> SEE RELATED VISUAL
 * STATE") to the graph nodes those sources already point at. Alexis and the
 * Mothership graph both read the same OrganizationalState — this only
 * translates AlexisSource.kind/id into the matching node id scheme; it
 * derives no new fact and never calls into src/lib/alexis's engine.
 */
export function resolveSourceHighlight(sources: AlexisSource[], state: OrganizationalState): EventHighlight {
  const projectIds = new Set<ID>();
  const capabilityIds = new Set<ID>();
  const signalIds = new Set<ID>();

  for (const source of sources) {
    if (source.kind === "project") {
      projectIds.add(source.id);
    } else if (source.kind === "capability") {
      capabilityIds.add(source.id);
    } else if (source.kind === "signal") {
      signalIds.add(source.id);
    } else if (source.kind === "risk" || source.kind === "opportunity") {
      for (const signal of state.signals) {
        if (signal.affectedEntities.some((e) => e.kind === source.kind && e.id === source.id)) {
          signalIds.add(signal.id);
          for (const entity of signal.affectedEntities) {
            if (entity.kind === "project") projectIds.add(entity.id);
            if (entity.kind === "capability") capabilityIds.add(entity.id);
          }
        }
      }
    } else if (source.kind === "recommendation") {
      const recommendation = state.recommendations.find((r) => r.id === source.id);
      if (recommendation) signalIds.add(recommendation.relatedSignalId);
    } else if (source.kind === "event") {
      const event = state.organization.events.find((e) => e.id === source.id);
      if (event) {
        const eventHighlight = resolveEventHighlight(event, state);
        eventHighlight.projectIds.forEach((id) => projectIds.add(id));
        eventHighlight.capabilityIds.forEach((id) => capabilityIds.add(id));
        eventHighlight.signalIds.forEach((id) => signalIds.add(id));
      }
    }
  }

  const domainKeys: MothershipDomainKey[] = [];
  if (projectIds.size > 0) domainKeys.push("projects");
  if (capabilityIds.size > 0) domainKeys.push("capabilities");

  return {
    domainKeys,
    projectIds: [...projectIds],
    capabilityIds: [...capabilityIds],
    signalIds: [...signalIds],
  };
}
