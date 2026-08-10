/**
 * POA organizational domain model (POA-VIS-001, strengthened by POA-VIS-002).
 *
 * This is the organizational intelligence data layer:
 * ORGANIZATIONAL DATA -> ORGANIZATIONAL STATE -> RELATIONSHIPS -> EVENTS
 * -> SIGNALS -> RECOMMENDATIONS -> ALEXIS -> UI (POA-VIS-002 ARCHITECTURAL
 * PRINCIPLE). It is intentionally separate from demo data (src/lib/data),
 * business logic (src/lib/services), and presentation (src/components) —
 * the UI consumes this; it must not recreate it.
 */

export type ID = string;

export type HealthStatus = "healthy" | "attention" | "at-risk";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type ProjectStatus = "planning" | "active" | "blocked" | "completed";

export type RecommendationPriority = "low" | "medium" | "high";

export interface Role {
  id: ID;
  title: string;
  category: string;
}

export interface Department {
  id: ID;
  name: string;
  headId: ID | null;
  healthStatus: HealthStatus;
}

export interface Person {
  id: ID;
  name: string;
  roleId: ID;
  departmentId: ID;
  capabilityIds: ID[];
}

/**
 * A non-human, non-personnel supply of capacity: tooling, a vendor
 * contract, or a budget-linked resource. Kept minimal — Resource exists so
 * Capability supply is not implicitly "people only," and so BUDGET_CHANGED
 * events have a first-class entity to reference.
 */
export interface Resource {
  id: ID;
  name: string;
  kind: "tooling" | "vendor" | "budget-linked";
  departmentId: ID;
  capacityUnits: number;
}

export interface Budget {
  id: ID;
  projectId: ID;
  currency: string;
  allocatedAmount: number;
  consumedAmount: number;
}

/**
 * A capability the organization can, or needs to, provide.
 * `availableUnits` vs `demandUnits` is computed by services/capability.ts,
 * not stored here — this is the raw organizational capability record.
 */
export interface Capability {
  id: ID;
  name: string;
  category: string;
  providedByDepartmentIds: ID[];
  providedByPersonIds: ID[];
  providedByResourceIds: ID[];
}

export interface CapabilityRequirement {
  capabilityId: ID;
  requiredUnits: number;
}

export interface Project {
  id: ID;
  name: string;
  description: string;
  status: ProjectStatus;
  sponsorDepartmentId: ID;
  startDate: string;
  requiredCapabilities: CapabilityRequirement[];
}

/**
 * Extensible organizational event model (POA-VIS-002 MISSION 4). This is a
 * clean architectural seam for future runtime events, not an event-sourcing
 * platform — events here are an append-style historical log, and current
 * state is still derived independently by services/, not replayed from
 * this log.
 */
export type OrganizationalEventType =
  | "PROJECT_CREATED"
  | "CAPABILITY_GAP_DETECTED"
  | "PERSON_JOINED"
  | "PERSON_UNAVAILABLE"
  | "BUDGET_CHANGED"
  | "DEADLINE_CHANGED"
  | "RISK_ESCALATED"
  | "OPPORTUNITY_DETECTED"
  | "RECOMMENDATION_ISSUED";

export interface OrganizationalEvent {
  id: ID;
  type: OrganizationalEventType;
  timestamp: string;
  summary: string;
  relatedProjectId?: ID;
  relatedCapabilityId?: ID;
  relatedRiskId?: ID;
  relatedOpportunityId?: ID;
  relatedPersonId?: ID;
  relatedBudgetId?: ID;
}

/**
 * Risks are derived from capability gaps by services/risk.ts, then stored
 * back onto the organizational state so the UI, event stream, and Alexis
 * all read the same computed record instead of recomputing independently.
 */
export interface Risk {
  id: ID;
  title: string;
  description: string;
  severity: RiskSeverity;
  relatedProjectId: ID;
  relatedCapabilityIds: ID[];
  detectedAt: string;
}

/**
 * A detected opportunity: available capacity that could be redeployed, or
 * a favorable condition worth acting on. Derived deterministically by
 * services/opportunities.ts from the same state Risk is derived from.
 */
