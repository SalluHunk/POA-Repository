import type { AuthorizationDecisionRecord, Mission, MissionDetail } from "../api/types";

/**
 * Attention derivation - mirrors POA-MOTHERSHIP-EXPERIENCE-STATE-MODEL.md
 * §6's real severity tiers exactly. Nothing here is a generic priority
 * label; every tier is a named, already-computed real condition.
 * Tier 1 (integrity compromised) is not encountered in this MVP's seed
 * data and is included only so the ordering is complete, not simulated.
 */
export type AttentionTier = 1 | 2 | 3;

export interface AttentionItem {
  tier: AttentionTier;
  missionId: string;
  glyph: string;
  label: string;
}

export function deriveAttention(
  missions: Mission[],
  details: Map<string, MissionDetail>,
  decisions: AuthorizationDecisionRecord[],
): AttentionItem[] {
  const deniedMissionIds = new Set(decisions.filter((d) => !d.granted).map((d) => d.missionId));
  const items: AttentionItem[] = [];
  for (const m of missions) {
    const detail = details.get(m.id);
    if (!detail) continue;
    if (!detail.mission.chainVerified) {
      items.push({ tier: 1, missionId: m.id, glyph: "⛔", label: "Integrity compromised" });
      continue;
    }
    if (m.state === "Failed") {
      items.push({ tier: 2, missionId: m.id, glyph: "✕", label: "Failed" });
      continue;
    }
    if (deniedMissionIds.has(m.id)) {
      items.push({ tier: 2, missionId: m.id, glyph: "⛔", label: "Denied" });
      continue;
    }
    if (detail.witnessCode === "NO_CHECKPOINT") {
      items.push({ tier: 3, missionId: m.id, glyph: "○", label: "Unverified" });
    }
  }
  return items.sort((a, b) => a.tier - b.tier);
}
