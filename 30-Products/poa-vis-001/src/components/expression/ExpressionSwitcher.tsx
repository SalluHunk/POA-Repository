import Link from "next/link";
import type { ExpressionProfileId } from "@/lib/expression/types";
import { listExpressionProfiles } from "@/lib/expression/registry";

const ROUTE_BY_PROFILE_ID: Record<ExpressionProfileId, string> = {
  "poa-reference": "/",
  "network-graph": "/expression/network",
  mothership: "/expression/mothership",
};

/**
 * Links to every OTHER registered OrganizationalVisualProfile (POA-VIS-003
 * registry, extended for POA-VIS-004's third profile). Reads
 * `listExpressionProfiles()` instead of hard-coding each route, so a future
 * profile only needs an entry here plus one in ROUTE_BY_PROFILE_ID — not a
 * change on every existing page.
 */
export function ExpressionSwitcher({ currentProfileId }: { currentProfileId: ExpressionProfileId }) {
  const others = listExpressionProfiles().filter((profile) => profile.id !== currentProfileId);

  return (
    <div className="flex items-center gap-4">
      {others.map((profile) => (
        <Link
          key={profile.id}
          href={ROUTE_BY_PROFILE_ID[profile.id]}
          className="font-mono text-[11px] uppercase tracking-wide text-poa-text-muted underline decoration-poa-border underline-offset-4 hover:text-poa-text"
        >
          {profile.name}
        </Link>
      ))}
    </div>
  );
}