export interface Opportunity {
  id: ID;
  title: string;
  description: string;
  relatedCapabilityId: ID;
  relatedProjectId: ID;
  potentialValue: "low" | "medium" | "high";
  detectedAt: string;
}

/**
 * A pending or resolved executive decision, optionally tied to a
 * recommendation. Domain model only in this mission — POA-VIS-002 does not
 * require a decision-workflow UI (see completion report "future seams").
 */
export interface Decision {
  id: ID;
  title: string;
  description: string;
  relatedRecommendationId?: ID;
  status: "pending" | "accepted" | "rejected" | "deferred";
  decidedAt?: string;
}

/** A reference to the organizational entity a Signal or Recommendation is about. */
export interface EntityRef {
  kind: "project" | "capability" | "department" | "person" | "risk" | "opportunity" | "organization";
  id: ID;
  label: string;
}

/**
 * Unified organizational signal (POA-VIS-002 MISSION 6): the shared shape
 * risk, capability-gap, opportunity, and organizational-health findings
 * all reduce to, so the UI and Alexis can consume one list instead of
 * four parallel ones. Detection rules are deterministic for this mission.
 */
export type SignalType = "risk" | "capability-gap" | "opportunity" | "organizational-health";
export type SignalSeverity = "info" | "low" | "medium" | "high" | "critical";
export type SignalStatus = "active" | "resolved" | "acknowledged";

export interface Signal {
  id: ID;
  type: SignalType;
  severity: SignalSeverity;
  source: string;
  affectedEntities: EntityRef[];
  explanation: string;
  timestamp: string;
  recommendedAction?: string;
  status: SignalStatus;
}

/**
 * A recommendation generated independently of presentation
 * (POA-VIS-002 MISSION 7), always traceable back to the signal that
 * produced it.
 */
export interface Recommendation {
  id: ID;
  title: string;
  rationale: string;
  priority: RecommendationPriority;
  relatedSignalId: ID;
  affectedEntity: EntityRef;
  suggestedAction: string;
  responsibleArea?: string;
}

export interface Organization {
  id: ID;
  name: string;
  healthStatus: HealthStatus;
  roles: Role[];
  departments: Department[];
  people: Person[];
  resources: Resource[];
  budgets: Budget[];
  capabilities: Capability[];
  projects: Project[];
  events: OrganizationalEvent[];
  risks: Risk[];
  opportunities: Opportunity[];
  recommendations: Recommendation[];
  decisions: Decision[];
}

/**
 * Derived (computed) view of a capability's supply/demand position for one
 * project. Never persisted — always produced by services/capability.ts.
 */
export interface CapabilityGap {
  capabilityId: ID;
  capabilityName: string;
  requiredUnits: number;
  availableUnits: number;
  gapUnits: number;
  isGap: boolean;
}

/**
 * PROJECT -> CAPABILITY REQUIREMENT -> CAPABILITY GAP -> DEPARTMENT/PEOPLE
 * -> RISK -> RECOMMENDATION, as queryable data (POA-VIS-002 MISSION 5).
 * Produced by services/relationships.ts — never hard-coded in components.
 */
export type ImpactStage =
  | "project"
  | "capability-requirement"
  | "capability-gap"
  | "department"
  | "risk"
  | "recommendation";

export interface ImpactChainLink {
  stage: ImpactStage;
  id: ID;
  label: string;
  detail?: string;
}

export interface ImpactChain {
  projectId: ID;
  links: ImpactChainLink[];
}

/**
 * Full derived organizational state: raw Organization plus everything
 * computed from it (capability gaps, live signals, live recommendations,
 * overall health). This is what Alexis and the UI actually consume — see
 * POA-VIS-002 ARCHITECTURAL PRINCIPLE: the UI must not independently
 * recreate this.
 */
export interface OrganizationalState {
  organization: Organization;
  capabilityGapsByProject: Record<ID, CapabilityGap[]>;
  signals: Signal[];
  recommendations: Recommendation[];
  overallHealth: HealthStatus;
}
