/**
 * Deterministic Alexis engine (strengthened by POA-VIS-002 MISSION 8).
 *
 * Intent-matches a free-text question to one of a fixed set of
 * organizational questions, then composes an answer strictly from
 * OrganizationalState — specifically from its `signals` and
 * `recommendations`, not by recomputing risk/opportunity logic itself.
 * This is NOT a chatbot — every sentence in every answer is generated from
 * real fields on the current state, and every answer carries `sources`
 * pointing at the records used.
 *
 * USER -> ALEXIS -> ORGANIZATIONAL STATE (SIGNALS + RECOMMENDATIONS)
 * -> ANALYSIS -> RESPONSE
 */

import type { HealthStatus, OrganizationalEvent, OrganizationalState, Organization, Signal } from "@/lib/domain/types";
import type { AlexisEngine, AlexisResponse, AlexisSource } from "@/lib/alexis/types";

const SEVERITY_RANK: Record<Signal["severity"], number> = { info: 0, low: 1, medium: 2, high: 3, critical: 4 };

function healthLabel(status: HealthStatus): string {
  return { healthy: "healthy", attention: "needs attention", "at-risk": "at risk" }[status];
}

function activeProject(organization: Organization) {
  return organization.projects.find((p) => p.status === "active") ?? organization.projects[0] ?? null;
}

function sourceFromSignal(signal: Signal): AlexisSource {
  return { kind: "signal", id: signal.id, label: signal.explanation.slice(0, 60) };
}

function topRiskSignal(state: OrganizationalState): Signal | null {
  return (
    state.signals
      .filter((s) => s.type === "risk")
      .sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])[0] ?? null
  );
}

function attentionSignals(state: OrganizationalState): Signal[] {
  return state.signals
    .filter((s) => SEVERITY_RANK[s.severity] >= SEVERITY_RANK.medium)
    .sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}

function generalStatusAnswer(state: OrganizationalState): AlexisResponse {
  const project = activeProject(state.organization);
  const activeSignals = state.signals.filter((s) => s.status === "active");
  const sources: AlexisSource[] = activeSignals.map(sourceFromSignal);

  let answer = `Organizational health is ${healthLabel(state.overallHealth)}, with ${activeSignals.length} active signal${activeSignals.length === 1 ? "" : "s"}.`;
  if (project) {
    answer += ` The active project is ${project.name} (${project.status}).`;
    sources.push({ kind: "project", id: project.id, label: project.name });
  }
  return { answer, sources };
}

function changedAnswer(state: OrganizationalState): AlexisResponse {
  const recent = [...state.organization.events]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 3);

  if (recent.length === 0) {
    return { answer: "No recorded organizational changes yet.", sources: [] };
  }

  const answer = `Recent changes: ${recent.map((e: OrganizationalEvent) => e.summary).join(" ")}`;
  const sources: AlexisSource[] = recent.map((e) => ({ kind: "event", id: e.id, label: e.summary }));
  return { answer, sources };
}

function attentionAnswer(state: OrganizationalState): AlexisResponse {
  const signals = attentionSignals(state);
  if (signals.length === 0) {
    return { answer: "Nothing currently requires attention.", sources: [] };
  }
  const answer = `${signals.length} item${signals.length === 1 ? "" : "s"} require attention: ${signals
    .map((s) => `[${s.severity}] ${s.explanation}`)
    .join(" ")}`;
  return { answer, sources: signals.map(sourceFromSignal) };
}

function whyRiskAnswer(state: OrganizationalState): AlexisResponse {
  const risk = topRiskSignal(state);
  if (!risk) {
    return { answer: "There is no active risk signal to explain right now.", sources: [] };
  }
  return {
    answer: `This is a ${risk.severity} severity risk because: ${risk.explanation}`,
    sources: [sourceFromSignal(risk)],
  };
}

