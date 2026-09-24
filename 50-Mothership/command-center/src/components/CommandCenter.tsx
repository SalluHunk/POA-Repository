import { Greeting } from "./Greeting";
import { OrganizationalPulse } from "./OrganizationalPulse";
import { AttentionPanel } from "./AttentionPanel";
import { ActivityPanel } from "./ActivityPanel";
import { CommandBar } from "./CommandBar";
import { QuickPrompts } from "./QuickPrompts";
import type { AuthorizationDecisionRecord, Mission, MissionDetail, Principal } from "../api/types";
import type { AttentionItem } from "../state/attention";

interface Props {
  missions: Mission[];
  principals: Principal[];
  missionDetails: Map<string, MissionDetail>;
  decisions: AuthorizationDecisionRecord[];
  attention: AttentionItem[];
  loading: boolean;
  error: string | null;
  lookupError: string | null;
  onFocusMission: (id: string) => void;
  onLookup: (query: string) => void;
  onAsk: (q: string) => void;
  isKnownId: (id: string) => boolean;
  listening: boolean;
  onToggleListen: () => void;
}

/**
 * The Executive Home / Presence surface (POA Command.dc.html's default
 * surface) - Greeting, OrganizationalPulse, AttentionPanel, ActivityPanel,
 * CommandBar, QuickPrompts. Mounts only at Presence depth. Individual
 * mission/principal markers live in the sibling OrbitMarkers component
 * instead (mounted persistently at App.tsx, alongside Environment) so
 * they stay visible - spatially connected to their origin - through
 * Focus/Investigate rather than disappearing with this surface.
 */
export function CommandCenter({ missions, principals, missionDetails, decisions, attention, loading, error, lookupError, onFocusMission, onLookup, onAsk, isKnownId, listening, onToggleListen }: Props) {
  const details = [...missionDetails.values()];
  const verified = details.filter((d) => d.witnessCode === "MATCH").length;
  const unverified = details.length - verified;
  const granted = decisions.filter((d) => d.granted).length;
  const denied = decisions.length - granted;
  const activePeople = principals.filter((p) => p.active).length;

  const headline = loading ? "Reading the organization…" : "Your organization is stable.";
  const subline = loading
    ? ""
    : attention.length === 0
      ? "Nothing requires attention."
      : attention.length === 1
        ? "1 thing requires attention."
        : `${attention.length} things require attention.`;

  const pulseLabel = loading ? "READING" : attention.length > 0 ? "ATTENTION" : "STABLE";
  const pulseColor = loading ? "var(--text-faint)" : attention.length > 0 ? "var(--amber)" : "var(--green)";

  return (
    <div className="fade-in" style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }}>
      <Greeting headline={headline} subline={subline} />
      <OrganizationalPulse
        pulseLabel={pulseLabel}
        pulseColor={pulseColor}
        stats={[
          { v: String(missions.length), k: "Missions", sub: `${attention.length} flagged` },
          { v: `${activePeople}/${principals.length}`, k: "People", sub: "Active" },
          { v: `${verified}/${unverified}`, k: "Evidence", sub: "Verified / unverified" },
          { v: `${granted}/${denied}`, k: "Authority", sub: "Granted / denied" },
        ]}
      />
      <div style={{ position: "fixed", right: 32, top: 104, zIndex: 2, width: 344, maxHeight: 860, display: "flex", flexDirection: "column", gap: 18, pointerEvents: "none" }}>
        <AttentionPanel attention={attention} onFocusMission={onFocusMission} />
        <ActivityPanel decisions={decisions} />
      </div>

      {error && (
        <div className="mono" style={{ position: "fixed", left: "50%", bottom: 180, transform: "translateX(-50%)", color: "var(--red)", fontSize: 12.5, pointerEvents: "auto" }}>
          {error}
        </div>
      )}

      <CommandBar onAsk={onAsk} onLookup={onLookup} isKnownId={isKnownId} lookupError={lookupError} listening={listening} onToggleListen={onToggleListen} />
      <QuickPrompts onAsk={onAsk} />
    </div>
  );
}
