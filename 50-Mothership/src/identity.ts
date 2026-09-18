/**
 * Identity (POA-BLD-001 S7) and Capability Enforcement (S8).
 * Role-level identity only (organizational identity + execution principal +
 * capability context) - no instance/session-level identity, consistent
 * with POA-EVT-001 S D's existing, deliberately unexpanded scope.
 */
import { generateIdentityKeyPair, type KeyPair } from "@/crypto";

export interface Organization {
  id: string;
  name: string;
}

export interface ExecutionPrincipal {
  id: string;
  organizationId: string;
  role: string;
  keys: KeyPair;
  active: boolean;
}

export class IdentityRegistry {
  private organizations = new Map<string, Organization>();
  private principals = new Map<string, ExecutionPrincipal>();
  private capabilities = new Map<string, Set<string>>();

  registerOrganization(id: string, name: string): Organization {
    const org: Organization = { id, name };
    this.organizations.set(id, org);
    return org;
  }

  registerPrincipal(id: string, organizationId: string, role: string): ExecutionPrincipal {
    if (!this.organizations.has(organizationId)) {
      throw new Error(`Unknown organization: ${organizationId}`);
    }
    const principal: ExecutionPrincipal = {
      id,
      organizationId,
      role,
      keys: generateIdentityKeyPair(),
      active: true,
    };
    this.principals.set(id, principal);
    return principal;
  }

  grantCapability(principalId: string, capability: string): void {
    const set = this.capabilities.get(principalId) ?? new Set<string>();
    set.add(capability);
    this.capabilities.set(principalId, set);
  }

  /** Key lifecycle / revocation (POA-DEC-SEC-001 S16). */
  revokePrincipal(principalId: string): void {
    const principal = this.principals.get(principalId);
    if (principal) principal.active = false;
  }

  getPrincipal(id: string): ExecutionPrincipal | undefined {
    return this.principals.get(id);
  }

  getOrganization(id: string): Organization | undefined {
    return this.organizations.get(id);
  }

  hasCapability(principalId: string, capability: string): boolean {
    return this.capabilities.get(principalId)?.has(capability) ?? false;
  }
}

export interface AuthorizationDecision {
  granted: boolean;
  principalId: string;
  organizationId: string;
  capability: string;
  reason:
    | "AUTHORIZED"
    | "UNKNOWN_IDENTITY"
    | "IDENTITY_REVOKED"
    | "ORGANIZATION_MISMATCH"
    | "CAPABILITY_NOT_GRANTED";
}

/**
 * Identity + Organization + Requested Capability -> Authorization Decision
 * (POA-BLD-001 S8). A rejected request must not silently execute - callers
 * (runtime.ts) always record this decision as evidence before acting on it.
 */
export function evaluateAuthorization(
  registry: IdentityRegistry,
  principalId: string,
  organizationId: string,
  capability: string,
): AuthorizationDecision {
  const principal = registry.getPrincipal(principalId);
  if (!principal) {
    return { granted: false, principalId, organizationId, capability, reason: "UNKNOWN_IDENTITY" };
  }
  if (!principal.active) {
    return { granted: false, principalId, organizationId, capability, reason: "IDENTITY_REVOKED" };
  }
  if (principal.organizationId !== organizationId) {
    return { granted: false, principalId, organizationId, capability, reason: "ORGANIZATION_MISMATCH" };
  }
  if (!registry.hasCapability(principalId, capability)) {
    return { granted: false, principalId, organizationId, capability, reason: "CAPABILITY_NOT_GRANTED" };
  }
  return { granted: true, principalId, organizationId, capability, reason: "AUTHORIZED" };
}
