/**
 * Barrel export - the programmatic interface for the Mothership runtime
 * (POA-BLD-001 S21: "A CLI, test harness, or programmatic interface is
 * sufficient" - no UI). The test suite under test/ is the primary
 * operational proof; this file exists so an external caller has a single
 * import surface.
 */
export { MothershipRuntime, type RuntimeResult, type MissionResult } from "@/runtime";
export { type MissionState, type Mission } from "@/mission";
export { type Organization, type ExecutionPrincipal, type AuthorizationDecision, IdentityRegistry } from "@/identity";
export { type EvidenceEnvelope, type EvidencePayload, type VerificationResult } from "@/evidence";
export { type WitnessComparison } from "@/witness";
