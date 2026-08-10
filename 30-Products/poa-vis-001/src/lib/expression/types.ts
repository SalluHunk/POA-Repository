/**
 * The Expression Layer type model (POA-VIS-003).
 *
 * POA CORE (src/lib/domain, src/lib/services, src/lib/organizational-state,
 * src/lib/alexis) determines organizational truth: entities, state, risk,
 * capability gaps, signals, recommendations. It must never import from this
 * module or from src/components.
 *
 * The EXPRESSION LAYER (this directory + src/components/expression, plus
 * the existing src/components/* console as the reference implementation)
 * determines how that truth is experienced. It reads OrganizationalState
 * and an OrganizationalVisualProfile; it never derives new organizational
 * facts (no scoring, thresholding, or aggregation belongs here — that is
 * POA Core's job).
 *
 * Pipeline (mission spec):
 *   OrganizationalState -> OrganizationalSignals -> ExpressionProfile
 *   -> Visualization Components -> Console
 */

export type ExpressionProfileId = "poa-reference" | "network-graph";

/** What this profile shares with every other POA expression, plus what makes it distinct. */
export interface VisualIdentity {
  /** Same array reference as POA_VISUAL_DNA in every profile — proves the shared grammar isn't restated/drifted. */
  sharedPrinciples: readonly string[];
  /** What makes this profile visually distinct within that shared grammar. */
  accentDescription: string;
}

/** How a project/signal/gap count is rendered as a number or magnitude. */
export type MetricPresentation = "numeric-badge" | "node-scale";

/** How an individual signal is surfaced to the viewer. */
export type SignalPresentation = "list-with-callout" | "graph-node";

/** How severity is communicated. */
export type SeverityPresentation = "color-coded-label" | "color-and-motion";

/** What triggers motion, if anything. Restrained by construction (mission section 12) — never perpetual/decorative. */
export type MotionLanguage = "entrance-fade-only" | "signal-driven-pulse";

/** How much is shown at once. */
export type InformationDensity = "executive-summary" | "structural-overview";

/** What the viewer sees first. */
export type ExecutivePresentation = "briefing-first" | "topology-first";

/** How the viewer moves through the console. */
export type NavigationModel = "single-scroll-panels" | "single-viewport-graph";

/** Display-label overrides. Same underlying Signal/Risk/CapabilityGap record — only the label changes (mission section 8). */
export interface Terminology {
  organizationalCoreLabel: string;
  signalLabel: string;
  riskLabel: string;
  capabilityGapLabel: string;
  projectLabel: string;
  recommendationLabel: string;
}

/**
 * The typed, explicit model for an OrganizationalVisualProfile
 * (POA-VIS-003 MISSION 3). Everything on this interface is
 * client-configurable (mission section 13, "CONFIGURABLE"); nothing on it
 * may express organizational truth — that stays in POA Core / OrganizationalState.
 */
export interface OrganizationalVisualProfile {
  id: ExpressionProfileId;
  name: string;
  description: string;
  /** Whether this profile is the POA Reference Expression Profile (mission section 9) — the preserved VIS-002 console. */
  isReferenceProfile: boolean;

  visualIdentity: VisualIdentity;
  /** Free-text metaphor label, e.g. "Command console" or "Organizational graph" (mission section 3). */
  visualMetaphor: string;
  spatialComposition: "panel-grid" | "radial-network";
  visualizationVocabulary: readonly string[];
  metricPresentation: MetricPresentation;
  signalPresentation: SignalPresentation;
  severityPresentation: SeverityPresentation;
  motionLanguage: MotionLanguage;
  informationDensity: InformationDensity;
  executivePresentation: ExecutivePresentation;
  navigationModel: NavigationModel;
  interactionPatterns: readonly string[];
  terminology: Terminology;

  /**
   * Extension point for a future industry-specific profile (mission section
   * 5/17 — non-goal to implement now). A new profile populates this without
   * POA Core or this type ever needing to change.
   */
  extensions?: Record<string, unknown>;
}
