import type { OrganizationalState } from "@/lib/domain/types";
import type { OrganizationalVisualProfile } from "@/lib/expression/types";
import { mapStateToNetworkGraph, type GraphNode } from "@/lib/expression/network-mapping";
import { Panel, SeverityLabel } from "@/components/ui";

/**
 * Network / Organizational Graph console (POA-VIS-003 MISSION 15,
 * PROFILE B). Renders `mapStateToNetworkGraph(state, profile)` as a
 * node/edge topology — an SVG diagram, not a panel grid. This component
 * computes NOTHING organizational: it only lays out nodes/edges it was
 * handed and maps severity to color/motion.
 *
 * Motion (mission section 12): only "high"/"critical" severity signal
 * nodes pulse (`.poa-pulse` in globals.css) — a direct, restrained mapping
 * from SIGNAL to VISUAL RESPONSE. Nothing else on this page animates
 * continuously.
 */

const SEVERITY_FILL: Record<string, string> = {
  info: "var(--poa-accent)",
  low: "var(--poa-status-healthy)",
  medium: "var(--poa-status-attention)",
  high: "var(--poa-status-attention)",
  critical: "var(--poa-status-at-risk)",
};

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 520;
const CENTER = { x: VIEW_WIDTH / 2, y: VIEW_HEIGHT / 2 };
const PROJECT_RING_RADIUS = 150;
const SIGNAL_RING_RADIUS = 235;

function ringPosition(center: { x: number; y: number }, radius: number, index: number, count: number) {
  const angle = (index / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
  return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
}

export function NetworkGraphConsole({
  state,
  profile,
}: {
  state: OrganizationalState;
  profile: OrganizationalVisualProfile;
}) {
  const graph = mapStateToNetworkGraph(state, profile);

  const projectNodes = graph.nodes.filter((node) => node.kind === "project");
  const signalNodes = graph.nodes.filter((node) => node.kind === "signal");
  const coreNode = graph.nodes.find((node) => node.kind === "organization");

  const positionById = new Map<string, { x: number; y: number }>();
  if (coreNode) positionById.set(coreNode.id, CENTER);
  projectNodes.forEach((node, index) => {
    positionById.set(node.id, ringPosition(CENTER, PROJECT_RING_RADIUS, index, projectNodes.length));
  });
  signalNodes.forEach((node, index) => {
    positionById.set(node.id, ringPosition(CENTER, SIGNAL_RING_RADIUS, index, signalNodes.length));
  });

  const radiusForKind = (kind: GraphNode["kind"]) => (kind === "organization" ? 30 : kind === "project" ? 20 : 12);

  return (
    <Panel eyebrow={profile.visualMetaphor} title={profile.name}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`${profile.terminology.organizationalCoreLabel} topology: ${projectNodes.length} ${profile.terminology.projectLabel.toLowerCase()}(s), ${signalNodes.length} ${profile.terminology.signalLabel.toLowerCase()}(s)`}
        className="w-full"
      >
        {graph.edges.map((edge, index) => {
          const from = positionById.get(edge.fromId);
          const to = positionById.get(edge.toId);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.fromId}-${edge.toId}-${index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--poa-border)"
              strokeWidth={1}
            />
          );
        })}

        {graph.nodes.map((node) => {
          const position = positionById.get(node.id);
          if (!position) return null;
          const fill = node.severity ? SEVERITY_FILL[node.severity] : "var(--poa-text-muted)";
          const isPulsing = node.severity === "high" || node.severity === "critical";
          return (
            <g key={node.id} className={isPulsing ? "poa-pulse" : undefined}>
              <circle cx={position.x} cy={position.y} r={radiusForKind(node.kind)} fill={fill} fillOpacity={node.kind === "signal" ? 0.85 : 0.25} stroke={fill} strokeWidth={1.5}>
                <title>
                  {node.label}: {node.detail}
                </title>
              </circle>
              <text
                x={position.x}
                y={position.y + radiusForKind(node.kind) + 14}
                textAnchor="middle"
                className="fill-poa-text-muted font-mono text-[9px] uppercase tracking-wide"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="mt-6 space-y-3 border-t border-poa-border pt-4">
        {signalNodes.map((node) => (
          <li key={node.id} className="flex items-start justify-between gap-3 border-l-2 border-poa-border pl-4">
            <p className="text-sm text-poa-text">{node.detail}</p>
            {node.severity && <SeverityLabel severity={node.severity} />}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
