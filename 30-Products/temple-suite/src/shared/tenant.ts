/**
 * DGP-DEV-001 Phase B tenancy (implementation-level, not POA architecture):
 * TSAAS-TECH-001 and TSAAS-002 section 16 leave the multi-tenancy
 * escalation model RECOMMENDED/OPEN. This slice does not build
 * multi-tenant infrastructure -- it uses exactly one, clearly synthetic
 * tenant, and every authoritative record still carries a tenant
 * discriminator field so a future slice does not need a retrofit.
 */
export const SYNTHETIC_TENANT_ID = "tenant-synthetic-001";

export interface TenantScoped {
  tenantId: string;
}

export function assertSyntheticTenant(tenantId: string): void {
  if (tenantId !== SYNTHETIC_TENANT_ID) {
    throw new Error(
      "DGP-DEV-001 Phase B permits exactly one synthetic tenant: " +
        SYNTHETIC_TENANT_ID +
        ". Received: " +
        tenantId +
        ". Multi-tenant infrastructure is explicitly out of scope for this slice."
    );
  }
}
