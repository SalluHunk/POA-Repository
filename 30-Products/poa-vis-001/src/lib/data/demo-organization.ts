/**
 * Demo organizational dataset for POA-VIS-001 / POA-VIS-002.
 *
 * THIS IS DEMONSTRATION DATA, not real organizational data. It exercises
 * the domain model end-to-end via one scenario: a new project ("Enterprise
 * AI Transformation") triggers a capability gap. POA-VIS-002 strengthens
 * the surrounding architecture (state/events/signals/recommendations)
 * without changing this scenario's numbers — the original 8 required / 5
 * available / 3 short outcome from POA-VIS-001 is preserved unchanged.
 *
 * This module is the ONLY place demo data lives. It is written to be
 * trivially replaceable by a repository-backed store, database, or API in
 * a future mission — nothing outside src/lib/data should hard-code
 * organizational facts.
 */

import type { Organization } from "@/lib/domain/types";

export const demoOrganization: Organization = {
  id: "org-paravyoma-demo",
  name: "Paravyoma Technologies (Demo Organization)",
  healthStatus: "attention",

  roles: [
    { id: "role-vp-eng", title: "VP Engineering", category: "Engineering" },
    { id: "role-head-data", title: "Head of Data & AI", category: "Data & AI" },
    { id: "role-head-product", title: "Head of Product", category: "Product" },
    { id: "role-head-people", title: "Head of People & Talent", category: "People" },
    { id: "role-dir-delivery", title: "Director of Client Delivery", category: "Delivery" },
  ],

  departments: [
    { id: "dept-engineering", name: "Engineering", headId: "person-lin", healthStatus: "attention" },
    { id: "dept-data", name: "Data & AI", headId: "person-vega", healthStatus: "at-risk" },
    { id: "dept-product", name: "Product", headId: "person-arun", healthStatus: "healthy" },
    { id: "dept-people", name: "People & Talent", headId: "person-noor", healthStatus: "healthy" },
    { id: "dept-delivery", name: "Client Delivery", headId: "person-hale", healthStatus: "attention" },
  ],

  people: [
    { id: "person-lin", name: "Lin Osei", roleId: "role-vp-eng", departmentId: "dept-engineering", capabilityIds: ["cap-platform-eng", "cap-cloud-infra"] },
    { id: "person-vega", name: "Priya Vega", roleId: "role-head-data", departmentId: "dept-data", capabilityIds: ["cap-ml-engineering", "cap-data-platform"] },
    { id: "person-arun", name: "Arun Mehta", roleId: "role-head-product", departmentId: "dept-product", capabilityIds: ["cap-product-strategy"] },
    { id: "person-noor", name: "Noor Hassan", roleId: "role-head-people", departmentId: "dept-people", capabilityIds: ["cap-talent-acquisition"] },
    { id: "person-hale", name: "Sam Hale", roleId: "role-dir-delivery", departmentId: "dept-delivery", capabilityIds: ["cap-program-management"] },
  ],

  // Additive for POA-VIS-002: a non-personnel supply, deliberately attached
  // to a capability no current project requires, so it demonstrates
  // Resource-backed capacity (see services/capability.ts) without altering
  // the POA-VIS-001 capability-gap numbers.
  resources: [
    { id: "resource-devops-vendor", name: "Managed DevOps Vendor Contract", kind: "vendor", departmentId: "dept-engineering", capacityUnits: 1 },
  ],

  budgets: [
    { id: "budget-ai-transformation", projectId: "proj-enterprise-ai-transformation", currency: "USD", allocatedAmount: 420000, consumedAmount: 96000 },
    { id: "budget-portal-refresh", projectId: "proj-client-portal-refresh", currency: "USD", allocatedAmount: 85000, consumedAmount: 0 },
  ],

  capabilities: [
    { id: "cap-platform-eng", name: "Platform Engineering", category: "Engineering", providedByDepartmentIds: ["dept-engineering"], providedByPersonIds: ["person-lin"], providedByResourceIds: [] },
    { id: "cap-cloud-infra", name: "Cloud Infrastructure", category: "Engineering", providedByDepartmentIds: ["dept-engineering"], providedByPersonIds: ["person-lin"], providedByResourceIds: [] },
    { id: "cap-ml-engineering", name: "ML Engineering", category: "Data & AI", providedByDepartmentIds: ["dept-data"], providedByPersonIds: ["person-vega"], providedByResourceIds: [] },
    { id: "cap-data-platform", name: "Data Platform", category: "Data & AI", providedByDepartmentIds: ["dept-data"], providedByPersonIds: ["person-vega"], providedByResourceIds: [] },
    { id: "cap-llm-integration", name: "LLM Integration", category: "Data & AI", providedByDepartmentIds: [], providedByPersonIds: [], providedByResourceIds: [] },
    { id: "cap-mlops", name: "MLOps", category: "Data & AI", providedByDepartmentIds: [], providedByPersonIds: [], providedByResourceIds: [] },
    { id: "cap-product-strategy", name: "Product Strategy", category: "Product", providedByDepartmentIds: ["dept-product"], providedByPersonIds: ["person-arun"], providedByResourceIds: [] },
    { id: "cap-change-management", name: "Organizational Change Management", category: "People", providedByDepartmentIds: [], providedByPersonIds: [], providedByResourceIds: [] },
    { id: "cap-program-management", name: "Program Management", category: "Delivery", providedByDepartmentIds: ["dept-delivery"], providedByPersonIds: ["person-hale"], providedByResourceIds: [] },
    { id: "cap-talent-acquisition", name: "Talent Acquisition", category: "People", providedByDepartmentIds: ["dept-people"], providedByPersonIds: ["person-noor"], providedByResourceIds: [] },
    { id: "cap-devops-tooling", name: "DevOps Tooling", category: "Engineering", providedByDepartmentIds: [], providedByPersonIds: [], providedByResourceIds: ["resource-devops-vendor"] },
  ],

  projects: [
    {
      id: "proj-enterprise-ai-transformation",
      name: "Enterprise AI Transformation",
      description:
        "Multi-phase engagement to embed AI-assisted decision support across a client's core operations, from data platform through change-managed rollout.",
      status: "active",
      sponsorDepartmentId: "dept-delivery",
      startDate: "2026-08-04",
      requiredCapabilities: [
        { capabilityId: "cap-platform-eng", requiredUnits: 1 },
        { capabilityId: "cap-cloud-infra", requiredUnits: 1 },
        { capabilityId: "cap-ml-engineering", requiredUnits: 1 },
        { capabilityId: "cap-data-platform", requiredUnits: 1 },
        { capabilityId: "cap-llm-integration", requiredUnits: 1 },
        { capabilityId: "cap-mlops", requiredUnits: 1 },
        { capabilityId: "cap-change-management", requiredUnits: 1 },
        { capabilityId: "cap-program-management", requiredUnits: 1 },
      ],
    },
    {
      id: "proj-client-portal-refresh",
      name: "Client Portal Refresh",
      description: "Modernization of the existing client reporting portal.",
      status: "planning",
      sponsorDepartmentId: "dept-product",
      startDate: "2026-09-01",
      requiredCapabilities: [
        { capabilityId: "cap-platform-eng", requiredUnits: 1 },
        { capabilityId: "cap-product-strategy", requiredUnits: 1 },
      ],
    },
  ],

  // Risks are seeded to match what services/risk.ts derives live from the
  // capability gap above, so the historical event stream is coherent.
  // services/risk.ts recomputes the live gap independently.
  risks: [
    {
      id: "risk-ai-transformation-capability-gap",
      title: "Delivery risk: capability shortage on Enterprise AI Transformation",
      description:
        "Required capabilities for Enterprise AI Transformation exceed what Data & AI and adjacent departments currently provide. LLM Integration, MLOps, and Organizational Change Management have no assigned internal capacity.",
      severity: "high",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedCapabilityIds: ["cap-llm-integration", "cap-mlops", "cap-change-management"],
      detectedAt: "2026-08-07T09:15:00Z",
    },
  ],

  // Opportunities are seeded to match what services/opportunities.ts
  // derives live: Product Strategy has assigned supply not required by the
  // currently active project, but IS required by the next planned project.
  opportunities: [
    {
      id: "opportunity-product-strategy-redeploy",
      title: "Product Strategy capacity available for Client Portal Refresh",
      description:
        "Arun Mehta's Product Strategy capability is not required by the active Enterprise AI Transformation project, but is required by the planned Client Portal Refresh — this capacity could accelerate that project's start.",
      relatedCapabilityId: "cap-product-strategy",
      relatedProjectId: "proj-client-portal-refresh",
      potentialValue: "medium",
      detectedAt: "2026-08-08T10:00:00Z",
    },
  ],

  // Historical/seed recommendations. The live recommendation list the UI
  // and Alexis actually read is produced by services/recommendations.ts
  // from live signals (POA-VIS-002 MISSION 7) — this seed exists for
  // event-log narrative continuity and uses the same deterministic signal
  // ID scheme services/signals.ts uses, so seed and live agree.
  recommendations: [
    {
      id: "rec-close-ai-capability-gap",
      title: "Close the capability gap before the next delivery milestone",
      rationale:
        "Three of eight required capabilities for Enterprise AI Transformation have zero internal supply. Left unaddressed, this becomes a schedule risk at the integration milestone.",
      priority: "high",
      relatedSignalId: "signal-risk-proj-enterprise-ai-transformation",
      affectedEntity: { kind: "project", id: "proj-enterprise-ai-transformation", label: "Enterprise AI Transformation" },
      suggestedAction:
        "Fast-track hiring or contracting for LLM Integration and MLOps; assign Client Delivery to lead a change-management plan for Organizational Change Management.",
      responsibleArea: "Client Delivery",
    },
  ],

  decisions: [
    {
      id: "decision-approve-capability-fasttrack",
      title: "Approve fast-tracked hiring/contracting for LLM Integration and MLOps",
      description: "Executive decision pending on rec-close-ai-capability-gap.",
      relatedRecommendationId: "rec-close-ai-capability-gap",
      status: "pending",
    },
  ],

  events: [
    {
      id: "event-project-entered",
      type: "PROJECT_CREATED",
      timestamp: "2026-08-04T08:00:00Z",
      summary: "New project entered the organization: Enterprise AI Transformation.",
      relatedProjectId: "proj-enterprise-ai-transformation",
    },
    {
      id: "event-portal-project-planned",
      type: "PROJECT_CREATED",
      timestamp: "2026-08-06T14:00:00Z",
      summary: "Client Portal Refresh moved into planning.",
      relatedProjectId: "proj-client-portal-refresh",
    },
    {
      id: "event-capability-gap-detected",
      type: "CAPABILITY_GAP_DETECTED",
      timestamp: "2026-08-07T09:15:00Z",
      summary: "Capability gap detected on Enterprise AI Transformation: 8 capabilities required, 3 short of internal supply.",
      relatedProjectId: "proj-enterprise-ai-transformation",
    },
    {
      id: "event-risk-generated",
      type: "RISK_ESCALATED",
      timestamp: "2026-08-07T09:15:30Z",
      summary: "Risk escalated: delivery risk from capability shortage.",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedRiskId: "risk-ai-transformation-capability-gap",
    },
    {
      id: "event-recommendation-issued",
      type: "RECOMMENDATION_ISSUED",
      timestamp: "2026-08-07T09:16:00Z",
      summary: "Recommendation issued: close the capability gap before the next delivery milestone.",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedRiskId: "risk-ai-transformation-capability-gap",
    },
    {
      id: "event-opportunity-detected",
      type: "OPPORTUNITY_DETECTED",
      timestamp: "2026-08-08T10:00:00Z",
      summary: "Opportunity detected: Product Strategy capacity available for Client Portal Refresh.",
      relatedProjectId: "proj-client-portal-refresh",
      relatedOpportunityId: "opportunity-product-strategy-redeploy",
    },
    {
      id: "event-budget-allocated",
      type: "BUDGET_CHANGED",
      timestamp: "2026-08-04T08:30:00Z",
      summary: "Budget allocated for Enterprise AI Transformation: $420,000.",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedBudgetId: "budget-ai-transformation",
    },
  ],
};
