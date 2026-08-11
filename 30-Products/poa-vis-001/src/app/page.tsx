import { getOrganizationalState } from "@/lib/organizational-state";
import { AppShell } from "@/components/AppShell";
import { MissionConsole } from "@/components/MissionConsole";
import { ExpressionSwitcher } from "@/components/expression/ExpressionSwitcher";

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
      expressionSwitcher={<ExpressionSwitcher currentProfileId="poa-reference" />}
    >
      <MissionConsole state={state} />
    </AppShell>
  );
}
