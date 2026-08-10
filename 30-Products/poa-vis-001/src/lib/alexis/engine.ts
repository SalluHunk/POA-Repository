/**
 * Deterministic Alexis engine.
 *
 * Intent-matches a free-text question to one of a fixed set of
 * organizational questions, then composes an answer strictly from
 * OrganizationalState (never fabricated). This is NOT a chatbot — every
 * sentence in every answer is generated from real fields on the current
 * state, and every answer carries `sources` pointing at the records used.
 *
 * USER -> ALEXIS -> ORGANIZATIONAL STATE -> ANALYSIS -> RESPONSE
 */

import type { CapabilityGap, HealthStatus, Organization, OrganizationalState, Risk } from "@/lib/domain/types";
import type { AlexisEngine, AlexisResponse, AlexisSource } from "@/lib/alexis/types";

function healthLabel(status: HealthStatus): string {
  return { healthy: "healthy", attention: "needs attention", "at-risk": "at risk" }[status];
}

function activeProject(organization: Organization) {
  return (
    organization.projects.find((p) => p.status === "active") ??
    organization.projects[0] ??
    null
  );
}

function gapsFor(state: OrganizationalState, projectId: string): CapabilityGap[] {
  return state.capabilityGapsByProject[projectId] ?? [];
}

function allGapEntries(state: OrganizationalState): CapabilityGap[] {
  return Object.values(state.capabilityGapsByProject).flat().filter((gap) => gap.isGap);
}

function worstRisk(organization: Organization): Risk | null {
  const rank: Record<Risk["severity"], number> = { low: 0, medium: 1, high: 2, critical: 3 };
  return organization.risks.reduce<Risk | null>(
    (worst, risk) => (!worst || rank[risk.severity] > rank[worst.severity] ? risk : worst),
    null
  );
}

function projectAnswer(state: OrganizationalState): AlexisResponse {
  const project = activeProject(state.organization);
  if (!project) {
    return { answer: "There are no active projects in the organization right now.", sources: [] };
  }
  const gaps = gapsFor(state, project.id);
  const gapEntries = gaps.filter((g) => g.isGap);
  const sources: AlexisSource[] = [{ kind: "project", id: project.id, label: project.name }];

  let answer = `${project.name} entered the organization on ${new Date(project.startDate).toLocaleDateString()} and is currently ${project.status}. It requires ${gaps.length} capabilities, of which ${gapEntries.length} are short of internal supply.`;
  if (gapEntries.length > 0) {
    answer += ` The shortfall is in ${gapEntries.map((g) => g.capabilityName).join(", ")}.`;
    sources.push(...gapEntries.map((g) => ({ kind: "capability" as const, id: g.capabilityId, label: g.capabilityName })));
  }
  return { answer, sources };
}

function capabilityAnswer(state: OrganizationalState): AlexisResponse {
  const gapEntries = allGapEntries(state);
  if (gapEntries.length === 0) {
    return { answer: "No capability shortages are currently detected across active projects.", sources: [] };
  }
  const answer = `We are short on ${gapEntries.length} capabilit${gapEntries.length === 1 ? "y" : "ies"}: ${gapEntries
    .map((g) => `${g.capabilityName} (${g.availableUnits} of ${g.requiredUnits} units available)`)
    .join("; ")}.`;
  const sources: AlexisSource[] = gapEntries.map((g) => ({ kind: "capability", id: g.capabilityId, label: g.capabilityName }));
  return { answer, sources };
}

function riskAnswer(state: OrganizationalState): AlexisResponse {
  const risk = worstRisk(state.organization);
  if (!risk) {
    return { answer: "There is no material delivery risk on record right now.", sources: [] };
  }
  return {
    answer: `The current delivery risk is ${risk.severity.toUpperCase()}: ${risk.title}. ${risk.description}`,
    sources: [{ kind: "risk", id: risk.id, label: risk.title }],
  };
}

function concernAnswer(state: OrganizationalState): AlexisResponse {
  const risk = worstRisk(state.organization);
  const overall = state.overallHealth;
  const sources: AlexisSource[] = [];
  let answer = `Organizational health is currently ${healthLabel(overall)}.`;
  if (risk) {
    answer += ` The most pressing concern is: ${risk.title} (${risk.severity} severity).`;
    sources.push({ kind: "risk", id: risk.id, label: risk.title });
  } else {
    answer += " There is no single dominant concern right now.";
  }
  const atRiskDepartments = state.organization.departments.filter((d) => d.healthStatus !== "healthy");
  if (atRiskDepartments.length > 0) {
    answer += ` Departments needing attention: ${atRiskDepartments.map((d) => d.name).join(", ")}.`;
  }
  return { answer, sources };
}

function briefingAnswer(state: OrganizationalState): AlexisResponse {
  const { organization } = state;
  const project = activeProject(organization);
  const risk = worstRisk(organization);
  const recommendation = risk
    ? organization.recommendations.find((r) => r.relatedRiskId === risk.id)
    : organization.recommendations[0];
  const sources: AlexisSource[] = [];

  const parts: string[] = [`Executive briefing. Organizational health: ${healthLabel(state.overallHealth)}.`];

  if (project) {
    const gapEntries = gapsFor(state, project.id).filter((g) => g.isGap);
    parts.push(
      `Active project: ${project.name}, status ${project.status}${
        gapEntries.length > 0 ? `, with a capability gap of ${gapEntries.length} area(s)` : ""
      }.`
    );
    sources.push({ kind: "project", id: project.id, label: project.name });
  }

  if (risk) {
    parts.push(`Top risk: ${risk.title} (${risk.severity}).`);
    sources.push({ kind: "risk", id: risk.id, label: risk.title });
  }

  if (recommendation) {
    parts.push(`Recommendation: ${recommendation.title} — ${recommendation.suggestedAction}`);
    sources.push({ kind: "recommendation", id: recommendation.id, label: recommendation.title });
  }

  return { answer: parts.join(" "), sources };
}

function fallbackAnswer(state: OrganizationalState): AlexisResponse {
  return {
    answer:
      `I can answer questions about the organization's projects, capability gaps, delivery risk, and current concerns. ` +
      `Right now, overall health is ${healthLabel(state.overallHealth)}. Try asking "give me an executive briefing."`,
    sources: [],
  };
}

type IntentMatcher = { pattern: RegExp; handler: (state: OrganizationalState) => AlexisResponse };

const INTENTS: IntentMatcher[] = [
  { pattern: /executive briefing|brief me|briefing/i, handler: briefingAnswer },
  { pattern: /concern|worried|worry/i, handler: concernAnswer },
  { pattern: /delivery risk|current risk|risk level/i, handler: riskAnswer },
  { pattern: /capabilit(y|ies).*(short|gap|missing)|short on/i, handler: capabilityAnswer },
  { pattern: /new project|happening with|project status|active project/i, handler: projectAnswer },
];

export const deterministicAlexisEngine: AlexisEngine = {
  ask(question, state) {
    const matched = INTENTS.find((intent) => intent.pattern.test(question));
    return (matched ?? { handler: fallbackAnswer }).handler(state);
  },
};
