import { getOrganizationalState } from "@/lib/organizational-state";
import { AppShell } from "@/components/AppShell";
import { MothershipConsole } from "@/components/expression/MothershipConsole";
import { ExpressionSwitcher } from "@/components/expression/ExpressionSwitcher";
import { mothershipProfile } from "@/lib/expression/profiles";

/**
 * Organizational Mothership Expression Profile route (POA-VIS-004). Calls
 * the SAME `getOrganizationalState()` as every other route — no separate
 * data source, no recomputation of risk/capability logic. Only the
 * rendering differs.
 */
export default function MothershipExpressionPage() {
  const state = getOrganizationalState();

  return (
    <AppShell
      organizationName={state.organization.name}
      overallHealth={state.overallHealth}
      expressionSwitcher={<ExpressionSwitcher currentProfileId="mothership" />}
    >
      <MothershipConsole state={state} profile={mothershipProfile} />
    </AppShell>
  );
}
