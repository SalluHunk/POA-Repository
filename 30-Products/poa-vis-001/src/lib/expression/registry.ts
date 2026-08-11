import type { ExpressionProfileId, OrganizationalVisualProfile } from "@/lib/expression/types";
import { mothershipProfile, networkGraphProfile, referenceProfile } from "@/lib/expression/profiles";

/**
 * The canonical list of available OrganizationalVisualProfiles (POA-VIS-003
 * MISSION 7, "Expression Engine"). Adding a future industry-specific
 * profile means adding one entry here plus its renderer under
 * src/components/expression/ — POA Core (src/lib/domain, src/lib/services,
 * src/lib/organizational-state, src/lib/alexis) never needs to change.
 */
export const EXPRESSION_PROFILES: Record<ExpressionProfileId, OrganizationalVisualProfile> = {
  "poa-reference": referenceProfile,
  "network-graph": networkGraphProfile,
  "mothership": mothershipProfile,
};

export function getExpressionProfile(id: ExpressionProfileId): OrganizationalVisualProfile {
  return EXPRESSION_PROFILES[id];
}

export function listExpressionProfiles(): OrganizationalVisualProfile[] {
  return Object.values(EXPRESSION_PROFILES);
}
