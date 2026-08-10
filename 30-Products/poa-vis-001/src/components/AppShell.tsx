import type { ReactNode } from "react";
import type { HealthStatus } from "@/lib/domain/types";
import { StatusBadge } from "@/components/ui";

/**
 * Top-level chrome. The organization's name and overall health sit in the
 * header at all times — the user should never lose the "I am interacting
 * with my organization" frame (POA-VIS-001 FIRST PRINCIPLE).
 */
export function AppShell({
  organizationName,
  overallHealth,
  expressionSwitcher,
  children,
}: {
  organizationName: string;
  overallHealth: HealthStatus;
  /** Optional link to another OrganizationalVisualProfile (POA-VIS-003). Renders nothing when omitted — existing callers are unaffected. */
  expressionSwitcher?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-poa-bg text-poa-text">
      <header className="sticky top-0 z-10 border-b border-poa-border bg-poa-bg/95 backdrop-blur-none">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-poa-text-faint">POA</span>
            <span className="h-4 w-px bg-poa-border" aria-hidden />
            <span className="text-sm font-medium text-poa-text">{organizationName}</span>
          </div>
          <div className="flex items-center gap-4">
            {expressionSwitcher}
            <StatusBadge status={overallHealth} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
      <footer className="border-t border-poa-border px-6 py-4">
        <p className="mx-auto max-w-7xl font-mono text-[11px] text-poa-text-faint">
          POA-VIS-001 · Sprint Alpha vertical slice · demo organizational data
        </p>
      </footer>
    </div>
  );
}
