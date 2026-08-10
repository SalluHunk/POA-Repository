import Link from "next/link";
import { getOrganizationalState } from "@/lib/organizational-state";
import { AppShell } from "@/components/AppShell";
import { MissionConsole } from "@/components/MissionConsole";

/**
 * The POA Reference Expression Profile route (POA-VIS-003 MISSION 9) — the
 * original VIS-001/VIS-002 Mission Console, unmodified. See
 * src/lib/expression/profiles.ts (`referenceProfile`) for this profile's
 * OrganizationalVisualProfile metadata.
 */
export default function Home() {
  const state = getOrganizationalState();

  return (
    <AppShell
      organizationName={state.organization.name}
      overallHealth={state.overallHealth}
      expressionSwitcher={
        <Link
          href="/expression/network"
          className="font-mono text-[11px] uppercase tracking-wide text-poa-text-muted underline decoration-poa-border underline-offset-4 hover:text-poa-text"
        >
          View Network Expression →
        </Link>
      }
    >
      <MissionConsole state={state} />
    </AppShell>
  );
}
