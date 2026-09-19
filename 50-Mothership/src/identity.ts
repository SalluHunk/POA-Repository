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
  /**
   * Execution-engine neutrality (POA-BLD-002 S17): which engine this
   * principal's actions are actually carried out by ("claude", "codex",
   * "gemini", "human", etc). Optional/defaulted so no existing call site
   * or test (which never passes it) changes behavior. This is the minimum
   * abstraction requested by the brief - it is a label on an already-
   * existing principal, not a new adapter or execution contract.
   */
  engine: string;
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

  registerPrincipal(id: string, organizationId: string, role: string, engine = "unspecified"): ExecutionPrincipal {
    if (!this.organizations.has(organizationId)) {
      throw new Error(`Unknown organization: ${organizationId}`);
    }
    const principal: ExecutionPrincipal = {
      id,
      organizationId,
      role,
      keys: generateIdentityKeyPair(),
      active: true,
      engine,
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

  /** Read-only enumeration for the Control Panel (POA-BLD-002 S5/S9). */
  listOrganizations(): Organization[] {
    return [...this.organizations.values()];
  }

  /** Scoped to one organization - never returns another organization's principals. */
  listPrincipals(organizationId: string): ExecutionPrincipal[] {
    return [...this.principals.values()].filter((p) => p.organizationId === organizationId);
  }

  listCapabilities(principalId: string): string[] {
    return [...(this.capabilities.get(principalId) ?? new Set<string>())];
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
