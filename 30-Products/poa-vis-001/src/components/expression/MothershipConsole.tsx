"use client";

import { useMemo, useState } from "react";
import type { OrganizationalState, SignalSeverity } from "@/lib/domain/types";
import type { AlexisSource } from "@/lib/alexis/types";
import type { OrganizationalVisualProfile } from "@/lib/expression/types";
import {
  mapStateToMothership,
  resolveEventHighlight,
  resolveSourceHighlight,
  type EventHighlight,
  type MothershipDomainKey,
} from "@/lib/expression/mothership-mapping";
import { Panel, SeverityLabel, StatusDot } from "@/components/ui";
import { AlexisPanel } from "@/components/alexis/AlexisPanel";

/**
 * Organizational Mothership console (POA-VIS-004). Renders
 * `mapStateToMothership(state, profile)` as one central Organizational
 * Core, three domains (People / Projects / Capabilities), the capability
 * consequence chain (mission section 6), and signal/risk/opportunity
 * satellites — this component computes NOTHING organizational: it only
 * lays out and colors nodes/edges the pure mapping layer already selected.
 *
 * Motion (mission section 11/12): a single restrained heartbeat on the
 * core (.poa-heartbeat), signal-driven pulse on high/critical risk nodes
 * only (.poa-pulse, same rule as the Network profile), and a one-time
 * opportunity bloom (.poa-bloom-ring) — never perpetual/decorative
 * elsewhere.
 */

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 620;
const CENTER = { x: VIEW_WIDTH / 2, y: VIEW_HEIGHT / 2 };
const DOMAIN_RADIUS = 120;
const OUTER_RADIUS = 250;
const SATELLITE_OFFSET = 1.22;

const SEVERITY_FILL: Record<SignalSeverity, string> = {
  info: "var(--poa-accent)",
  low: "var(--poa-status-healthy)",
  medium: "var(--poa-status-attention)",
  high: "var(--poa-status-attention)",
  critical: "var(--poa-status-at-risk)",
};

const PRESSURE_SCALE: Record<SignalSeverity, number> = { info: 0, low: 0, medium: 8, high: 14, critical: 20 };

const DOMAIN_ORDER: MothershipDomainKey[] = ["people", "projects", "capabilities"];

