/**
 * Implementation-level audit log (DGP-DEV-001 Phase B). Per TSAAS-002
 * section 14 fourfold observability split, this is an APPLICATION-LEVEL
 * concern only -- it is not POA governance evidence and never writes to
 * any repository governance path (POA-ADR-001.md, mission completion
 * reports, GAP-REGISTER-001.md, etc). That boundary is absolute.
 */
export interface AuditRecord {
  id: string;
  module: "relationship-memory" | "events" | "dgp" | "seva-scheduling";
  action: string;
  recordId: string;
  tenantId: string;
  occurredAt: string;
}

const auditLog: AuditRecord[] = [];
let auditSeq = 0;

export function recordAudit(entry: Omit<AuditRecord, "id" | "occurredAt">): AuditRecord {
  const record: AuditRecord = {
    id: "audit-" + (++auditSeq),
    occurredAt: new Date().toISOString(),
    ...entry,
  };
  auditLog.push(record);
  return record;
}

export function getAuditLog(): readonly AuditRecord[] {
  return auditLog;
}

export function clearAuditLogForTests(): void {
  auditLog.length = 0;
}
