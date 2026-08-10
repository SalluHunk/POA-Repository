/**
 * Demo organizational dataset for POA-VIS-001.
 *
 * THIS IS DEMONSTRATION DATA, not real organizational data. It exists to
 * exercise the domain model end-to-end via one scenario: a new project
 * ("Enterprise AI Transformation") triggers a capability gap.
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

  departments: [
    { id: "dept-engineering", name: "Engineering", headId: "person-lin", healthStatus: "attention" },
    { id: "dept-data", name: "Data & AI", headId: "person-vega", healthStatus: "at-risk" },
    { id: "dept-product", name: "Product", headId: "person-arun", healthStatus: "healthy" },
    { id: "dept-people", name: "People & Talent", headId: "person-noor", healthStatus: "healthy" },
    { id: "dept-delivery", name: "Client Delivery", headId: "person-hale", healthStatus: "attention" },
  ],

  people: [
    { id: "person-lin", name: "Lin Osei", role: "VP Engineering", departmentId: "dept-engineering", capabilityIds: ["cap-platform-eng", "cap-cloud-infra"] },
    { id: "person-vega", name: "Priya Vega", role: "Head of Data & AI", departmentId: "dept-data", capabilityIds: ["cap-ml-engineering", "cap-data-platform"] },
    { id: "person-arun", name: "Arun Mehta", role: "Head of Product", departmentId: "dept-product", capabilityIds: ["cap-product-strategy"] },
    { id: "person-noor", name: "Noor Hassan", role: "Head of People & Talent", departmentId: "dept-people", capabilityIds: ["cap-talent-acquisition"] },
    { id: "person-hale", name: "Sam Hale", role: "Director of Client Delivery", departmentId: "dept-delivery", capabilityIds: ["cap-program-management"] },
  ],

  capabilities: [
    { id: "cap-platform-eng", name: "Platform Engineering", category: "Engineering", providedByDepartmentIds: ["dept-engineering"], providedByPersonIds: ["person-lin"] },
    { id: "cap-cloud-infra", name: "Cloud Infrastructure", category: "Engineering", providedByDepartmentIds: ["dept-engineering"], providedByPersonIds: ["person-lin"] },
    { id: "cap-ml-engineering", name: "ML Engineering", category: "Data & AI", providedByDepartmentIds: ["dept-data"], providedByPersonIds: ["person-vega"] },
    { id: "cap-data-platform", name: "Data Platform", category: "Data & AI", providedByDepartmentIds: ["dept-data"], providedByPersonIds: ["person-vega"] },
    { id: "cap-llm-integration", name: "LLM Integration", category: "Data & AI", providedByDepartmentIds: [], providedByPersonIds: [] },
    { id: "cap-mlops", name: "MLOps", category: "Data & AI", providedByDepartmentIds: [], providedByPersonIds: [] },
    { id: "cap-product-strategy", name: "Product Strategy", category: "Product", providedByDepartmentIds: ["dept-product"], providedByPersonIds: ["person-arun"] },
    { id: "cap-change-management", name: "Organizational Change Management", category: "People", providedByDepartmentIds: [], providedByPersonIds: [] },
    { id: "cap-program-management", name: "Program Management", category: "Delivery", providedByDepartmentIds: ["dept-delivery"], providedByPersonIds: ["person-hale"] },
    { id: "cap-talent-acquisition", name: "Talent Acquisition", category: "People", providedByDepartmentIds: ["dept-people"], providedByPersonIds: ["person-noor"] },
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

  // Risks and recommendations below are seeded to match what
  // services/risk.ts would derive from the capability gap above, so the
  // event stream has a coherent history. services/risk.ts recomputes the
  // live gap independently — see src/lib/services/risk.ts.
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

  recommendations: [
    {
      id: "rec-close-ai-capability-gap",
      title: "Close the capability gap before the next delivery milestone",
      rationale:
        "Three of eight required capabilities for Enterprise AI Transformation have zero internal supply. Left unaddressed, this becomes a schedule risk at the integration milestone.",
      priority: "high",
      relatedRiskId: "risk-ai-transformation-capability-gap",
      suggestedAction:
        "Fast-track hiring or contracting for LLM Integration and MLOps; assign Client Delivery to lead a change-management plan for Organizational Change Management.",
    },
  ],

  events: [
    {
      id: "event-project-entered",
      timestamp: "2026-08-04T08:00:00Z",
      category: "project",
      summary: "New project entered the organization: Enterprise AI Transformation.",
      relatedProjectId: "proj-enterprise-ai-transformation",
    },
    {
      id: "event-capability-gap-detected",
      timestamp: "2026-08-07T09:15:00Z",
      category: "capability",
      summary: "Capability gap detected on Enterprise AI Transformation: 8 capabilities required, 3 short of internal supply.",
      relatedProjectId: "proj-enterprise-ai-transformation",
    },
    {
      id: "event-risk-generated",
      timestamp: "2026-08-07T09:15:30Z",
      category: "risk",
      summary: "Risk generated: delivery risk from capability shortage.",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedRiskId: "risk-ai-transformation-capability-gap",
    },
    {
      id: "event-recommendation-issued",
      timestamp: "2026-08-07T09:16:00Z",
      category: "recommendation",
      summary: "Recommendation issued: close the capability gap before the next delivery milestone.",
      relatedProjectId: "proj-enterprise-ai-transformation",
      relatedRiskId: "risk-ai-transformation-capability-gap",
    },
    {
      id: "event-portal-project-planned",
      timestamp: "2026-08-06T14:00:00Z",
      category: "project",
      summary: "Client Portal Refresh moved into planning.",
      relatedProjectId: "proj-client-portal-refresh",
    },
  ],
};
