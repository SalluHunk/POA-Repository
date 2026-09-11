/**
 * DGP-DEV-009: a tenant guard SCOPED TO THIS PERSISTENCE EXPERIMENT ONLY.
 *
 * `shared/tenant.ts`'s `assertSyntheticTenant` is deliberately left
 * untouched -- it still permits exactly one tenant
 * (`SYNTHETIC_TENANT_ID`), which is what every existing in-memory test
 * (36/36, DGP-DEV-001 through 008) already relies on. Loosening it to
 * accept two tenants would silently change the meaning of the tenant
 * boundary for the entire existing architecture-proving evidence chain,
 * not just this slice -- exactly the kind of "redesign the application
 * architecture merely to introduce persistence" mission section 11
 * prohibits.
 *
 * The persistence experiment's own two-tenant isolation proof (mission
 * section 3C, Test E/F) needs a second tenant that does not exist
 * anywhere else in this codebase. This is a bounded, mission-local
 * implementation decision, not a change to the existing single-tenant
 * architecture.
 */
export const PERSISTENCE_EXPERIMENT_TENANT_A = "tenant-synthetic-a";
export const PERSISTENCE_EXPERIMENT_TENANT_B = "tenant-synthetic-b";

const ALLOWED_TENANTS: ReadonlySet<string> = new Set([
  PERSISTENCE_EXPERIMENT_TENANT_A,
  PERSISTENCE_EXPERIMENT_TENANT_B,
]);

export function assertPersistenceExperimentTenant(tenantId: string): void {
  if (!ALLOWED_TENANTS.has(tenantId)) {
    throw new Error(
      "DGP-DEV-009 permits exactly two synthetic tenants for its isolation proof: " +
        PERSISTENCE_EXPERIMENT_TENANT_A +
        ", " +
        PERSISTENCE_EXPERIMENT_TENANT_B +
        ". Received: " +
        tenantId +
        "."
    );
  }
}
