import { getOrganizationalState } from "@/lib/organizational-state";
import { AppShell } from "@/components/AppShell";
import { MissionConsole } from "@/components/MissionConsole";

export default function Home() {
  const state = getOrganizationalState();

  return (
    <AppShell organizationName={state.organization.name} overallHealth={state.overallHealth}>
      <MissionConsole state={state} />
    </AppShell>
  );
}
