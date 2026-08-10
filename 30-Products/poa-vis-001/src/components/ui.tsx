/**
 * Shared visual primitives for the Mission Console (POA-VIS-001 VISUAL DNA:
 * executive clarity, restrained motion, no gradients/glassmorphism).
 */

import type { ReactNode } from "react";
import type { HealthStatus } from "@/lib/domain/types";

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`poa-enter rounded-lg border border-poa-border bg-poa-panel p-5 ${className}`}
    >
      {(title || eyebrow || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="font-mono text-[11px] uppercase tracking-widest text-poa-text-faint">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="mt-1 text-sm font-medium text-poa-text">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

const HEALTH_COLOR: Record<HealthStatus, string> = {
  healthy: "bg-poa-healthy",
  attention: "bg-poa-attention",
  "at-risk": "bg-poa-at-risk",
};

const HEALTH_LABEL: Record<HealthStatus, string> = {
  healthy: "Healthy",
  attention: "Needs Attention",
  "at-risk": "At Risk",
};

export function StatusDot({ status, className = "" }: { status: HealthStatus; className?: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${HEALTH_COLOR[status]} ${className}`} aria-hidden />;
}

export function StatusBadge({ status }: { status: HealthStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-poa-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-poa-text-muted">
      <StatusDot status={status} />
      {HEALTH_LABEL[status]}
    </span>
  );
}

const SEVERITY_COLOR: Record<string, string> = {
  info: "text-poa-accent",
  low: "text-poa-healthy",
  medium: "text-poa-attention",
  high: "text-poa-attention",
  critical: "text-poa-at-risk",
};

export function SeverityLabel({ severity }: { severity: "info" | "low" | "medium" | "high" | "critical" }) {
  return (
    <span className={`font-mono text-[11px] font-semibold uppercase tracking-wide ${SEVERITY_COLOR[severity]}`}>
      {severity}
    </span>
  );
}
