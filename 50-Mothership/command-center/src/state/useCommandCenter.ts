import { useCallback, useEffect, useState } from "react";
import * as api from "../api/client";
import type {
  AuthorizationDecisionRecord,
  EvidenceEnvelope,
  Mission,
  MissionDetail,
  Principal,
  RuntimeResult,
} from "../api/types";
import { deriveAttention, type AttentionItem } from "./attention";

// Fixed for this MVP - org switching is explicitly out of scope
// (POA-MOTHERSHIP-MVP-DECISION-BRIEF.md §G).
export const ORGANIZATION_ID = "org-paravyoma";

export type Subject = { type: "mission"; id: string } | { type: "principal"; id: string } | { type: "people" } | null;
export type Depth = "presence" | "context" | "investigation";

export interface CommandCenterState {
  loading: boolean;
  error: string | null;
  missions: Mission[];
  principals: Principal[];
  capabilityPrincipals: (Principal & { capabilities: string[] })[];
  decisions: AuthorizationDecisionRecord[];
  missionDetails: Map<string, MissionDetail>;
  attention: AttentionItem[];
  subject: Subject;
  depth: Depth;
  evidence: EvidenceEnvelope[];
  actionPending: MissionActionKind | null;
  actionResult: RuntimeResult | null;
  overlayOpen: boolean;
  lookupError: string | null;
}

export type MissionActionKind = { kind: "transition"; to: string } | { kind: "authorize"; capability: string; action: string };

export function useCommandCenter() {
  const [state, setState] = useState<CommandCenterState>({
    loading: true,
    error: null,
    missions: [],
    principals: [],
    capabilityPrincipals: [],
    decisions: [],
    missionDetails: new Map(),
    attention: [],
    subject: null,
    depth: "presence",
    evidence: [],
    actionPending: null,
    actionResult: null,
    overlayOpen: false,
    lookupError: null,
  });

  const loadPresence = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [{ missions }, { principals, decisions }] = await Promise.all([
        api.listMissions(ORGANIZATION_ID),
        api.getCapabilityView(ORGANIZATION_ID),
      ]);
      const details = new Map<string, MissionDetail>();
      await Promise.all(
        missions.map(async (m) => {
          const detail = await api.getMissionDetail(m.id, ORGANIZATION_ID);
          details.set(m.id, detail);
        }),
      );
      setState((s) => ({
        ...s,
        loading: false,
        missions,
        principals,
        capabilityPrincipals: principals,
        decisions,
        missionDetails: details,
        attention: deriveAttention(missions, details, decisions),
      }));
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e instanceof Error ? e.message : String(e) }));
    }
  }, []);

  useEffect(() => {
    void loadPresence();
  }, [loadPresence]);

  const focusMission = useCallback(async (missionId: string) => {
    const detail = await api.getMissionDetail(missionId, ORGANIZATION_ID);
    setState((s) => ({
      ...s,
      subject: { type: "mission", id: missionId },
      depth: "context",
      evidence: [],
      actionResult: null,
      missionDetails: new Map(s.missionDetails).set(missionId, detail),
    }));
  }, []);

  const focusPrincipal = useCallback((principalId: string) => {
    setState((s) => ({ ...s, subject: { type: "principal", id: principalId }, depth: "context", actionResult: null }));
  }, []);

  // People domain orb - navigates to the real principal roster (not a
  // narrative overlay). Reuses the same subject/depth mechanism as
  // focusMission/focusPrincipal so it converges on the identical Focus
  // architecture rather than a parallel navigation model.
  const focusPeople = useCallback(() => {
    setState((s) => ({ ...s, subject: { type: "people" }, depth: "context", actionResult: null }));
  }, []);

  const drillInvestigate = useCallback(async () => {
    if (state.subject?.type !== "mission") return;
    const { evidence } = await api.getMissionEvidence(state.subject.id, ORGANIZATION_ID);
    setState((s) => ({ ...s, depth: "investigation", evidence }));
  }, [state.subject]);

  const returnTo = useCallback((depth: Depth) => {
    setState((s) => ({ ...s, depth, subject: depth === "presence" ? null : s.subject, actionResult: null }));
  }, []);

  const requestAction = useCallback((kind: MissionActionKind) => {
    setState((s) => ({ ...s, actionPending: kind }));
  }, []);

  const cancelAction = useCallback(() => {
    setState((s) => ({ ...s, actionPending: null }));
  }, []);

  // Confirm -> Act -> re-fetch Verify explicitly (S7 -> S8 -> S9). The API
  // has no push/subscribe mechanism (State Model §2), so Verification must
  // be an explicit re-fetch after the action resolves, never assumed.
  const confirmAction = useCallback(
    async (principalId: string) => {
      if (state.subject?.type !== "mission" || !state.actionPending) return;
      const missionId = state.subject.id;
      const result =
        state.actionPending.kind === "transition"
          ? await api.transitionMission(missionId, ORGANIZATION_ID, state.actionPending.to, principalId)
          : await api.authorizeAndExecute(
              missionId,
              ORGANIZATION_ID,
              principalId,
              state.actionPending.capability,
              state.actionPending.action,
            );

      await api.checkpointMission(missionId, ORGANIZATION_ID);
      const [detail, { evidence }] = await Promise.all([
        api.getMissionDetail(missionId, ORGANIZATION_ID),
        api.getMissionEvidence(missionId, ORGANIZATION_ID),
      ]);

      setState((s) => ({
        ...s,
        actionPending: null,
        actionResult: result,
        evidence,
        missionDetails: new Map(s.missionDetails).set(missionId, detail),
      }));

      // Presence's attention field must reflect the real, changed state -
      // never left stale after a confirmed action.
      void loadPresence();
    },
    [state.subject, state.actionPending, loadPresence],
  );

  const toggleOverlay = useCallback(() => {
    setState((s) => ({ ...s, overlayOpen: !s.overlayOpen }));
  }, []);

  // Structured lookup only - resolves a typed real ID to a real Focus.
  // No natural-language understanding exists; see the completion report.
  const lookup = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      if (state.missions.some((m) => m.id === trimmed)) {
        await focusMission(trimmed);
        setState((s) => ({ ...s, lookupError: null }));
        return;
      }
      if (state.principals.some((p) => p.id === trimmed)) {
        focusPrincipal(trimmed);
        setState((s) => ({ ...s, lookupError: null }));
        return;
      }
      setState((s) => ({ ...s, lookupError: `No mission or principal named "${trimmed}" in this organization.` }));
    },
    [state.missions, state.principals, focusMission, focusPrincipal],
  );

  return { state, actions: { focusMission, focusPrincipal, focusPeople, drillInvestigate, returnTo, requestAction, cancelAction, confirmAction, toggleOverlay, lookup } };
}
