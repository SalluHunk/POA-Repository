/**
 * POA-VIS-001 domain model.
 *
 * This is the organizational state model for the Paravyoma Organizational
 * Operating System vertical slice. It is intentionally separate from demo
 * data (src/lib/data), business logic (src/lib/services), and presentation
 * (src/components) — see POA-VIS-001 "DATA ARCHITECTURE".
 */

export type ID = string;

export type HealthStatus = "healthy" | "attention" | "at-risk";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type ProjectStatus = "planning" | "active" | "blocked" | "completed";

export type RecommendationPriority = "low" | "medium" | "high";

export interface Department {
  id: ID;
  name: string;
  headId: ID | null;
  healthStatus: HealthStatus;
}

export interface Person {
  id: ID;
  name: string;
  role: string;
  departmentId: ID;
  capabilityIds: ID[];
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

export type EventCategory =
  | "project"
  | "capability"
  | "risk"
  | "recommendation"
  | "organization";

export interface OrgEvent {
  id: ID;
  timestamp: string;
  category: EventCategory;
  summary: string;
  relatedProjectId?: ID;
  relatedCapabilityId?: ID;
  relatedRiskId?: ID;
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

export interface Recommendation {
  id: ID;
  title: string;
  rationale: string;
  priority: RecommendationPriority;
  relatedRiskId: ID;
  suggestedAction: string;
}

export interface Organization {
  id: ID;
  name: string;
  healthStatus: HealthStatus;
  departments: Department[];
  people: Person[];
  capabilities: Capability[];
  projects: Project[];
  events: OrgEvent[];
  risks: Risk[];
  recommendations: Recommendation[];
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
 * Full derived organizational state: raw Organization plus everything
 * computed from it. This is what Alexis and the UI actually consume.
 */
export interface OrganizationalState {
  organization: Organization;
  capabilityGapsByProject: Record<ID, CapabilityGap[]>;
  overallHealth: HealthStatus;
}