function angleForIndex(index: number, count: number) {
  return (index / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
}

/**
 * Math.cos/Math.sin are not guaranteed bit-identical across V8 builds
 * (server vs. browser), which otherwise surfaces as a React hydration
 * mismatch once the full-precision float is serialized into an SVG
 * attribute. Rounding every computed coordinate to a fixed precision
 * before it reaches JSX makes SSR and CSR serialize identically.
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function pointAt(center: { x: number; y: number }, radius: number, angle: number) {
  return { x: round(center.x + radius * Math.cos(angle)), y: round(center.y + radius * Math.sin(angle)) };
}

/** Spreads sibling nodes across a narrow arc centered on their domain's angle, so projects/capabilities cluster near the domain they belong to rather than colliding with an unrelated domain's arc. */
function arcPosition(domainAngle: number, index: number, count: number, radius: number) {
  const spread = Math.min((Math.PI / 3.2) * Math.max(count - 1, 0), Math.PI / 1.6);
  const start = domainAngle - spread / 2;
  const angle = count <= 1 ? domainAngle : start + (spread * index) / (count - 1);
  return pointAt(CENTER, radius, angle);
}

export function MothershipConsole({
  state,
  profile,
}: {
  state: OrganizationalState;
  profile: OrganizationalVisualProfile;
}) {
  const model = useMemo(() => mapStateToMothership(state, profile), [state, profile]);

  /**
   * Unified highlight source (mission section 12 event response + section
   * 20 Alexis integration): either a selected timeline event or the most
   * recent Alexis response's sources. Both resolve through the same pure
   * mothership-mapping functions — this component never derives which
   * nodes are "affected" itself.
   */
  type HighlightSource = { kind: "event"; eventId: string } | { kind: "alexis"; sources: AlexisSource[] } | null;
  const [highlightSource, setHighlightSource] = useState<HighlightSource>(null);

  const highlight: EventHighlight | null = useMemo(() => {
    if (!highlightSource) return null;
    if (highlightSource.kind === "event") {
      const event = state.organization.events.find((e) => e.id === highlightSource.eventId);
      return event ? resolveEventHighlight(event, state) : null;
    }
    return resolveSourceHighlight(highlightSource.sources, state);
  }, [highlightSource, state]);

  const activeEventId = highlightSource?.kind === "event" ? highlightSource.eventId : null;

  const highlightedNodeIds = useMemo(() => {
    if (!highlight) return new Set<string>();
    return new Set<string>([
      ...highlight.domainKeys.map((k) => `domain:${k}`),
      ...highlight.projectIds.map((id) => `project:${id}`),
      ...highlight.capabilityIds.map((id) => `capability:${id}`),
      ...highlight.signalIds.map((id) => `signal:${id}`),
    ]);
  }, [highlight]);

  const domainAngles = new Map(DOMAIN_ORDER.map((key, index) => [key, angleForIndex(index, DOMAIN_ORDER.length)]));
  const positionById = new Map<string, { x: number; y: number }>();
  positionById.set(model.core.id, CENTER);

  for (const domain of model.domains) {
    const angle = domainAngles.get(domain.key)!;
    positionById.set(domain.id, pointAt(CENTER, DOMAIN_RADIUS, angle));
  }

  const projectsAngle = domainAngles.get("projects")!;
  model.projects.forEach((project, index) => {
    positionById.set(project.id, arcPosition(projectsAngle, index, model.projects.length, OUTER_RADIUS));
  });

  const capabilitiesAngle = domainAngles.get("capabilities")!;
  model.capabilities.forEach((capability, index) => {
    positionById.set(capability.id, arcPosition(capabilitiesAngle, index, model.capabilities.length, OUTER_RADIUS));
  });

  for (const signal of model.signals) {
    const anchorId = signal.affectedProjectIds[0] ?? signal.affectedCapabilityIds[0];
    const anchor = anchorId ? positionById.get(anchorId) : undefined;
    if (anchor) {
      positionById.set(signal.id, {
        x: round(CENTER.x + (anchor.x - CENTER.x) * SATELLITE_OFFSET),
        y: round(CENTER.y + (anchor.y - CENTER.y) * SATELLITE_OFFSET),
      });
    } else {
      const peopleAngle = domainAngles.get("people")!;
      positionById.set(signal.id, pointAt(CENTER, DOMAIN_RADIUS * 1.6, peopleAngle));
    }
  }

  const timelineEvents = [...state.organization.events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <div className="space-y-6">
      {/*
        Intentional mobile/compact expression (mission section 16): below
        `md`, the radial SVG core (whose node/label sizes are tuned for a
        ~900px desktop viewBox) is replaced by a stacked, text-first
        summary of the SAME model — not the desktop canvas shrunk down.
      */}
      <div className="block md:hidden">
        <Panel eyebrow={profile.visualMetaphor} title={profile.name}>
          <div className="flex items-center gap-2">
            <StatusDot status={model.health} />
            <p className="text-sm text-poa-text">
              {model.core.detail} — {model.health === "at-risk" ? "at risk" : model.health}
            </p>
          </div>
          {model.domains.map((domain) => (
            <div key={domain.id} className="mt-4 border-t border-poa-border pt-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-poa-text-faint">
                {domain.label} · {domain.count}
              </p>
              <p className="mt-1 text-sm text-poa-text-muted">{domain.detail}</p>
              {domain.key === "projects" && (
                <ul className="mt-2 space-y-1.5">
                  {model.projects.map((project) => (
                    <li key={project.id} className="flex items-center justify-between text-sm">
                      <span className="text-poa-text">{project.label}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wide ${project.hasGap ? "text-poa-attention" : "text-poa-text-muted"}`}>
                        {project.status}
                        {project.hasGap ? " · gap" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {domain.key === "capabilities" && (
                <ul className="mt-2 space-y-1.5">
                  {model.capabilities
                    .filter((c) => c.isGap)
                    .map((capability) => (
                      <li key={capability.id} className="flex items-center justify-between text-sm">
                        <span className="text-poa-text">{capability.label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wide text-poa-at-risk">gap</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </Panel>
      </div>

      <div className="hidden md:block">
      <Panel eyebrow={profile.visualMetaphor} title={profile.name}>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label={`${model.core.label}: ${model.projects.length} project(s), ${model.capabilities.length} connected capabilit(y/ies), ${model.signals.length} signal(s), overall health ${model.health}.`}
          className="w-full"
        >
          {model.edges.map((edge, index) => {
            const from = positionById.get(edge.fromId);
            const to = positionById.get(edge.toId);
            if (!from || !to) return null;
            const isGapThread = edge.kind === "capability-thread" && edge.isGap;
            return (
              <line
                key={`${edge.fromId}-${edge.toId}-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isGapThread ? "var(--poa-status-at-risk)" : "var(--poa-border)"}
                strokeWidth={isGapThread ? 1.5 : 1}
                strokeDasharray={isGapThread ? "3 3" : undefined}
                opacity={edge.kind === "signal" ? 0.5 : 1}
              />
            );
          })}

          {/* Organizational Core — restrained idle heartbeat (mission section 11) */}
          {(() => {
            const pos = positionById.get(model.core.id)!;
            const isHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(model.core.id);
            return (
              <g className="poa-heartbeat" opacity={isHighlighted ? 1 : 0.35}>
                <circle cx={pos.x} cy={pos.y} r={36} fill="var(--poa-panel-raised)" stroke="var(--poa-accent)" strokeWidth={2} aria-label={`${model.core.label}: ${model.core.detail}`} />
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="fill-poa-text font-mono text-[10px] uppercase tracking-wide">
                  Core
                </text>
              </g>
            );
          })()}

          {/* Domains */}
          {model.domains.map((domain) => {
            const pos = positionById.get(domain.id)!;
            const isHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(domain.id);
            return (
              <g key={domain.id} opacity={isHighlighted ? 1 : 0.35}>
                <circle cx={pos.x} cy={pos.y} r={26} fill="var(--poa-panel)" stroke="var(--poa-border)" strokeWidth={1.5} aria-label={`${domain.label} domain: ${domain.count}. ${domain.detail}`} />
                <text x={pos.x} y={pos.y - 2} textAnchor="middle" className="fill-poa-text font-mono text-[10px] uppercase tracking-wide">
                  {domain.label}
                </text>
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" className="fill-poa-text-muted font-mono text-[9px]">
                  {domain.count}
                </text>
              </g>
            );
          })}

          {/* Projects */}
          {model.projects.map((project) => {
            const pos = positionById.get(project.id)!;
            const isHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(project.id);
            const fill = project.hasGap ? "var(--poa-status-attention)" : "var(--poa-status-healthy)";
            return (
              <g key={project.id} opacity={isHighlighted ? 1 : 0.35}>
                <circle cx={pos.x} cy={pos.y} r={16} fill={fill} fillOpacity={0.3} stroke={fill} strokeWidth={1.5} aria-label={`${profile.terminology.projectLabel}: ${project.label}, ${project.status}${project.hasGap ? ", has a capability gap" : ""}`} />
                <text x={pos.x} y={pos.y + 30} textAnchor="middle" className="fill-poa-text-muted font-mono text-[9px] uppercase tracking-wide">
                  {project.label}
                </text>
              </g>
            );
          })}

          {/* Capabilities */}
          {model.capabilities.map((capability) => {
            const pos = positionById.get(capability.id)!;
            const isHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(capability.id);
            const fill = capability.isGap ? "var(--poa-status-at-risk)" : "var(--poa-status-healthy)";
            return (
              <g key={capability.id} opacity={isHighlighted ? 1 : 0.35}>
                <circle cx={pos.x} cy={pos.y} r={10} fill={fill} fillOpacity={capability.isGap ? 0.7 : 0.25} stroke={fill} strokeWidth={1.5} aria-label={`${profile.terminology.capabilityGapLabel}: ${capability.label}${capability.isGap ? " — gap" : " — supplied"}`} />
                <text x={pos.x} y={pos.y + 22} textAnchor="middle" className="fill-poa-text-faint font-mono text-[8px] uppercase tracking-wide">
                  {capability.label}
                </text>
              </g>
            );
          })}

          {/* Signals — risk/capability-gap/organizational-health vs. opportunity get distinct visual languages (mission section 8/9) */}
          {model.signals.map((signal) => {
            const pos = positionById.get(signal.id)!;
            const isHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(signal.id);
            const fill = SEVERITY_FILL[signal.severity];
            const isOpportunity = signal.kind === "opportunity";
            const isPulsing = !isOpportunity && (signal.severity === "high" || signal.severity === "critical");
            const pressureRadius = 9 + PRESSURE_SCALE[signal.severity];

            return (
              <g key={signal.id} opacity={isHighlighted ? 1 : 0.35}>
                {isOpportunity && (
                  <circle className="poa-bloom-ring" cx={pos.x} cy={pos.y} r={9} fill="none" stroke={fill} strokeWidth={1.5} />
                )}
                {!isOpportunity && pressureRadius > 9 && (
                  <circle cx={pos.x} cy={pos.y} r={pressureRadius} fill="none" stroke={fill} strokeWidth={1} opacity={0.3} />
                )}
                <g className={isPulsing ? "poa-pulse" : undefined}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={9}
                    fill={fill}
                    fillOpacity={0.85}
                    stroke={fill}
                    strokeWidth={1.5}
                    aria-label={`${signal.kind === "risk" ? profile.terminology.riskLabel : signal.label}: ${signal.detail}`}
                  />
                </g>
              </g>
            );
          })}
        </svg>
      </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {model.domains.map((domain) => (
          <Panel key={domain.id} eyebrow={domain.label} title={String(domain.count)}>
            <p className="text-sm text-poa-text-muted">{domain.detail}</p>
          </Panel>
        ))}
      </div>

      <Panel eyebrow="Organizational Health" title={model.health === "at-risk" ? "At Risk" : model.health === "attention" ? "Needs Attention" : "Healthy"}>
        <div className="flex items-center gap-2">
          <StatusDot status={model.health} />
          <p className="text-sm text-poa-text-muted">
            {model.signals.length} active signal{model.signals.length === 1 ? "" : "s"} across {model.projects.length} project{model.projects.length === 1 ? "" : "s"}.
          </p>
        </div>
      </Panel>

      <Panel eyebrow="Event Response" title="Organizational timeline">
        <p className="mb-3 text-xs text-poa-text-muted">
          {highlightSource?.kind === "event"
            ? "Organizational event selected — affected core, domains, and signals are highlighted above."
            : highlightSource?.kind === "alexis"
              ? "Alexis's answer is highlighted above — the organizational area it cites."
              : "Organization at rest. Select an event, or ask Alexis, to see the visual response propagate through the core."}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHighlightSource(null)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              highlightSource === null
                ? "border-poa-accent text-poa-text"
                : "border-poa-border text-poa-text-muted hover:border-poa-accent hover:text-poa-text"
            }`}
          >
            Organization at rest
          </button>
          {timelineEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setHighlightSource({ kind: "event", eventId: event.id })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                activeEventId === event.id
                  ? "border-poa-accent text-poa-text"
                  : "border-poa-border text-poa-text-muted hover:border-poa-accent hover:text-poa-text"
              }`}
            >
              {event.summary}
            </button>
          ))}
        </div>
      </Panel>

      <AlexisPanel state={state} onResponse={(response) => setHighlightSource({ kind: "alexis", sources: response.sources })} />

      <Panel eyebrow="Signals" title="Detail">
        <ul className="space-y-3 border-t border-poa-border pt-4">
          {model.signals.map((signal) => (
            <li key={signal.id} className="flex items-start justify-between gap-3 border-l-2 border-poa-border pl-4">
              <p className="text-sm text-poa-text">{signal.detail}</p>
              <SeverityLabel severity={signal.severity} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
