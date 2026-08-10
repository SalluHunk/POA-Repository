import type { OrganizationalVisualProfile } from "@/lib/expression/types";
import { POA_VISUAL_DNA } from "@/lib/expression/visual-dna";

/**
 * POA Reference Expression Profile (POA-VIS-003 MISSION 9).
 *
 * This is metadata ABOUT the existing VIS-001/VIS-002 console — it is not
 * declared to be the final POA visual design, and the console it describes
 * (AppShell + MissionConsole + panels) is intentionally left unmodified by
 * this mission. Its component tree does not read these fields back at
 * render time; the fields exist so the profile is inspectable, testable,
 * and comparable to other profiles, and so a future profile-driven renderer
 * has a documented baseline to match against.
 */
export const referenceProfile: OrganizationalVisualProfile = {
  id: "poa-reference",
  name: "POA Reference Expression Profile",
  description:
    "The original POA-VIS-001/VIS-002 Mission Console: panel-grid dashboard, briefing-first, conversational access via Alexis.",
  isReferenceProfile: true,

  visualIdentity: {
    sharedPrinciples: POA_VISUAL_DNA,
    accentDescription: "Calm control-system aesthetic; single desaturated accent reserved for status signals.",
  },
  visualMetaphor: "Command console",
  spatialComposition: "panel-grid",
  visualizationVocabulary: ["panel", "badge", "list", "status-dot"],
  metricPresentation: "numeric-badge",
  signalPresentation: "list-with-callout",
  severityPresentation: "color-coded-label",
  motionLanguage: "entrance-fade-only",
  informationDensity: "executive-summary",
  executivePresentation: "briefing-first",
  navigationModel: "single-scroll-panels",
  interactionPatterns: ["ask-alexis", "hover-for-detail"],
  terminology: {
    organizationalCoreLabel: "Organization",
    signalLabel: "Signal",
    riskLabel: "Risk",
    capabilityGapLabel: "Capability Gap",
    projectLabel: "Project",
    recommendationLabel: "Recommendation",
  },
};

/**
 * Network / Organizational Graph demonstration profile (POA-VIS-003
 * MISSION 15, PROFILE B). Renders the SAME OrganizationalState as the
 * reference profile, as a node/edge topology instead of a panel grid — the
 * critical proof point that expression can change without organizational
 * truth changing (mission section 8).
 *
 * This is a demonstration profile, not a production industry profile
 * (mission section 17, NON-GOALS).
 */
export const networkGraphProfile: OrganizationalVisualProfile = {
  id: "network-graph",
  name: "Network / Organizational Graph",
  description:
    "Demonstration expression: the organizational core, its projects, and active signals as a node/edge topology. Same signals, capability gaps, and risk as the reference profile — only the expression changes.",
  isReferenceProfile: false,

  visualIdentity: {
    sharedPrinciples: POA_VISUAL_DNA,
    accentDescription: "Topology-first framing; severity communicated by node color and, for high/critical signals only, motion.",
  },
  visualMetaphor: "Organizational graph",
  spatialComposition: "radial-network",
  visualizationVocabulary: ["node", "edge", "pulse"],
  metricPresentation: "node-scale",
  signalPresentation: "graph-node",
  severityPresentation: "color-and-motion",
  motionLanguage: "signal-driven-pulse",
  informationDensity: "structural-overview",
  executivePresentation: "topology-first",
  navigationModel: "single-viewport-graph",
  interactionPatterns: ["hover-for-detail"],
  terminology: {
    organizationalCoreLabel: "Organizational Core",
    signalLabel: "Disruption Pulse",
    riskLabel: "Risk Field",
    capabilityGapLabel: "Capability Pressure",
    projectLabel: "Project Node",
    recommendationLabel: "Recommended Response",
  },
};