function missingCapabilitiesAnswer(state: OrganizationalState): AlexisResponse {
  const gapEntries = Object.values(state.capabilityGapsByProject).flat().filter((gap) => gap.isGap);
  if (gapEntries.length === 0) {
    return { answer: "No capability shortages are currently detected across active projects.", sources: [] };
  }
  const answer = `We are short on ${gapEntries.length} capabilit${gapEntries.length === 1 ? "y" : "ies"}: ${gapEntries
    .map((g) => `${g.capabilityName} (${g.availableUnits} of ${g.requiredUnits} units available)`)
    .join("; ")}.`;
  const sources: AlexisSource[] = gapEntries.map((g) => ({ kind: "capability", id: g.capabilityId, label: g.capabilityName }));
  return { answer, sources };
}

function whatToDoAnswer(state: OrganizationalState): AlexisResponse {
  const recommendations = [...state.recommendations].sort(
    (a, b) => (b.priority === "high" ? 2 : b.priority === "medium" ? 1 : 0) - (a.priority === "high" ? 2 : a.priority === "medium" ? 1 : 0)
  );
  if (recommendations.length === 0) {
    return { answer: "No action is recommended right now.", sources: [] };
  }
  const answer = recommendations.map((r) => `${r.title}: ${r.suggestedAction}`).join(" ");
  const sources: AlexisSource[] = recommendations.map((r) => ({ kind: "recommendation", id: r.id, label: r.title }));
  return { answer, sources };
}

function briefingAnswer(state: OrganizationalState): AlexisResponse {
  const project = activeProject(state.organization);
  const risk = topRiskSignal(state);
  const topRecommendation = state.recommendations.find((r) => r.priority === "high") ?? state.recommendations[0];
  const sources: AlexisSource[] = [];

  const parts: string[] = [`Executive briefing. Organizational health: ${healthLabel(state.overallHealth)}.`];

  if (project) {
    const gapEntries = (state.capabilityGapsByProject[project.id] ?? []).filter((g) => g.isGap);
    parts.push(
      `Active project: ${project.name}, status ${project.status}${
        gapEntries.length > 0 ? `, with a capability gap of ${gapEntries.length} area(s)` : ""
      }.`
    );
    sources.push({ kind: "project", id: project.id, label: project.name });
  }

  if (risk) {
    parts.push(`Top risk: ${risk.explanation} (${risk.severity}).`);
    sources.push(sourceFromSignal(risk));
  }

  if (topRecommendation) {
    parts.push(`Recommendation: ${topRecommendation.title} — ${topRecommendation.suggestedAction}`);
    sources.push({ kind: "recommendation", id: topRecommendation.id, label: topRecommendation.title });
  }

  return { answer: parts.join(" "), sources };
}

function fallbackAnswer(state: OrganizationalState): AlexisResponse {
  return {
    answer:
      `I can answer questions about what's happening in the organization, what changed, what requires attention, ` +
      `why something is a risk, what capabilities are missing, what we should do, and give an executive briefing. ` +
      `Right now, overall health is ${healthLabel(state.overallHealth)}.`,
    sources: [],
  };
}

type IntentMatcher = { pattern: RegExp; handler: (state: OrganizationalState) => AlexisResponse };

const INTENTS: IntentMatcher[] = [
  { pattern: /executive briefing|brief me|briefing/i, handler: briefingAnswer },
  { pattern: /what should we do|what to do|recommend/i, handler: whatToDoAnswer },
  { pattern: /why.*(risk|is this)/i, handler: whyRiskAnswer },
  { pattern: /require(s)? attention|concern|worried|worry/i, handler: attentionAnswer },
  { pattern: /what changed|changed\??$/i, handler: changedAnswer },
  { pattern: /delivery risk|current risk|risk level/i, handler: whyRiskAnswer },
  { pattern: /capabilit(y|ies).*(short|gap|missing)|short on|missing/i, handler: missingCapabilitiesAnswer },
  { pattern: /happening.*organization|what.*happening|new project|project status|active project/i, handler: generalStatusAnswer },
];

export const deterministicAlexisEngine: AlexisEngine = {
  ask(question, state) {
    const matched = INTENTS.find((intent) => intent.pattern.test(question));
    return (matched ?? { handler: fallbackAnswer }).handler(state);
  },
};
