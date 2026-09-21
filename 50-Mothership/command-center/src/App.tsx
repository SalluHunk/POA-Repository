import { Presence } from "./components/Presence";
import { MissionFocus } from "./components/MissionFocus";
import { MissionInvestigate } from "./components/MissionInvestigate";
import { ActionConfirm } from "./components/ActionConfirm";
import { ActionResult } from "./components/ActionResult";
import { PrincipalFocus } from "./components/PrincipalFocus";
import { CommandOverlay } from "./components/CommandOverlay";
import { useCommandCenter } from "./state/useCommandCenter";

export function App() {
  const { state, actions } = useCommandCenter();
  const { subject, depth } = state;

  const focusedMissionId = subject?.type === "mission" ? subject.id : null;
  const focusedMissionDetail = focusedMissionId ? state.missionDetails.get(focusedMissionId) : undefined;
  const focusedPrincipalWithCaps = subject?.type === "principal" ? state.capabilityPrincipals.find((p) => p.id === subject.id) : undefined;

  return (
    <div className="depth-environment" style={{ minHeight: "100%", position: "relative" }}>
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={actions.toggleOverlay}
            aria-label="Open command overlay"
            style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.05)", border: "1px solid var(--border-2)", color: "var(--text)", cursor: "pointer" }}
          >
            ☰
          </button>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--text-faint)" }}>
            POA MOTHERSHIP
          </span>
          <span style={{ color: "var(--text-faint)" }}>·</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>
            Paravyoma
          </span>
        </div>
      </header>

      <main style={{ paddingTop: 96, paddingBottom: 48 }}>
        {depth === "presence" && (
          <Presence
            missions={state.missions}
            missionDetails={state.missionDetails}
            attention={state.attention}
            loading={state.loading}
            error={state.error}
            lookupError={state.lookupError}
            onFocusMission={(id) => void actions.focusMission(id)}
            onLookup={(q) => void actions.lookup(q)}
          />
        )}

        {depth === "context" && subject?.type === "mission" && (
          <>
            {state.actionResult && <ActionResult result={state.actionResult} detail={focusedMissionDetail} />}
            {state.actionPending ? (
              <ActionConfirm
                missionId={subject.id}
                action={state.actionPending}
                principals={state.principals.filter((p) => p.active)}
                onConfirm={(pid) => void actions.confirmAction(pid)}
                onCancel={actions.cancelAction}
              />
            ) : (
              <MissionFocus
                missionId={subject.id}
                detail={focusedMissionDetail}
                onDrill={() => void actions.drillInvestigate()}
                onRequestTransition={(to) => actions.requestAction({ kind: "transition", to })}
                onReturn={() => actions.returnTo("presence")}
              />
            )}
          </>
        )}

        {depth === "investigation" && subject?.type === "mission" && (
          <MissionInvestigate
            missionId={subject.id}
            evidence={state.evidence}
            chainVerified={focusedMissionDetail?.mission.chainVerified ?? true}
            onReturn={() => actions.returnTo("context")}
          />
        )}

        {depth === "context" && subject?.type === "principal" && (
          <PrincipalFocus
            principal={focusedPrincipalWithCaps}
            capabilities={focusedPrincipalWithCaps?.capabilities ?? []}
            decisions={state.decisions}
            onReturn={() => actions.returnTo("presence")}
          />
        )}
      </main>

      <CommandOverlay
        open={state.overlayOpen}
        onClose={actions.toggleOverlay}
        onCommandCenter={() => actions.returnTo("presence")}
        onFocusLookup={() => actions.returnTo("presence")}
      />
    </div>
  );
}
