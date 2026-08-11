import { getOrganizationalState } from "@/lib/organizational-state";
import { AppShell } from "@/components/AppShell";
import { NetworkGraphConsole } from "@/components/expression/NetworkGraphConsole";
import { ExpressionSwitcher } from "@/components/expression/ExpressionSwitcher";
import { networkGraphProfile } from "@/lib/expression/profiles";

/**
 * Network / Organizational Graph Expression Profile route (POA-VIS-003
 * MISSION 15, PROFILE B). Calls the SAME `getOrganizationalState()` as the
 * root route (`src/app/page.tsx`) — no separate data source, no
 * recomputation of risk/capability logic. Only the rendering differs.
 */
export default function NetworkExpressionPage() {
  const state = getOrganizationalState();

  return (
    <AppShell
      organizationName={state.organization.name}
      overallHealth={state.overallHealth}
      expressionSwitcher={<ExpressionSwitcher currentProfileId="network-graph" />}
    >
      <NetworkGraphConsole state={state} profile={networkGraphProfile} />
    </AppShell>
  );
}
